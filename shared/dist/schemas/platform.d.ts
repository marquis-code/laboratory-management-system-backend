import { z } from 'zod';
export declare const organizationCreateSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    type: z.ZodEnum<["HOSPITAL", "STANDALONE"]>;
    country: z.ZodDefault<z.ZodString>;
    state: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    city: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    plan: z.ZodOptional<z.ZodEnum<["TRIAL", "STANDARD", "ENTERPRISE"]>>;
    seats: z.ZodOptional<z.ZodNumber>;
    trialDays: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    type: "HOSPITAL" | "STANDALONE";
    name: string;
    country: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    notes?: string | null | undefined;
    website?: string | null | undefined;
    state?: string | null | undefined;
    city?: string | null | undefined;
    plan?: "TRIAL" | "STANDARD" | "ENTERPRISE" | undefined;
    seats?: number | undefined;
    trialDays?: number | undefined;
}, {
    code: string;
    type: "HOSPITAL" | "STANDALONE";
    name: string;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    notes?: string | null | undefined;
    website?: string | null | undefined;
    country?: string | undefined;
    state?: string | null | undefined;
    city?: string | null | undefined;
    plan?: "TRIAL" | "STANDARD" | "ENTERPRISE" | undefined;
    seats?: number | undefined;
    trialDays?: number | undefined;
}>;
export declare const administratorSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    phone?: string | null | undefined;
}, {
    email: string;
    name: string;
    phone?: string | null | undefined;
}>;
export declare const labProvisionSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    enabledDisciplines: z.ZodArray<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>, "many">;
    accessionPrefix: z.ZodOptional<z.ZodString>;
    timezone: z.ZodOptional<z.ZodString>;
    currency: z.ZodOptional<z.ZodString>;
    qaSamplingPercent: z.ZodOptional<z.ZodNumber>;
    administrator: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        phone?: string | null | undefined;
    }, {
        email: string;
        name: string;
        phone?: string | null | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    enabledDisciplines: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[];
    administrator?: {
        email: string;
        name: string;
        phone?: string | null | undefined;
    } | undefined;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    accessionPrefix?: string | undefined;
    timezone?: string | undefined;
    qaSamplingPercent?: number | undefined;
    currency?: string | undefined;
}, {
    code: string;
    name: string;
    enabledDisciplines: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[];
    administrator?: {
        email: string;
        name: string;
        phone?: string | null | undefined;
    } | undefined;
    email?: string | null | undefined;
    phone?: string | null | undefined;
    address?: string | null | undefined;
    accessionPrefix?: string | undefined;
    timezone?: string | undefined;
    qaSamplingPercent?: number | undefined;
    currency?: string | undefined;
}>;
export declare const onboardingSchema: z.ZodObject<{
    organization: z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        type: z.ZodEnum<["HOSPITAL", "STANDALONE"]>;
        country: z.ZodDefault<z.ZodString>;
        state: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        city: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        website: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        plan: z.ZodOptional<z.ZodEnum<["TRIAL", "STANDARD", "ENTERPRISE"]>>;
        seats: z.ZodOptional<z.ZodNumber>;
        trialDays: z.ZodOptional<z.ZodNumber>;
        notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        type: "HOSPITAL" | "STANDALONE";
        name: string;
        country: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
        address?: string | null | undefined;
        notes?: string | null | undefined;
        website?: string | null | undefined;
        state?: string | null | undefined;
        city?: string | null | undefined;
        plan?: "TRIAL" | "STANDARD" | "ENTERPRISE" | undefined;
        seats?: number | undefined;
        trialDays?: number | undefined;
    }, {
        code: string;
        type: "HOSPITAL" | "STANDALONE";
        name: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
        address?: string | null | undefined;
        notes?: string | null | undefined;
        website?: string | null | undefined;
        country?: string | undefined;
        state?: string | null | undefined;
        city?: string | null | undefined;
        plan?: "TRIAL" | "STANDARD" | "ENTERPRISE" | undefined;
        seats?: number | undefined;
        trialDays?: number | undefined;
    }>;
    lab: z.ZodObject<{
        code: z.ZodString;
        name: z.ZodString;
        address: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        enabledDisciplines: z.ZodArray<z.ZodEnum<["HISTOPATHOLOGY", "HAEMATOLOGY", "CHEMICAL_PATHOLOGY", "MICROBIOLOGY"]>, "many">;
        accessionPrefix: z.ZodOptional<z.ZodString>;
        timezone: z.ZodOptional<z.ZodString>;
        currency: z.ZodOptional<z.ZodString>;
        qaSamplingPercent: z.ZodOptional<z.ZodNumber>;
        administrator: z.ZodOptional<z.ZodObject<{
            name: z.ZodString;
            email: z.ZodString;
            phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            email: string;
            name: string;
            phone?: string | null | undefined;
        }, {
            email: string;
            name: string;
            phone?: string | null | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        code: string;
        name: string;
        enabledDisciplines: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[];
        administrator?: {
            email: string;
            name: string;
            phone?: string | null | undefined;
        } | undefined;
        email?: string | null | undefined;
        phone?: string | null | undefined;
        address?: string | null | undefined;
        accessionPrefix?: string | undefined;
        timezone?: string | undefined;
        qaSamplingPercent?: number | undefined;
        currency?: string | undefined;
    }, {
        code: string;
        name: string;
        enabledDisciplines: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[];
        administrator?: {
            email: string;
            name: string;
            phone?: string | null | undefined;
        } | undefined;
        email?: string | null | undefined;
        phone?: string | null | undefined;
        address?: string | null | undefined;
        accessionPrefix?: string | undefined;
        timezone?: string | undefined;
        qaSamplingPercent?: number | undefined;
        currency?: string | undefined;
    }>;
    administrator: z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        phone?: string | null | undefined;
    }, {
        email: string;
        name: string;
        phone?: string | null | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    organization: {
        code: string;
        type: "HOSPITAL" | "STANDALONE";
        name: string;
        country: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
        address?: string | null | undefined;
        notes?: string | null | undefined;
        website?: string | null | undefined;
        state?: string | null | undefined;
        city?: string | null | undefined;
        plan?: "TRIAL" | "STANDARD" | "ENTERPRISE" | undefined;
        seats?: number | undefined;
        trialDays?: number | undefined;
    };
    administrator: {
        email: string;
        name: string;
        phone?: string | null | undefined;
    };
    lab: {
        code: string;
        name: string;
        enabledDisciplines: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[];
        administrator?: {
            email: string;
            name: string;
            phone?: string | null | undefined;
        } | undefined;
        email?: string | null | undefined;
        phone?: string | null | undefined;
        address?: string | null | undefined;
        accessionPrefix?: string | undefined;
        timezone?: string | undefined;
        qaSamplingPercent?: number | undefined;
        currency?: string | undefined;
    };
}, {
    organization: {
        code: string;
        type: "HOSPITAL" | "STANDALONE";
        name: string;
        email?: string | null | undefined;
        phone?: string | null | undefined;
        address?: string | null | undefined;
        notes?: string | null | undefined;
        website?: string | null | undefined;
        country?: string | undefined;
        state?: string | null | undefined;
        city?: string | null | undefined;
        plan?: "TRIAL" | "STANDARD" | "ENTERPRISE" | undefined;
        seats?: number | undefined;
        trialDays?: number | undefined;
    };
    administrator: {
        email: string;
        name: string;
        phone?: string | null | undefined;
    };
    lab: {
        code: string;
        name: string;
        enabledDisciplines: ("HISTOPATHOLOGY" | "HAEMATOLOGY" | "CHEMICAL_PATHOLOGY" | "MICROBIOLOGY")[];
        administrator?: {
            email: string;
            name: string;
            phone?: string | null | undefined;
        } | undefined;
        email?: string | null | undefined;
        phone?: string | null | undefined;
        address?: string | null | undefined;
        accessionPrefix?: string | undefined;
        timezone?: string | undefined;
        qaSamplingPercent?: number | undefined;
        currency?: string | undefined;
    };
}>;
export declare const onboardingAdminSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    phone?: string | null | undefined;
}, {
    email: string;
    name: string;
    phone?: string | null | undefined;
}>;
export declare const organizationUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ONBOARDING", "ACTIVE", "SUSPENDED"]>>;
    plan: z.ZodOptional<z.ZodEnum<["TRIAL", "STANDARD", "ENTERPRISE"]>>;
    seats: z.ZodOptional<z.ZodNumber>;
    notes: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    email: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    phone: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "ONBOARDING" | "SUSPENDED" | undefined;
    email?: string | null | undefined;
    name?: string | undefined;
    phone?: string | null | undefined;
    notes?: string | null | undefined;
    plan?: "TRIAL" | "STANDARD" | "ENTERPRISE" | undefined;
    seats?: number | undefined;
}, {
    status?: "ACTIVE" | "ONBOARDING" | "SUSPENDED" | undefined;
    email?: string | null | undefined;
    name?: string | undefined;
    phone?: string | null | undefined;
    notes?: string | null | undefined;
    plan?: "TRIAL" | "STANDARD" | "ENTERPRISE" | undefined;
    seats?: number | undefined;
}>;
export declare const labOrganizationSchema: z.ZodObject<{
    organizationId: z.ZodNullable<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    organizationId: string | null;
}, {
    organizationId: string | null;
}>;
export declare const acceptInviteSchema: z.ZodObject<{
    token: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    token: string;
}, {
    password: string;
    token: string;
}>;
export declare const platformLabQuerySchema: z.ZodObject<{
    organizationId: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<["ACTIVE", "SUSPENDED", "ONBOARDING"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "ACTIVE" | "ONBOARDING" | "SUSPENDED" | undefined;
    organizationId?: string | undefined;
}, {
    status?: "ACTIVE" | "ONBOARDING" | "SUSPENDED" | undefined;
    organizationId?: string | undefined;
}>;
//# sourceMappingURL=platform.d.ts.map