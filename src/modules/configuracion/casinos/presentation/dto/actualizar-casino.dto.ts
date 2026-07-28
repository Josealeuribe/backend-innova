import { PartialType } from '@nestjs/mapped-types';

import { CrearCasinoDto } from './crear-casino.dto';

export class ActualizarCasinoDto extends PartialType(
  CrearCasinoDto,
) {}