import { $, component$, createContextId, useContext, useContextProvider, useStore } from "@builder.io/qwik";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
import { CTX_NEW_EDIT_ORDEN_PRODUCCION, CTX_O_P } from "./newEditOrdenProduccion";
import { elIdAuxiliar } from "~/functions/comunes";
// import styleFormulario from "../../routes/login/login.css?inline";
import BuscarManufacturaStandarizada from "./buscarManufacturaStandarizada";
// import styleFormulario from "../../css/formulario.css?inline";

export const CTX_ADD_MANUFACTURA = createContextId<any>("__add_manufactura");

export default component$((props: { manuSeleccio: any }) => {
  // useStyles$(styleFormulario);

  //#region definicion_CTX_ADD_MANUFACTURA
  const definicion_CTX_ADD_MANUFACTURA = useStore({
    cantidad: props.manuSeleccio.cantidad ? props.manuSeleccio.cantidad : 1,
    unidad: props.manuSeleccio.unidad ? props.manuSeleccio.unidad : "NIU",
    descripcion: props.manuSeleccio.descripcion ? props.manuSeleccio.descripcion : "",
    costoUnitarioPEN: props.manuSeleccio.costoUnitarioPEN ? props.manuSeleccio.costoUnitarioPEN : 0,
    costoTotalPEN: props.manuSeleccio.costoTotalPEN ? props.manuSeleccio.costoTotalPEN : 0,
  });
  useContextProvider(CTX_ADD_MANUFACTURA, definicion_CTX_ADD_MANUFACTURA);
  //#endregion definicion_CTX_ADD_MANUFACTURA

  //#region CONTEXTO
  const ctx_new_edit_orden_produccion = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
  const documento = useContext(CTX_O_P).manufacturas;
  //#endregion CONTEXTO

  //#region REGISTRAR MANUFACTURA
  const registrarManufactura = $(() => {
    if (definicion_CTX_ADD_MANUFACTURA.descripcion.trim() === "") {
      alert("Ingrese la descripción de la manufactura.");
      document.getElementById("in_descripcion_ADD_MANUFACTURA")?.focus();
      return;
    }

    documento.push({
      idAuxiliar: parseInt(elIdAuxiliar()),

      descripcion: definicion_CTX_ADD_MANUFACTURA.descripcion,
      // descripcionEquivalencia:definicion_CTX_ADD_MANUFACTURA.descripcion,

      cantidad: definicion_CTX_ADD_MANUFACTURA.cantidad,
      // cantidad: definicion_CTX_ADD_MANUFACTURA.cantidad,

      unidad: "NIU",
      costoUnitarioPEN: definicion_CTX_ADD_MANUFACTURA.costoUnitarioPEN,
      costoTotalPEN: definicion_CTX_ADD_MANUFACTURA.costoTotalPEN,
    });

    ctx_new_edit_orden_produccion.mostrarPanelAddManufactura = false;
  });
  //#endregion REGISTRAR MANUFACTURA

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
            ctx_new_edit_orden_produccion.mostrarPanelAddManufactura = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de la manufactura</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* cantidad */}
          <div class="linea-formulario">
            <label>Cantidad</label>
            <div>
              <input
                id="in_cantidad_ADD_MANUFACTURA"
                // style={{ width: "245px" }}
                style={{ width: "clamp(200px, 245px, 245px)" }}
                // style={{ width: "clamp(200px, 86%, 246px)" }}
                type="number"
                // disabled
                placeholder="Cantidad"
                value={definicion_CTX_ADD_MANUFACTURA.cantidad}
                onChange$={(e) => {
                  definicion_CTX_ADD_MANUFACTURA.cantidad = (e.target as HTMLInputElement).value;
                  definicion_CTX_ADD_MANUFACTURA.costoTotalPEN = definicion_CTX_ADD_MANUFACTURA.cantidad * definicion_CTX_ADD_MANUFACTURA.costoUnitarioPEN;
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("in_descripcion_ADD_MANUFACTURA") as HTMLInputElement)?.focus();
                  }
                }}
              />
              <label style={{ marginLeft: "4px" }}>{definicion_CTX_ADD_MANUFACTURA.unidad}</label>
            </div>
          </div>
          {/* Descripcion */}
          <div class="linea-formulario">
            <label>Descripción</label>
            <div>
              <input
                id="in_descripcion_ADD_MANUFACTURA"
                style={{ width: "clamp(200px, 245px, 245px)" }}
                type="text"
                placeholder="Add descripción"
                value={definicion_CTX_ADD_MANUFACTURA.descripcion}
                onInput$={(e) => {
                  definicion_CTX_ADD_MANUFACTURA.descripcion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("in_costoUnitario_ADD_MANUFACTURA") as HTMLInputElement)?.focus();
                  }
                }}
              />
              <input
                type="image"
                src={images.searchPLUS}
                title="Buscar manufactura standarizada"
                alt="icono buscar"
                height={16}
                width={16}
                style={{ margin: "0 4px" }}
                onClick$={() => {
                  ctx_new_edit_orden_produccion.mostrarPanelBuscarManufacturaStandarizada = true;
                  // localizarMercaderiasIN();
                }}
              />
            </div>
          </div>
          {ctx_new_edit_orden_produccion.mostrarPanelBuscarManufacturaStandarizada && (
            <div class="modal">
              <BuscarManufacturaStandarizada />
            </div>
          )}
          {/* Costo Unitario */}
          <div class="linea-formulario">
            <label>Costo Unitario PEN</label>
            <input
              id="in_costoUnitario_ADD_MANUFACTURA"
              style={{ width: "clamp(200px, 86%, 270px)" }}
              type="number"
              placeholder="Add costo unitario (PEN)"
              value={definicion_CTX_ADD_MANUFACTURA.costoUnitarioPEN}
              onChange$={(e) => {
                definicion_CTX_ADD_MANUFACTURA.costoUnitarioPEN = parseFloat((e.target as HTMLInputElement).value.trim());

                definicion_CTX_ADD_MANUFACTURA.costoTotalPEN = definicion_CTX_ADD_MANUFACTURA.cantidad * definicion_CTX_ADD_MANUFACTURA.costoUnitarioPEN;
              }}
              onKeyPress$={(e) => {
                if (e.key === "Enter") {
                  (document.getElementById("in_costoTotal_ADD_MANUFACTURA") as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
          {/* Costo Total */}
          <div class="linea-formulario">
            <label>Costo Total PEN</label>
            <input
              id="in_costoTotal_ADD_MANUFACTURA"
              style={{ width: "clamp(200px, 86%, 270px)" }}
              type="number"
              placeholder="Add costo total (PEN)"
              value={definicion_CTX_ADD_MANUFACTURA.costoTotalPEN}
              onChange$={(e) => {
                definicion_CTX_ADD_MANUFACTURA.costoTotalPEN = parseFloat((e.target as HTMLInputElement).value.trim());

                if (definicion_CTX_ADD_MANUFACTURA.cantidad !== 0) {
                  definicion_CTX_ADD_MANUFACTURA.costoUnitarioPEN = definicion_CTX_ADD_MANUFACTURA.costoTotalPEN / definicion_CTX_ADD_MANUFACTURA.cantidad;
                }
              }}
              onKeyPress$={(e) => {
                if (e.key === "Enter") {
                  (document.getElementById("btn_registrar_ADD_MANUFACTURA") as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
          <br />
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_registrar_ADD_MANUFACTURA"
          type="button"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          onClick$={() => registrarManufactura()}
        />
      </div>
    </div>
  );
});
