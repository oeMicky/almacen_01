import { $, component$, useContext } from '@builder.io/qwik';
import { CTX_ADD_VENTA } from './addVenta';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';

export default component$((props: { borrarItemVenta: any }) => {
  //#region CONTEXTO
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 500px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
        background: '#eee',
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
            ctx_add_venta.mostrarPanelBorrarItemVenta = false;
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log('itemVenta', props.borrarItemVenta);
          })}
        /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <label>¿Desea eliminar el ítem?</label>
          <br />
          <p style={{ fontSize: '0.8rem', margin: '8px 16px' }}>
            <strong>{props.borrarItemVenta.codigo}</strong>
            <br />
            <strong>{props.borrarItemVenta.descripcion}</strong>
            <br />
          </p>
          <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_add_venta.borrar_idAuxilarVenta = props.borrarItemVenta.idAuxiliar;
                ctx_add_venta.mostrarPanelBorrarItemVenta = false;
                0;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_add_venta.mostrarPanelBorrarItemVenta = false;
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
