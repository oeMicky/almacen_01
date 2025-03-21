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
  // elIdAuxiliar,
  formatear_6Decimales,
  formatoDDMMYYYY_PEN,
  hoy,
  menosXdiasHoy,
  // redondeo2Decimales,
  // ultimoDiaDelPeriodoX,
} from '~/functions/comunes';
import ElSelect from '../system/elSelect';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
import ElButton from '../system/elButton';
import NewEditDocumento from '../miscelanea/documento/newEditDocumento';
import type { IEgresoDeAlmacen } from '~/interfaces/iOutAlmacen';
import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
import BorrarItemMercaderiaOUT from './borrarItemMercaderiaOUT';
import BorrarDocumentoOUT from './borrarDocumentoOUT';
import { getSeriesDeNotaSalidaDeLaSucursal, inEgresoDeAlmacen, loadMotivosEgresoDeAlmacen } from '~/apis/egresosDeAlmacen.api';
import BuscarOrdenServicioAperturado from '../miscelanea/ordenServicioAperturado/buscarOrdenServicioAperturado';
import BuscarOrdenProduccionAperturado from '../miscelanea/ordenProduccionAperturado/buscarOrdenProduccionAperturado';
import ListaFavoritosAlmacen from '../miscelanea/favoritos/listaFavoritosAlmacen';

export const CTX_NEW_OUT_ALMACEN = createContextId<any>('new_out_almacen');

export const CTX_OUT_ALMACEN = createContextId<IEgresoDeAlmacen>('out_almacen');

export const CTX_DESTINATARIO_OUT_ALMACEN = createContextId<IPersona>('destinatario_out_almacen');

