import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../assets/fonts/vfs_fonts';
import {
  cerosALaIzquierda,
  formatear6_MonedaPEN,
  formatear_6Decimales,
  // formatearMonedaPEN,
  // formatearNumeroINT,
  // formatearMonedaUSD,
  // formatear_4Decimales,
  // formatear_6Decimales,
  formatoDDMMYYYY_PEN,
  // literal,
  // redondeo2Decimales,
  redondeo6Decimales,
} from '~/functions/comunes';
import logit from '../assets/base64/imagesBase64.js';
import { parametrosGlobales } from '~/routes/login';
// import { parametrosGlobales } from "~/routes/login";

async function pdfOrdenProduccion(op: any) {
  pdfMake.vfs = pdfFonts;

  //console.log('op PDF', op);

  // const LOGO_EMPRESA = await import(`../../assets/logosEmpresas/${parametrosGlobales.RUC}.js`);
  const LOGO_EMPRESA = await import(`../assets/logosEmpresas/${parametrosGlobales.RUC}.js`);

  const manufacturas = op.manufacturas;
  // let repuestosDespachados: any = [];
  const suministrosDespachados = op.requisiciones.filter((plot: any) => plot.cantidadDespachada.$numberDecimal - plot.cantidadReingresada.$numberDecimal > 0);
  //console.log('suministrosDespachadosyyyyyyy', suministrosDespachados);
  let totalManufacturas = 0;
  let totalSuministros = 0;

  const reportTitle: any = [];
  // const details = [];
  // const rodape = [];

  const lasManufacturas = manufacturas.map((ser: any, index: number) => {
    // //console.log("pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS...");
    const { descripcion, cantidad, unidad, costoUnitarioPEN, costoTotalPEN } = ser;
    const indexItem = index + 1;
    totalManufacturas = totalManufacturas + redondeo6Decimales(costoTotalPEN.$numberDecimal ? costoTotalPEN.$numberDecimal : costoTotalPEN);
    return [
      { text: indexItem, style: 'tableBody' },
      // { text: codigo, style: 'tableBody' },
      { text: descripcion, style: 'tableBody' },
      {
        text: formatear6_MonedaPEN(cantidad.$numberDecimal),
        style: 'tableBodyRight',
      },
      { text: unidad, style: 'tableBody' },
      {
        text: formatear6_MonedaPEN(costoUnitarioPEN.$numberDecimal),
        style: 'tableBodyRight',
      },
      {
        text: formatear6_MonedaPEN(costoTotalPEN.$numberDecimal),
        style: 'tableBodyRight',
      },
    ];
  });

  // const losSuministros = [{}];
  const losSuministros = suministrosDespachados.map((repu: any, index: number) => {
    // //console.log("pdfOP..SUMI.pdfOP..SUMI.pdfOP..SUMI.pdfO}P..SUMI.pdfOP..SUMI.pdfOP..SUMI.pdfOP..SUMI.pdfOP...");
    const { codigo, descripcionEquivalencia, cantidadDespachada, cantidadReingresada, unidadEquivalencia, costoUnitarioEquivalenciaPEN } = repu;

    // //console.log("cantidadDespachada - cantidadDespachada.$numberDecimal", cantidadDespachada, cantidadDespachada.$numberDecimal);
    // //console.log("cantidadReingresada - cantidadReingresada.$numberDecimal", cantidadReingresada, cantidadReingresada.$numberDecimal);
    if (cantidadDespachada.$numberDecimal - cantidadReingresada.$numberDecimal > 0) {
      // //console.log("🧨🧨🧨🧨", cantidadDespachada.$numberDecimal, cantidadReingresada.$numberDecimal);
      const indexItem = index + 1;
      totalSuministros =
        totalSuministros +
        redondeo6Decimales((cantidadDespachada.$numberDecimal - cantidadReingresada.$numberDecimal) * costoUnitarioEquivalenciaPEN.$numberDecimal);
      return [
        { text: indexItem, style: 'tableBody' },
        { text: codigo, style: 'tableBody' },
        { text: descripcionEquivalencia, style: 'tableBody' },
        {
          text: formatear6_MonedaPEN(cantidadDespachada.$numberDecimal - cantidadReingresada.$numberDecimal),
          style: 'tableBodyRight',
        },
        { text: unidadEquivalencia, style: 'tableBody' },
        {
          text: formatear6_MonedaPEN(costoUnitarioEquivalenciaPEN.$numberDecimal),
          style: 'tableBodyRight',
        },
        {
          text: formatear6_MonedaPEN((cantidadDespachada.$numberDecimal - cantidadReingresada.$numberDecimal) * costoUnitarioEquivalenciaPEN.$numberDecimal),
          style: 'tableBodyRight',
        },
      ];
    }
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
              { text: op.empresa + '\n', style: 'texto' },
              { text: 'Sucursal\n', style: 'textoBold10' },
              { text: op.sucursal + '\n', style: 'texto' },
              { text: 'Dirección fiscal\n', style: 'textoBold10' },
              { text: op.direccion, style: 'texto' },
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

              body: [['R U C N° ' + op.ruc + '\n\nORDEN DE PRODUCCION\n\n' + op.serie + ' - ' + cerosALaIzquierda(op.numero, 8) + '\n']],
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
          {
            width: '18%',
            margin: [50, 20, 0, 0],
            text: { text: op.tipoDocumentoIdentidad + ':', style: 'textoBold' },
          },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 20, 0, 0],
            // alignment: 'center',
            text: { text: op.numeroIdentidad, style: 'texto' },
          },
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
            text: { text: formatoDDMMYYYY_PEN(op.fechaInicio), style: 'texto' },
          },
        ],
      },
      {
        columns: [
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'CLIENTE:', style: 'textoBold' } },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: op.razonSocialNombreCliente, style: 'texto' },
          },
          { width: '16%', margin: [50, 4, 0, 0], text: { text: 'ESTADO:', style: 'textoBold' } },
          {
            width: '24%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: op.estado, style: 'texto' },
          },
        ],
      },
      //DATOS TECNICO
      {
        columns: [
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'TECNICO:', style: 'textoBold' } },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: op.razonSocialNombreTecnico, style: 'texto' },
          },
          { width: '16%', margin: [50, 4, 0, 0], text: { text: 'TIPO:', style: 'textoBold' } },
          {
            width: '24%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: op.tipo, style: 'texto' },
          },
        ],
      },
      //REQUERIMIENTO DEL CLIENTE
      {
        columns: [{ width: '100%', margin: [50, 10, 0, 0], text: { text: 'REQUERIMIENTO DEL CLIENTE:', style: 'textoBold10' } }],
      },
      {
        columns: [{ width: '100%', margin: [50, 10, 0, 0], text: { text: op.requerimientosCliente, style: 'texto' } }],
      },
      //OBSERVACIONES
      {
        columns: [{ width: '100%', margin: [50, 10, 0, 0], text: { text: 'OBSERVACIONES:', style: 'textoBold10' } }],
      },
      {
        columns: [{ width: '100%', margin: [50, 10, 0, 0], text: { text: op.observacionesCliente, style: 'texto' } }],
      },
      //MANUFACTURAS
      {
        columns: [{ width: '24%', margin: [50, 10, 0, 0], text: { text: 'MANUFACTURAS:', style: 'textoBold10' } }],
      },
      {
        // margin: [izq, top, der, button],
        margin: [30, 10, 30, 3],
        style: 'tableExample',
        table: {
          headerRows: 1,
          // widths: ['*', 'auto', '*', '*', '*', '*'],
          widths: ['*', 'auto', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Ítem', style: 'tableHeaderLight' },
              // { text: 'Código', style: 'tableHeaderLight' },
              { text: 'Descripción', style: 'tableHeaderLight' },
              { text: 'Cantidad', style: 'tableHeaderLightRight' },
              { text: 'Uni', style: 'tableHeaderLight' },
              { text: 'Costo Uni', style: 'tableHeaderLightRight' },
              { text: 'Costo Total', style: 'tableHeaderLightRight' },
            ],
            ...lasManufacturas,
          ],
        },
        // layout: 'itemsVentaLayout', //{ defaultBorder: false }, //'lightHorizontalLines', // 'noBorders', //'lightHorizontalLines',
        layout: 'noBorders',
      },
      {
        columns: [
          {
            width: '100%',
            // margin: [0, 0, 60, 0],
            margin: [0, 0, 30, 0],
            text: { text: 'TOTAL PEN   ' + formatear6_MonedaPEN(totalManufacturas), style: 'tableBodyRight' },
            // alignment: "right",
          },
        ],
      },
      //SUMINISTROS
      {
        columns: [{ width: '35%', margin: [50, 10, 0, 0], text: { text: 'SUMINISTROS :', style: 'textoBold10' } }],
      },
      {
        // margin: [izq, top, der, button],
        margin: [30, 10, 30, 3],
        style: 'tableExample',
        table: {
          headerRows: 1,
          // widths: ['*', 'auto', '*', '*', '*', '*'],
          widths: ['*', '*', 'auto', '*', '*', '*', '*'],
          body: [
            [
              { text: 'Ítem', style: 'tableHeaderLight' },
              { text: 'Código', style: 'tableHeaderLight' },
              { text: 'Descripción', style: 'tableHeaderLight' },
              { text: 'Cantidad', style: 'tableHeaderLightRight' },
              { text: 'Uni', style: 'tableHeaderLight' },
              { text: 'Costo Uni', style: 'tableHeaderLightRight' },
              { text: 'Costo Total', style: 'tableHeaderLightRight' },
            ],
            ...losSuministros,
          ],
        },
        layout: 'noBorders',
      },
      {
        columns: [
          {
            width: '100%',
            // margin: [0, 0, 47, 0],
            margin: [0, 0, 30, 0],
            text: { text: 'TOTAL PEN   ' + formatear6_MonedaPEN(totalSuministros), style: 'tableBodyRight' },
            // alignment: "right",
          },
        ],
      },
      //TOTAL - COSTO DE PRODUCCION - COSTO UNITARIO DE PRODUCCION
      // margin: [izq, top, der, button],
      {
        columns: [
          {
            margin: [50, 16, 30, 0],
            text: { text: 'COSTOS DE PRODUCCION TOTAL PEN:   ' + formatear6_MonedaPEN(totalManufacturas + totalSuministros), style: 'textoBold9' },
            alignment: 'left',
          },
        ],
      },
      {
        columns: [
          {
            margin: [50, 5, 30, 0],
            text: { text: 'DIVISOR:   ' + op.divisor.$numberDecimal, style: 'textoBold9' },
            alignment: 'left',
          },
        ],
      },
      {
        columns: [
          {
            margin: [50, 5, 30, 0],
            text: {
              text: 'COSTOS UNITARIO DE PRODUCCION PEN:   ' + formatear6_MonedaPEN((totalManufacturas + totalSuministros) / op.divisor.$numberDecimal),
              style: 'textoBold9',
            },
            alignment: 'left',
          },
        ],
      },
      //PORCENTQAJE DE UTILIDAD -  PRECIO VENTA SUGERIDO SIN IGV
      // margin: [izq, top, der, button],
      {
        columns: [
          {
            margin: [50, 16, 30, 0],
            text: { text: 'PORCENTAJE DE UTILIDAD (%):   ' + formatear_6Decimales(op.porcentajeUtilidad.$numberDecimal), style: 'tableBodyLeft' },
            // alignment: "left",
          },
        ],
      },
      {
        columns: [
          {
            margin: [50, 5, 30, 0],
            // text: { text: "PRECIO VENTA SUGERIDO SIN IGV PEN:   " + formatear6_MonedaPEN(op.precioVentaSugeridoSinIGV.$numberDecimal), style: "tableBodyLeft" },
            text: {
              text:
                'PRECIO VENTA SUGERIDO SIN IGV PEN:   ' +
                formatear6_MonedaPEN(
                  (100 * ((totalManufacturas + totalSuministros) / op.divisor.$numberDecimal)) / (100 - op.porcentajeUtilidad.$numberDecimal)
                ),
              style: 'tableBodyLeft',
            },
            // alignment: "left",
          },
        ],
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

export default pdfOrdenProduccion;

//  //COSTOS DE PRODUCCION
//       // margin: [izq, top, der, button],
//       {
//         columns: [{ width: "100%", margin: [50, 10, 0, 0], text: { text: "COSTOS DE PRODUCCION:", style: "textoBold10" } }],
//       },
//       {
//         columns: [
//           { width: "22%", margin: [50, 4, 0, 0], text: { text: "MANUFACTURAS:", style: "texto" } },
//           {
//             width: "28%",
//             fontSize: 6,
//             margin: [0, 4, 0, 0],
//             // alignment: 'center',
//             text: { text: formatearMonedaPEN(totalManufacturas), style: "texto" },
//           },
//           { width: "16%", margin: [50, 4, 0, 0], text: { text: "DIVISOR:", style: "textoBold" } },
//           {
//             width: "34%",
//             fontSize: 6,
//             margin: [0, 4, 0, 0],
//             // alignment: 'center',
//             text: { text: formatear_4Decimales(op.divisor.$numberDecimal), style: "texto" },
//           },
//           // {
//           //   width: "100%",
//           //   margin: [50, 10, 30, 0],

//           //   text: { text: "MANUFACTURAS " + formatearMonedaPEN(totalManufacturas), style: "tableBodyLeft" },
//           //   // alignment: "left",
//           // },
//         ],
//       },
//       {
//         columns: [
//           { width: "22%", margin: [50, 4, 0, 0], text: { text: "SUMINISTROS:", style: "texto" } },
//           {
//             width: "28%",
//             fontSize: 6,
//             margin: [0, 4, 0, 0],
//             // alignment: 'center',
//             text: { text: formatearMonedaPEN(totalSuministros), style: "texto" },
//           },
//           // {
//           //   width: "100%",
//           //   margin: [50, 4, 30, 0],
//           //   text: { text: "SUMINISTROS " + formatearMonedaPEN(totalSuministros), style: "tableBodyLeft" },
//           //   // alignment: "left",
//           // },
//         ],
//       },
//       {
//         columns: [
//           { width: "22%", margin: [50, 4, 0, 0], text: { text: "TOTAL PEN:", style: "texto" } },
//           {
//             width: "28%",
//             fontSize: 6,
//             margin: [0, 4, 0, 0],
//             // alignment: 'center',
//             text: { text: formatearMonedaPEN(totalManufacturas + totalSuministros), style: "texto" },
//           },
//           { width: "34%", margin: [50, 4, 0, 0], text: { text: "COSTO UNITARIO DE PRODUCCIÓN:", style: "textoBold" } },
//           {
//             width: "16%",
//             fontSize: 6,
//             margin: [0, 4, 0, 0],
//             // alignment: 'center',
//             text: { text: formatearMonedaPEN((totalManufacturas + totalSuministros) / op.divisor.$numberDecimal), style: "texto" },
//           },
//           // {
//           //   width: "100%",
//           //   margin: [50, 4, 30, 0],
//           //   text: { text: "TOTAL PEN" + formatearMonedaPEN(totalManufacturas + totalSuministros), style: "tableBodyLeft" },
//           //   // alignment: "left",
//           // },
//         ],
//       },
