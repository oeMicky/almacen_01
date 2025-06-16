import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import style from '../tabla/tabla.css?inline';
import { parametrosGlobales } from '~/routes/login';
import type { IPersona } from '~/interfaces/iPersona';
import { CTX_INDEX_OUT_ALMACEN } from '~/routes/(inventario)/outAlmacen';
import {
  cerosALaIzquierda,
  diaDeLaSemana,
  elIdAuxiliar,
  // elIdAuxiliar,
  formatear_6Decimales,
  // formatoDDMMYYYY_PEN,
  hoy,
  menosXdiasHoy,
  // redondeo2Decimales,
  // ultimoDiaDelPeriodoX,
} from '~/functions/comunes';
import ElSelect from '../system/elSelect';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
import ElButton from '../system/elButton';
// import NewEditDocumento from '../miscelanea/documento/newEditDocumento';
import type { IEgresoDeAlmacen } from '~/interfaces/iOutAlmacen';
import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
import BorrarItemMercaderiaOUT from './borrarItemMercaderiaOUT';
import BorrarDocumentoOUT from './borrarDocumentoOUT';
// import { getSeriesDeNotaSalidaDeLaSucursal, inEgresoDeAlmacen, loadMotivosEgresoDeAlmacen } from '~/apis/egresosDeAlmacen.api';
import { getSeriesDeNotaSalidaDeLaSucursal, loadMotivosEgresoDeAlmacen } from '~/apis/egresosDeAlmacen.api';
import BuscarOrdenServicioAperturado from '../miscelanea/ordenServicioAperturado/buscarOrdenServicioAperturado';
import BuscarOrdenProduccionAperturado from '../miscelanea/ordenProduccionAperturado/buscarOrdenProduccionAperturado';
import ListaFavoritosAlmacen from '../miscelanea/favoritos/listaFavoritosAlmacen';
import { loadTiposComprobantePago } from '~/apis/sunat.api';
import { getPersonaPorDniRuc } from '~/apis/persona.api';
import { verOtrosAlmacenes } from '~/apis/usuario.api';
import ListaOtrosAlmacenesOUT from './listaOtrosAlmacenesOUT';
// import { IDocumento } from '~/interfaces/iDocumento';

export const CTX_NEW_OUT_ALMACEN = createContextId<any>('new_out_almacen');

export const CTX_OUT_ALMACEN = createContextId<IEgresoDeAlmacen>('out_almacen');

export const CTX_DESTINATARIO_OUT_ALMACEN = createContextId<IPersona>('destinatario_out_almacen');

