import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import {
  getDetraccionesBienesServiciosSUNAT,
  getMediosPagoSUNAT,
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
  redondeo6Decimales,
  literal,
  masXdiasHoy,
} from '~/functions/comunes';
// import SeleccionarPersona from '../miscelanea/persona/seleccionarPersona';
import { CTX_INDEX_VENTA } from '~/routes/(ventas)/venta';
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
import type { IPersonaVenta } from '~/interfaces/iPersona';
import type { ICuotaCreditoVenta, IVenta } from '~/interfaces/iVenta';
import { parametrosGlobales } from '~/routes/login';
import BuscarServicio from '../miscelanea/servicio/buscarServicio';
import BorrarItemVenta from './borrarItemVenta';
import EditarImpuesto from './editarImpuesto';
// import verificarObservación from '../guiaRemision/verificarObservacion';
import { getPorcentajesUtilidad } from '~/apis/grupoEmpresarial.api';
import EditarPersonaDirecta from '../miscelanea/persona/editarPersonaDirecta';
import { CTX_INDEX_NOTA_VENTA } from '~/routes/(ventas)/notaVenta';
// import EditarPersona from '../miscelanea/persona/editarPersona';

export const CTX_CLIENTE_VENTA = createContextId<IPersonaVenta>('cliente');
export const CTX_F_B_NC_ND = createContextId<IVenta>('addVenta');
export const CTX_ADD_VENTA = createContextId<any>('add_venta');

// function preventScroll(e: any) {
//   e.preventDefault();
//   e.stopPropagation();

//   return false;
// }

