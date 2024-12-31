import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../assets/fonts/vfs_fonts';
import { parametrosGlobales } from '~/routes/login'; //formatoDDMMYYYY_PEN formatearMonedaPEN
import { formatear6_MonedaPEN, cerosALaIzquierda, formatearMonedaPEN, formatoDDMMYYYY_PEN, redondeo2Decimales } from '~/functions/comunes';
import logit from '../assets/base64/imagesBase64';
import QRCode from 'qrcode';

async function pdfFactura00(factura: any) {
  pdfMake.vfs = pdfFonts;

  //console.log('factura PDF', factura);

  const LOGO_EMPRESA = await import(`../assets/logosEmpresas/${parametrosGlobales.RUC}.js`);

  let TIPO_DOCUMENTO = '';
  if (factura.codigoTipoComprobantePago === '01') {
    TIPO_DOCUMENTO = 'FACTURA ELECTRÓNICA';
  }
  if (factura.codigoTipoComprobantePago === '03') {
    TIPO_DOCUMENTO = 'BOLETA ELECTRÓNICA';
  }
  if (factura.codigoTipoComprobantePago === '07') {
    TIPO_DOCUMENTO = 'NOTA DE CRÉDITO ELECTRÓNICA';
  }
  if (factura.codigoTipoComprobantePago === '08') {
    TIPO_DOCUMENTO = 'NOTA DE DÉBITO ELECTRÓNICA';
  }

  //#region ITEMS
  const items = factura.itemsVenta;
  // let totalItems = 0;

  const losItems = items.map((it: any) => {
    console.log('losItems...............losItems.........................losItems', it); //  index: number  ventaPEN, ventaUSD,
    const { descripcionEquivalencia, cantidadEquivalencia, unidadEquivalencia, precioUnitarioPEN, precioUnitarioUSD, porcentaje } = it;
    console.log(
      'losItems...............losItems',
      descripcionEquivalencia,
      cantidadEquivalencia,
      unidadEquivalencia,
      precioUnitarioPEN,
      precioUnitarioUSD,
      porcentaje
    );
    // const indexItem = index + 1;
    // if (factura.moneda === 'PEN') {
    //   totalItems = totalItems + redondeo6Decimales(ventaPEN.$numberDecimal ? ventaPEN.$numberDecimal : ventaPEN);
    // } else {
    //   totalItems = totalItems + redondeo6Decimales(ventaUSD.$numberDecimal ? ventaUSD.$numberDecimal : ventaUSD);
    // }

    return [
      // { text: indexItem, style: 'tableBody' },
      // { text: codigo, style: 'tableBody' },
      {
        text: formatear6_MonedaPEN(cantidadEquivalencia.$numberDecimal),
        style: 'tableBodyRight',
      },
      { text: unidadEquivalencia, style: 'tableBody' },
      { text: descripcionEquivalencia, style: 'tableBody' },
      // {
      //   text: factura.moneda === 'PEN' ? formatear6_MonedaPEN(precioUnitarioPEN.$numberDecimal) : formatear6_MonedaPEN(precioUnitarioUSD.$numberDecimal),
      //   style: 'tableBodyRight',
      // },
      {
        text:
          factura.moneda === 'PEN'
            ? factura.impresionTipoFacturaBoleta
              ? formatear6_MonedaPEN(precioUnitarioPEN.$numberDecimal / (1 + porcentaje.$numberDecimal / 100))
              : formatear6_MonedaPEN(precioUnitarioPEN.$numberDecimal)
            : factura.impresionTipoFacturaBoleta
            ? formatear6_MonedaPEN(precioUnitarioUSD.$numberDecimal / (1 + porcentaje.$numberDecimal / 100))
            : formatear6_MonedaPEN(precioUnitarioUSD.$numberDecimal),
        style: 'tableBodyRight',
      },
    ];
  });
  //#endregion ITEMS

  //#region QR
  //console.log('para QR2:', parametrosGlobales.RUC + '|' + factura.serie + '|' + cerosALaIzquierda(factura.numero, 8) + '|');
  let ELqr;

  QRCode.toString(
    parametrosGlobales.RUC +
      '|' +
      factura.codigoTipoComprobantePago +
      '|' +
      factura.serie +
      '|' +
      factura.numero +
      '|' +
      (factura.moneda === 'PEN' ? redondeo2Decimales(Math.abs(factura.igvPEN.$numberDecimal)) : redondeo2Decimales(Math.abs(factura.igvUSD.$numberDecimal))) +
      '|' +
      (factura.moneda === 'PEN'
        ? redondeo2Decimales(Math.abs(factura.totalPEN.$numberDecimal))
        : redondeo2Decimales(Math.abs(factura.totalUSD.$numberDecimal))) +
      '|' +
      factura.fechaLocal +
      '|' +
      factura.codigoTipoDocumentoIdentidad +
      '|' +
      factura.numeroIdentidad +
      '|',
    {
      errorCorrectionLevel: 'H',
      type: 'svg',
    },
    function (err, data) {
      if (err) throw err;
      pasarValorSVG(data);
      // //console.log('🎇', data);
    }
  );

  function pasarValorSVG(data: string) {
    ELqr = data;
  }
  //#endregion QR

  //#region FUNCION PIE DE PAGINA
  const d = new Date();
  // margin: [izq, top, der, button],
  function Pie(currentPage: number, pageCount: number) {
    return [
      {
        text:
          'Impresión: ' +
          formatoDDMMYYYY_PEN(d.toISOString().substring(0, 10)) +
          ' ' +
          cerosALaIzquierda(d.getHours(), 2) +
          ':' +
          cerosALaIzquierda(d.getMinutes(), 2) +
          ':' +
          cerosALaIzquierda(d.getSeconds(), 2) +
          '\n' +
          'Usuario: ' +
          parametrosGlobales.usuario,
        style: 'texto6',
        margin: [15, -15, 0, 0],
      },
      {
        image: 'poweredBy',
        fit: [70, 35],
        alignment: 'center',
        margin: [0, -35, 0, 0],
      },
      {
        text: currentPage + ' / ' + pageCount,
        style: 'textoPaginacion',
        margin: [0, -15, 17, 15],
      },
    ];
  }
  //#endregion FUNCION PIE DE PAGINA

  //#region DEFINICION DEL DOCUMENTO
  const docDefinitios: any = {
    pageSize: 'A4',
    pageMargins: [13, 11, 13, 15],

    // header: [reportTitle],
    content: [
      //ENCABEZADO
      {
        // margin: [izq, top, der, button],
        columns: [
          { width: '30%', margin: [45, 11, 0, 2], image: 'logoEmp', fit: [190, 66] },
          {
            width: '30%',
            margin: [20, 11, 18, 0],
            // alignment: 'center',
            text: [
              { text: 'Razón social\n', style: 'textoBold10' },
              { text: factura.empresa + '\n', style: 'texto' },
              { text: 'Sucursal\n', style: 'textoBold10' },
              { text: factura.sucursal + '\n', style: 'texto' },
              { text: 'Dirección fiscal\n', style: 'textoBold10' },
              { text: factura.direccion, style: 'texto' },
            ],
          },
          {
            width: '40%',
            margin: [22, 11, 34, 0],
            alignment: 'center',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: ['*'],

              body: [['R U C N° ' + factura.ruc + '\n\n' + TIPO_DOCUMENTO + '\n\n' + factura.serie + ' - ' + cerosALaIzquierda(factura.numero, 8) + '\n']],
            },
            // text: [
            //   { text: 'R U C N° 20602683321\n', style: 'textoBold10' },
            //   { text: '\n', style: 'texto6' },
            //   { text: 'COTIZACIÓN\n', style: 'textoBold10' },
            //   { text: '\n', style: 'texto6' },
            //   { text: cerosALaIzquierda(cotizacion.correlativo, 8) + '\n', style: 'textoBold10' },
            // ],
          },
        ],
      },
      //DATOS CLIENTE
      // margin: [izq, top, der, button],
      {
        columns: [
          //RUC
          {
            width: '18%',
            margin: [50, 20, 0, 0],
            text: { text: factura.tipoDocumentoIdentidad + ':', style: 'textoBold' },
          },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 20, 0, 0],
            // alignment: 'center',
            text: { text: factura.numeroIdentidad, style: 'texto' },
          },
          //FECHA
          {
            width: '16%',
            margin: [50, 20, 0, 0],
            text: { text: 'FECHA' + ':', style: 'textoBold' },
          },
          {
            width: '24%',
            fontSize: 6,
            margin: [0, 20, 0, 0],
            // alignment: 'center',
            text: { text: factura.fechaLocal + ' ' + factura.horaLocal, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          //CLIENTE
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'CLIENTE:', style: 'textoBold' } },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: factura.razonSocialNombre, style: 'texto' },
          },
          //ESTADO
          { width: '16%', margin: [50, 4, 0, 0], text: { text: 'ESTADO:', style: 'textoBold' } },
          {
            width: '24%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: factura.metodoPago, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          //DIRECCION
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'DIRECCION:', style: 'textoBold' } },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: factura.direccionCliente, style: 'texto' },
          },
          //MONEDA
          { width: '16%', margin: [50, 4, 0, 0], text: { text: 'MONEDA:', style: 'textoBold' } },
          {
            width: '24%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: factura.moneda, style: 'texto' },
          },
        ],
      },
      //LOS ITEMS
      {
        // margin: [izq, top, der, button],
        margin: [30, 10, 30, 3],
        style: 'tableExample',
        table: {
          headerRows: 1,
          // widths: [30, 'auto', '*', '*', '*', '*'],
          widths: [60, 60, '*', 100],
          body: [
            [
              // { text: 'Ítem', style: 'tableHeaderLight' },
              // { text: 'Código', style: 'tableHeaderLight' },
              { text: 'Cantidad', style: 'tableHeaderLightRight' },
              { text: 'Uni', style: 'tableHeaderLight' },
              { text: 'Descripción', style: 'tableHeaderLight' },
              // { text: 'Valor Uni    ', style: 'tableHeaderLightRight' },
              { text: 'Valor Uni    ', style: 'tableHeaderLight' },
              // { text: 'Costo Total', style: 'tableHeaderLightRight' },
            ],
            ...losItems,
          ],
        },
        // layout: 'itemsVentaLayout', //{ defaultBorder: false }, //'lightHorizontalLines', // 'noBorders', //'lightHorizontalLines',
        layout: 'noBorders',
      },
      //SUMARIO TABLA
      {
        // margin: [izq, top, der, button],
        margin: [30, 0, 30, 3],
        // style: 'tableExample',

        table: {
          headerRows: 1,
          // widths: [30, 'auto', '*', '*', '*', '*'],
          alignment: 'right',
          widths: ['*', 80, 100],
          body: [
            [
              { text: ' SON: ' + factura.literal, style: 'tableHeaderLightLeft' },
              { text: factura.moneda === 'PEN' ? 'Base Imponible PEN' : 'Base Imponible USD', style: 'tableHeaderLightRight' },
              {
                text:
                  factura.moneda === 'PEN'
                    ? formatearMonedaPEN(Math.abs(factura.baseImponiblePEN.$numberDecimal))
                    : formatearMonedaPEN(Math.abs(factura.baseImponibleUSD.$numberDecimal)),
                style: 'tableHeaderLightRight',
              },
            ],
            [
              { text: factura.observacion.trim() !== '' ? 'OBS: ' + factura.observacion : '', style: 'tableHeaderLightLeft7' },
              { text: factura.moneda === 'PEN' ? 'Exonerado PEN' : 'Exonerado USD', style: 'tableHeaderLightRight' },
              {
                text:
                  factura.moneda === 'PEN'
                    ? formatearMonedaPEN(Math.abs(factura.exoneradoPEN.$numberDecimal))
                    : formatearMonedaPEN(Math.abs(factura.exoneradoUSD.$numberDecimal)),
                style: 'tableHeaderLightRight',
              },
            ],
            [
              { text: 'Usuario: ' + factura.usuarioCrea, style: 'tableHeaderLightLeft7' },
              { text: factura.moneda === 'PEN' ? 'Inafecto PEN' : 'Inafecto USD', style: 'tableHeaderLightRight' },
              {
                text:
                  factura.moneda === 'PEN'
                    ? formatearMonedaPEN(Math.abs(factura.inafectoPEN.$numberDecimal))
                    : formatearMonedaPEN(Math.abs(factura.inafectoUSD.$numberDecimal)),
                style: 'tableHeaderLightRight',
              },
            ],

            [
              { rowSpan: 5, svg: ELqr, style: 'tableQR' },
              { text: factura.moneda === 'PEN' ? 'Export PEN' : 'Export USD', style: 'tableHeaderLightRight' },
              {
                text:
                  factura.moneda === 'PEN'
                    ? formatearMonedaPEN(Math.abs(factura.exportPEN.$numberDecimal))
                    : formatearMonedaPEN(Math.abs(factura.exportUSD.$numberDecimal)),
                style: 'tableHeaderLightRight',
              },
            ],
            [
              '',
              { text: factura.moneda === 'PEN' ? 'Otros PEN' : 'Otros USD', style: 'tableHeaderLightRight' },
              {
                text:
                  factura.moneda === 'PEN'
                    ? formatearMonedaPEN(Math.abs(factura.otrosPEN.$numberDecimal))
                    : formatearMonedaPEN(Math.abs(factura.otrosUSD.$numberDecimal)),
                style: 'tableHeaderLightRight',
              },
            ],
            [
              '',
              { text: factura.moneda === 'PEN' ? 'ISC PEN' : 'ISC USD', style: 'tableHeaderLightRight' },
              {
                text:
                  factura.moneda === 'PEN'
                    ? formatearMonedaPEN(Math.abs(factura.iscPEN.$numberDecimal))
                    : formatearMonedaPEN(Math.abs(factura.iscUSD.$numberDecimal)),
                style: 'tableHeaderLightRight',
              },
            ],
            [
              '',
              { text: factura.moneda === 'PEN' ? 'IGV PEN' : 'IGV USD', style: 'tableHeaderLightRight' },
              {
                text:
                  factura.moneda === 'PEN'
                    ? formatearMonedaPEN(Math.abs(factura.igvPEN.$numberDecimal))
                    : formatearMonedaPEN(Math.abs(factura.igvUSD.$numberDecimal)),
                style: 'tableHeaderLightRight',
              },
            ],
            [
              '',
              { text: factura.moneda === 'PEN' ? 'Total PEN' : 'Total USD', style: 'tableHeaderLightRight' },
              {
                text:
                  factura.moneda === 'PEN'
                    ? formatearMonedaPEN(Math.abs(factura.totalPEN.$numberDecimal))
                    : formatearMonedaPEN(Math.abs(factura.totalUSD.$numberDecimal)),
                style: 'tableHeaderLightRight',
              },
            ],
          ],
        },
        // layout: 'itemsVentaLayout', //{ defaultBorder: false }, //'lightHorizontalLines', // 'noBorders', //'lightHorizontalLines',
        layout: 'noBorders',
      },
    ],
    footer: Pie,

    // margin: [izq, top, der, button],
    styles: {
      tableExample: {
        margin: [0, 0, 0, 15],
        // width: '100%',
      },
      tableQR: {
        bold: true,
        fontSize: 8,
        fillColor: '#d9d9d9',
        color: 'black',
        // alignment: 'start',
        alignment: 'right',

        // border: [false, false, false, false],
      },
      tableHeaderLight: {
        bold: true,
        fontSize: 8,
        fillColor: '#d9d9d9',
        color: 'black',
        // alignment: 'start',
        alignment: 'center',
        // border: [false, false, false, false],
      },
      tableHeaderLightRight: {
        bold: true,
        fontSize: 8,
        fillColor: '#d9d9d9',
        color: 'black',
        // alignment: 'start',
        alignment: 'right',
        // border: [false, false, false, false],
      },
      tableHeaderLightLeft: {
        bold: true,
        fontSize: 8,
        fillColor: '#d9d9d9',
        color: 'black',
        // alignment: 'start',    '#',
        alignment: 'left',
        // border: [false, false, false, false],
      },
      tableHeaderLightLeft7: {
        bold: true,
        fontSize: 7,
        fillColor: '#d9d9d9',
        color: 'black',
        // alignment: 'start',    '#',
        alignment: 'left',
        // border: [false, false, false, false],
      },
      tableHeader: {
        bold: true,
        fontSize: 8,
        fillColor: '#34495E',
        color: 'white',
        alignment: 'center',
        // border: [false, false, false, false],
      },
      tableBody: {
        fontSize: 8,
        color: '#50575E',
        alignment: 'center',
      },
      tableBodyLeft: {
        fontSize: 8,
        color: '#50575E',
        alignment: 'left',
      },
      tableBodyRight: {
        fontSize: 8,
        color: '#50575E',
        alignment: 'right',
      },
      textoBold10: {
        fontSize: 10,
        bold: true,
        underline: true,
      },
      textoBold9: {
        fontSize: 9,
        bold: true,
        // underline: true,
      },
      textoBold: {
        fontSize: 8,
        bold: true,
      },
      textoBold7: {
        fontSize: 7,
        bold: true,
      },
      textoBold6: {
        fontSize: 6,
        bold: true,
      },
      textoBoldRight: {
        alignment: 'right',
        fontSize: 8,
        bold: true,
      },
      textoPaginacion: {
        alignment: 'right',
        fontSize: 8,
        bold: true,
        color: '#50575E',
      },
      texto: {
        fontSize: 8,
        color: '#50575E',
      },
      texto7: {
        fontSize: 7,
        color: '#50575E',
      },
      texto6: {
        fontSize: 6,
        color: '#50575E',
      },
      texto10: {
        fontSize: 10,
        color: '#50575E',
      },
    },
    images: {
      // logo: logit.logoMerma,
      logoEmp: LOGO_EMPRESA.default,
      poweredBy: logit.logoPiePagina,

      // morty: 'https://rickandmortyapi.com/api/character/avatar/795.jpeg',
      // snow: 'https://picsum.photos/seed/picsum/200/300',
    },
  };
  //#endregion DEFINICION DEL DOCUMENTO

  pdfMake.createPdf(docDefinitios).open(); //download('trice.pdf');
}

export default pdfFactura00;
