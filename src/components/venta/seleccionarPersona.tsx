import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import { parametrosGlobales } from '~/routes/login';
import NewEditPersona from './newEditPersona';
import TablaPersonasHalladas from './tablaPersonasHalladas';

export default component$((props: { soloPersonasNaturales: boolean; seleccionar: string }) => {
  //#region CONTEXTOS
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
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
      ctx_docs_venta.graboPersona;
    });
    if (ctx_docs_venta.graboPersona) {
      if ((document.getElementById('inputBusqueda') as HTMLInputElement).value.trim() !== '') {
        buscarPersona.value++;
      }

      ctx_docs_venta.graboPersona = false;
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
          onClick={$(() => {
            ctx_docs_venta.mostrarPanelSeleccionarPersona0 = false;
          })}
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
                placeholder="Ingrese el valor a buscar"
                autoFocus
                value={cadena.value}
                onChange$={(e) => {
                  cadena.value = (e.target as HTMLInputElement).value;
                }}
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
                onClick={$(() => {
                  ctx_docs_venta.personaSe = [];
                  ctx_docs_venta.mostrarPanelAgregarPersona0 = true;
                })}
              />
            </div>
          </div>
        </div>
        {ctx_docs_venta.mostrarPanelAgregarPersona0 && (
          <div class="modal">
            <NewEditPersona soloPersonaNatural={props.soloPersonasNaturales} personaSeleccio={ctx_docs_venta.personaSe} />
          </div>
        )}
        {/* TABLA DE PERSONAS HALLADAS*/}
        <div class="form-control">
          {buscarPersona.value > 0 ? (
            <TablaPersonasHalladas buscarPersona={buscarPersona.value} parametrosBusqueda={parametrosBusqueda} />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});
