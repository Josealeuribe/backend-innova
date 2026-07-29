import { Injectable } from '@nestjs/common';

import { EstadoRegistro, Prisma } from
  'src/generated/prisma/client';

import { PrismaService } from
  'src/shared/database/prisma/prisma.service';

import {
  CiudadCatalogo,
  DepartamentoCatalogo,
  ListarCiudadesQuery,
  ListarDepartamentosQuery,
  ListarPaisesQuery,
  PaisCatalogo,
  UbicacionesRepository,
} from '../../domain/repositories/ubicaciones.repository';

@Injectable()
export class PrismaUbicacionesRepository
  implements UbicacionesRepository
{
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async listarPaises(
    query: ListarPaisesQuery,
  ): Promise<PaisCatalogo[]> {
    const where: Prisma.PaisWhereInput =
      {};

    if (query.buscar) {
      where.nombre = {
        contains: query.buscar,
      };
    }

    const paises =
      await this.prisma.pais.findMany({
        where,

        select: {
          idPais: true,
          nombre: true,
        },

        orderBy: {
          nombre: 'asc',
        },
      });

    return paises;
  }

  async listarDepartamentos(
    query: ListarDepartamentosQuery,
  ): Promise<DepartamentoCatalogo[]> {
    const where:
      Prisma.DepartamentoWhereInput = {};

    if (query.idPais) {
      where.idPais = query.idPais;
    }

    if (query.buscar) {
      where.nombre = {
        contains: query.buscar,
      };
    }

    const departamentos =
      await this.prisma.departamento.findMany({
        where,

        select: {
          idDepartamento: true,
          nombre: true,
          idPais: true,
        },

        orderBy: {
          nombre: 'asc',
        },
      });

    return departamentos;
  }

  async listarCiudades(
  query: ListarCiudadesQuery,
): Promise<CiudadCatalogo[]> {
  const where:
    Prisma.CiudadWhereInput = {};

  if (
    query.idDepartamento !== undefined
  ) {
    where.idDepartamento =
      query.idDepartamento;
  }

  if (query.idPais !== undefined) {
    where.departamento = {
      is: {
        idPais: query.idPais,
      },
    };
  }

  if (query.estado) {
    where.estado =
      query.estado === 'ACTIVO'
        ? EstadoRegistro.ACTIVO
        : EstadoRegistro.INACTIVO;
  }

  if (query.buscar) {
    where.nombreCiudad = {
      contains: query.buscar,
    };
  }

  return this.prisma.ciudad.findMany({
    where,

    select: {
      idCiudad: true,
      nombreCiudad: true,
      idDepartamento: true,
    },

    orderBy: {
      nombreCiudad: 'asc',
    },
  });
}
}