import { Module } from '@nestjs/common';


import { GestionarAccionesUseCase } from './application/use-cases/gestionar-acciones.use-case';
import { GestionarModulosUseCase } from './application/use-cases/gestionar-modulos.use-case';
import { GestionarPermisosRolUseCase } from './application/use-cases/gestionar-permisos-rol.use-case';
import { GestionarPermisosUseCase } from './application/use-cases/gestionar-permisos.use-case';
import { CONTROL_ACCESO_REPOSITORY } from './domain/repositories/control-acceso.repository.token';
import { PrismaControlAccesoRepository } from './persistence/prisma/prisma-control-acceso.repository';
import { AccionesController } from './presentation/controllers/acciones.controller';
import { ModulosController } from './presentation/controllers/modulos.controller';
import { PermisosController } from './presentation/controllers/permisos.controller';
import { RolesPermisosController } from './presentation/controllers/roles-permisos.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [
    ModulosController,
    AccionesController,
    PermisosController,
    RolesPermisosController,
  ],
  providers: [
    {
      provide: CONTROL_ACCESO_REPOSITORY,
      useClass: PrismaControlAccesoRepository,
    },
    GestionarModulosUseCase,
    GestionarAccionesUseCase,
    GestionarPermisosUseCase,
    GestionarPermisosRolUseCase,
  ],
  exports: [CONTROL_ACCESO_REPOSITORY],
})
export class ControlAccesoModule {}
