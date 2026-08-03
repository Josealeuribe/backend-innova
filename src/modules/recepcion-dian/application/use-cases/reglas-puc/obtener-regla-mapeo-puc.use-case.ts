import { ReglaMapeoPucRepository } from '../../../domain/repositories/regla-mapeo-puc.repository';
import { ReglaMapeoPucNotFoundError } from '../../errors/recepcion-dian.errors';

export class ObtenerReglaMapeoPucUseCase {
  constructor(
    private readonly reglaMapeoPucRepository: ReglaMapeoPucRepository,
  ) {}

  async execute(idReglaMapeoPuc: number) {
    const regla = await this.reglaMapeoPucRepository.findById(
      idReglaMapeoPuc,
    );

    if (!regla) {
      throw new ReglaMapeoPucNotFoundError();
    }

    return regla;
  }
}
