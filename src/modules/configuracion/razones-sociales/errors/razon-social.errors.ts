export class RazonSocialNotFoundError extends Error {
  constructor(id: number) { super(`No existe una razón social con el ID ${id}.`); this.name = 'RazonSocialNotFoundError'; }
}
export class RazonSocialNitAlreadyExistsError extends Error {
  constructor(nit: string) { super(`Ya existe una razón social con el NIT ${nit}.`); this.name = 'RazonSocialNitAlreadyExistsError'; }
}
export class RazonSocialCorreoAlreadyExistsError extends Error {
  constructor(correo: string) { super(`Ya existe una razón social con el correo ${correo}.`); this.name = 'RazonSocialCorreoAlreadyExistsError'; }
}
export class RazonSocialForeignKeyError extends Error {
  constructor(public readonly relaciones: string[]) { super(`No existen o están inactivos: ${relaciones.join(', ')}.`); this.name = 'RazonSocialForeignKeyError'; }
}
export class RazonSocialUbicacionInvalidaError extends Error {
  constructor() { super('La ciudad no pertenece al departamento seleccionado o el departamento no pertenece al país seleccionado.'); this.name = 'RazonSocialUbicacionInvalidaError'; }
}
export class RazonSocialContratoFechasInvalidasError extends Error {
  constructor() { super('La fecha final del contrato no puede ser anterior a la fecha inicial.'); this.name = 'RazonSocialContratoFechasInvalidasError'; }
}
export class RazonSocialResolucionFechasInvalidasError extends Error {
  constructor() { super('La fecha final de la resolución no puede ser anterior a la fecha inicial.'); this.name = 'RazonSocialResolucionFechasInvalidasError'; }
}
export class RazonSocialRangoResolucionInvalidoError extends Error {
  constructor() { super('El rango final debe ser mayor o igual al rango inicial.'); this.name = 'RazonSocialRangoResolucionInvalidoError'; }
}
