import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda, formatear6_MonedaPEN, formatear_6Decimales, hoy, menosXdiasHoy, redondeo4Decimales, redondeo6Decimales } from '~/functions/comunes'; //redondeo6Decimales
import ElSelect from '../system/elSelect';
import { parametrosGlobales } from '~/routes/login';

import { getTecnico, getTecnicosActivos } from '~/apis/tecnico.api';
// import { borrarRequisicionOS, borrarServicioOS, getSeriesActivasOrdenesServicio, inUpOrdenServicio } from "~/apis/ordenServicio.api"; //loadTiposOrdenProduccion
// import type { IVehiculo } from "~/interfaces/iVehiculo";
import type { IPersona } from '~/interfaces/iPersona';

import style from '../tabla/tabla.css?inline';

import BuscarPersona from '../miscelanea/persona/buscarPersona';
// import BuscarVehiculo from "../miscelanea/vehiculo/buscarVehiculo";
import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
// import BuscarServicio from "../miscelanea/servicio/buscarServicio";
import BuscarTecnico from '../miscelanea/tecnico/buscarTecnico';
// import BorrarServicioOP from "./borrarServicioOP";
import BorrarRequisicionOP from './borrarRequisicionOP';
import type { IOrdenProduccion } from '~/interfaces/iOrdenProduccion';
import { CTX_INDEX_ORDEN_PRODUCCION } from '~/routes/(ordenesProduccion)/ordenProduccion';
import {
  borrarManufacturaOP,
  borrarRequisicionOP,
  getSeriesActivasOrdenesProduccion,
  inUpOrdenProduccion,
  loadTiposOrdenProduccion,
} from '~/apis/ordenProduccion.api';
import AddManufactura from './addManufactura';
import InPrecioVentaSugerido from './inPrecioVentaSugerido';
import BorrarManufacturaOP from './borrarManufacturaOP';

export const CTX_O_P = createContextId<IOrdenProduccion>('op');
export const CTX_CLIENTE_OP = createContextId<IPersona>('op__cliente');
// export const CTX_VEHICULO_OP = createContextId<IVehiculo>("op__vehiculo");
export const CTX_NEW_EDIT_ORDEN_PRODUCCION = createContextId<any>('new_edit_orden_produccion');

