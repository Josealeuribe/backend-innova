import { ClienteDianRepository } from '../../../domain/repositories/cliente-dian.repository';
import { ClienteDianDocumentoExistenteError } from '../../errors/dian-emision.errors';

export interface CrearClienteDianCommand {
  nombre: string;
  tipoDocumento?: string;
  numeroDocumento: string;
  direccion?: string;
  ciudad?: string;
  departamento?: string;
  telefono?: string;
  email?: string;
  tipoPersona?: string;
  responsabilidadFiscal?: string;
}

export class CrearClienteDianUseCase {
  constructor(private readonly clienteDianRepository: ClienteDianRepository) {}

  async execute(command: CrearClienteDianCommand) {
    const numeroDocumento = command.numeroDocumento.trim();

    const existente =
      await this.clienteDianRepository.findByNumeroDocumento(
        numeroDocumento,
      );

    if (existente) {
      throw new ClienteDianDocumentoExistenteError();
    }

    return this.clienteDianRepository.create({
      ...command,
      nombre: command.nombre.trim(),
      numeroDocumento,
    });
  }
}
