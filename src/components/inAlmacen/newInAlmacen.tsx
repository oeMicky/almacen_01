import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_IN_ALMACEN } from '~/routes/(inventario)/inAlmacen';
import type { IPersona } from '~/interfaces/iPersona';
import type { IIngresoAAlmacen } from '~/interfaces/iInAlmacen';
import ElButton from '../system/elButton';
import NewEditDocumento from '../miscelanea/documento/newEditDocumento';
import BuscarMercaderiaIN from '../miscelanea/mercaderiaIN/buscarMercaderiaIN';
import {
  cerosALaIzquierda,
  formatear_6Decimales,
  formatoDDMMYYYY_PEN,
  hoy,
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

export const CTX_NEW_IN_ALMACEN = createContextId<any>('new_in_almacen');

export const CTX_IN_ALMACEN = createContextId<IIngresoAAlmacen>('in_almacen');

export const CTX_REMITENTE_IN_ALMACEN = createContextId<IPersona>('remitente_in_almacen');

export default component$((props: { addPeriodo: any; inSelecci: any; losIgvsCompra: any; igvCompraPorDefault: any }) => {
  useStyles$(style);

  //#region DEFINICION CTX_NEW_IN_ALMACEN
  const definicion_CTX_NEW_IN_ALMACEN = useStore({
    rol_Persona: '',
    selecciono_Persona: false,

    mostrarPanelBuscarPersona: false,

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
      itemsMercaderias: props.inSelecci.itemsMercaderias ? props.inSelecci.itemsMercaderias : [],

      montoSubTotalPEN: props.inSelecci.montoSubTotalPEN ? props.inSelecci.montoSubTotalPEN : 0,
      montoIGVPEN: props.inSelecci.montoIGVPEN ? props.inSelecci.montoIGVPEN : 0,
      montoTotalPEN: props.inSelecci.montoTotalPEN ? props.inSelecci.montoTotalPEN : 0,

      montoSubTotalUSD: props.inSelecci.montoSubTotalUSD ? props.inSelecci.montoSubTotalUSD : 0,
      montoIGVUSD: props.inSelecci.montoIGVUSD ? props.inSelecci.montoIGVUSD : 0,
      montoTotalUSD: props.inSelecci.montoTotalUSD ? props.inSelecci.montoTotalUSD : 0,
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

  let suma_SubPEN = 0;
  let suma_IGVPEN = 0;
  let suma_TotPEN = 0;

  let suma_SubUSD = 0;
  let suma_IGVUSD = 0;
  let suma_TotUSD = 0;

  const elDocSelecionado = useSignal([]);
  const losMotivosCargados = useSignal([]);

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

  // const
  //#endregion INICALIZACION

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
  });
  //#endregion CARGAR MOTIVOS DE INGRESO

  //#region REMITENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_IN_ALMACEN.selecciono_Persona);
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
        obtenerTipoCambio(document.getElementById('chbx_TipoCambio_IN_ALMACEN') as HTMLInputElement);
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
    if (definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen !== 'APERTURA DE INVENTARIO') {
      if (definicion_CTX_IN_ALMACEN.documentosAdjuntos.length < 1) {
        alert('Agregue al menos un documento');
        document.getElementById('bu_Add_Documento')?.focus();
        return;
      }
    }
    if (definicion_CTX_IN_ALMACEN.itemsMercaderias.length < 1) {
      alert('Agregue al menos una mercadería');
      document.getElementById('bu_Add_Mercaderia')?.focus();
      return;
    }

    ctx_index_in_almacen.mostrarSpinner = true;

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

      // serie: definicion_CTX_IN_ALMACEN.serie,
      // numero: definicion_CTX_IN_ALMACEN.numero,
      FISMA: definicion_CTX_IN_ALMACEN.FISMA,
      reingreso: definicion_CTX_IN_ALMACEN.reingreso,

      idElIgv: definicion_CTX_IN_ALMACEN.idElIgv,
      elIgv: definicion_CTX_IN_ALMACEN.elIgv,

      idRemitente: definicion_CTX_IN_ALMACEN.idRemitente,
      codigoTipoDocumentoIdentidad: definicion_CTX_IN_ALMACEN.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_IN_ALMACEN.numeroIdentidad,
      razonSocialNombre: definicion_CTX_IN_ALMACEN.razonSocialNombre,

      documentosAdjuntos: definicion_CTX_IN_ALMACEN.documentosAdjuntos,
      itemsMercaderias: definicion_CTX_IN_ALMACEN.itemsMercaderias,

      montoSubTotalPEN: definicion_CTX_IN_ALMACEN.montoSubTotalPEN,
      montoIGVPEN: definicion_CTX_IN_ALMACEN.montoIGVPEN,
      montoTotalPEN: definicion_CTX_IN_ALMACEN.montoTotalPEN,

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
        width: 'clamp(330px, 96%, 1112px)',
        background: `${definicion_CTX_IN_ALMACEN.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : '#eee'}`,
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
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log('definicion_CTX_IN_ALMACEN', definicion_CTX_IN_ALMACEN);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el  props.igvCompraPorDefault"
          onClick={$(() => {
            //console.log(' props.igvCompraPorDefault', props.igvCompraPorDefault);
          })}
        /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_in_almacen.mostrarPanelNewInAlmacen = false;
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
            {/* PERIODO */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_Periodo"
                  style={{ width: '100%' }}
                  type="number"
                  // autoFocus
                  disabled
                  value={definicion_CTX_IN_ALMACEN.periodo}
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
            {/* Numero de documento*/}
            <div class="form-control">
              {/* <label>Número</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumento"
                  style={{ width: '100%' }}
                  type="text"
                  disabled
                  value={definicion_CTX_IN_ALMACEN.correlativo}
                />
              </div> */}
            </div>
            {/* FISMA */}
            <div class="form-control form-control-check">
              <div class="form-control form-agrupado">
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
            </div>
            {/* motivo de ingreso */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <ElSelect
                  id={'se_motivoIngreso'}
                  valorSeleccionado={definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen}
                  registros={losMotivosCargados.value}
                  registroID={'_id'}
                  registroTEXT={'motivoIngreso'}
                  seleccione={'-- Seleccione motivo ingreso --'}
                  disabled={definicion_CTX_IN_ALMACEN.itemsMercaderias.length === 0 ? false : true}
                  onChange={$(() => {
                    const elSelec = document.getElementById('se_motivoIngreso') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;

                    definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen = elSelec[elIdx].id;
                    if (definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen === '') {
                      definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen = '';
                    } else {
                      definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen = elSelec.value;
                      // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
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
                      if (definicion_CTX_IN_ALMACEN.enDolares) {
                        obtenerTipoCambio(document.getElementById('chbx_TipoCambio_IN_ALMACEN') as HTMLInputElement);
                      }
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('se_TipoDocumentoLiteral_REMITENTE') as HTMLSelectElement)?.focus();
                    }
                  })}
                />
              </div>
            </div>
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
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
            {/* tipo de documento identidad REMITENTE*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <select
                  id="se_TipoDocumentoLiteral_REMITENTE"
                  disabled={definicion_CTX_IN_ALMACEN._id !== ''}
                  value={definicion_CTX_IN_ALMACEN.tipoDocumentoIdentidad}
                  // onChange={cambioTipoDocumento}
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
                {definicion_CTX_IN_ALMACEN._id === '' ? (
                  <input
                    id="in_BuscarREMITENTE"
                    type="image"
                    src={images.searchPLUS}
                    title="Buscar datos de identidad"
                    height={16}
                    width={16}
                    style={{ margin: '2px 4px' }}
                    // onFocusin$={() => }
                    onClick$={() => (definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarPersona = true)}
                  />
                ) : (
                  ''
                )}
              </div>
            </div>
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarPersona && (
              <div class="modal">
                <BuscarPersona soloPersonasNaturales={false} seleccionar="remitente" contexto="new_in_almacen" rol="remitente" />
              </div>
            )}
            {/* numero identidad REMITENTE*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_NumeroDocumentoIdentidad_REMITENTE"
                  style={{ width: '100%' }}
                  type="text"
                  disabled={definicion_CTX_IN_ALMACEN._id !== ''}
                  placeholder="Add número identidad remitente"
                  value={definicion_CTX_IN_ALMACEN.numeroIdentidad}
                  onChange$={(e) => (definicion_CTX_IN_ALMACEN.numeroIdentidad = (e.target as HTMLInputElement).value)}
                  onKeyPress$={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Nombre_REMITENTE') as HTMLInputElement)?.focus();
                    }
                  })}
                />
              </div>
            </div>

            {/* Razon Social / Nombre - REMITENTE*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
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
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
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
        <div style={definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen === 'APERTURA DE INVENTARIO' ? { display: 'none' } : ''}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            {definicion_CTX_IN_ALMACEN._id === '' ? (
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
            )}
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelAdjuntarDocumento && (
              <div class="modal">
                <NewEditDocumento docSelecci={elDocSelecionado.value} contexto="new_in_almacen" />
              </div>
            )}
            {/* TABLA DOCUMENTOS ADJUNTOS   */}
            {definicion_CTX_IN_ALMACEN.documentosAdjuntos.length > 0 ? (
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
                      <tr key={iTDocAdj.idAuxiliar}>
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
              <i style={{ fontSize: '0.8rem' }}>No existen documentos adjuntos</i>
            )}
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelDeleteDocumentoIN && (
              <div class="modal">
                <BorrarDocumentoIN borrarDocumento={borrarDocumento} />
              </div>
            )}
          </div>
          {/* <hr style={{ margin: '5px 0' }}></hr> */}
          <br />
        </div>
        {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
        <div>
          <div class="form-control">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '4px' }}>
              <input
                type="checkbox"
                id="chbx_TipoCambio_IN_ALMACEN"
                // value={definicion_CTX_IN_ALMACEN.enDolares}
                onClick$={(e) => {
                  if (definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen === 'APERTURA DE INVENTARIO') {
                    obtenerTipoCambio(e.target as HTMLInputElement);
                  } else {
                    if (definicion_CTX_IN_ALMACEN.documentosAdjuntos.length === 0) {
                      alert('Debe ingresar el documento adjunto de la cual se tomara la fecha de referencia para el calculo del tipo de cambio');
                      (e.target as HTMLInputElement).checked = false;
                      return;
                    }
                    // if (definicion_CTX_IN_ALMACEN.FISMA === '') {
                    //   alert('Ingrese la fecha para esta venta');
                    //   (e.target as HTMLInputElement).checked = false;
                    //   document.getElementById('in_Fecha_Para_Venta')?.focus();
                    //   return;
                    // }
                    obtenerTipoCambio(e.target as HTMLInputElement);
                  }
                }}
              />
              <label for="chbx_TipoCambio_IN_ALMACEN" style={{ marginRight: '4px' }}>
                USD
              </label>
              {/*    <strong
                  style={{ fontSize: '0.9rem', fontWeight: '400', cursor: 'pointer' }}
                  onClick$={() => {
                    if ((document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked === false) {
                      if (definicion_CTX_F_B_NC_ND.fecha === '') {
                        alert('Ingrese la fecha para esta venta');
                        (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = false;
                        document.getElementById('in_Fecha_Para_Venta')?.focus();
                        return;
                      }
                      (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = true;
                    } else {
                      (document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement).checked = false;
                    }
                    obtenerTipoCambio(document.getElementById('chbx_TipoCambio_Para_Venta') as HTMLInputElement);
                  }}
                > 
                  USD
                </strong> */}
            </div>
            <div class="form-control form-agrupado">
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
            {definicion_CTX_IN_ALMACEN._id === '' ? (
              <div style={{ marginBottom: '4px' }}>
                <ElButton
                  id="btn_Add_Mercaderia"
                  class="btn"
                  name="Add mercadería"
                  title="Add mercadería"
                  disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN.produccion}
                  onClick={$(() => {
                    if (definicion_CTX_IN_ALMACEN.idMotivoIngresoAlmacen === '') {
                      alert('Seleccione el motivo de ingreso');
                      document.getElementById('se_motivoIngreso')?.focus();
                      return;
                    }
                    definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarMercaderiaIN = true;
                  })}
                />
              </div>
            ) : (
              ''
            )}
            {definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarMercaderiaIN && (
              <div class="modal">
                <BuscarMercaderiaIN
                  contexto="new_in_almacen"
                  esAlmacen={true}
                  enDolares={definicion_CTX_IN_ALMACEN.enDolares}
                  tipoCambio={definicion_CTX_IN_ALMACEN.tipoCambio}
                  igv={definicion_CTX_IN_ALMACEN.elIgv}
                  motivo={definicion_CTX_IN_ALMACEN.motivoIngresoAlmacen}
                />
              </div>
            )}
            {/* TABLA MERCADERIA IN: REPUESTOS -- LUBRICANTES -- ETC */}
            {definicion_CTX_IN_ALMACEN.itemsMercaderias.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Kx</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>IGV</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>{definicion_CTX_IN_ALMACEN.enDolares ? 'CostoUniUSD' : 'CostoUniPEN'}</th>
                    <th>{definicion_CTX_IN_ALMACEN.enDolares ? 'SubUSD' : 'SubPEN'}</th>
                    <th>{definicion_CTX_IN_ALMACEN.enDolares ? 'ValorUniUSD' : 'ValorUniPEN'}</th>
                    <th>{definicion_CTX_IN_ALMACEN.enDolares ? 'TotUSD' : 'TotPEN'}</th>
                    {definicion_CTX_IN_ALMACEN._id === '' ? <th>Acc</th> : ''}
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_IN_ALMACEN.itemsMercaderias.map((iTMercaIN: any, index: number) => {
                    const indexItemMercaIN = index + 1;
                    /////****** PEN */
                    suma_SubPEN = suma_SubPEN + redondeo2Decimales(iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN);

                    suma_TotPEN = suma_TotPEN + redondeo2Decimales(iTMercaIN.totPEN.$numberDecimal ? iTMercaIN.totPEN.$numberDecimal : iTMercaIN.totPEN);

                    suma_IGVPEN = suma_TotPEN - suma_SubPEN;
                    /////******USD */
                    suma_SubUSD = suma_SubUSD + redondeo2Decimales(iTMercaIN.subUSD.$numberDecimal ? iTMercaIN.subUSD.$numberDecimal : iTMercaIN.subUSD);

                    suma_TotUSD = suma_TotUSD + redondeo2Decimales(iTMercaIN.totUSD.$numberDecimal ? iTMercaIN.totUSD.$numberDecimal : iTMercaIN.totUSD);

                    suma_IGVUSD = suma_TotUSD - suma_SubUSD;

                    return (
                      <tr key={iTMercaIN.idAuxiliar}>
                        <td data-label="Ítem" key={iTMercaIN.idAuxiliar}>{`${cerosALaIzquierda(indexItemMercaIN, 3)}`}</td>
                        <td data-label="Kx">{typeof iTMercaIN.idKardex !== 'undefined' ? iTMercaIN.idKardex.substring(iTMercaIN.idKardex.length - 6) : ''}</td>
                        <td data-label="Código">{iTMercaIN.codigo}</td>
                        <td data-label="Descripción">{!definicion_CTX_IN_ALMACEN.reingreso ? iTMercaIN.descripcion : iTMercaIN.descripcionEquivalencia}</td>
                        <td data-label="IGV">{iTMercaIN.IGV.$numberDecimal ? iTMercaIN.IGV.$numberDecimal : iTMercaIN.IGV} %</td>
                        <td data-label="Cantidad" class="comoNumero">
                          <input
                            type="number"
                            disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                            style={{ width: '70px', textAlign: 'end' }}
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
                              if (definicion_CTX_IN_ALMACEN.enDolares) {
                                ///  USD///
                                iTMercaIN.subUSD =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.costoUnitarioUSD ? iTMercaIN.costoUnitarioUSD : iTMercaIN.costoUnitarioUSD.$numberDecimal);

                                iTMercaIN.totUSD =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.valorUnitarioUSD ? iTMercaIN.valorUnitarioUSD : iTMercaIN.valorUnitarioUSD.$numberDecimal);
                                ///  PEN///
                                iTMercaIN.subPEN =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.costoUnitarioUSD ? iTMercaIN.costoUnitarioUSD : iTMercaIN.costoUnitarioUSD.$numberDecimal) *
                                  definicion_CTX_IN_ALMACEN.tipoCambio;

                                iTMercaIN.totPEN =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.valorUnitarioUSD ? iTMercaIN.valorUnitarioUSD : iTMercaIN.valorUnitarioUSD.$numberDecimal) *
                                  definicion_CTX_IN_ALMACEN.tipoCambio;
                              } else {
                                ///  PEN///
                                iTMercaIN.subPEN =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.costoUnitarioPEN ? iTMercaIN.costoUnitarioPEN : iTMercaIN.costoUnitarioPEN.$numberDecimal);

                                iTMercaIN.totPEN =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.valorUnitarioPEN ? iTMercaIN.valorUnitarioPEN : iTMercaIN.valorUnitarioPEN.$numberDecimal);
                              }
                              // const iv = itemsVentaK[index];
                            }}
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                          />
                        </td>
                        <td data-label="Uni">{!definicion_CTX_IN_ALMACEN.reingreso ? iTMercaIN.unidad : iTMercaIN.unidadEquivalencia}</td>
                        <td data-label={definicion_CTX_IN_ALMACEN.enDolares ? 'CostoUniUSD' : 'CostoUniPEN'} class="comoNumero">
                          <input
                            type="number"
                            disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                            style={{ width: '70px', textAlign: 'end' }}
                            value={
                              definicion_CTX_IN_ALMACEN.enDolares
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
                              let precio;
                              if (definicion_CTX_IN_ALMACEN.enDolares) {
                                //******  USD */
                                iTMercaIN.costoUnitarioUSD = costo;

                                if (iTMercaIN.IGV === 0) {
                                  IGVCalculado = 0;
                                  precio = costo;
                                } else {
                                  IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                  precio = costo * IGVCalculado;
                                }
                                iTMercaIN.precioUniUSD = formatear_6Decimales(precio);

                                iTMercaIN.subUSD =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.costoUnitarioUSD ? iTMercaIN.costoUnitarioUSD : iTMercaIN.costoUnitarioUSD.$numberDecimal);

                                iTMercaIN.valorUnitarioUSD = precio;
                                iTMercaIN.totUSD =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.valorUnitarioUSD.$numberDecimal ? iTMercaIN.valorUnitarioUSD.$numberDecimal : iTMercaIN.valorUnitarioUSD);
                                //console.log(
                                //   '🥪🥪🥪🥪🥪 iTMercaIN.cantidadIngresada - iTMercaIN.valorUnitarioUSD - iTMercaIN.valorUnitarioUSD.$numberDecimal',
                                //   iTMercaIN.cantidadIngresada,
                                //   iTMercaIN.valorUnitarioUSD,
                                //   iTMercaIN.valorUnitarioUSD.$numberDecimal
                                // );
                                ///////
                                iTMercaIN.costoUnitarioPEN = iTMercaIN.costoUnitarioUSD * definicion_CTX_IN_ALMACEN.tipoCambio;
                                iTMercaIN.precioUniPEN = formatear_6Decimales(precio * definicion_CTX_IN_ALMACEN.tipoCambio);
                                iTMercaIN.subPEN = formatear_6Decimales(iTMercaIN.subUSD * definicion_CTX_IN_ALMACEN.tipoCambio);
                                iTMercaIN.valorUnitarioPEN = formatear_6Decimales(precio * definicion_CTX_IN_ALMACEN.tipoCambio);
                                iTMercaIN.totPEN = formatear_6Decimales(iTMercaIN.totUSD * definicion_CTX_IN_ALMACEN.tipoCambio);
                                //console.log(
                                //   '🥪🥪🥪🥪🥪 ',
                                //   iTMercaIN.costoUnitarioPEN,
                                //   iTMercaIN.precioUniPEN,
                                //   iTMercaIN.subPEN,
                                //   iTMercaIN.valorUnitarioPEN,
                                //   iTMercaIN.totPEN
                                // );
                              } else {
                                //******  PEN */
                                iTMercaIN.costoUnitarioPEN = costo;

                                if (iTMercaIN.IGV === 0) {
                                  IGVCalculado = 0;
                                  precio = costo;
                                } else {
                                  IGVCalculado = 1 + iTMercaIN.IGV / 100;
                                  precio = costo * IGVCalculado;
                                }
                                iTMercaIN.precioUniPEN = formatear_6Decimales(precio);

                                iTMercaIN.subPEN =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.costoUnitarioPEN ? iTMercaIN.costoUnitarioPEN : iTMercaIN.costoUnitarioPEN.$numberDecimal);

                                iTMercaIN.valorUnitarioPEN = precio;
                                iTMercaIN.totPEN =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.valorUnitarioPEN.$numberDecimal ? iTMercaIN.valorUnitarioPEN.$numberDecimal : iTMercaIN.valorUnitarioPEN);
                                //console.log(
                                //   '🥪🥪🥪🥪🥪 iTMercaIN.cantidadIngresada - iTMercaIN.valorUnitarioPEN - iTMercaIN.valorUnitarioPEN.$numberDecimal',
                                //   iTMercaIN.cantidadIngresada,
                                //   iTMercaIN.valorUnitarioPEN,
                                //   iTMercaIN.valorUnitarioPEN.$numberDecimal
                                // );
                              }
                            }}
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                          />
                        </td>
                        <td data-label={definicion_CTX_IN_ALMACEN.enDolares ? 'SubUSD' : 'SubPEN'} class="comoNumero">
                          {definicion_CTX_IN_ALMACEN.enDolares
                            ? !definicion_CTX_IN_ALMACEN.reingreso
                              ? iTMercaIN.subUSD.$numberDecimal
                                ? formatear_6Decimales(iTMercaIN.subUSD.$numberDecimal)
                                : formatear_6Decimales(iTMercaIN.subUSD)
                              : iTMercaIN.subEquivalenciaUSD.$numberDecimal
                              ? formatear_6Decimales(iTMercaIN.subEquivalenciaUSD.$numberDecimal)
                              : formatear_6Decimales(iTMercaIN.subEquivalenciaUSD)
                            : !definicion_CTX_IN_ALMACEN.reingreso
                            ? iTMercaIN.subPEN.$numberDecimal
                              ? formatear_6Decimales(iTMercaIN.subPEN.$numberDecimal)
                              : formatear_6Decimales(iTMercaIN.subPEN)
                            : iTMercaIN.subEquivalenciaPEN.$numberDecimal
                            ? formatear_6Decimales(iTMercaIN.subEquivalenciaPEN.$numberDecimal)
                            : formatear_6Decimales(iTMercaIN.subEquivalenciaPEN)}
                        </td>
                        <td data-label={definicion_CTX_IN_ALMACEN.enDolares ? 'ValorUniUSD' : 'ValorUniPEN'} class="comoNumero">
                          <input
                            type="number"
                            disabled={definicion_CTX_IN_ALMACEN.reingreso || definicion_CTX_IN_ALMACEN._id !== ''}
                            style={{ width: '90px', textAlign: 'end' }}
                            value={
                              definicion_CTX_IN_ALMACEN.enDolares
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

                              if (definicion_CTX_IN_ALMACEN.enDolares) {
                                //******* USD *****/
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
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.valorUnitarioUSD ? iTMercaIN.valorUnitarioUSD : iTMercaIN.valorUnitarioUSD.$numberDecimal);

                                iTMercaIN.subUSD =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.costoUnitarioUSD ? iTMercaIN.costoUnitarioUSD : iTMercaIN.costoUnitarioUSD.$numberDecimal);
                                //******* PEN *****/
                                iTMercaIN.valorUnitarioPEN = precio * definicion_CTX_IN_ALMACEN.tipoCambio;
                                iTMercaIN.costoUnitarioPEN = formatear_6Decimales(costo * definicion_CTX_IN_ALMACEN.tipoCambio);
                                iTMercaIN.totPEN = iTMercaIN.totUSD * definicion_CTX_IN_ALMACEN.tipoCambio;
                                iTMercaIN.subPEN = iTMercaIN.subUSD * definicion_CTX_IN_ALMACEN.tipoCambio;
                              } else {
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
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.valorUnitarioPEN ? iTMercaIN.valorUnitarioPEN : iTMercaIN.valorUnitarioPEN.$numberDecimal);

                                iTMercaIN.subPEN =
                                  (iTMercaIN.cantidadIngresada ? iTMercaIN.cantidadIngresada : iTMercaIN.cantidadIngresada.$numberDecimal) *
                                  (iTMercaIN.costoUnitarioPEN ? iTMercaIN.costoUnitarioPEN : iTMercaIN.costoUnitarioPEN.$numberDecimal);
                              }
                            }}
                            onFocusin$={(e) => {
                              (e.target as HTMLInputElement).select();
                            }}
                          />
                        </td>
                        <td data-label={definicion_CTX_IN_ALMACEN.enDolares ? 'TotUSD' : 'TotPEN'} style={{ textAlign: 'end' }}>
                          {definicion_CTX_IN_ALMACEN.enDolares
                            ? !definicion_CTX_IN_ALMACEN.reingreso
                              ? iTMercaIN.totUSD.$numberDecimal
                                ? formatear_6Decimales(iTMercaIN.totUSD.$numberDecimal)
                                : formatear_6Decimales(iTMercaIN.totUSD)
                              : iTMercaIN.totEquivalenciaUSD.$numberDecimal
                              ? formatear_6Decimales(iTMercaIN.totEquivalenciaUSD.$numberDecimal)
                              : formatear_6Decimales(iTMercaIN.totEquivalenciaUSD)
                            : !definicion_CTX_IN_ALMACEN.reingreso
                            ? iTMercaIN.totPEN.$numberDecimal
                              ? formatear_6Decimales(iTMercaIN.totPEN.$numberDecimal)
                              : formatear_6Decimales(iTMercaIN.totPEN)
                            : iTMercaIN.totEquivalenciaPEN.$numberDecimal
                            ? formatear_6Decimales(iTMercaIN.totEquivalenciaPEN.$numberDecimal)
                            : formatear_6Decimales(iTMercaIN.totEquivalenciaPEN)}
                        </td>
                        {definicion_CTX_IN_ALMACEN._id === '' ? (
                          <td data-label="Acc" class="acciones">
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
                    <td colSpan={8} style={{ textAlign: 'end' }}></td>
                    <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      {`${
                        definicion_CTX_IN_ALMACEN.enDolares
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
                    <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      {`${
                        definicion_CTX_IN_ALMACEN.enDolares
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
                    <td colSpan={1} class="comoNumero" style={{ color: '#2E1800' }}>
                      {`${
                        definicion_CTX_IN_ALMACEN.enDolares
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
                  </tr>
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'end' }}></td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      Sub Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      IGV {definicion_CTX_IN_ALMACEN.enDolares ? 'USD' : 'PEN'}
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end', color: '#2E1800' }}>
                      Total {definicion_CTX_IN_ALMACEN.enDolares ? 'USD' : 'PEN'}
                    </td>
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
        {/* GRABAR */}
        {definicion_CTX_IN_ALMACEN._id === '' ? (
          <input type="button" value="Grabar INGRESO" class="btn-centro" style={{ cursor: 'pointer', height: '40px' }} onClick$={() => registrarIngreso()} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
});
