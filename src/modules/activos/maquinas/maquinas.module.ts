import { Module } from '@nestjs/common';

import { AuthModule } from 'src/modules/auth/auth.module';
import { PrismaModule } from 'src/shared/database/prisma/prisma.module';

import { MaquinaRulesService } from './application/services/maquina-rules-service';
import {
    MAQUINA_REPOSITORY,
    TIPO_MAQUINA_REPOSITORY,
} from './maquinas.tokens';
import { MaquinasController } from './presentation/controllers/maquinas.controller';
import { TiposMaquinaController } from './presentation/controllers/tipos-maquina.controller';
import { PrismaMaquinaRepository } from './infraestructure/persistence/prisma-maquina.repository';
import { PrismaTipoMaquinaRepository } from './infraestructure/persistence/prisma-tipo-maquina.repository';
import { CrearMaquinaUseCase } from './application/use-cases/crear-maquina.use-case';
import { ListarMaquinaUseCase } from './application/use-cases/listar-maquina.use-case';
import { ObtenerMaquinaUseCase } from './application/use-cases/obtener-maquina.use-case';
import { ActualizarMaquinaUseCase } from './application/use-cases/actualizar-maquina.use-case';
import { EliminarMaquinaUseCase } from './application/use-cases/eliminar-maquina.use-case';
import { TiposMaquinaUseCase } from './application/use-cases/tipos-maquina.use-case';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
    ],
    controllers: [
        MaquinasController,
        TiposMaquinaController,
    ],
    providers: [
        {
            provide: MAQUINA_REPOSITORY,
            useClass: PrismaMaquinaRepository,
        },
        {
            provide: TIPO_MAQUINA_REPOSITORY,
            useClass: PrismaTipoMaquinaRepository,
        },
        MaquinaRulesService,
        CrearMaquinaUseCase,
        ListarMaquinaUseCase,
        ObtenerMaquinaUseCase,
        ActualizarMaquinaUseCase,
        EliminarMaquinaUseCase,
        TiposMaquinaUseCase,
    ],
    exports: [
        MAQUINA_REPOSITORY,
        TIPO_MAQUINA_REPOSITORY,
        TiposMaquinaUseCase,
    ],
})
export class MaquinasModule { }
