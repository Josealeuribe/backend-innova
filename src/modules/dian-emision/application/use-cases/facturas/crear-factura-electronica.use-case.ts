import { ClienteDianRepository } from '../../../domain/repositories/cliente-dian.repository';
import { FacturaElectronicaRepository } from '../../../domain/repositories/factura-electronica.repository';
import { RazonSocialDianRepository } from '../../../domain/repositories/razon-social-dian.repository';
import {
  ClienteDianNotFoundError,
  FacturaElectronicaSinItemsError,
  RazonSocialDianNotFoundError,
  RazonSocialSinCredencialesDianError,
} from '../../errors/dian-emision.errors';
import {
  FacturaElectronicaCalculoService,
  ItemFacturaInput,
} from '../../services/factura-electronica-calculo.service';
import { CufeCalculatorService } from '../../services/cufe-calculator.service';
import { SoftwareSecurityCodeService } from '../../services/software-security-code.service';
import { UblXmlBuilderService } from '../../services/ubl-xml-builder.service';

export interface CrearFacturaElectronicaCommand {
  idRazonSocial: number;
  idClienteDian: number;
  idUsuario: number;
  /** '1' Producción, '2' Habilitación */
  entorno: string;
  items: ItemFacturaInput[];
}

function formatearFechaHoraBogota(fecha: Date) {
  const fechaTexto = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fecha);

  const horaTexto = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'America/Bogota',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(fecha);

  return { fecha: fechaTexto, hora: `${horaTexto}-05:00` };
}

export class CrearFacturaElectronicaUseCase {
  constructor(
    private readonly facturaElectronicaRepository: FacturaElectronicaRepository,
    private readonly clienteDianRepository: ClienteDianRepository,
    private readonly razonSocialDianRepository: RazonSocialDianRepository,
    private readonly calculoService: FacturaElectronicaCalculoService,
    private readonly cufeCalculatorService: CufeCalculatorService,
    private readonly softwareSecurityCodeService: SoftwareSecurityCodeService,
    private readonly ublXmlBuilderService: UblXmlBuilderService,
  ) {}

  async execute(command: CrearFacturaElectronicaCommand) {
    if (!command.items.length) {
      throw new FacturaElectronicaSinItemsError();
    }

    const cliente = await this.clienteDianRepository.findById(
      command.idClienteDian,
    );

    if (!cliente) {
      throw new ClienteDianNotFoundError();
    }

    const razonSocial = await this.razonSocialDianRepository.findById(
      command.idRazonSocial,
    );

    if (!razonSocial) {
      throw new RazonSocialDianNotFoundError();
    }

    if (!razonSocial.softwareId || !razonSocial.softwarePin) {
      throw new RazonSocialSinCredencialesDianError();
    }

    const itemsCalculados = this.calculoService.calcularItems(command.items);
    const totales =
      this.calculoService.calcularTotalesFactura(itemsCalculados);

    return this.facturaElectronicaRepository.crearFacturaElectronica({
      idRazonSocial: command.idRazonSocial,
      idClienteDian: command.idClienteDian,
      idUsuario: command.idUsuario,
      entorno: command.entorno,
      items: itemsCalculados,
      construirDocumento: ({ resolucion, consecutivo, fechaEmision }) => {
        const consecutivoCompleto = `${resolucion.prefijo}${consecutivo}`;
        const { fecha, hora } = formatearFechaHoraBogota(fechaEmision);

        const claveTecnica =
          razonSocial.claveTecnica ?? resolucion.claveTecnica;

        const softwareSecurityCode = this.softwareSecurityCodeService.calcular(
          razonSocial.softwareId,
          razonSocial.softwarePin,
          consecutivoCompleto,
        );

        const { cufe } = this.cufeCalculatorService.calcularFactura({
          numDoc: consecutivoCompleto,
          fechaGen: fecha,
          horaGen: hora,
          valDs: totales.subtotal,
          codImp1: '01',
          valImp1: totales.iva,
          codImp2: '04',
          valImp2: totales.incConsumo,
          codImp3: '03',
          valImp3: totales.ica,
          valTot: totales.total,
          nitEmisor: razonSocial.nit,
          numAdq: cliente.numeroDocumento,
          authString: claveTecnica,
          tipoAmbiente: command.entorno,
        });

        const qrcodeData = `https://catalogo-vpfe${command.entorno === '2' ? '-hab' : ''}.dian.gov.co/document/searchqr?documentkey=${cufe}`;

        const xmlContent = this.ublXmlBuilderService.construirFacturaVenta({
          razonSocial,
          cliente,
          resolucion,
          consecutivoCompleto,
          fecha,
          hora,
          cufe,
          softwareSecurityCode,
          entorno: command.entorno,
          items: itemsCalculados,
          totales,
        });

        return {
          cufe,
          qrcodeData,
          xmlContent,
          nombreArchivoXml: `${consecutivoCompleto}.xml`,
          ...totales,
        };
      },
    });
  }
}
