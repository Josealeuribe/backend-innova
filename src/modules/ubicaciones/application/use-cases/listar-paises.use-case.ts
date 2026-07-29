import {
  ListarPaisesQuery,
  UbicacionesRepository,
} from '../../domain/repositories/ubicaciones.repository';

export class ListarPaisesUseCase {
  constructor(
    private readonly repository:
      UbicacionesRepository,
  ) {}

  execute(query: ListarPaisesQuery) {
    return this.repository.listarPaises(
      query,
    );
  }
}