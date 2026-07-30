import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';
import { EstadoRegistro } from 'src/generated/prisma/client';

export class CrearRazonSocialDto {
  @IsString() @IsNotEmpty() @MaxLength(30) @Matches(/^[0-9.-]+$/, { message: 'El NIT solo puede contener números, puntos y guion.' }) nit!: string;
  @IsString() @IsNotEmpty() @MinLength(2) @MaxLength(180) nombreRazonSocial!: string;
  @IsString() @IsNotEmpty() @MaxLength(30) @Matches(/^[0-9+()\-\s]+$/, { message: 'El teléfono tiene un formato inválido.' }) telefono!: string;
  @IsString() @IsNotEmpty() @MinLength(3) @MaxLength(200) direccion!: string;
  @IsOptional() @IsString() @MaxLength(20) codigoPostal?: string | null;
  @IsEmail() @MaxLength(191) correo!: string;
  @Type(() => Number) @IsInt() @Min(1) idPais!: number;
  @Type(() => Number) @IsInt() @Min(1) idDepartamento!: number;
  @Type(() => Number) @IsInt() @Min(1) idCiudad!: number;
  @Type(() => Number) @IsInt() @Min(1) idTipoPersona!: number;
  @Type(() => Number) @IsInt() @Min(1) idAmbienteDian!: number;
  @Type(() => Number) @IsInt() @Min(1) idRegimen!: number;
  @IsString() @IsNotEmpty() @MaxLength(120) responsabilidadFiscal!: string;
  @IsOptional() @IsString() @MaxLength(100) contratoColjuegos?: string | null;
  @IsOptional() @IsDateString() fechaInicioContrato?: string | null;
  @IsOptional() @IsDateString() fechaFinContrato?: string | null;
  @IsOptional() @IsString() @MaxLength(100) softwareId?: string | null;
  @IsOptional() @IsString() @MaxLength(255) softwarePin?: string | null;
  @IsOptional() @IsString() @MaxLength(150) testSetId?: string | null;
  @IsOptional() @IsString() @MaxLength(255) claveTecnica?: string | null;
  @IsOptional() @IsString() @MaxLength(100) numeroResolucion?: string | null;
  @IsOptional() @IsString() @MaxLength(30) prefijoResolucion?: string | null;
  @IsOptional() @IsString() @MaxLength(30) @Matches(/^\d+$/, { message: 'El rango inicial debe contener solo números.' }) rangoInicio?: string | null;
  @IsOptional() @IsString() @MaxLength(30) @Matches(/^\d+$/, { message: 'El rango final debe contener solo números.' }) rangoFin?: string | null;
  @IsOptional() @IsDateString() fechaInicioResolucion?: string | null;
  @IsOptional() @IsDateString() fechaFinResolucion?: string | null;
  @IsOptional() @IsString() @MaxLength(50) codigoHelisa?: string | null;
  @IsOptional() @IsEnum(EstadoRegistro) estado?: EstadoRegistro;
}
