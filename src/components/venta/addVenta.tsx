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
  // getSeriesFacturaActivas,
  // getSeriesBoletaActivas,
  // getSeriesNotaCreditoActivas,
  // getSeriesNotaDebitoActivas,
  getSeriesVentasActivasSegunTipo,
  // getIgvVenta,
} from '~/apis/venta.api';
//
import {
  hoy,
  elIdAuxiliar,
  cerosALaIzquierda,
  redondeo2Decimales,
  formatoDDMMYYYY_PEN,
  ultimoDiaDelPeriodoX,
} from '~/functions/comunes';
// import SeleccionarPersona from '../miscelanea/persona/seleccionarPersona';
import { CTX_INDEX_VENTA } from '~/routes/(almacen)/venta';
import { getTipoCambio } from '~/apis/apisExternas.api';
import { inVenta } from '~/apis/venta.api';
import NewEditCuotaCreditoVenta from './newEditCuotaCreditoVenta';
// import BusquedaMercaderiaOUT from '../outAlmacen/busquedaMercaderiaOUT';
import AdjuntarCotizacion from './adjuntarCotizacion';
// import styleTabla from '../../components/tabla.css?inline';
import styleTabla from '../tabla/tabla.css?inline';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
import AdjuntarOrdenServicio from './adjuntarOrdenServicio';
import { IPersona } from '~/interfaces/iPersona';
import { ICuotaCreditoVenta, IVenta } from '~/interfaces/iVenta';
import { parametrosGlobales } from '~/routes/login';
import BuscarServicio from '../miscelanea/servicio/buscarServicio';
import BorrarItemVenta from './borrarItemVenta';

export const CTX_CLIENTE_VENTA = createContextId<IPersona>('cliente');
export const CTX_F_B_NC_ND = createContextId<IVenta>('addVenta');
export const CTX_ADD_VENTA = createContextId<any>('add_venta');

