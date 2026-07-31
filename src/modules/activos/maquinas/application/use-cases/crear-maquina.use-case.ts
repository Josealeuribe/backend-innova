import { Inject, Injectable } from '@nestjs/common';

import { MaquinaRulesService } from '../services/maquina-rules-service';

import { MaquinaRepository } from '../../domain/repositories/maquina.repository';
import { CrearMaquinaDto } from '../../presentation/dto/maquina.dto';
import { MAQUINA_REPOSITORY } from '../../maquinas.tokens';
import { MaquinaEntity } from '../../domain/entities/maquia.entity';
import { PrismaMaquinaRepository } from '../../infraestructure/persistence/prisma-maquina.repository';

@Injectable()
export class CrearMaquinaUseCase {
    constructor(
        @Inject(MAQUINA_REPOSITORY)
        private readonly maquinaRepository: PrismaMaquinaRepository,
        private readonly maquinaRulesService: MaquinaRulesService,
    ) { }

    async execute(
        dto: CrearMaquinaDto,
    ): Promise<MaquinaEntity> {
        const data = {
            idInventario: dto.idInventario,
            idCasino: dto.idCasino,
            idPais: dto.idPais,
            idTipoMaquina: dto.idTipoMaquina,
            serial: dto.serial.trim(),
            numeroInterno: dto.numeroInterno.trim(),
            nuc: dto.nuc.trim(),
            nuid: dto.nuid.trim(),
            marca: dto.marca.trim(),
            modelo: dto.modelo.trim(),
            fechaFabricacion: this.toDateOnly(
                dto.fechaFabricacion,
            ),
            frecuenciaMantenimiento:
                dto.frecuenciaMantenimiento,
            ultimoMantenimiento:
                dto.ultimoMantenimiento
                    ? this.toDateOnly(
                        dto.ultimoMantenimiento,
                    )
                    : null,
            imgDocumentoLegal:
                dto.imgDocumentoLegal?.trim() || null,
            estado: dto.estado ?? 'ACTIVO',
        } as const;

        await this.maquinaRulesService.validateForCreate(
            data,
        );

        return this.maquinaRepository.create(data);
    }

    private toDateOnly(value: string): Date {
        return new Date(`${value}T00:00:00.000Z`);
    }
}
