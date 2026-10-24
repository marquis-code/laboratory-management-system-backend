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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMiddleware = exports.RequestContextMiddleware = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const request_context_1 = require("../context/request-context");
const tenant_context_1 = require("../context/tenant-context");
const authenticated_user_1 = require("../auth/authenticated-user");
const config_1 = require("@nestjs/config");
const jsonwebtoken_1 = require("jsonwebtoken");
let RequestContextMiddleware = class RequestContextMiddleware {
    use(req, res, next) {
        const incoming = req.headers['x-request-id'];
        const requestId = typeof incoming === 'string' && incoming.length > 0 && incoming.length <= 128
            ? incoming
            : (0, node_crypto_1.randomUUID)();
        res.setHeader('x-request-id', requestId);
        (0, request_context_1.runWithRequestContext)({
            requestId,
            method: req.method,
            path: req.originalUrl,
            ip: req.ip ?? null,
            userAgent: typeof req.headers['user-agent'] === 'string' ? req.headers['user-agent'] : null,
        }, () => next());
    }
};
exports.RequestContextMiddleware = RequestContextMiddleware;
exports.RequestContextMiddleware = RequestContextMiddleware = __decorate([
    (0, common_1.Injectable)()
], RequestContextMiddleware);
/**
 * Establishes the lab context for the whole request lifetime. The tenant is read
 * from a verified access token only; no header or body value can switch labs.
 * The JWT guard runs later and performs the authoritative user lookup.
 */
let TenantMiddleware = class TenantMiddleware {
    config;
    constructor(config) {
        this.config = config;
    }
    use(req, _res, next) {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = header.slice('Bearer '.length).trim();
        try {
            const secret = this.config.getOrThrow('JWT_ACCESS_SECRET');
            const payload = (0, jsonwebtoken_1.verify)(token, secret);
            if (!(0, authenticated_user_1.isAccessTokenPayload)(payload)) {
                next();
                return;
            }
            (0, tenant_context_1.runWithTenant)({
                labId: payload.labId,
                userId: payload.sub,
                userName: payload.name,
                userRole: payload.role,
            }, () => next());
        }
        catch {
            // Expired or malformed tokens are rejected by the auth guard, not here.
            next();
        }
    }
};
exports.TenantMiddleware = TenantMiddleware;
exports.TenantMiddleware = TenantMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], TenantMiddleware);
//# sourceMappingURL=request-context.middleware.js.map