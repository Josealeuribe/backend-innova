import { EstadoRol, RolEntity } from '../entities/rol.entity';

export interface CreateRolData {
  nombreRol: string;
  descripcion: string | null;
  estado: EstadoRol;
}

export type UpdateRolData = Partial<CreateRolData>;

export interface ListRolesQuery {
  page: number;
  limit: number;
  buscar?: string;
  estado?: EstadoRol;
}

export interface ListRolesResult {
  roles: RolEntity[];
  total: number;
}

export interface RolRepository {
  create(data: CreateRolData): Promise<RolEntity>;
  findById(idRol: number): Promise<RolEntity | null>;
  findIdByNombre(nombreRol: string): Promise<number | null>;
  findMany(query: ListRolesQuery): Promise<ListRolesResult>;
  update(idRol: number, data: UpdateRolData): Promise<RolEntity>;
  deactivate(idRol: number): Promise<RolEntity>;
  countActiveUsersByRole(idRol: number): Promise<number>;
}
