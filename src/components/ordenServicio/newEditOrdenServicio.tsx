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
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { cerosALaIzquierda, hoy, redondeo2Decimales } from '~/functions/comunes';
import ElSelect from '../system/elSelect';
import { getTecnicosActivos } from '~/apis/tecnico.api';
import { parametrosGlobales } from '~/routes/login';
// import { trace } from 'console';
import SeleccionarTecnico from './seleccionarTecnico';
import SeleccionarPersona from './seleccionarPersona';
// import { IPersona } from '../miscelanea/persona/seleccionarPersona';
import SeleccionarVehiculo from './seleccionarVehiculo';
import { IVehiculo } from '~/interfaces/iVehiculo';
import ElButton from '../system/elButton';
import SeleccionarServicio from './seleccionarServicio';
// import { IServicio } from '~/interfaces/iServicio';
import { inUpOrdenServicio, rebuscarCorrelativo } from '~/apis/ordenServicio.api';
import { IOrdenServicio } from '~/interfaces/iOrdenServicio';
// import style from '../tabla.css?inline';
import style from '../tabla/tabla.css?inline';
import BusquedaMercaderiaOUT from './busquedaMercaderiaOUT';
import { IPersona } from '~/interfaces/iPersona';

export const CTX_O_S = createContextId<IOrdenServicio>('os');

export const CTX_CLIENTE_SELECCIONADO = createContextId<IPersona>('cliente');
export const CTX_VEHICULO_SELECCIONADO = createContextId<IVehiculo>('vehiculo');
// export const CTX_SERVICIO_SELECCIONADO = createContextId<IServicio>('servicio');

