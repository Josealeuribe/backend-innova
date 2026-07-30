export type EstadoRazonSocial = 'ACTIVO' | 'INACTIVO';

export interface CatalogoRelacionado {
  id: number;
  codigo?: string;
  nombre: string;
}

export interface RazonSocialEntity {
  idRazonSocial: number;
  nit: string;
  nombreRazonSocial: string;
  telefono: string;
  direccion: string;
  codigoPostal: string | null;
  correo: string;
  idPais: number;
  idDepartamento: number;
  idCiudad: number;
  idTipoPersona: number;
  idAmbienteDian: number;
  idRegimen: number;
  responsabilidadFiscal: string;
  contratoColjuegos: string | null;
  fechaInicioContrato: Date | null;
  fechaFinContrato: Date | null;
  softwareId: string | null;
  softwarePin: string | null;
  testSetId: string | null;
  claveTecnica: string | null;
  numeroResolucion: string | null;
  prefijoResolucion: string | null;
  rangoInicio: string | null;
  rangoFin: string | null;
  fechaInicioResolucion: Date | null;
  fechaFinResolucion: Date | null;
  codigoHelisa: string | null;
  estado: EstadoRazonSocial;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  pais: CatalogoRelacionado;
  departamento: CatalogoRelacionado;
  ciudad: CatalogoRelacionado;
  tipoPersona: CatalogoRelacionado;
  ambienteDian: CatalogoRelacionado;
  regimen: CatalogoRelacionado;
}
