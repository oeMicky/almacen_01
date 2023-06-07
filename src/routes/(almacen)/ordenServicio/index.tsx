import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import NewEditOrdenServicio from '~/components/ordenServicio/newEditOrdenServicio';
import TablaOrdenesServicio from '~/components/ordenServicio/tablaOrdenesServicio';
import ElButton from '~/components/system/elButton';
import ImgButton from '~/components/system/imgButton';
import { hoy } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';

export const CTX_DOCS_ORDEN_SERVICIO = createContextId<any>('app.almacen');

export default component$(() => {
  //#region DEFINICION CTX_DOCS_ORDEN_SERVICIO
  const defini_CTX_DOCS_ORDEN_SERVICIO = useStore({
    mostrarAddOrderServicio0: false,
    ordSerSe: [],
    actualizoOS: '',

    mostrarPanelSeleccionarPersonaTecnico0: false,
    mostrarPanelAgregarPersona0: false,
    mostrarPanelSeleccionarPersona0: false,
    selecciono_Cliente0: false,
    personaSe: [],
    graboPersona: false,

    mostrarPanelSeleccionarVehiculo0: false,
    mostrarPanelNewEditVehiculo0: false,
    vehiculoSe: [],
    vehiculoGrabado: false,

    mostrarPanelSeleccionarServicio0: false,
    mostrarServicioSeleccionado: false,
    selecciono_Servicio0: false,

    // mostrarPanelRequisicion: false,
    mostrarPanelBusquedaMercaderiaOUT: false,
    mostrarPanelAsignarPrecio: false,
    mostrarPanelMercaderiaSeleccionadaOUT: false,
  });
  useContextProvider(CTX_DOCS_ORDEN_SERVICIO, defini_CTX_DOCS_ORDEN_SERVICIO);
  //#endregion DEFINICION CTX_DOCS_ORDEN_SERVICIO

  //#region INICIALIZACION
  const buscarOrdenesServicio = useSignal(0);
  const showAddOrdenServicio = useSignal(false);
  //*Fechas
  const fechas = useStore({
    desde: hoy(),
    hasta: hoy(),
  });
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    fechaInicio: fechas.desde,
    fechaFinal: fechas.hasta,
  });
  useTask$(({ track }) => {
    const fI = track(() => fechas.desde);
    const fF = track(() => fechas.hasta);
    parametrosBusqueda.fechaInicio = fI;
    parametrosBusqueda.fechaFinal = fF;
  });
  //#endregion INICIALIZACION

  //#region ACTUALIZAR TABLA ORDENES DE SERVICIO
  useTask$(({ track }) => {
    track(() => defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS);
    if (defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS !== '') {
      //actualizar TABLA ORDENES SERVICIO
      console.log('actualizar TABLA ORDENES SERVICIO', defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS);
      buscarOrdenesServicio.value++;
      defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS = '';
    }
  });
  //#endregion ACTUALIZAR TABLA ORDENES DE SERVICIO

  return (
    <div
      class="container"
      // style={{
      //   width: '1111px', // SIZES.anchoContenedor + 'px',
      //   height: 'inherit',
      //   color: '#888', //COLORS.lightGray2,
      //   margin: '5px auto',
      //   display: 'inherit',
      //   justifyContent: 'inherit',
      //   alignItems: 'inherit',
      // }}
    >
      {/*  TITULO  */}
      <h3>
        <u>Ordenes de Servicio</u>
      </h3>
      {/*  INTERVALOS DE FECHAS */}
      <div class="intervalo-fechas">
        <label class="fechas">
          Desde:{' '}
          <input
            id="fechaDesde"
            type="date"
            value={parametrosBusqueda.fechaInicio}
            onInput$={(e) => {
              fechas.desde = (e.target as HTMLInputElement).value;
            }}
          />
        </label>

        <label class="fechas">
          Hasta:{' '}
          <input
            id="fechaHasta"
            type="date"
            value={parametrosBusqueda.fechaFinal}
            onInput$={(e) => {
              fechas.hasta = (e.target as HTMLInputElement).value;
            }}
          />
        </label>
        <div class="intervalo-fechas__botonBuscar">
          <ImgButton
            src={images.searchPLUS}
            alt="Icono de busqueda"
            height={16}
            width={16}
            title="Buscar ordenes de servicios"
            onClick={$(() => {
              if (fechas.desde > fechas.hasta) {
                alert('Verifique las fechas de busqueda');
                document.getElementById('fechaDesde')?.focus();
                return;
              }
              buscarOrdenesServicio.value++;
              console.log('buscarOrdenesServicio.value', buscarOrdenesServicio.value);
            })}
            // style={{ marginTop: '3px' }}
            // onClick={buscarOrdenesServiciosPorFechas}
          />
        </div>
      </div>
      {/*  BOTONES */}
      <div style={{ marginBottom: '10px' }}>
        <ElButton
          // class="btn"
          name="ADD ORDEN DE SERVICIO"
          // onClick={mostrarPanelOrdenServicio}
          title="Add una orden de servicio"
          onClick={$(() => {
            defini_CTX_DOCS_ORDEN_SERVICIO.ordSerSe = [];
            defini_CTX_DOCS_ORDEN_SERVICIO.mostrarAddOrderServicio0 = true;
            // showAddOrdenServicio.value = true;
          })}
        />
        {/* {showAddOrdenServicio.value && ( */}
        {defini_CTX_DOCS_ORDEN_SERVICIO.mostrarAddOrderServicio0 && (
          <div class="modal">
            <NewEditOrdenServicio
              oSSelecci={defini_CTX_DOCS_ORDEN_SERVICIO.ordSerSe}
              // contexto={CTX_COTIZACION}
              // ancho={'600px'}
              // parametrosGlobales={parametrosGlobales}
              // inicializacion={inicializacionCotizacion}
              // onCerrar={cerrarPanelCotizacion}
            />
          </div>
        )}
        {/* {showNewEditOrdenServicio && (
          <Modal
            componente={
              <NewEditOrdenServicio
                ancho={'680px'}
                parametrosGlobales={parametrosGlobales}
                inicializacion={inicializacionOrdenServicio}
                onCerrar={cerrarPanelOrdenServicio}
              />
            }
          />
        )} */}
      </div>
      {/* TABLA ORDENES DE SERVICIO */}
      <div style={{ margin: '10px 0' }}>
        {buscarOrdenesServicio.value > 0 ? (
          <TablaOrdenesServicio buscarOrdenesServicio={buscarOrdenesServicio.value} parametrosBusqueda={parametrosBusqueda} />
        ) : (
          ''
        )}
      </div>
    </div>
  );
});
