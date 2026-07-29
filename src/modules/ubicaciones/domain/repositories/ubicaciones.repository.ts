export type EstadoCiudad =
  | 'ACTIVO'
  | 'INACTIVO';

export interface PaisCatalogo {
  idPais: number;
  nombre: string;
}

export interface DepartamentoCatalogo {
  idDepartamento: number;
  nombre: string;
  idPais: number;
}

export interface CiudadCatalogo {
  idCiudad: number;
  nombreCiudad: string;
  idDepartamento: number;
}

export interface ListarPaisesQuery {
  buscar?: string;
}

export interface ListarDepartamentosQuery {
  buscar?: string;
  idPais?: number;
}

export interface ListarCiudadesQuery {
  buscar?: string;
  idPais?: number;
  idDepartamento?: number;
  estado?: EstadoCiudad;
}

export interface UbicacionesRepository {
  listarPaises(
    query: ListarPaisesQuery,
  ): Promise<PaisCatalogo[]>;

  listarDepartamentos(
    query: ListarDepartamentosQuery,
  ): Promise<DepartamentoCatalogo[]>;

  listarCiudades(
    query: ListarCiudadesQuery,
  ): Promise<CiudadCatalogo[]>;
}