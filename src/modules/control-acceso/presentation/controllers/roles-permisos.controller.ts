import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';


import { GestionarPermisosRolUseCase } from '../../application/use-cases/gestionar-permisos-rol.use-case';
import { JwtAuthGuard } from 'src/modules/auth/presentation/guards/jwt-auth.guard';
import { ControlAccesoExceptionFilter } from '../filters/control-acceso-excception.filter';
import { GuardarPermisosRolDto } from '../dto/rol-permiso.dto';


@Controller('roles/:idRol/permisos')
@UseGuards(JwtAuthGuard)
@UseFilters(ControlAccesoExceptionFilter)
export class RolesPermisosController {
  constructor(private readonly useCase: GestionarPermisosRolUseCase) {}

  @Get()
  getMatrix(@Param('idRol', ParseIntPipe) idRol: number) {
    return this.useCase.getMatrix(idRol);
  }

  @Put()
  save(
    @Param('idRol', ParseIntPipe) idRol: number,
    @Body() dto: GuardarPermisosRolDto,
  ) {
    return this.useCase.save(idRol, dto.permisos);
  }
}
