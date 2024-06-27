import { $, component$, useContext } from "@builder.io/qwik";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
import { CTX_NEW_EDIT_COMPRA } from "./newEditCompra";

export default component$(() => {
  //#region CONTEXTO
  const ctx_new_edit_compra = useContext(CTX_NEW_EDIT_COMPRA);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 600px)",
        // width: 'auto',
        border: "1px solid red",
        padding: "2px",
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
            ctx_new_edit_compra.mostrarPanelErrorDiferenciaPartidaDoble = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: "10px" }}>
          Existe diferencia entre el monto total y la partida doble. ¿Desea continuar con el registro de la compra?
          <div style={{ display: "flex", marginTop: "10px", justifyContent: "space-around", alignItems: "center" }}>
            <button
              style={{ width: "60px" }}
              onClick$={() => {
                ctx_new_edit_compra.continuarConRegistroCompra = true;
                ctx_new_edit_compra.mostrarPanelErrorDiferenciaPartidaDoble = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: "60px" }}
              onClick$={() => {
                ctx_new_edit_compra.mostrarPanelErrorDiferenciaPartidaDoble = false;
              }}
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
