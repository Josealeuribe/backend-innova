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
}