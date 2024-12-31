import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../../assets/fonts/vfs_fonts';
import {
  cerosALaIzquierda,
  formatearMonedaPEN,
  formatearNumeroINT,
  // formatearMonedaUSD,
  formatear_4Decimales,
  formatoDDMMYYYY_PEN,
  // literal,
  redondeo2Decimales,
} from '~/functions/comunes';
import logit from '../../assets/base64/imagesBase64.js';
import { parametrosGlobales } from '~/routes/login';
// import QRCode from 'qrcode';

async function pdfOsMG_ConVehiculo(os: any) {
  pdfMake.vfs = pdfFonts;

  //console.log('para QR2:', parametrosGlobales.RUC + '|' + os.serie + '|' + cerosALaIzquierda(os.numero, 8) + '|');
  // let ELqr;

  // QRCode.toString(
  //   parametrosGlobales.RUC + '|' + os.serie + '|' + cerosALaIzquierda(os.numero, 8) + '|',
  //   {
  //     errorCorrectionLevel: 'H',
  //     type: 'svg',
  //   },
  //   function (err, data) {
  //     if (err) throw err;
  //     pasarValorSVG(data);
  //     // //console.log('🎇', data);
  //   }
  // );

  // function pasarValorSVG(data: string) {
  //   ELqr = data;
  // }

  // //console.log('🎄🎄🎄', ELqr);
  // const TRE = qrcode -o out.svg parametrosGlobales.RUC + '|' + os.serie + '|' + cerosALaIzquierda(os.numero, 8) + '|';
  // //console.log(
  //   'SVG',
  //   '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 26.125 14.875 L 17.125 14.875 L 17.125 5.875 C 17.125 5.257812 16.617188 4.75 16 4.75 C 15.382812 4.75 14.875 5.257812 14.875 5.875 L 14.875 14.875 L 5.875 14.875 C 5.257812 14.875 4.75 15.382812 4.75 16 C 4.75 16.617188 5.257812 17.125 5.875 17.125 L 14.875 17.125 L 14.875 26.125 C 14.875 26.742188 15.382812 27.25 16 27.25 C 16.617188 27.25 17.125 26.742188 17.125 26.125 L 17.125 17.125 L 26.125 17.125 C 26.742188 17.125 27.25 16.617188 27.25 16 C 27.25 15.382812 26.742188 14.875 26.125 14.875 Z M 26.125 14.875 "/></g></svg>'
  // );
  //console.log('os PDF', os);

  const LOGO_EMPRESA = await import(`../../assets/logosEmpresas/${parametrosGlobales.RUC}.js`);

  const servicios = os.servicios;
  // let repuestosDespachados: any = [];
  const repuestosDespachados = os.requisiciones.filter((plot: any) => plot.cantidadDespachada.$numberDecimal > 0);
  //console.log('repuestosDespachadosyyyyyyy', repuestosDespachados);
  let totalServicios = 0;
  let totalRepuestos = 0;

  const reportTitle: any = [];
  // const details = [];
  // const rodape = [];

  const losServicios = servicios.map((ser: any, index: number) => {
    //console.log('pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS..SER.pdfOS...');
    const { descripcionEquivalencia, cantidadEquivalencia, unidadEquivalencia, precioUnitarioPEN, ventaPEN } = ser;
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
        text: formatearMonedaPEN(precioUnitarioPEN.$numberDecimal),
        style: 'tableBody',
      },
      {
        text: formatearMonedaPEN(ventaPEN.$numberDecimal),
        style: 'tableBody',
      },
    ];
  });

  const losRepuestos = repuestosDespachados.map((repu: any, index: number) => {
    //console.log('pdfOS..RT.pdfOS..RT.pdfOS..RT.pdfOS..RT.pdfOS..RT.pdfOS..RT.pdfOS..RT.pdfOS...');
    const { codigo, descripcionEquivalencia, cantidadDespachada, cantidadReingresada, unidadEquivalencia, precioUnitarioPEN } = repu;
    //console.log('cantidadDespachada - cantidadDespachada.$numberDecimal', cantidadDespachada, cantidadDespachada.$numberDecimal);
    if (cantidadDespachada.$numberDecimal - cantidadReingresada.$numberDecimal > 0) {
      const indexItem = index + 1;
      totalRepuestos =
        totalRepuestos + redondeo2Decimales((cantidadDespachada.$numberDecimal - cantidadReingresada.$numberDecimal) * precioUnitarioPEN.$numberDecimal);
      return [
        { text: indexItem, style: 'tableBody' },
        { text: codigo, style: 'tableBody' },
        { text: descripcionEquivalencia, style: 'tableBody' },
        {
          text: formatear_4Decimales(cantidadDespachada.$numberDecimal - cantidadReingresada.$numberDecimal),
          style: 'tableBody',
        },
        { text: unidadEquivalencia, style: 'tableBody' },
        {
          text: formatearMonedaPEN(precioUnitarioPEN.$numberDecimal),
          style: 'tableBody',
        },
        {
          text: formatearMonedaPEN((cantidadDespachada.$numberDecimal - cantidadReingresada.$numberDecimal) * precioUnitarioPEN.$numberDecimal),
          style: 'tableBody',
        },
      ];
    }
  });

  //#region FUNCION PIE DE PAGINA
  // margin: [izq, top, der, button],
  const d = new Date(); //.toUTCString(); //.toISOString();
  // //console.log('d', d);
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
          cerosALaIzquierda(d.getSeconds(), 2),
        style: 'textoImpresion',
        margin: [15, -15, 0, 0],
      },
      {
        image: 'poweredBy',
        fit: [70, 35],
        alignment: 'center',
        // margin: [0, -35, 0, 0],
        margin: [0, -25, 0, 0],
        // margin: [0, 0, 0, 0],
      },
      {
        text: currentPage + ' / ' + pageCount,
        style: 'textoPaginacion',
        margin: [0, -20, 17, 15],
        // margin: [0, -10, 17, 15],
        // margin: [-15, 0, 17, 15],
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
              { text: os.empresa + '\n', style: 'texto' },
              { text: 'Sucursal\n', style: 'textoBold10' },
              { text: os.sucursal + '\n', style: 'texto' },
              { text: 'Dirección fiscal\n', style: 'textoBold10' },
              { text: os.direccion, style: 'texto' },
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

              body: [['R U C N° ' + os.ruc + '\n\nORDEN DE SERVICIO\n\n' + os.serie + ' - ' + cerosALaIzquierda(os.numero, 8) + '\n']],
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
      // DNI / RUC   //  FECHA INICIO
      // margin: [izq, top, der, button],
      {
        columns: [
          {
            width: '18%',
            margin: [50, 20, 0, 0],
            text: { text: os.tipoDocumentoIdentidad + ':', style: 'textoBold' },
          },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 20, 0, 0],
            // alignment: 'center',
            text: { text: os.numeroIdentidad, style: 'texto' },
          },
          {
            width: '19%',
            margin: [50, 20, 0, 0],
            text: { text: 'FECHA INICIO' + ':', style: 'textoBold' },
          },
          {
            width: '21%',
            fontSize: 6,
            margin: [0, 20, 0, 0],
            // alignment: 'center',
            text: { text: formatoDDMMYYYY_PEN(os.fechaInicio), style: 'texto' },
          },
        ],
      },
      // CLIENTE / FECHA FINAL
      // margin: [izq, top, der, button],
      {
        columns: [
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'CLIENTE:', style: 'textoBold' } },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: os.razonSocialNombreCliente, style: 'texto' },
          },
          {
            width: '19%',
            margin: [50, 4, 0, 0],
            text: { text: 'FECHA FINAL' + ':', style: 'textoBold' },
          },
          {
            width: '21%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: formatoDDMMYYYY_PEN(os.fechaFinal), style: 'texto' },
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
            text: { text: os.razonSocialNombreTecnico, style: 'texto' },
          },
          { width: '16%', margin: [50, 4, 0, 0], text: { text: 'ESTADO:', style: 'textoBold' } },
          {
            width: '24%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: os.estado, style: 'texto' },
          },
        ],
      },
      //DATOS VEHICULO
      // margin: [izq, top, der, button],
      {
        columns: [
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'KM:', style: 'textoBold8_ConSombra' } },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: formatearNumeroINT(os.kilometraje), style: 'texto8_ConSombra' },
          },
          { width: '16%', margin: [50, 4, 0, 0], text: { text: 'TIPO:', style: 'textoBold' } },
          {
            width: '24%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: os.tipo, style: 'texto' },
          },
        ],
      },
      {
        columns: [
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'MARCA-MOD:', style: 'textoBold8_ConSombra' } },
          {
            width: '82%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: os.vehiculoMarca + ' - ' + os.vehiculoModelo, style: 'texto8_ConSombra' },
          },
        ],
      },
      {
        columns: [
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'PLACA:', style: 'textoBold8_ConSombra' } },
          {
            width: '82%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: os.placa, style: 'texto8_ConSombra' },
          },
        ],
      },
      {
        columns: [
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'VIN:', style: 'textoBold8_ConSombra' } },
          {
            width: '82%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: os.vin, style: 'texto8_ConSombra' },
          },
        ],
      },
      //TRABAJOS REALIZADOS / OBSERVACIONES
      {
        columns: [{ width: '100%', margin: [50, 10, 0, 0], text: { text: 'TRABAJOS REALIZADOS / OBSERVACIONES:', style: 'textoBold10' } }],
      },
      {
        columns: [{ width: '100%', margin: [50, 10, 0, 0], text: { text: os.observacionesCliente, style: 'texto' } }],
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

            text: { text: 'SUBTOTAL PEN ' + formatearMonedaPEN(totalServicios), style: 'tableBodyRight' },
            alignment: 'right',
          },
        ],
      },
      //REPUESTOS
      {
        columns: [{ width: '35%', margin: [50, 10, 0, 0], text: { text: 'SUMINISTROS :', style: 'textoBold10' } }],
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
        layout: 'noBorders',
      },
      {
        columns: [
          {
            width: '100%',
            margin: [0, 0, 30, 0],
            text: { text: 'SUBTOTAL PEN ' + formatearMonedaPEN(totalRepuestos), style: 'tableBodyRight' },
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
      //QR
      // {
      //   // svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 32 32" version="1.1"><g id="surface1"><path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 26.125 14.875 L 17.125 14.875 L 17.125 5.875 C 17.125 5.257812 16.617188 4.75 16 4.75 C 15.382812 4.75 14.875 5.257812 14.875 5.875 L 14.875 14.875 L 5.875 14.875 C 5.257812 14.875 4.75 15.382812 4.75 16 C 4.75 16.617188 5.257812 17.125 5.875 17.125 L 14.875 17.125 L 14.875 26.125 C 14.875 26.742188 15.382812 27.25 16 27.25 C 16.617188 27.25 17.125 26.742188 17.125 26.125 L 17.125 17.125 L 26.125 17.125 C 26.742188 17.125 27.25 16.617188 27.25 16 C 27.25 15.382812 26.742188 14.875 26.125 14.875 Z M 26.125 14.875 "/></g></svg>',
      //   // svg: QRCode.toString(
      //   //   'Encode this text in QR code',
      //   //   {
      //   //     errorCorrectionLevel: 'H',
      //   //     type: 'svg',
      //   //   },
      //   //   function (err, data) {
      //   //     if (err) throw err;

      //   //     //console.log(data);
      //   //   }
      //   // ),
      //   // svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 41 41" shape-rendering="crispEdges"><path fill="#ffffff" d="M0 0h41v41H0z"/><path stroke="#000000" d="M4 4.5h7m1 0h1m2 0h1m1 0h3m1 0h1m2 0h1m2 0h2m1 0h7M4 5.5h1m5 0h1m1 0h1m1 0h1m1 0h2m1 0h1m2 0h4m4 0h1m5 0h1M4 6.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m2 0h3m1 0h1m4 0h1m1 0h3m1 0h1M4 7.5h1m1 0h3m1 0h1m2 0h1m1 0h2m2 0h6m1 0h1m1 0h1m1 0h1m1 0h3m1 0h1M4 8.5h1m1 0h3m1 0h1m2 0h3m2 0h2m1 0h6m3 0h1m1 0h3m1 0h1M4 9.5h1m5 0h1m1 0h1m1 0h4m2 0h2m1 0h2m2 0h2m1 0h1m5 0h1M4 10.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M12 11.5h1m3 0h1m2 0h1m1 0h3m1 0h3M6 12.5h3m1 0h1m1 0h2m2 0h3m4 0h2m1 0h6m2 0h3M5 13.5h2m1 0h1m2 0h3m1 0h4m1 0h1m3 0h2m1 0h1m2 0h1m5 0h1M5 14.5h3m2 0h1m3 0h1m2 0h3m1 0h2m2 0h1m2 0h1m3 0h4M4 15.5h1m2 0h1m1 0h1m2 0h2m1 0h3m1 0h3m1 0h1m1 0h2m1 0h1m2 0h1m1 0h2M4 16.5h1m1 0h3m1 0h1m2 0h1m1 0h3m2 0h1m2 0h3m3 0h1m6 0h1M4 17.5h1m1 0h3m4 0h1m11 0h3m1 0h3m1 0h2M4 18.5h1m1 0h5m1 0h1m2 0h1m1 0h3m3 0h3m7 0h3M4 19.5h2m1 0h1m5 0h1m1 0h4m3 0h1m2 0h1m3 0h1m1 0h1m2 0h3M4 20.5h5m1 0h3m1 0h1m2 0h2m1 0h1m2 0h1m2 0h1m1 0h2m4 0h1m1 0h1M5 21.5h2m2 0h1m2 0h1m1 0h2m1 0h2m1 0h1m1 0h2m1 0h3m1 0h1m3 0h2m1 0h1M4 22.5h2m1 0h1m2 0h5m4 0h3m3 0h2m1 0h4m1 0h3M4 23.5h3m1 0h2m2 0h2m2 0h1m2 0h3m3 0h1m4 0h2m1 0h2M7 24.5h4m3 0h1m1 0h1m1 0h1m1 0h1m1 0h2m5 0h4m2 0h1M4 25.5h1m4 0h1m3 0h1m1 0h2m2 0h4m5 0h1m2 0h1m4 0h1M4 26.5h1m1 0h1m1 0h3m1 0h2m2 0h1m2 0h1m1 0h1m1 0h2m1 0h1m2 0h2m1 0h4M4 27.5h1m2 0h2m2 0h1m1 0h1m4 0h1m2 0h3m1 0h2m1 0h4m1 0h2M4 28.5h1m1 0h1m2 0h5m3 0h3m1 0h1m1 0h1m2 0h1m1 0h6M12 29.5h1m5 0h2m2 0h1m1 0h1m3 0h1m3 0h2m2 0h1M4 30.5h7m6 0h1m1 0h2m1 0h1m3 0h3m1 0h1m1 0h1m2 0h1M4 31.5h1m5 0h1m3 0h1m2 0h1m1 0h2m1 0h1m1 0h1m3 0h1m3 0h1m1 0h1M4 32.5h1m1 0h3m1 0h1m1 0h1m3 0h4m3 0h1m1 0h2m1 0h5m2 0h1M4 33.5h1m1 0h3m1 0h1m1 0h1m3 0h4m3 0h3m3 0h1m1 0h3m1 0h1M4 34.5h1m1 0h3m1 0h1m1 0h1m1 0h5m2 0h1m2 0h2m2 0h1m1 0h1M4 35.5h1m5 0h1m3 0h2m3 0h1m2 0h3m4 0h1m1 0h3M4 36.5h7m3 0h2m1 0h1m1 0h2m2 0h2m1 0h3m3 0h1m1 0h2"/></svg>',
      //   svg: ELqr,
      // },
    ],
    footer: Pie,
    // margin: [izq, top, der, button],
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
      textoBold8_ConSombra: {
        fontSize: 8,
        bold: true,
        background: '#d9d9d9',
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
      textoImpresion: {
        alignment: 'left',
        fontSize: 8,
        bold: true,
        color: '#50575E',
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
      texto8_ConSombra: {
        fontSize: 8,
        color: '#50575E',
        background: '#d9d9d9',
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

export default pdfOsMG_ConVehiculo;
