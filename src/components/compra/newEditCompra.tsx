import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { CTX_INDEX_COMPRA } from "~/routes/(compras)/compra";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
import ElSelect from "../system/elSelect";
import type { ICompra } from "~/interfaces/iCompra";
import { loadTiposComprobantePago } from "~/apis/sunat.api";
import type { IPersona } from "~/interfaces/iPersona";
import BuscarPersona from "../miscelanea/persona/buscarPersona";
// import { getTipoCambio } from '~/apis/apisExternas.api';
import { cerosALaIzquierda, elIdAuxiliar, ultimoDiaDelPeriodoX } from "~/functions/comunes";
import { getIgvsCompra, inUpCompra } from "~/apis/compra.api";
import { parametrosGlobales } from "~/routes/login";
import { getTipoCambio } from "~/apis/apisExternas.api";
import BuscarDetraccionPorcentaje from "./buscarDetraccionPorcentaje";
import BuscarCuentaContable from "../asientoContable/buscarCuentaContable";
import BorrarCuentaContable from "./borrarCuentaContable";
import ErrorDiferenciaPartidaDoble from "./errorDiferenciaPartidaDoble";
// import { isKeyObject } from 'util/types';

export const CTX_NEW_EDIT_COMPRA = createContextId<any>("new_editCompra");

export const CTX_PROVEEDOR = createContextId<IPersona>("proveedor");

export const CTX_COMPRA = createContextId<ICompra>("compra");

