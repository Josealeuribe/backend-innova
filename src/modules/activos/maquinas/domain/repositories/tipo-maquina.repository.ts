
import { EstadoRegistroValue } from '../entities/maquia.entity';
import { TipoMaquinaEntity } from '../entities/tipo-maquina.entity';

export interface CreateTipoMaquinaData {
    codigo: string;
    nombre: string;
    descripcion?: string | null;
    estado?: EstadoRegistroValue;
}

export interface UpdateTipoMaquinaData {
    codigo?: string;
    nombre?: string;
    descripcion?: string | null;
    estado?: EstadoRegistroValue;
}

export interface ListTiposMaquinaQuery {
    page: number;
    limit: number;
    buscar?: string;
    estado?: EstadoRegistroValue;
}

export interface ListTiposMaquinaResult {
    tiposMaquina: TipoMaquinaEntity[];
    total: number;
}

export interface TipoMaquinaRepository {
    create(
        data: CreateTipoMaquinaData,
    ): Promise<TipoMaquinaEntity>;

    findById(
        idTipoMaquina: number,
    ): Promise<TipoMaquinaEntity | null>;

    findIdByCodigo(
        codigo: string,
    ): Promise<number | null>;

    findIdByNombre(
        nombre: string,
    ): Promise<number | null>;

    findMany(
        query: ListTiposMaquinaQuery,
    ): Promise<ListTiposMaquinaResult>;

    update(
        idTipoMaquina: number,
        data: UpdateTipoMaquinaData,
    ): Promise<TipoMaquinaEntity>;

    deactivate(
        idTipoMaquina: number,
    ): Promise<TipoMaquinaEntity>;

    countActiveMachines(
        idTipoMaquina: number,
    ): Promise<number>;
}
