import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ActualizarReglaMapeoPucDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(150)
  nombre?: string;

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(150)
  concepto?: string;

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

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cuentaPuc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  nombreCuentaPuc?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  centroCostos?: string;

  @IsOptional()
  @IsIn(['D', 'C'])
  naturaleza?: 'D' | 'C';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  prioridad?: number;

  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
