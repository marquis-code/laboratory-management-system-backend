import { z } from 'zod';
import type { ReportStatus } from './constants';
export declare const REPORT_FIELD_TYPES: readonly ["text", "textarea", "select", "multiselect", "number", "boolean", "date"];
export type ReportFieldType = (typeof REPORT_FIELD_TYPES)[number];
export declare const reportValueSchema: z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">, z.ZodNull]>;
export type ReportValue = z.infer<typeof reportValueSchema>;
export type ReportData = Record<string, ReportValue>;
export declare const protocolFieldOptionSchema: z.ZodObject<{
    value: z.ZodString;
    label: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    label: string;
}, {
    value: string;
    label: string;
}>;
export type ProtocolFieldOption = z.infer<typeof protocolFieldOptionSchema>;
export declare const protocolFieldSchema: z.ZodObject<{
    key: z.ZodString;
    label: z.ZodString;
    type: z.ZodEnum<["text", "textarea", "select", "multiselect", "number", "boolean", "date"]>;
    required: z.ZodDefault<z.ZodBoolean>;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        value: z.ZodString;
        label: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        label: string;
    }, {
        value: string;
        label: string;
    }>, "many">>;
    help: z.ZodOptional<z.ZodString>;
    placeholder: z.ZodOptional<z.ZodString>;
    unit: z.ZodOptional<z.ZodString>;
    min: z.ZodOptional<z.ZodNumber>;
    max: z.ZodOptional<z.ZodNumber>;
    defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
    narrativeLabel: z.ZodOptional<z.ZodString>;
    includeInNarrative: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
    label: string;
    key: string;
    required: boolean;
    options?: {
        value: string;
        label: string;
    }[] | undefined;
    help?: string | undefined;
    placeholder?: string | undefined;
    unit?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    defaultValue?: string | number | boolean | string[] | undefined;
    narrativeLabel?: string | undefined;
    includeInNarrative?: boolean | undefined;
}, {
    type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
    label: string;
    key: string;
    options?: {
        value: string;
        label: string;
    }[] | undefined;
    required?: boolean | undefined;
    help?: string | undefined;
    placeholder?: string | undefined;
    unit?: string | undefined;
    min?: number | undefined;
    max?: number | undefined;
    defaultValue?: string | number | boolean | string[] | undefined;
    narrativeLabel?: string | undefined;
    includeInNarrative?: boolean | undefined;
}>;
export type ProtocolField = z.infer<typeof protocolFieldSchema>;
export declare const protocolSectionSchema: z.ZodObject<{
    key: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    fields: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        label: z.ZodString;
        type: z.ZodEnum<["text", "textarea", "select", "multiselect", "number", "boolean", "date"]>;
        required: z.ZodDefault<z.ZodBoolean>;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            value: z.ZodString;
            label: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            label: string;
        }, {
            value: string;
            label: string;
        }>, "many">>;
        help: z.ZodOptional<z.ZodString>;
        placeholder: z.ZodOptional<z.ZodString>;
        unit: z.ZodOptional<z.ZodString>;
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
        defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
        narrativeLabel: z.ZodOptional<z.ZodString>;
        includeInNarrative: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
        label: string;
        key: string;
        required: boolean;
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        help?: string | undefined;
        placeholder?: string | undefined;
        unit?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        defaultValue?: string | number | boolean | string[] | undefined;
        narrativeLabel?: string | undefined;
        includeInNarrative?: boolean | undefined;
    }, {
        type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
        label: string;
        key: string;
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        required?: boolean | undefined;
        help?: string | undefined;
        placeholder?: string | undefined;
        unit?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        defaultValue?: string | number | boolean | string[] | undefined;
        narrativeLabel?: string | undefined;
        includeInNarrative?: boolean | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    key: string;
    title: string;
    fields: {
        type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
        label: string;
        key: string;
        required: boolean;
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        help?: string | undefined;
        placeholder?: string | undefined;
        unit?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        defaultValue?: string | number | boolean | string[] | undefined;
        narrativeLabel?: string | undefined;
        includeInNarrative?: boolean | undefined;
    }[];
    description?: string | undefined;
}, {
    key: string;
    title: string;
    fields: {
        type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
        label: string;
        key: string;
        options?: {
            value: string;
            label: string;
        }[] | undefined;
        required?: boolean | undefined;
        help?: string | undefined;
        placeholder?: string | undefined;
        unit?: string | undefined;
        min?: number | undefined;
        max?: number | undefined;
        defaultValue?: string | number | boolean | string[] | undefined;
        narrativeLabel?: string | undefined;
        includeInNarrative?: boolean | undefined;
    }[];
    description?: string | undefined;
}>;
export type ProtocolSection = z.infer<typeof protocolSectionSchema>;
export declare const protocolContentSchema: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<1>>;
    title: z.ZodString;
    cancerType: z.ZodString;
    subspecialty: z.ZodString;
    narrativeIntro: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            label: z.ZodString;
            type: z.ZodEnum<["text", "textarea", "select", "multiselect", "number", "boolean", "date"]>;
            required: z.ZodDefault<z.ZodBoolean>;
            options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>, "many">>;
            help: z.ZodOptional<z.ZodString>;
            placeholder: z.ZodOptional<z.ZodString>;
            unit: z.ZodOptional<z.ZodString>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            narrativeLabel: z.ZodOptional<z.ZodString>;
            includeInNarrative: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            required: boolean;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }, {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            required?: boolean | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        key: string;
        title: string;
        fields: {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            required: boolean;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }[];
        description?: string | undefined;
    }, {
        key: string;
        title: string;
        fields: {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            required?: boolean | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }[];
        description?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    schemaVersion: 1;
    cancerType: string;
    subspecialty: string;
    sections: {
        key: string;
        title: string;
        fields: {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            required: boolean;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }[];
        description?: string | undefined;
    }[];
    narrativeIntro?: string | undefined;
}, {
    title: string;
    cancerType: string;
    subspecialty: string;
    sections: {
        key: string;
        title: string;
        fields: {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            required?: boolean | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }[];
        description?: string | undefined;
    }[];
    schemaVersion?: 1 | undefined;
    narrativeIntro?: string | undefined;
}>;
export type ProtocolContent = z.infer<typeof protocolContentSchema>;
export declare const protocolSnapshotSchema: z.ZodObject<{
    schemaVersion: z.ZodDefault<z.ZodLiteral<1>>;
    title: z.ZodString;
    cancerType: z.ZodString;
    subspecialty: z.ZodString;
    narrativeIntro: z.ZodOptional<z.ZodString>;
    sections: z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        fields: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            label: z.ZodString;
            type: z.ZodEnum<["text", "textarea", "select", "multiselect", "number", "boolean", "date"]>;
            required: z.ZodDefault<z.ZodBoolean>;
            options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                value: z.ZodString;
                label: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                value: string;
                label: string;
            }, {
                value: string;
                label: string;
            }>, "many">>;
            help: z.ZodOptional<z.ZodString>;
            placeholder: z.ZodOptional<z.ZodString>;
            unit: z.ZodOptional<z.ZodString>;
            min: z.ZodOptional<z.ZodNumber>;
            max: z.ZodOptional<z.ZodNumber>;
            defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
            narrativeLabel: z.ZodOptional<z.ZodString>;
            includeInNarrative: z.ZodOptional<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            required: boolean;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }, {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            required?: boolean | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        key: string;
        title: string;
        fields: {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            required: boolean;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }[];
        description?: string | undefined;
    }, {
        key: string;
        title: string;
        fields: {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            required?: boolean | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }[];
        description?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    title: string;
    schemaVersion: 1;
    cancerType: string;
    subspecialty: string;
    sections: {
        key: string;
        title: string;
        fields: {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            required: boolean;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }[];
        description?: string | undefined;
    }[];
    narrativeIntro?: string | undefined;
}, {
    title: string;
    cancerType: string;
    subspecialty: string;
    sections: {
        key: string;
        title: string;
        fields: {
            type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
            label: string;
            key: string;
            options?: {
                value: string;
                label: string;
            }[] | undefined;
            required?: boolean | undefined;
            help?: string | undefined;
            placeholder?: string | undefined;
            unit?: string | undefined;
            min?: number | undefined;
            max?: number | undefined;
            defaultValue?: string | number | boolean | string[] | undefined;
            narrativeLabel?: string | undefined;
            includeInNarrative?: boolean | undefined;
        }[];
        description?: string | undefined;
    }[];
    schemaVersion?: 1 | undefined;
    narrativeIntro?: string | undefined;
}>;
export declare const createProtocolSchema: z.ZodObject<{
    key: z.ZodString;
    title: z.ZodString;
    cancerType: z.ZodString;
    subspecialty: z.ZodString;
    content: z.ZodObject<{
        schemaVersion: z.ZodDefault<z.ZodLiteral<1>>;
        title: z.ZodString;
        cancerType: z.ZodString;
        subspecialty: z.ZodString;
        narrativeIntro: z.ZodOptional<z.ZodString>;
        sections: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            fields: z.ZodArray<z.ZodObject<{
                key: z.ZodString;
                label: z.ZodString;
                type: z.ZodEnum<["text", "textarea", "select", "multiselect", "number", "boolean", "date"]>;
                required: z.ZodDefault<z.ZodBoolean>;
                options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    value: string;
                    label: string;
                }, {
                    value: string;
                    label: string;
                }>, "many">>;
                help: z.ZodOptional<z.ZodString>;
                placeholder: z.ZodOptional<z.ZodString>;
                unit: z.ZodOptional<z.ZodString>;
                min: z.ZodOptional<z.ZodNumber>;
                max: z.ZodOptional<z.ZodNumber>;
                defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                narrativeLabel: z.ZodOptional<z.ZodString>;
                includeInNarrative: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                required: boolean;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }, {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                required?: boolean | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                required: boolean;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }, {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                required?: boolean | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        title: string;
        schemaVersion: 1;
        cancerType: string;
        subspecialty: string;
        sections: {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                required: boolean;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }[];
        narrativeIntro?: string | undefined;
    }, {
        title: string;
        cancerType: string;
        subspecialty: string;
        sections: {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                required?: boolean | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }[];
        schemaVersion?: 1 | undefined;
        narrativeIntro?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    key: string;
    title: string;
    cancerType: string;
    subspecialty: string;
    content: {
        title: string;
        schemaVersion: 1;
        cancerType: string;
        subspecialty: string;
        sections: {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                required: boolean;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }[];
        narrativeIntro?: string | undefined;
    };
}, {
    key: string;
    title: string;
    cancerType: string;
    subspecialty: string;
    content: {
        title: string;
        cancerType: string;
        subspecialty: string;
        sections: {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                required?: boolean | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }[];
        schemaVersion?: 1 | undefined;
        narrativeIntro?: string | undefined;
    };
}>;
export type CreateProtocolInput = z.infer<typeof createProtocolSchema>;
export declare const updateProtocolSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    cancerType: z.ZodOptional<z.ZodString>;
    subspecialty: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodObject<{
        schemaVersion: z.ZodDefault<z.ZodLiteral<1>>;
        title: z.ZodString;
        cancerType: z.ZodString;
        subspecialty: z.ZodString;
        narrativeIntro: z.ZodOptional<z.ZodString>;
        sections: z.ZodArray<z.ZodObject<{
            key: z.ZodString;
            title: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            fields: z.ZodArray<z.ZodObject<{
                key: z.ZodString;
                label: z.ZodString;
                type: z.ZodEnum<["text", "textarea", "select", "multiselect", "number", "boolean", "date"]>;
                required: z.ZodDefault<z.ZodBoolean>;
                options: z.ZodOptional<z.ZodArray<z.ZodObject<{
                    value: z.ZodString;
                    label: z.ZodString;
                }, "strip", z.ZodTypeAny, {
                    value: string;
                    label: string;
                }, {
                    value: string;
                    label: string;
                }>, "many">>;
                help: z.ZodOptional<z.ZodString>;
                placeholder: z.ZodOptional<z.ZodString>;
                unit: z.ZodOptional<z.ZodString>;
                min: z.ZodOptional<z.ZodNumber>;
                max: z.ZodOptional<z.ZodNumber>;
                defaultValue: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodArray<z.ZodString, "many">]>>;
                narrativeLabel: z.ZodOptional<z.ZodString>;
                includeInNarrative: z.ZodOptional<z.ZodBoolean>;
            }, "strip", z.ZodTypeAny, {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                required: boolean;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }, {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                required?: boolean | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                required: boolean;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }, {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                required?: boolean | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        title: string;
        schemaVersion: 1;
        cancerType: string;
        subspecialty: string;
        sections: {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                required: boolean;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }[];
        narrativeIntro?: string | undefined;
    }, {
        title: string;
        cancerType: string;
        subspecialty: string;
        sections: {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                required?: boolean | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }[];
        schemaVersion?: 1 | undefined;
        narrativeIntro?: string | undefined;
    }>>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title?: string | undefined;
    cancerType?: string | undefined;
    subspecialty?: string | undefined;
    content?: {
        title: string;
        schemaVersion: 1;
        cancerType: string;
        subspecialty: string;
        sections: {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                required: boolean;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }[];
        narrativeIntro?: string | undefined;
    } | undefined;
    active?: boolean | undefined;
}, {
    title?: string | undefined;
    cancerType?: string | undefined;
    subspecialty?: string | undefined;
    content?: {
        title: string;
        cancerType: string;
        subspecialty: string;
        sections: {
            key: string;
            title: string;
            fields: {
                type: "number" | "boolean" | "text" | "textarea" | "select" | "multiselect" | "date";
                label: string;
                key: string;
                options?: {
                    value: string;
                    label: string;
                }[] | undefined;
                required?: boolean | undefined;
                help?: string | undefined;
                placeholder?: string | undefined;
                unit?: string | undefined;
                min?: number | undefined;
                max?: number | undefined;
                defaultValue?: string | number | boolean | string[] | undefined;
                narrativeLabel?: string | undefined;
                includeInNarrative?: boolean | undefined;
            }[];
            description?: string | undefined;
        }[];
        schemaVersion?: 1 | undefined;
        narrativeIntro?: string | undefined;
    } | undefined;
    active?: boolean | undefined;
}>;
export type UpdateProtocolInput = z.infer<typeof updateProtocolSchema>;
export interface ReportIssue {
    fieldKey: string;
    label: string;
    message: string;
}
export interface ReportValidationResult {
    valid: boolean;
    data: ReportData;
    errors: ReportIssue[];
    missingRequired: string[];
}
export declare function flattenProtocolFields(content: ProtocolContent): ProtocolField[];
/**
 * Normalises and validates a report payload against its protocol. This runs on
 * the server before every draft save, sign-out and amendment, and on the client
 * for immediate feedback. Unknown keys are discarded so a stale form cannot
 * inject fields the protocol does not define.
 */
export declare function validateReportData(content: ProtocolContent, input: unknown): ReportValidationResult;
/**
 * Deterministic narrative generated from structured synoptic data. Structured
 * data remains the source of truth; the narrative is always regenerated rather
 * than hand-edited.
 */
export declare function generateNarrative(content: ProtocolContent, data: ReportData): string;
export interface ReportCompleteness {
    requiredTotal: number;
    requiredCompleted: number;
    complete: boolean;
    missingRequired: string[];
}
export declare function reportCompleteness(content: ProtocolContent, data: ReportData): ReportCompleteness;
export interface SignOutCheck {
    ok: boolean;
    reason?: string;
    missingRequired: string[];
}
/**
 * Sign-out policy: a draft may be signed out only when every required field is
 * answered. Once signed out the report is locked; changes require the amendment
 * flow, which creates a new immutable version.
 */
export declare function checkSignOut(status: ReportStatus, content: ProtocolContent, data: ReportData): SignOutCheck;
export declare function canAmendReport(status: ReportStatus): boolean;
export declare function isReportEditable(status: ReportStatus): boolean;
//# sourceMappingURL=protocol.d.ts.map