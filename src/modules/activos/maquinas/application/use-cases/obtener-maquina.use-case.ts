import { Inject, Injectable } from '@nestjs/common';


import { MaquinaRepository } from '../../domain/repositories/maquina.repository';
import { MaquinaNotFoundError } from '../../errors/maquina.errors';
import { MAQUINA_REPOSITORY } from '../../maquinas.tokens';
import { MaquinaEntity } from '../../domain/entities/maquia.entity';
import { PrismaMaquinaRepository } from '../../infraestructure/persistence/prisma-maquina.repository';

@Injectable()
export class ObtenerMaquinaUseCase {
    constructor(
        @Inject(MAQUINA_REPOSITORY)
        private readonly maquinaRepository: PrismaMaquinaRepository,
    ) { }

    async execute(
        idMaquina: number,
    ): Promise<MaquinaEntity> {
        const maquina =
            await this.maquinaRepository.findById(
                idMaquina,
            );

        if (!maquina) {
            throw new MaquinaNotFoundError(idMaquina);
        }

        return maquina;
    }
}
