import { TipoDocumentoDian } from '../../../domain/entities/resolucion-dian.entity';
import { ResolucionDianRepository } from '../../../domain/repositories/resolucion-dian.repository';
import { ResolucionDianActivaExistenteError } from '../../errors/dian-emision.errors';

export interface CrearResolucionDianCommand {
  idRazonSocial: number;
  tipoDocumento: TipoDocumentoDian;
  entorno: string;
  prefijo: string;
  numeroResolucion: string;
  rangoDesde: number;
  rangoHasta: number;
  fechaVigenciaDesde: Date;
  fechaVigenciaHasta: Date;
  claveTecnica: string;
  activa?: boolean;
}

export class CrearResolucionDianUseCase {
  constructor(
    private readonly resolucionDianRepository: ResolucionDianRepository,
  ) {}

  async execute(command: CrearResolucionDianCommand) {
    const activa = command.activa ?? true;

    if (activa) {
      const existente = await this.resolucionDianRepository.findActiva(
        command.idRazonSocial,
        command.tipoDocumento,
        command.entorno,
      );

      if (existente) {
        throw new ResolucionDianActivaExistenteError();
      }
    }

    return this.resolucionDianRepository.create({
      idRazonSocial: command.idRazonSocial,
      tipoDocumento: command.tipoDocumento,
      entorno: command.entorno,
      prefijo: command.prefijo.trim().toUpperCase(),
      numeroResolucion: command.numeroResolucion.trim(),
      rangoDesde: command.rangoDesde,
      rangoHasta: command.rangoHasta,
      fechaVigenciaDesde: command.fechaVigenciaDesde,
      fechaVigenciaHasta: command.fechaVigenciaHasta,
      claveTecnica: command.claveTecnica.trim(),
      activa,
    });
  }
}
