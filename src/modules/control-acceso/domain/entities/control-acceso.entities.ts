export type EstadoControlAcceso = 'ACTIVO' | 'INACTIVO';

export interface ModuloEntity {
  idModulo: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  ruta: string | null;
  icono: string | null;
  orden: number;
  visibleMenu: boolean;
  idModuloPadre: number | null;
  estado: EstadoControlAcceso;
  totalSubmodulos: number;
  totalPermisos: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface AccionEntity {
  idAccion: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  estado: EstadoControlAcceso;
  totalPermisos: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface PermisoEntity {
  idPermiso: number;
  idModulo: number;
  idAccion: number;
  estado: EstadoControlAcceso;
  modulo: {
    idModulo: number;
    codigo: string;
    nombre: string;
  };
  accion: {
    idAccion: number;
    codigo: string;
    nombre: string;
  };
  totalRoles: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface MatrizPermisoCelda {
  idPermiso: number;
  idAccion: number;
  codigoAccion: string;
  permitido: boolean;
}

export interface MatrizPermisoModulo {
  idModulo: number;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  permisos: MatrizPermisoCelda[];
}

export interface MatrizPermisosRol {
  rol: {
    idRol: number;
    nombreRol: string;
    estado: EstadoControlAcceso;
  };
  acciones: Array<{
    idAccion: number;
    codigo: string;
    nombre: string;
  }>;
  modulos: MatrizPermisoModulo[];
}
