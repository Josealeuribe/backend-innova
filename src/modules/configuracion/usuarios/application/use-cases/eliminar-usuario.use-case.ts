import { UsuarioRepository } from '../../domain/repositories/usuario.repository';
import { UsuarioNotFoundError } from '../errors/usuario.errors';

export class EliminarUsuarioUseCase {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
  ) {}

  async execute(id: number) {
    const usuario = await this.usuarioRepository.findById(id);

    if (!usuario) {
      throw new UsuarioNotFoundError();
    }

    return this.usuarioRepository.deactivate(id);
  }
}