import { CasinoRepository } from '../../domain/repositories/casino.repository';
import { CasinoNotFoundError } from '../errors/casino.errors';

export class EliminarCasinoUseCase {
  constructor(
    private readonly casinoRepository:
      CasinoRepository,
  ) {}

  async execute(idCasino: number) {
    const casino =
      await this.casinoRepository.findById(
        idCasino,
      );

    if (!casino) {
      throw new CasinoNotFoundError();
    }

    return this.casinoRepository.deactivate(
      idCasino,
    );
  }
}