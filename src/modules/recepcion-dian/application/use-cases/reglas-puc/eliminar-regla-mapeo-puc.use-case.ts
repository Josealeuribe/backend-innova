import { ReglaMapeoPucRepository } from '../../../domain/repositories/regla-mapeo-puc.repository';
import { ReglaMapeoPucNotFoundError } from '../../errors/recepcion-dian.errors';

export class EliminarReglaMapeoPucUseCase {
  constructor(
    private readonly reglaMapeoPucRepository: ReglaMapeoPucRepository,
  ) {}

  async execute(idReglaMapeoPuc: number) {
    const existente = await this.reglaMapeoPucRepository.findById(
      idReglaMapeoPuc,
    );

    if (!existente) {
      throw new ReglaMapeoPucNotFoundError();
    }

    await this.reglaMapeoPucRepository.delete(idReglaMapeoPuc);
  }
}
