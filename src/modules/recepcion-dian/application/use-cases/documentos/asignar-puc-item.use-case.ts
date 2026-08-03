import { NaturalezaContable } from '../../../domain/entities/documento-recibido.entity';
import { DocumentoRecibidoRepository } from '../../../domain/repositories/documento-recibido.repository';
import { ReglaMapeoPucRepository } from '../../../domain/repositories/regla-mapeo-puc.repository';
import {
  AsignacionPucInvalidaError,
  ReglaMapeoPucNotFoundError,
} from '../../errors/recepcion-dian.errors';

export interface AsignarPucItemCommand {
  idDocumentoRecibido: number;
  idItemCompraRecibido: number;
  idReglaMapeoPuc?: number;
  cuentaPuc?: string;
  nombreCuentaPuc?: string;
  centroCostos?: string;
  nombreCentroCostos?: string;
  naturaleza?: NaturalezaContable;
}

export class AsignarPucItemUseCase {
  constructor(
    private readonly documentoRecibidoRepository: DocumentoRecibidoRepository,
    private readonly reglaMapeoPucRepository: ReglaMapeoPucRepository,
  ) {}

  async execute(command: AsignarPucItemCommand) {
    if (command.idReglaMapeoPuc) {
      const regla = await this.reglaMapeoPucRepository.findById(
        command.idReglaMapeoPuc,
      );

      if (!regla) {
        throw new ReglaMapeoPucNotFoundError();
      }

      return this.documentoRecibidoRepository.asignarPucItem(
        command.idDocumentoRecibido,
        command.idItemCompraRecibido,
        {
          cuentaPuc: regla.cuentaPuc,
          nombreCuentaPuc: regla.nombreCuentaPuc,
          centroCostos: regla.centroCostos,
          naturaleza: regla.naturaleza,
          idReglaAplicada: regla.idReglaMapeoPuc,
        },
      );
    }

    if (!command.cuentaPuc || !command.naturaleza) {
      throw new AsignacionPucInvalidaError();
    }

    return this.documentoRecibidoRepository.asignarPucItem(
      command.idDocumentoRecibido,
      command.idItemCompraRecibido,
      {
        cuentaPuc: command.cuentaPuc,
        nombreCuentaPuc: command.nombreCuentaPuc,
        centroCostos: command.centroCostos,
        nombreCentroCostos: command.nombreCentroCostos,
        naturaleza: command.naturaleza,
        idReglaAplicada: null,
      },
    );
  }
}
