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
var MllpServer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MllpServer = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_net_1 = require("node:net");
const hl7_service_1 = require("./hl7.service");
const VT = '\u000b';
const FS = '\u001c';
let MllpServer = MllpServer_1 = class MllpServer {
    config;
    hl7;
    logger = new common_1.Logger(MllpServer_1.name);
    server = null;
    buffers = new Map();
    constructor(config, hl7) {
        this.config = config;
        this.hl7 = hl7;
    }
    onModuleInit() {
        if (!this.config.get('HL7_ENABLED'))
            return;
        const port = this.config.get('HL7_MLLP_PORT') ?? 2575;
        const allowed = (this.config.get('HL7_ALLOWED_IPS') ?? '')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean);
        this.server = (0, node_net_1.createServer)((socket) => {
            const remote = socket.remoteAddress ?? '';
            if (allowed.length > 0 && !allowed.some((ip) => remote.endsWith(ip))) {
                this.logger.warn({ remote }, 'Rejected HL7 MLLP connection from an unlisted IP.');
                socket.destroy();
                return;
            }
            this.buffers.set(socket, '');
            socket.on('data', (chunk) => void this.onData(socket, chunk.toString('utf8')));
            socket.on('close', () => this.buffers.delete(socket));
            socket.on('error', (error) => {
                this.logger.warn({ err: error }, 'HL7 MLLP socket error.');
                this.buffers.delete(socket);
            });
        });
        this.server.on('error', (error) => this.logger.error({ err: error }, 'HL7 MLLP server error.'));
        this.server.listen(port, '0.0.0.0', () => {
            this.logger.log(`HL7 v2 MLLP listener ready on port ${port}.`);
        });
    }
    async onData(socket, chunk) {
        let buffer = `${this.buffers.get(socket) ?? ''}${chunk}`;
        for (;;) {
            const start = buffer.indexOf(VT);
            const end = buffer.indexOf(FS, start + 1);
            if (start === -1 || end === -1)
                break;
            const message = buffer.slice(start + 1, end);
            buffer = buffer.slice(end + 2);
            try {
                const result = await this.hl7.ingest(message);
                socket.write(this.hl7.ackFrame(result.ack));
            }
            catch (error) {
                this.logger.error({ err: error }, 'HL7 message processing failed.');
                socket.write(this.hl7.ackFrame(`MSH|^~\\&|HISTOLIMS|LAB|EMR|HOSPITAL|${new Date()
                    .toISOString()
                    .replace(/[-:TZ.]/g, '')
                    .slice(0, 14)}||ACK^O01|ACK-ERROR|P|2.5\rMSA|AE|ERROR|Internal processing error`));
            }
        }
        this.buffers.set(socket, buffer);
    }
    onModuleDestroy() {
        this.server?.close();
    }
};
exports.MllpServer = MllpServer;
exports.MllpServer = MllpServer = MllpServer_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        hl7_service_1.Hl7Service])
], MllpServer);
//# sourceMappingURL=mllp.server.js.map