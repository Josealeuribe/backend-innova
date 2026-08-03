import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';

import { ItemFacturaDto } from './item-factura-dto';

export class CrearFacturaElectronicaDto {
  @IsInt()
  @IsPositive()
  idRazonSocial!: number;

  @IsInt()
  @IsPositive()
  idClienteDian!: number;

  @IsIn(['1', '2'])
  entorno!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ItemFacturaDto)
  items!: ItemFacturaDto[];
}
