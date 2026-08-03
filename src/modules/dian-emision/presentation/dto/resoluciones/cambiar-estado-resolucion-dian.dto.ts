import { IsBoolean } from 'class-validator';

export class CambiarEstadoResolucionDianDto {
  @IsBoolean()
  activa!: boolean;
}
