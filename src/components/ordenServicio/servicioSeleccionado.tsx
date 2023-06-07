import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { elIdAuxiliar } from '~/functions/comunes';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { CTX_O_S } from './newEditOrdenServicio';

export default component$((props: { servicioSeleccionado: any }) => {
  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  const ctx_o_s = useContext(CTX_O_S);
  //#endregion CONTEXTOS

  //#region INICIALIZANDO
  const cantidad = useSignal(1);
  const precio = useSignal(props.servicioSeleccionado.precio.$numberDecimal);
  //#endregion INICIALIZANDO

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
            //   ctx_PanelVenta.mostrarServicioSeleccionado = false;
          })}
        />
        <ImgButton src={images.see} alt="Icono de ver clg" height={16} width={16} title="Cerrar el formulario" />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* SERVICIO */}
        <div style={{ fontSize: '0.7rem' }}>
          <div>Código:{` ${props.servicioSeleccionado.codigo ? props.servicioSeleccionado.codigo : '_'}`}</div>
          <div>Descripción:{` ${props.servicioSeleccionado.descripcion}`}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              Cantidad:
              <input
                id="inputCantidadServicio"
                style={{ width: '80px', textAlign: 'end' }}
                value={cantidad.value}
                onInput$={(e) => {
                  cantidad.value = parseFloat((e.target as HTMLInputElement).value);
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyUp$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('btnGrabarEquivalencia')?.focus();
                  }
                }}
              />
            </div>
            <div>
              Precio:
              <input
                id="inputPrecioServicio"
                style={{ width: '80px', textAlign: 'end' }}
                value={precio.value}
                onInput$={(e) => {
                  precio.value = parseFloat((e.target as HTMLInputElement).value);
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyUp$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('btnGrabarEquivalencia')?.focus();
                  }
                }}
              />
            </div>
          </div>
        </div>
        {/* GRABAR  onClick={(e) => onSubmit(e)}*/}
        <input
          id="btnGrabarEquivalencia"
          type="button"
          value="Grabar "
          class="btn-centro"
          onClick$={() => {
            ctx_o_s.servicios.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              item: 0,
              codigo: props.servicioSeleccionado.codigo ? props.servicioSeleccionado.codigo : '_',
              descripcionEquivalencia: props.servicioSeleccionado.descripcion, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',
              cantidad: cantidad.value,
              unidadEquivalencia: '_',
              costo: 0,
              precioPEN: precio.value,
              ventaPEN: cantidad.value * precio.value,
              precioUSD: 0,
              ventaUSD: 0,
            });
            ctx_docs_orden_servicio.mostrarServicioSeleccionado = false;
            console.log('🚕🚕🚕🚕 ctx_o_s', ctx_o_s.servicios);
          }}
        />
      </div>
    </div>
  );
});
