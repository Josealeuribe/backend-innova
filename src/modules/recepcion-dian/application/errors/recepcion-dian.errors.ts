export class XmlInvalidoError extends Error {
  constructor(motivo: string) {
    super(`El XML no es válido: ${motivo}`);
    this.name = 'XmlInvalidoError';
  }
}

export class DocumentoRecibidoCufeExistenteError extends Error {
  constructor() {
    super('Ya existe un documento recibido con ese CUFE.');
    this.name = 'DocumentoRecibidoCufeExistenteError';
  }
}

export class DocumentoRecibidoNotFoundError extends Error {
  constructor() {
    super('El documento recibido no existe.');
    this.name = 'DocumentoRecibidoNotFoundError';
  }
}

export class ItemCompraRecibidoNotFoundError extends Error {
  constructor() {
    super('El ítem del documento recibido no existe.');
    this.name = 'ItemCompraRecibidoNotFoundError';
  }
}

export class DocumentoRecibidoSinItemsMapeadosError extends Error {
  constructor() {
    super(
      'No se puede causar el documento: todos los ítems deben tener cuenta PUC asignada.',
    );
    this.name = 'DocumentoRecibidoSinItemsMapeadosError';
  }
}

export class TransicionEstadoInvalidaError extends Error {
  constructor(desde: string, hasta: string) {
    super(`No se puede pasar de "${desde}" a "${hasta}".`);
    this.name = 'TransicionEstadoInvalidaError';
  }
}

export class ExcelPortalInvalidoError extends Error {
  constructor(motivo: string) {
    super(`El archivo Excel no es válido: ${motivo}`);
    this.name = 'ExcelPortalInvalidoError';
  }
}

export class ReglaMapeoPucNotFoundError extends Error {
  constructor() {
    super('La regla de mapeo PUC no existe.');
    this.name = 'ReglaMapeoPucNotFoundError';
  }
}

export class AsignacionPucInvalidaError extends Error {
  constructor() {
    super(
      'Debes indicar cuentaPuc y naturaleza, o seleccionar una regla existente.',
    );
    this.name = 'AsignacionPucInvalidaError';
  }
}
