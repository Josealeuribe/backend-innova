import {
  CentroCostoEntity,
  EstadoCentroCosto,
} from '../entities/centro-costo.entity';

export interface CreateCentroCostoData {
  codigoCentroCosto: string;
  nombreCentroCosto: string;
  estado: EstadoCentroCosto;
}

export interface UpdateCentroCostoData {
  codigoCentroCosto?: string;
  nombreCentroCosto?: string;
  estado?: EstadoCentroCosto;
}

export interface ListCentrosCostosQuery {
  page: number;
  limit: number;
  buscar?: string;
  estado?: EstadoCentroCosto;
}

export interface ListCentrosCostosResult {
  centrosCostos: CentroCostoEntity[];
  total: number;
}

export interface CentroCostoRepository {
  create(
    data: CreateCentroCostoData,
  ): Promise<CentroCostoEntity>;

  findById(
    idCentroCosto: number,
  ): Promise<CentroCostoEntity | null>;

  findIdByCodigo(
    codigoCentroCosto: string,
  ): Promise<number | null>;

  findMany(
    query: ListCentrosCostosQuery,
  ): Promise<ListCentrosCostosResult>;

  update(
    idCentroCosto: number,
    data: UpdateCentroCostoData,
  ): Promise<CentroCostoEntity>;

  deactivate(
    idCentroCosto: number,
  ): Promise<CentroCostoEntity>;
}