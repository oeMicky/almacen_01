import { $, Resource, component$, useContext, useResource$, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";

import style from "../tabla/tabla.css?inline";

import { images } from "~/assets";
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from "~/functions/comunes";
import { CTX_INDEX_ORDEN_PRODUCCION } from "~/routes/(ordenesProduccion)/ordenProduccion";
import type { IOrdenProduccion } from "~/interfaces/iOrdenProduccion";
import pdfOrdenProduccion from "~/reports/pdfOrdenProduccion";
// import pdfOsMG from "~/reports/MG/pdfOsMG";
// import pdfOsMG_ConVehiculo from "~/reports/MG/pdfOsMG_ConVehiculo";

export default component$((props: { buscarOrdenesProduccion: number; parametrosBusqueda: any }) => {
  useStyles$(style);

  //#region CONTEXTOS
  const ctx_index_orden_produccion = useContext(CTX_INDEX_ORDEN_PRODUCCION);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const clickPDF = useSignal(0);
  const opSeleccionada = useSignal<IOrdenProduccion>();
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const lasOrdenesProduccion = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarOrdenesProduccion.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort("cleanup"));

    const res = await fetch(import.meta.env.VITE_URL + "/api/ordenProduccion/getOrdenesProduccionPorPeriodo", {
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

  //#region VISUZALIZAR PDF
  //   const verPDF_OS_Vehiculo = $((os: any) => {
  //     console.log("a pdfOsMG", os); //venta !== null &&
  //     if (typeof os !== "undefined") {
  //       console.log("imprimiendo ... imprimiendo ... verPDF_OS_Vehiculo ...", os);
  //       // pdfCotizacion98(cotizacion);
  //       pdfOsMG_ConVehiculo(os);
  //     }
  //   });

  const verPDF_OP = $((op: any) => {
    console.log("a pdfOrdenProduccion", op); //venta !== null &&
    if (typeof op !== "undefined") {
      console.log("imprimiendo ... imprimiendo ... verPDF_OP ...", op);
      // pdfCotizacion98(cotizacion);
      pdfOrdenProduccion(op);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDF.value);
    console.log("a opSeleccionada.value:", opSeleccionada.value);
    // if (opSeleccionada.value?.osConRegistroDeVehiculo) {
    //   await verPDF_OS_Vehiculo(opSeleccionada.value);
    // } else {
    await verPDF_OP(opSeleccionada.value);
    // }
  });
  //#endregion VISUZALIZAR PDF

  return (
    <Resource
      value={lasOrdenesProduccion}
      onPending={() => {
        console.log("onPending 🍉🍉🍉🍉");
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log("onRejected 🍍🍍🍍🍍");
        ctx_index_orden_produccion.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ordenesProduccion) => {
        console.log("onResolved 🍓🍓🍓🍓");
        const { data } = ordenesProduccion; //{ status, data, message }
        const misOrdenesProduccion: IOrdenProduccion[] = data;
        ctx_index_orden_produccion.mostrarSpinner = false;
        return (
          <>
            {misOrdenesProduccion.length > 0 ? (
              <>
                <table style={{ fontSize: "0.8rem", fontWeight: "lighter", padding: "4px" }}>
                  <thead>
                    <tr>
                      <th>OP</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Requerimiento</th>
                      <th>Estado</th>
                      <th>Tipo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misOrdenesProduccion.map((ordProdLocali) => {
                      const { _id, fechaInicio, razonSocialNombreCliente, serie, numero, estado, tipo } = ordProdLocali;
                      // const indexItem = index + 1; , index
                      return (
                        <tr key={_id}>
                          <td data-label="OS" class="comoCadena">
                            {serie + " - " + cerosALaIzquierda(numero, 8)}
                          </td>
                          <td data-label="Fecha" class="comoCadena">
                            {fechaInicio ? formatoDDMMYYYY_PEN(fechaInicio) : "_"}
                          </td>
                          <td data-label="Cliente" class="comoCadena">
                            {ordProdLocali.clienteVentasVarias ? "Cliente ventas varias" : razonSocialNombreCliente}
                          </td>
                          <td data-label="Requerimiento" class="comoCadena" style={estado === "APERTURADO" ? { color: "#9103aa" } : {}}>
                            {ordProdLocali.requerimientosCliente}
                          </td>
                          <td data-label="Estado" class="comoCadena" style={estado === "APERTURADO" ? { color: "#9103aa" } : {}}>
                            {estado ? estado : "_"}
                          </td>
                          <td data-label="Tipo" class="comoCadena">
                            {tipo ? tipo : "_"}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar orden de producción"
                              disabled={estado === "FACTURADO"}
                              height={14}
                              width={14}
                              style={{ marginRight: "8px" }}
                              onClick$={() => {
                                console.log("ordProdLocali", ordProdLocali);
                                ctx_index_orden_produccion.oP = ordProdLocali;
                                ctx_index_orden_produccion.mostrarPanelNewEditOrdenProduccion = true;
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.pdf}
                              title="Ver orden de producción"
                              height={14}
                              width={14}
                              onClick$={() => {
                                opSeleccionada.value = ordProdLocali;
                                clickPDF.value++;
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
