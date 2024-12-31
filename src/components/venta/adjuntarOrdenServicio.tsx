import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { CTX_ADD_VENTA } from './addVenta';
import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import TablaOrdenesServicio from './tablaOrdenesServicio';
import Spinner from '../system/spinner';

export const CTX_ADJUTAR_ORDEN_SERVICIO = createContextId<any>('__adjuntar_orden_Servicio');

export default component$(() => {
  //#region definicion CTX_ADJUNTAR_ORDENES_SERVICIO
  const deficion_CTX_ADJUTAR_ORDEN_SERVICIO = useStore({
    mostrarSpinner: false,
  });
  useContextProvider(CTX_ADJUTAR_ORDEN_SERVICIO, deficion_CTX_ADJUTAR_ORDEN_SERVICIO);
  //#endregion definicion CTX_ADJUNTAR_ORDENES_SERVICIO

  //#region CONTEXTOS
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
  // const mostrarSpinner = useSignal(false);
  //#endregion CONTEXTOS

  const numeroOFecha = useSignal('Entre fechas');
  const buscarOrdenesServicio = useSignal(0);
  const fechas = useStore({
    desde: primeroDelMes(),
    hasta: hoy(),
  });

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    fechaInicio: fechas.desde,
    fechaFinal: fechas.hasta,
  });

  useTask$(({ track }) => {
    const fI = track(() => fechas.desde);
    const fF = track(() => fechas.hasta);
    parametrosBusqueda.fechaInicio = fI;
    parametrosBusqueda.fechaFinal = fF;
  });

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 90%, 900px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
        background: '#eee',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_add_venta.mostrarAdjuntarOS = false;
          })}
        />
      </div>
      {/* FORMULARIO onChange={cambiarBusqueda}  style={{ marginBottom: '5px' }}*/}
      <div class="add-form">
        <h3>Adjuntar orden servicio terminada</h3>
        {/* por Número*/}
        <div id="porNumero" style={numeroOFecha.value === 'Número' ? { visibility: 'visible', display: 'flex' } : { visibility: 'collapse' }}>
          <input type="number" id="inputNumeroCotizacion" style={{ marginLeft: '91px', top: '0px', width: '95px' }}></input>
          <input type="image" src={images.searchPLUS} alt="Icono de busqueda" height={16} width={16} title="Buscar por número" />
        </div>
        {/* por Fechas */}
        <div id="porFechas" class="intervalo-fechas" style={numeroOFecha.value === 'Entre fechas' ? { visibility: 'visible' } : { visibility: 'collapse' }}>
          <label class="fechas">Desde</label>{' '}
          <input
            type="date"
            id="fechaDesdeBusqueda"
            autoFocus
            value={fechas.desde}
            style={{ marginLeft: '2px' }}
            onInput$={(e) => {
              fechas.desde = (e.target as HTMLInputElement).value;
            }}
            onKeyPress$={(e) => {
              if (e.key === 'Enter') {
                document.getElementById('fechaHastaBusqueda')?.focus();
              }
            }}
          />
          <label class="fechas" style={{ marginLeft: '8px' }}>
            Hasta
          </label>
          <input
            type="date"
            id="fechaHastaBusqueda"
            value={fechas.hasta}
            style={{ marginLeft: '2px' }}
            onInput$={(e) => {
              fechas.hasta = (e.target as HTMLInputElement).value;
            }}
            onKeyPress$={(e) => {
              if (e.key === 'Enter') {
                document.getElementById('botonBuscar_fechas')?.focus();
              }
            }}
          />
          {/* <div class="intervalo-fechas__botonBuscar"> */}
          <input
            id="botonBuscar_fechas"
            type="image"
            title="Buscar por fechas"
            alt="icono buscar"
            height={16}
            width={16}
            src={images.searchPLUS}
            style={{ marginLeft: '4px' }}
            onClick$={() => {
              if (fechas.desde > fechas.hasta) {
                alert('Verifique las fechas de busqueda');
                document.getElementById('fechaDesdeBusqueda')?.focus();
                return;
              }
              // //console.log('click en lupa: parameBusqueda ', parameBusqueda);
              deficion_CTX_ADJUTAR_ORDEN_SERVICIO.mostrarSpinner = true;
              buscarOrdenesServicio.value++;
            }}
          />
          {/* <ImgButton
              src={images.searchPLUS}
              alt="Icono de busqueda por fechas"
              height={16}
              width={16}
              title="Buscar por fechas"
              onClick={$(() => {
                if (fechas.desde > fechas.hasta) {
                  alert('Verifique las fechas de busqueda');
                  document.getElementById('fechaDesdeBusqueda')?.focus();
                  return;
                }
                // //console.log('click en lupa: parameBusqueda ', parameBusqueda);

                buscarOrdenesServicio.value++;
              })}
              // onClick={buscarCotizacionesEntreFechas}
            /> */}
          {/* </div> */}
        </div>
        {/* TABLA ORDNES SERVICOS TERMINADAS */}
        <div style={{ marginTop: '15px' }}>
          {buscarOrdenesServicio.value > 0 ? (
            <TablaOrdenesServicio
              buscarOrdenesServicio={buscarOrdenesServicio.value}
              // verPDF={generarPDF}
              modoSeleccion={true}
              parametrosBusqueda={parametrosBusqueda}
              mostrarSpinner={deficion_CTX_ADJUTAR_ORDEN_SERVICIO.mostrarSpinner}
            />
          ) : (
            ''
          )}
        </div>
      </div>
      {/* MOSTRAR SPINNER */}
      {deficion_CTX_ADJUTAR_ORDEN_SERVICIO.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
