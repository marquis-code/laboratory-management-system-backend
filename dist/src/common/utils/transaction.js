"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTransaction = withTransaction;
/**
 * Runs a multi-document operation in a MongoDB transaction. The deployment uses
 * a replica set (see docker-compose.yml) precisely because accessioning, scans,
 * sign-out and amendments update several documents that must move together.
 */
async function withTransaction(connection, work) {
    const session = await connection.startSession();
    try {
        return await session.withTransaction(async () => work(session));
    }
    finally {
        await session.endSession();
    }
}
//# sourceMappingURL=transaction.js.map