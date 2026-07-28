import {
  ListCasinosQuery,
  CasinoRepository,
} from '../../domain/repositories/casino.repository';

export class ListarCasinosUseCase {
  constructor(
    private readonly casinoRepository:
      CasinoRepository,
  ) {}

  async execute(
    query: ListCasinosQuery,
  ) {
    const result =
      await this.casinoRepository.findMany(
        query,
      );

    return {
      data: result.casinos,

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