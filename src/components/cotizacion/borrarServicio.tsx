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
        width: 'clamp(min(10vw, 20rem),800px, max(90vw, 55rem))',
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
            ctx_new_edit_cotizacion.mostrarPanelDeleteItemServicio = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('borrarServicio', ctx_new_edit_cotizacion.borrarServicio);
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
            <label>{ctx_new_edit_cotizacion.borrarServicio.codigo}</label>
            <br />
            <label>{ctx_new_edit_cotizacion.borrarServicio.descripcionEquivalencia}</label>
            <br />
          </div>
          <div style={{ display: 'flex', marginTop: '5px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_cotizacion.borrarIdServicio = ctx_new_edit_cotizacion.borrarServicio._id;
                ctx_new_edit_cotizacion.borrarIdAuxiliarServicio = ctx_new_edit_cotizacion.borrarServicio.idAuxiliar;
                ctx_new_edit_cotizacion.mostrarPanelDeleteItemServicio = false;
              }}
            >
              SI
            </button>{' '}
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_cotizacion.mostrarPanelDeleteItemServicio = false;
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
