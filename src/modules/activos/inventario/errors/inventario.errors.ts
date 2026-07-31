export class InventarioNotFoundError extends Error {
  constructor(idInventario: number) {
    super(
      `No existe un elemento de inventario con el ID ${idInventario}.`,
    );
    this.name = 'InventarioNotFoundError';
  }
}

export class InventarioCodigoAlreadyExistsError extends Error {
  constructor(codigo: string) {
    super(
      `Ya existe un elemento de inventario con el código "${codigo}".`,
    );
    this.name =
      'InventarioCodigoAlreadyExistsError';
  }
}

export class InventarioSerialAlreadyExistsError extends Error {
  constructor(serial: string) {
    super(
      `Ya existe un elemento de inventario con el serial "${serial}".`,
    );
    this.name =
      'InventarioSerialAlreadyExistsError';
  }
}

export class InventarioCasinoNotFoundError extends Error {
  constructor(idCasino: number) {
    super(
      `No existe un casino activo con el ID ${idCasino}.`,
    );
    this.name =
      'InventarioCasinoNotFoundError';
  }
}

export class InventarioResponsableNotFoundError extends Error {
  constructor(idResponsable: number) {
    super(
      `No existe un usuario activo con el ID ${idResponsable}.`,
    );
    this.name =
      'InventarioResponsableNotFoundError';
  }
}

export class InventarioCantidadInvalidaError extends Error {
  constructor() {
    super(
      'La cantidad debe ser un número entero mayor que cero.',
    );
    this.name =
      'InventarioCantidadInvalidaError';
  }
}

export class InventarioValorInvalidoError extends Error {
  constructor() {
    super(
      'El valor no puede ser negativo.',
    );
    this.name =
      'InventarioValorInvalidoError';
  }
}
