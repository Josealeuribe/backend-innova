import {
  ListReglasMapeoPucQuery,
  ReglaMapeoPucRepository,
} from '../../../domain/repositories/regla-mapeo-puc.repository';

export class ListarReglasMapeoPucUseCase {
  constructor(
    private readonly reglaMapeoPucRepository: ReglaMapeoPucRepository,
  ) {}

  execute(query: ListReglasMapeoPucQuery) {
    return this.reglaMapeoPucRepository.findMany(query);
  }
}
