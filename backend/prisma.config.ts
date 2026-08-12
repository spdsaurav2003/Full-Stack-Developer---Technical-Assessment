import { defineConfig } from 'prisma/config';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

function buildDbUrl(): string {
  const raw = process.env.DATABASE_URL || 'file:./dev.db';
  if (raw.startsWith('file:./') || raw.startsWith('file:.\\')) {
    const relative = raw.replace(/^file:/, '');
    const absolute = path.resolve(process.cwd(), relative);
    return `file:${absolute}`;
  }
  return raw;
}

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  migrate: {
    adapter: async () => {
      const { PrismaLibSql } = await import('@prisma/adapter-libsql');
      const dbUrl = buildDbUrl();
      return new PrismaLibSql({ url: dbUrl });
    },
    datasourceUrl: buildDbUrl(),
  },
} as any);
