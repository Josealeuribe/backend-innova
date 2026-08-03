import { ClienteDianEntity } from '../entities/cliente-dian.entity';

export interface CreateClienteDianData {
  nombre: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  telefono?: string;
  email?: string;
  tipoPersona?: string;
  responsabilidadFiscal?: string;
}

export interface UpdateClienteDianData {
  nombre?: string;
  tipoDocumento?: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  telefono?: string;
  email?: string;
  tipoPersona?: string;
  responsabilidadFiscal?: string;
}

export interface ListClientesDianQuery {
  page: number;
  limit: number;
  buscar?: string;
}

export interface ListClientesDianResult {
  clientes: ClienteDianEntity[];
  total: number;
}

export interface ClienteDianRepository {
  create(data: CreateClienteDianData): Promise<ClienteDianEntity>;

  findById(idClienteDian: number): Promise<ClienteDianEntity | null>;

  findByNumeroDocumento(
    numeroDocumento: string,
  ): Promise<ClienteDianEntity | null>;

  findMany(query: ListClientesDianQuery): Promise<ListClientesDianResult>;

  update(
    idClienteDian: number,
    data: UpdateClienteDianData,
  ): Promise<ClienteDianEntity>;
}
