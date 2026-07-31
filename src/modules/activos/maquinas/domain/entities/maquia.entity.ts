export type EstadoRegistroValue =
    | 'ACTIVO'
    | 'INACTIVO';

export type EstadoInventarioValue =
    | 'DISPONIBLE'
    | 'EN_USO'
    | 'EN_MANTENIMIENTO'
    | 'DANADO'
    | 'DADO_DE_BAJA';

export interface MaquinaEntity {
    idMaquina: number;

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
    ultimoMantenimiento: Date | null;
    imgDocumentoLegal: string | null;

    estado: EstadoRegistroValue;

    inventario: {
        idInventario: number;
        codigo: string;
        nombre: string;
        serial: string | null;
        estado: EstadoInventarioValue;
        estadoRegistro: EstadoRegistroValue;
        idCasino: number;
    };

    casino: {
        idCasino: number;
        nombreCasino: string;
    };

    pais: {
        idPais: number;
        nombre: string;
    };

    tipoMaquina: {
        idTipoMaquina: number;
        codigo: string;
        nombre: string;
        descripcion: string | null;
        estado: EstadoRegistroValue;
    };

    fechaCreacion: Date;
    fechaActualizacion: Date;
}
