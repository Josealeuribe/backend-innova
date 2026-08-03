import {
  CrearReglaMapeoPucData,
  ReglaMapeoPucRepository,
} from '../../../domain/repositories/regla-mapeo-puc.repository';

export class CrearReglaMapeoPucUseCase {
  constructor(
    private readonly reglaMapeoPucRepository: ReglaMapeoPucRepository,
  ) {}

  execute(data: CrearReglaMapeoPucData) {
    return this.reglaMapeoPucRepository.create({
      ...data,
      nombre: data.nombre.trim(),
      concepto: data.concepto.trim(),
      cuentaPuc: data.cuentaPuc.trim(),
    });
  }
}
