"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAstm = parseAstm;
exports.parseHl7Oru = parseHl7Oru;
exports.parseInstrumentMessage = parseInstrumentMessage;
/* eslint-disable no-control-regex */
function clean(value) {
    return value
        .replace(/^\x0b/, '')
        .replace(/\x1c\r?$/, '')
        .trim();
}
/* eslint-enable no-control-regex */
function parseAstm(raw) {
    const records = clean(raw)
        .split(/\r\n|\r|\n/)
        .map((line) => line.trim())
        .filter(Boolean);
    let accessionNumber = null;
    let patientName = null;
    let testCode = null;
    const values = [];
    for (const record of records) {
        const fields = record.split('|');
        const type = fields[0] ?? '';
        if (type === 'P') {
            const name = fields[5] ?? '';
            patientName = name.replace(/\^/g, ' ').trim() || null;
        }
        else if (type === 'O') {
            accessionNumber = fields[2]?.trim() || accessionNumber;
        }
        else if (type === 'R') {
            const testField = fields[2] ?? '';
            const codeParts = testField.split('^');
            const code = codeParts.find(Boolean) ?? null;
            const value = fields[3]?.trim() ?? '';
            if (code && value && value !== '') {
                testCode ??= code;
                values.push({ code, value, unit: fields[4]?.trim() || null });
            }
        }
    }
    return { protocol: 'ASTM', accessionNumber, testCode, patientName, values };
}
function parseHl7Oru(raw) {
    const segments = clean(raw)
        .split(/\r\n|\r|\n|\r/)
        .map((line) => line.trim())
        .filter(Boolean);
    let accessionNumber = null;
    let patientName = null;
    let testCode = null;
    const values = [];
    for (const segment of segments) {
        const fields = segment.split('|');
        const type = fields[0] ?? '';
        if (type === 'PID') {
            const name = fields[5] ?? '';
            const parts = name.split('^');
            patientName = parts.filter(Boolean).slice(0, 2).join(' ').trim() || null;
        }
        else if (type === 'OBR') {
            accessionNumber =
                fields[3]?.split('^')[0]?.trim() || fields[2]?.split('^')[0]?.trim() || accessionNumber;
        }
        else if (type === 'OBX') {
            const test = fields[3]?.split('^') ?? [];
            const code = test[0]?.trim() || null;
            const value = fields[5]?.trim() ?? '';
            if (code && value) {
                testCode ??= code;
                values.push({ code, value, unit: fields[6]?.trim() || null });
            }
        }
    }
    return { protocol: 'HL7', accessionNumber, testCode, patientName, values };
}
function parseInstrumentMessage(protocol, raw) {
    return protocol === 'ASTM' ? parseAstm(raw) : parseHl7Oru(raw);
}
//# sourceMappingURL=instrument.parser.js.map