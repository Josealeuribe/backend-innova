export type EstadoRol = 'ACTIVO' | 'INACTIVO';

export interface RolEntity {
  idRol: number;
  nombreRol: string;
  descripcion: string | null;
  estado: EstadoRol;
  totalUsuarios: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}
