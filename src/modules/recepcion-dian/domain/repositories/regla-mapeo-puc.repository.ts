import {
  NaturalezaContable,
  TipoDocumentoRecibido,
} from '../entities/documento-recibido.entity';
import { ReglaMapeoPucEntity } from '../entities/regla-mapeo-puc.entity';

export interface CrearReglaMapeoPucData {
  idRazonSocial: number;
  nombre: string;
  concepto: string;
  nitEmisor?: string | null;
  nombreEmisor?: string | null;
  tipoDocumento?: TipoDocumentoRecibido | null;
  cuentaPuc: string;
  nombreCuentaPuc?: string | null;
  centroCostos?: string | null;
  naturaleza: NaturalezaContable;
  prioridad?: number;
  activa?: boolean;
}

export type ActualizarReglaMapeoPucData = Partial<
  Omit<CrearReglaMapeoPucData, 'idRazonSocial'>
>;

export interface ListReglasMapeoPucQuery {
  page: number;
  limit: number;
  idRazonSocial?: number;
  buscar?: string;
  activa?: boolean;
}

export interface ListReglasMapeoPucResult {
  reglas: ReglaMapeoPucEntity[];
  total: number;
}

export interface ReglaMapeoPucRepository {
  create(data: CrearReglaMapeoPucData): Promise<ReglaMapeoPucEntity>;

  findById(idReglaMapeoPuc: number): Promise<ReglaMapeoPucEntity | null>;

  findMany(
    query: ListReglasMapeoPucQuery,
  ): Promise<ListReglasMapeoPucResult>;

  update(
    idReglaMapeoPuc: number,
    data: ActualizarReglaMapeoPucData,
  ): Promise<ReglaMapeoPucEntity>;

  delete(idReglaMapeoPuc: number): Promise<void>;
}
