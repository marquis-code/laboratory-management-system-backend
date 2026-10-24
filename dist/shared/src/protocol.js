"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProtocolSchema = exports.createProtocolSchema = exports.protocolSnapshotSchema = exports.protocolContentSchema = exports.protocolSectionSchema = exports.protocolFieldSchema = exports.protocolFieldOptionSchema = exports.reportValueSchema = exports.REPORT_FIELD_TYPES = void 0;
exports.flattenProtocolFields = flattenProtocolFields;
exports.validateReportData = validateReportData;
exports.generateNarrative = generateNarrative;
exports.reportCompleteness = reportCompleteness;
exports.checkSignOut = checkSignOut;
exports.canAmendReport = canAmendReport;
exports.isReportEditable = isReportEditable;
const zod_1 = require("zod");
exports.REPORT_FIELD_TYPES = [
    'text',
    'textarea',
    'select',
    'multiselect',
    'number',
    'boolean',
    'date',
];
exports.reportValueSchema = zod_1.z.union([
    zod_1.z.string().max(20_000),
    zod_1.z.number(),
    zod_1.z.boolean(),
    zod_1.z.array(zod_1.z.string().max(2_000)).max(100),
    zod_1.z.null(),
]);
exports.protocolFieldOptionSchema = zod_1.z.object({
    value: zod_1.z.string().min(1).max(120),
    label: zod_1.z.string().min(1).max(200),
});
exports.protocolFieldSchema = zod_1.z.object({
    key: zod_1.z
        .string()
        .min(1)
        .max(80)
        .regex(/^[a-z][a-zA-Z0-9_]*$/, 'Field keys must be camelCase and start with a letter.'),
    label: zod_1.z.string().min(1).max(200),
    type: zod_1.z.enum(exports.REPORT_FIELD_TYPES),
    required: zod_1.z.boolean().default(false),
    options: zod_1.z.array(exports.protocolFieldOptionSchema).max(60).optional(),
    help: zod_1.z.string().max(500).optional(),
    placeholder: zod_1.z.string().max(200).optional(),
    unit: zod_1.z.string().max(40).optional(),
    min: zod_1.z.number().optional(),
    max: zod_1.z.number().optional(),
    defaultValue: zod_1.z
        .union([zod_1.z.string().max(2_000), zod_1.z.number(), zod_1.z.boolean(), zod_1.z.array(zod_1.z.string().max(200)).max(50)])
        .optional(),
    narrativeLabel: zod_1.z.string().max(200).optional(),
    includeInNarrative: zod_1.z.boolean().optional(),
});
exports.protocolSectionSchema = zod_1.z.object({
    key: zod_1.z.string().min(1).max(80),
    title: zod_1.z.string().min(1).max(200),
    description: zod_1.z.string().max(500).optional(),
    fields: zod_1.z.array(exports.protocolFieldSchema).min(1).max(100),
});
exports.protocolContentSchema = zod_1.z.object({
    schemaVersion: zod_1.z.literal(1).default(1),
    title: zod_1.z.string().min(2).max(200),
    cancerType: zod_1.z.string().min(2).max(120),
    subspecialty: zod_1.z.string().min(2).max(80),
    narrativeIntro: zod_1.z.string().max(1_000).optional(),
    sections: zod_1.z.array(exports.protocolSectionSchema).min(1).max(24),
});
exports.protocolSnapshotSchema = exports.protocolContentSchema;
exports.createProtocolSchema = zod_1.z.object({
    key: zod_1.z
        .string()
        .min(2)
        .max(60)
        .regex(/^[a-z][a-z0-9_]*$/, 'Protocol keys use lower_snake_case.'),
    title: zod_1.z.string().min(2).max(200),
    cancerType: zod_1.z.string().min(2).max(120),
    subspecialty: zod_1.z.string().min(2).max(80),
    content: exports.protocolContentSchema,
});
exports.updateProtocolSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(200).optional(),
    cancerType: zod_1.z.string().min(2).max(120).optional(),
    subspecialty: zod_1.z.string().min(2).max(80).optional(),
    content: exports.protocolContentSchema.optional(),
    active: zod_1.z.boolean().optional(),
});
function isEmptyValue(value) {
    if (value === undefined || value === null)
        return true;
    if (typeof value === 'string')
        return value.trim().length === 0;
    if (Array.isArray(value))
        return value.length === 0;
    return false;
}
function flattenFields(content) {
    return content.sections.flatMap((section) => section.fields);
}
function flattenProtocolFields(content) {
    return flattenFields(content);
}
function validDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
        return false;
    const date = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(date.getTime());
}
/**
 * Normalises and validates a report payload against its protocol. This runs on
 * the server before every draft save, sign-out and amendment, and on the client
 * for immediate feedback. Unknown keys are discarded so a stale form cannot
 * inject fields the protocol does not define.
 */
