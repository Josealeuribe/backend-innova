import {
  ListarDepartamentosQuery,
  UbicacionesRepository,
} from '../../domain/repositories/ubicaciones.repository';

export class ListarDepartamentosUseCase {
  constructor(
    private readonly repository:
      UbicacionesRepository,
  ) {}

  execute(
    query: ListarDepartamentosQuery,
  ) {
    return this.repository
      .listarDepartamentos(query);
  }
}