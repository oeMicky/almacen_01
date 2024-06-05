import { Resource, component$, useContext, useResource$, useStyles$ } from "@builder.io/qwik";
import { CTX_BUSCAR_DIRECCION_GR } from "./buscarDireccionGR";
import type { IDireccionGR } from "~/interfaces/iGuiaRemision";
import { images } from "~/assets";
import style from "../tabla/tabla.css?inline";
import { CTX_GUIA_REMISION, CTX_NEW_EDIT_GUIA_REMISION } from "./newEditGuiaRemision";

export default component$((props: { buscarDireccionesGR: number; sentido: string; parametrosBusqueda: any }) => {
  useStyles$(style);
  //#region CONTEXTO  // buscarDireccion: boolean;
  const ctx_buscar_DireccionGR = useContext(CTX_BUSCAR_DIRECCION_GR);
  const ctx_new_edit_guia_remision = useContext(CTX_NEW_EDIT_GUIA_REMISION);
  const ctx_guia_remision = useContext(CTX_GUIA_REMISION);
  //#endregion CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasDireccionesGR = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => props.buscarDireccionesGR.valueOf());

    // console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort("cleanup"));

    // if (props.buscarDireccion) {
    //   console.log("🎈🎈🎈🎈🎈🎈");
    //   const res = await fetch(`${import.meta.env.VITE_URL}/api/guiaRemision/obtenerDireccionGR`, {
    //     // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorFechas`, {
    //     // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(props.parametrosBusqueda),
    //     signal: abortController.signal,
    //   });
    //   return res.json();
    // } else {
    console.log("✨✨✨✨✨✨");
    const res = await fetch(`${import.meta.env.VITE_URL}/api/guiaRemision/obtenerDireccionesGR`, {
      // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorFechas`, {
      // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props.parametrosBusqueda),
      signal: abortController.signal,
    });
    return res.json();
    // }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={lasDireccionesGR}
      onPending={() => {
        console.log("onPending 🍉🍉🍉🍉");
        //
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log("onRejected 🍍🍍🍍🍍");
        // props.buscarVentas = false;
        ctx_buscar_DireccionGR.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(direccionesGR) => {
        console.log("onResolved 🍓🍓🍓🍓");
        const { data } = direccionesGR; //{ status, data, message }
        const misDireccionesGR: IDireccionGR[] = data;
        // ctx_index_venta.miscVts = misGuiasRemision;
        ctx_buscar_DireccionGR.mostrarSpinner = false;

        return (
          <>
            {misDireccionesGR.length > 0 ? (
              <>
                <table class="tabla-venta" style={{ fontSize: "0.8rem", fontWeight: "lighter" }}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Dirección</th>
                      <th>Ubigeo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misDireccionesGR.map((direcGR, index) => {
                      const indexItem = index + 1;
                      return (
                        <tr key={direcGR._id}>
                          <td data-label="Item" class="comoCadena">
                            {indexItem}
                          </td>
                          <td data-label="Dirección" class="comoCadena">
                            {direcGR.direccion}
                          </td>
                          <td data-label="Ubigeo" class="comoCadena">
                            {direcGR.ubigeo}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar dirección"
                              height={14}
                              width={14}
                              style={{ margin: "2px" }}
                              onClick$={() => {
                                if (props.sentido === "partida") {
                                  ctx_guia_remision.puntoPartida = direcGR.direccion;
                                  ctx_guia_remision.ubigeoPartida = direcGR.ubigeo;
                                  ctx_new_edit_guia_remision.mostrarPanelBuscarPuntoPartida = false;
                                }
                                if (props.sentido === "llegada") {
                                  ctx_guia_remision.puntoLlegada = direcGR.direccion;
                                  ctx_guia_remision.ubigeoLlegada = direcGR.ubigeo;
                                  ctx_new_edit_guia_remision.mostrarPanelBuscarPuntoLlegada = false;
                                }
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar dirección"
                              height={14}
                              width={14}
                              style={{ margin: "2px" }}
                              onClick$={() => {
                                ctx_buscar_DireccionGR.dGR = direcGR;
                                ctx_buscar_DireccionGR.mostrarPanelNewEditDireccionGR = true;
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
