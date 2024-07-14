import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_GUIA_REMISION, CTX_NEW_EDIT_GUIA_REMISION } from './newEditGuiaRemision';

export default component$(() => {
  //#region CONTEXTO
  const ctx_new_edit_guia_remision = useContext(CTX_NEW_EDIT_GUIA_REMISION);
  const ctx_guia_remision = useContext(CTX_GUIA_REMISION);
  //#endregion CONTEXTO
  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 600px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
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
            // ctx_new_edit_guia_remision.mostrarPanelVerificarObservacion_RESPUESTA = false;
            ctx_new_edit_guia_remision.mostrarPanelVerificarObservacion = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <div>El campo observación esta vacio, ¿Desea continuar?</div>
          <br />
          <div style={{ display: 'flex', marginTop: '4px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                // ctx_new_edit_guia_remision.mostrarPanelVerificarObservacion_RESPUESTA = true;
                ctx_guia_remision.verificarObservacionGR = false;
                ctx_new_edit_guia_remision.mostrarPanelVerificarObservacion = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                // ctx_new_edit_guia_remision.mostrarPanelVerificarObservacion_RESPUESTA = false;
                ctx_new_edit_guia_remision.mostrarPanelVerificarObservacion = false;
              }}
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
