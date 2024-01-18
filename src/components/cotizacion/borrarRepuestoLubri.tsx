import { $, component$, useContext } from '@builder.io/qwik';
import { CTX_NEW_EDIT_COTIZACION } from './newEditCotizacion';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';

export default component$(() => {
  //#region CONTEXTO
  const ctx_new_edit_cotizacion = useContext(CTX_NEW_EDIT_COTIZACION);
  //#endregion CONTEXTO
  return (
    <div
      style={{
        width: 'clamp(386px, 86%, 800px)',
        //width: 'auto',
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
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_new_edit_cotizacion.mostrarPanelDeleteItemRepuestoLubri = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('borrarServicio', ctx_new_edit_cotizacion.borrarRepuestoLubri);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          ¿Desea eliminar el servicio?
          <div>
            {/* <label>{cerosALaIzquierda(props.borrarItemMerca.item, 3)}</label>
            <br /> */}
            <label>{ctx_new_edit_cotizacion.borrarRepuestoLubri.codigo}</label>
            <br />
            <label>{ctx_new_edit_cotizacion.borrarRepuestoLubri.descripcionEquivalencia}</label>
            <br />
          </div>
          <div style={{ display: 'flex', marginTop: '5px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_cotizacion.borrarIdRepuestoLubri = ctx_new_edit_cotizacion.borrarRepuestoLubri._id;
                ctx_new_edit_cotizacion.borrarIdAuxiliarRepuestoLubri = ctx_new_edit_cotizacion.borrarRepuestoLubri.idAuxiliar;
                ctx_new_edit_cotizacion.mostrarPanelDeleteItemRepuestoLubri = false;
              }}
            >
              SI
            </button>{' '}
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_cotizacion.mostrarPanelDeleteItemRepuestoLubri = false;
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
