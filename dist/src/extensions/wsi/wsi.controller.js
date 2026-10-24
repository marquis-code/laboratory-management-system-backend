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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsiController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../common/pipes/parse-object-id.pipe");
const wsi_dto_1 = require("./dto/wsi.dto");
const wsi_service_1 = require("./wsi.service");
let WsiController = class WsiController {
    wsi;
    constructor(wsi) {
        this.wsi = wsi;
    }
    byBarcode(barcode) {
        return this.wsi.byBarcode(barcode);
    }
    link(id, dto, user) {
        return this.wsi.link(id, dto, user);
    }
    webhook(dto, signature) {
        return this.wsi.webhook(dto, signature);
    }
};
exports.WsiController = WsiController;
__decorate([
    (0, common_1.Get)(':barcode'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve a slide barcode to its linked whole-slide image' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Param)('barcode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], WsiController.prototype, "byBarcode", null);
__decorate([
    (0, common_1.Post)('slides/:id/link'),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Attach a WSI image or viewer URL to a slide' }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, wsi_dto_1.LinkWsiDto, Object]),
    __metadata("design:returntype", void 0)
], WsiController.prototype, "link", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)('webhook'),
    (0, swagger_1.ApiOperation)({
        summary: 'Scanner webhook: link a WSI by slide barcode using an HMAC signature',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('x-wsi-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [wsi_dto_1.WsiWebhookDto, String]),
    __metadata("design:returntype", void 0)
], WsiController.prototype, "webhook", null);
exports.WsiController = WsiController = __decorate([
    (0, swagger_1.ApiTags)('Whole-slide imaging'),
    (0, common_1.Controller)('wsi'),
    __metadata("design:paramtypes", [wsi_service_1.WsiService])
], WsiController);
//# sourceMappingURL=wsi.controller.js.map