import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';

import { GestionarModulosUseCase } from '../../application/use-cases/gestionar-modulos.use-case';
import { ActualizarModuloDto, CrearModuloDto } from '../dto/modulo.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { ControlAccesoExceptionFilter } from '../filters/control-acceso-excception.filter';
import { PaginacionControlAccesoDto } from '../dto/paginacion-control-acceso.dto';

@Controller('modulos')
@UseGuards(JwtAuthGuard)
@UseFilters(ControlAccesoExceptionFilter)
export class ModulosController {
  constructor(private readonly useCase: GestionarModulosUseCase) {}

  @Post()
  create(@Body() dto: CrearModuloDto) {
    return this.useCase.create(dto);
  }

  @Get()
  list(@Query() query: PaginacionControlAccesoDto) {
    return this.useCase.list(query);
  }

  @Get(':idModulo')
  get(@Param('idModulo', ParseIntPipe) idModulo: number) {
    return this.useCase.get(idModulo);
  }

  @Patch(':idModulo')
  update(
    @Param('idModulo', ParseIntPipe) idModulo: number,
    @Body() dto: ActualizarModuloDto,
  ) {
    return this.useCase.update(idModulo, dto);
  }

  @Delete(':idModulo')
  async remove(@Param('idModulo', ParseIntPipe) idModulo: number) {
    return {
      message: 'Módulo inactivado correctamente.',
      data: await this.useCase.deactivate(idModulo),
    };
  }
}
