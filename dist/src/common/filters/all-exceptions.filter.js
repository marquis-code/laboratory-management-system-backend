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
exports.AllExceptionsFilter = void 0;
const common_1 = require("@nestjs/common");
const nestjs_pino_1 = require("nestjs-pino");
const tenant_context_1 = require("../context/tenant-context");
const request_context_1 = require("../context/request-context");
const STATUS_TEXT = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    409: 'Conflict',
    413: 'Payload Too Large',
    415: 'Unsupported Media Type',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
    503: 'Service Unavailable',
};
function asRecord(value) {
    return value !== null && typeof value === 'object' ? value : null;
}
function normalizeHttpException(exception) {
    const status = exception.getStatus();
    const response = exception.getResponse();
    let message = exception.message;
    let error = STATUS_TEXT[status] ?? 'Error';
    let details;
    if (typeof response === 'string') {
        message = response;
    }
    else {
        const record = asRecord(response);
        if (record) {
            if (Array.isArray(record.message)) {
                message = record.message.map((item) => String(item));
            }
            else if (typeof record.message === 'string') {
                message = record.message;
            }
            if (typeof record.error === 'string')
                error = record.error;
            const extras = {};
            for (const [key, value] of Object.entries(record)) {
                if (key !== 'message' && key !== 'error' && key !== 'statusCode')
                    extras[key] = value;
            }
            if (Object.keys(extras).length > 0)
                details = extras;
        }
    }
    return { status, error, message, details };
}
function isDuplicateKeyError(exception) {
    const record = asRecord(exception);
    return record?.code === 11000;
}
function isCastError(exception) {
    return asRecord(exception)?.name === 'CastError';
}
function isMongooseValidationError(exception) {
    const record = asRecord(exception);
    if (record?.name !== 'ValidationError')
        return null;
    const errors = asRecord(record.errors);
    if (!errors)
        return null;
    return Object.values(errors).map((item) => {
        const errorRecord = asRecord(item);
        return typeof errorRecord?.message === 'string' ? errorRecord.message : 'Invalid value.';
    });
}
let AllExceptionsFilter = class AllExceptionsFilter {
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    catch(exception, host) {
        const http = host.switchToHttp();
        const response = http.getResponse();
        const request = http.getRequest();
        const requestId = (0, request_context_1.getRequestId)() ?? 'unavailable';
        const path = request.originalUrl ?? request.url ?? '';
        let normalized;
        let stack;
        if (exception instanceof common_1.HttpException) {
            normalized = normalizeHttpException(exception);
            stack = exception.stack;
        }
        else if (isDuplicateKeyError(exception)) {
            normalized = {
                status: common_1.HttpStatus.CONFLICT,
                error: 'Conflict',
                message: 'A record with this value already exists.',
            };
        }
        else if (isCastError(exception)) {
            normalized = {
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Bad Request',
                message: 'Invalid identifier or value.',
            };
        }
        else if (isMongooseValidationError(exception)) {
            normalized = {
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'Bad Request',
                message: isMongooseValidationError(exception) ?? ['Invalid document.'],
            };
        }
        else if (exception instanceof tenant_context_1.TenantContextMissingError) {
            normalized = {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal Server Error',
                message: 'The request could not be scoped to a laboratory.',
            };
            stack = exception.stack;
        }
        else {
            normalized = {
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal Server Error',
                message: 'An unexpected error occurred. Quote the request ID when contacting support.',
            };
            stack = exception instanceof Error ? exception.stack : undefined;
        }
        const body = {
            success: false,
            statusCode: normalized.status,
            error: normalized.error,
            message: normalized.message,
            ...(normalized.details !== undefined ? { details: normalized.details } : {}),
            requestId,
            timestamp: new Date().toISOString(),
            path,
        };
        if (normalized.status >= 500) {
            this.logger.error({ err: exception, requestId, path, statusCode: normalized.status }, 'API request failed');
        }
        else {
            this.logger.warn({ requestId, path, statusCode: normalized.status }, 'API request rejected');
        }
        void stack;
        if (response.headersSent)
            return;
        response.status(normalized.status).json(body);
    }
};
exports.AllExceptionsFilter = AllExceptionsFilter;
exports.AllExceptionsFilter = AllExceptionsFilter = __decorate([
    (0, common_1.Catch)(),
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [nestjs_pino_1.Logger])
], AllExceptionsFilter);
//# sourceMappingURL=all-exceptions.filter.js.map