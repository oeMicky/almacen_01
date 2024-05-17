import { $, component$, useContext } from '@builder.io/qwik';
import { CTX_NEW_EDIT_GUIA_REMISION } from './newEditGuiaRemision';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';

export default component$((props: { borrarUnidadTransporte: any }) => {
  //#region CONTEXTO
  const ctx_new_edit_GuiaRemision = useContext(CTX_NEW_EDIT_GUIA_REMISION);
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
            ctx_new_edit_GuiaRemision.mostrarPanelDeleteChofer = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          ¿Desea eliminar la unidad transporte?
          <div>
            <label>{props.borrarUnidadTransporte.descripcionTCP}</label>
            <br />
            <label>{props.borrarUnidadTransporte.fecha}</label>
            <br />
            <label>{props.borrarUnidadTransporte.serie}</label>
            <br />
            <label>{props.borrarUnidadTransporte.numero}</label>
            <br />
          </div>
          <div style={{ display: 'flex', marginTop: '4px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_GuiaRemision.borrarIdAuxiliarUnidadTransporte = props.borrarUnidadTransporte.idAuxiliar;
                ctx_new_edit_GuiaRemision.mostrarPanelDeleteUnidadTransporte = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_GuiaRemision.mostrarPanelDeleteChofer = false;
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
