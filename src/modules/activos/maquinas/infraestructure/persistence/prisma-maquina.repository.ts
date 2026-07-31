import { Injectable } from '@nestjs/common';
import {
    EstadoRegistro,
    Prisma,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';


import {
    CreateMaquinaData,
    ListMaquinasQuery,
    ListMaquinasResult,
    MaquinaForeignKeys,
    MaquinaRelationsState,
    MaquinaRepository,
    UpdateMaquinaData,
} from '../../domain/repositories/maquina.repository';
import { MaquinaEntity } from '../../domain/entities/maquia.entity';

const maquinaSelect = {
    idMaquina: true,
    idInventario: true,
    idCasino: true,
    idPais: true,
    idTipoMaquina: true,
    serial: true,
    numeroInterno: true,
    nuc: true,
    nuid: true,
    marca: true,
    modelo: true,
    fechaFabricacion: true,
    frecuenciaMantenimiento: true,
    ultimoMantenimiento: true,
    imgDocumentoLegal: true,
    estado: true,
    fechaCreacion: true,
    fechaActualizacion: true,

    inventario: {
        select: {
            idInventario: true,
            codigo: true,
            nombre: true,
            serial: true,
            estado: true,
            estadoRegistro: true,
            idCasino: true,
        },
    },

    casino: {
        select: {
            idCasino: true,
            nombreCasino: true,
        },
    },

    pais: {
        select: {
            idPais: true,
            nombre: true,
        },
    },

    tipoMaquina: {
        select: {
            idTipoMaquina: true,
            codigo: true,
            nombre: true,
            descripcion: true,
            estado: true,
        },
    },
} satisfies Prisma.MaquinaSelect;

type MaquinaRecord = Prisma.MaquinaGetPayload<{
    select: typeof maquinaSelect;
}>;

@Injectable()
export class PrismaMaquinaRepository
    implements MaquinaRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(
        data: CreateMaquinaData,
    ): Promise<MaquinaEntity> {
        const maquina = await this.prisma.maquina.create({
            data: {
                idInventario: data.idInventario,
                idCasino: data.idCasino,
                idPais: data.idPais,
                idTipoMaquina: data.idTipoMaquina,
                serial: data.serial,
                numeroInterno: data.numeroInterno,
                nuc: data.nuc,
                nuid: data.nuid,
                marca: data.marca,
                modelo: data.modelo,
                fechaFabricacion: data.fechaFabricacion,
                frecuenciaMantenimiento:
                    data.frecuenciaMantenimiento,
                ultimoMantenimiento:
                    data.ultimoMantenimiento ?? null,
                imgDocumentoLegal:
                    data.imgDocumentoLegal ?? null,
                estado:
                    data.estado === 'INACTIVO'
                        ? EstadoRegistro.INACTIVO
                        : EstadoRegistro.ACTIVO,
            },
            select: maquinaSelect,
        });

        return this.mapMaquina(maquina);
    }

    async findById(
        idMaquina: number,
    ): Promise<MaquinaEntity | null> {
        const maquina =
            await this.prisma.maquina.findUnique({
                where: {
                    idMaquina,
                },
                select: maquinaSelect,
            });

        return maquina
            ? this.mapMaquina(maquina)
            : null;
    }

    async findIdByInventario(
        idInventario: number,
    ): Promise<number | null> {
        const maquina =
            await this.prisma.maquina.findUnique({
                where: {
                    idInventario,
                },
                select: {
                    idMaquina: true,
                },
            });

        return maquina?.idMaquina ?? null;
    }

    async findIdBySerial(
        serial: string,
    ): Promise<number | null> {
        const maquina =
            await this.prisma.maquina.findUnique({
                where: {
                    serial,
                },
                select: {
                    idMaquina: true,
                },
            });

        return maquina?.idMaquina ?? null;
    }

    async findIdByNumeroInterno(
        numeroInterno: string,
    ): Promise<number | null> {
        const maquina =
            await this.prisma.maquina.findUnique({
                where: {
                    numeroInterno,
                },
                select: {
                    idMaquina: true,
                },
            });

        return maquina?.idMaquina ?? null;
    }

    async findIdByNuc(
        nuc: string,
    ): Promise<number | null> {
        const maquina =
            await this.prisma.maquina.findUnique({
                where: {
                    nuc,
                },
                select: {
                    idMaquina: true,
                },
            });

        return maquina?.idMaquina ?? null;
    }

    async findIdByNuid(
        nuid: string,
    ): Promise<number | null> {
        const maquina =
            await this.prisma.maquina.findUnique({
                where: {
                    nuid,
                },
                select: {
                    idMaquina: true,
                },
            });

        return maquina?.idMaquina ?? null;
    }

    async findMany(
        query: ListMaquinasQuery,
    ): Promise<ListMaquinasResult> {
        const where: Prisma.MaquinaWhereInput = {};

        if (query.estado) {
            where.estado =
                query.estado === 'ACTIVO'
                    ? EstadoRegistro.ACTIVO
                    : EstadoRegistro.INACTIVO;
        }

        if (query.idCasino) {
            where.idCasino = query.idCasino;
        }

        if (query.idPais) {
            where.idPais = query.idPais;
        }

        if (query.idTipoMaquina) {
            where.idTipoMaquina = query.idTipoMaquina;
        }

        if (query.idInventario) {
            where.idInventario = query.idInventario;
        }

        if (query.buscar) {
            where.OR = [
                {
                    serial: {
                        contains: query.buscar,
                    },
                },
                {
                    numeroInterno: {
                        contains: query.buscar,
                    },
                },
                {
                    nuc: {
                        contains: query.buscar,
                    },
                },
                {
                    nuid: {
                        contains: query.buscar,
                    },
                },
                {
                    marca: {
                        contains: query.buscar,
                    },
                },
                {
                    modelo: {
                        contains: query.buscar,
                    },
                },
                {
                    inventario: {
                        is: {
                            codigo: {
                                contains: query.buscar,
                            },
                        },
                    },
                },
                {
                    inventario: {
                        is: {
                            nombre: {
                                contains: query.buscar,
                            },
                        },
                    },
                },
                {
                    casino: {
                        is: {
                            nombreCasino: {
                                contains: query.buscar,
                            },
                        },
                    },
                },
                {
                    pais: {
                        is: {
                            nombre: {
                                contains: query.buscar,
                            },
                        },
                    },
                },
                {
                    tipoMaquina: {
                        is: {
                            nombre: {
                                contains: query.buscar,
                            },
                        },
                    },
                },
            ];
        }

        const skip = (query.page - 1) * query.limit;

        const [maquinas, total] = await Promise.all([
            this.prisma.maquina.findMany({
                where,
                skip,
                take: query.limit,
                orderBy: {
                    idMaquina: 'desc',
                },
                select: maquinaSelect,
            }),
            this.prisma.maquina.count({
                where,
            }),
        ]);

        return {
            maquinas: maquinas.map((maquina) =>
                this.mapMaquina(maquina),
            ),
            total,
        };
    }

    async update(
        idMaquina: number,
        data: UpdateMaquinaData,
    ): Promise<MaquinaEntity> {
        const maquina = await this.prisma.maquina.update({
            where: {
                idMaquina,
            },
            data: {
                idInventario: data.idInventario,
                idCasino: data.idCasino,
                idPais: data.idPais,
                idTipoMaquina: data.idTipoMaquina,
                serial: data.serial,
                numeroInterno: data.numeroInterno,
                nuc: data.nuc,
                nuid: data.nuid,
                marca: data.marca,
                modelo: data.modelo,
                fechaFabricacion: data.fechaFabricacion,
                frecuenciaMantenimiento:
                    data.frecuenciaMantenimiento,
                ultimoMantenimiento:
                    data.ultimoMantenimiento,
                imgDocumentoLegal:
                    data.imgDocumentoLegal,
                estado:
                    data.estado === undefined
                        ? undefined
                        : data.estado === 'ACTIVO'
                            ? EstadoRegistro.ACTIVO
                            : EstadoRegistro.INACTIVO,
            },
            select: maquinaSelect,
        });

        return this.mapMaquina(maquina);
    }

    async deactivate(
        idMaquina: number,
    ): Promise<MaquinaEntity> {
        const maquina = await this.prisma.maquina.update({
            where: {
                idMaquina,
            },
            data: {
                estado: EstadoRegistro.INACTIVO,
            },
            select: maquinaSelect,
        });

        return this.mapMaquina(maquina);
    }

    async checkForeignKeys(
        foreignKeys: MaquinaForeignKeys,
    ): Promise<MaquinaRelationsState> {
        const [inventario, casino, pais, tipoMaquina] =
            await Promise.all([
                this.prisma.inventario.findUnique({
                    where: {
                        idInventario:
                            foreignKeys.idInventario,
                    },
                    select: {
                        idInventario: true,
                        idCasino: true,
                        estadoRegistro: true,
                    },
                }),
                this.prisma.casino.findUnique({
                    where: {
                        idCasino: foreignKeys.idCasino,
                    },
                    select: {
                        idCasino: true,
                    },
                }),
                this.prisma.pais.findUnique({
                    where: {
                        idPais: foreignKeys.idPais,
                    },
                    select: {
                        idPais: true,
                    },
                }),
                this.prisma.tipoMaquina.findUnique({
                    where: {
                        idTipoMaquina:
                            foreignKeys.idTipoMaquina,
                    },
                    select: {
                        idTipoMaquina: true,
                        estado: true,
                    },
                }),
            ]);

        return {
            inventario: {
                exists: inventario !== null,
                idCasino: inventario?.idCasino ?? null,
                estadoRegistro:
                    inventario?.estadoRegistro ?? null,
            },
            casino: casino !== null,
            pais: pais !== null,
            tipoMaquina: {
                exists: tipoMaquina !== null,
                estado: tipoMaquina?.estado ?? null,
            },
        };
    }

    private mapMaquina(
        maquina: MaquinaRecord,
    ): MaquinaEntity {
        return {
            idMaquina: maquina.idMaquina,
            idInventario: maquina.idInventario,
            idCasino: maquina.idCasino,
            idPais: maquina.idPais,
            idTipoMaquina: maquina.idTipoMaquina,
            serial: maquina.serial,
            numeroInterno: maquina.numeroInterno,
            nuc: maquina.nuc,
            nuid: maquina.nuid,
            marca: maquina.marca,
            modelo: maquina.modelo,
            fechaFabricacion: maquina.fechaFabricacion,
            frecuenciaMantenimiento:
                maquina.frecuenciaMantenimiento,
            ultimoMantenimiento:
                maquina.ultimoMantenimiento,
            imgDocumentoLegal:
                maquina.imgDocumentoLegal,
            estado: maquina.estado,
            inventario: maquina.inventario,
            casino: maquina.casino,
            pais: maquina.pais,
            tipoMaquina: maquina.tipoMaquina,
            fechaCreacion: maquina.fechaCreacion,
            fechaActualizacion:
                maquina.fechaActualizacion,
        };
    }
}
