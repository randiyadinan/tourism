import { PrismaClient } from '@prisma/client';
/**
 * Centralized Prisma client singleton with connection pooling and serverless re-use
 */
export function getPrismaClient() {
    if (typeof process === 'undefined' || !process.env?.DATABASE_URL) {
        return null;
    }
    if (!globalThis.__lankavoyage_prisma) {
        try {
            globalThis.__lankavoyage_prisma = new PrismaClient({
                log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
            });
        }
        catch (err) {
            console.warn('PrismaClient initialization notice:', err);
            return null;
        }
    }
    return globalThis.__lankavoyage_prisma;
}
export const prisma = getPrismaClient();
