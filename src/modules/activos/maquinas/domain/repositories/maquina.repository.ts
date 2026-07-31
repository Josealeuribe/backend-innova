import { EstadoRegistroValue, MaquinaEntity } from "../entities/maquia.entity";


export interface CreateMaquinaData {
    idInventario: number;
    idCasino: number;
    idPais: number;
    idTipoMaquina: number;
    serial: string;
    numeroInterno: string;
    nuc: string;
    nuid: string;
    marca: string;
    modelo: string;
    fechaFabricacion: Date;
    frecuenciaMantenimiento: number;
    ultimoMantenimiento?: Date | null;
    imgDocumentoLegal?: string | null;
    estado?: EstadoRegistroValue;
}

export interface UpdateMaquinaData {
    idInventario?: number;
    idCasino?: number;
    idPais?: number;
    idTipoMaquina?: number;
    serial?: string;
    numeroInterno?: string;
    nuc?: string;
    nuid?: string;
    marca?: string;
    modelo?: string;
    fechaFabricacion?: Date;
    frecuenciaMantenimiento?: number;
    ultimoMantenimiento?: Date | null;
    imgDocumentoLegal?: string | null;
    estado?: EstadoRegistroValue;
}

export interface ListMaquinasQuery {
    page: number;
    limit: number;
    buscar?: string;
    estado?: EstadoRegistroValue;
    idCasino?: number;
    idPais?: number;
    idTipoMaquina?: number;
    idInventario?: number;
}

export interface ListMaquinasResult {
    maquinas: MaquinaEntity[];
    total: number;
}

export interface MaquinaForeignKeys {
    idInventario: number;
    idCasino: number;
    idPais: number;
    idTipoMaquina: number;
}

export interface MaquinaRelationsState {
    inventario: {
        exists: boolean;
        idCasino: number | null;
        estadoRegistro: EstadoRegistroValue | null;
    };
    casino: boolean;
    pais: boolean;
    tipoMaquina: {
        exists: boolean;
        estado: EstadoRegistroValue | null;
    };
}

export interface MaquinaRepository {
    create(
        data: CreateMaquinaData,
    ): Promise<MaquinaEntity>;

    findById(
        idMaquina: number,
    ): Promise<MaquinaEntity | null>;

    findIdByInventario(
        idInventario: number,
    ): Promise<number | null>;

    findIdBySerial(
        serial: string,
    ): Promise<number | null>;

    findIdByNumeroInterno(
        numeroInterno: string,
    ): Promise<number | null>;

    findIdByNuc(
        nuc: string,
    ): Promise<number | null>;

    findIdByNuid(
        nuid: string,
    ): Promise<number | null>;

    findMany(
        query: ListMaquinasQuery,
    ): Promise<ListMaquinasResult>;

    update(
        idMaquina: number,
        data: UpdateMaquinaData,
    ): Promise<MaquinaEntity>;

    deactivate(
        idMaquina: number,
    ): Promise<MaquinaEntity>;

    checkForeignKeys(
        foreignKeys: MaquinaForeignKeys,
    ): Promise<MaquinaRelationsState>;
}
