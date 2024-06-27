import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from "@builder.io/qwik"; //

import { getIgvVenta } from "~/apis/venta.api";
import { images } from "~/assets";
import NewEditOrdenProduccion from "~/components/ordenProduccion/newEditOrdenProduccion";
import TablaOrdenesProduccion from "~/components/ordenProduccion/tablaOrdenesProduccion";

// import NewEditOrdenServicio from "~/components/ordenServicio/newEditOrdenServicio";
// import TablaOrdenesServicio from "~/components/ordenServicio/tablaOrdenesServicio";
import ElButton from "~/components/system/elButton";
import ElSelect from "~/components/system/elSelect";

import Spinner from "~/components/system/spinner";

import { parametrosGlobales } from "~/routes/login";

export const CTX_INDEX_ORDEN_PRODUCCION = createContextId<any>("__index_orden_produccion");

export default component$(() => {
  //#region CTX_INDEX_ORDEN_PRODUCCION
  const definicion_CTX_INDEX_ORDEN_PRODUCCION = useStore({
    oP: [],
    mostrarPanelNewEditOrdenProduccion: false,
    grabo_OP: false,
    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_ORDEN_PRODUCCION, definicion_CTX_INDEX_ORDEN_PRODUCCION);
  //#endregion CTX_INDEX_ORDEN_PRODUCCION

  //#region INICIALIZACION
  const ini = useSignal(0);
  const buscarOrdenesProduccion = useSignal(0);
  const igv = useSignal(0);

  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: "", periodo: "" });

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    idPeriodo: "",
  });

  //#endregion INICIALIZACION

  //#region ACTUALIZAR TABLA ORDENES DE PRODUCCION
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_ORDEN_PRODUCCION.mostrarPanelNewEditOrdenProduccion);

    if (definicion_CTX_INDEX_ORDEN_PRODUCCION.grabo_OP) {
      buscarOrdenesProduccion.value++;
      definicion_CTX_INDEX_ORDEN_PRODUCCION.grabo_OP = false;
    }
  });
  //#endregion ACTUALIZAR TABLA ORDENES DE PRODUCCION

  return (
    <div class="container">
      {/*  IDENTIFICACION  */}

      <div style={{ background: "#00778F" }}>
        <label style={{ color: "#ccc", fontWeight: "bold", fontSize: "0.8rem", paddingLeft: "2px" }}>
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>
      <h4 style={{ margin: "8px 0 4px 2px" }}>
        <u>Ordenes de Producción</u>
      </h4>

      {/*  BOTONES */}
      <div style={{ marginBottom: "10px", paddingLeft: "3px" }}>
        <ElButton
          // class="btn"
          name="ADD ORDEN DE PRODUCCIÓN"
          // onClick={mostrarPanelOrdenServicio}
          title="Add una orden de producción"
          onClick={$(async () => {
            //validar PERIODO
            if (periodo.idPeriodo === "") {
              alert("Seleccione el periodo.");
              document.getElementById("se_periodo")?.focus();
              ini.value++;
              return;
            }
            //
            let elIgv = await getIgvVenta(parametrosGlobales);
            elIgv = elIgv.data;
            console.log("elIgv", elIgv);
            igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //
            // console.log('igv.value::', igv.value);
            definicion_CTX_INDEX_ORDEN_PRODUCCION.oP = [];
            definicion_CTX_INDEX_ORDEN_PRODUCCION.mostrarPanelNewEditOrdenProduccion = true;
          })}
        />
        <ElSelect
          id={"se_periodo"}
          // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
          estilos={{ width: "168px", marginLeft: "5px" }}
          registros={losPeriodosCargados.value}
          registroID={"_id"}
          registroTEXT={"periodo"}
          seleccione={"-- Seleccione periodo --"}
          onChange={$(() => {
            // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
            const elSelec = document.getElementById("se_periodo") as HTMLSelectElement;
            const elIdx = elSelec.selectedIndex;
            // console.log('?', elIdx, elSelec[elIdx].id);
            periodo.idPeriodo = elSelec[elIdx].id;
            if (periodo.idPeriodo === "") {
              periodo.periodo = "";
            } else {
              periodo.periodo = elSelec.value;
              // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
              parametrosBusqueda.idPeriodo = periodo.idPeriodo;
              // console.log('💨💨💨💨💨💨first', periodo);
              // console.log('💨💨💨💨💨💨first', periodo.idPeriodo);
              buscarOrdenesProduccion.value++;

              definicion_CTX_INDEX_ORDEN_PRODUCCION.mostrarSpinner = true;
            }
          })}
          onKeyPress={$((e: any) => {
            if (e.key === "Enter") {
              (document.getElementById("in_Fecha_MICE") as HTMLSelectElement)?.focus();
            }
          })}
        />
        <input
          type="image"
          title="Buscar ordenes de producción"
          alt="icono buscar"
          height={16}
          width={16}
          style={{ marginLeft: "2px" }}
          src={images.searchPLUS}
          onClick$={() => {
            if (periodo.idPeriodo === "") {
              alert("Seleccione un periodo");
              document.getElementById("se_periodo")?.focus();
              return;
            }
            buscarOrdenesProduccion.value++;
            definicion_CTX_INDEX_ORDEN_PRODUCCION.mostrarSpinner = true;
          }}
        />

        {definicion_CTX_INDEX_ORDEN_PRODUCCION.mostrarPanelNewEditOrdenProduccion && (
          <div class="modal">
            <NewEditOrdenProduccion addPeriodo={periodo} oPSelecci={definicion_CTX_INDEX_ORDEN_PRODUCCION.oP} igv={igv.value} />
          </div>
        )}
      </div>
      {/* TABLA ORDENES DE PRODUCCION */}
      <div style={{ margin: "10px 0" }}>
        {buscarOrdenesProduccion.value > 0 ? (
          <TablaOrdenesProduccion buscarOrdenesProduccion={buscarOrdenesProduccion.value} parametrosBusqueda={parametrosBusqueda} />
        ) : (
          ""
        )}
      </div>
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_ORDEN_PRODUCCION.mostrarSpinner && (
        <div class="modal" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
