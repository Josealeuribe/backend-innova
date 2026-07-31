import {
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

import { TiposMaquinaUseCase } from '../../application/use-cases/tipos-maquina.use-case';
import {
    TipoMaquinaAlreadyExistsError,
    TipoMaquinaInUseError,
    TipoMaquinaNotFoundError,
} from '../../errors/maquina.errors';


import {
    ActualizarTipoMaquinaDto,
    CrearTipoMaquinaDto,
} from '../dto/tipo-maquina.dto';
import { ListarTipoMaquinaQueryDto } from '../dto/listar-tipo-maquina.query';

@Controller('tipos-maquina')
@UseGuards(JwtAuthGuard)
export class TiposMaquinaController {
    constructor(
        private readonly tiposMaquinaUseCase:
            TiposMaquinaUseCase,
    ) { }

    @Post()
    async crear(@Body() dto: CrearTipoMaquinaDto) {
        try {
            return await this.tiposMaquinaUseCase.crear(
                dto,
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    @Get()
    async listar(
        @Query() query: ListarTipoMaquinaQueryDto,
    ) {
        return this.tiposMaquinaUseCase.listar(query);
    }

    @Get(':idTipoMaquina')
    async obtener(
        @Param('idTipoMaquina', ParseIntPipe)
        idTipoMaquina: number,
    ) {
        try {
            return await this.tiposMaquinaUseCase.obtener(
                idTipoMaquina,
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    @Patch(':idTipoMaquina')
    async actualizar(
        @Param('idTipoMaquina', ParseIntPipe)
        idTipoMaquina: number,
        @Body() dto: ActualizarTipoMaquinaDto,
    ) {
        try {
            return await this.tiposMaquinaUseCase.actualizar(
                idTipoMaquina,
                dto,
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    @Delete(':idTipoMaquina')
    async eliminar(
        @Param('idTipoMaquina', ParseIntPipe)
        idTipoMaquina: number,
    ) {
        try {
            return await this.tiposMaquinaUseCase.eliminar(
                idTipoMaquina,
            );
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): never {
        if (error instanceof TipoMaquinaNotFoundError) {
            throw new NotFoundException(error.message);
        }

        if (
            error instanceof TipoMaquinaAlreadyExistsError ||
            error instanceof TipoMaquinaInUseError
        ) {
            throw new ConflictException(error.message);
        }

        throw error;
    }
}
