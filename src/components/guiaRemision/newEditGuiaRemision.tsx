import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import type { IGuiaRemision } from '~/interfaces/iGuiaRemision';
import { parametrosGlobales } from '~/routes/login';
import { CTX_INDEX_GUIA_REMISION } from '~/routes/(guiasRemision)/guiaRemision';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
import type { IPersona } from '~/interfaces/iPersona';
import { cerosALaIzquierda, hoy, menosXdiasHoy } from '~/functions/comunes';
// import BuscarMercaderiaIN from '../miscelanea/mercaderiaIN/buscarMercaderiaIN';  ultimoDiaDelPeriodoX
import ElButton from '../system/elButton';
import BorrarChofer from './borrarChofer';
import BorrarUnidadTransporte from './borrarUnidadTransporte';
// import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
// import NewEditUnidadTransporte from './newEditUnidadTransporte';
// import NewEditChofer from './newEditChofer';
import BuscarChofer from '../miscelanea/chofer/buscarChofer';
import BuscarUnidadTransporte from '../miscelanea/unidadTransporte/buscarUnidadTransporte';
import BuscarDireccionGR from './buscarDireccionGR';
import RegistroBienesGR from './newEditRegistroBienGR';
import VerificarObservación from './verificarObservacion';
import { getSeriesGuiasRemisionActivasEnSucursal, inUpGuiaRemision } from '~/apis/guiaRemision.api';
import BorrarItemGuiaRemision from './borrarItemGuiaRemision';

export const CTX_NEW_EDIT_GUIA_REMISION = createContextId<any>('__new_edit_guia_remision');
export const CTX_GUIA_REMISION = createContextId<IGuiaRemision>('__guia_remision');
export const CTX_DESTINATARIO_GR = createContextId<any>('__destinatario');

