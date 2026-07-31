import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import { EstadoInventario } from 'src/generated/prisma/client';

export class CrearInventarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(500)
  fotoSerial?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  fotoEstado?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  codigo!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(150)
  nombre!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  serial?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  clasificacion!: string;

  @IsOptional()
  @IsEnum(EstadoInventario)
  estado?: EstadoInventario;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidad?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  valor?: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  idCasino!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idResponsable?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  ubicacionLocal?: string | null;

  @IsOptional()
  @IsDateString()
  fechaAdquisicion?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  observaciones?: string | null;
}
