export interface NitPartes {
  nit: string;
  dv: string;
}

/**
 * Puerto fiel de `split_nit` de `ges-innova/app/services/dian/utils.py:7-29`.
 * Separa un NIT colombiano (con o sin guion) en su base y dígito de
 * verificación. Usado por el CUFE y el XML UBL — NO simplificar a un
 * simple `replace(/\D/g, '')`, eso concatenaría el DV dentro del NIT base.
 */
export function splitNit(nitStr: string): NitPartes {
  const raw = (nitStr ?? '').trim();

  if (raw.includes('-')) {
    const [primera, segunda = ''] = raw.split('-');

    return {
      nit: primera.replace(/\D/g, ''),
      dv: segunda.replace(/\D/g, ''),
    };
  }

  const nitClean = raw.replace(/\D/g, '');

  if (!nitClean) {
    return { nit: '0', dv: '0' };
  }

  if (nitClean.length === 10 && (nitClean[0] === '8' || nitClean[0] === '9')) {
    return { nit: nitClean.slice(0, 9), dv: nitClean.slice(9) };
  }

  return { nit: nitClean, dv: calcularDv(nitClean) };
}

/**
 * Puerto fiel de `calcular_dv` de `ges-innova/app/services/dian/utils.py:31-45`
 * — dígito de verificación de NIT colombiano (módulo 11).
 */
export function calcularDv(nit: string): string {
  const digits = (nit ?? '').replace(/\D/g, '');

  if (!digits) {
    return '0';
  }

  const pesos = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  const padded = digits.padStart(15, '0');
  const pesosInvertidos = [...pesos].reverse();

  let total = 0;
  for (let i = 0; i < padded.length; i++) {
    total += Number(padded[i]) * pesosInvertidos[i];
  }

  const residuo = total % 11;

  if (residuo === 0) return '0';
  if (residuo === 1) return '1';
  return String(11 - residuo);
}
