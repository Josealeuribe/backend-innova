import { Inject, Injectable } from '@nestjs/common';

import type {
    CreateMaquinaData,
    MaquinaRepository,
    UpdateMaquinaData,
} from '../../domain/repositories/maquina.repository';

import {
    InventarioCasinoMismatchError,
    MaquinaAlreadyExistsError,
    MaquinaDateValidationError,
    MaquinaForeignKeyError,
    MaquinaRelationInactiveError,
} from '../../errors/maquina.errors';
import { MAQUINA_REPOSITORY } from '../../maquinas.tokens';
import { MaquinaEntity } from '../../domain/entities/maquia.entity';

@Injectable()
export class MaquinaRulesService {
    constructor(
        @Inject(MAQUINA_REPOSITORY)
        private readonly maquinaRepository: MaquinaRepository,
    ) { }

    async validateForCreate(
        data: CreateMaquinaData,
    ): Promise<void> {
        await this.assertUniqueFields(data);
        await this.assertRelations(data);
        this.assertDates(
            data.fechaFabricacion,
            data.ultimoMantenimiento ?? null,
        );
    }

    async validateForUpdate(
        idMaquina: number,
        current: MaquinaEntity,
        data: UpdateMaquinaData,
    ): Promise<void> {
        const merged: CreateMaquinaData = {
            idInventario:
                data.idInventario ?? current.idInventario,
            idCasino: data.idCasino ?? current.idCasino,
            idPais: data.idPais ?? current.idPais,
            idTipoMaquina:
                data.idTipoMaquina ?? current.idTipoMaquina,
            serial: data.serial ?? current.serial,
            numeroInterno:
                data.numeroInterno ?? current.numeroInterno,
            nuc: data.nuc ?? current.nuc,
            nuid: data.nuid ?? current.nuid,
            marca: data.marca ?? current.marca,
            modelo: data.modelo ?? current.modelo,
            fechaFabricacion:
                data.fechaFabricacion ?? current.fechaFabricacion,
            frecuenciaMantenimiento:
                data.frecuenciaMantenimiento ??
                current.frecuenciaMantenimiento,
            ultimoMantenimiento:
                data.ultimoMantenimiento === undefined
                    ? current.ultimoMantenimiento
                    : data.ultimoMantenimiento,
            imgDocumentoLegal:
                data.imgDocumentoLegal === undefined
                    ? current.imgDocumentoLegal
                    : data.imgDocumentoLegal,
            estado: data.estado ?? current.estado,
        };

        await this.assertUniqueFields(
            merged,
            idMaquina,
        );
        await this.assertRelations(merged);
        this.assertDates(
            merged.fechaFabricacion,
            merged.ultimoMantenimiento ?? null,
        );
    }

    private async assertUniqueFields(
        data: Pick<
            CreateMaquinaData,
            | 'idInventario'
            | 'serial'
            | 'numeroInterno'
            | 'nuc'
            | 'nuid'
        >,
        excludeIdMaquina?: number,
    ): Promise<void> {
        const [
            byInventario,
            bySerial,
            byNumeroInterno,
            byNuc,
            byNuid,
        ] = await Promise.all([
            this.maquinaRepository.findIdByInventario(
                data.idInventario,
            ),
            this.maquinaRepository.findIdBySerial(
                data.serial,
            ),
            this.maquinaRepository.findIdByNumeroInterno(
                data.numeroInterno,
            ),
            this.maquinaRepository.findIdByNuc(data.nuc),
            this.maquinaRepository.findIdByNuid(data.nuid),
        ]);

        this.throwWhenDuplicated(
            byInventario,
            excludeIdMaquina,
            'idInventario',
            'El inventario seleccionado ya está asociado a otra máquina.',
        );
        this.throwWhenDuplicated(
            bySerial,
            excludeIdMaquina,
            'serial',
            'El serial ya está registrado.',
        );
        this.throwWhenDuplicated(
            byNumeroInterno,
            excludeIdMaquina,
            'numeroInterno',
            'El número interno ya está registrado.',
        );
        this.throwWhenDuplicated(
            byNuc,
            excludeIdMaquina,
            'nuc',
            'El NUC ya está registrado.',
        );
        this.throwWhenDuplicated(
            byNuid,
            excludeIdMaquina,
            'nuid',
            'El NUID ya está registrado.',
        );
    }

    private throwWhenDuplicated(
        foundId: number | null,
        excludeId: number | undefined,
        field:
            | 'idInventario'
            | 'serial'
            | 'numeroInterno'
            | 'nuc'
            | 'nuid',
        message: string,
    ): void {
        if (
            foundId !== null &&
            foundId !== excludeId
        ) {
            throw new MaquinaAlreadyExistsError(
                field,
                message,
            );
        }
    }

    private async assertRelations(
        data: Pick<
            CreateMaquinaData,
            | 'idInventario'
            | 'idCasino'
            | 'idPais'
            | 'idTipoMaquina'
        >,
    ): Promise<void> {
        const relations =
            await this.maquinaRepository.checkForeignKeys({
                idInventario: data.idInventario,
                idCasino: data.idCasino,
                idPais: data.idPais,
                idTipoMaquina: data.idTipoMaquina,
            });

        if (!relations.inventario.exists) {
            throw new MaquinaForeignKeyError(
                'inventario',
                'El inventario seleccionado no existe.',
            );
        }

        if (!relations.casino) {
            throw new MaquinaForeignKeyError(
                'casino',
                'El casino seleccionado no existe.',
            );
        }

        if (!relations.pais) {
            throw new MaquinaForeignKeyError(
                'pais',
                'El país seleccionado no existe.',
            );
        }

        if (!relations.tipoMaquina.exists) {
            throw new MaquinaForeignKeyError(
                'tipoMaquina',
                'El tipo de máquina seleccionado no existe.',
            );
        }

        if (
            relations.inventario.estadoRegistro !== 'ACTIVO'
        ) {
            throw new MaquinaRelationInactiveError(
                'inventario',
                'El inventario seleccionado se encuentra inactivo.',
            );
        }

        if (relations.tipoMaquina.estado !== 'ACTIVO') {
            throw new MaquinaRelationInactiveError(
                'tipoMaquina',
                'El tipo de máquina seleccionado se encuentra inactivo.',
            );
        }

        if (
            relations.inventario.idCasino !== data.idCasino
        ) {
            throw new InventarioCasinoMismatchError(
                'El inventario seleccionado pertenece a un casino diferente.',
            );
        }
    }

    private assertDates(
        fechaFabricacion: Date,
        ultimoMantenimiento: Date | null,
    ): void {
        const today = new Date();
        today.setHours(23, 59, 59, 999);

        if (fechaFabricacion.getTime() > today.getTime()) {
            throw new MaquinaDateValidationError(
                'La fecha de fabricación no puede estar en el futuro.',
            );
        }

        if (!ultimoMantenimiento) {
            return;
        }

        if (
            ultimoMantenimiento.getTime() <
            fechaFabricacion.getTime()
        ) {
            throw new MaquinaDateValidationError(
                'El último mantenimiento no puede ser anterior a la fecha de fabricación.',
            );
        }

        if (
            ultimoMantenimiento.getTime() > today.getTime()
        ) {
            throw new MaquinaDateValidationError(
                'El último mantenimiento no puede estar en el futuro.',
            );
        }
    }
}
