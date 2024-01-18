import {
  $,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useStylesScoped$,
  useTask$,
} from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { cerosALaIzquierda, hoy, redondeo2Decimales, ultimoDiaDelPeriodoX } from '~/functions/comunes';
import ElSelect from '../system/elSelect';
import { getTecnico, getTecnicosActivos } from '~/apis/tecnico.api';
import { parametrosGlobales } from '~/routes/login';
// import SeleccionarTecnico from './seleccionarTecnico';
// import SeleccionarVehiculo from './seleccionarVehiculo';
import { IVehiculo } from '~/interfaces/iVehiculo';
import ElButton from '../system/elButton';
import {
  borrarRequisicionOS,
  borrarServicioOS,
  getSeriesActivasOrdenesServicio,
  inUpOrdenServicio,
} from '~/apis/ordenServicio.api';
import { IOrdenServicio } from '~/interfaces/iOrdenServicio';
import style from '../tabla/tabla.css?inline';
import { IPersona } from '~/interfaces/iPersona';
import BuscarPersona from '../miscelanea/persona/buscarPersona';
import BuscarVehiculo from '../miscelanea/vehiculo/buscarVehiculo';
import BuscarMercaderiaOUT from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
import BuscarServicio from '../miscelanea/servicio/buscarServicio';
import BuscarTecnico from '../miscelanea/tecnico/buscarTecnico';
import BorrarServicioOS from './borrarServicioOS';
import BorrarRequisicionOS from './borrarRequisicionOS';

export const CTX_O_S = createContextId<IOrdenServicio>('os');
export const CTX_CLIENTE_OS = createContextId<IPersona>('os__cliente');
export const CTX_VEHICULO_OS = createContextId<IVehiculo>('os__vehiculo');
export const CTX_NEW_EDIT_ORDEN_SERVICIO = createContextId<any>('new_edit_orden_servicio');

