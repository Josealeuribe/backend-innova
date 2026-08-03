import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CrearResolucionDianDto {
  @IsInt()
  @IsPositive()
  idRazonSocial!: number;

  @IsIn(['FACTURA', 'DOC_SOPORTE'])
  tipoDocumento!: 'FACTURA' | 'DOC_SOPORTE';

  @IsIn(['1', '2'])
  entorno!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  prefijo!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  numeroResolucion!: string;

  @IsInt()
  @Min(0)
  rangoDesde!: number;

  @IsInt()
  @Min(0)
  rangoHasta!: number;

  @IsDateString()
  fechaVigenciaDesde!: string;

  @IsDateString()
  fechaVigenciaHasta!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  claveTecnica!: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
