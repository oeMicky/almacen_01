import { Resource, component$, useContext, useResource$, useStyles$ } from "@builder.io/qwik";
import { cerosALaIzquierda, formatearMonedaPEN, formatoDDMMYYYY_PEN } from "~/functions/comunes";
import type { IVenta } from "~/interfaces/iVenta";
import { CTX_INDEX_REPORTE_VENTA } from "~/routes/(ventas)/reporteVenta";
import style from "../tabla/tabla.css?inline";

export default component$((props: { buscarReporteVentas: number; parametrosBusqueda: any }) => {
  useStyles$(style);
  //#region CONTEXTO
  const ctx_index_reporteventa = useContext(CTX_INDEX_REPORTE_VENTA);
  //#region CONTEXTO

  //#region INICIALIZAR
  let suma_BASE = 0;
  let suma_IGV = 0;
  let suma_TOTAL = 0;
  //#endregion INICIALIZAR

  //#region BUSCANDO REGISTROS
  const lasVentas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaReporteVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => props.buscarReporteVentas.valueOf());

    // console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
    if (props.parametrosBusqueda.buscarPor === "FECHAS") {
      const abortController = new AbortController();
      cleanup(() => abortController.abort("cleanup"));
      // console.log('first FECHASSSSSSSSSSSSSSSSSSSSSSS');
      // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/reporteVentasPorFechas`, {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorFechas`, {
        // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.buscarPor === "PERIODO") {
      const abortController = new AbortController();
      cleanup(() => abortController.abort("cleanup"));
      // console.log('first PERIODOSSSSSSSSSSSSSSSSSSSSSSS');
      // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/reporteVentasPorPeriodo`, {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorPeriodo`, {
        // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
  });
  //#endregion BUSCANDO REGISTROS
  return (
    <>
      <Resource
        value={lasVentas}
        onPending={() => {
          console.log("onPending 🍉🍉🍉🍉");
          //
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          console.log("onRejected 🍍🍍🍍🍍");
          // props.buscarVentas = false;
          ctx_index_reporteventa.mostrarSpinner = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(ventas) => {
          console.log("onResolved 🍓🍓🍓🍓", ventas);
          const { data } = ventas; //{ status, data, message }
          const misVentas: IVenta[] = data;
          ctx_index_reporteventa.misRepoVts = misVentas;
          ctx_index_reporteventa.mostrarSpinner = false;

          return (
            <>
              {misVentas.length > 0 ? (
                <>
                  <table class="tabla-venta" style={{ fontSize: "0.8rem", fontWeight: "lighter" }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Nro. Doc</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Ser-Nro</th>
                        <th>Base Imp</th>
                        <th>IGV</th>
                        <th>Importe</th>
                        {/* <th>Mon</th> */}
                        {/* <th>Pago</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {misVentas.map((venta, index) => {
                        const indexItem = index + 1;
                        let bas = 0;
                        let ig = 0;
                        let tot = 0;
                        bas = venta.baseImponiblePEN.$numberDecimal ? venta.baseImponiblePEN.$numberDecimal : venta.baseImponiblePEN;
                        ig = venta.igvPEN.$numberDecimal ? venta.igvPEN.$numberDecimal : venta.igvPEN;
                        tot = venta.totalPEN.$numberDecimal ? venta.totalPEN.$numberDecimal : venta.totalPEN;

                        suma_BASE = suma_BASE + Number(bas);
                        suma_IGV = suma_IGV + Number(ig);
                        suma_TOTAL = suma_TOTAL + Number(tot);
                        return (
                          <tr key={venta._id}>
                            <td data-label="Item" class="comoCadena">
                              {indexItem}
                            </td>
                            <td data-label="Nro. Doc" class="comoCadena">
                              {venta.clienteVentasVarias ? "-" : venta.tipoDocumentoIdentidad + ": " + venta.numeroIdentidad}
                            </td>
                            <td data-label="Cliente" class="comoCadena">
                              {venta.clienteVentasVarias ? "Cliente ventas varias" : venta.razonSocialNombre}
                            </td>
                            <td data-label="Fecha" class="comoCadena">
                              {formatoDDMMYYYY_PEN(venta.fecha)}
                            </td>
                            <td data-label="Ser-Nro" class="comoCadena">
                              {venta.serie + " - " + cerosALaIzquierda(venta.numero, 8)}
                            </td>
                            <td data-label="Base Imp" class="comoNumero">
                              {formatearMonedaPEN(venta.baseImponiblePEN.$numberDecimal)}
                              {/* {formatear_2Decimales(mer)} */}
                              {/* {`${mer.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`} */}
                            </td>
                            <td data-label="IGV" class="comoNumero">
                              {formatearMonedaPEN(venta.igvPEN.$numberDecimal)}
                              {/* {`${ser.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`} */}
                            </td>
                            <td data-label="Importe" class="comoNumero">
                              {/* {formatearMonedaPEN(value.totalPEN.$numberDecimal)} */}
                              {`${parseFloat(venta.totalPEN.$numberDecimal).toLocaleString("en-PE", {
                                // style: 'currency',
                                currency: "PEN",
                                minimumFractionDigits: 2,
                              })}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5} class="comoNumero" style={{ color: "black" }}>
                          TOTALES PEN
                        </td>
                        <td class="comoNumero" style={{ color: "black" }}>
                          {`${suma_BASE.toLocaleString("en-PE", {
                            // style: 'currency',
                            currency: "PEN",
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero" style={{ color: "black" }}>
                          {`${suma_IGV.toLocaleString("en-PE", {
                            // style: 'currency',
                            currency: "PEN",
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero" style={{ color: "black" }}>
                          {`${suma_TOTAL.toLocaleString("en-PE", {
                            // style: 'currency',
                            currency: "PEN",
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                      </tr>
                    </tfoot>
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
    </>
  );
});
