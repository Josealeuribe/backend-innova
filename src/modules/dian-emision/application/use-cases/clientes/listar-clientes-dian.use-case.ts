import {
  ClienteDianRepository,
  ListClientesDianQuery,
} from '../../../domain/repositories/cliente-dian.repository';

export class ListarClientesDianUseCase {
  constructor(private readonly clienteDianRepository: ClienteDianRepository) {}

  execute(query: ListClientesDianQuery) {
    return this.clienteDianRepository.findMany(query);
  }
}
