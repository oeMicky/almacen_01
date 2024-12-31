import { $, component$, useContext } from '@builder.io/qwik';
// import { CTX_ADD_VENTA } from './addVenta';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
// import { CTX_NEW_EDIT_COMPRA } from './newEditCompra';
import { CTX_NEW_EDIT_CUENTA_CONTABLE } from './newEditCuentaContable';

export default component$((props: { borrarCuentaDestino: any }) => {
  //#region CONTEXTO
  const ctx_new_edit_cuenta_contable = useContext(CTX_NEW_EDIT_CUENTA_CONTABLE);
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
            ctx_new_edit_cuenta_contable.mostrarPanelBorrarCuentaDestino = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="Ver el borrarCuentaDestino"
          onClick={$(() => {
            //console.log('borrarCuentaDestino', props.borrarCuentaDestino);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          ¿Desea eliminar la cuenta destino?
          <div style={{ fontSize: '0.7rem' }}>
            <strong>{props.borrarCuentaDestino.codigo}</strong>
            <br />
            <strong>{props.borrarCuentaDestino.descripcion}</strong>
            <br />
          </div>
          <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '64px' }}
              onClick$={() => {
                ctx_new_edit_cuenta_contable.borrar_idAuxiliarCuentaDestino = props.borrarCuentaDestino.idAuxiliar;
                ctx_new_edit_cuenta_contable.mostrarPanelBorrarCuentaDestino = false;
                0;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '64px' }}
              onClick$={() => {
                ctx_new_edit_cuenta_contable.mostrarPanelBorrarCuentaDestino = false;
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
