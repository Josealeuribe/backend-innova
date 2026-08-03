import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { EstadoRegistro } from 'src/generated/prisma/client';

export class ListarMaquinasQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message:
      'La página debe ser un número entero.',
  })
  @Min(1, {
    message:
      'La página debe ser mayor o igual a 1.',
  })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message:
      'El límite debe ser un número entero.',
  })
  @Min(1, {
    message:
      'El límite debe ser mayor o igual a 1.',
  })
  @Max(100, {
    message:
      'El límite no puede superar 100 registros.',
  })
  limit: number = 20;

  @IsOptional()
  @IsString({
    message:
      'La búsqueda debe ser una cadena de texto.',
  })
  @MaxLength(150, {
    message:
      'La búsqueda no puede superar 150 caracteres.',
  })
  buscar?: string;

  @IsOptional()
  @IsEnum(EstadoRegistro, {
    message:
      'El estado debe ser ACTIVO o INACTIVO.',
  })
  estado?: EstadoRegistro;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message:
      'El ID del casino debe ser un número entero.',
  })
  @Min(1, {
    message:
      'El ID del casino debe ser mayor que cero.',
  })
  idCasino?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message:
      'El ID del país debe ser un número entero.',
  })
  @Min(1, {
    message:
      'El ID del país debe ser mayor que cero.',
  })
  idPais?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message:
      'El ID del tipo de máquina debe ser un número entero.',
  })
  @Min(1, {
    message:
      'El ID del tipo de máquina debe ser mayor que cero.',
  })
  idTipoMaquina?: number;

  @IsOptional()
  @IsString({
    message:
      'La marca debe ser una cadena de texto.',
  })
  @MaxLength(100, {
    message:
      'La marca no puede superar 100 caracteres.',
  })
  marca?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({
    message:
      'El ID del inventario debe ser un número entero.',
  })
  @Min(1, {
    message:
      'El ID del inventario debe ser mayor que cero.',
  })
  idInventario?: number;
}