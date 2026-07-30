import { EstadoRazonSocial, RazonSocialEntity } from '../entities/razon-social.entity';

export interface RazonSocialForeignKeys {
  idPais: number;
  idDepartamento: number;
  idCiudad: number;
  idTipoPersona: number;
  idAmbienteDian: number;
  idRegimen: number;
}

export interface CreateRazonSocialData extends RazonSocialForeignKeys {
  nit: string;
  nombreRazonSocial: string;
  telefono: string;
  direccion: string;
  codigoPostal: string | null;
  correo: string;
  responsabilidadFiscal: string;
  contratoColjuegos: string | null;
  fechaInicioContrato: Date | null;
  fechaFinContrato: Date | null;
  softwareId: string | null;
  softwarePin: string | null;
  testSetId: string | null;
  claveTecnica: string | null;
  numeroResolucion: string | null;
  prefijoResolucion: string | null;
  rangoInicio: string | null;
  rangoFin: string | null;
  fechaInicioResolucion: Date | null;
  fechaFinResolucion: Date | null;
  codigoHelisa: string | null;
  estado: EstadoRazonSocial;
}

export type UpdateRazonSocialData = Partial<CreateRazonSocialData>;

export interface ListRazonesSocialesQuery {
  page: number;
  limit: number;
  buscar?: string;
  estado?: EstadoRazonSocial;
  idPais?: number;
  idDepartamento?: number;
  idCiudad?: number;
  idTipoPersona?: number;
  idAmbienteDian?: number;
  idRegimen?: number;
}

export interface ListRazonesSocialesResult {
  razonesSociales: RazonSocialEntity[];
  total: number;
}

export interface RazonSocialRelationsResult {
  pais: boolean;
  departamento: boolean;
  ciudad: boolean;
  tipoPersona: boolean;
  ambienteDian: boolean;
  regimen: boolean;
  ubicacionValida: boolean;
}

export interface RazonSocialRepository {
  create(data: CreateRazonSocialData): Promise<RazonSocialEntity>;
  findById(idRazonSocial: number): Promise<RazonSocialEntity | null>;
  findIdByNit(nit: string): Promise<number | null>;
  findIdByCorreo(correo: string): Promise<number | null>;
  findMany(query: ListRazonesSocialesQuery): Promise<ListRazonesSocialesResult>;
  update(idRazonSocial: number, data: UpdateRazonSocialData): Promise<RazonSocialEntity>;
  deactivate(idRazonSocial: number): Promise<RazonSocialEntity>;
  checkRelations(foreignKeys: RazonSocialForeignKeys): Promise<RazonSocialRelationsResult>;
}
