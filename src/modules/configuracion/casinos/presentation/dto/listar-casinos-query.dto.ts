import {
    Transform,
    Type,
} from 'class-transformer';

import {
    IsIn,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class ListarCasinosQueryDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page = 1;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit = 20;

    @IsOptional()
    @Transform(({ value }) =>
        typeof value === 'string'
            ? value.trim()
            : value,
    )
    @IsString()
    buscar?: string;

    @IsOptional()
    @IsIn(['ACTIVO', 'INACTIVO'])
    estado?: 'ACTIVO' | 'INACTIVO';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    idCiudad?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    idCentroCosto?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    idRazonSocial?: number;
}