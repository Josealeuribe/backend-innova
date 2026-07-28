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
} from '../errors/casino.errors';

export interface CrearCasinoCommand
  extends CasinoForeignKeys {
  nombreCasino: string;
  codigoDane: string;
  codigoEstablecimiento: string;
  telefono: string;
  direccion: string;
  estado?: EstadoCasino;
}

export class CrearCasinoUseCase {
  constructor(
    private readonly casinoRepository:
      CasinoRepository,
  ) {}

  async execute(
    command: CrearCasinoCommand,
  ) {
    const nombreCasino =
      command.nombreCasino.trim();

    const codigoDane =
      command.codigoDane.trim();

    const codigoEstablecimiento =
      command.codigoEstablecimiento.trim();

    const [
      existingNameId,
      existingDaneId,
      existingEstablishmentId,
    ] = await Promise.all([
      this.casinoRepository
        .findIdByNombre(nombreCasino),

      this.casinoRepository
        .findIdByCodigoDane(codigoDane),

      this.casinoRepository
        .findIdByCodigoEstablecimiento(
          codigoEstablecimiento,
        ),
    ]);

    if (existingNameId !== null) {
      throw new CasinoNameAlreadyExistsError();
    }

    if (existingDaneId !== null) {
      throw new CasinoCodigoDaneAlreadyExistsError();
    }

    if (existingEstablishmentId !== null) {
      throw new CasinoCodigoEstablecimientoAlreadyExistsError();
    }

    await this.validateForeignKeys(command);

    return this.casinoRepository.create({
      nombreCasino,
      codigoDane,
      codigoEstablecimiento,

      telefono: command.telefono.trim(),
      direccion: command.direccion.trim(),

      idCiudad: command.idCiudad,
      idCentroCosto:
        command.idCentroCosto,
      idRazonSocial:
        command.idRazonSocial,

      estado: command.estado ?? 'ACTIVO',
    });
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