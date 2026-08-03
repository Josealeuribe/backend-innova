export type EstadoDocumentoDian =
  | 'PENDIENTE'
  | 'ENVIANDO'
  | 'EN_PROCESO'
  | 'ACEPTADO'
  | 'RECHAZADO'
  | 'ERROR_TECNICO';

export interface FacturaElectronicaItemEntity {
  idFacturaElectronicaItem: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  descuento: number;
  subtotal: number;
  codigoImpuesto1: string;
  valorImpuesto1: number;
  codigoImpuesto2: string | null;
  valorImpuesto2: number;
  codigoImpuesto3: string | null;
  valorImpuesto3: number;
  total: number;
}

export interface FacturaElectronicaEntity {
  idFacturaElectronica: number;
  idRazonSocial: number;
  idClienteDian: number;
  idUsuario: number;
  idResolucionDian: number;
  prefijo: string;
  consecutivo: number;
  fechaEmision: Date;
  cufe: string;
  qrcodeData: string | null;
  xmlContent: string;
  nombreArchivoXml: string;
  estadoDian: EstadoDocumentoDian;
  trackId: string | null;
  mensajeError: string | null;
  subtotal: number;
  iva: number;
  incConsumo: number;
  ica: number;
  total: number;
  items: FacturaElectronicaItemEntity[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
