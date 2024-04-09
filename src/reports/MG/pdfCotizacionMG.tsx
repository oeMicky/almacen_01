import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../assets/fonts/vfs_fonts';
import {
  cerosALaIzquierda,
  formatearMonedaPEN,
  // formatearMonedaUSD,
  formatear_4Decimales,
  formatoDDMMYYYY_PEN,
  // formatoDDMMYYYY_PEN,
  // literal,
  redondeo2Decimales,
} from '~/functions/comunes';
import logit from '../../assets/base64/imagesBase64.js';

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
    const { descripcionEquivalencia, cantidadEquivalencia, unidadEquivalencia, precioPEN, ventaPEN } = ser;
    const indexItem = index + 1;
    totalServicios = totalServicios + redondeo2Decimales(ventaPEN.$numberDecimal ? ventaPEN.$numberDecimal : ventaPEN);
    return [
      { text: indexItem, style: 'tableBody' },
      // { text: codigo, style: 'tableBody' },
      { text: descripcionEquivalencia, style: 'tableBody' },
      {
        text: formatear_4Decimales(cantidadEquivalencia.$numberDecimal),
        style: 'tableBody',
      },
      { text: unidadEquivalencia, style: 'tableBody' },
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
    const { codigo, descripcionEquivalencia, cantidadEquivalencia, unidadEquivalencia, precioPEN, ventaPEN } = repu;
    const indexItem = index + 1;
    totalRepuestos = totalRepuestos + redondeo2Decimales(ventaPEN.$numberDecimal ? ventaPEN.$numberDecimal : ventaPEN);
    return [
      { text: indexItem, style: 'tableBody' },
      { text: codigo, style: 'tableBody' },
      { text: descripcionEquivalencia, style: 'tableBody' },
      {
        text: formatear_4Decimales(cantidadEquivalencia.$numberDecimal),
        style: 'tableBody',
      },
      { text: unidadEquivalencia, style: 'tableBody' },
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
              { text: 'Dirección fiscal\n', style: 'textoBold10' },
              { text: cotizacion.direccion, style: 'texto' },
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

              body: [
                [
                  'R U C N° ' +
                    cotizacion.ruc +
                    '\n\nCOTIZACIÓN\n\n' +
                    cotizacion.serie +
                    ' - ' +
                    cerosALaIzquierda(cotizacion.numero, 8) +
                    '\n',
                ],
              ],
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
          { width: '20%', margin: [50, 20, 0, 0], text: { text: 'FECHA:', style: 'textoBold' } },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 20, 0, 0],
            // alignment: 'center',
            text: { text: formatoDDMMYYYY_PEN(cotizacion.fecha), style: 'texto' },
          },
        ],
      },
      {
        columns: [
          {
            width: '20%',
            margin: [50, 4, 0, 0],
            text: { text: cotizacion.tipoDocumentoIdentidad + ':', style: 'textoBold' },
          },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: cotizacion.numeroIdentidad, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          { width: '20%', margin: [50, 4, 0, 0], text: { text: 'CLIENTE:', style: 'textoBold' } },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: cotizacion.razonSocialNombre, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          { width: '20%', margin: [50, 4, 0, 0], text: { text: 'PLACA:', style: 'textoBold' } },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: cotizacion.placa, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          { width: '20%', margin: [50, 4, 0, 0], text: { text: 'VIN:', style: 'textoBold' } },
          {
            width: '80%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
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
            text: { text: 'TOTAL PEN ' + formatearMonedaPEN(totalServicios + totalRepuestos), style: 'textoBold10' },
            alignment: 'right',
          },
        ],
      },
      //OBSERVACIONES
      { margin: [50, 30, 0, 0], text: 'Observaciones:', style: 'texto7' },
      {
        // margin: [izq, top, der, button],
        margin: [50, 0, 30, 0],
        ul: [
          'ALGUN REPUESTO O SERVICIO ADICIONAL A LA COTIZACIÓN, PREVIO AVISO, LO ASUMIRÁ EL PROPIETARIO.',
          'EL STOCK DISPONIBLE PUEDE VARIAR SEGÚN EL TIEMPO DE CONFIRMACIÓN DE COMPRA DEL MISMO.',
          'EL TIEMPO PROMEDIO DE IMPORTACIÓN DE REPUESTOS ES DE 30 DÍAS HÁBILES.',
          'ESTA COTIZACIÓN TIENE UNA VIGENCIA DE 7 DÍAS.',
        ],
        style: 'texto7',
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
      texto7: {
        fontSize: 7,
        color: '#50575E',
      },
      texto10: {
        fontSize: 10,
        color: '#50575E',
      },
    },
    images: {
      logo: logit.logoMrBier,
      poweredBy: logit.logoPiePagina,
      // poweredBy: images.logoPiePagina,

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

export default pdfCotizacionMG;
