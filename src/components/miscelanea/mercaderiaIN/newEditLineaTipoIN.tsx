import { $, component$, useContext, useStore } from "@builder.io/qwik";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";
import { CTX_NEW_EDIT_MERCADERIA_IN } from "./newEditMercaderiaIN";
import { inUpLineaTipoMercaderia } from "~/apis/lineaTipo.api";
import { parametrosGlobales } from "~/routes/login";

// export default component$((props: { idLineaTipo: string; lineaTipo: string }) => {
export default component$((props: { lineaTipoSelecc: any }) => {
  //#region LINEA TIPO
  const definicion_CTX_LINEA_TIPO = useStore({
    id: props.lineaTipoSelecc.idLineaTipo ? props.lineaTipoSelecc.idLineaTipo : "",
    lineaTipo: props.lineaTipoSelecc.lineaTipo ? props.lineaTipoSelecc.lineaTipo : "",
    contabilizarOperaciones:
      typeof props.lineaTipoSelecc.contabilizarOperaciones !== "undefined"
        ? props.lineaTipoSelecc.contabilizarOperaciones
        : parametrosGlobales.contabilizarOperaciones,
    codigoContableVenta: props.lineaTipoSelecc.codigoContableVenta ? props.lineaTipoSelecc.codigoContableVenta : "",
    descripcionContableVenta: props.lineaTipoSelecc.descripcionContableVenta ? props.lineaTipoSelecc.descripcionContableVenta : "",
    tipoContableVenta: typeof props.lineaTipoSelecc.tipoContableVenta !== "undefined" ? props.lineaTipoSelecc.tipoContableVenta : false,
  });
  //#endregion LINEA TIPO

  //#region CONTEXTOS
  const ctx_new_edit_mercaderia_in = useContext(CTX_NEW_EDIT_MERCADERIA_IN);
  //#endregion CONTEXTOS

  //#region REGISTRAR LNEA TIPO
  const registrarLineaTipo = $(async () => {
    if (definicion_CTX_LINEA_TIPO.lineaTipo === "") {
      alert("Ingresar la linea / tipo");
      document.getElementById("in_loteTipoIN_MICE")?.focus();
      return;
    }

    const lT = await inUpLineaTipoMercaderia({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idLineaTipoMercaderia: definicion_CTX_LINEA_TIPO.id,
      lineaTipoMercaderia: definicion_CTX_LINEA_TIPO.lineaTipo,
    });

    console.log("lT.data", lT.data);

    ctx_new_edit_mercaderia_in.grabo_lineaTipo = true;
    ctx_new_edit_mercaderia_in.mostrarPanelNewEditLineaTipoIN = false;
  });
  //#endregion REGISTRAR LNEA TIPO

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
            ctx_new_edit_mercaderia_in.mostrarPanelNewEditLineaTipoIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de lote / tipo</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        {/* Lote / Tipo */}
        <div class="form-control" style={{ margin: "8px 0" }}>
          <div class="form-control form-agrupado">
            <input
              id="in_loteTipoIN_MICE"
              style={{ width: "100%", background: "#eee" }}
              autoFocus
              type="text"
              placeholder="Lote / Tipo"
              value={definicion_CTX_LINEA_TIPO.lineaTipo}
              onChange$={(e) => {
                definicion_CTX_LINEA_TIPO.lineaTipo = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              onKeyUp$={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("bu_registrar_LineaTipo_MI_P")?.focus();
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
          id="bu_registrar_LineaTipo_MI_P"
          type="submit"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            registrarLineaTipo();
          }}
        />
      </div>
      {/* </Form> */}
    </div>
  );
});
