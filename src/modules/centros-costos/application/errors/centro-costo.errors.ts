export class CentroCostoNotFoundError
  extends Error {
  constructor() {
    super('El centro de costos no existe.');
    this.name =
      'CentroCostoNotFoundError';
  }
}

export class CentroCostoCodigoAlreadyExistsError
  extends Error {
  constructor() {
    super(
      'Ya existe un centro de costos con ese código.',
    );

    this.name =
      'CentroCostoCodigoAlreadyExistsError';
  }
}