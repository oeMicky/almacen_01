import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../assets/fonts/vfs_fonts';
import {
  cerosALaIzquierda,
  formatearMonedaPEN,
  // formatearMonedaUSD,
  formatear_4Decimales,
  // formatoDDMMYYYY_PEN,
  // literal,
  redondeo2Decimales,
} from '~/functions/comunes';

function pdfCotizacionMG(cotizacion: any) {
  pdfMake.vfs = pdfFonts;

  console.log('cotizacion PDF', cotizacion);

  const servicios = cotizacion.servicios;
  const repuestosLubri = cotizacion.repuestosLubri;
  let totalServicios = 0;
  let totalRepuestos = 0;

  const reportTitle: any = [];
  // const details = [];
  // const rodape = [];

  const losServicios = servicios.map((ser: any, index: number) => {
    const { descripcionEquivalencia, cantidad, precioPEN, ventaPEN } = ser;
    const indexItem = index + 1;
    totalServicios = totalServicios + redondeo2Decimales(ventaPEN.$numberDecimal ? ventaPEN.$numberDecimal : ventaPEN);
    return [
      { text: indexItem, style: 'tableBody' },
      // { text: codigo, style: 'tableBody' },
      { text: descripcionEquivalencia, style: 'tableBody' },
      {
        text: formatear_4Decimales(cantidad.$numberDecimal),
        style: 'tableBody',
      },
      { text: 'UNI', style: 'tableBody' },
      {
        text: formatearMonedaPEN(precioPEN.$numberDecimal),
        style: 'tableBody',
      },
      {
        text: formatearMonedaPEN(ventaPEN.$numberDecimal),
        style: 'tableBody',
      },
    ];
  });

  const losRepuestos = repuestosLubri.map((repu: any, index: number) => {
    const { codigo, descripcionEquivalencia, cantidad, precioPEN, ventaPEN } = repu;
    const indexItem = index + 1;
    totalRepuestos = totalRepuestos + redondeo2Decimales(ventaPEN.$numberDecimal ? ventaPEN.$numberDecimal : ventaPEN);
    return [
      { text: indexItem, style: 'tableBody' },
      { text: codigo, style: 'tableBody' },
      { text: descripcionEquivalencia, style: 'tableBody' },
      {
        text: formatear_4Decimales(cantidad.$numberDecimal),
        style: 'tableBody',
      },
      { text: 'UNI', style: 'tableBody' },
      {
        text: formatearMonedaPEN(precioPEN.$numberDecimal),
        style: 'tableBody',
      },
      {
        text: formatearMonedaPEN(ventaPEN.$numberDecimal),
        style: 'tableBody',
      },
    ];
  });

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
        columns: [
          { width: '30%', margin: [45, 11, 0, 2], image: 'logo', fit: [190, 66] },
          {
            width: '30%',
            margin: [20, 11, 18, 0],
            // alignment: 'center',
            text: [
              { text: 'Dirección fiscal\n', style: 'textoBold' },
              { text: 'AV. PARDO 1308 (AL COSTADO DEL MERCADO) - CHIMBOTE', style: 'texto6' },
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

              body: [['R U C N° 20602683321\n\nCOTIZACIÓN\n\n' + cerosALaIzquierda(cotizacion.numero, 8) + '\n']],
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
      //DATOS CLIENTE - VEHICULO
      // margin: [izq, top, der, button],
      {
        columns: [
          {
            width: '20%',
            margin: [50, 30, 0, 0],
            text: { text: cotizacion.tipoDocumentoIdentidad + ':', style: 'textoBold' },
          },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 30, 0, 0],
            // alignment: 'center',
            text: { text: cotizacion.numeroIdentidad, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          { width: '20%', margin: [50, 6, 0, 0], text: { text: 'CLIENTE:', style: 'textoBold' } },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 6, 0, 0],
            // alignment: 'center',
            text: { text: cotizacion.razonSocialNombre, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          { width: '20%', margin: [50, 6, 0, 0], text: { text: 'PLACA:', style: 'textoBold' } },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 6, 0, 0],
            // alignment: 'center',
            text: { text: cotizacion.placa, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          { width: '20%', margin: [50, 6, 0, 0], text: { text: 'VIN:', style: 'textoBold' } },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 6, 0, 0],
            // alignment: 'center',
            text: { text: cotizacion.vin, style: 'texto' },
          },
        ],
      },
      //SERVICIOS
      {
        columns: [{ width: '20%', margin: [50, 10, 0, 0], text: { text: 'SERVICIOS:', style: 'textoBold10' } }],
      },
      {
        // margin: [izq, top, der, button],
        margin: [30, 10, 30, 3],
        style: 'tableExample',
        table: {
          headerRows: 1,
          //
          // widths: ['*', 'auto', '*', '*', '*', '*'],
          widths: ['*', 'auto', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Ítem', style: 'tableHeaderLight' },
              // { text: 'Código', style: 'tableHeaderLight' },
              { text: 'Descripción', style: 'tableHeaderLight' },
              { text: 'Cantidad', style: 'tableHeaderLight' },
              { text: 'Uni', style: 'tableHeaderLight' },
              { text: 'Precio', style: 'tableHeaderLight' },
              { text: 'Venta', style: 'tableHeaderLight' },
            ],
            ...losServicios,
          ],
        },
        // layout: 'itemsVentaLayout', //{ defaultBorder: false }, //'lightHorizontalLines', // 'noBorders', //'lightHorizontalLines',
        layout: 'noBorders',
      },
      {
        columns: [
          {
            width: '100%',
            margin: [0, 0, 30, 0],

            text: { text: 'SUBTOTAL ' + formatearMonedaPEN(totalServicios), style: 'tableBodyRight' },
            alignment: 'right',
          },
        ],
      },
      //REPUESTOS
      {
        columns: [{ width: '20%', margin: [50, 10, 0, 0], text: { text: 'REPUESTOS:', style: 'textoBold10' } }],
      },
      {
        // margin: [izq, top, der, button],
        margin: [30, 10, 30, 3],
        style: 'tableExample',
        table: {
          headerRows: 1,
          //
          // widths: ['*', 'auto', '*', '*', '*', '*'],
          widths: ['*', '*', 'auto', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Ítem', style: 'tableHeaderLight' },
              { text: 'Código', style: 'tableHeaderLight' },
              { text: 'Descripción', style: 'tableHeaderLight' },
              { text: 'Cantidad', style: 'tableHeaderLight' },
              { text: 'Uni', style: 'tableHeaderLight' },
              { text: 'Precio', style: 'tableHeaderLight' },
              { text: 'Venta', style: 'tableHeaderLight' },
            ],
            ...losRepuestos,
          ],
        },
        // layout: 'itemsVentaLayout', //{ defaultBorder: false }, //'lightHorizontalLines', // 'noBorders', //'lightHorizontalLines',
        layout: 'noBorders',
      },
      {
        columns: [
          {
            width: '100%',
            margin: [0, 0, 30, 0],
            text: { text: 'SUBTOTAL ' + formatearMonedaPEN(totalRepuestos), style: 'tableBodyRight' },
            alignment: 'right',
          },
        ],
      },
      //TOTAL
      {
        columns: [
          {
            margin: [0, 5, 30, 0],
            text: { text: 'TOTAL ' + formatearMonedaPEN(totalServicios + totalRepuestos), style: 'textoBold10' },
            alignment: 'right',
          },
        ],
      },
      //OBSERVACIONES
      { margin: [50, 30, 0, 0], text: 'Observaciones:', style: 'texto6' },
      {
        // margin: [izq, top, der, button],
        margin: [50, 0, 30, 0],
        ul: [
          'ALGUN REPUESTO O SERVICIO ADICIONAL A LA COTIZACIÓN, PREVIO AVISO, LO ASUMIRÁ EL PROPIETARIO.',
          'EL STOCK DISPONIBLE PUEDE VARIAR SEGÚN EL TIEMPO DE CONFIRMACIÓN DE COMPRA DEL MISMO.',
          'EL TIEMPO PROMEDIO DE IMPORTACIÓN DE REPUESTOS ES DE 30 DÍAS HÁBILES.',
          'ESTA COTIZACIÓN TIENE UNA VIGENCIA DE 7 DÍAS.',
        ],
        style: 'texto6',
      },
    ],
    footer: Pie,

    styles: {
      tableExample: {
        margin: [0, 0, 0, 15],
      },
      tableHeaderLight: {
        bold: true,
        fontSize: 8,
        fillColor: '#d9d9d9',
        color: 'black',
        alignment: 'start',
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
      textoBold: {
        fontSize: 8,
        bold: true,
      },
      textoBold7: {
        fontSize: 7,
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
      texto6: {
        fontSize: 6,
        color: '#50575E',
      },
    },
    images: {
      logo: 'data:image/jpeg;base64,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',
      poweredBy:
        'data:image/png;base64,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',

      morty: 'https://rickandmortyapi.com/api/character/avatar/795.jpeg',
      snow: 'https://picsum.photos/seed/picsum/200/300',
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

export default pdfCotizacionMG;
