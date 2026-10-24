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
exports.BlocksController = void 0;
const openapi = require("@nestjs/swagger");
const discipline_decorator_1 = require("../../../core/discipline/discipline.decorator");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_decorators_1 = require("../../../common/decorators/auth.decorators");
const block_dto_1 = require("./dto/block.dto");
const blocks_service_1 = require("./blocks.service");
let BlocksController = class BlocksController {
    blocksService;
    constructor(blocksService) {
        this.blocksService = blocksService;
    }
    list(query) {
        return this.blocksService.list(query);
    }
    gross(dto) {
        return this.blocksService.gross(dto);
    }
};
exports.BlocksController = BlocksController;
__decorate([
    (0, common_1.Get)(),
    (0, auth_decorators_1.Roles)('SUPER_ADMIN', 'LAB_ADMIN', 'RECEPTIONIST', 'GROSSER', 'TECHNOLOGIST', 'PATHOLOGIST'),
    (0, swagger_1.ApiOperation)({ summary: 'List blocks, optionally filtered by case or specimen' }),
    openapi.ApiResponse({ status: 200 }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [block_dto_1.BlockListQueryDto]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('gross'),
    (0, auth_decorators_1.Roles)('GROSSER', 'LAB_ADMIN', 'SUPER_ADMIN'),
    (0, swagger_1.ApiOperation)({
        summary: 'Record gross examination and create cassettes with unique labels',
        description: 'Created blocks start ACCESSIONED and must be scanned at grossing before processing.',
    }),
    openapi.ApiResponse({ status: 201, type: [Object] }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [block_dto_1.GrossBlockDto]),
    __metadata("design:returntype", Promise)
], BlocksController.prototype, "gross", null);
exports.BlocksController = BlocksController = __decorate([
    (0, swagger_1.ApiTags)('Blocks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, discipline_decorator_1.Discipline)('HISTOPATHOLOGY'),
    (0, common_1.Controller)('blocks'),
    __metadata("design:paramtypes", [blocks_service_1.BlocksService])
], BlocksController);
//# sourceMappingURL=blocks.controller.js.map