import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class ImportarExcelDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idRazonSocial!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idCasino?: number;
}
