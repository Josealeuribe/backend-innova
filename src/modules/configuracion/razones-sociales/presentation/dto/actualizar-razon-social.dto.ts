import { PartialType } from '@nestjs/mapped-types';
import { CrearRazonSocialDto } from './crear-razon-social.dto';
export class ActualizarRazonSocialDto extends PartialType(CrearRazonSocialDto) {}
