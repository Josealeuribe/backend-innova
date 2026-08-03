import {
  Body,
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

import { ReglaMapeoPucNotFoundError } from '../../application/errors/recepcion-dian.errors';
import { ActualizarReglaMapeoPucUseCase } from '../../application/use-cases/reglas-puc/actualizar-regla-mapeo-puc.use-case';
import { CrearReglaMapeoPucUseCase } from '../../application/use-cases/reglas-puc/crear-regla-mapeo-puc.use-case';
import { EliminarReglaMapeoPucUseCase } from '../../application/use-cases/reglas-puc/eliminar-regla-mapeo-puc.use-case';
import { ListarReglasMapeoPucUseCase } from '../../application/use-cases/reglas-puc/listar-reglas-mapeo-puc.use-case';
import { ObtenerReglaMapeoPucUseCase } from '../../application/use-cases/reglas-puc/obtener-regla-mapeo-puc.use-case';
import { ActualizarReglaMapeoPucDto } from '../dto/reglas-puc/actualizar-regla-mapeo-puc.dto';
import { CrearReglaMapeoPucDto } from '../dto/reglas-puc/crear-regla-mapeo-puc.dto';
import { ListarReglasPucQueryDto } from '../dto/reglas-puc/listar-reglas-puc-query.dto';

@Controller('recepcion/reglas-puc')
@UseGuards(JwtAuthGuard)
export class ReglasPucController {
  constructor(
    private readonly crearReglaMapeoPucUseCase: CrearReglaMapeoPucUseCase,
    private readonly listarReglasMapeoPucUseCase: ListarReglasMapeoPucUseCase,
    private readonly obtenerReglaMapeoPucUseCase: ObtenerReglaMapeoPucUseCase,
    private readonly actualizarReglaMapeoPucUseCase: ActualizarReglaMapeoPucUseCase,
    private readonly eliminarReglaMapeoPucUseCase: EliminarReglaMapeoPucUseCase,
  ) {}

  @Post()
  create(@Body() dto: CrearReglaMapeoPucDto) {
    return this.crearReglaMapeoPucUseCase.execute(dto);
  }

  @Get()
  findAll(@Query() query: ListarReglasPucQueryDto) {
    return this.listarReglasMapeoPucUseCase.execute({
      page: query.page,
      limit: query.limit,
      idRazonSocial: query.idRazonSocial,
      buscar: query.buscar,
      activa: query.activa,
    });
  }

  @Get(':idReglaMapeoPuc')
  async findOne(
    @Param('idReglaMapeoPuc', ParseIntPipe) idReglaMapeoPuc: number,
  ) {
    try {
      return await this.obtenerReglaMapeoPucUseCase.execute(
        idReglaMapeoPuc,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Patch(':idReglaMapeoPuc')
  async update(
    @Param('idReglaMapeoPuc', ParseIntPipe) idReglaMapeoPuc: number,
    @Body() dto: ActualizarReglaMapeoPucDto,
  ) {
    try {
      return await this.actualizarReglaMapeoPucUseCase.execute(
        idReglaMapeoPuc,
        dto,
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  @Delete(':idReglaMapeoPuc')
  async remove(
    @Param('idReglaMapeoPuc', ParseIntPipe) idReglaMapeoPuc: number,
  ) {
    try {
      await this.eliminarReglaMapeoPucUseCase.execute(idReglaMapeoPuc);
      return { message: 'Regla PUC eliminada correctamente.' };
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (error instanceof ReglaMapeoPucNotFoundError) {
      throw new NotFoundException(error.message);
    }

    throw error;
  }
}
