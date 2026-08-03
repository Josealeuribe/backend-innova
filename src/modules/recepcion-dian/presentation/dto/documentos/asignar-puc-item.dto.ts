import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class AsignarPucItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idReglaMapeoPuc?: number;

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
  @IsString()
  @MaxLength(150)
  nombreCentroCostos?: string;

  @IsOptional()
  @IsIn(['D', 'C'])
  naturaleza?: 'D' | 'C';
}
