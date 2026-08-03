import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';

/**
 * Puerto fiel de `generate_software_security_code` de
 * `ges-innova/app/services/dian/utils.py:213-222`.
 */
@Injectable()
export class SoftwareSecurityCodeService {
  calcular(
    softwareId: string | null | undefined,
    pin: string | null | undefined,
    invoiceIdent = '',
  ): string {
    const softId = (softwareId ?? '').trim();
    const pPin = (pin ?? '').trim();
    const raw = `${softId}${pPin}${invoiceIdent}`;

    return createHash('sha384').update(raw, 'utf8').digest('hex').toLowerCase();
  }
}
