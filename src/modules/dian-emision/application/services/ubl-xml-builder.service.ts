import { Injectable } from '@nestjs/common';
import Decimal from 'decimal.js';
import { create } from 'xmlbuilder2';

import { ClienteDianEntity } from '../../domain/entities/cliente-dian.entity';
import { RazonSocialDianEntity } from '../../domain/entities/razon-social-dian.entity';
import { ResolucionDianEntity } from '../../domain/entities/resolucion-dian.entity';
import { CrearFacturaElectronicaItemData } from '../../domain/repositories/factura-electronica.repository';
import { splitNit } from './nit.util';

const NS = {
  inv: 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
  cac: 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
  cbc: 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
  ext: 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2',
  sts: 'dian:gov:co:facturaelectronica:Structures-2-1',
  xsi: 'http://www.w3.org/2001/XMLSchema-instance',
};

const SCHEMA_LOCATION =
  'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2 http://docs.oasis-open.org/ubl/os-UBL-2.1/xsd/maindoc/UBL-Invoice-2.1.xsd';

function fmt2(valor: number | string): string {
  return new Decimal(valor).toFixed(2, Decimal.ROUND_HALF_UP);
}

export interface ConstruirFacturaVentaParams {
  razonSocial: RazonSocialDianEntity;
  cliente: ClienteDianEntity;
  resolucion: ResolucionDianEntity;
  consecutivoCompleto: string;
  fecha: string;
  hora: string;
  cufe: string;
  softwareSecurityCode: string;
  entorno: string;
  items: CrearFacturaElectronicaItemData[];
  totales: {
    subtotal: number;
    iva: number;
    incConsumo: number;
    ica: number;
    total: number;
  };
}

/**
 * Puerto de `XMLBuilder.build_invoice_xml(doc_type='01')` de
 * `ges-innova/app/services/dian/builder.py` — construye el XML UBL 2.1 de
 * una Factura Electrónica de Venta. Fase 1: el documento se genera y
 * almacena para previsualización/descarga, pero NO se firma ni se envía a
 * la DIAN todavía (eso corresponde a la Fase 2).
 */
@Injectable()
export class UblXmlBuilderService {
  construirFacturaVenta(params: ConstruirFacturaVentaParams): string {
    const { razonSocial, cliente, items, totales } = params;

    const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele(
      NS.inv,
      'Invoice',
    );
    doc.att(`xmlns:cac`, NS.cac);
    doc.att(`xmlns:cbc`, NS.cbc);
    doc.att(`xmlns:ext`, NS.ext);
    doc.att(`xmlns:sts`, NS.sts);
    doc.att(`xmlns:xsi`, NS.xsi);
    doc.att(`xsi:schemaLocation`, SCHEMA_LOCATION);

    this.addDianExtensions(doc, params);

    doc.ele(NS.cbc, 'cbc:UBLVersionID').txt('UBL 2.1').up();
    doc.ele(NS.cbc, 'cbc:CustomizationID').txt('10').up();

    doc
      .ele(NS.cbc, 'cbc:ProfileID')
      .txt('DIAN 2.1: Factura Electrónica de Venta')
      .up();

    doc.ele(NS.cbc, 'cbc:ProfileExecutionID').txt(params.entorno).up();
    doc.ele(NS.cbc, 'cbc:ID').txt(params.consecutivoCompleto).up();

    doc
      .ele(NS.cbc, 'cbc:UUID')
      .att('schemeName', 'CUFE-SHA384')
      .att('schemeID', params.entorno)
      .txt(params.cufe)
      .up();

    doc.ele(NS.cbc, 'cbc:IssueDate').txt(params.fecha).up();
    doc.ele(NS.cbc, 'cbc:IssueTime').txt(params.hora).up();
    doc.ele(NS.cbc, 'cbc:DueDate').txt(params.fecha).up();
    doc.ele(NS.cbc, 'cbc:InvoiceTypeCode').txt('01').up();
    doc.ele(NS.cbc, 'cbc:Note').txt('Factura Electrónica de Venta').up();
    doc.ele(NS.cbc, 'cbc:DocumentCurrencyCode').txt('COP').up();
    doc.ele(NS.cbc, 'cbc:LineCountNumeric').txt(String(items.length)).up();

    this.addSupplier(doc, razonSocial, params.resolucion.prefijo);
    this.addCustomer(doc, cliente);

    const payment = doc.ele(NS.cac, 'cac:PaymentMeans');
    payment.ele(NS.cbc, 'cbc:ID').txt('2').up();
    payment.ele(NS.cbc, 'cbc:PaymentMeansCode').txt('10').up();
    payment.ele(NS.cbc, 'cbc:PaymentDueDate').txt(params.fecha).up();
    payment.ele(NS.cbc, 'cbc:PaymentID').txt('Contado').up();
    payment.up();

    this.addTotals(doc, totales);

    items.forEach((item, index) => {
      this.addInvoiceLine(doc, item, index + 1);
    });

    return doc.end({ prettyPrint: true });
  }

