import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as path from 'path';

function buildDbUrl(): string {
  const raw = process.env.DATABASE_URL || 'file:./dev.db';
  if (raw.startsWith('file:./') || raw.startsWith('file:.\\')) {
    const relative = raw.replace(/^file:/, '');
    const absolute = path.resolve(process.cwd(), relative);
    return `file:${absolute}`;
  }
  return raw;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const dbUrl = buildDbUrl();
    const adapter = new PrismaLibSql({ url: dbUrl });
    super({ adapter } as any);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
