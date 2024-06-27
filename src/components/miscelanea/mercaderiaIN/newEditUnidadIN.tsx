import { $, component$, useContext, useStore } from "@builder.io/qwik";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";
import { CTX_NEW_EDIT_MERCADERIA_IN } from "./newEditMercaderiaIN";
import { inUpUnidad } from "~/apis/lineaTipo.api";
import { parametrosGlobales } from "~/routes/login";

export default component$((props: { idLineaTipo: string; idUnidad: string; unidad: string }) => {
  //#region DEFINICON UNIDAD
  const unidad = useStore({
    id: props.idUnidad ? props.idUnidad : "",
    uni: props.unidad ? props.unidad : "",
  });
  //#endregion DEFINICON UNIDAD

  //#region CONTEXTOS
  const ctx_new_edit_mercaderia_in = useContext(CTX_NEW_EDIT_MERCADERIA_IN);
  //#endregion CONTEXTOS

  //#region GRABAR UNIDAD
  const grabarUnidad = $(async () => {
    if (unidad.uni === "") {
      alert("Ingrese la unidad");
      document.getElementById("in_unidadIN_MICE")?.focus();
      return;
    }

    const lt = await inUpUnidad({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idLineaTipoMercaderia: props.idLineaTipo,
      idUnidad: unidad.id,
      unidad: unidad.uni,
    });

    console.log("lt - unidad", lt);
    console.log("lt.data - unidad", lt.data);

    // console.log('graboooooo laLinea', laLinea);
    // laLinea = laLinea.data;
    // console.log('graboooooo laLinea.data', laLinea);

    ctx_new_edit_mercaderia_in.grabo_unidad = true;
    ctx_new_edit_mercaderia_in.laLineaTipo = lt.data;
    ctx_new_edit_mercaderia_in.mostrarPanelNewEditUnidadIN = false;
  });
  //#endregion GRABAR UNIDAD

  return (
    <div
      style={{
        width: "clamp(386px, 86%, 390px)",
        // width: 'auto',
        padding: "2px",
        // background: '#c0c0c0',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: "flex", justifyContent: "end" }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_new_edit_mercaderia_in.mostrarPanelNewEditUnidadIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de unidad</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        {/* Unidad  */}
        <div class="form-control" style={{ margin: "8px 0" }}>
          <div class="form-control form-agrupado">
            <input
              id="in_unidadIN_MICE"
              style={{ width: "100%", background: "#eee" }}
              autoFocus
              type="text"
              placeholder="Unidad"
              value={unidad.uni}
              onChange$={(e) => {
                unidad.uni = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              onKeyUp$={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("buttonGrabar_MI_P")?.focus();
                }
              }}
              onFocusin$={(e) => {
                (e.target as HTMLInputElement).select();
              }}
            />
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)} Sujeto a percepción*/}
        <input
          id="buttonGrabar_MI_P"
          type="submit"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            grabarUnidad();
          }}
        />
      </div>
      {/* </Form> */}
    </div>
  );
});
