"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CASE_STATUS_RANK = exports.CASE_TRANSITIONS = exports.PHYSICAL_TRANSITIONS = exports.stateMachineRegistry = void 0;
exports.isPhysicalEntityType = isPhysicalEntityType;
exports.allowedNextStates = allowedNextStates;
exports.canTransition = canTransition;
exports.checkTransition = checkTransition;
exports.canCaseTransition = canCaseTransition;
exports.stationTarget = stationTarget;
exports.inferScanTarget = inferScanTarget;
exports.scanNextHint = scanNextHint;
const constants_1 = require("./constants");
const state_machine_registry_1 = require("./state-machine-registry");
Object.defineProperty(exports, "stateMachineRegistry", { enumerable: true, get: function () { return state_machine_registry_1.stateMachineRegistry; } });
exports.PHYSICAL_TRANSITIONS = state_machine_registry_1.HISTOPATHOLOGY_PHYSICAL_TRANSITIONS;
exports.CASE_TRANSITIONS = {
    RECEIVED: ['IN_PROGRESS'],
    IN_PROGRESS: ['PENDING_REVIEW', 'REPORTED'],
    PENDING_REVIEW: ['REPORTED'],
    REPORTED: ['AMENDED'],
    AMENDED: [],
};
exports.CASE_STATUS_RANK = {
    RECEIVED: 0,
    IN_PROGRESS: 1,
    PENDING_REVIEW: 2,
    REPORTED: 3,
    AMENDED: 4,
};
function isPhysicalEntityType(value) {
    return value === 'SPECIMEN' || value === 'BLOCK' || value === 'SLIDE';
}
function allowedNextStates(entityType, from) {
    return exports.PHYSICAL_TRANSITIONS[entityType][from] ?? [];
}
function canTransition(entityType, from, to) {
    return allowedNextStates(entityType, from).includes(to);
}
function checkTransition(entityType, from, to) {
    if (canTransition(entityType, from, to)) {
        return { ok: true };
    }
    const allowed = allowedNextStates(entityType, from);
    const allowedText = allowed.length > 0
        ? allowed.map((state) => constants_1.PHYSICAL_STATE_LABELS[state]).join(', ')
        : 'none — this item is at the end of its workflow';
    return {
        ok: false,
        reason: `${constants_1.PHYSICAL_STATE_LABELS[from]} cannot move to ${constants_1.PHYSICAL_STATE_LABELS[to]}. Allowed next: ${allowedText}.`,
    };
}
function canCaseTransition(from, to) {
    return exports.CASE_TRANSITIONS[from].includes(to);
}
/** The state a station advances an entity to, if that entity type is handled there. */
function stationTarget(entityType, station) {
    return constants_1.STATION_TARGET[station][entityType] ?? null;
}
/**
 * Infer the event a plain scan at a station should produce. Explicit events
 * (rejection, recut request) bypass this and are validated separately.
 */
function inferScanTarget(entityType, station, current) {
    if (entityType === 'SLIDE' && station === 'MICROTOMY' && current === 'RECUT_REQUESTED') {
        return 'CUT';
    }
    const target = stationTarget(entityType, station);
    if (target && canTransition(entityType, current, target)) {
        return target;
    }
    return null;
}
function scanNextHint(state) {
    switch (state) {
        case 'GROSSED':
            return 'Cassette confirmed at grossing. Move it to the processor.';
        case 'PROCESSING':
            return 'Processing started. Embed the cassette when the run is complete.';
        case 'EMBEDDED':
            return 'Block embedded. Cut slides at microtomy.';
        case 'CUT':
            return 'Block cut. Stain the slides and scan them at staining.';
        case 'STAINED':
            return 'Slide stained. Scan it onto the pathologist desk.';
        case 'WITH_PATHOLOGIST':
            return 'On the pathologist desk. Review and create the synoptic report.';
        case 'REPORTED':
            return 'Reported. Archive the physical item when the case is closed.';
        case 'RECUT_REQUESTED':
            return 'Recut requested. Cut a new section at microtomy and re-stain.';
        case 'REJECTED':
            return 'Rejected. Record the reason and escalate to the laboratory administrator.';
        case 'ARCHIVED':
            return 'Archived. This item is at the end of its workflow.';
        case 'ACCESSIONED':
            return 'Accessioned. Advance it at the next station.';
        default:
            return 'Scan accepted.';
    }
}
//# sourceMappingURL=state-machine.js.map