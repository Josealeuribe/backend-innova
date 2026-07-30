import {
  PartialType,
} from '@nestjs/mapped-types';

import {
  CrearCentroCostoDto,
} from './crear-centro-costo.dto';

export class ActualizarCentroCostoDto
  extends PartialType(
    CrearCentroCostoDto,
  ) {}