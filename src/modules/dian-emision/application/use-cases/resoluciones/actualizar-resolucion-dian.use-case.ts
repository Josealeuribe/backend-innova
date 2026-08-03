import {
  ResolucionDianRepository,
  UpdateResolucionDianData,
} from '../../../domain/repositories/resolucion-dian.repository';
import { ResolucionDianNotFoundError } from '../../errors/dian-emision.errors';

export class ActualizarResolucionDianUseCase {
  constructor(
    private readonly resolucionDianRepository: ResolucionDianRepository,
  ) {}

  async execute(
    idResolucionDian: number,
    data: UpdateResolucionDianData,
  ) {
    const existente =
      await this.resolucionDianRepository.findById(idResolucionDian);

    if (!existente) {
      throw new ResolucionDianNotFoundError();
    }

    return this.resolucionDianRepository.update(idResolucionDian, data);
  }
}
