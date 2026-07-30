import {
  CentroCostoRepository,
} from '../../domain/repositories/centro-costo.repository';

import {
  CentroCostoNotFoundError,
} from '../errors/centro-costo.errors';

export class EliminarCentroCostoUseCase {
  constructor(
    private readonly centroCostoRepository:
      CentroCostoRepository,
  ) {}

  async execute(
    idCentroCosto: number,
  ) {
    const centroCosto =
      await this.centroCostoRepository.findById(
        idCentroCosto,
      );

    if (!centroCosto) {
      throw new CentroCostoNotFoundError();
    }

    return this.centroCostoRepository.deactivate(
      idCentroCosto,
    );
  }
}