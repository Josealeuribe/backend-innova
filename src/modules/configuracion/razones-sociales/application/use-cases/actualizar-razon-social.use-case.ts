import { Inject, Injectable } from '@nestjs/common';

import { RAZON_SOCIAL_REPOSITORY } from '../../domain/repositories/razon-social.repository.token';
import { RazonSocialCorreoAlreadyExistsError, RazonSocialForeignKeyError, RazonSocialNitAlreadyExistsError, RazonSocialNotFoundError, RazonSocialUbicacionInvalidaError } from '../../errors/razon-social.errors';
import { RazonSocialRulesService } from '../services/razon-social-rules.service';
import { CrearRazonSocialCommand } from './crear-razon-social.use-case';
import { PrismaRazonSocialRepository } from '../../persistence/prisma/prisma-razon-social.repository';
import { UpdateRazonSocialData } from '../../domain/repositories/razon-social.repository';

export type ActualizarRazonSocialCommand = Partial<CrearRazonSocialCommand>;

@Injectable()
export class ActualizarRazonSocialUseCase {
  constructor(@Inject(RAZON_SOCIAL_REPOSITORY) private readonly repository: PrismaRazonSocialRepository) {}
  async execute(id: number, command: ActualizarRazonSocialCommand) {
    const current = await this.repository.findById(id);
    if (!current) throw new RazonSocialNotFoundError(id);
    if (command.nit !== undefined) { const value = command.nit.trim(); const existing = await this.repository.findIdByNit(value); if (existing && existing !== id) throw new RazonSocialNitAlreadyExistsError(value); }
    if (command.correo !== undefined) { const value = command.correo.trim().toLowerCase(); const existing = await this.repository.findIdByCorreo(value); if (existing && existing !== id) throw new RazonSocialCorreoAlreadyExistsError(value); }

    const keys = {
      idPais: command.idPais ?? current.idPais,
      idDepartamento: command.idDepartamento ?? current.idDepartamento,
      idCiudad: command.idCiudad ?? current.idCiudad,
      idTipoPersona: command.idTipoPersona ?? current.idTipoPersona,
      idAmbienteDian: command.idAmbienteDian ?? current.idAmbienteDian,
      idRegimen: command.idRegimen ?? current.idRegimen,
    };
    const relations = await this.repository.checkRelations(keys);
    const missing: string[] = [];
    if (!relations.pais) missing.push('país'); if (!relations.departamento) missing.push('departamento'); if (!relations.ciudad) missing.push('ciudad');
    if (!relations.tipoPersona) missing.push('tipo de persona'); if (!relations.ambienteDian) missing.push('ambiente DIAN'); if (!relations.regimen) missing.push('régimen');
    if (missing.length) throw new RazonSocialForeignKeyError(missing);
    if (!relations.ubicacionValida) throw new RazonSocialUbicacionInvalidaError();

    const data = this.build(command);
    const inicioContrato = data.fechaInicioContrato === undefined ? current.fechaInicioContrato : data.fechaInicioContrato;
    const finContrato = data.fechaFinContrato === undefined ? current.fechaFinContrato : data.fechaFinContrato;
    const inicioResolucion = data.fechaInicioResolucion === undefined ? current.fechaInicioResolucion : data.fechaInicioResolucion;
    const finResolucion = data.fechaFinResolucion === undefined ? current.fechaFinResolucion : data.fechaFinResolucion;
    const rangoInicio = data.rangoInicio === undefined ? current.rangoInicio : data.rangoInicio;
    const rangoFin = data.rangoFin === undefined ? current.rangoFin : data.rangoFin;
    RazonSocialRulesService.validateContractDates(inicioContrato, finContrato);
    RazonSocialRulesService.validateResolutionDates(inicioResolucion, finResolucion);
    RazonSocialRulesService.validateResolutionRange(rangoInicio, rangoFin);
    return this.repository.update(id, data);
  }

  private build(c: ActualizarRazonSocialCommand): UpdateRazonSocialData {
    return {
      nit: c.nit?.trim(), nombreRazonSocial: c.nombreRazonSocial?.trim(), telefono: c.telefono?.trim(), direccion: c.direccion?.trim(),
      codigoPostal: this.optionalNullable(c.codigoPostal), correo: c.correo?.trim().toLowerCase(),
      idPais: c.idPais, idDepartamento: c.idDepartamento, idCiudad: c.idCiudad, idTipoPersona: c.idTipoPersona, idAmbienteDian: c.idAmbienteDian, idRegimen: c.idRegimen,
      responsabilidadFiscal: c.responsabilidadFiscal?.trim(), contratoColjuegos: this.optionalNullable(c.contratoColjuegos),
      fechaInicioContrato: this.optionalDate(c.fechaInicioContrato), fechaFinContrato: this.optionalDate(c.fechaFinContrato),
      softwareId: this.optionalNullable(c.softwareId), softwarePin: this.optionalNullable(c.softwarePin), testSetId: this.optionalNullable(c.testSetId), claveTecnica: this.optionalNullable(c.claveTecnica),
      numeroResolucion: this.optionalNullable(c.numeroResolucion), prefijoResolucion: this.optionalNullable(c.prefijoResolucion), rangoInicio: this.optionalNullable(c.rangoInicio), rangoFin: this.optionalNullable(c.rangoFin),
      fechaInicioResolucion: this.optionalDate(c.fechaInicioResolucion), fechaFinResolucion: this.optionalDate(c.fechaFinResolucion), codigoHelisa: this.optionalNullable(c.codigoHelisa), estado: c.estado,
    };
  }
  private optionalNullable(v?: string | null): string | null | undefined { if (v === undefined) return undefined; if (v === null) return null; return v.trim() || null; }
  private optionalDate(v?: string | null): Date | null | undefined { if (v === undefined) return undefined; return v ? new Date(v) : null; }
}