export default component$(
  (props: {
    addPeriodo: any;
    compraSeleccionada: any;
    agenteRetencion: boolean;
    ejercicio: number;
    asientoC: any;
    // idLD?: string;
  }) => {
    //#region DEFINICION CTX_NEW_EDIT_COMPRA
    const definicion_CTX_NEW_EDIT_COMPRA = useStore({
      mostrarPanelBuscarPersona: false,
      rol_Persona: "",
      selecciono_Persona: false,

      mostrarPanelBuscarDetraccionPorcentaje: false,

      mostrarPanelBuscarCuentaContable: false,

      mostrarPanelBorrarCuentaContable: false,
      borrar_idAuxiliarCuentaContable: 0,

      mostrarPanelErrorDiferenciaPartidaDoble: false,
      continuarConRegistroCompra: "",
    });
    useContextProvider(CTX_NEW_EDIT_COMPRA, definicion_CTX_NEW_EDIT_COMPRA);
    //#endregion DEFINICION CTX_NEW_EDIT_COMPRA

    //#region DEFINICION CTX_COMPRA
    const definicion_CTX_COMPRA = useStore<ICompra>(
      {
        _id: props.compraSeleccionada._id ? props.compraSeleccionada._id : "",
        idGrupoEmpresarial: props.compraSeleccionada.idGrupoEmpresarial ? props.compraSeleccionada.idGrupoEmpresarial : parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: props.compraSeleccionada.idEmpresa ? props.compraSeleccionada.idEmpresa : parametrosGlobales.idEmpresa,
        idSucursal: props.compraSeleccionada.idSucursal ? props.compraSeleccionada.idSucursal : parametrosGlobales.idSucursal,
        idPeriodo: props.compraSeleccionada.idPeriodo ? props.compraSeleccionada.idPeriodo : props.addPeriodo.idPeriodo,
        periodo: props.compraSeleccionada.periodo ? props.compraSeleccionada.periodo : props.addPeriodo.periodo,

        idAlmacen: props.compraSeleccionada.idAlmacen ? props.compraSeleccionada.idAlmacen : "",
        idIngresoAAlmacen: props.compraSeleccionada.idIngresoAAlmacen ? props.compraSeleccionada.idIngresoAAlmacen : "",

        ruc: props.compraSeleccionada.ruc ? props.compraSeleccionada.ruc : parametrosGlobales.RUC,
        empresa: props.compraSeleccionada.empresa ? props.compraSeleccionada.empresa : parametrosGlobales.RazonSocial,
        direccion: props.compraSeleccionada.direccion ? props.compraSeleccionada.direccion : parametrosGlobales.Direccion,

        codigoTCP: props.compraSeleccionada.codigoTCP ? props.compraSeleccionada.codigoTCP : "",
        descripcionTCP: props.compraSeleccionada.descripcionTCP ? props.compraSeleccionada.descripcionTCP : "",
        serie: props.compraSeleccionada.serie ? props.compraSeleccionada.serie : "",
        numero: props.compraSeleccionada.numero ? props.compraSeleccionada.numero : "",

        fecha: props.compraSeleccionada.fecha ? props.compraSeleccionada.fecha.substring(0, 10) : "",
        conFechaVencimiento: typeof props.compraSeleccionada.conFechaVencimiento !== "undefined" ? props.compraSeleccionada.conFechaVencimiento : false,
        fechaVencimiento: props.compraSeleccionada.fechaVencimiento ? props.compraSeleccionada.fechaVencimiento : "",
        anioDUAoDSI: props.compraSeleccionada.anioDUAoDSI ? props.compraSeleccionada.anioDUAoDSI : "",

        idProveedor: props.compraSeleccionada.idProveedor ? props.compraSeleccionada.idProveedor : "",
        codigoTipoDocumentoIdentidad: props.compraSeleccionada.codigoTipoDocumentoIdentidad ? props.compraSeleccionada.codigoTipoDocumentoIdentidad : "6",
        tipoDocumentoIdentidad: props.compraSeleccionada.tipoDocumentoIdentidad ? props.compraSeleccionada.tipoDocumentoIdentidad : "RUC",
        numeroIdentidad: props.compraSeleccionada.numeroIdentidad ? props.compraSeleccionada.numeroIdentidad : "",
        razonSocialNombre: props.compraSeleccionada.razonSocialNombre ? props.compraSeleccionada.razonSocialNombre : "",
        email: props.compraSeleccionada.email ? props.compraSeleccionada.email : "",

        idElIgv: props.compraSeleccionada.idElIgv ? props.compraSeleccionada.idElIgv : "",
        elIgv: props.compraSeleccionada.elIgv ? props.compraSeleccionada.elIgv.$numberDecimal : "",

        enDolares: typeof props.compraSeleccionada.enDolares !== "undefined" ? props.compraSeleccionada.enDolares : false,
        moneda: props.compraSeleccionada.moneda ? props.compraSeleccionada.moneda : "PEN",
        tipoCambio: props.compraSeleccionada.tipoCambio ? props.compraSeleccionada.tipoCambio.$numberDecimal : "",

        tipoCompra: props.compraSeleccionada.tipoCompra ? props.compraSeleccionada.tipoCompra : "A",
        //****************************************** */
        //***************SOLES******************** */
        baseImponiblePEN: props.compraSeleccionada.baseImponiblePEN ? props.compraSeleccionada.baseImponiblePEN.$numberDecimal : "",
        igvPEN: props.compraSeleccionada.igvPEN ? props.compraSeleccionada.igvPEN.$numberDecimal : "",
        adquisicionesNoGravadasPEN: props.compraSeleccionada.adquisicionesNoGravadasPEN
          ? props.compraSeleccionada.adquisicionesNoGravadasPEN.$numberDecimal
          : "",
        iscPEN: props.compraSeleccionada.iscPEN ? props.compraSeleccionada.iscPEN.$numberDecimal : "",
        icbpPEN: props.compraSeleccionada.icbpPEN ? props.compraSeleccionada.icbpPEN.$numberDecimal : "",
        otrosPEN: props.compraSeleccionada.otrosPEN ? props.compraSeleccionada.otrosPEN.$numberDecimal : "",
        totalPEN: props.compraSeleccionada.totalPEN ? props.compraSeleccionada.totalPEN.$numberDecimal : "",
        //****************************************** */
        //***************DOLARES******************** */
        baseImponibleUSD: props.compraSeleccionada.baseImponibleUSD ? props.compraSeleccionada.baseImponibleUSD.$numberDecimal : "",
        igvUSD: props.compraSeleccionada.igvUSD ? props.compraSeleccionada.igvUSD.$numberDecimal : "",
        adquisicionesNoGravadasUSD: props.compraSeleccionada.adquisicionesNoGravadasUSD
          ? props.compraSeleccionada.adquisicionesNoGravadasUSD.$numberDecimal
          : "",
        iscUSD: props.compraSeleccionada.iscUSD ? props.compraSeleccionada.iscUSD.$numberDecimal : "",
        icbpUSD: props.compraSeleccionada.icbpUSD ? props.compraSeleccionada.icbpUSD.$numberDecimal : "",
        otrosUSD: props.compraSeleccionada.otrosUSD ? props.compraSeleccionada.otrosUSD.$numberDecimal : "",
        totalUSD: props.compraSeleccionada.totalUSD ? props.compraSeleccionada.totalUSD.$numberDecimal : "",
        // //****************************************** */
        // //***************DETRACCION***************** */
        detraccion: typeof props.compraSeleccionada.detraccion !== "undefined" ? props.compraSeleccionada.detraccion : false,
        detraccionPorcentaje: props.compraSeleccionada.detraccionPorcentaje ? props.compraSeleccionada.detraccionPorcentaje.$numberDecimal : "",
        detraccionConstancia: props.compraSeleccionada.detraccionConstancia ? props.compraSeleccionada.detraccionConstancia : "",
        detraccionMontoPEN: props.compraSeleccionada.detraccionMontoPEN ? props.compraSeleccionada.detraccionMontoPEN.$numberDecimal : "",
        detraccionFecha: props.compraSeleccionada.detraccionFecha ? props.compraSeleccionada.detraccionFecha.substring(0, 10) : "",
        // //****************************************** */
        // //***************RETENCION****************** */
        agenteRetencion: props.compraSeleccionada.retencion ? props.compraSeleccionada.retencion : props.agenteRetencion.valueOf(),
        retencion: typeof props.compraSeleccionada.retencion !== "undefined" ? props.compraSeleccionada.retencion : false,
        retencionPorcentaje: props.compraSeleccionada.retencionPorcentaje ? props.compraSeleccionada.retencionPorcentaje.$numberDecimal : "",
        //***************REFERENCIA****************** */
        referenciaFecha: props.compraSeleccionada.referenciaFecha ? props.compraSeleccionada.referenciaFecha.substring(0, 10) : "",
        referenciaTipo: props.compraSeleccionada.referenciaTipo ? props.compraSeleccionada.referenciaTipo : "",
        referenciaSerie: props.compraSeleccionada.referenciaSerie ? props.compraSeleccionada.referenciaSerie : "",
        referenciaNumero: props.compraSeleccionada.referenciaNumero ? props.compraSeleccionada.referenciaNumero : "",
        //***************ASIENTO CONTABLE***************** */
        contabilizarOperaciones:
          typeof props.compraSeleccionada.contabilizarOperaciones !== "undefined"
            ? props.compraSeleccionada.contabilizarOperaciones
            : parametrosGlobales.contabilizarOperaciones,
        asientoContableObligatorio:
          typeof props.compraSeleccionada.asientoContableObligatorio === "undefined" ? true : props.compraSeleccionada.asientoContableObligatorio,
        asientoContable: props.compraSeleccionada.asientoContable ? props.compraSeleccionada.asientoContable : [],
        totalDebePEN: props.compraSeleccionada.totalDebePEN ? props.compraSeleccionada.totalDebePEN : -1,
        totalHaberPEN: props.compraSeleccionada.totalHaberPEN ? props.compraSeleccionada.totalHaberPEN : 0,
        totalDebeUSD: props.compraSeleccionada.totalDebeUSD ? props.compraSeleccionada.totalDebeUSD : -1,
        totalHaberUSD: props.compraSeleccionada.totalHaberUSD ? props.compraSeleccionada.totalHaberUSD : 0,

        usuarioCrea: props.compraSeleccionada.usuarioCrea ? props.compraSeleccionada.usuarioCrea : "",
        usuarioModifica: props.compraSeleccionada.usuarioModifica ? props.compraSeleccionada.usuarioModifica : "",
      },
      { deep: true }
    );
    useContextProvider(CTX_COMPRA, definicion_CTX_COMPRA);
    //#endregion DEFINICION CTX_COMPRA

    //#region DEFINICION CTX_PROVEEDOR
    const definion_CTX_PROVEEDOR = useStore<IPersona>({
      _id: "",
      codigoTipoDocumentoIdentidad: "",
      tipoDocumentoIdentidad: "",
      numeroIdentidad: "",
      razonSocialNombre: "",
      nombre: "",
      paterno: "",
      materno: "",
      activo: true,
    });
    useContextProvider(CTX_PROVEEDOR, definion_CTX_PROVEEDOR);
    //#endregion DEFINICION CTX_PROVEEDOR

    //#region CONTEXTO
    const ctx_index_compra = useContext(CTX_INDEX_COMPRA);
    //#endregion CONTEXTO

    //#region INICIALIZACION
    const ini = useSignal(0);
    const grabo = useSignal(false);

    const LosTCPcargados = useSignal([]);
    const LosIGVscargados = useSignal([]);

    const igvPorDefault = useStore({ idElIgv: "", elIgv: "" });

    const IMPUESTO: any = parametrosGlobales.asientoCompra.filter((ele: any) => ele.impuesto40_Total42 === true);
    const TOTAL: any = parametrosGlobales.asientoCompra.filter((ele: any) => ele.impuesto40_Total42 === false);

    // const ID_LIBRO_DIARIO = useSignal('');

    const idPlanContable = useSignal("");

    let sumaTOTAL_DEBER = 0;
    let sumaTOTAL_HABER = 0;

    const borrarCuentaContable = useStore({
      idAuxiliar: "",
      codigo: "",
      descripcion: "",
    });

    useTask$(async ({ track }) => {
      track(() => ini.value);
      // console.log('definicion_CTX_COMPRA.asientoContable 00', ini.value, definicion_CTX_COMPRA.asientoContable.target);
      if (ini.value === 1) {
        if (definicion_CTX_COMPRA.contabilizarOperaciones && definicion_CTX_COMPRA.asientoContable.length === 0) {
          if (IMPUESTO.length > 0) {
            definicion_CTX_COMPRA.asientoContable.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              item: 0,
              codigo: IMPUESTO[0].codigo,
              descripcion: IMPUESTO[0].descripcion,
              tipo: true,
              importe: 0,
            });
          }
          if (TOTAL.length > 0) {
            definicion_CTX_COMPRA.asientoContable.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              item: 0,
              codigo: TOTAL[0].codigo,
              descripcion: TOTAL[0].descripcion,
              tipo: false,
              importe: 0,
            });
          }

          // let lasCuentas: any = await getAsientoCompra({
          //   idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          //   idEmpresa: parametrosGlobales.idEmpresa,
          // });
          // lasCuentas = lasCuentas.data;
          // definicion_CTX_COMPRA.asientoContable = lasCuentas;
        }
      }
    });
    //#endregion INICIALIZACION

    //#region CARGAR LOS TCP
    const cargarLosTCP = $(async () => {
      const losTCP = await loadTiposComprobantePago();
      // console.log('losTCP', losTCP);
      LosTCPcargados.value = losTCP.data;
      // console.log(' LosTCPcargados.value', LosTCPcargados.value);
      ini.value++;
    });

    const cargarLosIGVsCompra = $(async () => {
      const LosIGVs = await getIgvsCompra({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
      });
      console.log("LosIGVs", LosIGVs);
      LosIGVscargados.value = LosIGVs.data;
      // console.log(' LosIGVscargados.value', LosIGVscargados.value);
      if (definicion_CTX_COMPRA._id === "") {
        const tre: any = LosIGVscargados.value.filter((docs: any) => docs.default === true);
        console.log("tretretretretretretretretre", tre);
        igvPorDefault.idElIgv = tre[0]._id;
        igvPorDefault.elIgv = tre[0].igv.$numberDecimal;
        definicion_CTX_COMPRA.idElIgv = tre[0]._id;
        definicion_CTX_COMPRA.elIgv = tre[0].igv.$numberDecimal;
        console.log("definicion_CTX_COMPRA.elIgv..........", definicion_CTX_COMPRA.elIgv);
      }
    });

    const convertirAValoresAbsolutos_Por_NC_ND = $(() => {
      // console.log('🥖🥖🥖🥖🥖convertirAValoresAbsolutos_Por_NC_ND');
      //****************************************** */
      //***************SOLES******************** */
      definicion_CTX_COMPRA.baseImponiblePEN = props.compraSeleccionada.baseImponiblePEN
        ? Math.abs(props.compraSeleccionada.baseImponiblePEN.$numberDecimal)
        : "";
      definicion_CTX_COMPRA.igvPEN = props.compraSeleccionada.igvPEN ? Math.abs(props.compraSeleccionada.igvPEN.$numberDecimal) : "";
      definicion_CTX_COMPRA.adquisicionesNoGravadasPEN = props.compraSeleccionada.adquisicionesNoGravadasPEN
        ? Math.abs(props.compraSeleccionada.adquisicionesNoGravadasPEN.$numberDecimal)
        : "";
      definicion_CTX_COMPRA.iscPEN = props.compraSeleccionada.iscPEN ? Math.abs(props.compraSeleccionada.iscPEN.$numberDecimal) : "";
      definicion_CTX_COMPRA.icbpPEN = props.compraSeleccionada.icbpPEN ? Math.abs(props.compraSeleccionada.icbpPEN.$numberDecimal) : "";
      definicion_CTX_COMPRA.otrosPEN = props.compraSeleccionada.otrosPEN ? Math.abs(props.compraSeleccionada.otrosPEN.$numberDecimal) : "";
      definicion_CTX_COMPRA.totalPEN = props.compraSeleccionada.totalPEN ? Math.abs(props.compraSeleccionada.totalPEN.$numberDecimal) : "";
      //****************************************** */
      //***************DOLARES******************** */
      definicion_CTX_COMPRA.baseImponibleUSD = props.compraSeleccionada.baseImponibleUSD
        ? Math.abs(props.compraSeleccionada.baseImponibleUSD.$numberDecimal)
        : "";
      definicion_CTX_COMPRA.igvUSD = props.compraSeleccionada.igvUSD ? Math.abs(props.compraSeleccionada.igvUSD.$numberDecimal) : "";
      definicion_CTX_COMPRA.adquisicionesNoGravadasUSD = props.compraSeleccionada.adquisicionesNoGravadasUSD
        ? Math.abs(props.compraSeleccionada.adquisicionesNoGravadasUSD.$numberDecimal)
        : "";
      definicion_CTX_COMPRA.iscUSD = props.compraSeleccionada.iscUSD ? Math.abs(props.compraSeleccionada.iscUSD.$numberDecimal) : "";
      definicion_CTX_COMPRA.icbpUSD = props.compraSeleccionada.icbpUSD ? Math.abs(props.compraSeleccionada.icbpUSD.$numberDecimal) : "";
      definicion_CTX_COMPRA.otrosUSD = props.compraSeleccionada.otrosUSD ? Math.abs(props.compraSeleccionada.otrosUSD.$numberDecimal) : "";
      definicion_CTX_COMPRA.totalUSD = props.compraSeleccionada.totalUSD ? Math.abs(props.compraSeleccionada.totalUSD.$numberDecimal) : "";
    });

    useTask$(({ track }) => {
      track(() => ini.value);
      if (ini.value === 0) {
        cargarLosTCP();
        cargarLosIGVsCompra();
        if (definicion_CTX_COMPRA.codigoTCP === "07" || definicion_CTX_COMPRA.codigoTCP === "08") {
          convertirAValoresAbsolutos_Por_NC_ND();
        }
      }

      // ini.value++; forma blucle infinito
      // cargarLosIGVsCompra();
    });
    //#endregion CARGAR LOS TCP

    //#region PROVEEDOR
    useTask$(({ track }) => {
      track(() => definicion_CTX_NEW_EDIT_COMPRA.selecciono_Persona);
      if (definicion_CTX_NEW_EDIT_COMPRA.selecciono_Persona && definicion_CTX_NEW_EDIT_COMPRA.rol_Persona === "proveedor") {
        // alert('evalua a la persona');
        definicion_CTX_COMPRA.idProveedor = definion_CTX_PROVEEDOR._id;
        definicion_CTX_COMPRA.codigoTipoDocumentoIdentidad = definion_CTX_PROVEEDOR.codigoTipoDocumentoIdentidad;
        definicion_CTX_COMPRA.tipoDocumentoIdentidad = definion_CTX_PROVEEDOR.tipoDocumentoIdentidad;
        definicion_CTX_COMPRA.numeroIdentidad = definion_CTX_PROVEEDOR.numeroIdentidad;
        definicion_CTX_COMPRA.razonSocialNombre = definion_CTX_PROVEEDOR.razonSocialNombre;

        definicion_CTX_NEW_EDIT_COMPRA.rol_Persona = "";
        definicion_CTX_NEW_EDIT_COMPRA.selecciono_Persona = false;
      }
    });
    //#endregion PROVEEDOR

    //#region TIPO CAMBIO
    const obtenerTipoCambio = $(async (e: HTMLInputElement) => {
      const checkTC = e.checked;
      if (checkTC) {
        definicion_CTX_COMPRA.enDolares = true;
        console.log("ingreso al tipo de cambio", definicion_CTX_COMPRA.fecha);
        let elTipoCambio = await getTipoCambio(definicion_CTX_COMPRA.fecha);
        console.log("ingreso al tipo de cambio elTipoCambio.data");
        elTipoCambio = elTipoCambio.data;
        console.log("elTipoCambio", elTipoCambio.venta);
        definicion_CTX_COMPRA.moneda = elTipoCambio.moneda;
        definicion_CTX_COMPRA.tipoCambio = elTipoCambio.venta;

        // definicion_CTX_COMPRA.moneda = 'USD';
        // definicion_CTX_COMPRA.tipoCambio = 3.713;
      } else {
        console.log("ingreso al NNNNOOOOOO enDOLARES");
        definicion_CTX_COMPRA.enDolares = false;
        definicion_CTX_COMPRA.moneda = "PEN";
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

      definicion_CTX_COMPRA.totalPEN = parseFloat(bI) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros);
      // definicion_CTX_COMPRA.totalPEN = formatearMonedaPEN(
      //   parseFloat(bI) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros)
      // );
      // console.log('LA SUMA definicion_CTX_COMPRA.totalPEN ', definicion_CTX_COMPRA.totalPEN);
      //DETRACCION
      if (definicion_CTX_COMPRA.detraccion) {
        if (definicion_CTX_COMPRA.detraccionPorcentaje) {
          const TT = definicion_CTX_COMPRA.totalPEN.$numberDecimal ? definicion_CTX_COMPRA.totalPEN.$numberDecimal : definicion_CTX_COMPRA.totalPEN;
          const PP = definicion_CTX_COMPRA.detraccionPorcentaje.$numberDecimal
            ? definicion_CTX_COMPRA.detraccionPorcentaje.$numberDecimal
            : definicion_CTX_COMPRA.detraccionPorcentaje;
          definicion_CTX_COMPRA.detraccionMontoPEN = (TT * PP) / 100;
        }
      }
    });

    useTask$(({ track }) => {
      track(() => definicion_CTX_COMPRA.baseImponiblePEN);
      //
      // console.log('definicion_CTX_COMPRA.baseImponiblePEN ', definicion_CTX_COMPRA.baseImponiblePEN);
      const bI = definicion_CTX_COMPRA.baseImponiblePEN ? parseFloat(definicion_CTX_COMPRA.baseImponiblePEN) : 0;
      const elIGV = definicion_CTX_COMPRA.elIgv ? parseFloat(definicion_CTX_COMPRA.elIgv) : 0;

      // console.log('bIbIbIbIbIbIbI', bI);
      // console.log('elIGVelIGVelIGVelIGV', elIGV);

      if (ini.value > 0) {
        // console.log('elIGVelIGVelIGVelIGV./././././././../');
        definicion_CTX_COMPRA.igvPEN = (bI * elIGV) / 100;
        // console.log('definicion_CTX_COMPRA.igvPEN./././././././../', definicion_CTX_COMPRA.igvPEN);
      }

      sumaTotal();
    });

    useTask$(({ track }) => {
      track(() => definicion_CTX_COMPRA.elIgv);
      // console.log('***************ENTRO A EL IGV***********************');
      //
      if (definicion_CTX_COMPRA.enDolares) {
        // console.log('***************ENTRO A EL IGV***USD********************');
        const bI = definicion_CTX_COMPRA.baseImponibleUSD ? parseFloat(definicion_CTX_COMPRA.baseImponibleUSD) : 0;
        const elIGV = definicion_CTX_COMPRA.elIgv ? parseFloat(definicion_CTX_COMPRA.elIgv) : 0;
        // console.log('***************ENTRO A EL IGV***USD****', bI, elIGV);
        if (ini.value > 0) {
          // console.log('***************ENTRO A EL IGV***USD////', bI, elIGV);
          definicion_CTX_COMPRA.igvUSD = (bI * elIGV) / 100;
          // console.log('***************ENTRO A EL IGV***USD$$$$', bI, elIGV);
          // sumaTotalDOLARES();
          const bIUSD = definicion_CTX_COMPRA.baseImponibleUSD ? definicion_CTX_COMPRA.baseImponibleUSD : 0;
          const igv = definicion_CTX_COMPRA.igvUSD ? definicion_CTX_COMPRA.igvUSD : 0;
          const adqNoG = definicion_CTX_COMPRA.adquisicionesNoGravadasUSD ? definicion_CTX_COMPRA.adquisicionesNoGravadasUSD : 0;
          const isc = definicion_CTX_COMPRA.iscUSD ? definicion_CTX_COMPRA.iscUSD : 0;
          const icbp = definicion_CTX_COMPRA.icbpUSD ? definicion_CTX_COMPRA.icbpUSD : 0;
          const otros = definicion_CTX_COMPRA.otrosUSD ? definicion_CTX_COMPRA.otrosUSD : 0;
          definicion_CTX_COMPRA.totalUSD = parseFloat(bIUSD) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros);
          // console.log('***************ENTRO A EL IGV***USD!!!!', bI, elIGV);
          //conversion
          definicion_CTX_COMPRA.igvPEN = ((bI * elIGV) / 100) * parseFloat(definicion_CTX_COMPRA.tipoCambio);
          // sumaTotal();
          // console.log('***************ENTRO A EL IGV***USD****', bI, elIGV);
        }
      } else {
        // console.log('***************ENTRO A EL IGV***PEN********************');
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
      definicion_CTX_COMPRA.totalUSD = parseFloat(bI) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros);
      // definicion_CTX_COMPRA.totalPEN = formatearMonedaPEN(
      //   parseFloat(bI) + parseFloat(igv) + parseFloat(adqNoG) + parseFloat(isc) + parseFloat(icbp) + parseFloat(otros)
      // );
      // console.log('LA SUMA definicion_CTX_COMPRA.totalUSD ', definicion_CTX_COMPRA.totalUSD);
    });

    useTask$(({ track }) => {
      track(() => definicion_CTX_COMPRA.baseImponibleUSD);
      //
      if (definicion_CTX_COMPRA.enDolares) {
        console.log("definicion_CTX_COMPRA.baseImponibleUSD ", definicion_CTX_COMPRA.baseImponibleUSD);
        const bI = definicion_CTX_COMPRA.baseImponibleUSD ? parseFloat(definicion_CTX_COMPRA.baseImponibleUSD) : 0;
        const elIGV = definicion_CTX_COMPRA.elIgv ? parseFloat(definicion_CTX_COMPRA.elIgv) : 0;

        console.log("bIbIbIbIbIbIbI USD ", bI);
        console.log("elIGVelIGVelIGVelIGV USD ", elIGV);

        if (ini.value > 0) {
          console.log("elIGVelIGVelIGVelIGV USD ./././././././../");
          definicion_CTX_COMPRA.igvUSD = (bI * elIGV) / 100;
          console.log("definicion_CTX_COMPRA.igvUSD./././././././../", definicion_CTX_COMPRA.igvUSD);
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
        const bI = definicion_CTX_COMPRA.adquisicionesNoGravadasUSD ? parseFloat(definicion_CTX_COMPRA.adquisicionesNoGravadasUSD) : 0;
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

    //#region ELIMINAR CUENTA CONTABLE
    useTask$(({ track }) => {
      track(() => definicion_CTX_NEW_EDIT_COMPRA.borrar_idAuxiliarCuentaContable);
      // console.log(
      //   'definicion_CTX_NEW_EDIT_COMPRA.borrar_idAuxiliarCuentaContable ',
      //   definicion_CTX_NEW_EDIT_COMPRA.borrar_idAuxiliarCuentaContable
      // );
      if (definicion_CTX_NEW_EDIT_COMPRA.borrar_idAuxiliarCuentaContable > 0) {
        const newItems: any = definicion_CTX_COMPRA.asientoContable.filter(
          (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_COMPRA.borrar_idAuxiliarCuentaContable
        );
        definicion_CTX_COMPRA.asientoContable = newItems;
        definicion_CTX_NEW_EDIT_COMPRA.borrar_idAuxiliarCuentaContable = 0;
      }
    });
    //#endregion ELIMINAR CUENTA CONTABLE

    //#region FIJAR MONTOS CUENTA CONTABLE
    const fijarMontos = $((e: any) => {
      // console.log('sumaTOTAL_DEBER - sumaTOTAL_HABER', e.sumaTOTAL_DEBER, e.sumaTOTAL_HABER);
      definicion_CTX_COMPRA.totalDebePEN = e.sumaTOTAL_DEBER;
      definicion_CTX_COMPRA.totalHaberPEN = e.sumaTOTAL_HABER;
    });
    //#endregion FIJAR MONTOS CUENTA CONTABLE

    //#region REGISTRAR COMPRA
    const registrarCompra = $(async () => {
      if (definicion_CTX_COMPRA.periodo.toString() === "") {
        alert("Ingrese el periodo");
        document.getElementById("in_Periodo")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.codigoTCP === "") {
        alert("Seleccione el Tipo de Comprobante de Pago");
        document.getElementById("se_tcp")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.codigoTipoDocumentoIdentidad === "") {
        alert("Identifique al proveedor :|");
        document.getElementById("in_NumeroDocumentoIdentidad")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.numeroIdentidad === "") {
        alert("Identifique al proveedor");
        document.getElementById("img_buscarProveedor")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.razonSocialNombre === "") {
        alert("Identifique al proveedor (R.S.)");
        document.getElementById("img_buscarProveedor")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.fecha === "") {
        alert("Ingrese la fecha");
        document.getElementById("in_Fecha")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.conFechaVencimiento === true) {
        if (definicion_CTX_COMPRA.fechaVencimiento === "") {
          alert("Ingrese el fecha vencimiento");
          document.getElementById("in_FechaVencimiento")?.focus();
          return;
        }
      }
      if (definicion_CTX_COMPRA.serie === "") {
        alert("Ingrese la serie");
        document.getElementById("in_Serie")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.numero.toString() === "" || definicion_CTX_COMPRA.numero.toString() === "NaN") {
        alert("Ingrese el número valido");
        document.getElementById("in_Numero")?.focus();
        return;
      }
      if (!parseInt(definicion_CTX_COMPRA.numero.toString())) {
        alert("No es un número valido, ingrese el número " + parseInt(definicion_CTX_COMPRA.numero.toString()));
        document.getElementById("in_Numero")?.focus();
        return;
      } else {
        console.log("nume", parseInt(definicion_CTX_COMPRA.numero.toString()));
      }
      if (definicion_CTX_COMPRA.enDolares) {
        if (definicion_CTX_COMPRA.tipoCambio === "") {
          alert("Ingrese el tipo de cambio");
          document.getElementById("in_TipoCambio")?.focus();
          return;
        }
      }
      if (definicion_CTX_COMPRA.tipoCompra === "") {
        alert("Ingrese el tipo de compra");
        document.getElementById("se_TipoCompra")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.baseImponiblePEN === "") {
        alert("Ingrese la base imponible o registre cero (0)");
        document.getElementById("in_BaseImponible")?.focus();
        return;
      }
      if (definicion_CTX_COMPRA.detraccion) {
        if (definicion_CTX_COMPRA.detraccionPorcentaje === "") {
          alert("Ingrese el porcentaje de la detracción");
          document.getElementById("in_DetraccionPorcentaje")?.focus();
          return;
        }
        if (definicion_CTX_COMPRA.detraccionConstancia === "") {
          alert("Ingrese la constancia de la detracción");
          document.getElementById("in_DetraccionConstancia")?.focus();
          return;
        }
        if (definicion_CTX_COMPRA.detraccionMontoPEN === "") {
          alert("Ingrese el monto de la detracción");
          document.getElementById("in_DetraccionMonto")?.focus();
          return;
        }
        if (definicion_CTX_COMPRA.detraccionFecha === "") {
          alert("Ingrese la fecha de la detracción");
          document.getElementById("in_DetraccionFecha")?.focus();
          return;
        }
      } else {
        definicion_CTX_COMPRA.detraccionPorcentaje = "";
        definicion_CTX_COMPRA.detraccionConstancia = "";
        definicion_CTX_COMPRA.detraccionMontoPEN = "";
        definicion_CTX_COMPRA.detraccionFecha = "";
      }
      if (definicion_CTX_COMPRA.retencion) {
        if (definicion_CTX_COMPRA.retencionPorcentaje === "") {
          alert("Ingrese el porcentaje de la retención");
          document.getElementById("in_RetencionPorcentaje")?.focus();
          return;
        }
      } else {
        definicion_CTX_COMPRA.retencionPorcentaje = "";
      }
      //NOTA DE CREDITO / NOTA DE DEBITO
      if (definicion_CTX_COMPRA.codigoTCP === "07" || definicion_CTX_COMPRA.codigoTCP === "08") {
        if (definicion_CTX_COMPRA.referenciaFecha === "") {
          alert("Ingrese la fecha de referencia de NC/ND");
          document.getElementById("in_NC_ND_Fecha")?.focus();
          return;
        }
        if (definicion_CTX_COMPRA.referenciaTipo === "") {
          alert("Ingrese el tipo del documento referenciado");
          document.getElementById("in_NC_ND_TCP")?.focus();
          return;
        }
        if (definicion_CTX_COMPRA.referenciaSerie === "") {
          alert("Ingrese la serie del documento referenciado");
          document.getElementById("in_NC_ND_Serie")?.focus();
          return;
        }
        if (definicion_CTX_COMPRA.referenciaNumero.toString() === "" || definicion_CTX_COMPRA.referenciaNumero.toString() === "NaN") {
          alert("Ingrese el número valido del documento referenciado");
          document.getElementById("in_NC_ND_Numero")?.focus();
          return;
        }
        console.log("🥖🥖🥖🥖🥖 REVISION ... convertirAValoresAbsolutos_Por_NC_ND");
        //****************************************** */
        //***************SOLES******************** */
        definicion_CTX_COMPRA.baseImponiblePEN = definicion_CTX_COMPRA.baseImponiblePEN.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.baseImponiblePEN.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.baseImponiblePEN) * -1;
        definicion_CTX_COMPRA.igvPEN = definicion_CTX_COMPRA.igvPEN.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.igvPEN.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.igvPEN) * -1;
        definicion_CTX_COMPRA.adquisicionesNoGravadasPEN = definicion_CTX_COMPRA.adquisicionesNoGravadasPEN.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.adquisicionesNoGravadasPEN.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.adquisicionesNoGravadasPEN) * -1;
        definicion_CTX_COMPRA.iscPEN = definicion_CTX_COMPRA.iscPEN.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.iscPEN.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.iscPEN) * -1;
        definicion_CTX_COMPRA.icbpPEN = definicion_CTX_COMPRA.icbpPEN.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.icbpPEN.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.icbpPEN) * -1;
        definicion_CTX_COMPRA.otrosPEN = definicion_CTX_COMPRA.otrosPEN.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.otrosPEN.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.otrosPEN) * -1;
        definicion_CTX_COMPRA.totalPEN = definicion_CTX_COMPRA.totalPEN.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.totalPEN.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.totalPEN) * -1;
        //****************************************** */
        //***************DOLARES******************** */
        definicion_CTX_COMPRA.baseImponibleUSD = definicion_CTX_COMPRA.baseImponibleUSD.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.baseImponibleUSD.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.baseImponibleUSD) * -1;
        definicion_CTX_COMPRA.igvUSD = definicion_CTX_COMPRA.igvUSD.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.igvUSD.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.igvUSD) * -1;
        definicion_CTX_COMPRA.adquisicionesNoGravadasUSD = definicion_CTX_COMPRA.adquisicionesNoGravadasUSD.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.adquisicionesNoGravadasUSD.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.adquisicionesNoGravadasUSD) * -1;
        definicion_CTX_COMPRA.iscUSD = definicion_CTX_COMPRA.iscUSD.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.iscUSD.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.iscUSD) * -1;
        definicion_CTX_COMPRA.icbpUSD = definicion_CTX_COMPRA.icbpUSD.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.icbpUSD.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.icbpUSD) * -1;
        definicion_CTX_COMPRA.otrosUSD = definicion_CTX_COMPRA.otrosUSD.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.otrosUSD.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.otrosUSD) * -1;
        definicion_CTX_COMPRA.totalUSD = definicion_CTX_COMPRA.totalUSD.$numberDecimal
          ? Math.abs(definicion_CTX_COMPRA.totalUSD.$numberDecimal) * -1
          : Math.abs(definicion_CTX_COMPRA.totalUSD) * -1;
      } else {
        definicion_CTX_COMPRA.referenciaFecha = "";
        definicion_CTX_COMPRA.referenciaTipo = "";
        definicion_CTX_COMPRA.referenciaSerie = "";
        definicion_CTX_COMPRA.referenciaNumero = 0;
      }
      // CONTABILIZAR
      if (definicion_CTX_COMPRA.contabilizarOperaciones && definicion_CTX_COMPRA.asientoContableObligatorio) {
        if (typeof parametrosGlobales.idLibroDiario === "undefined" || parametrosGlobales.idLibroDiario.trim() === "") {
          alert("No se puede identificar el libro diario.");
          // document.getElementById('btn_AddCuentaContable_COMPRA')?.focus();
          return;
        }
        if (definicion_CTX_COMPRA.totalDebePEN !== definicion_CTX_COMPRA.totalHaberPEN) {
          alert("No se cumple la partida doble, verifique.");
          document.getElementById("btn_AddCuentaContable_COMPRA")?.focus();
          return;
        }
        if (definicion_CTX_COMPRA.totalPEN !== definicion_CTX_COMPRA.totalHaberPEN) {
          alert("Existe diferencia entre el monto total y la partida doble, verifique.");
          document.getElementById("btn_AddCuentaContable_COMPRA")?.focus();
          return;
          // console.log('antes del analisis PD 0', !definicion_CTX_NEW_EDIT_COMPRA.continuarConRegistroCompra);
          // definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelErrorDiferenciaPartidaDoble = true;
          // respuestaErrorPARTIDADOBLE.then((value) => console.log(`${value}`)).catch((reason) => console.log(`${reason}`));
          // // const TTT = respuestaErrorPARTIDADOBLE;
          // // console.log(
          // //   'TTT',
          // //   TTT.then((value) => console.log(`${value}`)).catch((reason) => console.log(`${reason}`))
          // // );
          // // break;
          // console.log('antes del analisis PD 1', !definicion_CTX_NEW_EDIT_COMPRA.continuarConRegistroCompra);
          // if (!definicion_CTX_NEW_EDIT_COMPRA.continuarConRegistroCompra) {
          //   console.log('dentro del if ERROR');
          //   document.getElementById('btn_AddCuentaContable_COMPRA')?.focus();
          //   return;
          // }
          // console.log('sali del if ERROR');
        }
      } else {
        definicion_CTX_COMPRA.asientoContable = [];
      }
      //
      console.log("definicion_CTX_COMPRA", definicion_CTX_COMPRA);

      ctx_index_compra.mostrarSpinner = true;
      //enviar datos al SERVIDOR
      const compraGRABADA = await inUpCompra({
        idLibroDiario: parametrosGlobales.idLibroDiario,

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
        // tipoCambio: definicion_CTX_COMPRA.tipoCambio.replace(',', ''),
        tipoCambio: definicion_CTX_COMPRA.tipoCambio,

        tipoCompra: definicion_CTX_COMPRA.tipoCompra,
        //****************************************** */
        //***************SOLES******************** */
        // baseImponiblePEN: definicion_CTX_COMPRA.baseImponiblePEN.replace(',', ''),
        baseImponiblePEN: definicion_CTX_COMPRA.baseImponiblePEN,
        // igvPEN: definicion_CTX_COMPRA.igvPEN.replace(',', ''),
        igvPEN: definicion_CTX_COMPRA.igvPEN,
        adquisicionesNoGravadasPEN: definicion_CTX_COMPRA.adquisicionesNoGravadasPEN,
        iscPEN: definicion_CTX_COMPRA.iscPEN,
        icbpPEN: definicion_CTX_COMPRA.icbpPEN,
        otrosPEN: definicion_CTX_COMPRA.otrosPEN,
        // totalPEN: definicion_CTX_COMPRA.totalPEN.replace(',', ''),
        totalPEN: definicion_CTX_COMPRA.totalPEN,
        //****************************************** */
        //***************DOLARES******************** */
        baseImponibleUSD: definicion_CTX_COMPRA.baseImponibleUSD,
        igvUSD: definicion_CTX_COMPRA.igvUSD,
        adquisicionesNoGravadasUSD: definicion_CTX_COMPRA.adquisicionesNoGravadasUSD,
        iscUSD: definicion_CTX_COMPRA.iscUSD,
        icbpUSD: definicion_CTX_COMPRA.icbpUSD,
        otrosUSD: definicion_CTX_COMPRA.otrosUSD,
        totalUSD: definicion_CTX_COMPRA.totalUSD,
        //****************************************** */
        //***************DETRACCION***************** */
        detraccion: definicion_CTX_COMPRA.detraccion,
        detraccionPorcentaje: definicion_CTX_COMPRA.detraccionPorcentaje,
        detraccionConstancia: definicion_CTX_COMPRA.detraccionConstancia,
        detraccionMontoPEN: definicion_CTX_COMPRA.detraccionMontoPEN,
        detraccionFecha: definicion_CTX_COMPRA.detraccionFecha,
        //****************************************** */
        //***************RETENCION***************** */
        agenteRetencion: definicion_CTX_COMPRA.agenteRetencion,
        retencion: definicion_CTX_COMPRA.retencion,
        retencionPorcentaje: definicion_CTX_COMPRA.retencionPorcentaje,
        //********************************************** */
        //***********DOCUMENTO REFERIDO - NC ND********* */
        referenciaFecha: definicion_CTX_COMPRA.referenciaFecha,
        referenciaTipo: definicion_CTX_COMPRA.referenciaTipo,
        referenciaSerie: definicion_CTX_COMPRA.referenciaSerie,
        referenciaNumero: definicion_CTX_COMPRA.referenciaNumero,
        //********************************************** */
        //***********ASIENTO CONTABLE********* */
        contabilizarOperaciones: definicion_CTX_COMPRA.contabilizarOperaciones,
        asientoContableObligatorio: definicion_CTX_COMPRA.asientoContableObligatorio,
        asientoContable: definicion_CTX_COMPRA.asientoContable,
        totalDebePEN: definicion_CTX_COMPRA.totalDebePEN,
        totalHaberPEN: definicion_CTX_COMPRA.totalHaberPEN,
        totalDebeUSD: definicion_CTX_COMPRA.totalDebeUSD,
        totalHaberUSD: definicion_CTX_COMPRA.totalHaberUSD,

        usuario: parametrosGlobales.usuario,
      });

      if (compraGRABADA.status === 400) {
        alert("🛑 Falla al registrar la compra." + compraGRABADA.message);
        return;
      }

      const compraData = compraGRABADA.data;
      console.log("la comp", compraData[0]);

      ctx_index_compra.mostrarSpinner = false;

      // ctx_index_compra.mostrarPanelCompra = false;
      if (compraGRABADA) {
        grabo.value = true;
        //-----------------
        definicion_CTX_COMPRA._id = "";

        definicion_CTX_COMPRA.codigoTCP = "";
        definicion_CTX_COMPRA.descripcionTCP = "";
        definicion_CTX_COMPRA.serie = "";
        definicion_CTX_COMPRA.numero = 0;

        definicion_CTX_COMPRA.fecha = "";
        definicion_CTX_COMPRA.conFechaVencimiento = false;
        definicion_CTX_COMPRA.fechaVencimiento = "";
        definicion_CTX_COMPRA.anioDUAoDSI = 0;

        definicion_CTX_COMPRA.idProveedor = "";
        definicion_CTX_COMPRA.codigoTipoDocumentoIdentidad = "";
        definicion_CTX_COMPRA.tipoDocumentoIdentidad = "";
        definicion_CTX_COMPRA.numeroIdentidad = "";
        definicion_CTX_COMPRA.razonSocialNombre = "";
        definicion_CTX_COMPRA.email = "";

        // definicion_CTX_COMPRA.idElIgv = '';
        // definicion_CTX_COMPRA.elIgv = '';

        //  definicion_CTX_COMPRA.enDolares;
        //  definicion_CTX_COMPRA.moneda;
        //  definicion_CTX_COMPRA.tipoCambio;

        definicion_CTX_COMPRA.tipoCompra = "A";
        //****************************************** */
        //***************SOLES******************** */
        definicion_CTX_COMPRA.baseImponiblePEN = "";
        definicion_CTX_COMPRA.igvPEN = "";
        definicion_CTX_COMPRA.adquisicionesNoGravadasPEN = "";
        definicion_CTX_COMPRA.iscPEN = "";
        definicion_CTX_COMPRA.icbpPEN = "";
        definicion_CTX_COMPRA.otrosPEN = "";
        definicion_CTX_COMPRA.totalPEN = "";
        //****************************************** */
        //***************DOLARES******************** */
        definicion_CTX_COMPRA.baseImponibleUSD = "";
        definicion_CTX_COMPRA.igvUSD = "";
        definicion_CTX_COMPRA.adquisicionesNoGravadasUSD = "";
        definicion_CTX_COMPRA.iscUSD = "";
        definicion_CTX_COMPRA.icbpUSD = "";
        definicion_CTX_COMPRA.otrosUSD = "";
        definicion_CTX_COMPRA.totalUSD = "";
        //****************************************** */
        //***************DETRACCION***************** */
        definicion_CTX_COMPRA.detraccion = false;
        definicion_CTX_COMPRA.detraccionPorcentaje = "";
        definicion_CTX_COMPRA.detraccionConstancia = "";
        definicion_CTX_COMPRA.detraccionMontoPEN = "";
        definicion_CTX_COMPRA.detraccionFecha = "";
        //****************************************** */
        //***************RETENCION***************** */
        definicion_CTX_COMPRA.agenteRetencion = props.agenteRetencion.valueOf();
        definicion_CTX_COMPRA.retencion = false;
        definicion_CTX_COMPRA.retencionPorcentaje = "";
        //********************************************** */
        //***********DOCUMENTO REFERIDO - NC ND********* */
        definicion_CTX_COMPRA.referenciaFecha = "";
        definicion_CTX_COMPRA.referenciaTipo = "";
        definicion_CTX_COMPRA.referenciaSerie = "";
        definicion_CTX_COMPRA.referenciaNumero = 0;
        //********************************************** */
        //***********ASIENTO CONTABLE********* */
        //  definicion_CTX_COMPRA.contabilizarOperaciones;
        definicion_CTX_COMPRA.asientoContableObligatorio = true;
        definicion_CTX_COMPRA.asientoContable = [];
        definicion_CTX_COMPRA.totalDebePEN = 0;
        definicion_CTX_COMPRA.totalHaberPEN = 0;
        definicion_CTX_COMPRA.totalDebeUSD = 0;
        definicion_CTX_COMPRA.totalHaberUSD = 0;
        //---------
        if (definicion_CTX_COMPRA.contabilizarOperaciones) {
          // let lasCuentas: any = await getAsientoCompra({
          //   idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          //   idEmpresa: parametrosGlobales.idEmpresa,
          // });
          // lasCuentas = lasCuentas.data;
          // console.log('lasCuentas', lasCuentas);
          // definicion_CTX_COMPRA.asientoContable = lasCuentas;
          // definicion_CTX_COMPRA.asientoContable = props.asientoC;
          // definicion_CTX_COMPRA.asientoContable = [];
          // definicion_CTX_COMPRA.asientoContable = parametrosGlobales.asientoCompra;
          props.asientoC.map((cuenta: any) => {
            definicion_CTX_COMPRA.asientoContable.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              item: 0,
              codigo: cuenta.codigo,
              descripcion: cuenta.descripcion,
              tipo: cuenta.tipo,
              importe: 0,
            });
          });
        }

        //----------
        alert("✅ Registro de compra satisfactorio!!!");
      }
    });
    //#endregion REGISTRAR COMPRA

    return (
      <div
        style={{
          // width: 'clamp(min(10vw, 20rem),800px, max(90vw, 55rem))',
          // width: 'clamp(min(5vw, 4rem),800px, max(90vw, 55rem))',
          // width: 'clamp(60px,800px, 1080px)',
          width: "clamp(330px, 86%, 800px)",
          // width: 'auto',
          padding: "2px",
          // background: `${definicion_CTX_COMPRA.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : ''}`,
        }}
        class="container-modal"
      >
        {/* BOTONES DEL MARCO */}
        <div style={{ display: "flex", justifyContent: "end" }}>
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="parametrosGlobales"
            onClick={$(() => {
              console.log("parametrosGlobales", parametrosGlobales);
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="props"
            onClick={$(() => {
              console.log("props", props);
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="Cerrar el definicion_CTX_COMPRA"
            onClick={$(() => {
              console.log(
                "definicion_CTX_COMPRA",
                definicion_CTX_COMPRA
                // props.losIgvsCompra,
                // props.igvPorDefault
              );
              // console.log('props.igvPorDefault', props.igvPorDefault);
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="Cerrar el props.asientoC"
            onClick={$(() => {
              console.log("props.asientoC", props.asientoC);
              // console.log('props.igvPorDefault', props.igvPorDefault);
            })}
          />
          <ImgButton
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el formulario"
            onClick={$(() => {
              ctx_index_compra.grabo_Compra = grabo.value;
              ctx_index_compra.mostrarPanelCompra = false;
            })}
          />
        </div>
        {/* TITULO */}
        <h3 style={{ fontSize: "0.8rem" }}>
          Compra - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
        </h3>
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
                <div class="form-control form-agrupado">
                  <input
                    id="in_Periodo"
                    style={{ width: "100%" }}
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
                <div class="form-control form-agrupado">
                  <ElSelect
                    id={"se_tcp"}
                    valorSeleccionado={definicion_CTX_COMPRA.descripcionTCP}
                    registros={LosTCPcargados.value}
                    registroID={"codigo"}
                    registroTEXT={"descripcion"}
                    seleccione={"-- Seleccione TCP --"}
                    onChange={$(() => {
                      // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢 ElSelect se_tcp');
                      const elSelec = document.getElementById("se_tcp") as HTMLSelectElement;
                      const elIdx = elSelec.selectedIndex;
                      // console.log('?', elIdx, elSelec[elIdx].id);
                      definicion_CTX_COMPRA.codigoTCP = elSelec[elIdx].id;
                      if (definicion_CTX_COMPRA.codigoTCP === "") {
                        definicion_CTX_COMPRA.descripcionTCP = "";
                      } else {
                        definicion_CTX_COMPRA.descripcionTCP = elSelec.value;
                        // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                      }
                    })}
                    onKeyPress={$((e: any) => {
                      if (e.key === "Enter") {
                        (document.getElementById("in_Fecha") as HTMLSelectElement)?.focus();
                      }
                    })}
                  />
                </div>
              </div>
              <br />
              {/* <hr style={{ margin: '5px 0' }}></hr> */}
            </div>
            {/* ----------------------------------------------------- */}
            {/* GENERALES DEL PROVEEDOR */}
            <div>
              {/* tipo de documento identidad*/}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <select
                    id="se_TipoDocumentoLiteral"
                    disabled
                    // value={6}
                    // value={definicion_CTX_COMPRA.tipoDocumentoIdentidad}
                    // onChange={cambioTipoDocumento}
                    onChange$={(e) => {
                      const idx = (e.target as HTMLSelectElement).selectedIndex;
                      const rere = e.target as HTMLSelectElement;
                      const elOption = rere[idx];
                      console.log("elOption", elOption.id);
                      //
                      // console.log('idx', idx.item.arguments(id));
                      // const csd = (e.target as HTMLSelectElement).current[idx];
                      // venta.codigoTipoDocumentoIdentidad = parseInt(elOption.id);
                      definicion_CTX_COMPRA.codigoTipoDocumentoIdentidad = elOption.id;
                      definicion_CTX_COMPRA.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                    }}
                    // style={{ width: '100%' }}
                  >
                    <option id="1" value="DNI" selected={definicion_CTX_COMPRA.tipoDocumentoIdentidad === "DNI"}>
                      DNI
                    </option>
                    <option id="6" value="RUC" selected={definicion_CTX_COMPRA.tipoDocumentoIdentidad === "RUC"}>
                      RUC
                    </option>
                    <option id="4" value="C.EXT" selected={definicion_CTX_COMPRA.tipoDocumentoIdentidad === "C.EXT"}>
                      C.EXT
                    </option>
                  </select>
                  <input
                    id="in_BuscarProveedor"
                    type="image"
                    src={images.searchPLUS}
                    height={16}
                    width={16}
                    style={{ marginLeft: "4px" }}
                    // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                    onClick$={() => (definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBuscarPersona = true)}
                  />
                  {/* <ImgButton
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
                /> */}
                </div>
              </div>
              {definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBuscarPersona && (
                <div class="modal">
                  <BuscarPersona soloPersonasNaturales={false} seleccionar="proveedor" contexto="new_edit_compra" rol="proveedor" />
                </div>
              )}
              {/* numero identidad*/}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_NumeroDocumentoIdentidad"
                    style={{ width: "100%" }}
                    disabled
                    type="number"
                    placeholder="Add número identidad"
                    value={definicion_CTX_COMPRA.numeroIdentidad}
                    onChange$={(e) => (definicion_CTX_COMPRA.numeroIdentidad = (e.target as HTMLInputElement).value)}
                    // onChange={(e) => setNumeroIdentidad(e.target.value)}
                  />
                </div>
              </div>
              {/* Razon Social / Nombre */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_NombreProveedor"
                    style={{ width: "100%" }}
                    disabled
                    type="text"
                    placeholder="Razón social / Nombre"
                    value={definicion_CTX_COMPRA.razonSocialNombre}
                  />
                </div>
              </div>
              <br></br>
              {/* <hr style={{ margin: '5px 0' }}></hr> */}
              {/* ----------------------------------------------------- */}
              {/* ***NC -- ND -- */}
              <div
                id="zona_NC_ND"
                style={{ background: "grey" }}
                hidden={definicion_CTX_COMPRA.codigoTCP === "07" || definicion_CTX_COMPRA.codigoTCP === "08" ? false : true}
              >
                <div class="form-control">
                  <div class="form-control form-agrupado" style={{ display: "flex", flexWrap: "wrap", alignItems: "left" }}>
                    <input
                      id="in_NC_ND_Fecha"
                      // style={{ width: '100%' }}
                      // disabled
                      type="date"
                      placeholder="Add NC/ND Fecha"
                      value={definicion_CTX_COMPRA.referenciaFecha}
                      onChange$={(e) => (definicion_CTX_COMPRA.referenciaFecha = (e.target as HTMLInputElement).value)}
                      // onChange={(e) => setNumeroIdentidad(e.target.value)}
                    />
                    <input
                      id="in_NC_ND_TCP"
                      // style={{ width: '100%' }}
                      // disabled
                      type="number"
                      placeholder="Add NC/ND TCP"
                      value={definicion_CTX_COMPRA.referenciaTipo}
                      onChange$={(e) => (definicion_CTX_COMPRA.referenciaTipo = (e.target as HTMLInputElement).value)}
                      // onChange={(e) => setNumeroIdentidad(e.target.value)}
                    />
                    <input
                      id="in_NC_ND_Serie"
                      // style={{ width: '100%' }}
                      // disabled
                      type="text"
                      placeholder="Add NC/ND Serie"
                      value={definicion_CTX_COMPRA.referenciaSerie}
                      onChange$={(e) => (definicion_CTX_COMPRA.referenciaSerie = (e.target as HTMLInputElement).value.toUpperCase())}
                      // onChange={(e) => setNumeroIdentidad(e.target.value)}
                    />
                    <input
                      id="in_NC_ND_Numero"
                      // style={{ width: '100%' }}
                      // disabled
                      type="number"
                      placeholder="Add NC/ND Numero"
                      value={definicion_CTX_COMPRA.referenciaNumero}
                      onChange$={(e) => (definicion_CTX_COMPRA.referenciaNumero = parseInt((e.target as HTMLInputElement).value.trim()))}
                      // onChange={(e) => setNumeroIdentidad(e.target.value)}
                    />
                    {/* <div>
                    <input
                      type="checkbox"
                      id="chbx_NC_ND_TipoCambio"
                      // checked={definicion_CTX_COMPRA.enDolares ? true : false}
                      // onClick$={(e) => {
                      //   if (definicion_CTX_COMPRA.fecha === '') {
                      //     (e.target as HTMLInputElement).checked = false;
                      //     document.getElementById('in_Fecha')?.focus();
                      //     return;
                      //   }
                      //   obtenerTipoCambio(e.target as HTMLInputElement);
                      // }}
                    />
                    <strong style={{ fontSize: '0.9rem', fontWeight: '400' }}>USD </strong>
                    <input
                      id="in_NC_ND_TipoCambio"
                      // style={{ width: '100%' }}
                      // disabled
                      type="number"
                      placeholder="Add NC/ND TipoCambio"
                      value={definicion_CTX_COMPRA.numeroIdentidad}
                      onChange$={(e) => (definicion_CTX_COMPRA.numeroIdentidad = (e.target as HTMLInputElement).value)}
                      // onChange={(e) => setNumeroIdentidad(e.target.value)}
                    />
                  </div>

                  <input
                    id="in_NC_ND_Monto"
                    // style={{ width: '100%' }}
                    // disabled
                    type="number"
                    placeholder="Add NC/ND Monto"
                    value={definicion_CTX_COMPRA.numeroIdentidad}
                    onChange$={(e) => (definicion_CTX_COMPRA.numeroIdentidad = (e.target as HTMLInputElement).value)}
                    // onChange={(e) => setNumeroIdentidad(e.target.value)}
                  /> */}
                  </div>
                </div>
              </div>
              <br hidden={definicion_CTX_COMPRA.codigoTCP === "07" || definicion_CTX_COMPRA.codigoTCP === "08" ? false : true}></br>
              {/* <hr
              style={{ margin: '5px 0' }}
              hidden={definicion_CTX_COMPRA.codigoTCP === '07' || definicion_CTX_COMPRA.codigoTCP === '08' ? false : true}
            ></hr> */}
            </div>
            {/* ----------------------------------------------------- */}
            <div>
              {/* Fecha */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_Fecha"
                    style={{ width: "100%" }}
                    type="date"
                    autoFocus
                    placeholder="Add fecha"
                    max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                    value={definicion_CTX_COMPRA.fecha}
                    onInput$={(e) => {
                      definicion_CTX_COMPRA.fecha = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("chbx_fechaVencimiento") as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                </div>
              </div>
              {/* Fecha de VENCIMIENTO*/}
              <div>
                <div style={{ display: "flex" }}>
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
                      if (e.key === "Enter") {
                        document.getElementById("in_FechaVencimiento")?.focus();
                      }
                    }}
                    onFocusin$={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                  />
                  <label for="chbx_fechaVencimiento" style={{ marginRight: "4px" }}>
                    F.VENC.
                  </label>
                  <input
                    id="in_FechaVencimiento"
                    style={{ width: "100%" }}
                    type="date"
                    autoFocus
                    placeholder="Add fecha"
                    disabled={definicion_CTX_COMPRA.conFechaVencimiento ? false : true}
                    value={definicion_CTX_COMPRA.fechaVencimiento}
                    onInput$={(e) => {
                      definicion_CTX_COMPRA.fechaVencimiento = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("in_Anio_DUA_DSI") as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                </div>
              </div>
              {/* Año DUA o DSI */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_Anio_DUA_DSI"
                    style={{ width: "100%" }}
                    type="number"
                    autoFocus
                    placeholder="Add año DUA o DSI"
                    value={definicion_CTX_COMPRA.anioDUAoDSI}
                    onInput$={(e) => {
                      definicion_CTX_COMPRA.anioDUAoDSI = parseInt((e.target as HTMLInputElement).value.trim());
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("in_Serie") as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                </div>
              </div>
              {/* Serie */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_Serie"
                    style={{ width: "100%" }}
                    type="text"
                    maxLength={4}
                    autoFocus
                    placeholder="Add serie"
                    value={definicion_CTX_COMPRA.serie}
                    onInput$={(e) => {
                      definicion_CTX_COMPRA.serie = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("in_Numero") as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                </div>
              </div>
              {/* Número */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_Numero"
                    style={{ width: "100%" }}
                    type="number"
                    maxLength={8}
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
                      console.log("onChange", e);

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
                      console.log("onKeyPress", e);
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
                      if (e.key === "Enter") {
                        (document.getElementById("chbx_TipoCambio_Para_Compra") as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                </div>
              </div>
              <br></br>
              {/* <hr style={{ margin: '5px 0' }}></hr> */}
            </div>
            {/* ----------------------------------------------------- */}
            {/* -----------------------TC---------------------------- */}
            <div>
              {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
              <div class="form-control">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginRight: "3px" }}>
                  <input
                    type="checkbox"
                    id="chbx_TipoCambio_Para_Compra"
                    checked={definicion_CTX_COMPRA.enDolares ? true : false}
                    onClick$={(e) => {
                      if (definicion_CTX_COMPRA.fecha === "") {
                        alert("Ingrese la fecha para esta compra");
                        (e.target as HTMLInputElement).checked = false;
                        document.getElementById("in_Fecha")?.focus();
                        return;
                      }
                      obtenerTipoCambio(e.target as HTMLInputElement);
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("se_TipoCompra") as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                  <strong
                    style={{ fontSize: "0.9rem", fontWeight: "400", cursor: "pointer" }}
                    onClick$={() => {
                      if ((document.getElementById("chbx_TipoCambio_Para_Compra") as HTMLInputElement).checked === false) {
                        if (definicion_CTX_COMPRA.fecha === "") {
                          alert("Ingrese la fecha para esta venta");
                          // (e.target as HTMLInputElement).checked = false;
                          (document.getElementById("chbx_TipoCambio_Para_Compra") as HTMLInputElement).checked = false;
                          document.getElementById("in_Fecha_Para_Venta")?.focus();
                          return;
                        }
                        (document.getElementById("chbx_TipoCambio_Para_Compra") as HTMLInputElement).checked = true;
                      } else {
                        (document.getElementById("chbx_TipoCambio_Para_Compra") as HTMLInputElement).checked = false;
                        // definicion_CTX_F_B_NC_ND.enDolares = false;
                      }
                      obtenerTipoCambio(document.getElementById("chbx_TipoCambio_Para_Compra") as HTMLInputElement);
                      // document.getElementById('chbx_TipoCambio_Para_Compra')?.onclick;
                    }}
                  >
                    USD
                  </strong>
                </div>
                <div class="form-control form-agrupado">
                  <input
                    id="in_TipoCambio"
                    type="number"
                    placeholder="Tipo de cambio"
                    style={{ width: "100%" }}
                    value={definicion_CTX_COMPRA.tipoCambio}
                    // disabled
                  />
                </div>
              </div>
              <br></br>
              {/* <hr style={{ margin: '5px 0' }}></hr> */}
            </div>
          </div>
          <div>
            {/* ----------------------------------------------------- */}
            {/* RESUMEN DE MONTOS */}
            <div>
              {/* TIPO DE COMPRA */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <select
                    id="se_TipoCompra"
                    // style={{ width: '100%' }}
                    onChange$={(e) => {
                      definicion_CTX_COMPRA.tipoCompra = (e.target as HTMLSelectElement).value;
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("in_BaseImponible_COMPRA") as HTMLInputElement)?.focus();
                      }
                    }}
                  >
                    <option value={"A"} selected={definicion_CTX_COMPRA.tipoCompra === "A"}>
                      Exclusivamente a operaciones gravadas y/o de exportación. (Derecho a crédito fiscal)
                    </option>
                    <option value={"B"} selected={definicion_CTX_COMPRA.tipoCompra === "B"}>
                      Operaciones gravadas y/o de exportación y a operaciones no gravadas. (Derecho a crédito fiscal)
                    </option>
                    <option value={"C"} selected={definicion_CTX_COMPRA.tipoCompra === "C"}>
                      No estar destinadas a operaciones gravadas y/o de exportación. (No derecho a crédito fiscal)
                    </option>
                  </select>
                </div>
              </div>
              {/* Base imponible */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    type="number"
                    style={{ width: "100%" }}
                    id="in_BaseImponible_COMPRA"
                    placeholder={!definicion_CTX_COMPRA.enDolares ? "Base imponible PEN" : "Base imponible USD"}
                    value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.baseImponibleUSD : definicion_CTX_COMPRA.baseImponiblePEN}
                    onChange$={(e) => {
                      definicion_CTX_COMPRA.enDolares
                        ? (definicion_CTX_COMPRA.baseImponibleUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                        : (definicion_CTX_COMPRA.baseImponiblePEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                      console.log("onChange..bI", definicion_CTX_COMPRA.baseImponiblePEN);
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("in_IGV_COMPRA") as HTMLInputElement)?.focus();
                      }
                    }}
                    // onKeyUp$={(e) => {
                    //   if (e.key === 'Enter') {
                    //     document.getElementById('in_descripcionIN_MICE')?.focus();
                    //   }
                    // }}
                    // onFocusin$={(e) => {
                    //   (e.target as HTMLInputElement).select();
                    // }}
                  />
                </div>
              </div>
              {/* IGV */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    type="number"
                    id="in_IGV_COMPRA"
                    style={{ width: "100%" }}
                    disabled
                    placeholder={!definicion_CTX_COMPRA.enDolares ? "IGV PEN" : "IGV USD"}
                    value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.igvUSD : definicion_CTX_COMPRA.igvPEN}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("in_AdquisicionesNoGravadas_COMPRA") as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                  <select
                    id="se_igv"
                    onChange$={() => {
                      // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢 change select');
                      const elSelec = document.getElementById("se_igv") as HTMLSelectElement;
                      const elIdx = elSelec.selectedIndex;
                      // console.log('?', elIdx, elSelec[elIdx].id);
                      definicion_CTX_COMPRA.idElIgv = elSelec[elIdx].id;
                      if (definicion_CTX_COMPRA.idElIgv === "") {
                        definicion_CTX_COMPRA.elIgv = ""; // parseInt('');
                      } else {
                        definicion_CTX_COMPRA.elIgv = elSelec.value; /// parseInt(elSelec.value);
                        // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                      }
                    }}
                  >
                    <option value="">-- Seleccione igv --</option>
                    {LosIGVscargados.value.map((itemIGV: any) => {
                      return (
                        <option id={itemIGV._id} value={itemIGV.igv.$numberDecimal} selected={definicion_CTX_COMPRA.elIgv === itemIGV.igv.$numberDecimal}>
                          {itemIGV.igv.$numberDecimal + " %"}
                        </option>
                      );
                      // return <option>itemIGV.igv.$numberDecimal </option>;
                    })}
                  </select>
                  {/* <ElSelect
                    id={'se_igv'}
                    // valorSeleccionado={definicion_CTX_COMPRA.elIgv}
                    valorSeleccionado={
                      parseFloat(definicion_CTX_COMPRA.elIgv.$numberDecimal)
                      // definicion_CTX_COMPRA._id === '' ? definicion_CTX_COMPRA.elIgv : parseFloat(definicion_CTX_COMPRA.elIgv)
                    }
                    // valorSeleccionado={18}
                    registros={LosIGVscargados.value}
                    // registros={props.losIgvsCompra}
                    registroID={'_id'}
                    registroTEXT={'igv.$numberDecimal'}
                    textoAdicional=" %"
                    seleccione={'-- Seleccione igv --'}
                    onChange={$(() => {
                      // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢 change select');
                      const elSelec = document.getElementById('se_igv') as HTMLSelectElement;
                      const elIdx = elSelec.selectedIndex;
                      // console.log('?', elIdx, elSelec[elIdx].id);
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
                  /> */}
                </div>
              </div>
              {/* Adquisiciones No Gravadas */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    type="number"
                    id="in_AdquisicionesNoGravadas_COMPRA"
                    style={{ width: "100%" }}
                    placeholder={!definicion_CTX_COMPRA.enDolares ? "Adquisiciones No Gravadas PEN" : "Adquisiciones No Gravadas USD"}
                    value={
                      definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.adquisicionesNoGravadasUSD : definicion_CTX_COMPRA.adquisicionesNoGravadasPEN
                    }
                    onChange$={(e) => {
                      definicion_CTX_COMPRA.enDolares
                        ? (definicion_CTX_COMPRA.adquisicionesNoGravadasUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                        : (definicion_CTX_COMPRA.adquisicionesNoGravadasPEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("in_ISC")?.focus();
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
                <div class="form-control form-agrupado">
                  <input
                    type="number"
                    id="in_ISC"
                    style={{ width: "100%" }}
                    placeholder={!definicion_CTX_COMPRA.enDolares ? "ISC PEN" : "ISC USD"}
                    value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.iscUSD : definicion_CTX_COMPRA.iscPEN}
                    onChange$={(e) => {
                      definicion_CTX_COMPRA.enDolares
                        ? (definicion_CTX_COMPRA.iscUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                        : (definicion_CTX_COMPRA.iscPEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("in_ICBP")?.focus();
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
                <div class="form-control form-agrupado">
                  <input
                    type="number"
                    id="in_ICBP"
                    style={{ width: "100%" }}
                    placeholder={!definicion_CTX_COMPRA.enDolares ? "ICBP PEN" : "ICBP USD"}
                    value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.icbpUSD : definicion_CTX_COMPRA.icbpPEN}
                    onChange$={(e) => {
                      definicion_CTX_COMPRA.enDolares
                        ? (definicion_CTX_COMPRA.icbpUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                        : (definicion_CTX_COMPRA.icbpPEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("in_Otros")?.focus();
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
                <div class="form-control form-agrupado">
                  <input
                    type="number"
                    id="in_Otros"
                    style={{ width: "100%" }}
                    placeholder={!definicion_CTX_COMPRA.enDolares ? "Otros PEN" : "Otros USD"}
                    value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.otrosUSD : definicion_CTX_COMPRA.otrosPEN}
                    onChange$={(e) => {
                      definicion_CTX_COMPRA.enDolares
                        ? (definicion_CTX_COMPRA.otrosUSD = (e.target as HTMLInputElement).value.trim().toUpperCase())
                        : (definicion_CTX_COMPRA.otrosPEN = (e.target as HTMLInputElement).value.trim().toUpperCase());
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        document.getElementById("chbx_Detraccion")?.focus();
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
                <div class="form-control form-agrupado">
                  <input
                    type="number"
                    id="in_Total"
                    style={{ width: "100%" }}
                    placeholder={!definicion_CTX_COMPRA.enDolares ? "Total PEN" : "Total USD"}
                    disabled
                    value={definicion_CTX_COMPRA.enDolares ? definicion_CTX_COMPRA.totalUSD : definicion_CTX_COMPRA.totalPEN}
                    onKeyPress$={(e) => {
                      if (e.key === "Enter") {
                        (document.getElementById("chbx_Detraccion") as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                </div>
              </div>
              <br></br>
              {/* <hr style={{ margin: '5px 0' }}></hr> */}
            </div>
            {/* ----------------------------------------------------- */}
            {/* DETRACCION */}
            <div>
              <div>
                <div style={{ display: "flex" }}>
                  <input
                    type="checkbox"
                    id="chbx_Detraccion"
                    checked={definicion_CTX_COMPRA.detraccion}
                    onChange$={(e) => (definicion_CTX_COMPRA.detraccion = (e.target as HTMLInputElement).checked)}
                  />
                  <label for="chbx_Detraccion">Detracción</label>
                </div>
              </div>
              <div id="zona_Detraccion" hidden={!definicion_CTX_COMPRA.detraccion}>
                {/* Detracción Porcentaje */}
                <div class="form-control">
                  <label>Porcentaje de detracción</label>
                  <div class="form-control form-agrupado">
                    <input
                      type="number"
                      id="in_DetraccionPorcentaje"
                      style={{ width: "100%" }}
                      placeholder={"Porcentaje de detracción"}
                      value={definicion_CTX_COMPRA.detraccionPorcentaje.$numberDecimal}
                      onChange$={(e) => {
                        definicion_CTX_COMPRA.detraccionPorcentaje = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === "Enter") {
                          document.getElementById("in_DetraccionConstancia")?.focus();
                        }
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                    />
                    <input
                      id="in_BuscarDetraccionPorcentaje"
                      type="image"
                      src={images.searchPLUS}
                      height={16}
                      width={16}
                      style={{ padding: "2px" }}
                      // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                      onClick$={() => (definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBuscarDetraccionPorcentaje = true)}
                    />
                  </div>
                </div>
                {/* Detracción Constancia */}
                <div class="form-control">
                  <label>Constancia de detracción</label>
                  <div class="form-control form-agrupado">
                    <input
                      type="number"
                      id="in_DetraccionConstancia"
                      style={{ width: "100%" }}
                      placeholder={"Constancia de detracción"}
                      value={definicion_CTX_COMPRA.detraccionConstancia}
                      onChange$={(e) => {
                        definicion_CTX_COMPRA.detraccionConstancia = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === "Enter") {
                          document.getElementById("in_DetraccionMonto")?.focus();
                        }
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                    />
                  </div>
                </div>
                {/* Detracción Monto */}
                <div class="form-control">
                  <label>Monto de detracción</label>
                  <div class="form-control form-agrupado">
                    <input
                      type="number"
                      id="in_DetraccionMonto"
                      style={{ width: "100%" }}
                      placeholder={"Monto de detracción PEN"}
                      value={
                        definicion_CTX_COMPRA.detraccionMontoPEN.$numberDecimal
                          ? definicion_CTX_COMPRA.detraccionMontoPEN.$numberDecimal
                          : definicion_CTX_COMPRA.detraccionMontoPEN
                      }
                      onChange$={(e) => {
                        definicion_CTX_COMPRA.detraccionMontoPEN = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === "Enter") {
                          document.getElementById("in_DetraccionFecha")?.focus();
                        }
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                    />
                  </div>
                </div>
                {/* Detracción Fecha */}
                <div class="form-control">
                  <label>Fecha de detracción</label>
                  <div class="form-control form-agrupado">
                    <input
                      id="in_DetraccionFecha"
                      style={{ width: "100%" }}
                      type="date"
                      placeholder="Fecha de detracción"
                      max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                      value={definicion_CTX_COMPRA.detraccionFecha}
                      onInput$={(e) => {
                        definicion_CTX_COMPRA.detraccionFecha = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === "Enter") {
                          (document.getElementById("chbx_Retencion") as HTMLInputElement)?.focus();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              <br></br>
            </div>
            {definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBuscarDetraccionPorcentaje && (
              <div class="modal">
                <BuscarDetraccionPorcentaje />
              </div>
            )}
            {/* ----------------------------------------------------- */}
            {/* RETENCION   alignItems: 'center',  justifyContent: 'center', marginRight: '3px'   */}
            <div id="zona_Retencion_Primaria" hidden={!definicion_CTX_COMPRA.agenteRetencion}>
              <div>
                <div style={{ display: "flex" }}>
                  <input
                    type="checkbox"
                    id="chbx_Retencion"
                    checked={definicion_CTX_COMPRA.retencion}
                    onChange$={(e) => (definicion_CTX_COMPRA.retencion = (e.target as HTMLInputElement).checked)}
                  />
                  <label for="chbx_Retencion">Retención</label>
                </div>
              </div>
              <div id="zona_Retencion_Secundaria" hidden={!definicion_CTX_COMPRA.retencion}>
                {/* Retencion Porcentaje */}
                <div class="form-control">
                  <div class="form-control form-agrupado">
                    <input
                      type="number"
                      id="in_RetencionPorcentaje"
                      style={{ width: "100%" }}
                      placeholder={"Porcentaje de retención"}
                      value={definicion_CTX_COMPRA.retencionPorcentaje}
                      onChange$={(e) => {
                        definicion_CTX_COMPRA.retencionPorcentaje = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === "Enter") {
                          document.getElementById("bu_RegistrarDocumentoIN_MICE")?.focus();
                        }
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                    />
                  </div>
                </div>
              </div>
              <br></br>
            </div>
            {/* ----------------------------------------------------- */}
            {/* OPERACION CONTABLE */}
            {definicion_CTX_COMPRA.contabilizarOperaciones && (
              <div>
                {/* Asiento contable OBLIGATORIO*/}
                <div>
                  <div style={{ marginBottom: "4px" }}>
                    <input
                      id="chk_asientoContableObligatorio_COMPRA"
                      type="checkbox"
                      title="Asiento contable obligatorio"
                      style={{ margin: "2px" }}
                      checked={definicion_CTX_COMPRA.asientoContableObligatorio}
                      onChange$={(e) => {
                        definicion_CTX_COMPRA.asientoContableObligatorio = (e.target as HTMLInputElement).checked;
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === "Enter") {
                          document.getElementById("btn_AddCuentaContable_COMPRA")?.focus();
                        }
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                    />
                    <label for="chk_asientoContableObligatorio_COMPRA" style={{ marginLeft: "2px" }}>
                      Asiento contable obligatorio
                    </label>
                  </div>
                </div>
                <div class="form-control">
                  <button
                    id="btn_AddCuentaContable_COMPRA"
                    onClick$={() => {
                      const planes = parametrosGlobales.planesContables;
                      // console.log('planes', planes);
                      const elPlan: any = planes.filter((elem: any) => elem.ejercicio === props.ejercicio);
                      // console.log('elPlan', elPlan);
                      if (elPlan.length === 1) {
                        idPlanContable.value = elPlan[0].idPlanContable;
                        definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBuscarCuentaContable = true;
                      } else {
                        idPlanContable.value = "";
                        alert(`El plan contable del ejercicio ${props.ejercicio} no existe. Pongase en contacto con el administrador.`);
                        return;
                      }
                    }}
                  >
                    Add cuenta contable
                  </button>
                </div>
                <div class="form-control">
                  {definicion_CTX_COMPRA.asientoContable.length > 0 ? (
                    <table style={{ fontSize: "0.8rem", fontWeight: "lighter", margin: "5px 0" }}>
                      <thead>
                        <tr>
                          <th>Ítem</th>
                          <th>Código</th>
                          <th>Descripción</th>
                          <th>Tipo</th>
                          <th>Destino</th>
                          <th>Importe</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {definicion_CTX_COMPRA.asientoContable.map((cuenta: any, index: number) => {
                          const indexItem = index + 1;
                          const importesss = cuenta.importe.$numberDecimal ? parseFloat(cuenta.importe.$numberDecimal) : parseFloat(cuenta.importe);

                          if (cuenta.tipo) {
                            // console.log('first sumaTOTAL_DEBER', sumaTOTAL_DEBER, importesss);
                            sumaTOTAL_DEBER = sumaTOTAL_DEBER + importesss;
                          }
                          if (!cuenta.tipo) {
                            // console.log('first sumaTOTAL_HABER', sumaTOTAL_HABER, importesss);
                            sumaTOTAL_HABER = sumaTOTAL_HABER + importesss;
                          }
                          // sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);
                          if (index + 1 === definicion_CTX_COMPRA.asientoContable.length) {
                            // console.log('antes de fijar', sumaTOTAL_DEBER, sumaTOTAL_HABER);
                            fijarMontos({
                              sumaTOTAL_DEBER,
                              sumaTOTAL_HABER,
                            });
                          }
                          return (
                            <tr key={cuenta.idAuxiliar}>
                              <td data-label="Ítem" key={cuenta.idAuxiliar} class="comoNumero">{`${cerosALaIzquierda(indexItem, 3)}`}</td>
                              <td data-label="Código" class="comoNumero">
                                {cuenta.codigo}
                              </td>
                              <td data-label="Descripción" class="comoCadena">
                                {cuenta.descripcion}
                              </td>
                              <td data-label="Tipo" class="acciones">
                                <input
                                  id="btn_TipoCuentaContable"
                                  type="button"
                                  style={{ fontSize: "1em" }}
                                  value={cuenta.tipo === true ? "DEBE" : "HABER"}
                                  // onClick$={() => (cuenta.tipo = !cuenta.tipo)}
                                  onClick$={(e) => {
                                    cuenta.tipo = !cuenta.tipo;
                                    (e.target as HTMLInputElement).value = cuenta.tipo ? "DEBE" : "HABER";
                                  }}
                                  // onChange$={(e) => (cuenta.tipo = !(e.target as HTMLInputElement).value)}
                                />
                              </td>
                              <td data-label="Destino" class="acciones">
                                {typeof cuenta.asientoDestino !== "undefined" ? (
                                  cuenta.asientoDestino.length > 0 ? (
                                    <input
                                      type="image"
                                      src={images.list}
                                      title="listar asiento destino"
                                      height={14}
                                      width={14}
                                      // onClick$={() => {
                                      //   ctx_buscar_cuenta_contable.cC = cuentaContable;
                                      //   ctx_buscar_cuenta_contable.mostrarPanelNewEditCuentaContable = true;
                                      // }}
                                    />
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </td>
                              <td data-label="Importe" class="acciones">
                                <input
                                  id={`in_Importe_NEW_EDIT_COMPRA_AC_${index}`}
                                  type="number"
                                  style={{ textAlign: "end", width: "80px" }}
                                  value={cuenta.importe.$numberDecimal ? cuenta.importe.$numberDecimal : cuenta.importe}
                                  onChange$={(e) => {
                                    cuenta.importe = parseFloat((e.target as HTMLInputElement).value);
                                    // TIENE ASIENTO DESTINO ???!!!
                                    if (typeof cuenta.asientoDestino !== "undefined" && cuenta.asientoDestino.length > 0) {
                                      for (let index = 0; index < cuenta.asientoDestino.length; index++) {
                                        const element = cuenta.asientoDestino[index];
                                        //calcular el IMPORTE
                                        element.importe = cuenta.importe * (element.porcentaje / 100);
                                      }
                                    }
                                    // console.log('IMPORTE CHANGE', cuenta.importe);
                                  }}
                                  onFocusin$={(e) => {
                                    (e.target as HTMLInputElement).select();
                                  }}
                                  onKeyPress$={(e) => {
                                    if (e.key === "Enter") {
                                      if (index + 1 < definicion_CTX_COMPRA.asientoContable.length) {
                                        document.getElementById(`in_Importe_NEW_EDIT_COMPRA_AC_${index + 1}`)?.focus();
                                      }
                                    }
                                  }}
                                />
                              </td>

                              <td data-label="Acciones" class="acciones">
                                <input
                                  type="image"
                                  src={images.arrowUp}
                                  title="Mover arriba"
                                  alt="icono de mover arriba"
                                  height={14}
                                  width={14}
                                  onClick$={() => {
                                    if (index > 0) {
                                      // const car = definicion_CTX_COMPRA.asientoContable.splice(index, 1)[0];
                                      // definicion_CTX_COMPRA.asientoContable.splice(index - 1, index, car);
                                      const car = definicion_CTX_COMPRA.asientoContable[index];
                                      definicion_CTX_COMPRA.asientoContable.splice(index, 1);
                                      definicion_CTX_COMPRA.asientoContable.splice(index - 1, 0, car);
                                    }
                                    // borrarCuentaContable.idAuxiliar = cuenta.idAuxiliar;
                                    // borrarCuentaContable.codigo = cuenta.codigo;
                                    // borrarCuentaContable.descripcion = cuenta.descripcion;
                                    // definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBorrarCuentaContable = true;
                                  }}
                                />
                                <input
                                  type="image"
                                  src={images.arrowDown}
                                  title="Mover abajo"
                                  alt="icono de mover abajo"
                                  height={14}
                                  width={14}
                                  style={{ margin: "0 2px" }}
                                  onClick$={() => {
                                    if (index < definicion_CTX_COMPRA.asientoContable.length - 1) {
                                      //tomar el elemento
                                      // const indiceElemento=definicion_CTX_COMPRA.asientoContable.indexOf()
                                      // index = index + 1;
                                      const elemento = definicion_CTX_COMPRA.asientoContable.splice(index, 1)[0];
                                      definicion_CTX_COMPRA.asientoContable.splice(index + 1, index, elemento);
                                    }
                                    // borrarCuentaContable.idAuxiliar = cuenta.idAuxiliar;
                                    // borrarCuentaContable.codigo = cuenta.codigo;
                                    // borrarCuentaContable.descripcion = cuenta.descripcion;
                                    // definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBorrarCuentaContable = true;
                                  }}
                                />
                                <input
                                  type="image"
                                  src={images.trash}
                                  title="Eliminar ítem"
                                  alt="icono de eliminar"
                                  height={14}
                                  width={14}
                                  onClick$={() => {
                                    borrarCuentaContable.idAuxiliar = cuenta.idAuxiliar;
                                    borrarCuentaContable.codigo = cuenta.codigo;
                                    borrarCuentaContable.descripcion = cuenta.descripcion;

                                    definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBorrarCuentaContable = true;
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th colSpan={4} class="comoNumero">
                            Partida doble
                          </th>
                          <th colSpan={1}>{sumaTOTAL_DEBER - sumaTOTAL_HABER}</th>
                          <th></th>
                        </tr>
                      </tfoot>
                    </table>
                  ) : definicion_CTX_COMPRA.contabilizarOperaciones ? (
                    <i style={{ fontSize: "0.8rem" }}>No existen cuentas contables</i>
                  ) : (
                    ""
                  )}
                </div>
                {definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBuscarCuentaContable && (
                  <div class="modal">
                    <BuscarCuentaContable
                      ejercicio={props.ejercicio}
                      idPlanContable={idPlanContable.value}
                      tipoDefault={definicion_CTX_COMPRA.codigoTCP === "07" ? false : true}
                      verificarAsientoDestino={true}
                    />
                  </div>
                )}
                {definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelBorrarCuentaContable && (
                  <div class="modal">
                    <BorrarCuentaContable borrarCuentaContable={borrarCuentaContable} />
                  </div>
                )}
              </div>
            )}
            {definicion_CTX_NEW_EDIT_COMPRA.mostrarPanelErrorDiferenciaPartidaDoble && (
              <div class="modal">
                <ErrorDiferenciaPartidaDoble
                // ejercicio={props.ejercicio}
                // idPlanContable={idPlanContable.value}
                // tipoDefault={definicion_CTX_COMPRA.codigoTCP === '07' ? false : true}
                />
              </div>
            )}
            <br />
          </div>

          {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
          <input
            id="bu_RegistrarDocumentoIN_MICE"
            type="button"
            value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
            // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
            class="btn-centro"
            onClick$={() => registrarCompra()}
          />
        </div>
      </div>
    );
  }
);

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
