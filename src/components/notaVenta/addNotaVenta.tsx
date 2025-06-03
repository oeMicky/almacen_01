import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
// import { getDetraccionesBienesServiciosSUNAT, getMediosPagoSUNAT, getSeriesVentasActivasSegunTipo } from '~/apis/venta.api';
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
  formatear_2Decimales,
  diaDeLaSemana,
  masXdiasHoy,
} from '~/functions/comunes';

import { getTipoCambio } from '~/apis/apisExternas.api';
// import { inVenta } from '~/apis/venta.api';
import styleTabla from '../tabla/tabla.css?inline';
// import BuscarPersona from '../miscelanea/persona/buscarPersona';
import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';

import type { IPersonaVenta } from '~/interfaces/iPersona';
import type { ICuotaCreditoVenta, INotaVenta } from '~/interfaces/iVenta';
import { parametrosGlobales } from '~/routes/login';
// import BuscarServicio from '../miscelanea/servicio/buscarServicio';

import { getPorcentajesUtilidad } from '~/apis/grupoEmpresarial.api';
// import EditarPersonaDirecta from '../miscelanea/persona/editarPersonaDirecta';
import { CTX_INDEX_NOTA_VENTA } from '~/routes/(ventas)/notaVenta';
import { getSeriesActivasNotasVentas, inNotaVenta } from '~/apis/notaVenta.api';
import BorrarItemNotaVenta from './borrarItemNotaVenta';
import NewEditCuotaCreditoVenta from '../venta/newEditCuotaCreditoVenta';
// import PanelOtros from './panelOtros';

export const CTX_CLIENTE_VENTA = createContextId<IPersonaVenta>('cliente');
export const CTX_NOTA_VENTA = createContextId<INotaVenta>('nota_venta');
export const CTX_ADD_NOTA_VENTA = createContextId<any>('add_nota_venta');

// function preventScroll(e: any) {
//   e.preventDefault();
//   e.stopPropagation();

//   return false;
// }