  private addDianExtensions(
    doc: ReturnType<typeof create>,
    params: ConstruirFacturaVentaParams,
  ): void {
    const { razonSocial } = params;

    const extensions = doc.ele(NS.ext, 'ext:UBLExtensions');
    const extension = extensions.ele(NS.ext, 'ext:UBLExtension');
    const content = extension.ele(NS.ext, 'ext:ExtensionContent');
    const dianExt = content.ele(NS.sts, 'sts:DianExtensions');

    const invoiceSource = dianExt.ele(NS.sts, 'sts:InvoiceSource');
    invoiceSource
      .ele(NS.cbc, 'cbc:IdentificationCode')
      .att('listAgencyID', '6')
      .att(
        'listAgencyName',
        'United Nations Economic Commission for Europe',
      )
      .att(
        'listSchemeURI',
        'urn:oasis:names:specification:ubl:codelist:gc:CountryIdentificationCode-2.1',
      )
      .txt('CO')
      .up();
    invoiceSource.up();

    const softwareProvider = dianExt.ele(NS.sts, 'sts:SoftwareProvider');
    const { nit: nitEmisor, dv: dvEmisor } = splitNit(razonSocial.nit);

    softwareProvider
      .ele(NS.sts, 'sts:ProviderID')
      .att('schemeID', dvEmisor || '1')
      .att('schemeName', '31')
      .att('schemeAgencyID', '195')
      .att(
        'schemeAgencyName',
        'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
      )
      .txt(nitEmisor)
      .up();

    softwareProvider
      .ele(NS.sts, 'sts:SoftwareID')
      .att('schemeAgencyID', '195')
      .att(
        'schemeAgencyName',
        'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
      )
      .txt(razonSocial.softwareId ?? '')
      .up();
    softwareProvider.up();

    dianExt
      .ele(NS.sts, 'sts:SoftwareSecurityCode')
      .att('schemeAgencyID', '195')
      .att(
        'schemeAgencyName',
        'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
      )
      .txt(params.softwareSecurityCode)
      .up();

    const authProvider = dianExt.ele(NS.sts, 'sts:AuthorizationProvider');
    authProvider
      .ele(NS.sts, 'sts:AuthorizationProviderID')
      .att('schemeID', '4')
      .att('schemeName', '31')
      .att('schemeAgencyID', '195')
      .att(
        'schemeAgencyName',
        'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
      )
      .txt('800197268')
      .up();
    authProvider.up();

    const qrUrl = `https://catalogo-vpfe${params.entorno === '2' ? '-hab' : ''}.dian.gov.co/document/searchqr?documentkey=${params.cufe}`;

    const qrText = [
      `NumFac: ${params.consecutivoCompleto}`,
      `FecFac: ${params.fecha}`,
      `HorFac: ${params.hora}`,
      `NitFac: ${nitEmisor}`,
      `DocAdq: ${params.cliente.numeroDocumento}`,
      `ValFac: ${fmt2(params.totales.subtotal)}`,
      `ValIva: ${fmt2(params.totales.iva)}`,
      `ValOtroIm: 0.00`,
      `ValTot: ${fmt2(params.totales.total)}`,
      `CUFE: ${params.cufe}`,
      qrUrl,
    ].join('\n');

    dianExt.ele(NS.sts, 'sts:QRCode').txt(qrText).up();
    dianExt.up();
    content.up();
    extension.up();

    // Segundo UBLExtension reservado para la firma XAdES (Fase 2).
    extensions
      .ele(NS.ext, 'ext:UBLExtension')
      .ele(NS.ext, 'ext:ExtensionContent')
      .up()
      .up();

    extensions.up();
  }

