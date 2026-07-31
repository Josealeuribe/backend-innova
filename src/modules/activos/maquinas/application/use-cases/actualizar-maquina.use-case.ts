import { Inject, Injectable } from '@nestjs/common';

import { MaquinaRulesService } from '../services/maquina-rules-service';

import {
    MaquinaRepository,
    UpdateMaquinaData,
} from '../../domain/repositories/maquina.repository';
import { MaquinaNotFoundError } from '../../errors/maquina.errors';
import { ActualizarMaquinaDto } from '../../presentation/dto/maquina.dto';
import { MAQUINA_REPOSITORY } from '../../maquinas.tokens';
import { MaquinaEntity } from '../../domain/entities/maquia.entity';
import { PrismaMaquinaRepository } from '../../infraestructure/persistence/prisma-maquina.repository';

@Injectable()
export class ActualizarMaquinaUseCase {
    constructor(
        @Inject(MAQUINA_REPOSITORY)
        private readonly maquinaRepository: PrismaMaquinaRepository,
        private readonly maquinaRulesService: MaquinaRulesService,
    ) { }

    async execute(
        idMaquina: number,
        dto: ActualizarMaquinaDto,
    ): Promise<MaquinaEntity> {
        const current =
            await this.maquinaRepository.findById(
                idMaquina,
            );

        if (!current) {
            throw new MaquinaNotFoundError(idMaquina);
        }

        const data: UpdateMaquinaData = {
            idInventario: dto.idInventario,
            idCasino: dto.idCasino,
            idPais: dto.idPais,
            idTipoMaquina: dto.idTipoMaquina,
            serial:
                dto.serial === undefined
                    ? undefined
                    : dto.serial.trim(),
            numeroInterno:
                dto.numeroInterno === undefined
                    ? undefined
                    : dto.numeroInterno.trim(),
            nuc:
                dto.nuc === undefined
                    ? undefined
                    : dto.nuc.trim(),
            nuid:
                dto.nuid === undefined
                    ? undefined
                    : dto.nuid.trim(),
            marca:
                dto.marca === undefined
                    ? undefined
                    : dto.marca.trim(),
            modelo:
                dto.modelo === undefined
                    ? undefined
                    : dto.modelo.trim(),
            fechaFabricacion:
                dto.fechaFabricacion === undefined
                    ? undefined
                    : this.toDateOnly(
                        dto.fechaFabricacion,
                    ),
            frecuenciaMantenimiento:
                dto.frecuenciaMantenimiento,
            ultimoMantenimiento:
                dto.ultimoMantenimiento === undefined
                    ? undefined
                    : dto.ultimoMantenimiento === null
                        ? null
                        : this.toDateOnly(
                            dto.ultimoMantenimiento,
                        ),
            imgDocumentoLegal:
                dto.imgDocumentoLegal === undefined
                    ? undefined
                    : dto.imgDocumentoLegal?.trim() || null,
            estado: dto.estado,
        };

        await this.maquinaRulesService.validateForUpdate(
            idMaquina,
            current,
            data,
        );

        return this.maquinaRepository.update(
            idMaquina,
            data,
        );
    }

    private toDateOnly(value: string): Date {
        return new Date(`${value}T00:00:00.000Z`);
    }
}
