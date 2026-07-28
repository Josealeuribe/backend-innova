import { Injectable } from '@nestjs/common';

import {
    EstadoRegistro,
    Prisma,
} from 'src/generated/prisma/client';

import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import {
    CasinoEntity,
    EstadoCasino,
} from '../../domain/entities/casino.entity';

import {
  CasinoForeignKeys,
  CasinoRelationsResult,
  CasinoRepository,
  CreateCasinoData,
  ListCasinosQuery,
  ListCasinosResult,
  UpdateCasinoData,
} from '../../domain/repositories/casino.repository';



const casinoSelect = {
    idCasino: true,
    nombreCasino: true,
    codigoDane: true,
    codigoEstablecimiento: true,
    telefono: true,
    direccion: true,
    estado: true,

    ciudad: {
        select: {
            idCiudad: true,
            nombreCiudad: true,
        },
    },

    centroCosto: {
        select: {
            idCentroCosto: true,
            codigoCentroCosto: true,
            nombreCentroCosto: true,
        },
    },

    razonSocial: {
        select: {
            idRazonSocial: true,
            nit: true,
            nombreRazonSocial: true,
        },
    },

    fechaCreacion: true,
    fechaActualizacion: true,
} satisfies Prisma.CasinoSelect;

type CasinoRecord =
    Prisma.CasinoGetPayload<{
        select: typeof casinoSelect;
    }>;

@Injectable()
export class PrismaCasinoRepository
    implements CasinoRepository {
    constructor(
        private readonly prisma:
            PrismaService,
    ) { }

    async create(
        data: CreateCasinoData,
    ): Promise<CasinoEntity> {
        const casino =
            await this.prisma.casino.create({
                data: {
                    nombreCasino: data.nombreCasino,
                    codigoDane: data.codigoDane,
                    codigoEstablecimiento: data.codigoEstablecimiento,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    idCiudad: data.idCiudad,
                    idCentroCosto: data.idCentroCosto,
                    idRazonSocial: data.idRazonSocial,

                    estado: this.mapEstadoToPrisma(
                        data.estado,
                    ),
                },

                select: casinoSelect,
            });

        return this.mapCasino(casino);
    }

    async findById(
        idCasino: number,
    ): Promise<CasinoEntity | null> {
        const casino =
            await this.prisma.casino.findUnique({
                where: {
                    idCasino,
                },

                select: casinoSelect,
            });

        return casino
            ? this.mapCasino(casino)
            : null;
    }

    async findIdByNombre(
        nombreCasino: string,
    ): Promise<number | null> {
        const casino =
            await this.prisma.casino.findUnique({
                where: {
                    nombreCasino,
                },

                select: {
                    idCasino: true,
                },
            });

        return casino?.idCasino ?? null;
    }

    async findIdByCodigoDane(
        codigoDane: string,
    ): Promise<number | null> {
        const casino = await this.prisma.casino.findUnique({
            where: { codigoDane },
            select: { idCasino: true },
        });

        return casino?.idCasino ?? null;
    }

    async findIdByCodigoEstablecimiento(
        codigoEstablecimiento: string,
    ): Promise<number | null> {
        const casino = await this.prisma.casino.findUnique({
            where: { codigoEstablecimiento },
            select: { idCasino: true },
        });

        return casino?.idCasino ?? null;
    }

    async findMany(
        query: ListCasinosQuery,
    ): Promise<ListCasinosResult> {
        const where: Prisma.CasinoWhereInput =
            {};

        if (query.estado) {
            where.estado =
                this.mapEstadoToPrisma(
                    query.estado,
                );
        }

        if (query.idCiudad) {
            where.idCiudad = query.idCiudad;
        }

        if (query.idCentroCosto) {
            where.idCentroCosto = query.idCentroCosto;
        }

        if (query.idRazonSocial) {
            where.idRazonSocial = query.idRazonSocial;
        }

        if (query.buscar) {
            where.OR = [
                { nombreCasino: { contains: query.buscar } },
                { codigoDane: { contains: query.buscar } },
                { codigoEstablecimiento: { contains: query.buscar } },
                { telefono: { contains: query.buscar } },
                { direccion: { contains: query.buscar } },
            ];
        }

        const skip =
            (query.page - 1) * query.limit;

        const [casinos, total] =
            await Promise.all([
                this.prisma.casino.findMany({
                    where,
                    skip,
                    take: query.limit,

                    orderBy: {
                        nombreCasino: 'asc',
                    },

                    select: casinoSelect,
                }),

                this.prisma.casino.count({
                    where,
                }),
            ]);

        return {
            casinos: casinos.map((casino) =>
                this.mapCasino(casino),
            ),
            total,
        };
    }

    async update(
        idCasino: number,
        data: UpdateCasinoData,
    ): Promise<CasinoEntity> {
        const casino =
            await this.prisma.casino.update({
                where: {
                    idCasino,
                },

                data: {
                    nombreCasino: data.nombreCasino,
                    codigoDane: data.codigoDane,
                    codigoEstablecimiento: data.codigoEstablecimiento,
                    telefono: data.telefono,
                    direccion: data.direccion,
                    idCiudad: data.idCiudad,
                    idCentroCosto: data.idCentroCosto,
                    idRazonSocial: data.idRazonSocial,

                    estado:
                        data.estado === undefined
                            ? undefined
                            : this.mapEstadoToPrisma(
                                data.estado,
                            ),
                },

                select: casinoSelect,
            });

        return this.mapCasino(casino);
    }

    async deactivate(
        idCasino: number,
    ): Promise<CasinoEntity> {
        const casino =
            await this.prisma.casino.update({
                where: {
                    idCasino,
                },

                data: {
                    estado:
                        EstadoRegistro.INACTIVO,
                },

                select: casinoSelect,
            });

        return this.mapCasino(casino);
    }

    async checkForeignKeys(
        foreignKeys: CasinoForeignKeys,
    ): Promise<CasinoRelationsResult> {
        const [ciudad, centroCosto, razonSocial] = await Promise.all([
            this.prisma.ciudad.findUnique({
                where: { idCiudad: foreignKeys.idCiudad },
                select: { idCiudad: true },
            }),
            this.prisma.centroCosto.findUnique({
                where: { idCentroCosto: foreignKeys.idCentroCosto },
                select: { idCentroCosto: true },
            }),
            this.prisma.razonSocial.findUnique({
                where: { idRazonSocial: foreignKeys.idRazonSocial },
                select: { idRazonSocial: true },
            }),
        ]);

        return {
            ciudad: ciudad !== null,
            centroCosto: centroCosto !== null,
            razonSocial: razonSocial !== null,
        };
    }

    private mapCasino(
        casino: CasinoRecord,
    ): CasinoEntity {
        return {
            idCasino: casino.idCasino,
            nombreCasino: casino.nombreCasino,
            codigoDane: casino.codigoDane,
            codigoEstablecimiento: casino.codigoEstablecimiento,
            telefono: casino.telefono,
            direccion: casino.direccion,

            estado: casino.estado as EstadoCasino,

            ciudad: casino.ciudad,
            centroCosto: casino.centroCosto,
            razonSocial: casino.razonSocial,

            fechaCreacion: casino.fechaCreacion,
            fechaActualizacion: casino.fechaActualizacion,
        };
    }

    private mapEstadoToPrisma(
        estado: EstadoCasino,
    ): EstadoRegistro {
        return estado === 'ACTIVO'
            ? EstadoRegistro.ACTIVO
            : EstadoRegistro.INACTIVO;
    }
}