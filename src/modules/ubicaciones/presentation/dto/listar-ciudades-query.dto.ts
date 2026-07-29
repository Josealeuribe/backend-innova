import {
  Transform,
  Type,
} from 'class-transformer';

import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class ListarCiudadesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idPais?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idDepartamento?: number;

  @IsOptional()
  @IsIn([
    'ACTIVO',
    'INACTIVO',
  ])
  estado?: 'ACTIVO' | 'INACTIVO';

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @MaxLength(150)
  buscar?: string;
}