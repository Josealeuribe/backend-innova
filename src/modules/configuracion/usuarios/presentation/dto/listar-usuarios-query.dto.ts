import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ListarUsuariosQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 20;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  buscar?: string;

  @IsOptional()
  @IsIn(['ACTIVO', 'INACTIVO'])
  estado?: 'ACTIVO' | 'INACTIVO';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idRol?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idGenero?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idTipoDoc?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idCiudad?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idCasino?: number;
}