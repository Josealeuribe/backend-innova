import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';

import { ActualizarMaquinaUseCase } from '../../application/use-cases/actualizar-maquina.use-case';
import { CrearMaquinaUseCase } from '../../application/use-cases/crear-maquina.use-case';
import { EliminarMaquinaUseCase } from '../../application/use-cases/eliminar-maquina.use-case';
import { ListarMaquinaUseCase } from '../../application/use-cases/listar-maquina.use-case';
import { ObtenerMaquinaUseCase } from '../../application/use-cases/obtener-maquina.use-case';
import {
    InventarioCasinoMismatchError,
    MaquinaAlreadyExistsError,
    MaquinaDateValidationError,
    MaquinaForeignKeyError,
    MaquinaNotFoundError,
    MaquinaRelationInactiveError,
} from '../../errors/maquina.errors';

import {
    ActualizarMaquinaDto,
    CrearMaquinaDto,
} from '../dto/maquina.dto';
import { ListarMaquinasQueryDto } from '../dto/listar-maquina-query.dto';

@Controller('maquinas')
@UseGuards(JwtAuthGuard)
export class MaquinasController {
    constructor(
        private readonly crearMaquinaUseCase:
            CrearMaquinaUseCase,
        private readonly listarMaquinaUseCase:
            ListarMaquinaUseCase,
        private readonly obtenerMaquinaUseCase:
            ObtenerMaquinaUseCase,
        private readonly actualizarMaquinaUseCase:
            ActualizarMaquinaUseCase,
        private readonly eliminarMaquinaUseCase:
            EliminarMaquinaUseCase,
    ) { }

    @Post()
    async crear(@Body() dto: CrearMaquinaDto) {
        try {
            return await this.crearMaquinaUseCase.execute(
                dto,
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get()
    async listar(
        @Query() query: ListarMaquinasQueryDto,
    ) {
        return this.listarMaquinaUseCase.execute(query);
    }

    @Get(':idMaquina')
    async obtener(
        @Param('idMaquina', ParseIntPipe)
        idMaquina: number,
    ) {
        try {
            return await this.obtenerMaquinaUseCase.execute(
                idMaquina,
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    @Patch(':idMaquina')
    async actualizar(
        @Param('idMaquina', ParseIntPipe)
        idMaquina: number,
        @Body() dto: ActualizarMaquinaDto,
    ) {
        try {
            return await this.actualizarMaquinaUseCase.execute(
                idMaquina,
                dto,
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    @Delete(':idMaquina')
    async eliminar(
        @Param('idMaquina', ParseIntPipe)
        idMaquina: number,
    ) {
        try {
            return await this.eliminarMaquinaUseCase.execute(
                idMaquina,
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): never {
        if (error instanceof MaquinaNotFoundError) {
            throw new NotFoundException(error.message);
        }

        if (error instanceof MaquinaAlreadyExistsError) {
            throw new ConflictException(error.message);
        }

        if (
            error instanceof MaquinaForeignKeyError ||
            error instanceof MaquinaRelationInactiveError ||
            error instanceof InventarioCasinoMismatchError ||
            error instanceof MaquinaDateValidationError
        ) {
            throw new BadRequestException(error.message);
        }

        throw error;
    }
}
