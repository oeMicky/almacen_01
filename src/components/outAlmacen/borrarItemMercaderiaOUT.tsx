import { $, component$, useContext } from '@builder.io/qwik';
import { CTX_NEW_OUT_ALMACEN } from './newOutAlmacen';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';

export default component$((props: { borrarItemMerca: any }) => {
  //#region CONTEXTO
  const ctx_new_out_almacen = useContext(CTX_NEW_OUT_ALMACEN);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 400px)',
        // width: 'auto',
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
            ctx_new_out_almacen.mostrarPanelDeleteItemMercaderiaOUT = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <label>¿Desea eliminar el ítem?</label>
          <br />
          <p>
            {/* <label>{cerosALaIzquierda(props.borrarItemMerca.item, 3)}</label>
            <br /> */}
            <label>{props.borrarItemMerca.codigo}</label>
            <br />
            <label>{props.borrarItemMerca.descripcion}</label>
            <br />
          </p>
          <div style={{ display: 'flex', marginTop: '4px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                // borrar_idAuxiliar = props.borrarItemMerca.idAuxiliar;
                // //console.log('- documentos', documentos);
                // //console.log('props.borrarItemMerca.idAuxiliar', props.borrarItemMerca.idAuxiliar);
                // const aMod: any = documentos.filter((docs: any) => docs.idAuxiliar !== props.borrarItemMerca.idAuxiliar);
                // //console.log('- aMod', aMod);
                // documentos = aMod;
                ctx_new_out_almacen.borrarIdAuxiliar = props.borrarItemMerca.idAuxiliar;
                ctx_new_out_almacen.mostrarPanelDeleteItemMercaderiaOUT = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_new_out_almacen.mostrarPanelDeleteItemMercaderiaOUT = false;
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
