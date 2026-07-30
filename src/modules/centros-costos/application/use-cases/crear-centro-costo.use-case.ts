import {
  EstadoCentroCosto,
} from '../../domain/entities/centro-costo.entity';

import {
  CentroCostoRepository,
} from '../../domain/repositories/centro-costo.repository';

import {
  CentroCostoCodigoAlreadyExistsError,
} from '../errors/centro-costo.errors';

export interface CrearCentroCostoCommand {
  codigoCentroCosto: string;
  nombreCentroCosto: string;
  estado?: EstadoCentroCosto;
}

export class CrearCentroCostoUseCase {
  constructor(
    private readonly centroCostoRepository:
      CentroCostoRepository,
  ) {}

  async execute(
    command: CrearCentroCostoCommand,
  ) {
    const codigoCentroCosto =
      command.codigoCentroCosto.trim();

    const nombreCentroCosto =
      command.nombreCentroCosto.trim();

    const existingId =
      await this.centroCostoRepository
        .findIdByCodigo(
          codigoCentroCosto,
        );

    if (existingId !== null) {
      throw new CentroCostoCodigoAlreadyExistsError();
    }

    return this.centroCostoRepository.create({
      codigoCentroCosto,
      nombreCentroCosto,
      estado:
        command.estado ?? 'ACTIVO',
    });
  }
}