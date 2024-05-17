import { $, Resource, component$, useContext, useResource$, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { IVentaCLienteVentasVarias } from '~/interfaces/iVenta';
import { parametrosGlobales } from '~/routes/login';
import DespachoVenta from '../venta/despachoVenta';

export default component$((props: { contexto: string }) => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_NEW_OUT_ALMACEN);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const ventSelec = useSignal({});
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const lasVentas140 = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => ini.value);

    // console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasClienteVentasVarias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idSucursal: parametrosGlobales.idSucursal,
      }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(330px, 86%, 600px)',
        // width: 'auto',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          title="Cerrar el formulario"
          height={18}
          width={18}
          onClick={$(() => {
            ctx.mostrarPanelVentasClienteVentasVarias = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '12px' }}>Ventas de: Cliente ventas varias</h3>
        {/* TABLA VENTAS CLIETNE VENTAS VARIAS */}
        <div style={{ marginBottom: '8px' }}>
          <Resource
            value={lasVentas140}
            onPending={() => {
              console.log('onPending 🍉🍉🍉🍉');
              //
              return <div>Cargando...</div>;
            }}
            onRejected={() => {
              console.log('onRejected 🍍🍍🍍🍍');

              // ctx_index_venta.mostrarSpinner = false;
              return <div>Fallo en la carga de datos</div>;
            }}
            onResolved={(ventas140) => {
              console.log('onResolved 🍓🍓🍓🍓', ventas140);
              const { data } = ventas140; //{ status, data, message }
              const misVentas140: IVentaCLienteVentasVarias[] = data;
              // ctx_index_venta.miscVts = misVentas;
              // ctx_index_venta.mostrarSpinner = false;

              return (
                <>
                  {misVentas140.length > 0 ? (
                    <>
                      <table class="tabla-venta" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                        <thead>
                          <tr>
                            <th>Item</th>
                            {/*   <th>Nro. Doc</th>
                           <th>Cliente</th> */}
                            <th>Fecha</th>
                            <th>Ser-Nro</th>
                            <th>Importe</th>
                            <th>Mon</th>
                            <th>Metodo pago</th>
                            {/* <th>Efectivo</th>
                            <th>O. M. Pago</th>
                            <th>Monto O. M. Pago</th> */}
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {misVentas140.map((venta, index) => {
                            const indexItem = index + 1;

                            return (
                              <tr key={venta._id}>
                                <td data-label="Item" class="comoCadena">
                                  {indexItem}
                                </td>
                                {/*   <td data-label="Nro. Doc" class="comoCadena">
                                  {venta.clienteVentasVarias ? '-' : venta.tipoDocumentoIdentidad + ': ' + venta.numeroIdentidad}
                                </td>
                                <td data-label="Cliente" class="comoCadena">
                                  {venta.clienteVentasVarias ? 'Cliente ventas varias' : venta.razonSocialNombre}
                                </td> */}
                                <td data-label="Fecha" class="comoCadena">
                                  {formatoDDMMYYYY_PEN(venta.fecha)}
                                </td>
                                <td data-label="Ser-Nro" class="comoCadena">
                                  {venta.serie + ' - ' + cerosALaIzquierda(venta.numero, 8)}
                                </td>
                                <td data-label="Importe" class="comoNumero">
                                  {venta.moneda === 'PEN'
                                    ? parseFloat(venta.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                        // style: 'currency',
                                        currency: 'PEN',
                                        minimumFractionDigits: 2,
                                      })
                                    : parseFloat(venta.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                        // style: 'currency',
                                        currency: 'PEN',
                                        minimumFractionDigits: 2,
                                      })}
                                </td>
                                <td data-label="Mon" class="acciones">
                                  {venta.moneda}
                                </td>
                                <td data-label="Metodo pago" class="comoCadena">
                                  {venta.metodoPago}
                                </td>
                                {/* <td data-label="Efectivo" class="comoNumero">
                                  {venta.metodoPago === 'CONTADO'
                                    ? venta.todoEnEfectivo
                                      ? parseFloat(venta.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                          // style: 'currency',
                                          currency: 'PEN',
                                          minimumFractionDigits: 2,
                                        })
                                      : parseFloat(venta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                          // style: 'currency',
                                          currency: 'PEN',
                                          minimumFractionDigits: 2,
                                        })
                                    : ''}
                                </td>
                                <td data-label="O. M. Pago" class="comoCadena">
                                  {venta.metodoPago === 'CONTADO' ? (venta.todoEnEfectivo ? '' : venta.otroMedioPago) : ''}
                                </td>
                                <td data-label="Monto O. M. Pago" class="comoNumero">
                                  {parseFloat(venta.montoOtroMedioPago.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                                </td> */}
                                <td data-label="Acciones" class="acciones">
                                  <input
                                    // id="in_BuscarDetraccion"
                                    type="image"
                                    src={images.check32}
                                    title="Seleccionar venta"
                                    height={14}
                                    width={14}
                                    style={{ marginRight: '4px' }}
                                    onClick$={() => {
                                      if (
                                        venta.idOrdenServicio !== null &&
                                        typeof venta.idOrdenServicio !== 'undefined' &&
                                        venta.idOrdenServicio !== ''
                                      ) {
                                        alert(
                                          `La venta presenta adjunto una orden de servicio ${venta.serieOrdenServicio} - ${
                                            venta.numeroOrdenServicio ? cerosALaIzquierda(venta.numeroOrdenServicio, 8) : ''
                                          }.`
                                        );
                                        return;
                                      }
                                      ventSelec.value = venta;
                                      ctx.mostrarPanelDespachoVenta = true;
                                    }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <div>
                      <i style={{ fontSize: '0.8rem' }}>No se encontraron registros</i>
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
        {ctx.mostrarPanelDespachoVenta && (
          <div class="modal">
            <DespachoVenta contexto={props.contexto} ventaSeleccionada={ventSelec.value} />
          </div>
        )}
      </div>
    </div>
  );
});