export default component$((props: { addPeriodo: any; oSSelecci: any; igv: number }) => {
  useStylesScoped$(style);

  //#region DEFINICION CTX_NEW_EDIT_ORDEN_SERVICIO
  const definicion_CTX_NEW_EDIT_ORDEN_SERVICIO = useStore({
    // mostrarPanelSeleccionarPersonalTecnico: false,
    selecciono_Tecnico: false,
    mostrarPanelBuscarTecnico: false,

    rol_Persona: '',
    selecciono_Persona: false,
    mostrarPanelBuscarPersona: false,

    mostrarPanelBuscarVehiculo: false,
    mostrarPanelBuscarServicio: false,
    mostrarPanelBuscarMercaderiaOUT: false,

    mostrarPanelBorrarServicioOS: false,
    borrar_idServicioOS: '',
    borrar_idAuxiliarServicio: 0,

    mostrarPanelBorrarRequisicionOS: false,
    borrar_idRequisicionOS: '',
    borrar_idKardexRequisicion: '',
    borrar_idAuxiliarRequisicion: 0,
  });
  useContextProvider(CTX_NEW_EDIT_ORDEN_SERVICIO, definicion_CTX_NEW_EDIT_ORDEN_SERVICIO);
  //#endregion DEFINICION CTX_NEW_EDIT_ORDEN_SERVICIO

  //#region DEFINICION CTX_O_S - NEW / EDIT
  const definicion_CTX_O_S = useStore<IOrdenServicio>(
    {
      _id: props.oSSelecci._id ? props.oSSelecci._id : '',

      idGrupoEmpresarial: props.oSSelecci.idGrupoEmpresarial
        ? props.oSSelecci.idGrupoEmpresarial
        : parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.oSSelecci.idEmpresa ? props.oSSelecci.idEmpresa : parametrosGlobales.idEmpresa,
      idSucursal: props.oSSelecci.idSucursal ? props.oSSelecci.idSucursal : parametrosGlobales.idSucursal,
      idPeriodo: props.oSSelecci.idPeriodo ? props.oSSelecci.idPeriodo : props.addPeriodo.idPeriodo,
      periodo: props.oSSelecci.periodo ? props.oSSelecci.periodo : props.addPeriodo.periodo,

      ruc: props.oSSelecci.ruc ? props.oSSelecci.ruc : parametrosGlobales.RUC,
      empresa: props.oSSelecci.empresa ? props.oSSelecci.empresa : parametrosGlobales.RazonSocial,
      direccion: props.oSSelecci.direccion ? props.oSSelecci.direccion : parametrosGlobales.Direccion,

      idSerieOrdenServicio: props.oSSelecci.idSerieOrdenServicio ? props.oSSelecci.idSerieOrdenServicio : '',
      serie: props.oSSelecci.serie ? props.oSSelecci.serie : '',
      numero: props.oSSelecci.numero ? props.oSSelecci.numero : 0,

      fechaInicio: props.oSSelecci.fechaInicio ? props.oSSelecci.fechaInicio.substring(0, 10) : hoy(),
      // fechaInicio: props.oSSelecci.fechaInicio ? formatoDDMMYYYY_PEN(props.oSSelecci.fechaInicio) : hoy(),
      // fechaInicio: props.oSSelecci.fechaInicio ? '2025-05-25' : hoy(),
      // fechaInicio: props.oSSelecci.fechaInicio ? formatoDDMMYYYY_PEN('2023-05-25T00:00:00.000Z') : hoy(),

      estado: props.oSSelecci.estado ? props.oSSelecci.estado : 'APERTURADO',
      tipo: props.oSSelecci.tipo ? props.oSSelecci.tipo : 'MANTENIMIENTO',
      idTecnico: props.oSSelecci.idTecnico ? props.oSSelecci.idTecnico : '',
      razonSocialNombreTecnico: props.oSSelecci.razonSocialNombreTecnico ? props.oSSelecci.razonSocialNombreTecnico : '',

      idCliente: props.oSSelecci.idCliente ? props.oSSelecci.idCliente : '',
      codigoTipoDocumentoIdentidad: props.oSSelecci.codigoTipoDocumentoIdentidad
        ? props.oSSelecci.codigoTipoDocumentoIdentidad
        : '6',
      tipoDocumentoIdentidad: props.oSSelecci.tipoDocumentoIdentidad ? props.oSSelecci.tipoDocumentoIdentidad : 'RUC',
      numeroIdentidad: props.oSSelecci.numeroIdentidad ? props.oSSelecci.numeroIdentidad : '',
      razonSocialNombreCliente: props.oSSelecci.razonSocialNombreCliente ? props.oSSelecci.razonSocialNombreCliente : '',

      idVehiculo: props.oSSelecci.idVehiculo ? props.oSSelecci.idVehiculo : '',
      placa: props.oSSelecci.placa ? props.oSSelecci.placa : '',
      idVehiculoMarca: props.oSSelecci.idVehiculoMarca ? props.oSSelecci.idVehiculoMarca : '',
      vehiculoMarca: props.oSSelecci.vehiculoMarca ? props.oSSelecci.vehiculoMarca : '',
      idVehiculoModelo: props.oSSelecci.idVehiculoModelo ? props.oSSelecci.idVehiculoModelo : '',
      vehiculoModelo: props.oSSelecci.vehiculoModelo ? props.oSSelecci.vehiculoModelo : '',
      vin: props.oSSelecci.vin ? props.oSSelecci.vin : '',
      kilometraje: props.oSSelecci.kilometraje ? props.oSSelecci.kilometraje : 0,

      requerimientosCliente: props.oSSelecci.requerimientosCliente ? props.oSSelecci.requerimientosCliente : 'NINGUNO.',
      observacionesCliente: props.oSSelecci.observacionesCliente
        ? props.oSSelecci.observacionesCliente
        : `TRABAJO(S) REALIZADO(S):
  -LIMPIEZA Y REGULACIÓN DE FRENOS.
  -CAMBIO DE ACEITE Y FILTROS.
  -RELLENO DE FLUIDOS.
  -VERIFICACIÓN DE LUCES.
  -LAVADO DE CORTESÍA.
  -INSPECCIÓN 1.
  -INSPECCIÓN DE FILTRO DE AIRE.

OBSERVACIÓN(ES):
  -CLIENTE REVISA Y RETIRA LA UNIDAD CONFORME.`,

      igv: props.oSSelecci.igv ? props.oSSelecci.igv : props.igv,

      servicios: props.oSSelecci.servicios ? props.oSSelecci.servicios : [],
      requisiciones: props.oSSelecci.requisiciones ? props.oSSelecci.requisiciones : [],
      // repuestosDespachados: props.oSSelecci.repuestosDespachados ? props.oSSelecci.repuestosDespachados : [],
    },
    { deep: true }
  );
  useContextProvider(CTX_O_S, definicion_CTX_O_S);
  //#endregion DEFINICION CTX_O_S - NEW / EDIT

  //#region DEFINICION CTX_CLIENTE_OS
  const defini_CTX_CLIENTE_OS = useStore<IPersona>({
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
  useContextProvider(CTX_CLIENTE_OS, defini_CTX_CLIENTE_OS);
  //#endregion DEFINICION CTX_CLIENTE_OS

  //#region DEFINICION CTX_VEHICULO_OS
  // const defini_CTX_VEHICULO_OS = useStore<IVehiculo>({
  //   _id: '',
  //   idGrupoEmpresarial: '',
  //   idEmpresa: '',
  //   placa: '',
  //   idVehiculoMarca: '',
  //   vehiculoMarca: '',
  //   idVehiculoModelo: '',
  //   vehiculoModelo: '',
  //   vin: '',
  // });
  // useContextProvider(CTX_VEHICULO_OS, defini_CTX_VEHICULO_OS);
  //#endregion DEFINICION CTX_VEHICULO_OS

  //#region DEFINICION CTX_SERVICIO_SELECCIONADO
  // const elServicioSeleccionado = useStore<IServicio>({
  //   _id: '',
  //   activo: '',
  //   codigo: '',
  //   descripcion: '',
  //   precio: 0,
  // });
  // useContextProvider(CTX_SERVICIO_SELECCIONADO, elServicioSeleccionado);
  //#endregion DEFINICION CTX_SERVICIO_SELECCIONADO

  //#region CONTEXTOS
  const ctx_index_orden_servicio = useContext(CTX_INDEX_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const losTecnicos = useSignal([]);
  const tecnicoACTIVO = useSignal(false);
  const repuestosDespachados = useSignal<any>([]);
  const dataSerie = useSignal([]);

  const borrarServicio = useStore({
    _id: '',
    idAuxiliar: '',
    idKardex: '',
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

  let sumaTOTAL_servicios = 0;
  let subTOTAL_servicios = 0;
  let igvTOTAL_servicios = 0;

  let sumaTOTAL_requisiciones = 0;
  let subTOTAL_requisiciones = 0;
  let igvTOTAL_requisiciones = 0;

  let sumaTOTAL_repuestosDespachados = 0;
  let subTOTAL_repuestosDespachados = 0;
  let igvTOTAL_repuestosDespachados = 0;
  //*registros
  const obtenerTecnicosActivos = $(async () => {
    console.log('🥨🥨🥨🥨🥨');
    const tecns = await getTecnicosActivos({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });
    console.log('tecns', tecns.data);
    //  setTecnicos(tecns.data);
    // return tecns.data;
    losTecnicos.value = tecns.data;
  });

  const cantidadesDespachadas = $(async (requisici: any) => {
    // console.log('requisici::::::::::::::::::::::', requisici[0].cantidadDespachada.$numberDecimal);
    let cuantosDespachados = 0;
    for (const requi of requisici) {
      console.log('requi.cantidadDespachada::::::::::::::::::::::', requi.cantidadDespachada.$numberDecimal);
      if (requi.cantidadDespachada.$numberDecimal > 0) {
        repuestosDespachados.value.push({
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
          precioPEN: requi.precioPEN,
          ventaPEN: requi.ventaPEN,
          tipoEquivalencia: requi.tipoEquivalencia,
          factor: requi.factor,
          laEquivalencia: requi.laEquivalencia,
          cantidadDespachada: requi.cantidadDespachada,
          costoUnitarioPEN: requi.costoUnitarioPEN,
        });
        cuantosDespachados++;
      }
    }
    console.log('cuantosDespachados::::::::::::::::::::::', cuantosDespachados);
    console.log('first');
  });

  //* TASK *** aL INICIAL el COMPONENTE ***
  useTask$(async ({ track }) => {
    track(() => ini.value);
    console.log('inicializando..........................', definicion_CTX_O_S);
    cantidadesDespachadas(definicion_CTX_O_S.requisiciones);
    obtenerTecnicosActivos();
    if (definicion_CTX_O_S._id !== '') {
      //el tecnico esta ACTIVO???
      console.log('definicion_CTX_O_S.idTecnico', definicion_CTX_O_S.idTecnico);
      const verificarTEC = await getTecnico({ idTecnico: definicion_CTX_O_S.idTecnico });
      tecnicoACTIVO.value = verificarTEC.data.activo;
      // console.log('verificarTEC', verificarTEC);
      console.log('verificarTEC.data', verificarTEC.data);
      // console.log('verificarTEC.data.activo', verificarTEC.data.activo);
    } else {
      tecnicoACTIVO.value = true;
    }
    //
    if (definicion_CTX_O_S.idSerieOrdenServicio === '') {
      // obtenerSerie();
      const parametros = {
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idSucursal: parametrosGlobales.idSucursal,
      };
      //
      const lasSeries = await getSeriesActivasOrdenesServicio(parametros);
      dataSerie.value = lasSeries.data;
      console.log('dataSerie.value', dataSerie.value);
    }
    // definicion_CTX_O_S.igv = props.igv;
  });
  // console.log('inicializando..........................');
  //#endregion INICIALIZACION

  //#region ACTUALIZAR LOS TECNICOS
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.selecciono_Tecnico);
    if (definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.selecciono_Tecnico) {
      obtenerTecnicosActivos();
      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.selecciono_Tecnico = false;
    }
  });
  //#endregion ACTUALIZAR LOS TECNICOS

  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.selecciono_Persona);
    if (
      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.selecciono_Persona &&
      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.rol_Persona === 'cliente'
    ) {
      definicion_CTX_O_S.idCliente = defini_CTX_CLIENTE_OS._id;
      definicion_CTX_O_S.codigoTipoDocumentoIdentidad = defini_CTX_CLIENTE_OS.codigoTipoDocumentoIdentidad;
      definicion_CTX_O_S.tipoDocumentoIdentidad = defini_CTX_CLIENTE_OS.tipoDocumentoIdentidad;
      definicion_CTX_O_S.numeroIdentidad = defini_CTX_CLIENTE_OS.numeroIdentidad;
      definicion_CTX_O_S.razonSocialNombreCliente = defini_CTX_CLIENTE_OS.razonSocialNombre;
      console.log('  definicion_CTX_O_S.razonSocialNombre', definicion_CTX_O_S.razonSocialNombreCliente);

      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.rol_Persona = '';
      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.selecciono_Persona = false;
    }
  });
  //#endregion CLIENTE

  //#region VEHICULO
  // useTask$(({ track }) => {
  //   track(() => ctx_docs_orden_servicio.selecciono_Vehiculo0);
  //   if (ctx_docs_orden_servicio.selecciono_Vehiculo0) {
  //     definicion_CTX_O_S.idVehiculo = defini_CTX_VEHICULO_OS._id;
  //     definicion_CTX_O_S.placa = defini_CTX_VEHICULO_OS.placa;
  //     definicion_CTX_O_S.idVehiculoMarca = defini_CTX_VEHICULO_OS.idVehiculoMarca;
  //     definicion_CTX_O_S.vehiculoMarca = defini_CTX_VEHICULO_OS.vehiculoMarca;
  //     definicion_CTX_O_S.idVehiculoModelo = defini_CTX_VEHICULO_OS.idVehiculoModelo;
  //     definicion_CTX_O_S.vehiculoModelo = defini_CTX_VEHICULO_OS.vehiculoModelo;
  //     definicion_CTX_O_S.vin = defini_CTX_VEHICULO_OS.vin;

  //     ctx_docs_orden_servicio.selecciono_Vehiculo0 = false;
  //     document.getElementById('inputKilometraje')?.focus();
  //   }
  // });
  //#endregion VEHICULO

  //#region ELIMINAR SERVICIO
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarServicio);
    console.log('borrar SERVICIO...');
    if (definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarServicio > 0) {
      console.log('borrando SERVICIO EN APP...', definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarServicio);
      //borrar en la BD
      if (
        definicion_CTX_O_S._id !== '' &&
        typeof definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idServicioOS !== 'undefined' &&
        definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idServicioOS !== ''
      ) {
        console.log('borrando SERVICIO EN BD...', definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idServicioOS);
        await borrarServicioOS({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          idOrdenServicio: definicion_CTX_O_S._id,
          idServicioOS: definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idServicioOS,
        });
      }
      //borrar en la App
      const newItems: any = definicion_CTX_O_S.servicios.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarServicio
      );
      definicion_CTX_O_S.servicios = newItems;

      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idServicioOS = '';
      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarServicio = 0;
    }
  });
  //#endregion ELIMINAR SERVICIO

  //#region ELIMINAR REQUISICION
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarRequisicion);

    if (definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarRequisicion > 0) {
      //verificar si ya se a DESPACHADO
      if (definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idKardexRequisicion !== '') {
        console.log(
          'definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idKardexRequisicion definicion_CTX_O_S.requisiciones.length',
          definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idKardexRequisicion,
          definicion_CTX_O_S.requisiciones.length
        );
        if (definicion_CTX_O_S.requisiciones.length > 0) {
          const despachos: any = definicion_CTX_O_S.requisiciones.filter(
            (despa: any) => despa.idKardex === definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idKardexRequisicion
          );
          console.log('despachos', despachos);
          if (despachos[0].cantidadDespachada > 0) {
            alert('El artículo no puede ser eliminado debido a que ha sido despachado por almacén.');
            return;
          }
          //  else {
          //   await borrarRequisicionOS({
          //     idGrupoEmpresarial: definicion_CTX_O_S.idGrupoEmpresarial,
          //     idEmpresa: definicion_CTX_O_S.idEmpresa,
          //     idOrdenServicio: definicion_CTX_O_S._id,
          //     idRequisicionOS: despachos[0]._id,
          //   });
          // }
        }
      }

      //borrar en la BD
      console.log('borrando REQUISICION EN APP...', definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarRequisicion);
      if (
        definicion_CTX_O_S._id !== '' &&
        typeof definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idRequisicionOS !== 'undefined' &&
        definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idRequisicionOS !== ''
      ) {
        console.log('borrando REQUISICION EN BD...', definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idRequisicionOS);
        await borrarRequisicionOS({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          idOrdenServicio: definicion_CTX_O_S._id,
          idRequisicionOS: definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idRequisicionOS,
        });
      }
      //borrar en la App
      const newItems: any = definicion_CTX_O_S.requisiciones.filter(
        (docs: any) => docs.idAuxiliar !== definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarRequisicion
      );
      definicion_CTX_O_S.requisiciones = newItems;

      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idRequisicionOS = '';
      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idKardexRequisicion = '';
      definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.borrar_idAuxiliarRequisicion = 0;
    }
  });

  //#endregion ELIMINAR REQUISICION

  //#region ON SUBMIT
  const grabarOS = $(async () => {
    if (definicion_CTX_O_S.fechaInicio === '') {
      alert('Seleccione la fecha.');
      document.getElementById('inputFecha')?.focus();
      return;
    }
    if (definicion_CTX_O_S.idSerieOrdenServicio === '') {
      alert('Ingrese la serie');
      document.getElementById('selectSerieOrdenServicio')?.focus();
      return;
    }
    if (definicion_CTX_O_S.estado === '') {
      alert('Seleccione el estado.');
      document.getElementById('selectEstado')?.focus();
      return;
    }
    if (definicion_CTX_O_S.tipo === '') {
      alert('Seleccione el tipo de orden de servicio.');
      document.getElementById('selectTipo')?.focus();
      return;
    }
    if (definicion_CTX_O_S.idTecnico === '') {
      alert('Seleccione al técnico.');
      document.getElementById('selectTecnico')?.focus();
      return;
    }
    if (definicion_CTX_O_S.idCliente === '') {
      alert('Seleccione al cliente.');
      document.getElementById('selectTipoDocumentoLiteral')?.focus();
      return;
    }
    if (definicion_CTX_O_S.numeroIdentidad === '') {
      alert('Seleccione al cliente.');
      document.getElementById('selectTipoDocumentoLiteral')?.focus();
      return;
    }
    if (definicion_CTX_O_S.razonSocialNombreCliente === '') {
      alert('Seleccione al cliente.');
      document.getElementById('selectTipoDocumentoLiteral')?.focus();
      return;
    }
    if (definicion_CTX_O_S.idVehiculo === '') {
      alert('Seleccione el vehículo.');
      document.getElementById('inputPlaca')?.focus();
      return;
    }
    if (definicion_CTX_O_S.vehiculoMarca === '') {
      alert('Seleccione el vehículo.');
      document.getElementById('inputPlaca')?.focus();
      return;
    }
    if (definicion_CTX_O_S.kilometraje.toString().trim() === '') {
      //const kilo = parseFloat(oS.kilometraje);
      alert('Seleccione el kilometraje.');
      document.getElementById('inputKilometraje')?.focus();
      return;
    }

    const ordenS = await inUpOrdenServicio({
      idOrdenServicio: definicion_CTX_O_S._id,
      // idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      // idEmpresa: parametrosGlobales.idEmpresa,

      idGrupoEmpresarial: definicion_CTX_O_S.idGrupoEmpresarial,
      idEmpresa: definicion_CTX_O_S.idEmpresa,
      idSucursal: definicion_CTX_O_S.idSucursal,
      idPeriodo: definicion_CTX_O_S.idPeriodo,
      periodo: definicion_CTX_O_S.periodo,

      ruc: definicion_CTX_O_S.ruc,
      empresa: definicion_CTX_O_S.empresa,
      direccion: definicion_CTX_O_S.direccion,

      idSerieOrdenServicio: definicion_CTX_O_S.idSerieOrdenServicio,
      serie: definicion_CTX_O_S.serie,
      numero: definicion_CTX_O_S.numero,

      fechaInicio: definicion_CTX_O_S.fechaInicio,

      // correlativo: definicion_CTX_O_S.correlativo,
      estado: definicion_CTX_O_S.estado,
      tipo: definicion_CTX_O_S.tipo,
      idTecnico: definicion_CTX_O_S.idTecnico,
      razonSocialNombreTecnico: definicion_CTX_O_S.razonSocialNombreTecnico,

      idCliente: definicion_CTX_O_S.idCliente,
      codigoTipoDocumentoIdentidad: definicion_CTX_O_S.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_O_S.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_O_S.numeroIdentidad,
      razonSocialNombreCliente: definicion_CTX_O_S.razonSocialNombreCliente,

      igv: definicion_CTX_O_S.igv,

      idVehiculo: definicion_CTX_O_S.idVehiculo,
      placa: definicion_CTX_O_S.placa,
      idVehiculoMarca: definicion_CTX_O_S.idVehiculoMarca,
      vehiculoMarca: definicion_CTX_O_S.vehiculoMarca,
      idVehiculoModelo: definicion_CTX_O_S.idVehiculoModelo,
      vehiculoModelo: definicion_CTX_O_S.vehiculoModelo,
      vin: definicion_CTX_O_S.vin,
      kilometraje: definicion_CTX_O_S.kilometraje,

      requerimientosCliente: definicion_CTX_O_S.requerimientosCliente,
      observacionesCliente: definicion_CTX_O_S.observacionesCliente,

      servicios: definicion_CTX_O_S.servicios,
      requisiciones: definicion_CTX_O_S.requisiciones,
    });

    if (ordenS.status === 400) {
      alert('Falla al registrar la orden de servicio. ' + ordenS.message);
      return;
    }

    // console.log('graboooooo ordenS', ordenS);
    // ordenS = ordenS.data;
    // console.log('graboooooo ordenS.data', ordenS);
    // definicion_CTX_O_S._id = ordenS._id;
    // definicion_CTX_O_S.correlativo = ordenS.correlativo;
    // //SI TODO SE GRABA BIEN PERO EL correlativo AUN SIGUE COMO 0
    // //ENTONCES VOLVER A BUSCAR EL correlativo de la BASE DE DATOS
    // if (definicion_CTX_O_S.correlativo === 0) {
    //   console.log('definicion_CTX_O_S.correlativo===0');
    //   let reOS = await rebuscarCorrelativo({ idOrdenServicio: definicion_CTX_O_S._id });
    //   console.log('definicion_CTX_O_S.correlativo===0 reOS', reOS);
    //   reOS = reOS.data;
    //   definicion_CTX_O_S.correlativo = reOS.correlativo;
    // }
    // ctx_index_orden_servicio.actualizoOS = definicion_CTX_O_S._id;

    ctx_index_orden_servicio.grabo_OS = true;
    // ctx_index_cotizacion.mostrarPanelNewEditCotizacion = false;
    definicion_CTX_O_S._id = ordenS.data._id;
    definicion_CTX_O_S.numero = ordenS.data.numero;
    definicion_CTX_O_S.servicios = ordenS.data.servicios;
    definicion_CTX_O_S.requisiciones = ordenS.data.requisiciones;
  });
  //#endregion ON SUBMIT

  return (
    <div
      style={{
        width: 'clamp(338px, 86%, 800px)',
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
        <ImgButton
          src={images.x}
          alt="imagen de cerrar"
          height={16}
          width={16}
          title="Ver datos"
          onClick={$(() => {
            ctx_index_orden_servicio.mostrarPanelNewEditOrdenServicio = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="imagen de cerrar"
          height={16}
          width={16}
          title="Ver datos"
          onClick={$(() => {
            console.log('definicion_CTX_O_S', definicion_CTX_O_S);
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="imagen de cerrar"
          height={16}
          width={16}
          title="Ver datos"
          onClick={$(() => {
            console.log('props.oSSelecci', props.oSSelecci);
          })}
        />
        <ImgButton
          src={images.see}
          alt="imagen de cerrar"
          height={16}
          width={16}
          title="Ver datos"
          onClick={$(() => {
            console.log('props.igv', props.igv);
          })}
        />
        <ImgButton
          src={images.see}
          alt="imagen de cerrar"
          height={16}
          width={16}
          title="Ver datos"
          onClick={$(() => {
            console.log(' repuestosDespachados.value', repuestosDespachados.value);
          })}
        /> */}
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>Orden de servicio</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES */}
        <div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DE ORDEN DE SERVICIO */}
          <div>
            {/* fecha */}
            <div class="form-control form-control-check">
              <label>Fecha</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputFecha"
                  type="date"
                  style={{ width: '100%' }}
                  // disabled
                  min={props.addPeriodo.periodo.substring(0, 4) + '-' + props.addPeriodo.periodo.substring(4, 6) + '-01'}
                  max={ultimoDiaDelPeriodoX(props.addPeriodo.periodo)}
                  value={definicion_CTX_O_S.fechaInicio}
                  onChange$={(e) => {
                    definicion_CTX_O_S.fechaInicio = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            </div>
            {/* Numero de Orden de Servicio*/}
            <div class="form-control">
              <label>Serie</label>
              <div class="form-control form-agrupado">
                {definicion_CTX_O_S.idSerieOrdenServicio !== '' ? (
                  <input
                    id="inputSerieOrdenServicio"
                    style={{ width: '100%' }}
                    type="text"
                    disabled
                    value={
                      definicion_CTX_O_S._id === ''
                        ? definicion_CTX_O_S.serie
                        : definicion_CTX_O_S.serie + ' - ' + cerosALaIzquierda(definicion_CTX_O_S.numero, 8)
                    }
                  />
                ) : (
                  <select
                    id="selectSerieOrdenServicio"
                    onChange$={(e) => {
                      const idx = (e.target as HTMLSelectElement).selectedIndex;
                      const elSelect = e.target as HTMLSelectElement;
                      const elOption = elSelect[idx];
                      console.log('elOption', elOption.id);
                      definicion_CTX_O_S.idSerieOrdenServicio = elOption.id;
                      definicion_CTX_O_S.serie = (e.target as HTMLSelectElement).value;
                      // const elementoSerie: any = dataSerie.value.filter(
                      //   (cor: any) => cor.idSerieCotizacion === definicion_CTX_COTIZACION.idSerieCotizacion
                      // );
                      // // console.log('first', elementoSerie[0].correlativo);
                      // definicion_CTX_COTIZACION.numero = elementoSerie[0].correlativo;
                      document.getElementById('in_Fecha')?.focus();
                    }}
                  >
                    <option value="">-- Seleccione una serie --</option>
                    {dataSerie.value.map((ser: any) => {
                      return (
                        <option id={ser.idSerieOrdenServicio} value={ser.serie} selected={definicion_CTX_O_S.serie === ser.serie}>
                          {ser.serie}
                        </option>
                      );
                    })}
                  </select>
                )}
              </div>
            </div>
            {/* <div class="form-control">
              <label>Número</label>
              <div class="form-control form-agrupado">
                <input id="inputNumeroOS" style={{ width: '100%' }} type="text" disabled value={definicion_CTX_O_S.correlativo} />
              </div>
            </div> */}
            {/* Estado */}
            <div class="form-control">
              <label>Estado</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectEstado"
                  // value={oS.estado}
                  onChange$={(e) => {
                    definicion_CTX_O_S.estado = (e.target as HTMLSelectElement).value;
                  }}
                  style={{ width: '100%' }}
                >
                  <option value={'TERMINADO'} selected={definicion_CTX_O_S.estado === 'TERMINADO'}>
                    TERMINADO
                  </option>
                  <option value={'DE BAJA'} selected={definicion_CTX_O_S.estado === 'DE BAJA'}>
                    DE BAJA
                  </option>
                  <option value={'APERTURADO'} selected={definicion_CTX_O_S.estado === 'APERTURADO'}>
                    APERTURADO
                  </option>
                </select>
              </div>
            </div>
            {/* Tipo */}
            <div class="form-control">
              <label>Tipo</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectTipo"
                  // value={oS.tipo}
                  onChange$={(e) => {
                    definicion_CTX_O_S.tipo = (e.target as HTMLSelectElement).value;
                  }}
                  style={{ width: '100%' }}
                >
                  <option value={'MANTENIMIENTO'} selected={definicion_CTX_O_S.tipo === 'MANTENIMIENTO'}>
                    MANTENIMIENTO
                  </option>
                  <option value={'GARANTIA'} selected={definicion_CTX_O_S.tipo === 'GARANTIA'}>
                    GARANTIA
                  </option>
                  <option value={'SINIESTRO'} selected={definicion_CTX_O_S.tipo === 'SINIESTRO'}>
                    SINIESTRO
                  </option>
                  <option value={'PLANCHADO Y/O PINTURA'} selected={definicion_CTX_O_S.tipo === 'PLANCHADO Y/O PINTURA'}>
                    PLANCHADO Y/O PINTURA
                  </option>
                  <option value={'CAMPAÑA'} selected={definicion_CTX_O_S.tipo === 'CAMPAÑA'}>
                    CAMPAÑA
                  </option>
                </select>
              </div>
            </div>
            {/* Técnico */}
            <div class="form-control">
              <label>Técnico</label>
              <div class="form-control form-agrupado">
                {tecnicoACTIVO.value ? (
                  <>
                    <ElSelect
                      id={'selectTecnico'}
                      // elValor={oS.razonSocialNombreTecnico}
                      valorSeleccionado={definicion_CTX_O_S.razonSocialNombreTecnico}
                      registros={losTecnicos.value}
                      registroID={'idTecnico'}
                      registroTEXT={'razonSocialNombre'}
                      seleccione={'-- Seleccione un técnico --'}
                      // onChange={changeTecnico}
                      onChange={$(() => {
                        const elSelec = document.getElementById('selectTecnico') as HTMLSelectElement;
                        const elIdx = elSelec.selectedIndex;
                        definicion_CTX_O_S.idTecnico = elSelec[elIdx].id;
                        if (definicion_CTX_O_S.idTecnico === '') {
                          definicion_CTX_O_S.razonSocialNombreTecnico = '';
                        } else {
                          definicion_CTX_O_S.razonSocialNombreTecnico = elSelec.value;
                        }
                      })}
                    />
                    <ImgButton
                      src={images.three_dots2}
                      alt="imagen de buscar técnico"
                      height={16}
                      width={16}
                      title="Buscar datos de técnico"
                      // onClick={buscarTecnico}
                      onClick={$(() => {
                        // ctx_PanelVenta.mostrarPanelVenta = false;
                        // ctx_docs_orden_servicio.mostrarPanelSeleccionarPersonaTecnico0 = true;
                        definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarTecnico = true;
                      })}
                    />
                  </>
                ) : (
                  <input type="text" value={definicion_CTX_O_S.razonSocialNombreTecnico} disabled style={{ width: '100%' }} />
                )}

                {definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarTecnico && (
                  <div class="modal">
                    <BuscarTecnico contexto="orden_servicio" />
                  </div>
                )}
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL CLIENTE */}
          <div>
            {/* tipo de documento identidad*/}
            <div class="form-control">
              <label>Tipo documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectTipoDocumentoLiteral"
                  // value={oS.codigoTipoDocumentoIdentidad}
                  onChange$={(e) => {
                    // console.log('first', (e.target as HTMLSelectElement).value);
                    definicion_CTX_O_S.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                  }}
                  style={{ width: '100%' }}
                >
                  <option value={'1'} selected={definicion_CTX_O_S.codigoTipoDocumentoIdentidad === '1'}>
                    DNI
                  </option>
                  <option value={'6'} selected={definicion_CTX_O_S.codigoTipoDocumentoIdentidad === '6'}>
                    RUC
                  </option>
                  <option value={'4'} selected={definicion_CTX_O_S.codigoTipoDocumentoIdentidad === '4'}>
                    C.EXT
                  </option>
                </select>
                <ImgButton
                  id={'imgButtonSearchCliente'}
                  src={images.searchPLUS}
                  alt="imageso de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                  // onClick={buscarCliente}
                  onClick={$(() => {
                    definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarPersona = true;
                    // showAddOrdenServicio.value = true;
                  })}
                />
              </div>
            </div>
            {/* numero identidad*/}
            <div class="form-control">
              <label>Número identidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroIdentidad"
                  style={{ width: '100%' }}
                  type="text"
                  disabled
                  placeholder="Add número identidad"
                  value={definicion_CTX_O_S.numeroIdentidad}
                  onChange$={(e) => {
                    definicion_CTX_O_S.numeroIdentidad = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            </div>
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <label>Razón social / Nombre</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNombreCliente"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social / Nombre"
                  disabled
                  value={definicion_CTX_O_S.razonSocialNombreCliente}
                  onChange$={(e) => {
                    definicion_CTX_O_S.razonSocialNombreCliente = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarPersona && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={false} seleccionar="cliente" contexto="orden servicio" rol="cliente" />
            </div>
          )}
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            <div class="form-control">
              <label>IGV (%)</label>
              <div class="form-control form-agrupado">
                <input type="text" id="inputIGV" disabled value={definicion_CTX_O_S.igv + ' %'} style={{ width: '100%' }} />
              </div>
            </div>
          </div>
          {/* ----------------------------------------------------- */}
          <hr style={{ margin: '5px 0' }}></hr>
          {/* GENERALES DEL VEHICULO */}
          <div>
            {/* Placa */}
            <div class="form-control">
              <label>Placa</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputPlaca"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Add placa: AAA123, TRU789, XRW695"
                  value={definicion_CTX_O_S.placa}
                  // onKeyDown={(e) => (placaValida = validar_inputPlaca(e))}
                  // onChange={(e) => {
                  //   if (placaValida) {
                  //     setPlaca(e.target.value.trim().toUpperCase());
                  //   }
                  // }}
                  // onPaste={(event) => {
                  //   event.preventDefault();
                  //   event.stopPropagation();
                  // }}
                />
                <ImgButton
                  id={'imgButtonSearchVehiculo'}
                  src={images.searchPLUS}
                  alt="Imagen de buscar vehículo"
                  height={16}
                  width={16}
                  title="Buscar vehículo"
                  onClick={$(() => {
                    definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarVehiculo = true;
                  })}
                />
              </div>
            </div>
            {/* Marca */}
            <div class="form-control">
              <label>Marca</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputMarca"
                  style={{ width: '100%' }}
                  type="email"
                  placeholder="Marca"
                  disabled
                  value={definicion_CTX_O_S.vehiculoMarca}
                />
              </div>
            </div>
            {/* Modelo */}
            <div class="form-control">
              <label>Modelo</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputModelo"
                  style={{ width: '100%' }}
                  type="email"
                  placeholder="Modelo"
                  disabled
                  value={definicion_CTX_O_S.vehiculoModelo}
                />
              </div>
            </div>
            {/* VIN */}
            <div class="form-control">
              <label>VIN</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputVIN"
                  style={{ width: '100%' }}
                  type="email"
                  placeholder="VIN"
                  disabled
                  value={definicion_CTX_O_S.vin}
                />
              </div>
            </div>
            {/* Kilometraje */}
            <div class="form-control">
              <label>Kilometraje</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputKilometraje"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Add kilometraje"
                  value={definicion_CTX_O_S.kilometraje}
                  // onKeyDown$={(e) => {
                  //   const patron = /[A-Za-z0-9]/;
                  //   if (patron.test(e.key)) {
                  //     //A-a-0
                  //     if (
                  //       (e.keyCode >= 97 && e.keyCode <= 122) ||
                  //       (e.keyCode >= 65 && e.keyCode <= 90) ||
                  //       (e.keyCode >= 48 && e.keyCode <= 57)
                  //     ) {
                  //       console.log('VERDADEROOOOOO', e.key, e.keyCode, e);
                  //       // (e.target as HTMLInputElement).value = e.key;
                  //       // valido.value = true;
                  //       // vehiculo.placa = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  //       // vehiculo.placa = vehiculo.placa + e.key.toUpperCase();
                  //     } else {
                  //       console.log('FALSOOOOOOOOOO confir', e.key, e.keyCode, e);
                  //       // valido.value = false;
                  //       if (e.key === 'Escape') {
                  //         console.log('Escape');
                  //         document.getElementById('inputMarca')?.focus();
                  //         return;
                  //       }
                  //     }
                  //   } else {
                  //     console.log('FALSOOOOOOOOOO', e.key, e.keyCode, e);
                  //     // valido.value = false;
                  //     return;
                  //   }
                  // }}
                  onChange$={(e) => {
                    // const regex = /[A-Za-z0-9]/g;
                    definicion_CTX_O_S.kilometraje = parseFloat((e.target as HTMLInputElement).value);
                  }}
                  // onKeyDown={(e) => (kilometrajeValido = validar_inputKilometraje(e))}
                  // onChange={(e) => {
                  //   if (kilometrajeValido) {
                  //     setKilometraje(e.target.value);
                  //   }
                  // }}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarVehiculo && (
            <div class="modal">
              <BuscarVehiculo contexto="orden servicio" />
            </div>
          )}

          {/* ----------------------------------------------------- */}
        </div>
        {/* REQUERIMIENTOS DEL CLIENTE */}
        <div>
          <div
            style={{
              width: '676px',
            }}
          >
            <label>Requerimientos del cliente</label>
            <div>
              <textarea
                style={{ maxWidth: '100%' }}
                disabled={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
                cols={90}
                value={definicion_CTX_O_S.requerimientosCliente}
                onChange$={(e) => {
                  definicion_CTX_O_S.requerimientosCliente = (e.target as HTMLTextAreaElement).value;
                }}
                // onChange={(e) => {
                //   setRequerimientosCliente(e.target.value);
                // }}
              ></textarea>
            </div>
          </div>
          {/* ----------------------------------------------------- */}
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {/* OBSERVACIONES */}
        <div>
          <div
            style={{
              width: '676px',
            }}
          >
            <label>Observaciones</label>
            <div>
              <textarea
                style={{ maxWidth: '100%' }}
                disabled={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
                cols={90}
                value={definicion_CTX_O_S.observacionesCliente}
                onChange$={(e) => {
                  definicion_CTX_O_S.observacionesCliente = (e.target as HTMLTextAreaElement).value;
                }}
                // onChange={(e) => {
                //   setObservacionesCliente(e.target.value);
                // }}
              ></textarea>
            </div>
          </div>
          {/* ----------------------------------------------------- */}
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {/* BOTON SERVICIO */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '5px 0',
            }}
          >
            <div style={{ marginBottom: '5px' }}>
              {/* {typeof oS.correlativo === 'undefined' ? ( */}
              {definicion_CTX_O_S.estado !== 'APERTURADO' || definicion_CTX_O_S.numero === 0 ? (
                <ElButton
                  class="btn"
                  name="Add servicio"
                  disabled
                  title="Add servicio"
                  style={{ background: '#aaa', color: '#d3d3d3' }}
                />
              ) : (
                <ElButton
                  class="btn"
                  name="Add servicio"
                  title="Add servicio"
                  onClick={$(() => {
                    definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarServicio = true;
                  })}
                />
              )}
            </div>
            {definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarServicio && (
              <div class="modal">
                <BuscarServicio
                  contexto="orden servicio"
                  // ancho={'500px'}
                  // seleccionar={'servicio'}
                  // // inicializacion={inicializarItemVenta}
                  // parametrosGlobales={parametrosGlobales}
                  // onAddServicioAOrdenServicio={upOrdenServicio_Servicio}
                  // onCerrar={cerrarPanelNewEditServicio}
                />
              </div>
            )}
            {/* TABLA SERVICIOS  */}
            {definicion_CTX_O_S.servicios.length > 0 ? (
              <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>Precio Uni</th>
                    <th>Venta </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_O_S.servicios.map((iTSer: any, index: any) => {
                    const indexItemServi = index + 1;

                    sumaTOTAL_servicios =
                      sumaTOTAL_servicios +
                      redondeo2Decimales(iTSer.ventaPEN.$numberDecimal ? iTSer.ventaPEN.$numberDecimal : iTSer.ventaPEN);
                    subTOTAL_servicios = redondeo2Decimales((sumaTOTAL_servicios * 100) / (100 + definicion_CTX_O_S.igv));
                    igvTOTAL_servicios = redondeo2Decimales(sumaTOTAL_servicios - subTOTAL_servicios);

                    // if (index + 1 === definicion_CTX_O_S.servicios.length) {
                    //   console.log(subTOTAL);
                    //   console.log(igvTOTAL);
                    //   console.log(sumaTOTAL);
                    //   fijarMontosServicios({ subTOTAL, igvTOTAL, sumaTOTAL });
                    // }
                    return (
                      <tr key={iTSer.idAuxiliar}>
                        <td data-label="Ítem" key={iTSer.idAuxiliar}>{`${cerosALaIzquierda(indexItemServi, 3)}`}</td>
                        <td data-label="Código">{iTSer.codigo}</td>
                        <td data-label="Descripción">{iTSer.descripcionEquivalencia}</td>
                        <td data-label="Cantidad" style={{ textAlign: 'end' }}>
                          <input
                            disabled={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
                            style={{ width: '60px', textAlign: 'end' }}
                            value={iTSer.cantidad.$numberDecimal ? iTSer.cantidad.$numberDecimal : iTSer.cantidad}
                            onChange$={(e) => {
                              // const iv = itemsVentaK[index];
                              iTSer.cantidad = parseFloat((e.target as HTMLInputElement).value);

                              iTSer.ventaPEN =
                                (iTSer.cantidad ? iTSer.cantidad : iTSer.cantidad.$numberDecimal) *
                                (iTSer.precioPEN ? iTSer.precioPEN : iTSer.precioPEN.$numberDecimal);
                            }}
                          />
                        </td>
                        <td data-label="Uni">{iTSer.unidadEquivalencia}</td>
                        <td data-label="Precio Uni" style={{ textAlign: 'end' }}>
                          <input
                            disabled={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
                            style={{ width: '60px', textAlign: 'end' }}
                            value={iTSer.precioPEN.$numberDecimal ? iTSer.precioPEN.$numberDecimal : iTSer.precioPEN}
                            onChange$={(e) => {
                              const precio = parseFloat((e.target as HTMLInputElement).value);
                              console.log('el precio modificado', precio);

                              iTSer.precioPEN = precio;
                              console.log('el precio modificado, cant', iTSer.precioPEN, iTSer.cantidad);
                              iTSer.ventaPEN =
                                (iTSer.cantidad ? iTSer.cantidad : iTSer.cantidad.$numberDecimal) *
                                (iTSer.precioPEN ? iTSer.precioPEN : iTSer.precioPEN.$numberDecimal);
                            }}
                          />
                        </td>
                        <td data-label="Venta" style={{ textAlign: 'end' }}>
                          {/* {iTSer.ventaPEN ? iTSer.ventaPEN : iTSer.ventaPEN.$numberDecimal} */}
                          {iTSer.ventaPEN.$numberDecimal ? iTSer.ventaPEN.$numberDecimal : iTSer.ventaPEN}
                          {/* {iTSer.ventaPEN
                            ? redondeo2Decimales(iTSer.ventaPEN)
                            : redondeo2Decimales(iTSer.ventaPEN.$numberDecimal)} */}
                        </td>
                        <td data-label="Acciones" style={{ textAlign: 'center' }}>
                          <ImgButton
                            src={images.trash}
                            alt="icono de eliminar"
                            hidden={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
                            height={12}
                            width={12}
                            title="Eliminar ítem"
                            onClick={$(() => {
                              borrarServicio._id = iTSer._id;
                              borrarServicio.idAuxiliar = iTSer.idAuxiliar;
                              borrarServicio.item = indexItemServi;
                              borrarServicio.codigo = iTSer.codigo;
                              borrarServicio.descripcion = iTSer.descripcionEquivalencia;

                              definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBorrarServicioOS = true;
                            })}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      Sub total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${subTOTAL_servicios.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      IGV
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${igvTOTAL_servicios.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${sumaTOTAL_servicios.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              // <TablaServicios
              //   registros={servicios}
              //   onDel={botonDeleteItemTablaServicios}
              //   actualizarServicio={upServicio}
              //   fijarMontosTotales={fijarMontosTotalesServicios}
              // />
              <i style={{ fontSize: '0.7rem' }}>No existen servicios</i>
            )}
            {definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBorrarServicioOS && (
              <div class="modal">
                <BorrarServicioOS borrarServicio={borrarServicio} />
              </div>
            )}
          </div>
          {/* ----------------------------------------------------- */}
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {/* BOTON REQUISICION */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '5px 0',
            }}
          >
            <div style={{ marginBottom: '5px' }}>
              {definicion_CTX_O_S.estado !== 'APERTURADO' || definicion_CTX_O_S.numero === 0 ? (
                <ElButton
                  class="btn"
                  name="Add requisición"
                  disabled
                  title="Add requisición"
                  style={{ background: '#aaa', color: '#d3d3d3' }}
                />
              ) : (
                <ElButton
                  class="btn"
                  name="Add requisición"
                  title="Add requisición"
                  // onClick={botonShowPanelAlmacen_Requisicion}
                  onClick={$(() => {
                    definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarMercaderiaOUT = true;
                  })}
                />
              )}
            </div>

            {definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBuscarMercaderiaOUT && (
              <div class="modal">
                <BuscarMercaderiaOUT contexto="orden servicio" esAlmacen={false} />
              </div>
            )}
            {/* TABLA REQUISICIONES */}
            {definicion_CTX_O_S.requisiciones.length > 0 ? (
              <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                <thead>
                  <tr>
                    <th>Ítem</th>
                    <th>Kx</th>
                    <th>Código</th>
                    <th>Descripción</th>
                    <th>Cantidad</th>
                    <th>Uni</th>
                    <th>Precio Uni</th>
                    <th>Venta </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {definicion_CTX_O_S.requisiciones.map((iTRequi: any, index: any) => {
                    const indexItemRequi = index + 1;

                    sumaTOTAL_requisiciones =
                      sumaTOTAL_requisiciones +
                      redondeo2Decimales(iTRequi.ventaPEN.$numberDecimal ? iTRequi.ventaPEN.$numberDecimal : iTRequi.ventaPEN);
                    subTOTAL_requisiciones = redondeo2Decimales((sumaTOTAL_requisiciones * 100) / (100 + definicion_CTX_O_S.igv));
                    igvTOTAL_requisiciones = redondeo2Decimales(sumaTOTAL_requisiciones - subTOTAL_requisiciones);

                    return (
                      <tr key={iTRequi.idAuxiliar}>
                        <td data-label="Ítem" key={iTRequi.idAuxiliar}>{`${cerosALaIzquierda(indexItemRequi, 3)}`}</td>
                        <td data-label="Kx">
                          {typeof iTRequi.idKardex !== 'undefined' && iTRequi.idKardex !== ''
                            ? iTRequi.idKardex.substring(iTRequi.idKardex.length - 6)
                            : ''}
                        </td>
                        <td data-label="Código">{iTRequi.codigo}</td>
                        <td data-label="Descripción">{iTRequi.descripcionEquivalencia}</td>
                        <td data-label="Cantidad" style={{ textAlign: 'end' }}>
                          <input
                            disabled={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
                            style={{ width: '60px', textAlign: 'end' }}
                            value={iTRequi.cantidad.$numberDecimal ? iTRequi.cantidad.$numberDecimal : iTRequi.cantidad}
                            onChange$={(e) => {
                              iTRequi.cantidad = parseFloat((e.target as HTMLInputElement).value);

                              iTRequi.ventaPEN =
                                (iTRequi.cantidad ? iTRequi.cantidad : iTRequi.cantidad.$numberDecimal) *
                                (iTRequi.precioPEN ? iTRequi.precioPEN : iTRequi.precioPEN.$numberDecimal);
                            }}
                          />
                        </td>
                        <td data-label="Uni">{iTRequi.unidadEquivalencia}</td>
                        <td data-label="Precio Uni" style={{ textAlign: 'end' }}>
                          <input
                            disabled={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
                            style={{ width: '60px', textAlign: 'end' }}
                            value={iTRequi.precioPEN.$numberDecimal ? iTRequi.precioPEN.$numberDecimal : iTRequi.precioPEN}
                            onChange$={(e) => {
                              const precio = parseFloat((e.target as HTMLInputElement).value);
                              console.log('el precio modificado', precio);

                              iTRequi.precioPEN = precio;
                              console.log('el precio modificado, cant', iTRequi.precioPEN, iTRequi.cantidad);
                              iTRequi.ventaPEN =
                                (iTRequi.cantidad ? iTRequi.cantidad : iTRequi.cantidad.$numberDecimal) *
                                (iTRequi.precioPEN ? iTRequi.precioPEN : iTRequi.precioPEN.$numberDecimal);
                            }}
                          />
                        </td>
                        <td data-label="Venta" style={{ textAlign: 'end' }}>
                          {iTRequi.ventaPEN.$numberDecimal ? iTRequi.ventaPEN.$numberDecimal : iTRequi.ventaPEN}
                        </td>
                        <td data-label="Acciones" style={{ textAlign: 'center' }}>
                          <ImgButton
                            src={images.trash}
                            alt="icono de eliminar"
                            hidden={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
                            height={12}
                            width={12}
                            title="Eliminar ítem"
                            onClick={$(() => {
                              borrarRequisicion._id = iTRequi._id;
                              borrarRequisicion.idAuxiliar = iTRequi.idAuxiliar;
                              borrarRequisicion.idKardex = iTRequi.idKardex;
                              borrarRequisicion.item = indexItemRequi;
                              borrarRequisicion.codigo = iTRequi.codigo;
                              borrarRequisicion.descripcion = iTRequi.descripcionEquivalencia;

                              definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBorrarRequisicionOS = true;
                            })}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      Sub total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${subTOTAL_requisiciones.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      IGV
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${igvTOTAL_requisiciones.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'end' }}>
                      Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${sumaTOTAL_requisiciones.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <i style={{ fontSize: '0.7rem' }}>No existen requisiciones</i>
            )}
            {definicion_CTX_NEW_EDIT_ORDEN_SERVICIO.mostrarPanelBorrarRequisicionOS && (
              <div class="modal">
                <BorrarRequisicionOS borrarRequisicion={borrarRequisicion} />
              </div>
            )}
          </div>
          {/* ----------------------------------------------------- */}
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {/* REPUESTOS DESPACHADOS */}
        <div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              margin: '5px 0',
            }}
          >
            <div style={{ marginBottom: '5px' }}>Ítems despachados</div>
            {/* TABLA REPUESTOS DESPACHADOS  */}
            <div>
              {repuestosDespachados.value.length > 0 ? (
                <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Kx</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad Despachada</th>
                      <th>Uni</th>
                      <th>Precio Uni</th>
                      <th>Venta </th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {repuestosDespachados.value.map((iTRepuDespachado: any, index: any) => {
                      const indexItemRequiDespachados = index + 1;

                      sumaTOTAL_repuestosDespachados =
                        sumaTOTAL_repuestosDespachados +
                        (iTRepuDespachado.cantidadDespachada.$numberDecimal
                          ? iTRepuDespachado.cantidadDespachada.$numberDecimal
                          : iTRepuDespachado.cantidadDespachada) *
                          (iTRepuDespachado.precioPEN.$numberDecimal
                            ? iTRepuDespachado.precioPEN.$numberDecimal
                            : iTRepuDespachado.precioPEN);
                      subTOTAL_repuestosDespachados = redondeo2Decimales(
                        (sumaTOTAL_repuestosDespachados * 100) / (100 + definicion_CTX_O_S.igv)
                      );
                      igvTOTAL_repuestosDespachados = redondeo2Decimales(
                        sumaTOTAL_repuestosDespachados - subTOTAL_repuestosDespachados
                      );

                      return (
                        <tr key={iTRepuDespachado.idAuxiliar}>
                          <td data-label="Ítem" key={iTRepuDespachado.idAuxiliar}>{`${cerosALaIzquierda(
                            indexItemRequiDespachados,
                            3
                          )}`}</td>
                          <td data-label="Kx">
                            {typeof iTRepuDespachado.idKardex !== 'undefined' && iTRepuDespachado.idKardex !== ''
                              ? iTRepuDespachado.idKardex.substring(iTRepuDespachado.idKardex.length - 6)
                              : ''}
                          </td>
                          <td data-label="Código">{iTRepuDespachado.codigo}</td>
                          <td data-label="Descripción">{iTRepuDespachado.descripcionEquivalencia}</td>
                          <td data-label="Cantidad despachada" style={{ textAlign: 'end' }}>
                            {iTRepuDespachado.cantidadDespachada.$numberDecimal
                              ? iTRepuDespachado.cantidadDespachada.$numberDecimal
                              : iTRepuDespachado.cantidadDespachada}
                          </td>
                          <td data-label="Uni">{iTRepuDespachado.unidadEquivalencia}</td>
                          <td data-label="Precio Uni" style={{ textAlign: 'end' }}>
                            {iTRepuDespachado.precioPEN.$numberDecimal
                              ? iTRepuDespachado.precioPEN.$numberDecimal
                              : iTRepuDespachado.precioPEN}
                          </td>
                          <td data-label="Venta" style={{ textAlign: 'end' }}>
                            {(iTRepuDespachado.cantidadDespachada.$numberDecimal
                              ? iTRepuDespachado.cantidadDespachada.$numberDecimal
                              : iTRepuDespachado.cantidadDespachada) *
                              (iTRepuDespachado.precioPEN.$numberDecimal
                                ? iTRepuDespachado.precioPEN.$numberDecimal
                                : iTRepuDespachado.precioPEN)}
                          </td>
                          <td data-label="Acciones" style={{ textAlign: 'center' }}></td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'end' }}>
                        Sub total
                      </td>
                      <td colSpan={1} style={{ textAlign: 'end' }}>
                        {`${subTOTAL_repuestosDespachados.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'end' }}>
                        IGV
                      </td>
                      <td colSpan={1} style={{ textAlign: 'end' }}>
                        {`${igvTOTAL_repuestosDespachados.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'end' }}>
                        Total
                      </td>
                      <td colSpan={1} style={{ textAlign: 'end' }}>
                        {`${sumaTOTAL_repuestosDespachados.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <i style={{ fontSize: '0.7rem' }}>No existen repuestos despachados</i>
              )}
            </div>
          </div>
          {/* ----------------------------------------------------- */}
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          type="button"
          disabled={definicion_CTX_O_S.estado === 'APERTURADO' ? false : true}
          value={definicion_CTX_O_S.numero === 0 ? 'Aperturar orden de servicio' : `Grabar`}
          class="btn-centro"
          // onClick={(e) => onSubmit(e)}
          onClick$={() => grabarOS()}
        />
      </div>
    </div>
  );
});

// const obtenerTecnicosActivos = getTecnicosActivos({
//   idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
//   idEmpresa: parametrosGlobales.idEmpresa,
// });
// // console.log('(obtenerTecnicosActivos.data)', obtenerTecnicosActivos.data);
// obtenerTecnicosActivos.then((res) => {
//   console.log('(res)', res);
//   console.log('(res.data)', res.data);
// });
// obtenerTecnicosActivos.catch((err) => {
//   console.log('(err)', err.message);
// });