export default component$((props: { ancho: number; addPeriodo: any; igv: number }) => {
  useStylesScoped$(styleTabla);
  //#region DEFINICION CTX_ADD_VENTA
  const definicion_CTX_ADD_VENTA = useStore({
    mostrarPanelCuotasCredito: false,
    grabo_CuotaCredito: false,
    mostrarVerAlmacen: false,

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersona: false,
    mostrarPanelBuscarServicio: false,
    mostrarPanelBuscarMercaderiaOUT: false,

    mostrarAdjuntarOS: false,
    mostrarAdjuntarCotizacion: false,

    mostrarPanelBorrarItemVenta: false,
    borrar_idAuxilarVenta: 0,
  });
  useContextProvider(CTX_ADD_VENTA, definicion_CTX_ADD_VENTA);
  //#endregion DEFINICION CTX_ADD_VENTA

  //#region DEFINICION CTX_F_B_NC_ND - NEW / EDIT
  const definicion_CTX_F_B_NC_ND = useStore<IVenta>(
    {
      _id: '',
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idSucursal: parametrosGlobales.idSucursal,
      idPeriodo: props.addPeriodo.idPeriodo,
      periodo: props.addPeriodo.periodo,

      ruc: parametrosGlobales.RUC,
      empresa: parametrosGlobales.RazonSocial,
      direccion: parametrosGlobales.Direccion,

      codigoTipoComprobantePago: '',
      tipoComprobantePago: '',
      idSerieVenta: '',
      serie: '',
      numero: 0,
      fecha: '', //hoy(),

      idCliente: '',
      codigoTipoDocumentoIdentidad: '6',
      tipoDocumentoIdentidad: 'RUC',
      numeroIdentidad: '',
      razonSocialNombre: '',

      igv: props.igv.valueOf(),
      enDolares: false,
      moneda: 'PEN',
      tipoCambio: 0,

      // idOrdenServicio: '',
      // serieOrdenServicio: '',
      // numeroOrdenServicio: 0,

      vendedor: '',
      metodoPago: 'CONTADO',
      verCuotasCredito: false,
      cuotasCredito: [],
      importeTotalCuotasCredito: 0,

      cotizacion: 0,

      // ordenServicio: 0,
      idOrdenServicio: '',
      serieOrdenServicio: '',
      numeroOrdenServicio: 0,

      observacion: '',

      itemsVenta: [],

      baseImponiblePEN: 0,
      igvPEN: 0,
      exoneradoPEN: 0,
      inafectoPEN: 0,
      iscPEN: 0,
      icbpPEN: 0,
      otrosPEN: 0,
      totalPEN: 0,

      baseImponibleUSD: 0,
      igvUSD: 0,
      exoneradoUSD: 0,
      inafectoUSD: 0,
      iscUSD: 0,
      icbpUSD: 0,
      otrosUSD: 0,
      totalUSD: 0,

      // montoSubTotalPEN: 0,
      // montoIGVPEN: 0,
      // montoTotalPEN: 0,

      // montoSubTotalUSD: 0,
      // montoIGVUSD: 0,
      // montoTotalUSD: 0,

      referenciaFecha: '',
      referenciaTipo: '',
      referenciaSerie: '',
      referenciaNumero: 0,
    },
    { deep: true }
  );
  useContextProvider(CTX_F_B_NC_ND, definicion_CTX_F_B_NC_ND);
  //#endregion DEFINICION CTX_F_B_NC_ND - NEW / EDIT

  //#region DEFINICION CTX_CLIENTE_VENTA
  const defini_CTX_CLIENTE_VENTA = useStore<IPersona>({
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
  useContextProvider(CTX_CLIENTE_VENTA, defini_CTX_CLIENTE_VENTA);
  //#endregion DEFINICION CTX_CLIENTE_VENTA

  //#region CONTEXTOS
  const ctx_index_venta = useContext(CTX_INDEX_VENTA);
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

  let sumaTOTAL_BI = 0;
  let sumaTOTAL_IGV = 0;
  let sumaTOTAL_EXO = 0;
  let sumaTOTAL_INAFEC = 0;
  let sumaTOTAL_ISC = 0;
  let sumaTOTAL_ICBP = 0;
  let sumaTOTAL_OTROS = 0;

  let sumaTOTAL = 0;

  let subTOTAL = 0;
  let igvTOTAL = 0;

  // const item = useStore<IItemVenta>({
  //   idAuxiliar: 0, //parseInt(elIdAuxiliar()),
  //   item: 0,
  //   codigo: '',
  //   descripcionEquivalencia: '',
  //   cantidad: 0,
  //   unidadEquivalencia: '',
  //   costo: 0,
  //   precioPEN: 0,
  //   ventaPEN: 0,
  //   precioUSD: 0,
  //   ventaUSD: 0,
  // });

  const cuota = useStore<ICuotaCreditoVenta>({
    idAuxiliar: 0,
    fechaCuota: hoy(),
    importeCuotaPEN: 99,
  });

  const borrarItemVenta = useStore({
    idAuxiliar: '',
    item: '',
    codigo: '',
    descripcion: '',
  });
  //#endregion INICIALIZACION

  //#region INICIALIZACION - TIPO DE DOCUMENTO F B NC ND
  //ESTO OCURRE ANTES DE RENDERIZAR
  useTask$(async ({ track }) => {
    track(() => tipoDocumento.value);
    // alert(`tretre a useTask ${documento.value}`);
    let laSerie;
    const parametros = {
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idSucursal: parametrosGlobales.idSucursal,
      codigo: tipoDocumento.value,
    };

    switch (tipoDocumento.value) {
      case '01': //FACTURA
        serieDocumento.value = '';
        // alert(`tretre a useTask FACTURA`);
        // laSerie = await getSeriesFacturaActivas(parametros);
        laSerie = await getSeriesVentasActivasSegunTipo(parametros);
        //
        dataSerie.value = laSerie.data;

        definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago = '01';
        definicion_CTX_F_B_NC_ND.tipoComprobantePago = 'FACTURA';
        botonGrabar.value = 'Grabar FACTURA';
        // setSeries(laSerie.data);
        // setCodigoDocumento('01');
        // setDocumentoVenta('FACTURA');
        // setBotonGrabar('Grabar FACTURA');

        break;
      case '03': //BOLETA
        serieDocumento.value = '';
        // alert(`tretre a useTask BOLETA`);
        // laSerie = await getSeriesBoletaActivas(parametros);
        laSerie = await getSeriesVentasActivasSegunTipo(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;

        definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago = '03';
        definicion_CTX_F_B_NC_ND.tipoComprobantePago = 'BOLETA';
        botonGrabar.value = 'Grabar BOLETA';
        // setBotonGrabar('Grabar BOLETA');

        break;
      case '07': //NOTA DE CRÉDITO
        serieDocumento.value = '';
        // alert(`tretre a useTask NOTA DE CRÉDITO`);
        // laSerie = await getSeriesNotaCreditoActivas(parametros);
        laSerie = await getSeriesVentasActivasSegunTipo(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;

        definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago = '07';
        definicion_CTX_F_B_NC_ND.tipoComprobantePago = 'NOTA DE CRÉDITO';
        botonGrabar.value = 'Grabar NOTA DE CRÉDITO';
        // setBotonGrabar('Grabar NOTA DE CRÉDITO');

        break;
      case '08': //NOTA DE DÉBITO
        serieDocumento.value = '';
        // alert(`tretre a useTask NOTA DE DÉBITO`);
        // laSerie = await getSeriesNotaDebitoActivas(parametros);
        laSerie = await getSeriesVentasActivasSegunTipo(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;

        definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago = '08';
        definicion_CTX_F_B_NC_ND.tipoComprobantePago = 'NOTA DE DÉBITO';
        botonGrabar.value = 'Grabar NOTA DE DÉBITO';
        // setBotonGrabar('Grabar NOTA DE DÉBITO');

        break;

      default:
        break;
    }
    //
    // let elIgv = await getIgvVenta(props.parametrosGlobales);
    // elIgv = elIgv.data;
    // //
    // venta.igv = elIgv[0].igv;
    // definicion_CTX_F_B_NC_ND.igv = props.igv;
  });
  //#endregion INICIALIZACION - TIPO DE DOCUMENTO F B NC ND

  //#region GENERALES
  useTask$(async ({ track }) => {
    track(() => serieDocumento.value);
    // const tre: HTMLSelectElement = document.getElementById('selectSerieVenta');
    // const elID = tre.current[2].value;
    if (serieDocumento.value === '') {
      // if (serieDocumento.value === '--Seleccione una opción--') {

      // setIdTipoDocumento('');
      definicion_CTX_F_B_NC_ND.serie = '';
      definicion_CTX_F_B_NC_ND.numero = 0;
    } else {
      //
      //
      //

      definicion_CTX_F_B_NC_ND.serie = serieDocumento.value;

      const corr = dataSerie.value.filter((ser: any) => ser._id === idSerieDocumento.value);
      const elCorre: { _id: string; codigo: string; serie: string; correlativo: number } = corr[0];

      definicion_CTX_F_B_NC_ND.numero = elCorre.correlativo + 1;
    }
  });
  //#endregion GENERALES

  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_VENTA.selecciono_Persona);
    if (definicion_CTX_ADD_VENTA.selecciono_Persona && definicion_CTX_ADD_VENTA.rol_Persona === 'cliente') {
      // alert('evalua a la persona');
      definicion_CTX_F_B_NC_ND.idCliente = defini_CTX_CLIENTE_VENTA._id;
      definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.codigoTipoDocumentoIdentidad;
      definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.tipoDocumentoIdentidad;
      definicion_CTX_F_B_NC_ND.numeroIdentidad = defini_CTX_CLIENTE_VENTA.numeroIdentidad;
      definicion_CTX_F_B_NC_ND.razonSocialNombre = defini_CTX_CLIENTE_VENTA.razonSocialNombre;

      definicion_CTX_ADD_VENTA.rol_Persona = '';
      definicion_CTX_ADD_VENTA.selecciono_Persona = false;
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

      let elTipoCambio = await getTipoCambio(definicion_CTX_F_B_NC_ND.fecha);
      elTipoCambio = elTipoCambio.data;

      definicion_CTX_F_B_NC_ND.moneda = elTipoCambio.moneda;
      definicion_CTX_F_B_NC_ND.tipoCambio = elTipoCambio.venta;
      // let itemsVVVVVV = await tablaItemsVentaADolares(elTipoCambio.venta);
      //
    } else {
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
    track(() => definicion_CTX_ADD_VENTA.mostrarPanelCuotasCredito);
    if (definicion_CTX_ADD_VENTA.grabo_CuotaCredito) {
      // alert(`${cuota.importeCuotaPEN}`);

      const elTarget = JSON.parse(JSON.stringify(cuota));

      const iT = elTarget;

      definicion_CTX_F_B_NC_ND.cuotasCredito.push(iT);
    }
  });
  //#endregion CUOTA CREDITO

  //#region ITEMS VENTA
  const fijarMontos = $((e: any) => {
    if (definicion_CTX_F_B_NC_ND.enDolares) {
      // definicion_CTX_F_B_NC_ND.baseImponibleUSD = e.subTOTAL;
      // definicion_CTX_F_B_NC_ND.igvUSD = e.igvTOTAL;
      // definicion_CTX_F_B_NC_ND.totalUSD = e.sumaTOTAL_IGV + e.sumaTOTAL_EXO + e.sumaTOTAL_INAFEC;
      // const tt = redondeo2Decimales(e.sumaTOTAL * definicion_CTX_F_B_NC_ND.tipoCambio);
      // const sub = redondeo2Decimales((tt * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
      // const i = redondeo2Decimales(tt - sub);
      // definicion_CTX_F_B_NC_ND.baseImponiblePEN = sub;
      // definicion_CTX_F_B_NC_ND.igvPEN = i;
      // definicion_CTX_F_B_NC_ND.totalPEN = tt;
    } else {
      definicion_CTX_F_B_NC_ND.baseImponiblePEN = e.sumaTOTAL_BI;
      definicion_CTX_F_B_NC_ND.exoneradoPEN = e.sumaTOTAL_EXO;
      definicion_CTX_F_B_NC_ND.inafectoPEN = e.sumaTOTAL_INAFEC;
      definicion_CTX_F_B_NC_ND.iscPEN = e.sumaTOTAL_ISC;
      definicion_CTX_F_B_NC_ND.icbpPEN = e.sumaTOTAL_ICBP;
      definicion_CTX_F_B_NC_ND.otrosPEN = e.sumaTOTAL_OTROS;
      definicion_CTX_F_B_NC_ND.igvPEN = e.sumaTOTAL_IGV;
      definicion_CTX_F_B_NC_ND.totalPEN = e.sumaTOTAL;
      console.log(
        'first',
        definicion_CTX_F_B_NC_ND.baseImponiblePEN,
        definicion_CTX_F_B_NC_ND.exoneradoPEN,
        definicion_CTX_F_B_NC_ND.inafectoPEN,
        definicion_CTX_F_B_NC_ND.iscPEN,
        definicion_CTX_F_B_NC_ND.icbpPEN,
        definicion_CTX_F_B_NC_ND.otrosPEN,
        definicion_CTX_F_B_NC_ND.igvPEN,
        definicion_CTX_F_B_NC_ND.totalPEN
      );
      definicion_CTX_F_B_NC_ND.baseImponibleUSD = 0;
      definicion_CTX_F_B_NC_ND.exoneradoUSD = 0;
      definicion_CTX_F_B_NC_ND.inafectoUSD = 0;
      definicion_CTX_F_B_NC_ND.iscUSD = 0;
      definicion_CTX_F_B_NC_ND.icbpUSD = 0;
      definicion_CTX_F_B_NC_ND.otrosUSD = 0;
      definicion_CTX_F_B_NC_ND.igvUSD = 0;
      definicion_CTX_F_B_NC_ND.totalUSD = 0;
    }
  });
  // useTask$(({ track }) => {
  //   track(() => ctx_PanelVenta.grabo_ItemsVenta);
  //   if (ctx_PanelVenta.grabo_ItemsVenta) {
  //
  //     const elTarget = JSON.parse(JSON.stringify(item));
  //
  //     // venta.itemsVenta = [...venta.itemsVenta, elTarget];
  //     ctx_PanelVenta.grabo_ItemsVenta = false;
  //     //
  //   }
  // });
  // const insertarItem = $(async () => {
  //   return
  // });
  // useTask$(({ track }) => {
  //   track(() => indexItemVenta.value);
  //
  // });
  // useTask$(({ track }) => {
  //   track(() => venta.itemsVenta);
  //
  // });
  // useTask$(({ track }) => {
  //   track(() => venta);
  //
  // });
  // useTask$(({ track }) => {
  //   track(() => venta.itemsVenta.length);
  //
  // });
  //#endregion ITEMS VENTA

  //#region ELIMINAR ITEM VENTA
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta);
    if (definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta > 0) {
      const newItems: any = definicion_CTX_F_B_NC_ND.itemsVenta.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta
      );
      definicion_CTX_F_B_NC_ND.itemsVenta = newItems;
      definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta = 0;
    }
  });
  //#endregion ELIMINAR ITEM VENTA

  //#region SUBMIT
  const grabandoVenta = $(async () => {
    if (definicion_CTX_F_B_NC_ND.serie === '') {
      alert('Seleccione la serie.');
      document.getElementById('selectSerieVenta')?.focus();
      return;
    }
    if (definicion_CTX_F_B_NC_ND.fecha === '') {
      alert('Ingrese la fecha');
      document.getElementById('in_Fecha')?.focus();
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
    if (
      definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '07' ||
      definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '08'
    ) {
      if (definicion_CTX_F_B_NC_ND.referenciaFecha === '') {
        alert('Ingrese la fecha de referencia de NC/ND');
        document.getElementById('in_VENTA_NC_ND_Fecha')?.focus();
        return;
      }
      if (definicion_CTX_F_B_NC_ND.referenciaTipo === '') {
        alert('Ingrese el tipo del documento referenciado');
        document.getElementById('in_VENTA_NC_ND_TCP')?.focus();
        return;
      }
      if (definicion_CTX_F_B_NC_ND.referenciaSerie === '') {
        alert('Ingrese la serie del documento referenciado');
        document.getElementById('in_VENTA_NC_ND_Serie')?.focus();
        return;
      }
      if (
        definicion_CTX_F_B_NC_ND.referenciaNumero.toString() === '' ||
        definicion_CTX_F_B_NC_ND.referenciaNumero.toString() === 'NaN'
      ) {
        alert('Ingrese el número valido del documento referenciado');
        document.getElementById('in_VENTA_NC_ND_Numero')?.focus();
        return;
      }

      //****************************************** */
      //***************SOLES******************** */
      definicion_CTX_F_B_NC_ND.baseImponiblePEN = definicion_CTX_F_B_NC_ND.baseImponiblePEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.baseImponiblePEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.baseImponiblePEN) * -1;
      definicion_CTX_F_B_NC_ND.igvPEN = definicion_CTX_F_B_NC_ND.igvPEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.igvPEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.igvPEN) * -1;
      definicion_CTX_F_B_NC_ND.exoneradoPEN = definicion_CTX_F_B_NC_ND.exoneradoPEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.exoneradoPEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.exoneradoPEN) * -1;
      definicion_CTX_F_B_NC_ND.inafectoPEN = definicion_CTX_F_B_NC_ND.inafectoPEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.inafectoPEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.inafectoPEN) * -1;
      definicion_CTX_F_B_NC_ND.iscPEN = definicion_CTX_F_B_NC_ND.iscPEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.iscPEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.iscPEN) * -1;
      definicion_CTX_F_B_NC_ND.icbpPEN = definicion_CTX_F_B_NC_ND.icbpPEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.icbpPEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.icbpPEN) * -1;
      definicion_CTX_F_B_NC_ND.otrosPEN = definicion_CTX_F_B_NC_ND.otrosPEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.otrosPEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.otrosPEN) * -1;
      definicion_CTX_F_B_NC_ND.totalPEN = definicion_CTX_F_B_NC_ND.totalPEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.totalPEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.totalPEN) * -1;
      //****************************************** */
      //***************DOLARES******************** */
      definicion_CTX_F_B_NC_ND.baseImponibleUSD = definicion_CTX_F_B_NC_ND.baseImponibleUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.baseImponibleUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.baseImponibleUSD) * -1;
      definicion_CTX_F_B_NC_ND.igvUSD = definicion_CTX_F_B_NC_ND.igvUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.igvUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.igvUSD) * -1;
      definicion_CTX_F_B_NC_ND.exoneradoUSD = definicion_CTX_F_B_NC_ND.exoneradoUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.exoneradoUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.exoneradoUSD) * -1;
      definicion_CTX_F_B_NC_ND.inafectoUSD = definicion_CTX_F_B_NC_ND.inafectoUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.inafectoUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.inafectoUSD) * -1;
      definicion_CTX_F_B_NC_ND.iscUSD = definicion_CTX_F_B_NC_ND.iscUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.iscUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.iscUSD) * -1;
      definicion_CTX_F_B_NC_ND.icbpUSD = definicion_CTX_F_B_NC_ND.icbpUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.icbpUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.icbpUSD) * -1;
      definicion_CTX_F_B_NC_ND.otrosUSD = definicion_CTX_F_B_NC_ND.otrosUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.otrosUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.otrosUSD) * -1;
      definicion_CTX_F_B_NC_ND.totalUSD = definicion_CTX_F_B_NC_ND.totalUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.totalUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.totalUSD) * -1;
    } else {
      definicion_CTX_F_B_NC_ND.referenciaFecha = '';
      definicion_CTX_F_B_NC_ND.referenciaTipo = '';
      definicion_CTX_F_B_NC_ND.referenciaSerie = '';
      definicion_CTX_F_B_NC_ND.referenciaNumero = 0;
    }

    // const aGrabar =
    const ventaGRABADA = await inVenta({
      idGrupoEmpresarial: definicion_CTX_F_B_NC_ND.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_F_B_NC_ND.idEmpresa,
      idSucursal: definicion_CTX_F_B_NC_ND.idSucursal,
      idPeriodo: definicion_CTX_F_B_NC_ND.idPeriodo,
      periodo: definicion_CTX_F_B_NC_ND.periodo,

      ruc: definicion_CTX_F_B_NC_ND.ruc,
      empresa: definicion_CTX_F_B_NC_ND.empresa,
      direccion: definicion_CTX_F_B_NC_ND.direccion,

      codigoTipoComprobantePago: definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago,
      tipoComprobantePago: definicion_CTX_F_B_NC_ND.tipoComprobantePago,
      idSerieVenta: definicion_CTX_F_B_NC_ND.idSerieVenta,
      serie: definicion_CTX_F_B_NC_ND.serie,
      numero: definicion_CTX_F_B_NC_ND.numero,
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
      // ordenServicio: definicion_CTX_F_B_NC_ND.ordenServicio,
      idOrdenServicio: definicion_CTX_F_B_NC_ND.idOrdenServicio,
      serieOrdenServicio: definicion_CTX_F_B_NC_ND.serieOrdenServicio,
      numeroOrdenServicio: definicion_CTX_F_B_NC_ND.numeroOrdenServicio,

      observacion: definicion_CTX_F_B_NC_ND.observacion.toUpperCase(),

      itemsVenta: definicion_CTX_F_B_NC_ND.itemsVenta,

      baseImponiblePEN: definicion_CTX_F_B_NC_ND.baseImponiblePEN,
      exoneradoPEN: definicion_CTX_F_B_NC_ND.exoneradoPEN,
      inafectoPEN: definicion_CTX_F_B_NC_ND.inafectoPEN,
      iscPEN: definicion_CTX_F_B_NC_ND.iscPEN,
      icbpPEN: definicion_CTX_F_B_NC_ND.icbpPEN,
      otrosPEN: definicion_CTX_F_B_NC_ND.otrosPEN,
      igvPEN: definicion_CTX_F_B_NC_ND.igvPEN,
      totalPEN: definicion_CTX_F_B_NC_ND.totalPEN,

      baseImponibleUSD: definicion_CTX_F_B_NC_ND.baseImponibleUSD,
      exoneradoUSD: definicion_CTX_F_B_NC_ND.exoneradoUSD,
      inafectoUSD: definicion_CTX_F_B_NC_ND.inafectoUSD,
      iscUSD: definicion_CTX_F_B_NC_ND.iscUSD,
      icbpUSD: definicion_CTX_F_B_NC_ND.icbpUSD,
      otrosUSD: definicion_CTX_F_B_NC_ND.otrosUSD,
      igvUSD: definicion_CTX_F_B_NC_ND.igvUSD,
      totalUSD: definicion_CTX_F_B_NC_ND.totalUSD,

      // montoSubTotalPEN: definicion_CTX_F_B_NC_ND.montoSubTotalPEN,
      // montoIGVPEN: definicion_CTX_F_B_NC_ND.montoIGVPEN,
      // montoTotalPEN: definicion_CTX_F_B_NC_ND.montoTotalPEN,

      // montoSubTotalUSD: definicion_CTX_F_B_NC_ND.montoSubTotalUSD,
      // montoIGVUSD: definicion_CTX_F_B_NC_ND.montoIGVUSD,
      // montoTotalUSD: definicion_CTX_F_B_NC_ND.montoTotalUSD,

      referenciaFecha: definicion_CTX_F_B_NC_ND.referenciaFecha,
      referenciaTipo: definicion_CTX_F_B_NC_ND.referenciaTipo,
      referenciaSerie: definicion_CTX_F_B_NC_ND.referenciaSerie,
      referenciaNumero: definicion_CTX_F_B_NC_ND.referenciaNumero,

      usuario: parametrosGlobales.usuario,
    });

    if (ventaGRABADA.status === 400) {
      alert('Falla al registrar la venta. ' + ventaGRABADA.message);
      return;
    }

    pasoProcesoGrabacion.value = true;
    if (ventaGRABADA) {
      grabo.value = true;
      //=> INICIALIZAR PARA LA SIGUIENTE VENTA
      definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago = '';
      definicion_CTX_F_B_NC_ND.tipoComprobantePago = '';
      definicion_CTX_F_B_NC_ND.idSerieVenta = '';
      definicion_CTX_F_B_NC_ND.serie = '';
      definicion_CTX_F_B_NC_ND.numero = 0;
      definicion_CTX_F_B_NC_ND.fecha = hoy();

      definicion_CTX_F_B_NC_ND.idCliente = '';
      definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad = '6';
      definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad = 'RUC';
      definicion_CTX_F_B_NC_ND.numeroIdentidad = '';
      definicion_CTX_F_B_NC_ND.razonSocialNombre = '';

      // definicion_CTX_F_B_NC_ND.igv = 0;
      definicion_CTX_F_B_NC_ND.enDolares = false;
      definicion_CTX_F_B_NC_ND.moneda = 'PEN';
      definicion_CTX_F_B_NC_ND.tipoCambio = 0;

      definicion_CTX_F_B_NC_ND.vendedor = '';
      definicion_CTX_F_B_NC_ND.metodoPago = 'CONTADO';
      definicion_CTX_F_B_NC_ND.verCuotasCredito = false;
      definicion_CTX_F_B_NC_ND.cuotasCredito = [];
      definicion_CTX_F_B_NC_ND.importeTotalCuotasCredito = 0;

      definicion_CTX_F_B_NC_ND.cotizacion = 0;
      // definicion_CTX_F_B_NC_ND.ordenServicio = 0;
      definicion_CTX_F_B_NC_ND.idOrdenServicio = '';
      definicion_CTX_F_B_NC_ND.serieOrdenServicio = '';
      definicion_CTX_F_B_NC_ND.numeroOrdenServicio = 0;

      definicion_CTX_F_B_NC_ND.observacion = '';

      definicion_CTX_F_B_NC_ND.itemsVenta = [];

      definicion_CTX_F_B_NC_ND.baseImponiblePEN = 0;
      definicion_CTX_F_B_NC_ND.igvPEN = 0;
      definicion_CTX_F_B_NC_ND.exoneradoPEN = 0;
      definicion_CTX_F_B_NC_ND.inafectoPEN = 0;
      definicion_CTX_F_B_NC_ND.iscPEN = 0;
      definicion_CTX_F_B_NC_ND.icbpPEN = 0;
      definicion_CTX_F_B_NC_ND.otrosPEN = 0;
      definicion_CTX_F_B_NC_ND.totalPEN = 0;

      definicion_CTX_F_B_NC_ND.baseImponibleUSD = 0;
      definicion_CTX_F_B_NC_ND.igvUSD = 0;
      definicion_CTX_F_B_NC_ND.exoneradoUSD = 0;
      definicion_CTX_F_B_NC_ND.inafectoUSD = 0;
      definicion_CTX_F_B_NC_ND.iscUSD = 0;
      definicion_CTX_F_B_NC_ND.icbpUSD = 0;
      definicion_CTX_F_B_NC_ND.otrosUSD = 0;
      definicion_CTX_F_B_NC_ND.totalUSD = 0;

      // definicion_CTX_F_B_NC_ND.montoSubTotalPEN = 0;
      // definicion_CTX_F_B_NC_ND.montoIGVPEN = 0;
      // definicion_CTX_F_B_NC_ND.montoTotalPEN = 0;

      // definicion_CTX_F_B_NC_ND.montoSubTotalUSD = 0;
      // definicion_CTX_F_B_NC_ND.montoIGVUSD = 0;
      // definicion_CTX_F_B_NC_ND.montoTotalUSD = 0;

      definicion_CTX_F_B_NC_ND.referenciaFecha = '';
      definicion_CTX_F_B_NC_ND.referenciaTipo = '';
      definicion_CTX_F_B_NC_ND.referenciaSerie = '';
      definicion_CTX_F_B_NC_ND.referenciaNumero = 0;
    }

    //OCULTAR MENSAJE DE GRABACION
    setTimeout(() => (pasoProcesoGrabacion.value = false), 3000);
  });
  //#endregion SUBMIT

  return (
    <div
      class="container-modal"
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(330px, 86%, 880px)',
        // width: 'auto',
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
            ctx_index_venta.grabo_Venta = grabo;
            ctx_index_venta.mostrarPanelVenta = false;
          })}
        />
        <ImgButton src={images.see} alt="Icono de ver" height={16} width={16} title="ver" onClick={$(() => {})} />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>Venta</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES style={{ fontSize: '0.6rem' }} */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* PERIODO */}
          <div>
            {/* PERIODO */}
            <div class="form-control">
              <label>Periodo</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Periodo"
                  style={{ width: '100%' }}
                  type="number"
                  // autoFocus
                  disabled
                  // placeholder="Add año DUA o DSI"
                  value={definicion_CTX_F_B_NC_ND.periodo}
                  // onInput$={(e) => {
                  //   definicion_CTX_COMPRA.anioDUAoDSI = parseInt((e.target as HTMLInputElement).value.trim());
                  // }}
                  // onKeyPress$={(e) => {
                  //   if (e.key === 'Enter') {
                  //     (document.getElementById('in_Serie') as HTMLInputElement)?.focus();
                  //   }
                  // }}
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

                    //
                    //
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
                <ImgButton
                  src={images.searchPLUS}
                  alt="Icono de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                  // onClick={buscarCliente}
                  onClick={$(() => {
                    definicion_CTX_ADD_VENTA.mostrarPanelBuscarPersona = true;
                  })}
                />
              </div>
            </div>
            {definicion_CTX_ADD_VENTA.mostrarPanelBuscarPersona && (
              <div class="modal">
                <BuscarPersona soloPersonasNaturales={false} seleccionar="cliente" contexto="venta" rol="cliente" />
              </div>
            )}
            {/* numero identidad*/}
            <div class="form-control">
              <label>Número identidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumentoIdentidad"
                  style={{ width: '100%' }}
                  type="number"
                  placeholder="Add número"
                  value={definicion_CTX_F_B_NC_ND.numeroIdentidad}
                  onChange$={(e) => (definicion_CTX_F_B_NC_ND.numeroIdentidad = (e.target as HTMLInputElement).value)}
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
              </div>
            </div>
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <label>Razón social / Nombre</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNombreCliente"
                  style={{ width: '100%' }}
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
          {/* GENERALES DE FACTURA */}
          <div>
            {/* Documento */}
            <div class="form-control">
              <label>Documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectDocumentoVenta"
                  // style={{ width: '100%' }}
                  onChange$={(e) => {
                    tipoDocumento.value = (e.target as HTMLSelectElement).value;
                    // alert('eligio ' + tipoDocumento.value);
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
            {/* Serie  */}
            <div class="form-control">
              <label>Serie</label>
              <div class="form-control form-agrupado">
                {
                  <select
                    id="selectSerieVenta"
                    onChange$={(e) => {
                      const idx = (e.target as HTMLSelectElement).selectedIndex;
                      const elSelect = e.target as HTMLSelectElement;
                      const elOption = elSelect[idx];

                      definicion_CTX_F_B_NC_ND.idSerieVenta = elOption.id;
                      definicion_CTX_F_B_NC_ND.serie = (e.target as HTMLSelectElement).value;
                      document.getElementById('in_Fecha')?.focus();
                    }}
                  >
                    <option value="">-- Seleccione una serie --</option>
                    {dataSerie.value.map((ser: any) => {
                      return (
                        <option id={ser._id} value={ser.serie} selected={definicion_CTX_F_B_NC_ND.serie === ser.serie}>
                          {ser.serie}
                        </option>
                      );
                    })}
                  </select>
                }
              </div>
            </div>
            {/* fecha    */}
            <div class="form-control">
              <label>Fecha</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Fecha_Para_Venta"
                  type="date"
                  // disabled
                  min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                  max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_F_B_NC_ND.fecha}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.fecha = (e.target as HTMLInputElement).value;
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* ***NC -- ND -- */}
          <div
            id="zona_NC_ND"
            style={{ background: 'grey' }}
            hidden={tipoDocumento.value === '07' || tipoDocumento.value === '08' ? false : true}
          >
            <div class="form-control">
              <div class="form-control form-agrupado" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'left' }}>
                <input
                  id="in_VENTA_NC_ND_Fecha"
                  // style={{ width: '100%' }}
                  // disabled
                  type="date"
                  placeholder="Add NC/ND Fecha"
                  value={definicion_CTX_F_B_NC_ND.referenciaFecha}
                  onChange$={(e) => (definicion_CTX_F_B_NC_ND.referenciaFecha = (e.target as HTMLInputElement).value)}
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
                <input
                  id="in_VENTA_NC_ND_TCP"
                  // style={{ width: '100%' }}
                  // disabled
                  type="number"
                  placeholder="Add NC/ND TCP"
                  value={definicion_CTX_F_B_NC_ND.referenciaTipo}
                  onChange$={(e) => (definicion_CTX_F_B_NC_ND.referenciaTipo = (e.target as HTMLInputElement).value)}
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
                <input
                  id="in_VENTA_NC_ND_Serie"
                  // style={{ width: '100%' }}
                  // disabled
                  type="text"
                  placeholder="Add NC/ND Serie"
                  value={definicion_CTX_F_B_NC_ND.referenciaSerie}
                  onChange$={(e) =>
                    (definicion_CTX_F_B_NC_ND.referenciaSerie = (e.target as HTMLInputElement).value.toUpperCase())
                  }
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
                <input
                  id="in_VENTA_NC_ND_Numero"
                  // style={{ width: '100%' }}
                  // disabled
                  type="number"
                  placeholder="Add NC/ND Numero"
                  value={definicion_CTX_F_B_NC_ND.referenciaNumero}
                  onChange$={(e) =>
                    (definicion_CTX_F_B_NC_ND.referenciaNumero = parseInt((e.target as HTMLInputElement).value.trim()))
                  }
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
              </div>
            </div>
          </div>
          <hr
            style={{ margin: '5px 0' }}
            hidden={tipoDocumento.value === '07' || tipoDocumento.value === '08' ? false : true}
          ></hr>
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            <div class="form-control">
              <label>IGV (%)</label>
              <div class="form-control form-agrupado">
                <strong style={{ fontSize: '0.9rem', fontWeight: '400', paddingLeft: '4px', paddingRight: '24px' }}>IGV</strong>
                <input type="text" id="inputIGV" disabled value={definicion_CTX_F_B_NC_ND.igv + ' %'} style={{ width: '100%' }} />
              </div>
            </div>
            {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
            <div class="form-control">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '3px' }}>
                <input
                  type="checkbox"
                  id="chbx_TipoCambio_Para_Venta"
                  // onClick$={(e) => {
                  //   venta.enDolares = (e.target as HTMLInputElement).checked;
                  // }}
                  onClick$={(e) => {
                    if (definicion_CTX_F_B_NC_ND.fecha === '') {
                      alert('Ingrese la fecha para esta venta');
                      (e.target as HTMLInputElement).checked = false;
                      document.getElementById('in_Fecha_Para_Venta')?.focus();
                      return;
                    }
                    obtenerTipoCambio(e.target as HTMLInputElement);
                  }}
                />
                <strong
                  style={{ fontSize: '0.9rem', fontWeight: '400', cursor: 'pointer' }}
                  onClick$={() => {
                    if ((document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked === false) {
                      if (definicion_CTX_F_B_NC_ND.fecha === '') {
                        alert('Ingrese la fecha para esta venta');
                        // (e.target as HTMLInputElement).checked = false;
                        (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = false;
                        document.getElementById('in_Fecha_Para_Venta')?.focus();
                        return;
                      }
                      (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = true;
                    } else {
                      (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = false;
                      // definicion_CTX_F_B_NC_ND.enDolares = false;
                    }
                    obtenerTipoCambio(document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement);
                    // document.getElementById('chbx_TipoCambio_Para_Venta')?.onclick;
                  }}
                >
                  USD
                </strong>
                {/* {''}
                <label
                  style={{ textAlign: 'start' }}
                  for="checkboxTipoCambio"
                  // onClick$={
                  //   (document.getElementById('checkboxTipoCambio')?.checked = !document.getElementById('checkboxTipoCambio'))
                  // }
                >
                  Tipo Cambio (USD)
                </label> */}
              </div>
              <div class="form-control form-agrupado">
                <input
                  id="inputTipoCambio"
                  type="number"
                  value={definicion_CTX_F_B_NC_ND.tipoCambio}
                  disabled
                  style={{ width: '100%' }}
                />
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
                      definicion_CTX_ADD_VENTA.mostrarPanelCuotasCredito = true;
                      definicion_CTX_ADD_VENTA.grabo_CuotaCredito = false;
                    }}
                    // onClick$={() => (ctx_PanelVenta.mostrarPanelCuotasCredito = true)}
                  >
                    Add cuota
                  </button>
                )}
              </div>
            </div>
            {definicion_CTX_ADD_VENTA.mostrarPanelCuotasCredito && (
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
              <button
                id="btnVerAlmacen"
                onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarMercaderiaOUT = true)}
                style={{ cursor: 'pointer' }}
              >
                Ver almacén
              </button>
              {definicion_CTX_ADD_VENTA.mostrarPanelBuscarMercaderiaOUT && (
                <div class="modal">
                  <BuscarMercaderiaOUT contexto="new_venta" esAlmacen={false} />
                  {/* <BusquedaMercaderiaOUT ancho={740} parametrosGlobales={props.parametrosGlobales} item1={item} /> */}
                </div>
              )}
              <button
                id="btnAddServicio"
                onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarServicio = true)}
                style={{ cursor: 'pointer' }}
              >
                Add servicio
              </button>
              {definicion_CTX_ADD_VENTA.mostrarPanelBuscarServicio && (
                <div class="modal">
                  <BuscarServicio contexto="new_venta" />
                </div>
              )}
              <button id="btnAdjuntarOS" onClick$={() => (definicion_CTX_ADD_VENTA.mostrarAdjuntarOS = true)}>
                Adjuntar O.S.
              </button>
              {definicion_CTX_ADD_VENTA.mostrarAdjuntarOS && (
                <div class="modal">
                  <AdjuntarOrdenServicio />
                </div>
              )}
              <button
                id="btnAdjuntarCotizacion"
                onClick$={() => (definicion_CTX_ADD_VENTA.mostrarAdjuntarCotizacion = true)}
                style={{ cursor: 'pointer' }}
              >
                Adjuntar cotización
              </button>
              {definicion_CTX_ADD_VENTA.mostrarAdjuntarCotizacion && (
                <div class="modal">
                  <AdjuntarCotizacion />
                </div>
              )}
              {/* <button id="btnAddServicio" disabled onClick$={() => (definicion_CTX_ADD_VENTA.mostrarVerAlmacen = true)}>
                Add concepto valor
              </button>
              <button id="btnAdjuntarOS" disabled onClick$={() => (definicion_CTX_ADD_VENTA.mostrarAdjuntarCotizacion = true)}>
                Descuento x Doc
              </button> */}
            </div>

            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* OBSERVACION */}
          <div>
            {/* OBSERVACION */}
            <div class="form-control">
              <label>Observación</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  id="in_Observacion"
                  value={definicion_CTX_F_B_NC_ND.observacion}
                  style={{ width: '100%', background: 'yellow' }}
                  placeholder="Observación"
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.observacion = (e.target as HTMLInputElement).value.toUpperCase().trim();
                  }}
                />
              </div>
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
                      <th>Exo</th>
                      <th>Ina</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {definicion_CTX_F_B_NC_ND.itemsVenta.map((iTVen: any, index: number) => {
                      const indexItemVenta = index + 1;
                      let t_bi = 0,
                        t_igv = 0,
                        t_exo = 0,
                        t_ina = 0,
                        t_isc = 0,
                        t_icbp = 0,
                        t_otros = 0;
                      if (definicion_CTX_F_B_NC_ND.enDolares) {
                        // if (iTVen.exonerado || iTVen.inafecto) {
                        //   sumaTOTAL =
                        //     sumaTOTAL +
                        //     redondeo2Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
                        //   subTOTAL = redondeo2Decimales(sumaTOTAL);
                        // } else {
                        //   subTOTAL = redondeo2Decimales((sumaTOTAL * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                        // }
                        // igvTOTAL = redondeo2Decimales(sumaTOTAL - subTOTAL);
                      } else {
                        if (iTVen.exonerado) {
                          t_exo = redondeo2Decimales(
                            iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                          );
                        } else {
                          if (iTVen.inafecto) {
                            t_ina = redondeo2Decimales(
                              iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                            );
                          } else {
                            // sumaTOTAL_IGV =
                            //   sumaTOTAL_IGV +
                            //   redondeo2Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                            // subTOTAL = redondeo2Decimales((sumaTOTAL_IGV * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                            const vv = redondeo2Decimales(
                              iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                            );
                            t_bi = redondeo2Decimales((vv * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                            t_igv = redondeo2Decimales(vv - t_bi);
                          }
                        }
                        sumaTOTAL = sumaTOTAL + t_bi + t_igv + t_exo + t_ina + t_isc + t_icbp + t_otros;
                        sumaTOTAL_BI = sumaTOTAL_BI + t_bi;
                        sumaTOTAL_IGV = sumaTOTAL_IGV + t_igv;
                        sumaTOTAL_EXO = sumaTOTAL_EXO + t_exo;
                        sumaTOTAL_INAFEC = sumaTOTAL_INAFEC + t_ina;
                        sumaTOTAL_ISC = sumaTOTAL_ISC + t_isc;
                        sumaTOTAL_ICBP = sumaTOTAL_ICBP + t_icbp;
                        sumaTOTAL_OTROS = sumaTOTAL_OTROS + t_otros;
                        // igvTOTAL = redondeo2Decimales(sumaTOTAL_IGV - subTOTAL);
                      }
                      console.log(
                        `valores ${index + 1} : `,
                        sumaTOTAL,
                        sumaTOTAL_BI,
                        sumaTOTAL_IGV,
                        sumaTOTAL_EXO,
                        sumaTOTAL_INAFEC,
                        sumaTOTAL_ISC,
                        sumaTOTAL_ICBP,
                        sumaTOTAL_OTROS
                      );
                      if (index + 1 === definicion_CTX_F_B_NC_ND.itemsVenta.length) {
                        fijarMontos({
                          sumaTOTAL,
                          sumaTOTAL_BI,
                          sumaTOTAL_IGV,
                          sumaTOTAL_EXO,
                          sumaTOTAL_INAFEC,
                          sumaTOTAL_ISC,
                          sumaTOTAL_ICBP,
                          sumaTOTAL_OTROS,
                        });
                      }
                      return (
                        <tr key={iTVen.idAuxiliar}>
                          <td data-label="Ítem" key={iTVen.idAuxiliar} class="comoCadena">{`${cerosALaIzquierda(
                            indexItemVenta,
                            3
                          )}`}</td>
                          <td data-label="Código" class="comoCadena">
                            {iTVen.codigo}
                          </td>
                          <td data-label="Descripción" class="comoCadena">
                            {iTVen.descripcionEquivalencia}
                          </td>
                          {/* ----------------------------------------------------- */}
                          <td data-label="Cantidad" class="comoNumero">
                            <input
                              type="number"
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
                            />
                          </td>
                          <td data-label="Uni" class="acciones">
                            {iTVen.unidadEquivalencia}
                          </td>
                          {/* ----------------------------------------------------- */}
                          <td data-label="Precio Uni" class="comoNumero">
                            <input
                              type="number"
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

                                if (definicion_CTX_F_B_NC_ND.enDolares) {
                                  iTVen.precioUSD = precio;
                                  iTVen.ventaUSD = iTVen.cantidad * iTVen.precioUSD;
                                  iTVen.ventaPEN = iTVen.cantidad * iTVen.precioPEN;
                                } else {
                                  iTVen.precioPEN = precio;

                                  iTVen.ventaPEN =
                                    (iTVen.cantidad ? iTVen.cantidad : iTVen.cantidad.$numberDecimal) *
                                    (iTVen.precioPEN ? iTVen.precioPEN : iTVen.precioPEN.$numberDecimal);
                                }
                              }}
                            />
                          </td>
                          {/* ----------------------------------------------------- */}
                          <td data-label="Venta" class="comoNumero">
                            {iTVen.ventaPEN ? iTVen.ventaPEN : iTVen.ventaPEN.$numberDecimal}
                            {/* {definicion_CTX_F_B_NC_ND.enDolares
                              ? iTVen.ventaUSD
                                ? redondeo2Decimales(iTVen.ventaUSD)
                                : redondeo2Decimales(iTVen.ventaUSD.$numberDecimal)
                              : iTVen.ventaPEN
                              ? redondeo2Decimales(iTVen.ventaPEN)
                              : redondeo2Decimales(iTVen.ventaPEN.$numberDecimal)} */}
                          </td>
                          <td data-label="Exo" class="acciones">
                            {iTVen.exonerado ? 'Si' : '-'}
                          </td>
                          <td data-label="Ina" class="acciones">
                            {iTVen.inafecto ? 'Si' : '-'}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.trash}
                              title="Eliminar ítem"
                              height={12}
                              width={12}
                              style={{ margin: '2px' }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                borrarItemVenta.idAuxiliar = iTVen.idAuxiliar;
                                // borrarItemVenta.item = indexItemServi;
                                borrarItemVenta.codigo = iTVen.codigo;
                                borrarItemVenta.descripcion = iTVen.descripcionEquivalencia;
                                definicion_CTX_ADD_VENTA.mostrarPanelBorrarItemVenta = true;
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  {/* style={{ display: 'flex', flexDirection: 'column', justifyItems: 'end', border: '1px dashed blue' }} */}
                  {/* <tfoot style={{ display: 'flex',justifyContent:'right',aligItems: 'right', border: '1px solid blue' }}> */}
                  <tfoot>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Base Imponible
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_BI.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>

                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Exoneredo
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_EXO.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Inafecto
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_INAFEC.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        IGV
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_IGV.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>{' '}
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Total
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>{' '}
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <i style={{ fontSize: '0.7rem' }}>No existen ítems para la venta</i>
              )}
              {definicion_CTX_ADD_VENTA.mostrarPanelBorrarItemVenta && (
                <div class="modal">
                  <BorrarItemVenta borrarItemVenta={borrarItemVenta} />
                </div>
              )}
            </div>
          }
        </div>
        <input
          type="submit"
          value={botonGrabar.value === '' ? 'Grabar' : `${botonGrabar.value}`}
          class="btn-centro"
          onClick$={() => grabandoVenta()}
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