function validateReportData(content, input) {
    const source = input !== null && typeof input === 'object' && !Array.isArray(input)
        ? input
        : {};
    const data = {};
    const errors = [];
    const missingRequired = [];
    for (const field of flattenFields(content)) {
        const raw = source[field.key];
        const label = field.narrativeLabel ?? field.label;
        if (raw === undefined || raw === null || raw === '') {
            data[field.key] = null;
            if (field.required)
                missingRequired.push(label);
            continue;
        }
        switch (field.type) {
            case 'text':
            case 'textarea': {
                if (typeof raw !== 'string') {
                    errors.push({ fieldKey: field.key, label, message: `${field.label} must be text.` });
                    data[field.key] = null;
                    break;
                }
                const value = raw.trim();
                data[field.key] = value.length > 0 ? value : null;
                if (field.required && value.length === 0)
                    missingRequired.push(label);
                break;
            }
            case 'date': {
                if (typeof raw !== 'string' || !validDate(raw)) {
                    errors.push({
                        fieldKey: field.key,
                        label,
                        message: `${field.label} must be a valid date.`,
                    });
                    data[field.key] = null;
                    break;
                }
                data[field.key] = raw;
                break;
            }
            case 'number': {
                const numeric = typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw.trim()) : Number.NaN;
                if (!Number.isFinite(numeric)) {
                    errors.push({ fieldKey: field.key, label, message: `${field.label} must be a number.` });
                    data[field.key] = null;
                    break;
                }
                if (field.min !== undefined && numeric < field.min) {
                    errors.push({
                        fieldKey: field.key,
                        label,
                        message: `${field.label} must be at least ${field.min}.`,
                    });
                }
                if (field.max !== undefined && numeric > field.max) {
                    errors.push({
                        fieldKey: field.key,
                        label,
                        message: `${field.label} must be at most ${field.max}.`,
                    });
                }
                data[field.key] = numeric;
                break;
            }
            case 'boolean': {
                if (typeof raw !== 'boolean') {
                    errors.push({ fieldKey: field.key, label, message: `${field.label} must be yes or no.` });
                    data[field.key] = null;
                    break;
                }
                data[field.key] = raw;
                break;
            }
            case 'select': {
                if (typeof raw !== 'string') {
                    errors.push({
                        fieldKey: field.key,
                        label,
                        message: `${field.label} must be one of the listed options.`,
                    });
                    data[field.key] = null;
                    break;
                }
                const value = raw.trim();
                if (field.options && field.options.length > 0) {
                    const valid = field.options.some((option) => option.value === value);
                    if (!valid) {
                        errors.push({
                            fieldKey: field.key,
                            label,
                            message: `${field.label} has an unrecognised value.`,
                        });
                        data[field.key] = null;
                        break;
                    }
                }
                data[field.key] = value;
                break;
            }
            case 'multiselect': {
                if (!Array.isArray(raw) || raw.some((item) => typeof item !== 'string')) {
                    errors.push({
                        fieldKey: field.key,
                        label,
                        message: `${field.label} must be a list of options.`,
                    });
                    data[field.key] = [];
                    break;
                }
                const values = Array.from(new Set(raw));
                const allowed = field.options?.map((option) => option.value);
                if (allowed && allowed.length > 0) {
                    const invalid = values.find((value) => !allowed.includes(value));
                    if (invalid) {
                        errors.push({
                            fieldKey: field.key,
                            label,
                            message: `${field.label} contains an unrecognised option.`,
                        });
                    }
                }
                data[field.key] = values;
                break;
            }
            default: {
                const exhaustive = field.type;
                errors.push({
                    fieldKey: field.key,
                    label,
                    message: `Unsupported field type ${String(exhaustive)}.`,
                });
            }
        }
    }
    if (missingRequired.length > 0) {
        for (const field of flattenFields(content)) {
            const label = field.narrativeLabel ?? field.label;
            if (field.required && isEmptyValue(data[field.key]) && !missingRequired.includes(label)) {
                missingRequired.push(label);
            }
        }
    }
    return {
        valid: errors.length === 0 && missingRequired.length === 0,
        data,
        errors,
        missingRequired,
    };
}
function formatFieldValue(field, value) {
    if (isEmptyValue(value))
        return '';
    if (typeof value === 'boolean')
        return value ? 'Yes' : 'No';
    if (typeof value === 'number')
        return field.unit ? `${value} ${field.unit}` : String(value);
    if (Array.isArray(value)) {
        if (field.options) {
            return value
                .map((item) => field.options?.find((option) => option.value === item)?.label ?? item)
                .join(', ');
        }
        return value.join(', ');
    }
    if (typeof value === 'string') {
        if (field.type === 'select' && field.options) {
            return field.options.find((option) => option.value === value)?.label ?? value;
        }
        return value;
    }
    return '';
}
/**
 * Deterministic narrative generated from structured synoptic data. Structured
 * data remains the source of truth; the narrative is always regenerated rather
 * than hand-edited.
 */
