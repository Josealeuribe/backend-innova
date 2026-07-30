import { Module } from '@nestjs/common';


import { ActualizarRolUseCase } from './application/use-cases/actualizar-rol.use-case';
import { CrearRolUseCase } from './application/use-cases/crear-rol.use-case';
import { EliminarRolUseCase } from './application/use-cases/eliminar-rol.use-case';
import { ListarRolesUseCase } from './application/use-cases/listar-roles.use-case';
import { ObtenerRolUseCase } from './application/use-cases/obtener-rol.use-case';
import { ROL_REPOSITORY } from './domain/repositories/rol.repository.token';
import { PrismaRolRepository } from './persistence/prisma/prisma-rol.repository';
import { RolesController } from './presentation/controllers/roles.controller';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    RolesController,
  ],

  providers: [
    {
      provide: ROL_REPOSITORY,
      useClass: PrismaRolRepository,
    },

    CrearRolUseCase,
    ListarRolesUseCase,
    ObtenerRolUseCase,
    ActualizarRolUseCase,
    EliminarRolUseCase,
  ],

  exports: [
    ROL_REPOSITORY,
  ],
})
export class RolesModule {}