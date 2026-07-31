import {
  AccionEntity,
  EstadoControlAcceso,
  MatrizPermisosRol,
  ModuloEntity,
  PermisoEntity,
} from '../entities/control-acceso.entities';

export interface PaginacionQuery {
  page: number;
  limit: number;
  buscar?: string;
  estado?: EstadoControlAcceso;
}

export interface ListResult<T> {
  data: T[];
  total: number;
}

export interface CreateModuloData {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  ruta: string | null;
  icono: string | null;
  orden: number;
  visibleMenu: boolean;
  idModuloPadre: number | null;
  estado: EstadoControlAcceso;
}

export type UpdateModuloData = Partial<CreateModuloData>;

export interface CreateAccionData {
  codigo: string;
  nombre: string;
  descripcion: string | null;
  estado: EstadoControlAcceso;
}

export type UpdateAccionData = Partial<CreateAccionData>;

export interface CreatePermisoData {
  idModulo: number;
  idAccion: number;
  estado: EstadoControlAcceso;
}

export type UpdatePermisoData = Partial<CreatePermisoData>;

export interface GuardarPermisoRolData {
  idPermiso: number;
  permitido: boolean;
}

export interface ControlAccesoRepository {
  createModulo(data: CreateModuloData): Promise<ModuloEntity>;
  findModuloById(idModulo: number): Promise<ModuloEntity | null>;
  findModuloIdByCodigo(codigo: string): Promise<number | null>;
  listModulos(query: PaginacionQuery): Promise<ListResult<ModuloEntity>>;
  updateModulo(idModulo: number, data: UpdateModuloData): Promise<ModuloEntity>;
  deactivateModulo(idModulo: number): Promise<ModuloEntity>;
  moduloExists(idModulo: number): Promise<boolean>;
  countActiveSubmodules(idModulo: number): Promise<number>;
  countActivePermissionsByModule(idModulo: number): Promise<number>;

  createAccion(data: CreateAccionData): Promise<AccionEntity>;
  findAccionById(idAccion: number): Promise<AccionEntity | null>;
  findAccionIdByCodigo(codigo: string): Promise<number | null>;
  listAcciones(query: PaginacionQuery): Promise<ListResult<AccionEntity>>;
  updateAccion(idAccion: number, data: UpdateAccionData): Promise<AccionEntity>;
  deactivateAccion(idAccion: number): Promise<AccionEntity>;
  accionExists(idAccion: number): Promise<boolean>;
  countActivePermissionsByAction(idAccion: number): Promise<number>;

  createPermiso(data: CreatePermisoData): Promise<PermisoEntity>;
  findPermisoById(idPermiso: number): Promise<PermisoEntity | null>;
  findPermisoIdByCombination(idModulo: number, idAccion: number): Promise<number | null>;
  listPermisos(query: PaginacionQuery & { idModulo?: number; idAccion?: number }): Promise<ListResult<PermisoEntity>>;
  updatePermiso(idPermiso: number, data: UpdatePermisoData): Promise<PermisoEntity>;
  deactivatePermiso(idPermiso: number): Promise<PermisoEntity>;
  countAllowedRolesByPermission(idPermiso: number): Promise<number>;
  countPermissionsByIds(ids: number[]): Promise<number>;

  roleExists(idRol: number): Promise<boolean>;
  getRolePermissionMatrix(idRol: number): Promise<MatrizPermisosRol | null>;
  saveRolePermissions(idRol: number, permisos: GuardarPermisoRolData[]): Promise<MatrizPermisosRol>;
}
