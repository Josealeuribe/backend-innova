import {
  ActualizarReglaMapeoPucData,
  ReglaMapeoPucRepository,
} from '../../../domain/repositories/regla-mapeo-puc.repository';
import { ReglaMapeoPucNotFoundError } from '../../errors/recepcion-dian.errors';

export class ActualizarReglaMapeoPucUseCase {
  constructor(
    private readonly reglaMapeoPucRepository: ReglaMapeoPucRepository,
  ) {}

  async execute(
    idReglaMapeoPuc: number,
    data: ActualizarReglaMapeoPucData,
  ) {
    const existente = await this.reglaMapeoPucRepository.findById(
      idReglaMapeoPuc,
    );

    if (!existente) {
      throw new ReglaMapeoPucNotFoundError();
    }

    return this.reglaMapeoPucRepository.update(idReglaMapeoPuc, data);
  }
}