export default component$((props: { addPeriodo: any; guiaRemisionSeleccionada: any }) => {
  //#region DEFINICION CTX_NEW_EDIT_GUIA_REMISION
  const definicion_CTX_NEW_EDIT_GUIA_REMISION = useStore({
    // mostrarPanelCuotasCredito: false,
    // grabo_CuotaCredito: false,
    // mostrarVerAlmacen: false,

    mostrarPanelBuscarPuntoPartida: false,
    mostrarPanelBuscarPuntoLlegada: false,

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersonaRemitente: false,
    mostrarPanelBuscarServicio: false,

    mostrarPanelBuscarPersonaDestinatario: false,

    mostrarPanelBuscarPersonaTransportista: false,

    mostrarPanelBuscarChofer: false,
    selecciono_Chofer: false,
    mostrarPanelDeleteChofer: false,
    borrarIdAuxiliarChofer: 0,
    mostrarPanelBuscarPersonaChofer: false,

    mostrarPanelBuscarUnidadTransporte: false,
    selecciono_UnidadTransporte: false,
    mostrarPanelUnidadTransporte: false,
    borrarIdAuxiliarUnidadTransporte: 0,
    mostrarPanelDeleteUnidadTransporte: false,

    mostrarPanelBuscarMercaderiaIN: false,
    mostrarPanelBuscarMercaderiaOUT: false,

    mostrarPanelRegistrarBien: false,

    borrarIdAuxiliarItemGuiaRemision: 0,
    mostrarPanelDeleteItemGuiaRemision: false,

    mostrarPanelVerificarObservacion: false,
    mostrarPanelVerificarObservacion_RESPUESTA: false,

    // mostrarAdjuntarOS: false,
    // mostrarAdjuntarCotizacion: false,

    // mostrarPanelBorrarItemVenta: false,
    // borrar_idAuxilarVenta: 0,
  });
  useContextProvider(CTX_NEW_EDIT_GUIA_REMISION, definicion_CTX_NEW_EDIT_GUIA_REMISION);
  //#endregion DEFINICION CTX_NEW_EDIT_GUIA_REMISION

  //#region DEFINICION CTX_GUIA_REMISION
  const definicion_CTX_GUIA_REMISION = useStore<IGuiaRemision>(
    {
      _id: '',
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idSucursal: parametrosGlobales.idSucursal,
      idPeriodo: props.addPeriodo.idPeriodo,
      periodo: props.addPeriodo.periodo,

      ruc: parametrosGlobales.RUC,
      empresa: parametrosGlobales.RazonSocial,
      sucursal: parametrosGlobales.sucursal,
      direccion: parametrosGlobales.Direccion,

      guiaRemisionElectronica: parametrosGlobales.guiaRemisionElectronica,
      guiaRemisionElectronicaAutomatica: parametrosGlobales.guiaRemisionElectronicaAutomatica,
      verificarObservacionGR: parametrosGlobales.verificarObservacionGR,

      idSerieGuiaRemision: '',
      serie: '',
      numero: 0,

      fechaEmision: '',
      fechaInicioTraslado: '',

      puntoPartida: '',
      ubigeoPartida: '',
      puntoLlegada: '',
      ubigeoLlegada: '',

      idModalidadTraslado: '',
      modalidadTraslado: '',
      idMotivoTraslado: '',
      motivoTraslado: '',

      idRemitente: parametrosGlobales.idPersona,
      codigoTipoDocumentoIdentidadRemitente: '6',
      tipoDocumentoIdentidadRemitente: 'RUC',
      numeroIdentidadRemitente: parametrosGlobales.RUC,
      razonSocialNombreRemitente: parametrosGlobales.RazonSocial,

      idDestinatario: '',
      codigoTipoDocumentoIdentidadDestinatario: '',
      tipoDocumentoIdentidadDestinatario: 'RUC',
      numeroIdentidadDestinatario: '',
      razonSocialNombreDestinatario: '',
      direccionDestinatario: '',
      emailDestinatario: '',
      notificarDestinatario: false,

      idTransportista: '',
      codigoTipoDocumentoIdentidadTransportista: '',
      tipoDocumentoIdentidadTransportista: 'RUC',
      numeroIdentidadTransportista: '',
      razonSocialNombreTransportista: '',

      numeroBultosPallets: '',
      pesoBrutoTotal: '',

      choferes: [],
      unidadesTransporte: [],

      observacion: '',

      itemsGuiaRemision: [],
    },
    { deep: true }
  );
  useContextProvider(CTX_GUIA_REMISION, definicion_CTX_GUIA_REMISION);
  //#endregion DEFINICION CTX_GUIA_REMISION

  //#region DEFINICION CTX_DESTINATARIO_GR
  const definicion_CTX_DESTINATARIO_GR = useStore<IPersona>({
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
  useContextProvider(CTX_DESTINATARIO_GR, definicion_CTX_DESTINATARIO_GR);
  //#endregion DEFINICION CTX_DESTINATARIO_GR

  //#region CONTEXTOS
  const ctx_index_guia_remision = useContext(CTX_INDEX_GUIA_REMISION);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const dataSerie: any = useSignal([]);
  // const grabo = useSignal(false);

  const elChofSelecionado = useSignal([]);
  const laUniSelecionada = useSignal([]);

  const borrarChofer = useStore({
    idAuxiliar: '',
    numeroIdentidad: '',
    razonSocialNombre: '',
    licencia: '',
  });
  const borrarUnidadTransporte = useStore({
    idAuxiliar: '',
    placa: '',
    vehiculoMarca: '',
    vehiculoModelo: '',
  });
  const borrarItemGuiaRemision = useStore({
    idAuxiliar: '',
    cantidad: '',
    unidad: '',
    descripcion: '',
  });

  useTask$(async ({ track }) => {
    track(() => ini.value);

    let laSerie;
    const parametros = {
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idSucursal: parametrosGlobales.idSucursal,
    };
    if (ini.value === 0) {
      //cargar LAS SERIES DE GUIAS DE REMISON
      laSerie = await getSeriesGuiasRemisionActivasEnSucursal(parametros);
      // console.log('laSerie', laSerie);
      //
      dataSerie.value = laSerie.data;
      // console.log('dataSerie.value ', dataSerie.value);
      if (dataSerie.value.length === 1) {
        definicion_CTX_GUIA_REMISION.idSerieGuiaRemision = dataSerie.value[0]._id;
        definicion_CTX_GUIA_REMISION.serie = dataSerie.value[0].serie;
        // console.log('solo UNO', dataSerie.value[0], dataSerie.value[0]._id, dataSerie.value[0].serie);
      }

      ini.value++;
    }
  });
  //#endregion INICIALIZACION

  //#region REMITENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona);
    if (definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona && definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona === 'remitente') {
      // alert('evalua a la persona');
      definicion_CTX_GUIA_REMISION.idRemitente = definicion_CTX_DESTINATARIO_GR._id;
      definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadRemitente = definicion_CTX_DESTINATARIO_GR.codigoTipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente = definicion_CTX_DESTINATARIO_GR.tipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.numeroIdentidadRemitente = definicion_CTX_DESTINATARIO_GR.numeroIdentidad;
      definicion_CTX_GUIA_REMISION.razonSocialNombreRemitente = definicion_CTX_DESTINATARIO_GR.razonSocialNombre;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona = false;
    }
  });
  //#endregion REMITENTE

  //#region DESTINATARIO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona);
    if (definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona && definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona === 'destinatario') {
      // alert('evalua a la persona');
      definicion_CTX_GUIA_REMISION.idDestinatario = definicion_CTX_DESTINATARIO_GR._id;
      definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadDestinatario = definicion_CTX_DESTINATARIO_GR.codigoTipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario = definicion_CTX_DESTINATARIO_GR.tipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.numeroIdentidadDestinatario = definicion_CTX_DESTINATARIO_GR.numeroIdentidad;
      definicion_CTX_GUIA_REMISION.razonSocialNombreDestinatario = definicion_CTX_DESTINATARIO_GR.razonSocialNombre;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona = false;
    }
  });
  //#endregion DESTINATARIO

  //#region TRANSPORTISTA
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona);
    if (definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona && definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona === 'transportista') {
      // alert('evalua a la persona');
      definicion_CTX_GUIA_REMISION.idTransportista = definicion_CTX_DESTINATARIO_GR._id;
      definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadTransportista = definicion_CTX_DESTINATARIO_GR.codigoTipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista = definicion_CTX_DESTINATARIO_GR.tipoDocumentoIdentidad;
      definicion_CTX_GUIA_REMISION.numeroIdentidadTransportista = definicion_CTX_DESTINATARIO_GR.numeroIdentidad;
      definicion_CTX_GUIA_REMISION.razonSocialNombreTransportista = definicion_CTX_DESTINATARIO_GR.razonSocialNombre;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_GUIA_REMISION.selecciono_Persona = false;
    }
  });
  //#endregion TRANSPORTISTA

  //#region BORRAR CHOFER
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarChofer);

    if (definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarChofer > 0) {
      //
      const newItems: any = definicion_CTX_GUIA_REMISION.choferes.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarChofer
      );
      definicion_CTX_GUIA_REMISION.choferes = newItems;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarChofer = 0;
    }
  });
  //#endregion BORRAR CHOFER

  //#region BORRAR UNIDAD TRANSPORTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarUnidadTransporte);

    if (definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarUnidadTransporte > 0) {
      //
      const newItems: any = definicion_CTX_GUIA_REMISION.unidadesTransporte.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarUnidadTransporte
      );
      definicion_CTX_GUIA_REMISION.unidadesTransporte = newItems;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarUnidadTransporte = 0;
    }
  });
  //#endregion BORRAR UNIDAD TRANSPORTE

  //#region BORRAR ITEM GUIA REMISION
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarItemGuiaRemision);

    if (definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarItemGuiaRemision > 0) {
      //
      console.log('borrando.......', definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarItemGuiaRemision);
      const newItems: any = definicion_CTX_GUIA_REMISION.itemsGuiaRemision.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarItemGuiaRemision
      );
      definicion_CTX_GUIA_REMISION.itemsGuiaRemision = newItems;

      definicion_CTX_NEW_EDIT_GUIA_REMISION.borrarIdAuxiliarItemGuiaRemision = 0;
    }
  });
  //#endregion BORRAR ITEM GUIA REMISION

  //#region VERIFICAR_OBSERVACION
  // useTask$(({ track }) => {
  //   track(() => definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion_RESPUESTA);

  //   if (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion_RESPUESTA) {
  //     definicion_CTX_GUIA_REMISION.verificarObservacionGR = false;
  //     // console.log('ok');
  //   } else {
  //     // definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion_RESPUESTA = false;
  //     return;
  //   }
  // });
  //#endregion VERIFICAR_OBSERVACION

  //#region REGISTRAR GUA REMISION
  const registrarGuiaRemision = $(async () => {
    //
    // VERIFICAR OBSERVACION
    // if (definicion_CTX_GUIA_REMISION.verificarObservacionGR) {
    //   console.log('verificarObservacionGuiaRemision');
    //   if (definicion_CTX_GUIA_REMISION.observacion.trim() === '') {
    //     // alert('Verifique la observación');
    //     // document.getElementById('in_Observacion')?.focus();
    //     // return;

    //     definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion = true;
    //     // continue
    //     // console.log('silka');
    //     // if (definicion_CTX_GUIA_REMISION.verificarObservacionGR) {
    //     //   // definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion_RESPUESTA = false;
    //     //   console.log('ok');
    //     // } else {
    //     //   // definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion_RESPUESTA = false;
    //     //   console.log('return');
    //     //   return;
    //     // }
    //   }
    // }
    // console.log('ESLOVAQUIA');
    //
    if (definicion_CTX_GUIA_REMISION.serie === '') {
      alert('Seleccione la serie');
      document.getElementById('selectSerieGuiaRemision')?.focus();
      return;
    }
    if (definicion_CTX_GUIA_REMISION.fechaEmision === '') {
      alert('Ingrese la fecha');
      document.getElementById('in_Fecha_Emision_GR')?.focus();
      return;
    }
    if (definicion_CTX_GUIA_REMISION.fechaInicioTraslado === '') {
      alert('Ingrese la fecha de inicio de traslado');
      document.getElementById('in_Fecha_Inicio_Traslado_GR')?.focus();
      return;
    }
    if (definicion_CTX_GUIA_REMISION.puntoPartida === '' || definicion_CTX_GUIA_REMISION.ubigeoPartida === '') {
      alert('Ingrese el punto de partida / ubigeo de partida');
      document.getElementById('in_BuscarPuntoPartida_GR')?.focus();
      return;
    }
    if (definicion_CTX_GUIA_REMISION.puntoLlegada === '' || definicion_CTX_GUIA_REMISION.ubigeoLlegada === '') {
      alert('Ingrese el punto de llegada / ubigeo de llegada');
      document.getElementById('in_BuscarPuntoLlegada_GR')?.focus();
      return;
    }
    if (definicion_CTX_GUIA_REMISION.idModalidadTraslado === '') {
      alert('Seleccione la modalidad de traslado');
      document.getElementById('select_ModalidadTraslado_GR')?.focus();
      return;
    }
    if (definicion_CTX_GUIA_REMISION.idMotivoTraslado === '') {
      alert('Seleccione la motivo de traslado');
      document.getElementById('select_MotivoTraslado_GR')?.focus();
      return;
    }
    //REMITENTE
    if (definicion_CTX_GUIA_REMISION.numeroIdentidadRemitente === '') {
      alert('Seleccione el número de identidad del remitente.');
      document.getElementById('in_BuscarRemitente_GR')?.focus();
      return;
    }
    if (definicion_CTX_GUIA_REMISION.razonSocialNombreRemitente === '') {
      alert('Seleccione la razón social / nombre del remitente.');
      document.getElementById('in_BuscarRemitente_GR')?.focus();
      return;
    }
    //DESTINATARIO
    if (definicion_CTX_GUIA_REMISION.numeroIdentidadDestinatario === '') {
      alert('Seleccione el número de identidad del destinatario.');
      document.getElementById('in_BuscarDestinatario_GR')?.focus();
      return;
    }
    if (definicion_CTX_GUIA_REMISION.razonSocialNombreDestinatario === '') {
      alert('Seleccione la razón social / nombre del destinatario.');
      document.getElementById('in_BuscarDestinatario_GR')?.focus();
      return;
    }
    //TRANSPORTISTA
    if (definicion_CTX_GUIA_REMISION.modalidadTraslado === 'TRANSPORTE PUBLICO') {
      if (definicion_CTX_GUIA_REMISION.numeroIdentidadTransportista === '') {
        alert('Seleccione el número de identidad del destinatario.');
        document.getElementById('in_BuscarTransportista_GR')?.focus();
        return;
      }
      if (definicion_CTX_GUIA_REMISION.razonSocialNombreTransportista === '') {
        alert('Seleccione la razón social / nombre del destinatario.');
        document.getElementById('in_BuscarTransportista_GR')?.focus();
        return;
      }
    }
    //CHOFER / S
    if (definicion_CTX_GUIA_REMISION.choferes.length === 0) {
      alert('Ingrese el chofer.');
      document.getElementById('btn_Add_Chofer_GR')?.focus();
      return;
    }
    //UNIDADES DE TRANSPORTE
    if (definicion_CTX_GUIA_REMISION.unidadesTransporte.length === 0) {
      alert('Ingrese la unidad de transporte.');
      document.getElementById('btn_Add_UnidadTransporte_GR')?.focus();
      return;
    }
    //NÚMERO DE BULTOS
    if (definicion_CTX_GUIA_REMISION.numeroBultosPallets === '') {
      alert('Ingrese el número de bultos.');
      document.getElementById('input_BultosPallets_GR')?.focus();
      return;
    }
    //PESO BRUTO TOTAL
    if (definicion_CTX_GUIA_REMISION.pesoBrutoTotal === '') {
      alert('Ingrese el peso bruto total.');
      document.getElementById('input_PesoBrutoTotal_GR')?.focus();
      return;
    }
    // VERIFICAR OBSERVACION
    if (definicion_CTX_GUIA_REMISION.verificarObservacionGR) {
      console.log('verificarObservacionGuiaRemision');
      if (definicion_CTX_GUIA_REMISION.observacion.trim() === '') {
        alert('Verifique la observación');
        document.getElementById('in_Observacion')?.focus();
        return;
        // definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion = true;
        // continue
        // console.log('silka');
        // if (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion_RESPUESTA) {
        //   definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion_RESPUESTA = false;
        //   console.log('ok');
        // } else {
        //   definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion_RESPUESTA = false;
        //   // return;
        // }
      }
    }
    // ITEMS DE GUIA DE REMISON
    if (definicion_CTX_GUIA_REMISION.itemsGuiaRemision.length === 0) {
      alert('No existe ningún bien para ser trasladado.');
      document.getElementById('btn_RegistrarBien_GR')?.focus();
      return;
    }
    //
    console.log('PASO A GUIA R.....');
    //
    const grGRABADA = await inUpGuiaRemision({
      idGrupoEmpresarial: definicion_CTX_GUIA_REMISION.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_GUIA_REMISION.idEmpresa,
      idSucursal: definicion_CTX_GUIA_REMISION.idSucursal,
      idPeriodo: definicion_CTX_GUIA_REMISION.idPeriodo,
      periodo: definicion_CTX_GUIA_REMISION.periodo,

      ruc: definicion_CTX_GUIA_REMISION.ruc,
      empresa: definicion_CTX_GUIA_REMISION.empresa,
      sucursal: definicion_CTX_GUIA_REMISION.sucursal,
      direccion: definicion_CTX_GUIA_REMISION.direccion,

      guiaRemisionElectronica: definicion_CTX_GUIA_REMISION.guiaRemisionElectronica,
      guiaRemisionElectronicaAutomatica: definicion_CTX_GUIA_REMISION.guiaRemisionElectronicaAutomatica,
      verificarObservacionGR: definicion_CTX_GUIA_REMISION.verificarObservacionGR,

      idSerieGuiaRemision: definicion_CTX_GUIA_REMISION.idSerieGuiaRemision,
      serie: definicion_CTX_GUIA_REMISION.serie,
      // numero: definicion_CTX_GUIA_REMISION.numero,

      fechaEmision: definicion_CTX_GUIA_REMISION.fechaEmision,
      fechaInicioTraslado: definicion_CTX_GUIA_REMISION.fechaInicioTraslado,

      puntoPartida: definicion_CTX_GUIA_REMISION.puntoPartida,
      ubigeoPartida: definicion_CTX_GUIA_REMISION.ubigeoPartida,
      puntoLlegada: definicion_CTX_GUIA_REMISION.puntoLlegada,
      ubigeoLlegada: definicion_CTX_GUIA_REMISION.ubigeoLlegada,

      idModalidadTraslado: definicion_CTX_GUIA_REMISION.idModalidadTraslado,
      modalidadTraslado: definicion_CTX_GUIA_REMISION.modalidadTraslado,
      idMotivoTraslado: definicion_CTX_GUIA_REMISION.idMotivoTraslado,
      motivoTraslado: definicion_CTX_GUIA_REMISION.motivoTraslado,

      idRemitente: definicion_CTX_GUIA_REMISION.idRemitente,
      codigoTipoDocumentoIdentidadRemitente: definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadRemitente,
      tipoDocumentoIdentidadRemitente: definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente,
      numeroIdentidadRemitente: definicion_CTX_GUIA_REMISION.numeroIdentidadRemitente,
      razonSocialNombreRemitente: definicion_CTX_GUIA_REMISION.razonSocialNombreRemitente,

      idDestinatario: definicion_CTX_GUIA_REMISION.idDestinatario,
      codigoTipoDocumentoIdentidadDestinatario: definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadDestinatario,
      tipoDocumentoIdentidadDestinatario: definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario,
      numeroIdentidadDestinatario: definicion_CTX_GUIA_REMISION.numeroIdentidadDestinatario,
      razonSocialNombreDestinatario: definicion_CTX_GUIA_REMISION.razonSocialNombreDestinatario,

      idTransportista: definicion_CTX_GUIA_REMISION.idTransportista,
      codigoTipoDocumentoIdentidadTransportista: definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadTransportista,
      tipoDocumentoIdentidadTransportista: definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista,
      numeroIdentidadTransportista: definicion_CTX_GUIA_REMISION.numeroIdentidadTransportista,
      razonSocialNombreTransportista: definicion_CTX_GUIA_REMISION.razonSocialNombreTransportista,

      choferes: definicion_CTX_GUIA_REMISION.choferes,
      unidadesTransporte: definicion_CTX_GUIA_REMISION.unidadesTransporte,

      numeroBultosPallets: definicion_CTX_GUIA_REMISION.numeroBultosPallets,
      pesoBrutoTotal: definicion_CTX_GUIA_REMISION.pesoBrutoTotal,

      observacion: definicion_CTX_GUIA_REMISION.observacion,

      itemsGuiaRemision: definicion_CTX_GUIA_REMISION.itemsGuiaRemision,
    });

    if (grGRABADA.status === 400) {
      alert('🛑 Falla al registrar la guía de remisión. ' + grGRABADA.message);
      ctx_index_guia_remision.mostrarSpinner = false;
      return;
    }

    // console.log('guiita', grGRABADA.);
    alert('✅✅✅ Registro satisfactorio de la guía de remisión');
    ctx_index_guia_remision.grabo_GuiaRemision = true; //grabo.value;
    ctx_index_guia_remision.mostrarPanelGuiaRemision = false;
  });
  //#endregion REGISTRAR GUA REMISION

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 880px)',
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
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="ver parametrosGlobales"
          onClick={$(() => {
            console.log('parametrosGlobales', parametrosGlobales);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="ver definicion_CTX_GUIA_REMISION"
          onClick={$(() => {
            console.log('definicion_CTX_GUIA_REMISION', definicion_CTX_GUIA_REMISION);
          })}
        /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_guia_remision.grabo_GuiaRemision = false; // grabo.value;
            ctx_index_guia_remision.mostrarPanelGuiaRemision = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>
        Guía de remisión - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
      </h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ----------------------------------------------------- */}
        {/* PERIODO */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input id="in_Periodo_GR" style={{ width: '100%' }} type="number" disabled value={definicion_CTX_GUIA_REMISION.periodo} />
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* SERIE */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            {
              <select
                id="selectSerieGuiaRemision"
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const elSelect = e.target as HTMLSelectElement;
                  const elOption = elSelect[idx];

                  if (elOption.id === '') {
                    definicion_CTX_GUIA_REMISION.idSerieGuiaRemision = '';
                    definicion_CTX_GUIA_REMISION.serie = '';
                  } else {
                    definicion_CTX_GUIA_REMISION.idSerieGuiaRemision = elOption.id;
                    definicion_CTX_GUIA_REMISION.serie = (e.target as HTMLSelectElement).value;
                    document.getElementById('in_Fecha_Emision_GR')?.focus();
                  }
                }}
              >
                <option value="">-- Seleccione una serie --</option>
                {dataSerie.value.map((ser: any) => {
                  return (
                    <option id={ser._id} value={ser.serie} selected={definicion_CTX_GUIA_REMISION.serie === ser.serie}>
                      {ser.serie}
                    </option>
                  );
                })}
              </select>
            }
          </div>
        </div>
        {/* ----------------------------------------------------- */}
        {/* FECHA EMISON / FECHA INICIO TRASLADO  */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* FECHA EMISON*/}
          <div style={{ display: 'flex', margin: '2px 0px' }}>
            {/* <label style={{ display: 'block ruby', width: '130px', marginRight: '8px' }}>FECH EMISIÓN</label> */}
            <input
              id="in_Fecha_Emision_GR"
              type="date"
              // disabled
              title="Fecha emisión"
              placeholder="Fecha emisión"
              // min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
              min={menosXdiasHoy(2)}
              // max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
              max={hoy()}
              value={definicion_CTX_GUIA_REMISION.fechaEmision}
              style={{ width: '100%' }}
              onChange$={(e) => {
                definicion_CTX_GUIA_REMISION.fechaEmision = (e.target as HTMLInputElement).value;
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('in_Fecha_Inicio_Traslado_GR')?.focus();
                }
              }}
            />
          </div>
          {/* ----------------------------------------------------- */}
          {/* FECHA INICIO TRASLADO */}
          <div style={{ display: 'flex', margin: '2px 0px' }}>
            {/* <label style={{ display: 'block ruby', marginRight: '8px' }}>FECH INI TRASLAD</label> */}
            <input
              id="in_Fecha_Inicio_Traslado_GR"
              type="date"
              // disabled
              title="Fecha de inicio de traslado"
              placeholder="Fecha de inicio de traslado"
              // min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
              // max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
              min={definicion_CTX_GUIA_REMISION.fechaEmision}
              value={definicion_CTX_GUIA_REMISION.fechaInicioTraslado}
              style={{ width: '100%' }}
              onChange$={(e) => {
                definicion_CTX_GUIA_REMISION.fechaInicioTraslado = (e.target as HTMLInputElement).value;
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('in_BuscarPuntoPartida')?.focus();
                }
              }}
            />
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* PUNTO PARTIDA / PUNTO LLEGADA  */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* PUNTO PARTIDA  */}
          <div style={{ display: 'flex', margin: '2px 0px' }}>
            <div style={{ display: 'flex', width: '100%', gap: '4px' }}>
              <input
                id="in_PuntoPartido_GR"
                type="text"
                disabled
                placeholder="PUNTO PARTIDA"
                value={definicion_CTX_GUIA_REMISION.puntoPartida}
                onChange$={(e) => {
                  definicion_CTX_GUIA_REMISION.puntoPartida = (e.target as HTMLInputElement).value;
                }}
                style={{ width: '100%' }}
              />
              <input
                id="in_UbigeoPartido_GR"
                type="text"
                disabled
                value={definicion_CTX_GUIA_REMISION.ubigeoPartida}
                onChange$={(e) => {
                  definicion_CTX_GUIA_REMISION.ubigeoPartida = (e.target as HTMLInputElement).value;
                }}
                style={{ width: '60px' }}
              />
              <input
                id="in_BuscarPuntoPartida_GR"
                type="image"
                src={images.searchPLUS}
                title="Buscar punto de partida"
                height={16}
                width={16}
                // style={{ marginLeft: '2px', marginTop: '2px' }}
                // style={{ margin: '2px' }}
                onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPuntoPartida = true)}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPuntoPartida && (
            <div class="modal">
              <BuscarDireccionGR sentido="partida" />
            </div>
          )}
          {/* ----------------------------------------------------- */}
          {/* PUNTO LLEGADA */}
          <div style={{ display: 'flex', margin: '2px 0px' }}>
            <div style={{ display: 'flex', width: '100%', gap: '4px' }}>
              <input
                id="in_PuntoLlegada_GR"
                type="text"
                disabled
                placeholder="PUNTO LLEGADA"
                value={definicion_CTX_GUIA_REMISION.puntoLlegada}
                onChange$={(e) => {
                  definicion_CTX_GUIA_REMISION.puntoLlegada = (e.target as HTMLInputElement).value;
                }}
                style={{ width: '100%' }}
              />
              <input
                id="in_UbigeoLlegada_GR"
                type="text"
                disabled
                value={definicion_CTX_GUIA_REMISION.ubigeoLlegada}
                onChange$={(e) => {
                  definicion_CTX_GUIA_REMISION.ubigeoLlegada = (e.target as HTMLInputElement).value;
                }}
                style={{ width: '60px' }}
              />
              <input
                id="in_BuscarPuntoLlegada_GR"
                type="image"
                src={images.searchPLUS}
                title="Buscar punto de llegada"
                height={16}
                width={16}
                // style={{ marginLeft: '2px', marginTop: '2px' }}
                // style={{ margin: '2px' }}
                onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPuntoLlegada = true)}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPuntoLlegada && (
            <div class="modal">
              <BuscarDireccionGR sentido="llegada" />
            </div>
          )}
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* MODALIDA - MOTIVO */}
        <div>
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="select_ModalidadTraslado_GR"
                // value={6}
                value={definicion_CTX_GUIA_REMISION.modalidadTraslado}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.idModalidadTraslado = elOption.id;
                  definicion_CTX_GUIA_REMISION.modalidadTraslado = (e.target as HTMLSelectElement).value;
                  console.log('modalida', definicion_CTX_GUIA_REMISION.idModalidadTraslado, definicion_CTX_GUIA_REMISION.modalidadTraslado);
                }}
              >
                <option value="">-- Seleccionar modalidad traslado --</option>
                <option id="01" value="TRANSPORTE PÚBLICO" selected={definicion_CTX_GUIA_REMISION.modalidadTraslado === 'TRANSPORTE PÚBLICO'}>
                  TRANSPORTE PÚBLICO
                </option>
                <option id="02" value="TRANSPORTE PRIVADO" selected={definicion_CTX_GUIA_REMISION.modalidadTraslado === 'TRANSPORTE PRIVADO'}>
                  TRANSPORTE PRIVADO
                </option>
              </select>
            </div>
          </div>
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="select_MotivoTraslado_GR"
                // value={6}
                value={definicion_CTX_GUIA_REMISION.motivoTraslado}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.idMotivoTraslado = elOption.id;
                  definicion_CTX_GUIA_REMISION.motivoTraslado = (e.target as HTMLSelectElement).value;
                }}
              >
                <option>-- Seleccionar motivo traslado --</option>
                <option id="01" value="VENTA" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'VENTA'}>
                  VENTA
                </option>
                <option id="02" value="COMPRA" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'COMPRA'}>
                  COMPRA
                </option>
                <option id="03" value="VENTA CON ENTREGA A TERCEROS" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'VENTA CON ENTREGA A TERCEROS'}>
                  VENTA CON ENTREGA A TERCEROS
                </option>
                <option
                  id="04"
                  value="TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA'}
                >
                  TRASLADO ENTRE ESTABLECIMIENTOS DE LA MISMA EMPRESA
                </option>
                <option id="05" value="CONSIGNACIÓN" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'CONSIGNACIÓN'}>
                  CONSIGNACIÓN
                </option>
                <option id="06" value="DEVOLUCIÓN" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'DEVOLUCIÓN'}>
                  DEVOLUCIÓN
                </option>
                <option
                  id="07"
                  value="RECOJO DE BIENES TRANSFORMADOS"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'RECOJO DE BIENES TRANSFORMADOS'}
                >
                  RECOJO DE BIENES TRANSFORMADOS
                </option>
                <option id="08" value="IMPORTACIÓN" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'IMPORTACIÓN'}>
                  IMPORTACIÓN
                </option>
                <option id="09" value="EXPORTACIÓN" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'EXPORTACIÓN'}>
                  EXPORTACIÓN
                </option>
                <option id="13" value="OTROS" selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'OTROS'}>
                  OTROS
                </option>
                <option
                  id="14"
                  value="VENTA SUJETA A CONFIRMACIÓN DEL COMPRADOR   "
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'VENTA SUJETA A CONFIRMACIÓN DEL COMPRADOR   '}
                >
                  VENTA SUJETA A CONFIRMACIÓN DEL COMPRADOR
                </option>
                <option
                  id="17"
                  value="TRASLADO DE BIENES PARA TRANSFORMACIÓN"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'TRASLADO DE BIENES PARA TRANSFORMACIÓN'}
                >
                  TRASLADO DE BIENES PARA TRANSFORMACIÓN
                </option>
                <option
                  id="18"
                  value="TRASLADO EMISOR ITINERANTE CP"
                  selected={definicion_CTX_GUIA_REMISION.motivoTraslado === 'TRASLADO EMISOR ITINERANTE CP'}
                >
                  TRASLADO EMISOR ITINERANTE CP
                </option>
              </select>
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------style={{ marginRight: '8px' }}------------- */}
        {/* GENERALES DEL REMITENTE */}
        <div>
          {/* tipo de documento identidad*/}
          <div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <label>REMITENTE</label>
              <select
                id="select_TipoDocumentoLiteral_REMITENTE"
                disabled
                style={{ width: '100%' }}
                // value={6}
                value={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadRemitente = elOption.id;
                  definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="1" value="DNI" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente === 'DNI'}>
                  DNI
                </option>
                <option id="6" value="RUC" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente === 'RUC'}>
                  RUC
                </option>
                <option id="4" value="C.EXT" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadRemitente === 'C.EXT'}>
                  C.EXT
                </option>
              </select>
              <input
                id="in_BuscarRemitente_GR"
                type="image"
                src={images.searchPLUS}
                title="Buscar datos de identidad de remitente GR"
                height={16}
                width={16}
                // style={{ marginLeft: '2px', marginTop: '2px' }}
                // style={{ margin: '2px' }}
                onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaRemitente = true)}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaRemitente && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={false} seleccionar="remitente" contexto="new_edit_guiaRemision" rol="remitente" />
            </div>
          )}
          {/* numero identidad*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_NumeroDocumentoIdentidad_REMITENTE"
                type="number"
                placeholder="Número Identidad Remitente"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.numeroIdentidadRemitente}
                onChange$={(e) => (definicion_CTX_GUIA_REMISION.numeroIdentidadRemitente = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
          {/* Razon Social / Nombre */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_Nombre_REMITENTE"
                type="text"
                placeholder="Razón social / Nombre Remitente"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.razonSocialNombreRemitente}
              />
            </div>
          </div>
          <br />
        </div>
        {/* --------------------------------------style={{ marginRight: '8px' }}--------------- */}
        {/* GENERALES DEL DESTINATARIO */}
        <div>
          {/* tipo de documento identidad*/}
          <div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <label>DESTINATARIO</label>
              <select
                id="select_TipoDocumentoLiteral_DESTINATARIO"
                disabled
                style={{ width: '100%' }}
                // value={6}
                value={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadDestinatario = elOption.id;
                  definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="1" value="DNI" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario === 'DNI'}>
                  DNI
                </option>
                <option id="6" value="RUC" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario === 'RUC'}>
                  RUC
                </option>
                <option id="4" value="C.EXT" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadDestinatario === 'C.EXT'}>
                  C.EXT
                </option>
              </select>
              <input
                id="in_BuscarDestinatario_GR"
                type="image"
                src={images.searchPLUS}
                title="Buscar datos de identidad"
                height={16}
                width={16}
                // style={{ marginLeft: '2px', marginTop: '2px' }}
                // style={{ margin: '2px' }}
                onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaDestinatario = true)}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaDestinatario && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={false} seleccionar="destinatario" contexto="new_edit_guiaRemision" rol="destinatario" />
            </div>
          )}
          {/* numero identidad*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_NumeroDocumentoIdentidad_DESTINATARIO"
                type="number"
                placeholder="Número Identidad Destinatario"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.numeroIdentidadDestinatario}
                onChange$={(e) => (definicion_CTX_GUIA_REMISION.numeroIdentidadDestinatario = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
          {/* Razon Social / Nombre */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_Nombre_DESTINATARIO"
                type="text"
                placeholder="Razón social / Nombre Destinatario"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.razonSocialNombreDestinatario}
              />
            </div>
          </div>
          <br />
        </div>
        {/* -------------------------------------------style={{ marginRight: '8px' }}---------- */}
        {/* GENERALES DEL TRANSPORTISTA */}
        <div>
          {/* tipo de documento identidad*/}
          <div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <label>TRANSPORTISTA</label>
              <select
                id="select_TipoDocumentoLiteral_TRANSPORTISTA"
                disabled
                style={{ width: '100%' }}
                // value={6}
                value={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  definicion_CTX_GUIA_REMISION.codigoTipoDocumentoIdentidadTransportista = elOption.id;
                  definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="1" value="DNI" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista === 'DNI'}>
                  DNI
                </option>
                <option id="6" value="RUC" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista === 'RUC'}>
                  RUC
                </option>
                <option id="4" value="C.EXT" selected={definicion_CTX_GUIA_REMISION.tipoDocumentoIdentidadTransportista === 'C.EXT'}>
                  C.EXT
                </option>
              </select>
              <input
                id="in_BuscarTransportista_GR"
                type="image"
                src={images.searchPLUS}
                title="Buscar datos de identidad"
                height={16}
                width={16}
                // style={{ marginLeft: '2px', marginTop: '2px' }}
                // style={{ margin: '2px' }}
                onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaTransportista = true)}
              />
            </div>
          </div>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarPersonaTransportista && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={false} seleccionar="transportista" contexto="new_edit_guiaRemision" rol="transportista" />
            </div>
          )}
          {/* numero identidad*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_NumeroDocumentoIdentidad_TRANSPORTISTA"
                type="number"
                placeholder="Número Identidad Transportista"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.numeroIdentidadTransportista}
                onChange$={(e) => (definicion_CTX_GUIA_REMISION.numeroIdentidadTransportista = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
          {/* Razon Social / Nombre */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_Nombre_TRANSPORTISTA"
                type="text"
                placeholder="Razón social / Nombre Transportista"
                disabled
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.razonSocialNombreTransportista}
              />
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* CHOFERES */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              <ElButton
                id="btn_Add_Chofer_GR"
                class="btn"
                name="Add chofer"
                title="Add chofer"
                onClick={$(() => {
                  elChofSelecionado.value = [];
                  definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarChofer = true;
                })}
              />
            </div>
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarChofer && (
              <div class="modal">
                <BuscarChofer contexto="new_edit_guiaRemision" />
                {/* <NewEditChofer choferSeleccionado={elChofSelecionado.value} /> */}
              </div>
            )}
            {/* TABLA CHOFERES   */}
            {definicion_CTX_GUIA_REMISION.choferes.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    {/* <th>idAuxiliar</th> */}
                    <th>Ítem</th>
                    <th>Doc</th>
                    <th>Número</th>
                    <th>Nombre</th>
                    <th>Licencia</th>
                    <th>Tipo</th>
                    <th>Acc</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_GUIA_REMISION.choferes.map((iTChof: any, index: number) => {
                    const indexItemChof = index + 1;

                    return (
                      <tr key={iTChof.idAuxiliar}>
                        {/* <td data-label="idAuxiliar">{iTChof.idAuxiliar}</td> */}
                        <td data-label="Ítem">{cerosALaIzquierda(indexItemChof, 3)}</td>
                        <td data-label="Doc">{iTChof.tipoDocumentoIdentidad}</td>
                        <td data-label="Número">{iTChof.numeroIdentidad}</td>
                        <td data-label="Nombre">{iTChof.razonSocialNombre}</td>
                        <td data-label="Licencia">{iTChof.licencia}</td>
                        <td data-label="Tipo" class="acciones">
                          <input
                            type="button"
                            value={iTChof.tipo === true ? 'PRIMARIO' : 'SECUNARIO'}
                            onClick$={() => {
                              iTChof.tipo = !iTChof.tipo;
                            }}
                          />
                        </td>
                        <td data-label="Acc" class="accionesLeft">
                          {/* <input
                            type="image"
                            src={images.edit}
                            title="Editar ítem"
                            alt="icono de editar"
                            disabled
                            height={14}
                            width={14}
                            style={{ marginRight: '4px' }}
                            // onClick$={() => {
                            //   elChofSelecionado.value = iTChof;
                            //   definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelChofer = true;
                            // }}
                          /> */}
                          <input
                            type="image"
                            src={images.trash}
                            title="Eliminar ítem"
                            alt="icono de eliminar"
                            height={14}
                            width={14}
                            onClick$={() => {
                              // borrarChofer = iTChof;
                              borrarChofer.idAuxiliar = iTChof.idAuxiliar;
                              borrarChofer.numeroIdentidad = iTChof.numeroIdentidad;
                              borrarChofer.razonSocialNombre = iTChof.razonSocialNombre;
                              borrarChofer.licencia = iTChof.licencia;
                              // borrarChofer.serie = iTChof.serie;
                              // borrarChofer.numero = iTChof.numero;
                              definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteChofer = true;
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen ningún chofer</i>
            )}
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteChofer && (
              <div class="modal">
                <BorrarChofer borrarChofer={borrarChofer} />
              </div>
            )}
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* UNIDADES DE TRANSPORTE */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              <ElButton
                id="btn_Add_UnidadTransporte_GR"
                class="btn"
                name="Add unidad de transporte"
                title="Add unidad de transporte"
                onClick={$(() => {
                  laUniSelecionada.value = [];
                  definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarUnidadTransporte = true;
                })}
              />
            </div>
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelBuscarUnidadTransporte && (
              <div class="modal">
                <BuscarUnidadTransporte contexto="new_edit_guiaRemision" />
              </div>
            )}
            {/* TABLA UNIDADES DE TRANSPORTE   */}
            {definicion_CTX_GUIA_REMISION.unidadesTransporte.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Placa</th>
                    <th>Marca</th>
                    <th>Modelo</th>
                    <th>Tarj.Circul./Certif.Habilit.</th>
                    <th>Tipo</th>
                    <th>Acc</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_GUIA_REMISION.unidadesTransporte.map((iTUnidadTra: any, index: number) => {
                    const indexItemUT = index + 1;

                    return (
                      <tr key={iTUnidadTra.idAuxiliar}>
                        <td data-label="Ítem">{indexItemUT}</td>
                        <td data-label="Placa">{iTUnidadTra.placa}</td>
                        <td data-label="Marca">{iTUnidadTra.vehiculoMarca}</td>
                        <td data-label="Modelo">{iTUnidadTra.vehiculoModelo}</td>
                        <td data-label="Tarj.Circul./Certif.Habilit.">{iTUnidadTra.tarjetaCirculacionCertificadoHabilitacion}</td>
                        <td data-label="Tipo" class="acciones">
                          <input
                            type="button"
                            value={iTUnidadTra.tipo === true ? 'PRIMARIO' : 'SECUNARIO'}
                            onClick$={() => {
                              iTUnidadTra.tipo = !iTUnidadTra.tipo;
                            }}
                          />
                        </td>
                        <td data-label="Acc" class="accionesLeft">
                          {/* <input
                            type="image"
                            src={images.edit}
                            title="Editar ítem"
                            alt="icono de editar"
                            height={14}
                            width={14}
                            style={{ marginRight: '4px' }}
                            onClick$={() => {
                              laUniSelecionada.value = iTUnidadTra;
                              definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelEditarUnidadTransporte = true;
                            }}
                          /> */}
                          <input
                            type="image"
                            src={images.trash}
                            title="Eliminar ítem"
                            alt="icono de eliminar"
                            height={14}
                            width={14}
                            onClick$={() => {
                              borrarUnidadTransporte.idAuxiliar = iTUnidadTra.idAuxiliar;
                              borrarUnidadTransporte.placa = iTUnidadTra.placa;
                              borrarUnidadTransporte.vehiculoMarca = iTUnidadTra.vehiculoMarca;
                              borrarUnidadTransporte.vehiculoModelo = iTUnidadTra.vehiculoModelo;
                              definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteUnidadTransporte = true;
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen ninguna unidad de transporte</i>
            )}
            {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteUnidadTransporte && (
              <div class="modal">
                <BorrarUnidadTransporte borrarUnidadTransporte={borrarUnidadTransporte} />
              </div>
            )}
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* BULTOS / PALLETS / PESO BRUTO TOTAL*/}
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            <div>
              <input
                id="input_BultosPallets_GR"
                type="number"
                placeholder="Número bultos o pallets"
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.numeroBultosPallets}
                onChange$={(e) => (definicion_CTX_GUIA_REMISION.numeroBultosPallets = (e.target as HTMLInputElement).value)}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('input_PesoBrutoTotal_GR') as HTMLInputElement).focus();
                  }
                }}
              />
            </div>
            <div>
              <input
                id="input_PesoBrutoTotal_GR"
                type="number"
                placeholder="Peso bruto total"
                style={{ width: '100%' }}
                value={definicion_CTX_GUIA_REMISION.pesoBrutoTotal}
                onChange$={(e) => (definicion_CTX_GUIA_REMISION.pesoBrutoTotal = (e.target as HTMLInputElement).value)}
              />
              <label>KGM</label>
            </div>
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* OBSERVACION */}
        <div>
          {/* CHECKBOX OBSERVACION */}
          <div class="form-control">
            <div class="form-control">
              <input
                id="in_verificarObservacionGR"
                // style={{ width: '100%' }}
                type="checkbox"
                placeholder="verificarObservacionGR"
                checked={definicion_CTX_GUIA_REMISION.verificarObservacionGR}
                // value="sujetoAPercepcion"
                name="verificarObservacionGR"
                onChange$={(e) => {
                  definicion_CTX_GUIA_REMISION.verificarObservacionGR = (e.target as HTMLInputElement).checked;
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('in_Observacion')?.focus();
                  }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <label for="in_verificarObservacionGR" style={{ textAlign: 'justify' }}>
                Verificar Observación de la G.R.
              </label>
            </div>
          </div>
          {/* OBSERVACION */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                type="text"
                id="in_Observacion"
                value={definicion_CTX_GUIA_REMISION.observacion}
                style={{ width: '100%', background: 'yellow' }}
                placeholder="Observación"
                onChange$={(e) => {
                  definicion_CTX_GUIA_REMISION.observacion = (e.target as HTMLInputElement).value.toUpperCase().trim();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('btn_RegistrarBien_GR')?.focus();
                  }
                }}
              />
            </div>
          </div>
          <br />
        </div>
        {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelVerificarObservacion && (
          <div class="modal">
            <VerificarObservación />
          </div>
        )}
        {/* ----------------------------------------------------- */}
        {/* BOTONES */}
        <div>
          <button
            id="btn_RegistrarBien_GR"
            onClick$={() => (definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelRegistrarBien = true)}
            style={{ cursor: 'pointer' }}
          >
            Registro de bienes
          </button>
          {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelRegistrarBien && (
            <div class="modal">
              <RegistroBienesGR bienSeleccio={[]} />
            </div>
          )}
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* ----------------------------------------------------- */}
        {/* ----------------------------------------------------- */}
        {/*  tabla ITEMS - GUIA REMISION */}
        {
          <div>
            <div class="form-control">
              {definicion_CTX_GUIA_REMISION.itemsGuiaRemision.length > 0 ? (
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      {/* <th>idAuxiliar</th> */}
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Uni</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {definicion_CTX_GUIA_REMISION.itemsGuiaRemision.map((iTGR: any, index: number) => {
                      const indexItemGR = index + 1;

                      return (
                        <tr key={iTGR.idAuxiliar}>
                          <td data-label="Ítem" key={iTGR.idAuxiliar} class="comoCadena">{`${cerosALaIzquierda(indexItemGR, 3)}`}</td>
                          {/* <td data-label="idAuxiliar" class="comoCadena">
                            {iTGR.idAuxiliar}
                          </td> */}
                          <td data-label="Descripción" class="comoCadena">
                            {iTGR.descripcion}
                          </td>
                          <td data-label="Cantidad" class="comoNumero">
                            <input
                              type="number"
                              style={{ width: '60px', textAlign: 'end' }}
                              value={iTGR.cantidad.$numberDecimal ? iTGR.cantidad.$numberDecimal : iTGR.cantidad}
                              onChange$={(e) => {
                                // const iv = itemsVentaK[index];
                                iTGR.cantidad = parseFloat((e.target as HTMLInputElement).value);
                              }}
                            />
                          </td>
                          <td data-label="Uni" class="acciones">
                            {iTGR.unidad}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.trash}
                              title="Eliminar ítem"
                              height={14}
                              width={14}
                              style={{ margin: '2px' }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                borrarItemGuiaRemision.idAuxiliar = iTGR.idAuxiliar;
                                borrarItemGuiaRemision.cantidad = iTGR.cantidad;
                                borrarItemGuiaRemision.unidad = iTGR.unidad;
                                borrarItemGuiaRemision.descripcion = iTGR.descripcion;
                                definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteItemGuiaRemision = true;
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <br />
                </table>
              ) : (
                <>
                  <i style={{ fontSize: '0.8rem' }}>No existen bienes para guía de remisión</i>
                  <br />
                </>
              )}
              {definicion_CTX_NEW_EDIT_GUIA_REMISION.mostrarPanelDeleteItemGuiaRemision && (
                <div class="modal">
                  <BorrarItemGuiaRemision borrarItemGuiaRemision={borrarItemGuiaRemision} />
                </div>
              )}
            </div>
            <br />
          </div>
        }
        <input type="button" value="Grabar Guía de Remisión" class="btn-centro" onClick$={() => registrarGuiaRemision()} />
        {/* *************** */}
      </div>
    </div>
  );
});
