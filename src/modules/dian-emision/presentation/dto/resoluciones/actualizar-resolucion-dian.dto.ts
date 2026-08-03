import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ActualizarResolucionDianDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  prefijo?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  numeroResolucion?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  rangoDesde?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  rangoHasta?: number;

  @IsOptional()
  @IsDateString()
  fechaVigenciaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaVigenciaHasta?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  claveTecnica?: string;
}
