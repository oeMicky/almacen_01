import { $, component$, useContext } from "@builder.io/qwik";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
import { CTX_NEW_EDIT_ORDEN_PRODUCCION } from "./newEditOrdenProduccion";
// import { CTX_NEW_EDIT_ORDEN_SERVICIO } from './newEditOrdenServicio';

export default component$((props: { borrarManufactura: any }) => {
  //#region CONTEXTO
  const ctx_new_edit_orden_produccion = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
  //#endregion CONTEXTO

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 420px)",
        //  width: 'auto',
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
            ctx_new_edit_orden_produccion.mostrarPanelBorrarManufacturaOP = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: "10px" }}>
          ¿Desea eliminar la manufactura?
          <div>
            {/* <label>{cerosALaIzquierda(props.borrarItemMerca.item, 3)}</label>
            <br /> */}
            <label>{props.borrarManufactura.codigo}</label>
            <br />
            <label>{props.borrarManufactura.descripcion}</label>
            <br />
          </div>
          <br />
          <div style={{ display: "flex", marginTop: "4px", justifyContent: "space-around", alignItems: "center" }}>
            <button
              style={{ width: "60px" }}
              onClick$={() => {
                ctx_new_edit_orden_produccion.borrar_idAuxiliarManufactura = props.borrarManufactura.idAuxiliar;
                ctx_new_edit_orden_produccion.borrar_idManufacturaOP = props.borrarManufactura._id;
                ctx_new_edit_orden_produccion.mostrarPanelBorrarManufacturaOP = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: "60px" }}
              onClick$={() => {
                ctx_new_edit_orden_produccion.mostrarPanelBorrarManufacturaOP = false;
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
