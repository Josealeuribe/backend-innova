import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  EstadoInventario,
  EstadoRegistro,
} from 'src/generated/prisma/client';

export class ListarInventarioQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  buscar?: string;

  @IsOptional()
  @IsEnum(EstadoInventario)
  estado?: EstadoInventario;

  @IsOptional()
  @IsEnum(EstadoRegistro)
  estadoRegistro?: EstadoRegistro;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  clasificacion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCasino?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idResponsable?: number;
}
