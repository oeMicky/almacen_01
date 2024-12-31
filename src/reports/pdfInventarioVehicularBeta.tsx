import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from '../assets/fonts/vfs_fonts';
import {
  cerosALaIzquierda,
  formatearNumeroINT,
  // formatearMonedaUSD,
  formatoDDMMYYYY_PEN,
  // literal,
} from '~/functions/comunes';
import logit from '../assets/base64/imagesBase64.js';
import { parametrosGlobales } from '~/routes/login';
import vehiculoInventario from '../assets/base64/vehiculoInventario.js';

async function pdfOs_InventarioVehicularBeta(os: any) {
  pdfMake.vfs = pdfFonts;

  //console.log('os PDF', os);

  const LOGO_EMPRESA = await import(`../assets/logosEmpresas/${parametrosGlobales.RUC}.js`);

  const reportTitle: any = [];
  // const details = [];
  // const rodape = [];

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
          cerosALaIzquierda(d.getSeconds(), 2) +
          '\n\nUsuario: ' +
          parametrosGlobales.usuario,
        style: 'textoImpresion',
        margin: [15, -15, 0, 0],
        // margin: [0, 0, 0, 0],
      },
      {
        image: 'poweredBy',
        fit: [70, 35],
        alignment: 'center',
        // margin: [0, -35, 0, 0],
        margin: [-180, -40, 0, 0],
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

              body: [['R U C N° ' + os.ruc + '\n\nINVENTARIO\n\n' + os.serie + ' - ' + cerosALaIzquierda(os.numero, 8) + '\n']],
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
      //TIPO
      {
        columns: [
          { width: '18%', margin: [50, 4, 0, 0], text: { text: 'TIPO:', style: 'textoBold' } },
          {
            width: '42%',
            fontSize: 6,
            margin: [0, 4, 0, 0],
            // alignment: 'center',
            text: { text: os.tipo, style: 'texto' },
          },
        ],
      },
      //DATOS VEHICULO
      // margin: [izq, top, der, button],
      {
        columns: [
          {
            width: '94%',
            margin: [50, 11, 0, 0],
            // alignment: 'center',
            style: 'tableHeaderLight',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: ['*', '*'],
              body: [
                ['KM: ' + formatearNumeroINT(os.kilometraje), 'MARCA-MOD: ' + os.vehiculoMarca + ' - ' + os.vehiculoModelo],
                ['PLACA: ' + os.placa, 'VIN: ' + os.vin],
              ],
            },
          },
        ],
      },
      //TRABAJOS REALIZADOS / OBSERVACIONES
      {
        columns: [{ width: '100%', margin: [50, 10, 0, 0], text: { text: 'OBSERVACIONES:', style: 'textoBold10' } }],
      },
      {
        columns: [{ width: '100%', margin: [50, 10, 0, 0], text: { text: os.observacionesCliente, style: 'texto' } }],
      },
      //SELECTORES II  --  IMAGEN VEHICULO
      {
        columns: [
          {
            // width: '94%',
            margin: [50, 11, 0, 0],
            // alignment: 'center',
            style: 'tableLetraPequena',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [90, 8],
              body: [
                ['LLAVEROS', ''],
                ['CONTROLES DE ALARMA', ''],
                ['CONTROLES DE GARAGE / RADIO', ''],
                ['CLAXON', ''],
                ['RADIO CASSETTE', ''],
                ['ANTENAS', ''],
                ['ENCENDEDOR', ''],
                ['CENICEROS', ''],
                ['TAPASOLES', ''],
                ['ESPEJOS INT./EXT.', ''],
                ['FALSOS', ''],
                ['TAPICES Y ALFOMBRAS', ''],
                ['MANIJAS Y PERILLAS', ''],
                ['FAROS DELANTEROS', ''],
                ['FAROS POSTERIORES', ''],
              ],
            },
          },
          {
            // width: '94%',
            margin: [-17, 11, 0, 0],
            // alignment: 'center',
            style: 'tableLetraPequena',
            table: {
              // headers are automatically repeated if the table spans over multiple pages
              // you can declare how many rows should be treated as headers
              headerRows: 0,
              widths: [86, 8],
              body: [
                ['INY. AGUA PARABRISAS', ''],
                ['BRAZOO Y PLUMILLAS', ''],
                ['PARABRISAS', ''],
                ['LUNAS LATERALES', ''],
                ['LUNA POSTERIOR', ''],
                ['MASCARA', ''],
                ['EMBLEMAS', ''],
                ['ESCARPINES', ''],
                ['COPAS Y VASOS', ''],
                ['SEGURO DE RUEDAS', ''],
                ['LLANTAS Y AROS', ''],
                ['CHAPAS Y PUERTAS', ''],
                ['TAPA DE GASOLINA INT./EXT.', ''],
                ['JGO. HERRAM. PALANCA/GATA', ''],
                ['ALARMA', ''],
                ['PASAPORTE DE SERVICIO', ''],
              ],
            },
          },
          { margin: [-82, 11, 0, 2], image: 'vehiculo', fit: [249, 265] },
        ],
      },
      //firmas CLIENTE / ASESOR
      {
        columns: [
          { width: '50%', margin: [50, 100, 0, 0], text: { text: 'VoBo CLIENTE', alignment: 'center', style: 'textoBold' } },
          { width: '50%', margin: [50, 100, 0, 0], text: { text: 'ASESOR', alignment: 'center', style: 'textoBold' } },
        ],
      },
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
      tableLetraPequena: {
        // bold: true,
        fontSize: 6,
        // fillColor: '#d9d9d9',
        color: 'black',
        alignment: 'left',
        // alignment: 'center',
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
        fontSize: 6,
        bold: true,
        color: '#50575E',
      },
      textoImpresion7: {
        alignment: 'left',
        fontSize: 7,
        bold: true,
        color: '#50575E',
      },
      textoPaginacion: {
        alignment: 'right',
        fontSize: 6,
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
      vehiculo: vehiculoInventario,
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

export default pdfOs_InventarioVehicularBeta;
