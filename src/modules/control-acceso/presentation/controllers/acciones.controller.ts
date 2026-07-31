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


import { GestionarAccionesUseCase } from '../../application/use-cases/gestionar-acciones.use-case';
import { ActualizarAccionDto, CrearAccionDto } from '../dto/accion.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { ControlAccesoExceptionFilter } from '../filters/control-acceso-excception.filter';
import { PaginacionControlAccesoDto } from '../dto/paginacion-control-acceso.dto';


@Controller('acciones')
@UseGuards(JwtAuthGuard)
@UseFilters(ControlAccesoExceptionFilter)
export class AccionesController {
  constructor(private readonly useCase: GestionarAccionesUseCase) {}

  @Post()
  create(@Body() dto: CrearAccionDto) {
    return this.useCase.create(dto);
  }

  @Get()
  list(@Query() query: PaginacionControlAccesoDto) {
    return this.useCase.list(query);
  }

  @Get(':idAccion')
  get(@Param('idAccion', ParseIntPipe) idAccion: number) {
    return this.useCase.get(idAccion);
  }

  @Patch(':idAccion')
  update(
    @Param('idAccion', ParseIntPipe) idAccion: number,
    @Body() dto: ActualizarAccionDto,
  ) {
    return this.useCase.update(idAccion, dto);
  }

  @Delete(':idAccion')
  async remove(@Param('idAccion', ParseIntPipe) idAccion: number) {
    return {
      message: 'Acción inactivada correctamente.',
      data: await this.useCase.deactivate(idAccion),
    };
  }
}
