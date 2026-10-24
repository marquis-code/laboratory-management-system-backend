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
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const node_crypto_1 = require("node:crypto");
const tenant_context_1 = require("../../common/context/tenant-context");
const format_1 = require("../../common/utils/format");
const crypto_1 = require("../../common/utils/crypto");
const transaction_1 = require("../../common/utils/transaction");
const audit_service_1 = require("../../core/audit/audit.service");
const case_schema_1 = require("../../core/cases/case.schema");
const labs_service_1 = require("../../core/labs/labs.service");
const patient_schema_1 = require("../../core/patients/patient.schema");
const invoice_schema_1 = require("./invoice.schema");
const payment_schema_1 = require("./payment.schema");
let BillingService = BillingService_1 = class BillingService {
    connection;
    invoiceModel;
    paymentModel;
    caseModel;
    patientModel;
    labs;
    audit;
    config;
    logger = new common_1.Logger(BillingService_1.name);
    constructor(connection, invoiceModel, paymentModel, caseModel, patientModel, labs, audit, config) {
        this.connection = connection;
        this.invoiceModel = invoiceModel;
        this.paymentModel = paymentModel;
        this.caseModel = caseModel;
        this.patientModel = patientModel;
        this.labs = labs;
        this.audit = audit;
        this.config = config;
    }
    async create(dto, user) {
        const caseDoc = await this.caseModel.findById(dto.caseId).exec();
        if (!caseDoc)
            throw new common_1.NotFoundException('Case not found.');
        if (dto.payerType === 'HMO' && !dto.hmoName?.trim()) {
            throw new common_1.BadRequestException('HMO name is required for an HMO invoice.');
        }
        const items = dto.items.map((item) => {
            const total = round(item.quantity * item.unitPrice);
            return {
                description: item.description.trim(),
                quantity: item.quantity,
                unitPrice: round(item.unitPrice),
                total,
                category: item.category?.trim() || 'PROFESSIONAL',
            };
        });
        const subtotal = round(items.reduce((sum, item) => sum + item.total, 0));
        const discount = round(dto.discount ?? 0);
        if (discount > subtotal)
            throw new common_1.BadRequestException('Discount cannot exceed the subtotal.');
        const total = round(subtotal - discount);
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const year = new Date().getUTCFullYear();
            const sequence = await this.labs.nextSequence(user.labId, `invoice-${year}`, session);
            const number = `INV-${year}-${String(sequence).padStart(6, '0')}`;
            const now = new Date();
            const invoice = new this.invoiceModel({
                number,
                caseId: caseDoc._id,
                patientId: caseDoc.patientId,
                payerType: dto.payerType,
                hmoName: dto.hmoName?.trim() || null,
                hmoCode: dto.hmoCode?.trim() || null,
                authorizationNumber: dto.authorizationNumber?.trim() || null,
                status: 'ISSUED',
                currency: (dto.currency ?? 'NGN').toUpperCase(),
                items,
                subtotal,
                discount,
                total,
                amountPaid: 0,
                balance: total,
                dueAt: dto.dueAt ? new Date(dto.dueAt) : new Date(now.getTime() + 14 * 86_400_000),
                issuedAt: now,
                notes: dto.notes?.trim() || null,
                createdBy: new mongoose_2.Types.ObjectId(user.id),
            });
            await invoice.save({ session });
            await this.audit.record({
                action: 'CREATE',
                entityType: 'Invoice',
                entityId: invoice._id.toString(),
                caseId: caseDoc._id.toString(),
                after: { number, total, payerType: invoice.payerType },
                metadata: { hmoName: invoice.hmoName },
            }, session);
            return this.toInvoice(invoice, caseDoc);
        });
    }
    async list(query) {
        const filter = {};
        if (query.status)
            filter.status = query.status;
        if (query.payerType)
            filter.payerType = query.payerType;
        if (query.from || query.to) {
            const range = {};
            if (query.from)
                range.$gte = new Date(`${query.from}T00:00:00.000Z`);
            if (query.to)
                range.$lte = new Date(`${query.to}T23:59:59.999Z`);
            filter.issuedAt = range;
        }
        if (query.q) {
            const regex = new RegExp(query.q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
            filter.$or = [{ number: regex }, { hmoName: regex }, { authorizationNumber: regex }];
        }
        const [invoices, total] = await Promise.all([
            this.invoiceModel
                .find(filter)
                .sort({ issuedAt: -1, createdAt: -1 })
                .skip((query.page - 1) * query.limit)
                .limit(query.limit)
                .exec(),
            this.invoiceModel.countDocuments(filter).exec(),
        ]);
        const items = await Promise.all(invoices.map((invoice) => this.toInvoice(invoice)));
        return (0, format_1.buildPaginated)(items, total, query.page, query.limit);
    }
    async forCase(caseId) {
        const invoices = await this.invoiceModel.find({ caseId }).sort({ createdAt: -1 }).exec();
        return Promise.all(invoices.map((invoice) => this.toInvoice(invoice)));
    }
    async initializePayment(invoiceId, dto, user) {
        if (dto.provider !== 'PAYSTACK' && dto.provider !== 'FLUTTERWAVE') {
            throw new common_1.BadRequestException('Use the manual payment endpoint for cash, transfer or HMO.');
        }
        const invoice = await this.invoiceModel.findById(invoiceId).exec();
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found.');
        if (invoice.status === 'PAID' || invoice.status === 'VOID') {
            throw new common_1.ConflictException('This invoice cannot accept a payment.');
        }
        const amount = round(dto.amount ?? invoice.balance);
        if (amount <= 0 || amount > invoice.balance) {
            throw new common_1.BadRequestException('Payment amount must be within the outstanding balance.');
        }
        const patient = await this.patientModel.findById(invoice.patientId).exec();
        const reference = (0, crypto_1.makeBarcode)('PAY');
        const mode = this.config.get('PAYMENTS_MODE') ?? 'mock';
        let checkoutUrl;
        let providerReference = null;
        let metadata = { mode };
        if (mode === 'mock') {
            checkoutUrl = `${this.config.get('PUBLIC_WEB_URL')}/payments/mock?reference=${encodeURIComponent(reference)}`;
        }
        else if (dto.provider === 'PAYSTACK') {
            const result = await this.paystackInitialize(invoice, amount, reference, patient);
            checkoutUrl = result.authorizationUrl;
            providerReference = result.reference;
            metadata = { ...metadata, providerResponse: result.raw };
        }
        else {
            const result = await this.flutterwaveInitialize(invoice, amount, reference, patient);
            checkoutUrl = result.link;
            providerReference = result.reference;
            metadata = { ...metadata, providerResponse: result.raw };
        }
        const payment = new this.paymentModel({
            invoiceId: invoice._id,
            provider: dto.provider,
            status: 'PENDING',
            amount,
            currency: invoice.currency,
            reference,
            providerReference,
            checkoutUrl,
            metadata,
            createdBy: new mongoose_2.Types.ObjectId(user.id),
        });
        await payment.save();
        await this.audit.record({
            action: 'PAYMENT',
            entityType: 'Invoice',
            entityId: invoice._id.toString(),
            caseId: invoice.caseId.toString(),
            after: { event: 'initialized', reference, amount, provider: dto.provider },
        });
        return this.toPayment(payment);
    }
    async manualPayment(invoiceId, dto, user) {
        return (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const invoice = await this.invoiceModel.findById(invoiceId).session(session).exec();
            if (!invoice)
                throw new common_1.NotFoundException('Invoice not found.');
            if (invoice.status === 'PAID' || invoice.status === 'VOID') {
                throw new common_1.ConflictException('This invoice cannot accept a payment.');
            }
            if (dto.amount > invoice.balance) {
                throw new common_1.BadRequestException('Payment exceeds the outstanding balance.');
            }
            const reference = (0, crypto_1.makeBarcode)('PAY');
            const payment = new this.paymentModel({
                invoiceId: invoice._id,
                provider: dto.provider,
                status: 'SUCCESS',
                amount: round(dto.amount),
                currency: invoice.currency,
                reference,
                providerReference: dto.reference.trim(),
                checkoutUrl: null,
                paidAt: new Date(),
                metadata: { note: dto.note ?? null, recordedBy: user.email },
                createdBy: new mongoose_2.Types.ObjectId(user.id),
            });
            await payment.save({ session });
            await this.allocate(invoice._id.toString(), round(dto.amount), reference, session);
            return this.toPayment(payment);
        });
    }
    async listPayments(invoiceId) {
        const payments = await this.paymentModel.find({ invoiceId }).sort({ createdAt: -1 }).exec();
        return payments.map((payment) => this.toPayment(payment));
    }
    async getPayment(reference) {
        const located = await this.locatePayment(reference);
        return (0, tenant_context_1.runWithTenant)({ labId: located.labId }, async () => {
            const invoice = await this.invoiceModel.findById(located.payment.invoiceId).exec();
            return {
                reference: located.payment.reference,
                status: located.payment.status,
                amount: located.payment.amount,
                currency: located.payment.currency,
                checkoutUrl: located.payment.checkoutUrl,
                invoiceNumber: invoice?.number ?? null,
                balance: invoice?.balance ?? null,
            };
        });
    }
    async completeMock(reference) {
        if ((this.config.get('PAYMENTS_MODE') ?? 'mock') !== 'mock') {
            throw new common_1.ForbiddenException('Mock payments are disabled.');
        }
        const located = await this.locatePayment(reference);
        await (0, tenant_context_1.runWithTenant)({ labId: located.labId }, () => this.markSuccess(reference, located.payment.amount, located.payment.reference, 'mock'));
        return this.getPayment(reference);
    }
    async paystackWebhook(rawBody, signature, event) {
        const secret = this.config.get('PAYSTACK_SECRET_KEY');
        if (!secret)
            throw new common_1.ForbiddenException('Paystack webhooks are not configured.');
        const expected = (0, node_crypto_1.createHmac)('sha512', secret).update(rawBody).digest('hex');
        if (!signature || !safeEqual(signature, expected)) {
            throw new common_1.ForbiddenException('Invalid Paystack signature.');
        }
        const data = asRecord(event.data);
        if (event.event === 'charge.success' && typeof data.reference === 'string') {
            const amount = Number(data.amount) / 100;
            const located = await this.locatePayment(data.reference);
            await (0, tenant_context_1.runWithTenant)({ labId: located.labId }, () => this.markSuccess(data.reference, amount, String(data.id ?? data.reference), 'paystack'));
        }
        return { received: true };
    }
    async flutterwaveWebhook(signature, payload) {
        const hash = this.config.get('FLUTTERWAVE_WEBHOOK_HASH');
        if (!hash)
            throw new common_1.ForbiddenException('Flutterwave webhooks are not configured.');
        if (!signature || !safeEqual(signature, hash)) {
            throw new common_1.ForbiddenException('Invalid Flutterwave webhook hash.');
        }
        const data = asRecord(payload.data);
        if (String(payload.event ?? payload['event.type'] ?? '').includes('charge') || data.tx_ref) {
            if (typeof data.tx_ref === 'string' &&
                ['successful', 'success'].includes(String(data.status))) {
                const located = await this.locatePayment(data.tx_ref);
                await (0, tenant_context_1.runWithTenant)({ labId: located.labId }, () => this.markSuccess(data.tx_ref, Number(data.amount), String(data.id ?? data.tx_ref), 'flutterwave'));
            }
        }
        return { received: true };
    }
    async exportClaims(query) {
        const filter = {
            issuedAt: {
                $gte: new Date(`${query.from}T00:00:00.000Z`),
                $lte: new Date(`${query.to}T23:59:59.999Z`),
            },
            payerType: 'HMO',
        };
        if (query.hmoName)
            filter.hmoName = new RegExp(query.hmoName, 'i');
        const invoices = await this.invoiceModel.find(filter).sort({ issuedAt: 1 }).exec();
        const rows = [];
        for (const invoice of invoices) {
            const [caseDoc, patient] = await Promise.all([
                this.caseModel.findById(invoice.caseId).exec(),
                this.patientModel.findById(invoice.patientId).exec(),
            ]);
            if (!caseDoc || !patient)
                continue;
            rows.push({
                invoiceNumber: invoice.number,
                accessionNumber: caseDoc.accessionNumber,
                patientName: `${patient.firstName} ${patient.lastName}`,
                hmoName: invoice.hmoName,
                authorizationNumber: invoice.authorizationNumber,
                serviceDate: (invoice.issuedAt ?? invoice.createdAt).toISOString().slice(0, 10),
                total: invoice.total,
                amountPaid: invoice.amountPaid,
                balance: invoice.balance,
                status: invoice.status,
            });
        }
        return { rows, csv: toCsv(rows) };
    }
    async locatePayment(reference) {
        return (0, tenant_context_1.runWithSystemTenant)('payment-reference', '', async () => {
            const payment = await this.paymentModel.findOne({ reference }).exec();
            if (!payment)
                throw new common_1.NotFoundException('Payment not found.');
            return { payment, labId: payment.labId.toString() };
        });
    }
    async markSuccess(reference, amount, providerReference, provider) {
        await (0, transaction_1.withTransaction)(this.connection, async (session) => {
            const payment = await this.paymentModel.findOne({ reference }).session(session).exec();
            if (!payment)
                throw new common_1.NotFoundException('Payment not found.');
            if (payment.status === 'SUCCESS')
                return;
            if (Math.abs(payment.amount - amount) > 0.05) {
                throw new common_1.ConflictException('Payment amount does not match the initialized amount.');
            }
            payment.status = 'SUCCESS';
            payment.providerReference = providerReference;
            payment.paidAt = new Date();
            payment.metadata = { ...payment.metadata, webhookProvider: provider };
            await payment.save({ session });
            await this.allocate(payment.invoiceId.toString(), payment.amount, payment.reference, session);
            await this.audit.record({
                action: 'PAYMENT',
                entityType: 'Invoice',
                entityId: payment.invoiceId.toString(),
                after: { event: 'paid', reference, amount, provider },
            }, session);
        });
    }
    async allocate(invoiceId, amount, reference, session) {
        let query = this.invoiceModel.findById(invoiceId);
        if (session)
            query = query.session(session);
        const invoice = await query.exec();
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found.');
        invoice.amountPaid = round(invoice.amountPaid + amount);
        invoice.balance = round(Math.max(invoice.total - invoice.amountPaid, 0));
        invoice.status = invoice.balance <= 0 ? 'PAID' : 'PARTIALLY_PAID';
        invoice.paidAt = invoice.balance <= 0 ? new Date() : invoice.paidAt;
        await invoice.save({ session });
        await this.audit.record({
            action: 'PAYMENT',
            entityType: 'Invoice',
            entityId: invoice._id.toString(),
            caseId: invoice.caseId.toString(),
            after: { amountPaid: invoice.amountPaid, balance: invoice.balance, status: invoice.status },
            metadata: { reference },
        }, session);
    }
    async paystackInitialize(invoice, amount, reference, patient) {
        const secret = this.config.get('PAYSTACK_SECRET_KEY');
        if (!secret)
            throw new common_1.BadGatewayException('Paystack is not configured.');
        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: patient?.email ?? this.config.get('EMAIL_FROM') ?? 'billing@histopathology.local',
                amount: Math.round(amount * 100),
                currency: invoice.currency,
                reference,
                callback_url: `${this.config.get('PUBLIC_WEB_URL')}/payments/callback?reference=${encodeURIComponent(reference)}`,
                metadata: { invoiceId: invoice._id.toString(), invoiceNumber: invoice.number },
            }),
        });
        if (!response.ok)
            throw new common_1.BadGatewayException(`Paystack returned ${response.status}.`);
        const body = (await response.json());
        if (!body.status || !body.data?.authorization_url) {
            throw new common_1.BadGatewayException(body.message ?? 'Paystack did not return a checkout URL.');
        }
        return {
            authorizationUrl: body.data.authorization_url,
            reference: body.data.reference ?? reference,
            raw: body,
        };
    }
    async flutterwaveInitialize(invoice, amount, reference, patient) {
        const secret = this.config.get('FLUTTERWAVE_SECRET_KEY');
        if (!secret)
            throw new common_1.BadGatewayException('Flutterwave is not configured.');
        const response = await fetch('https://api.flutterwave.com/v3/payments', {
            method: 'POST',
            headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tx_ref: reference,
                amount,
                currency: invoice.currency,
                redirect_url: `${this.config.get('PUBLIC_WEB_URL')}/payments/callback?reference=${encodeURIComponent(reference)}`,
                customer: {
                    email: patient?.email ??
                        this.config.get('EMAIL_FROM') ??
                        'billing@histopathology.local',
                    name: patient ? `${patient.firstName} ${patient.lastName}` : 'Patient',
                },
                customizations: {
                    title: 'Histopathology LIMS',
                    description: `Invoice ${invoice.number}`,
                },
            }),
        });
        if (!response.ok)
            throw new common_1.BadGatewayException(`Flutterwave returned ${response.status}.`);
        const body = (await response.json());
        if (body.status !== 'success' || !body.data?.link) {
            throw new common_1.BadGatewayException(body.message ?? 'Flutterwave did not return a checkout URL.');
        }
        return { link: body.data.link, reference, raw: body };
    }
    async toInvoice(invoice, knownCase) {
        const [caseDoc, patient] = await Promise.all([
            knownCase ?? this.caseModel.findById(invoice.caseId).exec(),
            this.patientModel.findById(invoice.patientId).exec(),
        ]);
        return {
            id: invoice._id.toString(),
            number: invoice.number,
            caseId: invoice.caseId.toString(),
            accessionNumber: caseDoc?.accessionNumber ?? '—',
            patientName: patient ? `${patient.firstName} ${patient.lastName}` : '—',
            payerType: invoice.payerType,
            hmoName: invoice.hmoName,
            hmoCode: invoice.hmoCode,
            authorizationNumber: invoice.authorizationNumber,
            status: invoice.status,
            currency: invoice.currency,
            items: invoice.items.map((item, index) => ({
                id: `${invoice._id.toString()}-${index}`,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.total,
                category: item.category,
            })),
            subtotal: invoice.subtotal,
            discount: invoice.discount,
            total: invoice.total,
            amountPaid: invoice.amountPaid,
            balance: invoice.balance,
            dueAt: invoice.dueAt ? invoice.dueAt.toISOString() : null,
            issuedAt: invoice.issuedAt ? invoice.issuedAt.toISOString() : null,
            paidAt: invoice.paidAt ? invoice.paidAt.toISOString() : null,
            notes: invoice.notes,
            createdAt: invoice.createdAt.toISOString(),
        };
    }
    toPayment(payment) {
        return {
            id: payment._id.toString(),
            invoiceId: payment.invoiceId.toString(),
            provider: payment.provider,
            status: payment.status,
            amount: payment.amount,
            currency: payment.currency,
            reference: payment.reference,
            providerReference: payment.providerReference,
            checkoutUrl: payment.checkoutUrl,
            paidAt: payment.paidAt ? payment.paidAt.toISOString() : null,
            createdAt: payment.createdAt.toISOString(),
        };
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectConnection)()),
    __param(1, (0, mongoose_1.InjectModel)(invoice_schema_1.InvoiceModelName)),
    __param(2, (0, mongoose_1.InjectModel)(payment_schema_1.PaymentModelName)),
    __param(3, (0, mongoose_1.InjectModel)(case_schema_1.CaseModelName)),
    __param(4, (0, mongoose_1.InjectModel)(patient_schema_1.PatientModelName)),
    __metadata("design:paramtypes", [Function, mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        labs_service_1.LabsService,
        audit_service_1.AuditService,
        config_1.ConfigService])
], BillingService);
function round(value) {
    return Math.round(value * 100) / 100;
}
function safeEqual(left, right) {
    const a = Buffer.from(left, 'utf8');
    const b = Buffer.from(right, 'utf8');
    return a.length === b.length && (0, node_crypto_1.timingSafeEqual)(a, b);
}
function asRecord(value) {
    return typeof value === 'object' && value !== null ? value : {};
}
function toCsv(rows) {
    const header = [
        'invoice_number',
        'accession_number',
        'patient_name',
        'hmo_name',
        'authorization_number',
        'service_date',
        'total',
        'amount_paid',
        'balance',
        'status',
    ];
    const lines = rows.map((row) => [
        row.invoiceNumber,
        row.accessionNumber,
        row.patientName,
        row.hmoName ?? '',
        row.authorizationNumber ?? '',
        row.serviceDate,
        row.total.toFixed(2),
        row.amountPaid.toFixed(2),
        row.balance.toFixed(2),
        row.status,
    ]
        .map(csvCell)
        .join(','));
    return [header.join(','), ...lines].join('\n');
}
function csvCell(value) {
    const escaped = value.replaceAll('"', '""');
    return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
}
//# sourceMappingURL=billing.service.js.map