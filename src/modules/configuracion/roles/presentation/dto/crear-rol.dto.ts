import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { EstadoRegistro } from 'src/generated/prisma/client';

export class CrearRolDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es obligatorio.' })
  @MinLength(2, {
    message: 'El nombre del rol debe tener al menos 2 caracteres.',
  })
  @MaxLength(100, {
    message: 'El nombre del rol no puede superar los 100 caracteres.',
  })
  nombreRol!: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto.' })
  @MaxLength(255, {
    message: 'La descripción no puede superar los 255 caracteres.',
  })
  descripcion?: string | null;

  @IsOptional()
  @IsEnum(EstadoRegistro, {
    message: 'El estado debe ser ACTIVO o INACTIVO.',
  })
  estado?: EstadoRegistro;
}
