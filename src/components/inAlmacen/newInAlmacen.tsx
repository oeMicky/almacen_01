import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_IN_ALMACEN } from '~/routes/(inventario)/inAlmacen';
import type { IPersona } from '~/interfaces/iPersona';
import type { IIngresoAAlmacen } from '~/interfaces/iInAlmacen';
import ElButton from '../system/elButton';
// import NewEditDocumento from '../miscelanea/documento/newEditDocumento';
import BuscarMercaderiaIN from '../miscelanea/mercaderiaIN/buscarMercaderiaIN';
import {
  cerosALaIzquierda,
  diaDeLaSemana,
  elIdAuxiliar,
  formatear_6Decimales,
  formatoDDMMYYYY_PEN,
  hoy,
  // numeroDiaDeLaFecha,
  // menosXdiasHoy,
  // hoy,
  // primeroDelMes,
  redondeo2Decimales,
  // ultimoDelMes,
  // ultimoDiaDelPeriodoX,
} from '~/functions/comunes';
import style from '../tabla/tabla.css?inline';
// import BorrarItemMercaderiaIN from './borrarItemMercaderiaIN';
import BorrarDocumentoIN from './borrarDocumentoIN';
import BuscarPersona from '../miscelanea/persona/buscarPersona';

import { inIngresoAAlmacen, loadMotivosIngresoAAlmacen } from '~/apis/ingresosAAlmacen.api';
import { parametrosGlobales } from '~/routes/login';
import ElSelect from '../system/elSelect';
import BuscarOrdenServicioAperturado from '../miscelanea/ordenServicioAperturado/buscarOrdenServicioAperturado';
import BuscarNotaDeSalidaReingreso from './buscarNotaDeSalidaReingreso';
import BuscarVentaDespachadaReingreso from './buscarVentaDespachadaReingreso';
import BuscarOrdenProduccionAperturado from '../miscelanea/ordenProduccionAperturado/buscarOrdenProduccionAperturado';
import BuscarOrdenProduccionTerminado from '../miscelanea/ordenProduccionTerminado/buscarOrdenProduccionTerminado';
import BorrarItemMercaderiaIN from './borrarItemMercaderiaIN';
import { getTipoCambio } from '~/apis/apisExternas.api';
import ListaFavoritosAlmacen from '../miscelanea/favoritos/listaFavoritosAlmacen';
import { loadTiposComprobantePago } from '~/apis/sunat.api';
import { getPersonaPorDniRuc } from '~/apis/persona.api';

export const CTX_NEW_IN_ALMACEN = createContextId<any>('new_in_almacen');

export const CTX_IN_ALMACEN = createContextId<IIngresoAAlmacen>('in_almacen');

export const CTX_REMITENTE_IN_ALMACEN = createContextId<IPersona>('remitente_in_almacen');

