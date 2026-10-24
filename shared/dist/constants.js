"use strict";
/**
 * Domain vocabulary shared by the API and the web client.
 * These tuples are the single source of truth; statuses are never free text.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.STAIN_QC_RESULTS = exports.STAIN_RUN_STATUSES = exports.LOT_VALIDATION_STATUSES = exports.REAGENT_LOT_STATUS_LABELS = exports.REAGENT_LOT_STATUSES = exports.REAGENT_CATEGORY_LABELS = exports.REAGENT_CATEGORIES = exports.REFERRAL_STATUSES = exports.PORTAL_TOKEN_TYPES = exports.NOTIFICATION_STATUSES = exports.NOTIFICATION_CHANNELS = exports.MAX_SLIDE_COUNT = exports.MAX_BLOCK_COUNT = exports.DEFAULT_ACCESSION_PREFIX = exports.DEFAULT_ACCESSION_FORMAT = exports.LABEL_SYMBOLOGIES = exports.LABEL_FORMATS = exports.BARCODE_PREFIXES = exports.AUDIT_ACTIONS = exports.ROLE_CAPABILITIES = exports.CAPABILITIES = exports.LATERALITY_LABELS = exports.LATERALITIES = exports.SPECIMEN_TYPE_PRESETS = exports.SUBSPECIALTIES = exports.SEX_LABELS = exports.SEXES = exports.REPORT_STATUS_LABELS = exports.REPORT_STATUSES = exports.STAIN_TYPE_LABELS = exports.STAIN_TYPES = exports.STATION_ROLES = exports.STATION_TARGET = exports.STATION_DESCRIPTIONS = exports.STATION_LABELS = exports.STATIONS = exports.CASE_EVENT_TYPES = exports.PHYSICAL_STATE_LABELS = exports.PHYSICAL_STATES = exports.CUSTODY_ENTITY_TYPES = exports.PHYSICAL_ENTITY_TYPES = exports.DEFAULT_TAT_WARNING_PERCENT = exports.DEFAULT_TAT_HOURS = exports.PRIORITY_RANK = exports.PRIORITY_LABELS = exports.PRIORITIES = exports.CASE_STATUS_LABELS = exports.CASE_STATUSES = exports.ROLE_LABELS = exports.ROLES = void 0;
exports.BREAKPOINT_STANDARDS = exports.AST_INTERPRETATION_LABELS = exports.AST_INTERPRETATIONS = exports.AST_METHODS = exports.ORGANISM_GRAMS = exports.CONSIGNMENT_STATUS_LABELS = exports.CONSIGNMENT_STATUSES = exports.QC_LEVELS = exports.QC_STATUSES = exports.WESTGARD_RULE_LABELS = exports.WESTGARD_RULES = exports.RULE_ACTION_LABELS = exports.RULE_ACTIONS = exports.RULE_TRIGGERS = exports.RESULT_FLAG_LABELS = exports.RESULT_FLAGS = exports.RESULT_STATUS_LABELS = exports.RESULT_STATUSES = exports.RESULT_TYPES = exports.CLINICAL_ROLES = exports.DISCIPLINE_STATE_LABELS = exports.MICROBIOLOGY_CULTURE_STATES = exports.CHEMISTRY_SAMPLE_STATES = exports.HAEMATOLOGY_SAMPLE_STATES = exports.TEST_REQUEST_STATUS_LABELS = exports.TEST_REQUEST_STATUSES = exports.DISCIPLINE_ACCESSION_PREFIXES = exports.DISCIPLINE_SHORT_LABELS = exports.DISCIPLINE_LABELS = exports.DISCIPLINES = exports.SYNC_MUTATION_TYPES = exports.CLAIM_STATUSES = exports.PAYMENT_MODES = exports.PAYMENT_STATUSES = exports.PAYMENT_PROVIDERS = exports.INVOICE_STATUS_LABELS = exports.INVOICE_STATUSES = exports.PAYER_TYPE_LABELS = exports.PAYER_TYPES = exports.WSI_STATUSES = exports.CODING_SYSTEM_LABELS = exports.CODING_SYSTEMS = exports.DEFAULT_QA_SAMPLING_PERCENT = exports.QA_SEVERITIES = exports.QA_DISCREPANCY_LABELS = exports.QA_DISCREPANCY_CODES = exports.QA_REVIEW_STATUSES = exports.QA_REVIEW_TYPES = exports.REJECTION_REASON_LABELS = exports.REJECTION_REASON_CODES = void 0;
exports.LEAD_STATUSES = exports.LEAD_TYPES = exports.ONBOARDING_STEPS = exports.SUBSCRIPTION_PLAN_LABELS = exports.SUBSCRIPTION_PLANS = exports.ORGANIZATION_STATUSES = exports.ORGANIZATION_TYPES = exports.INSTRUMENT_MESSAGE_STATUSES = exports.INSTRUMENT_PROTOCOLS = exports.SEND_OUT_STATUSES = exports.CAPA_STATUSES = exports.NC_SEVERITIES = exports.NC_STATUSES = exports.EQUIPMENT_STATUSES = exports.MICROBIOLOGY_CULTURE_STATUS_LABELS = void 0;
exports.roleHasCapability = roleHasCapability;
exports.isClinicalRole = isClinicalRole;
exports.ROLES = [
    'SUPER_ADMIN',
    'LAB_ADMIN',
    'RECEPTIONIST',
    'PHLEBOTOMIST',
    'GROSSER',
    'TECHNOLOGIST',
    'SCIENTIST',
    'PATHOLOGIST',
    'REFERRER',
];
exports.ROLE_LABELS = {
    SUPER_ADMIN: 'Super administrator',
    LAB_ADMIN: 'Laboratory administrator',
    RECEPTIONIST: 'Receptionist',
    PHLEBOTOMIST: 'Phlebotomist',
    GROSSER: 'Grossing officer',
    TECHNOLOGIST: 'Medical laboratory scientist',
    SCIENTIST: 'Laboratory scientist',
    PATHOLOGIST: 'Pathologist',
    REFERRER: 'Referring clinician',
};
exports.CASE_STATUSES = [
    'RECEIVED',
    'IN_PROGRESS',
    'PENDING_REVIEW',
    'REPORTED',
    'AMENDED',
];
exports.CASE_STATUS_LABELS = {
    RECEIVED: 'Received',
    IN_PROGRESS: 'In progress',
    PENDING_REVIEW: 'Pending review',
    REPORTED: 'Reported',
    AMENDED: 'Amended',
};
exports.PRIORITIES = ['ROUTINE', 'URGENT', 'FROZEN'];
exports.PRIORITY_LABELS = {
    ROUTINE: 'Routine',
    URGENT: 'Urgent',
    FROZEN: 'Frozen section',
};
/** Frozen first, then urgent, then routine. Stored on the case for index-friendly sorting. */
exports.PRIORITY_RANK = {
    FROZEN: 0,
    URGENT: 1,
    ROUTINE: 2,
};
/** Default TAT windows in hours; each lab can override these in settings. */
exports.DEFAULT_TAT_HOURS = {
    FROZEN: 1,
    URGENT: 24,
    ROUTINE: 72,
};
exports.DEFAULT_TAT_WARNING_PERCENT = 80;
exports.PHYSICAL_ENTITY_TYPES = ['SPECIMEN', 'BLOCK', 'SLIDE'];
exports.CUSTODY_ENTITY_TYPES = ['SPECIMEN', 'BLOCK', 'SLIDE', 'CASE'];
/** States of a physical entity. The value is always derived from the latest custody event. */
exports.PHYSICAL_STATES = [
    'ACCESSIONED',
    'GROSSED',
    'PROCESSING',
    'EMBEDDED',
    'CUT',
    'STAINED',
    'WITH_PATHOLOGIST',
    'REPORTED',
    'ARCHIVED',
    'RECUT_REQUESTED',
    'REJECTED',
];
exports.PHYSICAL_STATE_LABELS = {
    ACCESSIONED: 'Accessioned',
    GROSSED: 'Grossed',
    PROCESSING: 'Processing',
    EMBEDDED: 'Embedded',
    CUT: 'Cut',
    STAINED: 'Stained',
    WITH_PATHOLOGIST: 'With pathologist',
    REPORTED: 'Reported',
    ARCHIVED: 'Archived',
    RECUT_REQUESTED: 'Recut requested',
    REJECTED: 'Rejected',
};
exports.CASE_EVENT_TYPES = ['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW', 'AMENDED'];
exports.STATIONS = [
    'GROSSING',
    'PROCESSING',
    'EMBEDDING',
    'MICROTOMY',
    'STAINING',
    'PATHOLOGIST',
    'ARCHIVE',
];
exports.STATION_LABELS = {
    GROSSING: 'Grossing',
    PROCESSING: 'Processing',
    EMBEDDING: 'Embedding',
    MICROTOMY: 'Microtomy',
    STAINING: 'Staining',
    PATHOLOGIST: 'Pathologist desk',
    ARCHIVE: 'Archive',
};
exports.STATION_DESCRIPTIONS = {
    GROSSING: 'Confirm specimens and scan cassettes after grossing',
    PROCESSING: 'Move cassettes into the processor',
    EMBEDDING: 'Scan cassettes after wax embedding',
    MICROTOMY: 'Scan blocks before cutting; cut and label slides',
    STAINING: 'Scan every slide through H&E or special stains',
    PATHOLOGIST: 'Scan slides onto your desk for review',
    ARCHIVE: 'Archive reported blocks and slides',
};
exports.STATION_TARGET = {
    GROSSING: { SPECIMEN: 'GROSSED', BLOCK: 'GROSSED' },
    PROCESSING: { BLOCK: 'PROCESSING' },
    EMBEDDING: { BLOCK: 'EMBEDDED' },
    MICROTOMY: { BLOCK: 'CUT', SLIDE: 'CUT' },
    STAINING: { SLIDE: 'STAINED' },
    PATHOLOGIST: { SLIDE: 'WITH_PATHOLOGIST' },
    ARCHIVE: { BLOCK: 'ARCHIVED', SLIDE: 'ARCHIVED' },
};
exports.STATION_ROLES = {
    GROSSING: ['GROSSER', 'LAB_ADMIN', 'SUPER_ADMIN'],
    PROCESSING: ['TECHNOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'],
    EMBEDDING: ['TECHNOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'],
    MICROTOMY: ['TECHNOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'],
    STAINING: ['TECHNOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'],
    PATHOLOGIST: ['PATHOLOGIST', 'SUPER_ADMIN'],
    ARCHIVE: ['TECHNOLOGIST', 'LAB_ADMIN', 'SUPER_ADMIN'],
};
exports.STAIN_TYPES = ['H_AND_E', 'SPECIAL', 'IMMUNOHISTOCHEMISTRY'];
exports.STAIN_TYPE_LABELS = {
    H_AND_E: 'H&E',
    SPECIAL: 'Special stain',
    IMMUNOHISTOCHEMISTRY: 'Immunohistochemistry',
};
exports.REPORT_STATUSES = ['DRAFT', 'SIGNED_OUT', 'AMENDED'];
exports.REPORT_STATUS_LABELS = {
    DRAFT: 'Draft',
    SIGNED_OUT: 'Signed out',
    AMENDED: 'Amended',
};
exports.SEXES = ['FEMALE', 'MALE', 'OTHER', 'UNKNOWN'];
exports.SEX_LABELS = {
    FEMALE: 'Female',
    MALE: 'Male',
    OTHER: 'Other',
    UNKNOWN: 'Unknown',
};
exports.SUBSPECIALTIES = [
    'Breast',
    'Gastrointestinal',
    'Urology',
    'Gynaecology',
    'Dermatopathology',
    'Haematopathology',
    'Neuropathology',
    'Paediatric pathology',
    'Head and neck',
    'Other',
];
exports.SPECIMEN_TYPE_PRESETS = [
    'Core biopsy',
    'Incision biopsy',
    'Excision biopsy',
    'Wide local excision',
    'Mastectomy',
    'Hysterectomy',
    'Colectomy',
    'Gastrectomy',
    'Prostatectomy',
    'TURP chips',
    'Lymph node',
    'Cytology cell block',
    'Product of conception',
    'Other',
];
exports.LATERALITIES = ['LEFT', 'RIGHT', 'BILATERAL', 'NOT_APPLICABLE'];
exports.LATERALITY_LABELS = {
    LEFT: 'Left',
    RIGHT: 'Right',
    BILATERAL: 'Bilateral',
    NOT_APPLICABLE: 'Not applicable',
};
exports.CAPABILITIES = [
    'dashboard',
    'accession',
    'cases',
    'scan',
    'grossing',
    'lab_work',
    'pathologist_desk',
    'reports',
    'worklist',
    'locator',
    'labels',
    'admin',
    'audit',
    'referrer',
    'inventory',
    'qa',
    'billing',
    'interop',
    'collection',
    'results',
    'verification',
    'disciplines',
    'qc',
    'microbiology',
    'quality',
    'platform',
];
exports.ROLE_CAPABILITIES = {
    SUPER_ADMIN: exports.CAPABILITIES,
    LAB_ADMIN: [
        'dashboard',
        'accession',
        'cases',
        'scan',
        'grossing',
        'lab_work',
        'reports',
        'worklist',
        'locator',
        'labels',
        'admin',
        'audit',
        'inventory',
        'qa',
        'billing',
        'interop',
        'collection',
        'results',
        'verification',
        'disciplines',
        'qc',
        'microbiology',
        'quality',
    ],
    RECEPTIONIST: ['dashboard', 'accession', 'cases', 'locator', 'labels', 'billing', 'collection'],
    PHLEBOTOMIST: ['dashboard', 'cases', 'locator', 'labels', 'collection'],
    GROSSER: ['dashboard', 'cases', 'scan', 'grossing', 'locator', 'labels'],
    TECHNOLOGIST: [
        'dashboard',
        'cases',
        'scan',
        'lab_work',
        'locator',
        'labels',
        'inventory',
        'results',
        'qc',
        'microbiology',
        'quality',
    ],
    SCIENTIST: [
        'dashboard',
        'cases',
        'scan',
        'lab_work',
        'locator',
        'labels',
        'results',
        'verification',
        'qc',
        'microbiology',
    ],
    PATHOLOGIST: [
        'dashboard',
        'cases',
        'scan',
        'pathologist_desk',
        'reports',
        'worklist',
        'locator',
        'labels',
        'qa',
        'results',
        'verification',
        'disciplines',
        'qc',
        'microbiology',
        'quality',
    ],
    REFERRER: ['referrer'],
};
function roleHasCapability(role, capability) {
    return exports.ROLE_CAPABILITIES[role].includes(capability);
}
exports.AUDIT_ACTIONS = [
    'CREATE',
    'UPDATE',
    'DELETE',
    'SCAN',
    'SIGN_OUT',
    'AMEND',
    'LOGIN',
    'LOGOUT',
    'RELEASE',
    'PAYMENT',
    'WEBHOOK',
    'SYNC',
    'QA',
    'EXPORT',
    'NOTIFY',
    'IMPORT',
];
/** Barcode prefixes are intentionally short for 2D symbol density. */
exports.BARCODE_PREFIXES = {
    SPECIMEN: 'SP',
    BLOCK: 'BL',
    SLIDE: 'SL',
};
exports.LABEL_FORMATS = ['pdf', 'zpl', 'svg'];
exports.LABEL_SYMBOLOGIES = ['datamatrix', 'qr'];
exports.DEFAULT_ACCESSION_FORMAT = '{PREFIX}-{YYYY}-{SEQ:6}';
exports.DEFAULT_ACCESSION_PREFIX = 'HP';
exports.MAX_BLOCK_COUNT = 30;
exports.MAX_SLIDE_COUNT = 20;
// ─────────────────────────────────────────────────────────────
// Phase 2 — notifications, referral access, inventory and QA
// ─────────────────────────────────────────────────────────────
exports.NOTIFICATION_CHANNELS = ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'];
exports.NOTIFICATION_STATUSES = ['QUEUED', 'SENDING', 'SENT', 'FAILED', 'SKIPPED'];
exports.PORTAL_TOKEN_TYPES = ['MAGIC_LINK', 'OTP'];
exports.REFERRAL_STATUSES = [
    'RECEIVED',
    'IN_PROGRESS',
    'READY',
    'RELEASED',
    'AMENDED',
];
exports.REAGENT_CATEGORIES = ['REAGENT', 'ANTIBODY', 'CONSUMABLE'];
exports.REAGENT_CATEGORY_LABELS = {
    REAGENT: 'Reagent',
    ANTIBODY: 'Antibody',
    CONSUMABLE: 'Consumable',
};
exports.REAGENT_LOT_STATUSES = [
    'QUARANTINED',
    'ACTIVE',
    'EXPIRED',
    'DEPLETED',
    'REJECTED',
];
exports.REAGENT_LOT_STATUS_LABELS = {
    QUARANTINED: 'Quarantined',
    ACTIVE: 'Active',
    EXPIRED: 'Expired',
    DEPLETED: 'Depleted',
    REJECTED: 'Rejected',
};
exports.LOT_VALIDATION_STATUSES = ['PENDING', 'VALIDATED', 'FAILED'];
exports.STAIN_RUN_STATUSES = ['PLANNED', 'RUNNING', 'COMPLETED', 'FAILED', 'QC_HOLD'];
exports.STAIN_QC_RESULTS = ['PENDING', 'PASS', 'FAIL'];
exports.REJECTION_REASON_CODES = [
    'MISLABELLED',
    'WRONG_CONTAINER',
    'FIXATION_DELAY',
    'INSUFFICIENT_TISSUE',
    'CONTAMINATION',
    'BROKEN_SLIDE',
    'LOST_IN_PROCESSING',
    'UNREPRESENTATIVE',
    'OTHER',
];
exports.REJECTION_REASON_LABELS = {
    MISLABELLED: 'Mislabelled or unidentified',
    WRONG_CONTAINER: 'Wrong container or fixative',
    FIXATION_DELAY: 'Fixation delay',
    INSUFFICIENT_TISSUE: 'Insufficient tissue',
    CONTAMINATION: 'Contamination',
    BROKEN_SLIDE: 'Broken slide',
    LOST_IN_PROCESSING: 'Lost in processing',
    UNREPRESENTATIVE: 'Unrepresentative sample',
    OTHER: 'Other (explain)',
};
exports.QA_REVIEW_TYPES = ['PEER_REVIEW', 'SECOND_OPINION', 'DISCREPANCY'];
exports.QA_REVIEW_STATUSES = [
    'PENDING',
    'ASSIGNED',
    'IN_REVIEW',
    'AGREED',
    'DISCREPANT',
    'CLOSED',
    'CANCELLED',
];
exports.QA_DISCREPANCY_CODES = [
    'NONE',
    'MAJOR_DIAGNOSTIC',
    'MINOR_DIAGNOSTIC',
    'GRADING',
    'STAGING',
    'BIOMARKER',
    'MARGIN',
    'LYMPH_NODE',
    'TRANSCRIPTION',
    'OTHER',
];
exports.QA_DISCREPANCY_LABELS = {
    NONE: 'No discrepancy',
    MAJOR_DIAGNOSTIC: 'Major diagnostic disagreement',
    MINOR_DIAGNOSTIC: 'Minor diagnostic disagreement',
    GRADING: 'Grade disagreement',
    STAGING: 'Stage disagreement',
    BIOMARKER: 'Biomarker / IHC disagreement',
    MARGIN: 'Margin disagreement',
    LYMPH_NODE: 'Lymph node count disagreement',
    TRANSCRIPTION: 'Transcription error',
    OTHER: 'Other',
};
exports.QA_SEVERITIES = ['MINOR', 'MAJOR', 'CRITICAL'];
exports.DEFAULT_QA_SAMPLING_PERCENT = 10;
// ─────────────────────────────────────────────────────────────
// Phase 3 — coding, imaging, payments, sync and interoperability
// ─────────────────────────────────────────────────────────────
exports.CODING_SYSTEMS = ['SNOMED_CT', 'ICD_O_3_MORPHOLOGY', 'ICD_O_3_TOPOGRAPHY'];
exports.CODING_SYSTEM_LABELS = {
    SNOMED_CT: 'SNOMED CT',
    ICD_O_3_MORPHOLOGY: 'ICD-O-3 morphology',
    ICD_O_3_TOPOGRAPHY: 'ICD-O-3 topography',
};
exports.WSI_STATUSES = ['LINKED', 'PROCESSING', 'FAILED'];
exports.PAYER_TYPES = ['SELF', 'HMO', 'CORPORATE', 'INSURANCE', 'WAIVER'];
exports.PAYER_TYPE_LABELS = {
    SELF: 'Self-pay',
    HMO: 'HMO',
    CORPORATE: 'Corporate',
    INSURANCE: 'Insurance',
    WAIVER: 'Waiver',
};
exports.INVOICE_STATUSES = [
    'DRAFT',
    'ISSUED',
    'PARTIALLY_PAID',
    'PAID',
    'OVERDUE',
    'VOID',
];
exports.INVOICE_STATUS_LABELS = {
    DRAFT: 'Draft',
    ISSUED: 'Issued',
    PARTIALLY_PAID: 'Partially paid',
    PAID: 'Paid',
    OVERDUE: 'Overdue',
    VOID: 'Void',
};
exports.PAYMENT_PROVIDERS = ['PAYSTACK', 'FLUTTERWAVE', 'CASH', 'TRANSFER', 'HMO'];
exports.PAYMENT_STATUSES = ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'];
exports.PAYMENT_MODES = ['MOCK', 'LIVE'];
exports.CLAIM_STATUSES = [
    'DRAFT',
    'READY',
    'SUBMITTED',
    'ACCEPTED',
    'REJECTED',
    'PAID',
];
exports.SYNC_MUTATION_TYPES = ['SCAN', 'REJECT', 'RECUT'];
// ─────────────────────────────────────────────────────────────
// Multi-discipline platform
// ─────────────────────────────────────────────────────────────
exports.DISCIPLINES = [
    'HISTOPATHOLOGY',
    'HAEMATOLOGY',
    'CHEMICAL_PATHOLOGY',
    'MICROBIOLOGY',
];
exports.DISCIPLINE_LABELS = {
    HISTOPATHOLOGY: 'Histopathology',
    HAEMATOLOGY: 'Haematology',
    CHEMICAL_PATHOLOGY: 'Chemical pathology',
    MICROBIOLOGY: 'Medical microbiology',
};
exports.DISCIPLINE_SHORT_LABELS = {
    HISTOPATHOLOGY: 'Histo',
    HAEMATOLOGY: 'Haem',
    CHEMICAL_PATHOLOGY: 'Chem',
    MICROBIOLOGY: 'Micro',
};
/** Optional per-discipline prefix override; empty means use the lab accession prefix. */
exports.DISCIPLINE_ACCESSION_PREFIXES = {
    HISTOPATHOLOGY: 'HP',
    HAEMATOLOGY: 'HAE',
    CHEMICAL_PATHOLOGY: 'CHM',
    MICROBIOLOGY: 'MIC',
};
exports.TEST_REQUEST_STATUSES = [
    'RECEIVED',
    'COLLECTED',
    'IN_PROGRESS',
    'PENDING_REVIEW',
    'RESULTED',
    'VERIFIED',
    'RELEASED',
    'CANCELLED',
];
exports.TEST_REQUEST_STATUS_LABELS = {
    RECEIVED: 'Received',
    COLLECTED: 'Collected',
    IN_PROGRESS: 'In progress',
    PENDING_REVIEW: 'Pending review',
    RESULTED: 'Resulted',
    VERIFIED: 'Verified',
    RELEASED: 'Released',
    CANCELLED: 'Cancelled',
};
exports.HAEMATOLOGY_SAMPLE_STATES = [
    'COLLECTED',
    'RECEIVED',
    'ANALYSING',
    'RESULTED',
    'VERIFIED',
    'RELEASED',
    'REJECTED',
    'RERUN_REQUESTED',
];
exports.CHEMISTRY_SAMPLE_STATES = exports.HAEMATOLOGY_SAMPLE_STATES;
exports.MICROBIOLOGY_CULTURE_STATES = [
    'RECEIVED',
    'PLATED',
    'INCUBATING',
    'READ',
    'ID_DONE',
    'AST_DONE',
    'REPORTED',
    'REJECTED',
];
exports.DISCIPLINE_STATE_LABELS = {
    COLLECTED: 'Collected',
    RECEIVED: 'Received',
    ANALYSING: 'Analysing',
    RESULTED: 'Resulted',
    VERIFIED: 'Verified',
    RELEASED: 'Released',
    REJECTED: 'Rejected',
    RERUN_REQUESTED: 'Rerun requested',
    PLATED: 'Plated',
    INCUBATING: 'Incubating',
    READ: 'Read',
    ID_DONE: 'Identification done',
    AST_DONE: 'Susceptibility done',
    REPORTED: 'Reported',
};
/** All roles that are scoped to one or more disciplines. */
exports.CLINICAL_ROLES = ['GROSSER', 'TECHNOLOGIST', 'SCIENTIST', 'PATHOLOGIST'];
function isClinicalRole(role) {
    return exports.CLINICAL_ROLES.includes(role);
}
// ─────────────────────────────────────────────────────────────
// Phase 2 — results, catalogue, rules and QC
// ─────────────────────────────────────────────────────────────
exports.RESULT_TYPES = ['NUMERIC', 'CODED', 'TEXT', 'CALCULATED'];
exports.RESULT_STATUSES = ['DRAFT', 'RESULTED', 'VERIFIED', 'RELEASED', 'CANCELLED'];
exports.RESULT_STATUS_LABELS = {
    DRAFT: 'Draft',
    RESULTED: 'Resulted',
    VERIFIED: 'Verified',
    RELEASED: 'Released',
    CANCELLED: 'Cancelled',
};
exports.RESULT_FLAGS = [
    'NORMAL',
    'LOW',
    'HIGH',
    'CRITICAL_LOW',
    'CRITICAL_HIGH',
    'ABNORMAL',
];
exports.RESULT_FLAG_LABELS = {
    NORMAL: 'Normal',
    LOW: 'Low',
    HIGH: 'High',
    CRITICAL_LOW: 'Critical low',
    CRITICAL_HIGH: 'Critical high',
    ABNORMAL: 'Abnormal',
};
exports.RULE_TRIGGERS = ['RESULT_SAVE', 'RESULT_VERIFY', 'RESULT_RELEASE'];
exports.RULE_ACTIONS = [
    'AUTO_VERIFY',
    'CRITICAL_ALERT',
    'REFLEX_TEST',
    'DELTA_CHECK',
    'CASCADE_ANTIBIOTIC',
    'REQUIRE_REVIEW',
];
exports.RULE_ACTION_LABELS = {
    AUTO_VERIFY: 'Auto-verify',
    CRITICAL_ALERT: 'Critical-value alert',
    REFLEX_TEST: 'Reflex test',
    DELTA_CHECK: 'Delta check',
    CASCADE_ANTIBIOTIC: 'Cascade antibiotic',
    REQUIRE_REVIEW: 'Require review',
};
exports.WESTGARD_RULES = ['1_3S', '2_2S', 'R_4S', '4_1S', '10X'];
exports.WESTGARD_RULE_LABELS = {
    '1_3S': '1₃s — one point beyond 3 SD',
    '2_2S': '2₂s — two consecutive beyond 2 SD, same side',
    R_4S: 'R₄s — range between two points exceeds 4 SD',
    '4_1S': '4₁s — four consecutive beyond 1 SD, same side',
    '10X': '10x — ten consecutive on one side of the mean',
};
exports.QC_STATUSES = ['ACCEPTED', 'WARNING', 'REJECTED'];
exports.QC_LEVELS = ['LOW', 'NORMAL', 'HIGH'];
exports.CONSIGNMENT_STATUSES = [
    'CREATED',
    'DISPATCHED',
    'IN_TRANSIT',
    'RECEIVED',
    'REJECTED',
];
exports.CONSIGNMENT_STATUS_LABELS = {
    CREATED: 'Created',
    DISPATCHED: 'Dispatched',
    IN_TRANSIT: 'In transit',
    RECEIVED: 'Received',
    REJECTED: 'Rejected',
};
// Phase 4 — microbiology
exports.ORGANISM_GRAMS = ['POSITIVE', 'NEGATIVE', 'YEAST', 'OTHER'];
exports.AST_METHODS = ['MIC', 'DISK'];
exports.AST_INTERPRETATIONS = ['S', 'I', 'R'];
exports.AST_INTERPRETATION_LABELS = {
    S: 'Susceptible',
    I: 'Intermediate',
    R: 'Resistant',
};
exports.BREAKPOINT_STANDARDS = ['CLSI', 'EUCAST'];
exports.MICROBIOLOGY_CULTURE_STATUS_LABELS = {
    RECEIVED: 'Received',
    PLATED: 'Plated',
    INCUBATING: 'Incubating',
    READ: 'Read',
    ID_DONE: 'Identification done',
    AST_DONE: 'AST done',
    REPORTED: 'Reported',
    REJECTED: 'Rejected',
};
// Phase 5 — quality management and send-outs
exports.EQUIPMENT_STATUSES = ['ACTIVE', 'MAINTENANCE', 'RETIRED'];
exports.NC_STATUSES = ['OPEN', 'INVESTIGATING', 'CAPA', 'CLOSED'];
exports.NC_SEVERITIES = ['MINOR', 'MAJOR', 'CRITICAL'];
exports.CAPA_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'];
exports.SEND_OUT_STATUSES = [
    'SENT',
    'IN_TRANSIT',
    'RECEIVED',
    'REPORTED',
    'CANCELLED',
];
exports.INSTRUMENT_PROTOCOLS = ['ASTM', 'HL7'];
exports.INSTRUMENT_MESSAGE_STATUSES = [
    'RECEIVED',
    'MATCHED',
    'UNMATCHED',
    'PROCESSED',
    'ERROR',
];
// B2B platform onboarding
exports.ORGANIZATION_TYPES = ['HOSPITAL', 'STANDALONE'];
exports.ORGANIZATION_STATUSES = ['ONBOARDING', 'ACTIVE', 'SUSPENDED'];
exports.SUBSCRIPTION_PLANS = ['TRIAL', 'STANDARD', 'ENTERPRISE'];
exports.SUBSCRIPTION_PLAN_LABELS = {
    TRIAL: 'Trial',
    STANDARD: 'Standard',
    ENTERPRISE: 'Enterprise',
};
exports.ONBOARDING_STEPS = [
    'organization',
    'laboratory',
    'administrator',
    'catalogue',
    'live',
];
exports.LEAD_TYPES = ['DEMO', 'TRIAL', 'SUPPORT'];
exports.LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'];
//# sourceMappingURL=constants.js.map