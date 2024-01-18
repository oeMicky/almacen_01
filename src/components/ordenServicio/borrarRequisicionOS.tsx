import { $, component$, useContext } from '@builder.io/qwik';
import { CTX_NEW_EDIT_ORDEN_SERVICIO } from './newEditOrdenServicio';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';

export default component$((props: { borrarRequisicion: any }) => {
  //#region CONTEXTO
  const ctx_new_edit_orden_servicio = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: 'clamp(332px, 86%, 600px)',
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
            ctx_new_edit_orden_servicio.mostrarPanelBorrarRequisicionOS = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          ¿Desea eliminar el ítem?
          <div>
            {/* <label>{cerosALaIzquierda(props.borrarItemMerca.item, 3)}</label>
            <br /> */}
            <label>{props.borrarRequisicion.codigo}</label>
            <br />
            <label>{props.borrarRequisicion.descripcion}</label>
            <br />
          </div>
          <div style={{ display: 'flex', marginTop: '5px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                // borrar_idAuxiliar = props.borrarItemMerca.idAuxiliar;
                // console.log('- documentos', documentos);
                // console.log('props.borrarItemMerca.idAuxiliar', props.borrarItemMerca.idAuxiliar);
                // const aMod: any = documentos.filter((docs: any) => docs.idAuxiliar !== props.borrarItemMerca.idAuxiliar);
                // console.log('- aMod', aMod);
                // documentos = aMod;
                ctx_new_edit_orden_servicio.borrar_idAuxiliarRequisicion = props.borrarRequisicion.idAuxiliar;
                ctx_new_edit_orden_servicio.borrar_idKardexRequisicion = props.borrarRequisicion.idKardex;
                ctx_new_edit_orden_servicio.borrar_idRequisicionOS = props.borrarRequisicion._id;
                ctx_new_edit_orden_servicio.mostrarPanelBorrarRequisicionOS = false;
              }}
            >
              SI
            </button>{' '}
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_edit_orden_servicio.mostrarPanelBorrarRequisicionOS = false;
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
