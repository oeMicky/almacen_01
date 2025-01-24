import { $, component$, useContext } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_INDEX_IN_ALMACEN } from '.';

export default component$((props: { borrarINALMACEN: any }) => {
  //#region CONTEXTO
  // let documentos: any = [];
  // documentos = useContext(CTX_IN_ALMACEN).itemsMercaderias;
  const ctx_index_in_almacen = useContext(CTX_INDEX_IN_ALMACEN);
  //#endregion CONTEXTO
  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 400px)',
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
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('borrarINALMACEN', props.borrarINALMACEN);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_in_almacen.mostrarPanelDeleteINALMACEN = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          <label>¿Desea eliminar el ingreso al almacén?</label>
          <br />
          <p style={{ margin: '8px 8px' }}>
            {/* <label>{cerosALaIzquierda(props.borrarItemMerca.item, 3)}</label>
              <br /> */}
            <label>{props.borrarINALMACEN.idINALMACEN}</label>
            <br />
            <label>{props.borrarINALMACEN.fecha}</label>
            <br />
            <label>{props.borrarINALMACEN.descripcion}</label>
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
                ctx_index_in_almacen.borrarIdInAlmacen = props.borrarINALMACEN.idINALMACEN;
                ctx_index_in_almacen.mostrarPanelDeleteINALMACEN = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px', cursor: 'pointer' }}
              onClick$={() => {
                ctx_index_in_almacen.mostrarPanelDeleteINALMACEN = false;
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
