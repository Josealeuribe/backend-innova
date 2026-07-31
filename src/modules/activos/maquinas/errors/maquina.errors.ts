export class MaquinaNotFoundError extends Error {
    constructor(idMaquina: number) {
        super(
            `No se encontró la máquina con id ${idMaquina}.`,
        );
        this.name = 'MaquinaNotFoundError';
    }
}

export class MaquinaAlreadyExistsError extends Error {
    constructor(
        public readonly field:
            | 'idInventario'
            | 'serial'
            | 'numeroInterno'
            | 'nuc'
            | 'nuid',
        message: string,
    ) {
        super(message);
        this.name = 'MaquinaAlreadyExistsError';
    }
}

export class MaquinaForeignKeyError extends Error {
    constructor(
        public readonly relation:
            | 'inventario'
            | 'casino'
            | 'pais'
            | 'tipoMaquina',
        message: string,
    ) {
        super(message);
        this.name = 'MaquinaForeignKeyError';
    }
}

export class MaquinaRelationInactiveError extends Error {
    constructor(
        public readonly relation:
            | 'inventario'
            | 'tipoMaquina',
        message: string,
    ) {
        super(message);
        this.name = 'MaquinaRelationInactiveError';
    }
}

export class InventarioCasinoMismatchError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InventarioCasinoMismatchError';
    }
}

export class MaquinaDateValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MaquinaDateValidationError';
    }
}

export class TipoMaquinaNotFoundError extends Error {
    constructor(idTipoMaquina: number) {
        super(
            `No se encontró el tipo de máquina con id ${idTipoMaquina}.`,
        );
        this.name = 'TipoMaquinaNotFoundError';
    }
}

export class TipoMaquinaAlreadyExistsError extends Error {
    constructor(
        public readonly field: 'codigo' | 'nombre',
        message: string,
    ) {
        super(message);
        this.name = 'TipoMaquinaAlreadyExistsError';
    }
}

export class TipoMaquinaInUseError extends Error {
    constructor(
        public readonly idTipoMaquina: number,
        public readonly activeMachines: number,
    ) {
        super(
            `No se puede inactivar el tipo de máquina porque tiene ${activeMachines} máquina(s) activa(s) asociada(s).`,
        );
        this.name = 'TipoMaquinaInUseError';
    }
}
