import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import TablaPersonasHalladas from './tablaPersonasHalladas';
import { parametrosGlobales } from '~/routes/login';
import NewEditPersona from './newEditPersona';

export default component$((props: { soloPersonasNaturales: boolean; seleccionar: string }) => {
  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarPersona = useSignal(0);
  const por = useSignal('DNI / RUC');
  const cadena = useSignal('');
  //#endregion INICIALIZACION

  //#region PARAMETROS DE BUSQUEDA
  const parametrosBusqueda = {
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    por: por.value,
    cadenaABuscar: cadena.value,
  };
  //#endregion PARAMETROS DE BUSQUEDA

  //#region TAREAS
  useTask$(({ track }) => {
    track(() => {
      ctx_docs_orden_servicio.graboPersona;
    });
    if (ctx_docs_orden_servicio.graboPersona) {
      if ((document.getElementById('inputBusqueda') as HTMLInputElement).value.trim() !== '') {
        buscarPersona.value++;
      }

      ctx_docs_orden_servicio.graboPersona = false;
    }
  });
  //#endregion TAREAS

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
            ctx_docs_orden_servicio.mostrarPanelSeleccionarPersona0 = false;
            // showAddOrdenServicio.value = true;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          //   onClick={() => {
          //     const soloCerrar = true;
          //     onCerrar({ soloCerrar });
          //   }}
          //   onClick={$(() => {
          //     props.seleccionar;
          //   })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h2 style={{ marginBottom: '10px' }}>Seleccionar {props.seleccionar}</h2>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <label>Buscar por</label>
            <div class="form-control form-agrupado">
              <select
                id="buscarPor"
                style={{ width: '100%' }}
                value={por.value}
                onChange$={(e) => {
                  por.value = (e.target as HTMLSelectElement).value;
                  document.getElementById('inputBusqueda')?.focus();
                }}
              >
                <option value={'DNI / RUC'}>DNI / RUC</option>
                <option value={'Nombre / Razón social'}>Nombre / Razón social</option>
              </select>
            </div>
          </div>
          {/* DNI RUC */}
          <div class="form-control">
            <label></label>
            <div class="form-control form-agrupado">
              <input
                id="inputBusqueda"
                style={{ width: '100%' }}
                type="text"
                value={cadena.value}
                onChange$={(e) => {
                  cadena.value = (e.target as HTMLInputElement).value;
                }}
                // onChange={(e) => setRucDniRSNombre(e.target.value)}
                onKeyUp$={(e) => {
                  if (e.key === 'Enter') {
                    if ((document.getElementById('inputBusqueda') as HTMLInputElement).value.trim() !== '') {
                      buscarPersona.value++;
                    } else {
                      alert('Ingrese un valor a buscar');
                      document.getElementById('inputBusqueda')?.focus();
                    }
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('buscarPor')?.focus();
                  }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <ImgButton
                id="btnBuscarPersona0"
                src={images.searchPLUS}
                alt="Icono de buscar persona"
                height={16}
                width={16}
                title="Buscar persona"
                // onClick={localizarPersonas}
                onClick={$(() => {
                  if ((document.getElementById('inputBusqueda') as HTMLInputElement).value.trim() !== '') {
                    buscarPersona.value++;
                  } else {
                    alert('Ingrese un valor a buscar');
                    document.getElementById('inputBusqueda')?.focus();
                  }
                })}
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
                  ctx_docs_orden_servicio.personaSe = [];
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
              //  ancho={'570px'} parametrosGlobales={parametrosGlobales} onCerrar={cerrarPanelNewEditPersona}
            />
          </div>
        )}
        {/* TABLA DE PERSONAS HALLADAS*/}
        <div class="form-control">
          {buscarPersona.value > 0 ? (
            <TablaPersonasHalladas
              buscarPersona={buscarPersona.value}
              parametrosBusqueda={parametrosBusqueda}
              //   contexto={props.contexto}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});
