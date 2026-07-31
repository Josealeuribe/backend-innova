import { Type } from 'class-transformer';
import {
    IsDateString,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    Min,
} from 'class-validator';

export enum EstadoRegistroDto {
    ACTIVO = 'ACTIVO',
    INACTIVO = 'INACTIVO',
}

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class CrearMaquinaDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idInventario!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idCasino!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idPais!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    idTipoMaquina!: number;

    @IsString()
    @MaxLength(100)
    serial!: string;

    @IsString()
    @MaxLength(50)
    numeroInterno!: string;

    @IsString()
    @MaxLength(100)
    nuc!: string;

    @IsString()
    @MaxLength(100)
    nuid!: string;

    @IsString()
    @MaxLength(100)
    marca!: string;

    @IsString()
    @MaxLength(100)
    modelo!: string;

    @IsDateString()
    @Matches(DATE_ONLY_PATTERN, {
        message:
            'fechaFabricacion debe tener el formato YYYY-MM-DD.',
    })
    fechaFabricacion!: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    frecuenciaMantenimiento!: number;

    @IsOptional()
    @IsDateString()
    @Matches(DATE_ONLY_PATTERN, {
        message:
            'ultimoMantenimiento debe tener el formato YYYY-MM-DD.',
    })
    ultimoMantenimiento?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    imgDocumentoLegal?: string;

    @IsOptional()
    @IsEnum(EstadoRegistroDto)
    estado?: EstadoRegistroDto;
}

export class ActualizarMaquinaDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idInventario?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idCasino?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idPais?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    idTipoMaquina?: number;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    serial?: string;

    @IsOptional()
    @IsString()
    @MaxLength(50)
    numeroInterno?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    nuc?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    nuid?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    marca?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    modelo?: string;

    @IsOptional()
    @IsDateString()
    @Matches(DATE_ONLY_PATTERN, {
        message:
            'fechaFabricacion debe tener el formato YYYY-MM-DD.',
    })
    fechaFabricacion?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    frecuenciaMantenimiento?: number;

    @IsOptional()
    @IsDateString()
    @Matches(DATE_ONLY_PATTERN, {
        message:
            'ultimoMantenimiento debe tener el formato YYYY-MM-DD.',
    })
    ultimoMantenimiento?: string | null;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    imgDocumentoLegal?: string | null;

    @IsOptional()
    @IsEnum(EstadoRegistroDto)
    estado?: EstadoRegistroDto;
}
