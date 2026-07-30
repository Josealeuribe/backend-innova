import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import {
  JwtAuthGuard,
} from 'src/modules/auth/presentation/guards/jwt-auth.guard';

import {
  ActualizarCentroCostoUseCase,
} from '../../application/use-cases/actualizar-centro-costo.use-case';



import {
  EliminarCentroCostoUseCase,
} from '../../application/use-cases/eliminar-centro-costo.use-case';



import {
  ObtenerCentroCostoUseCase,
} from '../../application/use-cases/obtener-centro-costo.use-case';

import {
  CentroCostoCodigoAlreadyExistsError,
  CentroCostoNotFoundError,
} from '../../application/errors/centro-costo.errors';

import {
  ActualizarCentroCostoDto,
} from '../dto/actualizar-centro-costo.dto';

import {
  CrearCentroCostoDto,
} from '../dto/crear-centro-costo.dto';

import {
  ListarCentrosCostosQueryDto,
} from '../dto/listar-centros-costos-query.dto';
import { ListarCentrosCostosUseCase } from '../../application/use-cases/listar-centro-costo.use-case';
import { CrearCentroCostoUseCase } from '../../application/use-cases/crear-centro-costo.use-case';

@Controller('centros-costos')
@UseGuards(JwtAuthGuard)
export class CentrosCostosController {
  constructor(
    private readonly crearCentroCostoUseCase:
      CrearCentroCostoUseCase,

    private readonly listarCentrosCostosUseCase:
      ListarCentrosCostosUseCase,

    private readonly obtenerCentroCostoUseCase:
      ObtenerCentroCostoUseCase,

    private readonly actualizarCentroCostoUseCase:
      ActualizarCentroCostoUseCase,

    private readonly eliminarCentroCostoUseCase:
      EliminarCentroCostoUseCase,
  ) {}

  @Post()
  async create(
    @Body()
    dto: CrearCentroCostoDto,
  ) {
    try {
      return await this
        .crearCentroCostoUseCase
        .execute({
          codigoCentroCosto:
            dto.codigoCentroCosto,

          nombreCentroCosto:
            dto.nombreCentroCosto,

          estado: dto.estado,
        });
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get()
  findAll(
    @Query()
    query:
      ListarCentrosCostosQueryDto,
  ) {
    return this
      .listarCentrosCostosUseCase
      .execute({
        page: query.page,
        limit: query.limit,
        buscar: query.buscar,
        estado: query.estado,
      });
  }

  @Get(':idCentroCosto')
  async findOne(
    @Param(
      'idCentroCosto',
      ParseIntPipe,
    )
    idCentroCosto: number,
  ) {
    try {
      return await this
        .obtenerCentroCostoUseCase
        .execute(idCentroCosto);
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idCentroCosto')
  async update(
    @Param(
      'idCentroCosto',
      ParseIntPipe,
    )
    idCentroCosto: number,

    @Body()
    dto: ActualizarCentroCostoDto,
  ) {
    try {
      return await this
        .actualizarCentroCostoUseCase
        .execute(
          idCentroCosto,
          {
            codigoCentroCosto:
              dto.codigoCentroCosto,

            nombreCentroCosto:
              dto.nombreCentroCosto,

            estado: dto.estado,
          },
        );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Delete(':idCentroCosto')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param(
      'idCentroCosto',
      ParseIntPipe,
    )
    idCentroCosto: number,
  ) {
    try {
      const centroCosto =
        await this
          .eliminarCentroCostoUseCase
          .execute(idCentroCosto);

      return {
        message:
          'Centro de costos desactivado correctamente.',

        centroCosto,
      };
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(
    error: unknown,
  ): never {
    if (
      error instanceof
      CentroCostoNotFoundError
    ) {
      throw new NotFoundException(
        error.message,
      );
    }

    if (
      error instanceof
      CentroCostoCodigoAlreadyExistsError
    ) {
      throw new ConflictException(
        error.message,
      );
    }

    throw error;
  }
}