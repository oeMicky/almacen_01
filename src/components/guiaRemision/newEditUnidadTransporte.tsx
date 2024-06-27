import { $, component$, useContext } from "@builder.io/qwik";
import { CTX_NEW_EDIT_GUIA_REMISION } from "./newEditGuiaRemision";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";

export default component$((props: { unidadSeleccionda: any }) => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
  //#endregion CONTEXTOS

  return (
    <div
      style={{
        width: "clamp(386px, 86%, 600px)",
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
            ctx.mostrarPanelUnidadTransporte = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: "0.8rem" }}>Registro de unidad de transporte</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* placa */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_Placa_UNIDAD_TRANSPORTE"
                type="text"
                placeholder="Placa"
                style={{ width: "100%" }}
                value={props.unidadSeleccionda.placa}
                onChange$={(e) => (props.unidadSeleccionda.placa = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
          {/* marca */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_Marca_UNIDAD_TRANSPORTE"
                type="text"
                placeholder="Marca"
                disabled
                style={{ width: "100%" }}
                value={props.unidadSeleccionda.marca}
                onChange$={(e) => (props.unidadSeleccionda.marca = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
          {/* Tarj circulacion / Certig¿ficicado Habilitación */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_Tarjeta_UNIDAD_TRANSPORTE"
                type="text"
                placeholder="Tarj circulación / Certificicado habilitación"
                disabled
                style={{ width: "100%" }}
                value={props.unidadSeleccionda.tarjetaCirculación}
              />
            </div>
          </div>
          {/* Tipo */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input id="input_Tipo_UNIDAD_TRANSPORTE" type="text" placeholder="Tipo" disabled style={{ width: "100%" }} value={props.unidadSeleccionda.tipo} />
            </div>
          </div>
          <br />
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="bu_RegistrarDocumentoIN_DOCUMENTO"
          type="button"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          // onClick$={() => registrarUnidadTransporte()}
        />
      </div>
    </div>
  );
});
