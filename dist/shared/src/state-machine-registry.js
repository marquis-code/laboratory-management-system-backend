"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stateMachineRegistry = exports.StateMachineRegistry = exports.HISTOPATHOLOGY_PHYSICAL_TRANSITIONS = void 0;
const constants_1 = require("./constants");
exports.HISTOPATHOLOGY_PHYSICAL_TRANSITIONS = {
    SPECIMEN: {
        ACCESSIONED: ['GROSSED', 'REJECTED'],
        GROSSED: ['ARCHIVED', 'REJECTED'],
    },
    BLOCK: {
        ACCESSIONED: ['GROSSED', 'REJECTED'],
        GROSSED: ['PROCESSING', 'REJECTED'],
        PROCESSING: ['EMBEDDED', 'REJECTED'],
        EMBEDDED: ['CUT', 'REJECTED'],
        CUT: ['REPORTED', 'ARCHIVED', 'REJECTED'],
        REPORTED: ['ARCHIVED'],
        REJECTED: ['PROCESSING', 'ARCHIVED'],
    },
    SLIDE: {
        ACCESSIONED: ['CUT', 'REJECTED'],
        CUT: ['STAINED', 'RECUT_REQUESTED', 'REJECTED'],
        STAINED: ['WITH_PATHOLOGIST', 'RECUT_REQUESTED', 'REJECTED'],
        WITH_PATHOLOGIST: ['REPORTED', 'RECUT_REQUESTED'],
        RECUT_REQUESTED: ['CUT'],
        REPORTED: ['ARCHIVED'],
        REJECTED: ['STAINED', 'ARCHIVED'],
    },
};
class StateMachineRegistry {
    machines = new Map();
    register(definition) {
        this.machines.set(this.key(definition.discipline, definition.entityType), definition);
    }
    registerMany(definitions) {
        for (const definition of definitions)
            this.register(definition);
    }
    has(discipline, entityType) {
        return this.machines.has(this.key(discipline, entityType));
    }
    get(discipline, entityType) {
        return this.machines.get(this.key(discipline, entityType)) ?? null;
    }
    allowed(discipline, entityType, from) {
        const machine = this.get(discipline, entityType);
        if (!machine)
            return [];
        return machine.transitions[from] ?? [];
    }
    can(discipline, entityType, from, to) {
        return this.allowed(discipline, entityType, from).includes(to);
    }
    check(discipline, entityType, from, to) {
        if (this.can(discipline, entityType, from, to))
            return { ok: true };
        const machine = this.get(discipline, entityType);
        const labels = (machine?.labels ?? constants_1.PHYSICAL_STATE_LABELS);
        const fromLabel = labels[from] ?? from;
        const toLabel = labels[to] ?? to;
        const allowed = this.allowed(discipline, entityType, from);
        const allowedText = allowed.length > 0
            ? allowed.map((state) => labels[state] ?? state).join(', ')
            : 'none — this item is at the end of its workflow';
        return {
            ok: false,
            reason: `${fromLabel} cannot move to ${toLabel}. Allowed next: ${allowedText}.`,
        };
    }
    forDiscipline(discipline) {
        return Array.from(this.machines.values()).filter((item) => item.discipline === discipline);
    }
    list() {
        return Array.from(this.machines.values());
    }
    key(discipline, entityType) {
        return `${discipline}:${entityType}`;
    }
}
exports.StateMachineRegistry = StateMachineRegistry;
exports.stateMachineRegistry = new StateMachineRegistry();
exports.stateMachineRegistry.registerMany([
    ...['SPECIMEN', 'BLOCK', 'SLIDE'].map((entityType) => ({
        discipline: 'HISTOPATHOLOGY',
        entityType,
        label: `${constants_1.DISCIPLINE_LABELS.HISTOPATHOLOGY} ${entityType.toLowerCase()}`,
        initial: 'ACCESSIONED',
        transitions: exports.HISTOPATHOLOGY_PHYSICAL_TRANSITIONS[entityType],
        labels: constants_1.PHYSICAL_STATE_LABELS,
    })),
    {
        discipline: 'HAEMATOLOGY',
        entityType: 'SAMPLE',
        label: 'Haematology sample',
        initial: 'COLLECTED',
        transitions: {
            COLLECTED: ['RECEIVED', 'REJECTED'],
            RECEIVED: ['ANALYSING', 'REJECTED'],
            ANALYSING: ['RESULTED', 'RERUN_REQUESTED', 'REJECTED'],
            RESULTED: ['VERIFIED', 'RERUN_REQUESTED'],
            VERIFIED: ['RELEASED'],
            RERUN_REQUESTED: ['ANALYSING'],
            REJECTED: ['RECEIVED'],
            RELEASED: [],
        },
        labels: Object.fromEntries(constants_1.HAEMATOLOGY_SAMPLE_STATES.map((state) => [state, state])),
    },
    {
        discipline: 'CHEMICAL_PATHOLOGY',
        entityType: 'SAMPLE',
        label: 'Chemistry sample',
        initial: 'COLLECTED',
        transitions: {
            COLLECTED: ['RECEIVED', 'REJECTED'],
            RECEIVED: ['ANALYSING', 'REJECTED'],
            ANALYSING: ['RESULTED', 'RERUN_REQUESTED', 'REJECTED'],
            RESULTED: ['VERIFIED', 'RERUN_REQUESTED'],
            VERIFIED: ['RELEASED'],
            RERUN_REQUESTED: ['ANALYSING'],
            REJECTED: ['RECEIVED'],
            RELEASED: [],
        },
        labels: Object.fromEntries(constants_1.CHEMISTRY_SAMPLE_STATES.map((state) => [state, state])),
    },
    {
        discipline: 'MICROBIOLOGY',
        entityType: 'CULTURE',
        label: 'Microbiology culture',
        initial: 'RECEIVED',
        transitions: {
            RECEIVED: ['PLATED', 'REJECTED'],
            PLATED: ['INCUBATING', 'REJECTED'],
            INCUBATING: ['READ', 'REJECTED'],
            READ: ['INCUBATING', 'ID_DONE', 'REPORTED'],
            ID_DONE: ['AST_DONE', 'REPORTED'],
            AST_DONE: ['REPORTED'],
            REPORTED: ['READ'],
            REJECTED: [],
        },
        labels: Object.fromEntries(constants_1.MICROBIOLOGY_CULTURE_STATES.map((state) => [state, state])),
    },
]);
//# sourceMappingURL=state-machine-registry.js.map