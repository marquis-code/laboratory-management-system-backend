"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.microbiologyDefinition = microbiologyDefinition;
const shared_1 = require("@lims/shared");
function microbiologyDefinition() {
    return {
        id: 'MICROBIOLOGY',
        label: 'Medical microbiology',
        shortLabel: 'Micro',
        stateMachines: shared_1.stateMachineRegistry.forDiscipline('MICROBIOLOGY'),
        worklistConfigs: [
            {
                id: 'microbiology-cultures',
                discipline: 'MICROBIOLOGY',
                label: 'Culture bench',
                defaultStatuses: ['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW'],
                sort: ['priority', 'tatDeadline', 'receivedAt'],
                columns: ['accession', 'patient', 'specimen', 'culture', 'status'],
            },
        ],
        resultSchemas: {
            CULTURE: [{ key: 'culture', label: 'Culture and susceptibility', type: 'culture' }],
        },
        ruleTypes: [],
        reportTemplates: ['microbiology-final'],
        routes: [],
    };
}
//# sourceMappingURL=discipline.js.map