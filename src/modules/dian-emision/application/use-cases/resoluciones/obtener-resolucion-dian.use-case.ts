import { ResolucionDianRepository } from '../../../domain/repositories/resolucion-dian.repository';
import { ResolucionDianNotFoundError } from '../../errors/dian-emision.errors';

export class ObtenerResolucionDianUseCase {
  constructor(
    private readonly resolucionDianRepository: ResolucionDianRepository,
  ) {}

  async execute(idResolucionDian: number) {
    const resolucion =
      await this.resolucionDianRepository.findById(idResolucionDian);

    if (!resolucion) {
      throw new ResolucionDianNotFoundError();
    }

    return resolucion;
  }
}
