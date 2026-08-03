import {
  ResolucionDianEntity,
  TipoDocumentoDian,
} from '../entities/resolucion-dian.entity';

export interface CreateResolucionDianData {
  idRazonSocial: number;
  tipoDocumento: TipoDocumentoDian;
  entorno: string;
  prefijo: string;
  numeroResolucion: string;
  rangoDesde: number;
  rangoHasta: number;
  fechaVigenciaDesde: Date;
  fechaVigenciaHasta: Date;
  claveTecnica: string;
  activa?: boolean;
}

export interface UpdateResolucionDianData {
  prefijo?: string;
  numeroResolucion?: string;
  rangoDesde?: number;
  rangoHasta?: number;
  fechaVigenciaDesde?: Date;
  fechaVigenciaHasta?: Date;
  claveTecnica?: string;
}

export interface ListResolucionesDianQuery {
  page: number;
  limit: number;
  idRazonSocial?: number;
  tipoDocumento?: TipoDocumentoDian;
  activa?: boolean;
}

export interface ListResolucionesDianResult {
  resoluciones: ResolucionDianEntity[];
  total: number;
}

export interface ResolucionDianRepository {
  create(data: CreateResolucionDianData): Promise<ResolucionDianEntity>;

  findById(idResolucionDian: number): Promise<ResolucionDianEntity | null>;

  findActiva(
    idRazonSocial: number,
    tipoDocumento: TipoDocumentoDian,
    entorno: string,
  ): Promise<ResolucionDianEntity | null>;

  findMany(
    query: ListResolucionesDianQuery,
  ): Promise<ListResolucionesDianResult>;

  update(
    idResolucionDian: number,
    data: UpdateResolucionDianData,
  ): Promise<ResolucionDianEntity>;

  setActiva(
    idResolucionDian: number,
    activa: boolean,
  ): Promise<ResolucionDianEntity>;
}
