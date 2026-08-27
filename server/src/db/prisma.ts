import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __lankavoyage_prisma: PrismaClient | undefined;
}

/**
 * Centralized Prisma client singleton with connection pooling and serverless re-use
 */
export function getPrismaClient(): PrismaClient | null {
  if (typeof process === 'undefined' || !process.env?.DATABASE_URL) {
    return null;
  }

  if (!globalThis.__lankavoyage_prisma) {
    try {
      globalThis.__lankavoyage_prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
      });
    } catch (err) {
      console.warn('PrismaClient initialization notice:', err);
      return null;
    }
  }

  return globalThis.__lankavoyage_prisma;
}

export const prisma = getPrismaClient();
