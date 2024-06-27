import { $, component$, useContext, useStore } from "@builder.io/qwik";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
import { CTX_BUSCAR_DETRACCION_PORCENTAJE } from "./buscarDetraccionPorcentaje";
import { elIdAuxiliar } from "~/functions/comunes";
import { inUpDetraccion } from "~/apis/grupoEmpresarial.api";
import { parametrosGlobales } from "~/routes/login";

export default component$((props: { detraPorcSelec: any }) => {
  //#region definicion_CTX_DETRACCION_PORCENTAJE
  const definicion_CTX_DETRACCION_PORCENTAJE = useStore({
    _id: props.detraPorcSelec._id ? props.detraPorcSelec._id : "",
    idAuxiliar: props.detraPorcSelec.idAuxiliar ? props.detraPorcSelec.idAuxiliar : elIdAuxiliar(),
    descripcion: props.detraPorcSelec.descripcion ? props.detraPorcSelec.descripcion : "",
    porcentaje: props.detraPorcSelec.porcentaje ? props.detraPorcSelec.porcentaje : "",
  });
  //#endregion definicion_CTX_DETRACCION_PORCENTAJE

  //#region CONTEXTO
  const ctx_buscar_detraccion_porcentaje = useContext(CTX_BUSCAR_DETRACCION_PORCENTAJE);
  //#endregion CONTEXTO

  //#region REGISTRA DETRACCION
  const registrarDetraccion = $(async () => {
    if (definicion_CTX_DETRACCION_PORCENTAJE.descripcion.toString() === "") {
      alert("Ingrese la descripción");
      document.getElementById("in_NE_DetraccionDescripcion")?.focus();
      return;
    }
    if (definicion_CTX_DETRACCION_PORCENTAJE.porcentaje === "") {
      alert("Ingrese el porcentaje de la detracción");
      document.getElementById("in_NE_DetraccionPorcentaje")?.focus();
      return;
    }
    await inUpDetraccion({
      idDetraccion: definicion_CTX_DETRACCION_PORCENTAJE._id,
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idAuxiliar: definicion_CTX_DETRACCION_PORCENTAJE.idAuxiliar,
      descripcion: definicion_CTX_DETRACCION_PORCENTAJE.descripcion.toUpperCase(),
      porcentaje: definicion_CTX_DETRACCION_PORCENTAJE.porcentaje,
      usuario: parametrosGlobales.usuario,
    });

    ctx_buscar_detraccion_porcentaje.grabo_Detraccion = true;
    ctx_buscar_detraccion_porcentaje.mostrarPanelNewEditDetraccionPorcentaje = false;
  });
  //#endregion REGISTRA DETRACCION

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: "clamp(330px, 86%, 380px)",
        // width: 'auto',
        padding: "2px",
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: "flex",
          justifyContent: "end",
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_buscar_detraccion_porcentaje.mostrarPanelNewEditDetraccionPorcentaje = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: "8px" }}>Detracción</h3>
        {/* ----------------------------------------------------- */}
        {/* GENERALES DE LA COMPRA */}
        <div>
          {/* ----------------------------------------------------- */}

          {/* Descripción */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_NE_DetraccionDescripcion"
                style={{ width: "100%" }}
                type="text"
                autoFocus
                placeholder="Add descripción"
                value={definicion_CTX_DETRACCION_PORCENTAJE.descripcion}
                onChange$={(e) => {
                  definicion_CTX_DETRACCION_PORCENTAJE.descripcion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                // onInput$={(e) => {
                //   definicion_CTX_DETRACCION_PORCENTAJE.descripcion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                // }}
                // onKeyDown$={(e: any) => {
                //   if (e.key === 'Enter') {
                //     console.log('Descripcion onKeyDown ENTER');
                //     // (document.getElementById('in_NE_DetraccionDescripcion') as HTMLInputElement)?.focus();
                //     document.getElementById('in_NE_DetraccionPorcentaje')?.focus();
                //     // document.getElementById('btn_grabar_PERSONA')?.focus();
                //   }
                // }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    console.log("Descripcion onKeyPress ENTER");
                    // (document.getElementById('in_NE_DetraccionDescripcion') as HTMLInputElement)?.focus();
                    document.getElementById("in_NE_DetraccionPorcentaje")?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* Porcentaje */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_NE_DetraccionPorcentaje"
                style={{ width: "100%" }}
                type="number"
                placeholder="Add porcentaje"
                value={
                  definicion_CTX_DETRACCION_PORCENTAJE.porcentaje.$numberDecimal
                    ? definicion_CTX_DETRACCION_PORCENTAJE.porcentaje.$numberDecimal
                    : definicion_CTX_DETRACCION_PORCENTAJE.porcentaje
                }
                onChange$={(e) => {
                  console.log("Porcentaje onChange", e);

                  definicion_CTX_DETRACCION_PORCENTAJE.porcentaje = parseInt((e.target as HTMLInputElement).value.trim());
                }}
                onKeyPress$={(e) => {
                  console.log("Porcentaje onKeyPress", e);

                  if (e.key === "Enter") {
                    (document.getElementById("bu_NE_RegistrarDetraccion") as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          <br />
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="bu_NE_RegistrarDetraccion"
          type="button"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          onClick$={() => registrarDetraccion()}
          // onClick$={() => {
          //   ctx_buscar_detraccion_porcentaje.mostrarPanelNewEditDetraccionPorcentaje = false;
          // }}
        />
      </div>
    </div>
  );
});
