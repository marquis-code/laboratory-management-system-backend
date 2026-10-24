"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SEQUENCE_WIDTH = void 0;
exports.validateAccessionFormat = validateAccessionFormat;
exports.formatAccession = formatAccession;
exports.formatMrn = formatMrn;
exports.specimenLetter = specimenLetter;
exports.blockLabel = blockLabel;
exports.slideLabel = slideLabel;
exports.normalizeBarcode = normalizeBarcode;
exports.fullName = fullName;
exports.DEFAULT_SEQUENCE_WIDTH = 6;
/**
 * Validate a per-lab accession format.
 * Supported tokens: {PREFIX}, {YYYY}, {YY}, {SEQ}, {SEQ:n} where n is 1..10.
 * The format must contain {SEQ} or {SEQ:n} so accession numbers stay collision-free.
 */
function validateAccessionFormat(format) {
    if (!format.trim())
        return 'Accession format is required.';
    if (format.length > 48)
        return 'Accession format must be 48 characters or fewer.';
    const tokenPattern = /\{([^{}]+)\}/g;
    let tokenCount = 0;
    let hasSequence = false;
    let match;
    while ((match = tokenPattern.exec(format)) !== null) {
        tokenCount += 1;
        const token = match[1] ?? '';
        if (token === 'PREFIX' || token === 'YYYY' || token === 'YY') {
            continue;
        }
        const seqMatch = /^SEQ(?::(\d{1,2}))?$/.exec(token);
        if (!seqMatch)
            return `Unknown token {${token}}.`;
        const width = seqMatch[1] ? Number(seqMatch[1]) : exports.DEFAULT_SEQUENCE_WIDTH;
        if (width < 1 || width > 10)
            return 'Sequence width must be between 1 and 10.';
        hasSequence = true;
    }
    const braces = (format.match(/[{}]/g) ?? []).length;
    if (braces !== tokenCount * 2)
        return 'Accession format contains an unmatched brace.';
    if (!hasSequence)
        return 'Accession format must include {SEQ} or {SEQ:n}.';
    return null;
}
function formatAccession(format, parts) {
    const sequenceWidthMatch = /\{SEQ(?::(\d{1,2}))?\}/.exec(format);
    const width = sequenceWidthMatch?.[1] ? Number(sequenceWidthMatch[1]) : exports.DEFAULT_SEQUENCE_WIDTH;
    const year = String(parts.year);
    return format
        .replace(/\{PREFIX\}/g, parts.prefix.toUpperCase())
        .replace(/\{YYYY\}/g, year)
        .replace(/\{YY\}/g, year.slice(-2))
        .replace(/\{SEQ(?::\d{1,2})?\}/g, String(parts.sequence).padStart(width, '0'))
        .slice(0, 64);
}
function formatMrn(year, sequence) {
    return `MRN-${year}-${String(sequence).padStart(5, '0')}`;
}
/** A, B, C ... Z, AA, AB ... for specimen and block labels. Never use ambiguous I/O. */
function specimenLetter(sequence) {
    const safe = Math.max(1, Math.min(sequence, 26 * 26));
    let value = safe;
    let result = '';
    while (value > 0) {
        value -= 1;
        result = String.fromCharCode(65 + (value % 26)) + result;
        value = Math.floor(value / 26);
    }
    return result;
}
function blockLabel(specimenSequence, blockNumber) {
    return `${specimenLetter(specimenSequence)}${blockNumber}`;
}
function slideLabel(block, slideNumber) {
    return `${block}-${slideNumber}`;
}
function normalizeBarcode(raw) {
    return raw.trim().toUpperCase().replace(/\s+/g, '');
}
function fullName(firstName, lastName) {
    return `${firstName} ${lastName}`.trim();
}
//# sourceMappingURL=formats.js.map