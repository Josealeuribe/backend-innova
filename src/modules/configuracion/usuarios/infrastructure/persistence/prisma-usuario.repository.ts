import { Injectable } from '@nestjs/common';
import {
    EstadoRegistro,
    Prisma,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import { UsuarioEntity } from '../../domain/entities/usuario.entity';
import {
    CreateUsuarioData,
    ListUsuariosQuery,
    ListUsuariosResult,
    MissingUsuarioRelations,
    UpdateUsuarioData,
    UsuarioForeignKeys,
    UsuarioRepository,
} from '../../domain/repositories/usuario.repository';

const usuarioSelect = {
    id: true,
    nombre: true,
    apellido: true,
    cedula: true,
    correo: true,

    cargo: true,
    fechaNacimiento: true,
    telefono: true,

    codigoHelisa: true,
    cuentaPuc: true,
    imgUrl: true,
    estado: true,

    fechaCreacion: true,
    fechaActualizacion: true,

    tipoDocumento: {
        select: {
            idTipoDoc: true,
            nombreDoc: true,
        },
    },

    genero: {
        select: {
            idGenero: true,
            nombreGenero: true,
        },
    },

    rol: {
        select: {
            idRol: true,
            nombreRol: true,
        },
    },

    ciudad: {
        select: {
            idCiudad: true,
            nombreCiudad: true,
        },
    },

    casino: {
        select: {
            idCasino: true,
            nombreCasino: true,
        },
    },
} satisfies Prisma.UsuarioSelect;

type UsuarioRecord = Prisma.UsuarioGetPayload<{
    select: typeof usuarioSelect;
}>;

@Injectable()
export class PrismaUsuarioRepository
    implements UsuarioRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async create(
        data: CreateUsuarioData,
    ): Promise<UsuarioEntity> {
        const usuario = await this.prisma.usuario.create({
            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                cedula: data.cedula,
                correo: data.correo,
                passwordHash: data.passwordHash,

                cargo: data.cargo,
                fechaNacimiento: data.fechaNacimiento,
                telefono: data.telefono,

                codigoHelisa: data.codigoHelisa ?? null,
                cuentaPuc: data.cuentaPuc ?? null,
                imgUrl: data.imgUrl ?? null,

                estado:
                    data.estado === 'ACTIVO'
                        ? EstadoRegistro.ACTIVO
                        : EstadoRegistro.INACTIVO,

                idTipoDoc: data.idTipoDoc,
                idGenero: data.idGenero,
                idRol: data.idRol,
                idCiudad: data.idCiudad,
                idCasino: data.idCasino,
            },

            select: usuarioSelect,
        });

        return this.mapUsuario(usuario);
    }

    async findById(
        id: number,
    ): Promise<UsuarioEntity | null> {
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                id,
            },

            select: usuarioSelect,
        });

        return usuario
            ? this.mapUsuario(usuario)
            : null;
    }

    async findIdByCorreo(
        correo: string,
    ): Promise<number | null> {
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                correo,
            },

            select: {
                id: true,
            },
        });

        return usuario?.id ?? null;
    }

    async findIdByCedula(
        cedula: string,
    ): Promise<number | null> {
        const usuario = await this.prisma.usuario.findUnique({
            where: {
                cedula,
            },

            select: {
                id: true,
            },
        });

        return usuario?.id ?? null;
    }

    async findMany(
        query: ListUsuariosQuery,
    ): Promise<ListUsuariosResult> {
        const where: Prisma.UsuarioWhereInput = {};

        if (query.estado) {
            where.estado =
                query.estado === 'ACTIVO'
                    ? EstadoRegistro.ACTIVO
                    : EstadoRegistro.INACTIVO;
        }

        if (query.idRol) {
            where.idRol = query.idRol;
        }

        if (query.idGenero) {
            where.idGenero = query.idGenero;
        }

        if (query.idTipoDoc) {
            where.idTipoDoc = query.idTipoDoc;
        }

        if (query.idCiudad) {
            where.idCiudad = query.idCiudad;
        }

        if (query.idCasino) {
            where.idCasino = query.idCasino;
        }

        if (query.buscar) {
            where.OR = [
                {
                    nombre: {
                        contains: query.buscar,
                    },
                },
                {
                    apellido: {
                        contains: query.buscar,
                    },
                },
                {
                    correo: {
                        contains: query.buscar,
                    },
                },
                {
                    cedula: {
                        contains: query.buscar,
                    },
                },
                {
                    codigoHelisa: {
                        contains: query.buscar,
                    },
                },
            ];
        }

        const skip = (query.page - 1) * query.limit;

        const [usuarios, total] = await Promise.all([
            this.prisma.usuario.findMany({
                where,
                skip,
                take: query.limit,

                orderBy: {
                    id: 'desc',
                },

                select: usuarioSelect,
            }),

            this.prisma.usuario.count({
                where,
            }),
        ]);

        return {
            usuarios: usuarios.map((usuario) =>
                this.mapUsuario(usuario),
            ),
            total,
        };
    }

    async update(
        id: number,
        data: UpdateUsuarioData,
    ): Promise<UsuarioEntity> {
        const usuario = await this.prisma.usuario.update({
            where: {
                id,
            },

            data: {
                nombre: data.nombre,
                apellido: data.apellido,
                cedula: data.cedula,
                correo: data.correo,
                passwordHash: data.passwordHash,

                cargo: data.cargo,
                fechaNacimiento: data.fechaNacimiento,
                telefono: data.telefono,

                codigoHelisa: data.codigoHelisa,
                cuentaPuc: data.cuentaPuc,
                imgUrl: data.imgUrl,

                estado:
                    data.estado === undefined
                        ? undefined
                        : data.estado === 'ACTIVO'
                            ? EstadoRegistro.ACTIVO
                            : EstadoRegistro.INACTIVO,

                idTipoDoc: data.idTipoDoc,
                idGenero: data.idGenero,
                idRol: data.idRol,
                idCiudad: data.idCiudad,
                idCasino: data.idCasino,
            },

            select: usuarioSelect,
        });

        return this.mapUsuario(usuario);
    }

    async deactivate(
        id: number,
    ): Promise<UsuarioEntity> {
        const usuario = await this.prisma.usuario.update({
            where: {
                id,
            },

            data: {
                estado: EstadoRegistro.INACTIVO,
            },

            select: usuarioSelect,
        });

        return this.mapUsuario(usuario);
    }

    async checkForeignKeys(
        foreignKeys: UsuarioForeignKeys,
    ): Promise<MissingUsuarioRelations> {
        const [
            rol,
            genero,
            tipoDocumento,
            ciudad,
            casino,
        ] = await Promise.all([
            this.prisma.rol.findUnique({
                where: {
                    idRol: foreignKeys.idRol,
                },
                select: {
                    idRol: true,
                },
            }),

            this.prisma.genero.findUnique({
                where: {
                    idGenero: foreignKeys.idGenero,
                },
                select: {
                    idGenero: true,
                },
            }),

            this.prisma.tipoDocumento.findUnique({
                where: {
                    idTipoDoc: foreignKeys.idTipoDoc,
                },
                select: {
                    idTipoDoc: true,
                },
            }),

            this.prisma.ciudad.findUnique({
                where: {
                    idCiudad: foreignKeys.idCiudad,
                },
                select: {
                    idCiudad: true,
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
        ]);

        return {
            rol: rol !== null,
            genero: genero !== null,
            tipoDocumento: tipoDocumento !== null,
            ciudad: ciudad !== null,
            casino: casino !== null,
        };
    }

    private mapUsuario(
        usuario: UsuarioRecord,
    ): UsuarioEntity {
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            cedula: usuario.cedula,
            correo: usuario.correo,

            cargo: usuario.cargo,
            fechaNacimiento: usuario.fechaNacimiento,
            telefono: usuario.telefono,

            codigoHelisa: usuario.codigoHelisa,
            cuentaPuc: usuario.cuentaPuc,
            imgUrl: usuario.imgUrl,

            estado: usuario.estado,

            tipoDocumento: usuario.tipoDocumento,
            genero: usuario.genero,
            rol: usuario.rol,
            ciudad: usuario.ciudad,
            casino: usuario.casino,

            fechaCreacion: usuario.fechaCreacion,
            fechaActualizacion:
                usuario.fechaActualizacion,
        };
    }
}