  private addSupplier(
    doc: ReturnType<typeof create>,
    razonSocial: RazonSocialDianEntity,
    prefijoResolucion: string,
  ): void {
    const supplierParty = doc.ele(NS.cac, 'cac:AccountingSupplierParty');
    supplierParty
      .ele(NS.cbc, 'cbc:AdditionalAccountID')
      .txt(razonSocial.tipoPersonaCodigo || '1')
      .up();

    const party = supplierParty.ele(NS.cac, 'cac:Party');
    const { nit: nitEmisor, dv: dvEmisor } = splitNit(razonSocial.nit);
    const schemeIdEmisor = dvEmisor || '1';

    party
      .ele(NS.cac, 'cac:PartyIdentification')
      .ele(NS.cbc, 'cbc:ID')
      .att('schemeID', schemeIdEmisor)
      .att('schemeName', '31')
      .txt(nitEmisor)
      .up()
      .up();

    party
      .ele(NS.cac, 'cac:PartyName')
      .ele(NS.cbc, 'cbc:Name')
      .txt(razonSocial.nombreRazonSocial)
      .up()
      .up();

    const address = party
      .ele(NS.cac, 'cac:PhysicalLocation')
      .ele(NS.cac, 'cac:Address');
    address.ele(NS.cbc, 'cbc:CityName').txt(razonSocial.ciudad).up();
    address
      .ele(NS.cbc, 'cbc:PostalZone')
      .txt(razonSocial.codigoPostal ?? '')
      .up();
    address
      .ele(NS.cbc, 'cbc:CountrySubentity')
      .txt(razonSocial.departamento)
      .up();
    address
      .ele(NS.cac, 'cac:AddressLine')
      .ele(NS.cbc, 'cbc:Line')
      .txt(razonSocial.direccion)
      .up()
      .up();
    const country = address.ele(NS.cac, 'cac:Country');
    country.ele(NS.cbc, 'cbc:IdentificationCode').txt('CO').up();
    country
      .ele(NS.cbc, 'cbc:Name')
      .att('languageID', 'es')
      .txt(razonSocial.pais)
      .up();
    country.up();
    address.up();

    const taxScheme = party.ele(NS.cac, 'cac:PartyTaxScheme');
    taxScheme
      .ele(NS.cbc, 'cbc:RegistrationName')
      .txt(razonSocial.nombreRazonSocial)
      .up();
    taxScheme
      .ele(NS.cbc, 'cbc:CompanyID')
      .att('schemeID', schemeIdEmisor)
      .att('schemeName', '31')
      .att('schemeAgencyID', '195')
      .att(
        'schemeAgencyName',
        'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
      )
      .txt(nitEmisor)
      .up();
    taxScheme
      .ele(NS.cbc, 'cbc:TaxLevelCode')
      .txt(razonSocial.responsabilidadFiscal)
      .up();
    const scheme = taxScheme.ele(NS.cac, 'cac:TaxScheme');
    scheme.ele(NS.cbc, 'cbc:ID').txt('01').up();
    scheme.ele(NS.cbc, 'cbc:Name').txt('IVA').up();
    scheme.up();
    taxScheme.up();

    const legalEntity = party.ele(NS.cac, 'cac:PartyLegalEntity');
    legalEntity
      .ele(NS.cbc, 'cbc:RegistrationName')
      .txt(razonSocial.nombreRazonSocial)
      .up();
    legalEntity
      .ele(NS.cbc, 'cbc:CompanyID')
      .att('schemeID', schemeIdEmisor)
      .att('schemeName', '31')
      .att('schemeAgencyID', '195')
      .att(
        'schemeAgencyName',
        'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
      )
      .txt(nitEmisor)
      .up();

    legalEntity
      .ele(NS.cac, 'cac:CorporateRegistrationScheme')
      .ele(NS.cbc, 'cbc:ID')
      .txt(prefijoResolucion)
      .up()
      .up();
    legalEntity.up();

    const contact = party.ele(NS.cac, 'cac:Contact');
    contact.ele(NS.cbc, 'cbc:Name').txt(razonSocial.nombreRazonSocial).up();
    contact.ele(NS.cbc, 'cbc:ElectronicMail').txt(razonSocial.correo).up();
    contact.up();

    party.up();
    supplierParty.up();
  }

