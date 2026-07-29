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

import {
  CasinoCodigoDaneAlreadyExistsError,
  CasinoCodigoEstablecimientoAlreadyExistsError,
  CasinoForeignKeyError,
  CasinoNameAlreadyExistsError,
  CasinoNotFoundError,
} from '../../application/errors/casino.errors';

import { ActualizarCasinoUseCase } from '../../application/use-cases/actualizar-casino.use-case';
import { CrearCasinoUseCase } from '../../application/use-cases/crear-casino.use-case';
import { EliminarCasinoUseCase } from '../../application/use-cases/eliminar-casino.use-case';
import { ListarCasinosUseCase } from '../../application/use-cases/listar-casinos.use-case';
import { ObtenerCasinoUseCase } from '../../application/use-cases/obtener-casino.use-case';

import { ActualizarCasinoDto } from '../dto/actualizar-casino.dto';
import { CrearCasinoDto } from '../dto/crear-casino.dto';
import { ListarCasinosQueryDto } from '../dto/listar-casinos-query.dto';

@Controller('casinos')
@UseGuards(JwtAuthGuard)
export class CasinosController {
  constructor(
    private readonly crearCasinoUseCase:
      CrearCasinoUseCase,
    private readonly listarCasinosUseCase:
      ListarCasinosUseCase,
    private readonly obtenerCasinoUseCase:
      ObtenerCasinoUseCase,
    private readonly actualizarCasinoUseCase:
      ActualizarCasinoUseCase,
    private readonly eliminarCasinoUseCase:
      EliminarCasinoUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CrearCasinoDto) {
    try {
      return await this.crearCasinoUseCase.execute(
        dto,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get()
  findAll(
    @Query() query: ListarCasinosQueryDto,
  ) {
    return this.listarCasinosUseCase.execute({
      page: query.page,
      limit: query.limit,
      buscar: query.buscar,
      estado: query.estado,
      idCiudad: query.idCiudad,
      idCentroCosto:
        query.idCentroCosto,
      idRazonSocial:
        query.idRazonSocial,
    });
  }

  @Get(':idCasino')
  async findOne(
    @Param('idCasino', ParseIntPipe)
    idCasino: number,
  ) {
    try {
      return await this.obtenerCasinoUseCase.execute(
        idCasino,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idCasino')
  async update(
    @Param('idCasino', ParseIntPipe)
    idCasino: number,
    @Body() dto: ActualizarCasinoDto,
  ) {
    try {
      return await this.actualizarCasinoUseCase.execute(
        idCasino,
        dto,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Delete(':idCasino')
  async remove(
    @Param('idCasino', ParseIntPipe)
    idCasino: number,
  ) {
    try {
      const casino =
        await this.eliminarCasinoUseCase.execute(
          idCasino,
        );

      return {
        message:
          'Casino desactivado correctamente.',
        casino,
      };
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof CasinoNotFoundError) {
      throw new NotFoundException(
        error.message,
      );
    }

    if (
      error instanceof
        CasinoNameAlreadyExistsError ||
      error instanceof
        CasinoCodigoDaneAlreadyExistsError ||
      error instanceof
        CasinoCodigoEstablecimientoAlreadyExistsError
    ) {
      throw new ConflictException(
        error.message,
      );
    }

    if (error instanceof CasinoForeignKeyError) {
      throw new BadRequestException(
        error.message,
      );
    }

    throw error;
  }
}
