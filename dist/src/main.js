"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const nestjs_pino_1 = require("nestjs-pino");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        rawBody: true,
    });
    const config = app.get(config_1.ConfigService);
    const logger = app.get(nestjs_pino_1.Logger);
    app.useLogger(logger);
    app.useGlobalInterceptors(new nestjs_pino_1.LoggerErrorInterceptor());
    const nodeEnv = config.get('NODE_ENV') ?? 'development';
    const port = Number(process.env.PORT ?? config.get('API_PORT') ?? 4000);
    const prefix = config.get('API_PREFIX') ?? 'api';
    const origins = (config.get('CORS_ORIGINS') ?? 'http://localhost:3000')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean);
    app.set('trust proxy', config.get('TRUST_PROXY') ?? 1);
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
    app.use((0, compression_1.default)());
    app.enableCors({
        origin: origins,
        credentials: false,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'x-request-id',
            'idempotency-key',
            'x-fhir-api-key',
            'x-wsi-signature',
        ],
        exposedHeaders: ['x-request-id', 'Content-Disposition'],
        maxAge: 86_400,
    });
    app.setGlobalPrefix(prefix);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: false },
        validationError: { target: false, value: false },
        stopAtFirstError: false,
    }));
    app.enableShutdownHooks();
    if (config.get('SWAGGER_ENABLED')) {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Histopathology LIMS API')
            .setDescription([
            'Block-and-slide level laboratory information management for hospital histopathology departments.',
            '',
            '**Tenancy** — every authenticated request is scoped to the laboratory in the JWT. There is no labId parameter.',
            '',
            '**Custody** — status is derived from immutable scan events through a state machine. Invalid transitions return 409 with the allowed next states.',
            '',
            '**Sign-out** — reports lock after sign-out; changes require an amendment and create a new immutable version.',
        ].join('\n'))
            .setVersion('1.0.0')
            .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Access token' }, 'bearer')
            .addServer(`/${prefix}`)
            .addTag('Auth')
            .addTag('Cases')
            .addTag('Custody')
            .addTag('Reports')
            .addTag('Worklist')
            .addTag('Dashboard')
            .addTag('Labels')
            .addTag('Protocols')
            .addTag('Users')
            .addTag('Laboratories')
            .addTag('Audit')
            .addTag('Maintenance')
            .addTag('Referrer portal')
            .addTag('Notifications')
            .addTag('Inventory')
            .addTag('Quality assurance')
            .addTag('Billing')
            .addTag('Terminology')
            .addTag('Whole-slide imaging')
            .addTag('FHIR R4')
            .addTag('HL7 v2')
            .addTag('Offline sync')
            .addTag('Results')
            .addTag('Rules')
            .addTag('Quality control')
            .addTag('Test catalogue')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig, {
            deepScanRoutes: true,
        });
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: { persistAuthorization: true, docExpansion: 'none', filter: true },
            customSiteTitle: 'Histopathology LIMS API',
        });
    }
    try {
        const connection = app.get((0, mongoose_1.getConnectionToken)());
        const admin = connection.db?.admin();
        if (admin) {
            const hello = (await admin.command({ hello: 1 }));
            if (!hello.setName) {
                logger.warn('MongoDB is running as a standalone server. Transactions require a replica set; use docker compose for local development.');
            }
            else {
                logger.log(`MongoDB replica set: ${hello.setName}`);
            }
        }
    }
    catch (error) {
        logger.warn({ err: error }, 'Could not probe the MongoDB topology.');
    }
    await app.listen(port, '0.0.0.0');
    logger.log(`Histopathology LIMS API ready on http://localhost:${port}/${prefix} (${nodeEnv})` +
        (config.get('SWAGGER_ENABLED') ? ` — docs at http://localhost:${port}/docs` : ''));
}
void bootstrap();
//# sourceMappingURL=main.js.map