export default component$((props: { addPeriodo?: any; inSelecci: any; losIgvsCompra?: any; igvCompraPorDefault?: any; indexItem?: number }) => {
  useStyles$(style);

  //#region DEFINICION CTX_NEW_IN_ALMACEN
  const definicion_CTX_NEW_IN_ALMACEN = useStore({
    rol_Persona: '',
    selecciono_Persona: false,

    mensajeErrorRemitente: '',

    mostrarPanelBuscarPersona: false,

    mostrarPanelListaFavoritosAlmacen: false,

    mostrarPanelBuscarMercaderiaIN: false,
    mostrarPanelDeleteItemMercaderiaIN: false,
    borrarIdAuxiliarDoc: 0,
    borrarIdAuxiliar: 0,

    mostrarPanelAdjuntarDocumento: false,
    mostrarPanelDeleteDocumentoIN: false,
    graboDocumento: false,

    mostrarPanelBuscarOrdenProduccionAperturado: false,

    mostrarPanelBuscarOrdenProduccionTerminado: false,
    mostrarPanelRegistroProductosTerminados: false,

    mostrarPanelBuscarOrdenServicioAperturado: false,
    mostrarPanelReingresoRequisiciones: false,

    mostrarPanelBuscarNotaDeSalidaReingreso: false,

    mostrarPanelBuscarVentaDespachadaReingreso: false,
  });
  useContextProvider(CTX_NEW_IN_ALMACEN, definicion_CTX_NEW_IN_ALMACEN);
  //#endregion DEFINICION CTX_NEW_IN_ALMACEN

  //#region DEFINICION CTX_IN_ALMACEN
  const definicion_CTX_IN_ALMACEN = useStore<IIngresoAAlmacen>(
    {
      _id: props.inSelecci._id ? props.inSelecci._id : '',

      idGrupoEmpresarial: props.inSelecci.idGrupoEmpresarial ? props.inSelecci.idGrupoEmpresarial : parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.inSelecci.idEmpresa ? props.inSelecci.idEmpresa : parametrosGlobales.idEmpresa,
      idSucursal: props.inSelecci.idSucursal ? props.inSelecci.idSucursal : parametrosGlobales.idSucursal,
      idAlmacen: props.inSelecci.idAlmacen ? props.inSelecci.idAlmacen : parametrosGlobales.idAlmacen,

      idPeriodo: props.inSelecci.idPeriodo ? props.inSelecci.idPeriodo : props.addPeriodo.idPeriodo,
      periodo: props.inSelecci.periodo ? props.inSelecci.periodo : props.addPeriodo.periodo,

      ruc: props.inSelecci.ruc ? props.inSelecci.ruc : parametrosGlobales.RUC,
      empresa: props.inSelecci.empresa ? props.inSelecci.empresa : parametrosGlobales.RazonSocial,
      direccion: props.inSelecci.direccion ? props.inSelecci.direccion : parametrosGlobales.Direccion,

      idMotivoIngresoAlmacen: props.inSelecci.idMotivoIngresoAlmacen ? props.inSelecci.idMotivoIngresoAlmacen : '',
      motivoIngresoAlmacen: props.inSelecci.motivoIngresoAlmacen ? props.inSelecci.motivoIngresoAlmacen : '',
      idDocumento: props.inSelecci.idDocumento ? props.inSelecci.idDocumento : '',

      idSerieNotaIngreso: props.inSelecci.idSerieNotaIngreso ? props.inSelecci.idSerieNotaIngreso : parametrosGlobales.idSerieNotaIngreso,
      serie: props.inSelecci.serie ? props.inSelecci.serie : parametrosGlobales.serieNotaIngreso,

      observacion: props.inSelecci.observacion ? props.inSelecci.observacion : '',

      // serie: props.inSelecci.serie ? props.inSelecci.serie : '',
      // numero: props.inSelecci.numero ? props.inSelecci.numero : 0,
      FISMA: props.inSelecci.FISMA ? props.inSelecci.FISMA.substring(0, 10) : hoy(),
      reingreso: props.inSelecci.reingreso ? props.inSelecci.reingreso : false,
      produccion: props.inSelecci.produccion ? props.inSelecci.produccion : false,

      idElIgv: props.inSelecci.idElIgv ? props.inSelecci.idElIgv : props.igvCompraPorDefault.idElIgv,
      elIgv: props.inSelecci.elIgv
        ? props.inSelecci.elIgv.$numberDecimal
          ? props.inSelecci.elIgv.$numberDecimal
          : props.inSelecci.elIgv
        : props.igvCompraPorDefault.elIgv.$numberDecimal,

      enDolares: false,
      moneda: 'PEN',
      tipoCambio: 0,

      enDolaresManual: false,
      tipoCambioManual: props.inSelecci.tipoCambioManual ? props.inSelecci.tipoCambioManual : parametrosGlobales.tipoCambioManual,

      // correlativo: props.inSelecci.correlativo ? props.inSelecci.correlativo : 0,

      //   estado: props.inSelecci.estado ? props.inSelecci.estado : '',
      //   tipo: props.inSelecci.tipo ? props.inSelecci.tipo : '',
      //   idTecnico: props.inSelecci.idTecnico ? props.inSelecci.idTecnico : '',
      //   razonSocialNombreTecnico: props.inSelecci.razonSocialNombreTecnico ? props.inSelecci._id : '',

      idRemitente: props.inSelecci.idRemitente ? props.inSelecci.idRemitente : '',
      codigoTipoDocumentoIdentidad: props.inSelecci.codigoTipoDocumentoIdentidad ? props.inSelecci.codigoTipoDocumentoIdentidad : '6',
      tipoDocumentoIdentidad: props.inSelecci.tipoDocumentoIdentidad ? props.inSelecci.tipoDocumentoIdentidad : 'RUC',
      numeroIdentidad: props.inSelecci.numeroIdentidad ? props.inSelecci.numeroIdentidad : '',
      razonSocialNombre: props.inSelecci.razonSocialNombre ? props.inSelecci.razonSocialNombre : '',

      //   idVehiculo: props.inSelecci.idVehiculo ? props.inSelecci.idVehiculo : '',
      //   placa: props.inSelecci.placa ? props.inSelecci.placa : '',
      //   idVehiculoMarca: props.inSelecci.idVehiculoMarca ? props.inSelecci.idVehiculoMarca : '',
      //   vehiculoMarca: props.inSelecci.vehiculoMarca ? props.inSelecci.vehiculoMarca : '',
      //   idVehiculoModelo: props.inSelecci.idVehiculoModelo ? props.inSelecci.idVehiculoModelo : '',
      //   vehiculoModelo: props.inSelecci.vehiculoModelo ? props.inSelecci.vehiculoModelo : '',
      //   vin: props.inSelecci.vin ? props.inSelecci.vin : '',

      documentosAdjuntos: props.inSelecci.documentosAdjuntos ? props.inSelecci.documentosAdjuntos : [],

      conIGV: false,
      porMontoUnitario: false,
      itemsMercaderias: props.inSelecci.itemsMercaderias ? props.inSelecci.itemsMercaderias : [],

      montoSubTotalPEN: props.inSelecci.montoSubTotalPEN ? props.inSelecci.montoSubTotalPEN : 0,
      montoIGVPEN: props.inSelecci.montoIGVPEN ? props.inSelecci.montoIGVPEN : 0,
      montoTotalPEN: props.inSelecci.montoTotalPEN ? props.inSelecci.montoTotalPEN : 0,

      montoSubTotalUSD: props.inSelecci.montoSubTotalUSD ? props.inSelecci.montoSubTotalUSD : 0,
      montoIGVUSD: props.inSelecci.montoIGVUSD ? props.inSelecci.montoIGVUSD : 0,
      montoTotalUSD: props.inSelecci.montoTotalUSD ? props.inSelecci.montoTotalUSD : 0,

      usuarioCrea: props.inSelecci.usuarioCrea ? props.inSelecci.usuarioCrea : '',
      creado: props.inSelecci.createdAt ? props.inSelecci.createdAt : '',
    },
    { deep: true }
  );
  useContextProvider(CTX_IN_ALMACEN, definicion_CTX_IN_ALMACEN);
  //#endregion DEFINICION CTX_IN_ALMACEN

  //#region DEFINICION CTX_REMITENTE_IN_ALMACEN
  const defini_CTX_REMITENTE_IN_ALMACEN = useStore<IPersona>({
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
  useContextProvider(CTX_REMITENTE_IN_ALMACEN, defini_CTX_REMITENTE_IN_ALMACEN);
  //#endregion DEFINICION CTX_REMITENTE_IN_ALMACEN

  //#region CONTEXTO
  const ctx_index_in_almacen = useContext(CTX_INDEX_IN_ALMACEN);
  //#endregion CONTEXTO

  //#region INICALIZACION
  const ini = useSignal(0);
  const LosTCPcargados = useSignal([]);

  let suma_SubPEN = 0;
  let suma_IGVPEN = 0;
  let suma_TotPEN = 0;

  let suma_SubUSD = 0;
  let suma_IGVUSD = 0;
  let suma_TotUSD = 0;

  // const elDocSelecionado = useSignal([]);
  const losMotivosCargados = useSignal([]);

  // const filaPivote: any = useSignal([]);
  // const filaAComparar: any = useSignal([]);
  const documento = useStore({
    idAuxiliar: elIdAuxiliar(),
    codigoTCP: '',
    descripcionTCP: '',
    fecha: hoy(),
    serie: '',
    numero: '',

    lote: '',
  });

  const borrarDocumento = useStore({
    idAuxiliar: '',
    codigoTCP: '',
    descripcionTCP: '',
    fecha: '',
    serie: '',
    numero: '',
  });

  const borrarItemMercaIN = useStore({
    idAuxiliar: '',
    item: 0,
    codigo: '',
    descripcion: '',
  });

  // const FISMAenDate = new Date(definicion_CTX_IN_ALMACEN.FISMA);
  // const diaDelFISMA = FISMAenDate.getDay();

  // const
  //#endregion INICALIZACION

  //#region CARGAR LOS TCP
  const cargarLosTCP = $(async () => {
    const losTCP = await loadTiposComprobantePago();
    console.log('losTCP', losTCP);
    LosTCPcargados.value = losTCP.data;
    //console.log(' LosTCPcargados.value', LosTCPcargados.value);
  });

  // useTask$(({ track }) => {
  //   track(() => ini.value);
  //   cargarLosTCP();
  // });
  //#endregion CARGAR LOS TCP

  //#region CARGAR MOTIVOS DE INGRESO
  const cargarMotivosIngreso = $(async () => {
    const losMotivos = await loadMotivosIngresoAAlmacen({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });

    losMotivosCargados.value = losMotivos.data;
  });

  useTask$(({ track }) => {
    track(() => ini.value);
    cargarMotivosIngreso();
    cargarLosTCP();
  });
  //#endregion CARGAR MOTIVOS DE INGRESO

  //#region REMITENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_IN_ALMACEN.selecciono_Persona);
    console.log('🎲🎲🎲🎲🎲', definicion_CTX_NEW_IN_ALMACEN.selecciono_Persona, definicion_CTX_NEW_IN_ALMACEN.rol_Persona);

    if (definicion_CTX_NEW_IN_ALMACEN.selecciono_Persona && definicion_CTX_NEW_IN_ALMACEN.rol_Persona === 'remitente') {
      // alert('evalua a la persona');
      definicion_CTX_IN_ALMACEN.idRemitente = defini_CTX_REMITENTE_IN_ALMACEN._id;
      definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad = defini_CTX_REMITENTE_IN_ALMACEN.codigoTipoDocumentoIdentidad;
      definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad = defini_CTX_REMITENTE_IN_ALMACEN.tipoDocumentoIdentidad;
      definicion_CTX_IN_ALMACEN.numeroIdentidad = defini_CTX_REMITENTE_IN_ALMACEN.numeroIdentidad;
      definicion_CTX_IN_ALMACEN.razonSocialNombre = defini_CTX_REMITENTE_IN_ALMACEN.razonSocialNombre;

      definicion_CTX_NEW_IN_ALMACEN.rol_Persona = '';
      definicion_CTX_NEW_IN_ALMACEN.selecciono_Persona = false;
    }
  });
  //#endregion REMITENTE

  //#region RECALCULAR MONTOS EN DOLARES
  const recalcularMontosEnDolares = $(() => {
    if (definicion_CTX_IN_ALMACEN.itemsMercaderias.length > 0) {
      definicion_CTX_IN_ALMACEN.itemsMercaderias.map((elemento: any) => {
        if (definicion_CTX_IN_ALMACEN.tipoCambio !== 0) {
          const IGVCalculado = 1 + Number(elemento.IGV) / 100;
          elemento.costoUnitarioUSD = formatear_6Decimales(elemento.costoUnitarioPEN / definicion_CTX_IN_ALMACEN.tipoCambio);

          // elemento.precioUniUSD = formatear_6Decimales(precio * definicion_CTX_IN_ALMACEN.tipoCambio);
          elemento.subUSD = formatear_6Decimales(elemento.cantidadIngresada * (elemento.costoUnitarioPEN / definicion_CTX_IN_ALMACEN.tipoCambio));
          elemento.valorUnitarioUSD = formatear_6Decimales(IGVCalculado * (elemento.costoUnitarioPEN / definicion_CTX_IN_ALMACEN.tipoCambio));
          elemento.totUSD = formatear_6Decimales(
            elemento.cantidadIngresada * (IGVCalculado * (elemento.costoUnitarioPEN / definicion_CTX_IN_ALMACEN.tipoCambio))
          );
        }
      });
    }
  });
  //#endregion RECALCULAR MONTOS EN DOLARES

  //#region TIPO CAMBIO
  const obtenerTipoCambio = $(async (e: HTMLInputElement) => {
    const checkTC = e.checked;
    if (checkTC) {
      definicion_CTX_IN_ALMACEN.enDolares = true;
      definicion_CTX_IN_ALMACEN.enDolaresManual = false;
      //console.log('🎲🎰🎲🎰🎲🎰');
      // //console.log('🎲🎰🎲🎰🎲🎰', definicion_CTX_IN_ALMACEN.documentosAdjuntos[0].fecha);
      // //console.log('🎲🎰🎲🎰🎲🎰', definicion_CTX_IN_ALMACEN.FISMA);
      let laFecha;
      if (definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen === 'APERTURA DE INVENTARIO') {
        laFecha = definicion_CTX_IN_ALMACEN.FISMA;
      } else {
        if (typeof definicion_CTX_IN_ALMACEN.documentosAdjuntos[0] === 'undefined') {
          (document.getElementById('chbx_TipoCambio_IN_ALMACEN') as HTMLInputElement).checked = false;
          definicion_CTX_IN_ALMACEN.enDolares = false;
          definicion_CTX_IN_ALMACEN.moneda = 'PEN';
          definicion_CTX_IN_ALMACEN.tipoCambio = 0;
          return;
        }
        laFecha = definicion_CTX_IN_ALMACEN.documentosAdjuntos[0].fecha;
      }

      let elTipoCambio = await getTipoCambio(laFecha);
      elTipoCambio = elTipoCambio.data;
      //console.log('🎰🎰🎰', elTipoCambio);
      recalcularMontosEnDolares();

      definicion_CTX_IN_ALMACEN.moneda = elTipoCambio.moneda;
      definicion_CTX_IN_ALMACEN.tipoCambio = elTipoCambio.venta;

      // let itemsVVVVVV = await tablaItemsVentaADolares(elTipoCambio.venta);
      //
    } else {
      definicion_CTX_IN_ALMACEN.enDolares = false;
      definicion_CTX_IN_ALMACEN.moneda = 'PEN';
      definicion_CTX_IN_ALMACEN.tipoCambio = 0;
    }
  });
  //#endregion TIPO CAMBIO

  //#region TIPO CAMBIO MANUAL
  const obtenerTipoCambioManual = $(async (e: HTMLInputElement) => {
    const checkTC = e.checked;
    console.log('😄😄😄😄😄', checkTC);
    if (checkTC) {
      definicion_CTX_IN_ALMACEN.enDolares = false;
      definicion_CTX_IN_ALMACEN.enDolaresManual = true;
      console.log('😄😄😄😄😄', definicion_CTX_IN_ALMACEN.enDolares, definicion_CTX_IN_ALMACEN.enDolaresManual);

      // elTipoCambio = elTipoCambio.data;
      //console.log('🎰🎰🎰', elTipoCambio);

      // recalcularMontosEnDolares();

      definicion_CTX_IN_ALMACEN.moneda = 'USD';
      definicion_CTX_IN_ALMACEN.tipoCambioManual = parametrosGlobales.tipoCambioManual;
      console.log('😄😄😄😄😄', definicion_CTX_IN_ALMACEN.moneda, definicion_CTX_IN_ALMACEN.tipoCambioManual);
      if (definicion_CTX_IN_ALMACEN.itemsMercaderias.length > 0) {
        definicion_CTX_IN_ALMACEN.itemsMercaderias.map((elemento: any) => {
          if (definicion_CTX_IN_ALMACEN.tipoCambioManual !== 0) {
            const IGVCalculado = 1 + Number(elemento.IGV) / 100;
            elemento.costoUnitarioUSD = formatear_6Decimales(elemento.costoUnitarioPEN / definicion_CTX_IN_ALMACEN.tipoCambioManual);

            // elemento.precioUniUSD = formatear_6Decimales(precio * definicion_CTX_IN_ALMACEN.tipoCambio);
            elemento.subUSD = formatear_6Decimales(elemento.cantidadIngresada * (elemento.costoUnitarioPEN / definicion_CTX_IN_ALMACEN.tipoCambioManual));
            elemento.valorUnitarioUSD = formatear_6Decimales(IGVCalculado * (elemento.costoUnitarioPEN / definicion_CTX_IN_ALMACEN.tipoCambioManual));
            elemento.totUSD = formatear_6Decimales(
              elemento.cantidadIngresada * (IGVCalculado * (elemento.costoUnitarioPEN / definicion_CTX_IN_ALMACEN.tipoCambioManual))
            );
          }
        });
      }
    } else {
      console.log('😥😥😥😥😥', checkTC);
      definicion_CTX_IN_ALMACEN.enDolaresManual = false;
      definicion_CTX_IN_ALMACEN.moneda = 'PEN';
      definicion_CTX_IN_ALMACEN.tipoCambioManual = 0;
    }
  });
  //#endregion TIPO CAMBIO MANUAL

  //#region ELIMINAR DOCUMENTO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_IN_ALMACEN.borrarIdAuxiliarDoc);
    if (definicion_CTX_NEW_IN_ALMACEN.borrarIdAuxiliarDoc > 0) {
      const newItems: any = definicion_CTX_IN_ALMACEN.documentosAdjuntos.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_IN_ALMACEN.borrarIdAuxiliarDoc
      );
      definicion_CTX_IN_ALMACEN.documentosAdjuntos = newItems;
      definicion_CTX_NEW_IN_ALMACEN.borrarIdAuxiliarDoc = 0;
      if (definicion_CTX_IN_ALMACEN.documentosAdjuntos.length === 0) {
        (document.getElementById('chbx_TipoCambio_IN_ALMACEN') as HTMLInputElement).checked = false;
        definicion_CTX_IN_ALMACEN.enDolares = false;

        definicion_CTX_IN_ALMACEN.moneda = 'PEN';
        definicion_CTX_IN_ALMACEN.tipoCambio = 0;
      }
    }
  });
  //#endregion ELIMINAR DOCUMENTO

  //#region GRABO DOCUMENTO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_IN_ALMACEN.graboDocumento);

    if (definicion_CTX_NEW_IN_ALMACEN.graboDocumento) {
      if (definicion_CTX_IN_ALMACEN.enDolares) {
        // obtenerTipoCambio(document.getElementById('chbx_TipoCambio_IN_ALMACEN') as HTMLInputElement);
      }
    }
    definicion_CTX_NEW_IN_ALMACEN.graboDocumento = false;
  });
  //#endregion GRABO DOCUMENTO

  //#region ELIMINAR ITEM MERCADERIA
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_IN_ALMACEN.borrarIdAuxiliar);
    if (definicion_CTX_NEW_IN_ALMACEN.borrarIdAuxiliar > 0) {
      const newItems: any = definicion_CTX_IN_ALMACEN.itemsMercaderias.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_IN_ALMACEN.borrarIdAuxiliar
      );
      definicion_CTX_IN_ALMACEN.itemsMercaderias = newItems;
      definicion_CTX_NEW_IN_ALMACEN.borrarIdAuxiliar = 0;
    }
  });
  //#endregion ELIMINAR ITEM MERCADERIA

  //#region REGISTRAR_INGRESO
  const registrarIngreso = $(async () => {
    if (definicion_CTX_IN_ALMACEN.idAlmacen === '' || typeof definicion_CTX_IN_ALMACEN.idAlmacen === 'undefined') {
      alert('No se identificado el almacén, por favor verifique.');
      // document.getElementById('se_motivoIngreso')?.focus();
      return;
    }
    if (definicion_CTX_IN_ALMACEN.periodo.toString() === '' || typeof definicion_CTX_IN_ALMACEN.periodo === 'undefined') {
      alert('Ingrese el periodo');
      document.getElementById('in_Periodo')?.focus();
      return;
    }
    if (definicion_CTX_IN_ALMACEN.FISMA === '' || typeof definicion_CTX_IN_ALMACEN.FISMA === 'undefined') {
      alert('Ingrese la fecha FISMA');
      document.getElementById('in_FISMA')?.focus();
      return;
    }
    if (definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen === '' || typeof definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen === 'undefined') {
      alert('Seleccione el motivo de ingreso');
      document.getElementById('se_motivoIngreso')?.focus();
      return;
    }
    if (definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad === '' || typeof definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad === 'undefined') {
      alert('Identifique al remitente');
      document.getElementById('img_buscarREMITENTE')?.focus();
      return;
    }
    if (definicion_CTX_IN_ALMACEN.numeroIdentidad === '' || typeof definicion_CTX_IN_ALMACEN.numeroIdentidad === 'undefined') {
      alert('Identifique al remitente');
      document.getElementById('img_buscarREMITENTE')?.focus();
      return;
    }
    if (definicion_CTX_IN_ALMACEN.razonSocialNombre === '' || typeof definicion_CTX_IN_ALMACEN.razonSocialNombre === 'undefined') {
      alert('Identifique al remitente');
      document.getElementById('img_buscarREMITENTE')?.focus();
      return;
    }
    if (definicion_CTX_IN_ALMACEN.elIgv.toString() === '' || typeof definicion_CTX_IN_ALMACEN.elIgv === 'undefined') {
      alert('Identifique el igv');
      document.getElementById('in_IGV')?.focus();
      return;
    }
    if (definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen !== 'APERTURA DE INVENTARIO' && definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen !== 'TRASLADO') {
      // if (definicion_CTX_IN_ALMACEN.documentosAdjuntos.length < 1) {
      //   alert('Agregue al menos un documento');
      //   document.getElementById('bu_Add_Documento')?.focus();
      //   return;
      // }
      if (documento.descripcionTCP === '') {
        alert('Seleccione el tipo de comprobante de pago');
        document.getElementById('se_tcpIN_DOCUMENTO')?.focus();
        return;
      }
      if (documento.fecha === '') {
        alert('Seleccione la fecha del comprobante de pago');
        document.getElementById('in_Fecha_DOCUMENTO')?.focus();
        return;
      }
      if (documento.serie === '') {
        alert('Ingrese la serie del comprobante de pago');
        document.getElementById('in_Serie_DOCUMENTO')?.focus();
        return;
      }
      if (documento.numero === '') {
        alert('Ingrese el número de comprobante de pago');
        document.getElementById('in_Numero_DOCUMENTO')?.focus();
        return;
      }
    }
    if (definicion_CTX_IN_ALMACEN.itemsMercaderias.length < 1) {
      alert('Agregue al menos una mercadería');
      document.getElementById('bu_Add_Mercaderia')?.focus();
      return;
    }

    ctx_index_in_almacen.mostrarSpinner = true;
    //FECHA HORA LOCAL
    const fechaLocal =
      definicion_CTX_IN_ALMACEN.FISMA.substring(8, 10) +
      '-' +
      definicion_CTX_IN_ALMACEN.FISMA.substring(5, 7) +
      '-' +
      definicion_CTX_IN_ALMACEN.FISMA.substring(0, 4);

    const hhhhDate = new Date();
    const horaLocal =
      cerosALaIzquierda(hhhhDate.getHours(), 2) + ':' + cerosALaIzquierda(hhhhDate.getMinutes(), 2) + ':' + cerosALaIzquierda(hhhhDate.getSeconds(), 2);
    //
    const inAlma = await inIngresoAAlmacen({
      idIngresoAAlmacen: definicion_CTX_IN_ALMACEN._id,
      idGrupoEmpresarial: definicion_CTX_IN_ALMACEN.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_IN_ALMACEN.idEmpresa,
      idSucursal: definicion_CTX_IN_ALMACEN.idSucursal,
      idAlmacen: definicion_CTX_IN_ALMACEN.idAlmacen,
      idPeriodo: definicion_CTX_IN_ALMACEN.idPeriodo,
      periodo: definicion_CTX_IN_ALMACEN.periodo,

      ruc: definicion_CTX_IN_ALMACEN.ruc,
      empresa: definicion_CTX_IN_ALMACEN.empresa,
      direccion: definicion_CTX_IN_ALMACEN.direccion,

      idMotivoIngresoAlmacen: definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen,
      motivoIngresoAlmacen: definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen,
      idDocumento: definicion_CTX_IN_ALMACEN.idDocumento,

      idSerieNotaIngreso: definicion_CTX_IN_ALMACEN.idSerieNotaIngreso,
      serie: definicion_CTX_IN_ALMACEN.serie,

      // serie: definicion_CTX_IN_ALMACEN.serie,
      // numero: definicion_CTX_IN_ALMACEN.numero,
      FISMA: definicion_CTX_IN_ALMACEN.FISMA,
      fechaLocal: fechaLocal, //DD-MM-YYYY
      horaLocal: horaLocal,
      reingreso: definicion_CTX_IN_ALMACEN.reingreso,

      idElIgv: definicion_CTX_IN_ALMACEN.idElIgv,
      elIgv: definicion_CTX_IN_ALMACEN.elIgv,

      enDolares: definicion_CTX_IN_ALMACEN.enDolares,
      moneda: definicion_CTX_IN_ALMACEN.moneda,
      tipoCambio: definicion_CTX_IN_ALMACEN.tipoCambio,

      enDolaresManual: definicion_CTX_IN_ALMACEN.enDolaresManual,
      tipoCambioManual: definicion_CTX_IN_ALMACEN.tipoCambioManual,

      idRemitente: definicion_CTX_IN_ALMACEN.idRemitente,
      codigoTipoDocumentoIdentidad: definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_IN_ALMACEN.numeroIdentidad,
      razonSocialNombre: definicion_CTX_IN_ALMACEN.razonSocialNombre,

      observacion: definicion_CTX_IN_ALMACEN.observacion,

      documentosAdjuntos: documento, // definicion_CTX_IN_ALMACEN.documentosAdjuntos,

      conIGV: definicion_CTX_IN_ALMACEN.conIGV,
      porMontoUnitario: definicion_CTX_IN_ALMACEN.porMontoUnitario,
      itemsMercaderias: definicion_CTX_IN_ALMACEN.itemsMercaderias,

      montoSubTotalPEN: definicion_CTX_IN_ALMACEN.montoSubTotalPEN,
      montoIGVPEN: definicion_CTX_IN_ALMACEN.montoIGVPEN,
      montoTotalPEN: definicion_CTX_IN_ALMACEN.montoTotalPEN,

      montoSubTotalUSD: definicion_CTX_IN_ALMACEN.montoSubTotalUSD,
      montoIGVUSD: definicion_CTX_IN_ALMACEN.montoIGVUSD,
      montoTotalUSD: definicion_CTX_IN_ALMACEN.montoTotalUSD,

      usuario: parametrosGlobales.usuario,
    });

    if (inAlma.status === 400) {
      alert('Falla al registrar la inAlmacen. ' + inAlma.message);
      return;
    }

    ctx_index_in_almacen.grabo_InAlmacen = true;
    ctx_index_in_almacen.mostrarPanelNewInAlmacen = false;
  });
  //#endregion REGISTRAR_INGRESO

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(320px, 100%, 1112px)',
        background: `${
          definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : '#eee'
        }`,
        // width: 'auto',
        padding: '2px',
        // background: '#eee',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          title="Ver el definicion_CTX_IN_ALMACEN"
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          onClick={$(() => {
            console.log('definicion_CTX_IN_ALMACEN', definicion_CTX_IN_ALMACEN);
          })}
        />

        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            if (definicion_CTX_IN_ALMACEN.itemsMercaderias.length > 0) {
              if (confirm('Hay mercaderías ingresadas, ¿Desea cerrar el formulario?')) {
                ctx_index_in_almacen.mostrarPanelNewInAlmacen = false;
              }
              //  else {
              //   ctx_index_in_almacen.mostrarPanelNewInAlmacen = true;
              // }
            } else {
              ctx_index_in_almacen.mostrarPanelNewInAlmacen = false;
            }
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3 style={{ fontSize: '0.8rem' }}>
          In almacén - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
        </h3>
        {/* ----------------------------------------------------- */}
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE IN ALMACÉN */}
          <div>
            <div hidden={definicion_CTX_IN_ALMACEN._id === '' ? true : false}>
              {/* props.indexItem */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_indexItem"
                    style={{ width: '100%' }}
                    type="text"
                    // autoFocus
                    disabled
                    value={props.indexItem}
                  />
                </div>
              </div>
              {/* ID */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_ID"
                    style={{ width: '100%' }}
                    type="text"
                    // autoFocus
                    disabled
                    value={definicion_CTX_IN_ALMACEN._id}
                  />
                </div>
              </div>
              {/* USUARIO */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_USUARIO_CREA"
                    style={{ width: '100%' }}
                    type="text"
                    // autoFocus
                    disabled
                    value={definicion_CTX_IN_ALMACEN.usuarioCrea + '; ' + definicion_CTX_IN_ALMACEN.creado}
                  />
                </div>
              </div>
            </div>

            {/* Numero de documento*/}
            {/* <div class="form-control">
              <label>Número</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumento"
                  style={{ width: '100%' }}
                  type="text"
                  disabled
                  value={definicion_CTX_IN_ALMACEN.conIGV ? 'CON IGV' : 'SIN IGV'}
                />
              </div>
            </div> */}

            {/* MOTIVO INGRESO    ---    SERIE */}
            {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}> */}
            {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}> */}
            <div class="linea_1_111">
              {/* FISMA */}
              <div>
                <input
                  id="in_FISMA"
                  type="date"
                  disabled={definicion_CTX_IN_ALMACEN._id !== ''}
                  style={{ width: '100%' }}
                  // min={primeroDelMes()}
                  // min={menosXdiasHoy(2)}
                  max={hoy()}
                  // min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                  // // max={ultimoDelMes()}
                  // max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_IN_ALMACEN.FISMA}
                  onChange$={(e) => {
                    definicion_CTX_IN_ALMACEN.FISMA = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
              {/* motivo de ingreso */}
              <div>
                <ElSelect
                  id="se_motivoIngreso"
                  estilos={{ width: '100%' }}
                  valorSeleccionado={definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen}
                  registros={losMotivosCargados.value}
                  registroID="_id"
                  registroTEXT="motivoIngreso"
                  seleccione="-- Seleccione motivo ingreso --"
                  disabled={definicion_CTX_IN_ALMACEN.itemsMercaderias.length === 0 ? false : true}
                  onChange={$(() => {
                    const elSelec = document.getElementById('se_motivoIngreso') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;

                    definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen = elSelec[elIdx].id;
                    if (definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen === '') {
                      definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen = '';
                    } else {
                      definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen = elSelec.value;
                      switch (definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen) {
                        case 'ORDEN DE PRODUCCIÓN TERMINADA':
                          // alert('Elegio os');
                          definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarOrdenProduccionTerminado = true;
                          break;
                        case 'ORDEN DE PRODUCCIÓN (R)':
                          // alert('Elegio os');
                          definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarOrdenProduccionAperturado = true;
                          break;
                        case 'ORDEN DE SERVICIO (R)':
                          // alert('Elegio os');
                          definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarOrdenServicioAperturado = true;
                          break;
                        case 'NOTA DE SALIDA (R)':
                          // alert('Elegio os');
                          definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarNotaDeSalidaReingreso = true;
                          break;
                        case 'VENTA (R)':
                          // alert('Elegio os');
                          definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarVentaDespachadaReingreso = true;
                          break;
                        case 'APERTURA DE INVENTARIO':
                          //alert('Elegio venta');
                          // definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarPersona_Venta = true;
                          definicion_CTX_IN_ALMACEN.idRemitente = parametrosGlobales.idEmpresa;
                          definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad = '6';
                          definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad = 'RUC';
                          definicion_CTX_IN_ALMACEN.numeroIdentidad = parametrosGlobales.RUC;
                          definicion_CTX_IN_ALMACEN.razonSocialNombre = parametrosGlobales.RazonSocial;
                          break;

                        default:
                          break;
                      }
                      (document.getElementById('btn_Add_Mercaderia') as HTMLInputElement)?.focus();
                      // (document.getElementById('in_Observacion_IN') as HTMLSelectElement)?.focus();
                      // if (definicion_CTX_IN_ALMACEN.enDolares) {
                      //   // obtenerTipoCambio(document.getElementById('chbx_TipoCambio_IN_ALMACEN') as HTMLInputElement);
                      // }
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('btn_Add_Mercaderia') as HTMLInputElement)?.focus();
                      // (document.getElementById('in_Observacion_IN') as HTMLSelectElement)?.focus();
                    }
                  })}
                />
              </div>
              {/* SERIE */}
              <div>
                <input id="in_SERIE" type="text" disabled style={{ width: '100%' }} value={definicion_CTX_IN_ALMACEN.serie} />
              </div>
            </div>

            <br />
          </div>
          {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarOrdenProduccionTerminado && (
            <div class="modal">
              <BuscarOrdenProduccionTerminado
                contexto="ingreso_a_almacen"
                motivo={definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen}
                igv={definicion_CTX_IN_ALMACEN.elIgv}
              />
            </div>
          )}
          {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarOrdenProduccionAperturado && (
            <div class="modal">
              <BuscarOrdenProduccionAperturado contexto="ingreso_a_almacen" />
            </div>
          )}
          {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarOrdenServicioAperturado && (
            <div class="modal">
              <BuscarOrdenServicioAperturado contexto="ingreso_a_almacen" />
            </div>
          )}
          {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarNotaDeSalidaReingreso && (
            <div class="modal">
              <BuscarNotaDeSalidaReingreso />
            </div>
          )}
          {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarVentaDespachadaReingreso && (
            <div class="modal">
              <BuscarVentaDespachadaReingreso />
            </div>
          )}
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL REMITENTE */}
          <div>
            <div class="linea_1_111">
              {/* tipo de documento identidad REMITENTE*/}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input
                  id="in_TipoDocumentoLiteral_REMITENTE"
                  style={{ width: '100%' }}
                  type="text"
                  readOnly
                  placeholder="Tipo documento identidad"
                  value={definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad}
                />
                {/* <select
                  id="se_TipoDocumentoLiteral_REMITENTE"
                  disabled={definicion_CTX_IN_ALMACEN._id !== ''}
                  value={definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad}
                  style={{ cursor: 'pointer', width: '100%' }}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const rere = e.target as HTMLSelectElement;
                    const elOption = rere[idx];

                    //
                    //
                    // const csd = (e.target as HTMLSelectElement).current[idx];
                    // venta.codigoTipoDocumentoIdentidad = parseInt(elOption.id);
                    definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad = elOption.id;
                    definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                  }}
                  // style={{ width: '100%' }}
                >
                  <option id="1" value="DNI" selected={definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad === 'DNI'}>
                    DNI
                  </option>
                  <option id="6" value="RUC" selected={definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad === 'RUC'}>
                    RUC
                  </option>
                  <option id="4" value="C.EXT" selected={definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad === 'C.EXT'}>
                    C.EXT
                  </option>
                </select>
                */}
              </div>
              {/* numero identidad REMITENTE*/}
              <div style={{ display: 'flex' }}>
                <input
                  id="in_NumeroDocumentoIdentidad_REMITENTE"
                  style={{ width: '100%', fontWeight: 'bold' }}
                  type="text"
                  disabled={definicion_CTX_IN_ALMACEN._id !== ''}
                  placeholder="Add RUC/DNI Remitente"
                  value={definicion_CTX_IN_ALMACEN.numeroIdentidad}
                  onInput$={async (e) => {
                    definicion_CTX_IN_ALMACEN.numeroIdentidad = (e.target as HTMLInputElement).value;
                    if (
                      definicion_CTX_IN_ALMACEN.numeroIdentidad.length === 11
                      // &&
                      // (definicion_CTX_COTIZACION.numeroIdentidad.substring(0, 2) === '20' || definicion_CTX_COTIZACION.numeroIdentidad.substring(0, 2) === '10')
                    ) {
                      // document.getElementById('in_BuscarPersona')?.focus();  //206 105 176 34  // no encontrado  //no determinado
                      console.log('.............buscando por RUC', definicion_CTX_IN_ALMACEN.numeroIdentidad);
                      ctx_index_in_almacen.mostrarSpinner = true;
                      const cliente = await getPersonaPorDniRuc({
                        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                        idEmpresa: parametrosGlobales.idEmpresa,
                        buscarPor: 'DNI / RUC',
                        cadenaABuscar: definicion_CTX_IN_ALMACEN.numeroIdentidad,
                      });
                      ctx_index_in_almacen.mostrarSpinner = false;
                      console.log('.............buscando por RUC - cliente', cliente.data);
                      if (cliente.status === 400) {
                        alert(cliente.message);
                        return;
                      }
                      if (cliente.data.length === 0) {
                        // alert('Cliente no encontrado :|');
                        definicion_CTX_IN_ALMACEN.idRemitente = '';
                        definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad = '';
                        definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad = '';
                        // definicion_CTX_COTIZACION.numeroIdentidad = '';
                        definicion_CTX_IN_ALMACEN.razonSocialNombre = '';
                        definicion_CTX_NEW_IN_ALMACEN.mensajeErrorRemitente = 'Persona no encontrada';
                        return;
                      }
                      if (cliente.data.length === 1) {
                        definicion_CTX_IN_ALMACEN.idRemitente = cliente.data[0]._id;
                        definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad = cliente.data[0].codigoTipoDocumentoIdentidad;
                        definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad = cliente.data[0].tipoDocumentoIdentidad;
                        definicion_CTX_IN_ALMACEN.numeroIdentidad = cliente.data[0].numeroIdentidad;
                        definicion_CTX_IN_ALMACEN.razonSocialNombre = cliente.data[0].razonSocialNombre;
                        definicion_CTX_NEW_IN_ALMACEN.mensajeErrorRemitente = '';
                        return;
                      }
                      if (cliente.data.length > 1) {
                        // alert('Cliente no determinado :|');
                        definicion_CTX_IN_ALMACEN.idRemitente = '';
                        definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad = '';
                        definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad = '';
                        // definicion_CTX_COTIZACION.numeroIdentidad = '';
                        definicion_CTX_IN_ALMACEN.razonSocialNombre = '';
                        definicion_CTX_NEW_IN_ALMACEN.mensajeErrorRemitente = 'Persona no determinada';
                        return;
                      }

                      // definicion_CTX_BUSCAR_PERSONA.mostrarSpinner = true;
                      // localizarPersonas();
                      // definicion_CTX_BUSCAR_PERSONA.mostrarSpinner = false;
                    }
                  }}
                  onKeyUp$={(e) => {
                    if (e.key === 'Enter') {
                      if (definicion_CTX_IN_ALMACEN.idRemitente !== '') {
                        document.getElementById('in_Nombre_REMITENTE')?.focus();
                      } else {
                        document.getElementById('in_BuscarREMITENTE')?.focus();
                      }
                    }
                  }}

                  // onChange$={(e) => (definicion_CTX_IN_ALMACEN.numeroIdentidad = (e.target as HTMLInputElement).value)}
                  // onKeyPress$={$((e: any) => {
                  //   if (e.key === 'Enter') {
                  //     (document.getElementById('in_Nombre_REMITENTE') as HTMLInputElement)?.focus();
                  //   }
                  // })}
                />
                {definicion_CTX_IN_ALMACEN._id === '' ? (
                  <>
                    <input
                      title="Buscar datos de identidad"
                      id="in_BuscarREMITENTE"
                      type="image"
                      src={images.searchPLUS}
                      height={16}
                      width={16}
                      style={{ margin: '2px 4px' }}
                      // onFocusin$={() => }
                      onClick$={() => (definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarPersona = true)}
                    />
                    <input
                      title="Buscar en favoritos"
                      id="in_BuscarENFavoritos"
                      type="image"
                      src={images.listaFavoritos}
                      height={16}
                      width={16}
                      style={{ margin: '2px 0' }}
                      // onFocusin$={() => }
                      onClick$={() => (definicion_CTX_NEW_IN_ALMACEN.mostrarPanelListaFavoritosAlmacen = true)}
                    />
                  </>
                ) : (
                  ''
                )}
              </div>
              {/* Razon Social / Nombre - REMITENTE*/}
              <div>
                <input
                  id="in_Nombre_REMITENTE"
                  style={{ width: '100%' }}
                  type="text"
                  disabled={definicion_CTX_IN_ALMACEN._id !== ''}
                  placeholder="Razón social / Nombre - remitente"
                  value={definicion_CTX_IN_ALMACEN.razonSocialNombre}
                  onKeyPress$={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_IGV') as HTMLInputElement)?.focus();
                    }
                  })}
                />
              </div>
            </div>
            {definicion_CTX_NEW_IN_ALMACEN.mensajeErrorRemitente !== '' && (
              <label style={{ display: 'block', textAlign: 'center', color: 'red' }}>{definicion_CTX_NEW_IN_ALMACEN.mensajeErrorRemitente}</label>
            )}
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarPersona && (
              <div class="modal">
                <BuscarPersona
                  soloPersonasNaturales={false}
                  seleccionar="remitente"
                  contexto="new_in_almacen"
                  rol="remitente"
                  valorABuscarAUTOMATICAMENTE={definicion_CTX_IN_ALMACEN.numeroIdentidad}
                  mensajeErrorPersona={definicion_CTX_NEW_IN_ALMACEN.mensajeErrorRemitente}
                />
              </div>
            )}
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelListaFavoritosAlmacen && (
              <div class="modal">
                <ListaFavoritosAlmacen contexto="new_in_almacen" rol="remitente" />
              </div>
            )}

            <br />
          </div>
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  type={'text'}
                  id={'in_IGV'}
                  style={{ width: '100%' }}
                  disabled
                  value={definicion_CTX_IN_ALMACEN.elIgv + ' %'}
                  onKeyPress$={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('bu_Add_Documento') as HTMLButtonElement)?.focus();
                    }
                  })}
                />
              </div>
            </div>

            <br />
          </div>
          {/* ----------------------------------------------------- */}
        </div>
        {/* ----------------------------------------------------- */}
        {/* GENERALES DE LOS DOCUMENTOS ADJUNTOS */}
        <div
          style={
            definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen === 'APERTURA DE INVENTARIO' || definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen === 'TRASLADO'
              ? { display: 'none' }
              : ''
          }
        >
          <div>
            <div class="linea_1_1111">
              <div>
                <select
                  id="se_tcpIN_DOCUMENTO"
                  style={{ cursor: 'pointer', width: '100%' }}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const elSelect = e.target as HTMLSelectElement;
                    const elOption = elSelect[idx];

                    documento.codigoTCP = elOption.id;
                    documento.descripcionTCP = (e.target as HTMLSelectElement).value;
                    console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀', documento.codigoTCP, documento.descripcionTCP);

                    document.getElementById('in_Fecha_DOCUMENTO')?.focus();
                  }}
                  // onKeyUp$={$((e: any) => {
                  //   if (e.key === 'Enter') {
                  //     (document.getElementById('in_Fecha_DOCUMENTO') as HTMLSelectElement)?.focus();
                  //   }
                  // })}
                >
                  <option value="">-- Seleccione TCP --</option>
                  {LosTCPcargados.value.map((ser: any) => {
                    return (
                      <option id={ser.codigo} value={ser.descripcion} selected={ser.descripcion === documento.descripcionTCP}>
                        {ser.descripcion}
                      </option>
                    );
                  })}
                </select>
                {/* <ElSelect
                  id={'se_tcpIN_DOCUMENTO'}
                  valorSeleccionado={documento.descripcionTCP}
                  registros={LosTCPcargados.value}
                  registroID={'codigo'}
                  registroTEXT={'descripcion'}
                  seleccione={'-- Seleccione TCP --'}
                  onChange={$(() => {
                    // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                    const elSelec = document.getElementById('se_tcpIN_DOCUMENTO') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    // //console.log('?', elIdx, elSelec[elIdx].id);
                    documento.codigoTCP = elSelec[elIdx].id;
                    if (documento.codigoTCP === '') {
                      documento.descripcionTCP = '';
                    } else {
                      documento.descripcionTCP = elSelec.value;
                      // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Fecha_DOCUMENTO') as HTMLSelectElement)?.focus();
                    }
                  })}
                /> */}
              </div>
              <div>
                <input
                  id="in_Fecha_DOCUMENTO"
                  style={{ cursor: 'pointer', width: '100%' }}
                  type="date"
                  autoFocus
                  placeholder="Add fecha"
                  value={documento.fecha}
                  onInput$={(e) => {
                    documento.fecha = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Serie_DOCUMENTO') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
              <div>
                <input
                  id="in_Serie_DOCUMENTO"
                  style={{ width: '100%' }}
                  type="text"
                  autoFocus
                  placeholder="Add serie"
                  value={documento.serie}
                  onInput$={(e) => {
                    documento.serie = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Numero_DOCUMENTO') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
              <div>
                <input
                  id="in_Numero_DOCUMENTO"
                  style={{ width: '100%' }}
                  type="number"
                  placeholder="Add número"
                  value={documento.numero}
                  onChange$={(e) => {
                    documento.numero = (e.target as HTMLInputElement).value.trim();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('btn_Add_Mercaderia') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
            </div>
            <br />
            {/* {definicion_CTX_IN_ALMACEN._id === '' ? (
              <div style={{ marginBottom: '4px' }}>
                <ElButton
                  id="bu_Add_Documento"
                  class="btn"
                  name="Add documento"
                  title="Add documento"
                  disabled={definicion_CTX_IN_ALMACEN.produccion}
                  onClick={$(() => {
                    elDocSelecionado.value = [];
                    definicion_CTX_NEW_IN_ALMACEN.mostrarPanelAdjuntarDocumento = true;
                  })}
                />
              </div>
            ) : (
              ''
            )} */}
            {/* {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelAdjuntarDocumento && (
              <div class="modal">
                <NewEditDocumento docSelecci={elDocSelecionado.value} contexto="new_in_almacen" />
              </div>
            )} */}
            {/* TABLA DOCUMENTOS ADJUNTOS   */}
            {/* {definicion_CTX_IN_ALMACEN.documentosAdjuntos.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>TCP</th>
                    <th>Fecha</th>
                    <th>Serie</th>
                    <th>Número</th>
                    {definicion_CTX_IN_ALMACEN._id === '' ? <th>Acc</th> : ''}
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_IN_ALMACEN.documentosAdjuntos.map((iTDocAdj: any) => {
                    // const indexItemServi = index + 1;

                    return (
                      <tr key={iTDocAdj.idAuxiliar} style={{ backgroundColor: '#cdc2b5 ' }}>
                        <td data-label="TCP">{iTDocAdj.descripcionTCP}</td>
                        <td data-label="Fecha">{formatoDDMMYYYY_PEN(iTDocAdj.fecha)}</td>
                        <td data-label="Serie">{iTDocAdj.serie}</td>
                        <td data-label="Número">{cerosALaIzquierda(iTDocAdj.numero, 8)}</td>
                        {definicion_CTX_IN_ALMACEN._id === '' ? (
                          <td data-label="Acc" class="accionesLeft">
                            <input
                              type="image"
                              src={images.edit}
                              title="Editar ítem"
                              alt="icono de editar"
                              height={14}
                              width={14}
                              style={{ marginRight: '4px' }}
                              onClick$={() => {
                                elDocSelecionado.value = iTDocAdj;
                                definicion_CTX_NEW_IN_ALMACEN.mostrarPanelAdjuntarDocumento = true;
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
                                borrarDocumento.idAuxiliar = iTDocAdj.idAuxiliar;
                                borrarDocumento.codigoTCP = iTDocAdj.codigoTCP;
                                borrarDocumento.descripcionTCP = iTDocAdj.descripcionTCP;
                                borrarDocumento.fecha = iTDocAdj.fecha;
                                borrarDocumento.serie = iTDocAdj.serie;
                                borrarDocumento.numero = iTDocAdj.numero;
                                definicion_CTX_NEW_IN_ALMACEN.mostrarPanelDeleteDocumentoIN = true;
                              }}
                            />
                          </td>
                        ) : (
                          ''
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <i style={{ marginTop: '4px', fontSize: '0.8rem' }}>No existen documentos adjuntos</i>
            )} */}
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelDeleteDocumentoIN && (
              <div class="modal">
                <BorrarDocumentoIN borrarDocumento={borrarDocumento} />
              </div>
            )}
          </div>
          {/* <hr style={{ margin: '5px 0' }}></hr> */}
          <br />
        </div>
        {/* TIPO DE CAMBIO       htmlFor={'checkboxTipoCambio'}*/}
        <div>
          {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr  1fr', gap: '4px' }}> */}
          {/* <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '4px' }}> */}
          <div class="linea_1_11">
            {/* Tipo Cambio    SUNAT */}
            {/* <div style={{ display: 'flex', flexDirection: 'row' }}> */}
            {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}> */}
            <div class="linea-celda-row-space-between">
              <div>
                <input
                  type="checkbox"
                  checked={definicion_CTX_IN_ALMACEN.enDolares}
                  id="chbx_TipoCambio_IN_ALMACEN"
                  onClick$={(e) => {
                    console.log('click en chbx_TipoCambio_IN_ALMACEN');
                    if (definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen === 'APERTURA DE INVENTARIO') {
                      obtenerTipoCambio(e.target as HTMLInputElement);
                    } else {
                      if (definicion_CTX_IN_ALMACEN.documentosAdjuntos.length === 0) {
                        alert('Debe ingresar el documento adjunto de la cual se tomara la fecha de referencia para el calculo del tipo de cambio');
                        (e.target as HTMLInputElement).checked = false;
                        return;
                      }
                      obtenerTipoCambio(e.target as HTMLInputElement);
                    }
                  }}
                />
                <label for="chbx_TipoCambio_IN_ALMACEN" style={{ marginRight: '8px' }}>
                  USD SUNAT
                </label>
              </div>
              <div>
                <input
                  id="inputTipoCambio_IN_ALMACEN"
                  type="text"
                  value={
                    definicion_CTX_IN_ALMACEN.tipoCambio.toString() +
                    '  ' +
                    (definicion_CTX_IN_ALMACEN.documentosAdjuntos.length > 0
                      ? '(' + formatoDDMMYYYY_PEN(definicion_CTX_IN_ALMACEN.documentosAdjuntos[0].fecha) + ')'
                      : '')
                  }
                  disabled
                  style={{ width: '100%' }}
                />
              </div>
            </div>
            {/* Tipo Cambio    MANUAL */}
            {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}> */}
            <div class="linea-celda-row-space-between">
              <div>
                <input
                  type="checkbox"
                  checked={definicion_CTX_IN_ALMACEN.enDolaresManual}
                  id="chbx_TipoCambio_MANUAL_IN_ALMACEN"
                  onClick$={(e) => {
                    console.log('click en chbx_TipoCambio_MANUAL_IN_ALMACEN');

                    obtenerTipoCambioManual(e.target as HTMLInputElement);
                  }}
                />
                <label for="chbx_TipoCambio_MANUAL_IN_ALMACEN" style={{ marginRight: '8px' }}>
                  USD MANUAL
                </label>
              </div>
              <div>
                <input
                  id="inputTipoCambio_MANUAL_IN_ALMACEN"
                  type="number"
                  style={{ width: '100%' }}
                  disabled
                  // disabled={!definicion_CTX_IN_ALMACEN.enDolaresManual}
                  value={definicion_CTX_IN_ALMACEN.tipoCambioManual}
                  onChange$={(e) => {
                    definicion_CTX_IN_ALMACEN.tipoCambioManual = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                  // style={{ width: 'inherit' }}
                />
              </div>
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* BOTON / TABLA -  MERCADERIAS  IN */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            {/* ADD MERCADERIA: CON IGV / SIN IGV */}
            {definicion_CTX_IN_ALMACEN._id === '' ? (
              <div
                style={{ display: 'flex', marginBottom: '12px' }}
                onFocus$={() => {
                  console.log('onFocus div ADD MERCADERIA: ', document.activeElement);
                }}
              >
                <ElButton
                  id="btn_Add_Mercaderia"
                  class="btn"
                  name="Add mercadería"
                  title="Add mercadería"
                  style={{ marginRight: '12px' }}
                  disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN.produccion}
                  onClick={$(() => {
                    if (definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen === '') {
                      alert('Seleccione el motivo de ingreso');
                      document.getElementById('se_motivoIngreso')?.focus();
                      return;
                    }
                    console.log('definicion_CTX_IN_ALMACEN.enDolaresManual =', definicion_CTX_IN_ALMACEN.enDolaresManual);
                    if (definicion_CTX_IN_ALMACEN.enDolaresManual) {
                      console.log(
                        'definicion_CTX_IN_ALMACEN.enDolaresManual => definicion_CTX_IN_ALMACEN.tipoCambioManual',
                        definicion_CTX_IN_ALMACEN.tipoCambioManual
                      );

                      if (definicion_CTX_IN_ALMACEN.tipoCambioManual === 0) {
                        alert('Ingrese el tipo de cambio manual.');
                        document.getElementById('inputTipoCambio_MANUAL_IN_ALMACEN')?.focus();
                        return;
                      }
                    }
                    definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarMercaderiaIN = true;
                  })}
                  onFocus={$(() => {
                    console.log('onFocus: ElButton Add mercadería ', document.activeElement);
                  })}
                />
                <div>
                  <div>
                    <input
                      type="checkbox"
                      checked={definicion_CTX_IN_ALMACEN.conIGV}
                      id="chbx_conIGV_IN_ALMACEN"
                      onClick$={(e) => {
                        console.log('click en chbx_conIGV_IN_ALMACEN');
                        definicion_CTX_IN_ALMACEN.conIGV = (e.target as HTMLInputElement).checked;
                      }}
                    />
                    <label for="chbx_conIGV_IN_ALMACEN" style={{ marginRight: '12px' }}>
                      CON IGV
                    </label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      checked={definicion_CTX_IN_ALMACEN.porMontoUnitario}
                      id="chbx_porMontoUnitario_IN_ALMACEN"
                      onClick$={(e) => {
                        console.log('click en chbx_porMontoUnitario_IN_ALMACEN');
                        definicion_CTX_IN_ALMACEN.porMontoUnitario = (e.target as HTMLInputElement).checked;
                      }}
                    />
                    <label for="chbx_porMontoUnitario_IN_ALMACEN" style={{ marginRight: '4px' }}>
                      POR MONTO UNITARIO
                    </label>
                  </div>
                </div>
              </div>
            ) : (
              ''
            )}
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarMercaderiaIN && (
              <div
                class="modal"
                onFocus$={() => {
                  console.log('onFocus: ', document.activeElement);
                }}
              >
                <BuscarMercaderiaIN
                  contexto="new_in_almacen"
                  esAlmacen={true}
                  enDolares={definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual}
                  tipoCambio={
                    definicion_CTX_IN_ALMACEN.enDolares
                      ? definicion_CTX_IN_ALMACEN.tipoCambio
                      : definicion_CTX_IN_ALMACEN.enDolaresManual
                      ? definicion_CTX_IN_ALMACEN.tipoCambioManual
                      : ''
                  }
                  igv={definicion_CTX_IN_ALMACEN.elIgv}
                  motivo={definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen}
                  conIGV={definicion_CTX_IN_ALMACEN.conIGV}
                  porMontoUnitario={definicion_CTX_IN_ALMACEN.porMontoUnitario}
                />
              </div>
            )}
            {/* TABLA MERCADERIA IN: REPUESTOS -- LUBRICANTES -- ETC */}
            {definicion_CTX_IN_ALMACEN.itemsMercaderias.length > 0 ? (
              <table id="ttt_IN_ALMACEN" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Kx</th>
                    {/* <th>Mer</th> */}
                    <th style={{ display: 'none' }}>Código</th>
                    <th>Descripción</th>
                    <th>IGV</th>
                    <th>Ubi</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th hidden={definicion_CTX_IN_ALMACEN.conIGV}>
                      {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'CostoUniUSD' : 'CostoUniPEN'}
                    </th>
                    <th hidden={definicion_CTX_IN_ALMACEN.conIGV}>
                      {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'subUSD' : 'subPEN'}
                    </th>
                    <th hidden={!definicion_CTX_IN_ALMACEN.conIGV}>
                      {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'ValorUniUSD' : 'ValorUniPEN'}
                    </th>
                    <th hidden={!definicion_CTX_IN_ALMACEN.conIGV}>
                      {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'TotUSD' : 'TotPEN'}
                    </th>
                    {definicion_CTX_IN_ALMACEN._id === '' ? <th>Acc</th> : ''}
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_IN_ALMACEN.itemsMercaderias.map((iTMercaIN: any, index: number) => {
                    // console.log('DIMMMMMMMMMMMM  iTMercaIN', iTMercaIN);
                    const indexItemMercaIN = index + 1;
                    // console.log('tbody  indexItemMercaIN', indexItemMercaIN);
                    // console.log('tbody  iTMercaIN.subPEN', iTMercaIN.subPEN);
                    /////****** PEN
                    suma_SubPEN = suma_SubPEN + redondeo2Decimales(iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN);
                    // console.log('tbody  suma_SubPEN', suma_SubPEN);
                    suma_TotPEN = suma_TotPEN + redondeo2Decimales(iTMercaIN.totPEN.$numberDecimal ? iTMercaIN.totPEN.$numberDecimal : iTMercaIN.totPEN);
                    // console.log('DIMMMMMMMMMMMM  iTMercaIN', iTMercaIN);
                    // console.log('DoMMMMMMMMMMMM', !definicion_CTX_IN_ALMACEN.reingreso ? iTMercaIN.descripcion : iTMercaIN.descripcionEquivalencia);
                    // console.log('definicion_CTX_IN_ALMACEN.enDolares ==>>', definicion_CTX_IN_ALMACEN.enDolares);
                    // console.log('definicion_CTX_IN_ALMACEN.reingreso ==>>', definicion_CTX_IN_ALMACEN.reingreso);
                    // if (typeof iTMercaIN.totPEN !== 'undefined') {
                    //   console.log('iTMercaIN.totPEN ==>>', iTMercaIN.totPEN, formatear_6Decimales(iTMercaIN.totPEN));
                    // } else {
                    //   console.log('iTMercaIN.totPEN ==>> undefined');
                    // }
                    // console.log('tbody  iTMercaIN', iTMercaIN);
                    suma_IGVPEN = suma_TotPEN - suma_SubPEN;

                    ///******USD
                    if (typeof iTMercaIN.subUSD !== 'undefined') {
                      console.log('iTMercaIN.subUSD...', iTMercaIN.subUSD);
                      suma_SubUSD = suma_SubUSD + redondeo2Decimales(iTMercaIN.subUSD.$numberDecimal ? iTMercaIN.subUSD.$numberDecimal : iTMercaIN.subUSD);

                      suma_TotUSD = suma_TotUSD + redondeo2Decimales(iTMercaIN.totUSD.$numberDecimal ? iTMercaIN.totUSD.$numberDecimal : iTMercaIN.totUSD);

                      suma_IGVUSD = suma_TotUSD - suma_SubUSD;
                      console.log('iTMercaIN.subUSD......', iTMercaIN.subUSD);
                    } else {
                      console.log('iTMercaIN.subUSD ==>> undefined');
                    }
                    console.log('tbody  typeof iTMercaIN.subUSD');
                    return (
                      <tr key={iTMercaIN.idAuxiliar}>
                        <td data-label="Ítem" key={iTMercaIN.idAuxiliar}>{`${cerosALaIzquierda(indexItemMercaIN, 3)}`}</td>
                        <td data-label="Kx">{typeof iTMercaIN.idKardex !== 'undefined' ? iTMercaIN.idKardex.substring(iTMercaIN.idKardex.length - 6) : '-'}</td>
                        {/* <td data-label="Mer">{typeof iTMercaIN.idMercaderia !== 'undefined' ? iTMercaIN.idMercaderia : '-'}</td> */}
                        <td data-label="Código" style={{ display: 'none' }}>
                          {iTMercaIN.codigo}
                        </td>
                        <td data-label="Descripción">
                          <strong> {!definicion_CTX_IN_ALMACEN.reingreso ? iTMercaIN.descripcion : iTMercaIN.descripcionEquivalencia}</strong>
                        </td>
                        <td data-label="IGV">{iTMercaIN.IGV.$numberDecimal ? iTMercaIN.IGV.$numberDecimal : iTMercaIN.IGV} %</td>
                        <td data-label="Ubi" class="comoNumeroLeft">
                          <input
                            type="text"
                            disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                            style={{ width: '100%', textAlign: 'start' }}
                            value={iTMercaIN.ubigeo}
                            onChange$={(e) => {
                              iTMercaIN.ubigeo = (e.target as HTMLInputElement).value.toUpperCase();
                            }}
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                          />
                        </td>
                        <td data-label="Cantidad" class="comoNumeroLeft">
                          <input
                            type="number"
                            disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                            style={{ width: '80px', textAlign: 'end' }}
                            value={
                              !definicion_CTX_IN_ALMACEN.reingreso
                                ? iTMercaIN.cantidadIngresada.$numberDecimal
                                  ? iTMercaIN.cantidadIngresada.$numberDecimal
                                  : iTMercaIN.cantidadIngresada
                                : iTMercaIN.cantidadIngresadaEquivalencia.$numberDecimal
                                ? iTMercaIN.cantidadIngresadaEquivalencia.$numberDecimal
                                : iTMercaIN.cantidadIngresadaEquivalencia
                            }
                            onChange$={(e) => {
                              !definicion_CTX_IN_ALMACEN.reingreso
                                ? (iTMercaIN.cantidadIngresada = parseFloat((e.target as HTMLInputElement).value))
                                : (iTMercaIN.cantidadIngresadaEquivalencia = parseFloat((e.target as HTMLInputElement).value));
                              if (definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual) {
                                console.log('cantidad 💚💚💚💚💚');
                                if (definicion_CTX_IN_ALMACEN.porMontoUnitario) {
                                  ///  USD///
                                  iTMercaIN.subUSD =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.costoUnitarioUSD.$numberDecimal ? iTMercaIN.costoUnitarioUSD.$numberDecimal : iTMercaIN.costoUnitarioUSD);

                                  iTMercaIN.totUSD =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.valorUnitarioUSD.$numberDecimal ? iTMercaIN.valorUnitarioUSD.$numberDecimal : iTMercaIN.valorUnitarioUSD);
                                  ///  PEN///
                                  iTMercaIN.subPEN =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.costoUnitarioUSD.$numberDecimal ? iTMercaIN.costoUnitarioUSD.$numberDecimal : iTMercaIN.costoUnitarioUSD) *
                                    definicion_CTX_IN_ALMACEN.tipoCambio;

                                  iTMercaIN.totPEN =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.valorUnitarioUSD.$numberDecimal ? iTMercaIN.valorUnitarioUSD.$numberDecimal : iTMercaIN.valorUnitarioUSD) *
                                    definicion_CTX_IN_ALMACEN.tipoCambio;
                                } else {
                                  ///  USD///
                                  iTMercaIN.costoUnitarioUSD =
                                    (iTMercaIN.subUSD.$numberDecimal ? iTMercaIN.subUSD.$numberDecimal : iTMercaIN.subUSD) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);

                                  iTMercaIN.valorUnitarioUSD =
                                    (iTMercaIN.totUSD.$numberDecimal ? iTMercaIN.totUSD.$numberDecimal : iTMercaIN.totUSD) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);
                                  ///  PEN///
                                  iTMercaIN.costoUnitarioUSD =
                                    ((iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN) /
                                      (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada)) *
                                    definicion_CTX_IN_ALMACEN.tipoCambio;

                                  iTMercaIN.valorUnitarioUSD =
                                    ((iTMercaIN.totPEN.$numberDecimal ? iTMercaIN.totPEN.$numberDecimal : iTMercaIN.totPEN) /
                                      (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada)) *
                                    definicion_CTX_IN_ALMACEN.tipoCambio;
                                }
                              } else {
                                console.log('cantidad 💛💛💛💛💛');
                                ///  PEN///
                                if (definicion_CTX_IN_ALMACEN.porMontoUnitario) {
                                  iTMercaIN.subPEN =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.costoUnitarioPEN.$numberDecimal ? iTMercaIN.costoUnitarioPEN.$numberDecimal : iTMercaIN.costoUnitarioPEN);

                                  iTMercaIN.totPEN =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.valorUnitarioPEN.$numberDecimal ? iTMercaIN.valorUnitarioPEN.$numberDecimal : iTMercaIN.valorUnitarioPEN);
                                } else {
                                  iTMercaIN.costoUnitarioPEN =
                                    (iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);

                                  iTMercaIN.valorUnitarioPEN =
                                    (iTMercaIN.totPEN.$numberDecimal ? iTMercaIN.totPEN.$numberDecimal : iTMercaIN.totPEN) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);
                                }
                              }
                              // const iv = itemsVentaK[index];
                            }}
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                          />
                        </td>
                        <td data-label="Uni" class="accionesLeft">
                          {!definicion_CTX_IN_ALMACEN.reingreso ? iTMercaIN.unidad : iTMercaIN.unidadEquivalencia}
                        </td>
                        {/* SIN IGV -- SIN IGV -- SIN IGV -- SIN IGV */}
                        {/* SIN IGV -- SIN IGV -- SIN IGV -- SIN IGV */}
                        {/* SIN IGV -- SIN IGV -- SIN IGV -- SIN IGV */}
                        {/* costoUnitario */}
                        <td
                          data-label={definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'CostoUniUSD' : 'CostoUniPEN'}
                          class="comoNumeroLeft"
                          style={definicion_CTX_IN_ALMACEN.conIGV ? { display: 'none' } : ''}
                        >
                          {definicion_CTX_IN_ALMACEN.porMontoUnitario ? (
                            <input
                              type="number"
                              disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                              style={{ width: '80px', textAlign: 'end' }}
                              value={
                                definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual
                                  ? formatear_6Decimales(
                                      !definicion_CTX_IN_ALMACEN.reingreso
                                        ? iTMercaIN.costoUnitarioUSD.$numberDecimal
                                          ? iTMercaIN.costoUnitarioUSD.$numberDecimal
                                          : iTMercaIN.costoUnitarioUSD
                                        : iTMercaIN.costoUnitarioEquivalenciaUSD.$numberDecimal
                                        ? iTMercaIN.costoUnitarioEquivalenciaUSD.$numberDecimal
                                        : iTMercaIN.costoUnitarioEquivalenciaUSD
                                    )
                                  : formatear_6Decimales(
                                      !definicion_CTX_IN_ALMACEN.reingreso
                                        ? iTMercaIN.costoUnitarioPEN.$numberDecimal
                                          ? iTMercaIN.costoUnitarioPEN.$numberDecimal
                                          : iTMercaIN.costoUnitarioPEN
                                        : iTMercaIN.costoUnitarioEquivalenciaPEN.$numberDecimal
                                        ? iTMercaIN.costoUnitarioEquivalenciaPEN.$numberDecimal
                                        : iTMercaIN.costoUnitarioEquivalenciaPEN
                                    )
                              }
                              onChange$={(e) => {
                                const costo = parseFloat((e.target as HTMLInputElement).value);

                                let IGVCalculado;
                                let costoIncluidoIGV;
                                if (definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual) {
                                  //******  USD
                                  const elTC = definicion_CTX_IN_ALMACEN.enDolares
                                    ? definicion_CTX_IN_ALMACEN.tipoCambio
                                    : definicion_CTX_IN_ALMACEN.tipoCambioManual;

                                  iTMercaIN.costoUnitarioUSD = costo;

                                  if (iTMercaIN.IGV === 0) {
                                    IGVCalculado = 0;
                                    costoIncluidoIGV = costo;
                                  } else {
                                    IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                    costoIncluidoIGV = costo * IGVCalculado;
                                  }
                                  iTMercaIN.precioUniUSD = formatear_6Decimales(costoIncluidoIGV);

                                  iTMercaIN.subUSD =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.costoUnitarioUSD.$numberDecimal ? iTMercaIN.costoUnitarioUSD.$numberDecimal : iTMercaIN.costoUnitarioUSD);

                                  iTMercaIN.valorUnitarioUSD = costoIncluidoIGV;
                                  iTMercaIN.totUSD =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.valorUnitarioUSD.$numberDecimal ? iTMercaIN.valorUnitarioUSD.$numberDecimal : iTMercaIN.valorUnitarioUSD);

                                  ///////
                                  iTMercaIN.costoUnitarioPEN = iTMercaIN.costoUnitarioUSD * elTC;
                                  iTMercaIN.precioUniPEN = formatear_6Decimales(costoIncluidoIGV * elTC);
                                  iTMercaIN.subPEN = formatear_6Decimales(iTMercaIN.subUSD * elTC);
                                  iTMercaIN.valorUnitarioPEN = formatear_6Decimales(costoIncluidoIGV * elTC);
                                  iTMercaIN.totPEN = formatear_6Decimales(iTMercaIN.totUSD * elTC);
                                  console.log('💚💚💚💚💚🥪🥪🥪🥪🥪', iTMercaIN.subPEN, iTMercaIN.totPEN);
                                } else {
                                  //******  PEN
                                  iTMercaIN.costoUnitarioPEN = costo;

                                  if (iTMercaIN.IGV === 0) {
                                    IGVCalculado = 0;
                                    costoIncluidoIGV = costo;
                                  } else {
                                    IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                    costoIncluidoIGV = costo * IGVCalculado;
                                  }
                                  iTMercaIN.precioUniPEN = formatear_6Decimales(costoIncluidoIGV);

                                  iTMercaIN.subPEN =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.costoUnitarioPEN.$numberDecimal ? iTMercaIN.costoUnitarioPEN.$numberDecimal : iTMercaIN.costoUnitarioPEN);

                                  iTMercaIN.valorUnitarioPEN = costoIncluidoIGV;
                                  iTMercaIN.totPEN =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.valorUnitarioPEN.$numberDecimal ? iTMercaIN.valorUnitarioPEN.$numberDecimal : iTMercaIN.valorUnitarioPEN);
                                  console.log('🥪🥪🥪🥪🥪💚💚💚💚💚', iTMercaIN.subPEN, iTMercaIN.totPEN);
                                }
                              }}
                              onFocusin$={(e) => {
                                (e.target as HTMLInputElement).select();
                              }}
                            />
                          ) : definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? (
                            !definicion_CTX_IN_ALMACEN.reingreso ? (
                              iTMercaIN.costoUnitarioUSD.$numberDecimal ? (
                                formatear_6Decimales(iTMercaIN.costoUnitarioUSD.$numberDecimal)
                              ) : (
                                formatear_6Decimales(iTMercaIN.costoUnitarioUSD)
                              )
                            ) : iTMercaIN.costoUnitarioEquivalenciaUSD.$numberDecimal ? (
                              formatear_6Decimales(iTMercaIN.costoUnitarioEquivalenciaUSD.$numberDecimal)
                            ) : (
                              formatear_6Decimales(iTMercaIN.costoUnitarioEquivalenciaUSD)
                            )
                          ) : !definicion_CTX_IN_ALMACEN.reingreso ? (
                            iTMercaIN.costoUnitarioPEN.$numberDecimal ? (
                              formatear_6Decimales(iTMercaIN.costoUnitarioPEN.$numberDecimal)
                            ) : (
                              formatear_6Decimales(iTMercaIN.costoUnitarioPEN)
                            )
                          ) : iTMercaIN.costoUnitarioEquivalenciaPEN.$numberDecimal ? (
                            formatear_6Decimales(iTMercaIN.costoUnitarioEquivalenciaPEN.$numberDecimal)
                          ) : (
                            formatear_6Decimales(iTMercaIN.costoUnitarioEquivalenciaPEN)
                          )}
                        </td>
                        {/* sub */}
                        <td
                          data-label={definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'subUSD' : 'subPEN'}
                          class="comoNumeroLeft"
                          style={definicion_CTX_IN_ALMACEN.conIGV ? { display: 'none' } : ''}
                        >
                          {!definicion_CTX_IN_ALMACEN.porMontoUnitario ? (
                            <input
                              type="number"
                              disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                              style={{ width: '80px', textAlign: 'end' }}
                              value={
                                definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual
                                  ? formatear_6Decimales(iTMercaIN.subUSD.$numberDecimal ? iTMercaIN.subUSD.$numberDecimal : iTMercaIN.subUSD)
                                  : formatear_6Decimales(iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN)
                              }
                              onChange$={(e) => {
                                const sub = parseFloat((e.target as HTMLInputElement).value);

                                let IGVCalculado;
                                let subIncluidoIGV;
                                if (definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual) {
                                  console.log('💚💚💚💚💚🥪🥪🥪🥪🥪');
                                  //******  USD
                                  const elTC = definicion_CTX_IN_ALMACEN.enDolares
                                    ? definicion_CTX_IN_ALMACEN.tipoCambio
                                    : definicion_CTX_IN_ALMACEN.tipoCambioManual;

                                  iTMercaIN.subUSD = sub;

                                  if (iTMercaIN.IGV === 0) {
                                    IGVCalculado = 0;
                                    subIncluidoIGV = sub;
                                  } else {
                                    IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                    subIncluidoIGV = sub * IGVCalculado;
                                  }
                                  // iTMercaIN.precioUniUSD = formatear_6Decimales(precio);

                                  iTMercaIN.costoUnitarioUSD =
                                    (iTMercaIN.subUSD.$numberDecimal ? iTMercaIN.subUSD.$numberDecimal : iTMercaIN.subUSD) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);

                                  iTMercaIN.totUSD = subIncluidoIGV;

                                  iTMercaIN.valorUnitarioUSD =
                                    (iTMercaIN.totUSD.$numberDecimal ? iTMercaIN.totUSD.$numberDecimal : iTMercaIN.totUSD) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);

                                  //console.log(
                                  //   '🥪🥪🥪🥪🥪 iTMercaIN.cantidadIngresada - iTMercaIN.valorUnitarioUSD - iTMercaIN.valorUnitarioUSD.$numberDecimal',
                                  //   iTMercaIN.cantidadIngresada,
                                  //   iTMercaIN.valorUnitarioUSD,
                                  //   iTMercaIN.valorUnitarioUSD.$numberDecimal
                                  // );
                                  ///////
                                  iTMercaIN.costoUnitarioPEN = iTMercaIN.costoUnitarioUSD * elTC;
                                  // iTMercaIN.precioUniPEN = formatear_6Decimales(precio * definicion_CTX_IN_ALMACEN.tipoCambio);
                                  iTMercaIN.subPEN = formatear_6Decimales(iTMercaIN.subUSD * elTC);
                                  iTMercaIN.valorUnitarioPEN = formatear_6Decimales(iTMercaIN.valorUnitarioUSD * elTC);
                                  iTMercaIN.totPEN = formatear_6Decimales(subIncluidoIGV * elTC);
                                  //console.log(
                                  //   '🥪🥪🥪🥪🥪 ',
                                  //   iTMercaIN.costoUnitarioPEN,
                                  //   iTMercaIN.precioUniPEN,
                                  //   iTMercaIN.subPEN,
                                  //   iTMercaIN.valorUnitarioPEN,
                                  //   iTMercaIN.totPEN
                                  // );
                                } else {
                                  //******  PEN
                                  console.log('💛💛🧡💛💛💛🥪🥪🥪🥪🥪 sub', sub);
                                  iTMercaIN.subPEN = sub;

                                  if (iTMercaIN.IGV === 0) {
                                    IGVCalculado = 0;
                                    subIncluidoIGV = sub;
                                  } else {
                                    IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                    subIncluidoIGV = sub * IGVCalculado;
                                  }
                                  //iTMercaIN.precioUniPEN = formatear_6Decimales(precio);
                                  console.log('💛💛🧡💛💛💛🥪🥪🥪🥪🥪 subIncluidoIGV', subIncluidoIGV);
                                  console.log('💛💛🧡💛💛💛🥪🥪🥪🥪🥪 iTMercaIN.cantidadIngresada', iTMercaIN.cantidadIngresada);

                                  iTMercaIN.costoUnitarioPEN =
                                    (iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);
                                  console.log('💛💛🧡💛💛💛🥪🥪🥪🥪🥪 iTMercaIN.costoUnitarioPEN', iTMercaIN.costoUnitarioPEN);

                                  iTMercaIN.totPEN = subIncluidoIGV;

                                  iTMercaIN.valorUnitarioPEN =
                                    (iTMercaIN.totPEN.$numberDecimal ? iTMercaIN.totPEN.$numberDecimal : iTMercaIN.totPEN) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);

                                  console.log('💛💛🧡💛💛💛🥪🥪🥪🥪🥪 iTMercaIN.valorUnitarioPEN ', iTMercaIN.valorUnitarioPEN);
                                }
                              }}
                              onFocusin$={(e) => {
                                (e.target as HTMLInputElement).select();
                              }}
                            />
                          ) : definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? (
                            !definicion_CTX_IN_ALMACEN.reingreso ? (
                              iTMercaIN.subUSD.$numberDecimal ? (
                                formatear_6Decimales(iTMercaIN.subUSD.$numberDecimal)
                              ) : (
                                formatear_6Decimales(iTMercaIN.subUSD)
                              )
                            ) : iTMercaIN.subEquivalenciaUSD.$numberDecimal ? (
                              formatear_6Decimales(iTMercaIN.subEquivalenciaUSD.$numberDecimal)
                            ) : (
                              formatear_6Decimales(iTMercaIN.subEquivalenciaUSD)
                            )
                          ) : !definicion_CTX_IN_ALMACEN.reingreso ? (
                            iTMercaIN.subPEN.$numberDecimal ? (
                              formatear_6Decimales(iTMercaIN.subPEN.$numberDecimal)
                            ) : (
                              formatear_6Decimales(iTMercaIN.subPEN)
                            )
                          ) : iTMercaIN.subEquivalenciaPEN.$numberDecimal ? (
                            formatear_6Decimales(iTMercaIN.subEquivalenciaPEN.$numberDecimal)
                          ) : (
                            formatear_6Decimales(iTMercaIN.subEquivalenciaPEN)
                          )}
                        </td>
                        {/* CON IGV -- CON IGV -- CON IGV -- CON IGV */}
                        {/* CON IGV -- CON IGV -- CON IGV -- CON IGV */}
                        {/* CON IGV -- CON IGV -- CON IGV -- CON IGV */}
                        {/* valorUnitario */}
                        <td
                          data-label={definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'ValorUniUSD' : 'ValorUniPEN'}
                          class="comoNumeroLeft"
                          style={!definicion_CTX_IN_ALMACEN.conIGV ? { display: 'none' } : ''}
                        >
                          {definicion_CTX_IN_ALMACEN.porMontoUnitario ? (
                            <input
                              type="number"
                              disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                              style={{ width: '80px', textAlign: 'end' }}
                              value={
                                definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual
                                  ? formatear_6Decimales(
                                      !definicion_CTX_IN_ALMACEN.reingreso
                                        ? iTMercaIN.valorUnitarioUSD.$numberDecimal
                                          ? iTMercaIN.valorUnitarioUSD.$numberDecimal
                                          : iTMercaIN.valorUnitarioUSD
                                        : iTMercaIN.valorUnitarioEquivalenciaUSD.$numberDecimal
                                        ? iTMercaIN.valorUnitarioEquivalenciaUSD.$numberDecimal
                                        : iTMercaIN.valorUnitarioEquivalenciaUSD
                                    )
                                  : formatear_6Decimales(
                                      !definicion_CTX_IN_ALMACEN.reingreso
                                        ? iTMercaIN.valorUnitarioPEN.$numberDecimal
                                          ? iTMercaIN.valorUnitarioPEN.$numberDecimal
                                          : iTMercaIN.valorUnitarioPEN
                                        : iTMercaIN.valorUnitarioEquivalenciaPEN.$numberDecimal
                                        ? iTMercaIN.valorUnitarioEquivalenciaPEN.$numberDecimal
                                        : iTMercaIN.valorUnitarioEquivalenciaPEN
                                    )
                              }
                              onChange$={(e) => {
                                const precio = parseFloat((e.target as HTMLInputElement).value);

                                let IGVCalculado;
                                let costo;

                                if (definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual) {
                                  //******* USD *****
                                  console.log('💚💚💚💚💚');
                                  const elTC = definicion_CTX_IN_ALMACEN.enDolares
                                    ? definicion_CTX_IN_ALMACEN.tipoCambio
                                    : definicion_CTX_IN_ALMACEN.tipoCambioManual;

                                  iTMercaIN.valorUnitarioUSD = precio;

                                  if (iTMercaIN.IGV === 0) {
                                    IGVCalculado = 0;
                                    costo = precio;
                                  } else {
                                    IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                    costo = precio / IGVCalculado;
                                  }
                                  iTMercaIN.costoUnitarioUSD = formatear_6Decimales(costo);

                                  iTMercaIN.totUSD =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.valorUnitarioUSD.$numberDecimal ? iTMercaIN.valorUnitarioUSD.$numberDecimal : iTMercaIN.valorUnitarioUSD);

                                  iTMercaIN.subUSD =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.costoUnitarioUSD.$numberDecimal ? iTMercaIN.costoUnitarioUSD.$numberDecimal : iTMercaIN.costoUnitarioUSD);
                                  //******* PEN ****
                                  iTMercaIN.valorUnitarioPEN = precio * elTC;
                                  iTMercaIN.costoUnitarioPEN = formatear_6Decimales(costo * elTC);
                                  iTMercaIN.totPEN = iTMercaIN.totUSD * elTC;
                                  iTMercaIN.subPEN = iTMercaIN.subUSD * elTC;
                                } else {
                                  console.log('💛💛💛💛💛');

                                  iTMercaIN.valorUnitarioPEN = precio;

                                  if (iTMercaIN.IGV === 0) {
                                    IGVCalculado = 0;
                                    costo = precio;
                                  } else {
                                    IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                    costo = precio / IGVCalculado;
                                  }
                                  iTMercaIN.costoUnitarioPEN = formatear_6Decimales(costo);

                                  iTMercaIN.totPEN =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.valorUnitarioPEN.$numberDecimal ? iTMercaIN.valorUnitarioPEN.$numberDecimal : iTMercaIN.valorUnitarioPEN);

                                  iTMercaIN.subPEN =
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada) *
                                    (iTMercaIN.costoUnitarioPEN.$numberDecimal ? iTMercaIN.costoUnitarioPEN.$numberDecimal : iTMercaIN.costoUnitarioPEN);
                                }
                              }}
                              onFocusin$={(e) => {
                                (e.target as HTMLInputElement).select();
                              }}
                            />
                          ) : definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? (
                            !definicion_CTX_IN_ALMACEN.reingreso ? (
                              iTMercaIN.valorUnitarioUSD.$numberDecimal ? (
                                formatear_6Decimales(iTMercaIN.valorUnitarioUSD.$numberDecimal)
                              ) : (
                                formatear_6Decimales(iTMercaIN.valorUnitarioUSD)
                              )
                            ) : iTMercaIN.valorUnitarioEquivalenciaUSD.$numberDecimal ? (
                              formatear_6Decimales(iTMercaIN.valorUnitarioEquivalenciaUSD.$numberDecimal)
                            ) : (
                              formatear_6Decimales(iTMercaIN.valorUnitarioEquivalenciaUSD)
                            )
                          ) : !definicion_CTX_IN_ALMACEN.reingreso ? (
                            iTMercaIN.valorUnitarioPEN.$numberDecimal ? (
                              formatear_6Decimales(iTMercaIN.valorUnitarioPEN.$numberDecimal)
                            ) : (
                              formatear_6Decimales(iTMercaIN.valorUnitarioPEN)
                            )
                          ) : iTMercaIN.valorUnitarioEquivalenciaPEN.$numberDecimal ? (
                            formatear_6Decimales(iTMercaIN.valorUnitarioEquivalenciaPEN.$numberDecimal)
                          ) : (
                            formatear_6Decimales(iTMercaIN.valorUnitarioEquivalenciaPEN)
                          )}
                        </td>
                        {/* tot */}
                        <td
                          data-label={definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'TotUSD' : 'TotPEN'}
                          // style={{ textAlign: 'end' }}
                          class="comoNumeroLeft"
                          // style={!definicion_CTX_IN_ALMACEN.conIGV ? { display: 'none' } : { textAlign: 'start' }}
                          style={!definicion_CTX_IN_ALMACEN.conIGV ? { display: 'none' } : ''}
                        >
                          {!definicion_CTX_IN_ALMACEN.porMontoUnitario ? (
                            <input
                              type="number"
                              disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                              style={{ width: '80px', textAlign: 'end' }}
                              value={
                                definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual
                                  ? formatear_6Decimales(
                                      !definicion_CTX_IN_ALMACEN.reingreso
                                        ? iTMercaIN.totUSD.$numberDecimal
                                          ? iTMercaIN.totUSD.$numberDecimal
                                          : iTMercaIN.totUSD
                                        : iTMercaIN.totEquivalenciaUSD.$numberDecimal
                                        ? iTMercaIN.totEquivalenciaUSD.$numberDecimal
                                        : iTMercaIN.totEquivalenciaUSD
                                    )
                                  : formatear_6Decimales(
                                      !definicion_CTX_IN_ALMACEN.reingreso
                                        ? iTMercaIN.totPEN.$numberDecimal
                                          ? iTMercaIN.totPEN.$numberDecimal
                                          : iTMercaIN.totPEN
                                        : iTMercaIN.totEquivalenciaPEN.$numberDecimal
                                        ? iTMercaIN.totEquivalenciaPEN.$numberDecimal
                                        : iTMercaIN.totEquivalenciaPEN
                                    )
                              }
                              onChange$={(e) => {
                                const tot = parseFloat((e.target as HTMLInputElement).value);

                                let IGVCalculado;
                                let sub;

                                if (definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual) {
                                  //******* USD *****
                                  console.log('💚💚💚💚💚');
                                  const elTC = definicion_CTX_IN_ALMACEN.enDolares
                                    ? definicion_CTX_IN_ALMACEN.tipoCambio
                                    : definicion_CTX_IN_ALMACEN.tipoCambioManual;

                                  iTMercaIN.totUSD = tot;

                                  if (iTMercaIN.IGV === 0) {
                                    IGVCalculado = 0;
                                    sub = tot;
                                  } else {
                                    IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                    sub = tot / IGVCalculado;
                                  }

                                  iTMercaIN.valorUnitarioUSD =
                                    (iTMercaIN.totUSD.$numberDecimal ? iTMercaIN.totUSD.$numberDecimal : iTMercaIN.totUSD) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);

                                  // iTMercaIN.costoUnitarioUSD = formatear_6Decimales(sub);
                                  iTMercaIN.subUSD = formatear_6Decimales(sub);

                                  iTMercaIN.costoUnitarioUSD =
                                    (iTMercaIN.subUSD.$numberDecimal ? iTMercaIN.subUSD.$numberDecimal : iTMercaIN.subUSD) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);
                                  //******* PEN ****
                                  iTMercaIN.valorUnitarioPEN = iTMercaIN.valorUnitarioUSD * elTC;
                                  iTMercaIN.costoUnitarioPEN = formatear_6Decimales(iTMercaIN.costoUnitarioUSD * elTC);
                                  iTMercaIN.totPEN = iTMercaIN.totUSD * elTC;
                                  iTMercaIN.subPEN = iTMercaIN.subUSD * elTC;
                                  console.log('💚💚💚💚💚 definicion_CTX_IN_ALMACEN.tipoCambio', definicion_CTX_IN_ALMACEN.tipoCambio);
                                  console.log('💚💚💚💚💚 valorUnitarioPEN', iTMercaIN.valorUnitarioPEN);
                                  console.log('💚💚💚💚💚 costoUnitarioPEN', iTMercaIN.costoUnitarioPEN);
                                  console.log('💚💚💚💚💚 valorUnitarioPEN', iTMercaIN.totPEN);
                                  console.log('💚💚💚💚💚 valorUnitarioPEN', iTMercaIN.subPEN);
                                } else {
                                  console.log('💛💛💛💛💛');

                                  iTMercaIN.totPEN = tot;

                                  if (iTMercaIN.IGV === 0) {
                                    IGVCalculado = 0;
                                    sub = tot;
                                  } else {
                                    IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                    sub = tot / IGVCalculado;
                                  }

                                  iTMercaIN.valorUnitarioPEN =
                                    (iTMercaIN.totPEN.$numberDecimal ? iTMercaIN.totPEN.$numberDecimal : iTMercaIN.totPEN) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);

                                  iTMercaIN.subPEN = formatear_6Decimales(sub);

                                  iTMercaIN.costoUnitarioPEN =
                                    (iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN) /
                                    (iTMercaIN.cantidadIngresada.$numberDecimal ? iTMercaIN.cantidadIngresada.$numberDecimal : iTMercaIN.cantidadIngresada);
                                }
                              }}
                              onFocusin$={(e) => {
                                (e.target as HTMLInputElement).select();
                              }}
                            />
                          ) : definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? (
                            !definicion_CTX_IN_ALMACEN.reingreso ? (
                              iTMercaIN.totUSD.$numberDecimal ? (
                                formatear_6Decimales(iTMercaIN.totUSD.$numberDecimal)
                              ) : (
                                formatear_6Decimales(iTMercaIN.totUSD)
                              )
                            ) : iTMercaIN.totEquivalenciaUSD.$numberDecimal ? (
                              formatear_6Decimales(iTMercaIN.totEquivalenciaUSD.$numberDecimal)
                            ) : (
                              formatear_6Decimales(iTMercaIN.totEquivalenciaUSD)
                            )
                          ) : !definicion_CTX_IN_ALMACEN.reingreso ? (
                            iTMercaIN.totPEN.$numberDecimal ? (
                              formatear_6Decimales(iTMercaIN.totPEN.$numberDecimal)
                            ) : (
                              formatear_6Decimales(iTMercaIN.totPEN)
                            )
                          ) : iTMercaIN.totEquivalenciaPEN.$numberDecimal ? (
                            formatear_6Decimales(iTMercaIN.totEquivalenciaPEN.$numberDecimal)
                          ) : (
                            formatear_6Decimales(iTMercaIN.totEquivalenciaPEN)
                          )}
                        </td>
                        {/* ACCIONES -- ACCIONES -- ACCIONES -- ACCIONES */}
                        {definicion_CTX_IN_ALMACEN._id === '' ? (
                          <td data-label="Acc" class="accionesLeft">
                            <input
                              type="image"
                              src={images.trash}
                              alt="icono de eliminar"
                              height={16}
                              width={16}
                              title="Eliminar ítem"
                              onClick$={() => {
                                borrarItemMercaIN.idAuxiliar = iTMercaIN.idAuxiliar;
                                // borrarItemMercaIN.item = indexItemMercaIN;
                                borrarItemMercaIN.codigo = iTMercaIN.codigo;
                                borrarItemMercaIN.descripcion = iTMercaIN.descripcion;
                                definicion_CTX_NEW_IN_ALMACEN.mostrarPanelDeleteItemMercaderiaIN = true;
                              }}
                            />
                          </td>
                        ) : (
                          ''
                        )}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'end', color: '#2E1800' }}>
                      Sub Total {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'USD' : 'PEN'}
                    </td>
                    <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      {`${
                        definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual
                          ? suma_SubUSD.toLocaleString('en-US', {
                              // style: 'currency',
                              // currency: 'USD',
                              minimumFractionDigits: 2,
                            })
                          : suma_SubPEN.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'PEN',
                              minimumFractionDigits: 2,
                            })
                      }`}
                    </td>
                    {/* <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      
                    </td>
                    <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      
                    </td> */}
                  </tr>
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'end', color: '#2E1800' }}>
                      IGV {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'USD' : 'PEN'}
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      {`${
                        definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual
                          ? suma_IGVUSD.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'USD',
                              minimumFractionDigits: 2,
                            })
                          : suma_IGVPEN.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'PEN',
                              minimumFractionDigits: 2,
                            })
                      }`}
                    </td>
                    {/* <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      Total {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'USD' : 'PEN'}
                    </td> */}
                  </tr>
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'end', color: '#2E1800' }}>
                      Total {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'USD' : 'PEN'}
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      {`${
                        definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual
                          ? suma_TotUSD.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'USD',
                              minimumFractionDigits: 2,
                            })
                          : suma_TotPEN.toLocaleString('en-PE', {
                              // style: 'currency',
                              // currency: 'PEN',
                              minimumFractionDigits: 2,
                            })
                      }`}
                    </td>
                    {/* <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      IGV {definicion_CTX_IN_ALMACEN.enDolares || definicion_CTX_IN_ALMACEN.enDolaresManual ? 'USD' : 'PEN'}
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      
                    </td> */}
                  </tr>
                </tfoot>
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen mercaderías registradas</i>
            )}
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelDeleteItemMercaderiaIN && (
              <div class="modal">
                <BorrarItemMercaderiaIN borrarItemMercaIN={borrarItemMercaIN} />
              </div>
            )}
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* OBSERVACION*/}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input
              id="in_Observacion_IN"
              style={{ width: '100%', backgroundColor: '#F4FF7A' }}
              type="text"
              placeholder="Add observación"
              value={definicion_CTX_IN_ALMACEN.observacion}
              onChange$={(e) => (definicion_CTX_IN_ALMACEN.observacion = (e.target as HTMLInputElement).value)}
              onKeyPress$={$((e: any) => {
                if (e.key === 'Enter') {
                  (document.getElementById('btn_GrabarIngreso') as HTMLInputElement)?.focus();
                }
              })}
            />
          </div>
        </div>
        {/* ----------------------------------------------------- */}
        {/* GRABAR */}
        {definicion_CTX_IN_ALMACEN._id === '' ? (
          <input
            id="btn_GrabarIngreso"
            type="button"
            // disabled
            value={'Grabar INGRESO ' + diaDeLaSemana(definicion_CTX_IN_ALMACEN.FISMA) + ' ' + definicion_CTX_IN_ALMACEN.FISMA.substring(8, 10)}
            class="btn-centro"
            // style={{ cursor: 'pointer', height: '40px', backgroundColor: 'grey' }}
            style={{ cursor: 'pointer', height: '40px' }}
            onClick$={() => {
              ////// AGRUPAR ITEMS NUEVOS Y Q NO TIENE KARDEX
              let nroFilas = definicion_CTX_IN_ALMACEN.itemsMercaderias.length;

              for (let index = 0; index < definicion_CTX_IN_ALMACEN.itemsMercaderias.length; index++) {
                const element = definicion_CTX_IN_ALMACEN.itemsMercaderias[index];
                if (typeof element.idKardex === 'undefined') {
                  let iWHILE = index + 1;
                  while (iWHILE < nroFilas) {
                    const elementWHILE = definicion_CTX_IN_ALMACEN.itemsMercaderias[iWHILE];
                    if (element.idMercaderia === elementWHILE.idMercaderia) {
                      if (typeof elementWHILE.idKardex === 'undefined') {
                        element.cantidadIngresada += elementWHILE.cantidadIngresada;

                        definicion_CTX_IN_ALMACEN.itemsMercaderias.splice(iWHILE, 1);
                        nroFilas--;
                      }
                    } else {
                      iWHILE++;
                    }
                  }
                }
              }
              ///////// REGISTRAR INGRESO
              registrarIngreso();
            }}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
});

