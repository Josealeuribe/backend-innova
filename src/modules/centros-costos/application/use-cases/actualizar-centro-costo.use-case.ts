import {
  EstadoCentroCosto,
} from '../../domain/entities/centro-costo.entity';

import {
  CentroCostoRepository,
} from '../../domain/repositories/centro-costo.repository';

import {
  CentroCostoCodigoAlreadyExistsError,
  CentroCostoNotFoundError,
} from '../errors/centro-costo.errors';

export interface ActualizarCentroCostoCommand {
  codigoCentroCosto?: string;
  nombreCentroCosto?: string;
  estado?: EstadoCentroCosto;
}

export class ActualizarCentroCostoUseCase {
  constructor(
    private readonly centroCostoRepository:
      CentroCostoRepository,
  ) {}

  async execute(
    idCentroCosto: number,
    command: ActualizarCentroCostoCommand,
  ) {
    const current =
      await this.centroCostoRepository.findById(
        idCentroCosto,
      );

    if (!current) {
      throw new CentroCostoNotFoundError();
    }

    const codigoCentroCosto =
      command.codigoCentroCosto?.trim();

    const nombreCentroCosto =
      command.nombreCentroCosto?.trim();

    if (codigoCentroCosto !== undefined) {
      const existingId =
        await this.centroCostoRepository
          .findIdByCodigo(
            codigoCentroCosto,
          );

      if (
        existingId !== null &&
        existingId !== idCentroCosto
      ) {
        throw new CentroCostoCodigoAlreadyExistsError();
      }
    }

    return this.centroCostoRepository.update(
      idCentroCosto,
      {
        codigoCentroCosto,
        nombreCentroCosto,
        estado: command.estado,
      },
    );
  }
}