import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../assets/fonts/vfs_fonts';
import { parametrosGlobales } from '~/routes/login'; //formatoDDMMYYYY_PEN formatearMonedaPEN redondeo2Decimales formatear6_MonedaPEN
// import { cerosALaIzquierda } from '~/functions/comunes';
import logit from '../assets/base64/imagesBase64';
import { cerosALaIzquierda, formatear6_MonedaPEN, formatearMonedaPEN, redondeo2Decimales } from '~/functions/comunes';
import QRCode from 'qrcode';

async function pdfNotaVenta(notaVenta: any) {
  pdfMake.vfs = pdfFonts;

  //console.log('factura PDF', factura);

  const LOGO_EMPRESA = await import(`../assets/logosEmpresas/${parametrosGlobales.RUC}_black.js`);

  //#region ITEMS
  const items = notaVenta.itemsNotaVenta;

  const losItems = items.map((it: any) => {
    console.log('losItems...............losItems.........................losItems', it); //  index: number  ventaPEN, ventaUSD,
    const { descripcionEquivalencia, cantidadEquivalencia, unidadEquivalencia, precioUnitarioPEN, precioUnitarioUSD, ventaPEN, ventaUSD, porcentaje } = it;
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
      { border: [false, false, false, true], text: descripcionEquivalencia, style: 'texto' },
      { border: [false, false, false, true], text: formatearMonedaPEN(cantidadEquivalencia.$numberDecimal), style: 'texto8Derecho' },
      //   { text: unidadEquivalencia, style: 'tableBody' },

      // {
      //   text: factura.moneda === 'PEN' ? formatear6_MonedaPEN(precioUnitarioPEN.$numberDecimal) : formatear6_MonedaPEN(precioUnitarioUSD.$numberDecimal),
      //   style: 'tableBodyRight',
      // },
      {
        border: [false, false, false, true],
        text: notaVenta.moneda === 'PEN' ? formatearMonedaPEN(precioUnitarioPEN.$numberDecimal) : formatear6_MonedaPEN(precioUnitarioUSD.$numberDecimal),
        style: 'texto8Derecho',
      },
      {
        border: [false, false, false, true],
        text: notaVenta.moneda === 'PEN' ? formatearMonedaPEN(ventaPEN.$numberDecimal) : formatear6_MonedaPEN(ventaUSD.$numberDecimal),
        style: 'texto8Derecho',
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
      notaVenta.serie +
      '|' +
      notaVenta.numero +
      '|' +
      (notaVenta.moneda === 'PEN'
        ? redondeo2Decimales(Math.abs(notaVenta.igvPEN.$numberDecimal))
        : redondeo2Decimales(Math.abs(notaVenta.igvUSD.$numberDecimal))) +
      '|' +
      (notaVenta.moneda === 'PEN'
        ? redondeo2Decimales(Math.abs(notaVenta.totalPEN.$numberDecimal))
        : redondeo2Decimales(Math.abs(notaVenta.totalUSD.$numberDecimal))) +
      '|' +
      notaVenta.fechaLocal +
      '|' +
      notaVenta.usuarioCrea.substring(0, 10) +
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
  //   const d = new Date();
  // margin: [izq, top, der, button],
  //   function Pie(currentPage: number, pageCount: number) {
  //     return [
  //       {
  //         text:
  //           'Impresión: ' +
  //           formatoDDMMYYYY_PEN(d.toISOString().substring(0, 10)) +
  //           ' ' +
  //           cerosALaIzquierda(d.getHours(), 2) +
  //           ':' +
  //           cerosALaIzquierda(d.getMinutes(), 2) +
  //           ':' +
  //           cerosALaIzquierda(d.getSeconds(), 2) +
  //           '\n' +
  //           'Usuario: ' +
  //           parametrosGlobales.usuario,
  //         style: 'texto6',
  //         margin: [15, -15, 0, 0],
  //       },
  //       {
  //         image: 'poweredBy',
  //         fit: [70, 35],
  //         alignment: 'center',
  //         margin: [0, -35, 0, 0],
  //       },
  //       {
  //         text: currentPage + ' / ' + pageCount,
  //         style: 'textoPaginacion',
  //         margin: [0, -15, 17, 15],
  //       },
  //     ];
  //   }
  //#endregion FUNCION PIE DE PAGINA

  //#region DEFINICION DEL DOCUMENTO
  const docDefinitios: any = {
    // pageSize: 'A4',
    pageSize: {
      // width: 222,
      // width: 216,
      width: 212,
      // width: 316,
      // width: 210,
      height: 'auto',
    },
    pageMargins: [0, 12, 0, 15],

    // header: [reportTitle],
    content: [
      //ENCABEZADO
      {
        // margin: [izq, top, der, button],
        columns: [
          {
            // width: '100%',
            margin: [0, 0, 0, 8],
            alignment: 'center',
            image: 'logoEmp',
            fit: [190, 66],
          },
        ],
      },
      {
        // margin: [izq, top, der, button],
        columns: [
          //   { width: '30%', margin: [45, 11, 0, 2], image: 'logoEmp', fit: [190, 66] },
          {
            width: '100%',
            // margin: [2, 12, 2, 0],
            alignment: 'center',
            text: [
              //   { text: 'Razón social\n', style: 'textoBold10' },
              { text: notaVenta.empresa + '\n', style: 'texto' },
              { text: 'RUC: ' + notaVenta.ruc + '\n', style: 'texto' },
              { text: notaVenta.sucursal + '\n', style: 'texto' },
              { text: notaVenta.sucursalDireccion + '\n\n', style: 'texto' },

              { text: 'NOTA DE VENTA' + '\n', style: 'texto' },
              { text: notaVenta.serie + ' - ' + cerosALaIzquierda(notaVenta.numero, 8) + '\n', style: 'texto' },
              //   { text: 'Sucursal\n', style: 'textoBold10' },
              //   { text: notaVenta.sucursal + '\n', style: 'texto' },
              //   { text: 'Dirección fiscal\n', style: 'textoBold10' },
            ],
          },
        ],
      },
      //DATOS NOTA DE VENTA
      // margin: [izq, top, der, button],
      {
        margin: [0, 10, 0, 0],
        columns: [
          //FECHA EMISIÓN
          {
            width: '36%',
            //   margin: [50, 20, 0, 0],
            text: { text: 'FECHA EMISIÓN :', style: 'texto' },
          },
          //
          {
            width: '64%',
            //   margin: [50, 20, 0, 0],
            text: { text: notaVenta.fechaLocal + ' ' + notaVenta.horaLocal, style: 'texto' },
          },
        ],
      },
      {
        // margin: [0, 10, 0, 0],
        columns: [
          //MONEDA
          {
            width: '36%',
            //   margin: [50, 20, 0, 0],
            text: { text: 'MONEDA              :', style: 'texto' },
          },
          //
          {
            width: '64%',
            //   margin: [50, 20, 0, 0],
            text: { text: notaVenta.moneda, style: 'texto' },
          },
        ],
      },
      {
        // margin: [0, 10, 0, 0],
        columns: [
          //FORMA PAGO
          {
            width: '36%',
            //   margin: [50, 20, 0, 0],
            text: { text: 'FORMA PAGO      :', style: 'texto' },
          },
          //RUC
          {
            width: '64%',
            //   margin: [50, 20, 0, 0],
            text: { text: notaVenta.metodoPago, style: 'texto' },
          },
        ],
      },
      //ATENDIDO POR
      {
        // margin: [0, 10, 0, 0],
        columns: [
          {
            width: '36%',
            //   margin: [50, 20, 0, 0],
            text: { text: 'ATENDIDO POR   :', style: 'texto' },
          },
          //
          {
            width: '64%',
            //   margin: [50, 20, 0, 0],
            text: { text: notaVenta.usuarioCrea.substring(0, 10), style: 'texto' },
          },
        ],
      },
      {
        margin: [0, 10, 0, 0],
        columns: [
          //
          {
            width: '100%',
            //   margin: [50, 20, 0, 0],
            text: { text: notaVenta.observacion, style: 'texto' },
          },
        ],
      },
      //LOS ITEMS
      {
        margin: [0, 10, 0, 0],
        // margin: [izq, top, der, button],
        //   margin: [30, 10, 30, 3],
        style: 'tableExample',
        table: {
          headerRows: 1,
          margin: [0, 0, 0, 0],
          // widths: [30, 'auto', '*', '*', '*', '*'],
          // widths: [60, 60, '*', 100],
          body: [
            [
              // { text: 'Ítem', style: 'tableHeaderLight' },
              // { text: 'Código', style: 'tableHeaderLight' },
              //   { text: 'Uni', style: 'tableHeaderLight' },
              // { text: 'Valor Uni    ', style: 'tableHeaderLightRight' },
              // { text: 'Costo Total', style: 'tableHeaderLightRight' },
              { border: [false, false, false, true], text: 'DESCRIPCIÓN', style: 'texto' },
              { border: [false, false, false, true], text: 'CANT.', style: 'texto' },
              { border: [false, false, false, true], text: 'P.U.', style: 'texto' },
              { border: [false, false, false, true], text: 'VENTA', style: 'texto' },
            ],
            ...losItems,
          ],
        },
        // layout: 'itemsVentaLayout', //{ defaultBorder: false }, //'lightHorizontalLines', // 'noBorders', //'lightHorizontalLines',
        layout: {
          defaultBorder: false,
        },
      },
      //SUMARIO TABLA
      {
        // margin: [0, 10, 0, 0],
        columns: [
          //TOTAL
          {
            width: '36%',
            //   margin: [50, 20, 0, 0],
            text: { text: 'TOTAL', style: 'texto' },
          },
          //totalPEN
          {
            width: '64%',
            margin: [0, 0, 5, 0],
            text: { text: formatearMonedaPEN(notaVenta.totalPEN.$numberDecimal), style: 'texto8Derecho' },
          },
        ],
      },
      {
        margin: [0, 10, 0, 0],
        columns: [
          //
          {
            width: '100%',
            //   margin: [50, 20, 0, 0],
            text: { text: notaVenta.observacion, style: 'texto' },
          },
        ],
      },
      //EFCTIVO
      notaVenta.metodoPago === 'CONTADO'
        ? notaVenta.todoEnEfectivo
          ? {
              // margin: [0, 10, 0, 0],
              columns: [
                //TOTAL
                {
                  width: '36%',
                  //   margin: [50, 20, 0, 0],
                  text: { text: 'EFECTIVO', style: 'texto' },
                },
                //totalPEN
                {
                  width: '64%',
                  margin: [0, 0, 5, 0],
                  text: { text: formatearMonedaPEN(notaVenta.totalPEN.$numberDecimal), style: 'texto8Derecho' },
                },
              ],
            }
          : {
              // margin: [0, 10, 0, 0],
              columns: [
                //TOTAL
                {
                  width: '36%',
                  //   margin: [50, 20, 0, 0],
                  text: { text: 'EFECTIVO', style: 'texto' },
                },
                //totalPEN
                {
                  width: '64%',
                  margin: [0, 0, 5, 0],
                  text: { text: formatearMonedaPEN(notaVenta.montoEnEfectivo.$numberDecimal), style: 'texto8Derecho' },
                },
              ],
            }
        : notaVenta.unaParteEnEfectivo
        ? {
            // margin: [0, 10, 0, 0],
            columns: [
              //TOTAL
              {
                width: '36%',
                //   margin: [50, 20, 0, 0],
                text: { text: 'EFECTIVO', style: 'texto' },
              },
              //totalPEN
              {
                width: '64%',
                margin: [0, 0, 5, 0],
                text: { text: formatearMonedaPEN(notaVenta.montoEnEfectivo.$numberDecimal), style: 'texto8Derecho' },
              },
            ],
          }
        : {},

      //OTRO MEDIO PAGO
      // notaVenta.metodoPago === 'CRÉDITO' &&
      notaVenta.otroMedioPago != ''
        ? {
            // margin: [0, 10, 0, 0],
            columns: [
              //otroMedioPago
              {
                width: '56%',
                //   margin: [50, 20, 0, 0],
                text: { text: notaVenta.otroMedioPago, style: 'texto' },
              },
              //montoOtroMedioPago
              {
                width: '44%',
                margin: [0, 0, 5, 0],
                text: { text: formatearMonedaPEN(notaVenta.montoOtroMedioPago.$numberDecimal), style: 'texto8Derecho' },
              },
            ],
          }
        : {},
      //CREDITO
      notaVenta.metodoPago === 'CRÉDITO'
        ? {
            // margin: [0, 10, 0, 0],
            columns: [
              //otroMedioPago
              {
                width: '36%',
                //   margin: [50, 20, 0, 0],
                text: { text: 'CRÉDITO', style: 'texto' },
              },
              //montoOtroMedioPago
              {
                width: '64%',
                margin: [0, 0, 5, 0],
                text: { text: formatearMonedaPEN(notaVenta.importeTotalCuotasCredito.$numberDecimal), style: 'texto8Derecho' },
              },
            ],
          }
        : {},
      ////////////ESPACIO
      {
        margin: [0, 10, 0, 0],
        columns: [
          //
          {
            width: '100%',
            //   margin: [50, 20, 0, 0],
            text: { text: notaVenta.observacion, style: 'texto' },
          },
        ],
      },
      //CLIENTE SOBRENOMBRE CHAPA
      notaVenta.clienteSobrenombreChapa != ''
        ? {
            // margin: [0, 10, 0, 0],
            columns: [
              //otroMedioPago
              {
                width: '36%',
                //   margin: [50, 20, 0, 0],
                text: { text: 'CLIENTE', style: 'texto' },
              },
              //montoOtroMedioPago
              {
                width: '64%',
                margin: [0, 0, 5, 0],
                text: { text: notaVenta.clienteSobrenombreChapa, style: 'texto8Derecho' },
              },
            ],
          }
        : {},
      // QR
      {
        // margin: [0, 10, 0, 0],
        columns: [
          //TOTAL
          { margin: [0, 8, 0, 0], alignment: 'center', svg: ELqr, style: 'tableQR' },
        ],
      },
      // FINAL
      {
        margin: [0, 10, 0, 0],
        columns: [
          //RUC
          {
            width: '100%',
            //   margin: [50, 20, 0, 0],
            text: { text: 'GRACIAS POR SU PREFERENCIA', style: 'texto' },
          },
        ],
      },
      {
        // margin: [0, 10, 0, 0],
        columns: [
          //RUC
          {
            width: '23%',
            //   margin: [50, 20, 0, 0],
            text: { text: 'powered by', style: 'texto' },
          },
          {
            width: '77%',
            //   margin: [50, 20, 0, 0],
            text: { text: 'https://cao-systems.pe/', style: 'textoBold' },
          },
        ],
      },
    ],
    // footer: Pie,

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
        color: 'black',
      },
      texto8Derecho: {
        fontSize: 8,
        color: 'black',
        alignment: 'right',
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
  // pdfMake.createPdf(docDefinitios).print(); //download('trice.pdf');
}

export default pdfNotaVenta;