export default component$((props: { addPeriodo: any; outSelecci: any; igv: number }) => {
  useStyles$(style);

  //#region DEFINICION CTX_NEW_OUT_ALMACEN
  const definicion_CTX_NEW_OUT_ALMACEN = useStore({
    rol_Persona: '',
    selecciono_Persona: false,

    mensajeErrorCliente: '',
    mensajeErrorDestinatario: '',

    mostrarSelectNotaSalida: false,
    idSerieNotaSalida_porDefault: '',
    serieNotaSalida_porDefault: '',

    otrosAlmacenes: [],
    mostrarPanelListaOtrosAlmacenesOUT: false,
    idSucursalDestino: '',
    sucursalDestino: '',
    idSerieNotaIngresoDestino: '',
    serieNotaIngresoDestino: '',
    idMotivoIngresoDestino: '',
    motivoIngresoDestino: '',

    mostrarPanelBuscarPersona: false,
    mostrarPanelAdjuntarDocumento: false,
    mostrarPanelBuscarMercaderiaOUT: false,
    mostrarPanelDeleteItemMercaderiaOUT: false,

    mostrarPanelListaFavoritosAlmacen: false,

    mostrarPanelBuscarOrdenProduccionAperturado: false,
    mostrarPanelBuscarOrdenServicioAperturado: false,
    mostrarPanelDespachoRequisiciones: false,

    mostrarPanelBuscarPersona_Venta: false,
    mostrarPanelVentasCliente: false,
    mostrarPanelDespachoVenta: false,

    borrarIdAuxiliarDoc: 0,
    borrarIdAuxiliar: 0,
    mostrarPanelDeleteDocumentoOUT: false,

    mostrarPanelVentasClienteVentasVarias: false,
  });
  useContextProvider(CTX_NEW_OUT_ALMACEN, definicion_CTX_NEW_OUT_ALMACEN);
  //#endregion DEFINICION CTX_NEW_OUT_ALMACEN

  //#region DEFINICION CTX_OUT_ALMACEN
  const definicion_CTX_OUT_ALMACEN = useStore<IEgresoDeAlmacen>(
    {
      _id: props.outSelecci._id ? props.outSelecci._id : '',

      idGrupoEmpresarial: props.outSelecci.idGrupoEmpresarial ? props.outSelecci.idGrupoEmpresarial : parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.outSelecci.idEmpresa ? props.outSelecci.idEmpresa : parametrosGlobales.idEmpresa,
      idSucursal: props.outSelecci.idSucursal ? props.outSelecci.idSucursal : parametrosGlobales.idSucursal,
      idAlmacen: props.outSelecci.idAlmacen ? props.outSelecci.idAlmacen : parametrosGlobales.idAlmacen,

      idPeriodo: props.outSelecci.idPeriodo ? props.outSelecci.idPeriodo : props.addPeriodo.idPeriodo,
      periodo: props.outSelecci.periodo ? props.outSelecci.periodo : props.addPeriodo.periodo,

      ruc: props.outSelecci.ruc ? props.outSelecci.ruc : parametrosGlobales.RUC,
      empresa: props.outSelecci.empresa ? props.outSelecci.empresa : parametrosGlobales.RazonSocial,
      direccion: props.outSelecci.direccion ? props.outSelecci.direccion : parametrosGlobales.Direccion,

      idMotivoEgresoAlmacen: props.outSelecci.idMotivoEgresoAlmacen ? props.outSelecci.idMotivoEgresoAlmacen : '',
      motivoEgresoAlmacen: props.outSelecci.motivoEgresoAlmacen ? props.outSelecci.motivoEgresoAlmacen : '',
      idDocumento: props.outSelecci.idDocumento ? props.outSelecci.idDocumento : '',

      idSucursalDestino: props.outSelecci.idSucursalDestino ? props.outSelecci.idSucursalDestino : '',
      sucursalDestino: props.outSelecci.sucursalDestino ? props.outSelecci.sucursalDestino : '',
      idSerieNotaIngresoDestino: props.outSelecci.idSerieNotaIngresoDestino ? props.outSelecci.idSerieNotaIngresoDestino : '',
      serieNotaIngresoDestino: props.outSelecci.serieNotaIngresoDestino ? props.outSelecci.serieNotaIngresoDestino : '',
      idMotivoIngresoDestino: props.outSelecci.idMotivoIngresoDestino ? props.outSelecci.idMotivoIngresoDestino : '',
      motivoIngresoDestino: props.outSelecci.motivoIngresoDestino ? props.outSelecci.motivoIngresoDestino : '',

      idSerieNotaSalida: props.outSelecci.idSerieNotaSalida ? props.outSelecci.idSerieNotaSalida : parametrosGlobales.idSerieNotaSalida,
      serie: props.outSelecci.serie ? props.outSelecci.serie : parametrosGlobales.serieNotaSalida,

      observacion: props.outSelecci.observacion ? props.outSelecci.observacion : '',

      // serie: props.inSelecci.serie ? props.inSelecci.serie : '',
      // numero: props.inSelecci.numero ? props.inSelecci.numero : 0,
      FISMA: props.outSelecci.FISMA ? props.outSelecci.FISMA.substring(0, 10) : hoy(),
      igv: props.outSelecci.igv ? props.outSelecci.igv.$numberDecimal : props.igv,

      // correlativo: props.inSelecci.correlativo ? props.inSelecci.correlativo : 0,

      //   estado: props.inSelecci.estado ? props.inSelecci.estado : '',
      //   tipo: props.inSelecci.tipo ? props.inSelecci.tipo : '',
      //   idTecnico: props.inSelecci.idTecnico ? props.inSelecci.idTecnico : '',
      //   razonSocialNombreTecnico: props.inSelecci.razonSocialNombreTecnico ? props.inSelecci._id : '',

      idDestinatario: props.outSelecci.idDestinatario ? props.outSelecci.idDestinatario : '',
      codigoTipoDocumentoIdentidad: props.outSelecci.codigoTipoDocumentoIdentidad ? props.outSelecci.codigoTipoDocumentoIdentidad : '6',
      tipoDocumentoIdentidad: props.outSelecci.tipoDocumentoIdentidad ? props.outSelecci.tipoDocumentoIdentidad : 'RUC',
      numeroIdentidad: props.outSelecci.numeroIdentidad ? props.outSelecci.numeroIdentidad : '',
      razonSocialNombre: props.outSelecci.razonSocialNombre ? props.outSelecci.razonSocialNombre : '',

      //   idVehiculo: props.inSelecci.idVehiculo ? props.inSelecci.idVehiculo : '',
      //   placa: props.inSelecci.placa ? props.inSelecci.placa : '',
      //   idVehiculoMarca: props.inSelecci.idVehiculoMarca ? props.inSelecci.idVehiculoMarca : '',
      //   vehiculoMarca: props.inSelecci.vehiculoMarca ? props.inSelecci.vehiculoMarca : '',
      //   idVehiculoModelo: props.inSelecci.idVehiculoModelo ? props.inSelecci.idVehiculoModelo : '',
      //   vehiculoModelo: props.inSelecci.vehiculoModelo ? props.inSelecci.vehiculoModelo : '',
      //   vin: props.inSelecci.vin ? props.inSelecci.vin : '',

      documentosAdjuntos: props.outSelecci.documentosAdjuntos ? props.outSelecci.documentosAdjuntos : [],
      itemsMercaderias: props.outSelecci.itemsMercaderias ? props.outSelecci.itemsMercaderias : [],

      //   montoSubTotalPEN: props.inSelecci.montoSubTotalPEN ? props.inSelecci.montoSubTotalPEN : 0,
      //   montoIGVPEN: props.inSelecci.montoIGVPEN ? props.inSelecci.montoIGVPEN : 0,
      //   montoTotalPEN: props.inSelecci.montoTotalPEN ? props.inSelecci.montoTotalPEN : 0,
      usuarioCrea: props.outSelecci.usuarioCrea ? props.outSelecci.usuarioCrea : '',
      creado: props.outSelecci.createdAt ? props.outSelecci.createdAt : '',
    },
    { deep: true }
  );
  useContextProvider(CTX_OUT_ALMACEN, definicion_CTX_OUT_ALMACEN);
  //#endregion DEFINICION CTX_OUT_ALMACEN

  //#region DEFINICION CTX_DESTINATARIO_OUT_ALMACEN
  const defini_CTX_DESTINATARIO_OUT_ALMACEN = useStore<IPersona>({
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
  useContextProvider(CTX_DESTINATARIO_OUT_ALMACEN, defini_CTX_DESTINATARIO_OUT_ALMACEN);
  //#endregion DEFINICION CTX_DESTINATARIO_OUT_ALMACEN

  //#region CONTEXTO
  const ctx_index_out_almacen = useContext(CTX_INDEX_OUT_ALMACEN);
  //#endregion CONTEXTO

  //#region INICALIZACION
  const ini = useSignal(0);
  const LosTCPcargados = useSignal([]);

  const documento = useStore({
    idAuxiliar: elIdAuxiliar(),
    codigoTCP: '',
    descripcionTCP: '',
    fecha: hoy(),
    serie: '',
    numero: '',

    lote: '',
  });
  // let suma_SubPEN = 0;
  // let suma_IGVPEN = 0;
  // let suma_TotPEN = 0;
  const seriesNotaSalida: any = useSignal([]);
  const elDocSelecionado: any = useSignal([]);
  const losMotivosCargados = useSignal([]);

  const borrarDocumento = useStore({
    idAuxiliar: '',
    codigoTCP: '',
    descripcionTCP: '',
    fecha: '',
    serie: '',
    numero: '',
  });

  const borrarItemMerca = useStore({
    idAuxiliar: '',
    item: '',
    codigo: '',
    descripcion: '',
  });

  // const
  //#endregion INICALIZACION

  //#region CARGAR LOS TCP
  const cargarLosTCP = $(async () => {
    const losTCP = await loadTiposComprobantePago();
    // console.log('losTCP', losTCP);
    LosTCPcargados.value = losTCP.data;
    //console.log(' LosTCPcargados.value', LosTCPcargados.value);
  });

  // useTask$(({ track }) => {
  //   track(() => ini.value);
  //   cargarLosTCP();
  // });
  //#endregion CARGAR LOS TCP

  //#region CARGAR SERIES NOTA DE SALIDA - DE LA SUCURSAL
  const cargarSeriesNotaSalida_DelaSucursal = $(async () => {
    const tre = await getSeriesDeNotaSalidaDeLaSucursal({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idSucursal: parametrosGlobales.idSucursal,
    });
    console.log('👨‍💻👨‍💻👨‍💻👨‍💻👨‍💻👨‍💻 cargarSeriesNotaSalida_DelaSucursal', tre.data);
    // definicion_CTX_SUCURSAL.seriesNotaSalida = tre.data;
    seriesNotaSalida.value = tre.data;
    if (seriesNotaSalida.value.length === 1) {
      definicion_CTX_OUT_ALMACEN.idSerieNotaSalida = seriesNotaSalida.value[0].idSerieNotaSalida;
      definicion_CTX_OUT_ALMACEN.serie = seriesNotaSalida.value[0].serie;
      // definicion_CTX_NEW_OUT_ALMACEN.idSerieNotaSalida_porDefault = seriesNotaSalida.value[0]._id;
      // definicion_CTX_NEW_OUT_ALMACEN.serieNotaSalida_porDefault = seriesNotaSalida.value[0].serie;
    }
  });
  //#endregion CARGAR SERIES NOTA DE SALIDA - DE LA SUCURSAL

  //#region CARGAR MOTIVOS DE EGRESO
  const cargarMotivosEgreso = $(async () => {
    const losMotivos = await loadMotivosEgresoDeAlmacen({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });
    // //console.log('losMotivos', losMotivos);
    losMotivosCargados.value = losMotivos.data;
    // //console.log(' losMotivosCargados.value', losMotivosCargados.value);
  });

  useTask$(({ track }) => {
    track(() => ini.value);
    cargarMotivosEgreso();
    cargarLosTCP();
    if (ini.value === 0) {
      setTimeout(() => {
        document.getElementById('in_FISMA')?.focus();
      }, 100);
      ini.value++;
    }
  });
  //#endregion CARGAR MOTIVOS DE EGRESO

  //#region ACTUALIZAR ALMACEN DESTINO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino);

    if (definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino !== '') {
      //console.log('actualiza el almacen', definicion_CTX_OUT_ALMACEN.idAlmacen);
      definicion_CTX_OUT_ALMACEN.idSucursalDestino = definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino;
      definicion_CTX_OUT_ALMACEN.sucursalDestino = definicion_CTX_NEW_OUT_ALMACEN.sucursalDestino;
      definicion_CTX_OUT_ALMACEN.idSerieNotaIngresoDestino = definicion_CTX_NEW_OUT_ALMACEN.idSerieNotaIngresoDestino;
      definicion_CTX_OUT_ALMACEN.serieNotaIngresoDestino = definicion_CTX_NEW_OUT_ALMACEN.serieNotaIngresoDestino;
      definicion_CTX_OUT_ALMACEN.idMotivoIngresoDestino = definicion_CTX_NEW_OUT_ALMACEN.idMotivoIngresoDestino;
      definicion_CTX_OUT_ALMACEN.motivoIngresoDestino = definicion_CTX_NEW_OUT_ALMACEN.motivoIngresoDestino;
    } else {
      definicion_CTX_OUT_ALMACEN.idSucursalDestino = '';
      definicion_CTX_OUT_ALMACEN.sucursalDestino = '';
      definicion_CTX_OUT_ALMACEN.idSerieNotaIngresoDestino = '';
      definicion_CTX_OUT_ALMACEN.serieNotaIngresoDestino = '';
      definicion_CTX_OUT_ALMACEN.idMotivoIngresoDestino = '';
      definicion_CTX_OUT_ALMACEN.motivoIngresoDestino = '';
    }
  });
  //#endregion ACTUALIZAR ALMACEN DESTINO

  //#region DESTINATARIO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_OUT_ALMACEN.selecciono_Persona);
    if (definicion_CTX_NEW_OUT_ALMACEN.selecciono_Persona && definicion_CTX_NEW_OUT_ALMACEN.rol_Persona === 'destinatario') {
      // alert('evalua a la persona');
      definicion_CTX_OUT_ALMACEN.idDestinatario = defini_CTX_DESTINATARIO_OUT_ALMACEN._id;
      definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad = defini_CTX_DESTINATARIO_OUT_ALMACEN.codigoTipoDocumentoIdentidad;
      definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad = defini_CTX_DESTINATARIO_OUT_ALMACEN.tipoDocumentoIdentidad;
      definicion_CTX_OUT_ALMACEN.numeroIdentidad = defini_CTX_DESTINATARIO_OUT_ALMACEN.numeroIdentidad;
      definicion_CTX_OUT_ALMACEN.razonSocialNombre = defini_CTX_DESTINATARIO_OUT_ALMACEN.razonSocialNombre;

      definicion_CTX_NEW_OUT_ALMACEN.rol_Persona = '';
      definicion_CTX_NEW_OUT_ALMACEN.selecciono_Persona = false;
    }
  });
  //#endregion DESTINATARIO

  //#region ELIMINAR DOCUMENTO
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliarDoc);
    if (definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliarDoc > 0) {
      //console.log('borrando...', definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliarDoc);
      const newItems: any = definicion_CTX_OUT_ALMACEN.documentosAdjuntos.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliarDoc
      );
      definicion_CTX_OUT_ALMACEN.documentosAdjuntos = newItems;
      definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliarDoc = 0;
    }
  });
  //#endregion ELIMINAR DOCUMENTO

  //#region ELIMINAR ITEM MERCADERIA
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliar);
    if (definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliar > 0) {
      //console.log('borrando...', definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliar);
      const newItems: any = definicion_CTX_OUT_ALMACEN.itemsMercaderias.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliar
      );
      definicion_CTX_OUT_ALMACEN.itemsMercaderias = newItems;
      definicion_CTX_NEW_OUT_ALMACEN.borrarIdAuxiliar = 0;
    }
  });
  //#endregion ELIMINAR ITEM MERCADERIA

  //#region LIMPIAR SUCURSAL DESTINO
  const limpiarSucusalDestino = $(() => {
    definicion_CTX_OUT_ALMACEN.idSucursalDestino = '';
    definicion_CTX_OUT_ALMACEN.sucursalDestino = '';
    definicion_CTX_OUT_ALMACEN.idSerieNotaIngresoDestino = '';
    definicion_CTX_OUT_ALMACEN.serieNotaIngresoDestino = '';
    definicion_CTX_OUT_ALMACEN.idMotivoIngresoDestino = '';
    definicion_CTX_OUT_ALMACEN.motivoIngresoDestino = '';
  });
  //#endregion LIMPIAR SUCURSAL DESTINO

  //#region REGISTRAR_EGRESO parametrosGlobales.usuario
  const registrarEgreso = $(async () => {
    try {
      if (parametrosGlobales.usuario === '' || typeof parametrosGlobales.usuario === 'undefined') {
        alert('No se identificado adecuadamente el usuario, por favor verifique.');
        // document.getElementById('se_motivoIngreso')?.focus();
        return;
      }
      //periodo FISMA idMotivoEgresoAlmacen
      //console.log(' //periodo FISMA idMotivoEgresoAlmacen');
      if (definicion_CTX_OUT_ALMACEN.idAlmacen === '' || typeof definicion_CTX_OUT_ALMACEN.idAlmacen === 'undefined') {
        alert('No se identificado el almacén, por favor verifique.');
        // document.getElementById('se_motivoIngreso')?.focus();
        return;
      }
      if (definicion_CTX_OUT_ALMACEN.periodo.toString() === '' || typeof definicion_CTX_OUT_ALMACEN.periodo === 'undefined') {
        alert('Ingrese el periodo');
        document.getElementById('in_Periodo')?.focus();
        return;
      }
      if (definicion_CTX_OUT_ALMACEN.FISMA === '' || typeof definicion_CTX_OUT_ALMACEN.FISMA === 'undefined') {
        alert('Ingrese la fecha FISMA');
        document.getElementById('in_FISMA')?.focus();
        return;
      }
      if (definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen === '' || typeof definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen === 'undefined') {
        alert('Seleccione el motivo de egreso');
        document.getElementById('se_motivoIngreso')?.focus();
        return;
      }
      if (definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen === 'TRASLADO A SUCURSAL') {
        if (
          definicion_CTX_OUT_ALMACEN.idSucursalDestino === '' ||
          typeof definicion_CTX_OUT_ALMACEN.idSucursalDestino === 'undefined' ||
          definicion_CTX_OUT_ALMACEN.sucursalDestino === '' ||
          typeof definicion_CTX_OUT_ALMACEN.sucursalDestino === 'undefined'
        ) {
          alert('Seleccione la sucursal destino');
          document.getElementById('se_motivoIngreso')?.focus();
          return;
        }
      }
      //DESTINATARIO
      //console.log(
      //   ' //DESTINATARIO',
      //   definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad,
      //   definicion_CTX_OUT_ALMACEN.numeroIdentidad,
      //   definicion_CTX_OUT_ALMACEN.razonSocialNombre
      // );
      if (definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad === '' || typeof definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad === 'undefined') {
        alert('Identifique al destinatario');
        document.getElementById('img_buscarDESTINATARIO')?.focus();
        return;
      }
      if (definicion_CTX_OUT_ALMACEN.numeroIdentidad === '' || typeof definicion_CTX_OUT_ALMACEN.numeroIdentidad === 'undefined') {
        alert('Identifique al destinatario');
        document.getElementById('img_buscarDESTINATARIO')?.focus();
        return;
      }
      if (definicion_CTX_OUT_ALMACEN.razonSocialNombre === '' || typeof definicion_CTX_OUT_ALMACEN.razonSocialNombre === 'undefined') {
        alert('Identifique al destinatario');
        document.getElementById('img_buscarDESTINATARIO')?.focus();
        return;
      }
      // if (definicion_CTX_OUT_ALMACEN.elIgv.toString() === '') {
      //   alert('Identifique el igv');
      //   document.getElementById('in_IGV')?.focus();
      //   return;
      // }
      //DOCUMENTOS ADJUNTOS
      //console.log(' //documentosAdjuntos');
      if (
        definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen !== 'NOTA DE SALIDA' &&
        definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen !== 'TRASLADO' &&
        definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen !== 'TRASLADO A SUCURSAL'
      ) {
        // if (definicion_CTX_OUT_ALMACEN.documentosAdjuntos.length < 1) {
        //   alert('Agregue al menos un documento');
        //   document.getElementById('btn_Add_Documento')?.focus();
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

      //itemsMercaderias
      //console.log(' //itemsMercaderias');
      if (definicion_CTX_OUT_ALMACEN.itemsMercaderias.length < 1) {
        alert('Agregue al menos una mercadería');
        document.getElementById('btn_Add_Mercaderia')?.focus();
        return;
      }

      //VERIFICAR SI LOS DUPLICADOS AL AGRUPARSE TIENEN EL STOCK SUFICIENTE
      //PARA SER ATENDIDOS DESDE EL ALMACEN
      // let repetidos: any = [];
      // let temporal: any = [];
      const nroElementos = definicion_CTX_OUT_ALMACEN.itemsMercaderias.length;
      //forEACH
      definicion_CTX_OUT_ALMACEN.itemsMercaderias.forEach((pivote: any, index: number) => {
        if (nroElementos === index + 1) {
          console.log('final', nroElementos, index);
          if (nroElementos === 1) {
            if (pivote.stockEquivalente < pivote.cantidadSacadaEquivalencia) {
              alert('CANTIDAD EXCESIVA DE ::| ' + pivote.idMercaderia + ' |::| ' + pivote.descripcion.substring(0, 34).trim() + ' |::| ' + pivote.ubigeo);
              throw new Error(
                'CANTIDAD EXCESIVA DE ::| ' + pivote.idMercaderia + ' |::| ' + pivote.descripcion.substring(0, 34).trim() + ' |::| ' + pivote.ubigeo
              );
            }
          }
        } else {
          console.log('...', nroElementos, index);
          let stockPIVOTE = pivote.stockEquivalente;
          let cantidadSacadaEquivalenciaACUMULADA = pivote.cantidadSacadaEquivalencia;

          // const  arraySECUNDARIO  = definicion_CTX_NOTA_VENTA.itemsNotaVenta.slice(index+1,nroElementos-1);
          const arraySECUNDARIO = definicion_CTX_OUT_ALMACEN.itemsMercaderias.slice(index + 1, nroElementos);
          console.log('arraySECUNDARIO', arraySECUNDARIO);
          arraySECUNDARIO.forEach((element: any) => {
            if (
              pivote.idMercaderia === element.idMercaderia &&
              pivote.idEquivalencia === element.idEquivalencia &&
              pivote.idKardex === element.idKardex &&
              pivote.idUbigeoStock === element.idUbigeoStock
            ) {
              console.log('Son iguales');
              if (stockPIVOTE < element.stock) {
                stockPIVOTE = element.stock;
              }
              cantidadSacadaEquivalenciaACUMULADA = cantidadSacadaEquivalenciaACUMULADA + element.cantidadSacada;
              if (stockPIVOTE < cantidadSacadaEquivalenciaACUMULADA) {
                alert('CANTIDAD EXCESIVA DE ::| ' + pivote.idMercaderia + ' |::| ' + pivote.descripcion.substring(0, 34).trim() + ' |::| ' + pivote.ubigeo);
                throw new Error(
                  'CANTIDAD EXCESIVA DE ::| ' + pivote.idMercaderia + ' |::| ' + pivote.descripcion.substring(0, 34).trim() + ' |::| ' + pivote.ubigeo
                );
              }
            } else {
              console.log('No son iguales');
            }
          });
        }
      }); //fin forEACH

      console.log('definicion_CTX_OUT_ALMACEN.itemsMercaderias INTER: ', definicion_CTX_OUT_ALMACEN.itemsMercaderias);

      //AGRUPAR DUPLICADOS
      definicion_CTX_OUT_ALMACEN.itemsMercaderias.forEach((pivote: any, index: number) => {
        if (nroElementos === index + 1) {
          console.log('final', nroElementos, index);
        } else {
          console.log('...', nroElementos, index);
          let stockPIVOTE = pivote.stock;
          let cantidadACUMULADA = pivote.cantidad;
          let cantidadEquivalenciaACUMULADA = pivote.cantidadEquivalencia;
          let cantidadSacadaACUMULADA = pivote.cantidadSacada;
          let cantidadSacadaEquivalenciaACUMULADA = pivote.cantidadSacadaEquivalencia;

          // let sonIGUALES=false;

          const arraySECUNDARIO = definicion_CTX_OUT_ALMACEN.itemsMercaderias.slice(index + 1, nroElementos);
          console.log('arraySECUNDARIO', arraySECUNDARIO);
          arraySECUNDARIO.forEach((element: any) => {
            // let elAUX='';
            if (
              pivote.idMercaderia === element.idMercaderia &&
              pivote.idEquivalencia === element.idEquivalencia &&
              pivote.idKardex === element.idKardex &&
              pivote.idUbigeoStock === element.idUbigeoStock
            ) {
              // sonIGUALES=true;
              const elAUX = element.idAuxiliar;
              console.log('Son iguales');
              if (stockPIVOTE < element.stock) {
                stockPIVOTE = element.stock;
              }
              cantidadACUMULADA = cantidadACUMULADA + element.cantidad;
              cantidadEquivalenciaACUMULADA = cantidadEquivalenciaACUMULADA + element.cantidadEquivalencia;
              cantidadSacadaACUMULADA = cantidadSacadaACUMULADA + element.cantidadSacada;
              cantidadSacadaEquivalenciaACUMULADA = cantidadSacadaEquivalenciaACUMULADA + element.cantidadSacadaEquivalencia;

              //ACTUALIZANDO los datos del ARRAY ORIGEN
              definicion_CTX_OUT_ALMACEN.itemsMercaderias[index].stock = stockPIVOTE;
              definicion_CTX_OUT_ALMACEN.itemsMercaderias[index].cantidad = cantidadACUMULADA;
              definicion_CTX_OUT_ALMACEN.itemsMercaderias[index].cantidadEquivalencia = cantidadEquivalenciaACUMULADA;
              definicion_CTX_OUT_ALMACEN.itemsMercaderias[index].cantidadSacada = cantidadSacadaACUMULADA;
              definicion_CTX_OUT_ALMACEN.itemsMercaderias[index].cantidadSacadaEquivalencia = cantidadSacadaEquivalenciaACUMULADA;
              // CALCULO de VENTA
              definicion_CTX_OUT_ALMACEN.itemsMercaderias[index].ventaPEN =
                definicion_CTX_OUT_ALMACEN.itemsMercaderias[index].precioUnitarioPEN * cantidadSacadaEquivalenciaACUMULADA;
              //HALLANDO el indice del elemento DUPLICADO para ELIMINARLO
              const elIndexAEliminar = definicion_CTX_OUT_ALMACEN.itemsMercaderias.findIndex((item: any) => item.idAuxiliar === elAUX);
              //ELIMINAR elemento del ARRAY ORIGEN
              definicion_CTX_OUT_ALMACEN.itemsMercaderias.splice(elIndexAEliminar, 1);
            } else {
              console.log('No son iguales');
            }
          });
        }
      }); //fin forEACH

      ctx_index_out_almacen.mostrarSpinner = true;
      //FECHA HORA LOCAL
      // const fechaLocal =
      //   definicion_CTX_OUT_ALMACEN.FISMA.substring(8, 10) +
      //   '-' +
      //   definicion_CTX_OUT_ALMACEN.FISMA.substring(5, 7) +
      //   '-' +
      //   definicion_CTX_OUT_ALMACEN.FISMA.substring(0, 4);

      // const hhhhDate = new Date();
      // const horaLocal =
      //   cerosALaIzquierda(hhhhDate.getHours(), 2) + ':' + cerosALaIzquierda(hhhhDate.getMinutes(), 2) + ':' + cerosALaIzquierda(hhhhDate.getSeconds(), 2);
      //
      console.log('definicion_CTX_OUT_ALMACEN.itemsMercaderias', definicion_CTX_OUT_ALMACEN.itemsMercaderias);

      // const outAlma = await inEgresoDeAlmacen({
      //   idEgresoDeAlmacen: definicion_CTX_OUT_ALMACEN._id,
      //   idGrupoEmpresarial: definicion_CTX_OUT_ALMACEN.idGrupoEmpresarial,
      //   idEmpresa: definicion_CTX_OUT_ALMACEN.idEmpresa,
      //   idSucursal: definicion_CTX_OUT_ALMACEN.idSucursal,
      //   idAlmacen: definicion_CTX_OUT_ALMACEN.idAlmacen,
      //   idPeriodo: definicion_CTX_OUT_ALMACEN.idPeriodo,
      //   periodo: definicion_CTX_OUT_ALMACEN.periodo,

      //   ruc: definicion_CTX_OUT_ALMACEN.ruc,
      //   empresa: definicion_CTX_OUT_ALMACEN.empresa,
      //   direccion: definicion_CTX_OUT_ALMACEN.direccion,
      //   sucursal: parametrosGlobales.sucursal,

      //   idMotivoEgresoAlmacen: definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen,
      //   motivoEgresoAlmacen: definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen,
      //   idDocumento: definicion_CTX_OUT_ALMACEN.idDocumento,

      //   idSucursalDestino: definicion_CTX_OUT_ALMACEN.idSucursalDestino,
      //   sucursalDestino: definicion_CTX_OUT_ALMACEN.sucursalDestino,
      //   idSerieNotaIngresoDestino: definicion_CTX_OUT_ALMACEN.idSerieNotaIngresoDestino,
      //   serieNotaIngresoDestino: definicion_CTX_OUT_ALMACEN.serieNotaIngresoDestino,
      //   idMotivoIngresoDestino: definicion_CTX_OUT_ALMACEN.idMotivoIngresoDestino,
      //   motivoIngresoDestino: definicion_CTX_OUT_ALMACEN.motivoIngresoDestino,

      //   idSerieNotaSalida: definicion_CTX_OUT_ALMACEN.idSerieNotaSalida,
      //   serie: definicion_CTX_OUT_ALMACEN.serie,

      //   igv: definicion_CTX_OUT_ALMACEN.igv,

      //   observacion: definicion_CTX_OUT_ALMACEN.observacion,

      //   FISMA: definicion_CTX_OUT_ALMACEN.FISMA,
      //   fechaLocal: fechaLocal, //DD-MM-YYYY
      //   horaLocal: horaLocal,
      //   // idElIgv: definicion_CTX_IN_ALMACEN.idElIgv,
      //   // elIgv: definicion_CTX_IN_ALMACEN.elIgv,
      //   idDestinatario: definicion_CTX_OUT_ALMACEN.idDestinatario,
      //   codigoTipoDocumentoIdentidad: definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad,
      //   tipoDocumentoIdentidad: definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad,
      //   numeroIdentidad: definicion_CTX_OUT_ALMACEN.numeroIdentidad,
      //   razonSocialNombre: definicion_CTX_OUT_ALMACEN.razonSocialNombre,

      //   documentosAdjuntos: documento, // definicion_CTX_OUT_ALMACEN.documentosAdjuntos,

      //   itemsMercaderias: definicion_CTX_OUT_ALMACEN.itemsMercaderias,

      //   usuario: parametrosGlobales.usuario,
      // });

      // console.log('💔💔💔💔💔💔  Grabó el egreso de almacén - outAlma: ', outAlma);

      // if (outAlma.status === 400) {
      //   // if (typeof outAlma.mensaje !== 'undefined' &&  outAlma.mensaje !== '') {
      //   // alert('Falla al registrar la outAlmacen: ' + outAlma.message);
      //   // alert('Falla al registrar lel Egreso del Almacen: ' + outAlma.mensaje);
      //   alert('🛑 Falla al registrar lel Egreso del Almacen: ' + outAlma.message);
      //   ctx_index_out_almacen.grabo_OutAlmacen = false;
      //   ctx_index_out_almacen.mostrarSpinner = false;
      //   return;
      // }

      ctx_index_out_almacen.grabo_OutAlmacen = true;
      ctx_index_out_almacen.mostrarPanelNewOutAlmacen = false;
      ctx_index_out_almacen.mostrarSpinner = false;
    } catch (error) {
      //console.log('ERROR - outAlma: ', error);
      ctx_index_out_almacen.mostrarSpinner = false;
      console.log('termino 666');
      // await safeAbortAndEndSession(session, error, 'in_EgresoDeAlmacen');
      throw error;
    } finally {
      console.log('termino 1 🪷🪷🪷🪷🪷');
    }
  });
  //#endregion REGISTRAR_EGRESO

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 100%, 1096px)',
        // width: 'auto',
        padding: '2px',
        background: '#eee',
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
          title="parametrosGlobales"
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          onClick={$(() => {
            console.log('parametrosGlobales', parametrosGlobales);
          })}
        /> */}
        <ImgButton
          title="definicion_CTX_OUT_ALMACEN"
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          onClick={$(() => {
            console.log('definicion_CTX_OUT_ALMACEN', definicion_CTX_OUT_ALMACEN);
          })}
        />
        <ImgButton
          title="Cerrar el formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            if (definicion_CTX_OUT_ALMACEN.itemsMercaderias.length > 0) {
              if (confirm('Hay mercaderías ingresadas, ¿Desea cerrar el formulario?')) {
                ctx_index_out_almacen.mostrarPanelNewOutAlmacen = false;
              }
              //  else {
              //   ctx_index_in_almacen.mostrarPanelNewInAlmacen = true;
              // }
            } else {
              ctx_index_out_almacen.mostrarPanelNewOutAlmacen = false;
            }
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3
          style={{
            height: '22px',
            alignContent: 'center',
            fontSize: '0.8rem',
            backgroundColor: '#333',
            color: '#eee',
            paddingLeft: '6px',
            borderRadius: '4px',
          }}
        >
          Out almacén - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
        </h3>
        {/* ----------------------------------------------------- */}
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE OUT ALMACÉN */}
          <div>
            <div hidden={definicion_CTX_OUT_ALMACEN._id === '' ? true : false}>
              {/* ID */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_ID"
                    style={{ width: '100%' }}
                    type="text"
                    // autoFocus
                    disabled
                    value={definicion_CTX_OUT_ALMACEN._id}
                  />
                </div>
              </div>
              {/* USUARIO */}
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_ID"
                    style={{ width: '100%' }}
                    type="text"
                    // autoFocus
                    disabled
                    value={definicion_CTX_OUT_ALMACEN.usuarioCrea + '; ' + definicion_CTX_OUT_ALMACEN.creado}
                  />
                </div>
              </div>
            </div>

            {/* FISMA  --  MOTIVO SALIDA  -- SERIE  */}
            <div class="linea_1_111">
              {/* FISMA */}
              <div>
                <input
                  id="in_FISMA"
                  type="date"
                  disabled={definicion_CTX_OUT_ALMACEN._id !== ''}
                  min={menosXdiasHoy(7)}
                  max={hoy()}
                  // disabled
                  style={{ width: '100%' }}
                  // min={primeroDelMes()}
                  // min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                  // // max={ultimoDelMes()}
                  // max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_OUT_ALMACEN.FISMA}
                  onChange$={(e) => {
                    definicion_CTX_OUT_ALMACEN.FISMA = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
              {/* motivo de egreso */}
              <div>
                <ElSelect
                  id="se_motivoEgreso"
                  estilos={{ cursor: 'pointer', width: '100%' }}
                  valorSeleccionado={definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen}
                  registros={losMotivosCargados.value}
                  registroID={'_id'}
                  registroTEXT={'motivoSalida'}
                  seleccione={'-- Seleccione motivo egreso --'}
                  disabled={definicion_CTX_OUT_ALMACEN.itemsMercaderias.length === 0 ? false : true}
                  onChange={$(async () => {
                    // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                    const elSelec = document.getElementById('se_motivoEgreso') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    // //console.log('??', elIdx, elSelec[elIdx].id);
                    definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen = elSelec[elIdx].id;
                    if (definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen === '') {
                      //para limpiar el almacen destino: idSucursalDestino y sucursalDestino
                      definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino = '';
                      definicion_CTX_NEW_OUT_ALMACEN.sucursalDestino = '';
                      //
                      definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen = '';
                      definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = false;
                    } else {
                      definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen = elSelec.value;
                      // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                      switch (definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen) {
                        case 'NOTA DE SALIDA':
                          //para limpiar el almacen destino: idSucursalDestino y sucursalDestino
                          limpiarSucusalDestino();
                          // definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino = '';
                          // definicion_CTX_NEW_OUT_ALMACEN.sucursalDestino = '';
                          //
                          cargarSeriesNotaSalida_DelaSucursal();
                          //
                          elDocSelecionado.value = {
                            codigoTCP: '00',
                            descripcionTCP: 'Otros',
                            serie: 'NS',
                            fecha: definicion_CTX_OUT_ALMACEN.FISMA,
                          };
                          // definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelAdjuntarDocumento = true;
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = true;
                          break;
                        case 'ORDEN DE PRODUCCIÓN':
                          //para limpiar el almacen destino: idSucursalDestino y sucursalDestino
                          limpiarSucusalDestino();
                          // definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino = '';
                          // definicion_CTX_NEW_OUT_ALMACEN.sucursalDestino = '';
                          // alert('Elegio os');
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = false;
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarOrdenProduccionAperturado = true;
                          break;
                        case 'ORDEN DE SERVICIO':
                          //para limpiar el almacen destino: idSucursalDestino y sucursalDestino
                          limpiarSucusalDestino();
                          // definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino = '';
                          // definicion_CTX_NEW_OUT_ALMACEN.sucursalDestino = '';
                          // alert('Elegio os');
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = false;
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarOrdenServicioAperturado = true;
                          break;
                        case 'VENTA':
                          //para limpiar el almacen destino: idSucursalDestino y sucursalDestino
                          limpiarSucusalDestino();
                          // definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino = '';
                          // definicion_CTX_NEW_OUT_ALMACEN.sucursalDestino = '';
                          //alert('Elegio venta');
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = false;
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarPersona_Venta = true;
                          break;
                        case 'TRASLADO':
                          //para limpiar el almacen destino: idSucursalDestino y sucursalDestino
                          limpiarSucusalDestino();
                          // definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino = '';
                          // definicion_CTX_NEW_OUT_ALMACEN.sucursalDestino = '';
                          //alert('Elegio venta');
                          // definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarPersona_Venta = true;
                          definicion_CTX_OUT_ALMACEN.idDestinatario = parametrosGlobales.idEmpresa;
                          definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad = '6';
                          definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad = 'RUC';
                          definicion_CTX_OUT_ALMACEN.numeroIdentidad = parametrosGlobales.RUC;
                          definicion_CTX_OUT_ALMACEN.razonSocialNombre = parametrosGlobales.RazonSocial;
                          break;
                        case 'TRASLADO A SUCURSAL':
                          // alert('Elegio os');
                          const losAlmacenes = await verOtrosAlmacenes({
                            usuario: parametrosGlobales.usuario,
                            idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                            idSucursal: parametrosGlobales.idSucursal,
                          });
                          console.log('losAlmacenes.data', losAlmacenes.data.length, losAlmacenes.data);
                          if (losAlmacenes.data.length === 0) {
                            alert('No existe otros almacenes.');
                            return;
                          }
                          if (losAlmacenes.data.length === 1) {
                            if (typeof losAlmacenes.data[0].idSerieNotaIngreso === 'undefined' || losAlmacenes.data[0].idSerieNotaIngreso === '') {
                              alert('No existe la serie de ingreso para el almacén destino.');
                              return;
                            }
                            if (typeof losAlmacenes.data[0].idMotivoIngreso === 'undefined' || losAlmacenes.data[0].idMotivoIngreso === '') {
                              alert('No existe el motivo de ingreso para el almacén destino.');
                              return;
                            }
                            //ir directo al panel de busqueda
                            definicion_CTX_OUT_ALMACEN.idSucursalDestino = losAlmacenes.data[0].idAlmacen;
                            definicion_CTX_OUT_ALMACEN.sucursalDestino = losAlmacenes.data[0].sucursal;
                            definicion_CTX_OUT_ALMACEN.idSerieNotaIngresoDestino = losAlmacenes.data[0].idSerieNotaIngreso;
                            definicion_CTX_OUT_ALMACEN.serieNotaIngresoDestino = losAlmacenes.data[0].serieNotaIngreso;
                            definicion_CTX_OUT_ALMACEN.idMotivoIngresoDestino = losAlmacenes.data[0].idMotivoIngreso;
                            definicion_CTX_OUT_ALMACEN.motivoIngresoDestino = losAlmacenes.data[0].motivoIngreso;
                          } else {
                            //ir al panel de listado de almacenes disponibles
                            definicion_CTX_NEW_OUT_ALMACEN.otrosAlmacenes = losAlmacenes.data;
                            definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelListaOtrosAlmacenesOUT = true;
                          }
                          break;
                        case 'NOTA DE VENTA':
                          //para limpiar el almacen destino: idSucursalDestino y sucursalDestino
                          limpiarSucusalDestino();
                          // definicion_CTX_NEW_OUT_ALMACEN.idSucursalDestino = '';
                          // definicion_CTX_NEW_OUT_ALMACEN.sucursalDestino = '';
                          //alert('Elegio venta');
                          // definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarPersona_Venta = true;
                          definicion_CTX_OUT_ALMACEN.idDestinatario = parametrosGlobales.idEmpresa;
                          definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad = '6';
                          definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad = 'RUC';
                          definicion_CTX_OUT_ALMACEN.numeroIdentidad = parametrosGlobales.RUC;
                          definicion_CTX_OUT_ALMACEN.razonSocialNombre = parametrosGlobales.RazonSocial;
                          documento.codigoTCP = '00';
                          documento.descripcionTCP = 'Otros';
                          documento.serie = 'NV';
                          // document.getElementById('in_Fecha_DOCUMENTO')?.focus();
                          // (document.getElementById('in_Fecha_DOCUMENTO') as HTMLInputElement).value = definicion_CTX_OUT_ALMACEN.FISMA;
                          (document.getElementById('btn_Add_Mercaderia') as HTMLInputElement)?.focus();
                          break;

                        default:
                          break;
                      }
                      // (document.getElementById('in_Observacion_OUT') as HTMLSelectElement)?.focus();
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Observacion_OUT') as HTMLSelectElement)?.focus();
                    }
                  })}
                />
                <label
                  style={
                    definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen === 'TRASLADO A SUCURSAL'
                      ? { display: '', color: '#fc84a4', fontWeight: 'bold', margin: '4px' }
                      : { display: 'none' }
                  }
                >
                  {definicion_CTX_OUT_ALMACEN.sucursalDestino}
                </label>
              </div>
              {/* SERIE */}
              <div>
                <input id="in_SERIE" type="text" disabled style={{ width: '100%' }} value={definicion_CTX_OUT_ALMACEN.serie} />
              </div>
            </div>

            {/* select NOTA SALIDA */}
            {/* Serie  class="form-control"*/}
            <div hidden={!definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida}>
              <div class="form-control form-agrupado">
                {
                  <select
                    id="se_SerieNotaSalida"
                    style={{ cursor: 'pointer', width: '100%' }}
                    onChange$={(e) => {
                      const idx = (e.target as HTMLSelectElement).selectedIndex;
                      const elSelect = e.target as HTMLSelectElement;
                      const elOption = elSelect[idx];

                      //console.log('❤❤❤ dataSerie.value ', dataSerie.value);
                      // const SSS: any = seriesNotaSalida.value;
                      // const der = SSS.find((ew: any) => ew._id === elOption.id);
                      //console.log('❤❤❤ der ', der);
                      // definicion_CTX_F_B_NC_ND.codigoTipoOperacion = der.codigoTipoOperacionXDefault;
                      // definicion_CTX_F_B_NC_ND.tipoOperacion = der.tipoOperacionXDefault;
                      // definicion_CTX_F_B_NC_ND.impresionTipoFacturaBoleta = der.impresionTipoFacturaBoleta;

                      definicion_CTX_OUT_ALMACEN.idSerieNotaSalida = elOption.id;
                      definicion_CTX_OUT_ALMACEN.serie = (e.target as HTMLSelectElement).value;
                      document.getElementById('se_TipoDocumentoLiteral_DESTINATARIO')?.focus();
                    }}
                  >
                    <option value="">-- Seleccione serie NS --</option>
                    {seriesNotaSalida.value.map((ser: any) => {
                      return (
                        <option id={ser.idSerieNotaSalida} value={ser.serie} selected={ser.serie === definicion_CTX_OUT_ALMACEN.serie}>
                          {ser.serie}
                        </option>
                      );
                    })}
                  </select>
                }
              </div>
            </div>
            <br />
          </div>
          {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarOrdenProduccionAperturado && (
            <div class="modal">
              <BuscarOrdenProduccionAperturado contexto="egreso_de_almacen" />
            </div>
          )}
          {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarOrdenServicioAperturado && (
            <div class="modal">
              <BuscarOrdenServicioAperturado contexto="egreso_de_almacen" />
            </div>
          )}

          {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelListaOtrosAlmacenesOUT && (
            <div class="modal">
              <ListaOtrosAlmacenesOUT otrosAlmacenes={definicion_CTX_NEW_OUT_ALMACEN.otrosAlmacenes} />
            </div>
          )}

          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL DESTINATARIO */}
          <div>
            <div class="linea_1_111">
              {/* tipo de documento identidad DESTINATARIO*/}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <input
                  id="in_TipoDocumentoLiteral_DESTINATARIO"
                  style={{ width: '100%' }}
                  type="text"
                  readOnly
                  placeholder="Tipo documento identidad"
                  value={definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad}
                />
                {/* <select
                  id="se_TipoDocumentoLiteral_DESTINATARIO"
                  disabled={definicion_CTX_OUT_ALMACEN._id !== ''}
                  value={definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad}
                  style={{ cursor: 'pointer', width: '100%' }}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const rere = e.target as HTMLSelectElement;
                    const elOption = rere[idx];
                    //console.log('elOption', elOption.id);
                    //
                    // //console.log('idx', idx.item.arguments(id));
                    // const csd = (e.target as HTMLSelectElement).current[idx];
                    // venta.codigoTipoDocumentoIdentidad = parseInt(elOption.id);
                    definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad = elOption.id;
                    definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                  }}
                  // style={{ width: '100%' }}
                >
                  <option id="1" value="DNI" selected={definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad === 'DNI'}>
                    DNI
                  </option>
                  <option id="6" value="RUC" selected={definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad === 'RUC'}>
                    RUC
                  </option>
                  <option id="4" value="C.EXT" selected={definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad === 'C.EXT'}>
                    C.EXT
                  </option>
                </select> */}
              </div>

              {/* numero identidad DESTINATARIO*/}
              <div style={{ display: 'flex' }}>
                <input
                  id="in_NumeroDocumentoIdentidad_DESTINATARIO"
                  style={{ width: '100%', fontWeight: 'bold' }}
                  type="text"
                  disabled={definicion_CTX_OUT_ALMACEN._id !== ''}
                  placeholder="Add número RUC/DNI Destinatario"
                  value={definicion_CTX_OUT_ALMACEN.numeroIdentidad}
                  onInput$={async (e) => {
                    definicion_CTX_OUT_ALMACEN.numeroIdentidad = (e.target as HTMLInputElement).value;
                    if (
                      definicion_CTX_OUT_ALMACEN.numeroIdentidad.length === 11
                      // &&
                      // (definicion_CTX_COTIZACION.numeroIdentidad.substring(0, 2) === '20' || definicion_CTX_COTIZACION.numeroIdentidad.substring(0, 2) === '10')
                    ) {
                      // document.getElementById('in_BuscarPersona')?.focus();  //206 105 176 34  // no encontrado  //no determinado
                      console.log('.............buscando por RUC', definicion_CTX_OUT_ALMACEN.numeroIdentidad);
                      ctx_index_out_almacen.mostrarSpinner = true;
                      const cliente = await getPersonaPorDniRuc({
                        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                        idEmpresa: parametrosGlobales.idEmpresa,
                        buscarPor: 'DNI / RUC',
                        cadenaABuscar: definicion_CTX_OUT_ALMACEN.numeroIdentidad,
                      });
                      ctx_index_out_almacen.mostrarSpinner = false;
                      console.log('.............buscando por RUC - cliente', cliente.data);
                      if (cliente.status === 400) {
                        alert(cliente.message);
                        return;
                      }
                      if (cliente.data.length === 0) {
                        // alert('Cliente no encontrado :|');
                        definicion_CTX_OUT_ALMACEN.idDestinatario = '';
                        definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad = '';
                        definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad = '';
                        // definicion_CTX_COTIZACION.numeroIdentidad = '';
                        definicion_CTX_OUT_ALMACEN.razonSocialNombre = '';
                        definicion_CTX_NEW_OUT_ALMACEN.mensajeErrorDestinatario = 'Persona no encontrada';
                        return;
                      }
                      if (cliente.data.length === 1) {
                        definicion_CTX_OUT_ALMACEN.idDestinatario = cliente.data[0]._id;
                        definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad = cliente.data[0].codigoTipoDocumentoIdentidad;
                        definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad = cliente.data[0].tipoDocumentoIdentidad;
                        definicion_CTX_OUT_ALMACEN.numeroIdentidad = cliente.data[0].numeroIdentidad;
                        definicion_CTX_OUT_ALMACEN.razonSocialNombre = cliente.data[0].razonSocialNombre;
                        definicion_CTX_NEW_OUT_ALMACEN.mensajeErrorDestinatario = '';
                        return;
                      }
                      if (cliente.data.length > 1) {
                        // alert('Cliente no determinado :|');
                        definicion_CTX_OUT_ALMACEN.idDestinatario = '';
                        definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad = '';
                        definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad = '';
                        // definicion_CTX_COTIZACION.numeroIdentidad = '';
                        definicion_CTX_OUT_ALMACEN.razonSocialNombre = '';
                        definicion_CTX_NEW_OUT_ALMACEN.mensajeErrorDestinatario = 'Persona no determinada';
                        return;
                      }

                      // definicion_CTX_BUSCAR_PERSONA.mostrarSpinner = true;
                      // localizarPersonas();
                      // definicion_CTX_BUSCAR_PERSONA.mostrarSpinner = false;
                    }
                  }}
                  onKeyUp$={(e) => {
                    if (e.key === 'Enter') {
                      if (definicion_CTX_OUT_ALMACEN.idDestinatario !== '') {
                        document.getElementById('in_Nombre_REMITENTE')?.focus();
                      } else {
                        document.getElementById('in_BuscarREMITENTE')?.focus();
                      }
                    }
                  }}
                  // onChange$={(e) => (definicion_CTX_OUT_ALMACEN.numeroIdentidad = (e.target as HTMLInputElement).value)}
                  // onKeyPress$={$((e: any) => {
                  //   if (e.key === 'Enter') {
                  //     (document.getElementById('in_Nombre_DESTINATARIO') as HTMLInputElement)?.focus();
                  //   }
                  // })}
                />
                {definicion_CTX_OUT_ALMACEN._id === '' ? (
                  <>
                    <input
                      title="Buscar datos de identidad"
                      type="image"
                      src={images.searchPLUS}
                      alt="icono buscar"
                      height={16}
                      width={16}
                      style={{ margin: '2px 4px' }}
                      onClick$={() => (definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarPersona = true)}
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
                      onClick$={() => (definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelListaFavoritosAlmacen = true)}
                    />
                  </>
                ) : (
                  ''
                )}
              </div>

              {/* Razon Social / Nombre - DESTINATARIO*/}
              <div>
                <input
                  id="in_Nombre_DESTINATARIO"
                  style={{ width: '100%' }}
                  type="text"
                  disabled={definicion_CTX_OUT_ALMACEN._id !== ''}
                  placeholder="Razón social / Nombre - destinatario"
                  value={definicion_CTX_OUT_ALMACEN.razonSocialNombre}
                  onKeyPress$={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_IGV') as HTMLInputElement)?.focus();
                    }
                  })}
                />
              </div>
            </div>
            {definicion_CTX_NEW_OUT_ALMACEN.mensajeErrorDestinatario !== '' && (
              <label style={{ display: 'block', textAlign: 'center', color: 'red' }}>{definicion_CTX_NEW_OUT_ALMACEN.mensajeErrorDestinatario}</label>
            )}
            <br />
          </div>
          {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarPersona && (
            <div class="modal">
              <BuscarPersona
                soloPersonasNaturales={false}
                seleccionar="destinatario"
                contexto="new_out_almacen"
                rol="destinatario"
                valorABuscarAUTOMATICAMENTE={definicion_CTX_OUT_ALMACEN.numeroIdentidad}
                mensajeErrorPersona={definicion_CTX_NEW_OUT_ALMACEN.mensajeErrorDestinatario}
              />
            </div>
          )}
          {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelListaFavoritosAlmacen && (
            <div class="modal">
              <ListaFavoritosAlmacen contexto="new_out_almacen" rol="destinatario" />
            </div>
          )}
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div hidden>
            {/* IGV */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  type={'text'}
                  id={'in_IGV'}
                  style={{ width: '100%' }}
                  disabled
                  value={definicion_CTX_OUT_ALMACEN.igv.$numberDecimal + ' %'}
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
        {/* GENERALES DE LOS DOCUMENTOS ADJUNTOS   hidden={definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida}
         */}
        <div
          style={
            definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen === 'TRASLADO' || definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen === 'TRASLADO A SUCURSAL'
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
            {/* {definicion_CTX_OUT_ALMACEN._id === '' ? (
              <div style={{ marginBottom: '4px' }}>
                <ElButton
                  id="btn_Add_Documento"
                  class="btn"
                  name="Add documento"
                  title="Add documento"
                  onClick={$(() => {
                    elDocSelecionado.value = [];
                    definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelAdjuntarDocumento = true;
                  })}
                />
              </div>
            ) : (
              ''
            )}

            {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelAdjuntarDocumento && (
              <div class="modal">
                <NewEditDocumento docSelecci={elDocSelecionado.value} contexto="new_out_almacen" />
              </div>
            )} */}
            {/* TABLA DOCUMENTOS ADJUNTOS   */}
            {/* {definicion_CTX_OUT_ALMACEN.documentosAdjuntos.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>TCP</th>
                    <th>Fecha</th>
                    <th>Serie</th>
                    <th>Número</th>
                    {definicion_CTX_OUT_ALMACEN._id === '' ? <th>Acciones</th> : ''}
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_OUT_ALMACEN.documentosAdjuntos.map((iTDocAdj: any) => {
                    // const indexItemServi = index + 1;

                    return (
                      <tr key={iTDocAdj.idAuxiliar} style={{ backgroundColor: '#cdc2b5 ' }}>
                        <td data-label="TCP" class="comoCadena">
                          {iTDocAdj.descripcionTCP}
                        </td>
                        <td data-label="Fecha" class="comoCadena">
                          {formatoDDMMYYYY_PEN(iTDocAdj.fecha)}
                        </td>
                        <td data-label="Serie" class="comoCadena">
                          {iTDocAdj.serie}
                        </td>
                        <td data-label="Número" class="comoCadena">
                          {cerosALaIzquierda(iTDocAdj.numero, 8)}
                        </td>
                        {definicion_CTX_OUT_ALMACEN._id === '' ? (
                          <td data-label="Acc" class="acciones">
                            <input
                              type="image"
                              src={images.edit}
                              title="Editar ítem"
                              alt="icono editar"
                              height={14}
                              width={14}
                              style={{ marginRight: '4px' }}
                              onClick$={() => {
                                elDocSelecionado.value = iTDocAdj;
                                definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelAdjuntarDocumento = true;
                              }}
                            />
                            <input
                              type="image"
                              src={images.trash}
                              title="Eliminar ítem"
                              alt="icono eliminar"
                              height={14}
                              width={14}
                              onClick$={() => {
                                borrarDocumento.idAuxiliar = iTDocAdj.idAuxiliar;
                                borrarDocumento.codigoTCP = iTDocAdj.codigoTCP;
                                borrarDocumento.descripcionTCP = iTDocAdj.descripcionTCP;
                                borrarDocumento.fecha = iTDocAdj.fecha;
                                borrarDocumento.serie = iTDocAdj.serie;
                                borrarDocumento.numero = iTDocAdj.numero;
                                definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelDeleteDocumentoOUT = true;
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
            )} */}
            {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelDeleteDocumentoOUT && (
              <div class="modal">
                <BorrarDocumentoOUT borrarDocumento={borrarDocumento} />
              </div>
            )}
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* BOTON / TABLA  MERCADERIAS  OUT */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            {definicion_CTX_OUT_ALMACEN._id === '' ? (
              <div class="linea_1_11" style={{ marginBottom: '16px' }}>
                <ElButton
                  id="btn_Add_Mercaderia"
                  class="btn"
                  name="Add mercadería"
                  title="Add mercadería"
                  style={{ cursor: 'pointer', height: '40px', borderRadius: '4px', border: '1px solid black' }}
                  onClick={$(() => {
                    if (definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen === '') {
                      alert('Seleccione el motivo de egreso');
                      document.getElementById('se_motivoEgreso')?.focus();
                      return;
                    }
                    definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarMercaderiaOUT = true;
                  })}
                />
                <div></div>
              </div>
            ) : (
              ''
            )}
            {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarMercaderiaOUT && (
              <div class="modal">
                <BuscarMercaderiaOUT contexto="new_out_almacen" esAlmacen={true} porcentaje={definicion_CTX_OUT_ALMACEN.igv} />
              </div>
            )}
            {/* TABLA MERCADERIA IN: REPUESTOS -- LUBRICANTES -- ETC */}
            {definicion_CTX_OUT_ALMACEN.itemsMercaderias.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Descripción</th>
                    <th>Ubigeo</th>
                    <th>Stock</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>Costo Unit PEN</th>
                    <th>Sub Total PEN</th>
                    {definicion_CTX_OUT_ALMACEN._id === '' ? <th>Acciones</th> : ''}
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_OUT_ALMACEN.itemsMercaderias.map((iTMercaOUT: any, index: any) => {
                    const indexItemMerca = index + 1;
                    let elSM = 0;
                    let elTCS = 0;
                    if (typeof iTMercaOUT.stockMinimo === 'undefined' || iTMercaOUT.stockMinimo === null) {
                      elSM = 0;
                    } else {
                      elSM = iTMercaOUT.stockMinimo.$numberDecimal ? parseFloat(iTMercaOUT.stockMinimo.$numberDecimal) : iTMercaOUT.stockMinimo;
                    }
                    if (typeof iTMercaOUT.totalCantidadSaldo === 'undefined' || iTMercaOUT.totalCantidadSaldo === null) {
                      elTCS = 0;
                    } else {
                      elTCS = iTMercaOUT.totalCantidadSaldo.$numberDecimal
                        ? parseFloat(iTMercaOUT.totalCantidadSaldo.$numberDecimal)
                        : iTMercaOUT.totalCantidadSaldo;
                    }
                    // console.log(' 🍍🍍🍍🍍', elSM, elTCS);

                    return (
                      <tr key={iTMercaOUT.idAuxiliar}>
                        <td data-label="Ítem" key={iTMercaOUT.idAuxiliar}>{`${cerosALaIzquierda(indexItemMerca, 3)}`}</td>

                        <td data-label="Descripción" style={{ fontWeight: 'bold' }}>
                          {elSM >= elTCS ? (
                            <img src={images.flagRed} alt="Bandera roja" width="12" height="12" />
                          ) : elSM + 5 >= elTCS ? (
                            <img src={images.flagAmber} alt="Bandera ambar" width="12" height="12" />
                          ) : (
                            ''
                          )}
                          {iTMercaOUT.descripcionEquivalencia}
                        </td>
                        <td data-label="Ubigeo">{iTMercaOUT.ubigeo}</td>
                        <td data-label="Stock" style={{ fontWeight: 'bold' }}>
                          {iTMercaOUT.stockEquivalente}
                        </td>
                        <td data-label="Cantidad">
                          <input
                            type="number"
                            style={{ width: '96px', textAlign: 'end' }}
                            // disabled
                            value={
                              iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                                ? iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                                : iTMercaOUT.cantidadSacadaEquivalencia
                            }
                            // value={iTMercaOUT.cantidadSacadaEquivalencia}
                            onChange$={(e) => {
                              iTMercaOUT.cantidadSacadaEquivalencia = parseFloat((e.target as HTMLInputElement).value);
                              iTMercaOUT.cantidadSacada =
                                parseFloat((e.target as HTMLInputElement).value) *
                                (iTMercaOUT.laEquivalencia.$numberDecimal ? iTMercaOUT.laEquivalencia.$numberDecimal : iTMercaOUT.laEquivalencia);
                              //sub = k * cost
                              iTMercaOUT.subEquivalenciaPEN =
                                (iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                                  ? iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                                  : iTMercaOUT.cantidadSacadaEquivalencia) *
                                (iTMercaOUT.costoUnitarioPEN.$numberDecimal ? iTMercaOUT.costoUnitarioPEN.$numberDecimal : iTMercaOUT.costoUnitarioPEN);
                              iTMercaOUT.subPEN =
                                (iTMercaOUT.cantidadSacada.$numberDecimal ? iTMercaOUT.cantidadSacada.$numberDecimal : iTMercaOUT.cantidadSacada) *
                                (iTMercaOUT.costoUnitarioPEN.$numberDecimal ? iTMercaOUT.costoUnitarioPEN.$numberDecimal : iTMercaOUT.costoUnitarioPEN);
                            }}
                            // onFocusin$={(e) => {
                            //   (e.target as HTMLInputElement).select();
                            // }}
                          />
                        </td>
                        <td data-label="Uni" class="accionesLeft">
                          {iTMercaOUT.unidadEquivalencia}
                        </td>
                        <td data-label="Costo Unit PEN">
                          <input
                            type="number"
                            style={{ width: '96px', textAlign: 'end' }}
                            disabled
                            value={formatear_6Decimales(
                              iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                                ? iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                                : iTMercaOUT.costoUnitarioEquivalenciaPEN
                            )}
                            onChange$={(e) => {
                              const costo = parseFloat((e.target as HTMLInputElement).value);
                              //console.log('el costo modificado', costo);
                              iTMercaOUT.costoUnitarioEquivalenciaPEN = costo;

                              //console.log('el costo modificado, cant', iTMercaOUT.costoUnitarioEquivalenciaPEN, iTMercaOUT.cantidadSacadaEquivalencia);
                              iTMercaOUT.subTotalPEN =
                                (iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                                  ? iTMercaOUT.cantidadSacadaEquivalencia.$numberDecimal
                                  : iTMercaOUT.cantidadSacadaEquivalencia) *
                                (iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                                  ? iTMercaOUT.costoUnitarioEquivalenciaPEN.$numberDecimal
                                  : iTMercaOUT.costoUnitarioEquivalenciaPEN);
                            }}
                            // onFocusin$={(e) => {
                            //   (e.target as HTMLInputElement).select();
                            // }}
                          />
                        </td>
                        <td data-label="SubTotal PEN" class="comoNumeroLeft">
                          {iTMercaOUT.subEquivalenciaPEN.$numberDecimal
                            ? formatear_6Decimales(iTMercaOUT.subEquivalenciaPEN.$numberDecimal)
                            : formatear_6Decimales(iTMercaOUT.subEquivalenciaPEN)}
                        </td>
                        {definicion_CTX_OUT_ALMACEN._id === '' ? (
                          <td data-label="Acc" class="accionesLeft">
                            <input
                              type="image"
                              src={images.trash}
                              title="Eliminar ítem"
                              alt="icono de eliminar"
                              height={14}
                              width={14}
                              onClick$={() => {
                                borrarItemMerca.idAuxiliar = iTMercaOUT.idAuxiliar;
                                borrarItemMerca.item = indexItemMerca;
                                borrarItemMerca.codigo = iTMercaOUT.codigo;
                                borrarItemMerca.descripcion = iTMercaOUT.descripcionEquivalencia;
                                definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelDeleteItemMercaderiaOUT = true;
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
                <br />
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem', color: 'red', marginBottom: '8px' }}>No existen mercaderías para salida</i>
            )}
            {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelDeleteItemMercaderiaOUT && (
              <div class="modal">
                <BorrarItemMercaderiaOUT borrarItemMerca={borrarItemMerca} />
              </div>
            )}
          </div>
          {/* <br /> */}
        </div>
        {/* ----------------------------------------------------- */}
        {/* OBSERVACION*/}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input
              id="in_Observacion_OUT"
              style={{ width: '100%', backgroundColor: '#F4FF7A' }}
              type="text"
              placeholder="Add observación"
              value={definicion_CTX_OUT_ALMACEN.observacion}
              onChange$={(e) => (definicion_CTX_OUT_ALMACEN.observacion = (e.target as HTMLInputElement).value)}
              onKeyPress$={$((e: any) => {
                if (e.key === 'Enter') {
                  (document.getElementById('in_GRABAR_OUT_ALMACEN') as HTMLInputElement)?.focus();
                }
              })}
            />
          </div>
        </div>
        {/* ----------------------------------------------------- */}
        {/* GRABAR */}
        {definicion_CTX_OUT_ALMACEN._id === '' ? (
          <input
            id="in_GRABAR_OUT_ALMACEN"
            type="button"
            value={'Grabar SALIDA ' + diaDeLaSemana(definicion_CTX_OUT_ALMACEN.FISMA) + ' ' + definicion_CTX_OUT_ALMACEN.FISMA.substring(8, 10)}
            style={{ cursor: 'pointer', height: '40px' }}
            class="btn-centro"
            onClick$={() => registrarEgreso()}
          />
        ) : (
          ''
        )}
      </div>
    </div>
  );
});

// suma_SubPEN =
//   suma_SubPEN +
//   redondeo2Decimales(iTMercaIN.subPEN.$numberDecimal ? iTMercaIN.subPEN.$numberDecimal : iTMercaIN.subPEN);

// suma_TotPEN =
//   suma_TotPEN +
//   redondeo2Decimales(iTMercaIN.totPEN.$numberDecimal ? iTMercaIN.totPEN.$numberDecimal : iTMercaIN.totPEN);

// suma_IGVPEN = suma_TotPEN - suma_SubPEN;

{
  /* <tfoot>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}></td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${suma_SubPEN.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${suma_IGVPEN.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${suma_TotPEN.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}></td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      Sub Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      IGV
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      Total
                    </td>
                  </tr>
                </tfoot> */
}
