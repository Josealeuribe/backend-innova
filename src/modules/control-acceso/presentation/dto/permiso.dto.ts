import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

import { EstadoRegistro } from 'src/generated/prisma/client';
import { PaginacionControlAccesoDto } from './paginacion-control-acceso.dto';

export class CrearPermisoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idModulo!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAccion!: number;

  @IsOptional()
  @IsEnum(EstadoRegistro)
  estado?: EstadoRegistro;
}

export class ActualizarPermisoDto extends PartialType(CrearPermisoDto) {}

export class ListarPermisosQueryDto extends PaginacionControlAccesoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idModulo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idAccion?: number;
}
