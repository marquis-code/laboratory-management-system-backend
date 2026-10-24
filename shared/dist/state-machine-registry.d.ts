import { type Discipline, type PhysicalEntityType, type PhysicalState } from './constants';
export interface StateMachineDefinition {
    discipline: Discipline;
    entityType: string;
    label: string;
    initial: string;
    transitions: Record<string, readonly string[]>;
    labels?: Record<string, string>;
}
type TransitionTable = Partial<Record<PhysicalState, readonly PhysicalState[]>>;
export declare const HISTOPATHOLOGY_PHYSICAL_TRANSITIONS: Record<PhysicalEntityType, TransitionTable>;
export declare class StateMachineRegistry {
    private readonly machines;
    register(definition: StateMachineDefinition): void;
    registerMany(definitions: StateMachineDefinition[]): void;
    has(discipline: Discipline, entityType: string): boolean;
    get(discipline: Discipline, entityType: string): StateMachineDefinition | null;
    allowed(discipline: Discipline, entityType: string, from: string): readonly string[];
    can(discipline: Discipline, entityType: string, from: string, to: string): boolean;
    check(discipline: Discipline, entityType: string, from: string, to: string): {
        ok: boolean;
        reason?: string;
    };
    forDiscipline(discipline: Discipline): StateMachineDefinition[];
    list(): StateMachineDefinition[];
    private key;
}
export declare const stateMachineRegistry: StateMachineRegistry;
export {};
//# sourceMappingURL=state-machine-registry.d.ts.map