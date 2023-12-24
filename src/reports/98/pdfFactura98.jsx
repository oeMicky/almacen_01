import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// const pdfFonts = require('pdfMake/build/vfs_fonts.js');
import pdfFonts from '../../assets/fonts/vfs_fonts';
import {
  formatoDDMMYYYY_PEN,
  cerosALaIzquierda,
  formatearMonedaPEN,
  formatearMonedaUSD,
  formatear_4Decimales,
  literal,
} from '../../functions/comunes';

// async function pdfFactura98(venta) {
function pdfFactura98(venta) {
  //   const pdfMake = pdfMake || {};

  // pdfMake.vfs = pdfFonts.pdfMake.vfs;
  //   pdfMake.vfs= pdfFonts.pdfMake.vfs;
  pdfMake.vfs = pdfFonts;

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
  // margin: [izq, top, der, button],
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
        // margin: [izq, top, der, button],
        // margin: [0, 0, 0, 0],
        columns: [
          { margin: [66, 11, 15, 2], image: 'logo', fit: [238, 144] },
          {
            margin: [0, 11, 18, 0],
            alignment: 'right',
            text: [
              { text: 'Datos del documento\n', style: 'textoBold' },
              { text: 'Tipo de documento: ', style: 'textoBold' },
              { text: venta.descripcionTCP + '\n', style: 'texto' },
              { text: 'Serie y correlativo: ', style: 'textoBold' },
              {
                text: venta.serie + '-' + cerosALaIzquierda(venta.numero, 8) + '\n',
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
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAADvCAMAAAAqyfq3AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAMAUExURQYHCgAAAAsLCxAPDhAQDwoNEg0UGBQZGxMTExsbHCAgHxUdIyAfIBkkKRsqMx8yOycnKSMjIysrLDAuLjMxLyouMjEvMCcyNzY3OTM0NTs7PEY4K1Q/LEg+NVE+MU9AL11ELExCOVhGN2VGKXJMKHZRLWdNNSU6Qz4/QCtDTD9AQixHUzNMVjZRXThYZT9ibz9kc0ZHSUNDREtLS1VNRk9QT1pSTU1OUU5RUlhXWFNTVFtbW2FXTnxeQGBbWEBfal1fYWFfYEtkbV9hYUNqeUpwfWZnaGNjY2xsbG5ucG9wcXZ3eHNzdHx8fINVKZBdLZFeM5pjLJdkMatsLrlyLq9uMaxxObp1NMN6NI1wUc+DMteGNf6UJ/6WLv6YL+KMNOyTOPmbOv6XMf+YMY2Dd5iJe62LZ+aTQfmeQviiSeeiVfeoV9msa9ascNKxd/auZPWza+yzePa6eUhvgkt3h1t6iE99kFF/kX1+gE+Aj1uDjlWGmWyFjXmChWWBkH6UnliOol6Wql6bsWSYqn+eqmSdsmeku3SqvGusxHStxG2zy3K2zW+30XS81XjD3HzK5X7R7n7U8X/e/n/g/4eIiIKCg4uMjJCMiY6PkY2Vl5aXmJSUlJubnKuhl7y8loSdpJ6foJ+hoYqruJCps5eyt6WnqaOkpKysrK6wr66vsKiytra3ubS0tLy8vMm1icO2lu27gPa+gsi+rbTBp6rJvr7Av+/Ai/bDiurHnfbJmNjGqdXLtufLrPfOovfTqfjauIm3x5a7yKW/xby/wYvG15/P0JbV26fLxL3BwqXL17fJ0IbN5YfT64XY9IHe/4ve+pbe95Pf+abX57be46Lf9Irl/4Tj/5fh+Jrh+bni76bk+ank96vl+rfo+Ljx/8fIycPDw8zMzN/Tyc7O0M/Q0dbY2dPU1Nvc3O7bwPnfwfnjx+ro2/ns2cnd4t3f4d/g4Mfs+NLu98zx+9jz+ubo6OPk5Ozs7Pnu4u3w7fjy6O/v8OX1+ff4+Pf39/7+/gAAAJVdaIsAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAACXBIWXMAAA7EAAAOxAGVKw4bAAA21ElEQVR4Xu19C1xc2Xnf3AEtM6xWy4BMgKSOHdtZotibBYx3gTSRog0gHm6TX5xu4xVrUFtDaCtF3sQ4m7Z+1JvNvpfXEqAJJAWkAknUhmyUVJJdt8mmXgnhakaYh4CKR6SqCyvDrHY6c9Xvde7cmbkzc3lp/fvZ/5m599w7d8493/985zvfedwzjrvf77hw7o0zx5sbAU3NTc3Hz5w9f+OWfLUT+H4m4Ma5k81N9fX1x449WVdX1wCfuoajRxsa6huBh/M7xMIOEvDO2ne/Oz09PTU1BdvtYGpm5n/99Z+B7CDz0WMKv/JUHe7q4HXsKPDQ2Hzy3E259Taw8xqwNjszOTE+Pu67FEZbmwSSAa5r873153/y6/V1ICMJTqirq//YE0RAGMBN4/Fz21WEXSwCt9dmp4mKS+Mkv6+1zYcSJkBrW9v4/wDpj0bJCvjcj/5jKAtRqDta13jinNxva7gXNgCZmLoKTIxfQgbwFQdtF//2XzeC2tfFEvBE3k/GEoA4Wtd8ZhtqcG+N4NrsLDFxaZy0HUWWD+7axv/8X0Lmg/QofxQH/6j9Z5+SYDSOHm08uWVrcG8JMGAUD7EUoBltl/72X9WHsx54OAolof5YfX0j1ASNH1mo/gyckW+jASXhhkS9SbxPBIQBNnPq6gQUjr/5k3rQfRYHDCDUdc0noNK/cIPwV58KDfzDk8eb6xugJowtIMBW48ktFYT3nQCFv/p1UX007s0nz0Zl6EiNvlT2Xui9WzfOnmluhGqQBTeh7mjTWbl4M9giAZfHxyeuXplZW5PjbeNkA4iEnk5988nzcs6M2n49VHJdDyJCty6caa6P5aCurnnz5WBrBIy3tkLBhU0r2vaJqZnZtdvy1ZZwoQl8Hsj8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',
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
