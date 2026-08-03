import { Injectable } from '@nestjs/common';

import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import { ClienteDianEntity } from '../../domain/entities/cliente-dian.entity';
import {
  ClienteDianRepository,
  CreateClienteDianData,
  ListClientesDianQuery,
  ListClientesDianResult,
  UpdateClienteDianData,
} from '../../domain/repositories/cliente-dian.repository';

const clienteDianSelect = {
  idClienteDian: true,
  nombre: true,
  tipoDocumento: true,
  numeroDocumento: true,
  direccion: true,
  ciudad: true,
  departamento: true,
  telefono: true,
  email: true,
  tipoPersona: true,
  responsabilidadFiscal: true,
  fechaCreacion: true,
  fechaActualizacion: true,
} satisfies Prisma.ClienteDianSelect;

type ClienteDianRecord = Prisma.ClienteDianGetPayload<{
  select: typeof clienteDianSelect;
}>;

@Injectable()
export class PrismaClienteDianRepository implements ClienteDianRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClienteDianData): Promise<ClienteDianEntity> {
    const cliente = await this.prisma.clienteDian.create({
      data: {
        nombre: data.nombre,
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: data.numeroDocumento,
        direccion: data.direccion,
        ciudad: data.ciudad,
        departamento: data.departamento,
        telefono: data.telefono,
        email: data.email,
        tipoPersona: data.tipoPersona,
        responsabilidadFiscal: data.responsabilidadFiscal,
      },
      select: clienteDianSelect,
    });

    return this.mapCliente(cliente);
  }

  async findById(idClienteDian: number): Promise<ClienteDianEntity | null> {
    const cliente = await this.prisma.clienteDian.findUnique({
      where: { idClienteDian },
      select: clienteDianSelect,
    });

    return cliente ? this.mapCliente(cliente) : null;
  }

  async findByNumeroDocumento(
    numeroDocumento: string,
  ): Promise<ClienteDianEntity | null> {
    const cliente = await this.prisma.clienteDian.findUnique({
      where: { numeroDocumento },
      select: clienteDianSelect,
    });

    return cliente ? this.mapCliente(cliente) : null;
  }

  async findMany(
    query: ListClientesDianQuery,
  ): Promise<ListClientesDianResult> {
    const where: Prisma.ClienteDianWhereInput = {};

    if (query.buscar) {
      where.OR = [
        { nombre: { contains: query.buscar } },
        { numeroDocumento: { contains: query.buscar } },
      ];
    }

    const skip = (query.page - 1) * query.limit;

    const [clientes, total] = await Promise.all([
      this.prisma.clienteDian.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: { nombre: 'asc' },
        select: clienteDianSelect,
      }),

      this.prisma.clienteDian.count({ where }),
    ]);

    return {
      clientes: clientes.map((cliente) => this.mapCliente(cliente)),
      total,
    };
  }

  async update(
    idClienteDian: number,
    data: UpdateClienteDianData,
  ): Promise<ClienteDianEntity> {
    const cliente = await this.prisma.clienteDian.update({
      where: { idClienteDian },
      data,
      select: clienteDianSelect,
    });

    return this.mapCliente(cliente);
  }

  private mapCliente(cliente: ClienteDianRecord): ClienteDianEntity {
    return {
      idClienteDian: cliente.idClienteDian,
      nombre: cliente.nombre,
      tipoDocumento: cliente.tipoDocumento,
      numeroDocumento: cliente.numeroDocumento,
      direccion: cliente.direccion,
      ciudad: cliente.ciudad,
      departamento: cliente.departamento,
      telefono: cliente.telefono,
      email: cliente.email,
      tipoPersona: cliente.tipoPersona,
      responsabilidadFiscal: cliente.responsabilidadFiscal,
      fechaCreacion: cliente.fechaCreacion,
      fechaActualizacion: cliente.fechaActualizacion,
    };
  }
}
