import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import { CTX_BUSCAR_MERCADERIA_OUT } from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
import { CTX_BUSCAR_MERCADERIA_IN } from '../miscelanea/mercaderiaIN/buscarMercaderiaIN';

export default component$((props: { ubigeo: string; contexto: string }) => {
  // const ctx_index_inventario = useContext(CTX_INDEX_INVENTARIO);
  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'index_inventario':
      ctx = useContext(CTX_INDEX_INVENTARIO);
      break;
    case 'buscar_mercaderia_in':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
      break;
    case 'buscar_mercaderia_out':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_OUT);
      break;
  }
  // const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
  //#endregion CONTEXTOS
  return (
    <div
      style={{
        width: 'clamp(280px, 100%, 320px)',
        // width: 'auto',
        padding: '2px',
        // background: '#c0c0c0',
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
            ctx.mostrarPanelVerUbigeoAntiguo = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Ubigeo antiguo</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        <div>
          {/* Marca  */}
          <div class="form-control" style={{ margin: '8px 0' }}>
            <div class="form-control form-agrupado">
              <input
                id="in_Ubigeo_Antiguo_IN"
                style={{ width: '100%', background: '#fff' }}
                readOnly
                type="text"
                placeholder="Ubigeo antiguo"
                value={props.ubigeo}
                //   onChange$={(e) => {
                //     marca.mar = (e.target as HTMLInputElement).value.trim().toUpperCase();
                //   }}
                //   onKeyUp$={(e) => {
                //     if (e.key === 'Enter') {
                //       document.getElementById('btn_grabar_MARCA_IN')?.focus();
                //     }
                //   }}
                //   onFocusin$={(e) => {
                //     (e.target as HTMLInputElement).select();
                //   }}
              />
            </div>
          </div>
          <br />
        </div>
      </div>
      {/* </Form> */}
    </div>
  );
});
