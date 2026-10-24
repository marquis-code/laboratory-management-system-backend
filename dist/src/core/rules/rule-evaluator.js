"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluateCondition = evaluateCondition;
exports.contextFor = contextFor;
function readPath(context, path) {
    return path.split('.').reduce((current, key) => {
        if (current === null || current === undefined || typeof current !== 'object')
            return undefined;
        return current[key];
    }, context);
}
function asNumber(value) {
    if (typeof value === 'number' && Number.isFinite(value))
        return value;
    if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) {
        return Number(value);
    }
    return null;
}
function compare(left, op, right) {
    if (op === 'eq')
        return left === right;
    if (op === 'ne')
        return left !== right;
    if (op === 'exists')
        return right === false
            ? left === undefined || left === null
            : left !== undefined && left !== null;
    if (op === 'contains') {
        if (typeof left === 'string')
            return left.toLowerCase().includes(String(right).toLowerCase());
        if (Array.isArray(left))
            return left.includes(right);
        return false;
    }
    if (op === 'in')
        return Array.isArray(right) && right.includes(left);
    if (op === 'between') {
        const number = asNumber(left);
        if (number === null || !Array.isArray(right) || right.length !== 2)
            return false;
        const low = asNumber(right[0]);
        const high = asNumber(right[1]);
        return low !== null && high !== null && number >= low && number <= high;
    }
    const a = asNumber(left);
    const b = asNumber(right);
    if (a === null || b === null) {
        if (op === 'gt' || op === 'gte' || op === 'lt' || op === 'lte')
            return false;
        return false;
    }
    switch (op) {
        case 'gt':
            return a > b;
        case 'gte':
            return a >= b;
        case 'lt':
            return a < b;
        case 'lte':
            return a <= b;
        default:
            return false;
    }
}
/** Safe JSON rule evaluator — deliberately no eval/new Function. */
function evaluateCondition(condition, context) {
    if (condition.all)
        return condition.all.every((item) => evaluateCondition(item, context));
    if (condition.any)
        return condition.any.some((item) => evaluateCondition(item, context));
    if (condition.not)
        return !evaluateCondition(condition.not, context);
    if (!condition.field || !condition.op)
        return false;
    return compare(readPath(context, condition.field), condition.op, condition.value);
}
function contextFor(values, base) {
    return { ...base, values };
}
//# sourceMappingURL=rule-evaluator.js.map