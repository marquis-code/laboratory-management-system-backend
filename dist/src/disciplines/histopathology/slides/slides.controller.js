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
exports.SlidesController = void 0;
const openapi = require("@nestjs/swagger");
const discipline_decorator_1 = require("../../../core/discipline/discipline.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../../common/decorators/auth.decorators");
const parse_object_id_pipe_1 = require("../../../common/pipes/parse-object-id.pipe");
const slide_dto_1 = require("./dto/slide.dto");
const slides_service_1 = require("./slides.service");
let SlidesController = class SlidesController {
    slidesService;
    constructor(slidesService) {
        this.slidesService = slidesService;
    }
    list(query) {
        return this.slidesService.list(query);
    }
    cut(dto) {
        return this.slidesService.cut(dto);
    }
    requestStain(dto) {
        return this.slidesService.requestStain(dto);
    }
    recut(id, dto) {
        return this.slidesService.requestRecut(id, dto);
    }
};
exports.SlidesController = SlidesController;
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'List slides, optionally by case or block' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [slide_dto_1.SlideListQueryDto]),
    __metadata("design:returntype", Promise)
], SlidesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('cut'),
    (0, auth_decorators_1.Roles)('TECHNOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Record slide cutting and create uniquely labelled slides' }),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [slide_dto_1.CutSlidesDto]),
    __metadata("design:returntype", Promise)
], SlidesController.prototype, "cut", null);
__decorate([
    (0, common_1.Post)('request'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a special stain or immunohistochemistry slide' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [slide_dto_1.StainRequestDto]),
    __metadata("design:returntype", Promise)
], SlidesController.prototype, "requestStain", null);
__decorate([
    (0, common_1.Post)(':id/recut'),
    (0, auth_decorators_1.Roles)('PATHOLOGIST', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({ summary: 'Request a recut of a reviewed slide' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Param)('id', parse_object_id_pipe_1.ParseObjectIdPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, slide_dto_1.RecutRequestDto]),
    __metadata("design:returntype", Promise)
], SlidesController.prototype, "recut", null);
exports.SlidesController = SlidesController = __decorate([
    (0, swagger_1.ApiTags)('Slides'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, discipline_decorator_1.Discipline)('HISTOPATHOLOGY'),
    (0, common_1.Controller)('slides'),
    __metadata("design:paramtypes", [slides_service_1.SlidesService])
], SlidesController);
//# sourceMappingURL=slides.controller.js.map