export default component$((props: { addPeriodo: any; nvSelecci: any; igv: number; addPeriodoAnterior?: any }) => {
  useStyles$(styleTabla);

  //#region DEFINICION CTX_ADD_NOTA_VENTA
  const definicion_CTX_ADD_NOTA_VENTA = useStore({
    mostrarPanelCuotasCredito: false,
    grabo_CuotaCredito: false,

    mostrarVerAlmacen: false,

    mostrarPanelOtros: false,

    desabilitarAlmacenServicios: false,

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersona: false,
    mostrarPanelBuscarServicio: false,
    mostrarPanelBuscarMercaderiaOUT: false,

    mostrarPanelEditPersonaDirecta: false,
    grabo_PersonaDirecta: false,
    // personaDirectaEDITADA: { _id: '', razonSocialNombre: '', direccion: '', email: '', telefono: '', cuentasCorrientes: [] },

    mostrarAdjuntarOS: false,
    mostrarAdjuntarCotizacion: false,

    mostrarPanelBorrarItemNotaVenta: false,
    borrar_idAuxilarNotaVenta: 0,

    mostrarPanelEditarImpuesto: false,
    grabo_EditarImpuesto: false,
  });
  useContextProvider(CTX_ADD_NOTA_VENTA, definicion_CTX_ADD_NOTA_VENTA);
  //#endregion DEFINICION CTX_ADD_NOTA_VENTA

  //#region DEFINICION CTX_NOTA_VENTA
  const definicion_CTX_NOTA_VENTA = useStore<INotaVenta>(
    {
      _id: props.nvSelecci._id ? props.nvSelecci._id : '',
      idGrupoEmpresarial: props.nvSelecci.idGrupoEmpresarial ? props.nvSelecci.idGrupoEmpresarial : parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.nvSelecci.idEmpresa ? props.nvSelecci.idEmpresa : parametrosGlobales.idEmpresa,
      idAlmacen: props.nvSelecci.idAlmacen ? props.nvSelecci.idAlmacen : parametrosGlobales.idAlmacen,
      idSucursal: props.nvSelecci.idSucursal ? props.nvSelecci.idSucursal : parametrosGlobales.idSucursal,
      sucursal: props.nvSelecci.sucursal ? props.nvSelecci.sucursal : parametrosGlobales.sucursal,
      sucursalDireccion: props.nvSelecci.sucursalDireccion ? props.nvSelecci.sucursalDireccion : parametrosGlobales.sucursalDireccion,
      idPeriodo: props.nvSelecci.idPeriodo ? props.nvSelecci.idPeriodo : props.addPeriodo.idPeriodo,
      periodo: props.nvSelecci.periodo ? props.nvSelecci.periodo : props.addPeriodo.periodo,

      ruc: props.nvSelecci.ruc ? props.nvSelecci.ruc : parametrosGlobales.RUC,
      empresa: props.nvSelecci.empresa ? props.nvSelecci.empresa : parametrosGlobales.RazonSocial,
      direccion: props.nvSelecci.direccion ? props.nvSelecci.direccion : parametrosGlobales.Direccion,
      departamento: props.nvSelecci.departamento
        ? props.nvSelecci.departamento
        : typeof parametrosGlobales.departamento === 'undefined'
        ? ''
        : parametrosGlobales.departamento,
      provincia: props.nvSelecci.provincia
        ? props.nvSelecci.provincia
        : typeof parametrosGlobales.provincia === 'undefined'
        ? ''
        : parametrosGlobales.provincia,
      distrito: props.nvSelecci.distrito ? props.nvSelecci.distrito : typeof parametrosGlobales.distrito === 'undefined' ? '' : parametrosGlobales.distrito,
      ubigeo: props.nvSelecci.ubigeo ? props.nvSelecci.ubigeo : typeof parametrosGlobales.ubigeo === 'undefined' ? '' : parametrosGlobales.ubigeo,

      // codigoTipoOperacion: '',
      // tipoOperacion: '',
      idSerieNotaSalida: props.nvSelecci.idSerieNotaSalida ? props.nvSelecci.idSerieNotaSalida : parametrosGlobales.idSerieNotaSalida,
      serieNotaSalida: props.nvSelecci.serie ? props.nvSelecci.serie : parametrosGlobales.serieNotaSalida,

      // codigoTipoComprobantePago: '',
      // tipoComprobantePago: '',
      idSerieNotaVenta: props.nvSelecci.idSerieNotaVenta ? props.nvSelecci.idSerieNotaVenta : '',
      serie: props.nvSelecci.serie ? props.nvSelecci.serie : '',
      numero: props.nvSelecci.numero ? props.nvSelecci.numero : 0,
      fecha: props.nvSelecci.fecha ? props.nvSelecci.fecha.substring(0, 10) : hoy(), //'', //
      hora: props.nvSelecci.hora ? props.nvSelecci.hora : '',

      clienteVentasVarias: props.nvSelecci.clienteVentasVarias ? props.nvSelecci.clienteVentasVarias : false,
      estrellasCliente: props.nvSelecci.estrellasCliente ? props.nvSelecci.estrellasCliente : 0,
      // idCliente: '',
      // codigoTipoDocumentoIdentidad: '6',
      // tipoDocumentoIdentidad: 'RUC',
      // numeroIdentidad: '',
      // razonSocialNombre: '',
      // direccionCliente: '',
      // email: '',
      // telefono: '',
      // actualizarEmailCliente: false,

      igv: props.nvSelecci.igv ? props.nvSelecci.igv : props.igv,
      enDolares: props.nvSelecci.enDolares ? props.nvSelecci.enDolares : false,
      moneda: props.nvSelecci.moneda ? props.nvSelecci.moneda : 'PEN',
      tipoCambio: props.nvSelecci.tipoCambio ? props.nvSelecci.tipoCambio : 0,

      vendedor: props.nvSelecci.vendedor ? props.nvSelecci.vendedor : '',
      metodoPago: props.nvSelecci.metodoPago ? props.nvSelecci.metodoPago : 'CONTADO',

      todoEnEfectivo: props.nvSelecci.todoEnEfectivo ? props.nvSelecci.todoEnEfectivo : true,
      unaParteEnEfectivo: props.nvSelecci.unaParteEnEfectivo ? props.nvSelecci.unaParteEnEfectivo : false,
      montoEnEfectivo: props.nvSelecci.montoEnEfectivo ? props.nvSelecci.montoEnEfectivo : '',
      otroMedioPago: props.nvSelecci.otroMedioPago ? props.nvSelecci.otroMedioPago : 'TRANSF. DE FONDOS - YAPE',
      montoOtroMedioPago: props.nvSelecci.montoOtroMedioPago ? props.nvSelecci.montoOtroMedioPago : '',
      //**** CUOTAS */
      verCuotasCredito: props.nvSelecci.verCuotasCredito ? props.nvSelecci.verCuotasCredito : false,
      cuotasCredito: props.nvSelecci.cuotasCredito ? props.nvSelecci.cuotasCredito : [],
      importeTotalCuotasCredito: props.nvSelecci.importeTotalCuotasCredito ? props.nvSelecci.importeTotalCuotasCreditoid : 0,

      idCotizacion: props.nvSelecci.idCotizacion ? props.nvSelecci.idCotizacion : '',
      serieCotizacion: props.nvSelecci.serieCotizacion ? props.nvSelecci.serieCotizacion : '',
      numeroCotizacion: props.nvSelecci.numeroCotizacion ? props.nvSelecci.numeroCotizacion : 0,

      idOrdenServicio: props.nvSelecci.idOrdenServicio ? props.nvSelecci.idOrdenServicio : '',
      serieOrdenServicio: props.nvSelecci.serieOrdenServicio ? props.nvSelecci.serieOrdenServicio : '',
      numeroOrdenServicio: props.nvSelecci.numeroOrdenServicio ? props.nvSelecci.numeroOrdenServicio : 0,

      observacion: props.nvSelecci.observacion ? props.nvSelecci.observacion : '',

      idMotivoEgresoAlmacen: parametrosGlobales.idMotivosSalidaDelAlmacen_NV,

      // impresionTipoFacturaBoleta: false,
      itemsNotaVenta: props.nvSelecci.itemsNotaVenta ? props.nvSelecci.itemsNotaVenta : [],

      baseImponiblePEN: props.nvSelecci.baseImponiblePEN ? props.nvSelecci.baseImponiblePEN : 0,
      igvPEN: props.nvSelecci.igvPEN ? props.nvSelecci.igvPEN : 0,
      exoneradoPEN: props.nvSelecci.exoneradoPEN ? props.nvSelecci.exoneradoPEN : 0,
      inafectoPEN: props.nvSelecci.inafectoPEN ? props.nvSelecci.inafectoPEN : 0,
      iscPEN: props.nvSelecci.iscPEN ? props.nvSelecci.iscPEN : 0,
      exportPEN: props.nvSelecci.exportPEN ? props.nvSelecci.exportPEN : 0,
      otrosPEN: props.nvSelecci.otrosPEN ? props.nvSelecci.otrosPEN : 0,
      totalPEN: props.nvSelecci.totalPEN ? props.nvSelecci.totalPEN : 0,

      baseImponibleUSD: props.nvSelecci.baseImponibleUSD ? props.nvSelecci.baseImponibleUSD : 0,
      igvUSD: props.nvSelecci.igvUSD ? props.nvSelecci.igvUSD : 0,
      exoneradoUSD: props.nvSelecci.exoneradoUSD ? props.nvSelecci.exoneradoUSD : 0,
      inafectoUSD: props.nvSelecci.inafectoUSD ? props.nvSelecci.inafectoUSD : 0,
      iscUSD: props.nvSelecci.iscUSD ? props.nvSelecci.iscUSD : 0,
      exportUSD: props.nvSelecci.exportUSD ? props.nvSelecci.exportUSD : 0,
      otrosUSD: props.nvSelecci.otrosUSD ? props.nvSelecci.otrosUSD : 0,
      totalUSD: props.nvSelecci.totalUSD ? props.nvSelecci.totalUSD : 0,

      lite: props.nvSelecci.literal ? props.nvSelecci.literal : '',

      efectivoIngresado: props.nvSelecci.efectivoIngresado ? props.nvSelecci.efectivoIngresado : 0,
      vuelto: props.nvSelecci.vuelto ? props.nvSelecci.vuelto : 0,

      // referenciaCodigo: '', //Codigo del motivo
      // referenciaDescripcion: '', //Descripción del motivo
      // referenciaFecha: '',
      // referenciaTipo: '', //TCP
      // referenciaSerie: '',
      // referenciaNumero: 0,

      // props.nvSelecci._id ? props.nvSelecci._id :

      clienteSobrenombreChapa: props.nvSelecci.clienteSobrenombreChapa ? props.nvSelecci.clienteSobrenombreChapa : '',
      placa: props.nvSelecci.placa ? props.nvSelecci.placa : '',
      kilometraje: props.nvSelecci.kilometraje ? props.nvSelecci.kilometraje : '',
      checkACuenta: props.nvSelecci.checkACuenta ? props.nvSelecci.checkACuenta : false,
      aCuenta: props.nvSelecci.aCuenta ? props.nvSelecci.aCuenta : '',

      verificarObservacionVenta: props.nvSelecci.verificarObservacionVenta
        ? props.nvSelecci.verificarObservacionVenta
        : parametrosGlobales.verificarObservacionVenta,

      // json: '',

      contabilizarOperaciones: props.nvSelecci.contabilizarOperaciones ? props.nvSelecci.contabilizarOperaciones : parametrosGlobales.contabilizarOperaciones,
      asientoContable: props.nvSelecci.asientoContable ? props.nvSelecci.asientoContable : [],
      totalDebePEN: props.nvSelecci.totalDebePEN ? props.nvSelecci.totalDebePEN : -1,
      totalHaberPEN: props.nvSelecci.totalHaberPEN ? props.nvSelecci.totalHaberPEN : 0,
      totalDebeUSD: props.nvSelecci.totalDebeUSD ? props.nvSelecci.totalDebeUSD : -1,
      totalHaberUSD: props.nvSelecci.totalHaberUSD ? props.nvSelecci.totalHaberUSD : 0,

      ganancias: props.nvSelecci.ganancias ? props.nvSelecci.ganancias : 0,

      // ventaConDetraccion: parametrosGlobales.ventaConDetraccion,
      // detraccion: false,
      // detraccionCodigo: '',
      // detraccionDescripcion: '',
      // detraccionMedioPagoCodigo: '',
      // detraccionMedioPagoDescripcion: '',
      // detraccionMontoPEN: 0,
      // detraccionNumCuentaBancoNacion: parametrosGlobales.cuentaBancariaDetraccion,
      // detraccionPorcentaje: 0,
      // detraccionConstancia: '',
      // detraccionFecha: hoy(),
    },
    { deep: true }
  );
  useContextProvider(CTX_NOTA_VENTA, definicion_CTX_NOTA_VENTA);
  //#endregion DEFINICION CTX_NOTA_VENTA

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
  const ctx_index_nota_venta = useContext(CTX_INDEX_NOTA_VENTA);
  // ctx_index_nota_venta.mostrarSpinner = false;
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const losPorcentajesUtilidad = useSignal([]);
  const ESTRELLA_MAX = useSignal(0);
  // const tipoDocumento = useSignal('01'); //01-FACTURA  //03-BOLETA
  // const idSerieDocumento = useSignal('');
  // const serieDocumento = useSignal('');
  // const botonGrabar = useSignal('');
  const dataSerie = useSignal([]);
  const cuotaCredito_esEdit = useSignal(false);
  const pasoProcesoGrabacion = useSignal(false);
  const grabo = useSignal(false);
  const montoCONTADO_DOS_PARTES = useSignal(0);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  // const dataMedioPago = useSignal([]);
  // const dataDetraccionBienServicioSUNAT = useSignal([]);

  const verParametrosAdicionales_Items = useSignal(true);

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

  const otro_ItemVenta = useStore({
    idAuxiliar: '',
    item: '',
    cantidad: 1,
    descripcion: '',
    precio: 0,
    tipoImpuesto: '',
    tipoAfectacionDelImpuesto: '',
  });

  const borrarItemNotaVenta = useStore({
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

  //#region OBTENER SERIES NOTAS VENTAS
  const obtenerSeriesNotaVenta = $(async () => {
    if (definicion_CTX_NOTA_VENTA._id === '') {
      // obtenerSerie();
      const parametros = {
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idSucursal: parametrosGlobales.idSucursal,
      };
      //
      const lasSeries = await getSeriesActivasNotasVentas(parametros);
      dataSerie.value = lasSeries.data;
      // console.log('getSeriesActivasNotasVentas -->> dataSerie.value', dataSerie.value);

      if (dataSerie.value.length === 1) {
        const seriesNNVV: any = dataSerie.value[0];
        // console.log('seriesNNVV -->> seriesNNVV', seriesNNVV);
        definicion_CTX_NOTA_VENTA.idSerieNotaVenta = seriesNNVV.idSerieNotaVenta;
        definicion_CTX_NOTA_VENTA.serie = seriesNNVV.serie;
      }
    }
  });
  //#endregion OBTENER SERIES NOTAS VENTAS

  useTask$(async ({ track }) => {
    track(() => ini.value);
    // console.log('0️⃣');
    if (ini.value === 0) {
      // console.log('1️⃣');

      // console.log('2️⃣');
      obtenerSeriesNotaVenta();
      // console.log('3️⃣');
      obtenerESTRELLA_MAXIMA();
      // console.log('4️⃣');
      ctx_index_nota_venta.mostrarSpinner = false;
    }
    // console.log('5️⃣');
    // document.getElementById('in_Observacion')?.focus();
    setTimeout(() => {
      // document.getElementById('image_BuscarCliente')?.focus();
      document.getElementById('in_Fecha_Para_NotaVenta')?.focus();
    }, 100);
  });
  //#endregion INICIALIZACION

  //#region INICIALIZACION - TIPO DE DOCUMENTO
  //ESTO OCURRE ANTES DE RENDERIZAR
  // useTask$(async ({ track }) => {
  //   track(() => tipoDocumento.value);

  //   let laSerie;
  //   const parametros = {
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     idSucursal: parametrosGlobales.idSucursal,
  //     sucursal: parametrosGlobales.sucursal,
  //     sucursalDireccion: parametrosGlobales.sucursalDireccion,
  //     codigo: tipoDocumento.value,
  //   };

  //   switch (tipoDocumento.value) {
  //     case '01': //FACTURA
  //       serieDocumento.value = '';
  //       laSerie = await getSeriesVentasActivasSegunTipo(parametros);
  //       //
  //       dataSerie.value = laSerie.data;
  //       if (dataSerie.value.length === 1) {
  //         const SSS: any = dataSerie.value;
  //         //console.log('💚💚💚SSS🍟🍟🍟🍟🍟', SSS);
  //         definicion_CTX_NOTA_VENTA.codigoTipoOperacion = SSS[0].codigoTipoOperacionXDefault;
  //         definicion_CTX_NOTA_VENTA.tipoOperacion = SSS[0].tipoOperacionXDefault;
  //         definicion_CTX_NOTA_VENTA.idSerieVenta = SSS[0]._id;
  //         definicion_CTX_NOTA_VENTA.serie = SSS[0].serie;
  //         definicion_CTX_NOTA_VENTA.impresionTipoFacturaBoleta = SSS[0].impresionTipoFacturaBoleta;
  //         serieDocumento.value = SSS[0].serie;
  //       }

  //       definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago = '01';
  //       definicion_CTX_NOTA_VENTA.tipoComprobantePago = 'FACTURA';
  //       botonGrabar.value = 'Grabar FACTURA';

  //       if (parametrosGlobales.ventaConDetraccion) {
  //         // definicion_CTX_NOTA_VENTA.detraccionNumCuentaBancoNacion=parametrosGlobales.cuentaBancariaDetraccion;
  //         const losMediosPago = await getMediosPagoSUNAT();
  //         dataMedioPago.value = losMediosPago.data;

  //         const losBienesServicios = await getDetraccionesBienesServiciosSUNAT();
  //         dataDetraccionBienServicioSUNAT.value = losBienesServicios.data;
  //       }

  //       break;
  //     case '03': //BOLETA
  //       serieDocumento.value = '';

  //       laSerie = await getSeriesVentasActivasSegunTipo(parametros);

  //       dataSerie.value = laSerie.data;
  //       if (dataSerie.value.length === 1) {
  //         const SSS: any = dataSerie.value;
  //         //console.log('💚💚💚SSS🍟🍟🍟🍟🍟', SSS);
  //         definicion_CTX_NOTA_VENTA.codigoTipoOperacion = SSS[0].codigoTipoOperacionXDefault;
  //         definicion_CTX_NOTA_VENTA.tipoOperacion = SSS[0].tipoOperacionXDefault;
  //         definicion_CTX_NOTA_VENTA.idSerieVenta = SSS[0]._id;
  //         definicion_CTX_NOTA_VENTA.serie = SSS[0].serie;
  //         definicion_CTX_NOTA_VENTA.impresionTipoFacturaBoleta = SSS[0].impresionTipoFacturaBoleta;
  //         serieDocumento.value = SSS[0].serie;
  //       }

  //       definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago = '03';
  //       definicion_CTX_NOTA_VENTA.tipoComprobantePago = 'BOLETA';
  //       botonGrabar.value = 'Grabar BOLETA';

  //       break;
  //     case '07': //NOTA DE CRÉDITO
  //       serieDocumento.value = '';
  //       laSerie = await getSeriesVentasActivasSegunTipo(parametros);

  //       dataSerie.value = laSerie.data;
  //       if (dataSerie.value.length === 1) {
  //         const SSS: any = dataSerie.value;
  //         definicion_CTX_NOTA_VENTA.codigoTipoOperacion = SSS[0].codigoTipoOperacionXDefault;
  //         definicion_CTX_NOTA_VENTA.tipoOperacion = SSS[0].tipoOperacionXDefault;
  //         definicion_CTX_NOTA_VENTA.idSerieVenta = SSS[0]._id;
  //         definicion_CTX_NOTA_VENTA.serie = SSS[0].serie;
  //         definicion_CTX_NOTA_VENTA.impresionTipoFacturaBoleta = SSS[0].impresionTipoFacturaBoleta;
  //         serieDocumento.value = SSS[0].serie;
  //       }

  //       definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago = '07';
  //       definicion_CTX_NOTA_VENTA.tipoComprobantePago = 'NOTA DE CRÉDITO';
  //       botonGrabar.value = 'Grabar NOTA DE CRÉDITO';

  //       break;
  //     case '08': //NOTA DE DÉBITO
  //       serieDocumento.value = '';
  //       laSerie = await getSeriesVentasActivasSegunTipo(parametros);

  //       dataSerie.value = laSerie.data;
  //       if (dataSerie.value.length === 1) {
  //         const SSS: any = dataSerie.value;
  //         definicion_CTX_NOTA_VENTA.codigoTipoOperacion = SSS[0].codigoTipoOperacionXDefault;
  //         definicion_CTX_NOTA_VENTA.tipoOperacion = SSS[0].tipoOperacionXDefault;
  //         definicion_CTX_NOTA_VENTA.idSerieVenta = SSS[0]._id;
  //         definicion_CTX_NOTA_VENTA.serie = SSS[0].serie;
  //         definicion_CTX_NOTA_VENTA.impresionTipoFacturaBoleta = SSS[0].impresionTipoFacturaBoleta;
  //         serieDocumento.value = SSS[0].serie;
  //       }

  //       definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago = '08';
  //       definicion_CTX_NOTA_VENTA.tipoComprobantePago = 'NOTA DE DÉBITO';
  //       botonGrabar.value = 'Grabar NOTA DE DÉBITO';

  //       break;

  //     default:
  //       break;
  //   }
  // });
  //#endregion INICIALIZACION - TIPO DE DOCUMENTO F B NC ND

  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_NOTA_VENTA.selecciono_Persona);
    if (definicion_CTX_ADD_NOTA_VENTA.selecciono_Persona && definicion_CTX_ADD_NOTA_VENTA.rol_Persona === 'cliente') {
      // console.log('defini_CTX_CLIENTE_VENTA', defini_CTX_CLIENTE_VENTA);
      // alert('evalua a la persona');
      definicion_CTX_NOTA_VENTA.clienteVentasVarias = false;

      // definicion_CTX_NOTA_VENTA.idCliente = defini_CTX_CLIENTE_VENTA._id;
      // definicion_CTX_NOTA_VENTA.codigoTipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.codigoTipoDocumentoIdentidad;
      // definicion_CTX_NOTA_VENTA.tipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.tipoDocumentoIdentidad;
      // definicion_CTX_NOTA_VENTA.numeroIdentidad = defini_CTX_CLIENTE_VENTA.numeroIdentidad;
      // definicion_CTX_NOTA_VENTA.razonSocialNombre = defini_CTX_CLIENTE_VENTA.razonSocialNombre;
      // definicion_CTX_NOTA_VENTA.direccionCliente = defini_CTX_CLIENTE_VENTA.direccion;
      // definicion_CTX_NOTA_VENTA.email = defini_CTX_CLIENTE_VENTA.email;
      // definicion_CTX_NOTA_VENTA.telefono = defini_CTX_CLIENTE_VENTA.telefono;

      emailOrigen.value = defini_CTX_CLIENTE_VENTA.email;
      telefonoOrigen.value = defini_CTX_CLIENTE_VENTA.telefono;

      definicion_CTX_ADD_NOTA_VENTA.rol_Persona = '';
      definicion_CTX_ADD_NOTA_VENTA.selecciono_Persona = false;
    }
  });
  //#endregion CLIENTE

  //#region PERSONA DIRECTA / CLIENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_NOTA_VENTA.grabo_PersonaDirecta);

    if (definicion_CTX_ADD_NOTA_VENTA.grabo_PersonaDirecta) {
      // console.log('defini_CTX_CLIENTE_VENTA', defini_CTX_CLIENTE_VENTA);
      // alert('evalua a la persona');
      definicion_CTX_NOTA_VENTA.clienteVentasVarias = false;

      // definicion_CTX_NOTA_VENTA.idCliente = personaDirectaEDITADA._id;
      // // definicion_CTX_NOTA_VENTA.codigoTipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.codigoTipoDocumentoIdentidad;
      // // definicion_CTX_NOTA_VENTA.tipoDocumentoIdentidad = defini_CTX_CLIENTE_VENTA.tipoDocumentoIdentidad;
      // // definicion_CTX_NOTA_VENTA.numeroIdentidad = defini_CTX_CLIENTE_VENTA.numeroIdentidad;

      // definicion_CTX_NOTA_VENTA.razonSocialNombre = defini_CTX_CLIENTE_VENTA.razonSocialNombre;
      // definicion_CTX_NOTA_VENTA.direccionCliente = defini_CTX_CLIENTE_VENTA.direccion;
      // definicion_CTX_NOTA_VENTA.email = defini_CTX_CLIENTE_VENTA.email;
      // definicion_CTX_NOTA_VENTA.telefono = defini_CTX_CLIENTE_VENTA.telefono;

      emailOrigen.value = defini_CTX_CLIENTE_VENTA.email;
      telefonoOrigen.value = defini_CTX_CLIENTE_VENTA.telefono;

      definicion_CTX_ADD_NOTA_VENTA.grabo_PersonaDirecta = false;
    }
  });
  //#endregion PERSONA DIRECTA / CLIENTE

  //#region TIPO CAMBIO
  const obtenerTipoCambio = $(async (e: HTMLInputElement) => {
    const checkTC = e.checked;
    if (checkTC) {
      definicion_CTX_NOTA_VENTA.enDolares = true;

      let elTipoCambio = await getTipoCambio(definicion_CTX_NOTA_VENTA.fecha);
      elTipoCambio = elTipoCambio.data;

      definicion_CTX_NOTA_VENTA.moneda = elTipoCambio.moneda;
      definicion_CTX_NOTA_VENTA.tipoCambio = elTipoCambio.venta;
      //
    } else {
      definicion_CTX_NOTA_VENTA.enDolares = false;
      definicion_CTX_NOTA_VENTA.moneda = 'PEN';
      definicion_CTX_NOTA_VENTA.tipoCambio = 0;
    }
  });
  //#endregion TIPO CAMBIO

  //#region ADD CUOTA CREDITO
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_NOTA_VENTA.mostrarPanelCuotasCredito);
    if (definicion_CTX_ADD_NOTA_VENTA.grabo_CuotaCredito && !cuotaCredito_esEdit.value) {
      const elTarget = JSON.parse(JSON.stringify(cuota));

      const iT = elTarget;

      definicion_CTX_NOTA_VENTA.cuotasCredito.push(iT);
    }
  });
  //#endregion ADD CUOTA CREDITO

  //#region EDIT CUOTA CREDITO
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_NOTA_VENTA.mostrarPanelCuotasCredito);

    if (definicion_CTX_ADD_NOTA_VENTA.grabo_CuotaCredito && cuotaCredito_esEdit.value) {
      const aModificar = definicion_CTX_NOTA_VENTA.cuotasCredito.filter((elIT: any) => elIT.idAuxiliar === cuota.idAuxiliar);

      aModificar[0].fechaCuota = cuota.fechaCuota;
      aModificar[0].importeCuotaPEN = cuota.importeCuotaPEN;

      // if (aModificar.length > 0) {
      //   const elTarget = JSON.parse(JSON.stringify(aModificar[0]));
      //   elTarget.descripcion = editarImpuesto_ItemVenta.descripcion;
      //   elTarget.tipoImpuesto = editarImpuesto_ItemVenta.tipoImpuesto;
      //   elTarget.tipoAfectacionDelImpuesto = editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto;

      //   definicion_CTX_NOTA_VENTA.cuotasCredito.push(elTarget);
      // }
      // const elTarget = JSON.parse(JSON.stringify(cuota));

      // const iT = elTarget;

      // definicion_CTX_NOTA_VENTA.cuotasCredito.push(iT);
    }
  });
  //#endregion EDIT CUOTA CREDITO

  //#region ITEMS NOTA VENTA
  const fijarMontos = $((e: any) => {
    //console.log('fijarMontos........');
    if (definicion_CTX_NOTA_VENTA.enDolares) {
      // definicion_CTX_NOTA_VENTA.baseImponibleUSD = e.subTOTAL;
      // definicion_CTX_NOTA_VENTA.igvUSD = e.igvTOTAL;
      // definicion_CTX_NOTA_VENTA.totalUSD = e.sumaTOTAL_IGV + e.sumaTOTAL_EXO + e.sumaTOTAL_INAFEC;
      // const tt = redondeo2Decimales(e.sumaTOTAL * definicion_CTX_NOTA_VENTA.tipoCambio);
      // const sub = redondeo2Decimales((tt * 100) / (100 + definicion_CTX_NOTA_VENTA.igv));
      // const i = redondeo2Decimales(tt - sub);
      // definicion_CTX_NOTA_VENTA.baseImponiblePEN = sub;
      // definicion_CTX_NOTA_VENTA.igvPEN = i;
      // definicion_CTX_NOTA_VENTA.totalPEN = tt;
    } else {
      definicion_CTX_NOTA_VENTA.baseImponiblePEN = e.sumaTOTAL_BI;
      definicion_CTX_NOTA_VENTA.exoneradoPEN = e.sumaTOTAL_EXO;
      definicion_CTX_NOTA_VENTA.inafectoPEN = e.sumaTOTAL_INAFEC;
      definicion_CTX_NOTA_VENTA.iscPEN = e.sumaTOTAL_ISC;
      definicion_CTX_NOTA_VENTA.exportPEN = e.sumaTOTAL_EXPORT;
      definicion_CTX_NOTA_VENTA.otrosPEN = e.sumaTOTAL_OTROS;
      definicion_CTX_NOTA_VENTA.igvPEN = e.sumaTOTAL_IGV;
      definicion_CTX_NOTA_VENTA.totalPEN = e.sumaTOTAL;

      definicion_CTX_NOTA_VENTA.baseImponibleUSD = 0;
      definicion_CTX_NOTA_VENTA.exoneradoUSD = 0;
      definicion_CTX_NOTA_VENTA.inafectoUSD = 0;
      definicion_CTX_NOTA_VENTA.iscUSD = 0;
      definicion_CTX_NOTA_VENTA.exportUSD = 0;
      definicion_CTX_NOTA_VENTA.otrosUSD = 0;
      definicion_CTX_NOTA_VENTA.igvUSD = 0;
      definicion_CTX_NOTA_VENTA.totalUSD = 0;
    }
    //console.log('fijando........', definicion_CTX_NOTA_VENTA.moneda, definicion_CTX_NOTA_VENTA.totalPEN, definicion_CTX_NOTA_VENTA.totalUSD);
    definicion_CTX_NOTA_VENTA.lite = '';
    if (definicion_CTX_NOTA_VENTA.moneda === 'PEN') {
      definicion_CTX_NOTA_VENTA.lite = literal(definicion_CTX_NOTA_VENTA.totalPEN, definicion_CTX_NOTA_VENTA.moneda);
      definicion_CTX_NOTA_VENTA.vuelto = redondeo2Decimales(
        (definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
          ? definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
          : definicion_CTX_NOTA_VENTA.efectivoIngresado) -
          (definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal ? definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal : definicion_CTX_NOTA_VENTA.totalPEN)
      );
    } else {
      definicion_CTX_NOTA_VENTA.lite = literal(definicion_CTX_NOTA_VENTA.totalUSD, definicion_CTX_NOTA_VENTA.moneda);
    }
  });
  //#endregion ITEMS NOTA VENTA

  //#region ACTUALIZAR IMPORTE TOTAL CUOTAS
  const fijarImporteTotalCuotasCredito = $((e: any) => {
    definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito = e;
  });
  //#region ACTUALIZAR IMPORTE TOTAL CUOTAS

  //#region ELIMINAR ITEM NOTA VENTA Y CUENTA CONTABLE
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_NOTA_VENTA.borrar_idAuxilarNotaVenta);

    if (definicion_CTX_ADD_NOTA_VENTA.borrar_idAuxilarNotaVenta > 0) {
      //ITEM VENTA
      const newItems: any = definicion_CTX_NOTA_VENTA.itemsNotaVenta.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_ADD_NOTA_VENTA.borrar_idAuxilarNotaVenta
      );
      definicion_CTX_NOTA_VENTA.itemsNotaVenta = newItems;
      //CUENTA CONTABLE
      const newCuentas: any = definicion_CTX_NOTA_VENTA.asientoContable.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_ADD_NOTA_VENTA.borrar_idAuxilarNotaVenta
      );
      definicion_CTX_NOTA_VENTA.asientoContable = newCuentas;

      definicion_CTX_ADD_NOTA_VENTA.borrar_idAuxilarNotaVenta = 0;
    }
  });
  //#endregion ELIMINAR ITEM NOTA VENTA Y CUENTA CONTABLE

  //#region EDITAR IMPUESTO
  useTask$(({ track }) => {
    track(() => definicion_CTX_ADD_NOTA_VENTA.grabo_EditarImpuesto);

    if (definicion_CTX_ADD_NOTA_VENTA.grabo_EditarImpuesto) {
      //console.log('editarImpuesto_ItemVenta', editarImpuesto_ItemVenta);
      const aModificar = definicion_CTX_NOTA_VENTA.itemsNotaVenta.filter((elIT: any) => elIT.idAuxiliar === editarImpuesto_ItemVenta.idAuxiliar);
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
      definicion_CTX_ADD_NOTA_VENTA.grabo_EditarImpuesto = false;
    }
  });
  //#endregion EDITAR IMPUESTO

  //#region SUBMIT
  const grabandoNotaVenta = $(async () => {
    // if (definicion_CTX_NOTA_VENTA.observacion.trim() === '') {
    //   alert('Ingrese en la observación el nombre de quien solicita.');
    //   document.getElementById('in_Observacion')?.focus();
    //   return;
    // }
    //CLIENTE
    // if (definicion_CTX_NOTA_VENTA.clienteVentasVarias) {
    //   if (definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago !== '03') {
    //     alert('La venta para CLIENTES VENTA VARIAS debe ser una BOLETA.');
    //     document.getElementById('selectDocumentoVenta')?.focus();
    //     return;
    //   }
    // } else {
    //   if (definicion_CTX_NOTA_VENTA.numeroIdentidad === '') {
    //     alert('Seleccione el número de identidad.');
    //     // document.getElementById('inputNumeroDocumentoIdentidad')?.focus();
    //     document.getElementById('ima_BuscarCliente_VENTA')?.focus();
    //     return;
    //   }
    //   if (definicion_CTX_NOTA_VENTA.razonSocialNombre === '') {
    //     alert('Seleccione la razón social / nombre.');
    //     document.getElementById('inputNombreCliente')?.focus();
    //     return;
    //   }
    // }
    // SERIE - FECHA
    if (definicion_CTX_NOTA_VENTA.serie === '') {
      alert('Seleccione la serie.');
      document.getElementById('selectSerieVenta')?.focus();
      return;
    }
    if (definicion_CTX_NOTA_VENTA.fecha === '') {
      alert('Ingrese la fecha');
      document.getElementById('in_Fecha_Para_NotaVenta')?.focus();
      return;
    }
    //FACTURA

    // if (definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '01') {
    //   if (definicion_CTX_NOTA_VENTA.codigoTipoDocumentoIdentidad !== '6') {
    //     alert('La factura requiere el RUC del cliente.');
    //     document.getElementById('ima_BuscarCliente_VENTA')?.focus();
    //     return;
    //   }
    //   if (definicion_CTX_NOTA_VENTA.detraccion) {
    //     if (definicion_CTX_NOTA_VENTA.detraccionCodigo) {
    //       alert('Seleccione la detracción.');
    //       document.getElementById('select_Detraccion')?.focus();
    //       return;
    //     }
    //     if (definicion_CTX_NOTA_VENTA.detraccionMedioPagoCodigo) {
    //       alert('Seleccione el medio pago para la detracción.');
    //       document.getElementById('select_DetraccionMedioPago')?.focus();
    //       return;
    //     }
    //     if (definicion_CTX_NOTA_VENTA.detraccionNumCuentaBancoNacion.trim() === '') {
    //       alert('Ingrese el número bancario de la detracción.');
    //       document.getElementById('in_CuentaBancariaDetraccion')?.focus();
    //       return;
    //     }
    //     if (definicion_CTX_NOTA_VENTA.detraccionPorcentaje === 0) {
    //       alert('Ingrese el porcentaje de detracción.');
    //       document.getElementById('in_PorcentajeDetraccion')?.focus();
    //       return;
    //     }
    //     if (definicion_CTX_NOTA_VENTA.detraccionMontoPEN === 0) {
    //       alert('Ingrese el monto de la detracción.');
    //       document.getElementById('in_MontoDetraccion')?.focus();
    //       return;
    //     }
    //   }
    // }
    //BOLETA
    // if (definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '03') {
    //   if (definicion_CTX_NOTA_VENTA.totalPEN > 700) {
    //     if (definicion_CTX_NOTA_VENTA.clienteVentasVarias) {
    //       alert('SUNAT no permite boletas con ventas mayores a S/ 700 soles sin que se identifique al cliente');
    //       document.getElementById('ima_BuscarCliente_VENTA')?.focus();
    //       return;
    //     }
    //   }
    //   if (!definicion_CTX_NOTA_VENTA.clienteVentasVarias && definicion_CTX_NOTA_VENTA.codigoTipoDocumentoIdentidad === '6') {
    //     alert('Verifique, ha ingresado un RUC. Intenta realizar una BOLETA.');
    //     document.getElementById('ima_BuscarCliente_VENTA')?.focus();
    //     return;
    //   }
    // }
    //NC - ND
    // if (definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '07' || definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '08') {
    //   if (definicion_CTX_NOTA_VENTA.clienteVentasVarias) {
    //     alert('Debe identificar al cliente');
    //     document.getElementById('ima_BuscarCliente_VENTA')?.focus();
    //     return;
    //   }
    // }
    //AL CONTADO
    if (!definicion_CTX_NOTA_VENTA.verCuotasCredito) {
      if (definicion_CTX_NOTA_VENTA.unaParteEnEfectivo) {
        let monEFEC = definicion_CTX_NOTA_VENTA.montoEnEfectivo;
        let monOTR = definicion_CTX_NOTA_VENTA.montoOtroMedioPago;
        // console.log('monEFEC', monEFEC);
        // console.log('monOTR', monOTR);

        if (monEFEC === undefined || monEFEC === '' || monEFEC === 0 || monEFEC.toString() === 'NaN') {
          monEFEC = 0;
          // console.log('🎭🎭🎭monEFE: ', monEFEC);
        } else {
          monEFEC = parseFloat(definicion_CTX_NOTA_VENTA.montoEnEfectivo);
        }
        if (monEFEC === 0) {
          //
        } else {
          if (!Number.parseFloat(monEFEC)) {
            alert('🎭Verifique el monto en efectivo: ' + monEFEC);
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        }

        if (monOTR === undefined || monOTR === '' || monOTR === 0 || monOTR.toString() === 'NaN') {
          monOTR = 0;
        } else {
          monOTR = parseFloat(definicion_CTX_NOTA_VENTA.montoOtroMedioPago);
        }
        if (monOTR === 0) {
          //
        } else {
          if (!Number.parseFloat(monOTR)) {
            alert('Verifique el monto de otro medio de pago.');
            document.getElementById('inputMontoOtroMedioPago')?.focus();
            return;
          }
        }

        montoCONTADO_DOS_PARTES.value = monEFEC + monOTR;

        // montoCONTADO_DOS_PARTES.value = parseFloat(definicion_CTX_NOTA_VENTA.montoEnEfectivo) + parseFloat(definicion_CTX_NOTA_VENTA.montoOtroMedioPago);
        if (definicion_CTX_NOTA_VENTA.enDolares) {
          const TOT = definicion_CTX_NOTA_VENTA.totalUSD.$numberDecimal
            ? parseFloat(definicion_CTX_NOTA_VENTA.totalUSD.$numberDecimal)
            : parseFloat(definicion_CTX_NOTA_VENTA.totalUSD);
          if (montoCONTADO_DOS_PARTES.value !== TOT) {
            // console.log('USD monto - total', montoCONTADO_DOS_PARTES.value, TOT);
            alert('La suma de los montos de al CONTADO no coincide con el TOTAL.');
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        } else {
          const TOT = definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal
            ? parseFloat(definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal)
            : parseFloat(definicion_CTX_NOTA_VENTA.totalPEN);
          if (montoCONTADO_DOS_PARTES.value !== TOT) {
            // console.log('PEN monto - total', montoCONTADO_DOS_PARTES.value, TOT);
            alert('La suma de los montos de al CONTADO no coincide con el TOTAL.');
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        }
      }
    }
    //A CREDITO
    if (definicion_CTX_NOTA_VENTA.verCuotasCredito) {
      // console.log('✴📛📛📛📛📛📛📛📛📛📛📛');

      if (definicion_CTX_NOTA_VENTA.clienteSobrenombreChapa.trim() === '') {
        alert('Ingrese el cliente / sobrenombre / chapa.');
        document.getElementById('in_Cliente_Sobrenombre_Chapa')?.focus();
        return;
      }
      if (definicion_CTX_NOTA_VENTA.verCuotasCredito && definicion_CTX_NOTA_VENTA.cuotasCredito.length === 0) {
        alert('Ingrese las cuotas de crédito.');
        document.getElementById('addCuota')?.focus();
        return;
      }
      if (definicion_CTX_NOTA_VENTA.unaParteEnEfectivo) {
        // let monEFEC = parseFloat(definicion_CTX_NOTA_VENTA.montoEnEfectivo);
        // let monOTR = parseFloat(
        //   definicion_CTX_NOTA_VENTA.montoOtroMedioPago.$numberDecimal
        //     ? definicion_CTX_NOTA_VENTA.montoOtroMedioPago.$numberDecimal
        //     : definicion_CTX_NOTA_VENTA.montoOtroMedioPago
        // );
        let monEFEC = definicion_CTX_NOTA_VENTA.montoEnEfectivo;
        let monOTR = definicion_CTX_NOTA_VENTA.montoOtroMedioPago;
        // console.log('monEFEC', monEFEC);
        // console.log('monOTR', monOTR);

        if (monEFEC === undefined || monEFEC.toString().trim() === '' || monEFEC === null || monEFEC.toString() === 'NaN') {
          monEFEC = 0;
        } else {
          monEFEC = parseFloat(definicion_CTX_NOTA_VENTA.montoEnEfectivo);
        }
        // if (!Number.parseFloat(monEFEC.toString().trim())) {
        if (monEFEC === 0) {
          //
        } else {
          if (!Number.isFinite(monEFEC) && isNaN(monEFEC)) {
            alert('🎃Verifique el monto en efectivo: ' + monEFEC);
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        }

        if (monOTR === undefined || monOTR.toString().trim() === '' || monOTR === null || monOTR.toString() === 'NaN') {
          // console.log('monOTR 0');

          monOTR = 0;
        } else {
          // console.log('monOTR 1');

          monOTR = parseFloat(definicion_CTX_NOTA_VENTA.montoOtroMedioPago);
        }
        // console.log('monOTR 000000000000000000000', monOTR);
        // if (!Number.parseFloat(monOTR.toString().trim())) {
        if (monEFEC === 0) {
          //
        } else {
          if (!Number.isFinite(monOTR) && isNaN(monOTR)) {
            // if () {
            // console.log(monOTR);
            alert('Verifique el monto de otro medio de pago.');
            document.getElementById('inputMontoOtroMedioPago')?.focus();
            return;
          }
        }

        let monCUOTOT = definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito;
        if (monCUOTOT === undefined || monCUOTOT === '' || monCUOTOT === null) {
          monCUOTOT = 0;
        } else {
          monCUOTOT = parseFloat(definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito);
        }

        montoCONTADO_DOS_PARTES.value = monEFEC + monOTR + monCUOTOT;

        if (definicion_CTX_NOTA_VENTA.enDolares) {
          const TOT = definicion_CTX_NOTA_VENTA.totalUSD.$numberDecimal
            ? parseFloat(definicion_CTX_NOTA_VENTA.totalUSD.$numberDecimal)
            : parseFloat(definicion_CTX_NOTA_VENTA.totalUSD);
          if (montoCONTADO_DOS_PARTES.value !== TOT) {
            // console.log('USD monto - total', montoCONTADO_DOS_PARTES.value, TOT);
            alert('La suma de las CUOTAS del CRÉDITO no coincide con el TOTAL.');
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        } else {
          const TOT = definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal
            ? parseFloat(definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal)
            : parseFloat(definicion_CTX_NOTA_VENTA.totalPEN);
          if (montoCONTADO_DOS_PARTES.value !== TOT) {
            // console.log('PEN monto - total', montoCONTADO_DOS_PARTES.value, TOT);
            alert('La suma de las CUOTAS del CRÉDITO no coincide con el TOTAL.');
            document.getElementById('inputMontoEnEfectivo')?.focus();
            return;
          }
        }
      } else {
        let monCUOTOT = definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito;
        if (monCUOTOT === undefined || monCUOTOT === '' || monCUOTOT === 0) {
          monCUOTOT = 0;
        } else {
          monCUOTOT = parseFloat(definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito);
        }
        const TOT = definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal
          ? parseFloat(definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal)
          : parseFloat(definicion_CTX_NOTA_VENTA.totalPEN);

        if (monCUOTOT !== redondeo6Decimales(TOT)) {
          // console.log('PEN monCUOTOT - TOT', monCUOTOT, TOT);
          alert('La suma de las CUOTAS del CRÉDITO no coincide con el TOTAL.');
          document.getElementById('inputMontoEnEfectivo')?.focus();
          return;
        }
      }
    }

    //A  NC  -  ND
    // if (definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '07' || definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '08') {
    //   if (definicion_CTX_NOTA_VENTA.referenciaCodigo === '' || definicion_CTX_NOTA_VENTA.referenciaDescripcion === '') {
    //     if (definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '07') {
    //       alert('Seleccione el motivo de la N. de Crédito');
    //       document.getElementById('select_Tipo_Nota_Credito')?.focus();
    //       return;
    //     }
    //     if (definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '08') {
    //       alert('Seleccione el motivo de la N. de Débito');
    //       document.getElementById('select_Tipo_Nota_Debito')?.focus();
    //       return;
    //     }
    //   }
    //   if (definicion_CTX_NOTA_VENTA.referenciaFecha === '') {
    //     alert('Ingrese la fecha de referencia de NC/ND');
    //     document.getElementById('in_VENTA_NC_ND_Fecha')?.focus();
    //     return;
    //   }
    //   if (definicion_CTX_NOTA_VENTA.referenciaTipo === '') {
    //     alert('Ingrese el tipo del documento referenciado');
    //     document.getElementById('select_VENTA_NC_ND_TCP')?.focus();
    //     return;
    //   }
    //   if (definicion_CTX_NOTA_VENTA.referenciaSerie === '') {
    //     alert('Ingrese la serie del documento referenciado');
    //     document.getElementById('in_VENTA_NC_ND_Serie')?.focus();
    //     return;
    //   }
    //   if (definicion_CTX_NOTA_VENTA.referenciaNumero.toString() === '' || definicion_CTX_NOTA_VENTA.referenciaNumero.toString() === 'NaN') {
    //     alert('Ingrese el número valido del documento referenciado');
    //     document.getElementById('in_VENTA_NC_ND_Numero')?.focus();
    //     return;
    //   }
    //   //SOLO NOTAs DE CREDITOS
    //   if (definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago === '07') {
    //     //****************************************** */
    //     //***************SOLES******************** */
    //     definicion_CTX_NOTA_VENTA.baseImponiblePEN = definicion_CTX_NOTA_VENTA.baseImponiblePEN.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.baseImponiblePEN.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.baseImponiblePEN) * -1;
    //     definicion_CTX_NOTA_VENTA.igvPEN = definicion_CTX_NOTA_VENTA.igvPEN.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.igvPEN.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.igvPEN) * -1;
    //     definicion_CTX_NOTA_VENTA.exoneradoPEN = definicion_CTX_NOTA_VENTA.exoneradoPEN.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.exoneradoPEN.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.exoneradoPEN) * -1;
    //     definicion_CTX_NOTA_VENTA.inafectoPEN = definicion_CTX_NOTA_VENTA.inafectoPEN.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.inafectoPEN.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.inafectoPEN) * -1;
    //     definicion_CTX_NOTA_VENTA.iscPEN = definicion_CTX_NOTA_VENTA.iscPEN.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.iscPEN.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.iscPEN) * -1;
    //     definicion_CTX_NOTA_VENTA.exportPEN = definicion_CTX_NOTA_VENTA.exportPEN.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.exportPEN.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.exportPEN) * -1;
    //     definicion_CTX_NOTA_VENTA.otrosPEN = definicion_CTX_NOTA_VENTA.otrosPEN.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.otrosPEN.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.otrosPEN) * -1;
    //     definicion_CTX_NOTA_VENTA.totalPEN = definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.totalPEN) * -1;
    //     //****************************************** */
    //     //***************DOLARES******************** */
    //     definicion_CTX_NOTA_VENTA.baseImponibleUSD = definicion_CTX_NOTA_VENTA.baseImponibleUSD.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.baseImponibleUSD.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.baseImponibleUSD) * -1;
    //     definicion_CTX_NOTA_VENTA.igvUSD = definicion_CTX_NOTA_VENTA.igvUSD.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.igvUSD.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.igvUSD) * -1;
    //     definicion_CTX_NOTA_VENTA.exoneradoUSD = definicion_CTX_NOTA_VENTA.exoneradoUSD.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.exoneradoUSD.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.exoneradoUSD) * -1;
    //     definicion_CTX_NOTA_VENTA.inafectoUSD = definicion_CTX_NOTA_VENTA.inafectoUSD.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.inafectoUSD.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.inafectoUSD) * -1;
    //     definicion_CTX_NOTA_VENTA.iscUSD = definicion_CTX_NOTA_VENTA.iscUSD.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.iscUSD.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.iscUSD) * -1;
    //     definicion_CTX_NOTA_VENTA.exportUSD = definicion_CTX_NOTA_VENTA.exportUSD.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.exportUSD.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.exportUSD) * -1;
    //     definicion_CTX_NOTA_VENTA.otrosUSD = definicion_CTX_NOTA_VENTA.otrosUSD.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.otrosUSD.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.otrosUSD) * -1;
    //     definicion_CTX_NOTA_VENTA.totalUSD = definicion_CTX_NOTA_VENTA.totalUSD.$numberDecimal
    //       ? Math.abs(definicion_CTX_NOTA_VENTA.totalUSD.$numberDecimal) * -1
    //       : Math.abs(definicion_CTX_NOTA_VENTA.totalUSD) * -1;
    //   }
    // } else {
    //   definicion_CTX_NOTA_VENTA.referenciaCodigo = ''; //Codigo del motivo
    //   definicion_CTX_NOTA_VENTA.referenciaDescripcion = ''; //Descripción del motivo
    //   definicion_CTX_NOTA_VENTA.referenciaFecha = '';
    //   definicion_CTX_NOTA_VENTA.referenciaTipo = '';
    //   definicion_CTX_NOTA_VENTA.referenciaSerie = '';
    //   definicion_CTX_NOTA_VENTA.referenciaNumero = 0;
    // }
    //ACTUALIZAR EMAIL ???
    // if (definicion_CTX_NOTA_VENTA.email !== '') {
    //   if (emailOrigen.value !== definicion_CTX_NOTA_VENTA.email) {
    //     definicion_CTX_NOTA_VENTA.actualizarEmailCliente = true;
    //   }
    // }
    //ACTUALIZAR TELEFONO ???
    // if (definicion_CTX_NOTA_VENTA.telefono !== '') {
    //   if (telefonoOrigen.value !== definicion_CTX_NOTA_VENTA.telefono) {
    //     definicion_CTX_NOTA_VENTA.actualizarEmailCliente = true;
    //   }
    // }
    //.......ITEMS .......
    if (definicion_CTX_NOTA_VENTA.itemsNotaVenta.length === 0) {
      alert('Ingrese los ítems para la nota de venta.');
      document.getElementById('btnVerAlmacen')?.focus();
      return;
    }
    //CONTABIIZAR
    if (definicion_CTX_NOTA_VENTA.contabilizarOperaciones) {
      let total12: number = 0;
      let impuesto40: number = 0;
      let producto70: number = 0;
      definicion_CTX_NOTA_VENTA.asientoContable = [];

      for (let index = 0; index < definicion_CTX_NOTA_VENTA.itemsNotaVenta.length; index++) {
        const merca = definicion_CTX_NOTA_VENTA.itemsNotaVenta[index];
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

          //construyendo el asiento
          definicion_CTX_NOTA_VENTA.asientoContable.push({
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
          definicion_CTX_NOTA_VENTA.asientoContable.unshift({
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
        definicion_CTX_NOTA_VENTA.asientoContable.unshift({
          idAuxiliar: parseInt(elIdAuxiliar()),
          item: 0,
          codigo: TOTAL[0].codigo,
          descripcion: TOTAL[0].descripcion,
          tipo: true,
          importe: total12,
        });
      }

      //console.log('total12 !== definicion_CTX_NOTA_VENTA.totalPEN', total12, definicion_CTX_NOTA_VENTA.totalPEN, impuesto40, producto70);
      //VACIAR ASIENTO CONTABLE si no hay PARTIDA DOBLE
      if (total12 !== definicion_CTX_NOTA_VENTA.totalPEN) {
        definicion_CTX_NOTA_VENTA.asientoContable = [];
        //insertando IMPUESTO
        definicion_CTX_NOTA_VENTA.asientoContable.unshift({
          idAuxiliar: parseInt(elIdAuxiliar()),
          item: 0,
          codigo: IMPUESTO[0].codigo,
          descripcion: IMPUESTO[0].descripcion,
          tipo: false,
          importe: 0,
        });
        //insertando TOTAL
        definicion_CTX_NOTA_VENTA.asientoContable.unshift({
          idAuxiliar: parseInt(elIdAuxiliar()),
          item: 0,
          codigo: TOTAL[0].codigo,
          descripcion: TOTAL[0].descripcion,
          tipo: true,
          importe: -1,
        });
      } else {
        definicion_CTX_NOTA_VENTA.totalDebePEN = total12;
        definicion_CTX_NOTA_VENTA.totalHaberPEN = total12;
      }
    }

    ctx_index_nota_venta.mostrarSpinner = true;
    //FECHA HORA LOCAL
    // const ffffDate: any = new Date(definicion_CTX_NOTA_VENTA.fecha);
    // //console.log('🧧🧧🧧🧧', definicion_CTX_NOTA_VENTA.fecha, ffffDate);
    // //console.log('🧧🧧🧧🧧', ffffDate);

    const fechaLocal =
      definicion_CTX_NOTA_VENTA.fecha.substring(8, 10) +
      '-' +
      definicion_CTX_NOTA_VENTA.fecha.substring(5, 7) +
      '-' +
      definicion_CTX_NOTA_VENTA.fecha.substring(0, 4);

    const hhhhDate = new Date();
    const horaLocal =
      cerosALaIzquierda(hhhhDate.getHours(), 2) + ':' + cerosALaIzquierda(hhhhDate.getMinutes(), 2) + ':' + cerosALaIzquierda(hhhhDate.getSeconds(), 2);

    //
    const notaVentaGRABADA = await inNotaVenta({
      idLibroDiario: parametrosGlobales.idLibroDiario,

      idGrupoEmpresarial: definicion_CTX_NOTA_VENTA.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_NOTA_VENTA.idEmpresa,
      idAlmacen: definicion_CTX_NOTA_VENTA.idAlmacen,
      idSucursal: definicion_CTX_NOTA_VENTA.idSucursal,
      sucursal: definicion_CTX_NOTA_VENTA.sucursal,
      sucursalDireccion: definicion_CTX_NOTA_VENTA.sucursalDireccion,
      idPeriodo: definicion_CTX_NOTA_VENTA.idPeriodo,
      periodo: definicion_CTX_NOTA_VENTA.periodo,

      ruc: definicion_CTX_NOTA_VENTA.ruc,
      empresa: definicion_CTX_NOTA_VENTA.empresa,
      direccion: definicion_CTX_NOTA_VENTA.direccion,
      departamento: definicion_CTX_NOTA_VENTA.departamento,
      provincia: definicion_CTX_NOTA_VENTA.provincia,
      distrito: definicion_CTX_NOTA_VENTA.distrito,
      ubigeo: definicion_CTX_NOTA_VENTA.ubigeo,

      // codigoTipoOperacion: definicion_CTX_NOTA_VENTA.codigoTipoOperacion,
      // tipoOperacion: definicion_CTX_NOTA_VENTA.tipoOperacion,
      idSerieNotaSalida: definicion_CTX_NOTA_VENTA.idSerieNotaSalida,
      serieNotaSalida: definicion_CTX_NOTA_VENTA.serieNotaSalida,
      // codigoTipoComprobantePago: definicion_CTX_NOTA_VENTA.codigoTipoComprobantePago,
      // tipoComprobantePago: definicion_CTX_NOTA_VENTA.tipoComprobantePago,
      idSerieNotaVenta: definicion_CTX_NOTA_VENTA.idSerieNotaVenta,
      serie: definicion_CTX_NOTA_VENTA.serie,
      // numero: definicion_CTX_NOTA_VENTA.numero,
      fecha: definicion_CTX_NOTA_VENTA.fecha, //YYYY-MM-DD
      fechaLocal: fechaLocal, //DD-MM-YYYY
      horaLocal: horaLocal,

      clienteVentasVarias: definicion_CTX_NOTA_VENTA.clienteVentasVarias,
      // idCliente: definicion_CTX_NOTA_VENTA.idCliente,
      // codigoTipoDocumentoIdentidad: definicion_CTX_NOTA_VENTA.codigoTipoDocumentoIdentidad,
      // tipoDocumentoIdentidad: definicion_CTX_NOTA_VENTA.tipoDocumentoIdentidad,
      // numeroIdentidad: definicion_CTX_NOTA_VENTA.numeroIdentidad,
      // razonSocialNombre: definicion_CTX_NOTA_VENTA.razonSocialNombre,
      // email: definicion_CTX_NOTA_VENTA.email,
      // telefono: definicion_CTX_NOTA_VENTA.telefono,
      // actualizarEmailCliente: definicion_CTX_NOTA_VENTA.actualizarEmailCliente,

      igv: definicion_CTX_NOTA_VENTA.igv,
      moneda: definicion_CTX_NOTA_VENTA.moneda,
      tipoCambio: definicion_CTX_NOTA_VENTA.tipoCambio,

      vendedor: definicion_CTX_NOTA_VENTA.vendedor,
      metodoPago: definicion_CTX_NOTA_VENTA.metodoPago,

      todoEnEfectivo: definicion_CTX_NOTA_VENTA.todoEnEfectivo,
      unaParteEnEfectivo: definicion_CTX_NOTA_VENTA.unaParteEnEfectivo,
      montoEnEfectivo: definicion_CTX_NOTA_VENTA.montoEnEfectivo.trim() === '' ? 0 : definicion_CTX_NOTA_VENTA.montoEnEfectivo,
      otroMedioPago: definicion_CTX_NOTA_VENTA.otroMedioPago,
      montoOtroMedioPago: definicion_CTX_NOTA_VENTA.montoOtroMedioPago.trim() === '' ? 0 : definicion_CTX_NOTA_VENTA.montoOtroMedioPago,

      cuotasPago: definicion_CTX_NOTA_VENTA.cuotasCredito,
      importeTotalCuotasCredito: definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito,

      idCotizacion: definicion_CTX_NOTA_VENTA.idCotizacion,
      serieCotizacion: definicion_CTX_NOTA_VENTA.serieCotizacion,
      numeroCotizacion: definicion_CTX_NOTA_VENTA.numeroCotizacion,

      idOrdenServicio: definicion_CTX_NOTA_VENTA.idOrdenServicio,
      serieOrdenServicio: definicion_CTX_NOTA_VENTA.serieOrdenServicio,
      numeroOrdenServicio: definicion_CTX_NOTA_VENTA.numeroOrdenServicio,

      verificarObservacionVenta: definicion_CTX_NOTA_VENTA.verificarObservacionVenta,
      observacion: definicion_CTX_NOTA_VENTA.observacion.toUpperCase(),

      idMotivoEgresoAlmacen: definicion_CTX_NOTA_VENTA.idMotivoEgresoAlmacen,
      // motivoEgresoAlmacen: 'NOTA DE VENTA',
      existeOtros: definicion_CTX_NOTA_VENTA.itemsNotaVenta.find((element: any) => element.tipo === 'OTRO') ? true : false,
      // impresionTipoFacturaBoleta: definicion_CTX_NOTA_VENTA.impresionTipoFacturaBoleta,
      itemsNotaVenta: definicion_CTX_NOTA_VENTA.itemsNotaVenta,

      baseImponiblePEN: definicion_CTX_NOTA_VENTA.baseImponiblePEN,
      exoneradoPEN: definicion_CTX_NOTA_VENTA.exoneradoPEN,
      inafectoPEN: definicion_CTX_NOTA_VENTA.inafectoPEN,
      iscPEN: definicion_CTX_NOTA_VENTA.iscPEN,
      exportPEN: definicion_CTX_NOTA_VENTA.exportPEN,
      otrosPEN: definicion_CTX_NOTA_VENTA.otrosPEN,
      igvPEN: definicion_CTX_NOTA_VENTA.igvPEN,
      totalPEN: definicion_CTX_NOTA_VENTA.totalPEN,

      baseImponibleUSD: definicion_CTX_NOTA_VENTA.baseImponibleUSD,
      exoneradoUSD: definicion_CTX_NOTA_VENTA.exoneradoUSD,
      inafectoUSD: definicion_CTX_NOTA_VENTA.inafectoUSD,
      iscUSD: definicion_CTX_NOTA_VENTA.iscUSD,
      exportUSD: definicion_CTX_NOTA_VENTA.exportUSD,
      otrosUSD: definicion_CTX_NOTA_VENTA.otrosUSD,
      igvUSD: definicion_CTX_NOTA_VENTA.igvUSD,
      totalUSD: definicion_CTX_NOTA_VENTA.totalUSD,

      literal: definicion_CTX_NOTA_VENTA.lite,

      efectivoIngresado: definicion_CTX_NOTA_VENTA.efectivoIngresado,
      vuelto: definicion_CTX_NOTA_VENTA.vuelto,

      clienteSobrenombreChapa: definicion_CTX_NOTA_VENTA.clienteSobrenombreChapa,
      placa: definicion_CTX_NOTA_VENTA.placa,
      kilometraje: definicion_CTX_NOTA_VENTA.kilometraje,
      checkACuenta: definicion_CTX_NOTA_VENTA.checkACuenta,
      aCuenta: definicion_CTX_NOTA_VENTA.aCuenta,

      // referenciaCodigo: definicion_CTX_NOTA_VENTA.referenciaCodigo,
      // referenciaDescripcion: definicion_CTX_NOTA_VENTA.referenciaDescripcion,
      // referenciaFecha: definicion_CTX_NOTA_VENTA.referenciaFecha,
      // referenciaTipo: definicion_CTX_NOTA_VENTA.referenciaTipo,
      // referenciaSerie: definicion_CTX_NOTA_VENTA.referenciaSerie,
      // referenciaNumero: definicion_CTX_NOTA_VENTA.referenciaNumero,

      // facturacionElectronica: definicion_CTX_NOTA_VENTA.facturacionElectronica,
      // facturacionElectronicaAutomatica: definicion_CTX_NOTA_VENTA.facturacionElectronicaAutomatica,
      // facturaJSON: parametrosGlobales.facturaJSON,
      // facturaXML: parametrosGlobales.facturaXML,

      contabilizarOperaciones: definicion_CTX_NOTA_VENTA.contabilizarOperaciones,
      asientoContable: definicion_CTX_NOTA_VENTA.asientoContable,
      totalDebePEN: definicion_CTX_NOTA_VENTA.totalDebePEN,
      totalHaberPEN: definicion_CTX_NOTA_VENTA.totalHaberPEN,
      totalDebeUSD: definicion_CTX_NOTA_VENTA.totalDebeUSD,
      totalHaberUSD: definicion_CTX_NOTA_VENTA.totalHaberUSD,

      ventaConDetraccion: parametrosGlobales.ventaConDetraccion,
      // detraccion: definicion_CTX_NOTA_VENTA.detraccion,
      // detraccionCodigo: definicion_CTX_NOTA_VENTA.detraccionCodigo,
      // detraccionDescripcion: definicion_CTX_NOTA_VENTA.detraccionDescripcion,
      // detraccionMedioPagoCodigo: definicion_CTX_NOTA_VENTA.detraccionMedioPagoCodigo,
      // detraccionMedioPagoDescripcion: definicion_CTX_NOTA_VENTA.detraccionMedioPagoDescripcion,
      // detraccionNumCuentaBancoNacion: definicion_CTX_NOTA_VENTA.detraccionNumCuentaBancoNacion,
      // detraccionPorcentaje: definicion_CTX_NOTA_VENTA.detraccionPorcentaje,
      // detraccionMontoPEN: definicion_CTX_NOTA_VENTA.detraccionMontoPEN,

      usuario: parametrosGlobales.usuario,
    });

    if (notaVentaGRABADA.status === 400) {
      alert('🛑 Falla al registrar la nota de venta. ' + notaVentaGRABADA.message);
      ctx_index_nota_venta.mostrarSpinner = false;
      return;
    }

    pasoProcesoGrabacion.value = true;
    if (notaVentaGRABADA) {
      grabo.value = true;

      // definicion_CTX_NOTA_VENTA.fecha = hoy();

      definicion_CTX_NOTA_VENTA.clienteVentasVarias = false;
      // definicion_CTX_NOTA_VENTA.idCliente = '';
      // definicion_CTX_NOTA_VENTA.codigoTipoDocumentoIdentidad = '6';
      // definicion_CTX_NOTA_VENTA.tipoDocumentoIdentidad = 'RUC';
      // definicion_CTX_NOTA_VENTA.numeroIdentidad = '';
      // definicion_CTX_NOTA_VENTA.razonSocialNombre = '';
      // definicion_CTX_NOTA_VENTA.email = '';
      // definicion_CTX_NOTA_VENTA.telefono = '';

      definicion_CTX_NOTA_VENTA.enDolares = false;
      definicion_CTX_NOTA_VENTA.moneda = 'PEN';
      definicion_CTX_NOTA_VENTA.tipoCambio = 0;

      definicion_CTX_NOTA_VENTA.vendedor = '';
      definicion_CTX_NOTA_VENTA.metodoPago = 'CONTADO';

      definicion_CTX_NOTA_VENTA.todoEnEfectivo = true;
      definicion_CTX_NOTA_VENTA.unaParteEnEfectivo = false;
      definicion_CTX_NOTA_VENTA.montoEnEfectivo = '';
      definicion_CTX_NOTA_VENTA.otroMedioPago = 'TRANSF. DE FONDOS - YAPE';
      definicion_CTX_NOTA_VENTA.montoOtroMedioPago = '';

      definicion_CTX_NOTA_VENTA.verCuotasCredito = false;
      definicion_CTX_NOTA_VENTA.cuotasCredito = [];
      definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito = 0;

      definicion_CTX_NOTA_VENTA.idCotizacion = '';
      definicion_CTX_NOTA_VENTA.serieCotizacion = '';
      definicion_CTX_NOTA_VENTA.numeroCotizacion = 0;

      definicion_CTX_NOTA_VENTA.idOrdenServicio = '';
      definicion_CTX_NOTA_VENTA.serieOrdenServicio = '';
      definicion_CTX_NOTA_VENTA.numeroOrdenServicio = 0;

      definicion_CTX_NOTA_VENTA.observacion = '';

      definicion_CTX_NOTA_VENTA.itemsNotaVenta = [];

      definicion_CTX_NOTA_VENTA.baseImponiblePEN = 0;
      definicion_CTX_NOTA_VENTA.igvPEN = 0;
      definicion_CTX_NOTA_VENTA.exoneradoPEN = 0;
      definicion_CTX_NOTA_VENTA.inafectoPEN = 0;
      definicion_CTX_NOTA_VENTA.iscPEN = 0;
      definicion_CTX_NOTA_VENTA.exportPEN = 0;
      definicion_CTX_NOTA_VENTA.otrosPEN = 0;
      definicion_CTX_NOTA_VENTA.totalPEN = 0;

      definicion_CTX_NOTA_VENTA.baseImponibleUSD = 0;
      definicion_CTX_NOTA_VENTA.igvUSD = 0;
      definicion_CTX_NOTA_VENTA.exoneradoUSD = 0;
      definicion_CTX_NOTA_VENTA.inafectoUSD = 0;
      definicion_CTX_NOTA_VENTA.iscUSD = 0;
      definicion_CTX_NOTA_VENTA.exportUSD = 0;
      definicion_CTX_NOTA_VENTA.otrosUSD = 0;
      definicion_CTX_NOTA_VENTA.totalUSD = 0;

      definicion_CTX_NOTA_VENTA.lite = '';

      definicion_CTX_NOTA_VENTA.efectivoIngresado = 0;
      definicion_CTX_NOTA_VENTA.vuelto = 0;

      definicion_CTX_NOTA_VENTA.clienteSobrenombreChapa = '';
      definicion_CTX_NOTA_VENTA.placa = '';
      definicion_CTX_NOTA_VENTA.kilometraje = '';
      definicion_CTX_NOTA_VENTA.checkACuenta = false;
      definicion_CTX_NOTA_VENTA.aCuenta = '';

      // definicion_CTX_NOTA_VENTA.referenciaCodigo = '';
      // definicion_CTX_NOTA_VENTA.referenciaDescripcion = '';
      // definicion_CTX_NOTA_VENTA.referenciaFecha = '';
      // definicion_CTX_NOTA_VENTA.referenciaTipo = '';
      // definicion_CTX_NOTA_VENTA.referenciaSerie = '';
      // definicion_CTX_NOTA_VENTA.referenciaNumero = 0;

      // definicion_CTX_NOTA_VENTA.facturacionElectronica = parametrosGlobales.facturacionElectronica;
      // definicion_CTX_NOTA_VENTA.facturacionElectronicaAutomatica = parametrosGlobales.facturacionElectronicaAutomatica;
      definicion_CTX_NOTA_VENTA.verificarObservacionVenta = parametrosGlobales.verificarObservacionVenta;

      definicion_CTX_NOTA_VENTA.contabilizarOperaciones = parametrosGlobales.contabilizarOperaciones;
      definicion_CTX_NOTA_VENTA.asientoContable = [];
      definicion_CTX_NOTA_VENTA.totalDebePEN = 0;
      definicion_CTX_NOTA_VENTA.totalHaberPEN = 0;
      definicion_CTX_NOTA_VENTA.totalDebeUSD = 0;
      definicion_CTX_NOTA_VENTA.totalHaberUSD = 0;

      // definicion_CTX_NOTA_VENTA.detraccion = false;
      // definicion_CTX_NOTA_VENTA.detraccionCodigo = '';
      // definicion_CTX_NOTA_VENTA.detraccionDescripcion = '';
      // definicion_CTX_NOTA_VENTA.detraccionMedioPagoCodigo = '';
      // definicion_CTX_NOTA_VENTA.detraccionMedioPagoDescripcion = '';
      // definicion_CTX_NOTA_VENTA.detraccionNumCuentaBancoNacion = '';
      // definicion_CTX_NOTA_VENTA.detraccionPorcentaje = 0;
      // definicion_CTX_NOTA_VENTA.detraccionMontoPEN = 0;
    }

    definicion_CTX_ADD_NOTA_VENTA.desabilitarAlmacenServicios = false;
    ctx_index_nota_venta.mostrarSpinner = false;
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
        width: 'clamp(320px, 100%, 1000px)',
        // width: 'auto',
        // background: `${definicion_CTX_NOTA_VENTA.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : '#eee'}`,
        border: '3px solid purple',
        padding: '0',
      }}
    >
      {/* BOTONES DEL MARCO    */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          // border: '1px solid blue',
          background: 'linear-gradient(to bottom, #901090 0%, #eee 100%)',
          width: 'auto',
        }}
      >
        <ImgButton
          title="ver parametros globales - definicion_CTX_NOTA_VENTA"
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          onClick={$(() => {
            console.log('parametrosGlobales', parametrosGlobales);
            console.log('definicion_CTX_NOTA_VENTA', definicion_CTX_NOTA_VENTA);
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            console.log('props.nvSelecci', props.nvSelecci);
            console.log('definicion_CTX_NOTA_VENTA', definicion_CTX_NOTA_VENTA);
          })}
        /> */}

        <ImgButton
          title="Cerrar el formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            if (definicion_CTX_NOTA_VENTA._id === '') {
              if (definicion_CTX_NOTA_VENTA.itemsNotaVenta.length > 0) {
                if (confirm('Hay mercaderías ingresadas, ¿Desea cerrar el formulario?')) {
                  ctx_index_nota_venta.grabo_NotaVenta = grabo.value;
                  ctx_index_nota_venta.mostrarPanelNotaVenta = false;
                }
                //  else {
                //   ctx_index_in_almacen.mostrarPanelNewInAlmacen = true;
                // }
              } else {
                ctx_index_nota_venta.grabo_NotaVenta = grabo.value;
                ctx_index_nota_venta.mostrarPanelNotaVenta = false;
              }
            } else {
              ctx_index_nota_venta.mostrarPanelNotaVenta = false;
            }
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.9rem', marginLeft: '2px' }}>
        Nota de venta - {parametrosGlobales.sucursal} - {parametrosGlobales.RazonSocial}
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
                  value={definicion_CTX_NOTA_VENTA.periodo}
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              {/* cliente VENTAS VARIAS*/}

              <div>
                <input
                  title="Cliente Ventas Varias"
                  id="chk_clienteVentasVarias_VENTA"
                  type="checkbox"
                  style={{ margin: '2px' }}
                  disabled
                  checked
                  // checked={definicion_CTX_NOTA_VENTA.clienteVentasVarias}
                  onChange$={(e) => {
                    definicion_CTX_NOTA_VENTA.clienteVentasVarias = (e.target as HTMLInputElement).checked;
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
                  Cliente Ventas Varias
                </label>
              </div>
              {parametrosGlobales.almacenActivo ? (
                <label style={{ textAlign: 'right', color: 'green' }}>ALMACÉN ACTIVO</label>
              ) : (
                <strong style={{ textAlign: 'right', color: 'red' }}>ALMACÉN INACTIVO</strong>
              )}
            </div>

            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE NOTA VENTA */}
          <div>
            <div class="linea_1_1111">
              {/* fecha    */}
              <input
                id="in_Fecha_Para_NotaVenta"
                type="date"
                style={{ width: '100%' }}
                // disabled
                min={menosXdiasHoy(3)}
                max={hoy()}
                // min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                // max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                value={definicion_CTX_NOTA_VENTA.fecha}
                onChange$={(e) => {
                  definicion_CTX_NOTA_VENTA.fecha = (e.target as HTMLInputElement).value;
                  //validar PERIODO
                  const anio = definicion_CTX_NOTA_VENTA.fecha;
                  const mes = definicion_CTX_NOTA_VENTA.fecha;
                  // //console.log('la fechitaaaa', anio + mes);
                  const mas = anio + mes;
                  const PPP = losPeriodosCargados.value;
                  // //console.log('mas', mas);
                  // //console.log('PPP', PPP);
                  const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(mas));
                  // //console.log('elPeriodo', elPeriodo);
                  definicion_CTX_NOTA_VENTA.idPeriodo = elPeriodo._id;
                  definicion_CTX_NOTA_VENTA.periodo = elPeriodo.periodo;
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('selectSerieVenta') as HTMLSelectElement).focus();
                  }
                }}
              />
              {/* Serie  */}
              {definicion_CTX_NOTA_VENTA._id === '' ? (
                <select
                  id="selectSerieVenta"
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const elSelect = e.target as HTMLSelectElement;
                    const elOption = elSelect[idx];

                    //console.log('❤❤❤ dataSerie.value ', dataSerie.value);
                    // const SSS: any = dataSerie.value;
                    // const der = SSS.find((ew: any) => ew._id === elOption.id);

                    //console.log('❤❤❤ der ', der);
                    // definicion_CTX_NOTA_VENTA.codigoTipoOperacion = der.codigoTipoOperacionXDefault;
                    // definicion_CTX_NOTA_VENTA.tipoOperacion = der.tipoOperacionXDefault;
                    // definicion_CTX_NOTA_VENTA.impresionTipoFacturaBoleta = der.impresionTipoFacturaBoleta;

                    definicion_CTX_NOTA_VENTA.idSerieNotaVenta = elOption.id;
                    definicion_CTX_NOTA_VENTA.serie = (e.target as HTMLSelectElement).value;
                    // document.getElementById('in_Fecha')?.focus();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('inputIGV') as HTMLInputElement).focus();
                    }
                  }}
                >
                  <option value="">-- Seleccione una serie --</option>
                  {dataSerie.value.map((ser: any) => {
                    return (
                      <option id={ser._id} value={ser.serie} selected={definicion_CTX_NOTA_VENTA.serie === ser.serie}>
                        {ser.serie}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <input
                  disabled
                  value={definicion_CTX_NOTA_VENTA.serie + `-` + cerosALaIzquierda(definicion_CTX_NOTA_VENTA.numero, 8)}
                  style={{ width: '100%' }}
                />
              )}
              {/* IGV */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* <strong style={{ fontSize: '0.9rem', fontWeight: '400', paddingLeft: '4px', paddingRight: '24px' }}>IGV</strong> */}
                {/* style={{ paddingLeft: '4px', paddingRight: '12px' }} */}
                <label style={{ paddingRight: '4px' }}>IGV</label>
                <input
                  type="text"
                  id="inputIGV"
                  disabled
                  value={definicion_CTX_NOTA_VENTA.igv.$numberDecimal + ' %'}
                  style={{ width: '100%' }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).focus();
                    }
                  }}
                />
              </div>
              {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ display: 'flex', paddingRight: '4px' }}>
                  <input
                    type="checkbox"
                    id="chbx_TipoCambio_Para_Venta"
                    disabled
                    // onClick$={(e) => {
                    //   venta.enDolares = (e.target as HTMLInputElement).checked;
                    // }}
                    onClick$={(e) => {
                      if (definicion_CTX_NOTA_VENTA.fecha === '') {
                        alert('Ingrese la fecha para esta venta');
                        (e.target as HTMLInputElement).checked = false;
                        document.getElementById('in_Fecha_Para_Venta')?.focus();
                        return;
                      }
                      obtenerTipoCambio(e.target as HTMLInputElement);
                    }}
                  />
                  <label for="chbx_TipoCambio_Para_Venta" style={{ paddingTop: '2px' }}>
                    USD
                  </label>
                </div>

                <input id="inputTipoCambio" type="number" value={definicion_CTX_NOTA_VENTA.tipoCambio} disabled style={{ width: '100%' }} />
              </div>
            </div>

            <br />
          </div>

          {/* ----------------------------------------------------- */}
          {/* BOTONES */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', backgroundColor: '#74a6ab' }}>
              {/* //ver ALMACEN OUT */}
              <button
                id="btnVerAlmacen"
                hidden={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                disabled={definicion_CTX_ADD_NOTA_VENTA.desabilitarAlmacenServicios}
                onClick$={() => (definicion_CTX_ADD_NOTA_VENTA.mostrarPanelBuscarMercaderiaOUT = true)}
                style={{ cursor: 'pointer', height: '40px' }}
              >
                VER ALMACÉN
              </button>
              {definicion_CTX_ADD_NOTA_VENTA.mostrarPanelBuscarMercaderiaOUT && (
                <div class="modal">
                  <BuscarMercaderiaOUT
                    contexto="nota_venta"
                    esAlmacen={false}
                    porcentaje={definicion_CTX_NOTA_VENTA.igv.$numberDecimal ? definicion_CTX_NOTA_VENTA.igv.$numberDecimal : definicion_CTX_NOTA_VENTA.igv}
                  />
                </div>
              )}
              {/* //ver OTROS OUT */}
              {/* <button
                id="btn_Otros"
                hidden={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                disabled={definicion_CTX_ADD_NOTA_VENTA.desabilitarAlmacenServicios}
                onClick$={() => (definicion_CTX_ADD_NOTA_VENTA.mostrarPanelOtros = true)}
                style={{ cursor: 'pointer', height: '40px' }}
              >
                ADD OTROS
              </button>
              {definicion_CTX_ADD_NOTA_VENTA.mostrarPanelOtros && (
                <div class="modal">
                  <PanelOtros
                    contexto="nota_venta"
                    porcentaje={definicion_CTX_NOTA_VENTA.igv.$numberDecimal ? definicion_CTX_NOTA_VENTA.igv.$numberDecimal : definicion_CTX_NOTA_VENTA.igv}
                  />
                </div>
              )} */}
              {/* //ver SERVICIO */}
              {/* <button
                id="btnAddServicio"
                disabled={definicion_CTX_ADD_NOTA_VENTA.desabilitarAlmacenServicios}
                onClick$={() => (definicion_CTX_ADD_NOTA_VENTA.mostrarPanelBuscarServicio = true)}
                style={{ cursor: 'pointer' }}
              >
                Add servicio
              </button>
              {definicion_CTX_ADD_NOTA_VENTA.mostrarPanelBuscarServicio && (
                <div class="modal">
                  <BuscarServicio
                    contexto="new_venta"
                    porcentaje={definicion_CTX_NOTA_VENTA.igv.$numberDecimal ? definicion_CTX_NOTA_VENTA.igv.$numberDecimal : definicion_CTX_NOTA_VENTA.igv}
                  />
                </div>
              )} */}
              {/* //ver ADJUNTAR OS */}
              {/*  <button id="btnAdjuntarOS" onClick$={() => (definicion_CTX_ADD_NOTA_VENTA.mostrarAdjuntarOS = true)}>
                Adjuntar O.S.
              </button>
              {definicion_CTX_ADD_NOTA_VENTA.mostrarAdjuntarOS && <div class="modal"><AdjuntarOrdenServicio /> </div>}*/}
              {/* //ver ADJUNTAR COTIZACION */}
              {/*    <button
                id="btnAdjuntarCotizacion"
                onClick$={() => (definicion_CTX_ADD_NOTA_VENTA.mostrarAdjuntarCotizacion = true)}
                style={{ cursor: 'pointer' }}
              >
                Adjuntar cotización
              </button>
              {definicion_CTX_ADD_NOTA_VENTA.mostrarAdjuntarCotizacion && <div class="modal"><AdjuntarCotizacion /></div>} */}
            </div>
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* OTROS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr', gap: '4px' }}>
            <div>
              <input
                id="in_Cantidad_OTROS"
                type="number"
                name=""
                style={{ width: '100%' }}
                value={otro_ItemVenta.cantidad}
                onChange$={(e) => {
                  console.log('🎪 in_Cantidad_OTROS onChange e.key: ');
                  otro_ItemVenta.cantidad = parseFloat((e.target as HTMLInputElement).value);
                }}
                onKeyPress$={(e) => {
                  console.log('🎪 in_Cantidad_OTROS onKeyPress e.key: ', e.key);
                  if (e.key === 'Enter') {
                    document.getElementById('in_Descripcion_OTROS')?.focus();
                  }
                }}
                onKeyUp$={(e) => {
                  console.log('🎪 in_Cantidad_OTROS onKeyUp e.key: ', e.key);
                  if (e.key === 'ArrowRight') {
                    // console.log('🎄🎄🎄 ArrowRight');
                    document.getElementById('in_Descripcion_OTROS')?.focus();
                  }
                }}
                onFocus$={(e) => {
                  console.log('🎪 in_Cantidad_OTROS onFocus e.: ');
                  (e.target as HTMLInputElement).select();
                }}
              />
            </div>
            <div>
              <input
                id="in_Descripcion_OTROS"
                type="text"
                placeholder="Descripción"
                style={{ width: '100%' }}
                value={otro_ItemVenta.descripcion}
                onChange$={(e) => {
                  otro_ItemVenta.descripcion = (e.target as HTMLInputElement).value.toUpperCase();
                }}
                // onKeyPress$={(e) => {
                //   // console.log('👓👓👓 e.key: ', e.key);
                //   if (e.key === 'Enter') {
                //     document.getElementById('in_Precio_OTROS')?.focus();
                //   }
                //   // if (e.key === 'Left') {
                //   //   console.log('🔥🔥🔥 LEFT');

                //   //   document.getElementById('in_Cantidad_OTROS')?.focus();
                //   // }
                //   // if (e.key === 'Right') {
                //   //   console.log('🎄🎄🎄 Right');
                //   //   document.getElementById('in_Precio_OTROS')?.focus();
                //   // }
                // }}
                onKeyDown$={(e) => {
                  // console.log('🎄 in_Descripcion_OTROS onKeyDown e.key: ', e.key);
                  if (e.ctrlKey && e.key === 'ArrowLeft') {
                    // console.log('🎄🎄🎄 in_Descripcion_OTROS ArrowLeft');
                    document.getElementById('in_Cantidad_OTROS')?.focus();
                  }
                  if (e.ctrlKey && e.key === 'ArrowRight') {
                    // console.log('🎄🎄🎄 in_Descripcion_OTROS ArrowRight');
                    document.getElementById('in_Precio_OTROS')?.focus();
                  }
                }}
                onKeyUp$={(e) => {
                  // console.log('🎄 in_Descripcion_OTROS onKeyUp e.key: ', e.key);
                  if (e.key === 'Enter') {
                    if (otro_ItemVenta.descripcion.trim() !== '') {
                      document.getElementById('in_Precio_OTROS')?.focus();
                    }
                  }
                  // if (e.key === 'ArrowLeft') {
                  //   console.log('🔥🔥🔥 ArrowLeft');
                  //   document.getElementById('in_Cantidad_OTROS')?.focus();
                  // }
                }}
                // onFocus$={(e) => {
              />
            </div>
            <div>
              <input
                id="in_Precio_OTROS"
                type="number"
                name=""
                style={{ width: '100%' }}
                value={otro_ItemVenta.precio}
                onChange$={(e) => {
                  // console.log('🧶 in_Precio_OTROS onChange');
                  otro_ItemVenta.precio = parseFloat((e.target as HTMLInputElement).value);
                }}
                // onKeyPress$={(e) => {

                // }}
                onKeyUp$={(e) => {
                  // console.log('🧶 in_Precio_OTROS onKeyUp e.key: ', e.key);
                  if (e.key === 'ArrowLeft') {
                    // console.log('🔥🔥🔥 ArrowLeft');

                    document.getElementById('in_Descripcion_OTROS')?.focus();
                  }
                  if (e.key === 'Enter') {
                    console.log('🧶🧶 in_Precio_OTROS Enter', otro_ItemVenta.cantidad, otro_ItemVenta.descripcion, otro_ItemVenta.precio);

                    if (isNaN(otro_ItemVenta.cantidad) || typeof otro_ItemVenta.cantidad === 'undefined' || otro_ItemVenta.cantidad.toString().trim() === '') {
                      alert('Ingrese la cantidad del ítem');
                      document.getElementById('in_Cantidad_OTROS')?.focus();
                      return;
                    }
                    if (otro_ItemVenta.descripcion.trim() === '') {
                      alert('Ingrese la descripción del ítem');
                      document.getElementById('in_Descripcion_OTROS')?.focus();
                      return;
                    }
                    if (isNaN(otro_ItemVenta.precio) || typeof otro_ItemVenta.precio === 'undefined' || otro_ItemVenta.precio.toString().trim() === '') {
                      alert('Ingrese la precio del ítem');
                      document.getElementById('in_Precio_OTROS')?.focus();
                      return;
                    }
                    //ADD ITEM
                    const unicoAux = parseInt(elIdAuxiliar());

                    definicion_CTX_NOTA_VENTA.itemsNotaVenta.push({
                      idAuxiliar: unicoAux,
                      idMercaderia: null,
                      idEquivalencia: null,
                      idKardex: null,
                      item: 0,
                      tipo: 'OTRO',

                      noFacturar: false,

                      tipoImpuesto: 'IGV', //['1000', 'IGV', 'VAT'], // elTImp, // props.mercaOUTSelecci.tipoImpuesto[1],
                      tipoAfectacionDelImpuesto: '10', // mercaOUTLocali.tipoAfectacionDelImpuesto,
                      porcentaje: parseFloat(
                        definicion_CTX_NOTA_VENTA.igv.$numberDecimal ? definicion_CTX_NOTA_VENTA.igv.$numberDecimal : definicion_CTX_NOTA_VENTA.igv
                      ),

                      tipoPrecioVentaUnitario: '01', // tPVU,

                      codigo: '-',

                      descripcion: otro_ItemVenta.descripcion.trim(),
                      descripcionEquivalencia: otro_ItemVenta.descripcion.trim(),

                      cantidad: 1 * otro_ItemVenta.cantidad,
                      cantidadEquivalencia: otro_ItemVenta.cantidad,

                      cantidadSacada: 1 * otro_ItemVenta.cantidad,
                      cantidadSacadaEquivalencia: otro_ItemVenta.cantidad,

                      unidad: 'NIU',
                      unidadEquivalencia: 'NIU',

                      costoUnitarioPEN: otro_ItemVenta.precio,
                      costoUnitarioEquivalenciaPEN: otro_ItemVenta.precio,

                      porcentajeUtilidad: 0,

                      //precio = c + IGV
                      precioUnitarioPEN: otro_ItemVenta.precio, // precioEquivalencia.value,
                      //venta = k * precio
                      ventaPEN: otro_ItemVenta.cantidad * otro_ItemVenta.precio, //precioEquivalencia.value,

                      precioUnitarioUSD: 0,
                      ventaUSD: 0,

                      tipoEquivalencia: true,
                      factor: 0,
                      laEquivalencia: 0,

                      exonerado: false,
                      inafecto: false,
                      sujetoAPercepcion: false,
                      percepcion: 0,

                      codigoContableVenta: '',
                      descripcionContableVenta: '',
                      tipoContableVenta: true,
                    });
                    //RE-INICIANDO
                    // fijarMontos();
                    document.getElementById('in_Cantidad_OTROS')?.focus();
                    otro_ItemVenta.cantidad = 1;
                    otro_ItemVenta.descripcion = '';
                    otro_ItemVenta.precio = 0;
                  }
                }}
                onFocus$={(e) => {
                  // console.log('🧶 in_Precio_OTROS onFocus e.: ');

                  (e.target as HTMLInputElement).select();
                }}
                // onBlur$={(e) => {
              />
            </div>
          </div>
          <br />
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/*  tabla ITEMS - VENTA */}
          {
            <div>
              {definicion_CTX_NOTA_VENTA.itemsNotaVenta.length > 0 ? (
                <>
                  <div>
                    <label style={{ marginLeft: '2px', marginRight: '8px' }}>Leyenda:</label>
                    <label style={{ background: '#ff5aff', padding: '2px 4px', borderRadius: '4px' }}>No facturable</label>
                  </div>
                  <br />
                  <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Ítem</th>
                        <th style={{ display: 'none' }}>Código</th>
                        <th>Descripción</th>
                        <th>Ubigeo</th>
                        <th>Stock</th>
                        <th>Cantidad</th>
                        <th>Uni</th>
                        <th>Precio Uni</th>
                        <th>Venta</th>
                        <th hidden={verParametrosAdicionales_Items.value}>%</th>
                        <th hidden={verParametrosAdicionales_Items.value}>Imp</th>
                        <th hidden={verParametrosAdicionales_Items.value}>Afec</th>
                        <th>Acc</th>
                      </tr>
                    </thead>
                    <tbody>
                      {definicion_CTX_NOTA_VENTA.itemsNotaVenta.map((iTNotVen: any, index: number) => {
                        // console.log('🥽🥽🥽🧨');

                        const indexItemVenta = index + 1;
                        let t_bi = 0;
                        let t_igv = 0;
                        let t_exo = 0;
                        let t_ina = 0;
                        const t_isc = 0;
                        let t_export = 0;
                        let t_otros = 0;

                        //console.log('iTVen.tipoImpuesto[1]', iTVen.tipoImpuesto[1].toString());
                        //IGV, ISC, IVAP, exoneradas, exportación, gratuitas, inafecta, otrosTributos
                        //['1000', 'IGV', 'VAT']  ['1016', 'IVAP', 'VAT']  ['2000', 'ISC', 'EXC']  ['7152', 'ICBPER', 'OTH']  ['9995', 'EXP', 'FRE']
                        //['9996', 'GRA', 'FRE']  ['9997', 'EXO', 'VAT']  ['9998', 'INA', 'FRE']  ['9999', 'OTROS', 'OTH']

                        if (definicion_CTX_NOTA_VENTA.enDolares) {
                          // console.log('enDolares$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
                          if (iTNotVen.tipoImpuesto === 'IGV') {
                            const vv = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                            t_bi = redondeo6Decimales((vv * 100) / (100 + iTNotVen.porcentaje));
                            t_igv = redondeo6Decimales(vv - t_bi);
                          }
                          // if (iTVen.tipoImpuesto === 'ISC') {
                          // }
                          // if (iTVen.tipoImpuesto === 'IVAP') {
                          // }
                          if (iTNotVen.tipoImpuesto === 'EXO') {
                            t_exo = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                          if (iTNotVen.tipoImpuesto === 'EXP') {
                            t_export = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                          if (iTNotVen.tipoImpuesto === 'GRA') {
                            t_otros = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                          if (iTNotVen.tipoImpuesto === 'INA') {
                            t_ina = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
                          }
                          if (iTNotVen.tipoImpuesto === 'OTROS') {
                            t_otros = redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal ? iTNotVen.ventaUSD.$numberDecimal : iTNotVen.ventaUSD);
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
                          //     t_bi = redondeo2Decimales((vv * 100) / (100 + definicion_CTX_NOTA_VENTA.igv));
                          //     t_igv = redondeo2Decimales(vv - t_bi);
                          //   }
                          // }
                        } else {
                          // if (iTVen.tipoImpuesto === 'IGV') {
                          // console.log('PENPENPENPENPENPENPEmn', iTNotVen.tipoImpuesto);
                          if (iTNotVen.tipoImpuesto === 'IGV') {
                            // console.log('🎈', iTNotVen.ventaPEN, iTNotVen.porcentaje);
                            //console.log('iTVen.ventaPEN:::', iTVen.ventaPEN);
                            const vv = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                            //console.log('vv', vv);
                            //console.log('iTVen.porcentaje', iTVen.porcentaje);
                            t_bi = redondeo6Decimales((vv * 100) / (100 + iTNotVen.porcentaje));
                            t_igv = redondeo6Decimales(vv - t_bi);
                          }
                          // console.log('🥽');
                          // if (iTVen.tipoImpuesto === 'ISC') {
                          // }
                          // if (iTVen.tipoImpuesto === 'IVAP') {
                          // }
                          if (iTNotVen.tipoImpuesto.toString() === 'EXO') {
                            // console.log('🎈🎈', iTNotVen.ventaPEN);
                            t_exo = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          // console.log('🥽🥽');
                          if (iTNotVen.tipoImpuesto === 'EXP') {
                            t_export = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          // console.log('🥽🥽🥽');
                          if (iTNotVen.tipoImpuesto === 'GRA') {
                            t_otros = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          if (iTNotVen.tipoImpuesto === 'INA') {
                            t_ina = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          if (iTNotVen.tipoImpuesto === 'OTROS') {
                            t_otros = redondeo6Decimales(iTNotVen.ventaPEN.$numberDecimal ? iTNotVen.ventaPEN.$numberDecimal : iTNotVen.ventaPEN);
                          }
                          // console.log('fin ...PENPENPENPENPENPENPEmn');
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
                          //     t_bi = redondeo2Decimales((vv * 100) / (100 + definicion_CTX_NOTA_VENTA.igv));
                          //     t_igv = redondeo2Decimales(vv - t_bi);
                          //   }
                          // }
                        }
                        // console.log('🧨🧨🧨');
                        sumaTOTAL = sumaTOTAL + t_bi + t_igv + t_exo + t_ina + t_isc + t_export + t_otros;
                        sumaTOTAL_BI = sumaTOTAL_BI + t_bi;
                        sumaTOTAL_IGV = sumaTOTAL_IGV + t_igv;
                        sumaTOTAL_EXO = sumaTOTAL_EXO + t_exo;
                        sumaTOTAL_INAFEC = sumaTOTAL_INAFEC + t_ina;
                        sumaTOTAL_ISC = sumaTOTAL_ISC + t_isc;
                        sumaTOTAL_EXPORT = sumaTOTAL_EXPORT + t_export;
                        sumaTOTAL_OTROS = sumaTOTAL_OTROS + t_otros;

                        // console.log(
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

                        // SOLO AL LLEGAR AL FINAL DE LA ITERACION SE FIJA LOS MONTOS
                        if (index + 1 === definicion_CTX_NOTA_VENTA.itemsNotaVenta.length && definicion_CTX_NOTA_VENTA._id === '') {
                          // console.log('🎗🎗🎗🎗🎗');

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

                        return (
                          <tr key={iTNotVen.idAuxiliar} style={iTNotVen.noFacturar ? { background: '#ff5aff' } : {}}>
                            <td data-label="Ítem" key={iTNotVen.idAuxiliar}>{`${cerosALaIzquierda(indexItemVenta, 3)}`}</td>
                            <td data-label="Código" class="comoCadena" style={{ display: 'none' }}>
                              {iTNotVen.codigo}
                            </td>
                            <td data-label="Descripción">
                              {/* {iTNotVen.tipo === 'OTRO' ? <img src={images.puntoVerde} alt="Punto verde" width="12" height="12" /> : ''} */}
                              {iTNotVen.tipo === 'OTRO' ? <img src={images.puntoAzul} alt="Punto verde" width="12" height="12" /> : ''}
                              {iTNotVen.descripcionEquivalencia}
                            </td>
                            <td data-label="Ubigeo" class="accionesLeft">
                              {iTNotVen.ubigeo ? iTNotVen.ubigeo : '-'}
                            </td>
                            <td data-label="Stock" style={{ color: 'purple', fontWeight: 'bold' }}>
                              {iTNotVen.stock ? iTNotVen.stock : '-'}
                            </td>
                            {/* ---------------------------------------------------textAlign: 'center'-- */}
                            {/* <td data-label="Cantidad" class="comoNumero" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> */}
                            {/* <td data-label="Cantidad" class="comoNumero" style={{ verticalAlign: 'middle', padding: '0' }}> */}
                            <td data-label="Cantidad" class="comoNumero">
                              <div style={{ display: 'flex' }}>
                                <button
                                  hidden={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                                  style={{ width: '21px' }}
                                  onClick$={() => {
                                    const previo = iTNotVen.cantidadEquivalencia.$numberDecimal
                                      ? iTNotVen.cantidadEquivalencia.$numberDecimal - 1
                                      : iTNotVen.cantidadEquivalencia - 1;
                                    if (previo <= 0) {
                                      alert('La cantidad no puede ser menor o igual a CERO (0).');
                                      return;
                                    }
                                    iTNotVen.cantidadEquivalencia = previo;
                                    if (definicion_CTX_NOTA_VENTA.enDolares) {
                                      iTNotVen.ventaUSD = iTNotVen.cantidadEquivalencia * iTNotVen.precioUnitarioUSD;
                                      iTNotVen.ventaPEN = iTNotVen.cantidadEquivalencia * iTNotVen.precioUnitarioPEN;
                                    } else {
                                      iTNotVen.ventaPEN =
                                        (iTNotVen.cantidadEquivalencia.$numberDecimal
                                          ? iTNotVen.cantidadEquivalencia.$numberDecimal
                                          : iTNotVen.cantidadEquivalencia) *
                                        (iTNotVen.precioUnitarioPEN.$numberDecimal ? iTNotVen.precioUnitarioPEN.$numberDecimal : iTNotVen.precioUnitarioPEN);
                                    }
                                  }}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  disabled={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                                  style={{ width: '60px', textAlign: 'end' }}
                                  value={
                                    iTNotVen.cantidadEquivalencia.$numberDecimal ? iTNotVen.cantidadEquivalencia.$numberDecimal : iTNotVen.cantidadEquivalencia
                                  }
                                  onChange$={(e) => {
                                    //console.log('ON CHANGE: Cantidad........');
                                    iTNotVen.cantidadEquivalencia = parseFloat(
                                      (e.target as HTMLInputElement).value.toString().trim() === '' ? '1' : (e.target as HTMLInputElement).value
                                    );
                                    if (definicion_CTX_NOTA_VENTA.enDolares) {
                                      iTNotVen.ventaUSD = iTNotVen.cantidadEquivalencia * iTNotVen.precioUnitarioUSD;
                                      iTNotVen.ventaPEN = iTNotVen.cantidadEquivalencia * iTNotVen.precioUnitarioPEN;
                                    } else {
                                      iTNotVen.ventaPEN =
                                        (iTNotVen.cantidadEquivalencia.$numberDecimal
                                          ? iTNotVen.cantidadEquivalencia.$numberDecimal
                                          : iTNotVen.cantidadEquivalencia) *
                                        (iTNotVen.precioUnitarioPEN.$numberDecimal ? iTNotVen.precioUnitarioPEN.$numberDecimal : iTNotVen.precioUnitarioPEN);
                                    }
                                  }}
                                />
                                <button
                                  hidden={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                                  onClick$={() => {
                                    iTNotVen.cantidadEquivalencia = iTNotVen.cantidadEquivalencia.$numberDecimal
                                      ? iTNotVen.cantidadEquivalencia.$numberDecimal + 1
                                      : iTNotVen.cantidadEquivalencia + 1;
                                    if (definicion_CTX_NOTA_VENTA.enDolares) {
                                      iTNotVen.ventaUSD = iTNotVen.cantidadEquivalencia * iTNotVen.precioUnitarioUSD;
                                      iTNotVen.ventaPEN = iTNotVen.cantidadEquivalencia * iTNotVen.precioUnitarioPEN;
                                    } else {
                                      iTNotVen.ventaPEN =
                                        (iTNotVen.cantidadEquivalencia.$numberDecimal
                                          ? iTNotVen.cantidadEquivalencia.$numberDecimal
                                          : iTNotVen.cantidadEquivalencia) *
                                        (iTNotVen.precioUnitarioPEN.$numberDecimal ? iTNotVen.precioUnitarioPEN.$numberDecimal : iTNotVen.precioUnitarioPEN);
                                    }
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td data-label="Uni" class="accionesLeft">
                              {iTNotVen.unidadEquivalencia}
                            </td>
                            {/* ----------------------------------------------------- */}
                            <td data-label="Precio Uni" class="comoNumeroLeft">
                              <input
                                type="number"
                                disabled={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                                style={{ width: '60px', textAlign: 'end' }}
                                value={
                                  definicion_CTX_NOTA_VENTA.enDolares
                                    ? iTNotVen.precioUnitarioUSD.$numberDecimal
                                      ? iTNotVen.precioUnitarioUSD.$numberDecimal
                                      : iTNotVen.precioUnitarioUSD
                                    : iTNotVen.precioUnitarioPEN.$numberDecimal
                                    ? iTNotVen.precioUnitarioPEN.$numberDecimal
                                    : iTNotVen.precioUnitarioPEN
                                }
                                onChange$={(e) => {
                                  //console.log('ON CHANGE: Precio Uni.........');
                                  const precio = parseFloat(
                                    (e.target as HTMLInputElement).value.toString().trim() === '' ? '0' : (e.target as HTMLInputElement).value
                                  );

                                  if (definicion_CTX_NOTA_VENTA.enDolares) {
                                    iTNotVen.precioUnitarioUSD = precio;
                                    iTNotVen.ventaUSD = iTNotVen.cantidadEquivalencia * iTNotVen.precioUnitarioUSD;
                                    iTNotVen.ventaPEN = iTNotVen.cantidadEquivalencia * iTNotVen.precioUnitarioPEN;
                                  } else {
                                    iTNotVen.precioUnitarioPEN = precio;

                                    iTNotVen.ventaPEN =
                                      (iTNotVen.cantidadEquivalencia.$numberDecimal
                                        ? iTNotVen.cantidadEquivalencia.$numberDecimal
                                        : iTNotVen.cantidadEquivalencia) *
                                      (iTNotVen.precioUnitarioPEN.$numberDecimal ? iTNotVen.precioUnitarioPEN.$numberDecimal : iTNotVen.precioUnitarioPEN);
                                  }
                                  //actualizar COSTO UNITARIO - EQUIVALENTE -- SOLO SI ES SERVICIO
                                  if (iTNotVen.tipo === 'SERVICIO') {
                                    iTNotVen.costoUnitarioPEN = redondeo6Decimales(
                                      iTNotVen.precioUnitarioPEN.$numberDecimal ? iTNotVen.precioUnitarioPEN.$numberDecimal : iTNotVen.precioUnitarioPEN
                                    );
                                    iTNotVen.costoUnitarioEquivalenciaPEN = redondeo6Decimales(
                                      iTNotVen.precioUnitarioPEN.$numberDecimal ? iTNotVen.precioUnitarioPEN.$numberDecimal : iTNotVen.precioUnitarioPEN
                                    );
                                  }
                                }}
                              />
                            </td>
                            {/* -------------------------------- -------------------- */}
                            <td data-label="Venta" class="comoNumeroLeft">
                              {definicion_CTX_NOTA_VENTA.enDolares
                                ? iTNotVen.ventaUSD.$numberDecimal
                                  ? redondeo6Decimales(iTNotVen.ventaUSD.$numberDecimal)
                                  : redondeo6Decimales(iTNotVen.ventaUSD)
                                : iTNotVen.ventaPEN.$numberDecimal
                                ? redondeo2Decimales(iTNotVen.ventaPEN.$numberDecimal)
                                : redondeo2Decimales(iTNotVen.ventaPEN)}
                            </td>
                            <td data-label="%" class="acciones" style={verParametrosAdicionales_Items.value ? { display: 'none' } : ''}>
                              {iTNotVen.porcentaje.$numberDecimal ? iTNotVen.porcentaje.$numberDecimal : iTNotVen.porcentaje}
                            </td>
                            <td data-label="Imp" class="comoCadena" style={verParametrosAdicionales_Items.value ? { display: 'none' } : ''}>
                              {/* {iTVen.tipoImpuesto.substring(0, 6)} */}
                              {iTNotVen.tipoImpuesto}
                            </td>
                            <td data-label="Afec" class="acciones" style={verParametrosAdicionales_Items.value ? { display: 'none' } : ''}>
                              {iTNotVen.tipoAfectacionDelImpuesto}
                            </td>
                            <td data-label="Acciones" class="accionesLeft">
                              <input
                                title="Eliminar ítem"
                                hidden={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.trash}
                                alt="icono eliminar"
                                height={14}
                                width={14}
                                // style={{ margin: '2px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  borrarItemNotaVenta.idAuxiliar = iTNotVen.idAuxiliar;
                                  // borrarItemVenta.item = indexItemServi;
                                  borrarItemNotaVenta.codigo = iTNotVen.codigo;
                                  borrarItemNotaVenta.descripcion = iTNotVen.descripcionEquivalencia;
                                  definicion_CTX_ADD_NOTA_VENTA.mostrarPanelBorrarItemNotaVenta = true;
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={7} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'Base Imponible USD' : 'Base Imponible PEN'}
                        </td>
                        <td colSpan={1} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA._id === ''
                            ? `${sumaTOTAL_BI.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`
                            : definicion_CTX_NOTA_VENTA.baseImponiblePEN.$numberDecimal
                            ? formatear_2Decimales(definicion_CTX_NOTA_VENTA.baseImponiblePEN.$numberDecimal)
                            : formatear_2Decimales(definicion_CTX_NOTA_VENTA.baseImponiblePEN)}
                        </td>
                        {/* <td colSpan={3} /> */}
                      </tr>
                      {/* <tr>
                        <td colSpan={7} class="comoNumero" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'Exonerado USD' : 'Exonerado PEN'}
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
                        <td colSpan={7} class="comoNumero" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'Inafecto USD' : 'Inafecto PEN'}
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
                        <td colSpan={7} class="comoNumero" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'Exportación USD' : 'Exportación PEN'}
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
                        <td colSpan={7} class="comoNumero" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'Otros USD' : 'Otros PEN'}
                        </td>
                        <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                          {`${sumaTOTAL_OTROS.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td colSpan={3} />
                      </tr> */}
                      <tr>
                        <td colSpan={7} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'IGV USD' : 'IGV PEN'}
                        </td>
                        <td colSpan={1} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA._id === ''
                            ? `${sumaTOTAL_IGV.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`
                            : definicion_CTX_NOTA_VENTA.igvPEN.$numberDecimal
                            ? formatear_2Decimales(definicion_CTX_NOTA_VENTA.igvPEN.$numberDecimal)
                            : formatear_2Decimales(definicion_CTX_NOTA_VENTA.igvPEN)}
                        </td>
                        {/* <td colSpan={3} /> */}
                      </tr>
                      <tr>
                        <td colSpan={7} class="comoNumeroLeft" style={{ color: '#2E1800' }}>
                          {definicion_CTX_NOTA_VENTA.enDolares ? 'Total USD' : 'Total PEN'}
                        </td>
                        <td colSpan={1} class="comoNumeroLeft" style={{ color: '#2E1800', background: 'yellow' }}>
                          {definicion_CTX_NOTA_VENTA._id === ''
                            ? `${sumaTOTAL.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`
                            : definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal
                            ? formatear_2Decimales(definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal)
                            : formatear_2Decimales(definicion_CTX_NOTA_VENTA.totalPEN)}
                        </td>
                        {/* <td colSpan={3} /> */}
                      </tr>
                      <tr>
                        <td colSpan={9} class="comoNumeroLeft" style={{ color: '#494641' }}>
                          {definicion_CTX_NOTA_VENTA.lite}
                        </td>
                        {/* <td colSpan={3} /> */}
                      </tr>
                      <tr style={definicion_CTX_NOTA_VENTA.todoEnEfectivo ? {} : { display: 'none' }}>
                        <td colSpan={8} class="comoNumeroLeft" style={{ color: '#494641' }}>
                          <label style={{ marginRight: '4px' }}>{`Efectivo ingresado <-> Vuelto`}</label>
                          <input
                            title="Efectivo ingresado"
                            id="input_EfectivoIngresado_NOTAVENTA"
                            type="number"
                            disabled={definicion_CTX_NOTA_VENTA._id === '' ? false : true}
                            size={12}
                            style={{ color: 'purple' }}
                            value={
                              definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
                                ? definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
                                : definicion_CTX_NOTA_VENTA.efectivoIngresado
                            }
                            onChange$={(e) => {
                              definicion_CTX_NOTA_VENTA.efectivoIngresado = (e.target as HTMLInputElement).value;
                              definicion_CTX_NOTA_VENTA.vuelto = redondeo2Decimales(
                                (definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
                                  ? definicion_CTX_NOTA_VENTA.efectivoIngresado.$numberDecimal
                                  : definicion_CTX_NOTA_VENTA.efectivoIngresado) -
                                  (definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal
                                    ? definicion_CTX_NOTA_VENTA.totalPEN.$numberDecimal
                                    : definicion_CTX_NOTA_VENTA.totalPEN)
                              );
                            }}
                            onFocus$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                            // onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarPersona = true)}
                          />
                        </td>
                        <td colSpan={3}>
                          <input
                            title="Vuelto"
                            id="input_Vuelto_NOTAVENTA"
                            type="number"
                            size={12}
                            disabled
                            value={
                              definicion_CTX_NOTA_VENTA.vuelto.$numberDecimal
                                ? definicion_CTX_NOTA_VENTA.vuelto.$numberDecimal
                                : definicion_CTX_NOTA_VENTA.vuelto
                            }
                            style={{ color: 'purple', background: '#fefea8', display: 'flex' }}
                            // onClick$={() => (definicion_CTX_ADD_VENTA.mostrarPanelBuscarPersona = true)}
                          />
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </>
              ) : (
                <i style={{ fontSize: '0.8rem' }}>No existen ítems para la nota de venta</i>
              )}
              {definicion_CTX_ADD_NOTA_VENTA.mostrarPanelBorrarItemNotaVenta && (
                <div class="modal">
                  <BorrarItemNotaVenta borrarItemNotaVenta={borrarItemNotaVenta} />
                </div>
              )}
              {definicion_CTX_ADD_NOTA_VENTA.mostrarPanelEditarImpuesto && (
                <div class="modal">{/* <EditarImpuesto editarImpuesto_ItemVenta={editarImpuesto_ItemVenta} /> */}</div>
              )}
            </div>
          }
          <br />
          {/* ----------------------------------------------------- */}
          {/*  METODO DE PAGO */}
          <div>
            {definicion_CTX_NOTA_VENTA.itemsNotaVenta.length > 0 ? (
              <>
                {/* <div class="form-control"> */}
                <div>
                  {/* <div class="form-control form-agrupado" style={{ display: 'flex', gap: '4px' }}> */}
                  <div class="linea_1_11" style={{ marginBottom: '8px' }}>
                    <select
                      id="metodoPago"
                      value={definicion_CTX_NOTA_VENTA.metodoPago}
                      style={{ background: 'orange' }}
                      onChange$={(e) => {
                        // const idx = (e.target as HTMLSelectElement).selectedIndex;
                        // const elSelect = e.target as HTMLSelectElement;
                        // const elOption = elSelect[idx];

                        definicion_CTX_NOTA_VENTA.verCuotasCredito = !definicion_CTX_NOTA_VENTA.verCuotasCredito;

                        definicion_CTX_NOTA_VENTA.metodoPago = (e.target as HTMLSelectElement).value;

                        // console.log('❤❤❤ elOption ', elOption);
                        if (definicion_CTX_NOTA_VENTA.metodoPago === 'CRÉDITO') {
                          // alert('está en crédito ' + definicion_CTX_NOTA_VENTA.cuotasCredito.length);
                          if (definicion_CTX_NOTA_VENTA.cuotasCredito.length === 0 && definicion_CTX_NOTA_VENTA.itemsNotaVenta.length > 0) {
                            definicion_CTX_NOTA_VENTA.cuotasCredito.push({
                              idAuxiliar: parseInt(elIdAuxiliar()),
                              fechaCuota: masXdiasHoy(30),
                              importeCuotaPEN: sumaTOTAL,
                            });
                          }
                        }

                        //     definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                        // definicion_CTX_PERSONA.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                        // document.getElementById('in_numeroIdentidad_PERSONA')?.focus();

                        //console.log('❤❤❤ dataSerie.value ', dataSerie.value);
                        // const SSS: any = dataSerie.value;
                        // const der = SSS.find((ew: any) => ew._id === elOption.id);

                        //console.log('❤❤❤ der ', der);
                        // definicion_CTX_NOTA_VENTA.codigoTipoOperacion = der.codigoTipoOperacionXDefault;
                        // definicion_CTX_NOTA_VENTA.tipoOperacion = der.tipoOperacionXDefault;
                        // definicion_CTX_NOTA_VENTA.impresionTipoFacturaBoleta = der.impresionTipoFacturaBoleta;

                        // definicion_CTX_NOTA_VENTA.idSerieNotaVenta = elOption.id;
                        // definicion_CTX_NOTA_VENTA.serie = (e.target as HTMLSelectElement).value;
                        // document.getElementById('in_Fecha')?.focus();
                      }}
                      // onChange$={() => {

                      //   console.log('definicion_CTX_NOTA_VENTA.meto', definicion_CTX_NOTA_VENTA.metodoPago);

                      // }}
                      // style={definicion_CTX_NOTA_VENTA.verCuotasCredito ? { width: '79%' } : { width: '100%' }}
                    >
                      <option value={'CONTADO'}>CONTADO</option>
                      <option value={'CRÉDITO'}>CRÉDITO</option>
                    </select>
                    {definicion_CTX_NOTA_VENTA.verCuotasCredito && (
                      <button
                        title="Adicionar cuota"
                        id="addCuota"
                        class="btn"
                        style={{ width: '100%' }}
                        onClick$={() => {
                          (cuota.idAuxiliar = parseInt(elIdAuxiliar())),
                            (cuota.fechaCuota = masXdiasHoy(30)), //hoy()
                            (cuota.importeCuotaPEN = 0),
                            (cuotaCredito_esEdit.value = false);
                          definicion_CTX_ADD_NOTA_VENTA.mostrarPanelCuotasCredito = true;
                          definicion_CTX_ADD_NOTA_VENTA.grabo_CuotaCredito = false;
                        }}
                      >
                        Add cuota
                      </button>
                    )}
                  </div>
                </div>
                {!definicion_CTX_NOTA_VENTA.verCuotasCredito && (
                  <div>
                    <input
                      id="Todo en efectivo"
                      type="radio"
                      value="Todo en efectivo"
                      name="Contado"
                      checked={definicion_CTX_NOTA_VENTA.todoEnEfectivo}
                      onChange$={(e) => {
                        definicion_CTX_NOTA_VENTA.todoEnEfectivo = (e.target as HTMLInputElement).checked;
                        definicion_CTX_NOTA_VENTA.unaParteEnEfectivo = !definicion_CTX_NOTA_VENTA.todoEnEfectivo;
                      }}
                    />
                    <label for="Todo en efectivo">Todo en efectivo</label>
                    <br />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', margin: '6px 0' }}>
                      {/* <div style={{ display: 'grid', gap: '4px', margin: '6px 0' }}> */}
                      {/* <div style={{ gap: '4px', margin: '6px 0' }}> */}
                      <div>
                        <input
                          id="Una parte en efectivo"
                          type="radio"
                          value="Una parte en efectivo"
                          name="Contado"
                          checked={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                          onChange$={(e) => {
                            definicion_CTX_NOTA_VENTA.unaParteEnEfectivo = (e.target as HTMLInputElement).checked;
                            definicion_CTX_NOTA_VENTA.todoEnEfectivo = !definicion_CTX_NOTA_VENTA.unaParteEnEfectivo;
                            if (definicion_CTX_NOTA_VENTA.unaParteEnEfectivo) {
                              (document.getElementById('inputMontoEnEfectivo') as HTMLInputElement).focus();
                            }
                          }}
                        />
                        <label for="Una parte en efectivo">Una parte en efectivo</label>
                      </div>
                      <input
                        id="inputMontoEnEfectivo"
                        type="number"
                        placeholder="Efectivo"
                        style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                        disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                        value={definicion_CTX_NOTA_VENTA.montoEnEfectivo}
                        onChange$={(e) =>
                          (definicion_CTX_NOTA_VENTA.montoEnEfectivo = parseFloat(
                            (e.target as HTMLInputElement).value.toString().trim() === '' ? '0' : (e.target as HTMLInputElement).value
                          ))
                        }
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
                        style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                        disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                        value={definicion_CTX_NOTA_VENTA.otroMedioPago}
                        onChange$={(e) => {
                          definicion_CTX_NOTA_VENTA.otroMedioPago = (e.target as HTMLSelectElement).value;
                          document.getElementById('inputMontoOtroMedioPagoI')?.focus();
                        }}
                        onKeyPress$={(e) => {
                          if (e.key === 'Enter') {
                            document.getElementById('inputMontoOtroMedioPagoI')?.focus();
                          }
                        }}
                        // style={definicion_CTX_NOTA_VENTA.verCuotasCredito ? { width: '79%' } : { width: '100%' }}
                      >
                        <option value={'TRANSF. DE FONDOS - YAPE'}>TRANSF. DE FONDOS - YAPE</option>
                        <option value={'TRANSF. DE FONDOS - PLIN'}>TRANSF. DE FONDOS - PLIN</option>
                        <option value={'TARJETA DE CRÉDITO'}>TARJETA DE CRÉDITO</option>
                        <option value={'TARJETA DE DÉBITO'}>TARJETA DE DÉBITO</option>
                        <option value={'DEPÓSITO EN CUENTA'}>DEPÓSITO EN CUENTA</option>
                      </select>
                      <input
                        id="inputMontoOtroMedioPagoI"
                        type="number"
                        placeholder="Otro medio"
                        style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                        disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                        value={definicion_CTX_NOTA_VENTA.montoOtroMedioPago}
                        onChange$={(e) => (definicion_CTX_NOTA_VENTA.montoOtroMedioPago = (e.target as HTMLInputElement).value)}
                        onKeyPress$={(e) => {
                          if (e.key === 'Enter') {
                            document.getElementById('in_Observacion')?.focus();
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
                {definicion_CTX_ADD_NOTA_VENTA.mostrarPanelCuotasCredito && (
                  <div class="modal">
                    <NewEditCuotaCreditoVenta
                      contexto="add_nota_venta"
                      esEdit={cuotaCredito_esEdit.value}
                      cuota={cuota}
                      fechaOrigen={definicion_CTX_NOTA_VENTA.fecha}
                    />
                  </div>
                )}

                {/* <div class="form-control form-agrupado" style={{ display: 'flex' }}> */}
                {/* ----------------------------------------------------- */}
                {/* ----------------------------------------------------- */}
                {/* ----------------------------------------------------- */}
                {/* TABLA DE CUOTAS DE PAGO venta.verCuotasCredito &&   ctx_PanelVenta.grabo_cuotas_numero &&*/}
                {
                  <div class="form-control">
                    {definicion_CTX_NOTA_VENTA.metodoPago === 'CRÉDITO' && definicion_CTX_NOTA_VENTA.cuotasCredito.length > 0 ? (
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
                          {definicion_CTX_NOTA_VENTA.cuotasCredito.map((value: any, index: number) => {
                            //   const { idAuxiliar, fechaCuota, importeCuotaPEN } = cuota;
                            const indexItem = index + 1;
                            // sumaCuotas.value = sumaCuotas.value + redondeo2Decimales(cuota.importeCuotaPEN);
                            sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);
                            // definicion_CTX_NOTA_VENTA.importeTotalCuotasCredito = sumaCuotas;
                            // importeTotalCuotas(sumaCuotas);
                            fijarImporteTotalCuotasCredito(sumaCuotas);
                            // Cuota{}
                            return (
                              <tr key={value.idAuxiliar} style={{ background: 'BlanchedAlmond' }}>
                                <td data-label="Nro. Cuota" key={value.idAuxiliar}>{`${cerosALaIzquierda(indexItem, 3)}`}</td>
                                <td data-label="Fecha">{formatoDDMMYYYY_PEN(value.fechaCuota)}</td>
                                <td data-label="Importe" class="accionesLeft">
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
                                    style={{ marginRight: '6px ' }}
                                    onClick$={() => {
                                      // console.log('cuotaCredito_esEdit.value', cuotaCredito_esEdit.value);
                                      cuotaCredito_esEdit.value = true;
                                      cuota.idAuxiliar = value.idAuxiliar;
                                      cuota.fechaCuota = value.fechaCuota;
                                      cuota.importeCuotaPEN = value.importeCuotaPEN;
                                      definicion_CTX_ADD_NOTA_VENTA.mostrarPanelCuotasCredito = true;
                                    }}
                                  />
                                  <input type="image" title="Eliminar ítem" alt="icono de eliminar" height={14} width={14} src={images.trash} />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <th colSpan={2} class="accionesLeft">
                              Suma Cuotas
                            </th>
                            <th colSpan={1} class="accionesLeft">
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
                    ) : definicion_CTX_NOTA_VENTA.verCuotasCredito ? (
                      <i style={{ fontSize: '0.8rem', color: 'red' }}>No existen cuotas de crédito</i>
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
              </>
            ) : (
              ''
            )}
            {definicion_CTX_NOTA_VENTA.verCuotasCredito && (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', margin: '6px 0' }}>
                  {/* <div style={{ display: 'grid', gap: '4px', margin: '6px 0' }}> */}
                  {/* <div style={{ gap: '4px', margin: '6px 0' }}> */}
                  <div>
                    <input
                      id="Una parte en efectivo"
                      type="checkbox"
                      value="Una parte en efectivo"
                      name="Contado"
                      checked={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                      onChange$={(e) => {
                        definicion_CTX_NOTA_VENTA.unaParteEnEfectivo = (e.target as HTMLInputElement).checked;
                        definicion_CTX_NOTA_VENTA.todoEnEfectivo = !definicion_CTX_NOTA_VENTA.unaParteEnEfectivo;
                      }}
                    />
                    <label for="Una parte en efectivo">Una parte en efectivo</label>
                  </div>
                  <input
                    id="inputMontoEnEfectivo"
                    type="number"
                    placeholder="Efectivo"
                    style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                    disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                    value={definicion_CTX_NOTA_VENTA.montoEnEfectivo}
                    onChange$={(e) => (definicion_CTX_NOTA_VENTA.montoEnEfectivo = (e.target as HTMLInputElement).value)}
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
                    style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                    disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                    value={definicion_CTX_NOTA_VENTA.otroMedioPago}
                    onChange$={(e) => {
                      definicion_CTX_NOTA_VENTA.otroMedioPago = (e.target as HTMLSelectElement).value;
                      document.getElementById('inputMontoOtroMedioPagoII')?.focus();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('inputMontoOtroMedioPagoII')?.focus();
                      }
                    }}
                    // style={definicion_CTX_NOTA_VENTA.verCuotasCredito ? { width: '79%' } : { width: '100%' }}
                  >
                    <option value={'TRANSF. DE FONDOS - YAPE'}>TRANSF. DE FONDOS - YAPE</option>
                    <option value={'TRANSF. DE FONDOS - PLIN'}>TRANSF. DE FONDOS - PLIN</option>
                    <option value={'TARJETA DE CRÉDITO'}>TARJETA DE CRÉDITO</option>
                    <option value={'TARJETA DE DÉBITO'}>TARJETA DE DÉBITO</option>
                    <option value={'DEPÓSITO EN CUENTA'}>DEPÓSITO EN CUENTA</option>
                  </select>
                  <input
                    id="inputMontoOtroMedioPagoII"
                    type="number"
                    placeholder="Otro medio"
                    style={definicion_CTX_NOTA_VENTA.unaParteEnEfectivo ? { background: 'white' } : { background: '#eeeeee' }}
                    disabled={!definicion_CTX_NOTA_VENTA.unaParteEnEfectivo}
                    value={definicion_CTX_NOTA_VENTA.montoOtroMedioPago}
                    onChange$={(e) => (definicion_CTX_NOTA_VENTA.montoOtroMedioPago = (e.target as HTMLInputElement).value)}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('in_Observacion')?.focus();
                      }
                    }}
                  />
                </div>
                <br />
                <div class="linea_1_111">
                  {/* ----------------------------------------------------- */}
                  {/* CLIENTE - SOBRENOMBRE - CHAPA  */}
                  <div>
                    <input
                      id="in_Cliente_Sobrenombre_Chapa"
                      type="text"
                      // tabIndex={1}
                      // autoFocus={true}
                      value={definicion_CTX_NOTA_VENTA.clienteSobrenombreChapa}
                      style={{ width: '100%', background: 'yellow' }}
                      placeholder="Cliente / Sobrenombre / Chapa"
                      onChange$={(e) => {
                        definicion_CTX_NOTA_VENTA.clienteSobrenombreChapa = (e.target as HTMLInputElement).value.toUpperCase().trim();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          document.getElementById('in_Placa')?.focus();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <input
                      id="in_Placa"
                      type="text"
                      // tabIndex={1}
                      // autoFocus={true}
                      value={definicion_CTX_NOTA_VENTA.placa}
                      style={{ width: '100%', background: 'yellow' }}
                      placeholder="Placa"
                      onChange$={(e) => {
                        definicion_CTX_NOTA_VENTA.placa = (e.target as HTMLInputElement).value.toUpperCase().trim();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          document.getElementById('in_Kilometraje')?.focus();
                        }
                      }}
                    />
                  </div>
                  <div>
                    <input
                      id="in_Kilometraje"
                      type="text"
                      // tabIndex={1}
                      // autoFocus={true}
                      value={definicion_CTX_NOTA_VENTA.kilometraje}
                      style={{ width: '100%', background: 'yellow' }}
                      placeholder="Kilometraje"
                      onChange$={(e) => {
                        definicion_CTX_NOTA_VENTA.kilometraje = (e.target as HTMLInputElement).value.toUpperCase().trim();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          document.getElementById('in_Observacion')?.focus();
                        }
                      }}
                    />
                  </div>
                  {/* ----------------------------------------------------- */}
                  {/* A CUENTA */}
                  {/* <div class="linea_1_11"> */}
                  {/* <div style={{ display: 'inline-flex' }}>
                    <div style={{ display: 'inline-flex', width: '112px' }}>
                      <input
                        id="in_aCuenta_ADDNotaVenta"
                        // name="in_activo_MERCADERIA_IN"
                        type="checkbox"
                        style={{ cursor: 'pointer' }}
                        checked={definicion_CTX_NOTA_VENTA.checkACuenta}
                        onChange$={(e) => {
                          definicion_CTX_NOTA_VENTA.checkACuenta = (e.target as HTMLInputElement).checked;
                        }}
                        onKeyPress$={(e) => {
                          if (e.key === 'Enter') {
                            document.getElementById('in_noFacturar_MERCADERIA_IN')?.focus();
                          }
                        }}
                        onFocusin$={(e) => {
                          (e.target as HTMLInputElement).select();
                        }}
                      />
                      <label for="in_aCuenta_ADDNotaVenta" style={{ cursor: 'pointer' }}>
                        A Cuenta
                      </label>
                    </div>
                    <input
                      id="in_ACuenta"
                      type="text"
                      // tabIndex={1}
                      // autoFocus={true}
                      value={definicion_CTX_NOTA_VENTA.aCuenta}
                      style={{ width: '100%', background: 'yellow' }}
                      placeholder="A Cuenta"
                      onChange$={(e) => {
                        definicion_CTX_NOTA_VENTA.aCuenta = (e.target as HTMLInputElement).value.toUpperCase().trim();
                      }}
                    />
                  </div> */}
                </div>
              </>
            )}

            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {/* ----------------------------------------------------- */}
          {/* OBSERVACION */}
          <div>
            {/* OBSERVACION */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_Observacion"
                  type="text"
                  // tabIndex={1}
                  // autoFocus={true}
                  value={definicion_CTX_NOTA_VENTA.observacion}
                  style={{ width: '100%', background: 'yellow' }}
                  placeholder="Observación"
                  onChange$={(e) => {
                    definicion_CTX_NOTA_VENTA.observacion = (e.target as HTMLInputElement).value.toUpperCase().trim();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('btnGrabarNotaVenta')?.focus();
                    }
                  }}
                />
              </div>
            </div>
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
        </div>

        {/* ----------------------------------------------------- */}
        {/* GRABAR */}
        {definicion_CTX_NOTA_VENTA._id === '' ? (
          <input
            id="btnGrabarNotaVenta"
            type="button"
            // type="submit"
            value={'Grabar NOTA DE VENTA ' + diaDeLaSemana(definicion_CTX_NOTA_VENTA.fecha) + ' ' + definicion_CTX_NOTA_VENTA.fecha.substring(8, 10)}
            class="btn-centro"
            style={{ height: '40px' }}
            onClick$={() => grabandoNotaVenta()}
          />
        ) : (
          ''
        )}

        {pasoProcesoGrabacion.value &&
          (grabo.value ? (
            <label style={{ textAlign: 'center', color: 'green' }}>Registro SATISFACTORIO!!!</label>
          ) : (
            <label style={{ textAlign: 'center', color: 'red' }}>Inconveniente en registro.</label>
          ))}
      </div>
    </div>
  );
});