function generateNarrative(content, data) {
    const parts = [content.title.toUpperCase()];
    if (content.narrativeIntro)
        parts.push('', content.narrativeIntro);
    for (const section of content.sections) {
        const lines = [];
        for (const field of section.fields) {
            if (field.includeInNarrative === false)
                continue;
            const value = data[field.key];
            if (value === undefined || isEmptyValue(value))
                continue;
            const label = field.narrativeLabel ?? field.label;
            const formatted = formatFieldValue(field, value);
            if (!formatted)
                continue;
            if (field.type === 'textarea' && formatted.includes('\n')) {
                lines.push(`${label}:`, formatted);
            }
            else {
                lines.push(`${label}: ${formatted}`);
            }
        }
        if (lines.length > 0) {
            parts.push('', section.title.toUpperCase(), ...lines);
        }
    }
    return parts.join('\n').trim();
}
function reportCompleteness(content, data) {
    const required = flattenFields(content).filter((field) => field.required);
    const missingRequired = required
        .filter((field) => isEmptyValue(data[field.key]))
        .map((field) => field.narrativeLabel ?? field.label);
    return {
        requiredTotal: required.length,
        requiredCompleted: required.length - missingRequired.length,
        complete: missingRequired.length === 0,
        missingRequired,
    };
}
/**
 * Sign-out policy: a draft may be signed out only when every required field is
 * answered. Once signed out the report is locked; changes require the amendment
 * flow, which creates a new immutable version.
 */
function checkSignOut(status, content, data) {
    if (status !== 'DRAFT') {
        return {
            ok: false,
            reason: 'This report is signed out and locked. Use the amendment flow to change it.',
            missingRequired: [],
        };
    }
    const completeness = reportCompleteness(content, data);
    if (!completeness.complete) {
        return {
            ok: false,
            reason: `Complete all required fields before signing out: ${completeness.missingRequired.join(', ')}.`,
            missingRequired: completeness.missingRequired,
        };
    }
    return { ok: true, missingRequired: [] };
}
function canAmendReport(status) {
    return status === 'SIGNED_OUT' || status === 'AMENDED';
}
function isReportEditable(status) {
    return status === 'DRAFT';
}
//# sourceMappingURL=protocol.js.map