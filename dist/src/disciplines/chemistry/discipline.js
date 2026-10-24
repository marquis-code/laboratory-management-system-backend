"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chemistryDefinition = chemistryDefinition;
const shared_1 = require("@lims/shared");
function chemistryDefinition() {
    return {
        id: 'CHEMICAL_PATHOLOGY',
        label: 'Chemical pathology',
        shortLabel: 'Chem',
        stateMachines: shared_1.stateMachineRegistry.forDiscipline('CHEMICAL_PATHOLOGY'),
        worklistConfigs: [
            {
                id: 'chemistry-results',
                discipline: 'CHEMICAL_PATHOLOGY',
                label: 'Chemistry results',
                defaultStatuses: ['COLLECTED', 'RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW'],
                sort: ['priority', 'tatDeadline', 'receivedAt'],
                columns: ['accession', 'patient', 'panel', 'status', 'tat'],
            },
        ],
        resultSchemas: {
            CHEM: [
                { key: 'sodium', label: 'Sodium', type: 'numeric' },
                { key: 'potassium', label: 'Potassium', type: 'numeric' },
                { key: 'creatinine', label: 'Creatinine', type: 'numeric' },
            ],
        },
        ruleTypes: [],
        reportTemplates: ['chemistry-cumulative'],
        routes: [],
    };
}
//# sourceMappingURL=discipline.js.map