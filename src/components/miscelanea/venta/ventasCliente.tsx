import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import ImgButton from '~/components/system/imgButton';
import TablaVentas100 from './tablaVentas100';
import { parametrosGlobales } from '~/routes/login';
import DespachoVenta from './despachoVenta';

export const CTX_VENTAS_CLIENTE = createContextId<any>('ventas_cliente');

export default component$((props: { contexto: string; cliente: any }) => {
  //#region DEFINICIO CTX_BUSCAR_ORDEN_SERVICIO
  const definicion_CTX_VENTAS_CLIENTE = useStore({
    vV: [],
    // mostrarPanelDespachoRequisiciones: false,
  });
  useContextProvider(CTX_VENTAS_CLIENTE, definicion_CTX_VENTAS_CLIENTE);
  //#endregion DEFINICIO CTX_BUSCAR_ORDEN_SERVICIO

  //#region CONTEXTO
  let ctx: any = [];
  switch (props.contexto) {
    case 'new_out_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      break;
    // case 'new_venta':
    //   ctx = useContext(CTX_ADD_VENTA);
    //   break;
  }
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);
  const buscarVentas100 = useSignal(0);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    // idAlmacen: parametrosGlobales.idAlmacen,
    idCliente: props.cliente._id,
  });
  //#endregion INICIALIZACION

  const localizar100Ventas = $(() => {
    buscarVentas100.value++;
  });

  //#region BUSCAR VENTAS
  useTask$(({ track }) => {
    track(() => ini);
    localizar100Ventas();
    // console.log(' buscarVentas100.value.......................', buscarVentas100.value);
  });
  //#endregion BUSCAR VENTAS

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 700px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
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
            ctx.mostrarPanelVentasCliente = false;
            // console.log('VENTAS_CLIENTE: es falso.....');
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('cliente', props.cliente);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3>Ventas del cliente</h3>
        {/* EL CLIENTE */}
        <div>
          <strong>{props.cliente.tipoDocumentoIdentidad + ': ' + props.cliente.numeroIdentidad}</strong>
          <br></br>
          <strong>{props.cliente.razonSocialNombre}</strong>
        </div>
        {/* TABLA VENTAS DE CLIENTE */}
        <div style={{ marginTop: '15px' }}>
          {buscarVentas100.value > 0 ? (
            <TablaVentas100
              buscarVentas100={buscarVentas100.value}
              // modoSeleccion={true}
              parametrosBusqueda={parametrosBusqueda}
              contexto={props.contexto}
              esAlmacen={true}
            />
          ) : (
            ''
          )}
        </div>
        {ctx.mostrarPanelDespachoVenta && (
          <div class="modal">
            <DespachoVenta contexto={props.contexto} ventaSeleccionada={definicion_CTX_VENTAS_CLIENTE.vV} />
          </div>
        )}
      </div>
    </div>
  );
});
