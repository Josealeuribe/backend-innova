import { Inject, Injectable } from '@nestjs/common';

import { MaquinaRepository } from '../../domain/repositories/maquina.repository';
import { MaquinaNotFoundError } from '../../errors/maquina.errors';
import { MAQUINA_REPOSITORY } from '../../maquinas.tokens';
import { MaquinaEntity } from '../../domain/entities/maquia.entity';
import { PrismaMaquinaRepository } from '../../infraestructure/persistence/prisma-maquina.repository';

@Injectable()
export class EliminarMaquinaUseCase {
    constructor(
        @Inject(MAQUINA_REPOSITORY)
        private readonly maquinaRepository: PrismaMaquinaRepository,
    ) { }

    async execute(
        idMaquina: number,
    ): Promise<MaquinaEntity> {
        const current =
            await this.maquinaRepository.findById(
                idMaquina,
            );

        if (!current) {
            throw new MaquinaNotFoundError(idMaquina);
        }

        if (current.estado === 'INACTIVO') {
            return current;
        }

        return this.maquinaRepository.deactivate(
            idMaquina,
        );
    }
}
