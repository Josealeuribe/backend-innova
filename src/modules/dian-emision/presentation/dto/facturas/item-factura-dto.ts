import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';

export class ItemFacturaDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsNumber()
  @IsPositive()
  cantidad!: number;

  @IsNumber()
  @Min(0)
  precioUnitario!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  descuento?: number;

  @IsOptional()
  @IsString()
  codigoImpuesto1?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorImpuesto1?: number;

  @IsOptional()
  @IsString()
  codigoImpuesto2?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorImpuesto2?: number;

  @IsOptional()
  @IsString()
  codigoImpuesto3?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  valorImpuesto3?: number;
}
