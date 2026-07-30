import { Injectable } from '@nestjs/common';

import {
  EstadoRegistro,
  Prisma,
} from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import {
  EstadoRol,
  RolEntity,
} from '../../domain/entities/rol.entity';
import {
  CreateRolData,
  ListRolesQuery,
  ListRolesResult,
  RolRepository,
  UpdateRolData,
} from '../../domain/repositories/rol.repository';

const rolSelect = {
  idRol: true,
  nombreRol: true,
  descripcion: true,
  estado: true,
  fechaCreacion: true,
  fechaActualizacion: true,
  _count: {
    select: {
      usuarios: true,
    },
  },
} satisfies Prisma.RolSelect;

type RolRecord = Prisma.RolGetPayload<{
  select: typeof rolSelect;
}>;

@Injectable()
export class PrismaRolRepository implements RolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRolData): Promise<RolEntity> {
    const record = await this.prisma.rol.create({
      data: {
        nombreRol: data.nombreRol,
        descripcion: data.descripcion,
        estado: data.estado as EstadoRegistro,
      },
      select: rolSelect,
    });

    return this.toEntity(record);
  }

  async findById(idRol: number): Promise<RolEntity | null> {
    const record = await this.prisma.rol.findUnique({
      where: { idRol },
      select: rolSelect,
    });

    return record ? this.toEntity(record) : null;
  }

  async findIdByNombre(nombreRol: string): Promise<number | null> {
    const record = await this.prisma.rol.findUnique({
      where: { nombreRol },
      select: { idRol: true },
    });

    return record?.idRol ?? null;
  }

  async findMany(query: ListRolesQuery): Promise<ListRolesResult> {
    const where: Prisma.RolWhereInput = {
      estado: query.estado
        ? (query.estado as EstadoRegistro)
        : undefined,
    };

    const buscar = query.buscar?.trim();

    if (buscar) {
      where.OR = [
        { nombreRol: { contains: buscar } },
        { descripcion: { contains: buscar } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [records, total] = await this.prisma.$transaction([
      this.prisma.rol.findMany({
        where,
        select: rolSelect,
        orderBy: [
          { nombreRol: 'asc' },
          { idRol: 'asc' },
        ],
        skip,
        take: query.limit,
      }),
      this.prisma.rol.count({ where }),
    ]);

    return {
      roles: records.map((record) => this.toEntity(record)),
      total,
    };
  }

  async update(
    idRol: number,
    data: UpdateRolData,
  ): Promise<RolEntity> {
    const record = await this.prisma.rol.update({
      where: { idRol },
      data: {
        nombreRol: data.nombreRol,
        descripcion: data.descripcion,
        estado: data.estado
          ? (data.estado as EstadoRegistro)
          : undefined,
      },
      select: rolSelect,
    });

    return this.toEntity(record);
  }

  async deactivate(idRol: number): Promise<RolEntity> {
    const record = await this.prisma.rol.update({
      where: { idRol },
      data: { estado: EstadoRegistro.INACTIVO },
      select: rolSelect,
    });

    return this.toEntity(record);
  }

  countActiveUsersByRole(idRol: number): Promise<number> {
    return this.prisma.usuario.count({
      where: {
        idRol,
        estado: EstadoRegistro.ACTIVO,
      },
    });
  }

  private toEntity(record: RolRecord): RolEntity {
    return {
      idRol: record.idRol,
      nombreRol: record.nombreRol,
      descripcion: record.descripcion,
      estado: record.estado as EstadoRol,
      totalUsuarios: record._count.usuarios,
      fechaCreacion: record.fechaCreacion,
      fechaActualizacion: record.fechaActualizacion,
    };
  }
}
