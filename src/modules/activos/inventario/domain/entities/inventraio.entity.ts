export type EstadoInventario =
  | 'DISPONIBLE'
  | 'EN_USO'
  | 'EN_MANTENIMIENTO'
  | 'DANADO'
  | 'DADO_DE_BAJA';

export type EstadoRegistro =
  | 'ACTIVO'
  | 'INACTIVO';

export interface InventarioCasino {
  idCasino: number;
  nombreCasino: string;
}

export interface InventarioResponsable {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
}

export interface InventarioEntity {
  idInventario: number;

  fotoSerial: string | null;
  fotoEstado: string | null;

  codigo: string;
  nombre: string;
  serial: string | null;
  clasificacion: string;

  estado: EstadoInventario;
  estadoRegistro: EstadoRegistro;

  cantidad: number;
  valor: number;

  idCasino: number;
  idResponsable: number | null;

  ubicacionLocal: string | null;
  fechaAdquisicion: Date | null;
  observaciones: string | null;

  casino: InventarioCasino;
  responsable: InventarioResponsable | null;

  fechaCreacion: Date;
  fechaActualizacion: Date;
}
