import { Inject, Injectable } from '@nestjs/common';

import type { TipoMaquinaEntity } from '../../domain/entities/tipo-maquina.entity';
import type {
    CreateTipoMaquinaData,
    TipoMaquinaRepository,
    UpdateTipoMaquinaData,
} from '../../domain/repositories/tipo-maquina.repository';
import {
    TipoMaquinaAlreadyExistsError,
    TipoMaquinaInUseError,
    TipoMaquinaNotFoundError,
} from '../../errors/maquina.errors';
import {
    ActualizarTipoMaquinaDto,
    CrearTipoMaquinaDto,
} from '../../presentation/dto/tipo-maquina.dto';
import { ListarTipoMaquinaQueryDto } from '../../presentation/dto/listar-tipo-maquina.query';
import { TIPO_MAQUINA_REPOSITORY } from '../../maquinas.tokens';

@Injectable()
export class TiposMaquinaUseCase {
    constructor(
        @Inject(TIPO_MAQUINA_REPOSITORY)
        private readonly tipoMaquinaRepository: TipoMaquinaRepository,
    ) { }

    async crear(
        dto: CrearTipoMaquinaDto,
    ): Promise<TipoMaquinaEntity> {
        const data: CreateTipoMaquinaData = {
            codigo: dto.codigo.trim().toUpperCase(),
            nombre: dto.nombre.trim(),
            descripcion:
                dto.descripcion?.trim() || null,
            estado: dto.estado ?? 'ACTIVO',
        };

        await this.assertUnique(
            data.codigo,
            data.nombre,
        );

        return this.tipoMaquinaRepository.create(data);
    }

    async listar(query: ListarTipoMaquinaQueryDto) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 20);

        const result =
            await this.tipoMaquinaRepository.findMany({
                page,
                limit,
                buscar: query.buscar?.trim() || undefined,
                estado: query.estado,
            });

        return {
            tiposMaquina: result.tiposMaquina,
            meta: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(
                    result.total / limit,
                ),
            },
        };
    }

    async obtener(
        idTipoMaquina: number,
    ): Promise<TipoMaquinaEntity> {
        const tipo =
            await this.tipoMaquinaRepository.findById(
                idTipoMaquina,
            );

        if (!tipo) {
            throw new TipoMaquinaNotFoundError(
                idTipoMaquina,
            );
        }

        return tipo;
    }

    async actualizar(
        idTipoMaquina: number,
        dto: ActualizarTipoMaquinaDto,
    ): Promise<TipoMaquinaEntity> {
        const current = await this.obtener(
            idTipoMaquina,
        );

        const data: UpdateTipoMaquinaData = {
            codigo:
                dto.codigo === undefined
                    ? undefined
                    : dto.codigo.trim().toUpperCase(),
            nombre:
                dto.nombre === undefined
                    ? undefined
                    : dto.nombre.trim(),
            descripcion:
                dto.descripcion === undefined
                    ? undefined
                    : dto.descripcion?.trim() || null,
            estado: dto.estado,
        };

        await this.assertUnique(
            data.codigo ?? current.codigo,
            data.nombre ?? current.nombre,
            idTipoMaquina,
        );

        if (
            data.estado === 'INACTIVO' &&
            current.estado !== 'INACTIVO'
        ) {
            await this.assertNotInUse(idTipoMaquina);
        }

        return this.tipoMaquinaRepository.update(
            idTipoMaquina,
            data,
        );
    }

    async eliminar(
        idTipoMaquina: number,
    ): Promise<TipoMaquinaEntity> {
        const current = await this.obtener(
            idTipoMaquina,
        );

        if (current.estado === 'INACTIVO') {
            return current;
        }

        await this.assertNotInUse(idTipoMaquina);

        return this.tipoMaquinaRepository.deactivate(
            idTipoMaquina,
        );
    }

    private async assertUnique(
        codigo: string,
        nombre: string,
        excludeIdTipoMaquina?: number,
    ): Promise<void> {
        const [byCodigo, byNombre] = await Promise.all([
            this.tipoMaquinaRepository.findIdByCodigo(
                codigo,
            ),
            this.tipoMaquinaRepository.findIdByNombre(
                nombre,
            ),
        ]);

        if (
            byCodigo !== null &&
            byCodigo !== excludeIdTipoMaquina
        ) {
            throw new TipoMaquinaAlreadyExistsError(
                'codigo',
                'El código del tipo de máquina ya está registrado.',
            );
        }

        if (
            byNombre !== null &&
            byNombre !== excludeIdTipoMaquina
        ) {
            throw new TipoMaquinaAlreadyExistsError(
                'nombre',
                'El nombre del tipo de máquina ya está registrado.',
            );
        }
    }

    private async assertNotInUse(
        idTipoMaquina: number,
    ): Promise<void> {
        const activeMachines =
            await this.tipoMaquinaRepository.countActiveMachines(
                idTipoMaquina,
            );

        if (activeMachines > 0) {
            throw new TipoMaquinaInUseError(
                idTipoMaquina,
                activeMachines,
            );
        }
    }
}
