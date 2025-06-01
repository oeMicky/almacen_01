import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../assets/fonts/vfs_fonts';
// import // cerosALaIzquierda,
// // formatear6_MonedaPEN,
// // formatear_6Decimales,

// formatearMonedaPEN
// // formatearNumeroINT,
// // formatearMonedaUSD,
// // formatear_4Decimales,
// // formatear_6Decimales,
// // formatoDDMMYYYY_PEN,
// // literal,
// // redondeo2Decimales,
// // redondeo6Decimales,
// '~/functions/comunes';
import logit from '../assets/base64/imagesBase64.js';
import { parametrosGlobales } from '~/routes/login';
import { cerosALaIzquierda, formatearMonedaPEN, redondeo6Decimales } from '~/functions/comunes';
// import { parametrosGlobales } from "~/routes/login";

async function pdfNotasVentaDelDia(regNVs: any) {
  pdfMake.vfs = pdfFonts;

  //console.log('op PDF', op);

  // const LOGO_EMPRESA = await import(`../../assets/logosEmpresas/${parametrosGlobales.RUC}.js`);
  const LOGO_EMPRESA = await import(`../assets/logosEmpresas/${parametrosGlobales.RUC}.js`);

  // const manufacturas = regNVs.manufacturas;
  // let repuestosDespachados: any = [];
  // const suministrosDespachados = regNVs.requisiciones.filter(
  //   (plot: any) => plot.cantidadDespachada.$numberDecimal - plot.cantidadReingresada.$numberDecimal > 0
  // );
  //console.log('suministrosDespachadosyyyyyyy', suministrosDespachados);
  let PtotalPEN = 0;
  let PtotalEFECTIVO = 0;
  let PtotalOTRO = 0;
  let PtotalCREDITO = 0;

  const reportTitle: any = [];
  // const details = [];
  // const rodape = [];

  const lasNotasVentas = regNVs.map((ser: any, index: number) => {
    // //console.log("pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS...");fechaLocal
    const {
      clienteSobrenombreChapa,
      observacion,
      serie,
      numero,
      totalPEN,
      moneda,
      metodoPago,
      montoEnEfectivo,
      otroMedioPago,
      montoOtroMedioPago,
      importeTotalCuotasCredito,
    } = ser;
    const indexItem = index + 1;
    PtotalPEN = PtotalPEN + redondeo6Decimales(totalPEN.$numberDecimal ? totalPEN.$numberDecimal : totalPEN);
    PtotalEFECTIVO = PtotalEFECTIVO + redondeo6Decimales(montoEnEfectivo.$numberDecimal ? montoEnEfectivo.$numberDecimal : montoEnEfectivo);
    PtotalOTRO = PtotalOTRO + redondeo6Decimales(montoOtroMedioPago.$numberDecimal ? montoOtroMedioPago.$numberDecimal : montoOtroMedioPago);
    PtotalCREDITO =
      PtotalCREDITO + redondeo6Decimales(importeTotalCuotasCredito.$numberDecimal ? importeTotalCuotasCredito.$numberDecimal : importeTotalCuotasCredito);
    return [
      { text: indexItem, style: 'tableBody7' },
      // { text: codigo, style: 'tableBody' },
      { text: clienteSobrenombreChapa, style: 'tableBody7' },
      // { text: observacion.substring(0, 20), style: 'tableBody' },
      { text: observacion, style: 'tableBody7' },
      { text: serie + '-' + cerosALaIzquierda(numero, 8), style: 'tableBody7' },
      {
        text: formatearMonedaPEN(totalPEN.$numberDecimal),
        style: 'tableBodyRight7',
      },
      { text: moneda, style: 'tableBody7' },
      { text: metodoPago, style: 'tableBody7' },
      {
        text: formatearMonedaPEN(montoEnEfectivo.$numberDecimal),
        style: 'tableBodyRight7',
      },
      { text: otroMedioPago, style: 'tableBody7' },
      {
        text: formatearMonedaPEN(montoOtroMedioPago.$numberDecimal),
        style: 'tableBodyRight7',
      },
      {
        text: formatearMonedaPEN(importeTotalCuotasCredito.$numberDecimal),
        style: 'tableBodyRight7',
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
              { text: parametrosGlobales.RazonSocial + '\n', style: 'texto' },
              { text: 'Sucursal\n', style: 'textoBold10' },
              { text: parametrosGlobales.sucursal + '\n', style: 'texto' },
              { text: 'Dirección fiscal\n', style: 'textoBold10' },
              { text: parametrosGlobales.Direccion, style: 'texto' },
            ],
          },
          // {
          //   width: '40%',
          //   margin: [22, 11, 34, 0],
          //   alignment: 'center',
          //   table: {
          //     // headers are automatically repeated if the table spans over multiple pages
          //     // you can declare how many rows should be treated as headers
          //     headerRows: 0,
          //     widths: ['*'],

          //     body: [['R U C N° ' + parametrosGlobales.RUC + '\n\nORDEN DE PRODUCCION\n\n' + regNVs.serie + ' - ' + cerosALaIzquierda(regNVs.numero, 8) + '\n']],
          //   },
          //   // text: [
          //   //   { text: 'R U C N° 20602683321\n', style: 'textoBold10' },
          //   //   { text: '\n', style: 'texto6' },
          //   //   { text: 'COTIZACIÓN\n', style: 'textoBold10' },
          //   //   { text: '\n', style: 'texto6' },
          //   //   { text: cerosALaIzquierda(cotizacion.correlativo, 8) + '\n', style: 'textoBold10' },
          //   // ],
          // },
        ],
      },

      //MANUFACTURAS
      // {
      //   columns: [{ width: '24%', margin: [50, 10, 0, 0], text: { text: 'MANUFACTURAS:', style: 'textoBold10' } }],
      // },
      {
        // margin: [izq, top, der, button],
        margin: [3, 10, 3, 3],
        style: 'tableExample',
        table: {
          headerRows: 1,
          // widths: ['*', 'auto', '*', '*', '*', '*'],
          // widths: ['*', 'auto', '*', '*', '*', '*'],
          widths: [16, '*', '*', '*', 40, 16, 34, 40, '*', 40, 40],
          body: [
            [
              { text: 'Ítem', style: 'tableHeaderLight7' },
              { text: 'Cliente', style: 'tableHeaderLight7' },
              { text: 'Observación', style: 'tableHeaderLight7' },
              { text: 'Ser-Nro', style: 'tableHeaderLight7' },
              { text: 'Importe', style: 'tableHeaderLight7' },
              { text: 'Mon', style: 'tableHeaderLight7' },
              { text: 'Met. Pago', style: 'tableHeaderLight7' },
              { text: 'Efectivo', style: 'tableHeaderLightRight7' },
              { text: 'O.M.Pago', style: 'tableHeaderLightRight7' },
              { text: 'Monto O.M.Pago', style: 'tableHeaderLightRight7' },
              { text: 'Crédito', style: 'tableHeaderLightRight7' },
            ],
            ...lasNotasVentas,
            [
              { text: '', style: 'tableHeaderLight7' },
              { text: '', style: 'tableHeaderLight7' },
              { text: '', style: 'tableHeaderLight7' },
              { text: '', style: 'tableHeaderLight7' },
              { text: formatearMonedaPEN(PtotalPEN), style: 'tableHeaderLightRight7' },
              { text: '', style: 'tableHeaderLight7' },
              { text: '', style: 'tableHeaderLight7' },
              { text: formatearMonedaPEN(PtotalEFECTIVO), style: 'tableHeaderLightRight7' },
              { text: '', style: 'tableHeaderLightRight7' },
              { text: formatearMonedaPEN(PtotalOTRO), style: 'tableHeaderLightRight7' },
              { text: formatearMonedaPEN(PtotalCREDITO), style: 'tableHeaderLightRight7' },
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
      //       // margin: [0, 0, 60, 0],
      //       margin: [0, 0, 30, 0],
      //       text: { text: 'TOTAL PEN   ' + formatear6_MonedaPEN(totalManufacturas), style: 'tableBodyRight' },
      //       // alignment: "right",
      //     },
      //   ],
      // },

      //TOTAL - COSTO DE PRODUCCION - COSTO UNITARIO DE PRODUCCION
      // margin: [izq, top, der, button],
      // {
      //   columns: [
      //     {
      //       margin: [50, 16, 30, 0],
      //       text: { text: 'COSTOS DE PRODUCCION TOTAL PEN:   ' + formatear6_MonedaPEN(totalManufacturas + totalSuministros), style: 'textoBold9' },
      //       alignment: 'left',
      //     },
      //   ],
      // },
      // {
      //   columns: [
      //     {
      //       margin: [50, 5, 30, 0],
      //       text: { text: 'DIVISOR:   ' + op.divisor.$numberDecimal, style: 'textoBold9' },
      //       alignment: 'left',
      //     },
      //   ],
      // },
      // {
      //   columns: [
      //     {
      //       margin: [50, 5, 30, 0],
      //       text: {
      //         text: 'COSTOS UNITARIO DE PRODUCCION PEN:   ' + formatear6_MonedaPEN((totalManufacturas + totalSuministros) / op.divisor.$numberDecimal),
      //         style: 'textoBold9',
      //       },
      //       alignment: 'left',
      //     },
      //   ],
      // },
    ],
    footer: Pie,

    styles: {
      tableExample: {
        margin: [0, 0, 0, 15],
      },
      tableHeaderLight7: {
        bold: true,
        fontSize: 7,
        fillColor: '#d9d9d9',
        color: 'black',
        // alignment: 'start',
        alignment: 'center',
        // border: [false, false, false, false],
      },
      tableHeaderLightRight7: {
        bold: true,
        fontSize: 7,
        fillColor: '#d9d9d9',
        color: 'black',
        // alignment: 'start',
        alignment: 'right',
        // border: [false, false, false, false],
      },
      tableHeader7: {
        bold: true,
        fontSize: 7,
        fillColor: '#34495E',
        color: 'white',
        alignment: 'center',
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
      tableHeader: {
        bold: true,
        fontSize: 8,
        fillColor: '#34495E',
        color: 'white',
        alignment: 'center',
        // border: [false, false, false, false],
      },
      tableBody7: {
        fontSize: 7,
        color: '#50575E',
        alignment: 'center',
      },
      tableBodyLeft7: {
        fontSize: 7,
        color: '#50575E',
        alignment: 'left',
      },
      tableBodyRight7: {
        fontSize: 7,
        color: '#50575E',
        alignment: 'right',
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

export default pdfNotasVentaDelDia;
