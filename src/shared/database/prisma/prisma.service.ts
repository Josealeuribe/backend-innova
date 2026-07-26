import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.getOrThrow<string>('DATABASE_HOST'),

      port: Number(configService.get<string>('DATABASE_PORT') ?? 3306),

      user: configService.getOrThrow<string>('DATABASE_USER'),

      password: configService.getOrThrow<string>('DATABASE_PASSWORD'),

      database: configService.getOrThrow<string>('DATABASE_NAME'),

      connectionLimit: Number(
        configService.get<string>('DATABASE_CONNECTION_LIMIT') ?? 5,
      ),

      connectTimeout: 10000,
    });

    super({
      adapter,
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
