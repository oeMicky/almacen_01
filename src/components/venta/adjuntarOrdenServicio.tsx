import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { CTX_ADD_VENTA } from './addVenta';
import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import TablaOrdenesServicio from './tablaOrdenesServicio';

export default component$(() => {
  //#region CONTEXTOS
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
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
        width: 'clamp(376px, 86%, 800px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_add_venta.mostrarAdjuntarOS = false;
          })}
        />
      </div>
      {/* FORMULARIO onChange={cambiarBusqueda}  style={{ marginBottom: '5px' }}*/}
      <div class="add-form">
        <h3>Adjuntar orden servicio</h3>
        {/* por Número*/}
        <div
          id="porNumero"
          style={numeroOFecha.value === 'Número' ? { visibility: 'visible', display: 'flex' } : { visibility: 'collapse' }}
        >
          <input type="text" id="inputNumeroCotizacion" style={{ marginLeft: '91px', top: '0px', width: '95px' }}></input>
          <ImgButton src={images.searchPLUS} alt="Icono de busqueda" height={16} width={16} title="Buscar por número" />
        </div>
        {/* por Fechas */}
        <div
          id="porFechas"
          class="intervalo-fechas"
          style={numeroOFecha.value === 'Entre fechas' ? { visibility: 'visible' } : { visibility: 'collapse' }}
        >
          <label class="fechas">
            Desde:{'     '}
            <input
              type="date"
              id="fechaDesdeBusqueda"
              value={fechas.desde}
              onInput$={(e) => {
                fechas.desde = (e.target as HTMLInputElement).value;
              }}
            />
          </label>
          <label class="fechas">
            Hasta:
            <input
              type="date"
              id="fechaHastaBusqueda"
              value={fechas.hasta}
              onInput$={(e) => {
                fechas.hasta = (e.target as HTMLInputElement).value;
              }}
            />
          </label>
          <div class="intervalo-fechas__botonBuscar">
            <ImgButton
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
                // console.log('click en lupa: parameBusqueda ', parameBusqueda);

                buscarOrdenesServicio.value++;
              })}
              // onClick={buscarCotizacionesEntreFechas}
            />
          </div>
        </div>
        {/* TABLA COTIZACIONES */}
        <div style={{ marginTop: '15px' }}>
          {buscarOrdenesServicio.value > 0 ? (
            <TablaOrdenesServicio
              buscarOrdenesServicio={buscarOrdenesServicio.value}
              // verPDF={generarPDF}
              modoSeleccion={true}
              parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});
