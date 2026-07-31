import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

import { EstadoRegistro } from 'src/generated/prisma/client';

export class CrearAccionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  @Matches(/^[A-Za-z0-9_-]+$/)
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string | null;

  @IsOptional()
  @IsEnum(EstadoRegistro)
  estado?: EstadoRegistro;
}

export class ActualizarAccionDto extends PartialType(CrearAccionDto) {}
