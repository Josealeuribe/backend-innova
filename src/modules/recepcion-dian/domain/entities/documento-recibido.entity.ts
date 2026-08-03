export type TipoDocumentoRecibido = 'FACTURA' | 'NOTA_CREDITO' | 'NOTA_DEBITO';

export type OrigenDocumentoRecibido = 'MANUAL' | 'EXCEL_PORTAL';

export type EstadoCausacionRecibido =
  | 'PENDIENTE'
  | 'CONCILIADO'
  | 'CAUSADO'
  | 'EXPORTADO'
  | 'RECHAZADO'
  | 'ERROR_XML';

export type NaturalezaContable = 'D' | 'C';

export type EstadoMapeoPuc = 'SIN_MAPEAR' | 'MAPEADO';

export interface ItemCompraRecibidoEntity {
  idItemCompraRecibido: number;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  codigoImpuesto1: string;
  valorImpuesto1: number;
  codigoImpuesto2: string | null;
  valorImpuesto2: number;
  codigoImpuesto3: string | null;
  valorImpuesto3: number;
  total: number;
  cuentaPuc: string | null;
  nombreCuentaPuc: string | null;
  centroCostos: string | null;
  nombreCentroCostos: string | null;
  naturaleza: NaturalezaContable | null;
  estadoMapeo: EstadoMapeoPuc;
  idReglaAplicada: number | null;
}

export interface DocumentoRecibidoEntity {
  idDocumentoRecibido: number;
  idRazonSocial: number;
  idCasino: number | null;
  cufe: string | null;
  tipoDocumento: TipoDocumentoRecibido;
  prefijo: string | null;
  consecutivo: string | null;
  numeroDocumentoCompleto: string;
  nitEmisor: string;
  nombreEmisor: string;
  fechaEmision: Date;
  subtotal: number;
  iva: number;
  ica: number;
  retencionFuente: number;
  reteIva: number;
  reteIca: number;
  totalPagar: number;
  xmlOriginal: string | null;
  qrUrl: string | null;
  origen: OrigenDocumentoRecibido;
  estadoCausacion: EstadoCausacionRecibido;
  pucPreliminar: string | null;
  requiereRevisionConciliacion: boolean;
  items: ItemCompraRecibidoEntity[];
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
