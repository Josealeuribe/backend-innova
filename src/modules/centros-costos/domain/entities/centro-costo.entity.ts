export type EstadoCentroCosto =
  | 'ACTIVO'
  | 'INACTIVO';

export interface CentroCostoEntity {
  idCentroCosto: number;
  codigoCentroCosto: string;
  nombreCentroCosto: string;
  estado: EstadoCentroCosto;

  fechaCreacion: Date;
  fechaActualizacion: Date;
}