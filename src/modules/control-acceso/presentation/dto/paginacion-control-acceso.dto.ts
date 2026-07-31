import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

import { EstadoRegistro } from 'src/generated/prisma/client';

export class PaginacionControlAccesoDto {
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
  @IsEnum(EstadoRegistro)
  estado?: EstadoRegistro;
}
