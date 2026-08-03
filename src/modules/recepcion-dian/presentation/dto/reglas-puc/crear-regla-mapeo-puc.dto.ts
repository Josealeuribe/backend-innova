import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CrearReglaMapeoPucDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idRazonSocial!: number;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nombre!: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  concepto!: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  nitEmisor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(180)
  nombreEmisor?: string;

  @IsOptional()
  @IsIn(['FACTURA', 'NOTA_CREDITO', 'NOTA_DEBITO'])
  tipoDocumento?: 'FACTURA' | 'NOTA_CREDITO' | 'NOTA_DEBITO';

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  cuentaPuc!: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreCuentaPuc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  centroCostos?: string;

  @IsIn(['D', 'C'])
  naturaleza!: 'D' | 'C';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  prioridad?: number;
}
