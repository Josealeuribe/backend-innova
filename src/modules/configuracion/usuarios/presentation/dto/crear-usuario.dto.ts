import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CrearUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  apellido: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  cedula: string;

  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim().toLowerCase()
      : value,
  )
  @IsEmail()
  @MaxLength(191)
  correo: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  contrasena: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  cargo: string;

  @IsDateString()
  fechaNacimiento: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  telefono: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  codigoHelisa?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  cuentaPuc?: string | null;

  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  imgUrl?: string | null;

  @IsOptional()
  @IsIn(['ACTIVO', 'INACTIVO'])
  estado?: 'ACTIVO' | 'INACTIVO';

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idTipoDoc: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idGenero: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idRol: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idCiudad: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idCasino: number;
}