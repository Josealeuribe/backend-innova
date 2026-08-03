export type TipoDocumentoDian = 'FACTURA' | 'DOC_SOPORTE';

export interface ResolucionDianEntity {
  idResolucionDian: number;
  idRazonSocial: number;
  tipoDocumento: TipoDocumentoDian;
  entorno: string;
  prefijo: string;
  numeroResolucion: string;
  rangoDesde: number;
  rangoHasta: number;
  consecutivoActual: number;
  fechaVigenciaDesde: Date;
  fechaVigenciaHasta: Date;
  claveTecnica: string;
  activa: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
