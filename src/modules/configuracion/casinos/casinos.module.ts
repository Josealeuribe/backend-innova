import { Module } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth/auth.module';

import { ActualizarCasinoUseCase } from './application/use-cases/actualizar-casino.use-case';
import { CrearCasinoUseCase } from './application/use-cases/crear-casino.use-case';
import { EliminarCasinoUseCase } from './application/use-cases/eliminar-casino.use-case';
import { ListarCasinosUseCase } from './application/use-cases/listar-casinos.use-case';
import { ObtenerCasinoUseCase } from './application/use-cases/obtener-casino.use-case';

import type { CasinoRepository } from './domain/repositories/casino.repository';

import { PrismaCasinoRepository } from './infrastructure/persistence/prisma-casino.repository';
import { CasinosController } from './presentation/controllers/casinos.controller';

import { CASINO_REPOSITORY } from './casinos.tokens';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    CasinosController,
  ],

  providers: [
    {
      provide: CASINO_REPOSITORY,
      useClass: PrismaCasinoRepository,
    },

    {
      provide: CrearCasinoUseCase,

      useFactory: (
        repository: CasinoRepository,
      ) =>
        new CrearCasinoUseCase(
          repository,
        ),

      inject: [
        CASINO_REPOSITORY,
      ],
    },

    {
      provide: ListarCasinosUseCase,

      useFactory: (
        repository: CasinoRepository,
      ) =>
        new ListarCasinosUseCase(
          repository,
        ),

      inject: [
        CASINO_REPOSITORY,
      ],
    },

    {
      provide: ObtenerCasinoUseCase,

      useFactory: (
        repository: CasinoRepository,
      ) =>
        new ObtenerCasinoUseCase(
          repository,
        ),

      inject: [
        CASINO_REPOSITORY,
      ],
    },

    {
      provide:
        ActualizarCasinoUseCase,

      useFactory: (
        repository: CasinoRepository,
      ) =>
        new ActualizarCasinoUseCase(
          repository,
        ),

      inject: [
        CASINO_REPOSITORY,
      ],
    },

    {
      provide: EliminarCasinoUseCase,

      useFactory: (
        repository: CasinoRepository,
      ) =>
        new EliminarCasinoUseCase(
          repository,
        ),

      inject: [
        CASINO_REPOSITORY,
      ],
    },
  ],
})
export class CasinosModule {}