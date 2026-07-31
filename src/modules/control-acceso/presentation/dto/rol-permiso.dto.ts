import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';

export class PermisoRolItemDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idPermiso!: number;

  @IsBoolean()
  permitido!: boolean;
}

export class GuardarPermisosRolDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique((item: PermisoRolItemDto) => item.idPermiso)
  @ValidateNested({ each: true })
  @Type(() => PermisoRolItemDto)
  permisos!: PermisoRolItemDto[];
}
