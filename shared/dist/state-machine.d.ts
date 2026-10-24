import { type CaseStatus, type PhysicalEntityType, type PhysicalState, type Station } from './constants';
import { stateMachineRegistry, type StateMachineDefinition } from './state-machine-registry';
export { stateMachineRegistry, type StateMachineDefinition };
export declare const PHYSICAL_TRANSITIONS: Record<"SPECIMEN" | "BLOCK" | "SLIDE", Partial<Record<"REPORTED" | "ACCESSIONED" | "GROSSED" | "PROCESSING" | "EMBEDDED" | "CUT" | "STAINED" | "WITH_PATHOLOGIST" | "ARCHIVED" | "RECUT_REQUESTED" | "REJECTED", readonly ("REPORTED" | "ACCESSIONED" | "GROSSED" | "PROCESSING" | "EMBEDDED" | "CUT" | "STAINED" | "WITH_PATHOLOGIST" | "ARCHIVED" | "RECUT_REQUESTED" | "REJECTED")[]>>>;
export declare const CASE_TRANSITIONS: Record<CaseStatus, readonly CaseStatus[]>;
export declare const CASE_STATUS_RANK: Record<CaseStatus, number>;
export interface TransitionCheck {
    ok: boolean;
    reason?: string;
}
export declare function isPhysicalEntityType(value: string): value is PhysicalEntityType;
export declare function allowedNextStates(entityType: PhysicalEntityType, from: PhysicalState): readonly PhysicalState[];
export declare function canTransition(entityType: PhysicalEntityType, from: PhysicalState, to: PhysicalState): boolean;
export declare function checkTransition(entityType: PhysicalEntityType, from: PhysicalState, to: PhysicalState): TransitionCheck;
export declare function canCaseTransition(from: CaseStatus, to: CaseStatus): boolean;
/** The state a station advances an entity to, if that entity type is handled there. */
export declare function stationTarget(entityType: PhysicalEntityType, station: Station): PhysicalState | null;
/**
 * Infer the event a plain scan at a station should produce. Explicit events
 * (rejection, recut request) bypass this and are validated separately.
 */
export declare function inferScanTarget(entityType: PhysicalEntityType, station: Station, current: PhysicalState): PhysicalState | null;
export declare function scanNextHint(state: PhysicalState): string;
//# sourceMappingURL=state-machine.d.ts.map