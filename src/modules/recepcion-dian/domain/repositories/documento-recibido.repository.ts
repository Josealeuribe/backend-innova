import {
  DocumentoRecibidoEntity,
  EstadoCausacionRecibido,
  NaturalezaContable,
  OrigenDocumentoRecibido,
  TipoDocumentoRecibido,
} from '../entities/documento-recibido.entity';

export interface CrearItemCompraRecibidoData {
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
}

export interface CrearDocumentoRecibidoData {
  idRazonSocial: number;
  idCasino?: number | null;
  cufe?: string | null;
  tipoDocumento: TipoDocumentoRecibido;
  prefijo?: string | null;
  consecutivo?: string | null;
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
  xmlOriginal?: string | null;
  qrUrl?: string | null;
  origen: OrigenDocumentoRecibido;
  estadoCausacion?: EstadoCausacionRecibido;
  requiereRevisionConciliacion?: boolean;
  items: CrearItemCompraRecibidoData[];
}

export interface AsignarPucItemData {
  cuentaPuc: string;
  nombreCuentaPuc?: string | null;
  centroCostos?: string | null;
  nombreCentroCostos?: string | null;
  naturaleza: NaturalezaContable;
  idReglaAplicada?: number | null;
}

export interface ListDocumentosRecibidosQuery {
  page: number;
  limit: number;
  idRazonSocial?: number;
  estadoCausacion?: EstadoCausacionRecibido;
  requiereRevisionConciliacion?: boolean;
  buscar?: string;
}

export interface ListDocumentosRecibidosResult {
  documentos: DocumentoRecibidoEntity[];
  total: number;
}

export interface ResumenRecepcionPorEstado {
  estadoCausacion: EstadoCausacionRecibido;
  cantidad: number;
}

export interface ResumenRecepcion {
  porEstado: ResumenRecepcionPorEstado[];
  documentosDelMes: number;
  requierenRevision: number;
  ultimosDocumentos: DocumentoRecibidoEntity[];
}

export interface CriterioReconciliacion {
  nitEmisor: string;
  numeroDocumentoCompleto: string;
  fechaEmision: Date;
}

export interface DocumentoRecibidoRepository {
  create(
    data: CrearDocumentoRecibidoData,
  ): Promise<DocumentoRecibidoEntity>;

  findById(
    idDocumentoRecibido: number,
  ): Promise<DocumentoRecibidoEntity | null>;

  findByCufe(cufe: string): Promise<DocumentoRecibidoEntity | null>;

  findByReconciliacion(
    criterio: CriterioReconciliacion,
  ): Promise<DocumentoRecibidoEntity[]>;

  findMany(
    query: ListDocumentosRecibidosQuery,
  ): Promise<ListDocumentosRecibidosResult>;

  asignarPucItem(
    idDocumentoRecibido: number,
    idItemCompraRecibido: number,
    data: AsignarPucItemData,
  ): Promise<DocumentoRecibidoEntity>;

  actualizarEstado(
    idDocumentoRecibido: number,
    estadoCausacion: EstadoCausacionRecibido,
  ): Promise<DocumentoRecibidoEntity>;

  marcarRequiereRevision(
    idDocumentoRecibido: number,
    requiereRevisionConciliacion: boolean,
  ): Promise<DocumentoRecibidoEntity>;

  delete(idDocumentoRecibido: number): Promise<void>;

  obtenerResumen(idRazonSocial?: number): Promise<ResumenRecepcion>;
}
