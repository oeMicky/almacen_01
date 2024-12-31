import { $, component$, useContext } from '@builder.io/qwik';
// import { CTX_ADD_VENTA } from './addVenta';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_EDIT_COMPRA } from './newEditCompra';

export default component$((props: { borrarCuentaContable: any }) => {
  //#region CONTEXTO
  const ctx_new_edit_compra = useContext(CTX_NEW_EDIT_COMPRA);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 400px)',
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
            ctx_new_edit_compra.mostrarPanelBorrarCuentaContable = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log("itemVenta", props.borrarCuentaContable);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          ¿Desea eliminar la cuenta contable?
          <div style={{ fontSize: '0.8rem' }}>
            <strong>{props.borrarCuentaContable.codigo}</strong>
            <br />
            <strong>{props.borrarCuentaContable.descripcion}</strong>
            <br />
          </div>
          <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '64px' }}
              onClick$={() => {
                ctx_new_edit_compra.borrar_idAuxiliarCuentaContable = props.borrarCuentaContable.idAuxiliar;
                ctx_new_edit_compra.mostrarPanelBorrarCuentaContable = false;
                0;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '64px' }}
              onClick$={() => {
                ctx_new_edit_compra.mostrarPanelBorrarCuentaContable = false;
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