export default component$((props: { addPeriodo: any; outSelecci: any; igv: number }) => {
  useStyles$(style);

  //#region DEFINICION CTX_NEW_OUT_ALMACEN
  const definicion_CTX_NEW_OUT_ALMACEN = useStore({
    rol_Persona: '',
    selecciono_Persona: false,

    mostrarSelectNotaSalida: false,
    idSerieNotaSalida_porDefault: '',
    serieNotaSalida_porDefault: '',

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
  });
  //#endregion CARGAR MOTIVOS DE EGRESO

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

  //#region REGISTRAR_EGRESO
  const registrarEgreso = $(async () => {
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
    if (definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen !== 'NOTA DE SALIDA' && definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen !== 'TRASLADO') {
      if (definicion_CTX_OUT_ALMACEN.documentosAdjuntos.length < 1) {
        alert('Agregue al menos un documento');
        document.getElementById('btn_Add_Documento')?.focus();
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

    ctx_index_out_almacen.mostrarSpinner = true;
    //FECHA HORA LOCAL
    const fechaLocal =
      definicion_CTX_OUT_ALMACEN.FISMA.substring(8, 10) +
      '-' +
      definicion_CTX_OUT_ALMACEN.FISMA.substring(5, 7) +
      '-' +
      definicion_CTX_OUT_ALMACEN.FISMA.substring(0, 4);

    const hhhhDate = new Date();
    const horaLocal =
      cerosALaIzquierda(hhhhDate.getHours(), 2) + ':' + cerosALaIzquierda(hhhhDate.getMinutes(), 2) + ':' + cerosALaIzquierda(hhhhDate.getSeconds(), 2);
    //
    try {
      const outAlma = await inEgresoDeAlmacen({
        idEgresoDeAlmacen: definicion_CTX_OUT_ALMACEN._id,
        idGrupoEmpresarial: definicion_CTX_OUT_ALMACEN.idGrupoEmpresarial,
        idEmpresa: definicion_CTX_OUT_ALMACEN.idEmpresa,
        idSucursal: definicion_CTX_OUT_ALMACEN.idSucursal,
        idAlmacen: definicion_CTX_OUT_ALMACEN.idAlmacen,
        idPeriodo: definicion_CTX_OUT_ALMACEN.idPeriodo,
        periodo: definicion_CTX_OUT_ALMACEN.periodo,
        ruc: definicion_CTX_OUT_ALMACEN.ruc,
        empresa: definicion_CTX_OUT_ALMACEN.empresa,
        direccion: definicion_CTX_OUT_ALMACEN.direccion,

        idMotivoEgresoAlmacen: definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen,
        motivoEgresoAlmacen: definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen,
        idDocumento: definicion_CTX_OUT_ALMACEN.idDocumento,

        idSerieNotaSalida: definicion_CTX_OUT_ALMACEN.idSerieNotaSalida,
        serie: definicion_CTX_OUT_ALMACEN.serie,

        observacion: definicion_CTX_OUT_ALMACEN.observacion,

        FISMA: definicion_CTX_OUT_ALMACEN.FISMA,
        fechaLocal: fechaLocal, //DD-MM-YYYY
        horaLocal: horaLocal,
        // idElIgv: definicion_CTX_IN_ALMACEN.idElIgv,
        // elIgv: definicion_CTX_IN_ALMACEN.elIgv,
        idDestinatario: definicion_CTX_OUT_ALMACEN.idDestinatario,
        codigoTipoDocumentoIdentidad: definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad,
        tipoDocumentoIdentidad: definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad,
        numeroIdentidad: definicion_CTX_OUT_ALMACEN.numeroIdentidad,
        razonSocialNombre: definicion_CTX_OUT_ALMACEN.razonSocialNombre,

        documentosAdjuntos: definicion_CTX_OUT_ALMACEN.documentosAdjuntos,

        itemsMercaderias: definicion_CTX_OUT_ALMACEN.itemsMercaderias,

        usuarioCrea: parametrosGlobales.usuario,
      });

      //console.log('Grabó el egreso de almacén - outAlma: ', outAlma);

      if (outAlma.status === 400) {
        alert('Falla al registrar la outAlmacen. ' + outAlma.message);
        return;
      }

      ctx_index_out_almacen.grabo_OutAlmacen = true;
      ctx_index_out_almacen.mostrarPanelNewOutAlmacen = false;
      ctx_index_out_almacen.mostrarSpinner = false;
    } catch (error) {
      //console.log('ERROR - outAlma: ', error);
      ctx_index_out_almacen.mostrarSpinner = false;
    }
  });
  //#endregion REGISTRAR_EGRESO

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 96%, 1096px)',
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
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="parametrosGlobales"
          onClick={$(() => {
            console.log('parametrosGlobales', parametrosGlobales);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="definicion_CTX_OUT_ALMACEN"
          onClick={$(() => {
            console.log('definicion_CTX_OUT_ALMACEN', definicion_CTX_OUT_ALMACEN);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
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
            </div>
            {/* MOTIVO SALIDA  -- SERIE  */}
            <div class="linea_1_11">
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
                  onChange={$(() => {
                    // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                    const elSelec = document.getElementById('se_motivoEgreso') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    // //console.log('??', elIdx, elSelec[elIdx].id);
                    definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen = elSelec[elIdx].id;
                    if (definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen === '') {
                      definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen = '';
                      definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = false;
                    } else {
                      definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen = elSelec.value;
                      // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                      switch (definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen) {
                        case 'NOTA DE SALIDA':
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
                          // alert('Elegio os');
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = false;
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarOrdenProduccionAperturado = true;
                          break;
                        case 'ORDEN DE SERVICIO':
                          // alert('Elegio os');
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = false;
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarOrdenServicioAperturado = true;
                          break;
                        case 'VENTA':
                          //alert('Elegio venta');
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida = false;
                          definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarPersona_Venta = true;
                          break;
                        case 'TRASLADO':
                          //alert('Elegio venta');
                          // definicion_CTX_NEW_IN_ALMACEN.mostrarPanelBuscarPersona_Venta = true;
                          definicion_CTX_OUT_ALMACEN.idDestinatario = parametrosGlobales.idEmpresa;
                          definicion_CTX_OUT_ALMACEN.codigoTipoDocumentoIdentidad = '6';
                          definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad = 'RUC';
                          definicion_CTX_OUT_ALMACEN.numeroIdentidad = parametrosGlobales.RUC;
                          definicion_CTX_OUT_ALMACEN.razonSocialNombre = parametrosGlobales.RazonSocial;
                          break;

                        default:
                          break;
                      }
                      (document.getElementById('in_Observacion_OUT') as HTMLSelectElement)?.focus();
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Observacion_OUT') as HTMLSelectElement)?.focus();
                    }
                  })}
                />
              </div>
              {/* SERIE */}
              <div>
                <input id="in_SERIE" type="text" disabled style={{ width: '100%' }} value={definicion_CTX_OUT_ALMACEN.serie} />
              </div>
            </div>
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
                      (document.getElementById('se_TipoDocumentoLiteral_DESTINATARIO') as HTMLInputElement)?.focus();
                    }
                  })}
                />
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
          {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarPersona_Venta && (
            <div class="modal">
              <BuscarPersona seleccionar="cliente" soloPersonasNaturales={false} contexto={'new_out_almacen'} rol="cliente" motivo={true} />
              {/* <BuscarVenta contexto="egreso_de_almacen" /> */}
            </div>
          )}
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL DESTINATARIO */}
          <div>
            {/* tipo de documento identidad DESTINATARIO*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <select
                  id="se_TipoDocumentoLiteral_DESTINATARIO"
                  disabled={definicion_CTX_OUT_ALMACEN._id !== ''}
                  value={definicion_CTX_OUT_ALMACEN.tipoDocumentoIdentidad}
                  // onChange={cambioTipoDocumento}
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
                </select>
                {definicion_CTX_OUT_ALMACEN._id === '' ? (
                  <>
                    <input
                      title="Buscar datos de identidad"
                      type="image"
                      src={images.searchPLUS}
                      alt="icono buscar"
                      height={16}
                      width={16}
                      style={{ margin: '2px 6px' }}
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
            </div>
            {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarPersona && (
              <div class="modal">
                <BuscarPersona soloPersonasNaturales={false} seleccionar="destinatario" contexto="new_out_almacen" rol="destinatario" />
              </div>
            )}
            {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelListaFavoritosAlmacen && (
              <div class="modal">
                <ListaFavoritosAlmacen contexto="new_out_almacen" rol="destinatario" />
              </div>
            )}
            {/* numero identidad DESTINATARIO*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_NumeroDocumentoIdentidad_DESTINATARIO"
                  style={{ width: '100%' }}
                  type="text"
                  disabled={definicion_CTX_OUT_ALMACEN._id !== ''}
                  placeholder="Add número identidad destinatario"
                  value={definicion_CTX_OUT_ALMACEN.numeroIdentidad}
                  onChange$={(e) => (definicion_CTX_OUT_ALMACEN.numeroIdentidad = (e.target as HTMLInputElement).value)}
                  onKeyPress$={$((e: any) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Nombre_DESTINATARIO') as HTMLInputElement)?.focus();
                    }
                  })}
                />
              </div>
            </div>

            {/* Razon Social / Nombre - DESTINATARIO*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
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
        {/* GENERALES DE LOS DOCUMENTOS ADJUNTOS   hidden={definicion_CTX_NEW_OUT_ALMACEN.mostrarSelectNotaSalida}*/}
        <div style={definicion_CTX_OUT_ALMACEN.motivoEgresoAlmacen === 'TRASLADO' ? { display: 'none' } : ''}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            {definicion_CTX_OUT_ALMACEN._id === '' ? (
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
            )}
            {/* TABLA DOCUMENTOS ADJUNTOS   */}
            {definicion_CTX_OUT_ALMACEN.documentosAdjuntos.length > 0 ? (
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
                      <tr key={iTDocAdj.idAuxiliar}>
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
            )}
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
              <div style={{ marginBottom: '8px' }}>
                <ElButton
                  id="btn_Add_Mercaderia"
                  class="btn"
                  name="Add mercadería"
                  title="Add mercadería"
                  onClick={$(() => {
                    if (definicion_CTX_OUT_ALMACEN.idMotivoEgresoAlmacen === '') {
                      alert('Seleccione el motivo de egreso');
                      document.getElementById('se_motivoEgreso')?.focus();
                      return;
                    }
                    definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelBuscarMercaderiaOUT = true;
                  })}
                />
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
                    <th>idMerca</th>
                    <th>Descripción</th>
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

                    return (
                      <tr key={iTMercaOUT.idAuxiliar}>
                        <td data-label="Ítem" key={iTMercaOUT.idAuxiliar}>{`${cerosALaIzquierda(indexItemMerca, 3)}`}</td>
                        <td data-label="idMerca">{iTMercaOUT.idMercaderia}</td>
                        <td data-label="Descripción">{iTMercaOUT.descripcionEquivalencia}</td>
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
              <i style={{ fontSize: '0.8rem' }}>No existen mercaderías registradas</i>
            )}
            {definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelDeleteItemMercaderiaOUT && (
              <div class="modal">
                <BorrarItemMercaderiaOUT borrarItemMerca={borrarItemMerca} />
              </div>
            )}
          </div>
          <br />
        </div>
        {/* ----------------------------------------------------- */}
        {/* GRABAR */}
        {definicion_CTX_OUT_ALMACEN._id === '' ? (
          <input
            type="button"
            value={'Grabar EGRESO ' + diaDeLaSemana(definicion_CTX_OUT_ALMACEN.FISMA) + ' ' + definicion_CTX_OUT_ALMACEN.FISMA.substring(8, 10)}
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
