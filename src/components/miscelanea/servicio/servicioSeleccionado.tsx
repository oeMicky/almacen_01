import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';

import { elIdAuxiliar } from '~/functions/comunes';
// import { CTX_DOCS_VENTA } from '~/routes/(almacen)/venta';
import { CTX_BUSCAR_SERVICIO } from './buscarServicio';
// import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
// import { CTX_DOCS_COTIZACION } from '~/routes/(almacen)/cotizacion';
import { CTX_F_B_NC_ND } from '~/components/venta/addVenta';
import { CTX_O_S } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_COTIZACION } from '~/components/cotizacion/newEditCotizacion';

export default component$((props: { serviSelecci: any; contexto: string; porcentaje: any }) => {
  //#region CONTEXTOS
  // let ctx: any = [];
  let documento: any = [];
  switch (props.contexto) {
    case 'orden_servicio':
      console.log('contexto::: orden servicio');
      // ctx = useContext(CTX_DOCS_ORDEN_SERVICIO);
      documento = useContext(CTX_O_S).servicios;
      break;
    case 'new_venta':
      console.log('contexto::: venta');
      // ctx = useContext(CTX_DOCS_VENTA);
      documento = useContext(CTX_F_B_NC_ND).itemsVenta;
      break;
    // case 'cotizacion':
    //   console.log('contexto::: cotizacion');
    //   ctx = useContext(CTX_DOCS_COTIZACION);
    //   //
    //   break;
    case 'new_edit_cotizacion':
      console.log('contexto::: new_edit_cotizacion');
      // ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      documento = useContext(CTX_COTIZACION).servicios;
      break;
  }

  const ctx_buscar_servicio = useContext(CTX_BUSCAR_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const cantidad = useSignal(1);
  const precio = useSignal(props.serviSelecci.precioPEN.$numberDecimal);
  // console.log('props.serviSelecci props.serviSelecci props.serviSelecci', props.serviSelecci);
  //#endregion INICIALIZACION

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 700px)',
        // width: 'auto',
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
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_buscar_servicio.mostrarPanelServicioSeleccionado = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('serviSelecci', props.serviSelecci);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* SERVICIO */}
        <div style={{ fontSize: '0.7rem' }}>
          <div>Código:{` ${props.serviSelecci.codigo ? props.serviSelecci.codigo : '_'}`}</div>
          <div>Descripción:{` ${props.serviSelecci.descripcion}`}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              Cantidad:
              <input
                id="inputCantidadServicio"
                type="number"
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
                type="number"
                style={{ width: '80px', textAlign: 'end', marginLeft: '5px' }}
                value={precio.value}
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
          <br />
        </div>

        {/* GRABAR  onClick={(e) => onSubmit(e)}*/}
        <input
          id="btnGrabarServicio"
          type="button"
          value="Grabar "
          class="btn-centro"
          onClick$={() => {
            console.log('props.serviSelecci - props.porcentaje.$numberDecimal -  precio.value', props.serviSelecci, parseFloat(props.porcentaje), precio.value);
            // let tipoImpuesto = 'IGV';
            // documento.itemsVenta.push({
            documento.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              idMercaderia: null,
              idEquivalencia: null,
              idKardex: null,
              item: 0,
              tipo: 'SERVICIO',

              tipoImpuesto: props.serviSelecci.tipoImpuesto,
              tipoAfectacionDelImpuesto: props.serviSelecci.tipoAfectacionDelImpuesto,
              porcentaje: parseFloat(props.porcentaje),

              codigo: props.serviSelecci.codigo ? props.serviSelecci.codigo : '_',

              descripcion: props.serviSelecci.descripcion,
              descripcionEquivalencia: props.serviSelecci.descripcion,

              cantidad: cantidad.value,
              cantidadEquivalencia: cantidad.value,

              unidad: 'ZZ',
              unidadEquivalencia: 'ZZ',

              costoUnitarioPEN: precio.value,
              costoUnitarioEquivalenciaPEN: precio.value,

              precioPEN: precio.value,

              ventaPEN: cantidad.value * precio.value,

              precioUSD: 0,
              ventaUSD: 0,

              codigoContableVenta: props.serviSelecci.codigoContableVenta,
              descripcionContableVenta: props.serviSelecci.descripcionContableVenta,
            });
            ctx_buscar_servicio.mostrarPanelServicioSeleccionado = false;
            // console.log('🚕🚕🚕🚕 ctx_f_b_nc_nd', ctx_f_b_nc_nd.itemsVenta);
          }}
        />
      </div>
    </div>
  );
});
