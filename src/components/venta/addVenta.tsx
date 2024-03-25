import {
  $,
  component$,
  createContextId,
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
  // getAsientoVenta,
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
  menosXdiasHoy,
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
import type { IPersona, IPersonaVenta } from '~/interfaces/iPersona';
import type { ICuotaCreditoVenta, IVenta } from '~/interfaces/iVenta';
import { parametrosGlobales } from '~/routes/login';
import BuscarServicio from '../miscelanea/servicio/buscarServicio';
import BorrarItemVenta from './borrarItemVenta';
import EditarImpuesto from './editarImpuesto';

export const CTX_CLIENTE_VENTA = createContextId<IPersona>('cliente');
export const CTX_F_B_NC_ND = createContextId<IVenta>('addVenta');
export const CTX_ADD_VENTA = createContextId<any>('add_venta');

// function preventScroll(e: any) {
//   e.preventDefault();
//   e.stopPropagation();

//   return false;
// }

export default component$((props: { addPeriodo: any; igv: number }) => {
  useStylesScoped$(styleTabla);
  //#region DEFINICION CTX_ADD_VENTA
  const definicion_CTX_ADD_VENTA = useStore({
    mostrarPanelCuotasCredito: false,
    grabo_CuotaCredito: false,
    mostrarVerAlmacen: false,

    desabilitarAlmacenServicios: false,

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersona: false,
    mostrarPanelBuscarServicio: false,
    mostrarPanelBuscarMercaderiaOUT: false,

    mostrarAdjuntarOS: false,
    mostrarAdjuntarCotizacion: false,

    mostrarPanelBorrarItemVenta: false,
    borrar_idAuxilarVenta: 0,

    mostrarPanelEditarImpuesto: false,
    grabo_EditarImpuesto: false,
  });
  useContextProvider(CTX_ADD_VENTA, definicion_CTX_ADD_VENTA);
  //#endregion DEFINICION CTX_ADD_VENTA

  //#region DEFINICION CTX_F_B_NC_ND
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
      fecha: hoy(), //'', //

      clienteVentasVarias: false,
      idCliente: '',
      codigoTipoDocumentoIdentidad: '6',
      tipoDocumentoIdentidad: 'RUC',
      numeroIdentidad: '',
      razonSocialNombre: '',
      email: '',
      actualizarEmailCliente: false,

      igv: props.igv.valueOf(),
      enDolares: false,
      moneda: 'PEN',
      tipoCambio: 0,

      vendedor: '',
      metodoPago: 'CONTADO',

      todoEnEfectivo: true,
      unaParteEnEfectivo: false,
      montoEnEfectivo: '',
      otroMedioPago: 'TRANSFERENCIA DE FONDOS',
      montoOtroMedioPago: '',

      verCuotasCredito: false,
      cuotasCredito: [],
      importeTotalCuotasCredito: 0,

      idCotizacion: '',
      serieCotizacion: '',
      numeroCotizacion: 0,

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
      exportPEN: 0,
      otrosPEN: 0,
      totalPEN: 0,

      baseImponibleUSD: 0,
      igvUSD: 0,
      exoneradoUSD: 0,
      inafectoUSD: 0,
      iscUSD: 0,
      exportUSD: 0,
      otrosUSD: 0,
      totalUSD: 0,

      referenciaFecha: '',
      referenciaTipo: '',
      referenciaSerie: '',
      referenciaNumero: 0,

      facturacionElectronica: parametrosGlobales.facturacionElectronica,
      facturacionElectronicaAutomatica: parametrosGlobales.facturacionElectronicaAutomatica,

      contabilizarOperaciones: parametrosGlobales.contabilizarOperaciones,
      asientoContable: [],
      totalDebePEN: -1,
      totalHaberPEN: 0,
      totalDebeUSD: -1,
      totalHaberUSD: 0,
    },
    { deep: true }
  );
  useContextProvider(CTX_F_B_NC_ND, definicion_CTX_F_B_NC_ND);
  //#endregion DEFINICION CTX_F_B_NC_ND

  //#region DEFINICION CTX_CLIENTE_VENTA
  const defini_CTX_CLIENTE_VENTA = useStore<IPersonaVenta>({
    _id: '',
    codigoTipoDocumentoIdentidad: '',
    tipoDocumentoIdentidad: '',
    numeroIdentidad: '',
    razonSocialNombre: '',
    nombre: '',
    paterno: '',
    materno: '',
    activo: true,
    email: '',
  });
  useContextProvider(CTX_CLIENTE_VENTA, defini_CTX_CLIENTE_VENTA);
  //#endregion DEFINICION CTX_CLIENTE_VENTA

  //#region CONTEXTOS
  const ctx_index_venta = useContext(CTX_INDEX_VENTA);
  // ctx_index_venta.mostrarSpinner = false;
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const tipoDocumento = useSignal('01'); //01-FACTURA  //03-BOLETA
  const idSerieDocumento = useSignal('');
  const serieDocumento = useSignal('');
  const botonGrabar = useSignal('');
  const dataSerie = useSignal([]);
  const cuotaCredito_esEdit = useSignal(false);
  const pasoProcesoGrabacion = useSignal(false);
  const grabo = useSignal(false);
  const montoCONTADO_DOS_PARTES = useSignal(0);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);

  const TOTAL: any = parametrosGlobales.asientoVenta.filter((ele: any) => ele.total12_impuesto40 === true);
  const IMPUESTO: any = parametrosGlobales.asientoVenta.filter((ele: any) => ele.total12_impuesto40 === false);

  // document.querySelector('.scrollable').addEventListener('wheel', preventScroll);
  //   const DDD = document.querySelector('.comoNumero');
  // DDD?.addEventListener('wheel',(event)=>{
  //   if (DDD?.activeElement.type==='number') {

  //   }
  // });

  // document.addEventListener('wheel', (event: any) => {
  //   if (document.activeElement?.type === 'number') {
  //     document.activeElement?.scroll();
  //   }
  // });

  // document.addEventListener('wheel', (event) => {
  //   if (document.activeElement.type === 'number') {
  //     document.activeElement.blur();
  //   }
  // });

  const emailOrigen = useSignal('');

  let sumaCuotas = 0;

  let sumaTOTAL_BI = 0;
  let sumaTOTAL_IGV = 0;
  let sumaTOTAL_EXO = 0;
  let sumaTOTAL_INAFEC = 0;
  let sumaTOTAL_ISC = 0;
  let sumaTOTAL_EXPORT = 0;
  let sumaTOTAL_OTROS = 0;

  let sumaTOTAL = 0;

  // let arregloASIENTO = [];

  // let subTOTAL = 0;
  // let igvTOTAL = 0;

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

  const editarImpuesto_ItemVenta = useStore({
    idAuxiliar: '',
    item: '',
    descripcion: '',
    tipoImpuesto: '',
    tipoAfectacionDelImpuesto: '',
  });
  const borrarItemVenta = useStore({
    idAuxiliar: '',
    item: '',
    codigo: '',
    descripcion: '',
  });

  useTask$(async ({ track }) => {
    track(() => ini.value);

    if (ini.value === 0) {
      ctx_index_venta.mostrarSpinner = false;

      // //validar PERIODO
      // const anio = definicion_CTX_F_B_NC_ND.fecha;
      // const mes = definicion_CTX_F_B_NC_ND.fecha;
      // // console.log('la fechitaaaa', anio + mes);
      // const mas = anio + mes;
      // const PPP = losPeriodosCargados.value;
      // // console.log('mas', mas);
      // // console.log('PPP', PPP);
      // const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(mas));
      // // console.log('elPeriodo', elPeriodo);
      // definicion_CTX_F_B_NC_ND.idPeriodo = elPeriodo._id;
      // definicion_CTX_F_B_NC_ND.periodo = elPeriodo.periodo;

      //obtener ASIENTO VENTA
      // if (definicion_CTX_F_B_NC_ND.contabilizarOperaciones && definicion_CTX_F_B_NC_ND.asientoContable.length === 0) {
      //   let lasCuentas: any = await getAsientoVenta({
      //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      //     idEmpresa: parametrosGlobales.idEmpresa,
      //   });
      //   lasCuentas = lasCuentas.data;

      //   definicion_CTX_F_B_NC_ND.asientoContable = lasCuentas;
      // }
    }
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
        if (dataSerie.value.length === 1) {
          const SSS: any = dataSerie.value;
          // console.log('SSS', SSS);
          definicion_CTX_F_B_NC_ND.idSerieVenta = SSS[0]._id;
          definicion_CTX_F_B_NC_ND.serie = SSS[0].serie;
          serieDocumento.value = SSS[0].serie;
        }

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
        console.log('SSS 03-BOLETA03-BOLETA03-BOLETA03-BOLETA03-BOLETA');
        laSerie = await getSeriesVentasActivasSegunTipo(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;
        if (dataSerie.value.length === 1) {
          const SSS: any = dataSerie.value;
          console.log('SSS', SSS);
          definicion_CTX_F_B_NC_ND.idSerieVenta = SSS[0]._id;
          definicion_CTX_F_B_NC_ND.serie = SSS[0].serie;
          serieDocumento.value = SSS[0].serie;
          console.log('SSS', definicion_CTX_F_B_NC_ND.idSerieVenta, definicion_CTX_F_B_NC_ND.serie);
        }

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
        if (dataSerie.value.length === 1) {
          const SSS: any = dataSerie.value;
          // console.log('SSS', SSS);
          definicion_CTX_F_B_NC_ND.idSerieVenta = SSS[0]._id;
          definicion_CTX_F_B_NC_ND.serie = SSS[0].serie;
          serieDocumento.value = SSS[0].serie;
        }

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
        if (dataSerie.value.length === 1) {
          const SSS: any = dataSerie.value;
          // console.log('SSS', SSS);
          definicion_CTX_F_B_NC_ND.idSerieVenta = SSS[0]._id;
          definicion_CTX_F_B_NC_ND.serie = SSS[0].serie;
          serieDocumento.value = SSS[0].serie;
        }

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
  // useTask$(async ({ track }) => {
  //   track(() => serieDocumento.value);
  //   // const tre: HTMLSelectElement = document.getElementById('selectSerieVenta');
  //   // const elID = tre.current[2].value;
  //   if (serieDocumento.value === '') {
  //     // if (serieDocumento.value === '--Seleccione una opción--') {

  //     // setIdTipoDocumento('');
  //     definicion_CTX_F_B_NC_ND.serie = '';
  //     definicion_CTX_F_B_NC_ND.numero = 0;
  //   } else {
  //     //
  //     //
  //     //

  //     definicion_CTX_F_B_NC_ND.serie = serieDocumento.value;

  //     const corr = dataSerie.value.filter((ser: any) => ser._id === idSerieDocumento.value);
  //     const elCorre: { _id: string; codigo: string; serie: string; correlativo: number } = corr[0];

  //     definicion_CTX_F_B_NC_ND.numero = elCorre.correlativo + 1;
  //   }
  // });
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
      definicion_CTX_F_B_NC_ND.email = defini_CTX_CLIENTE_VENTA.email;

      emailOrigen.value = defini_CTX_CLIENTE_VENTA.email;

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
      definicion_CTX_F_B_NC_ND.exportPEN = e.sumaTOTAL_EXPORT;
      definicion_CTX_F_B_NC_ND.otrosPEN = e.sumaTOTAL_OTROS;
      definicion_CTX_F_B_NC_ND.igvPEN = e.sumaTOTAL_IGV;
      definicion_CTX_F_B_NC_ND.totalPEN = e.sumaTOTAL;
      console.log(
        'first',
        definicion_CTX_F_B_NC_ND.baseImponiblePEN,
        definicion_CTX_F_B_NC_ND.exoneradoPEN,
        definicion_CTX_F_B_NC_ND.inafectoPEN,
        definicion_CTX_F_B_NC_ND.iscPEN,
        definicion_CTX_F_B_NC_ND.exportPEN,
        definicion_CTX_F_B_NC_ND.otrosPEN,
        definicion_CTX_F_B_NC_ND.igvPEN,
        definicion_CTX_F_B_NC_ND.totalPEN
      );
      definicion_CTX_F_B_NC_ND.baseImponibleUSD = 0;
      definicion_CTX_F_B_NC_ND.exoneradoUSD = 0;
      definicion_CTX_F_B_NC_ND.inafectoUSD = 0;
      definicion_CTX_F_B_NC_ND.iscUSD = 0;
      definicion_CTX_F_B_NC_ND.exportUSD = 0;
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

  //#region ELIMINAR ITEM VENTA Y CUENTA CONTABLE
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta);

    if (definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta > 0) {
      //ITEM VENTA
      const newItems: any = definicion_CTX_F_B_NC_ND.itemsVenta.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta
      );
      definicion_CTX_F_B_NC_ND.itemsVenta = newItems;
      //CUENTA CONTABLE
      const newCuentas: any = definicion_CTX_F_B_NC_ND.asientoContable.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta
      );
      definicion_CTX_F_B_NC_ND.asientoContable = newCuentas;

      definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta = 0;
    }
  });
  //#endregion ELIMINAR ITEM VENTA Y CUENTA CONTABLE

  //#region EDITAR IMPUESTO
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_VENTA.grabo_EditarImpuesto);

    if (definicion_CTX_ADD_VENTA.grabo_EditarImpuesto) {
      console.log('editarImpuesto_ItemVenta', editarImpuesto_ItemVenta);
      const aModificar = definicion_CTX_F_B_NC_ND.itemsVenta.filter(
        (elIT: any) => elIT.idAuxiliar === editarImpuesto_ItemVenta.idAuxiliar
      );
      console.log('aModificar 0', aModificar);
      aModificar[0].tipoImpuesto = editarImpuesto_ItemVenta.tipoImpuesto;
      aModificar[0].tipoAfectacionDelImpuesto = editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto;
      console.log('aModificar 1', aModificar);
      definicion_CTX_ADD_VENTA.grabo_EditarImpuesto = false;
    }
  });
  //#endregion EDITAR IMPUESTO

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
    //CLIENTE
    if (definicion_CTX_F_B_NC_ND.clienteVentasVarias) {
      if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago !== '03') {
        alert('La venta para CLIENTES VENTA VARIAS debe ser una BOLETA.');
        document.getElementById('selectDocumentoVenta')?.focus();
        return;
      }
    } else {
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
    }
    //FACTURA
    console.log(
      'definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago - definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad',
      definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago,
      definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad
    );
    if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '01') {
      if (definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad !== '6') {
        alert('La factura requiere el RUC del cliente.');
        document.getElementById('ima_BuscarCliente_VENTA')?.focus();
        return;
      }
    }
    //BOLETA
    if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '03') {
      if (definicion_CTX_F_B_NC_ND.totalPEN > 700) {
        if (definicion_CTX_F_B_NC_ND.clienteVentasVarias) {
          alert('SUNAT no permite boletas con ventas mayores a S/ 700 soles sin que se identifique al cliente');
          document.getElementById('ima_BuscarCliente_VENTA')?.focus();
          return;
        }
      }
      if (!definicion_CTX_F_B_NC_ND.clienteVentasVarias && definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad === '6') {
        alert('Verifique, ha ingresado un RUC.');
        document.getElementById('ima_BuscarCliente_VENTA')?.focus();
        return;
      }
    }
    //NC - ND
    if (
      definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '07' ||
      definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '08'
    ) {
      if (definicion_CTX_F_B_NC_ND.clienteVentasVarias) {
        alert('Debe identificar al cliente');
        document.getElementById('ima_BuscarCliente_VENTA')?.focus();
        return;
      }
    }
    //AL CONTADO
    if (!definicion_CTX_F_B_NC_ND.verCuotasCredito) {
      if (definicion_CTX_F_B_NC_ND.unaParteEnEfectivo) {
        if (definicion_CTX_F_B_NC_ND.montoEnEfectivo === '' || definicion_CTX_F_B_NC_ND.montoEnEfectivo === 0) {
          alert('Ingrese el monto en efectivo.');
          document.getElementById('inputMontoEnEfectivo')?.focus();
          return;
        }
        if (!Number.parseFloat(definicion_CTX_F_B_NC_ND.montoEnEfectivo)) {
          alert('Verifique el monto en efectivo.');
          document.getElementById('inputMontoEnEfectivo')?.focus();
          return;
        }
        if (definicion_CTX_F_B_NC_ND.montoOtroMedioPago === '' || definicion_CTX_F_B_NC_ND.montoOtroMedioPago === 0) {
          alert(`Ingrese el monto en otro medio de pago: ${definicion_CTX_F_B_NC_ND.otroMedioPago}`);
          document.getElementById('inputMontoOtroMedioPago')?.focus();
          return;
        }
        if (!Number.parseFloat(definicion_CTX_F_B_NC_ND.montoOtroMedioPago)) {
          alert('Verifique el monto en otro medio de pago.');
          document.getElementById('inputMontoOtroMedioPago')?.focus();
          return;
        }

        montoCONTADO_DOS_PARTES.value =
          parseFloat(definicion_CTX_F_B_NC_ND.montoEnEfectivo) + parseFloat(definicion_CTX_F_B_NC_ND.montoOtroMedioPago);
        if (definicion_CTX_F_B_NC_ND.enDolares) {
          const TOT = definicion_CTX_F_B_NC_ND.totalUSD.$numberDecimal
            ? definicion_CTX_F_B_NC_ND.totalUSD.$numberDecimal
            : definicion_CTX_F_B_NC_ND.totalUSD;
          if (montoCONTADO_DOS_PARTES.value !== TOT) {
            console.log('monto - total', montoCONTADO_DOS_PARTES.value, TOT);
            alert('La suma de los montos de al CONTADO no coincide con el TOTAL.');
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        } else {
          const TOT = definicion_CTX_F_B_NC_ND.totalPEN.$numberDecimal
            ? definicion_CTX_F_B_NC_ND.totalPEN.$numberDecimal
            : definicion_CTX_F_B_NC_ND.totalPEN;
          if (montoCONTADO_DOS_PARTES.value !== TOT) {
            console.log('monto - total', montoCONTADO_DOS_PARTES.value, TOT);
            alert('La suma de los montos de al CONTADO no coincide con el TOTAL.');
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        }
      }
    }
    //A CREDITO
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
      definicion_CTX_F_B_NC_ND.exportPEN = definicion_CTX_F_B_NC_ND.exportPEN.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.exportPEN.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.exportPEN) * -1;
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
      definicion_CTX_F_B_NC_ND.exportUSD = definicion_CTX_F_B_NC_ND.exportUSD.$numberDecimal
        ? Math.abs(definicion_CTX_F_B_NC_ND.exportUSD.$numberDecimal) * -1
        : Math.abs(definicion_CTX_F_B_NC_ND.exportUSD) * -1;
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
    //ACTUALIZAR EMAIL ???
    if (definicion_CTX_F_B_NC_ND.email !== '') {
      if (emailOrigen.value !== definicion_CTX_F_B_NC_ND.email) {
        definicion_CTX_F_B_NC_ND.actualizarEmailCliente = true;
      }
    }
    //CONTABIIZAR
    if (definicion_CTX_F_B_NC_ND.contabilizarOperaciones) {
      let total12 = 0;
      let impuesto40 = 0;
      let producto70 = 0;

      definicion_CTX_F_B_NC_ND.itemsVenta.forEach((merca: any) => {
        if (merca.codigoContableVenta !== '') {
          console.log('merca.ventaPEN merca.porcentaje', merca.ventaPEN, merca.porcentaje, 1 + merca.porcentaje / 100);
          let pro = 0;
          total12 = total12 + merca.ventaPEN;
          if (merca.porcentaje === 0) {
            pro = merca.ventaPEN;
          } else {
            pro = merca.ventaPEN / (1 + merca.porcentaje / 100);
          }
          producto70 = producto70 + pro;
          impuesto40 = impuesto40 + (merca.ventaPEN - pro);
          console.log('pro impu', pro, merca.ventaPEN - pro);
          //construyendo el asiento
          definicion_CTX_F_B_NC_ND.asientoContable.push({
            idAuxiliar: parseInt(elIdAuxiliar()),
            item: 0,
            codigo: merca.codigoContableVenta,
            descripcion: merca.descripcionContableVenta,
            tipo: false,
            importe: pro,
          });
        }
      });
      //insertando IMPUESTO
      if (impuesto40 !== 0) {
        if (IMPUESTO.length > 0) {
          definicion_CTX_F_B_NC_ND.asientoContable.unshift({
            idAuxiliar: parseInt(elIdAuxiliar()),
            item: 0,
            codigo: IMPUESTO[0].codigo,
            descripcion: IMPUESTO[0].descripcion,
            tipo: false,
            importe: impuesto40,
          });
        }
      }
      //insertando TOTAL
      if (TOTAL.length > 0) {
        definicion_CTX_F_B_NC_ND.asientoContable.unshift({
          idAuxiliar: parseInt(elIdAuxiliar()),
          item: 0,
          codigo: TOTAL[0].codigo,
          descripcion: TOTAL[0].descripcion,
          tipo: true,
          importe: total12,
        });
      }

      //VACIAR ASIENTO CONTABLE si no hay PARTIDA DOBLE
      if (total12 !== definicion_CTX_F_B_NC_ND.totalPEN) {
        definicion_CTX_F_B_NC_ND.asientoContable = [];
        //insertando IMPUESTO
        definicion_CTX_F_B_NC_ND.asientoContable.unshift({
          idAuxiliar: parseInt(elIdAuxiliar()),
          item: 0,
          codigo: IMPUESTO[0].codigo,
          descripcion: IMPUESTO[0].descripcion,
          tipo: false,
          importe: 0,
        });
        //insertando TOTAL
        definicion_CTX_F_B_NC_ND.asientoContable.unshift({
          idAuxiliar: parseInt(elIdAuxiliar()),
          item: 0,
          codigo: TOTAL[0].codigo,
          descripcion: TOTAL[0].descripcion,
          tipo: true,
          importe: -1,
        });
      }
    }

    ctx_index_venta.mostrarSpinner = true;
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

      clienteVentasVarias: definicion_CTX_F_B_NC_ND.clienteVentasVarias,
      idCliente: definicion_CTX_F_B_NC_ND.idCliente,
      codigoTipoDocumentoIdentidad: definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_F_B_NC_ND.numeroIdentidad,
      razonSocialNombre: definicion_CTX_F_B_NC_ND.razonSocialNombre,
      email: definicion_CTX_F_B_NC_ND.email,
      actualizarEmailCliente: definicion_CTX_F_B_NC_ND.actualizarEmailCliente,

      igv: definicion_CTX_F_B_NC_ND.igv,
      moneda: definicion_CTX_F_B_NC_ND.moneda,
      tipoCambio: definicion_CTX_F_B_NC_ND.tipoCambio,

      vendedor: definicion_CTX_F_B_NC_ND.vendedor,
      metodoPago: definicion_CTX_F_B_NC_ND.metodoPago,

      todoEnEfectivo: definicion_CTX_F_B_NC_ND.todoEnEfectivo,
      unaParteEnEfectivo: definicion_CTX_F_B_NC_ND.unaParteEnEfectivo,
      montoEnEfectivo: definicion_CTX_F_B_NC_ND.montoEnEfectivo.trim() === '' ? 0 : definicion_CTX_F_B_NC_ND.montoEnEfectivo,
      otroMedioPago: definicion_CTX_F_B_NC_ND.otroMedioPago,
      montoOtroMedioPago:
        definicion_CTX_F_B_NC_ND.montoOtroMedioPago.trim() === '' ? 0 : definicion_CTX_F_B_NC_ND.montoOtroMedioPago,

      cuotasPago: definicion_CTX_F_B_NC_ND.cuotasCredito,
      importeTotalCuotasCredito: definicion_CTX_F_B_NC_ND.importeTotalCuotasCredito,

      idCotizacion: definicion_CTX_F_B_NC_ND.idCotizacion,
      serieCotizacion: definicion_CTX_F_B_NC_ND.serieCotizacion,
      numeroCotizacion: definicion_CTX_F_B_NC_ND.numeroCotizacion,

      idOrdenServicio: definicion_CTX_F_B_NC_ND.idOrdenServicio,
      serieOrdenServicio: definicion_CTX_F_B_NC_ND.serieOrdenServicio,
      numeroOrdenServicio: definicion_CTX_F_B_NC_ND.numeroOrdenServicio,

      observacion: definicion_CTX_F_B_NC_ND.observacion.toUpperCase(),

      itemsVenta: definicion_CTX_F_B_NC_ND.itemsVenta,

      baseImponiblePEN: definicion_CTX_F_B_NC_ND.baseImponiblePEN,
      exoneradoPEN: definicion_CTX_F_B_NC_ND.exoneradoPEN,
      inafectoPEN: definicion_CTX_F_B_NC_ND.inafectoPEN,
      iscPEN: definicion_CTX_F_B_NC_ND.iscPEN,
      exportPEN: definicion_CTX_F_B_NC_ND.exportPEN,
      otrosPEN: definicion_CTX_F_B_NC_ND.otrosPEN,
      igvPEN: definicion_CTX_F_B_NC_ND.igvPEN,
      totalPEN: definicion_CTX_F_B_NC_ND.totalPEN,

      baseImponibleUSD: definicion_CTX_F_B_NC_ND.baseImponibleUSD,
      exoneradoUSD: definicion_CTX_F_B_NC_ND.exoneradoUSD,
      inafectoUSD: definicion_CTX_F_B_NC_ND.inafectoUSD,
      iscUSD: definicion_CTX_F_B_NC_ND.iscUSD,
      exportUSD: definicion_CTX_F_B_NC_ND.exportUSD,
      otrosUSD: definicion_CTX_F_B_NC_ND.otrosUSD,
      igvUSD: definicion_CTX_F_B_NC_ND.igvUSD,
      totalUSD: definicion_CTX_F_B_NC_ND.totalUSD,

      referenciaFecha: definicion_CTX_F_B_NC_ND.referenciaFecha,
      referenciaTipo: definicion_CTX_F_B_NC_ND.referenciaTipo,
      referenciaSerie: definicion_CTX_F_B_NC_ND.referenciaSerie,
      referenciaNumero: definicion_CTX_F_B_NC_ND.referenciaNumero,

      facturacionElectronica: definicion_CTX_F_B_NC_ND.facturacionElectronica,
      facturacionElectronicaAutomatica: definicion_CTX_F_B_NC_ND.facturacionElectronicaAutomatica,

      contabilizarOperaciones: definicion_CTX_F_B_NC_ND.contabilizarOperaciones,
      asientoContable: definicion_CTX_F_B_NC_ND.asientoContable,
      totalDebePEN: definicion_CTX_F_B_NC_ND.totalDebePEN,
      totalHaberPEN: definicion_CTX_F_B_NC_ND.totalHaberPEN,
      totalDebeUSD: definicion_CTX_F_B_NC_ND.totalDebeUSD,
      totalHaberUSD: definicion_CTX_F_B_NC_ND.totalHaberUSD,

      usuario: parametrosGlobales.usuario,
    });

    if (ventaGRABADA.status === 400) {
      alert('Falla al registrar la venta. ' + ventaGRABADA.message);
      ctx_index_venta.mostrarSpinner = false;
      return;
    }

    pasoProcesoGrabacion.value = true;
    if (ventaGRABADA) {
      grabo.value = true;
      //=> INICIALIZAR PARA LA SIGUIENTE VENTA
      // definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago = '';
      // definicion_CTX_F_B_NC_ND.tipoComprobantePago = '';
      // definicion_CTX_F_B_NC_ND.idSerieVenta = '';
      // definicion_CTX_F_B_NC_ND.serie = '';
      // definicion_CTX_F_B_NC_ND.numero = 0;
      definicion_CTX_F_B_NC_ND.fecha = hoy();

      definicion_CTX_F_B_NC_ND.clienteVentasVarias = false;
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

      definicion_CTX_F_B_NC_ND.todoEnEfectivo = true;
      definicion_CTX_F_B_NC_ND.unaParteEnEfectivo = false;
      definicion_CTX_F_B_NC_ND.montoEnEfectivo = '';
      definicion_CTX_F_B_NC_ND.otroMedioPago = 'TRANSFERENCIA DE FONDOS';
      definicion_CTX_F_B_NC_ND.montoOtroMedioPago = '';

      definicion_CTX_F_B_NC_ND.verCuotasCredito = false;
      definicion_CTX_F_B_NC_ND.cuotasCredito = [];
      definicion_CTX_F_B_NC_ND.importeTotalCuotasCredito = 0;

      definicion_CTX_F_B_NC_ND.idCotizacion = '';
      definicion_CTX_F_B_NC_ND.serieCotizacion = '';
      definicion_CTX_F_B_NC_ND.numeroCotizacion = 0;

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
      definicion_CTX_F_B_NC_ND.exportPEN = 0;
      definicion_CTX_F_B_NC_ND.otrosPEN = 0;
      definicion_CTX_F_B_NC_ND.totalPEN = 0;

      definicion_CTX_F_B_NC_ND.baseImponibleUSD = 0;
      definicion_CTX_F_B_NC_ND.igvUSD = 0;
      definicion_CTX_F_B_NC_ND.exoneradoUSD = 0;
      definicion_CTX_F_B_NC_ND.inafectoUSD = 0;
      definicion_CTX_F_B_NC_ND.iscUSD = 0;
      definicion_CTX_F_B_NC_ND.exportUSD = 0;
      definicion_CTX_F_B_NC_ND.otrosUSD = 0;
      definicion_CTX_F_B_NC_ND.totalUSD = 0;

      definicion_CTX_F_B_NC_ND.referenciaFecha = '';
      definicion_CTX_F_B_NC_ND.referenciaTipo = '';
      definicion_CTX_F_B_NC_ND.referenciaSerie = '';
      definicion_CTX_F_B_NC_ND.referenciaNumero = 0;

      definicion_CTX_F_B_NC_ND.facturacionElectronica = parametrosGlobales.facturacionElectronica;
      definicion_CTX_F_B_NC_ND.facturacionElectronicaAutomatica = parametrosGlobales.facturacionElectronicaAutomatica;

      definicion_CTX_F_B_NC_ND.contabilizarOperaciones = parametrosGlobales.contabilizarOperaciones;
      definicion_CTX_F_B_NC_ND.asientoContable = [];
      definicion_CTX_F_B_NC_ND.totalDebePEN = 0;
      definicion_CTX_F_B_NC_ND.totalHaberPEN = 0;
      definicion_CTX_F_B_NC_ND.totalDebeUSD = 0;
      definicion_CTX_F_B_NC_ND.totalHaberUSD = 0;
    }

    definicion_CTX_ADD_VENTA.desabilitarAlmacenServicios = false;
    ctx_index_venta.mostrarSpinner = false;
    //OCULTAR MENSAJE DE GRABACION
    setTimeout(() => (pasoProcesoGrabacion.value = false), 3000);
    alert('Registro satisfactorio!!!');
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
            ctx_index_venta.grabo_Venta = grabo.value;
            ctx_index_venta.mostrarPanelVenta = false;
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
            // console.log('grabo', grabo.value);
            // console.log('ctx_index_venta', ctx_index_venta);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            console.log('TOTAL,IMPUESTO', TOTAL, IMPUESTO);
            // console.log('grabo', grabo.value);
            // console.log('ctx_index_venta', ctx_index_venta);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            console.log('parametrosGlobales', parametrosGlobales);
            // console.log('grabo', grabo.value);
            // console.log('ctx_index_venta', ctx_index_venta);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="props.addPeriodo"
          onClick={$(() => {
            console.log('props.addPeriodo', props.addPeriodo);
            // console.log('grabo', grabo.value);
            // console.log('ctx_index_venta', ctx_index_venta);
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.9rem', marginLeft: '2px' }}>Venta</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES style={{ fontSize: '0.6rem' }} */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* PERIODO */}
          <div style={{ display: 'none' }}>
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
            <br></br>
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL CLIENTE */}
          <div>
            {/* cliente VENTAS VARIAS*/}
            <div>
              {/* <label>Cliente Ventas Varias</label> */}
              <div>
                <input
                  id="chk_clienteVentasVarias_VENTA"
                  type="checkbox"
                  title="Cliente Ventas Varias"
                  style={{ margin: '2px' }}
                  checked={definicion_CTX_F_B_NC_ND.clienteVentasVarias}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.clienteVentasVarias = (e.target as HTMLInputElement).checked;
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('btn_PlanContableOrigen_GRUPO_EMPRESARIAL')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <label for="chk_clienteVentasVarias_VENTA" style={{ marginLeft: '2px' }}>
                  Cliente Ventas Varias (Boletas)
                </label>
              </div>
            </div>
            {/* tipo de documento identidad*/}
            <div class="form-control">
              <label>Tipo documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectTipoDocumentoLiteral"
                  disabled
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
                <input
                  id="ima_BuscarCliente_VENTA"
                  type="image"
                  src={images.searchPLUS}
                  title="Buscar datos de identidad"
                  height={16}
                  width={16}
                  style={{ margin: '2px' }}
                  onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarPersona = true)}
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
                  disabled
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
                  disabled
                  placeholder="Razón social / Nombre"
                  value={definicion_CTX_F_B_NC_ND.razonSocialNombre}
                  // onChange={(e) => setRazonSocialNombre(e.target.value)}
                />
              </div>
            </div>
            {/* Email */}
            <div class="form-control">
              <label>Email</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputEmail"
                  style={{ width: '100%' }}
                  type="email"
                  placeholder="Email"
                  value={definicion_CTX_F_B_NC_ND.email}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.email = (e.target as HTMLInputElement).value;
                  }}
                  // onChange={(e) => setEmail(e.target.value)}
                />
                {/* <ImgButton
                  src={icons.searchPLUS.default}
                  alt="Icono de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                /> */}
              </div>
            </div>
            <br></br>
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
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
                  min={menosXdiasHoy(2)}
                  max={hoy()}
                  // min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                  // max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_F_B_NC_ND.fecha}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.fecha = (e.target as HTMLInputElement).value;
                    //validar PERIODO
                    const anio = definicion_CTX_F_B_NC_ND.fecha;
                    const mes = definicion_CTX_F_B_NC_ND.fecha;
                    // console.log('la fechitaaaa', anio + mes);
                    const mas = anio + mes;
                    const PPP = losPeriodosCargados.value;
                    // console.log('mas', mas);
                    // console.log('PPP', PPP);
                    const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(mas));
                    // console.log('elPeriodo', elPeriodo);
                    definicion_CTX_F_B_NC_ND.idPeriodo = elPeriodo._id;
                    definicion_CTX_F_B_NC_ND.periodo = elPeriodo.periodo;
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            <br></br>
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
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
          <br hidden={tipoDocumento.value === '07' || tipoDocumento.value === '08' ? false : true}></br>
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
            <br></br>
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
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
                  >
                    Add cuota
                  </button>
                )}
              </div>
            </div>
            {!definicion_CTX_F_B_NC_ND.verCuotasCredito && (
              <div>
                <input
                  type="radio"
                  value="Todo en efectivo"
                  id="Todo en efectivo"
                  name="Contado"
                  checked={definicion_CTX_F_B_NC_ND.todoEnEfectivo}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.todoEnEfectivo = (e.target as HTMLInputElement).checked;
                    definicion_CTX_F_B_NC_ND.unaParteEnEfectivo = !definicion_CTX_F_B_NC_ND.todoEnEfectivo;
                  }}
                />
                <label for="Todo en efectivo">Todo en efectivo</label>
                <br></br>
                {/* <div class="form-control form-agrupado" style={{ display: 'flex' }}> */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <div>
                    <input
                      type="radio"
                      value="Una parte en efectivo"
                      id="Una parte en efectivo"
                      name="Contado"
                      checked={definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                      onChange$={(e) => {
                        definicion_CTX_F_B_NC_ND.unaParteEnEfectivo = (e.target as HTMLInputElement).checked;
                        definicion_CTX_F_B_NC_ND.todoEnEfectivo = !definicion_CTX_F_B_NC_ND.unaParteEnEfectivo;
                      }}
                    />
                    <label for="Una parte en efectivo">Una parte en efectivo</label>
                  </div>
                  <input
                    type="number"
                    id="inputMontoEnEfectivo"
                    placeholder="Efectivo"
                    disabled={!definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                    value={definicion_CTX_F_B_NC_ND.montoEnEfectivo}
                    onChange$={(e) => (definicion_CTX_F_B_NC_ND.montoEnEfectivo = (e.target as HTMLInputElement).value)}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('select_contado')?.focus();
                      }
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  <select
                    id="select_contado"
                    disabled={!definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                    value={definicion_CTX_F_B_NC_ND.otroMedioPago}
                    onChange$={(e) => {
                      definicion_CTX_F_B_NC_ND.otroMedioPago = (e.target as HTMLSelectElement).value;
                      document.getElementById('in_otroMedio')?.focus();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('inputMontoOtroMedioPago')?.focus();
                      }
                    }}
                    // style={definicion_CTX_F_B_NC_ND.verCuotasCredito ? { width: '79%' } : { width: '100%' }}
                  >
                    <option value={'TRANSFERENCIA DE FONDOS'}>TRANSFERENCIA DE FONDOS</option>
                    <option value={'TARJETA DE CRÉDITO'}>TARJETA DE CRÉDITO</option>
                    <option value={'TARJETA DE DÉBITO'}>TARJETA DE DÉBITO</option>
                    <option value={'DEPÓSITO EN CUENTA'}>DEPÓSITO EN CUENTA</option>
                  </select>
                  <input
                    type="number"
                    id="inputMontoOtroMedioPago"
                    placeholder="Otro medio"
                    disabled={!definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                    value={definicion_CTX_F_B_NC_ND.montoOtroMedioPago}
                    onChange$={(e) => (definicion_CTX_F_B_NC_ND.montoOtroMedioPago = (e.target as HTMLInputElement).value)}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('btnVerAlmacen')?.focus();
                      }
                    }}
                  />
                </div>
              </div>
            )}
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
                              <input
                                type="image"
                                title="Editar ítem"
                                alt="icono de editar"
                                height={14}
                                width={14}
                                src={images.edit}
                              />
                              <input
                                type="image"
                                title="Eliminar ítem"
                                alt="icono de eliminar"
                                height={14}
                                width={14}
                                src={images.trash}
                              />
                              {/* <ImgButton
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
                              /> */}
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
            <br></br>
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* BOTONES */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#74a6ab' }}>
              <button
                id="btnVerAlmacen"
                disabled={definicion_CTX_ADD_VENTA.desabilitarAlmacenServicios}
                onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarMercaderiaOUT = true)}
                style={{ cursor: 'pointer' }}
              >
                Ver almacén
              </button>
              {definicion_CTX_ADD_VENTA.mostrarPanelBuscarMercaderiaOUT && (
                <div class="modal">
                  <BuscarMercaderiaOUT contexto="new_venta" esAlmacen={false} porcentaje={definicion_CTX_F_B_NC_ND.igv} />
                  {/* <BusquedaMercaderiaOUT ancho={740} parametrosGlobales={props.parametrosGlobales} item1={item} /> */}
                </div>
              )}
              <button
                id="btnAddServicio"
                disabled={definicion_CTX_ADD_VENTA.desabilitarAlmacenServicios}
                onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarServicio = true)}
                style={{ cursor: 'pointer' }}
              >
                Add servicio
              </button>
              {definicion_CTX_ADD_VENTA.mostrarPanelBuscarServicio && (
                <div class="modal">
                  <BuscarServicio contexto="new_venta" porcentaje={definicion_CTX_F_B_NC_ND.igv} />
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
            <br></br>
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
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
            <br></br>
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
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
                      <th>Venta</th>
                      <th>%</th>
                      <th>Imp</th>
                      <th>Afec</th>
                      <th>Acc</th>
                    </tr>
                  </thead>
                  <tbody>
                    {definicion_CTX_F_B_NC_ND.itemsVenta.map((iTVen: any, index: number) => {
                      const indexItemVenta = index + 1;
                      let t_bi = 0;
                      let t_igv = 0;
                      let t_exo = 0;
                      let t_ina = 0;
                      const t_isc = 0;
                      let t_export = 0;
                      let t_otros = 0;
                      //IGV, ISC, IVAP, exoneradas, exportación, gratuitas, inafecta, otrosTributos
                      if (definicion_CTX_F_B_NC_ND.enDolares) {
                        if (iTVen.tipoImpuesto === 'IGV') {
                          const vv = redondeo2Decimales(
                            iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                          );
                          t_bi = redondeo2Decimales((vv * 100) / (100 + iTVen.porcentaje));
                          t_igv = redondeo2Decimales(vv - t_bi);
                        }
                        // if (iTVen.tipoImpuesto === 'ISC') {
                        // }
                        // if (iTVen.tipoImpuesto === 'IVAP') {
                        // }
                        if (iTVen.tipoImpuesto === 'exoneradas') {
                          t_exo = redondeo2Decimales(
                            iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                          );
                        }
                        if (iTVen.tipoImpuesto === 'exportación') {
                          t_export = redondeo2Decimales(
                            iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                          );
                        }
                        if (iTVen.tipoImpuesto === 'gratuitas') {
                          t_otros = redondeo2Decimales(
                            iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                          );
                        }
                        if (iTVen.tipoImpuesto === 'inafecta') {
                          t_ina = redondeo2Decimales(
                            iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                          );
                        }
                        if (iTVen.tipoImpuesto === 'otrosTributos') {
                          t_otros = redondeo2Decimales(
                            iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                          );
                        }
                        // if (iTVen.exonerado) {
                        //   t_exo = redondeo2Decimales(
                        //     iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                        //   );
                        // } else {
                        //   if (iTVen.inafecto) {
                        //     t_ina = redondeo2Decimales(
                        //       iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                        //     );
                        //   } else {
                        //     const vv = redondeo2Decimales(
                        //       iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD
                        //     );
                        //     t_bi = redondeo2Decimales((vv * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                        //     t_igv = redondeo2Decimales(vv - t_bi);
                        //   }
                        // }
                      } else {
                        if (iTVen.tipoImpuesto === 'IGV') {
                          const vv = redondeo2Decimales(
                            iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                          );
                          t_bi = redondeo2Decimales((vv * 100) / (100 + iTVen.porcentaje));
                          t_igv = redondeo2Decimales(vv - t_bi);
                        }
                        // if (iTVen.tipoImpuesto === 'ISC') {
                        // }
                        // if (iTVen.tipoImpuesto === 'IVAP') {
                        // }
                        if (iTVen.tipoImpuesto === 'exoneradas') {
                          t_exo = redondeo2Decimales(
                            iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                          );
                        }
                        if (iTVen.tipoImpuesto === 'exportación') {
                          t_export = redondeo2Decimales(
                            iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                          );
                        }
                        if (iTVen.tipoImpuesto === 'gratuitas') {
                          t_otros = redondeo2Decimales(
                            iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                          );
                        }
                        if (iTVen.tipoImpuesto === 'inafecta') {
                          t_ina = redondeo2Decimales(
                            iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                          );
                        }
                        if (iTVen.tipoImpuesto === 'otrosTributos') {
                          t_otros = redondeo2Decimales(
                            iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                          );
                        }

                        // if (iTVen.exonerado) {
                        //   t_exo = redondeo2Decimales(
                        //     iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                        //   );
                        // } else {
                        //   if (iTVen.inafecto) {
                        //     t_ina = redondeo2Decimales(
                        //       iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                        //     );
                        //   } else {
                        //     const vv = redondeo2Decimales(
                        //       iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN
                        //     );
                        //     t_bi = redondeo2Decimales((vv * 100) / (100 + definicion_CTX_F_B_NC_ND.igv));
                        //     t_igv = redondeo2Decimales(vv - t_bi);
                        //   }
                        // }
                      }
                      sumaTOTAL = sumaTOTAL + t_bi + t_igv + t_exo + t_ina + t_isc + t_export + t_otros;
                      sumaTOTAL_BI = sumaTOTAL_BI + t_bi;
                      sumaTOTAL_IGV = sumaTOTAL_IGV + t_igv;
                      sumaTOTAL_EXO = sumaTOTAL_EXO + t_exo;
                      sumaTOTAL_INAFEC = sumaTOTAL_INAFEC + t_ina;
                      sumaTOTAL_ISC = sumaTOTAL_ISC + t_isc;
                      sumaTOTAL_EXPORT = sumaTOTAL_EXPORT + t_export;
                      sumaTOTAL_OTROS = sumaTOTAL_OTROS + t_otros;
                      console.log(
                        `valores ${index + 1} : `,
                        sumaTOTAL,
                        sumaTOTAL_BI,
                        sumaTOTAL_IGV,
                        sumaTOTAL_EXO,
                        sumaTOTAL_INAFEC,
                        sumaTOTAL_ISC,
                        sumaTOTAL_EXPORT,
                        sumaTOTAL_OTROS
                      );
                      //SOLO AL LLEGAR AL FINAL DE LA ITERACION SE FIJA LOS MONTOS
                      if (index + 1 === definicion_CTX_F_B_NC_ND.itemsVenta.length) {
                        fijarMontos({
                          sumaTOTAL,
                          sumaTOTAL_BI,
                          sumaTOTAL_IGV,
                          sumaTOTAL_EXO,
                          sumaTOTAL_INAFEC,
                          sumaTOTAL_ISC,
                          sumaTOTAL_EXPORT,
                          sumaTOTAL_OTROS,
                        });
                      }
                      // if (iTVen.idAuxiliar > 0) {
                      //   const tre = definicion_CTX_F_B_NC_ND.asientoContable.filter(
                      //     (ele: any) => ele.idAuxiliar === iTVen.idAuxiliar
                      //   );
                      //   console.log('tre', tre);
                      // }
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
                          <td data-label="%" class="acciones">
                            {iTVen.porcentaje}
                          </td>
                          <td data-label="Imp" class="comoCadena">
                            {iTVen.tipoImpuesto.substring(0, 6)}
                          </td>
                          <td data-label="Afec" class="acciones">
                            {iTVen.tipoAfectacionDelImpuesto}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.Imp}
                              title="Editar impuesto"
                              alt="icono editar"
                              height={12}
                              width={12}
                              style={{ marginRight: '2px' }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                editarImpuesto_ItemVenta.idAuxiliar = iTVen.idAuxiliar;
                                editarImpuesto_ItemVenta.descripcion = iTVen.descripcionEquivalencia;
                                editarImpuesto_ItemVenta.tipoImpuesto = iTVen.tipoImpuesto;
                                editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto = iTVen.tipoAfectacionDelImpuesto;
                                definicion_CTX_ADD_VENTA.mostrarPanelEditarImpuesto = true;
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.trash}
                              title="Eliminar ítem"
                              alt="icono eliminar"
                              height={12}
                              width={12}
                              // style={{ margin: '2px' }}
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
                        Exonerado
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
                        Exportación
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_EXPORT.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero">
                        Otros
                      </td>
                      <td colSpan={1} class="comoNumero">
                        {`${sumaTOTAL_OTROS.toLocaleString('en-PE', {
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
                      </td>
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
                      </td>
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
              {definicion_CTX_ADD_VENTA.mostrarPanelEditarImpuesto && (
                <div class="modal">
                  <EditarImpuesto editarImpuesto_ItemVenta={editarImpuesto_ItemVenta} />
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
