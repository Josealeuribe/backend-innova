import {
  ListUsuariosQuery,
  UsuarioRepository,
} from '../../domain/repositories/usuario.repository';

export class ListarUsuariosUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(query: ListUsuariosQuery) {
    const result = await this.usuarioRepository.findMany(query);

    return {
      data: result.usuarios,

      meta: {
        page: query.page,
        limit: query.limit,
        total: result.total,
        totalPages: Math.ceil(result.total / query.limit),
      },
    };
  }
}