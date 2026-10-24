"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const nodemailer_1 = __importDefault(require("nodemailer"));
const format_1 = require("../../common/utils/format");
const actor_1 = require("../../common/utils/actor");
const notification_schema_1 = require("./notification.schema");
let NotificationService = NotificationService_1 = class NotificationService {
    notificationModel;
    config;
    logger = new common_1.Logger(NotificationService_1.name);
    transporter = null;
    constructor(notificationModel, config) {
        this.notificationModel = notificationModel;
        this.config = config;
    }
    async send(payload) {
        const channels = payload.channels && payload.channels.length > 0 ? payload.channels : ['IN_APP'];
        const records = [];
        if (channels.includes('IN_APP')) {
            records.push(await this.createInApp(payload));
        }
        for (const channel of channels.filter((item) => item !== 'IN_APP')) {
            const recipient = channel === 'EMAIL' ? payload.recipient?.email : payload.recipient?.phone;
            if (!recipient) {
                records.push(await this.createRecord(payload, channel, 'SKIPPED', recipient ?? null, {
                    reason: `No ${channel.toLowerCase()} recipient configured.`,
                }));
                continue;
            }
            const record = await this.createRecord(payload, channel, 'QUEUED', recipient);
            records.push(await this.deliver(record.id));
        }
        return records;
    }
    async listForUser(userId, role, query) {
        const filter = {
            channel: 'IN_APP',
            $or: [{ userId: new mongoose_2.Types.ObjectId(userId) }, ...(role ? [{ role }] : [])],
        };
        if (query.unreadOnly)
            filter.readAt = null;
        if (query.status)
            filter.status = query.status;
        return this.paginate(filter, query);
    }
    async outbox(query) {
        const filter = {};
        if (query.channel)
            filter.channel = query.channel;
        if (query.status)
            filter.status = query.status;
        if (query.q) {
            const regex = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [{ title: regex }, { body: regex }, { recipient: regex }];
        }
        return this.paginate(filter, query);
    }
    async markRead(id, userId, role) {
        const notification = await this.notificationModel
            .findOne({
            _id: id,
            channel: 'IN_APP',
            $or: [{ userId: new mongoose_2.Types.ObjectId(userId) }, ...(role ? [{ role }] : [])],
        })
            .exec();
        if (!notification)
            throw new common_1.NotFoundException('Notification not found.');
        notification.readAt = new Date();
        await notification.save();
        return this.toDto(notification);
    }
    async markAllRead(userId, role) {
        const result = await this.notificationModel
            .updateMany({
            channel: 'IN_APP',
            readAt: null,
            $or: [{ userId: new mongoose_2.Types.ObjectId(userId) }, ...(role ? [{ role }] : [])],
        }, { $set: { readAt: new Date() } })
            .exec();
        return { updated: result.modifiedCount };
    }
    async retry(id) {
        const notification = await this.notificationModel.findById(id).exec();
        if (!notification)
            throw new common_1.NotFoundException('Notification not found.');
        if (notification.channel === 'IN_APP') {
            return this.toDto(notification);
        }
        notification.status = 'QUEUED';
        notification.lastError = null;
        await notification.save();
        return this.deliver(id);
    }
    async deliver(id) {
        const notification = await this.notificationModel.findById(id).exec();
        if (!notification)
            throw new common_1.NotFoundException('Notification not found.');
        if (notification.channel === 'IN_APP' || notification.status === 'SENT') {
            return this.toDto(notification);
        }
        notification.status = 'SENDING';
        notification.attempts += 1;
        await notification.save();
        try {
            const result = await this.dispatch(notification);
            notification.status = 'SENT';
            notification.sentAt = new Date();
            notification.deliveredAt = new Date();
            notification.provider = result.provider;
            notification.providerMessageId = result.messageId;
            notification.lastError = null;
            await notification.save();
            return this.toDto(notification);
        }
        catch (error) {
            notification.status = 'FAILED';
            notification.lastError = error instanceof Error ? error.message : 'Delivery failed.';
            await notification.save();
            this.logger.warn({ err: error, channel: notification.channel, notificationId: id }, 'Notification delivery failed.');
            return this.toDto(notification);
        }
    }
    async createInApp(payload) {
        const doc = new this.notificationModel({
            channel: 'IN_APP',
            status: 'SENT',
            type: payload.type,
            title: payload.title,
            body: payload.body,
            userId: payload.userId ? new mongoose_2.Types.ObjectId(payload.userId) : null,
            role: payload.role ?? null,
            entityType: payload.entityType ?? (payload.caseId ? 'Case' : null),
            entityId: payload.entityId ?? payload.caseId ?? null,
            caseId: payload.caseId ?? null,
            recipient: payload.userId ?? payload.role ?? null,
            provider: 'in-app',
            attempts: 1,
            sentAt: new Date(),
            metadata: { ...(payload.metadata ?? {}) },
        });
        await doc.save();
        return this.toDto(doc);
    }
    async createRecord(payload, channel, status, recipient, metadata = {}) {
        const doc = new this.notificationModel({
            channel,
            status,
            type: payload.type,
            title: payload.title,
            body: payload.body,
            userId: payload.userId ? new mongoose_2.Types.ObjectId(payload.userId) : null,
            role: payload.role ?? null,
            entityType: payload.entityType ?? (payload.caseId ? 'Case' : null),
            entityId: payload.entityId ?? payload.caseId ?? null,
            caseId: payload.caseId ?? null,
            recipient,
            attempts: 0,
            metadata: { ...(payload.metadata ?? {}), ...metadata },
        });
        await doc.save();
        return this.toDto(doc);
    }
    async dispatch(notification) {
        const live = this.config.get('NOTIFICATIONS_MODE') === 'live';
        if (!live) {
            return {
                provider: 'outbox',
                messageId: `outbox-${notification._id.toString()}`,
            };
        }
        switch (notification.channel) {
            case 'EMAIL':
                return this.sendEmail(notification);
            case 'SMS':
                return this.sendSms(notification);
            case 'WHATSAPP':
                return this.sendWhatsApp(notification);
            default:
                return { provider: 'in-app', messageId: notification._id.toString() };
        }
    }
    async sendEmail(notification) {
        const provider = this.config.get('EMAIL_PROVIDER');
        if (provider !== 'smtp' && provider !== 'resend') {
            return { provider: 'outbox', messageId: `outbox-${notification._id.toString()}` };
        }
        const isResend = provider === 'resend';
        const host = isResend ? 'smtp.resend.com' : this.config.get('SMTP_HOST');
        const port = isResend
            ? (this.config.get('SMTP_PORT') ?? 465)
            : (this.config.get('SMTP_PORT') ?? 587);
        const secure = isResend
            ? (this.config.get('SMTP_SECURE') ?? (port === 465))
            : (this.config.get('SMTP_SECURE') ?? false);
        const user = isResend ? 'resend' : this.config.get('SMTP_USER');
        const pass = isResend
            ? (this.config.get('RESEND_API_KEY') ?? this.config.get('SMTP_PASS'))
            : this.config.get('SMTP_PASS');
        this.transporter ??= nodemailer_1.default.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
        });
        const result = await this.transporter.sendMail({
            from: this.config.get('EMAIL_FROM'),
            to: notification.recipient ?? undefined,
            subject: notification.title,
            text: notification.body,
            html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h2>${escapeHtml(notification.title)}</h2><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(notification.body)}</p><hr><p style="color:#777;font-size:12px">Histopathology LIMS</p></div>`,
        });
        return { provider: isResend ? 'resend' : 'smtp', messageId: result.messageId ?? null };
    }
    async sendSms(notification) {
        const provider = this.config.get('SMS_PROVIDER') ?? 'log';
        if (provider === 'termii') {
            const apiKey = this.config.get('TERMII_API_KEY');
            if (!apiKey)
                throw new Error('TERMII_API_KEY is not configured.');
            const response = await fetch('https://api.ng.termii.com/api/sms/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    to: notification.recipient,
                    from: this.config.get('TERMII_SENDER_ID') ?? 'HISTOLIMS',
                    sms: notification.body,
                    type: 'plain',
                    channel: 'generic',
                    api_key: apiKey,
                }),
            });
            if (!response.ok)
                throw new Error(`Termii returned ${response.status}.`);
            const body = (await response.json());
            return { provider: 'termii', messageId: body.message_id ?? null };
        }
        if (provider === 'twilio') {
            return this.sendTwilio(notification.recipient ?? '', notification.body, false);
        }
        return { provider: 'outbox', messageId: `outbox-${notification._id.toString()}` };
    }
    async sendWhatsApp(notification) {
        return this.sendTwilio(notification.recipient ?? '', notification.body, true);
    }
    async sendTwilio(to, body, whatsapp) {
        const sid = this.config.get('TWILIO_ACCOUNT_SID');
        const token = this.config.get('TWILIO_AUTH_TOKEN');
        const from = whatsapp
            ? this.config.get('TWILIO_WHATSAPP_FROM')
            : this.config.get('TWILIO_FROM_NUMBER');
        if (!sid || !token || !from) {
            throw new Error('Twilio credentials are incomplete.');
        }
        const form = new URLSearchParams({
            To: whatsapp ? `whatsapp:${to}` : to,
            From: whatsapp ? `whatsapp:${from}` : from,
            Body: body,
        });
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: form,
        });
        if (!response.ok)
            throw new Error(`Twilio returned ${response.status}.`);
        const result = (await response.json());
        return { provider: whatsapp ? 'twilio-whatsapp' : 'twilio-sms', messageId: result.sid ?? null };
    }
    async paginate(filter, query) {
        const [documents, total] = await Promise.all([
            this.notificationModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.notificationModel.countDocuments(filter).exec(),
        ]);
        return (0, format_1.buildPaginated)(documents.map((document) => this.toDto(document)), total, query.page, query.limit);
    }
    toDto(doc) {
        return {
            id: doc._id.toString(),
            channel: doc.channel,
            status: doc.status,
            type: doc.type,
            title: doc.title,
            body: doc.body,
            recipient: doc.recipient ?? null,
            provider: doc.provider ?? null,
            attempts: doc.attempts ?? 0,
            lastError: doc.lastError ?? null,
            caseId: doc.caseId ?? null,
            entityType: doc.entityType ?? null,
            entityId: doc.entityId ?? null,
            readAt: doc.readAt ? doc.readAt.toISOString() : null,
            sentAt: doc.sentAt ? doc.sentAt.toISOString() : null,
            createdAt: doc.createdAt.toISOString(),
            metadata: (doc.metadata ?? {}),
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(notification_schema_1.NotificationModelName)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        config_1.ConfigService])
], NotificationService);
function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}
void actor_1.currentActor;
//# sourceMappingURL=notification.service.js.map