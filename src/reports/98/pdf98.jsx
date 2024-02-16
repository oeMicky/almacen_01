import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {
  formatoDDMMYYYY_PEN,
  cerosALaIzquierda,
  formatearMonedaPEN,
  formatearMonedaUSD,
  formatear_4Decimales,
  literal,
} from '../functions/funcionesGlobales';

async function pdfFactura98(venta) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  console.log('venta PDF', venta);
  console.log('venta PDF venta.itemsVenta', venta.itemsVenta);
  const items = venta.itemsVenta;
  console.log('venta PDF items', items);

  const losItems = items.map((it) => {
    const { codigo, descripcionEquivalencia, cantidad, unidadEquivalencia, precioPEN, ventaPEN, precioUSD, ventaUSD } = it;
    return [
      { text: codigo, style: 'tableBody' },
      { text: descripcionEquivalencia, style: 'tableBody' },
      {
        text: formatear_4Decimales(cantidad.$numberDecimal),
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

  const reportTitle = [
    // {
    //   columns: [
    //     { text: 'hola mundo' },
    //     { text: 'hola mundo 2' },
    //     // { margin: [15, 15, 15, 5], image: 'lucha', fit: [238, 144] },
    //     // { margin: [300, 15, 15, 5], image: 'lucha', fit: [238, 144] },
    //   ],
    // },
    // {
    //   // margin: [0, 0, 0, 0],
    //   columns: [
    //     { margin: [15, 15, 15, 5], image: 'logo', fit: [238, 144] },
    //     {
    //       margin: [0, 105, 15, 0],
    //       alignment: 'right',
    //       text: [
    //         { text: 'DATOS DEL DOCUMENTO: ', style: 'textoBold' },
    //         { text: '20156489357\n', style: 'texto' },
    //         { text: 'Nombre: ', style: 'textoBold' },
    //         { text: 'Pacific Natural Foods SAC\n', style: 'texto' },
    //         { text: 'Dirección: ', style: 'textoBold' },
    //         {
    //           text: 'CAL. MANUEL LECCA N° 270, CHORRILLOS, LIMA, DEPARTAMENTO LIMA\n',
    //           style: 'texto',
    //         },
    //         { text: 'Sucursal: ', style: 'textoBold' },
    //         { text: 'OFICINA ADMINISTRATIVA\n', style: 'texto' },
    //         { text: 'Teléfono: ', style: 'textoBold' },
    //         { text: '15353482\n', style: 'texto' },
    //       ],
    //     },
    //   ],
    // },
  ];
  const details = [];
  const rodape = [];

  function Pie(currentPage, pageCount) {
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

  const docDefinitios = {
    pageSize: 'A4',
    pageMargins: [13, 11, 13, 15],

    header: [reportTitle],
    content: [
      {
        // margin: [0, 0, 0, 0],
        columns: [
          { margin: [13, 11, 15, 2], image: 'logo', fit: [238, 144] },
          {
            margin: [0, 11, 18, 0],
            alignment: 'right',
            text: [
              { text: 'Datos del documento\n', style: 'textoBold' },
              { text: 'Tipo de documento: ', style: 'textoBold' },
              { text: venta.documentoVenta + '\n', style: 'texto' },
              { text: 'Serie y correlativo: ', style: 'textoBold' },
              {
                text: venta.serie + ' - ' + cerosALaIzquierda(venta.numeroDocumento, 8) + '\n',
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
      {
        margin: [0, 0, 0, 15],
        columns: [
          {
            margin: [17, 0, 0, 0],
            text: [
              { text: 'RUC: ', style: 'textoBold' },
              { text: '20156489357\n', style: 'texto' },
              { text: 'Nombre: ', style: 'textoBold' },
              { text: 'Pacific Natural Foods SAC\n', style: 'texto' },
              { text: 'Dirección: ', style: 'textoBold' },
              {
                text: 'CAL. MANUEL LECCA N° 270, CHORRILLOS, LIMA, DEPARTAMENTO LIMA\n',
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
                        text: 'GUIA DE REMISON REMITENTE NRO 006-1169',
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
                        ? formatearMonedaPEN(venta.montoIGVPEN.$numberDecimal)
                        : 'USD ' + formatearMonedaUSD(venta.montoIGVUSD.$numberDecimal)),
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
                    ? literal(venta.montoTotalPEN.$numberDecimal, 'PEN')
                    : literal(venta.montoTotalUSD.$numberDecimal, 'USD'),
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
                        ? formatearMonedaPEN(venta.montoSubTotalPEN.$numberDecimal)
                        : 'USD ' + formatearMonedaUSD(venta.montoSubTotalUSD.$numberDecimal)) +
                      '\n' +
                      'Importe total de la venta: ' +
                      (venta.moneda === 'PEN'
                        ? formatearMonedaPEN(venta.montoTotalPEN.$numberDecimal)
                        : 'USD ' + formatearMonedaUSD(venta.montoTotalUSD.$numberDecimal)),
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
      logo: 'data:image/png;base64,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',
      poweredBy:
        'data:image/png;base64,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',

      morty: 'https://rickandmortyapi.com/api/character/avatar/795.jpeg',
      snow: 'https://picsum.photos/seed/picsum/200/300',
    },
  };

  pdfMake.tableLayouts = {
    itemsVentaLayout: {
      hLineWidth: function (i, node) {
        if (i === 0) {
          //|| i === node.table.body.length
          return 0;
        }
        return i === node.table.headerRows ? 0 : 1;
      },
      vLineWidth: function (i) {
        return 0;
      },
      hLineColor: function (i) {
        return i === 1 ? 'black' : '#aaa';
      },
      paddingLeft: function (i) {
        return i === 0 ? 0 : 8;
      },
      paddingRight: function (i, node) {
        return i === node.table.widths.length - 1 ? 0 : 8;
      },
    },
  };

  pdfMake.createPdf(docDefinitios).open(); //download('trice.pdf');
}

export default pdfFactura98;
