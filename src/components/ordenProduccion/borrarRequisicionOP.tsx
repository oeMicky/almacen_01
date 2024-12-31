import { $, component$, useContext } from '@builder.io/qwik';
// import { CTX_NEW_EDIT_ORDEN_SERVICIO } from './newEditOrdenServicio';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_EDIT_ORDEN_PRODUCCION } from './newEditOrdenProduccion';

export default component$((props: { borrarRequisicion: any }) => {
  //#region CONTEXTO
  const ctx_new_edit_orden_produccion = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 420px)',
        //width: 'auto',
        border: '1px solid red',
        padding: '2px',
        background: '#eee',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Ver el props.borrarRequisicion"
          onClick={$(() => {
            //console.log('props.borrarRequisicion', props.borrarRequisicion);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_new_edit_orden_produccion.mostrarPanelBorrarRequisicionOP = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          <div>¿Desea eliminar la requisición del suministro?</div>
          <br />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* <label>{cerosALaIzquierda(props.borrarItemMerca.item, 3)}</label>
            <br />  */}
            <label style={{ marginBottom: '4px' }}>{props.borrarRequisicion.codigo}</label>
            {/* <br /> */}
            <label>{props.borrarRequisicion.descripcion}</label>
          </div>
          <br />
          {/* BOTONES */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_orden_produccion.borrar_idAuxiliarRequisicion = props.borrarRequisicion.idAuxiliar;
                ctx_new_edit_orden_produccion.borrar_idKardexRequisicion = props.borrarRequisicion.idKardex;
                ctx_new_edit_orden_produccion.borrar_idRequisicionOP = props.borrarRequisicion._id;
                ctx_new_edit_orden_produccion.mostrarPanelBorrarRequisicionOP = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_orden_produccion.mostrarPanelBorrarRequisicionOP = false;
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
