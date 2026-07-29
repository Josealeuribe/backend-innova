import {
  EstadoUsuario,
  UsuarioEntity,
} from '../entities/usuario.entity';

export interface UsuarioForeignKeys {
  idTipoDoc: number;
  idGenero: number;
  idRol: number;
  idCiudad: number;
  idCasino: number;
}

export interface CreateUsuarioData extends UsuarioForeignKeys {
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  passwordHash: string;

  cargo: string;
  fechaNacimiento: Date;
  telefono: string;

  codigoHelisa?: string | null;
  cuentaPuc?: string | null;
  imgUrl?: string | null;

  estado: EstadoUsuario;
}

export interface UpdateUsuarioData {
  nombre?: string;
  apellido?: string;
  cedula?: string;
  correo?: string;
  passwordHash?: string;

  cargo?: string;
  fechaNacimiento?: Date;
  telefono?: string;

  codigoHelisa?: string | null;
  cuentaPuc?: string | null;
  imgUrl?: string | null;

  estado?: EstadoUsuario;

  idTipoDoc?: number;
  idGenero?: number;
  idRol?: number;
  idCiudad?: number;
  idCasino?: number;
}

export interface ListUsuariosQuery {
  page: number;
  limit: number;
  buscar?: string;
  estado?: EstadoUsuario;

  idRol?: number;
  idGenero?: number;
  idTipoDoc?: number;
  idCiudad?: number;
  idCasino?: number;
}

export interface ListUsuariosResult {
  usuarios: UsuarioEntity[];
  total: number;
}

export interface MissingUsuarioRelations {
  rol: boolean;
  genero: boolean;
  tipoDocumento: boolean;
  ciudad: boolean;
  casino: boolean;
}

export interface UsuarioCatalogos {
  roles: Array<{
    idRol: number;
    nombreRol: string;
  }>;

  generos: Array<{
    idGenero: number;
    nombreGenero: string;
  }>;

  tiposDocumento: Array<{
    idTipoDoc: number;
    nombreDoc: string;
  }>;

  departamentos: Array<{
    idDepartamento: number;
    nombre: string;
    idPais: number;
  }>;

  ciudades: Array<{
    idCiudad: number;
    nombreCiudad: string;
    idDepartamento: number;
  }>;

  casinos: Array<{
    idCasino: number;
    nombreCasino: string;
    idCiudad: number;
  }>;
}

export interface UsuarioRepository {
  create(data: CreateUsuarioData): Promise<UsuarioEntity>;

  findById(id: number): Promise<UsuarioEntity | null>;

  findIdByCorreo(correo: string): Promise<number | null>;

  findIdByCedula(cedula: string): Promise<number | null>;

  findMany(query: ListUsuariosQuery): Promise<ListUsuariosResult>;

  update(
    id: number,
    data: UpdateUsuarioData,
  ): Promise<UsuarioEntity>;

  deactivate(id: number): Promise<UsuarioEntity>;

  checkForeignKeys(
    foreignKeys: UsuarioForeignKeys,
  ): Promise<MissingUsuarioRelations>;

  getCatalogos(): Promise<UsuarioCatalogos>;
}
