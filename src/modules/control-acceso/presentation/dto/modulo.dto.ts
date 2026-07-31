import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

import { EstadoRegistro } from 'src/generated/prisma/client';

export class CrearModuloDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9_-]+$/)
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  ruta?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  icono?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orden?: number;

  @IsOptional()
  @IsBoolean()
  visibleMenu?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idModuloPadre?: number | null;

  @IsOptional()
  @IsEnum(EstadoRegistro)
  estado?: EstadoRegistro;
}

export class ActualizarModuloDto extends PartialType(CrearModuloDto) {}
