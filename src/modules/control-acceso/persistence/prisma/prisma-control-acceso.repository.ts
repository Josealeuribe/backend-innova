import { Injectable } from '@nestjs/common';

import { EstadoRegistro, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import {
  AccionEntity,
  EstadoControlAcceso,
  MatrizPermisosRol,
  ModuloEntity,
  PermisoEntity,
} from '../../domain/entities/control-acceso.entities';
import {
  ControlAccesoRepository,
  CreateAccionData,
  CreateModuloData,
  CreatePermisoData,
  GuardarPermisoRolData,
  ListResult,
  PaginacionQuery,
  UpdateAccionData,
  UpdateModuloData,
  UpdatePermisoData,
} from '../../domain/repositories/control-acceso.repository';

const moduloSelect = {
  idModulo: true,
  codigo: true,
  nombre: true,
  descripcion: true,
  ruta: true,
  icono: true,
  orden: true,
  visibleMenu: true,
  idModuloPadre: true,
  estado: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  _count: {
    select: {
      submodulos: true,
      permisos: true,
    },
  },
} satisfies Prisma.ModuloSelect;

type ModuloRecord = Prisma.ModuloGetPayload<{ select: typeof moduloSelect }>;

const accionSelect = {
  idAccion: true,
  codigo: true,
  nombre: true,
  descripcion: true,
  estado: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  _count: {
    select: {
      permisos: true,
    },
  },
} satisfies Prisma.AccionSelect;

type AccionRecord = Prisma.AccionGetPayload<{ select: typeof accionSelect }>;

const permisoSelect = {
  idPermiso: true,
  idModulo: true,
  idAccion: true,
  estado: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  modulo: {
    select: {
      idModulo: true,
      codigo: true,
      nombre: true,
    },
  },
  accion: {
    select: {
      idAccion: true,
      codigo: true,
      nombre: true,
    },
  },
  _count: {
    select: {
      roles: true,
    },
  },
} satisfies Prisma.PermisoSelect;

type PermisoRecord = Prisma.PermisoGetPayload<{ select: typeof permisoSelect }>;

@Injectable()
export class PrismaControlAccesoRepository implements ControlAccesoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createModulo(data: CreateModuloData): Promise<ModuloEntity> {
    const record = await this.prisma.modulo.create({
      data: { ...data, estado: data.estado as EstadoRegistro },
      select: moduloSelect,
    });
    return this.toModulo(record);
  }

  async findModuloById(idModulo: number): Promise<ModuloEntity | null> {
    const record = await this.prisma.modulo.findUnique({
      where: { idModulo },
      select: moduloSelect,
    });
    return record ? this.toModulo(record) : null;
  }

  async findModuloIdByCodigo(codigo: string): Promise<number | null> {
    const record = await this.prisma.modulo.findUnique({
      where: { codigo },
      select: { idModulo: true },
    });
    return record?.idModulo ?? null;
  }

  async listModulos(query: PaginacionQuery): Promise<ListResult<ModuloEntity>> {
    const where: Prisma.ModuloWhereInput = {
      estado: query.estado ? (query.estado as EstadoRegistro) : undefined,
    };
    if (query.buscar?.trim()) {
      const buscar = query.buscar.trim();
      where.OR = [
        { codigo: { contains: buscar } },
        { nombre: { contains: buscar } },
        { descripcion: { contains: buscar } },
        { ruta: { contains: buscar } },
      ];
    }

    const [records, total] = await this.prisma.$transaction([
      this.prisma.modulo.findMany({
        where,
        select: moduloSelect,
        orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.modulo.count({ where }),
    ]);

    return { data: records.map((item) => this.toModulo(item)), total };
  }

  async updateModulo(idModulo: number, data: UpdateModuloData): Promise<ModuloEntity> {
    const record = await this.prisma.modulo.update({
      where: { idModulo },
      data: {
        ...data,
        estado: data.estado ? (data.estado as EstadoRegistro) : undefined,
      },
      select: moduloSelect,
    });
    return this.toModulo(record);
  }

  async deactivateModulo(idModulo: number): Promise<ModuloEntity> {
    return this.updateModulo(idModulo, { estado: 'INACTIVO' });
  }

  async moduloExists(idModulo: number): Promise<boolean> {
    return Boolean(
      await this.prisma.modulo.findFirst({
        where: { idModulo, estado: EstadoRegistro.ACTIVO },
        select: { idModulo: true },
      }),
    );
  }

  countActiveSubmodules(idModulo: number): Promise<number> {
    return this.prisma.modulo.count({
      where: { idModuloPadre: idModulo, estado: EstadoRegistro.ACTIVO },
    });
  }

  countActivePermissionsByModule(idModulo: number): Promise<number> {
    return this.prisma.permiso.count({
      where: { idModulo, estado: EstadoRegistro.ACTIVO },
    });
  }

  async createAccion(data: CreateAccionData): Promise<AccionEntity> {
    const record = await this.prisma.accion.create({
      data: { ...data, estado: data.estado as EstadoRegistro },
      select: accionSelect,
    });
    return this.toAccion(record);
  }

  async findAccionById(idAccion: number): Promise<AccionEntity | null> {
    const record = await this.prisma.accion.findUnique({
      where: { idAccion },
      select: accionSelect,
    });
    return record ? this.toAccion(record) : null;
  }

  async findAccionIdByCodigo(codigo: string): Promise<number | null> {
    const record = await this.prisma.accion.findUnique({
      where: { codigo },
      select: { idAccion: true },
    });
    return record?.idAccion ?? null;
  }

  async listAcciones(query: PaginacionQuery): Promise<ListResult<AccionEntity>> {
    const where: Prisma.AccionWhereInput = {
      estado: query.estado ? (query.estado as EstadoRegistro) : undefined,
    };
    if (query.buscar?.trim()) {
      const buscar = query.buscar.trim();
      where.OR = [
        { codigo: { contains: buscar } },
        { nombre: { contains: buscar } },
        { descripcion: { contains: buscar } },
      ];
    }

    const [records, total] = await this.prisma.$transaction([
      this.prisma.accion.findMany({
        where,
        select: accionSelect,
        orderBy: [{ nombre: 'asc' }, { idAccion: 'asc' }],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.accion.count({ where }),
    ]);

    return { data: records.map((item) => this.toAccion(item)), total };
  }

  async updateAccion(idAccion: number, data: UpdateAccionData): Promise<AccionEntity> {
    const record = await this.prisma.accion.update({
      where: { idAccion },
      data: {
        ...data,
        estado: data.estado ? (data.estado as EstadoRegistro) : undefined,
      },
      select: accionSelect,
    });
    return this.toAccion(record);
  }

  async deactivateAccion(idAccion: number): Promise<AccionEntity> {
    return this.updateAccion(idAccion, { estado: 'INACTIVO' });
  }

  async accionExists(idAccion: number): Promise<boolean> {
    return Boolean(
      await this.prisma.accion.findFirst({
        where: { idAccion, estado: EstadoRegistro.ACTIVO },
        select: { idAccion: true },
      }),
    );
  }

  countActivePermissionsByAction(idAccion: number): Promise<number> {
    return this.prisma.permiso.count({
      where: { idAccion, estado: EstadoRegistro.ACTIVO },
    });
  }

  async createPermiso(data: CreatePermisoData): Promise<PermisoEntity> {
    const record = await this.prisma.permiso.create({
      data: { ...data, estado: data.estado as EstadoRegistro },
      select: permisoSelect,
    });
    return this.toPermiso(record);
  }

  async findPermisoById(idPermiso: number): Promise<PermisoEntity | null> {
    const record = await this.prisma.permiso.findUnique({
      where: { idPermiso },
      select: permisoSelect,
    });
    return record ? this.toPermiso(record) : null;
  }

  async findPermisoIdByCombination(idModulo: number, idAccion: number): Promise<number | null> {
    const record = await this.prisma.permiso.findFirst({
      where: { idModulo, idAccion },
      select: { idPermiso: true },
    });
    return record?.idPermiso ?? null;
  }

  async listPermisos(
    query: PaginacionQuery & { idModulo?: number; idAccion?: number },
  ): Promise<ListResult<PermisoEntity>> {
    const where: Prisma.PermisoWhereInput = {
      estado: query.estado ? (query.estado as EstadoRegistro) : undefined,
      idModulo: query.idModulo,
      idAccion: query.idAccion,
    };
    if (query.buscar?.trim()) {
      const buscar = query.buscar.trim();
      where.OR = [
        { modulo: { codigo: { contains: buscar } } },
        { modulo: { nombre: { contains: buscar } } },
        { accion: { codigo: { contains: buscar } } },
        { accion: { nombre: { contains: buscar } } },
      ];
    }

    const [records, total] = await this.prisma.$transaction([
      this.prisma.permiso.findMany({
        where,
        select: permisoSelect,
        orderBy: [
          { modulo: { orden: 'asc' } },
          { accion: { idAccion: 'asc' } },
        ],
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      this.prisma.permiso.count({ where }),
    ]);

    return { data: records.map((item) => this.toPermiso(item)), total };
  }

  async updatePermiso(idPermiso: number, data: UpdatePermisoData): Promise<PermisoEntity> {
    const record = await this.prisma.permiso.update({
      where: { idPermiso },
      data: {
        ...data,
        estado: data.estado ? (data.estado as EstadoRegistro) : undefined,
      },
      select: permisoSelect,
    });
    return this.toPermiso(record);
  }

  async deactivatePermiso(idPermiso: number): Promise<PermisoEntity> {
    return this.updatePermiso(idPermiso, { estado: 'INACTIVO' });
  }

  countAllowedRolesByPermission(idPermiso: number): Promise<number> {
    return this.prisma.rolPermiso.count({
      where: { idPermiso, permitido: true },
    });
  }

  countPermissionsByIds(ids: number[]): Promise<number> {
    return this.prisma.permiso.count({
      where: { idPermiso: { in: ids } },
    });
  }

  async roleExists(idRol: number): Promise<boolean> {
    return Boolean(
      await this.prisma.rol.findUnique({
        where: { idRol },
        select: { idRol: true },
      }),
    );
  }

  async getRolePermissionMatrix(idRol: number): Promise<MatrizPermisosRol | null> {
    const rol = await this.prisma.rol.findUnique({
      where: { idRol },
      select: { idRol: true, nombreRol: true, estado: true },
    });
    if (!rol) return null;

    const [acciones, modulos, asignaciones] = await this.prisma.$transaction([
      this.prisma.accion.findMany({
        where: { estado: EstadoRegistro.ACTIVO },
        select: { idAccion: true, codigo: true, nombre: true },
        orderBy: { idAccion: 'asc' },
      }),
      this.prisma.modulo.findMany({
        where: { estado: EstadoRegistro.ACTIVO },
        select: {
          idModulo: true,
          codigo: true,
          nombre: true,
          descripcion: true,
          orden: true,
          permisos: {
            where: { estado: EstadoRegistro.ACTIVO },
            select: { idPermiso: true, idAccion: true },
          },
        },
        orderBy: [{ orden: 'asc' }, { nombre: 'asc' }],
      }),
      this.prisma.rolPermiso.findMany({
        where: { idRol },
        select: { idPermiso: true, permitido: true },
      }),
    ]);

    const allowedMap = new Map(
      asignaciones.map((item) => [item.idPermiso, item.permitido]),
    );
    const actionCode = new Map(
      acciones.map((item) => [item.idAccion, item.codigo]),
    );

    return {
      rol: {
        idRol: rol.idRol,
        nombreRol: rol.nombreRol,
        estado: rol.estado as EstadoControlAcceso,
      },
      acciones,
      modulos: modulos.map((modulo) => ({
        idModulo: modulo.idModulo,
        codigo: modulo.codigo,
        nombre: modulo.nombre,
        descripcion: modulo.descripcion,
        orden: modulo.orden,
        permisos: modulo.permisos.map((permiso) => ({
          idPermiso: permiso.idPermiso,
          idAccion: permiso.idAccion,
          codigoAccion: actionCode.get(permiso.idAccion) ?? '',
          permitido: allowedMap.get(permiso.idPermiso) ?? false,
        })),
      })),
    };
  }

  async saveRolePermissions(
    idRol: number,
    permisos: GuardarPermisoRolData[],
  ): Promise<MatrizPermisosRol> {
    await this.prisma.$transaction(
      permisos.map((item) =>
        this.prisma.rolPermiso.upsert({
          where: {
            idRol_idPermiso: {
              idRol,
              idPermiso: item.idPermiso,
            },
          },
          create: {
            idRol,
            idPermiso: item.idPermiso,
            permitido: item.permitido,
          },
          update: {
            permitido: item.permitido,
          },
        }),
      ),
    );

    const matrix = await this.getRolePermissionMatrix(idRol);
    if (!matrix) throw new Error('No fue posible reconstruir la matriz de permisos.');
    return matrix;
  }

  private toModulo(record: ModuloRecord): ModuloEntity {
    return {
      idModulo: record.idModulo,
      codigo: record.codigo,
      nombre: record.nombre,
      descripcion: record.descripcion,
      ruta: record.ruta,
      icono: record.icono,
      orden: record.orden,
      visibleMenu: record.visibleMenu,
      idModuloPadre: record.idModuloPadre,
      estado: record.estado as EstadoControlAcceso,
      totalSubmodulos: record._count.submodulos,
      totalPermisos: record._count.permisos,
      fechaCreacion: record.fechaCreacion,
      fechaActualizacion: record.fechaActualizacion,
    };
  }

  private toAccion(record: AccionRecord): AccionEntity {
    return {
      idAccion: record.idAccion,
      codigo: record.codigo,
      nombre: record.nombre,
      descripcion: record.descripcion,
      estado: record.estado as EstadoControlAcceso,
      totalPermisos: record._count.permisos,
      fechaCreacion: record.fechaCreacion,
      fechaActualizacion: record.fechaActualizacion,
    };
  }

  private toPermiso(record: PermisoRecord): PermisoEntity {
    return {
      idPermiso: record.idPermiso,
      idModulo: record.idModulo,
      idAccion: record.idAccion,
      estado: record.estado as EstadoControlAcceso,
      modulo: record.modulo,
      accion: record.accion,
      totalRoles: record._count.roles,
      fechaCreacion: record.fechaCreacion,
      fechaActualizacion: record.fechaActualizacion,
    };
  }
}