export default component$((props: { oSSelecci: any }) => {
  useStylesScoped$(style);
  //#region DEFINICION CTX_O_S - NEW / EDIT
  const definicion_CTX_O_S = useStore<IOrdenServicio>(
    {
      _id: props.oSSelecci._id ? props.oSSelecci._id : '',
      igv: props.oSSelecci.igv ? props.oSSelecci.igv : 0,
      fechaInicio: props.oSSelecci.fechaInicio ? props.oSSelecci.fechaInicio.substring(0, 10) : hoy(),
      // fechaInicio: props.oSSelecci.fechaInicio ? formatoDDMMYYYY_PEN(props.oSSelecci.fechaInicio) : hoy(),
      // fechaInicio: props.oSSelecci.fechaInicio ? '2025-05-25' : hoy(),
      // fechaInicio: props.oSSelecci.fechaInicio ? formatoDDMMYYYY_PEN('2023-05-25T00:00:00.000Z') : hoy(),

      correlativo: props.oSSelecci.correlativo ? props.oSSelecci.correlativo : 0,
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

      servicios: props.oSSelecci.servicios ? props.oSSelecci.servicios : [],
      requisiciones: props.oSSelecci.requisiciones ? props.oSSelecci.requisiciones : [],
      repuestosDespachados: props.oSSelecci.repuestosDespachados ? props.oSSelecci.repuestosDespachados : [],
    },
    { deep: true }
  );
  useContextProvider(CTX_O_S, definicion_CTX_O_S);
  //#endregion DEFINICION CTX_O_S - NEW / EDIT

  //#region DEFINICION CTX_CLIENTE_SELECCIONADO
  const elClienteSeleccionado = useStore<IPersona>({
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
  useContextProvider(CTX_CLIENTE_SELECCIONADO, elClienteSeleccionado);
  //#endregion DEFINICION CTX_CLIENTE_SELECCIONADO

  //#region DEFINICION CTX_VEHICULO_SELECCIONADO
  const elVehiculoSeleccionado = useStore<IVehiculo>({
    _id: '',
    idGrupoEmpresarial: '',
    idEmpresa: '',
    placa: '',
    idVehiculoMarca: '',
    vehiculoMarca: '',
    idVehiculoModelo: '',
    vehiculoModelo: '',
    vin: '',
  });
  useContextProvider(CTX_VEHICULO_SELECCIONADO, elVehiculoSeleccionado);
  //#endregion DEFINICION CTX_VEHICULO_SELECCIONADO

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
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  //*ini variables
  const ini = useSignal(0);
  const losTecnicos = useSignal([]);

  let sumaTOTAL = 0;
  let subTOTAL = 0;
  let igvTOTAL = 0;
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

  //* TASK *** aL INICIAL el COMPONENTE ***
  useTask$(async ({ track }) => {
    track(() => ini.value);
    console.log('inicializando..........................', definicion_CTX_O_S);
    obtenerTecnicosActivos();
  });
  // console.log('inicializando..........................');
  //#endregion INICIALIZACION

  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => ctx_docs_orden_servicio.selecciono_Cliente0);
    if (ctx_docs_orden_servicio.selecciono_Cliente0) {
      definicion_CTX_O_S.idCliente = elClienteSeleccionado._id;
      definicion_CTX_O_S.codigoTipoDocumentoIdentidad = elClienteSeleccionado.codigoTipoDocumentoIdentidad;
      definicion_CTX_O_S.tipoDocumentoIdentidad = elClienteSeleccionado.tipoDocumentoIdentidad;
      definicion_CTX_O_S.numeroIdentidad = elClienteSeleccionado.numeroIdentidad;
      definicion_CTX_O_S.razonSocialNombreCliente = elClienteSeleccionado.razonSocialNombre;
      console.log('  definicion_CTX_O_S.razonSocialNombre', definicion_CTX_O_S.razonSocialNombreCliente);
      ctx_docs_orden_servicio.selecciono_Cliente0 = false;
    }
  });
  //#endregion CLIENTE

  //#region VEHICULO
  useTask$(({ track }) => {
    track(() => ctx_docs_orden_servicio.selecciono_Vehiculo0);
    if (ctx_docs_orden_servicio.selecciono_Vehiculo0) {
      definicion_CTX_O_S.idVehiculo = elVehiculoSeleccionado._id;
      definicion_CTX_O_S.placa = elVehiculoSeleccionado.placa;
      definicion_CTX_O_S.idVehiculoMarca = elVehiculoSeleccionado.idVehiculoMarca;
      definicion_CTX_O_S.vehiculoMarca = elVehiculoSeleccionado.vehiculoMarca;
      definicion_CTX_O_S.idVehiculoModelo = elVehiculoSeleccionado.idVehiculoModelo;
      definicion_CTX_O_S.vehiculoModelo = elVehiculoSeleccionado.vehiculoModelo;
      definicion_CTX_O_S.vin = elVehiculoSeleccionado.vin;

      ctx_docs_orden_servicio.selecciono_Vehiculo0 = false;
      document.getElementById('inputKilometraje')?.focus();
    }
  });
  //#endregion VEHICULO

  //#region SERVICIOS
  // const fijarMontosServicios = $((e: any) => {
  //   console.log(' eee', e);

  //   console.log('eeeeeeeeeeeeeeeeee', e);

  //   // definicion_CTX_O_S.montoSubTotalPEN = e.subTOTAL;
  //   // definicion_CTX_O_S.montoIGVPEN = e.igvTOTAL;
  //   // definicion_CTX_O_S.montoTotalPEN = e.sumaTOTAL;
  //   // console.log('first', definicion_CTX_O_S.montoSubTotalPEN, definicion_CTX_O_S.montoIGVPEN, definicion_CTX_O_S.montoTotalPEN);
  //   // definicion_CTX_O_S.montoSubTotalUSD = 0;
  //   // definicion_CTX_O_S.montoIGVUSD = 0;
  //   // definicion_CTX_O_S.montoTotalUSD = 0;
  // });
  //#endregion SERVICIOS

  //#region ON SUBMIT
  const grabar = $(async () => {
    if (definicion_CTX_O_S.fechaInicio === '') {
      alert('Seleccione la fecha.');
      document.getElementById('inputFecha')?.focus();
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

    let ordenS = await inUpOrdenServicio({
      idOrdenServicio: definicion_CTX_O_S._id,
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,

      fechaInicio: definicion_CTX_O_S.fechaInicio,
      correlativo: definicion_CTX_O_S.correlativo,
      estado: definicion_CTX_O_S.estado,
      tipo: definicion_CTX_O_S.tipo,
      idTecnico: definicion_CTX_O_S.idTecnico,
      razonSocialNombreTecnico: definicion_CTX_O_S.razonSocialNombreTecnico,

      idCliente: definicion_CTX_O_S.idCliente,
      codigoTipoDocumentoIdentidad: definicion_CTX_O_S.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_O_S.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_O_S.numeroIdentidad,
      razonSocialNombreCliente: definicion_CTX_O_S.razonSocialNombreCliente,

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
    });

    console.log('graboooooo ordenS', ordenS);
    ordenS = ordenS.data;
    console.log('graboooooo ordenS.data', ordenS);
    definicion_CTX_O_S._id = ordenS._id;
    definicion_CTX_O_S.correlativo = ordenS.correlativo;
    //SI TODO SE GRABA BIEN PERO EL correlativo AUN SIGUE COMO 0
    //ENTONCES VOLVER A BUSCAR EL correlativo de la BASE DE DATOS
    if (definicion_CTX_O_S.correlativo === 0) {
      console.log('definicion_CTX_O_S.correlativo===0');
      let reOS = await rebuscarCorrelativo({ idOrdenServicio: definicion_CTX_O_S._id });
      console.log('definicion_CTX_O_S.correlativo===0 reOS', reOS);
      reOS = reOS.data;
      definicion_CTX_O_S.correlativo = reOS.correlativo;
    }
    ctx_docs_orden_servicio.actualizoOS = definicion_CTX_O_S._id;
  });
  //#endregion ON SUBMIT

  return (
    <div
      style={{
        width: 'auto',
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
          alt="imageso de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            // ctx_PanelVenta.mostrarPanelVenta = false;
            ctx_docs_orden_servicio.mostrarAddOrderServicio0 = false;
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
        <ImgButton
          src={images.see}
          alt="imagen de cerrar"
          height={16}
          width={16}
          title="Ver datos"
          onClick={$(() => {
            console.log('props.oSSelecci', props.oSSelecci);
          })}
        />
      </div>
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
                  disabled
                  value={definicion_CTX_O_S.fechaInicio}
                  onChange$={(e) => {
                    definicion_CTX_O_S.fechaInicio = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            </div>
            {/* Numero de Orden de Servicio*/}
            <div class="form-control">
              <label>Número</label>
              <div class="form-control form-agrupado">
                <input id="inputNumeroOS" style={{ width: '100%' }} type="text" disabled value={definicion_CTX_O_S.correlativo} />
              </div>
            </div>
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
                <ElSelect
                  id={'selectTecnico'}
                  // elValor={oS.razonSocialNombreTecnico}
                  valorSeleccionado={definicion_CTX_O_S.razonSocialNombreTecnico}
                  registros={losTecnicos.value}
                  registroID={'idTecnico'}
                  registroTEXT={'razonSocialNombreTecnico'}
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
                    ctx_docs_orden_servicio.mostrarPanelSeleccionarPersonaTecnico0 = true;
                  })}
                />
                {ctx_docs_orden_servicio.mostrarPanelSeleccionarPersonaTecnico0 && (
                  <div class="modal">
                    <SeleccionarTecnico
                      seleccionar={'técnico'}
                      soloPersonasNaturales={true}
                      // ancho={'500px'}
                      // parametrosGlobales={parametrosGlobales}
                      // onCerrar={cerrarPanelSeleccionarPersonaTecnico}
                    />
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
                <ImgButton
                  id={'imgButtonSearchCliente'}
                  src={images.searchPLUS}
                  alt="imageso de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                  // onClick={buscarCliente}
                  onClick={$(() => {
                    ctx_docs_orden_servicio.mostrarPanelSeleccionarPersona0 = true;
                    // showAddOrdenServicio.value = true;
                  })}
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
          {ctx_docs_orden_servicio.mostrarPanelSeleccionarPersona0 && (
            <div class="modal">
              <SeleccionarPersona
                // ancho={'520px'}
                // parametrosGlobales={parametrosGlobales}
                soloPersonasNaturales={false}
                seleccionar={'cliente'}
                // onCerrar={cerrarPanelSeleccionarPersonaCliente}
              />
            </div>
          )}
          {/* ----------------------------------------------------- */}
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
                    ctx_docs_orden_servicio.mostrarPanelSeleccionarVehiculo0 = true;
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
          {ctx_docs_orden_servicio.mostrarPanelSeleccionarVehiculo0 && (
            <div class="modal">
              <SeleccionarVehiculo />
            </div>
          )}
          {/* {showPanelRegistrarVehiculo && (
            <Modal
              componente={
                <NewEditVehiculo
                  ancho={'370px'}
                  inPlaca={placa}
                  parametrosGlobales={parametrosGlobales}
                  onCerrar={cerrarPanelRegistrarVehiculo}
                />
              }
            />
          )} */}
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
              {definicion_CTX_O_S.correlativo === 0 ? (
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
                    ctx_docs_orden_servicio.mostrarPanelSeleccionarServicio0 = true;
                  })}
                />
              )}
            </div>
            {ctx_docs_orden_servicio.mostrarPanelSeleccionarServicio0 && (
              <div class="modal">
                <SeleccionarServicio
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

                    sumaTOTAL =
                      sumaTOTAL +
                      redondeo2Decimales(iTSer.ventaPEN.$numberDecimal ? iTSer.ventaPEN.$numberDecimal : iTSer.ventaPEN);
                    subTOTAL = redondeo2Decimales((sumaTOTAL * 100) / (100 + definicion_CTX_O_S.igv));
                    igvTOTAL = redondeo2Decimales(sumaTOTAL - subTOTAL);

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
                          <ImgButton src={images.trash} alt="icono de eliminar" height={12} width={12} title="Eliminar ítem" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ display: 'flex', alignContent: 'center', border: '1px solid red' }}>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      Sub total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${subTOTAL.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr style={{ display: 'flex', alignContent: 'end', border: '1px solid green' }}>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      IGV
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${igvTOTAL.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr style={{ display: 'flex', alignContent: 'center', border: '1px solid red' }}>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${sumaTOTAL.toLocaleString('en-PE', {
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
            {/*    {showPanelDeleteItemTablaServicios && (
              <Modal componente={<PanelMensajeSiNo ancho={'500px'} onCerrar={cerrarPanelDeleteItemTablaServicios} />} />
            )}*/}
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
              {definicion_CTX_O_S.correlativo === 0 ? (
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
                    ctx_docs_orden_servicio.mostrarPanelBusquedaMercaderiaOUT = true;
                  })}
                />
              )}
            </div>

            {ctx_docs_orden_servicio.mostrarPanelBusquedaMercaderiaOUT && (
              <div class="modal">
                <BusquedaMercaderiaOUT
                  esAlmacen={false}
                  // ancho={'740px'}
                  // parametrosGlobales={parametrosGlobales}
                  // onAddItemVenta={upOrdenServicio_Requisicion}
                  // onCerrar={() => {
                  //   setShowPanelAlmacen_Requisicion(false);
                  // }}
                />
              </div>
            )}
            {/* TABLA REQUISICIONES */}
            {definicion_CTX_O_S.requisiciones.length > 0 ? (
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
                  {definicion_CTX_O_S.requisiciones.map((iTRequi: any, index: any) => {
                    const indexItemRequi = index + 1;

                    sumaTOTAL =
                      sumaTOTAL +
                      redondeo2Decimales(iTRequi.ventaPEN.$numberDecimal ? iTRequi.ventaPEN.$numberDecimal : iTRequi.ventaPEN);
                    subTOTAL = redondeo2Decimales((sumaTOTAL * 100) / (100 + definicion_CTX_O_S.igv));
                    igvTOTAL = redondeo2Decimales(sumaTOTAL - subTOTAL);

                    // if (index + 1 === definicion_CTX_O_S.servicios.length) {
                    //   console.log(subTOTAL);
                    //   console.log(igvTOTAL);
                    //   console.log(sumaTOTAL);
                    //   fijarMontosServicios({ subTOTAL, igvTOTAL, sumaTOTAL });
                    // }
                    return (
                      <tr key={iTRequi.idAuxiliar}>
                        <td data-label="Ítem" key={iTRequi.idAuxiliar}>{`${cerosALaIzquierda(indexItemRequi, 3)}`}</td>
                        <td data-label="Código">{iTRequi.codigo}</td>
                        <td data-label="Descripción">{iTRequi.descripcionEquivalencia}</td>
                        <td data-label="Cantidad" style={{ textAlign: 'end' }}>
                          <input
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
                          <ImgButton src={images.trash} alt="icono de eliminar" height={12} width={12} title="Eliminar ítem" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ display: 'flex', alignContent: 'center', border: '1px solid red' }}>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      Sub total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${subTOTAL.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr style={{ display: 'flex', alignContent: 'end', border: '1px solid green' }}>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      IGV
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${igvTOTAL.toLocaleString('en-PE', {
                        style: 'currency',
                        currency: 'PEN',
                        minimumFractionDigits: 2,
                      })}`}
                    </td>
                  </tr>
                  <tr style={{ display: 'flex', alignContent: 'center', border: '1px solid red' }}>
                    <td colSpan={6} style={{ textAlign: 'end' }}>
                      Total
                    </td>
                    <td colSpan={1} style={{ textAlign: 'end' }}>
                      {`${sumaTOTAL.toLocaleString('en-PE', {
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
          </div>
          {/* ----------------------------------------------------- */}
          <hr style={{ margin: '5px 0' }}></hr>
        </div>
        {/* BOTON REPUESTOS DESPACHADOS */}
        {/* <div>
          <div
            style={{
              display: 'flex',
              justifyContent: repuestosDespachados.length ? 'space-between' : 'end',
              margin: '5px 0',
            }}
          > */}
        {/* TABLA REQUISICIONES */}
        {/*      <div>
              {repuestosDespachados.length ? (
                <TablaRepuestosDespachados registros={repuestosDespachados} />
              ) : (
                <i style={{ fontSize: '0.7rem' }}>No existen repuestos despachados</i>
              )}
              </div> 
          </div>*/}
        {/* ----------------------------------------------------- */}
        {/* <hr style={{ margin: '5px 0' }}></hr>
        </div> */}
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          type="button"
          value={definicion_CTX_O_S.correlativo === 0 ? 'Aperturar orden de servicio' : `Grabar`}
          class="btn-centro"
          // onClick={(e) => onSubmit(e)}
          onClick$={() => grabar()}
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
