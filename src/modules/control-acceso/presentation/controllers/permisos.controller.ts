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


import { GestionarPermisosUseCase } from '../../application/use-cases/gestionar-permisos.use-case';
import { ActualizarPermisoDto, CrearPermisoDto, ListarPermisosQueryDto } from '../dto/permiso.dto';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { ControlAccesoExceptionFilter } from '../filters/control-acceso-excception.filter';


@Controller('permisos')
@UseGuards(JwtAuthGuard)
@UseFilters(ControlAccesoExceptionFilter)
export class PermisosController {
  constructor(private readonly useCase: GestionarPermisosUseCase) {}

  @Post()
  create(@Body() dto: CrearPermisoDto) {
    return this.useCase.create(dto);
  }

  @Get()
  list(@Query() query: ListarPermisosQueryDto) {
    return this.useCase.list(query);
  }

  @Get(':idPermiso')
  get(@Param('idPermiso', ParseIntPipe) idPermiso: number) {
    return this.useCase.get(idPermiso);
  }

  @Patch(':idPermiso')
  update(
    @Param('idPermiso', ParseIntPipe) idPermiso: number,
    @Body() dto: ActualizarPermisoDto,
  ) {
    return this.useCase.update(idPermiso, dto);
  }

  @Delete(':idPermiso')
  async remove(@Param('idPermiso', ParseIntPipe) idPermiso: number) {
    return {
      message: 'Permiso inactivado correctamente.',
      data: await this.useCase.deactivate(idPermiso),
    };
  }
}
