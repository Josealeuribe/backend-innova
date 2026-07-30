import {
  Transform,
} from 'class-transformer';

import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CrearCentroCostoDto {
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigoCentroCosto!: string;

  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombreCentroCosto!: string;

  @IsOptional()
  @IsIn([
    'ACTIVO',
    'INACTIVO',
  ])
  estado?: 'ACTIVO' | 'INACTIVO';
}