import { Transform } from 'class-transformer';

import {
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class ListarPaisesQueryDto {
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.trim()
      : value,
  )
  @IsString()
  @MaxLength(100)
  buscar?: string;
}