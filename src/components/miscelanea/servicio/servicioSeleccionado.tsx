import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_F_B_NC_ND } from '~/components/venta/addVenta';
import { elIdAuxiliar } from '~/functions/comunes';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';

export default component$((props: { ancho: number; itemSeleccionado: any; esAlmacen: boolean }) => {
  //#region CONTEXTOS
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
  const ctx_f_b_nc_nd = useContext(CTX_F_B_NC_ND);
  //#endregion CONTEXTOS

  //#region INICIALIZANDO
  const cantidad = useSignal(1);
  const precio = useSignal(props.itemSeleccionado.precioPEN.$numberDecimal);
  // try {

  // } catch (error) {
  //   console.log('error EN INICIALIZANDO: ', error);
  // }
  //#endregion INICIALIZANDO

  // const enlaceServicio = useStore<IInEquivalencia>({
  //   cantidad: 1,
  //   unidad: '',
  //   precio: ,
  // });
  console.log('props.itemSeleccionado props.itemSeleccionado props.itemSeleccionado', props.itemSeleccionado);
  return (
    <div style={{ width: 'auto', border: '1px solid red', padding: '2px' }} class="container-modal">
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_docs_venta.mostrarServicioSeleccionado = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver clg"
          height={16}
          width={16}
          title="Cerrar el formulario"
          //   onClick={$(() => {
          //     console.log('mercaSelec', mercaSelec);
          //     console.log('mercaSelec.mS', mercaSelec.mS);
          //   })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* SERVICIO */}
        <div style={{ fontSize: '0.7rem' }}>
          <div>Código:{` ${props.itemSeleccionado.codigo ? props.itemSeleccionado.codigo : '_'}`}</div>
          <div>Descripción:{` ${props.itemSeleccionado.descripcion}`}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              Cantidad:
              <input
                id="inputCantidadServicio"
                style={{ width: '80px', textAlign: 'end', marginLeft: '5px' }}
                autoFocus
                value={cantidad.value}
                // onChange={(e) => setPrecioEquivalente(e.target.value)}
                onInput$={(e) => {
                  cantidad.value = parseFloat((e.target as HTMLInputElement).value);
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyUp$={(e) => {
                  // console.log(e);
                  if (e.key === 'Enter') {
                    document.getElementById('inputPrecioServicio')?.focus();
                  }
                }}
              />
            </div>
            <div>
              Precio:
              <input
                id="inputPrecioServicio"
                style={{ width: '80px', textAlign: 'end', marginLeft: '5px' }}
                value={precio.value}
                // onChange={(e) => setPrecioEquivalente(e.target.value)}
                onInput$={(e) => {
                  precio.value = parseFloat((e.target as HTMLInputElement).value);
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyUp$={(e) => {
                  // console.log(e);
                  if (e.key === 'Enter') {
                    document.getElementById('btnGrabarServicio')?.focus();
                  }
                }}
              />
            </div>
          </div>
        </div>
        {/* GRABAR  onClick={(e) => onSubmit(e)}*/}
        <input
          id="btnGrabarServicio"
          type="button"
          value="Grabar "
          class="btn-centro"
          onClick$={() => {
            ctx_f_b_nc_nd.itemsVenta.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              item: 0,
              codigo: props.itemSeleccionado.codigo ? props.itemSeleccionado.codigo : '_',
              descripcionEquivalencia: props.itemSeleccionado.descripcion, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',
              cantidad: cantidad.value,
              unidadEquivalencia: '_',
              costo: 0,
              precioPEN: precio.value,
              ventaPEN: cantidad.value * precio.value,
              precioUSD: 0,
              ventaUSD: 0,
            });
            ctx_docs_venta.mostrarServicioSeleccionado = false;
            console.log('🚕🚕🚕🚕 ctx_f_b_nc_nd', ctx_f_b_nc_nd.itemsVenta);
          }}
        />
      </div>
    </div>
  );
});