{
  /* ----------------------------------------------------- */
}
{
  /* AGRUPAR */
}
{
  /* <input
          type="button"
          value="AGRUPAR"
          class="btn-centro"
          style={{ cursor: 'pointer', height: '40px' }}
          onClick$={() => {
            console.log('definicion_CTX_IN_ALMACEN.itemsMercaderias', JSON.stringify(definicion_CTX_IN_ALMACEN.itemsMercaderias));
            let nroFilas = definicion_CTX_IN_ALMACEN.itemsMercaderias.length;
            console.log('🧧✨🧧✨✨🧨✨✨', nroFilas);
            for (let index = 0; index < definicion_CTX_IN_ALMACEN.itemsMercaderias.length; index++) {
              console.log('🥪🥪🥪🥪🥪💚💚💚💚💚', index);

              const element = definicion_CTX_IN_ALMACEN.itemsMercaderias[index];
              if (typeof element.idKardex === 'undefined') {
                let iWHILE = index + 1;
                while (iWHILE < nroFilas) {
                  console.log('💚💚💚💚💚🥪🥪🥪🥪🥪 iWHILE < nroFilas', iWHILE, nroFilas);
                  const elementWHILE = definicion_CTX_IN_ALMACEN.itemsMercaderias[iWHILE];
                  if (element.idMercaderia === elementWHILE.idMercaderia) {
                    if (typeof elementWHILE.idKardex === 'undefined') {
                      element.cantidadIngresada += elementWHILE.cantidadIngresada;

                      definicion_CTX_IN_ALMACEN.itemsMercaderias.splice(iWHILE, 1);
                      nroFilas--;
                    }
                  } else {
                    iWHILE++;
                  }
                }
              }
            }
          }}
        /> */
}
