import { Module } from '@nestjs/common';



import { ActualizarInventarioUseCase } from './application/use-cases/actualizar-inventario.use-case';
import { CrearInventarioUseCase } from './application/use-cases/crear-inventario.use-case';
import { EliminarInventarioUseCase } from './application/use-cases/eliminar-inventario.use-case';
import { ListarInventarioUseCase } from './application/use-cases/listar-inventario.use-case';
import { ObtenerInventarioUseCase } from './application/use-cases/obtener-inventario.use-case';

import { INVENTARIO_REPOSITORY } from './inventario.tokens';
import { InventarioController } from './presentation/controllers/inventario.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaInventarioRepository } from './infraestructure/persistence/prisma.inventario.repository';

@Module({
  imports: [
    AuthModule,
  ],

  controllers: [
    InventarioController,
  ],

  providers: [
    {
      provide:
        INVENTARIO_REPOSITORY,
      useClass:
        PrismaInventarioRepository,
    },

    CrearInventarioUseCase,
    ListarInventarioUseCase,
    ObtenerInventarioUseCase,
    ActualizarInventarioUseCase,
    EliminarInventarioUseCase,
  ],

  exports: [
    INVENTARIO_REPOSITORY,
  ],
})
export class InventarioModule {}
