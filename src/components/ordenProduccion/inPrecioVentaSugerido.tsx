import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";
// import styleFormulario from "../../routes/login/login.css?inline";
// import styleFormulario from "../../css/formulario.css?inline";
import { CTX_NEW_EDIT_ORDEN_PRODUCCION, CTX_O_P } from "./newEditOrdenProduccion";

export default component$((props: { costoUni: any }) => {
  // useStyles$(styleFormulario);

  //#region CONTEXTOS
  const ctx = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
  const documento = useContext(CTX_O_P);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const precioVenta = useSignal(0);
  //#endregion INICIALIZACION

  return (
    <div
      style={{
        width: "clamp(386px, 86%, 400px)",
        // width: 'auto',
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
            ctx.mostrarPanelInPrecioVentaSugeridoSinIGV = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* Precio Venta Sugerido sin IGV */}
        <div class="linea-formulario">
          <label>Precio Venta SUGERIDO sin IGV </label>
          <div>
            <input
              id="in_PrecioVenta_SUGERIDOsinIGV_OP"
              //   style={{ width: "100%" }}
              type="number"
              placeholder="Precio Venta Sugerido sin IGV"
              value={precioVenta.value}
              onChange$={(e) => {
                precioVenta.value = parseFloat((e.target as HTMLInputElement).value.trim());
              }}
              onKeyPress$={(e) => {
                if (e.key === "Enter") {
                  (document.getElementById("bu_RegistrarPrecioVentaSugeridoSinIGV") as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="bu_RegistrarPrecioVentaSugeridoSinIGV"
          type="button"
          value="Registrar"
          class="btn-centro"
          onClick$={() => {
            if (precioVenta.value < props.costoUni) {
              alert("El precio de venta sugerido sin IGV no puede ser menor al costo unitario de producción.");
              document.getElementById("in_PrecioVenta_SUGERIDOsinIGV_OP")?.focus;
              return;
            }
            documento.porcentajeUtilidad = (100 * (precioVenta.value - props.costoUni)) / precioVenta.value;

            ctx.mostrarPanelInPrecioVentaSugeridoSinIGV = false;
          }}
        />
      </div>
    </div>
  );
});
