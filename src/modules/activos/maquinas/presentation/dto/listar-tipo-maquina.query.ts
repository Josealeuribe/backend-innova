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

import { EstadoRegistroDto } from './maquina.dto';

export class ListarTipoMaquinaQueryDto {
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit: number = 20;

    @IsOptional()
    @IsString()
    @MaxLength(120)
    buscar?: string;

    @IsOptional()
    @IsEnum(EstadoRegistroDto)
    estado?: EstadoRegistroDto;
}