export default component$((props: { addPeriodo: any; igv: number; addPeriodoAnterior?: any; contexto: string; notaDeVenta: any }) => {
  useStyles$(styleTabla);

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

    mensajeErrorCliente: '',

    mostrarPanelEditPersonaDirecta: false,
    grabo_PersonaDirecta: false,
    // personaDirectaEDITADA: { _id: '', razonSocialNombre: '', direccion: '', email: '', telefono: '', cuentasCorrientes: [] },

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
      sucursal: parametrosGlobales.sucursal,
      sucursalDireccion: parametrosGlobales.sucursalDireccion,
      idPeriodo: props.addPeriodo.idPeriodo,
      periodo: props.addPeriodo.periodo,

      ruc: parametrosGlobales.RUC,
      empresa: parametrosGlobales.RazonSocial,
      direccion: parametrosGlobales.Direccion,
      departamento: typeof parametrosGlobales.departamento === 'undefined' ? '' : parametrosGlobales.departamento,
      provincia: typeof parametrosGlobales.provincia === 'undefined' ? '' : parametrosGlobales.provincia,
      distrito: typeof parametrosGlobales.distrito === 'undefined' ? '' : parametrosGlobales.distrito,
      ubigeo: typeof parametrosGlobales.ubigeo === 'undefined' ? '' : parametrosGlobales.ubigeo,

      facturacionElectronica: typeof parametrosGlobales.facturacionElectronica === 'undefined' ? false : parametrosGlobales.facturacionElectronica,
      facturacionElectronicaAutomatica:
        typeof parametrosGlobales.facturacionElectronicaAutomatica === 'undefined' ? false : parametrosGlobales.facturacionElectronicaAutomatica,
      facturaJSON: typeof parametrosGlobales.facturaJSON === 'undefined' ? false : parametrosGlobales.facturaJSON,
      facturaXML: typeof parametrosGlobales.facturaXML === 'undefined' ? false : parametrosGlobales.facturaXML,

      codigoTipoOperacion: '',
      tipoOperacion: '',

      codigoTipoComprobantePago: '',
      tipoComprobantePago: '',
      idSerieVenta: '',
      serie: '',
      numero: 0,
      fecha: hoy(), //'', //
      hora: '',

      idNotaVenta: '',
      serieNotaVenta: '',
      numeroNotaVenta: 0,

      clienteVentasVarias: false,
      estrellasCliente: 0,
      idCliente: '',
      codigoTipoDocumentoIdentidad: '6',
      tipoDocumentoIdentidad: 'RUC',
      numeroIdentidad: '',
      razonSocialNombre: '',
      direccionCliente: '',
      email: '',
      telefono: '',
      actualizarEmailCliente: false,

      igv: props.igv,
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
      soloServicios: false,
      soloSuministros: false,

      observacion: '',

      impresionTipoFacturaBoleta: false,
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

      lite: '',

      referenciaCodigo: '', //Codigo del motivo
      referenciaDescripcion: '', //Descripción del motivo
      referenciaFecha: '',
      referenciaTipo: '', //TCP
      referenciaSerie: '',
      referenciaNumero: 0,

      verificarObservacionVenta: parametrosGlobales.verificarObservacionVenta,

      json: '',

      contabilizarOperaciones: parametrosGlobales.contabilizarOperaciones,
      asientoContable: [],
      totalDebePEN: -1,
      totalHaberPEN: 0,
      totalDebeUSD: -1,
      totalHaberUSD: 0,

      ganancias: 0,

      ventaConDetraccion: parametrosGlobales.ventaConDetraccion,
      detraccion: false,
      detraccionCodigo: '',
      detraccionDescripcion: '',
      detraccionMedioPagoCodigo: '',
      detraccionMedioPagoDescripcion: '',
      detraccionMontoPEN: 0,
      detraccionNumCuentaBancoNacion: parametrosGlobales.cuentaBancariaDetraccion,
      detraccionPorcentaje: 0,
      detraccionConstancia: '',
      detraccionFecha: hoy(),
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
    direccion: '',
    email: '',
    telefono: '',
  });
  useContextProvider(CTX_CLIENTE_VENTA, defini_CTX_CLIENTE_VENTA);
  //#endregion DEFINICION CTX_CLIENTE_VENTA

  //#region CONTEXTOS
  let ctx_index_venta: any = [];
  switch (props.contexto) {
    case 'venta':
      ctx_index_venta = useContext(CTX_INDEX_VENTA);
      break;
    case 'nota_venta':
      ctx_index_venta = useContext(CTX_INDEX_NOTA_VENTA);

      break;
  }

  // ctx_index_venta.mostrarSpinner = false;
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const losPorcentajesUtilidad = useSignal([]);
  const ESTRELLA_MAX = useSignal(0);
  const tipoDocumento = useSignal('01'); //01-FACTURA  //03-BOLETA
  // const idSerieDocumento = useSignal('');
  const serieDocumento = useSignal('');
  const botonGrabar = useSignal('');
  const dataSerie = useSignal([]);
  const cuotaCredito_esEdit = useSignal(false);
  const pasoProcesoGrabacion = useSignal(false);
  const grabo = useSignal(false);
  const montoCONTADO_DOS_PARTES = useSignal(0);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const dataMedioPago = useSignal([]);
  const dataDetraccionBienServicioSUNAT = useSignal([]);

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
  const telefonoOrigen = useSignal('');

  let sumaCuotas = 0;

  let sumaTOTAL_BI = 0;
  let sumaTOTAL_IGV = 0;
  let sumaTOTAL_EXO = 0;
  let sumaTOTAL_INAFEC = 0;
  let sumaTOTAL_ISC = 0;
  let sumaTOTAL_EXPORT = 0;
  let sumaTOTAL_OTROS = 0;

  let sumaTOTAL = 0;

  const cuota = useStore<ICuotaCreditoVenta>({
    idAuxiliar: 0,
    fechaCuota: masXdiasHoy(30), // hoy(),
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

  //#region OBTENER PORCENTAJES DE UTILIDAD
  const obtenerESTRELLA_MAXIMA = $(async () => {
    const obtPorcentajes = await getPorcentajesUtilidad({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });

    losPorcentajesUtilidad.value = obtPorcentajes.data;

    losPorcentajesUtilidad.value.map((elem: any) => {
      if (ESTRELLA_MAX.value < elem.estrellas) {
        ESTRELLA_MAX.value = elem.estrellas;
      }
    });
    //console.log('losPorcentajesUtilidad.value', losPorcentajesUtilidad.value);
  });
  //#endregion OBTENER PORCENTAJES DE UTILIDAD

  useTask$(async ({ track }) => {
    track(() => ini.value);

    if (ini.value === 0) {
      obtenerESTRELLA_MAXIMA();
      ctx_index_venta.mostrarSpinner = false;

      if (props.contexto === 'nota_venta') {
        definicion_CTX_F_B_NC_ND.idNotaVenta = props.notaDeVenta.idNotaVenta;
        definicion_CTX_F_B_NC_ND.serieNotaVenta = props.notaDeVenta.serieNotaVenta;
        definicion_CTX_F_B_NC_ND.numeroNotaVenta = props.notaDeVenta.numeroNotaVenta;

        definicion_CTX_F_B_NC_ND.igv = props.notaDeVenta.igv;

        definicion_CTX_F_B_NC_ND.observacion = definicion_CTX_F_B_NC_ND.serieNotaVenta + ' - ' + cerosALaIzquierda(definicion_CTX_F_B_NC_ND.numeroNotaVenta, 8);

        for (let index = 0; index < props.notaDeVenta.detalle.length; index++) {
          const element = props.notaDeVenta.detalle[index];

          // console.log('element', element);
          if (!element.noFacturar) {
            definicion_CTX_F_B_NC_ND.itemsVenta.push(element);
          }
        }
        //
      }

      // console.log('props.notaDeVenta', props.notaDeVenta);

      // //validar PERIODO
      // const anio = definicion_CTX_F_B_NC_ND.fecha;
      // const mes = definicion_CTX_F_B_NC_ND.fecha;
      // // //console.log('la fechitaaaa', anio + mes);
      // const mas = anio + mes;
      // const PPP = losPeriodosCargados.value;
      // // //console.log('mas', mas);
      // // //console.log('PPP', PPP);
      // const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(mas));
      // // //console.log('elPeriodo', elPeriodo);
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
    //console.log('💚💚💚💚💚💚💚💚💚');
    let laSerie;
    const parametros = {
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idSucursal: parametrosGlobales.idSucursal,
      sucursal: parametrosGlobales.sucursal,
      sucursalDireccion: parametrosGlobales.sucursalDireccion,
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
          //console.log('💚💚💚SSS🍟🍟🍟🍟🍟', SSS);
          definicion_CTX_F_B_NC_ND.codigoTipoOperacion = SSS[0].codigoTipoOperacionXDefault;
          definicion_CTX_F_B_NC_ND.tipoOperacion = SSS[0].tipoOperacionXDefault;
          definicion_CTX_F_B_NC_ND.idSerieVenta = SSS[0]._id;
          definicion_CTX_F_B_NC_ND.serie = SSS[0].serie;
          definicion_CTX_F_B_NC_ND.impresionTipoFacturaBoleta = SSS[0].impresionTipoFacturaBoleta;
          serieDocumento.value = SSS[0].serie;
        }

        definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago = '01';
        definicion_CTX_F_B_NC_ND.tipoComprobantePago = 'FACTURA';
        botonGrabar.value = 'Grabar FACTURA';
        // setSeries(laSerie.data);
        // setCodigoDocumento('01');
        // setDocumentoVenta('FACTURA');
        // setBotonGrabar('Grabar FACTURA');
        if (parametrosGlobales.ventaConDetraccion) {
          // definicion_CTX_F_B_NC_ND.detraccionNumCuentaBancoNacion=parametrosGlobales.cuentaBancariaDetraccion;
          const losMediosPago = await getMediosPagoSUNAT();
          dataMedioPago.value = losMediosPago.data;
          // //console.log("dataMedioPago.value", dataMedioPago.value);

          const losBienesServicios = await getDetraccionesBienesServiciosSUNAT();
          dataDetraccionBienServicioSUNAT.value = losBienesServicios.data;
        }

        break;
      case '03': //BOLETA
        serieDocumento.value = '';
        // alert(`tretre a useTask BOLETA`);
        // laSerie = await getSeriesBoletaActivas(parametros);
        //console.log('SSS 03-BOLETA03-BOLETA03-BOLETA03-BOLETA03-BOLETA');
        laSerie = await getSeriesVentasActivasSegunTipo(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;
        if (dataSerie.value.length === 1) {
          const SSS: any = dataSerie.value;
          //console.log('💚💚💚SSS🍟🍟🍟🍟🍟', SSS);
          definicion_CTX_F_B_NC_ND.codigoTipoOperacion = SSS[0].codigoTipoOperacionXDefault;
          definicion_CTX_F_B_NC_ND.tipoOperacion = SSS[0].tipoOperacionXDefault;
          definicion_CTX_F_B_NC_ND.idSerieVenta = SSS[0]._id;
          definicion_CTX_F_B_NC_ND.serie = SSS[0].serie;
          definicion_CTX_F_B_NC_ND.impresionTipoFacturaBoleta = SSS[0].impresionTipoFacturaBoleta;
          serieDocumento.value = SSS[0].serie;
          //console.log('SSS', definicion_CTX_F_B_NC_ND.idSerieVenta, definicion_CTX_F_B_NC_ND.serie);
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
          //console.log('💚💚💚SSS🍟🍟🍟🍟🍟', SSS);
          definicion_CTX_F_B_NC_ND.codigoTipoOperacion = SSS[0].codigoTipoOperacionXDefault;
          definicion_CTX_F_B_NC_ND.tipoOperacion = SSS[0].tipoOperacionXDefault;
          definicion_CTX_F_B_NC_ND.idSerieVenta = SSS[0]._id;
          definicion_CTX_F_B_NC_ND.serie = SSS[0].serie;
          definicion_CTX_F_B_NC_ND.impresionTipoFacturaBoleta = SSS[0].impresionTipoFacturaBoleta;
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
          //console.log('💚💚💚SSS🍟🍟🍟🍟🍟', SSS);
          definicion_CTX_F_B_NC_ND.codigoTipoOperacion = SSS[0].codigoTipoOperacionXDefault;
          definicion_CTX_F_B_NC_ND.tipoOperacion = SSS[0].tipoOperacionXDefault;
          definicion_CTX_F_B_NC_ND.idSerieVenta = SSS[0]._id;
          definicion_CTX_F_B_NC_ND.serie = SSS[0].serie;
          definicion_CTX_F_B_NC_ND.impresionTipoFacturaBoleta = SSS[0].impresionTipoFacturaBoleta;
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

  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_VENTA.selecciono_Persona);
    if (definicion_CTX_ADD_VENTA.selecciono_Persona && definicion_CTX_ADD_VENTA.rol_Persona === 'cliente') {
      // console.log('defini_CTX_CLIENTE_VENTA', defini_CTX_CLIENTE_VENTA);
      // alert('evalua a la persona');
      definicion_CTX_F_B_NC_ND.clienteVentasVarias = false;

      definicion_CTX_F_B_NC_ND.idCliente = defini_CTX_CLIENTE_VENTA._id;
      definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.codigoTipoDocumentoIdentidad;
      definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.tipoDocumentoIdentidad;
      definicion_CTX_F_B_NC_ND.numeroIdentidad = defini_CTX_CLIENTE_VENTA.numeroIdentidad;
      definicion_CTX_F_B_NC_ND.razonSocialNombre = defini_CTX_CLIENTE_VENTA.razonSocialNombre;
      definicion_CTX_F_B_NC_ND.direccionCliente = defini_CTX_CLIENTE_VENTA.direccion;
      definicion_CTX_F_B_NC_ND.email = defini_CTX_CLIENTE_VENTA.email;
      definicion_CTX_F_B_NC_ND.telefono = defini_CTX_CLIENTE_VENTA.telefono;

      emailOrigen.value = defini_CTX_CLIENTE_VENTA.email;
      telefonoOrigen.value = defini_CTX_CLIENTE_VENTA.telefono;

      definicion_CTX_ADD_VENTA.rol_Persona = '';
      definicion_CTX_ADD_VENTA.selecciono_Persona = false;
    }
  });
  //#endregion CLIENTE

  //#region PERSONA DIRECTA / CLIENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_VENTA.grabo_PersonaDirecta);

    if (definicion_CTX_ADD_VENTA.grabo_PersonaDirecta) {
      // console.log('defini_CTX_CLIENTE_VENTA', defini_CTX_CLIENTE_VENTA);
      // alert('evalua a la persona');
      definicion_CTX_F_B_NC_ND.clienteVentasVarias = false;

      // definicion_CTX_F_B_NC_ND.idCliente = personaDirectaEDITADA._id;
      // // definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.codigoTipoDocumentoIdentidad;
      // // definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.tipoDocumentoIdentidad;
      // // definicion_CTX_F_B_NC_ND.numeroIdentidad = defini_CTX_CLIENTE_VENTA.numeroIdentidad;
      definicion_CTX_F_B_NC_ND.razonSocialNombre = defini_CTX_CLIENTE_VENTA.razonSocialNombre;
      definicion_CTX_F_B_NC_ND.direccionCliente = defini_CTX_CLIENTE_VENTA.direccion;
      definicion_CTX_F_B_NC_ND.email = defini_CTX_CLIENTE_VENTA.email;
      definicion_CTX_F_B_NC_ND.telefono = defini_CTX_CLIENTE_VENTA.telefono;

      emailOrigen.value = defini_CTX_CLIENTE_VENTA.email;
      telefonoOrigen.value = defini_CTX_CLIENTE_VENTA.telefono;

      definicion_CTX_ADD_VENTA.grabo_PersonaDirecta = false;
    }
  });
  //#endregion PERSONA DIRECTA / CLIENTE

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
      //   let { cantidad, precioUnitarioPEN } = itemV;
      //   itemV['ventaPEN'] = redondeo2Decimales(itemV['precioUnitarioPEN'] * cantidad);
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
    // console.log('fijarMontos........🚃🚃🚃');
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
      //console.log(
      //   'first',
      //   definicion_CTX_F_B_NC_ND.baseImponiblePEN,
      //   definicion_CTX_F_B_NC_ND.exoneradoPEN,
      //   definicion_CTX_F_B_NC_ND.inafectoPEN,
      //   definicion_CTX_F_B_NC_ND.iscPEN,
      //   definicion_CTX_F_B_NC_ND.exportPEN,
      //   definicion_CTX_F_B_NC_ND.otrosPEN,
      //   definicion_CTX_F_B_NC_ND.igvPEN,
      //   definicion_CTX_F_B_NC_ND.totalPEN
      // );
      definicion_CTX_F_B_NC_ND.baseImponibleUSD = 0;
      definicion_CTX_F_B_NC_ND.exoneradoUSD = 0;
      definicion_CTX_F_B_NC_ND.inafectoUSD = 0;
      definicion_CTX_F_B_NC_ND.iscUSD = 0;
      definicion_CTX_F_B_NC_ND.exportUSD = 0;
      definicion_CTX_F_B_NC_ND.otrosUSD = 0;
      definicion_CTX_F_B_NC_ND.igvUSD = 0;
      definicion_CTX_F_B_NC_ND.totalUSD = 0;
    }
    // console.log('fijando........🚖🚖🚖', definicion_CTX_F_B_NC_ND.moneda, definicion_CTX_F_B_NC_ND.totalPEN, definicion_CTX_F_B_NC_ND.totalUSD);
    definicion_CTX_F_B_NC_ND.lite = '';
    if (definicion_CTX_F_B_NC_ND.moneda === 'PEN') {
      definicion_CTX_F_B_NC_ND.lite = literal(definicion_CTX_F_B_NC_ND.totalPEN, definicion_CTX_F_B_NC_ND.moneda);
    } else {
      definicion_CTX_F_B_NC_ND.lite = literal(definicion_CTX_F_B_NC_ND.totalUSD, definicion_CTX_F_B_NC_ND.moneda);
    }
  });
  //#endregion ITEMS VENTA

  //#region ELIMINAR ITEM VENTA Y CUENTA CONTABLE
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta);

    if (definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta > 0) {
      //ITEM VENTA
      const newItems: any = definicion_CTX_F_B_NC_ND.itemsVenta.filter((docs: any) => docs.idAuxiliar !== definicion_CTX_ADD_VENTA.borrar_idAuxilarVenta);
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
      //console.log('editarImpuesto_ItemVenta', editarImpuesto_ItemVenta);
      const aModificar = definicion_CTX_F_B_NC_ND.itemsVenta.filter((elIT: any) => elIT.idAuxiliar === editarImpuesto_ItemVenta.idAuxiliar);
      //console.log('aModificar 0', aModificar);
      aModificar[0].tipoImpuesto = editarImpuesto_ItemVenta.tipoImpuesto.split(' ');
      aModificar[0].tipoAfectacionDelImpuesto = editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto;
      if (
        editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '10' ||
        editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '11' ||
        editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '12' ||
        editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '13' ||
        editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '14' ||
        editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '15' ||
        editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '16' ||
        editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '17'
      ) {
        aModificar[0].tipoPrecioVentaUnitario = '01';
      } else {
        aModificar[0].tipoPrecioVentaUnitario = '02';
      }
      //console.log('aModificar 1', aModificar);
      definicion_CTX_ADD_VENTA.grabo_EditarImpuesto = false;
    }
  });
  //#endregion EDITAR IMPUESTO

  //#region SUBMIT
  const grabandoVenta = $(async () => {
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
        // document.getElementById('inputNumeroDocumentoIdentidad')?.focus();
        document.getElementById('ima_BuscarCliente_VENTA')?.focus();
        return;
      }
      if (definicion_CTX_F_B_NC_ND.razonSocialNombre === '') {
        alert('Seleccione la razón social / nombre.');
        document.getElementById('inputNombreCliente')?.focus();
        return;
      }
    }
    // SERIE - FECHA
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
    //FACTURA
    //console.log(
    //   'definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago - definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad',
    //   definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago,
    //   definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad
    // );
    if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '01') {
      if (definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad !== '6') {
        alert('La factura requiere el RUC del cliente.');
        document.getElementById('ima_BuscarCliente_VENTA')?.focus();
        return;
      }
      // console.log('definicion_CTX_F_B_NC_ND.detraccion', definicion_CTX_F_B_NC_ND.detraccion);
      // console.log('definicion_CTX_F_B_NC_ND.detraccionCodigo', definicion_CTX_F_B_NC_ND.detraccionCodigo);
      // console.log('definicion_CTX_F_B_NC_ND.detraccionMedioPagoCodigo', definicion_CTX_F_B_NC_ND.detraccionMedioPagoCodigo);
      // console.log('definicion_CTX_F_B_NC_ND.detraccionNumCuentaBancoNacion', definicion_CTX_F_B_NC_ND.detraccionNumCuentaBancoNacion);
      // console.log('definicion_CTX_F_B_NC_ND.detraccionPorcentaje', definicion_CTX_F_B_NC_ND.detraccionPorcentaje);
      // console.log('definicion_CTX_F_B_NC_ND.detraccionMontoPEN', definicion_CTX_F_B_NC_ND.detraccionMontoPEN);

      if (definicion_CTX_F_B_NC_ND.detraccion) {
        if (definicion_CTX_F_B_NC_ND.detraccionCodigo.trim() === '') {
          alert('Seleccione la detracción.');
          document.getElementById('select_Detraccion')?.focus();
          return;
        }
        if (definicion_CTX_F_B_NC_ND.detraccionMedioPagoCodigo.trim() === '') {
          alert('Seleccione el medio pago para la detracción.');
          document.getElementById('select_DetraccionMedioPago')?.focus();
          return;
        }
        if (definicion_CTX_F_B_NC_ND.detraccionNumCuentaBancoNacion.trim() === '') {
          alert('Ingrese el número bancario de la detracción.');
          document.getElementById('in_CuentaBancariaDetraccion')?.focus();
          return;
        }
        if (definicion_CTX_F_B_NC_ND.detraccionPorcentaje === 0) {
          alert('Ingrese el porcentaje de detracción.');
          document.getElementById('in_PorcentajeDetraccion')?.focus();
          return;
        }
        if (definicion_CTX_F_B_NC_ND.detraccionMontoPEN === 0) {
          alert('Ingrese el monto de la detracción.');
          document.getElementById('in_MontoDetraccion')?.focus();
          return;
        }
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
        alert('Verifique, ha ingresado un RUC. Intenta realizar una BOLETA.');
        document.getElementById('ima_BuscarCliente_VENTA')?.focus();
        return;
      }
    }
    //NC - ND
    if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '07' || definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '08') {
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

        montoCONTADO_DOS_PARTES.value = parseFloat(definicion_CTX_F_B_NC_ND.montoEnEfectivo) + parseFloat(definicion_CTX_F_B_NC_ND.montoOtroMedioPago);
        if (definicion_CTX_F_B_NC_ND.enDolares) {
          const TOT = definicion_CTX_F_B_NC_ND.totalUSD.$numberDecimal ? definicion_CTX_F_B_NC_ND.totalUSD.$numberDecimal : definicion_CTX_F_B_NC_ND.totalUSD;
          if (montoCONTADO_DOS_PARTES.value !== TOT) {
            //console.log('monto - total', montoCONTADO_DOS_PARTES.value, TOT);
            alert('La suma de los montos de al CONTADO no coincide con el TOTAL.');
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        } else {
          const TOT = definicion_CTX_F_B_NC_ND.totalPEN.$numberDecimal ? definicion_CTX_F_B_NC_ND.totalPEN.$numberDecimal : definicion_CTX_F_B_NC_ND.totalPEN;
          if (montoCONTADO_DOS_PARTES.value !== TOT) {
            //console.log('monto - total', montoCONTADO_DOS_PARTES.value, TOT);
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
    //A  NC  -  ND
    if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '07' || definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '08') {
      if (definicion_CTX_F_B_NC_ND.referenciaCodigo === '' || definicion_CTX_F_B_NC_ND.referenciaDescripcion === '') {
        if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '07') {
          alert('Seleccione el motivo de la N. de Crédito');
          document.getElementById('select_Tipo_Nota_Credito')?.focus();
          return;
        }
        if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '08') {
          alert('Seleccione el motivo de la N. de Débito');
          document.getElementById('select_Tipo_Nota_Debito')?.focus();
          return;
        }
      }
      if (definicion_CTX_F_B_NC_ND.referenciaFecha === '') {
        alert('Ingrese la fecha de referencia de NC/ND');
        document.getElementById('in_VENTA_NC_ND_Fecha')?.focus();
        return;
      }
      if (definicion_CTX_F_B_NC_ND.referenciaTipo === '') {
        alert('Ingrese el tipo del documento referenciado');
        document.getElementById('select_VENTA_NC_ND_TCP')?.focus();
        return;
      }
      if (definicion_CTX_F_B_NC_ND.referenciaSerie === '') {
        alert('Ingrese la serie del documento referenciado');
        document.getElementById('in_VENTA_NC_ND_Serie')?.focus();
        return;
      }
      if (definicion_CTX_F_B_NC_ND.referenciaNumero.toString() === '' || definicion_CTX_F_B_NC_ND.referenciaNumero.toString() === 'NaN') {
        alert('Ingrese el número valido del documento referenciado');
        document.getElementById('in_VENTA_NC_ND_Numero')?.focus();
        return;
      }
      //SOLO NOTAs DE CREDITOS
      if (definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago === '07') {
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
      }
    } else {
      definicion_CTX_F_B_NC_ND.referenciaCodigo = ''; //Codigo del motivo
      definicion_CTX_F_B_NC_ND.referenciaDescripcion = ''; //Descripción del motivo
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
    //ACTUALIZAR TELEFONO ???
    if (definicion_CTX_F_B_NC_ND.telefono !== '') {
      if (telefonoOrigen.value !== definicion_CTX_F_B_NC_ND.telefono) {
        definicion_CTX_F_B_NC_ND.actualizarEmailCliente = true;
      }
    }
    //.......ITEMS .......
    if (definicion_CTX_F_B_NC_ND.itemsVenta.length === 0) {
      alert('Ingrese los ítems para la venta.');
      document.getElementById('btnVerAlmacen')?.focus();
      return;
    }
    //CONTABIIZAR
    if (definicion_CTX_F_B_NC_ND.contabilizarOperaciones) {
      let total12: number = 0;
      let impuesto40: number = 0;
      let producto70: number = 0;
      definicion_CTX_F_B_NC_ND.asientoContable = [];

      for (let index = 0; index < definicion_CTX_F_B_NC_ND.itemsVenta.length; index++) {
        const merca = definicion_CTX_F_B_NC_ND.itemsVenta[index];
        if (merca.codigoContableVenta !== '' && typeof merca.codigoContableVenta !== 'undefined') {
          //console.log('merca.ventaPEN merca.porcentaje', merca.ventaPEN, merca.porcentaje, 1 + merca.porcentaje / 100);
          let prod = 0;
          total12 = total12 + parseFloat(merca.ventaPEN);
          if (merca.porcentaje === 0) {
            prod = parseFloat(merca.ventaPEN);
          } else {
            prod = merca.ventaPEN / (1 + merca.porcentaje / 100);
          }
          producto70 = producto70 + prod;
          impuesto40 = impuesto40 + (merca.ventaPEN - prod);
          //console.log('pro impu', prod, merca.ventaPEN - prod);
          //construyendo el asiento
          definicion_CTX_F_B_NC_ND.asientoContable.push({
            idAuxiliar: parseInt(elIdAuxiliar()),
            item: 0,
            codigo: merca.codigoContableVenta,
            descripcion: merca.descripcionContableVenta,
            tipo: false,
            importe: prod,
          });
        }
      }
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

      //console.log('total12 !== definicion_CTX_F_B_NC_ND.totalPEN', total12, definicion_CTX_F_B_NC_ND.totalPEN, impuesto40, producto70);
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
      } else {
        definicion_CTX_F_B_NC_ND.totalDebePEN = total12;
        definicion_CTX_F_B_NC_ND.totalHaberPEN = total12;
      }
    }
    //console.log('definicion_CTX_F_B_NC_ND... despues del CALC A.C', definicion_CTX_F_B_NC_ND);
    // let elLiteral = '';
    // if (definicion_CTX_F_B_NC_ND.moneda === 'PEN') {
    //   elLiteral = literal(definicion_CTX_F_B_NC_ND.totalPEN, definicion_CTX_F_B_NC_ND.moneda);
    // } else {
    //   elLiteral = literal(definicion_CTX_F_B_NC_ND.totalUSD, definicion_CTX_F_B_NC_ND.moneda);
    // }
    ctx_index_venta.mostrarSpinner = true;
    //FECHA HORA LOCAL
    // const ffffDate: any = new Date(definicion_CTX_F_B_NC_ND.fecha);
    // //console.log('🧧🧧🧧🧧', definicion_CTX_F_B_NC_ND.fecha, ffffDate);
    // //console.log('🧧🧧🧧🧧', ffffDate);
    const fechaLocal =
      definicion_CTX_F_B_NC_ND.fecha.substring(8, 10) +
      '-' +
      definicion_CTX_F_B_NC_ND.fecha.substring(5, 7) +
      '-' +
      definicion_CTX_F_B_NC_ND.fecha.substring(0, 4);
    //console.log('🧧🧧🧧🧧', fechaLocal);
    // cerosALaIzquierda(ffffDate.getDate(), 2) + '-' + cerosALaIzquierda(ffffDate.getMonth() + 1, 2) + '-' + cerosALaIzquierda(ffffDate.getFullYear(), 4);
    // const al = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);

    const hhhhDate = new Date();
    const horaLocal =
      cerosALaIzquierda(hhhhDate.getHours(), 2) + ':' + cerosALaIzquierda(hhhhDate.getMinutes(), 2) + ':' + cerosALaIzquierda(hhhhDate.getSeconds(), 2);
    //
    const ventaGRABADA = await inVenta({
      idLibroDiario: parametrosGlobales.idLibroDiario,

      idGrupoEmpresarial: definicion_CTX_F_B_NC_ND.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_F_B_NC_ND.idEmpresa,
      idSucursal: definicion_CTX_F_B_NC_ND.idSucursal,
      sucursal: definicion_CTX_F_B_NC_ND.sucursal,
      sucursalDireccion: definicion_CTX_F_B_NC_ND.sucursalDireccion,
      idPeriodo: definicion_CTX_F_B_NC_ND.idPeriodo,
      periodo: definicion_CTX_F_B_NC_ND.periodo,

      ruc: definicion_CTX_F_B_NC_ND.ruc,
      empresa: definicion_CTX_F_B_NC_ND.empresa,
      direccion: definicion_CTX_F_B_NC_ND.direccion,
      departamento: definicion_CTX_F_B_NC_ND.departamento,
      provincia: definicion_CTX_F_B_NC_ND.provincia,
      distrito: definicion_CTX_F_B_NC_ND.distrito,
      ubigeo: definicion_CTX_F_B_NC_ND.ubigeo,

      codigoTipoOperacion: definicion_CTX_F_B_NC_ND.codigoTipoOperacion,
      tipoOperacion: definicion_CTX_F_B_NC_ND.tipoOperacion,

      codigoTipoComprobantePago: definicion_CTX_F_B_NC_ND.codigoTipoComprobantePago,
      tipoComprobantePago: definicion_CTX_F_B_NC_ND.tipoComprobantePago,
      idSerieVenta: definicion_CTX_F_B_NC_ND.idSerieVenta,
      serie: definicion_CTX_F_B_NC_ND.serie,
      // numero: definicion_CTX_F_B_NC_ND.numero,

      idNotaVenta: definicion_CTX_F_B_NC_ND.idNotaVenta,
      serieNotaVenta: definicion_CTX_F_B_NC_ND.serieNotaVenta,
      numeroNotaVenta: definicion_CTX_F_B_NC_ND.numeroNotaVenta,

      fecha: definicion_CTX_F_B_NC_ND.fecha, //YYYY-MM-DD
      fechaLocal: fechaLocal, //DD-MM-YYYY
      horaLocal: horaLocal,

      clienteVentasVarias: definicion_CTX_F_B_NC_ND.clienteVentasVarias,
      idCliente: definicion_CTX_F_B_NC_ND.idCliente,
      codigoTipoDocumentoIdentidad: definicion_CTX_F_B_NC_ND.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_F_B_NC_ND.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_F_B_NC_ND.numeroIdentidad,
      razonSocialNombre: definicion_CTX_F_B_NC_ND.razonSocialNombre,
      email: definicion_CTX_F_B_NC_ND.email,
      telefono: definicion_CTX_F_B_NC_ND.telefono,
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
      montoOtroMedioPago: definicion_CTX_F_B_NC_ND.montoOtroMedioPago.trim() === '' ? 0 : definicion_CTX_F_B_NC_ND.montoOtroMedioPago,

      cuotasPago: definicion_CTX_F_B_NC_ND.cuotasCredito,
      importeTotalCuotasCredito: definicion_CTX_F_B_NC_ND.importeTotalCuotasCredito,

      idCotizacion: definicion_CTX_F_B_NC_ND.idCotizacion,
      serieCotizacion: definicion_CTX_F_B_NC_ND.serieCotizacion,
      numeroCotizacion: definicion_CTX_F_B_NC_ND.numeroCotizacion,

      idOrdenServicio: definicion_CTX_F_B_NC_ND.idOrdenServicio,
      serieOrdenServicio: definicion_CTX_F_B_NC_ND.serieOrdenServicio,
      numeroOrdenServicio: definicion_CTX_F_B_NC_ND.numeroOrdenServicio,
      soloServicios: definicion_CTX_F_B_NC_ND.soloServicios,
      soloSuministros: definicion_CTX_F_B_NC_ND.soloSuministros,

      verificarObservacionVenta: definicion_CTX_F_B_NC_ND.verificarObservacionVenta,
      observacion: definicion_CTX_F_B_NC_ND.observacion.toUpperCase(),

      impresionTipoFacturaBoleta: definicion_CTX_F_B_NC_ND.impresionTipoFacturaBoleta,
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

      literal: definicion_CTX_F_B_NC_ND.lite,

      referenciaCodigo: definicion_CTX_F_B_NC_ND.referenciaCodigo,
      referenciaDescripcion: definicion_CTX_F_B_NC_ND.referenciaDescripcion,
      referenciaFecha: definicion_CTX_F_B_NC_ND.referenciaFecha,
      referenciaTipo: definicion_CTX_F_B_NC_ND.referenciaTipo,
      referenciaSerie: definicion_CTX_F_B_NC_ND.referenciaSerie,
      referenciaNumero: definicion_CTX_F_B_NC_ND.referenciaNumero,

      facturacionElectronica: definicion_CTX_F_B_NC_ND.facturacionElectronica,
      facturacionElectronicaAutomatica: definicion_CTX_F_B_NC_ND.facturacionElectronicaAutomatica,
      facturaJSON: parametrosGlobales.facturaJSON,
      facturaXML: parametrosGlobales.facturaXML,

      contabilizarOperaciones: definicion_CTX_F_B_NC_ND.contabilizarOperaciones,
      asientoContable: definicion_CTX_F_B_NC_ND.asientoContable,
      totalDebePEN: definicion_CTX_F_B_NC_ND.totalDebePEN,
      totalHaberPEN: definicion_CTX_F_B_NC_ND.totalHaberPEN,
      totalDebeUSD: definicion_CTX_F_B_NC_ND.totalDebeUSD,
      totalHaberUSD: definicion_CTX_F_B_NC_ND.totalHaberUSD,

      ventaConDetraccion: parametrosGlobales.ventaConDetraccion,
      detraccion: definicion_CTX_F_B_NC_ND.detraccion,
      detraccionCodigo: definicion_CTX_F_B_NC_ND.detraccionCodigo,
      detraccionDescripcion: definicion_CTX_F_B_NC_ND.detraccionDescripcion,
      detraccionMedioPagoCodigo: definicion_CTX_F_B_NC_ND.detraccionMedioPagoCodigo,
      detraccionMedioPagoDescripcion: definicion_CTX_F_B_NC_ND.detraccionMedioPagoDescripcion,
      detraccionNumCuentaBancoNacion: definicion_CTX_F_B_NC_ND.detraccionNumCuentaBancoNacion,
      detraccionPorcentaje: definicion_CTX_F_B_NC_ND.detraccionPorcentaje,
      detraccionMontoPEN: definicion_CTX_F_B_NC_ND.detraccionMontoPEN,

      // detraccionConstancia: String,
      // detraccionFecha: Date,

      usuario: parametrosGlobales.usuario,
    });

    if (ventaGRABADA.status === 400) {
      alert('🛑 Falla al registrar la venta. ' + ventaGRABADA.message);
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
      definicion_CTX_F_B_NC_ND.email = '';
      definicion_CTX_F_B_NC_ND.telefono = '';

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

      definicion_CTX_F_B_NC_ND.idNotaVenta = '';
      definicion_CTX_F_B_NC_ND.serieNotaVenta = '';
      definicion_CTX_F_B_NC_ND.numeroNotaVenta = 0;

      definicion_CTX_F_B_NC_ND.idCotizacion = '';
      definicion_CTX_F_B_NC_ND.serieCotizacion = '';
      definicion_CTX_F_B_NC_ND.numeroCotizacion = 0;

      definicion_CTX_F_B_NC_ND.idOrdenServicio = '';
      definicion_CTX_F_B_NC_ND.serieOrdenServicio = '';
      definicion_CTX_F_B_NC_ND.numeroOrdenServicio = 0;
      definicion_CTX_F_B_NC_ND.soloServicios = false;
      definicion_CTX_F_B_NC_ND.soloSuministros = false;

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

      definicion_CTX_F_B_NC_ND.lite = '';

      definicion_CTX_F_B_NC_ND.referenciaCodigo = '';
      definicion_CTX_F_B_NC_ND.referenciaDescripcion = '';
      definicion_CTX_F_B_NC_ND.referenciaFecha = '';
      definicion_CTX_F_B_NC_ND.referenciaTipo = '';
      definicion_CTX_F_B_NC_ND.referenciaSerie = '';
      definicion_CTX_F_B_NC_ND.referenciaNumero = 0;

      definicion_CTX_F_B_NC_ND.facturacionElectronica = parametrosGlobales.facturacionElectronica;
      definicion_CTX_F_B_NC_ND.facturacionElectronicaAutomatica = parametrosGlobales.facturacionElectronicaAutomatica;
      definicion_CTX_F_B_NC_ND.verificarObservacionVenta = parametrosGlobales.verificarObservacionVenta;

      definicion_CTX_F_B_NC_ND.contabilizarOperaciones = parametrosGlobales.contabilizarOperaciones;
      definicion_CTX_F_B_NC_ND.asientoContable = [];
      definicion_CTX_F_B_NC_ND.totalDebePEN = 0;
      definicion_CTX_F_B_NC_ND.totalHaberPEN = 0;
      definicion_CTX_F_B_NC_ND.totalDebeUSD = 0;
      definicion_CTX_F_B_NC_ND.totalHaberUSD = 0;

      definicion_CTX_F_B_NC_ND.detraccion = false;
      definicion_CTX_F_B_NC_ND.detraccionCodigo = '';
      definicion_CTX_F_B_NC_ND.detraccionDescripcion = '';
      definicion_CTX_F_B_NC_ND.detraccionMedioPagoCodigo = '';
      definicion_CTX_F_B_NC_ND.detraccionMedioPagoDescripcion = '';
      // definicion_CTX_F_B_NC_ND.detraccionNumCuentaBancoNacion = '';
      definicion_CTX_F_B_NC_ND.detraccionPorcentaje = 0;
      definicion_CTX_F_B_NC_ND.detraccionMontoPEN = 0;
    }

    definicion_CTX_ADD_VENTA.desabilitarAlmacenServicios = false;
    ctx_index_venta.mostrarSpinner = false;
    //OCULTAR MENSAJE DE GRABACION
    setTimeout(() => (pasoProcesoGrabacion.value = false), 3000);
    alert('✅ Registro satisfactorio!!!');
  });
  //#endregion SUBMIT

  return (
    <div
      class="container-modal"
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(330px, 96%, 1000px)',
        // width: 'auto',
        background: `${definicion_CTX_F_B_NC_ND.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : '#eee'}`,
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
        {/* <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            console.log('definicion_CTX_F_B_NC_ND', definicion_CTX_F_B_NC_ND);
            // //console.log('grabo', grabo.value);
            // //console.log('ctx_index_venta', ctx_index_venta);
          })}
        /> */}
        {/* <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            //console.log('parametrosGlobales', parametrosGlobales);
            // //console.log('grabo', grabo.value);
            // //console.log('ctx_index_venta', ctx_index_venta);
          })}
        /> */}

        {/*   <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            //console.log('props.addPeriod, props.addPeriodoAnterior', props.addPeriodo, props.addPeriodoAnterior);
            // //console.log('grabo', grabo.value);
            // //console.log('ctx_index_venta', ctx_index_venta);
          })}
        /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_venta.grabo_Venta = grabo.value;
            ctx_index_venta.mostrarPanelVenta = false;
          })}
        />
        {/*    
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="props.addPeriodo"
          onClick={$(() => {
            //console.log('props.addPeriodo', props.addPeriodo);
            // //console.log('grabo', grabo.value);
            // //console.log('ctx_index_venta', ctx_index_venta);
          })}
        /> */}
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Venta - {parametrosGlobales.sucursal} - {parametrosGlobales.RazonSocial}
      </h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES style={{ fontSize: '0.6rem' }} */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* PERIODO */}
          <div style={{ display: 'none' }}>
            {/* PERIODO */}
            <div class="form-control">
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
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL CLIENTE */}
          <div>
            {/* cliente VENTAS VARIAS*/}
            <div style={{ marginBotton: '4px' }}>
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
            {/* estrellas */}
            {/* <div style={{ margin: '8px 0' }} hidden={definicion_CTX_F_B_NC_ND.clienteVentasVarias}>
              <img
                id="e1"
                src={definicion_CTX_F_B_NC_ND.estrellasCliente >= 1 ? images.estrella128 : images.estrella128Contorno}
                alt="Estrella 1"
                width={14}
                height={14}
                hidden={ESTRELLA_MAX.value < 1}
                title="Estrella 1"
                style={{
                  marginLeft: '4px',
                  marginRight: '4px',
                  marginTop: '1px',
                }}
              />
              <img
                id="e2"
                src={definicion_CTX_F_B_NC_ND.estrellasCliente >= 2 ? images.estrella128 : images.estrella128Contorno}
                alt="Estrella 2"
                width={14}
                height={14}
                hidden={ESTRELLA_MAX.value < 2}
                title="Estrella 2"
                style={{
                  marginLeft: '4px',
                  marginRight: '4px',
                  marginTop: '1px',
                }}
              />
              <img
                id="e3"
                src={definicion_CTX_F_B_NC_ND.estrellasCliente >= 3 ? images.estrella128 : images.estrella128Contorno}
                alt="Estrella 3"
                width={14}
                height={14}
                hidden={ESTRELLA_MAX.value < 3}
                title="Estrella 3"
                style={{
                  marginLeft: '4px',
                  marginRight: '4px',
                  marginTop: '1px',
                }}
              />
              <img
                id="e4"
                src={definicion_CTX_F_B_NC_ND.estrellasCliente >= 4 ? images.estrella128 : images.estrella128Contorno}
                alt="Estrella4"
                width={14}
                height={14}
                hidden={ESTRELLA_MAX.value < 4}
                title="Estrella 4"
                style={{
                  marginLeft: '4px',
                  marginRight: '4px',
                  marginTop: '1px',
                }}
              />
              <img
                id="e5"
                src={definicion_CTX_F_B_NC_ND.estrellasCliente === 5 ? images.estrella128 : images.estrella128Contorno}
                alt="Estrella 5"
                width={14}
                height={14}
                hidden={ESTRELLA_MAX.value < 5}
                title="Estrella 5"
                style={{
                  marginLeft: '4px',
                  marginRight: '4px',
                  marginTop: '1px',
                }}
              />
            </div> */}
            {/* TIPO DE IDENTIDAD - NUMERO DE IDENTIDAD - RAZON SOCIAL / NOMBRE  */}
            <div class="linea_1_111">
              {/* tipo de documento identidad*/}
              <div>
                <div style={{ display: 'flex' }}>
                  <select
                    id="selectTipoDocumentoLiteral"
                    disabled
                    style={{ cursor: 'pointer', width: '100%', height: '18px' }}
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
                    height={18}
                    width={16}
                    style={{ margin: '0 4px ' }}
                    onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarPersona = true)}
                  />
                  <input
                    // id="in_BuscarDetraccion"
                    type="image"
                    src={images.edit}
                    title="Editar cliente"
                    height={18}
                    width={16}
                    // style={{ margin: '2px 0' }}
                    disabled={definicion_CTX_F_B_NC_ND.idCliente === '' ? true : false}
                    onClick$={() => {
                      // console.log('japon');
                      // ctx_buscar_persona.pP = persoLocali;
                      // ctx_buscar_persona.mostrarPanelEditPersona = true;
                      definicion_CTX_ADD_VENTA.mostrarPanelEditPersonaDirecta = true;
                    }}
                  />
                </div>
              </div>
              {/* numero identidad*/}
              <div>
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
              {/* Razon Social / Nombre */}
              <div>
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
            {/* DIRECCION - EMAIL - TELEFONO  */}
            <div class="linea_1_111">
              {/* Dirección Cliente */}
              <div>
                <input
                  id="inputDireccionCliente"
                  style={{ width: '100%' }}
                  type="text"
                  disabled
                  placeholder="Direccion cliente"
                  value={definicion_CTX_F_B_NC_ND.direccionCliente}
                  // onChange={(e) => setRazonSocialNombre(e.target.value)}
                />
              </div>
              {/* Email  */}
              <div>
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
              </div>
              {/* Telefono */}
              <div>
                <input
                  id="inputTelefono"
                  style={{ width: '100%' }}
                  type="tel"
                  placeholder="Telefono"
                  value={definicion_CTX_F_B_NC_ND.telefono}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.telefono = (e.target as HTMLInputElement).value;
                  }}
                  // onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            {definicion_CTX_ADD_VENTA.mostrarPanelBuscarPersona && (
              <div class="modal">
                <BuscarPersona
                  soloPersonasNaturales={false}
                  seleccionar="cliente"
                  contexto="venta"
                  rol="cliente"
                  valorABuscarAUTOMATICAMENTE={definicion_CTX_F_B_NC_ND.numeroIdentidad}
                  mensajeErrorPersona={definicion_CTX_ADD_VENTA.mensajeErrorCliente}
                />
              </div>
            )}
            {/* EDIT - PERSONA/CLIENTE */}
            {definicion_CTX_ADD_VENTA.mostrarPanelEditPersonaDirecta && (
              <div class="modal">
                <EditarPersonaDirecta
                  soloPersonaNatural={defini_CTX_CLIENTE_VENTA.codigoTipoDocumentoIdentidad === '6' ? false : true}
                  personaSeleccio={defini_CTX_CLIENTE_VENTA}
                  contexto={'add_venta'}
                />
              </div>
            )}

            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE FACTURA */}
          <div>
            <div class="linea_1_111">
              {/* Documento */}
              <div>
                <select
                  id="selectDocumentoVenta"
                  style={{ cursor: 'pointer', width: '100%' }}
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
              {/* Serie  */}
              <div>
                {
                  <select
                    id="selectSerieVenta"
                    style={{ cursor: 'pointer', width: '100%' }}
                    onChange$={(e) => {
                      const idx = (e.target as HTMLSelectElement).selectedIndex;
                      const elSelect = e.target as HTMLSelectElement;
                      const elOption = elSelect[idx];

                      //console.log('❤❤❤ dataSerie.value ', dataSerie.value);
                      const SSS: any = dataSerie.value;
                      const der = SSS.find((ew: any) => ew._id === elOption.id);
                      //console.log('❤❤❤ der ', der);
                      definicion_CTX_F_B_NC_ND.codigoTipoOperacion = der.codigoTipoOperacionXDefault;
                      definicion_CTX_F_B_NC_ND.tipoOperacion = der.tipoOperacionXDefault;
                      definicion_CTX_F_B_NC_ND.impresionTipoFacturaBoleta = der.impresionTipoFacturaBoleta;

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
              {/* fecha    */}
              <div>
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
                    // //console.log('la fechitaaaa', anio + mes);
                    const mas = anio + mes;
                    const PPP = losPeriodosCargados.value;
                    // //console.log('mas', mas);
                    // //console.log('PPP', PPP);
                    const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(mas));
                    // //console.log('elPeriodo', elPeriodo);
                    definicion_CTX_F_B_NC_ND.idPeriodo = elPeriodo._id;
                    definicion_CTX_F_B_NC_ND.periodo = elPeriodo.periodo;
                  }}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <br />
          </div>
          {/* ------------- ---------------------------------------- */}
          {/* ***NC -- ND -- */}
          <div id="zona_NC_ND" style={{ background: 'grey' }} hidden={tipoDocumento.value === '07' || tipoDocumento.value === '08' ? false : true}>
            {/* *** select -- */}
            <div class="form-control" style={{ paddingTop: '2px' }}>
              <div class="form-control form-agrupado" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'left' }}>
                <select
                  id="select_Tipo_Nota_Credito"
                  style={{ cursor: 'pointer', margin: '0 4px' }}
                  hidden={tipoDocumento.value === '07' ? false : true}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const elSelect = e.target as HTMLSelectElement;
                    const elOption = elSelect[idx];
                    // console.log('elOption', elOption.id);

                    if (elOption.id === '') {
                      definicion_CTX_F_B_NC_ND.referenciaCodigo = '';
                      definicion_CTX_F_B_NC_ND.referenciaDescripcion = '';
                    } else {
                      definicion_CTX_F_B_NC_ND.referenciaCodigo = elOption.id;
                      definicion_CTX_F_B_NC_ND.referenciaDescripcion = (e.target as HTMLSelectElement).value;
                    }

                    document.getElementById('in_VENTA_NC_ND_Fecha')?.focus();
                  }}
                >
                  <option value="">-- Seleccione un motivo N.C. --</option>
                  <option id="01" value="Anulación de la operación">
                    Anulación de la operación
                  </option>
                  <option id="02" value="Anulación por error en el RUC">
                    Anulación por error en el RUC
                  </option>
                  <option id="03" value="Corrección por error en la descripción o atención de reclamo respecto de bienes adquiridos o servicios prestados">
                    Corrección por error en la descripción o atención de reclamo respecto de bienes adquiridos o servicios prestados
                  </option>
                  <option id="04" value="Descuento global">
                    Descuento global
                  </option>
                  <option id="05" value="Descuento por ítem">
                    Descuento por ítem
                  </option>
                  <option id="06" value="Devolución total">
                    Devolución total
                  </option>
                  <option id="07" value="Devolución por ítem">
                    Devolución por ítem
                  </option>
                  <option id="08" value="Bonificación">
                    Bonificación
                  </option>
                  <option id="09" value="Disminución en el valor">
                    Disminución en el valor
                  </option>
                  <option id="10" value="Otros Conceptos">
                    Otros Conceptos
                  </option>
                  <option id="11" value="Ajustes de operaciones de exportación">
                    Ajustes de operaciones de exportación
                  </option>
                  <option id="12" value="Ajustes afectos al IVAP">
                    Ajustes afectos al IVAP
                  </option>
                  <option
                    id="13"
                    value="Corrección o modificación del monto neto pendiente de pago y/o la(s) fechas(s) de vencimiento del pago único o de las cuotas y/o los montos
                    correspondientes a cada cuota, de ser el caso"
                  >
                    Corrección o modificación del monto neto pendiente de pago y/o la(s) fechas(s) de vencimiento del pago único o de las cuotas y/o los montos
                    correspondientes a cada cuota, de ser el caso
                  </option>
                </select>
                <select
                  id="select_Tipo_Nota_Debito"
                  style={{ cursor: 'pointer', margin: '0 4px' }}
                  hidden={tipoDocumento.value === '08' ? false : true}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const elSelect = e.target as HTMLSelectElement;
                    const elOption = elSelect[idx];
                    // console.log('elOption', elOption.id);

                    if (elOption.id === '') {
                      definicion_CTX_F_B_NC_ND.referenciaCodigo = '';
                      definicion_CTX_F_B_NC_ND.referenciaDescripcion = '';
                    } else {
                      definicion_CTX_F_B_NC_ND.referenciaCodigo = elOption.id;
                      definicion_CTX_F_B_NC_ND.referenciaDescripcion = (e.target as HTMLSelectElement).value;
                    }
                    document.getElementById('in_VENTA_NC_ND_Fecha')?.focus();
                  }}
                >
                  <option value="">-- Seleccione un motivo N.D. --</option>
                  <option id="01" value="Intereses por mora">
                    Intereses por mora
                  </option>
                  <option id="02" value="Aumento en el valor">
                    Aumento en el valor
                  </option>
                  <option id="03" value="Penalidades/ otros conceptos">
                    Penalidades/ otros conceptos
                  </option>
                  <option id="11" value="Ajustes de operaciones de exportación">
                    Ajustes de operaciones de exportación
                  </option>
                  <option id="12" value="Ajustes afectos al IVAP">
                    Ajustes afectos al IVAP
                  </option>
                </select>
              </div>
            </div>
            {/* *** datos -- */}
            <div class="linea_1_1111" style={{ margin: '0 4px', paddingBottom: '4px' }}>
              <div>
                <input
                  id="in_VENTA_NC_ND_Fecha"
                  style={{ width: '100%' }}
                  // disabled
                  type="date"
                  placeholder="Add NC/ND Fecha"
                  value={definicion_CTX_F_B_NC_ND.referenciaFecha}
                  onChange$={(e) => (definicion_CTX_F_B_NC_ND.referenciaFecha = (e.target as HTMLInputElement).value)}
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
              </div>
              <div>
                <select
                  id="select_VENTA_NC_ND_TCP"
                  style={{ cursor: 'pointer', width: '100%' }}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const elSelect = e.target as HTMLSelectElement;
                    const elOption = elSelect[idx];
                    // console.log('elOption', elOption.id);

                    if (elOption.id === '') {
                      definicion_CTX_F_B_NC_ND.referenciaTipo = '';
                    } else {
                      definicion_CTX_F_B_NC_ND.referenciaTipo = elOption.id;
                    }
                    document.getElementById('in_VENTA_NC_ND_Serie')?.focus();
                  }}
                >
                  <option value="">-- Seleccione el TCP --</option>
                  <option id="01" value="Factura">
                    Factura
                  </option>
                  <option id="03" value="Boleta de venta">
                    Boleta de venta
                  </option>
                  <option id="12" value="Ticket de máquina registradora">
                    Ticket de máquina registradora
                  </option>
                </select>
              </div>
              <div>
                <input
                  id="in_VENTA_NC_ND_Serie"
                  style={{ width: '100%' }}
                  // disabled
                  type="text"
                  placeholder="Add NC/ND Serie"
                  value={definicion_CTX_F_B_NC_ND.referenciaSerie}
                  onChange$={(e) => (definicion_CTX_F_B_NC_ND.referenciaSerie = (e.target as HTMLInputElement).value.toUpperCase())}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_VENTA_NC_ND_Numero')?.focus();
                    }
                  }}
                />
              </div>
              <div>
                <input
                  id="in_VENTA_NC_ND_Numero"
                  style={{ width: '100%' }}
                  // disabled
                  type="number"
                  placeholder="Add NC/ND Numero"
                  value={definicion_CTX_F_B_NC_ND.referenciaNumero}
                  onFocus$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                  onChange$={(e) => (definicion_CTX_F_B_NC_ND.referenciaNumero = parseInt((e.target as HTMLInputElement).value.trim()))}
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
              </div>
            </div>
          </div>
          <br hidden={tipoDocumento.value === '07' || tipoDocumento.value === '08' ? false : true}></br>
          {/* --------------style={{ fontSize: '0.9rem', fontWeight: '400', paddingLeft: '4px', paddingRight: '24px' }}--------------------------------------- */}
          {/* IGV - TC  */}
          <div>
            <div class="linea_1_11">
              {/* IGV */}
              <div style={{ display: 'flex' }}>
                <strong style={{ marginRight: '4px', marginTop: '2px', width: '20%' }}>IGV</strong>
                <input type="text" id="inputIGV" disabled value={definicion_CTX_F_B_NC_ND.igv.$numberDecimal + ' %'} style={{ width: '100%' }} />
              </div>
              {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
              <div style={{ display: 'flex' }}>
                <div style={{ width: '20%' }}>
                  <input
                    id="chbx_TipoCambio_Para_Venta"
                    type="checkbox"
                    style={{ cursor: 'pointer' }}
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
                    style={{ fontSize: '0.9rem', fontWeight: '400', cursor: 'pointer', marginRight: '4px', marginTop: '1px' }}
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
                </div>

                <input id="inputTipoCambio" type="number" value={definicion_CTX_F_B_NC_ND.tipoCambio} disabled style={{ width: '100%' }} />
              </div>
            </div>

            <br />
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
              <div class="form-control form-agrupado" style={{ display: 'flex' }}>
                <select
                  id="metodoPago"
                  value={definicion_CTX_F_B_NC_ND.metodoPago}
                  onChange$={() => {
                    definicion_CTX_F_B_NC_ND.verCuotasCredito = !definicion_CTX_F_B_NC_ND.verCuotasCredito;
                  }}
                  style={definicion_CTX_F_B_NC_ND.verCuotasCredito ? { cursor: 'pointer', width: '70%' } : { cursor: 'pointer', width: '100%' }}
                >
                  <option value="CONTADO">CONTADO</option>
                  <option value="CRÉDITO">CRÉDITO</option>
                </select>
                {definicion_CTX_F_B_NC_ND.verCuotasCredito && (
                  <button
                    id="addCuota"
                    class="btn"
                    title="Adicionar cuota"
                    style={{ width: '28%', cursor: 'pointer' }}
                    onClick$={() => {
                      (cuota.idAuxiliar = parseInt(elIdAuxiliar())),
                        (cuota.fechaCuota = masXdiasHoy(30)),
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
                  style={{ cursor: 'pointer' }}
                  checked={definicion_CTX_F_B_NC_ND.todoEnEfectivo}
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.todoEnEfectivo = (e.target as HTMLInputElement).checked;
                    definicion_CTX_F_B_NC_ND.unaParteEnEfectivo = !definicion_CTX_F_B_NC_ND.todoEnEfectivo;
                  }}
                />
                <label for="Todo en efectivo" style={{ cursor: 'pointer' }}>
                  Todo en efectivo
                </label>
                <br />
                {/* <div class="form-control form-agrupado" style={{ display: 'flex' }}> */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', margin: '6px 0' }}>
                  <div>
                    <input
                      id="Una parte en efectivo"
                      type="radio"
                      value="Una parte en efectivo"
                      name="Contado"
                      style={{ cursor: 'pointer' }}
                      checked={definicion_CTX_F_B_NC_ND.unaParteEnEfectivo}
                      onChange$={(e) => {
                        definicion_CTX_F_B_NC_ND.unaParteEnEfectivo = (e.target as HTMLInputElement).checked;
                        definicion_CTX_F_B_NC_ND.todoEnEfectivo = !definicion_CTX_F_B_NC_ND.unaParteEnEfectivo;
                      }}
                    />
                    <label for="Una parte en efectivo" style={{ cursor: 'pointer' }}>
                      Una parte en efectivo
                    </label>
                  </div>
                  <input
                    id="inputMontoEnEfectivo"
                    type="number"
                    placeholder="Efectivo"
                    style={definicion_CTX_F_B_NC_ND.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  <select
                    id="select_contado"
                    style={
                      definicion_CTX_F_B_NC_ND.unaParteEnEfectivo
                        ? { cursor: 'pointer', background: 'white', width: '100%' }
                        : { cursor: 'pointer', background: '#eeeeee', width: '100%' }
                    }
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
                    id="inputMontoOtroMedioPago"
                    type="number"
                    placeholder="Otro medio"
                    style={definicion_CTX_F_B_NC_ND.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
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
                  contexto="add_venta"
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
                  <table style={{ fontSize: '0.8rem', fontWeight: 'lighter', margin: '4px 0' }}>
                    <thead>
                      <tr>
                        <th>Nro. Cuota</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {definicion_CTX_F_B_NC_ND.cuotasCredito.map((value: any, index: number) => {
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
                            <td data-label="Importe" class="comoNumeroLeft">
                              {/* {cuota.importeCuotaPEN} */}
                              {`${value.importeCuotaPEN.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`}
                            </td>
                            <td data-label="Acciones" class="accionesLeft">
                              <input type="image" title="Editar ítem" alt="icono de editar" height={14} width={14} src={images.edit} />
                              <input type="image" title="Eliminar ítem" alt="icono de eliminar" height={14} width={14} src={images.trash} />
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
                  <i style={{ fontSize: '0.8rem' }}>No existen cuotas de crédito</i>
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
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* BOTONES */}
          <div hidden={props.contexto === 'nota_venta' ? true : false}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#74a6ab' }}>
              {/* //ver ALMACEN OUT */}
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
                  <BuscarMercaderiaOUT
                    contexto="new_venta"
                    esAlmacen={false}
                    porcentaje={definicion_CTX_F_B_NC_ND.igv.$numberDecimal ? definicion_CTX_F_B_NC_ND.igv.$numberDecimal : definicion_CTX_F_B_NC_ND.igv}
                  />
                  {/* <BusquedaMercaderiaOUT ancho={740} parametrosGlobales={props.parametrosGlobales} item1={item} /> */}
                </div>
              )}
              {/* //ver SERVICIO */}
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
                  <BuscarServicio
                    contexto="new_venta"
                    porcentaje={definicion_CTX_F_B_NC_ND.igv.$numberDecimal ? definicion_CTX_F_B_NC_ND.igv.$numberDecimal : definicion_CTX_F_B_NC_ND.igv}
                  />
                </div>
              )}
              {/* //ver ADJUNTAR OS */}
              <button id="btnAdjuntarOS" style={{ cursor: 'pointer' }} onClick$={() => (definicion_CTX_ADD_VENTA.mostrarAdjuntarOS = true)}>
                Adjuntar O.S.
              </button>
              {definicion_CTX_ADD_VENTA.mostrarAdjuntarOS && (
                <div class="modal">
                  <AdjuntarOrdenServicio />
                </div>
              )}
              {/* //ver ADJUNTAR COTIZACION */}
              <button id="btnAdjuntarCotizacion" onClick$={() => (definicion_CTX_ADD_VENTA.mostrarAdjuntarCotizacion = true)} style={{ cursor: 'pointer' }}>
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
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>

          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/*  tabla ITEMS - VENTA */}
          {
            <div class="form-control">
              {definicion_CTX_F_B_NC_ND.itemsVenta.length > 0 ? (
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
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
                      // console.log(indexItemVenta);

                      //console.log('iTVen.tipoImpuesto[1]', iTVen.tipoImpuesto[1].toString());
                      //IGV, ISC, IVAP, exoneradas, exportación, gratuitas, inafecta, otrosTributos
                      //['1000', 'IGV', 'VAT']  ['1016', 'IVAP', 'VAT']  ['2000', 'ISC', 'EXC']  ['7152', 'ICBPER', 'OTH']  ['9995', 'EXP', 'FRE']
                      //['9996', 'GRA', 'FRE']  ['9997', 'EXO', 'VAT']  ['9998', 'INA', 'FRE']  ['9999', 'OTROS', 'OTH']

                      if (definicion_CTX_F_B_NC_ND.enDolares) {
                        // console.log('enDolares$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                        if (iTVen.tipoImpuesto[1] === 'IGV') {
                          const vv = redondeo6Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
                          const denominador = 100 + Number.parseFloat(iTVen.porcentaje.$numberDecimal ? iTVen.porcentaje.$numberDecimal : iTVen.porcentaje);
                          t_bi = redondeo6Decimales((vv * 100) / denominador);
                          t_igv = redondeo6Decimales(vv - t_bi);
                        }
                        // if (iTVen.tipoImpuesto === 'ISC') {
                        // }
                        // if (iTVen.tipoImpuesto === 'IVAP') {
                        // }
                        if (iTVen.tipoImpuesto[1].toString() === 'EXO') {
                          t_exo = redondeo6Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
                        }
                        if (iTVen.tipoImpuesto[1] === 'EXP') {
                          t_export = redondeo6Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
                        }
                        if (iTVen.tipoImpuesto[1] === 'GRA') {
                          t_otros = redondeo6Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
                        }
                        if (iTVen.tipoImpuesto[1] === 'INA') {
                          t_ina = redondeo6Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
                        }
                        if (iTVen.tipoImpuesto[1] === 'OTROS') {
                          t_otros = redondeo6Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
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
                        // console.log('🈶🈶🈶🈶🈶');

                        // if (iTVen.tipoImpuesto === 'IGV') {
                        // console.log('PENPENPENPENPENPENPEmn', iTVen.tipoImpuesto);
                        // console.log('PENPENPENPENPENPENPEmn', iTVen.tipoImpuesto[1]);

                        if (iTVen.tipoImpuesto[1] === 'IGV') {
                          // console.log('💚💚💚💚💚💚 IGV', iTVen.ventaPEN);
                          const vv = redondeo6Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                          // console.log('vv', vv);
                          // console.log('iTVen.porcentaje', iTVen.porcentaje);
                          const denominador = 100 + Number.parseFloat(iTVen.porcentaje.$numberDecimal ? iTVen.porcentaje.$numberDecimal : iTVen.porcentaje);
                          t_bi = redondeo6Decimales((vv * 100) / denominador);
                          t_igv = redondeo6Decimales(vv - t_bi);
                        }

                        // if (iTVen.tipoImpuesto === 'ISC') {
                        // }
                        // if (iTVen.tipoImpuesto === 'IVAP') {
                        // }

                        if (iTVen.tipoImpuesto[1] === 'EXO') {
                          // console.log('💚💚💚💚💚💚 EXO', iTVen.ventaPEN);
                          t_exo = redondeo6Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                        }
                        if (iTVen.tipoImpuesto[1] === 'EXP') {
                          // console.log('💚💚💚💚💚💚 EXP', iTVen.ventaPEN);
                          t_export = redondeo6Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                        }
                        if (iTVen.tipoImpuesto[1] === 'GRA') {
                          // console.log('💚💚💚💚💚💚 GRA', iTVen.ventaPEN);
                          t_otros = redondeo6Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                        }
                        if (iTVen.tipoImpuesto[1] === 'INA') {
                          // console.log('💚💚💚💚💚💚 INA', iTVen.ventaPEN);
                          t_ina = redondeo6Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                        }
                        if (iTVen.tipoImpuesto[1] === 'OTROS') {
                          // console.log('💚💚💚💚💚💚 OTROS', iTVen.ventaPEN);
                          t_otros = redondeo6Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                        }

                        //console.log('fin ...PENPENPENPENPENPENPEmn');
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
                        // console.log('🈶🈶🈶🈶🈶🈶🈶🈶🈶🈶');
                      }

                      sumaTOTAL = sumaTOTAL + t_bi + t_igv + t_exo + t_ina + t_isc + t_export + t_otros;
                      sumaTOTAL_BI = sumaTOTAL_BI + t_bi;
                      sumaTOTAL_IGV = sumaTOTAL_IGV + t_igv;
                      sumaTOTAL_EXO = sumaTOTAL_EXO + t_exo;
                      sumaTOTAL_INAFEC = sumaTOTAL_INAFEC + t_ina;
                      sumaTOTAL_ISC = sumaTOTAL_ISC + t_isc;
                      sumaTOTAL_EXPORT = sumaTOTAL_EXPORT + t_export;
                      sumaTOTAL_OTROS = sumaTOTAL_OTROS + t_otros;

                      //console.log(
                      //   `valores ${index + 1} : `,
                      //   sumaTOTAL,
                      //   sumaTOTAL_BI,
                      //   sumaTOTAL_IGV,
                      //   sumaTOTAL_EXO,
                      //   sumaTOTAL_INAFEC,
                      //   sumaTOTAL_ISC,
                      //   sumaTOTAL_EXPORT,
                      //   sumaTOTAL_OTROS
                      // );
                      //SOLO AL LLEGAR AL FINAL DE LA ITERACION SE FIJA LOS MONTOS
                      // console.log('🍟🍟🍟🍟🍟🍟🍟🍟🍟🍟🍟', t_bi, t_igv, t_exo, t_ina, t_isc, t_export, t_otros);
                      // console.log('🍟🍟🍟🍟🍟🍟🍟🍟🍟🍟🍟', index + 1, definicion_CTX_F_B_NC_ND.itemsVenta.length);

                      if (index + 1 === definicion_CTX_F_B_NC_ND.itemsVenta.length) {
                        // console.log('🛹🛹🛹🛹');

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
                        // console.log(
                        //   '🍟🍟🍟🍟🍟🍟🍟🍟🍟🍟🍟',
                        //   sumaTOTAL,
                        //   sumaTOTAL_BI,
                        //   sumaTOTAL_IGV,
                        //   sumaTOTAL_EXO,
                        //   sumaTOTAL_INAFEC,
                        //   sumaTOTAL_ISC,
                        //   sumaTOTAL_EXPORT,
                        //   sumaTOTAL_OTROS
                        // );
                      }

                      // console.log('😀😀😀😀😀', t_bi, t_igv, t_exo, t_ina, t_isc, t_export, t_otros);
                      return (
                        <tr key={iTVen.idAuxiliar}>
                          <td data-label="Ítem" class="comoCadena">
                            {`${cerosALaIzquierda(indexItemVenta, 3)}`}
                          </td>
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
                              disabled={props.contexto === 'nota_venta' ? true : false}
                              style={{ width: '60px', textAlign: 'end' }}
                              value={iTVen.cantidadEquivalencia.$numberDecimal ? iTVen.cantidadEquivalencia.$numberDecimal : iTVen.cantidadEquivalencia}
                              onChange$={(e) => {
                                //console.log('ON CHANGE: Cantidad........');
                                iTVen.cantidadEquivalencia = parseFloat((e.target as HTMLInputElement).value);
                                if (definicion_CTX_F_B_NC_ND.enDolares) {
                                  iTVen.ventaUSD = iTVen.cantidadEquivalencia * iTVen.precioUnitarioUSD;
                                  iTVen.ventaPEN = iTVen.cantidadEquivalencia * iTVen.precioUnitarioPEN;
                                } else {
                                  iTVen.ventaPEN =
                                    (iTVen.cantidadEquivalencia.$numberDecimal ? iTVen.cantidadEquivalencia.$numberDecimal : iTVen.cantidadEquivalencia) *
                                    (iTVen.precioUnitarioPEN.$numberDecimal ? iTVen.precioUnitarioPEN.$numberDecimal : iTVen.precioUnitarioPEN);
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
                              disabled={props.contexto === 'nota_venta' ? true : false}
                              style={{ width: '60px', textAlign: 'end' }}
                              value={
                                definicion_CTX_F_B_NC_ND.enDolares
                                  ? iTVen.precioUnitarioUSD.$numberDecimal
                                    ? iTVen.precioUnitarioUSD.$numberDecimal
                                    : iTVen.precioUnitarioUSD
                                  : iTVen.precioUnitarioPEN.$numberDecimal
                                  ? iTVen.precioUnitarioPEN.$numberDecimal
                                  : iTVen.precioUnitarioPEN
                              }
                              onChange$={(e) => {
                                //console.log('ON CHANGE: Precio Uni.........');
                                const precio = parseFloat((e.target as HTMLInputElement).value);

                                if (definicion_CTX_F_B_NC_ND.enDolares) {
                                  iTVen.precioUnitarioUSD = precio;
                                  iTVen.ventaUSD = iTVen.cantidadEquivalencia * iTVen.precioUnitarioUSD;
                                  iTVen.ventaPEN = iTVen.cantidadEquivalencia * iTVen.precioUnitarioPEN;
                                } else {
                                  iTVen.precioUnitarioPEN = precio;

                                  iTVen.ventaPEN =
                                    (iTVen.cantidadEquivalencia.$numberDecimal ? iTVen.cantidadEquivalencia.$numberDecimal : iTVen.cantidadEquivalencia) *
                                    (iTVen.precioUnitarioPEN.$numberDecimal ? iTVen.precioUnitarioPEN.$numberDecimal : iTVen.precioUnitarioPEN);
                                }
                                //actualizar COSTO UNITARIO - EQUIVALENTE -- SOLO SI ES SERVICIO
                                if (iTVen.tipo === 'SERVICIO') {
                                  iTVen.costoUnitarioPEN = redondeo6Decimales(
                                    iTVen.precioUnitarioPEN.$numberDecimal ? iTVen.precioUnitarioPEN.$numberDecimal : iTVen.precioUnitarioPEN
                                  );
                                  iTVen.costoUnitarioEquivalenciaPEN = redondeo6Decimales(
                                    iTVen.precioUnitarioPEN.$numberDecimal ? iTVen.precioUnitarioPEN.$numberDecimal : iTVen.precioUnitarioPEN
                                  );
                                }
                              }}
                            />
                          </td>
                          {/* ----------------------------------------------------- */}
                          <td data-label="Venta" class="comoNumero">
                            {definicion_CTX_F_B_NC_ND.enDolares
                              ? iTVen.ventaUSD.$numberDecimal
                                ? redondeo6Decimales(iTVen.ventaUSD.$numberDecimal)
                                : redondeo6Decimales(iTVen.ventaUSD)
                              : iTVen.ventaPEN.$numberDecimal
                              ? redondeo2Decimales(iTVen.ventaPEN.$numberDecimal)
                              : redondeo2Decimales(iTVen.ventaPEN)}
                          </td>
                          <td data-label="%" class="acciones">
                            {iTVen.porcentaje.$numberDecimal ? iTVen.porcentaje.$numberDecimal : iTVen.porcentaje}
                          </td>
                          <td data-label="Imp" class="acciones">
                            {iTVen.tipoImpuesto[1]}
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
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                //console.log('iTVen.tipoImpuesto', iTVen.tipoImpuesto);
                                editarImpuesto_ItemVenta.idAuxiliar = iTVen.idAuxiliar;
                                editarImpuesto_ItemVenta.descripcion = iTVen.descripcionEquivalencia;
                                editarImpuesto_ItemVenta.tipoImpuesto = iTVen.tipoImpuesto[0] + ' ' + iTVen.tipoImpuesto[1] + ' ' + iTVen.tipoImpuesto[2];
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
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
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
                      <td colSpan={6} class="comoNumero" style={{ color: '#2E1800' }}>
                        {definicion_CTX_F_B_NC_ND.enDolares ? 'Base Imponible USD' : 'Base Imponible PEN'}
                      </td>
                      <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                        {`${sumaTOTAL_BI.toLocaleString('en-PE', {
                          // style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero" style={{ color: '#2E1800' }}>
                        {definicion_CTX_F_B_NC_ND.enDolares ? 'Exonerado USD' : 'Exonerado PEN'}
                      </td>
                      <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                        {`${sumaTOTAL_EXO.toLocaleString('en-PE', {
                          // style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero" style={{ color: '#2E1800' }}>
                        {definicion_CTX_F_B_NC_ND.enDolares ? 'Inafecto USD' : 'Inafecto PEN'}
                      </td>
                      <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                        {`${sumaTOTAL_INAFEC.toLocaleString('en-PE', {
                          // style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero" style={{ color: '#2E1800' }}>
                        {definicion_CTX_F_B_NC_ND.enDolares ? 'Exportación USD' : 'Exportación PEN'}
                      </td>
                      <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                        {`${sumaTOTAL_EXPORT.toLocaleString('en-PE', {
                          // style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero" style={{ color: '#2E1800' }}>
                        {definicion_CTX_F_B_NC_ND.enDolares ? 'Otros USD' : 'Otros PEN'}
                      </td>
                      <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                        {`${sumaTOTAL_OTROS.toLocaleString('en-PE', {
                          // style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero" style={{ color: '#2E1800' }}>
                        {definicion_CTX_F_B_NC_ND.enDolares ? 'IGV USD' : 'IGV PEN'}
                      </td>
                      <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                        {`${sumaTOTAL_IGV.toLocaleString('en-PE', {
                          // style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={6} class="comoNumero" style={{ color: '#2E1800' }}>
                        {definicion_CTX_F_B_NC_ND.enDolares ? 'Total USD' : 'Total PEN'}
                      </td>
                      <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                        {`${sumaTOTAL.toLocaleString('en-PE', {
                          // style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                      <td colSpan={3} />
                    </tr>
                    <tr>
                      <td colSpan={7} class="comoNumero" style={{ color: '#494641' }}>
                        {definicion_CTX_F_B_NC_ND.lite}
                      </td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <i style={{ fontSize: '0.8rem' }}>No existen ítems para la venta</i>
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
          <br />
          {/* ----------------------------------------------------- */}
          {/* DETRACCION */}
          {parametrosGlobales.ventaConDetraccion && (
            <div>
              {/* CON DETRACCION */}
              <div style={{ borderRadius: '2px', backgroundColor: '#999999' }}>
                <input
                  type="checkbox"
                  id="chbx_ConDetraccion"
                  style={{ cursor: 'pointer' }}
                  checked={definicion_CTX_F_B_NC_ND.detraccion}
                  title="Con Detracción"
                  alt="Alt Con Detracción"
                  placeholder="Con Detracción"
                  onChange$={(e) => {
                    definicion_CTX_F_B_NC_ND.detraccion = (e.target as HTMLInputElement).checked;
                  }}
                />
                <label for="chbx_ConDetraccion" style={{ cursor: 'pointer' }}>
                  Con detracción
                </label>
              </div>
              <div
                id="zona_Detraccion"
                hidden={!definicion_CTX_F_B_NC_ND.detraccion}
                style={{ borderRadius: '2px', backgroundColor: '#999999', padding: '2px 0px' }}
              >
                {/* Detracción Bienes Servicios */}
                <div style={{ display: 'flex', margin: '4px 4px' }}>
                  <select
                    id="select_Detraccion"
                    style={{ cursor: 'pointer', width: '100%' }}
                    onChange$={() => {
                      const elSelec = document.getElementById('select_Detraccion') as HTMLSelectElement;
                      const elIdx = elSelec.selectedIndex;
                      // //console.log('?', elIdx, elSelec[elIdx].id);
                      definicion_CTX_F_B_NC_ND.detraccionCodigo = elSelec[elIdx].id;
                      // if (definicion_CTX_F_B_NC_ND.idDetraccion === "") {
                      //   definicion_CTX_F_B_NC_ND.detraccionCodigo = ""; // parseInt('');
                      // } else {
                      //   definicion_CTX_F_B_NC_ND.detraccionCodigo = elSelec.value; /// parseInt(elSelec.value);
                      //   // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                      // }
                    }}
                  >
                    <option>-- Seleccionar detracción --</option>
                    {dataDetraccionBienServicioSUNAT.value.map((detra: any) => {
                      return (
                        <option id={detra.codigo} value={detra.codigo} selected={detra.codigo === definicion_CTX_F_B_NC_ND.detraccionCodigo}>
                          {detra.codigo + ' - ' + detra.descripcion}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {/* Medio de Pago  DETRACCION*/}
                <div style={{ display: 'flex', margin: '4px 4px' }}>
                  <select
                    id="select_DetraccionMedioPago"
                    style={{ cursor: 'pointer', width: '100%' }}
                    onChange$={() => {
                      const elSelec = document.getElementById('select_DetraccionMedioPago') as HTMLSelectElement;
                      const elIdx = elSelec.selectedIndex;
                      // //console.log('?', elIdx, elSelec[elIdx].id);
                      definicion_CTX_F_B_NC_ND.detraccionMedioPagoCodigo = elSelec[elIdx].id;
                      // if (definicion_CTX_F_B_NC_ND.detraccionMedioPagoCodigo === "") {
                      //   definicion_CTX_F_B_NC_ND.detraccionCodigo = ""; // parseInt('');
                      // } else {
                      //   definicion_CTX_F_B_NC_ND.detraccionCodigo = elSelec.value; /// parseInt(elSelec.value);
                      //   // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                      // }
                    }}
                  >
                    <option>-- Seleccionar medio pago --</option>
                    {dataMedioPago.value.map((mp: any) => {
                      return (
                        <option id={mp.codigo} value={mp.codigo} selected={mp.codigo === definicion_CTX_F_B_NC_ND.detraccionMedioPagoCodigo}>
                          {mp.codigo + ' - ' + mp.descripcion}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div class="linea_1_111" style={{ margin: '0 4px 4px 4px' }}>
                  {/* Cuenta bancaria DETRACCION */}
                  <div>
                    <input
                      type="text"
                      id="in_CuentaBancariaDetraccion"
                      value={definicion_CTX_F_B_NC_ND.detraccionNumCuentaBancoNacion}
                      disabled
                      style={{ width: '100%' }}
                      placeholder="Cuenta bancaria detracción"
                      // onChange$={(e) => {
                      //   definicion_CTX_F_B_NC_ND.observacion = (e.target as HTMLInputElement).value.toUpperCase().trim();
                      // }}
                    />
                  </div>
                  {/* Porcentaje DETRACCION */}
                  <div style={{ display: 'flex' }}>
                    <label style={{ width: '36%', marginTop: '2px', marginRight: '4px' }}>PORCENTAJE</label>
                    <input
                      type="number"
                      id="in_PorcentajeDetraccion"
                      value={definicion_CTX_F_B_NC_ND.detraccionPorcentaje}
                      style={{ width: '100%' }}
                      placeholder="Porcentaje detracción"
                      onChange$={(e) => {
                        definicion_CTX_F_B_NC_ND.detraccionPorcentaje = (e.target as HTMLInputElement).value.toUpperCase().trim();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          document.getElementById('in_MontoDetraccion')?.focus();
                        }
                      }}
                      onFocus$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                    />
                  </div>
                  {/* Monto DETRACCION */}
                  <div style={{ display: 'flex' }}>
                    <label style={{ width: '36%', marginTop: '2px', marginRight: '4px' }}>MONTO PEN</label>
                    <input
                      type="number"
                      id="in_MontoDetraccion"
                      value={definicion_CTX_F_B_NC_ND.detraccionMontoPEN}
                      style={{ width: '100%' }}
                      placeholder="Monto detracción"
                      onChange$={(e) => {
                        definicion_CTX_F_B_NC_ND.detraccionMontoPEN = (e.target as HTMLInputElement).value.toUpperCase().trim();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          document.getElementById('btn_GrabarVenta')?.focus();
                        }
                      }}
                      onFocus$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                    />
                  </div>
                </div>
              </div>
              <br />
            </div>
          )}
          {/* ----------------------------------------------------- */}
          {/* OBSERVACION */}
          <div>
            {/* OBSERVACION */}
            <div class="form-control">
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
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
        </div>
        <input
          id="btn_GrabarVenta"
          type="submit"
          value={botonGrabar.value === '' ? 'Grabar' : `${botonGrabar.value}`}
          style={{ height: '40px' }}
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
