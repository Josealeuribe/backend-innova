import { Injectable } from '@nestjs/common';

import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';

import { RazonSocialDianEntity } from '../../domain/entities/razon-social-dian.entity';
import { RazonSocialDianRepository } from '../../domain/repositories/razon-social-dian.repository';

const razonSocialDianSelect = {
  idRazonSocial: true,
  nit: true,
  nombreRazonSocial: true,
  direccion: true,
  codigoPostal: true,
  telefono: true,
  correo: true,
  responsabilidadFiscal: true,
  softwareId: true,
  softwarePin: true,
  claveTecnica: true,
  ciudad: { select: { nombreCiudad: true } },
  departamento: { select: { nombre: true } },
  pais: { select: { nombre: true } },
  tipoPersona: { select: { codigo: true } },
} satisfies Prisma.RazonSocialSelect;

type RazonSocialDianRecord = Prisma.RazonSocialGetPayload<{
  select: typeof razonSocialDianSelect;
}>;

@Injectable()
export class PrismaRazonSocialDianRepository
  implements RazonSocialDianRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(
    idRazonSocial: number,
  ): Promise<RazonSocialDianEntity | null> {
    const razonSocial = await this.prisma.razonSocial.findUnique({
      where: { idRazonSocial },
      select: razonSocialDianSelect,
    });

    return razonSocial ? this.mapRazonSocial(razonSocial) : null;
  }

  private mapRazonSocial(
    razonSocial: RazonSocialDianRecord,
  ): RazonSocialDianEntity {
    return {
      idRazonSocial: razonSocial.idRazonSocial,
      nit: razonSocial.nit,
      nombreRazonSocial: razonSocial.nombreRazonSocial,
      direccion: razonSocial.direccion,
      codigoPostal: razonSocial.codigoPostal,
      telefono: razonSocial.telefono,
      correo: razonSocial.correo,
      ciudad: razonSocial.ciudad.nombreCiudad,
      departamento: razonSocial.departamento.nombre,
      pais: razonSocial.pais.nombre,
      tipoPersonaCodigo: razonSocial.tipoPersona.codigo,
      responsabilidadFiscal: razonSocial.responsabilidadFiscal,
      softwareId: razonSocial.softwareId,
      softwarePin: razonSocial.softwarePin,
      claveTecnica: razonSocial.claveTecnica,
    };
  }
}
