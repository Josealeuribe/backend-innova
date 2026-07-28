import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { UsuarioNotFoundError } from '../errors/usuario.errors';

export class ObtenerUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(id: number) {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new UsuarioNotFoundError();
    }

    return usuario;
  }
}