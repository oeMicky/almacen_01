import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { CTX_INDEX_COMPRA } from '~/routes/(almacen)/compra';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import ElSelect from '../system/elSelect';
import { ICompra } from '~/interfaces/iCompra';
import { loadTiposComprobantePago } from '~/apis/sunat.api';
import { IPersona } from '~/interfaces/iPersona';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
// import { getTipoCambio } from '~/apis/apisExternas.api';
import { ultimoDiaDelPeriodoX } from '~/functions/comunes';
import { getIgvsCompra, inUpCompra } from '~/apis/compra.api';
import { parametrosGlobales } from '~/routes/login';

export const CTX_NEW_EDIT_COMPRA = createContextId<any>('new_editCompra');

export const CTX_PROVEEDOR = createContextId<IPersona>('proveedor');

export default component$((props: { addPeriodo: any; compraSeleccionada: any }) => {
  //#region DEFINICION CTX_NEW_EDIT_COMPRA
  const definicion_CTX_NEW_EDIT_COMPRA = useStore({
    mostrarPanelBuscarPersona: false,
    rol_Persona: '',
    selecciono_Persona: false,
  });
  useContextProvider(CTX_NEW_EDIT_COMPRA, definicion_CTX_NEW_EDIT_COMPRA);
  //#endregion DEFINICION CTX_NEW_EDIT_COMPRA

  //#region DEFINICION CTX_COMPRA - NEW  /  EDIT
  const definicion_CTX_COMPRA = useStore<ICompra>({
    _id: props.compraSeleccionada._id ? props.compraSeleccionada._id : '',
    idGrupoEmpresarial: props.compraSeleccionada.idGrupoEmpresarial
      ? props.compraSeleccionada.idGrupoEmpresarial
      : parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: props.compraSeleccionada.idEmpresa ? props.compraSeleccionada.idEmpresa : parametrosGlobales.idEmpresa,
    idSucursal: props.compraSeleccionada.idSucursal ? props.compraSeleccionada.idSucursal : parametrosGlobales.idSucursal,
    idPeriodo: props.compraSeleccionada.idPeriodo ? props.compraSeleccionada.idPeriodo : props.addPeriodo.idPeriodo,
    periodo: props.compraSeleccionada.periodo ? props.compraSeleccionada.periodo : props.addPeriodo.periodo,

    idAlmacen: props.compraSeleccionada.idAlmacen ? props.compraSeleccionada.idAlmacen : '',
    idIngresoAAlmacen: props.compraSeleccionada.idIngresoAAlmacen ? props.compraSeleccionada.idIngresoAAlmacen : '',

    ruc: props.compraSeleccionada.ruc ? props.compraSeleccionada.ruc : parametrosGlobales.RUC,
    empresa: props.compraSeleccionada.empresa ? props.compraSeleccionada.empresa : parametrosGlobales.RazonSocial,
    direccion: props.compraSeleccionada.direccion ? props.compraSeleccionada.direccion : parametrosGlobales.Direccion,

    codigoTCP: props.compraSeleccionada.codigoTCP ? props.compraSeleccionada.codigoTCP : '',
    descripcionTCP: props.compraSeleccionada.descripcionTCP ? props.compraSeleccionada.descripcionTCP : '',
    serie: props.compraSeleccionada.serie ? props.compraSeleccionada.serie : '',
    numero: props.compraSeleccionada.numero ? props.compraSeleccionada.numero : '',

    fecha: props.compraSeleccionada.fecha ? props.compraSeleccionada.fecha.substring(0, 10) : '',
    conFechaVencimiento: props.compraSeleccionada.conFechaVencimiento ? props.compraSeleccionada.conFechaVencimiento : false,
    fechaVencimiento: props.compraSeleccionada.fechaVencimiento ? props.compraSeleccionada.fechaVencimiento : '',
    anioDUAoDSI: props.compraSeleccionada.anioDUAoDSI ? props.compraSeleccionada.anioDUAoDSI : '',

    idProveedor: props.compraSeleccionada.idProveedor ? props.compraSeleccionada.idProveedor : '',
    codigoTipoDocumentoIdentidad: props.compraSeleccionada.codigoTipoDocumentoIdentidad
      ? props.compraSeleccionada.codigoTipoDocumentoIdentidad
      : '6',
    tipoDocumentoIdentidad: props.compraSeleccionada.tipoDocumentoIdentidad
      ? props.compraSeleccionada.tipoDocumentoIdentidad
      : 'RUC',
    numeroIdentidad: props.compraSeleccionada.numeroIdentidad ? props.compraSeleccionada.numeroIdentidad : '',
    razonSocialNombre: props.compraSeleccionada.razonSocialNombre ? props.compraSeleccionada.razonSocialNombre : '',
    email: props.compraSeleccionada.email ? props.compraSeleccionada.email : '',

    idElIgv: props.compraSeleccionada.idElIgv ? props.compraSeleccionada.idElIgv : '',
    elIgv: props.compraSeleccionada.elIgv ? props.compraSeleccionada.elIgv.$numberDecimal : '',

    enDolares: props.compraSeleccionada.enDolares ? props.compraSeleccionada.enDolares : false,
    moneda: props.compraSeleccionada.moneda ? props.compraSeleccionada.moneda : 'PEN',
    tipoCambio: props.compraSeleccionada.tipoCambio ? props.compraSeleccionada.tipoCambio.$numberDecimal : '',

    tipoCompra: props.compraSeleccionada.tipoCompra ? props.compraSeleccionada.tipoCompra : 'A',
    //***************SOLES******************** */
    baseImponiblePEN: props.compraSeleccionada.baseImponiblePEN ? props.compraSeleccionada.baseImponiblePEN.$numberDecimal : '',
    igvPEN: props.compraSeleccionada.igvPEN ? props.compraSeleccionada.igvPEN.$numberDecimal : '',
    adquisicionesNoGravadasPEN: props.compraSeleccionada.adquisicionesNoGravadasPEN
      ? props.compraSeleccionada.adquisicionesNoGravadasPEN.$numberDecimal
      : '',
    iscPEN: props.compraSeleccionada.iscPEN ? props.compraSeleccionada.iscPEN.$numberDecimal : '',
    icbpPEN: props.compraSeleccionada.icbpPEN ? props.compraSeleccionada.icbpPEN.$numberDecimal : '',
    otrosPEN: props.compraSeleccionada.otrosPEN ? props.compraSeleccionada.otrosPEN.$numberDecimal : '',
    totalPEN: props.compraSeleccionada.totalPEN ? props.compraSeleccionada.totalPEN.$numberDecimal : '',
    //****************************************** */
    //***************DOLARES******************** */
    baseImponibleUSD: props.compraSeleccionada.baseImponibleUSD ? props.compraSeleccionada.baseImponibleUSD.$numberDecimal : '',
    igvUSD: props.compraSeleccionada.igvUSD ? props.compraSeleccionada.igvUSD.$numberDecimal : '',
    adquisicionesNoGravadasUSD: props.compraSeleccionada.adquisicionesNoGravadasUSD
      ? props.compraSeleccionada.adquisicionesNoGravadasUSD.$numberDecimal
      : '',
    iscUSD: props.compraSeleccionada.iscUSD ? props.compraSeleccionada.iscUSD.$numberDecimal : '',
    icbpUSD: props.compraSeleccionada.icbpUSD ? props.compraSeleccionada.icbpUSD.$numberDecimal : '',
    otrosUSD: props.compraSeleccionada.otrosUSD ? props.compraSeleccionada.otrosUSD.$numberDecimal : '',
    totalUSD: props.compraSeleccionada.totalUSD ? props.compraSeleccionada.totalUSD.$numberDecimal : '',
    //****************************************** */

    fechaReferencia: props.compraSeleccionada.fechaReferencia ? props.compraSeleccionada.fechaReferencia : '',
    tipoReferencia: props.compraSeleccionada.tipoReferencia ? props.compraSeleccionada.tipoReferencia : '',
    serieReferencia: props.compraSeleccionada.serieReferencia ? props.compraSeleccionada.serieReferencia : '',
    numeroReferencia: props.compraSeleccionada.numeroReferencia ? props.compraSeleccionada.numeroReferencia : '',

    usuarioCrea: props.compraSeleccionada.usuarioCrea ? props.compraSeleccionada.usuarioCrea : '',
    usuarioModifica: props.compraSeleccionada.usuarioModifica ? props.compraSeleccionada.usuarioModifica : '',
  });
  //#endregion DEFINICION CTX_COMPRA - NEW  /  EDIT

  //#region DEFINICION CTX_PROVEEDOR
  const definion_CTX_PROVEEDOR = useStore<IPersona>({
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
  useContextProvider(CTX_PROVEEDOR, definion_CTX_PROVEEDOR);
  //#endregion DEFINICION CTX_PROVEEDOR

  //#region CONTEXTO
  const ctx_index_compra = useContext(CTX_INDEX_COMPRA);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);
  const LosTCPcargados = useSignal([]);
  const LosIGVscargados = useSignal([]);
  // const esNumero = useSignal(false);
  const igvPorDefault = useStore({ idElIgv: '', elIgv: '' });

  //#endregion INICIALIZACION

  //#region CARGAR LOS TCP
  const cargarLosTCP = $(async () => {
    const losTCP = await loadTiposComprobantePago();
    console.log('losTCP', losTCP);
    LosTCPcargados.value = losTCP.data;
    console.log(' LosTCPcargados.value', LosTCPcargados.value);
    ini.value++;
  });

  const cargarLosIGVsCompra = $(async () => {
    const LosIGVs = await getIgvsCompra({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });
    console.log('LosIGVs', LosIGVs);
    LosIGVscargados.value = LosIGVs.data;
    console.log(' LosIGVscargados.value', LosIGVscargados.value);
    if (definicion_CTX_COMPRA._id === '') {
      const tre: any = LosIGVscargados.value.filter((docs: any) => docs.default === true);
      console.log('tretretretretretretretretre', tre);
      igvPorDefault.idElIgv = tre[0]._id;
      igvPorDefault.elIgv = tre[0].igv;
      definicion_CTX_COMPRA.idElIgv = tre[0]._id;
      definicion_CTX_COMPRA.elIgv = tre[0].igv;
      console.log('definicion_CTX_COMPRA.elIgv..........', definicion_CTX_COMPRA.elIgv);
    }
  });

  useTask$(({ track }) => {
    track(() => ini.value);
    if (ini.value === 0) {
      cargarLosTCP();
      cargarLosIGVsCompra();
    }

    // ini.value++; forma blucle infinito
    // cargarLosIGVsCompra();
  });
  //#endregion CARGAR LOS TCP

  //#region PROVEEDOR
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_COMPRA.selecciono_Persona);
    if (definicion_CTX_NEW_EDIT_COMPRA.selecciono_Persona && definicion_CTX_NEW_EDIT_COMPRA.rol_Persona === 'proveedor') {
      // alert('evalua a la persona');
      definicion_CTX_COMPRA.idProveedor = definion_CTX_PROVEEDOR._id;
      definicion_CTX_COMPRA.codigoTipoDocumentoIdentidad = definion_CTX_PROVEEDOR.codigoTipoDocumentoIdentidad;
      definicion_CTX_COMPRA.tipoDocumentoIdentidad = definion_CTX_PROVEEDOR.tipoDocumentoIdentidad;
      definicion_CTX_COMPRA.numeroIdentidad = definion_CTX_PROVEEDOR.numeroIdentidad;
      definicion_CTX_COMPRA.razonSocialNombre = definion_CTX_PROVEEDOR.razonSocialNombre;

      definicion_CTX_NEW_EDIT_COMPRA.rol_Persona = '';
      definicion_CTX_NEW_EDIT_COMPRA.selecciono_Persona = false;
    }
  });
  //#endregion PROVEEDOR

  //#region TIPO CAMBIO
  const obtenerTipoCambio = $(async (e: HTMLInputElement) => {
    const checkTC = e.checked;
    if (checkTC) {
      definicion_CTX_COMPRA.enDolares = true;
      console.log('ingreso al tipo de cambio');
      // let elTipoCambio = await getTipoCambio(definicion_CTX_COMPRA.fecha);
      // console.log('ingreso al tipo de cambio elTipoCambio.data');
      // elTipoCambio = elTipoCambio.data;
      // console.log('elTipoCambio', elTipoCambio.venta);
      // definicion_CTX_COMPRA.moneda = elTipoCambio.moneda;
      // definicion_CTX_COMPRA.tipoCambio = elTipoCambio.venta;
      definicion_CTX_COMPRA.moneda = 'USD';
      definicion_CTX_COMPRA.tipoCambio = 3.713;
    } else {
      console.log('ingreso al NNNNOOOOOO enDOLARES');
      definicion_CTX_COMPRA.enDolares = false;
      definicion_CTX_COMPRA.moneda = 'PEN';
      definicion_CTX_COMPRA.tipoCambio = 0;
    }
  });
  //#endregion TIPO CAMBIO

  //#region RESUMEN DE MONTOS SOLES
  const sumaTotal = $(() => {
    const bI = definicion_CTX_COMPRA.baseImponiblePEN ? definicion_CTX_COMPRA.baseImponiblePEN : 0;
    const igv = definicion_CTX_COMPRA.igvPEN ? definicion_CTX_COMPRA.igvPEN : 0;
    const adqNoG = definicion_CTX_COMPRA.adquisicionesNoGravadasPEN ? definicion_CTX_COMPRA.adquisicionesNoGravadasPEN : 0;
    const isc = definicion_CTX_COMPRA.iscPEN ? definicion_CTX_COMPRA.iscPEN : 0;
    const icbp = definicion_CTX_COMPRA.icbpPEN ? definicion_CTX_COMPRA.icbpPEN : 0;
    const otros = definicion_CTX_COMPRA.otrosPEN ? definicion_CTX_COMPRA.otrosPEN : 0;

    // console.log('montos RESUMEN', parseFloat(bI), igv, adqNoG, isc, icbp, otros);
    // console.log('montos RESUMEN', bI, igv, adqNoG, isc, icbp, otros);

    definicion_CTX_COMPRA.totalPEN =
      parseFloat(bI) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros);
    // definicion_CTX_COMPRA.totalPEN = formatearMonedaPEN(
    //   parseFloat(bI) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros)
    // );
    console.log('LA SUMA definicion_CTX_COMPRA.totalPEN ', definicion_CTX_COMPRA.totalPEN);
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.baseImponiblePEN);
    //
    console.log('definicion_CTX_COMPRA.baseImponiblePEN ', definicion_CTX_COMPRA.baseImponiblePEN);
    const bI = definicion_CTX_COMPRA.baseImponiblePEN ? parseFloat(definicion_CTX_COMPRA.baseImponiblePEN) : 0;
    const elIGV = definicion_CTX_COMPRA.elIgv ? parseFloat(definicion_CTX_COMPRA.elIgv) : 0;

    console.log('bIbIbIbIbIbIbI', bI);
    console.log('elIGVelIGVelIGVelIGV', elIGV);

    if (ini.value > 0) {
      console.log('elIGVelIGVelIGVelIGV./././././././../');
      definicion_CTX_COMPRA.igvPEN = (bI * elIGV) / 100;
      console.log('definicion_CTX_COMPRA.igvPEN./././././././../', definicion_CTX_COMPRA.igvPEN);
    }

    sumaTotal();
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.elIgv);
    console.log('***************ENTRO A EL IGV***********************');
    //
    if (definicion_CTX_COMPRA.enDolares) {
      console.log('***************ENTRO A EL IGV***USD********************');
      const bI = definicion_CTX_COMPRA.baseImponibleUSD ? parseFloat(definicion_CTX_COMPRA.baseImponibleUSD) : 0;
      const elIGV = definicion_CTX_COMPRA.elIgv ? parseFloat(definicion_CTX_COMPRA.elIgv) : 0;
      console.log('***************ENTRO A EL IGV***USD****', bI, elIGV);
      if (ini.value > 0) {
        console.log('***************ENTRO A EL IGV***USD////', bI, elIGV);
        definicion_CTX_COMPRA.igvUSD = (bI * elIGV) / 100;
        console.log('***************ENTRO A EL IGV***USD$$$$', bI, elIGV);
        // sumaTotalDOLARES();
        const bIUSD = definicion_CTX_COMPRA.baseImponibleUSD ? definicion_CTX_COMPRA.baseImponibleUSD : 0;
        const igv = definicion_CTX_COMPRA.igvUSD ? definicion_CTX_COMPRA.igvUSD : 0;
        const adqNoG = definicion_CTX_COMPRA.adquisicionesNoGravadasUSD ? definicion_CTX_COMPRA.adquisicionesNoGravadasUSD : 0;
        const isc = definicion_CTX_COMPRA.iscUSD ? definicion_CTX_COMPRA.iscUSD : 0;
        const icbp = definicion_CTX_COMPRA.icbpUSD ? definicion_CTX_COMPRA.icbpUSD : 0;
        const otros = definicion_CTX_COMPRA.otrosUSD ? definicion_CTX_COMPRA.otrosUSD : 0;
        definicion_CTX_COMPRA.totalUSD =
          parseFloat(bIUSD) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros);
        console.log('***************ENTRO A EL IGV***USD!!!!', bI, elIGV);
        //conversion
        definicion_CTX_COMPRA.igvPEN = ((bI * elIGV) / 100) * parseFloat(definicion_CTX_COMPRA.tipoCambio);
        // sumaTotal();
        console.log('***************ENTRO A EL IGV***USD****', bI, elIGV);
      }
    } else {
      console.log('***************ENTRO A EL IGV***PEN********************');
      const bI = definicion_CTX_COMPRA.baseImponiblePEN ? parseFloat(definicion_CTX_COMPRA.baseImponiblePEN) : 0;
      const elIGV = definicion_CTX_COMPRA.elIgv ? parseFloat(definicion_CTX_COMPRA.elIgv) : 0;

      if (ini.value > 0) {
        definicion_CTX_COMPRA.igvPEN = (bI * elIGV) / 100;
      }

      sumaTotal();
    }
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.adquisicionesNoGravadasPEN);
    //
    sumaTotal();
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.iscPEN);
    //
    sumaTotal();
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.icbpPEN);
    //
    sumaTotal();
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.otrosPEN);
    //
    sumaTotal();
  });
  //#endregion RESUMEN DE MONTOS SOLES

  //#region RESUMEN DE MONTOS DOLARES
  const sumaTotalDOLARES = $(() => {
    // console.log('montos RESUMEN..**DOLARES--');
    const bI = definicion_CTX_COMPRA.baseImponibleUSD ? definicion_CTX_COMPRA.baseImponibleUSD : 0;
    const igv = definicion_CTX_COMPRA.igvUSD ? definicion_CTX_COMPRA.igvUSD : 0;
    const adqNoG = definicion_CTX_COMPRA.adquisicionesNoGravadasUSD ? definicion_CTX_COMPRA.adquisicionesNoGravadasUSD : 0;
    const isc = definicion_CTX_COMPRA.iscUSD ? definicion_CTX_COMPRA.iscUSD : 0;
    const icbp = definicion_CTX_COMPRA.icbpUSD ? definicion_CTX_COMPRA.icbpUSD : 0;
    const otros = definicion_CTX_COMPRA.otrosUSD ? definicion_CTX_COMPRA.otrosUSD : 0;
    // console.log('montos RESUMEN', parseFloat(bI), igv, adqNoG, isc, icbp, otros);
    // console.log('montos RESUMEN..**DOLARES', bI, igv, adqNoG, isc, icbp, otros);
    definicion_CTX_COMPRA.totalUSD =
      parseFloat(bI) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros);
    // definicion_CTX_COMPRA.totalPEN = formatearMonedaPEN(
    //   parseFloat(bI) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros)
    // );
    // console.log('LA SUMA definicion_CTX_COMPRA.totalUSD ', definicion_CTX_COMPRA.totalUSD);
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.baseImponibleUSD);
    //
    if (definicion_CTX_COMPRA.enDolares) {
      console.log('definicion_CTX_COMPRA.baseImponibleUSD ', definicion_CTX_COMPRA.baseImponibleUSD);
      const bI = definicion_CTX_COMPRA.baseImponibleUSD ? parseFloat(definicion_CTX_COMPRA.baseImponibleUSD) : 0;
      const elIGV = definicion_CTX_COMPRA.elIgv ? parseFloat(definicion_CTX_COMPRA.elIgv) : 0;

      console.log('bIbIbIbIbIbIbI USD ', bI);
      console.log('elIGVelIGVelIGVelIGV USD ', elIGV);

      if (ini.value > 0) {
        console.log('elIGVelIGVelIGVelIGV USD ./././././././../');
        definicion_CTX_COMPRA.igvUSD = (bI * elIGV) / 100;
        console.log('definicion_CTX_COMPRA.igvUSD./././././././../', definicion_CTX_COMPRA.igvUSD);
      }

      sumaTotalDOLARES();

      //conversion
      const conversion = bI * parseFloat(definicion_CTX_COMPRA.tipoCambio);
      definicion_CTX_COMPRA.baseImponiblePEN = conversion;
    }
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.adquisicionesNoGravadasUSD);
    //
    if (definicion_CTX_COMPRA.enDolares) {
      sumaTotalDOLARES();
      //conversion
      const bI = definicion_CTX_COMPRA.adquisicionesNoGravadasUSD
        ? parseFloat(definicion_CTX_COMPRA.adquisicionesNoGravadasUSD)
        : 0;
      const conversion = bI * parseFloat(definicion_CTX_COMPRA.tipoCambio);
      definicion_CTX_COMPRA.adquisicionesNoGravadasPEN = conversion;
    }
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.iscUSD);
    //
    if (definicion_CTX_COMPRA.enDolares) {
      sumaTotalDOLARES();
      //conversion
      const bI = definicion_CTX_COMPRA.iscUSD ? parseFloat(definicion_CTX_COMPRA.iscUSD) : 0;
      const conversion = bI * parseFloat(definicion_CTX_COMPRA.tipoCambio);
      definicion_CTX_COMPRA.iscPEN = conversion;
    }
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.icbpUSD);
    //
    if (definicion_CTX_COMPRA.enDolares) {
      sumaTotalDOLARES();
      //conversion
      const bI = definicion_CTX_COMPRA.icbpUSD ? parseFloat(definicion_CTX_COMPRA.icbpUSD) : 0;
      const conversion = bI * parseFloat(definicion_CTX_COMPRA.tipoCambio);
      definicion_CTX_COMPRA.icbpPEN = conversion;
    }
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_COMPRA.otrosUSD);
    //
    if (definicion_CTX_COMPRA.enDolares) {
      sumaTotalDOLARES();
      //conversion
      const bI = definicion_CTX_COMPRA.otrosUSD ? parseFloat(definicion_CTX_COMPRA.otrosUSD) : 0;
      const conversion = bI * parseFloat(definicion_CTX_COMPRA.tipoCambio);
      definicion_CTX_COMPRA.otrosPEN = conversion;
    }
  });
  //#endregion RESUMEN DE MONTOS DOLARES

  //#region VALIDAR NUMERO
  // const validar_inputNumero = $((e: any) => {
  //   console.log('onKD--validando', e);
  //   const tecla = e.key ? e.key : e.which;
  //   if (tecla === 'Backspace') {
  //     console.log(tecla);
  //     return true;
  //   }

  //   // Patrón de entrada, en este caso solo acepta numeros
  //   const patron = /[0-9]/;
  //   console.log('onKD--tecla valido?', tecla, patron.test(tecla));
  //   return patron.test(tecla);
  // });
  // let validar_inputNumero_P = $((e: any): boolean => {
  //   console.log('ONKP--validando', e);
  //   const tecla = e.key ? e.key : e.which;
  //   if (tecla === 'Backspace') {
  //     console.log(tecla);
  //     return true;
  //   }

  //   // Patrón de entrada, en este caso solo acepta numeros
  //   const patron = /[0-9]/;
  //   console.log('ONKP--tecla valido?', tecla, patron.test(tecla));
  //   return patron.test(tecla);
  // });

  //#endregion VALIDAR NUMERO

  //#region REGISTRAR COMPRA
  const registrarCompra = $(async () => {
    if (definicion_CTX_COMPRA.periodo.toString() === '') {
      alert('Ingrese el periodo');
      document.getElementById('in_Periodo')?.focus();
      return;
    }
    if (definicion_CTX_COMPRA.codigoTCP === '') {
      alert('Ingrese el TCP');
      document.getElementById('se_tcp')?.focus();
      return;
    }
    if (definicion_CTX_COMPRA.fecha === '') {
      alert('Ingrese la fecha');
      document.getElementById('in_Fecha')?.focus();
      return;
    }
    if (definicion_CTX_COMPRA.conFechaVencimiento === true) {
      if (definicion_CTX_COMPRA.fechaVencimiento === '') {
        alert('Ingrese el fecha vencimiento');
        document.getElementById('in_FechaVencimiento')?.focus();
        return;
      }
    }
    if (definicion_CTX_COMPRA.serie === '') {
      alert('Ingrese la serie');
      document.getElementById('in_Serie')?.focus();
      return;
    }
    if (definicion_CTX_COMPRA.numero.toString() === '' || definicion_CTX_COMPRA.numero.toString() === 'NaN') {
      alert('Ingrese el número valido');
      document.getElementById('in_Numero')?.focus();
      return;
    }
    if (!parseInt(definicion_CTX_COMPRA.numero.toString())) {
      alert('No es un número valido, ingrese el número ' + parseInt(definicion_CTX_COMPRA.numero.toString()));
      document.getElementById('in_Numero')?.focus();
      return;
    } else {
      console.log('num', parseInt(definicion_CTX_COMPRA.numero.toString()));
    }
    if (definicion_CTX_COMPRA.codigoTipoDocumentoIdentidad === '') {
      alert('Identifique al proveedor :|');
      document.getElementById('in_NumeroDocumentoIdentidad')?.focus();
      return;
    }
    if (definicion_CTX_COMPRA.numeroIdentidad === '') {
      alert('Identifique al proveedor (N.I.)');
      document.getElementById('img_buscarProveedor')?.focus();
      return;
    }
    if (definicion_CTX_COMPRA.razonSocialNombre === '') {
      alert('Identifique al proveedor (R.S.)');
      document.getElementById('img_buscarProveedor')?.focus();
      return;
    }
    if (definicion_CTX_COMPRA.enDolares) {
      if (definicion_CTX_COMPRA.tipoCambio === '') {
        alert('Ingrese el tipo de cambio');
        document.getElementById('in_TipoCambio')?.focus();
        return;
      }
    }
    if (definicion_CTX_COMPRA.tipoCompra === '') {
      alert('Ingrese el tipo de compra');
      document.getElementById('se_TipoCompra')?.focus();
      return;
    }
    if (definicion_CTX_COMPRA.baseImponiblePEN === '') {
      alert('Ingrese la base imponible o registre cero (0)');
      document.getElementById('in_BaseImponible')?.focus();
      return;
    }
    //
    console.log('definicion_CTX_COMPRA', definicion_CTX_COMPRA);
    //enviar datos al SERVIDOR
    const comp = await inUpCompra({
      idCompra: definicion_CTX_COMPRA._id,
      idGrupoEmpresarial: definicion_CTX_COMPRA.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_COMPRA.idEmpresa,
      idSucursal: definicion_CTX_COMPRA.idSucursal,
      idPeriodo: definicion_CTX_COMPRA.idPeriodo,
      periodo: definicion_CTX_COMPRA.periodo,

      ruc: definicion_CTX_COMPRA.ruc,
      empresa: definicion_CTX_COMPRA.empresa,
      direccion: definicion_CTX_COMPRA.direccion,

      codigoTCP: definicion_CTX_COMPRA.codigoTCP,
      descripcionTCP: definicion_CTX_COMPRA.descripcionTCP,
      serie: definicion_CTX_COMPRA.serie,
      numero: parseInt(definicion_CTX_COMPRA.numero.toString()),

      fecha: definicion_CTX_COMPRA.fecha,
      conFechaVencimiento: definicion_CTX_COMPRA.conFechaVencimiento,
      fechaVencimiento: definicion_CTX_COMPRA.fechaVencimiento,
      anioDUAoDSI: definicion_CTX_COMPRA.anioDUAoDSI,

      idProveedor: definicion_CTX_COMPRA.idProveedor,
      codigoTipoDocumentoIdentidad: definicion_CTX_COMPRA.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_COMPRA.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_COMPRA.numeroIdentidad,
      razonSocialNombre: definicion_CTX_COMPRA.razonSocialNombre,
      email: definicion_CTX_COMPRA.email,

      idElIgv: definicion_CTX_COMPRA.idElIgv,
      elIgv: definicion_CTX_COMPRA.elIgv,

      enDolares: definicion_CTX_COMPRA.enDolares,
      moneda: definicion_CTX_COMPRA.moneda,
      tipoCambio: definicion_CTX_COMPRA.tipoCambio.replace(',', ''),

      tipoCompra: definicion_CTX_COMPRA.tipoCompra,

      baseImponiblePEN: definicion_CTX_COMPRA.baseImponiblePEN.replace(',', ''),
      // igvPEN: definicion_CTX_COMPRA.igvPEN.replace(',', ''),
      igvPEN: definicion_CTX_COMPRA.igvPEN,
      adquisicionesNoGravadasPEN: definicion_CTX_COMPRA.adquisicionesNoGravadasPEN.replace(',', ''),
      iscPEN: definicion_CTX_COMPRA.iscPEN.replace(',', ''),
      icbpPEN: definicion_CTX_COMPRA.icbpPEN.replace(',', ''),
      otrosPEN: definicion_CTX_COMPRA.otrosPEN.replace(',', ''),
      // totalPEN: definicion_CTX_COMPRA.totalPEN.replace(',', ''),
      totalPEN: definicion_CTX_COMPRA.totalPEN,

      fechaReferencia: definicion_CTX_COMPRA.fechaReferencia,
      tipoReferencia: definicion_CTX_COMPRA.tipoReferencia,
      serieReferencia: definicion_CTX_COMPRA.serieReferencia,
      numeroReferencia: definicion_CTX_COMPRA.numeroReferencia,

      usuario: parametrosGlobales.usuario,
    });

    console.log('la comp', comp);

    if (comp.status === 400) {
      alert('Falla al registrar la compra.' + comp.message);
      return;
    }

    //
    ctx_index_compra.grabo_Compra = true;
    ctx_index_compra.mostrarPanelCompra = false;
  });
  //#endregion REGISTRAR COMPRA

  return (
    <div
      style={{
        // width: 'clamp(min(10vw, 20rem),800px, max(90vw, 55rem))',
        // width: 'clamp(min(5vw, 4rem),800px, max(90vw, 55rem))',
        // width: 'clamp(60px,800px, 1080px)',
        width: 'clamp(330px, 86%, 800px)',
        // width: 'auto',
        padding: '2px',
        background: `${definicion_CTX_COMPRA.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : ''}`,
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_compra.mostrarPanelCompra = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log(
              'definicion_CTX_COMPRA - props.igvPorDefault',
              definicion_CTX_COMPRA
              // props.losIgvsCompra,
              // props.igvPorDefault
            );
            // console.log('props.igvPorDefault', props.igvPorDefault);
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('props.losIgvsCompra', props.losIgvsCompra);
          })}
        /> */}
        <ImgButton src={images.see} alt="Icono de cerrar" height={16} width={16} title="Cerrar el formulario" />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>Compra</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE LA COMPRA */}
          <div>
            {/* ----------------------------------------------------- */}
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
                  value={definicion_CTX_COMPRA.periodo}
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
            {/* TCP */}
            <div class="form-control">
              <label>TCP</label>
              <div class="form-control form-agrupado">
                <ElSelect
                  id={'se_tcp'}
                  valorSeleccionado={definicion_CTX_COMPRA.descripcionTCP}
                  registros={LosTCPcargados.value}
                  registroID={'codigo'}
                  registroTEXT={'descripcion'}
                  seleccione={'-- Seleccione TCP --'}
                  onChange={$(() => {
                    console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢 ElSelect se_tcp');
                    const elSelec = document.getElementById('se_tcp') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    console.log('?', elIdx, elSelec[elIdx].id);
                    definicion_CTX_COMPRA.codigoTCP = elSelec[elIdx].id;
                    if (definicion_CTX_COMPRA.codigoTCP === '') {
                      definicion_CTX_COMPRA.descripcionTCP = '';
                    } else {
                      definicion_CTX_COMPRA.descripcionTCP = elSelec.value;
                      // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Fecha') as HTMLSelectElement)?.focus();
                    }
                  })}
                />
              </div>
            </div>
            {/* Fecha */}
            <div class="form-control">
              <label>Fecha</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Fecha"
                  style={{ width: '100%' }}
                  type="date"
                  autoFocus
                  placeholder="Add fecha"
                  max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_COMPRA.fecha}
                  onInput$={(e) => {
                    definicion_CTX_COMPRA.fecha = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('chbx_fechaVencimiento') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
            </div>
            {/* Fecha de VENCIMIENTO*/}
            <div class="form-control">
              <label>Fecha de vencimiento</label>
              <div class="form-control form-agrupado">
                <input
                  id="chbx_fechaVencimiento"
                  // style={{ width: '100%' }}
                  type="checkbox"
                  placeholder="Fecha de vencimiento"
                  checked={definicion_CTX_COMPRA.conFechaVencimiento}
                  onChange$={(e) => {
                    definicion_CTX_COMPRA.conFechaVencimiento = (e.target as HTMLInputElement).checked;
                    // if (definicion_CTX_COMPRA.conFechaVencimiento) {
                    //   document.getElementById('in_FechaVencimiento')?.disabled;
                    //   //definicion_CTX_COMPRA.conFechaVencimiento = false;
                    // }
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_FechaVencimiento')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <input
                  id="in_FechaVencimiento"
                  style={{ width: '100%' }}
                  type="date"
                  autoFocus
                  placeholder="Add fecha"
                  disabled={definicion_CTX_COMPRA.conFechaVencimiento ? false : true}
                  value={definicion_CTX_COMPRA.fechaVencimiento}
                  onInput$={(e) => {
                    definicion_CTX_COMPRA.fechaVencimiento = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Anio_DUA_DSI') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
            </div>
            {/* Año DUA o DSI */}
            <div class="form-control">
              <label>Año DUA o DSI</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Anio_DUA_DSI"
                  style={{ width: '100%' }}
                  type="number"
                  autoFocus
                  placeholder="Add año DUA o DSI"
                  value={definicion_CTX_COMPRA.anioDUAoDSI}
                  onInput$={(e) => {
                    definicion_CTX_COMPRA.anioDUAoDSI = parseInt((e.target as HTMLInputElement).value.trim());
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Serie') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
            </div>
            {/* Serie */}
            <div class="form-control">
              <label>Serie</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Serie"
                  style={{ width: '100%' }}
                  type="text"
                  autoFocus
                  placeholder="Add serie"
                  value={definicion_CTX_COMPRA.serie}
                  onInput$={(e) => {
                    definicion_CTX_COMPRA.serie = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Numero') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
            </div>
            {/* Número */}
            <div class="form-control">
              <label>Número</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Numero"
                  style={{ width: '100%' }}
                  type="text"
                  // pattern="[0-9]*"
                  // pattern="[0-9]{1,25}"
                  // required
                  // title="Solo números"
                  // onDrop$={() => {
                  //   return false;
                  // }}
                  // onPaste$={(event) => {
                  //   // event.preventDefault();
                  //   event.stopPropagation();
                  // }}
                  placeholder="Add número"
                  value={definicion_CTX_COMPRA.numero}
                  onChange$={(e) => {
                    console.log('onChange', e);

                    // if (!validar_inputNumero(e)) {
                    //   console.log('carater no validado...onChange', e);
                    //   // return;
                    // } else {
                    // if (esNumero.value) {
                    //   console.log('onChange...TRUE');
                    definicion_CTX_COMPRA.numero = parseInt((e.target as HTMLInputElement).value.trim());
                    // } else {
                    //   definicion_CTX_COMPRA.numero = 0;
                    //   (e.target as HTMLInputElement).value = '';
                    // }

                    // }
                  }}
                  // onKeyDown$={(e) => {
                  //   console.log('onKeyDown', e);
                  //   const tecla: any = e.key ? e.key : e.which;
                  //   const patron = /[0-9]/;
                  //   console.log('onKD--tecla valido?', tecla, patron.test(tecla));

                  //   esNumero.value = patron.test(tecla);
                  //   // esNumero.value = validar_inputNumero(e);
                  //   // e.stopPropagation();
                  //   // if (e.charCode >= 48 && e.charCode <= 57) {
                  //   //   return;
                  //   // } else {
                  //   //   e.charCode = 0;
                  //   // }
                  //   // return e.charCode >= 48 && e.charCode <= 57;
                  //   // let esNumero = validar_inputNumero(e);
                  //   // if (!esNumero) {
                  //   //   console.log('carater no validado...onKeyDown', e, esNumero);
                  //   //   return;
                  //   // } else {
                  //   //   console.log('carater VALIDO...onKeyDown', e, esNumero);
                  //   // }
                  // }}
                  // onKeyDownCapture$={(e) => {
                  //   console.log('onKeyDownCapture', e);
                  // }}
                  // onKeyUp$={(e) => {
                  //   console.log('onKeyUp', e);
                  // }}
                  onKeyPress$={(e) => {
                    console.log('onKeyPress', e);
                    // const tecla: any = e.key ? e.key : e.which;
                    // const patron = /[0-9]/;
                    // console.log('ONKP--tecla valido?', tecla, patron.test(tecla));

                    // esNumero.value = patron.test(tecla);

                    // esNumero.value = validar_inputNumero_P(e);
                    // e.stopPropagation();
                    // if (e.charCode >= 48 && e.charCode <= 57) {
                    //   return;
                    // } else {
                    //   keypress = true;
                    // }
                    if (e.key === 'Enter') {
                      (document.getElementById('se_TipoDocumentoLiteral') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL PROVEEDOR */}
          <div>
            {/* tipo de documento identidad*/}
            <div class="form-control">
              <label>Tipo documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="se_TipoDocumentoLiteral"
                  // value={6}
                  // value={definicion_CTX_COMPRA.tipoDocumentoIdentidad}
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
                    definicion_CTX_COMPRA.codigoTipoDocumentoIdentidad = elOption.id;
                    definicion_CTX_COMPRA.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                  }}
                  // style={{ width: '100%' }}
                >
                  <option id="1" value="DNI" selected={definicion_CTX_COMPRA.tipoDocumentoIdentidad === 'DNI'}>
                    DNI
                  </option>
                  <option id="6" value="RUC" selected={definicion_CTX_COMPRA.tipoDocumentoIdentidad === 'RUC'}>
                    RUC
                  </option>
                  <option id="4" value="C.EXT" selected={definicion_CTX_COMPRA.tipoDocumentoIdentidad === 'C.EXT'}>
                    C.EXT
                  </option>
                </select>
                <ImgButton
                  id="img_buscarProveedor"
                  src={images.searchPLUS}
                  alt="Icono de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                  // onClick={buscarCliente}
                  onClick={$(() => {
                    definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBuscarPersona = true;
                  })}
                />
              </div>
            </div>
            {definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBuscarPersona && (
              <div class="modal">
                <BuscarPersona soloPersonasNaturales={false} seleccionar="proveedor" contexto="new_edit_compra" rol="proveedor" />
              </div>
            )}
            {/* numero identidad*/}
            <div class="form-control">
              <label>Número identidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_NumeroDocumentoIdentidad"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Add número identidad"
                  value={definicion_CTX_COMPRA.numeroIdentidad}
                  onChange$={(e) => (definicion_CTX_COMPRA.numeroIdentidad = (e.target as HTMLInputElement).value)}
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
              </div>
            </div>
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <label>Razón social / Nombre</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_NombreProveedor"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social / Nombre"
                  value={definicion_CTX_COMPRA.razonSocialNombre}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            {/* <div class="form-control">
              <label>IGV (%)</label>
              <div class="form-control form-agrupado">
                <input type="text" id="inputIGV" disabled value={definicion_CTX_COMPRA.igv + ' %'} />
              </div>
            </div> */}
            {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
            <div class="form-control">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '3px' }}>
                <input
                  type="checkbox"
                  id="chbx_TipoCambio"
                  checked={definicion_CTX_COMPRA.enDolares ? true : false}
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
                  for="chbx_TipoCambio"
                  // onClick$={
                  //   (document.getElementById('checkboxTipoCambio')?.checked = !document.getElementById('checkboxTipoCambio'))
                  // }
                >
                  Tipo Cambio (USD)
                </label>
              </div>
              <div class="form-control form-agrupado">
                <input
                  id="in_TipoCambio"
                  type="text"
                  placeholder="Tipo de cambio"
                  style={{ width: '100%' }}
                  value={definicion_CTX_COMPRA.tipoCambio}
                  disabled
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
        </div>
        <div>
          {/* ----------------------------------------------------- */}
          {/* RESUMEN DE MONTOS */}
          <div>
            {/* TIPO DE COMPRA */}
            <div class="form-control">
              <label>TIPO DE COMPRA</label>
              <div class="form-control form-agrupado">
                <select
                  id="se_TipoCompra"
                  // style={{ width: '100%' }}
                  onChange$={(e) => {
                    definicion_CTX_COMPRA.tipoCompra = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value={'A'} selected={definicion_CTX_COMPRA.tipoCompra === 'A'}>
                    Exclusivamente a operaciones gravadas y/o de exportación. (Derecho a crédito fiscal)
                  </option>
                  <option value={'B'} selected={definicion_CTX_COMPRA.tipoCompra === 'B'}>
                    Operaciones gravadas y/o de exportación y a operaciones no gravadas. (Derecho a crédito fiscal)
                  </option>
                  <option value={'C'} selected={definicion_CTX_COMPRA.tipoCompra === 'C'}>
                    No estar destinadas a operaciones gravadas y/o de exportación. (No derecho a crédito fiscal)
                  </option>
                </select>
              </div>
            </div>
            {/* Base imponible */}
            <div class="form-control">
              <label>Base imponible</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  style={{ width: '100%' }}
                  id="in_BaseImponible"
                  placeholder="Base imponible"
                  value={
                    definicion_CTX_COMPRA.enDolares
                      ? definicion_CTX_COMPRA.baseImponibleUSD
                      : definicion_CTX_COMPRA.baseImponiblePEN
                  }
                  onChange$={(e) => {
                    definicion_CTX_COMPRA.enDolares
                      ? (definicion_CTX_COMPRA.baseImponibleUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                      : (definicion_CTX_COMPRA.baseImponiblePEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                    console.log('onChange..bI', definicion_CTX_COMPRA.baseImponiblePEN);
                  }}
                  onKeyUp$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_descripcionIN_MICE')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
              </div>
            </div>
            {/* IGV */}
            <div class="form-control">
              <label>IGV</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  id="in_IGV"
                  style={{ width: '100%' }}
                  disabled
                  placeholder="IGV"
                  value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.igvUSD : definicion_CTX_COMPRA.igvPEN}
                />
                <ElSelect
                  id={'se_igv'}
                  // valorSeleccionado={definicion_CTX_COMPRA.elIgv}
                  valorSeleccionado={
                    parseFloat(definicion_CTX_COMPRA.elIgv)
                    // definicion_CTX_COMPRA._id === '' ? definicion_CTX_COMPRA.elIgv : parseFloat(definicion_CTX_COMPRA.elIgv)
                  }
                  // valorSeleccionado={18}
                  registros={LosIGVscargados.value}
                  // registros={props.losIgvsCompra}
                  registroID={'_id'}
                  registroTEXT={'igv'}
                  textoAdicional=" %"
                  seleccione={'-- Seleccione igv --'}
                  onChange={$(() => {
                    console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢 change select');
                    const elSelec = document.getElementById('se_igv') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    console.log('?', elIdx, elSelec[elIdx].id);
                    definicion_CTX_COMPRA.idElIgv = elSelec[elIdx].id;
                    if (definicion_CTX_COMPRA.idElIgv === '') {
                      definicion_CTX_COMPRA.elIgv = ''; // parseInt('');
                    } else {
                      definicion_CTX_COMPRA.elIgv = elSelec.value; /// parseInt(elSelec.value);
                      // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_IGV') as HTMLSelectElement)?.focus();
                    }
                  })}
                />
              </div>
            </div>
            {/* Adquisiciones No Gravadas */}
            <div class="form-control">
              <label>Adquisiciones No Gravadas</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  id="in_AdquisicionesNoGravadas"
                  style={{ width: '100%' }}
                  placeholder="Adquisiciones No Gravadas"
                  value={
                    definicion_CTX_COMPRA.enDolares
                      ? definicion_CTX_COMPRA.adquisicionesNoGravadasUSD
                      : definicion_CTX_COMPRA.adquisicionesNoGravadasPEN
                  }
                  onChange$={(e) => {
                    definicion_CTX_COMPRA.enDolares
                      ? (definicion_CTX_COMPRA.adquisicionesNoGravadasUSD = (e.target as HTMLInputElement).value
                          .trim()
                          .toUpperCase())
                      : (definicion_CTX_COMPRA.adquisicionesNoGravadasPEN = (e.target as HTMLInputElement).value
                          .trim()
                          .toUpperCase());
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_ISC')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
              </div>
            </div>
            {/* ISC */}
            <div class="form-control">
              <label>ISC</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  id="in_ISC"
                  style={{ width: '100%' }}
                  placeholder="ISC"
                  value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.iscUSD : definicion_CTX_COMPRA.iscPEN}
                  onChange$={(e) => {
                    definicion_CTX_COMPRA.enDolares
                      ? (definicion_CTX_COMPRA.iscUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                      : (definicion_CTX_COMPRA.iscPEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_ICBP')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
              </div>
            </div>
            {/* ICBP */}
            <div class="form-control">
              <label>ICBP</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  id="in_ICBP"
                  style={{ width: '100%' }}
                  placeholder="ICBP"
                  value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.icbpUSD : definicion_CTX_COMPRA.icbpPEN}
                  onChange$={(e) => {
                    definicion_CTX_COMPRA.enDolares
                      ? (definicion_CTX_COMPRA.icbpUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                      : (definicion_CTX_COMPRA.icbpPEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_Otros')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
              </div>
            </div>
            {/* Otros */}
            <div class="form-control">
              <label>Otros</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  id="in_Otros"
                  style={{ width: '100%' }}
                  placeholder="Otros"
                  value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.otrosUSD : definicion_CTX_COMPRA.otrosPEN}
                  onChange$={(e) => {
                    definicion_CTX_COMPRA.enDolares
                      ? (definicion_CTX_COMPRA.otrosUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                      : (definicion_CTX_COMPRA.otrosPEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('bu_RegistrarDocumentoIN_MICE')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
              </div>
            </div>
            {/* Total */}
            <div class="form-control">
              <label>Total</label>
              <div class="form-control form-agrupado">
                <input
                  type="text"
                  id="in_Total"
                  style={{ width: '100%' }}
                  placeholder="Total"
                  disabled
                  value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.totalUSD : definicion_CTX_COMPRA.totalPEN}
                />
              </div>
            </div>

            <hr style={{ margin: '5px 0' }}></hr>
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="bu_RegistrarDocumentoIN_MICE"
          type="button"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          onClick$={() => registrarCompra()}
        />
      </div>
    </div>
  );
});
