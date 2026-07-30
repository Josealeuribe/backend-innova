import {
  CentroCostoRepository,
  ListCentrosCostosQuery,
} from '../../domain/repositories/centro-costo.repository';

export class ListarCentrosCostosUseCase {
  constructor(
    private readonly centroCostoRepository:
      CentroCostoRepository,
  ) {}

  async execute(
    query: ListCentrosCostosQuery,
  ) {
    const buscar =
      query.buscar?.trim() || undefined;

    const result =
      await this.centroCostoRepository.findMany({
        ...query,
        buscar,
      });

    return {
      data: result.centrosCostos,

      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,

        totalPages: Math.ceil(
          result.total / query.limit,
        ),
      },
    };
  }
}