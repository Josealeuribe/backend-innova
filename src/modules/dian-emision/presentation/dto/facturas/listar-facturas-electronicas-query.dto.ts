import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class ListarFacturasElectronicasQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  idRazonSocial?: number;

  @IsOptional()
  @IsIn([
    'PENDIENTE',
    'ENVIANDO',
    'EN_PROCESO',
    'ACEPTADO',
    'RECHAZADO',
    'ERROR_TECNICO',
  ])
  estadoDian?:
    | 'PENDIENTE'
    | 'ENVIANDO'
    | 'EN_PROCESO'
    | 'ACEPTADO'
    | 'RECHAZADO'
    | 'ERROR_TECNICO';
}
