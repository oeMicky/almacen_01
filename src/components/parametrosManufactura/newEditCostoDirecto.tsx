import { component$, useContext, useStore, $ } from "@builder.io/qwik";
import { inUpCostoDirecto } from "~/apis/parametrosManufactura.api";
// import { loadTiposComprobantePago } from "~/apis/sunat.api";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";
// import  { IDocumento } from "~/interfaces/iDocumento";
import type { ICostoDirecto } from "~/interfaces/iParametrosManufactura";
import { CTX_INDEX_PARAMETROS_MANUFACTURA } from "~/routes/(ordenesProduccion)/parametrosManufactura";
import { parametrosGlobales } from "~/routes/login";

export default component$((props: { cosDirecSelecci: any; idParametrosManufactura: string }) => {
  //#region definicion_CTX_COSTO_DIRECTO
  const definicion_CTX_COSTO_DIRECTO = useStore<ICostoDirecto>({
    _id: props.cosDirecSelecci._id ? props.cosDirecSelecci._id : "",
    costoDirecto: props.cosDirecSelecci.costoDirecto ? props.cosDirecSelecci.costoDirecto : "",
    costoPEN: props.cosDirecSelecci.costoPEN
      ? props.cosDirecSelecci.costoPEN.$numberDecimal
        ? props.cosDirecSelecci.costoPEN.$numberDecimal
        : props.cosDirecSelecci.costoPEN
      : 0,
  });
  //#endregion definicion_CTX_COSTO_DIRECTO

  //#region CONTEXTOS
  const ctx = useContext(CTX_INDEX_PARAMETROS_MANUFACTURA);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  // const ini = useSignal(0);
  // const LosTCPcargados = useSignal([]);
  //#endregion INICIALIZACION

  //#region REGISTRAR COSTO DIRECTO
  const registrarCostoDirecto = $(async () => {
    if (definicion_CTX_COSTO_DIRECTO.costoDirecto.trim() === "") {
      alert("Ingrese el costo directo.");
      document.getElementById("in_CostoDirecto_COSTO_DIRECTO")?.focus();
      return;
    }
    if (definicion_CTX_COSTO_DIRECTO.costoPEN.toString() === "") {
      alert("Ingrese el costo.");
      document.getElementById("in_Costo_COSTO_DIRECTO")?.focus();
      return;
    }
    const cost = await inUpCostoDirecto({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idParametrosManufactura: props.idParametrosManufactura,
      idCostoDirecto: definicion_CTX_COSTO_DIRECTO._id,
      costoDirecto: definicion_CTX_COSTO_DIRECTO.costoDirecto,
      costoPEN: definicion_CTX_COSTO_DIRECTO.costoPEN,

      usuario: parametrosGlobales.usuario,
    });

    console.log("cost", cost);

    ctx.grabo_CostoDirecto = true;
    ctx.mostrarPanelNewEditCostoDirecto = false;
  });
  //#endregion REGISTRAR COSTO DIRECTO

  return (
    <div
      style={{
        width: "clamp(386px, 86%, 500px)",
        // width: 'auto',
        padding: "2px",
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: "flex", justifyContent: "end" }}>
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log("cosDirecSelecci", props.cosDirecSelecci);
            console.log("idParametrosManufactura", props.idParametrosManufactura);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelNewEditCostoDirecto = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: "0.8rem" }}>Registro de costo directo</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Costo directo */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_CostoDirecto_COSTO_DIRECTO"
                style={{ width: "100%" }}
                type="text"
                placeholder="Add costo directo"
                value={definicion_CTX_COSTO_DIRECTO.costoDirecto}
                onChange$={(e) => {
                  definicion_CTX_COSTO_DIRECTO.costoDirecto = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("in_Costo_COSTO_DIRECTO") as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* costo */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_Costo_COSTO_DIRECTO"
                style={{ width: "100%" }}
                type="number"
                autoFocus
                placeholder="Add costo"
                value={definicion_CTX_COSTO_DIRECTO.costoPEN}
                onChange$={(e) => {
                  definicion_CTX_COSTO_DIRECTO.costoPEN = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("btn_RegistrarCostoDirecto_COSTO_DIRECTO") as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input id="btn_RegistrarCostoDirecto_COSTO_DIRECTO" type="button" value={"Registrar"} class="btn-centro" onClick$={() => registrarCostoDirecto()} />
      </div>
    </div>
  );
});