export default component$((props: { addPeriodo: any; oPSelecci: any; igv: any }) => {
  useStyles$(style);

  //#region DEFINICION CTX_NEW_EDIT_ORDEN_PRODUCCION
  const definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION = useStore({
    // mostrarPanelSeleccionarPersonalTecnico: false,
    selecciono_Tecnico: false,
    mostrarPanelBuscarTecnico: false,

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersona: false,

    // mostrarPanelBuscarVehiculo: false,
    addM: [],
    mostrarPanelAddManufactura: false,
    mostrarPanelBuscarManufacturaStandarizada: false,

    mostrarPanelBuscarMercaderiaOUT: false,

    mostrarPanelBorrarManufacturaOP: false,
    borrar_idManufacturaOP: '',
    borrar_idAuxiliarManufactura: 0,

    mostrarPanelBorrarRequisicionOP: false,
    borrar_idRequisicionOP: '',
    borrar_idKardexRequisicion: '',
    borrar_idAuxiliarRequisicion: 0,

    mostrarPanelInPrecioVentaSugeridoSinIGV: false,
  });
  useContextProvider(CTX_NEW_EDIT_ORDEN_PRODUCCION, definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION);
  //#endregion DEFINICION CTX_NEW_EDIT_ORDEN_PRODUCCION

  //#region DEFINICION CTX_O_P
  const definicion_CTX_O_P = useStore<IOrdenProduccion>(
    {
      _id: props.oPSelecci._id ? props.oPSelecci._id : '',

      idGrupoEmpresarial: props.oPSelecci.idGrupoEmpresarial ? props.oPSelecci.idGrupoEmpresarial : parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.oPSelecci.idEmpresa ? props.oPSelecci.idEmpresa : parametrosGlobales.idEmpresa,
      idSucursal: props.oPSelecci.idSucursal ? props.oPSelecci.idSucursal : parametrosGlobales.idSucursal,
      idPeriodo: props.oPSelecci.idPeriodo ? props.oPSelecci.idPeriodo : props.addPeriodo.idPeriodo,
      periodo: props.oPSelecci.periodo ? props.oPSelecci.periodo : props.addPeriodo.periodo,

      ruc: props.oPSelecci.ruc ? props.oPSelecci.ruc : parametrosGlobales.RUC,
      empresa: props.oPSelecci.empresa ? props.oPSelecci.empresa : parametrosGlobales.RazonSocial,
      sucursal: props.oPSelecci.sucursal ? props.oPSelecci.sucursal : parametrosGlobales.sucursal,
      direccion: props.oPSelecci.direccion ? props.oPSelecci.direccion : parametrosGlobales.Direccion,

      idSerieOrdenProduccion: props.oPSelecci.idSerieOrdenProduccion ? props.oPSelecci.idSerieOrdenProduccion : '',
      serie: props.oPSelecci.serie ? props.oPSelecci.serie : '',
      numero: props.oPSelecci.numero ? props.oPSelecci.numero : 0,

      fechaInicio: props.oPSelecci.fechaInicio ? props.oPSelecci.fechaInicio.substring(0, 10) : hoy(),

      estado: props.oPSelecci.estado ? props.oPSelecci.estado : 'APERTURADO',
      tipo: props.oPSelecci.tipo ? props.oPSelecci.tipo : '',
      idTecnico: props.oPSelecci.idTecnico ? props.oPSelecci.idTecnico : '',
      razonSocialNombreTecnico: props.oPSelecci.razonSocialNombreTecnico ? props.oPSelecci.razonSocialNombreTecnico : '',

      clienteVentasVarias: typeof props.oPSelecci.clienteVentasVarias !== 'undefined' ? props.oPSelecci.clienteVentasVarias : false,
      idCliente: props.oPSelecci.idCliente ? props.oPSelecci.idCliente : null,
      codigoTipoDocumentoIdentidad: props.oPSelecci.codigoTipoDocumentoIdentidad ? props.oPSelecci.codigoTipoDocumentoIdentidad : '6',
      tipoDocumentoIdentidad: props.oPSelecci.tipoDocumentoIdentidad ? props.oPSelecci.tipoDocumentoIdentidad : 'RUC',
      numeroIdentidad: props.oPSelecci.numeroIdentidad ? props.oPSelecci.numeroIdentidad : '',
      razonSocialNombreCliente: props.oPSelecci.razonSocialNombreCliente ? props.oPSelecci.razonSocialNombreCliente : '',

      requerimientosCliente: props.oPSelecci.requerimientosCliente ? props.oPSelecci.requerimientosCliente : '',
      observacionesCliente: props.oPSelecci.observacionesCliente ? props.oPSelecci.observacionesCliente : '',
      //       : `OBSERVACIÓN(ES):
      // -`,

      igv: props.oPSelecci.igv ? props.oPSelecci.igv : props.igv,

      manufacturas: props.oPSelecci.manufacturas ? props.oPSelecci.manufacturas : [],
      requisiciones: props.oPSelecci.requisiciones ? props.oPSelecci.requisiciones : [],

      divisor: props.oPSelecci.divisor ? props.oPSelecci.divisor : 1,

      porcentajeUtilidad: props.oPSelecci.porcentajeUtilidad ? props.oPSelecci.porcentajeUtilidad : 25,
      // precioVentaSugeridoSinIGV: props.oPSelecci.precioVentaSugeridoSinIGV ? props.oPSelecci.precioVentaSugeridoSinIGV : 0,
    },
    { deep: true }
  );
  useContextProvider(CTX_O_P, definicion_CTX_O_P);
  //#endregion DEFINICION CTX_O_P

  //#region DEFINICION CTX_CLIENTE_OP
  const defini_CTX_CLIENTE_OP = useStore<IPersona>({
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
  useContextProvider(CTX_CLIENTE_OP, defini_CTX_CLIENTE_OP);
  //#endregion DEFINICION CTX_CLIENTE_OP

  //#region CONTEXTOS
  const ctx_index_orden_produccion = useContext(CTX_INDEX_ORDEN_PRODUCCION);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const losTecnicos = useSignal([]);
  const tecnicoACTIVO = useSignal(false);
  const suministrosDespachados = useSignal<any>([]);
  const dataSerie = useSignal([]);
  const losTiposOPCargados = useSignal([]);

  const borrarManufactura = useStore({
    _id: '',
    idAuxiliar: '',
    item: '',
    codigo: '',
    descripcion: '',
  });

  const borrarRequisicion = useStore({
    _id: '',
    idAuxiliar: '',
    idKardex: '',
    item: '',
    codigo: '',
    descripcion: '',
  });

  let sumaTOTAL_manufacturas = 0;
  let sumaTOTAL_requisiciones = 0;

  let sumaTOTAL_suministrosDespachados = 0;

  //*registros
  const cargarTiposOrdenProduccion = $(async () => {
    const losTiposOP = await loadTiposOrdenProduccion({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });

    losTiposOPCargados.value = losTiposOP.data;
  });
  const obtenerTecnicosActivos = $(async () => {
    //
    const tecns = await getTecnicosActivos({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });

    losTecnicos.value = tecns.data;
  });

  const cantidadesDespachadas = $((requisici: any) => {
    for (const requi of requisici) {
      if (requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal > 0) {
        suministrosDespachados.value.push({
          _id: requi._id,
          idAuxiliar: requi.idAuxiliar,
          idMercaderia: requi.idMercaderia,
          idEquivalencia: requi.idEquivalencia,
          idKardex: requi.idKardex,
          item: requi.item,
          codigo: requi.codigo,
          descripcionEquivalencia: requi.descripcionEquivalencia,
          cantidad: requi.cantidad,
          unidadEquivalencia: requi.unidadEquivalencia,
          // precioUnitarioPEN: requi.precioUnitarioPEN,
          // ventaPEN: requi.ventaPEN,
          tipoEquivalencia: requi.tipoEquivalencia,
          factor: requi.factor,
          laEquivalencia: requi.laEquivalencia,
          cantidadDespachada: requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal,
          costoUnitarioPEN: requi.costoUnitarioPEN,
          costoUnitarioEquivalenciaPEN: requi.costoUnitarioEquivalenciaPEN,
        });
      }
    }
    // //console.log("📀📀📀sumaTOTAL_manufacturas", sumaTOTAL_manufacturas);
    // //console.log("📀📀📀sumaTOTAL_repuestosDespachados", sumaTOTAL_repuestosDespachados);
  });

  //* TASK *** aL INICIAL el COMPONENTE ***
  useTask$(async ({ track }) => {
    track(() => ini.value);

    cargarTiposOrdenProduccion();
    cantidadesDespachadas(definicion_CTX_O_P.requisiciones);
    obtenerTecnicosActivos();

    if (definicion_CTX_O_P._id !== '') {
      //el tecnico esta ACTIVO???

      const verificarTEC = await getTecnico({ idTecnico: definicion_CTX_O_P.idTecnico });
      tecnicoACTIVO.value = verificarTEC.data.activo;
      //

      //
    } else {
      tecnicoACTIVO.value = true;
    }
    //
    if (definicion_CTX_O_P.idSerieOrdenProduccion === '') {
      // obtenerSerie();
      const parametros = {
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idSucursal: parametrosGlobales.idSucursal,
      };
      //
      const lasSeries = await getSeriesActivasOrdenesProduccion(parametros);
      dataSerie.value = lasSeries.data;
    }
  });
  //#endregion INICIALIZACION

  //#region ACTUALIZAR LOS TECNICOS
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.selecciono_Tecnico);
    if (definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.selecciono_Tecnico) {
      obtenerTecnicosActivos();
      definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.selecciono_Tecnico = false;
    }
  });
  //#endregion ACTUALIZAR LOS TECNICOS

  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.selecciono_Persona);
    if (definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.selecciono_Persona && definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.rol_Persona === 'cliente') {
      definicion_CTX_O_P.clienteVentasVarias = false;

      definicion_CTX_O_P.idCliente = defini_CTX_CLIENTE_OP._id;
      definicion_CTX_O_P.codigoTipoDocumentoIdentidad = defini_CTX_CLIENTE_OP.codigoTipoDocumentoIdentidad;
      definicion_CTX_O_P.tipoDocumentoIdentidad = defini_CTX_CLIENTE_OP.tipoDocumentoIdentidad;
      definicion_CTX_O_P.numeroIdentidad = defini_CTX_CLIENTE_OP.numeroIdentidad;
      definicion_CTX_O_P.razonSocialNombreCliente = defini_CTX_CLIENTE_OP.razonSocialNombre;

      definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.rol_Persona = '';
      definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.selecciono_Persona = false;
    }
  });
  //#endregion CLIENTE

  //#region ELIMINAR MANUFACTURA
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idAuxiliarManufactura);

    if (definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idAuxiliarManufactura > 0) {
      //borrar en la BD
      if (
        definicion_CTX_O_P._id !== '' &&
        typeof definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idManufacturaOP !== 'undefined' &&
        definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idManufacturaOP !== ''
      ) {
        await borrarManufacturaOP({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          idOrdenProduccion: definicion_CTX_O_P._id,
          idManufacturaOP: definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idManufacturaOP,
        });
      }
      //borrar en la App
      const newItems: any = definicion_CTX_O_P.manufacturas.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idAuxiliarManufactura
      );
      definicion_CTX_O_P.manufacturas = newItems;

      definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idManufacturaOP = '';
      definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idAuxiliarManufactura = 0;
    }
  });
  //#endregion ELIMINAR MANUFACTURA

  //#region ELIMINAR REQUISICION DEL SUMINISTRO
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idAuxiliarRequisicion);
    // ctx_new_edit_orden_produccion.borrar_idAuxiliarRequisicion = props.borrarRequisicion.idAuxiliar;
    // ctx_new_edit_orden_produccion.borrar_idKardexRequisicion = props.borrarRequisicion.idKardex;
    // ctx_new_edit_orden_produccion.borrar_idRequisicionOP = props.borrarRequisicion._id;
    if (definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idAuxiliarRequisicion > 0) {
      //verificar si ya se a DESPACHADO
      if (definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idKardexRequisicion !== '') {
        //console.log(
        //   'definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idKardexRequisicion definicion_CTX_O_P.requisiciones.length',
        //   definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idKardexRequisicion,
        //   definicion_CTX_O_P.requisiciones.length
        // );
        if (definicion_CTX_O_P.requisiciones.length > 0) {
          const despachos: any = definicion_CTX_O_P.requisiciones.filter(
            (despa: any) => despa.idKardex === definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idKardexRequisicion
          );
          //console.log('...despachos', despachos);
          if (despachos[0].cantidadDespachada.$numberDecimal - despachos[0].cantidadReingresada.$numberDecimal > 0) {
            alert('🔵 El artículo no puede ser eliminado debido a que ha sido despachado por almacén.');
            return;
          }
        }
      }

      //borrar en la BD
      if (
        definicion_CTX_O_P._id !== '' &&
        typeof definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idRequisicionOP !== 'undefined' &&
        definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idRequisicionOP !== ''
      ) {
        //console.log('...borrando de la BD');
        await borrarRequisicionOP({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          idOrdenProduccion: definicion_CTX_O_P._id,
          idRequisicionOP: definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idRequisicionOP,
        });
      }
      //borrar en la App
      const newItems: any = definicion_CTX_O_P.requisiciones.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idAuxiliarRequisicion
      );
      definicion_CTX_O_P.requisiciones = newItems;

      definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idRequisicionOP = '';
      definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idKardexRequisicion = '';
      definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.borrar_idAuxiliarRequisicion = 0;
    }
  });

  //#endregion ELIMINAR REQUISICION DEL SUMINISTRO

  //#region ON SUBMIT
  const grabarOP = $(async () => {
    if (definicion_CTX_O_P.fechaInicio === '' || typeof definicion_CTX_O_P.fechaInicio === 'undefined') {
      alert('Seleccione la fecha.');
      document.getElementById('inputFecha')?.focus();
      return;
    }
    if (definicion_CTX_O_P.idSerieOrdenProduccion === '' || typeof definicion_CTX_O_P.idSerieOrdenProduccion === 'undefined') {
      alert('Seleccione la serie');
      document.getElementById('selectSerieOrdenProduccion')?.focus();
      return;
    }
    if (definicion_CTX_O_P.estado === '' || typeof definicion_CTX_O_P.estado === 'undefined') {
      alert('Seleccione el estado.');
      document.getElementById('selectEstado')?.focus();
      return;
    }
    if (definicion_CTX_O_P.tipo === '' || typeof definicion_CTX_O_P.tipo === 'undefined') {
      alert('Seleccione el tipo de orden de producción.');
      document.getElementById('selectTipo')?.focus();
      return;
    }
    if (definicion_CTX_O_P.idTecnico === '' || typeof definicion_CTX_O_P.idTecnico === 'undefined') {
      alert('Seleccione al técnico.');
      document.getElementById('selectTecnico')?.focus();
      return;
    }
    if (!definicion_CTX_O_P.clienteVentasVarias) {
      if (definicion_CTX_O_P.idCliente === '' || typeof definicion_CTX_O_P.idCliente === 'undefined') {
        alert('Seleccione al cliente.');
        document.getElementById('selectTipoDocumentoLiteral')?.focus();
        return;
      }
      if (definicion_CTX_O_P.numeroIdentidad === '' || typeof definicion_CTX_O_P.numeroIdentidad === 'undefined') {
        alert('Seleccione al cliente.');
        document.getElementById('selectTipoDocumentoLiteral')?.focus();
        return;
      }
      if (definicion_CTX_O_P.razonSocialNombreCliente === '' || typeof definicion_CTX_O_P.razonSocialNombreCliente === 'undefined') {
        alert('Seleccione al cliente.');
        document.getElementById('selectTipoDocumentoLiteral')?.focus();
        return;
      }
    }

    ctx_index_orden_produccion.mostrarSpinner = true;

    const ordenP = await inUpOrdenProduccion({
      idOrdenProduccion: definicion_CTX_O_P._id,
      // idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      // idEmpresa: parametrosGlobales.idEmpresa,

      idGrupoEmpresarial: definicion_CTX_O_P.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_O_P.idEmpresa,
      idSucursal: definicion_CTX_O_P.idSucursal,
      idPeriodo: definicion_CTX_O_P.idPeriodo,
      periodo: definicion_CTX_O_P.periodo,

      ruc: definicion_CTX_O_P.ruc,
      empresa: definicion_CTX_O_P.empresa,
      sucursal: definicion_CTX_O_P.sucursal,
      direccion: definicion_CTX_O_P.direccion,

      idSerieOrdenProduccion: definicion_CTX_O_P.idSerieOrdenProduccion,
      serie: definicion_CTX_O_P.serie,
      numero: definicion_CTX_O_P.numero,

      fechaInicio: definicion_CTX_O_P.fechaInicio,

      // correlativo: definicion_CTX_O_S.correlativo,
      estado: definicion_CTX_O_P.estado,
      tipo: definicion_CTX_O_P.tipo,
      idTecnico: definicion_CTX_O_P.idTecnico,
      razonSocialNombreTecnico: definicion_CTX_O_P.razonSocialNombreTecnico,

      clienteVentasVarias: definicion_CTX_O_P.clienteVentasVarias,
      idCliente: definicion_CTX_O_P.idCliente,
      codigoTipoDocumentoIdentidad: definicion_CTX_O_P.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_O_P.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_O_P.numeroIdentidad,
      razonSocialNombreCliente: definicion_CTX_O_P.razonSocialNombreCliente,

      igv: definicion_CTX_O_P.igv,

      requerimientosCliente: definicion_CTX_O_P.requerimientosCliente,
      observacionesCliente: definicion_CTX_O_P.observacionesCliente,

      manufacturas: definicion_CTX_O_P.manufacturas,
      requisiciones: definicion_CTX_O_P.requisiciones,

      divisor: definicion_CTX_O_P.divisor,

      porcentajeUtilidad: definicion_CTX_O_P.porcentajeUtilidad,
      // precioVentaSugeridoSinIGV: definicion_CTX_O_P.precioVentaSugeridoSinIGV,
    });

    if (ordenP.status === 400) {
      ctx_index_orden_produccion.mostrarSpinner = false;
      alert('🛑 Falla al registrar la orden de servicio. ' + ordenP.message);
      return;
    }

    ctx_index_orden_produccion.grabo_OP = true;
    definicion_CTX_O_P._id = ordenP.data._id;
    definicion_CTX_O_P.numero = ordenP.data.numero;
    definicion_CTX_O_P.manufacturas = ordenP.data.manufacturas;
    definicion_CTX_O_P.requisiciones = ordenP.data.requisiciones;
    ctx_index_orden_produccion.mostrarSpinner = false;
    alert('✅ Registro satisfactorio');
  });
  //#endregion ON SUBMIT

  return (
    <div
      style={{
        width: 'clamp(330px, 90%, 782px)',
        // width: 'auto',
        padding: '1px',
        // border: '3px dashed yellow',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          //   border: '1px solid green',
        }}
      >
        {/* <ImgButton
          src={images.see}
          alt="imagen de cerrar"
          height={16}
          width={16}
          title="Ver definicion_CTX_O_P"
          onClick={$(() => //console.log("definicion_CTX_O_P", definicion_CTX_O_P))}
        />
        <ImgButton
          src={images.see}
          alt="imagen de cerrar"
          height={16}
          width={16}
          title="Ver suministrosDespachados.value"
          onClick={$(() => //console.log("suministrosDespachados.value", suministrosDespachados.value))}
        /> */}
        <ImgButton
          src={images.x}
          alt="imagen de cerrar"
          height={18}
          width={18}
          title="Ver datos"
          onClick={$(() => {
            ctx_index_orden_produccion.mostrarPanelNewEditOrdenProduccion = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>
        Orden de producción - {parametrosGlobales.RazonSocial} - {parametrosGlobales.sucursal}
      </h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE ORDEN DE PRODUCCION */}
          <div>
            {/* fecha */}
            <div class="form-control form-control-check">
              <div class="form-control form-agrupado">
                <input
                  id="inputFecha"
                  type="date"
                  style={{ width: '100%' }}
                  // disabled
                  disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                  min={menosXdiasHoy(2)}
                  max={hoy()}
                  // min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                  // max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_O_P.fechaInicio}
                  onChange$={(e) => {
                    definicion_CTX_O_P.fechaInicio = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            </div>
            {/* Numero de Orden de Producción*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                {definicion_CTX_O_P.idSerieOrdenProduccion !== '' ? (
                  <input
                    id="inputSerieOrdenProduccion"
                    style={{ width: '100%' }}
                    type="text"
                    disabled
                    value={
                      definicion_CTX_O_P._id === ''
                        ? definicion_CTX_O_P.serie
                        : definicion_CTX_O_P.serie + ' - ' + cerosALaIzquierda(definicion_CTX_O_P.numero, 8)
                    }
                  />
                ) : (
                  <select
                    id="selectSerieOrdenProduccion"
                    onChange$={(e) => {
                      const idx = (e.target as HTMLSelectElement).selectedIndex;
                      const elSelect = e.target as HTMLSelectElement;
                      const elOption = elSelect[idx];

                      definicion_CTX_O_P.idSerieOrdenProduccion = elOption.id;
                      definicion_CTX_O_P.serie = (e.target as HTMLSelectElement).value;

                      document.getElementById('in_Fecha')?.focus();
                    }}
                  >
                    <option value="">-- Seleccione una serie --</option>
                    {dataSerie.value.map((ser: any) => {
                      return (
                        <option id={ser.idSerieOrdenProduccion} value={ser.serie} selected={definicion_CTX_O_P.serie === ser.serie}>
                          {ser.serie}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>
            {/* Estado */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <select
                  id="selectEstado"
                  // value={oS.estado}
                  onChange$={(e) => {
                    definicion_CTX_O_P.estado = (e.target as HTMLSelectElement).value;
                  }}
                  style={{ width: '100%' }}
                >
                  <option value={'APERTURADO'} selected={definicion_CTX_O_P.estado === 'APERTURADO'}>
                    APERTURADO
                  </option>
                  <option value={'DE BAJA'} selected={definicion_CTX_O_P.estado === 'DE BAJA'}>
                    DE BAJA
                  </option>
                  <option value={'TERMINADO'} selected={definicion_CTX_O_P.estado === 'TERMINADO'}>
                    TERMINADO
                  </option>
                </select>
              </div>
            </div>
            {/* Tipo */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <select
                  id="selectTipo"
                  // value={oS.tipo}
                  disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                  onChange$={(e) => {
                    definicion_CTX_O_P.tipo = (e.target as HTMLSelectElement).value;
                  }}
                  style={{ width: '100%' }}
                >
                  <option>-- Seleccione el tipo --</option>
                  {losTiposOPCargados.value.map((tipo: any) => {
                    return (
                      <option value={tipo.tipo} selected={definicion_CTX_O_P.tipo === tipo.tipo}>
                        {tipo.tipo}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            {/* Técnico */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                {tecnicoACTIVO.value ? (
                  <>
                    <ElSelect
                      id={'selectTecnico'}
                      // elValor={oS.razonSocialNombreTecnico}
                      valorSeleccionado={definicion_CTX_O_P.razonSocialNombreTecnico}
                      registros={losTecnicos.value}
                      registroID={'idTecnico'}
                      registroTEXT={'razonSocialNombre'}
                      seleccione={'-- Seleccione un técnico --'}
                      // onChange={changeTecnico}
                      disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                      onChange={$(() => {
                        const elSelec = document.getElementById('selectTecnico') as HTMLSelectElement;
                        const elIdx = elSelec.selectedIndex;
                        definicion_CTX_O_P.idTecnico = elSelec[elIdx].id;
                        if (definicion_CTX_O_P.idTecnico === '') {
                          definicion_CTX_O_P.razonSocialNombreTecnico = '';
                        } else {
                          definicion_CTX_O_P.razonSocialNombreTecnico = elSelec.value;
                        }
                      })}
                    />
                    <input
                      type="image"
                      src={images.three_dots2}
                      title="Buscar técnico"
                      alt="icono buscar"
                      height={16}
                      width={16}
                      style={{ marginLeft: '4px' }}
                      onClick$={() => (definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBuscarTecnico = true)}
                    />
                  </>
                ) : (
                  <input type="text" value={definicion_CTX_O_P.razonSocialNombreTecnico} disabled style={{ width: '100%' }} />
                )}

                {definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBuscarTecnico && (
                  <div class="modal">
                    <BuscarTecnico contexto="orden_produccion" />
                  </div>
                )}
              </div>
            </div>
            <br />
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
                  checked={definicion_CTX_O_P.clienteVentasVarias}
                  disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                  onChange$={(e) => {
                    definicion_CTX_O_P.clienteVentasVarias = (e.target as HTMLInputElement).checked;
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
              <div class="form-control form-agrupado">
                <select
                  id="selectTipoDocumentoLiteral"
                  // value={oS.codigoTipoDocumentoIdentidad}
                  disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                  onChange$={(e) => {
                    //
                    definicion_CTX_O_P.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                  }}
                  style={{ width: '100%' }}
                >
                  <option value={'1'} selected={definicion_CTX_O_P.codigoTipoDocumentoIdentidad === '1'}>
                    DNI
                  </option>
                  <option value={'6'} selected={definicion_CTX_O_P.codigoTipoDocumentoIdentidad === '6'}>
                    RUC
                  </option>
                  <option value={'4'} selected={definicion_CTX_O_P.codigoTipoDocumentoIdentidad === '4'}>
                    C.EXT
                  </option>
                </select>
                <input
                  type="image"
                  src={images.searchPLUS}
                  title="Buscar cliente"
                  alt="icono buscar"
                  height={16}
                  width={16}
                  style={{ marginLeft: '4px' }}
                  disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                  onClick$={() => (definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBuscarPersona = true)}
                />
              </div>
            </div>
            {/* numero identidad*/}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroIdentidad"
                  style={{ width: '100%' }}
                  type="number"
                  disabled
                  placeholder="Add número identidad"
                  value={definicion_CTX_O_P.numeroIdentidad}
                  onChange$={(e) => {
                    definicion_CTX_O_P.numeroIdentidad = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            </div>
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="inputNombreCliente"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social / Nombre"
                  disabled
                  value={definicion_CTX_O_P.razonSocialNombreCliente}
                  onChange$={(e) => {
                    definicion_CTX_O_P.razonSocialNombreCliente = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            </div>
            <br />
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
          </div>
          {definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBuscarPersona && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={false} seleccionar="cliente" contexto="orden_produccion" rol="cliente" />
            </div>
          )}
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          {/* <div>
            <div class="form-control">
              <label>IGV (%)</label>
              <div class="form-control form-agrupado">
                <input type="number" id="inputIGV" disabled value={definicion_CTX_O_P.igv.$numberDecimal} style={{ width: "100%" }} />
              </div>
            </div>
          </div> */}
          {/* ----------------------------------------------------- */}
          <br />
          {/* ----------------------------------------------------- */}
        </div>
        {/* REQUERIMIENTOS DEL CLIENTE */}
        <div>
          <div
          // style={{
          //   width: '676px',
          // }}
          >
            <label>Requerimientos del cliente</label>
            <div>
              <textarea
                style={{ maxWidth: '100%' }}
                disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                cols={90}
                value={definicion_CTX_O_P.requerimientosCliente}
                onChange$={(e) => {
                  definicion_CTX_O_P.requerimientosCliente = (e.target as HTMLTextAreaElement).value;
                }}
                // onChange={(e) => {
                //   setRequerimientosCliente(e.target.value);
                // }}
              ></textarea>
            </div>
          </div>
          {/* ----------------------------------------------------- */}
          <br />
          {/* <hr style={{ margin: '5px 0' }}></hr> */}
        </div>
        {/* OBSERVACIONES */}
        <div>
          <div
          // style={{
          //   width: '676px',
          // }}
          >
            <label>Observaciones</label>
            <div>
              <textarea
                style={{ maxWidth: '100%' }}
                disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                cols={90}
                value={definicion_CTX_O_P.observacionesCliente}
                onChange$={(e) => {
                  definicion_CTX_O_P.observacionesCliente = (e.target as HTMLTextAreaElement).value;
                }}
                // onChange={(e) => {
                //   setObservacionesCliente(e.target.value);
                // }}
              ></textarea>
            </div>
          </div>
          {/* ----------------------------------------------------- */}
          <br />
          {/* <hr style={{ margin: '5px 0' }}></hr> */}
        </div>
        {/* BOTON MANUFACTURA */}
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
              <button
                disabled={definicion_CTX_O_P.estado !== 'APERTURADO' || definicion_CTX_O_P.numero === 0 ? true : false}
                onClick$={() => {
                  definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.addM = [];
                  definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelAddManufactura = true;
                }}
              >
                Add manufactura
              </button>
            </div>
            {definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelAddManufactura && (
              <div class="modal">
                <AddManufactura manuSeleccio={definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.addM} />
              </div>
            )}
            {/* TABLA MANUFACTURA  */}
            {definicion_CTX_O_P.manufacturas.length > 0 ? (
              <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>Costo Uni</th>
                    <th>Costo Total </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_O_P.manufacturas.map((iTManufac: any, index: any) => {
                    const indexItemManufac = index + 1;

                    sumaTOTAL_manufacturas =
                      sumaTOTAL_manufacturas +
                      redondeo4Decimales(iTManufac.costoTotalPEN.$numberDecimal ? iTManufac.costoTotalPEN.$numberDecimal : iTManufac.costoTotalPEN);

                    return (
                      <tr key={iTManufac.idAuxiliar}>
                        <td data-label="Ítem" key={iTManufac.idAuxiliar} class="comoCadena">{`${cerosALaIzquierda(indexItemManufac, 3)}`}</td>
                        <td data-label="Descripción" class="comoCadena">
                          {iTManufac.descripcion}
                        </td>
                        <td data-label="Cantidad" class="comoNumero">
                          <input
                            type="number"
                            disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                            style={{ width: '60px', textAlign: 'end' }}
                            value={iTManufac.cantidad.$numberDecimal ? iTManufac.cantidad.$numberDecimal : iTManufac.cantidad}
                            onChange$={(e) => {
                              // const iv = itemsVentaK[index];
                              iTManufac.cantidad = parseFloat((e.target as HTMLInputElement).value);

                              iTManufac.costoTotalPEN =
                                (iTManufac.cantidad.$numberDecimal ? iTManufac.cantidad.$numberDecimal : iTManufac.cantidad) *
                                (iTManufac.costoUnitarioPEN.$numberDecimal ? iTManufac.costoUnitarioPEN.$numberDecimal : iTManufac.costoUnitarioPEN);
                            }}
                          />
                        </td>
                        <td data-label="Uni" class="acciones">
                          {iTManufac.unidad}
                        </td>
                        <td data-label="Costo Uni" class="comoNumero">
                          <input
                            type="number"
                            disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                            style={{ width: '60px', textAlign: 'end' }}
                            value={iTManufac.costoUnitarioPEN.$numberDecimal ? iTManufac.costoUnitarioPEN.$numberDecimal : iTManufac.costoUnitarioPEN}
                            onChange$={(e) => {
                              const costo = parseFloat((e.target as HTMLInputElement).value);
                              //console.log('.........costo', costo);
                              iTManufac.costoUnitarioPEN = costo;
                              //console.log('.........iTSer.costoUnitarioPEN ', iTManufac.costoUnitarioPEN, iTManufac.cantidad);
                              const K = iTManufac.cantidad.$numberDecimal ? parseFloat(iTManufac.cantidad.$numberDecimal) : parseFloat(iTManufac.cantidad);
                              //console.log('K', K);
                              iTManufac.costoTotalPEN =
                                K * (iTManufac.costoUnitarioPEN.$numberDecimal ? iTManufac.costoUnitarioPEN.$numberDecimal : iTManufac.costoUnitarioPEN);
                            }}
                          />
                        </td>
                        <td data-label="Costo Total" class="comoNumero">
                          {iTManufac.costoTotalPEN.$numberDecimal
                            ? redondeo4Decimales(iTManufac.costoTotalPEN.$numberDecimal)
                            : redondeo4Decimales(iTManufac.costoTotalPEN)}
                        </td>
                        <td data-label="Acciones" class="acciones">
                          <input
                            type="image"
                            title="Eliminar ítem"
                            alt="icono eliminar"
                            hidden={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                            height={14}
                            width={14}
                            src={images.trash}
                            onClick$={() => {
                              borrarManufactura._id = iTManufac._id;
                              borrarManufactura.idAuxiliar = iTManufac.idAuxiliar;
                              borrarManufactura.item = indexItemManufac;
                              borrarManufactura.codigo = iTManufac.codigo;
                              borrarManufactura.descripcion = iTManufac.descripcion;

                              definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBorrarManufacturaOP = true;
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'end' }}>
                      Total PEN
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${sumaTOTAL_manufacturas.toLocaleString('en-PE', {
                        // style: "currency",
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existe manufactura</i>
            )}
            {definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBorrarManufacturaOP && (
              <div class="modal">
                <BorrarManufacturaOP borrarManufactura={borrarManufactura} />
              </div>
            )}
          </div>
          {/* ----------------------------------------------------- */}
          <br />
        </div>
        {/* BOTON REQUISICION DE SUMINISTROS */}
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
              <button
                disabled={definicion_CTX_O_P.estado !== 'APERTURADO' || definicion_CTX_O_P.numero === 0 ? true : false}
                onClick$={() => {
                  definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBuscarMercaderiaOUT = true;
                }}
              >
                Add requisición de suministro
              </button>
            </div>
            {definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBuscarMercaderiaOUT && (
              <div class="modal">
                <BuscarMercaderiaOUT
                  contexto="orden_produccion"
                  esAlmacen={false}
                  esProduccion={true}
                  porcentaje={definicion_CTX_O_P.igv.$numberDecimal ? definicion_CTX_O_P.igv.$numberDecimal : definicion_CTX_O_P.igv}
                />
              </div>
            )}
            {/* TABLA REQUISICIONES */}
            {definicion_CTX_O_P.requisiciones.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Kx</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Uni</th>
                      <th>Costo Uni</th>
                      <th>Costo Total</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {definicion_CTX_O_P.requisiciones.map((iTRequi: any, index: any) => {
                      const indexItemRequi = index + 1;

                      sumaTOTAL_requisiciones =
                        sumaTOTAL_requisiciones +
                        redondeo6Decimales(
                          iTRequi.costoEquivalenciaPEN.$numberDecimal ? iTRequi.costoEquivalenciaPEN.$numberDecimal : iTRequi.costoEquivalenciaPEN
                        );

                      return (
                        <tr key={iTRequi.idAuxiliar}>
                          <td data-label="Ítem" key={iTRequi.idAuxiliar} class="comoCadena">{`${cerosALaIzquierda(indexItemRequi, 3)}`}</td>
                          <td data-label="Kx" class="comoCadena">
                            {typeof iTRequi.idKardex !== 'undefined' && iTRequi.idKardex !== '' ? iTRequi.idKardex.substring(iTRequi.idKardex.length - 6) : ''}
                          </td>

                          <td data-label="Descripción" class="comoCadena">
                            {iTRequi.descripcionEquivalencia}
                          </td>
                          <td data-label="Cantidad" class="comoNumero">
                            <input
                              type="number"
                              disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                              style={{ width: '60px', textAlign: 'end' }}
                              value={redondeo4Decimales(
                                iTRequi.cantidadEquivalencia.$numberDecimal ? iTRequi.cantidadEquivalencia.$numberDecimal : iTRequi.cantidadEquivalencia
                              )}
                              onChange$={(e) => {
                                iTRequi.cantidadEquivalencia = parseFloat((e.target as HTMLInputElement).value);

                                iTRequi.costoEquivalenciaPEN =
                                  (iTRequi.cantidadEquivalencia.$numberDecimal ? iTRequi.cantidadEquivalencia.$numberDecimal : iTRequi.cantidadEquivalencia) *
                                  (iTRequi.costoUnitarioEquivalenciaPEN.$numberDecimal
                                    ? iTRequi.costoUnitarioEquivalenciaPEN.$numberDecimal
                                    : iTRequi.costoUnitarioEquivalenciaPEN);
                              }}
                            />
                          </td>
                          <td data-label="Uni" class="acciones">
                            {iTRequi.unidadEquivalencia}
                          </td>
                          <td data-label="Costo Uni" class="comoNumero">
                            <input
                              type="number"
                              disabled
                              style={{ width: '60px', textAlign: 'end' }}
                              value={
                                iTRequi.costoUnitarioEquivalenciaPEN.$numberDecimal
                                  ? redondeo4Decimales(iTRequi.costoUnitarioEquivalenciaPEN.$numberDecimal)
                                  : redondeo4Decimales(iTRequi.costoUnitarioEquivalenciaPEN)
                              }
                            />
                          </td>
                          <td data-label="Costo Total" class="comoNumero">
                            {iTRequi.costoEquivalenciaPEN.$numberDecimal
                              ? redondeo4Decimales(iTRequi.costoEquivalenciaPEN.$numberDecimal)
                              : redondeo4Decimales(iTRequi.costoEquivalenciaPEN)}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              type="image"
                              title="Eliminar ítem"
                              alt="icono eliminar"
                              hidden={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                              height={14}
                              width={14}
                              src={images.trash}
                              onClick$={() => {
                                borrarRequisicion._id = iTRequi._id;
                                borrarRequisicion.idAuxiliar = iTRequi.idAuxiliar;
                                borrarRequisicion.idKardex = iTRequi.idKardex;
                                borrarRequisicion.item = indexItemRequi;
                                borrarRequisicion.codigo = iTRequi.codigo;
                                borrarRequisicion.descripcion = iTRequi.descripcionEquivalencia;

                                definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBorrarRequisicionOP = true;
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'end' }}>
                        Total PEN
                      </td>
                      <td colSpan={1} style={{ textAlign: 'end' }}>
                        {`${sumaTOTAL_requisiciones.toLocaleString('en-PE', {
                          // style: "currency",
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <label style={{ fontSize: '0.7rem', color: '#aa032f' }}>
                  (*) Las requisiciones de suministros son consideradas en el costo de producción luego de ser despachadas por el almacén.
                </label>
              </>
            ) : (
              <i style={{ fontSize: '0.8rem' }}>No existen requisiciones</i>
            )}
            {definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelBorrarRequisicionOP && (
              <div class="modal">
                <BorrarRequisicionOP borrarRequisicion={borrarRequisicion} />
              </div>
            )}
          </div>
          {/* ----------------------------------------------------- */}
          <br />
          {/* <hr style={{ margin: '5px 0' }}></hr> */}
        </div>
        {/* SUMINISTROS DESPACHADOS */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '4px 0',
            }}
          >
            <div style={{ marginBottom: '4px' }}>Suministros despachados</div>
            {/* TABLA SUMINISTROS DESPACHADOS  */}
            <div>
              {suministrosDespachados.value.length > 0 ? (
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Kx</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad Despachada</th>
                      <th>Uni</th>
                      <th>Costo Uni</th>
                      <th>Costo Total</th>
                      {/* <th>Acciones</th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {suministrosDespachados.value.map((iTSumiDespachado: any, index: number) => {
                      const indexItemRequiDespachados = index + 1;

                      sumaTOTAL_suministrosDespachados =
                        sumaTOTAL_suministrosDespachados +
                        (iTSumiDespachado.cantidadDespachada.$numberDecimal
                          ? iTSumiDespachado.cantidadDespachada.$numberDecimal
                          : iTSumiDespachado.cantidadDespachada) *
                          (iTSumiDespachado.costoUnitarioEquivalenciaPEN.$numberDecimal
                            ? iTSumiDespachado.costoUnitarioEquivalenciaPEN.$numberDecimal
                            : iTSumiDespachado.costoUnitarioEquivalenciaPEN);
                      // subTOTAL_repuestosDespachados = redondeo2Decimales((sumaTOTAL_repuestosDespachados * 100) / (100 + definicion_CTX_O_P.igv));
                      // igvTOTAL_repuestosDespachados = redondeo2Decimales(sumaTOTAL_repuestosDespachados - subTOTAL_repuestosDespachados);

                      return (
                        <tr key={iTSumiDespachado.idAuxiliar}>
                          <td data-label="Ítem" key={iTSumiDespachado.idAuxiliar} class="comoCadena">{`${cerosALaIzquierda(indexItemRequiDespachados, 3)}`}</td>
                          <td data-label="Kx" class="comoCadena">
                            {typeof iTSumiDespachado.idKardex !== 'undefined' && iTSumiDespachado.idKardex !== ''
                              ? iTSumiDespachado.idKardex.substring(iTSumiDespachado.idKardex.length - 6)
                              : ''}
                          </td>
                          <td data-label="Código" class="comoCadena">
                            {iTSumiDespachado.codigo}
                          </td>
                          <td data-label="Descripción" class="comoCadena">
                            {iTSumiDespachado.descripcionEquivalencia}
                          </td>
                          <td data-label="Cantidad despachada" class="comoNumero">
                            {redondeo4Decimales(
                              iTSumiDespachado.cantidadDespachada.$numberDecimal
                                ? iTSumiDespachado.cantidadDespachada.$numberDecimal
                                : iTSumiDespachado.cantidadDespachada
                            )}
                          </td>
                          <td data-label="Uni" class="comoCadena">
                            {iTSumiDespachado.unidadEquivalencia}
                          </td>
                          <td data-label="Costo Uni" style={{ textAlign: 'end' }}>
                            {redondeo4Decimales(
                              iTSumiDespachado.costoUnitarioEquivalenciaPEN.$numberDecimal
                                ? iTSumiDespachado.costoUnitarioEquivalenciaPEN.$numberDecimal
                                : iTSumiDespachado.costoUnitarioEquivalenciaPEN
                            )}
                          </td>
                          <td data-label="Costo Total" class="comoNumero">
                            {redondeo4Decimales(
                              (iTSumiDespachado.cantidadDespachada.$numberDecimal
                                ? iTSumiDespachado.cantidadDespachada.$numberDecimal
                                : iTSumiDespachado.cantidadDespachada) *
                                (iTSumiDespachado.costoUnitarioEquivalenciaPEN.$numberDecimal
                                  ? iTSumiDespachado.costoUnitarioEquivalenciaPEN.$numberDecimal
                                  : iTSumiDespachado.costoUnitarioEquivalenciaPEN)
                            )}
                          </td>
                          {/* <td data-label="Acciones" class="acciones"></td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'end' }}>
                        Total PEN
                      </td>
                      <td colSpan={1} style={{ textAlign: 'end' }}>
                        {`${sumaTOTAL_suministrosDespachados.toLocaleString('en-PE', {
                          // style: "currency",
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <i style={{ fontSize: '0.8rem' }}>No existen suministros despachados</i>
              )}
            </div>
          </div>
          {/* ----------------------------------------------------- */}
          <br />
          {/* <hr style={{ margin: '5px 0' }}></hr> */}
        </div>
        {/* COSTOS DE PRODUCCION  -  PRECIO VENTA SUGERIDO */}
        <div style={{ background: '#ffff80' }}>
          <div style={{ marginBottom: '4px' }}>Costos de producción</div>
          {/* TABLA: manufacturas y suministros */}
          <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
            <tbody>
              <tr key={1}>
                <td data-label="Ítem" key={1} class="comoCadena">
                  MANUFACTURAS
                </td>
                <td data-label="Ítem" key={2} class="comoNumero">
                  {`${redondeo4Decimales(sumaTOTAL_manufacturas).toLocaleString('en-PE', {
                    // style: "currency",
                    currency: 'PEN',
                    minimumFractionDigits: 2,
                  })}`}
                </td>
              </tr>
              <tr key={2}>
                <td data-label="Ítem" key={1} class="comoCadena">
                  SUMINISTROS
                </td>
                <td data-label="Ítem" key={1} class="comoNumero">
                  {`${redondeo4Decimales(sumaTOTAL_suministrosDespachados).toLocaleString('en-PE', {
                    // style: "currency",
                    currency: 'PEN',
                    minimumFractionDigits: 2,
                  })}`}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={1} style={{ textAlign: 'end' }}>
                  Total PEN
                </td>
                <td colSpan={1} style={{ textAlign: 'end' }}>
                  {`${redondeo4Decimales(sumaTOTAL_manufacturas + sumaTOTAL_suministrosDespachados).toLocaleString('en-PE', {
                    // style: "currency",
                    currency: 'PEN',
                    minimumFractionDigits: 2,
                  })}`}
                </td>
              </tr>
            </tfoot>
          </table>
          <br />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '8px 0' }}>
            {/* Divisor*/}
            <div>
              <label style={{ marginRight: '121px' }}>Divisor</label>
              <input
                id="in_Divisor_ORDEN_PRODUCCION"
                type="number"
                placeholder="Divisor"
                style={{ width: '80px', textAlign: 'end', marginLeft: '4px' }}
                disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                value={definicion_CTX_O_P.divisor.$numberDecimal ? definicion_CTX_O_P.divisor.$numberDecimal : definicion_CTX_O_P.divisor}
                onChange$={(e) => {
                  if (parseFloat((e.target as HTMLInputElement).value) > 0) {
                    definicion_CTX_O_P.divisor = (e.target as HTMLInputElement).value;

                    // const CCC =
                    //   (sumaTOTAL_manufacturas + sumaTOTAL_repuestosDespachados) /
                    //   (definicion_CTX_O_P.divisor.$numberDecimal ? definicion_CTX_O_P.divisor.$numberDecimal : definicion_CTX_O_P.divisor);

                    // definicion_CTX_O_P.precioVentaSugeridoSinIGV =
                    //   (100 * CCC) /
                    //   (100 -
                    //     (definicion_CTX_O_P.porcentajeUtilidad.$numberDecimal
                    //       ? definicion_CTX_O_P.porcentajeUtilidad.$numberDecimal
                    //       : definicion_CTX_O_P.porcentajeUtilidad));
                  } else {
                    alert('El valor del divisor debe ser mayor a cero (0).');
                  }
                }}
              />
            </div>
            {/* Costo Unitario de Producción*/}
            <div>
              <label>Costo Unitario de Producción PEN</label>
              <input
                id="in_CUP_PEN_ORDEN_PRODUCCION"
                type="number"
                disabled
                readOnly
                placeholder="CUP PEN"
                value={formatear6_MonedaPEN(
                  (sumaTOTAL_manufacturas + sumaTOTAL_suministrosDespachados) /
                    (definicion_CTX_O_P.divisor.$numberDecimal ? definicion_CTX_O_P.divisor.$numberDecimal : definicion_CTX_O_P.divisor)
                )}
                style={{ width: '80px', textAlign: 'end', marginLeft: '4px' }}
              />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '8px 0' }}>
            {/* Porcentaje de UTILIDAD */}
            <div>
              <label>Porcentaje de UTILIDAD (%)</label>
              <input
                id="in_PorcentajeUTILIDAD_ORDEN_PRODUCCION"
                type="number"
                placeholder="Porcentaje de UTILIDAD"
                style={{ width: '80px', textAlign: 'end', margin: '0 4px' }}
                disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                value={formatear_6Decimales(
                  definicion_CTX_O_P.porcentajeUtilidad.$numberDecimal
                    ? definicion_CTX_O_P.porcentajeUtilidad.$numberDecimal
                    : definicion_CTX_O_P.porcentajeUtilidad
                )}
                onChange$={(e) => {
                  if (parseFloat((e.target as HTMLInputElement).value) > 0) {
                    definicion_CTX_O_P.porcentajeUtilidad = (e.target as HTMLInputElement).value;

                    // const CCC =
                    //   (sumaTOTAL_manufacturas + sumaTOTAL_repuestosDespachados) /
                    //   (definicion_CTX_O_P.divisor.$numberDecimal ? definicion_CTX_O_P.divisor.$numberDecimal : definicion_CTX_O_P.divisor);

                    // definicion_CTX_O_P.precioVentaSugeridoSinIGV =
                    //   (100 * CCC) /
                    //   (100 -
                    //     (definicion_CTX_O_P.porcentajeUtilidad.$numberDecimal
                    //       ? definicion_CTX_O_P.porcentajeUtilidad.$numberDecimal
                    //       : definicion_CTX_O_P.porcentajeUtilidad));
                  } else {
                    alert('El valor del porcentajeUtilidad debe ser mayor a cero (0).');
                  }
                }}
              />
              <button
                type="button"
                title="Cálculo de % Utilidad"
                disabled={definicion_CTX_O_P.estado === 'APERTURADO' ? false : true}
                onClick$={() => (definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelInPrecioVentaSugeridoSinIGV = true)}
              >
                ...
              </button>
            </div>
            {definicion_CTX_NEW_EDIT_ORDEN_PRODUCCION.mostrarPanelInPrecioVentaSugeridoSinIGV && (
              <div class="modal">
                <InPrecioVentaSugerido
                  costoUni={
                    (sumaTOTAL_manufacturas + sumaTOTAL_suministrosDespachados) /
                    (definicion_CTX_O_P.divisor.$numberDecimal ? definicion_CTX_O_P.divisor.$numberDecimal : definicion_CTX_O_P.divisor)
                  }
                />
              </div>
            )}
            {/* Precio venta SUGERIDO sin IGV*/}
            <div>
              <label style={{ marginRight: '16px' }}>Precio venta SUGERIDO sin IGV</label>
              <input
                id="in_precioVentaSugeridoSinIGV_PEN_ORDEN_PRODUCCION"
                type="number"
                disabled
                placeholder="Precio Venta Sugerido SinIGV PEN"
                style={{ width: '80px', textAlign: 'end', marginLeft: '4px' }}
                value={formatear_6Decimales(
                  (100 *
                    ((sumaTOTAL_manufacturas + sumaTOTAL_suministrosDespachados) /
                      (definicion_CTX_O_P.divisor.$numberDecimal ? definicion_CTX_O_P.divisor.$numberDecimal : definicion_CTX_O_P.divisor))) /
                    (100 -
                      (definicion_CTX_O_P.porcentajeUtilidad.$numberDecimal
                        ? definicion_CTX_O_P.porcentajeUtilidad.$numberDecimal
                        : definicion_CTX_O_P.porcentajeUtilidad))
                )}
                // value={formatear6_MonedaPEN(
                //   definicion_CTX_O_P.precioVentaSugeridoSinIGV.$numberDecimal
                //     ? definicion_CTX_O_P.precioVentaSugeridoSinIGV.$numberDecimal
                //     : definicion_CTX_O_P.precioVentaSugeridoSinIGV
                // )}
                // onChange$={(e) => {
                //   if (parseFloat((e.target as HTMLInputElement).value) > 0) {
                //     definicion_CTX_O_P.precioVentaSugeridoSinIGV = (e.target as HTMLInputElement).value;

                //     const PPP = definicion_CTX_O_P.precioVentaSugeridoSinIGV.$numberDecimal
                //       ? definicion_CTX_O_P.precioVentaSugeridoSinIGV.$numberDecimal
                //       : definicion_CTX_O_P.precioVentaSugeridoSinIGV;

                //     const CCC =
                //       (sumaTOTAL_manufacturas + sumaTOTAL_repuestosDespachados) /
                //       (definicion_CTX_O_P.divisor.$numberDecimal ? definicion_CTX_O_P.divisor.$numberDecimal : definicion_CTX_O_P.divisor);

                //     definicion_CTX_O_P.porcentajeUtilidad = (100 * (PPP - CCC)) / PPP;
                //   } else {
                //     alert("El valor del Precio venta SUGERIDO sin IGV debe ser mayor a cero (0).");
                //   }
                // }}
              />
            </div>
          </div>
          <br />
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          type="button"
          // hidden={definicion_CTX_O_P.estado !== "APERTURADO" ? true : false}
          // disabled={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
          value={definicion_CTX_O_P.numero === 0 ? 'Aperturar orden de producción' : `Grabar`}
          class="btn-centro"
          // onClick={(e) => onSubmit(e)}
          onClick$={() => {
            grabarOP();
          }}
        />
      </div>
    </div>
  );
});
