import { ClienteDianRepository } from '../../../domain/repositories/cliente-dian.repository';
import { ClienteDianNotFoundError } from '../../errors/dian-emision.errors';

export class ObtenerClienteDianUseCase {
  constructor(private readonly clienteDianRepository: ClienteDianRepository) {}

  async execute(idClienteDian: number) {
    const cliente = await this.clienteDianRepository.findById(idClienteDian);

    if (!cliente) {
      throw new ClienteDianNotFoundError();
    }

    return cliente;
  }
}
