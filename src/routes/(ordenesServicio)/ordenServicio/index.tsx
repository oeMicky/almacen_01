import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';
import { getIgvVenta } from '~/apis/venta.api';
import { images } from '~/assets';
// import { images } from '~/assets';
// import { CTX_APP_ALMACEN } from '~/components/header/headerAlmacen';
import NewEditOrdenServicio from '~/components/ordenServicio/newEditOrdenServicio';
import TablaOrdenesServicio from '~/components/ordenServicio/tablaOrdenesServicio';
import ElButton from '~/components/system/elButton';
import ElSelect from '~/components/system/elSelect';
// import ImgButton from '~/components/system/imgButton';
import Spinner from '~/components/system/spinner';
// import { hoy, primeroDelMes } from '~/functions/comunes';
// import { CTX_0 } from '~/routes';
import { parametrosGlobales } from '~/routes/login';

// export const CTX_DOCS_ORDEN_SERVICIO = createContextId<any>('app.almacen');
export const CTX_INDEX_ORDEN_SERVICIO = createContextId<any>('app.almacen');

export default component$(() => {
  //#region CTX_INDEX_ORDEN_SERVICIO
  const definicion_CTX_INDEX_ORDEN_SERVICIO = useStore({
    oO: [],
    mostrarPanelNewEditOrdenServicio: false,
    grabo_OS: false,
    // vehiculo_seleccionado: false,
    // grabo_vehiculo: false,
    // mostrarPanelNewEditVehiculo: false,
    // mostrarPanelVehiculoSeleccionado: false,
    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_ORDEN_SERVICIO, definicion_CTX_INDEX_ORDEN_SERVICIO);
  //#endregion CTX_INDEX_ORDEN_SERVICIO

  //#region DEFINICION CTX_DOCS_ORDEN_SERVICIO
  // const defini_CTX_DOCS_ORDEN_SERVICIO = useStore({
  //   compania: 'EASY!!**!!',

  //   mostrarAddOrderServicio0: false,
  //   ordSerSe: [],
  //   actualizoOS: '',

  //   mostrarPanelSeleccionarPersonaTecnico0: false,

  //   mostrarPanelSeleccionarPersona: false,
  //   selecciono_Persona: false,
  //   selecciono_Cliente0: false,
  //   personaSe: [],
  //   graboPersona: false,

  //   mostrarPanelSeleccionarVehiculo0: false,
  //   mostrarPanelNewEditVehiculo0: false,
  //   vehiculoSe: [],
  //   vehiculoGrabado: false,

  //   mostrarPanelSeleccionarServicio: false,
  //   mostrarServicioSeleccionado: false,
  //   selecciono_Servicio0: false,

  //   // mostrarPanelRequisicion: false,
  //   mostrarPanelBusquedaMercaderiaOUT: false,
  //   mostrarPanelAsignarPrecio: false,
  //   mostrarPanelMercaderiaSeleccionadaOUT: false,
  // });
  // useContextProvider(CTX_DOCS_ORDEN_SERVICIO, defini_CTX_DOCS_ORDEN_SERVICIO);
  //#endregion DEFINICION CTX_DOCS_ORDEN_SERVICIO

  //#region CONTEXTOS
  // const ctx_app_almacen = useContext(CTX_APP_ALMACEN);
  // const ctx_0 = useContext(CTX_0);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const buscarOrdenesServicio = useSignal(0);
  const igv = useSignal(0);

  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });

  // const showAddOrdenServicio = useSignal(false);
  //*Fechas
  // const fechas = useStore({
  //   desde: hoy(),
  //   hasta: hoy(),
  // });
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    idPeriodo: '',
    // fechaInicio: primeroDelMes(), // hoy(),
    // fechaFinal: hoy(),
    // periodo: '',
  });
  // useTask$(({ track }) => {
  //   const fI = track(() => fechas.desde);
  //   const fF = track(() => fechas.hasta);
  //   parametrosBusqueda.fechaInicio = fI;
  //   parametrosBusqueda.fechaFinal = fF;
  // });
  //#endregion INICIALIZACION

  //#region ACTUALIZAR TABLA ORDENES DE SERVICIO
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_ORDEN_SERVICIO.mostrarPanelNewEditOrdenServicio);
    // console.log(
    //   ' definicion_CTX_INDEX_ORDEN_SERVICIO.mostrarPanelNewEditOrdenServicio - grabo_OS',
    //   definicion_CTX_INDEX_ORDEN_SERVICIO.mostrarPanelNewEditOrdenServicio,
    //   definicion_CTX_INDEX_ORDEN_SERVICIO.grabo_OS
    // );
    if (definicion_CTX_INDEX_ORDEN_SERVICIO.grabo_OS) {
      //actualizar TABLA ORDENES SERVICIO
      // console.log('actualizar TABLA ORDENES SERVICIO', defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS);
      buscarOrdenesServicio.value++;
      definicion_CTX_INDEX_ORDEN_SERVICIO.grabo_OS = false;
    }
  });
  //#endregion ACTUALIZAR TABLA ORDENES DE SERVICIO

  //#region OBTENER PERIODOS
  // const cargarLosPeriodos = $(async () => {
  //   const losPeri = await getPeriodos({
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     bandera: 'Compras',
  //   });
  //   console.log('losPeri', losPeri);
  //   losPeriodosCargados.value = losPeri.data;
  //   console.log(' losPeriodosCargados.value', losPeriodosCargados.value);
  //   // console.log('a cargar periodos');
  // });

  // useTask$(({ track }) => {
  //   track(() => ini.value);

  //   cargarLosPeriodos();
  // });
  //#endregion OBTENER PERIODOS

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
      {/*  IDENTIFICACION  */}
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
        {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
      </h1> */}
      <div style={{ background: '#00778F' }}>
        <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {/* {` ${sessionStorage.getItem('numeroIdentidad')} - ${sessionStorage
            .getItem('empresa')
            ?.toLocaleUpperCase()} - Sucursal: ${sessionStorage.getItem('sucursal')} - Usuario: ${sessionStorage.getItem(
            'usuario'
          )}`} */}
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>Ordenes de Servicio</u>
      </h4>
      {/*  INTERVALOS DE FECHAS */}
      {/* <div class="intervalo-fechas">
        <label class="fechas">
          Desde:{' '}
          <input
            id="fechaDesde"
            type="date"
            value={parametrosBusqueda.fechaInicio}
            // onChange$={(e) => (parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value)}
            onInput$={(e) => {
              parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value;
            }}
          />
        </label>

        <label class="fechas" style={{ marginLeft: '4px' }}>
          Hasta:{' '}
          <input
            id="fechaHasta"
            type="date"
            value={parametrosBusqueda.fechaFinal}
            onInput$={(e) => {
              parametrosBusqueda.fechaFinal = (e.target as HTMLInputElement).value;
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
              // console.log('inicio', parametrosBusqueda.fechaInicio);
              // console.log('final', parametrosBusqueda.fechaFinal);
              if (parametrosBusqueda.fechaInicio.trim() === '') {
                alert('Verifique la fecha inicial');
                document.getElementById('fechaDesde')?.focus();
                return;
              }
              if (parametrosBusqueda.fechaFinal.trim() === '') {
                alert('Verifique la fecha final');
                document.getElementById('fechaHasta')?.focus();
                return;
              }
              if (parametrosBusqueda.fechaInicio > parametrosBusqueda.fechaFinal) {
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
      </div> */}
      {/*  BOTONES */}
      <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>
        {/* <button
          onClick$={() => {
            console.log('ctx_0.compania', ctx_0.compania);
          }}
        >
          compaÑia
        </button> */}
        <ElButton
          // class="btn"
          name="ADD ORDEN DE SERVICIO"
          // onClick={mostrarPanelOrdenServicio}
          title="Add una orden de servicio"
          onClick={$(async () => {
            //validar PERIODO
            if (periodo.idPeriodo === '') {
              alert('Seleccione el periodo.');
              document.getElementById('se_periodo')?.focus();
              ini.value++;
              return;
            }
            //
            let elIgv = await getIgvVenta(parametrosGlobales);
            elIgv = elIgv.data;
            console.log('elIgv', elIgv);
            igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //
            // console.log('igv.value::', igv.value);
            definicion_CTX_INDEX_ORDEN_SERVICIO.oO = [];
            definicion_CTX_INDEX_ORDEN_SERVICIO.mostrarPanelNewEditOrdenServicio = true;

            // defini_CTX_DOCS_ORDEN_SERVICIO.ordSerSe = [];
            // defini_CTX_DOCS_ORDEN_SERVICIO.mostrarAddOrderServicio0 = true;
            // showAddOrdenServicio.value = true;
          })}
        />
        <ElSelect
          id={'se_periodo'}
          // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
          estilos={{ width: '168px', marginLeft: '5px' }}
          registros={losPeriodosCargados.value}
          registroID={'_id'}
          registroTEXT={'periodo'}
          seleccione={'-- Seleccione periodo --'}
          onChange={$(() => {
            // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
            const elSelec = document.getElementById('se_periodo') as HTMLSelectElement;
            const elIdx = elSelec.selectedIndex;
            // console.log('?', elIdx, elSelec[elIdx].id);
            periodo.idPeriodo = elSelec[elIdx].id;
            if (periodo.idPeriodo === '') {
              periodo.periodo = '';
            } else {
              periodo.periodo = elSelec.value;
              // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
              parametrosBusqueda.idPeriodo = periodo.idPeriodo;
              // console.log('💨💨💨💨💨💨first', periodo);
              // console.log('💨💨💨💨💨💨first', periodo.idPeriodo);
              buscarOrdenesServicio.value++;

              definicion_CTX_INDEX_ORDEN_SERVICIO.mostrarSpinner = true;
            }
          })}
          onKeyPress={$((e: any) => {
            if (e.key === 'Enter') {
              (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
            }
          })}
        />
        <input
          type="image"
          title="Buscar ordenes de servicio"
          alt="icono buscar"
          height={16}
          width={16}
          style={{ marginLeft: '2px' }}
          src={images.searchPLUS}
          onClick$={() => {
            if (periodo.idPeriodo === '') {
              alert('Seleccione un periodo');
              document.getElementById('se_periodo')?.focus();
              return;
            }
            buscarOrdenesServicio.value++;
            definicion_CTX_INDEX_ORDEN_SERVICIO.mostrarSpinner = true;
          }}
        />
        {/* {showAddOrdenServicio.value && ( */}
        {definicion_CTX_INDEX_ORDEN_SERVICIO.mostrarPanelNewEditOrdenServicio && (
          <div class="modal">
            <NewEditOrdenServicio
              addPeriodo={periodo}
              oSSelecci={definicion_CTX_INDEX_ORDEN_SERVICIO.oO}
              igv={igv.value}
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
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_ORDEN_SERVICIO.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