  private addCustomer(
    doc: ReturnType<typeof create>,
    cliente: ClienteDianEntity,
  ): void {
    const customerParty = doc.ele(NS.cac, 'cac:AccountingCustomerParty');
    customerParty
      .ele(NS.cbc, 'cbc:AdditionalAccountID')
      .txt(cliente.tipoPersona || '1')
      .up();

    const party = customerParty.ele(NS.cac, 'cac:Party');
    const numeroDocumento = cliente.numeroDocumento.replace(/\D/g, '');
    const schemeIdAttr = cliente.tipoDocumento === '13' ? '1' : '31';

    party
      .ele(NS.cac, 'cac:PartyIdentification')
      .ele(NS.cbc, 'cbc:ID')
      .att('schemeID', schemeIdAttr)
      .att('schemeName', cliente.tipoDocumento)
      .txt(numeroDocumento)
      .up()
      .up();

    party
      .ele(NS.cac, 'cac:PartyName')
      .ele(NS.cbc, 'cbc:Name')
      .txt(cliente.nombre)
      .up()
      .up();

    const address = party
      .ele(NS.cac, 'cac:PhysicalLocation')
      .ele(NS.cac, 'cac:Address');
    address.ele(NS.cbc, 'cbc:CityName').txt(cliente.ciudad ?? '').up();
    address
      .ele(NS.cbc, 'cbc:CountrySubentity')
      .txt(cliente.departamento ?? '')
      .up();
    address
      .ele(NS.cac, 'cac:AddressLine')
      .ele(NS.cbc, 'cbc:Line')
      .txt(cliente.direccion ?? '')
      .up()
      .up();
    const country = address.ele(NS.cac, 'cac:Country');
    country.ele(NS.cbc, 'cbc:IdentificationCode').txt('CO').up();
    country.ele(NS.cbc, 'cbc:Name').att('languageID', 'es').txt('Colombia').up();
    country.up();
    address.up();

    const taxScheme = party.ele(NS.cac, 'cac:PartyTaxScheme');
    taxScheme.ele(NS.cbc, 'cbc:RegistrationName').txt(cliente.nombre).up();
    taxScheme
      .ele(NS.cbc, 'cbc:CompanyID')
      .att('schemeID', schemeIdAttr)
      .att('schemeName', cliente.tipoDocumento)
      .att('schemeAgencyID', '195')
      .att(
        'schemeAgencyName',
        'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
      )
      .txt(numeroDocumento)
      .up();
    taxScheme
      .ele(NS.cbc, 'cbc:TaxLevelCode')
      .txt(cliente.responsabilidadFiscal)
      .up();
    const scheme = taxScheme.ele(NS.cac, 'cac:TaxScheme');
    scheme.ele(NS.cbc, 'cbc:ID').txt('01').up();
    scheme.ele(NS.cbc, 'cbc:Name').txt('IVA').up();
    scheme.up();
    taxScheme.up();

    const legalEntity = party.ele(NS.cac, 'cac:PartyLegalEntity');
    legalEntity.ele(NS.cbc, 'cbc:RegistrationName').txt(cliente.nombre).up();
    legalEntity
      .ele(NS.cbc, 'cbc:CompanyID')
      .att('schemeID', schemeIdAttr)
      .att('schemeName', cliente.tipoDocumento)
      .att('schemeAgencyID', '195')
      .att(
        'schemeAgencyName',
        'CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)',
      )
      .txt(numeroDocumento)
      .up();
    legalEntity.up();

    const contact = party.ele(NS.cac, 'cac:Contact');
    contact.ele(NS.cbc, 'cbc:Name').txt(cliente.nombre).up();
    contact
      .ele(NS.cbc, 'cbc:ElectronicMail')
      .txt(cliente.email ?? '')
      .up();
    contact.up();

    party.up();
    customerParty.up();
  }

