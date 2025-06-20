import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Only create Prisma client if not on Vercel
export const prisma = process.env.VERCEL 
  ? ({} as PrismaClient) // Mock client for Vercel
  : globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  globalForPrisma.prisma = prisma;
} 