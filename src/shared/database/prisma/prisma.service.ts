import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../../../generated/prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    configService: ConfigService,
  ) {
    const databaseUrl =
      configService.getOrThrow<string>(
        'DATABASE_URL',
      );

    const parsedUrl = new URL(databaseUrl);

    const databaseName = decodeURIComponent(
      parsedUrl.pathname.replace(/^\//, ''),
    );

    if (!databaseName) {
      throw new Error(
        'DATABASE_URL no contiene el nombre de la base de datos.',
      );
    }

    const adapter = new PrismaMariaDb({
      host: parsedUrl.hostname,
      port: Number(parsedUrl.port || 3306),

      user: decodeURIComponent(
        parsedUrl.username,
      ),

      password: decodeURIComponent(
        parsedUrl.password,
      ),

      database: databaseName,

      connectionLimit: Number(
        configService.get<string>(
          'DATABASE_CONNECTION_LIMIT',
        ) ?? 5,
      ),

      connectTimeout: 10_000,
      acquireTimeout: 20_000,

      /*
       * Necesario en desarrollo local cuando MySQL usa
       * caching_sha2_password y no hay TLS configurado.
       */
      allowPublicKeyRetrieval: true,
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