  private addTotals(
    doc: ReturnType<typeof create>,
    totales: ConstruirFacturaVentaParams['totales'],
  ): void {
    const ivaTaxTotal = doc.ele(NS.cac, 'cac:TaxTotal');
    ivaTaxTotal
      .ele(NS.cbc, 'cbc:TaxAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(totales.iva))
      .up();
    const ivaSubtotal = ivaTaxTotal.ele(NS.cac, 'cac:TaxSubtotal');
    ivaSubtotal
      .ele(NS.cbc, 'cbc:TaxableAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(totales.subtotal))
      .up();
    ivaSubtotal
      .ele(NS.cbc, 'cbc:TaxAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(totales.iva))
      .up();
    const ivaCategory = ivaSubtotal.ele(NS.cac, 'cac:TaxCategory');
    ivaCategory
      .ele(NS.cbc, 'cbc:Percent')
      .txt(totales.iva > 0 ? '19.00' : '0.00')
      .up();
    const ivaScheme = ivaCategory.ele(NS.cac, 'cac:TaxScheme');
    ivaScheme.ele(NS.cbc, 'cbc:ID').txt('01').up();
    ivaScheme.ele(NS.cbc, 'cbc:Name').txt('IVA').up();
    ivaScheme.up();
    ivaCategory.up();
    ivaSubtotal.up();
    ivaTaxTotal.up();

    if (totales.incConsumo > 0) {
      const incTaxTotal = doc.ele(NS.cac, 'cac:TaxTotal');
      incTaxTotal
        .ele(NS.cbc, 'cbc:TaxAmount')
        .att('currencyID', 'COP')
        .txt(fmt2(totales.incConsumo))
        .up();
      const incSubtotal = incTaxTotal.ele(NS.cac, 'cac:TaxSubtotal');
      incSubtotal
        .ele(NS.cbc, 'cbc:TaxableAmount')
        .att('currencyID', 'COP')
        .txt(fmt2(totales.subtotal))
        .up();
      incSubtotal
        .ele(NS.cbc, 'cbc:TaxAmount')
        .att('currencyID', 'COP')
        .txt(fmt2(totales.incConsumo))
        .up();
      const incCategory = incSubtotal.ele(NS.cac, 'cac:TaxCategory');
      incCategory.ele(NS.cbc, 'cbc:Percent').txt('0.00').up();
      const incScheme = incCategory.ele(NS.cac, 'cac:TaxScheme');
      incScheme.ele(NS.cbc, 'cbc:ID').txt('04').up();
      incScheme.ele(NS.cbc, 'cbc:Name').txt('INC').up();
      incScheme.up();
      incCategory.up();
      incSubtotal.up();
      incTaxTotal.up();
    }

    const legalTotal = doc.ele(NS.cac, 'cac:LegalMonetaryTotal');
    legalTotal
      .ele(NS.cbc, 'cbc:LineExtensionAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(totales.subtotal))
      .up();
    legalTotal
      .ele(NS.cbc, 'cbc:TaxExclusiveAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(totales.subtotal))
      .up();
    legalTotal
      .ele(NS.cbc, 'cbc:TaxInclusiveAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(totales.total))
      .up();
    legalTotal
      .ele(NS.cbc, 'cbc:AllowanceTotalAmount')
      .att('currencyID', 'COP')
      .txt('0.00')
      .up();
    legalTotal
      .ele(NS.cbc, 'cbc:ChargeTotalAmount')
      .att('currencyID', 'COP')
      .txt('0.00')
      .up();
    legalTotal
      .ele(NS.cbc, 'cbc:PayableAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(totales.total))
      .up();
    legalTotal.up();
  }

  private addInvoiceLine(
    doc: ReturnType<typeof create>,
    item: CrearFacturaElectronicaItemData,
    numeroLinea: number,
  ): void {
    const line = doc.ele(NS.cac, 'cac:InvoiceLine');
    line.ele(NS.cbc, 'cbc:ID').txt(String(numeroLinea)).up();
    line
      .ele(NS.cbc, 'cbc:InvoicedQuantity')
      .att('unitCode', '94')
      .txt(new Decimal(item.cantidad).toFixed(6))
      .up();
    line
      .ele(NS.cbc, 'cbc:LineExtensionAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(item.subtotal))
      .up();

    const porcentajeIva =
      item.subtotal > 0
        ? new Decimal(item.valorImpuesto1).div(item.subtotal).mul(100)
        : new Decimal(0);

    const taxTotal = line.ele(NS.cac, 'cac:TaxTotal');
    taxTotal
      .ele(NS.cbc, 'cbc:TaxAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(item.valorImpuesto1))
      .up();
    const taxSubtotal = taxTotal.ele(NS.cac, 'cac:TaxSubtotal');
    taxSubtotal
      .ele(NS.cbc, 'cbc:TaxableAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(item.subtotal))
      .up();
    taxSubtotal
      .ele(NS.cbc, 'cbc:TaxAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(item.valorImpuesto1))
      .up();
    const taxCategory = taxSubtotal.ele(NS.cac, 'cac:TaxCategory');
    taxCategory
      .ele(NS.cbc, 'cbc:Percent')
      .txt(porcentajeIva.toFixed(2, Decimal.ROUND_HALF_UP))
      .up();
    const taxScheme = taxCategory.ele(NS.cac, 'cac:TaxScheme');
    taxScheme.ele(NS.cbc, 'cbc:ID').txt(item.codigoImpuesto1).up();
    taxScheme.ele(NS.cbc, 'cbc:Name').txt('IVA').up();
    taxScheme.up();
    taxCategory.up();
    taxSubtotal.up();
    taxTotal.up();

    const itemEl = line.ele(NS.cac, 'cac:Item');
    itemEl.ele(NS.cbc, 'cbc:Description').txt(item.descripcion).up();
    const stdId = itemEl.ele(NS.cac, 'cac:StandardItemIdentification');
    stdId.ele(NS.cbc, 'cbc:ID').att('schemeID', '999').txt('GEN').up();
    stdId.up();
    itemEl.up();

    const price = line.ele(NS.cac, 'cac:Price');
    price
      .ele(NS.cbc, 'cbc:PriceAmount')
      .att('currencyID', 'COP')
      .txt(fmt2(item.precioUnitario))
      .up();
    price
      .ele(NS.cbc, 'cbc:BaseQuantity')
      .att('unitCode', '94')
      .txt('1.000000')
      .up();
    price.up();

    line.up();
  }
}
