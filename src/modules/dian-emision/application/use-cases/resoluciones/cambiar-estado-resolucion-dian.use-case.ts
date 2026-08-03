import { ResolucionDianRepository } from '../../../domain/repositories/resolucion-dian.repository';
import {
  ResolucionDianActivaExistenteError,
  ResolucionDianNotFoundError,
} from '../../errors/dian-emision.errors';

export class CambiarEstadoResolucionDianUseCase {
  constructor(
    private readonly resolucionDianRepository: ResolucionDianRepository,
  ) {}

  async execute(idResolucionDian: number, activa: boolean) {
    const resolucion =
      await this.resolucionDianRepository.findById(idResolucionDian);

    if (!resolucion) {
      throw new ResolucionDianNotFoundError();
    }

    if (activa) {
      const existente = await this.resolucionDianRepository.findActiva(
        resolucion.idRazonSocial,
        resolucion.tipoDocumento,
        resolucion.entorno,
      );

      if (existente && existente.idResolucionDian !== idResolucionDian) {
        throw new ResolucionDianActivaExistenteError();
      }
    }

    return this.resolucionDianRepository.setActiva(idResolucionDian, activa);
  }
}
