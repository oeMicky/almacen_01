import { $, component$, useContext } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '../system/imgButton';
import { CTX_ADD_NOTA_VENTA } from './addNotaVenta';

export default component$((props: { contexto: string; porcentaje: any }) => {
  //#region CONTEXTOS
  let ctx: any = [];
  //   let documento: any = [];
  switch (props.contexto) {
    // case 'orden_servicio':
    //   ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
    //   documento = useContext(CTX_O_S).requisiciones;
    //   break;
    // case 'orden_produccion':
    //   ctx = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
    //   break;
    // case 'new_venta':
    //   ctx = useContext(CTX_ADD_VENTA);
    //   documento = useContext(CTX_F_B_NC_ND).itemsVenta;
    //   break;
    case 'nota_venta':
      ctx = useContext(CTX_ADD_NOTA_VENTA);
      //   documento = useContext(CTX_NOTA_VENTA).itemsNotaVenta;
      break;
    // case 'new_edit_guiaRemision':
    //   ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
    //   break;
    // case 'new_edit_cotizacion':
    //   ctx = useContext(CTX_NEW_EDIT_COTIZACION);
    //   documento = useContext(CTX_COTIZACION).repuestosLubri;
    //   break;
    // case 'new_out_almacen':
    //   ctx = useContext(CTX_NEW_OUT_ALMACEN);
    //   documento = useContext(CTX_OUT_ALMACEN).itemsMercaderias;
    //   break;
  }
  //#endregion CONTEXTOS

  return (
    <div
      //   id="modal_panelPrueba"
      style={{
        width: 'clamp(320px, 100%, 500px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
        // background: '#eee',
      }}
      class="container-modal"
      //   onLoad$={() => console.log('🚍🚍🚍🚍🚍')}
      //   onFocus$={() => console.log('🚍🚍🚍🚍🚍 ffff')}
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          title="Cerrar el formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            // ctx_index_nota_venta.grabo_NotaVenta = grabo.value;
            ctx.mostrarPanelOtros = false;
          })}
        />
        {/* <input
          id="cerrar_PanelPrueba"
          type="image"
          title="Cerrar el formulario"
          alt="icon cerrar"
          autoFocus
          tabIndex={1}
          src={images.x}
          height={18}
          width={18}
          //   onClick$={() => {
          //     ctx_index_nota_venta.mostrarPanelPrueba = false;
          //   }}
        /> */}
        {/* <ImgButton
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el formulario"
            onClick={$(() => {
              ctx_index_nota_venta.mostrarPanelPrueba = false;
            })}
          /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <label>¿Desea eliminar el ítem? {props.contexto}</label>
          <br />
        </div>
      </div>
    </div>
  );
});
