import {
  ListarCiudadesQuery,
  UbicacionesRepository,
} from '../../domain/repositories/ubicaciones.repository';

export class ListarCiudadesUseCase {
  constructor(
    private readonly repository:
      UbicacionesRepository,
  ) {}

  execute(query: ListarCiudadesQuery) {
    return this.repository.listarCiudades(
      query,
    );
  }
}