import { Resource, component$, useContext, useResource$, useStylesScoped$ } from "@builder.io/qwik";
import style from "../../tabla/tabla.css?inline";
import { CTX_BUSCAR_MERCADERIA_OUT } from "./buscarMercaderiaOUT";
import type { IMercaderiaOUT } from "~/interfaces/iMercaderia";
// import ImgButton from '~/components/system/imgButton';
import { images } from "~/assets";
import { formatear_6Decimales } from "~/functions/comunes";
// import { exit } from 'process';

export default component$(
  (props: {
    buscarMercaderiasOUT: number;
    parametrosBusqueda: any;
    contexto: string;
    esAlmacen: boolean;
    esProduccion?: boolean;
    verAplicacion: boolean;
    verLineaMarca: boolean;
  }) => {
    useStylesScoped$(style);

    //#region CONTEXTOS
    const ctx_buscar_mercaderia_out = useContext(CTX_BUSCAR_MERCADERIA_OUT);
    //#endregion CONTEXTOS

    //#region BUSCANDO REGISTROS
    const lasMercaderiasOUT = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.buscarMercaderiasOUT.valueOf());

      const abortController = new AbortController();
      cleanup(() => abortController.abort("cleanup"));

      console.log("parametrosBusqueda", props.parametrosBusqueda);

      if (props.parametrosBusqueda.buscarPor === "Descripción") {
        const res = await fetch(import.meta.env.VITE_URL + "/api/mercaderia/buscarMercaderiasPorDescripcion", {
          // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(props.parametrosBusqueda),
          signal: abortController.signal,
        });
        return res.json();
      }
      if (props.parametrosBusqueda.buscarPor === "Aplicación") {
        const res = await fetch(import.meta.env.VITE_URL + "/api/mercaderia/buscarMercaderiasPorAplicacion", {
          // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
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
      <Resource
        value={lasMercaderiasOUT}
        onPending={() => {
          console.log("onPending 🍉🍉🍉🍉");
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          console.log("onRejected 🍍🍍🍍🍍");
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(mercasOUT) => {
          console.log("onResolved 🍓🍓🍓🍓", mercasOUT);
          const { data } = mercasOUT; //{ status, data, message }
          const misMercaderiasOUT: IMercaderiaOUT[] = data;
          console.log("misMercaderiasOUT", misMercaderiasOUT);
          return (
            <>
              {misMercaderiasOUT.length > 0 ? (
                <>
                  <table style={{ fontSize: "0.8rem", fontWeight: "lighter " }}>
                    {/* <table style={{ fontWeight: 'lighter ' }}> */}
                    {/* <table> */}
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th style={props.verAplicacion ? "" : { display: "none" }}>Aplicación</th>
                        <th style={props.verLineaMarca ? "" : { display: "none" }}>Linea/Tipo</th>
                        <th style={props.verLineaMarca ? "" : { display: "none" }}>Marca</th>
                        <th>Stock</th>
                        <th>Uni</th>
                        {props.esAlmacen || props.esProduccion ? <th>Costo Promd.PEN</th> : <th>Precio PEN</th>}
                        {/* <th>Precio</th> */}
                        <th>Kx</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misMercaderiasOUT.map((mercaOUTLocali) => {
                        //, index
                        const { _id, descripcion, aplicacion, lineaTipo, marca, totalCantidadSaldo, unidad, precioPEN, promedioCostoUnitarioMovil, KARDEXS } =
                          mercaOUTLocali;
                        // const indexItem = index + 1;   , costoUnitarioMovil, precio
                        return (
                          <tr
                            key={_id}
                            style={
                              (totalCantidadSaldo.$numberDecimal ? parseFloat(totalCantidadSaldo.$numberDecimal) : totalCantidadSaldo) === 0
                                ? { color: "red" }
                                : { color: "" }
                            }
                          >
                            <td data-label="Descripción" class="comoCadena">
                              {descripcion}
                            </td>
                            <td data-label="Descripción" class="comoCadena" style={props.verAplicacion ? "" : { display: "none" }}>
                              {aplicacion}
                            </td>
                            <td data-label="Linea/Tipo" class="comoCadena" style={props.verLineaMarca ? "" : { display: "none" }}>
                              {lineaTipo}
                            </td>
                            <td data-label="Marca" class="comoCadena" style={props.verLineaMarca ? "" : { display: "none" }}>
                              {marca}
                            </td>
                            <td data-label="Stock" class="comoNumero">
                              {totalCantidadSaldo.$numberDecimal
                                ? formatear_6Decimales(totalCantidadSaldo.$numberDecimal)
                                : formatear_6Decimales(totalCantidadSaldo)}
                            </td>
                            <td data-label="Uni" class="acciones">
                              {unidad}
                            </td>
                            {props.esAlmacen || props.esProduccion ? (
                              <td data-label="Costo Promd.PEN" style={{ textAlign: "end" }}>
                                {typeof promedioCostoUnitarioMovil !== "undefined" && promedioCostoUnitarioMovil !== null
                                  ? promedioCostoUnitarioMovil.$numberDecimal
                                    ? formatear_6Decimales(promedioCostoUnitarioMovil.$numberDecimal)
                                    : promedioCostoUnitarioMovil
                                  : "_"}
                              </td>
                            ) : (
                              <td data-label="Precio PEN" style={{ textAlign: "end" }}>
                                {typeof precioPEN !== "undefined" && precioPEN !== null
                                  ? precioPEN.$numberDecimal
                                    ? formatear_6Decimales(precioPEN.$numberDecimal)
                                    : precioPEN
                                  : "_"}
                              </td>
                            )}
                            {/* <td data-label="Precio">
                            {typeof precio !== 'undefined' ? (precio.$numberDecimal ? precio.$numberDecimal : precio) : '_'}
                          </td> */}
                            <td data-label="Kx" class="acciones">
                              {KARDEXS.length === 0 ? "No" : "Si"}
                            </td>
                            <td data-label="Acciones" class="acciones">
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.check32}
                                title="Seleccionar mercadería"
                                height={12}
                                width={12}
                                style={{ marginRight: "6px" }}
                                onFocusin$={() => console.log("☪☪☪☪☪☪")}
                                onClick$={() => {
                                  if (mercaOUTLocali.KARDEXS.length === 0) {
                                    alert("No existe kardex para el producto seleccionado.");
                                    return;
                                  }
                                  if (!props.esAlmacen) {
                                    console.log("!props.esAlmacen", props.esAlmacen, precioPEN);
                                    if (typeof precioPEN === "undefined" || precioPEN === null) {
                                      mercaOUTLocali.precioPEN = 0;
                                      console.log("typeof precioPEN !== undefined || precioPEN !== null");
                                    }
                                  }
                                  // if (mercaOUTLocali.KARDEXS.length === 1 && mercaOUTLocali.equivalencias.length === 1) {
                                  //   // ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  //   // ctx_buscar_mercaderia_out.kK = mercaOUTLocali.KARDEXS[0];
                                  //   // ctx_buscar_mercaderia_out.mostrarPanelMercaderiaOUTSeleccionada = true;
                                  //   console.log('la mercade seleccionada OUT DIRECTA = 1K 1EQ ', ctx_buscar_mercaderia_out.mM);
                                  // } && mercaOUTLocali.equivalencias.length > 1
                                  if (mercaOUTLocali.KARDEXS.length === 1) {
                                    ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                    ctx_buscar_mercaderia_out.kK = mercaOUTLocali.KARDEXS[0];
                                    ctx_buscar_mercaderia_out.mostrarPanelMercaderiaOUTSeleccionada = true;
                                    console.log("la mercade seleccionada OUT DIRECTA", ctx_buscar_mercaderia_out.mM);
                                  }
                                  if (mercaOUTLocali.KARDEXS.length > 1) {
                                    ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                    ctx_buscar_mercaderia_out.mostrarPanelKardexsOUT = true;
                                    console.log("la mercade seleccionada OUT -INDIRECTA", ctx_buscar_mercaderia_out.mM);
                                  }
                                }}
                              />
                              {typeof aplicacion !== "undefined" && (
                                <input
                                  // id="in_BuscarDetraccion"
                                  type="image"
                                  src={images.information}
                                  title={aplicacion}
                                  height={12}
                                  width={12}
                                  style={{ marginRight: "6px" }}
                                  // onFocusin$={() => console.log("☪☪☪☪☪☪!!!")}
                                  onClick$={() => {
                                    alert(aplicacion);
                                  }}
                                />
                              )}
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.moneyBag}
                                title="Asignar precio"
                                height={12}
                                width={12}
                                // style={typeof aplicacion !== 'undefined' ? { marginRight: '6px' } : ''}
                                onFocusin$={() => console.log("☪☪☪☪☪☪°°°")}
                                onClick$={() => {
                                  ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  ctx_buscar_mercaderia_out.mostrarPanelAsignarPrecioOUT = true;
                                  console.log("mercaOUTLocali", mercaOUTLocali);
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
  }
);
