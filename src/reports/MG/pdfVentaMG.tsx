import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../assets/fonts/vfs_fonts';
import {
  cerosALaIzquierda,
  formatearMonedaPEN,
  formatearMonedaUSD,
  formatear_4Decimales,
  formatoDDMMYYYY_PEN,
  literal,
} from '~/functions/comunes';
import logit from '../../assets/base64/imagesBase64.js';

function pdfVentaMG(venta: any) {
  pdfMake.vfs = pdfFonts;

  console.log('venta PDF', venta);
  const items = venta.itemsVenta;
  const losItems = items.map((it: any) => {
    const {
      codigo,
      descripcionEquivalencia,
      cantidadEquivalencia,
      unidadEquivalencia,
      precioPEN,
      ventaPEN,
      precioUSD,
      ventaUSD,
    } = it;
    return [
      { text: codigo, style: 'tableBody' },
      { text: descripcionEquivalencia, style: 'tableBody' },
      {
        text: formatear_4Decimales(cantidadEquivalencia.$numberDecimal),
        style: 'tableBody',
        // border: [false, false, false, true],
      },
      { text: unidadEquivalencia, style: 'tableBody' },
      {
        text:
          venta.moneda === 'PEN'
            ? formatearMonedaPEN(precioPEN.$numberDecimal)
            : 'USD ' + formatearMonedaUSD(precioUSD.$numberDecimal),
        style: 'tableBody',
        // border: [false, false, false, true],
      },
      {
        text:
          venta.moneda === 'PEN'
            ? formatearMonedaPEN(ventaPEN.$numberDecimal)
            : 'USD ' + formatearMonedaUSD(ventaUSD.$numberDecimal),
        style: 'tableBody',
      },
    ];
  });

  const reportTitle: any = [];
  // const details = [];
  // const rodape = [];

  //#region FUNCION PIE DE PAGINA
  // margin: [izq, top, der, button],
  function Pie(currentPage: number, pageCount: number) {
    return [
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

    header: [reportTitle],
    content: [
      {
        // margin: [izq, top, der, button],
        // margin: [0, 0, 0, 0],
        columns: [
          { margin: [66, 11, 15, 2], image: 'logo', fit: [200, 113] },
          {
            margin: [0, 11, 18, 0],
            alignment: 'right',
            text: [
              { text: 'Datos del documento\n', style: 'textoBold' },
              { text: 'Tipo de documento: ', style: 'textoBold' },
              { text: venta.tipoComprobantePago + '\n', style: 'texto' },
              { text: 'Serie y correlativo: ', style: 'textoBold' },
              {
                text: venta.serie + ' - ' + cerosALaIzquierda(venta.numero, 8) + '\n',
                style: 'texto',
              },
              { text: 'Fecha: ', style: 'textoBold' },
              { text: formatoDDMMYYYY_PEN(venta.fecha) + '\n', style: 'texto' },
            ],
          },
        ],
      },
      //Inicio
      {
        margin: [12, 0, 12, 5],
        table: {
          headerRows: 1,
          widths: ['*', '*'],
          body: [
            [
              {
                text: 'Datos del emisor',
                style: 'tableHeader',
              },
              {
                text: 'Adquiriente / Usuario',
                style: 'tableHeader',
              },
            ],
          ],
        },
        layout: 'noBorders',
      },
      //Inicio DERECHA
      {
        margin: [0, 0, 0, 15],
        columns: [
          {
            margin: [17, 0, 0, 0],
            text: [
              { text: 'RUC: ', style: 'textoBold' },
              { text: venta.ruc + '\n', style: 'texto' },
              { text: 'Nombre: ', style: 'textoBold' },
              { text: venta.empresa + '\n', style: 'texto' },
              { text: 'Dirección: ', style: 'textoBold' },
              {
                text: venta.direccion + '\n',
                style: 'texto',
              },
              { text: 'Sucursal: ', style: 'textoBold' },
              { text: 'OFICINA ADMINISTRATIVA\n', style: 'texto' },
              { text: 'Teléfono: ', style: 'textoBold' },
              { text: '15353482\n', style: 'texto' },
            ],
          },
          {
            margin: [5, 0, 17, 0],
            text: [
              { text: 'Identificación: ', style: 'textoBold' },
              { text: venta.tipoDocumentoIdentidad + '\n', style: 'texto' },
              { text: 'Número de identificación: ', style: 'textoBold' },
              { text: venta.numeroIdentidad + '\n', style: 'texto' },
              { text: 'Nombre: ', style: 'textoBold' },
              {
                text: venta.razonSocialNombre + '\n',
                style: 'texto',
              },
            ],
          },
        ],
      },
      //Items de Ventas
      {
        margin: [12, 0, 12, 15],
        style: 'tableExample',
        table: {
          headerRows: 1,
          widths: ['*', 'auto', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Código', style: 'tableHeader' },
              { text: 'Descripción', style: 'tableHeader' },
              { text: 'Cantidad', style: 'tableHeader' },
              { text: 'Uni', style: 'tableHeader' },
              { text: 'Precio', style: 'tableHeader' },
              { text: 'Venta', style: 'tableHeader' },
            ],
            ...losItems,
          ],
        },
        layout: 'itemsVentaLayout', //{ defaultBorder: false }, //'lightHorizontalLines', // 'noBorders', //'lightHorizontalLines',
      },
      //Resumen
      {
        columns: [
          {
            margin: [12, 0, 12, 15],
            table: {
              headerRows: 1,
              widths: ['*'],
              body: [
                [{ text: 'Información adicional', style: 'tableHeader' }],
                [
                  {
                    text: [
                      { text: 'Observación: ', style: 'textoBold' },
                      {
                        text: venta.observacion,
                        style: 'text',
                      },
                    ],
                    style: 'tableBody',
                  },
                ],
              ],
            },
            layout: 'itemsVentaLayout',
          },
          {
            margin: [12, 0, 12, 15],
            table: {
              headerRows: 1,
              widths: ['*'],
              body: [
                [{ text: 'Total impuestos', style: 'tableHeader' }],
                [
                  {
                    text:
                      'Total IGV ' +
                      venta.igv.$numberDecimal +
                      '%: ' +
                      (venta.moneda === 'PEN'
                        ? formatearMonedaPEN(venta.igvPEN.$numberDecimal)
                        : 'USD ' + formatearMonedaUSD(venta.igvUSD.$numberDecimal)),
                    style: 'textoBoldRight',
                  },
                ],
              ],
            },
            layout: 'itemsVentaLayout',
          },
        ],
      },
      {
        columns: [
          {
            margin: [12, 0, 12, 15],
            text: [
              { text: 'Monto en letra: ', style: 'texto' },
              {
                text:
                  venta.moneda === 'PEN'
                    ? literal(venta.totalPEN.$numberDecimal, 'PEN')
                    : literal(venta.totalUSD.$numberDecimal, 'USD'),
                style: 'textoBold',
              },
            ],
          },
          {
            margin: [12, 0, 12, 15],
            table: {
              headerRows: 1,
              widths: ['*'],
              body: [
                [{ text: 'Totales del documento', style: 'tableHeader' }],
                [
                  {
                    text:
                      'Total gravadas: ' +
                      (venta.moneda === 'PEN'
                        ? formatearMonedaPEN(venta.baseImponiblePEN.$numberDecimal)
                        : 'USD ' + formatearMonedaUSD(venta.baseImponibleUSD.$numberDecimal)) +
                      '\n' +
                      'Exonedado: ' +
                      (venta.moneda === 'PEN'
                        ? formatearMonedaPEN(venta.exoneradoPEN.$numberDecimal)
                        : 'USD ' + formatearMonedaUSD(venta.exoneradoUSD.$numberDecimal)) +
                      '\n' +
                      'Inafecto: ' +
                      (venta.moneda === 'PEN'
                        ? formatearMonedaPEN(venta.inafectoPEN.$numberDecimal)
                        : 'USD ' + formatearMonedaUSD(venta.inafectoUSD.$numberDecimal)) +
                      '\n' +
                      'Importe total de la venta: ' +
                      (venta.moneda === 'PEN'
                        ? formatearMonedaPEN(venta.totalPEN.$numberDecimal)
                        : 'USD ' + formatearMonedaUSD(venta.totalUSD.$numberDecimal)),
                    style: 'textoBoldRight',
                  },
                ],
              ],
            },
            layout: 'itemsVentaLayout',
          },
        ],
      },
      {
        margin: [12, 0, 12, 15],
        text: [
          { text: 'Forma de pago: ', style: 'texto' },
          { text: venta.metodoPago, style: 'textoBold' },
        ],
      },
    ],
    footer: Pie,

    styles: {
      tableExample: {
        margin: [0, 0, 0, 15],
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
      textoBold: {
        fontSize: 8,
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
    },
    images: {
      logo: logit.logoMerma,
      poweredBy: logit.logoPiePagina,

      // morty: 'https://rickandmortyapi.com/api/character/avatar/795.jpeg',
      // snow: 'https://picsum.photos/seed/picsum/200/300',
    },
  };
  //#endregion DEFINICION DEL DOCUMENTO

  //#region TABLA LAYOUTS
  pdfMake.tableLayouts = {
    itemsVentaLayout: {
      hLineWidth: function (i: number, node: any) {
        if (i === 0) {
          //|| i === node.table.body.length
          return 0;
        }
        return i === node.table.headerRows ? 0 : 1;
      },
      // vLineWidth: function (i) {
      vLineWidth: function () {
        return 0;
      },
      hLineColor: function (i) {
        return i === 1 ? 'black' : '#aaa';
      },
      paddingLeft: function (i) {
        return i === 0 ? 0 : 8;
      },
      paddingRight: function (i: number, node: any) {
        return i === node.table.widths.length - 1 ? 0 : 8;
      },
    },
  };
  //#endregion TABLA LAYOUTS

  pdfMake.createPdf(docDefinitios).open(); //download('trice.pdf');
}

export default pdfVentaMG;
