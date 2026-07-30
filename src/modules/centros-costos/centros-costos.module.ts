import {
  Module,
} from '@nestjs/common';

import {
  AuthModule,
} from 'src/modules/auth/auth.module';

import {
  ActualizarCentroCostoUseCase,
} from './application/use-cases/actualizar-centro-costo.use-case';


import {
  EliminarCentroCostoUseCase,
} from './application/use-cases/eliminar-centro-costo.use-case';



import {
  ObtenerCentroCostoUseCase,
} from './application/use-cases/obtener-centro-costo.use-case';

import type {
  CentroCostoRepository,
} from './domain/repositories/centro-costo.repository';
import { CentrosCostosController } from './presentation/controllers/centro-costos.controller';
import { CENTRO_COSTO_REPOSITORY } from './centro-costos.tokens';
import { PrismaCentroCostoRepository } from './infraestructure/persistence/prisma-centro-costo.repository';
import { ListarCentrosCostosUseCase } from './application/use-cases/listar-centro-costo.use-case';
import { CrearCentroCostoUseCase } from './application/use-cases/crear-centro-costo.use-case';



@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    CentrosCostosController,
  ],

  providers: [
    {
      provide:
        CENTRO_COSTO_REPOSITORY,

      useClass:
        PrismaCentroCostoRepository,
    },

    {
      provide:
        CrearCentroCostoUseCase,

      useFactory: (
        repository:
          CentroCostoRepository,
      ) =>
        new CrearCentroCostoUseCase(
          repository,
        ),

      inject: [
        CENTRO_COSTO_REPOSITORY,
      ],
    },

    {
      provide:
        ListarCentrosCostosUseCase,

      useFactory: (
        repository:
          CentroCostoRepository,
      ) =>
        new ListarCentrosCostosUseCase(
          repository,
        ),

      inject: [
        CENTRO_COSTO_REPOSITORY,
      ],
    },

    {
      provide:
        ObtenerCentroCostoUseCase,

      useFactory: (
        repository:
          CentroCostoRepository,
      ) =>
        new ObtenerCentroCostoUseCase(
          repository,
        ),

      inject: [
        CENTRO_COSTO_REPOSITORY,
      ],
    },

    {
      provide:
        ActualizarCentroCostoUseCase,

      useFactory: (
        repository:
          CentroCostoRepository,
      ) =>
        new ActualizarCentroCostoUseCase(
          repository,
        ),

      inject: [
        CENTRO_COSTO_REPOSITORY,
      ],
    },

    {
      provide:
        EliminarCentroCostoUseCase,

      useFactory: (
        repository:
          CentroCostoRepository,
      ) =>
        new EliminarCentroCostoUseCase(
          repository,
        ),

      inject: [
        CENTRO_COSTO_REPOSITORY,
      ],
    },
  ],
})
export class CentrosCostosModule {}