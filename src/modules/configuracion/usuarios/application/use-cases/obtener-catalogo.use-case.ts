import {
  UsuarioCatalogos,
  UsuarioRepository,
} from '../../domain/repositories/usuario.repository';

export class ObtenerCatalogosUsuarioUseCase {
  constructor(
    private readonly usuarioRepository:
      UsuarioRepository,
  ) {}

  execute(): Promise<UsuarioCatalogos> {
    return this.usuarioRepository.getCatalogos();
  }
}