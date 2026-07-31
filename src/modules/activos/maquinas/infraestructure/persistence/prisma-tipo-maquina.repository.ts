import { Injectable } from '@nestjs/common';
import {
    EstadoRegistro,
    Prisma,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import { TipoMaquinaEntity } from '../../domain/entities/tipo-maquina.entity';
import {
    CreateTipoMaquinaData,
    ListTiposMaquinaQuery,
    ListTiposMaquinaResult,
    TipoMaquinaRepository,
    UpdateTipoMaquinaData,
} from '../../domain/repositories/tipo-maquina.repository';

const tipoMaquinaSelect = {
    idTipoMaquina: true,
    codigo: true,
    nombre: true,
    descripcion: true,
    estado: true,
    fechaCreacion: true,
    fechaActualizacion: true,
} satisfies Prisma.TipoMaquinaSelect;

type TipoMaquinaRecord =
    Prisma.TipoMaquinaGetPayload<{
        select: typeof tipoMaquinaSelect;
    }>;

@Injectable()
export class PrismaTipoMaquinaRepository
    implements TipoMaquinaRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(
        data: CreateTipoMaquinaData,
    ): Promise<TipoMaquinaEntity> {
        const tipo =
            await this.prisma.tipoMaquina.create({
                data: {
                    codigo: data.codigo,
                    nombre: data.nombre,
                    descripcion: data.descripcion ?? null,
                    estado:
                        data.estado === 'INACTIVO'
                            ? EstadoRegistro.INACTIVO
                            : EstadoRegistro.ACTIVO,
                },
                select: tipoMaquinaSelect,
            });

        return this.mapTipoMaquina(tipo);
    }

    async findById(
        idTipoMaquina: number,
    ): Promise<TipoMaquinaEntity | null> {
        const tipo =
            await this.prisma.tipoMaquina.findUnique({
                where: {
                    idTipoMaquina,
                },
                select: tipoMaquinaSelect,
            });

        return tipo
            ? this.mapTipoMaquina(tipo)
            : null;
    }

    async findIdByCodigo(
        codigo: string,
    ): Promise<number | null> {
        const tipo =
            await this.prisma.tipoMaquina.findUnique({
                where: {
                    codigo,
                },
                select: {
                    idTipoMaquina: true,
                },
            });

        return tipo?.idTipoMaquina ?? null;
    }

    async findIdByNombre(
        nombre: string,
    ): Promise<number | null> {
        const tipo =
            await this.prisma.tipoMaquina.findUnique({
                where: {
                    nombre,
                },
                select: {
                    idTipoMaquina: true,
                },
            });

        return tipo?.idTipoMaquina ?? null;
    }

    async findMany(
        query: ListTiposMaquinaQuery,
    ): Promise<ListTiposMaquinaResult> {
        const where: Prisma.TipoMaquinaWhereInput = {};

        if (query.estado) {
            where.estado =
                query.estado === 'ACTIVO'
                    ? EstadoRegistro.ACTIVO
                    : EstadoRegistro.INACTIVO;
        }

        if (query.buscar) {
            where.OR = [
                {
                    codigo: {
                        contains: query.buscar,
                    },
                },
                {
                    nombre: {
                        contains: query.buscar,
                    },
                },
                {
                    descripcion: {
                        contains: query.buscar,
                    },
                },
            ];
        }

        const skip = (query.page - 1) * query.limit;

        const [tiposMaquina, total] =
            await Promise.all([
                this.prisma.tipoMaquina.findMany({
                    where,
                    skip,
                    take: query.limit,
                    orderBy: {
                        nombre: 'asc',
                    },
                    select: tipoMaquinaSelect,
                }),
                this.prisma.tipoMaquina.count({
                    where,
                }),
            ]);

        return {
            tiposMaquina: tiposMaquina.map((tipo) =>
                this.mapTipoMaquina(tipo),
            ),
            total,
        };
    }

    async update(
        idTipoMaquina: number,
        data: UpdateTipoMaquinaData,
    ): Promise<TipoMaquinaEntity> {
        const tipo =
            await this.prisma.tipoMaquina.update({
                where: {
                    idTipoMaquina,
                },
                data: {
                    codigo: data.codigo,
                    nombre: data.nombre,
                    descripcion: data.descripcion,
                    estado:
                        data.estado === undefined
                            ? undefined
                            : data.estado === 'ACTIVO'
                                ? EstadoRegistro.ACTIVO
                                : EstadoRegistro.INACTIVO,
                },
                select: tipoMaquinaSelect,
            });

        return this.mapTipoMaquina(tipo);
    }

    async deactivate(
        idTipoMaquina: number,
    ): Promise<TipoMaquinaEntity> {
        const tipo =
            await this.prisma.tipoMaquina.update({
                where: {
                    idTipoMaquina,
                },
                data: {
                    estado: EstadoRegistro.INACTIVO,
                },
                select: tipoMaquinaSelect,
            });

        return this.mapTipoMaquina(tipo);
    }

    async countActiveMachines(
        idTipoMaquina: number,
    ): Promise<number> {
        return this.prisma.maquina.count({
            where: {
                idTipoMaquina,
                estado: EstadoRegistro.ACTIVO,
            },
        });
    }

    private mapTipoMaquina(
        tipo: TipoMaquinaRecord,
    ): TipoMaquinaEntity {
        return {
            idTipoMaquina: tipo.idTipoMaquina,
            codigo: tipo.codigo,
            nombre: tipo.nombre,
            descripcion: tipo.descripcion,
            estado: tipo.estado,
            fechaCreacion: tipo.fechaCreacion,
            fechaActualizacion:
                tipo.fechaActualizacion,
        };
    }
}
