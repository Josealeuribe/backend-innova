import {
  ListResolucionesDianQuery,
  ResolucionDianRepository,
} from '../../../domain/repositories/resolucion-dian.repository';

export class ListarResolucionesDianUseCase {
  constructor(
    private readonly resolucionDianRepository: ResolucionDianRepository,
  ) {}

  execute(query: ListResolucionesDianQuery) {
    return this.resolucionDianRepository.findMany(query);
  }
}
