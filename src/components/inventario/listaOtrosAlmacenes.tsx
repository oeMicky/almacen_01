import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import { CTX_BUSCAR_MERCADERIA_IN } from '../miscelanea/mercaderiaIN/buscarMercaderiaIN';
import { CTX_BUSCAR_MERCADERIA_OUT } from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';

export default component$((props: { otrosAlmacenes: any; contexto: string }) => {
  //#region CONTEXTOS
  // const ctx_index_inventario = useContext(CTX_INDEX_INVENTARIO);
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
    // case 'new_edit_cotizacion':
    //   ctx = useContext(CTX_NEW_EDIT_COTIZACION);
    //   break;
  }
  //#endregion CONTEXTOS
  return (
    <div
      style={{
        width: 'clamp(280px, 100%, 320px)',
        // width: 'auto',
        // border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {/* <ImgButton
              src={images.see}
              alt="Icono de cerrar"
              height={18}
              width={18}
              title="Cerrar el formulario"
              onClick={$(() => {
                console.log(losUbigeosStocks);
              })}
            /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelListaOtrosAlmacenes = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'grey' }}>Otros Almacenes</h3>

      {/* FORMULARIO */}
      <div class="add-form">
        <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>Acc</th>
            </tr>
          </thead>
          <tbody>
            {props.otrosAlmacenes.map((otrosAlma: any) => {
              const { idAlmacen, sucursal } = otrosAlma;
              //   total = total + Number(stock.$numberDecimal);
              return (
                <tr id={idAlmacen}>
                  <td data-label="Sucursal">{sucursal}</td>
                  <td data-label="Acc" class="accionesLeft">
                    <input
                      // id="in_BuscarDetraccion"
                      title="Seleccionar almacén"
                      type="image"
                      src={images.check32}
                      alt="icono seleccionar"
                      height={14}
                      width={14}
                      onClick$={() => {
                        //   definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.uS = ubiLoca;
                        //   definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.listaUbigeos = misUbigeosStocks;

                        ctx.almacenExterno = otrosAlma;
                        ctx.mostrarPanelListaOtrosAlmacenes = false;
                        ctx.mostrarPanelInventarioExterno = true;
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
