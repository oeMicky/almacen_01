import { Resource, component$, useContext, useResource$ } from "@builder.io/qwik";
import { images } from "~/assets";
import { CTX_NEW_OUT_ALMACEN } from "~/components/outAlmacen/newOutAlmacen";
// import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from "~/functions/comunes";
import type { IVenta } from "~/interfaces/iVenta";
import { CTX_VENTAS_CLIENTE } from "./ventasCliente";

export default component$((props: { buscarVentas100: number; parametrosBusqueda: any; contexto: string; esAlmacen: boolean }) => {
  //#region CONTEXTO
  let ctx: any = [];
  switch (props.contexto) {
    case "new_out_almacen":
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      break;
    // case 'new_venta':
    //   ctx = useContext(CTX_ADD_VENTA);
    //   break;
  }

  const ctx_ventas_cliente = useContext(CTX_VENTAS_CLIENTE);
  //#endregion CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasVentas100 = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarVentas100.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort("cleanup"));

    // console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + "/api/venta/obtener100VentasCliente", {
      // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.parametrosBusqueda),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={lasVentas100}
      onPending={() => {
        console.log("onPending 🍉🍉🍉🍉");
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log("onRejected 🍍🍍🍍🍍");
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ventas100) => {
        console.log("onResolved 🍓🍓🍓🍓", ventas100);
        const { data } = ventas100; //{ status, data, message }
        const misVentas100: IVenta[] = data;
        return (
          <>
            {misVentas100.length > 0 ? (
              <>
                <table style={{ fontSize: "0.8rem", fontWeight: "lighter " }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Fecha</th>
                      <th>Serie-Nro</th>
                      <th>Moneda</th>
                      <th>Importe</th>
                      <th>Pago</th>
                      <th>O.S.</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misVentas100.map((venta100Locali, index) => {
                      const { _id, fecha, serie, numero, moneda, totalPEN, totalUSD, metodoPago, idOrdenServicio, serieOrdenServicio, numeroOrdenServicio } =
                        venta100Locali;
                      const indexVenta = index + 1;

                      return (
                        <tr key={_id}>
                          <td data-label="Ítem" class="comoCadena">
                            {indexVenta}
                          </td>
                          <td data-label="Fecha" class="comoCadena">
                            {formatoDDMMYYYY_PEN(fecha)}
                          </td>
                          <td data-label="Serie-Nro" class="comoCadena">
                            {serie + " - " + cerosALaIzquierda(numero, 8)}
                          </td>
                          <td data-label="Moneda" class="acciones">
                            {moneda}
                          </td>
                          <td data-label="Importe" class="comoNumero">
                            {moneda === "PEN"
                              ? parseFloat(totalPEN.$numberDecimal).toLocaleString("en-PE", {
                                  // style: 'currency',
                                  currency: "PEN",
                                  minimumFractionDigits: 2,
                                })
                              : parseFloat(totalUSD.$numberDecimal).toLocaleString("en-US", {
                                  // style: 'currency',
                                  currency: "PEN",
                                  minimumFractionDigits: 2,
                                })}
                          </td>
                          <td data-label="Pago" class="comoCadena">
                            {metodoPago}
                          </td>
                          <td data-label="O.S." class="comoCadena">
                            {(serieOrdenServicio ? serieOrdenServicio : "") + " - " + (numeroOrdenServicio ? cerosALaIzquierda(numeroOrdenServicio, 8) : "")}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar venta"
                              height={14}
                              width={14}
                              // style={{ padding: '2px' }}
                              // style={{ margin: '2px' }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                if (typeof idOrdenServicio !== "undefined" && idOrdenServicio !== "" && idOrdenServicio !== null) {
                                  alert(
                                    `La venta presenta adjunto una orden de servicio ${serieOrdenServicio} - ${
                                      numeroOrdenServicio ? cerosALaIzquierda(numeroOrdenServicio, 8) : ""
                                    }.`
                                  );
                                  return;
                                }
                                ctx_ventas_cliente.vV = venta100Locali;
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
                <i style={{ fontSize: "0.8rem" }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
