import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { hoy } from '~/functions/comunes';
import { parametrosGlobales } from '../../login/index';
import TablaCotizaciones from '~/components/cotizacion/tablaCotizaciones';
import ElButton from '~/components/system/elButton';
import NewEditCotizacion from '~/components/cotizacion/newEditCotizacion';
// import TablaCotizaciones from '~/components/venta/tablaCotizaciones';

export interface ICotizacion {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;

  correlativo: number;
  fecha: any;

  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombreCliente: string;
  // email: { type: String },
  idVehiculo: string;
  placa: string;
  idVehiculoMarca: string;
  vehiculoMarca: string;
  idVehiculoModelo: string;
  vehiculoModelo: string;
  vin: string;

  igv: number;

  vendedor: string;

  servicios: any;
  repuestosLubri: any;

  montoSubTotalPEN: any;
  montoIGVPEN: any;
  montoTotalPEN: any;
}

export const CTX_DOCS_COTIZACION = createContextId<any>('cotizacion');

export default component$(() => {
  //#region CONTEXTO COTIZACION
  const definicion_CTX_DOCS_COTIZACION = useStore({
    mostrarPanelVenta: false,
    grabo: false,
    mostrarPanelSeleccionarPersona: false,
    selecciono_Persona: false,
    mostrarPanelCuotasCredito: false,
    grabo_CuotaCredito: false,
    grabo_cuotas_numero: 0,
    mostrarVerAlmacen: false,
    mostrarSeleccionarEquivalenciaEnSalida: false,
    grabo_ItemsVenta: false,
    grabo_items_venta_numero: 0,
    mostrarAdjuntarCotizacion: false,
    mostrarAddNewEditServicio: false,
    mostrarAdicionarServicio: false,
    mostrarServicioSeleccionado: false,
  });
  useContextProvider(CTX_DOCS_COTIZACION, definicion_CTX_DOCS_COTIZACION);
  //#endregion CONTEXTO COTIZACION

  //#region INICIALIZANDO
  const buscarCotizaciones = useSignal(0);
  const showAddCotizacion = useSignal(false);
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
  //#endregion INICIALIZANDO

  return (
    <main>
      <div
        class="container"
        // style={{
        //   width: '1111px', //SIZES.anchoContenedor + 'px',
        //   height: 'inherit',
        //   color: 'red', //COLORS.lightGray2,
        //   margin: '5px auto',
        //   display: 'inherit',
        //   justifyContent: 'inherit',
        //   alignItems: 'inherit',
        // }}
      >
        {/*  TITULO  */}
        <h3>
          <u>Cotizaciones</u>
          {/* <u>{parametrosGlobales.nombreAlmacen}</u> */}
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
              title="Buscar ventas"
              onClick={$(() => {
                if (fechas.desde > fechas.hasta) {
                  alert('Verifique las fechas de busqueda');
                  document.getElementById('fechaDesde')?.focus();
                  return;
                }
                buscarCotizaciones.value++;
                console.log('buscarCotizaciones.value', buscarCotizaciones.value);
              })}
              // onClick={buscarCotizacionesEntreFechas}
            />
          </div>
        </div>
        <div style={{ display: 'flex', margin: '10px 0' }}></div>
        {/*  BOTONES */}
        <div style={{ marginBottom: '10px' }}>
          <ElButton
            name="ADD COTIZACION"
            title="Add una cotización"
            onClick={$(() => {
              showAddCotizacion.value = true;
            })}
          />
          {/* <button className="btn" name="ADD COTIZACION" onClick={mostrarPanelCotizacion} title="Add una cotización" /> */}
          {showAddCotizacion.value && (
            <div class="modal">
              <NewEditCotizacion
              // contexto={CTX_COTIZACION}
              // ancho={'600px'}
              // parametrosGlobales={parametrosGlobales}
              // inicializacion={inicializacionCotizacion}
              // onCerrar={cerrarPanelCotizacion}
              />
            </div>
          )}
        </div>
        {/* TABLA COTIZACIONES */}
        <div style={{ margin: '10px 0' }}>
          {buscarCotizaciones.value > 0 ? (
            <TablaCotizaciones
              buscarCotizaciones={buscarCotizaciones.value}
              // verPDF={generarPDF}
              modoSeleccion={false}
              parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
          {/* {cotizaciones.length ? (
            <TablaCotizaciones registros={cotizaciones} verPDF={generarPDF} onEdit={editarCotizacion} />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen cotizaciones</i>
          )} */}
        </div>
      </div>
    </main>
  );
});
