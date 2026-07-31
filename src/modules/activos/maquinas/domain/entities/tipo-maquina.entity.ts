import { EstadoRegistroValue } from "./maquia.entity";

export interface TipoMaquinaEntity {
    idTipoMaquina: number;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    estado: EstadoRegistroValue;
    fechaCreacion: Date;
    fechaActualizacion: Date;
}
