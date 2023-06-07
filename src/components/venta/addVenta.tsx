import {
  $,
  component$,
  createContextId,
  // render,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useStylesScoped$,
  useTask$,
} from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import {
  getSeriesFacturaActivas,
  getSeriesBoletaActivas,
  getSeriesNotaCreditoActivas,
  getSeriesNotaDebitoActivas,
  // getIgvVenta,
} from '~/apis/venta.api';
//
import { hoy, elIdAuxiliar, cerosALaIzquierda, redondeo2Decimales, formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import SeleccionarPersona from '../miscelanea/persona/seleccionarPersona';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import { getTipoCambio } from '~/apis/apisExternas.api';
import { inVenta } from '~/apis/venta.api';
import NewEditCuotaCreditoVenta from './newEditCuotaCreditoVenta';
import BusquedaMercaderiaOUT from '../outAlmacen/busquedaMercaderiaOUT';
import AdjuntarCotizacion from './adjuntarCotizacion';
// import styleTabla from '../../components/tabla.css?inline';
import styleTabla from '../tabla/tabla.css?inline';

import SeleccionarServicio from '../miscelanea/servicio/seleccionarServicio';
import { IPersona } from '~/interfaces/iPersona';
import SeleccionarPersona from './seleccionarPersona';

// export const CTX_PERSONA = createContextId<IPersona>('ventaPersona');
export const CTX_CLIENTE_SELECCIONADO = createContextId<IPersona>('cliente');
export const CTX_F_B_NC_ND = createContextId<IVenta>('addVenta');

export interface IItemVenta {
  idAuxiliar: number;
  item: number;
  codigo: string;
  descripcionEquivalencia: string;
  cantidad: number;
  unidadEquivalencia: string;
  costo: number;
  precioPEN: number;
  ventaPEN: number;
  precioUSD: number;
  ventaUSD: number;
}

export interface ICuotaCreditoVenta {
  idAuxiliar: number;
  fechaCuota: string;
  importeCuotaPEN: number;
}

export interface IVenta {
  codigoDocumento: string;
  documentoVenta: string;
  serie: string;
  numeroDocumento: number;
  fecha: string;

  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;

  igv: number;
  enDolares: boolean;
  moneda: string;
  tipoCambio: number;

  vendedor: string;
  metodoPago: string;
  verCuotasCredito: boolean;
  cuotasCredito: any; // ICuotaCreditoVenta[];
  importeTotalCuotasCredito: number;

  cotizacion: number;
  ordenServicio: number;

  itemsVenta: any;

  montoSubTotalPEN: number;
  montoIGVPEN: number;
  montoTotalPEN: number;

  montoSubTotalUSD: number;
  montoIGVUSD: number;
  montoTotalUSD: number;
}

// export const addVenta = routeAction$(async () => {
//   if (serieDocumento.value) {
//     alert('Seleccione la serie.');
//     document.getElementById('selectSerieVenta')?.focus();
//   }
// });

export default component$((props: { ancho: number; parametrosGlobales: any; igv: number }) => {
  useStylesScoped$(styleTabla);
  //#region DEFINICION CTX_F_B_NC_ND - NEW / EDIT
  const definicion_CTX_F_B_NC_ND = useStore<IVenta>(
    {
      codigoDocumento: '',
      documentoVenta: '',
      serie: '',
      numeroDocumento: 0,
      fecha: hoy(),

      idCliente: '',
      codigoTipoDocumentoIdentidad: '6',
      tipoDocumentoIdentidad: 'RUC',
      numeroIdentidad: '',
      razonSocialNombre: '',

      igv: 0,
      enDolares: false,
      moneda: 'PEN',
      tipoCambio: 0,

      vendedor: '',
      metodoPago: 'CONTADO',
      verCuotasCredito: false,
      cuotasCredito: [],
      importeTotalCuotasCredito: 0,

      cotizacion: 0,
      ordenServicio: 0,

      itemsVenta: [],

      montoSubTotalPEN: 0,
      montoIGVPEN: 0,
      montoTotalPEN: 0,

      montoSubTotalUSD: 0,
      montoIGVUSD: 0,
      montoTotalUSD: 0,
    },
    { deep: true }
  );
  useContextProvider(CTX_F_B_NC_ND, definicion_CTX_F_B_NC_ND);
  //#endregion DEFINICION CTX_F_B_NC_ND - NEW / EDIT

  //#region DEFINICION CTX_PERSONA
  // const laPersonaSeleccionada = useStore<IPersona>({
  //   _id: '',
  //   codigoTipoDocumentoIdentidad: '',
  //   tipoDocumentoIdentidad: '',
  //   numeroIdentidad: '',
  //   razonSocialNombre: '',
  //   nombre: '',
  //   paterno: '',
  //   materno: '',
  //   activo: true,
  // });
  // useContextProvider(CTX_PERSONA, laPersonaSeleccionada);
  //#endregion DEFINICION CTX_PERSONA

  //#region DEFINICION CTX_CLIENTE_SELECCIONADO
  const elClienteSeleccionado = useStore<IPersona>({
    _id: '',
    codigoTipoDocumentoIdentidad: '',
    tipoDocumentoIdentidad: '',
    numeroIdentidad: '',
    razonSocialNombre: '',
    nombre: '',
    paterno: '',
    materno: '',
    activo: true,
  });
  useContextProvider(CTX_CLIENTE_SELECCIONADO, elClienteSeleccionado);
  //#endregion DEFINICION CTX_CLIENTE_SELECCIONADO

  //#region CONTEXTOS
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
  //#endregion CONTEXTOS

  //#region INICIALIZACION

  const tipoDocumento = useSignal('01'); //FACTURA
  const idSerieDocumento = useSignal('');
  const serieDocumento = useSignal('');
  const botonGrabar = useSignal('');
  const dataSerie = useSignal([]);
  const cuotaCredito_esEdit = useSignal(false);
  const pasoProcesoGrabacion = useSignal(false);
  const grabo = useSignal(false);

  let sumaCuotas = 0;
  let sumaTOTAL = 0;
  let subTOTAL = 0;
  let igvTOTAL = 0;

  const item = useStore<IItemVenta>({
    idAuxiliar: 0, //parseInt(elIdAuxiliar()),
    item: 0,
    codigo: '',
    descripcionEquivalencia: '',
    cantidad: 0,
    unidadEquivalencia: '',
    costo: 0,
    precioPEN: 0,
    ventaPEN: 0,
    precioUSD: 0,
    ventaUSD: 0,
  });

  const cuota = useStore<ICuotaCreditoVenta>({
    idAuxiliar: 0,
    fechaCuota: hoy(),
    importeCuotaPEN: 99,
  });
  //#endregion INICIALIZACION

  //#region INICIALIZACION - TIPO DE DOCUMENTO F B NC ND
  //ESTO OCURRE ANTES DE RENDERIZAR
  useTask$(async ({ track }) => {
    track(() => tipoDocumento.value);
    // alert(`tretre a useTask ${documento.value}`);
    let laSerie;
    const parametros = {
      idGrupoEmpresarial: props.parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.parametrosGlobales.idEmpresa,
      documento: tipoDocumento.value,
    };

    switch (tipoDocumento.value) {
      case '01': //FACTURA
        serieDocumento.value = '';
        // alert(`tretre a useTask FACTURA`);
        laSerie = await getSeriesFacturaActivas(parametros);
        // console.log('laSerie', laSerie);
        dataSerie.value = laSerie.data;
        console.log('dataSerie.value', dataSerie.value);
        definicion_CTX_F_B_NC_ND.codigoDocumento = '01';
        definicion_CTX_F_B_NC_ND.documentoVenta = 'FACTURA';
        botonGrabar.value = 'Grabar FACTURA';
        // setSeries(laSerie.data);
        // setCodigoDocumento('01');
        // setDocumentoVenta('FACTURA');
        // setBotonGrabar('Grabar FACTURA');

        break;
      case '03': //BOLETA
        serieDocumento.value = '';
        // alert(`tretre a useTask BOLETA`);
        laSerie = await getSeriesBoletaActivas(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;
        console.log('dataSerie.value', dataSerie.value);
        definicion_CTX_F_B_NC_ND.codigoDocumento = '03';
        definicion_CTX_F_B_NC_ND.documentoVenta = 'BOLETA';
        botonGrabar.value = 'Grabar BOLETA';
        // setBotonGrabar('Grabar BOLETA');

        break;
      case '07': //NOTA DE CRÉDITO
        serieDocumento.value = '';
        // alert(`tretre a useTask NOTA DE CRÉDITO`);
        laSerie = await getSeriesNotaCreditoActivas(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;
        console.log('dataSerie.value', dataSerie.value);
        definicion_CTX_F_B_NC_ND.codigoDocumento = '07';
        definicion_CTX_F_B_NC_ND.documentoVenta = 'NOTA DE CRÉDITO';
        botonGrabar.value = 'Grabar NOTA DE CRÉDITO';
        // setBotonGrabar('Grabar NOTA DE CRÉDITO');

        break;
      case '08': //NOTA DE DÉBITO
        serieDocumento.value = '';
        // alert(`tretre a useTask NOTA DE DÉBITO`);
        laSerie = await getSeriesNotaDebitoActivas(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;
        console.log('dataSerie.value', dataSerie.value);
        definicion_CTX_F_B_NC_ND.codigoDocumento = '08';
        definicion_CTX_F_B_NC_ND.documentoVenta = 'NOTA DE DÉBITO';
        botonGrabar.value = 'Grabar NOTA DE DÉBITO';
        // setBotonGrabar('Grabar NOTA DE DÉBITO');

        break;

      default:
        console.log(`Sorry, we are out of ${tipoDocumento}.`);
        break;
    }
    //
    // let elIgv = await getIgvVenta(props.parametrosGlobales);
    // elIgv = elIgv.data;
    // // console.log('elIgv', elIgv[0].igv);
    // venta.igv = elIgv[0].igv;
    definicion_CTX_F_B_NC_ND.igv = props.igv;
  });
  //#endregion INICIALIZACION - TIPO DE DOCUMENTO F B NC ND

  //TAREAS DIVERSAS

  //#region GENERALES
  useTask$(async ({ track }) => {
    track(() => serieDocumento.value);
    // const tre: HTMLSelectElement = document.getElementById('selectSerieVenta');
    // const elID = tre.current[2].value;
    if (serieDocumento.value === '') {
      // if (serieDocumento.value === '--Seleccione una opción--') {
      console.log('--Seleccione una opción--');
      // setIdTipoDocumento('');
      definicion_CTX_F_B_NC_ND.serie = '';
      definicion_CTX_F_B_NC_ND.numeroDocumento = 0;
      console.log('venta.serie', definicion_CTX_F_B_NC_ND.serie, definicion_CTX_F_B_NC_ND.numeroDocumento);
    } else {
      // console.log('elID', elID);
      // console.log('elValor', elValor);
      // console.log('elValor', elValor.substring(0, 3));

      definicion_CTX_F_B_NC_ND.serie = serieDocumento.value;
      console.log('venta.serie...:', idSerieDocumento.value, definicion_CTX_F_B_NC_ND.serie, dataSerie.value);
      const corr = dataSerie.value.filter((ser: any) => ser._id === idSerieDocumento.value);
      const elCorre: { _id: string; codigo: string; serie: string; correlativo: number } = corr[0];
      console.log('corr.correlativo', elCorre.correlativo);
      definicion_CTX_F_B_NC_ND.numeroDocumento = elCorre.correlativo + 1;
    }
  });
  //#endregion GENERALES

  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => ctx_docs_venta.selecciono_Persona);
    if (ctx_docs_venta.selecciono_Persona) {
      // alert('evalua a la persona');
      definicion_CTX_F_B_NC_ND.idCliente = elClienteSeleccionado._id;
      definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad = elClienteSeleccionado.codigoTipoDocumentoIdentidad;
      definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad = elClienteSeleccionado.tipoDocumentoIdentidad;
      definicion_CTX_F_B_NC_ND.numeroIdentidad = elClienteSeleccionado.numeroIdentidad;
      definicion_CTX_F_B_NC_ND.razonSocialNombre = elClienteSeleccionado.razonSocialNombre;
      ctx_docs_venta.selecciono_Persona = false;
    }
  });
  //#endregion CLIENTE

  //#region GENERALES DE FACTURA : Documento
  // const buscarSeriesVenta = $(async () => {
  //   // const documento = (e.target as HTMLSelectElement).value;
  //   alert('La alerta buscarSeriesVenta: ' + tipoDocumento.value);
  // });
  //#endregion

  //#region TIPO CAMBIO
  const obtenerTipoCambio = $(async (e: HTMLInputElement) => {
    const checkTC = e.checked;
    if (checkTC) {
      definicion_CTX_F_B_NC_ND.enDolares = true;
      console.log('ingreso al tipo de cambio');
      let elTipoCambio = await getTipoCambio(definicion_CTX_F_B_NC_ND.fecha);
      elTipoCambio = elTipoCambio.data;
      console.log('elTipoCambio', elTipoCambio.venta);
      definicion_CTX_F_B_NC_ND.moneda = elTipoCambio.moneda;
      definicion_CTX_F_B_NC_ND.tipoCambio = elTipoCambio.venta;
      // let itemsVVVVVV = await tablaItemsVentaADolares(elTipoCambio.venta);
      // console.log('itemsVVVVVV', itemsVVVVVV);
    } else {
      console.log('ingreso al NNNNOOOOOO enDOLARES');
      definicion_CTX_F_B_NC_ND.enDolares = false;
      definicion_CTX_F_B_NC_ND.moneda = 'PEN';
      definicion_CTX_F_B_NC_ND.tipoCambio = 0;
      // itemsVenta.map((itemV, index) => {
      //   let { cantidad, precioPEN } = itemV;
      //   itemV['ventaPEN'] = redondeo2Decimales(itemV['precioPEN'] * cantidad);
      //   setItemsVenta([...itemsVenta.slice(0, index), itemV, ...itemsVenta.slice(index + 1, itemsVenta.length)]);
      // });
    }
  });
  //#endregion TIPO CAMBIO

  //#region CUOTA CREDITO
  useTask$(({ track }) => {
    track(() => ctx_docs_venta.mostrarPanelCuotasCredito);
    if (ctx_docs_venta.grabo_CuotaCredito) {
      // alert(`${cuota.importeCuotaPEN}`);
      console.log('🤑 🤩 insertar cuota', cuota);
      const elTarget = JSON.parse(JSON.stringify(cuota));
      console.log('🤩🤩🤩 insertar cuota elTarget', elTarget);
      const iT = elTarget;
      console.log('🤩🤩🤩 iT', iT);
      definicion_CTX_F_B_NC_ND.cuotasCredito.push(iT);
    }
  });
  //#endregion CUOTA CREDITO

  //#region ITEMS VENTA
  const fijarMontos = $((e: any) => {
    console.log(' eee', e);

    console.log('eeeeeeeeeeeeeeeeee', e);
    if (definicion_CTX_F_B_NC_ND.enDolares) {
      definicion_CTX_F_B_NC_ND.montoSubTotalUSD = e.subTOTAL;
      definicion_CTX_F_B_NC_ND.montoIGVUSD = e.igvTOTAL;
      definicion_CTX_F_B_NC_ND.montoTotalUSD = e.sumaTOTAL;

      const tt = redondeo2Decimales(e.sumaTOTAL * definicion_CTX_F_B_NC_ND.tipoCambio);
      const sub = redondeo2Decimales((tt * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
      const i = redondeo2Decimales(tt - sub);

      definicion_CTX_F_B_NC_ND.montoSubTotalPEN = sub;
      definicion_CTX_F_B_NC_ND.montoIGVPEN = i;
      definicion_CTX_F_B_NC_ND.montoTotalPEN = tt;
    } else {
      definicion_CTX_F_B_NC_ND.montoSubTotalPEN = e.subTOTAL;
      definicion_CTX_F_B_NC_ND.montoIGVPEN = e.igvTOTAL;
      definicion_CTX_F_B_NC_ND.montoTotalPEN = e.sumaTOTAL;
      console.log(
        'first',
        definicion_CTX_F_B_NC_ND.montoSubTotalPEN,
        definicion_CTX_F_B_NC_ND.montoIGVPEN,
        definicion_CTX_F_B_NC_ND.montoTotalPEN
      );
      definicion_CTX_F_B_NC_ND.montoSubTotalUSD = 0;
      definicion_CTX_F_B_NC_ND.montoIGVUSD = 0;
      definicion_CTX_F_B_NC_ND.montoTotalUSD = 0;
    }
  });
  // useTask$(({ track }) => {
  //   track(() => ctx_PanelVenta.grabo_ItemsVenta);
  //   if (ctx_PanelVenta.grabo_ItemsVenta) {
  //     console.log('🤑🤑🤑🤑🤑 🤩 insertar item', item);
  //     const elTarget = JSON.parse(JSON.stringify(item));
  //     console.log('🤩🤩🤩🤩🤩 insertar cuota elTarget', elTarget);
  //     // venta.itemsVenta = [...venta.itemsVenta, elTarget];
  //     ctx_PanelVenta.grabo_ItemsVenta = false;
  //     //   console.log('🤩🤩venta.itemsVenta🤑🤑', venta.itemsVenta);
  //   }
  // });
  // const insertarItem = $(async () => {
  //   return console.log('insertando.............');
  // });
  // useTask$(({ track }) => {
  //   track(() => indexItemVenta.value);
  //   console.log('👉👉💂‍♂️indexItemVenta.value');
  // });
  // useTask$(({ track }) => {
  //   track(() => venta.itemsVenta);
  //   console.log('💂‍♂️💂‍♂️💂‍♂️  venta.itemsVenta ');
  // });
  // useTask$(({ track }) => {
  //   track(() => venta);
  //   console.log('💂‍♂️🤑💂‍♂️🤑💂‍♂️  venta ');
  // });
  // useTask$(({ track }) => {
  //   track(() => venta.itemsVenta.length);
  //   console.log('💂‍♂️🤩💂‍♂️🤩💂‍♂️🤩  venta.itemsVenta.length ', venta.itemsVenta.length);
  // });
  //#endregion ITEMS VENTA

  //#region SUBMIT

  const grabando = $(async () => {
    console.log('first::::::_______::::::______T');
    if (serieDocumento.value === '') {
      alert('Seleccione la serie.');
      document.getElementById('selectSerieVenta')?.focus();
      return;
    }
    if (definicion_CTX_F_B_NC_ND.numeroIdentidad === '') {
      alert('Seleccione el número de identidad.');
      document.getElementById('inputNumeroDocumentoIdentidad')?.focus();
      return;
    }
    if (definicion_CTX_F_B_NC_ND.razonSocialNombre === '') {
      alert('Seleccione la razón social / nombre.');
      document.getElementById('inputNombreCliente')?.focus();
      return;
    }
    if (definicion_CTX_F_B_NC_ND.verCuotasCredito && definicion_CTX_F_B_NC_ND.cuotasCredito.length === 0) {
      alert('Ingrese las cuotas de crédito.');
      document.getElementById('addCuota')?.focus();
      return;
    }
    if (definicion_CTX_F_B_NC_ND.itemsVenta.length === 0) {
      alert('Ingrese los ítems para la venta.');
      document.getElementById('btnVerAlmacen')?.focus();
      return;
    }
    console.log('paso_______::::::______T', definicion_CTX_F_B_NC_ND);
    // const aGrabar =
    const ventaGRABADA = await inVenta({
      idGrupoEmpresarial: props.parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.parametrosGlobales.idEmpresa,

      ruc: props.parametrosGlobales.parameRUC,
      empresa: props.parametrosGlobales.parameRazonSocial,
      direccion: props.parametrosGlobales.paraDireccion,

      codigoDocumento: definicion_CTX_F_B_NC_ND.codigoDocumento,
      documentoVenta: definicion_CTX_F_B_NC_ND.documentoVenta,
      serie: definicion_CTX_F_B_NC_ND.serie,
      numeroDocumento: definicion_CTX_F_B_NC_ND.numeroDocumento,
      fecha: definicion_CTX_F_B_NC_ND.fecha,

      idCliente: definicion_CTX_F_B_NC_ND.idCliente,
      codigoTipoDocumentoIdentidad: definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_F_B_NC_ND.numeroIdentidad,
      razonSocialNombre: definicion_CTX_F_B_NC_ND.razonSocialNombre,
      // email: venta.email,

      igv: definicion_CTX_F_B_NC_ND.igv,
      moneda: definicion_CTX_F_B_NC_ND.moneda,
      tipoCambio: definicion_CTX_F_B_NC_ND.tipoCambio,

      vendedor: definicion_CTX_F_B_NC_ND.vendedor,
      metodoPago: definicion_CTX_F_B_NC_ND.metodoPago,
      cuotasPago: definicion_CTX_F_B_NC_ND.cuotasCredito,
      importeTotalCuotasCredito: definicion_CTX_F_B_NC_ND.importeTotalCuotasCredito,

      cotizacion: definicion_CTX_F_B_NC_ND.cotizacion,
      ordenServicio: definicion_CTX_F_B_NC_ND.ordenServicio,

      itemsVenta: definicion_CTX_F_B_NC_ND.itemsVenta,

      montoSubTotalPEN: definicion_CTX_F_B_NC_ND.montoSubTotalPEN,
      montoIGVPEN: definicion_CTX_F_B_NC_ND.montoIGVPEN,
      montoTotalPEN: definicion_CTX_F_B_NC_ND.montoTotalPEN,

      montoSubTotalUSD: definicion_CTX_F_B_NC_ND.montoSubTotalUSD,
      montoIGVUSD: definicion_CTX_F_B_NC_ND.montoIGVUSD,
      montoTotalUSD: definicion_CTX_F_B_NC_ND.montoTotalUSD,

      // fechaReferencia: venta.fechaReferencia,
      // tipoReferencia: venta.tipoReferencia,
      // serieReferencia: venta.serieReferencia,
      // numeroReferencia: venta.numeroReferencia,

      usuario: props.parametrosGlobales.usuario,
    });

    pasoProcesoGrabacion.value = true;
    if (ventaGRABADA) {
      grabo.value = true;
      //=> INICIALIZAR PARA LA SIGUIENTE VENTA
      definicion_CTX_F_B_NC_ND.codigoDocumento = '';
      definicion_CTX_F_B_NC_ND.documentoVenta = '';
      definicion_CTX_F_B_NC_ND.serie = '';
      definicion_CTX_F_B_NC_ND.numeroDocumento = 0;
      definicion_CTX_F_B_NC_ND.fecha = hoy();

      definicion_CTX_F_B_NC_ND.idCliente = '';
      definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad = '6';
      definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad = 'RUC';
      definicion_CTX_F_B_NC_ND.numeroIdentidad = '';
      definicion_CTX_F_B_NC_ND.razonSocialNombre = '';

      definicion_CTX_F_B_NC_ND.igv = 0;
      definicion_CTX_F_B_NC_ND.enDolares = false;
      definicion_CTX_F_B_NC_ND.moneda = 'PEN';
      definicion_CTX_F_B_NC_ND.tipoCambio = 0;

      definicion_CTX_F_B_NC_ND.vendedor = '';
      definicion_CTX_F_B_NC_ND.metodoPago = 'CONTADO';
      definicion_CTX_F_B_NC_ND.verCuotasCredito = false;
      definicion_CTX_F_B_NC_ND.cuotasCredito = [];
      definicion_CTX_F_B_NC_ND.importeTotalCuotasCredito = 0;

      definicion_CTX_F_B_NC_ND.cotizacion = 0;
      definicion_CTX_F_B_NC_ND.ordenServicio = 0;

      definicion_CTX_F_B_NC_ND.itemsVenta = [];

      definicion_CTX_F_B_NC_ND.montoSubTotalPEN = 0;
      definicion_CTX_F_B_NC_ND.montoIGVPEN = 0;
      definicion_CTX_F_B_NC_ND.montoTotalPEN = 0;

      definicion_CTX_F_B_NC_ND.montoSubTotalUSD = 0;
      definicion_CTX_F_B_NC_ND.montoIGVUSD = 0;
      definicion_CTX_F_B_NC_ND.montoTotalUSD = 0;
    } else {
      grabo.value = false;
    }
  });
  //#endregion SUBMIT

  return (
    <div
      class="container-modal"
      style={{
        // width: props.ancho + 'px',
        width: 'auto',
        background: `${definicion_CTX_F_B_NC_ND.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : ''}`,
        // border: '1px solid red',
        padding: '2px',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          // border: '1px solid blue',
          width: 'auto',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_docs_venta.mostrarPanelVenta = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            console.log('definicion_CTX_F_B_NC_ND', definicion_CTX_F_B_NC_ND);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES style={{ fontSize: '0.6rem' }} */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE FACTURA */}
          <div>
            {/* Documento onChange={buscarSeriesVenta}   , fontSize: '0.7rem'*/}
            <div class="form-control">
              <label>Documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectDocumentoVenta"
                  // style={{ width: '100%' }}
                  onChange$={(e) => {
                    tipoDocumento.value = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value={'01'} selected={tipoDocumento.value === '01'}>
                    FACTURA
                  </option>
                  <option value={'03'} selected={tipoDocumento.value === '03'}>
                    BOLETA
                  </option>
                  <option value={'07'} selected={tipoDocumento.value === '07'}>
                    NOTA DE CRÉDITO
                  </option>
                  <option value={'08'} selected={tipoDocumento.value === '08'}>
                    NOTA DE DÉBITO
                  </option>
                </select>
              </div>
            </div>
            {/* Serie  key={ser._id} id={ser._id} value={ser.serie}*/}
            <div class="form-control">
              <label>Serie</label>
              <div class="form-control form-agrupado">
                <select
                  // value={serieDocumento.value}
                  id="selectSerieVenta"
                  // style={{ width: '100%', fontSize: '0.7rem' }}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const rere = e.target as HTMLSelectElement;
                    const elOption = rere[idx];
                    console.log('elOption', elOption.id);
                    idSerieDocumento.value = elOption.id;
                    serieDocumento.value = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value="">-- Seleccione una opción --</option>
                  {dataSerie.value.map((ser: any) => {
                    return (
                      <option id={ser._id} value={ser.serie} selected={serieDocumento.value === ser.serie}>
                        {ser.serie}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {/* Numero de documento     value={numeroDocumento}*/}
            <div class="form-control">
              <label>Número</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumento"
                  // style={{ width: '100%', border: '1px solid red' }}
                  type="text"
                  disabled
                  value={definicion_CTX_F_B_NC_ND.numeroDocumento}
                />
              </div>
            </div>
            {/* fecha    onChange={(e) => setFecha(e.currentTarget.value)}*/}
            <div class="form-control">
              <label>Fecha</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputFecha"
                  type="date"
                  disabled
                  value={definicion_CTX_F_B_NC_ND.fecha}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.fecha = (e.target as HTMLInputElement).value;
                  }}
                  // style={{ width: '100%' }}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL CLIENTE */}
          <div>
            {/* tipo de documento identidad*/}
            <div class="form-control">
              <label>Tipo documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectTipoDocumentoLiteral"
                  // value={6}
                  value={definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad}
                  // onChange={cambioTipoDocumento}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const rere = e.target as HTMLSelectElement;
                    const elOption = rere[idx];
                    console.log('elOption', elOption.id);
                    //
                    // console.log('idx', idx.item.arguments(id));
                    // const csd = (e.target as HTMLSelectElement).current[idx];
                    // venta.codigoTipoDocumentoIdentidad = parseInt(elOption.id);
                    definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad = elOption.id;
                    definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                  }}
                  // style={{ width: '100%' }}
                >
                  <option id="1" value="DNI" selected={definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad === 'DNI'}>
                    DNI
                  </option>
                  <option id="6" value="RUC" selected={definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad === 'RUC'}>
                    RUC
                  </option>
                  <option id="4" value="C.EXT" selected={definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad === 'C.EXT'}>
                    C.EXT
                  </option>
                </select>
              </div>
            </div>
            {/* numero identidad*/}
            <div class="form-control">
              <label>Número identidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumentoIdentidad"
                  // style={{ width: '100%' }}
                  type="text"
                  placeholder="Add número"
                  value={definicion_CTX_F_B_NC_ND.numeroIdentidad}
                  onChange$={(e) => (definicion_CTX_F_B_NC_ND.numeroIdentidad = (e.target as HTMLInputElement).value)}
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
                <ImgButton
                  src={images.searchPLUS}
                  alt="Icono de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                  // onClick={buscarCliente}
                  onClick={$(() => {
                    ctx_docs_venta.mostrarPanelSeleccionarPersona = true;
                  })}
                />
              </div>
            </div>
            {ctx_docs_venta.mostrarPanelSeleccionarPersona && (
              <div class="modal">
                <SeleccionarPersona
                  // ancho={520}
                  seleccionar={'cliente'}
                  // parametrosGlobales={props.parametrosGlobales}
                  soloPersonasNaturales={false}
                />
              </div>
            )}
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <label>Razón social / Nombre</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNombreCliente"
                  // style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social / Nombre"
                  value={definicion_CTX_F_B_NC_ND.razonSocialNombre}
                  // onChange={(e) => setRazonSocialNombre(e.target.value)}
                />
              </div>
            </div>
            {/* E mail */}
            {/* <div class="form-control">
              <label>Email</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumero"
                  style={{ width: '100%' }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <ImgButton
                  src={icons.searchPLUS.default}
                  alt="Icono de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                />
              </div>
            </div> */}
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            <div class="form-control">
              <label>IGV (%)</label>
              <div class="form-control form-agrupado">
                <input type="text" id="inputIGV" disabled value={definicion_CTX_F_B_NC_ND.igv + ' %'} />
              </div>
            </div>
            {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
            <div class="form-control">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '3px' }}>
                <input
                  type="checkbox"
                  id="checkboxTipoCambio"
                  // onClick$={(e) => {
                  //   venta.enDolares = (e.target as HTMLInputElement).checked;
                  // }}
                  onClick$={(e) => {
                    obtenerTipoCambio(e.target as HTMLInputElement);
                  }}
                />
                <strong style={{ fontSize: '0.9rem', fontWeight: '400' }}>USD </strong>
                {''}
                <label
                  style={{ textAlign: 'start' }}
                  for="checkboxTipoCambio"
                  // onClick$={
                  //   (document.getElementById('checkboxTipoCambio')?.checked = !document.getElementById('checkboxTipoCambio'))
                  // }
                >
                  Tipo Cambio (USD)
                </label>
              </div>
              <div class="form-control form-agrupado">
                <input id="inputTipoCambio" type="text" value={definicion_CTX_F_B_NC_ND.tipoCambio} disabled />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* VENDEDOR - METODO DE PAGO */}
          <div>
            {/* Vendedor */}
            {/* <div class="form-control">
              <label>Vendedor</label>
              <div class="form-control form-agrupado">
                <input id="inputVendedor" style={{ width: '100%' }} type="text" disabled />
              </div>
            </div> */}
            {/* Método Pago */}
            <div class="form-control">
              <label>Método de pago</label>
              <div class="form-control form-agrupado" style={{ display: 'flex' }}>
                <select
                  id="metodoPago"
                  value={definicion_CTX_F_B_NC_ND.metodoPago}
                  // onChange={changeMetodoPago}
                  onChange$={() => {
                    definicion_CTX_F_B_NC_ND.verCuotasCredito = !definicion_CTX_F_B_NC_ND.verCuotasCredito;
                    console.log('definicion_CTX_F_B_NC_ND.metodoPago', definicion_CTX_F_B_NC_ND.metodoPago);
                  }}
                  style={definicion_CTX_F_B_NC_ND.verCuotasCredito ? { width: '79%' } : { width: '100%' }}
                >
                  <option value={'CONTADO'}>CONTADO</option>
                  <option value={'CRÉDITO'}>CRÉDITO</option>
                </select>
                {definicion_CTX_F_B_NC_ND.verCuotasCredito && (
                  <button
                    id="addCuota"
                    class="btn"
                    title="Adicionar cuota"
                    onClick$={() => {
                      (cuota.idAuxiliar = parseInt(elIdAuxiliar())),
                        (cuota.fechaCuota = hoy()),
                        (cuota.importeCuotaPEN = 0),
                        (cuotaCredito_esEdit.value = false);
                      ctx_docs_venta.mostrarPanelCuotasCredito = true;
                      ctx_docs_venta.grabo_CuotaCredito = false;
                    }}
                    // onClick$={() => (ctx_PanelVenta.mostrarPanelCuotasCredito = true)}
                  >
                    Add cuota
                  </button>
                )}
              </div>
            </div>
            {ctx_docs_venta.mostrarPanelCuotasCredito && (
              <div class="modal">
                <NewEditCuotaCreditoVenta
                  ancho={280}
                  esEdit={cuotaCredito_esEdit.value}
                  cuota={cuota}
                  // inicializarCuotaCredito={inicializarCuota}
                  // onAddEdit={inUpCuotaCredito}
                  // onCerrar={() => {
                  //   setShowCuotaCredito(false);
                  // }}
                />
              </div>
            )}
            {/* TABLA DE CUOTAS DE PAGO venta.verCuotasCredito &&   ctx_PanelVenta.grabo_cuotas_numero &&*/}
            {
              <div class="form-control">
                {definicion_CTX_F_B_NC_ND.cuotasCredito.length > 0 ? (
                  <table style={{ fontSize: '0.7em', fontWeight: 'lighter', margin: '5px 0' }}>
                    <thead>
                      <tr>
                        <th>Nro. Cuota</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {definicion_CTX_F_B_NC_ND.cuotasCredito.map((value: any, index: any) => {
                        //   const { idAuxiliar, fechaCuota, importeCuotaPEN } = cuota;
                        const indexItem = index + 1;
                        // sumaCuotas.value = sumaCuotas.value + redondeo2Decimales(cuota.importeCuotaPEN);
                        sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);

                        //   importeTotal(sumaCuotas);
                        // Cuota{}
                        return (
                          <tr key={value.idAuxiliar}>
                            <td data-label="Nro. Cuota" key={value.idAuxiliar}>{`${cerosALaIzquierda(indexItem, 3)}`}</td>
                            <td data-label="Fecha">{formatoDDMMYYYY_PEN(value.fechaCuota)}</td>
                            <td data-label="Importe" style={{ textAlign: 'end' }}>
                              {/* {cuota.importeCuotaPEN} */}
                              {`${value.importeCuotaPEN.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`}
                            </td>
                            <td data-label="Acciones" style={{ textAlign: 'center' }}>
                              <ImgButton
                                src={images.edit}
                                alt="icono de editar"
                                height={12}
                                width={12}
                                title="Editar ítem"
                                //   onClick={() => {
                                //     mostrarEdit({
                                //       idAuxiliar,
                                //       fechaCuota,
                                //       importeCuotaPEN,
                                //     });
                                //   }}
                              />
                              <ImgButton
                                src={images.trash}
                                alt="icono de eliminar"
                                height={12}
                                width={12}
                                title="Eliminar ítem"
                                //   onClick={() => {
                                //     onDel(idAuxiliar);
                                //   }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={2} style={{ textAlign: 'end' }}>
                          Suma Cuotas
                        </th>
                        <th colSpan={1} style={{ textAlign: 'end' }}>
                          {`${sumaCuotas.toLocaleString('en-PE', {
                            style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                ) : definicion_CTX_F_B_NC_ND.verCuotasCredito ? (
                  <i style={{ fontSize: '0.7rem' }}>No existen cuotas de crédito</i>
                ) : (
                  ''
                )}
              </div>
            }
            {/*   {showPanelDeleteCuotaCredito && (
              <Modal
                componente={
                  <DeleteCuotaCredito
                    elIdAuxiliarCuota={borrarIdAuxiliarCuotaCredito}
                    ancho={'500px'}
                    onCerrar={cerrarPanelDeleteCuota}
                  />
                }
              />
            )} */}
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* BOTONES */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#74a6ab' }}>
              <button id="btnVerAlmacen" onClick$={() => (ctx_docs_venta.mostrarVerAlmacen = true)} style={{ cursor: 'pointer' }}>
                Ver almacén
              </button>
              {ctx_docs_venta.mostrarVerAlmacen && (
                <div class="modal">
                  <BusquedaMercaderiaOUT ancho={740} parametrosGlobales={props.parametrosGlobales} item1={item} />
                </div>
              )}
              <button
                id="btnAddServicio"
                onClick$={() => (ctx_docs_venta.mostrarAdicionarServicio = true)}
                style={{ cursor: 'pointer' }}
              >
                Add servicio
              </button>
              {ctx_docs_venta.mostrarAdicionarServicio && (
                <div class="modal">
                  <SeleccionarServicio parametrosGlobales={props.parametrosGlobales} />
                </div>
              )}
              <button id="btnAddServicio" disabled onClick$={() => (ctx_docs_venta.mostrarVerAlmacen = true)}>
                Add concepto valor
              </button>
              <button
                id="btnAdjuntarCotizacion"
                onClick$={() => (ctx_docs_venta.mostrarAdjuntarCotizacion = true)}
                style={{ cursor: 'pointer' }}
              >
                Adjuntar cotización
              </button>
              {ctx_docs_venta.mostrarAdjuntarCotizacion && (
                <div class="modal">
                  <AdjuntarCotizacion ancho={700} parametrosGlobales={props.parametrosGlobales} />
                </div>
              )}
              <button id="btnAdjuntarOS" disabled onClick$={() => (ctx_docs_venta.mostrarAdjuntarCotizacion = true)}>
                Adjuntar O.S.
              </button>
              <button id="btnAdjuntarOS" disabled onClick$={() => (ctx_docs_venta.mostrarAdjuntarCotizacion = true)}>
                Descuento x Doc
              </button>
            </div>

            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/*  tabla ITEMS - VENTA */}
          {
            <div class="form-control">
              {definicion_CTX_F_B_NC_ND.itemsVenta.length > 0 ? (
                <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Uni</th>
                      <th>Precio Uni</th>
                      <th>Venta </th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {definicion_CTX_F_B_NC_ND.itemsVenta.map((iTVen: any, index: any) => {
                      const indexItemVenta = index + 1;
                      if (definicion_CTX_F_B_NC_ND.enDolares) {
                        sumaTOTAL =
                          sumaTOTAL +
                          redondeo2Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
                        subTOTAL = redondeo2Decimales((sumaTOTAL * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                        igvTOTAL = redondeo2Decimales(sumaTOTAL - subTOTAL);
                      } else {
                        sumaTOTAL =
                          sumaTOTAL +
                          redondeo2Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                        subTOTAL = redondeo2Decimales((sumaTOTAL * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                        igvTOTAL = redondeo2Decimales(sumaTOTAL - subTOTAL);
                      }

                      if (index + 1 === definicion_CTX_F_B_NC_ND.itemsVenta.length) {
                        console.log(subTOTAL);
                        console.log(igvTOTAL);
                        console.log(sumaTOTAL);
                        fijarMontos({ subTOTAL, igvTOTAL, sumaTOTAL });
                      }
                      // sumaItems = sumaItems + index;
                      return (
                        <tr key={iTVen.idAuxiliar}>
                          <td data-label="Ítem" key={iTVen.idAuxiliar}>{`${cerosALaIzquierda(indexItemVenta, 3)}`}</td>
                          <td data-label="Código">{iTVen.codigo}</td>
                          <td data-label="Descripción">{iTVen.descripcionEquivalencia}</td>
                          <td data-label="Cantidad" style={{ textAlign: 'end' }}>
                            <input
                              style={{ width: '60px', textAlign: 'end' }}
                              value={iTVen.cantidad.$numberDecimal ? iTVen.cantidad.$numberDecimal : iTVen.cantidad}
                              onChange$={(e) => {
                                // const iv = itemsVentaK[index];
                                iTVen.cantidad = parseFloat((e.target as HTMLInputElement).value);
                                if (definicion_CTX_F_B_NC_ND.enDolares) {
                                  iTVen.ventaUSD = iTVen.cantidad * iTVen.precioUSD;
                                  iTVen.ventaPEN = iTVen.cantidad * iTVen.precioPEN;
                                } else {
                                  iTVen.ventaPEN =
                                    (iTVen.cantidad ? iTVen.cantidad : iTVen.cantidad.$numberDecimal) *
                                    (iTVen.precioPEN ? iTVen.precioPEN : iTVen.precioPEN.$numberDecimal);
                                }
                              }}
                              // onChange={(e) => {
                              //   const iv = itemsVentaK[index];
                              //   iv['cantidad'] = Number.parseFloat(e.target.value);
                              //   if (venta.enDolares) {
                              //     console.log('TablaItemsVenta enDolares cantidad');
                              //     iv['ventaUSD'] = iv['cantidad'] * iv['precioUSD'];
                              //     iv['ventaPEN'] = iv['cantidad'] * iv['precioPEN'];
                              //   } else {
                              //     console.log('TablaItemsVenta enPEN cantidad');
                              //     iv['ventaPEN'] = iv['cantidad'] * iv['precioPEN'];
                              //   }
                              //   setItemsVentaK([
                              //     ...itemsVentaK.slice(0, index),
                              //     iv,
                              //     ...itemsVentaK.slice(index + 1, itemsVentaK.length),
                              //   ]);
                              // }}
                            />
                          </td>
                          <td data-label="Uni">{iTVen.unidadEquivalencia}</td>
                          <td data-label="Precio Uni" style={{ textAlign: 'end' }}>
                            <input
                              style={{ width: '60px', textAlign: 'end' }}
                              value={
                                definicion_CTX_F_B_NC_ND.enDolares
                                  ? iTVen.precioUSD.$numberDecimal
                                    ? iTVen.precioUSD.$numberDecimal
                                    : iTVen.precioUSD
                                  : iTVen.precioPEN.$numberDecimal
                                  ? iTVen.precioPEN.$numberDecimal
                                  : iTVen.precioPEN
                              }
                              onChange$={(e) => {
                                // const iv = itemsVentaK[index];
                                const precio = parseFloat((e.target as HTMLInputElement).value);
                                console.log('el precio modificado', precio);
                                if (definicion_CTX_F_B_NC_ND.enDolares) {
                                  iTVen.precioUSD = precio;
                                  iTVen.ventaUSD = iTVen.cantidad * iTVen.precioUSD;
                                  iTVen.ventaPEN = iTVen.cantidad * iTVen.precioPEN;
                                } else {
                                  iTVen.precioPEN = precio;
                                  console.log('el precio modificado, cant', iTVen.precioPEN, iTVen.cantidad);
                                  iTVen.ventaPEN =
                                    (iTVen.cantidad ? iTVen.cantidad : iTVen.cantidad.$numberDecimal) *
                                    (iTVen.precioPEN ? iTVen.precioPEN : iTVen.precioPEN.$numberDecimal);
                                }
                              }}
                              // onChange={(e) => {
                              //   const iv = itemsVentaK[index];

                              //   if (venta.enDolares) {
                              //     console.log('TablaItemsVenta enDolares precioPEN');
                              //     iv['precioUSD'] = e.target.value;
                              //     iv['ventaUSD'] = iv['cantidad'] * iv['precioUSD'];
                              //     iv['ventaPEN'] = iv['cantidad'] * iv['precioPEN'];
                              //   } else {
                              //     console.log('TablaItemsVenta PEN precioPEN');
                              //     iv['precioPEN'] = e.target.value;
                              //     iv['ventaPEN'] = iv['cantidad'] * iv['precioPEN'];
                              //   }
                              //   setItemsVentaK([
                              //     ...itemsVentaK.slice(0, index),
                              //     iv,
                              //     ...itemsVentaK.slice(index + 1, itemsVentaK.length),
                              //   ]);
                              // }}
                            />
                          </td>
                          <td data-label="Venta" style={{ textAlign: 'end' }}>
                            {/* {iTVen.ventaPEN ? iTVen.ventaPEN : iTVen.ventaPEN.$numberDecimal} */}
                            {definicion_CTX_F_B_NC_ND.enDolares
                              ? iTVen.ventaUSD
                                ? redondeo2Decimales(iTVen.ventaUSD)
                                : redondeo2Decimales(iTVen.ventaUSD.$numberDecimal)
                              : iTVen.ventaPEN
                              ? redondeo2Decimales(iTVen.ventaPEN)
                              : redondeo2Decimales(iTVen.ventaPEN.$numberDecimal)}
                          </td>
                          <td data-label="Acciones" style={{ textAlign: 'right' }}>
                            <ImgButton
                              src={images.trash}
                              alt="icono de eliminar"
                              height={12}
                              width={12}
                              title="Eliminar ítem"
                              // onClick={() => {
                              //   onBorrar({ indexItem, idAuxiliarItemVenta });
                              // }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* style={{ display: 'flex', flexDirection: 'column', justifyItems: 'end', border: '1px dashed blue' }} */}
                  <tfoot>
                    <tr style={{ display: 'flex', alignContent: 'center', border: '1px solid red' }}>
                      <td colSpan={6} style={{ textAlign: 'end' }}>
                        Sub total
                      </td>
                      <td colSpan={1} style={{ textAlign: 'end' }}>
                        {`${subTOTAL.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                    </tr>
                    <tr style={{ display: 'flex', alignContent: 'end', border: '1px solid green' }}>
                      <td colSpan={6} style={{ textAlign: 'end' }}>
                        IGV
                      </td>
                      <td colSpan={1} style={{ textAlign: 'end' }}>
                        {`${igvTOTAL.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                    </tr>
                    <tr style={{ display: 'flex', alignContent: 'center', border: '1px solid red' }}>
                      <td colSpan={6} style={{ textAlign: 'end' }}>
                        Total
                      </td>
                      <td colSpan={1} style={{ textAlign: 'end' }}>
                        {`${sumaTOTAL.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <i style={{ fontSize: '0.7rem' }}>No existen ítems para la venta</i>
              )}
            </div>
          }
        </div>
        <input
          type="submit"
          value={botonGrabar.value === '' ? 'Grabar' : `${botonGrabar.value}`}
          class="btn-centro"
          onClick$={() => grabando()}
          // onClick={(e) => onSubmit(e)}
        />
        {pasoProcesoGrabacion.value &&
          (grabo.value ? (
            <label style={{ color: 'green' }}>Registro SATISFACTORIO!!!</label>
          ) : (
            <label style={{ color: 'red' }}>Inconveniente en registro.</label>
          ))}
      </div>
    </div>
  );
});

// export const TablaCuotasCreditoVenta = component$((props: { registros: any }) => {
//   return (
//     <table style={{ fontSize: '0.7em', fontWeight: 'lighter', margin: '5px 0' }}>
//       <thead>
//         <tr>
//           <th>Nro. Cuota</th>
//           <th>Fecha</th>
//           <th>Importe</th>
//           <th>Acciones</th>
//         </tr>
//       </thead>
//       <tbody>
//         {props.registros.map((value: any, index: any) => {
//           //   const { idAuxiliar, fechaCuota, importeCuotaPEN } = cuota;
//           const indexItem = index + 1;
//           // sumaCuotas.value = sumaCuotas.value + redondeo2Decimales(cuota.importeCuotaPEN);
//           // sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);

//           //   importeTotal(sumaCuotas);
//           // Cuota{}
//           return (
//             <tr key={value.idAuxiliar}>
//               <td key={value.idAuxiliar}>{`${cerosALaIzquierda(indexItem, 3)}`}</td>
//               <td>{formatoDDMMYYYY_PEN(value.fechaCuota)}</td>
//               <td style={{ textAlign: 'end' }}>
//                 {/* {cuota.importeCuotaPEN} */}
//                 {`${value.importeCuotaPEN.toLocaleString('en-PE', {
//                   // style: 'currency',
//                   currency: 'PEN',
//                   minimumFractionDigits: 2,
//                 })}`}
//               </td>
//               <td style={{ textAlign: 'center' }}>
//                 <ImgButton
//                   src={images.edit}
//                   alt="icono de editar"
//                   height={12}
//                   width={12}
//                   title="Editar ítem"
//                   //   onClick={() => {
//                   //     mostrarEdit({
//                   //       idAuxiliar,
//                   //       fechaCuota,
//                   //       importeCuotaPEN,
//                   //     });
//                   //   }}
//                 />
//                 <ImgButton
//                   src={images.trash}
//                   alt="icono de eliminar"
//                   height={12}
//                   width={12}
//                   title="Eliminar ítem"
//                   //   onClick={() => {
//                   //     onDel(idAuxiliar);
//                   //   }}
//                 />
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//       <tfoot>
//         <tr>
//           <th colSpan={2} style={{ textAlign: 'end' }}>
//             Suma Cuotas
//           </th>
//           <th colSpan={1} style={{ textAlign: 'end' }}>
//             {/* {`${sumaCuotas.toLocaleString('en-PE', {
//               style: 'currency',
//               currency: 'PEN',
//               minimumFractionDigits: 2,
//             })}`} */}
//           </th>
//           <th>
//             <button
//               onClick$={() => {
//                 console.log('props.registros', props.registros);
//                 // console.log('ctx_add_venta_tabla.cuotasCredito', venta.cuotasCredito);
//               }}
//             >
//               ver ctx
//             </button>
//           </th>
//         </tr>
//       </tfoot>
//     </table>
//   );
// });
