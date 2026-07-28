import {
  CasinoEntity,
  EstadoCasino,
} from '../entities/casino.entity';

export interface CasinoForeignKeys {
  idCiudad: number;
  idCentroCosto: number;
  idRazonSocial: number;
}

export interface CreateCasinoData
  extends CasinoForeignKeys {
  nombreCasino: string;
  codigoDane: string;
  codigoEstablecimiento: string;
  telefono: string;
  direccion: string;
  estado: EstadoCasino;
}

export interface UpdateCasinoData {
  nombreCasino?: string;
  codigoDane?: string;
  codigoEstablecimiento?: string;
  telefono?: string;
  direccion?: string;
  estado?: EstadoCasino;

  idCiudad?: number;
  idCentroCosto?: number;
  idRazonSocial?: number;
}

export interface ListCasinosQuery {
  page: number;
  limit: number;
  buscar?: string;
  estado?: EstadoCasino;

  idCiudad?: number;
  idCentroCosto?: number;
  idRazonSocial?: number;
}

export interface ListCasinosResult {
  casinos: CasinoEntity[];
  total: number;
}

export interface CasinoRelationsResult {
  ciudad: boolean;
  centroCosto: boolean;
  razonSocial: boolean;
}

export interface CasinoRepository {
  create(
    data: CreateCasinoData,
  ): Promise<CasinoEntity>;

  findById(
    idCasino: number,
  ): Promise<CasinoEntity | null>;

  findIdByNombre(
    nombreCasino: string,
  ): Promise<number | null>;

  findIdByCodigoDane(
    codigoDane: string,
  ): Promise<number | null>;

  findIdByCodigoEstablecimiento(
    codigoEstablecimiento: string,
  ): Promise<number | null>;

  findMany(
    query: ListCasinosQuery,
  ): Promise<ListCasinosResult>;

  update(
    idCasino: number,
    data: UpdateCasinoData,
  ): Promise<CasinoEntity>;

  deactivate(
    idCasino: number,
  ): Promise<CasinoEntity>;

  checkForeignKeys(
    foreignKeys: CasinoForeignKeys,
  ): Promise<CasinoRelationsResult>;
}