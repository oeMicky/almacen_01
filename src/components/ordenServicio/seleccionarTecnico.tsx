import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import NewEditPersona from './newEditPersona';

export default component$((props: { seleccionar: string; soloPersonasNaturales: boolean }) => {
  //#region CONTEXTO
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //#endregion CONTEXTO

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
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          //   onClick={() => {
          //     const soloCerrar = true;
          //     onCerrar({ soloCerrar });
          //   }}
          onClick={$(() => {
            // ctx_PanelVenta.mostrarPanelVenta = false;

            ctx_docs_orden_servicio.mostrarPanelSeleccionarPersonaTecnico0 = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h2 style={{ marginBottom: '10px' }}>Seleccionar {props.seleccionar}</h2>
        {/* ZONA DE BUSQUEDA */}
        <div>
          {/* Buscar por */}
          <div class="form-control">
            <label>Buscar por</label>
            <div class="form-control form-agrupado">
              <select
                id="buscarPor"
                value={'Nombre'}
                style={{ width: '100%' }}
                // onChange={() => {
                //   document.getElementById('inputBusquedaTecnico').focus();
                // }}
              >
                <option value={'DNI'}>DNI/C.EXT.</option>
                <option value={'Nombre'}>Nombre</option>
              </select>
            </div>
          </div>
          {/* DNI RUC */}
          <div class="form-control">
            <label></label>
            <div class="form-control form-agrupado">
              <input
                id="inputBusquedaTecnico"
                style={{ width: '100%' }}
                type="text"
                // value={dniNombre}
                // onChange={(e) => setDniNombre(e.target.value.toUpperCase())}
              />
              <ImgButton
                src={images.searchPLUS}
                alt="Icono de buscar persona"
                height={16}
                width={16}
                title="Buscar persona"
                // onClick={localizarTecnicos}
              />
              <ImgButton
                src={images.add}
                alt="Icono de adicionar persona"
                height={16}
                width={16}
                title="Adicionar persona"
                // onClick={(e) => {
                //   setVerPanelAgregarPersona(!verPanelAgregarPersona);
                // }}
                onClick={$(() => {
                  // ctx_PanelVenta.mostrarPanelVenta = false;
                  ctx_docs_orden_servicio.mostrarPanelAgregarPersona0 = true;
                })}
              />
            </div>
          </div>
        </div>
        {ctx_docs_orden_servicio.mostrarPanelAgregarPersona0 && (
          <div class="modal">
            <NewEditPersona
              soloPersonaNatural={props.soloPersonasNaturales}
              personaSeleccio={ctx_docs_orden_servicio.personaSe}
              //   ancho={'570px'}
              //   parametrosGlobales={parametrosGlobales}
              //   onCerrar={cerrarPanelNewEditPersona}
              //   soloPersonaNatural={true}
            />
          </div>
        )}
        {/* TABLA DE PERSONAS HALLADAS*/}
        <div class="form-control">
          {/* {tecnicosLocalizados.length > 0 ? (
            <TablaTecnicosHallados parametrosGlobales={parametrosGlobales} registros={tecnicosLocalizados} />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen técnicos localizados</i>
          )} */}
        </div>
      </div>
    </div>
  );
});
