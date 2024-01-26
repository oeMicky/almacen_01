import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
// import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import { hoy, primeroDelMes } from '~/functions/comunes';
import TablaCotizaciones from './tablaCotizaciones';
import { CTX_ADD_VENTA } from './addVenta';
import { parametrosGlobales } from '~/routes/login';

export default component$(() => {
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
  const numeroOFecha = useSignal('Entre fechas');
  const buscarCotizaciones = useSignal(0);
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
        width: 'clamp(330px, 86%, 700px)',
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
            ctx_add_venta.mostrarAdjuntarCotizacion = false;
          })}
          //   onClick={onCerrar}
        />
      </div>
      {/* FORMULARIO onChange={cambiarBusqueda}  style={{ marginBottom: '5px' }}*/}
      <div class="add-form">
        <h3>Adjuntar cotización</h3>
        {/* <div class="form-control">
          <label style={{ marginRight: '10px' }}>Buscar por:</label>
          <select
            style={
              numeroOFecha.value === 'Número' ? { marginRight: '10px', width: '103px' } : { marginRight: '10px', width: '119px' }
            }
            id="selectBuscarPor"
            value={numeroOFecha.value}
            onChange$={(e) => {
              numeroOFecha.value = (e.target as HTMLSelectElement).value;
              if (numeroOFecha.value === 'Número') {
                console.log('first');
                document.getElementById('inputNumeroCotizacion')?.focus();
              }
              if (numeroOFecha.value === 'Entre fechas') {
                console.log('second');
                document.getElementById('fechaDesdeBusqueda')?.focus();
              }
            }}
          >
            <option value="Número" >Número</option>
            <option value="Entre fechas">Entre fechas</option>
          </select>
        </div> */}
        {/* por Número*/}
        <div
          id="porNumero"
          style={numeroOFecha.value === 'Número' ? { visibility: 'visible', display: 'flex' } : { visibility: 'collapse' }}
        >
          <input type="text" id="inputNumeroCotizacion" style={{ marginLeft: '91px', top: '0px', width: '95px' }}></input>
          <ImgButton
            src={images.searchPLUS}
            alt="Icono de busqueda"
            height={16}
            width={16}
            title="Buscar por número"
            // onClick={() => {
            //   document.getElementById('inputNumeroCotizacion').focus();
            // }}
          />
        </div>
        {/* por Fechas  , display: 'flex', fontSize: '0.8rem', border: '1px solid red'*/}
        <div
          id="porFechas"
          class="intervalo-fechas"
          style={numeroOFecha.value === 'Entre fechas' ? { visibility: 'visible' } : { visibility: 'collapse' }}
        >
          {/*  style={{ width: '210px', display: 'flex', justifyContent: 'space-between' }} */}
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
          {/*  style={{ width: '174px', display: 'flex', justifyContent: 'space-between', marginLeft: '10px' }}*/}
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

                buscarCotizaciones.value++;
              })}
              // onClick={buscarCotizacionesEntreFechas}
            />
          </div>
        </div>
        {/* TABLA COTIZACIONES */}
        <div style={{ marginTop: '15px' }}>
          {buscarCotizaciones.value > 0 ? (
            <TablaCotizaciones
              buscarCotizaciones={buscarCotizaciones.value}
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
