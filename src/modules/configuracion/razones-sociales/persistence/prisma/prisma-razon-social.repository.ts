import { Injectable } from '@nestjs/common';
import { EstadoRegistro, Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/shared/database/prisma/prisma.service';
import { EstadoRazonSocial, RazonSocialEntity } from '../../domain/entities/razon-social.entity';
import { CreateRazonSocialData, ListRazonesSocialesQuery, ListRazonesSocialesResult, RazonSocialForeignKeys, RazonSocialRelationsResult, RazonSocialRepository, UpdateRazonSocialData } from '../../domain/repositories/razon-social.repository';

const select = {
  idRazonSocial: true, nit: true, nombreRazonSocial: true, telefono: true, direccion: true, codigoPostal: true, correo: true,
  idPais: true, idDepartamento: true, idCiudad: true, idTipoPersona: true, idAmbienteDian: true, idRegimen: true,
  responsabilidadFiscal: true, contratoColjuegos: true, fechaInicioContrato: true, fechaFinContrato: true,
  softwareId: true, softwarePin: true, testSetId: true, claveTecnica: true,
  numeroResolucion: true, prefijoResolucion: true, rangoInicio: true, rangoFin: true, fechaInicioResolucion: true, fechaFinResolucion: true,
  codigoHelisa: true, estado: true, fechaCreacion: true, fechaActualizacion: true,
  pais: { select: { idPais: true, nombre: true } },
  departamento: { select: { idDepartamento: true, nombre: true } },
  ciudad: { select: { idCiudad: true, nombreCiudad: true } },
  tipoPersona: { select: { idTipoPersona: true, codigo: true, nombre: true } },
  ambienteDian: { select: { idAmbienteDian: true, codigo: true, nombre: true } },
  regimen: { select: { idRegimen: true, codigo: true, nombre: true } },
} satisfies Prisma.RazonSocialSelect;

type RecordType = Prisma.RazonSocialGetPayload<{ select: typeof select }>;

@Injectable()
export class PrismaRazonSocialRepository implements RazonSocialRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateRazonSocialData): Promise<RazonSocialEntity> {
    const record = await this.prisma.razonSocial.create({ data: { ...data, estado: data.estado as EstadoRegistro } as Prisma.RazonSocialUncheckedCreateInput, select });
    return this.map(record);
  }
  async findById(idRazonSocial: number): Promise<RazonSocialEntity | null> {
    const record = await this.prisma.razonSocial.findUnique({ where: { idRazonSocial }, select });
    return record ? this.map(record) : null;
  }
  async findIdByNit(nit: string): Promise<number | null> {
    return (await this.prisma.razonSocial.findUnique({ where: { nit }, select: { idRazonSocial: true } }))?.idRazonSocial ?? null;
  }
  async findIdByCorreo(correo: string): Promise<number | null> {
    return (await this.prisma.razonSocial.findUnique({ where: { correo }, select: { idRazonSocial: true } }))?.idRazonSocial ?? null;
  }
  async findMany(q: ListRazonesSocialesQuery): Promise<ListRazonesSocialesResult> {
    const where: Prisma.RazonSocialWhereInput = {
      estado: q.estado as EstadoRegistro | undefined,
      idPais: q.idPais, idDepartamento: q.idDepartamento, idCiudad: q.idCiudad,
      idTipoPersona: q.idTipoPersona, idAmbienteDian: q.idAmbienteDian, idRegimen: q.idRegimen,
    };
    const term = q.buscar?.trim();
    if (term) where.OR = [
      { nit: { contains: term } }, { nombreRazonSocial: { contains: term } }, { correo: { contains: term } },
      { telefono: { contains: term } }, { direccion: { contains: term } }, { codigoHelisa: { contains: term } },
    ];
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.razonSocial.findMany({ where, select, orderBy: [{ nombreRazonSocial: 'asc' }, { idRazonSocial: 'asc' }], skip: (q.page - 1) * q.limit, take: q.limit }),
      this.prisma.razonSocial.count({ where }),
    ]);
    return { razonesSociales: rows.map((r) => this.map(r)), total };
  }
  async update(idRazonSocial: number, data: UpdateRazonSocialData): Promise<RazonSocialEntity> {
    const record = await this.prisma.razonSocial.update({
      where: { idRazonSocial },
      data: { ...data, estado: data.estado ? (data.estado as EstadoRegistro) : undefined } as Prisma.RazonSocialUncheckedUpdateInput,
      select,
    });
    return this.map(record);
  }
  async deactivate(idRazonSocial: number): Promise<RazonSocialEntity> {
    return this.map(await this.prisma.razonSocial.update({ where: { idRazonSocial }, data: { estado: EstadoRegistro.INACTIVO }, select }));
  }
  async checkRelations(fk: RazonSocialForeignKeys): Promise<RazonSocialRelationsResult> {
    const [pais, dep, ciudad, tipo, ambiente, regimen] = await this.prisma.$transaction([
      this.prisma.pais.findUnique({ where: { idPais: fk.idPais }, select: { idPais: true } }),
      this.prisma.departamento.findUnique({ where: { idDepartamento: fk.idDepartamento }, select: { idDepartamento: true, idPais: true } }),
      this.prisma.ciudad.findFirst({ where: { idCiudad: fk.idCiudad, estado: EstadoRegistro.ACTIVO }, select: { idCiudad: true, idDepartamento: true } }),
      this.prisma.tipoPersona.findFirst({ where: { idTipoPersona: fk.idTipoPersona, estado: EstadoRegistro.ACTIVO }, select: { idTipoPersona: true } }),
      this.prisma.ambienteDian.findFirst({ where: { idAmbienteDian: fk.idAmbienteDian, estado: EstadoRegistro.ACTIVO }, select: { idAmbienteDian: true } }),
      this.prisma.regimen.findFirst({ where: { idRegimen: fk.idRegimen, estado: EstadoRegistro.ACTIVO }, select: { idRegimen: true } }),
    ]);
    return {
      pais: !!pais, departamento: !!dep, ciudad: !!ciudad, tipoPersona: !!tipo, ambienteDian: !!ambiente, regimen: !!regimen,
      ubicacionValida: !!pais && !!dep && !!ciudad && dep.idPais === fk.idPais && ciudad.idDepartamento === fk.idDepartamento,
    };
  }
  private map(r: RecordType): RazonSocialEntity {
    return {
      idRazonSocial: r.idRazonSocial, nit: r.nit, nombreRazonSocial: r.nombreRazonSocial, telefono: r.telefono, direccion: r.direccion,
      codigoPostal: r.codigoPostal, correo: r.correo, idPais: r.idPais, idDepartamento: r.idDepartamento, idCiudad: r.idCiudad,
      idTipoPersona: r.idTipoPersona, idAmbienteDian: r.idAmbienteDian, idRegimen: r.idRegimen,
      responsabilidadFiscal: r.responsabilidadFiscal, contratoColjuegos: r.contratoColjuegos,
      fechaInicioContrato: r.fechaInicioContrato, fechaFinContrato: r.fechaFinContrato,
      softwareId: r.softwareId, softwarePin: r.softwarePin, testSetId: r.testSetId, claveTecnica: r.claveTecnica,
      numeroResolucion: r.numeroResolucion, prefijoResolucion: r.prefijoResolucion, rangoInicio: r.rangoInicio, rangoFin: r.rangoFin,
      fechaInicioResolucion: r.fechaInicioResolucion, fechaFinResolucion: r.fechaFinResolucion,
      codigoHelisa: r.codigoHelisa, estado: r.estado as EstadoRazonSocial, fechaCreacion: r.fechaCreacion, fechaActualizacion: r.fechaActualizacion,
      pais: { id: r.pais.idPais, nombre: r.pais.nombre },
      departamento: { id: r.departamento.idDepartamento, nombre: r.departamento.nombre },
      ciudad: { id: r.ciudad.idCiudad, nombre: r.ciudad.nombreCiudad },
      tipoPersona: { id: r.tipoPersona.idTipoPersona, codigo: r.tipoPersona.codigo, nombre: r.tipoPersona.nombre },
      ambienteDian: { id: r.ambienteDian.idAmbienteDian, codigo: r.ambienteDian.codigo, nombre: r.ambienteDian.nombre },
      regimen: { id: r.regimen.idRegimen, codigo: r.regimen.codigo, nombre: r.regimen.nombre },
    };
  }
}
