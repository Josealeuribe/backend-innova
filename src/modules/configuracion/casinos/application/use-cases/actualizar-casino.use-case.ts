import {
  EstadoCasino,
} from '../../domain/entities/casino.entity';

import {
  CasinoForeignKeys,
  CasinoRepository,
} from '../../domain/repositories/casino.repository';

import {
  CasinoCodigoDaneAlreadyExistsError,
  CasinoCodigoEstablecimientoAlreadyExistsError,
  CasinoForeignKeyError,
  CasinoNameAlreadyExistsError,
  CasinoNotFoundError,
} from '../errors/casino.errors';

export interface ActualizarCasinoCommand {
  nombreCasino?: string;
  codigoDane?: string;
  codigoEstablecimiento?: string;
  telefono?: string;
  direccion?: string;
  estado?: EstadoCasino;

  idCiudad?: number;
  idCentroCosto?: number;
  idRazonSocial?: number;
}

export class ActualizarCasinoUseCase {
  constructor(
    private readonly casinoRepository:
      CasinoRepository,
  ) {}

  async execute(
    idCasino: number,
    command: ActualizarCasinoCommand,
  ) {
    const current =
      await this.casinoRepository.findById(
        idCasino,
      );

    if (!current) {
      throw new CasinoNotFoundError();
    }

    const nombreCasino =
      command.nombreCasino?.trim();

    const codigoDane =
      command.codigoDane?.trim();

    const codigoEstablecimiento =
      command.codigoEstablecimiento?.trim();

    if (nombreCasino) {
      const existingId =
        await this.casinoRepository
          .findIdByNombre(nombreCasino);

      if (
        existingId !== null &&
        existingId !== idCasino
      ) {
        throw new CasinoNameAlreadyExistsError();
      }
    }

    if (codigoDane) {
      const existingId =
        await this.casinoRepository
          .findIdByCodigoDane(codigoDane);

      if (
        existingId !== null &&
        existingId !== idCasino
      ) {
        throw new CasinoCodigoDaneAlreadyExistsError();
      }
    }

    if (codigoEstablecimiento) {
      const existingId =
        await this.casinoRepository
          .findIdByCodigoEstablecimiento(
            codigoEstablecimiento,
          );

      if (
        existingId !== null &&
        existingId !== idCasino
      ) {
        throw new CasinoCodigoEstablecimientoAlreadyExistsError();
      }
    }

    const finalForeignKeys: CasinoForeignKeys = {
      idCiudad:
        command.idCiudad ??
        current.ciudad.idCiudad,

      idCentroCosto:
        command.idCentroCosto ??
        current.centroCosto.idCentroCosto,

      idRazonSocial:
        command.idRazonSocial ??
        current.razonSocial.idRazonSocial,
    };

    await this.validateForeignKeys(
      finalForeignKeys,
    );

    return this.casinoRepository.update(
      idCasino,
      {
        nombreCasino,
        codigoDane,
        codigoEstablecimiento,

        telefono:
          command.telefono?.trim(),

        direccion:
          command.direccion?.trim(),

        estado: command.estado,

        idCiudad: command.idCiudad,

        idCentroCosto:
          command.idCentroCosto,

        idRazonSocial:
          command.idRazonSocial,
      },
    );
  }

  private async validateForeignKeys(
    foreignKeys: CasinoForeignKeys,
  ): Promise<void> {
    const result =
      await this.casinoRepository
        .checkForeignKeys(foreignKeys);

    const missing: string[] = [];

    if (!result.ciudad) {
      missing.push('ciudad');
    }

    if (!result.centroCosto) {
      missing.push('centro de costos');
    }

    if (!result.razonSocial) {
      missing.push('razón social');
    }

    if (missing.length > 0) {
      throw new CasinoForeignKeyError(
        missing,
      );
    }
  }
}