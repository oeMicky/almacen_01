import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../assets/fonts/vfs_fonts';
import { cerosALaIzquierda, formatearMonedaPEN, formatoDDMMYYYY_PEN, redondeo2Decimales } from '~/functions/comunes';
import logit from '../../assets/base64/imagesBase64.js';
import { parametrosGlobales } from '~/routes/login';

async function pdfReporteVenta(ventas: any) {
  pdfMake.vfs = pdfFonts;

  console.log('ventas PDF', ventas);

  const LOGO_EMPRESA = await import(`../../assets/logosEmpresas/${parametrosGlobales.RUC}.js`);

  const reportTitle: any = [];

  let totalMercaderias = 0;
  let totalServicios = 0;
  let total = 0;

  const LasVentas = ventas.map((vent: any, index: number) => {
    const { tipoDocumentoIdentidad, numeroIdentidad, razonSocialNombre, fecha, serie, numero, totalPEN, ganancias } = vent;
    const indexItem = index + 1;
    let mer = 0;
    let ser = 0;
    // let tot = 0;

    const aMer: any = ganancias.find((element: any) => element.tipo === 'MERCADERIA');
    if (typeof aMer !== 'undefined') {
      mer = aMer.gan.$numberDecimal ? aMer.gan.$numberDecimal : aMer.gan;
    }
    const aSer: any = ganancias.find((element: any) => element.tipo === 'SERVICIO');
    if (typeof aSer !== 'undefined') {
      ser = aSer.gan.$numberDecimal ? aSer.gan.$numberDecimal : aSer.gan;
    }

    totalMercaderias = totalMercaderias + redondeo2Decimales(mer);
    totalServicios = totalServicios + redondeo2Decimales(ser);
    total = total + redondeo2Decimales(totalPEN.$numberDecimal);
    return [
      { text: indexItem, style: 'tableBody' },
      { text: tipoDocumentoIdentidad + ': ' + numeroIdentidad, style: 'tableBody' },
      { text: razonSocialNombre, style: 'tableBody' },
      { text: formatoDDMMYYYY_PEN(fecha), style: 'tableBody' },
      { text: serie + '-' + cerosALaIzquierda(numero, 8), style: 'tableBody' },
      {
        text: formatearMonedaPEN(mer),
        style: 'tableBodyRight',
      },
      {
        text: formatearMonedaPEN(ser),
        style: 'tableBodyRight',
      },
      {
        text: formatearMonedaPEN(totalPEN.$numberDecimal),
        style: 'tableBodyRight',
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
          { width: '24%', margin: [45, 11, 0, 2], image: 'logoEmp', fit: [190, 66] },
          {
            width: '76%',
            margin: [20, 16, 18, 0],
            alignment: 'right',
            text: [
              { text: parametrosGlobales.RazonSocial + '\n', style: 'textoBold9' },
              { text: parametrosGlobales.RUC + '\n', style: 'textoBold9' },
              { text: parametrosGlobales.Direccion, style: 'textoBold9' },
            ],
          },
        ],
      },
      //DATOS CLIENTE - VEHICULO
      // margin: [izq, top, der, button],
      // {
      //   columns: [
      //     { width: '20%', margin: [50, 20, 0, 0], text: { text: 'FECHA:', style: 'textoBold' } },
      //     {
      //       width: '80%',
      //       fontSize: 6,
      //       margin: [0, 20, 0, 0],
      //       // alignment: 'center',
      //       text: { text: formatoDDMMYYYY_PEN(cotizacion.fecha), style: 'texto' },
      //     },
      //   ],
      // },
      // {
      //   columns: [
      //     {
      //       width: '20%',
      //       margin: [50, 4, 0, 0],
      //       text: { text: cotizacion.tipoDocumentoIdentidad + ':', style: 'textoBold' },
      //     },
      //     {
      //       width: '80%',
      //       fontSize: 6,
      //       margin: [0, 4, 0, 0],
      //       // alignment: 'center',
      //       text: { text: cotizacion.numeroIdentidad, style: 'texto' },
      //     },
      //   ],
      // },
      // {
      //   columns: [
      //     { width: '20%', margin: [50, 4, 0, 0], text: { text: 'CLIENTE:', style: 'textoBold' } },
      //     {
      //       width: '80%',
      //       fontSize: 6,
      //       margin: [0, 4, 0, 0],
      //       // alignment: 'center',
      //       text: { text: cotizacion.razonSocialNombre, style: 'texto' },
      //     },
      //   ],
      // },
      // {
      //   columns: [
      //     { width: '20%', margin: [50, 4, 0, 0], text: { text: 'PLACA:', style: 'textoBold' } },
      //     {
      //       width: '80%',
      //       fontSize: 6,
      //       margin: [0, 4, 0, 0],
      //       // alignment: 'center',
      //       text: { text: cotizacion.placa, style: 'texto' },
      //     },
      //   ],
      // },
      // {
      //   columns: [
      //     { width: '20%', margin: [50, 4, 0, 0], text: { text: 'VIN:', style: 'textoBold' } },
      //     {
      //       width: '80%',
      //       fontSize: 6,
      //       margin: [0, 4, 0, 0],
      //       // alignment: 'center',
      //       text: { text: cotizacion.vin, style: 'texto' },
      //     },
      //   ],
      // },
      // //LAS VENTAS
      {
        columns: [{ width: '30%', margin: [50, 10, 0, 0], text: { text: 'REPORTE DE VENTA:', style: 'textoBold10' } }],
      },
      {
        // margin: [izq, top, der, button],
        margin: [30, 10, 30, 3],
        style: 'tableExample',
        table: {
          headerRows: 1,
          //
          // widths: ['*', 'auto', '*', '*', '*', '*'],
          widths: [13, 56, 130, 32, 43, '*', '*', '*'],
          body: [
            [
              { text: 'Ítem', style: 'tableHeaderLightCenter' },
              { text: 'Nro. Doc', style: 'tableHeaderLightCenter' },
              { text: 'Cliente', style: 'tableHeaderLightCenter' },
              { text: 'Fecha', style: 'tableHeaderLightCenter' },
              { text: 'Ser-Nro', style: 'tableHeaderLightCenter' },
              { text: 'GAxM', style: 'tableHeaderLightCenter' },
              { text: 'GAxS', style: 'tableHeaderLightCenter' },
              { text: 'Importe', style: 'tableHeaderLightCenter' },
            ],
            ...LasVentas,
            [
              { text: '', style: 'tableHeaderLight' },
              { text: '', style: 'tableHeaderLight' },
              { text: '', style: 'tableHeaderLight' },
              { text: '', style: 'tableHeaderLight' },
              { text: 'TOTALES', style: 'tableHeaderLightRight' },
              { text: formatearMonedaPEN(totalMercaderias), style: 'tableHeaderLightRight' },
              { text: formatearMonedaPEN(totalServicios), style: 'tableHeaderLightRight' },
              { text: formatearMonedaPEN(total), style: 'tableHeaderLightRight' },
            ],
          ],
        },
        // layout: 'itemsVentaLayout', //{ defaultBorder: false }, //'lightHorizontalLines', // 'noBorders', //'lightHorizontalLines',
        layout: 'noBorders',
      },
      // {
      //   columns: [
      //     {
      //       width: '100%',
      //       margin: [0, 0, 30, 0],
      //       text: { text: 'SUBTOTAL ' + formatearMonedaPEN(totalRepuestos), style: 'tableBodyRight' },
      //       alignment: 'right',
      //     },
      //   ],
      // },
      // //TOTAL
      // {
      //   columns: [
      //     {
      //       margin: [0, 5, 30, 0],
      //       text: { text: 'TOTAL ' + formatearMonedaPEN(totalServicios + totalRepuestos), style: 'textoBold10' },
      //       alignment: 'right',
      //     },
      //   ],
      // },
      // //OBSERVACIONES
      // { margin: [50, 30, 0, 0], text: 'Observaciones:', style: 'texto7' },
      // {
      //   // margin: [izq, top, der, button],
      //   margin: [50, 0, 30, 0],
      //   ul: [
      //     'ALGUN REPUESTO O SERVICIO ADICIONAL A LA COTIZACIÓN, PREVIO AVISO, LO ASUMIRÁ EL PROPIETARIO.',
      //     'EL STOCK DISPONIBLE PUEDE VARIAR SEGÚN EL TIEMPO DE CONFIRMACIÓN DE COMPRA DEL MISMO.',
      //     'EL TIEMPO PROMEDIO DE IMPORTACIÓN DE REPUESTOS ES DE 30 DÍAS HÁBILES.',
      //     'ESTA COTIZACIÓN TIENE UNA VIGENCIA DE 7 DÍAS.',
      //   ],
      //   style: 'texto7',
      // },
    ],
    footer: Pie,

    styles: {
      tableExample: {
        margin: [0, 0, 0, 15],
      },
      tableHeaderLight: {
        bold: true,
        fontSize: 6,
        // fillColor: '#d9d9d9',
        fillColor: '#1D65BE',
        // color: 'black',
        color: 'white',
        alignment: 'start',
        // border: [false, false, false, false],
      },
      tableHeaderLightCenter: {
        bold: true,
        fontSize: 6,
        // fillColor: '#d9d9d9',
        fillColor: '#1D65BE',
        // color: 'black',
        color: 'white',
        alignment: 'center',
        // border: [false, false, false, false],
      },
      tableHeaderLightRight: {
        bold: true,
        fontSize: 6,
        // fillColor: '#d9d9d9',
        fillColor: '#1D65BE',
        // color: 'black',
        color: 'white',
        alignment: 'right',
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
        fontSize: 6,
        color: '#50575E',
        alignment: 'center',
      },
      tableBodyRight: {
        fontSize: 6,
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
      // logo: logit.logoMerma,
      logoEmp: LOGO_EMPRESA.default,
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

export default pdfReporteVenta;
