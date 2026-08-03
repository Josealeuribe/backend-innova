import {
  Body,
  ConflictException,
  Controller,
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
  ResolucionDianActivaExistenteError,
  ResolucionDianNotFoundError,
} from '../../application/errors/dian-emision.errors';
import { ActualizarResolucionDianUseCase } from '../../application/use-cases/resoluciones/actualizar-resolucion-dian.use-case';
import { CambiarEstadoResolucionDianUseCase } from '../../application/use-cases/resoluciones/cambiar-estado-resolucion-dian.use-case';
import { CrearResolucionDianUseCase } from '../../application/use-cases/resoluciones/crear-resolucion-dian.use-case';
import { ListarResolucionesDianUseCase } from '../../application/use-cases/resoluciones/listar-resoluciones-dian.use-case';
import { ObtenerResolucionDianUseCase } from '../../application/use-cases/resoluciones/obtener-resolucion-dian.use-case';
import { ActualizarResolucionDianDto } from '../dto/resoluciones/actualizar-resolucion-dian.dto';
import { CambiarEstadoResolucionDianDto } from '../dto/resoluciones/cambiar-estado-resolucion-dian.dto';
import { CrearResolucionDianDto } from '../dto/resoluciones/crear-resolucion-dian.dto';
import { ListarResolucionesDianQueryDto } from '../dto/resoluciones/listar-resoluciones-dian-query.dto';

@Controller('dian/resoluciones')
@UseGuards(JwtAuthGuard)
export class ResolucionesDianController {
  constructor(
    private readonly crearResolucionDianUseCase: CrearResolucionDianUseCase,
    private readonly listarResolucionesDianUseCase: ListarResolucionesDianUseCase,
    private readonly obtenerResolucionDianUseCase: ObtenerResolucionDianUseCase,
    private readonly actualizarResolucionDianUseCase: ActualizarResolucionDianUseCase,
    private readonly cambiarEstadoResolucionDianUseCase: CambiarEstadoResolucionDianUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CrearResolucionDianDto) {
    try {
      return await this.crearResolucionDianUseCase.execute({
        idRazonSocial: dto.idRazonSocial,
        tipoDocumento: dto.tipoDocumento,
        entorno: dto.entorno,
        prefijo: dto.prefijo,
        numeroResolucion: dto.numeroResolucion,
        rangoDesde: dto.rangoDesde,
        rangoHasta: dto.rangoHasta,
        fechaVigenciaDesde: new Date(dto.fechaVigenciaDesde),
        fechaVigenciaHasta: new Date(dto.fechaVigenciaHasta),
        claveTecnica: dto.claveTecnica,
        activa: dto.activa,
      });
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Get()
  findAll(@Query() query: ListarResolucionesDianQueryDto) {
    return this.listarResolucionesDianUseCase.execute({
      page: query.page,
      limit: query.limit,
      idRazonSocial: query.idRazonSocial,
      tipoDocumento: query.tipoDocumento,
      activa: query.activa,
    });
  }

  @Get(':idResolucionDian')
  async findOne(
    @Param('idResolucionDian', ParseIntPipe) idResolucionDian: number,
  ) {
    try {
      return await this.obtenerResolucionDianUseCase.execute(
        idResolucionDian,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idResolucionDian')
  async update(
    @Param('idResolucionDian', ParseIntPipe) idResolucionDian: number,
    @Body() dto: ActualizarResolucionDianDto,
  ) {
    try {
      return await this.actualizarResolucionDianUseCase.execute(
        idResolucionDian,
        {
          prefijo: dto.prefijo,
          numeroResolucion: dto.numeroResolucion,
          rangoDesde: dto.rangoDesde,
          rangoHasta: dto.rangoHasta,
          fechaVigenciaDesde: dto.fechaVigenciaDesde
            ? new Date(dto.fechaVigenciaDesde)
            : undefined,
          fechaVigenciaHasta: dto.fechaVigenciaHasta
            ? new Date(dto.fechaVigenciaHasta)
            : undefined,
          claveTecnica: dto.claveTecnica,
        },
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idResolucionDian/estado')
  async cambiarEstado(
    @Param('idResolucionDian', ParseIntPipe) idResolucionDian: number,
    @Body() dto: CambiarEstadoResolucionDianDto,
  ) {
    try {
      return await this.cambiarEstadoResolucionDianUseCase.execute(
        idResolucionDian,
        dto.activa,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof ResolucionDianNotFoundError) {
      throw new NotFoundException(error.message);
    }

    if (error instanceof ResolucionDianActivaExistenteError) {
      throw new ConflictException(error.message);
    }

    throw error;
  }
}
