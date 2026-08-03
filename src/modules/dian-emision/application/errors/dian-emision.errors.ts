export class ResolucionDianNotFoundError extends Error {
  constructor() {
    super('La resolución DIAN no existe.');
    this.name = 'ResolucionDianNotFoundError';
  }
}

export class ResolucionDianActivaExistenteError extends Error {
  constructor() {
    super(
      'Ya existe una resolución activa para ese tipo de documento y entorno en esta razón social.',
    );
    this.name = 'ResolucionDianActivaExistenteError';
  }
}

export class ResolucionDianNoActivaError extends Error {
  constructor(tipoDocumento: string, entorno: string) {
    super(
      `No existe una resolución activa de tipo ${tipoDocumento} para el entorno ${entorno} en esta razón social.`,
    );
    this.name = 'ResolucionDianNoActivaError';
  }
}

export class RangoResolucionAgotadoError extends Error {
  constructor(rangoHasta: number) {
    super(`El rango de la resolución está agotado (máximo ${rangoHasta}).`);
    this.name = 'RangoResolucionAgotadoError';
  }
}

export class ResolucionDianExpiradaError extends Error {
  constructor(fechaVigenciaHasta: Date) {
    super(
      `La resolución expiró el ${fechaVigenciaHasta.toISOString().slice(0, 10)}.`,
    );
    this.name = 'ResolucionDianExpiradaError';
  }
}

export class ClienteDianNotFoundError extends Error {
  constructor() {
    super('El cliente DIAN no existe.');
    this.name = 'ClienteDianNotFoundError';
  }
}

export class ClienteDianDocumentoExistenteError extends Error {
  constructor() {
    super('Ya existe un cliente DIAN con ese número de documento.');
    this.name = 'ClienteDianDocumentoExistenteError';
  }
}

export class RazonSocialDianNotFoundError extends Error {
  constructor() {
    super('La razón social no existe.');
    this.name = 'RazonSocialDianNotFoundError';
  }
}

export class RazonSocialSinCredencialesDianError extends Error {
  constructor() {
    super(
      'La razón social no tiene configuradas las credenciales de software DIAN (softwareId/softwarePin).',
    );
    this.name = 'RazonSocialSinCredencialesDianError';
  }
}

export class FacturaElectronicaSinItemsError extends Error {
  constructor() {
    super('La factura debe tener al menos un ítem.');
    this.name = 'FacturaElectronicaSinItemsError';
  }
}

export class FacturaElectronicaNotFoundError extends Error {
  constructor() {
    super('La factura electrónica no existe.');
    this.name = 'FacturaElectronicaNotFoundError';
  }
}
