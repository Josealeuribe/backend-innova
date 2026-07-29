import { Module } from '@nestjs/common';

import { AuthModule } from
  'src/modules/auth/auth.module';

import { ListarCiudadesUseCase } from
  './application/use-cases/listar-ciudades.use-case';

import { ListarDepartamentosUseCase } from
  './application/use-cases/listar-departamentos.use-case';

import { ListarPaisesUseCase } from
  './application/use-cases/listar-paises.use-case';

import type { UbicacionesRepository } from
  './domain/repositories/ubicaciones.repository';



import { CiudadesController } from
  './presentation/controllers/ciudades.controller';

import { DepartamentosController } from
  './presentation/controllers/departamentos.controller';

import { PaisesController } from
  './presentation/controllers/paises.controller';

import { UBICACIONES_REPOSITORY } from
  './ubicaciones.tokens';
import { PrismaUbicacionesRepository } from './infrastructure/persistence/prisma.ubicaciones.repository';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    PaisesController,
    DepartamentosController,
    CiudadesController,
  ],

  providers: [
    {
      provide: UBICACIONES_REPOSITORY,
      useClass: PrismaUbicacionesRepository,
    },

    {
      provide: ListarPaisesUseCase,
      useFactory: (
        repository: UbicacionesRepository,
      ) =>
        new ListarPaisesUseCase(
          repository,
        ),
      inject: [
        UBICACIONES_REPOSITORY,
      ],
    },

    {
      provide: ListarDepartamentosUseCase,
      useFactory: (
        repository: UbicacionesRepository,
      ) =>
        new ListarDepartamentosUseCase(
          repository,
        ),
      inject: [
        UBICACIONES_REPOSITORY,
      ],
    },

    {
      provide: ListarCiudadesUseCase,
      useFactory: (
        repository: UbicacionesRepository,
      ) =>
        new ListarCiudadesUseCase(
          repository,
        ),
      inject: [
        UBICACIONES_REPOSITORY,
      ],
    },
  ],
})
export class UbicacionesModule {}