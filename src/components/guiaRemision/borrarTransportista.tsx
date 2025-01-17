import { $, component$, useContext } from '@builder.io/qwik';
import { CTX_NEW_EDIT_GUIA_REMISION } from './newEditGuiaRemision';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';

export default component$((props: { borrarTransportista: any }) => {
  //#region CONTEXTO
  const ctx_new_edit_GuiaRemision = useContext(CTX_NEW_EDIT_GUIA_REMISION);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 370px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {/* <ImgButton
        src={images.see}
        alt="Icono de cerrar"
        height={18}
        width={18}
        title="Cerrar el formulario"
        onClick={$(() => {
          //console.log('borrarChofer', props.borrarChofer);
        })}
      /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_new_edit_GuiaRemision.mostrarPanelDeleteTransportista = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <label>¿Desea eliminar el transportista?</label>
          <br />
          <p style={{ padding: '0 8px' }}>
            <label>{props.borrarTransportista.numeroIdentidad}</label>
            <br />
            <label>{props.borrarTransportista.razonSocialNombre}</label>
            <br />
            <label>{props.borrarTransportista.registroMTC}</label>
            <br />
          </p>
          <div style={{ display: 'flex', marginTop: '4px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_GuiaRemision.borrarIdAuxiliarTransportista = props.borrarTransportista.idAuxiliar;
                ctx_new_edit_GuiaRemision.mostrarPanelDeleteTransportista = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_GuiaRemision.mostrarPanelDeleteTransportista = false;
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
