import {
  NaturalezaContable,
  TipoDocumentoRecibido,
} from './documento-recibido.entity';

export interface ReglaMapeoPucEntity {
  idReglaMapeoPuc: number;
  idRazonSocial: number;
  nombre: string;
  concepto: string;
  nitEmisor: string | null;
  nombreEmisor: string | null;
  tipoDocumento: TipoDocumentoRecibido | null;
  cuentaPuc: string;
  nombreCuentaPuc: string | null;
  centroCostos: string | null;
  naturaleza: NaturalezaContable;
  prioridad: number;
  activa: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
