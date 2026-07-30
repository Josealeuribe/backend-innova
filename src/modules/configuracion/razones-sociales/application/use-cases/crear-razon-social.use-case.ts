import { Inject, Injectable } from '@nestjs/common';
import { CreateRazonSocialData, RazonSocialRepository } from '../../domain/repositories/razon-social.repository';
import { RAZON_SOCIAL_REPOSITORY } from '../../domain/repositories/razon-social.repository.token';
import { RazonSocialCorreoAlreadyExistsError, RazonSocialForeignKeyError, RazonSocialNitAlreadyExistsError, RazonSocialUbicacionInvalidaError } from '../../errors/razon-social.errors';
import { RazonSocialRulesService } from '../services/razon-social-rules.service';
import { PrismaRazonSocialRepository } from '../../persistence/prisma/prisma-razon-social.repository';

export interface CrearRazonSocialCommand {
  nit: string; nombreRazonSocial: string; telefono: string; direccion: string;
  codigoPostal?: string | null; correo: string;
  idPais: number; idDepartamento: number; idCiudad: number;
  idTipoPersona: number; idAmbienteDian: number; idRegimen: number;
  responsabilidadFiscal: string;
  contratoColjuegos?: string | null; fechaInicioContrato?: string | null; fechaFinContrato?: string | null;
  softwareId?: string | null; softwarePin?: string | null; testSetId?: string | null; claveTecnica?: string | null;
  numeroResolucion?: string | null; prefijoResolucion?: string | null; rangoInicio?: string | null; rangoFin?: string | null;
  fechaInicioResolucion?: string | null; fechaFinResolucion?: string | null;
  codigoHelisa?: string | null; estado?: 'ACTIVO' | 'INACTIVO';
}

@Injectable()
export class CrearRazonSocialUseCase {
  constructor(@Inject(RAZON_SOCIAL_REPOSITORY) private readonly repository: PrismaRazonSocialRepository) {}

  async execute(command: CrearRazonSocialCommand) {
    const nit = command.nit.trim();
    const correo = command.correo.trim().toLowerCase();
    if (await this.repository.findIdByNit(nit)) throw new RazonSocialNitAlreadyExistsError(nit);
    if (await this.repository.findIdByCorreo(correo)) throw new RazonSocialCorreoAlreadyExistsError(correo);

    const relations = await this.repository.checkRelations({
      idPais: command.idPais, idDepartamento: command.idDepartamento, idCiudad: command.idCiudad,
      idTipoPersona: command.idTipoPersona, idAmbienteDian: command.idAmbienteDian, idRegimen: command.idRegimen,
    });
    const missing: string[] = [];
    if (!relations.pais) missing.push('país');
    if (!relations.departamento) missing.push('departamento');
    if (!relations.ciudad) missing.push('ciudad');
    if (!relations.tipoPersona) missing.push('tipo de persona');
    if (!relations.ambienteDian) missing.push('ambiente DIAN');
    if (!relations.regimen) missing.push('régimen');
    if (missing.length) throw new RazonSocialForeignKeyError(missing);
    if (!relations.ubicacionValida) throw new RazonSocialUbicacionInvalidaError();

    const data: CreateRazonSocialData = {
      nit, nombreRazonSocial: command.nombreRazonSocial.trim(), telefono: command.telefono.trim(), direccion: command.direccion.trim(),
      codigoPostal: this.nullable(command.codigoPostal), correo,
      idPais: command.idPais, idDepartamento: command.idDepartamento, idCiudad: command.idCiudad,
      idTipoPersona: command.idTipoPersona, idAmbienteDian: command.idAmbienteDian, idRegimen: command.idRegimen,
      responsabilidadFiscal: command.responsabilidadFiscal.trim(),
      contratoColjuegos: this.nullable(command.contratoColjuegos),
      fechaInicioContrato: this.date(command.fechaInicioContrato), fechaFinContrato: this.date(command.fechaFinContrato),
      softwareId: this.nullable(command.softwareId), softwarePin: this.nullable(command.softwarePin),
      testSetId: this.nullable(command.testSetId), claveTecnica: this.nullable(command.claveTecnica),
      numeroResolucion: this.nullable(command.numeroResolucion), prefijoResolucion: this.nullable(command.prefijoResolucion),
      rangoInicio: this.nullable(command.rangoInicio), rangoFin: this.nullable(command.rangoFin),
      fechaInicioResolucion: this.date(command.fechaInicioResolucion), fechaFinResolucion: this.date(command.fechaFinResolucion),
      codigoHelisa: this.nullable(command.codigoHelisa), estado: command.estado ?? 'ACTIVO',
    };
    RazonSocialRulesService.validateContractDates(data.fechaInicioContrato, data.fechaFinContrato);
    RazonSocialRulesService.validateResolutionDates(data.fechaInicioResolucion, data.fechaFinResolucion);
    RazonSocialRulesService.validateResolutionRange(data.rangoInicio, data.rangoFin);
    return this.repository.create(data);
  }

  private nullable(value?: string | null): string | null { if (value == null) return null; const v = value.trim(); return v || null; }
  private date(value?: string | null): Date | null { return value ? new Date(value) : null; }
}
