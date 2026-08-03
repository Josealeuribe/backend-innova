import {
  ClienteDianRepository,
  UpdateClienteDianData,
} from '../../../domain/repositories/cliente-dian.repository';
import { ClienteDianNotFoundError } from '../../errors/dian-emision.errors';

export class ActualizarClienteDianUseCase {
  constructor(private readonly clienteDianRepository: ClienteDianRepository) {}

  async execute(idClienteDian: number, data: UpdateClienteDianData) {
    const existente =
      await this.clienteDianRepository.findById(idClienteDian);

    if (!existente) {
      throw new ClienteDianNotFoundError();
    }

    return this.clienteDianRepository.update(idClienteDian, data);
  }
}
