export class CasinoNotFoundError extends Error {
  constructor() {
    super('El casino no existe.');
    this.name = 'CasinoNotFoundError';
  }
}

export class CasinoNameAlreadyExistsError extends Error {
  constructor() {
    super(
      'Ya existe un casino con ese nombre.',
    );

    this.name =
      'CasinoNameAlreadyExistsError';
  }
}

export class CasinoCodigoDaneAlreadyExistsError
  extends Error {
  constructor() {
    super(
      'Ya existe un casino con ese código DANE.',
    );

    this.name =
      'CasinoCodigoDaneAlreadyExistsError';
  }
}

export class CasinoCodigoEstablecimientoAlreadyExistsError
  extends Error {
  constructor() {
    super(
      'Ya existe un casino con ese código de establecimiento.',
    );

    this.name =
      'CasinoCodigoEstablecimientoAlreadyExistsError';
  }
}

export class CasinoForeignKeyError extends Error {
  constructor(
    public readonly relacionesFaltantes:
      string[],
  ) {
    super(
      `No existen las siguientes relaciones: ${relacionesFaltantes.join(', ')}.`,
    );

    this.name = 'CasinoForeignKeyError';
  }
}