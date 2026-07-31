import { EstadoInventario, EstadoRegistro } from "src/generated/prisma/enums";
import { InventarioEntity } from "../entities/inventraio.entity";


export interface CreateInventarioData {
  fotoSerial: string | null;
  fotoEstado: string | null;

  codigo: string;
  nombre: string;
  serial: string | null;
  clasificacion: string;

  estado: EstadoInventario;
  estadoRegistro: EstadoRegistro;

  cantidad: number;
  valor: number;

  idCasino: number;
  idResponsable: number | null;

  ubicacionLocal: string | null;
  fechaAdquisicion: Date | null;
  observaciones: string | null;
}

export type UpdateInventarioData =
  Partial<CreateInventarioData>;

export interface ListInventarioQuery {
  page: number;
  limit: number;
  buscar?: string;

  estado?: EstadoInventario;
  estadoRegistro?: EstadoRegistro;

  clasificacion?: string;
  idCasino?: number;
  idResponsable?: number;
}

export interface ListInventarioResult {
  items: InventarioEntity[];
  total: number;
}

export interface InventarioRelationsResult {
  casinoExists: boolean;
  responsableExists: boolean;
}

export interface InventarioRepository {
  create(
    data: CreateInventarioData,
  ): Promise<InventarioEntity>;

  findById(
    idInventario: number,
  ): Promise<InventarioEntity | null>;

  findIdByCodigo(
    codigo: string,
  ): Promise<number | null>;

  findIdBySerial(
    serial: string,
  ): Promise<number | null>;

  findMany(
    query: ListInventarioQuery,
  ): Promise<ListInventarioResult>;

  update(
    idInventario: number,
    data: UpdateInventarioData,
  ): Promise<InventarioEntity>;

  deactivate(
    idInventario: number,
  ): Promise<InventarioEntity>;

  checkRelations(
    idCasino: number,
    idResponsable: number | null,
  ): Promise<InventarioRelationsResult>;
}
