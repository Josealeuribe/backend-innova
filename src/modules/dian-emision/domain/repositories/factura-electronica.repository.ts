import {
  EstadoDocumentoDian,
  FacturaElectronicaEntity,
} from '../entities/factura-electronica.entity';
import { ResolucionDianEntity } from '../entities/resolucion-dian.entity';

export interface CrearFacturaElectronicaItemData {
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

export interface DocumentoConstruidoFacturaElectronica {
  cufe: string;
  qrcodeData: string | null;
  xmlContent: string;
  nombreArchivoXml: string;
  subtotal: number;
  iva: number;
  incConsumo: number;
  ica: number;
  total: number;
}

export interface ConstruirDocumentoContext {
  resolucion: ResolucionDianEntity;
  consecutivo: number;
  fechaEmision: Date;
}

export interface CrearFacturaElectronicaParams {
  idRazonSocial: number;
  idClienteDian: number;
  idUsuario: number;
  entorno: string;
  items: CrearFacturaElectronicaItemData[];
  /**
   * Se invoca DENTRO de la transacción que bloquea la resolución activa,
   * una vez asignado el consecutivo — para que el CUFE y el XML se calculen
   * con el número de documento definitivo sin condición de carrera.
   */
  construirDocumento(
    context: ConstruirDocumentoContext,
  ): DocumentoConstruidoFacturaElectronica;
}

export interface ListFacturasElectronicasQuery {
  page: number;
  limit: number;
  idRazonSocial?: number;
  estadoDian?: EstadoDocumentoDian;
}

export interface ListFacturasElectronicasResult {
  facturas: FacturaElectronicaEntity[];
  total: number;
}

export interface ResumenDianPorEstado {
  estadoDian: EstadoDocumentoDian;
  cantidad: number;
}

export interface ResumenDian {
  porEstado: ResumenDianPorEstado[];
  totalFacturado: number;
  facturasDelMes: number;
  ultimasFacturas: FacturaElectronicaEntity[];
}

export interface FacturaElectronicaRepository {
  /**
   * Bloquea la resolución activa (tipo FACTURA) de la razón social,
   * asigna el siguiente consecutivo, construye el documento (CUFE/XML) y
   * persiste la factura + sus items, todo en una única transacción atómica.
   */
  crearFacturaElectronica(
    params: CrearFacturaElectronicaParams,
  ): Promise<FacturaElectronicaEntity>;

  findById(
    idFacturaElectronica: number,
  ): Promise<FacturaElectronicaEntity | null>;

  findMany(
    query: ListFacturasElectronicasQuery,
  ): Promise<ListFacturasElectronicasResult>;

  obtenerResumen(idRazonSocial?: number): Promise<ResumenDian>;
}
