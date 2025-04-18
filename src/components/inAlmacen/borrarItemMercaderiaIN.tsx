import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_IN_ALMACEN } from './newInAlmacen';
// import { cerosALaIzquierda } from '~/functions/comunes';

export default component$((props: { borrarItemMercaIN: any }) => {
  //#region CONTEXTO
  // let documentos: any = [];
  // documentos = useContext(CTX_IN_ALMACEN).itemsMercaderias;
  const ctx_new_in_almacen = useContext(CTX_NEW_IN_ALMACEN);
  //#endregion CONTEXTO
  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 400px)',
        //width: 'auto',
        border: '1px solid red',
        padding: '2px',
        // background: '#eee',
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
            ctx_new_in_almacen.mostrarPanelDeleteItemMercaderiaIN = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          <label>¿Desea eliminar el ítem?</label>
          <br />
          <p style={{ margin: '8px 8px' }}>
            {/* <label>{cerosALaIzquierda(props.borrarItemMerca.item, 3)}</label>
            <br /> */}
            <label>{props.borrarItemMercaIN.codigo}</label>
            <br />
            <label>{props.borrarItemMercaIN.descripcion}</label>
            <br />
          </p>
          <div style={{ display: 'flex', marginTop: '5px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px', cursor: 'pointer' }}
              onClick$={() => {
                // borrar_idAuxiliar = props.borrarItemMerca.idAuxiliar;
                // //console.log('- documentos', documentos);
                // //console.log('props.borrarItemMerca.idAuxiliar', props.borrarItemMerca.idAuxiliar);
                // const aMod: any = documentos.filter((docs: any) => docs.idAuxiliar !== props.borrarItemMerca.idAuxiliar);
                // //console.log('- aMod', aMod);
                // documentos = aMod;
                ctx_new_in_almacen.borrarIdAuxiliar = props.borrarItemMercaIN.idAuxiliar;
                ctx_new_in_almacen.mostrarPanelDeleteItemMercaderiaIN = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px', cursor: 'pointer' }}
              onClick$={() => {
                ctx_new_in_almacen.mostrarPanelDeleteItemMercaderiaIN = false;
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
