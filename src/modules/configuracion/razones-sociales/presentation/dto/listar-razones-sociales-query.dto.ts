import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { EstadoRegistro } from 'src/generated/prisma/client';

export class ListarRazonesSocialesQueryDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page = 1;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) @Max(100) limit = 20;
  @IsOptional() @IsString() @MaxLength(150) buscar?: string;
  @IsOptional() @IsEnum(EstadoRegistro) estado?: EstadoRegistro;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) idPais?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) idDepartamento?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) idCiudad?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) idTipoPersona?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) idAmbienteDian?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) idRegimen?: number;
}
