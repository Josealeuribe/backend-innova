import { Inject, Injectable } from '@nestjs/common';

import type { MaquinaRepository } from '../../domain/repositories/maquina.repository';

import { MAQUINA_REPOSITORY } from '../../maquinas.tokens';
import { ListarMaquinasQueryDto } from '../../presentation/dto/listar-maquina-query.dto';

@Injectable()
export class ListarMaquinaUseCase {
    constructor(
        @Inject(MAQUINA_REPOSITORY)
        private readonly maquinaRepository: MaquinaRepository,
    ) { }

    async execute(query: ListarMaquinasQueryDto) {
        const page = Number(query.page ?? 1);
        const limit = Number(query.limit ?? 10);

        const result =
            await this.maquinaRepository.findMany({
                page,
                limit,
                buscar: query.buscar?.trim() || undefined,
                estado: query.estado,
                idCasino: query.idCasino,
                idPais: query.idPais,
                idTipoMaquina: query.idTipoMaquina,
                idInventario: query.idInventario,
            });

        return {
            maquinas: result.maquinas,
            meta: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(
                    result.total / limit,
                ),
            },
        };
    }
}
