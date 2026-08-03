import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ActualizarClienteDianDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(180)
  nombre?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  tipoDocumento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  ciudad?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150)
  departamento?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(191)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5)
  tipoPersona?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  responsabilidadFiscal?: string;
}
