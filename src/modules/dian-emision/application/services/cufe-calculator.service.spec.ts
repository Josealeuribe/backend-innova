import { CufeCalculatorService } from './cufe-calculator.service';

describe('CufeCalculatorService', () => {
  it('calcula el mismo CUFE que el algoritmo Python de referencia (ges-innova/app/services/dian/utils.py::generate_dian_code)', () => {
    const service = new CufeCalculatorService();

    const { cadena, cufe } = service.calcularFactura({
      numDoc: 'FEV1',
      fechaGen: '2026-08-03',
      horaGen: '10:15:30-05:00',
      valDs: '100000.00',
      codImp1: '01',
      valImp1: '19000.00',
      codImp2: '04',
      valImp2: null,
      codImp3: '03',
      valImp3: null,
      valTot: '119000.00',
      // Con guion a propósito: debe limpiarse igual que split_nit()
      // (base sin DV), NO con un simple replace de dígitos.
      nitEmisor: '900123456-7',
      numAdq: '1234567890',
      authString: 'abc123clavetecnica',
      tipoAmbiente: '2',
    });

    // Vector de referencia: obtenido ejecutando
    // ges-innova/app/services/dian/utils.py::generate_dian_code() con los
    // mismos parámetros (nit_emisor ya pre-dividido vía split_nit, como
    // hace app/services/dian/builder.py). Ver conversación de migración
    // para el script usado — si este test falla, la cadena/hash dejó de
    // coincidir con la implementación Python y NO debe ignorarse.
    expect(cadena).toBe(
      'FEV12026-08-0310:15:30-05:00100000.000119000.00040.00030.00119000.009001234561234567890abc123clavetecnica2',
    );

    expect(cufe).toBe(
      'e3be92a4a07bc44285d7ee9e0def33c0ebc26ad3062f7a92c86d82b28c35a903ee08a100cf1edaaa86109acd76338307',
    );
  });

  it('produce un hash SHA-384 en hexadecimal de 96 caracteres', () => {
    const service = new CufeCalculatorService();

    const { cufe } = service.calcularFactura({
      numDoc: 'FEV2',
      fechaGen: '2026-08-03',
      horaGen: '08:00:00-05:00',
      valDs: 1000,
      valTot: 1190,
      valImp1: 190,
      nitEmisor: '900999999-1',
      numAdq: '111',
      authString: 'clave',
      tipoAmbiente: '1',
    });

    expect(cufe).toMatch(/^[0-9a-f]{96}$/);
  });
});
