"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.histopathologyDefinition = histopathologyDefinition;
const shared_1 = require("@lims/shared");
function histopathologyDefinition() {
    return {
        id: 'HISTOPATHOLOGY',
        label: 'Histopathology',
        shortLabel: 'Histo',
        stateMachines: shared_1.stateMachineRegistry.forDiscipline('HISTOPATHOLOGY'),
        worklistConfigs: [
            {
                id: 'histopathology-pathologist',
                discipline: 'HISTOPATHOLOGY',
                label: 'Pathologist worklist',
                defaultStatuses: ['RECEIVED', 'IN_PROGRESS', 'PENDING_REVIEW'],
                sort: ['priority', 'tatDeadline', 'receivedAt'],
                columns: ['accession', 'patient', 'priority', 'slides', 'tat'],
            },
        ],
        resultSchemas: {
            SYNOPTIC: [
                { key: 'specimen', label: 'Specimen', type: 'synoptic', required: true },
                { key: 'diagnosis', label: 'Diagnosis', type: 'synoptic', required: true },
            ],
        },
        ruleTypes: [],
        reportTemplates: ['histopathology-synoptic'],
        routes: [
            { method: 'GET', path: '/api/cases', description: 'Case and specimen tracking' },
            { method: 'POST', path: '/api/custody/scan', description: 'Histopathology custody scan' },
            { method: 'GET', path: '/api/worklist', description: 'Pathologist worklist' },
            { method: 'GET', path: '/api/reports/:caseId', description: 'Synoptic report' },
        ],
    };
}
//# sourceMappingURL=discipline.js.map