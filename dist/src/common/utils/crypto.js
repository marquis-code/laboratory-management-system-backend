"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.hashToken = hashToken;
exports.makeBarcode = makeBarcode;
exports.randomVerificationCode = randomVerificationCode;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const node_crypto_1 = require("node:crypto");
const ulid_1 = require("ulid");
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 11);
}
async function verifyPassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function hashToken(token) {
    return (0, node_crypto_1.createHash)('sha256').update(token).digest('hex');
}
function makeBarcode(prefix) {
    return `${prefix}-${(0, ulid_1.ulid)()}`;
}
function randomVerificationCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = (0, node_crypto_1.createHash)('sha256').update((0, ulid_1.ulid)()).digest();
    let code = '';
    for (let index = 0; index < 10; index += 1) {
        const byte = bytes[index] ?? 0;
        code += alphabet[byte % alphabet.length];
    }
    return code;
}
//# sourceMappingURL=crypto.js.map