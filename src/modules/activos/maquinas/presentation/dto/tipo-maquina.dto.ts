import {
    IsEnum,
    IsOptional,
    IsString,
    MaxLength,
} from 'class-validator';

import { EstadoRegistroDto } from './maquina.dto';

export class CrearTipoMaquinaDto {
    @IsString()
    @MaxLength(50)
    codigo!: string;

    @IsString()
    @MaxLength(120)
    nombre!: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    descripcion?: string;

    @IsOptional()
    @IsEnum(EstadoRegistroDto)
    estado?: EstadoRegistroDto;
}

export class ActualizarTipoMaquinaDto {
    @IsOptional()
    @IsString()
    @MaxLength(50)
    codigo?: string;

    @IsOptional()
    @IsString()
    @MaxLength(120)
    nombre?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255)
    descripcion?: string | null;

    @IsOptional()
    @IsEnum(EstadoRegistroDto)
    estado?: EstadoRegistroDto;
}
