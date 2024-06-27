import { $, component$, useContext, useStore } from "@builder.io/qwik";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
import { CTX_NEW_EDIT_GUIA_REMISION } from "./newEditGuiaRemision";
import BuscarPersona from "../miscelanea/persona/buscarPersona";
import { elIdAuxiliar } from "~/functions/comunes";
// import BuscarChofer from '../miscelanea/chofer/buscarChofer';

export default component$((props: { choferSeleccionado: any }) => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const elChofer = useStore({
    idAuxiliar: props.choferSeleccionado.idAuxiliar ? props.choferSeleccionado.idAuxiliar : elIdAuxiliar(),

    activo: typeof props.choferSeleccionado.activo === "undefined" ? true : props.choferSeleccionado.activo,

    codigoTipoDocumentoIdentidad: props.choferSeleccionado.codigoTipoDocumentoIdentidad ? props.choferSeleccionado.codigoTipoDocumentoIdentidad : "1",
    tipoDocumentoIdentidad: props.choferSeleccionado.tipoDocumentoIdentidad ? props.choferSeleccionado.tipoDocumentoIdentidad : "DNI",
    numeroIdentidad: props.choferSeleccionado.numeroIdentidad ? props.choferSeleccionado.numeroIdentidad : "",
    razonSocialNombre: props.choferSeleccionado.razonSocialNombre ? props.choferSeleccionado.razonSocialNombre : "",
    licencia: props.choferSeleccionado.licencia ? props.choferSeleccionado.licencia : "",
    tipo: props.choferSeleccionado.tipo ? props.choferSeleccionado.tipo : "PRINCIPAL",
  });
  //#endregion INICIALIZACION

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
            ctx.mostrarPanelChofer = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: "0.8rem" }}>Registro de chofer</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Activo */}
          <div>
            <div>
              <input
                id="in_activo_CHOFER"
                // style={{ width: '100%' }}
                type="checkbox"
                placeholder="activo"
                checked={elChofer.activo}
                // value="sujetoAPercepcion"
                name="activo"
                onChange$={(e) => {
                  elChofer.activo = (e.target as HTMLInputElement).checked;
                }}
              />
              <label for="in_activo_CHOFER">Activo</label>
            </div>
          </div>
          {/* tipo de documento identidad*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="select_TipoDocumentoLiteral_CHOFER"
                // disabled
                // value={6}
                value={elChofer.tipoDocumentoIdentidad}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  elChofer.codigoTipoDocumentoIdentidad = elOption.id;
                  elChofer.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="1" value="DNI" selected={elChofer.tipoDocumentoIdentidad === "DNI"}>
                  DNI
                </option>
                <option id="4" value="C.EXT" selected={elChofer.tipoDocumentoIdentidad === "C.EXT"}>
                  C.EXT
                </option>
              </select>
              <input
                // id="in_BuscarDetraccion"
                type="image"
                src={images.searchPLUS}
                title="Buscar datos de identidad"
                height={16}
                width={16}
                // style={{ marginLeft: '2px', marginTop: '2px' }}
                style={{ margin: "2px" }}
                onClick$={() => (ctx.mostrarPanelBuscarPersonaChofer = true)}
              />
            </div>
          </div>
          {ctx.mostrarPanelBuscarPersonaChofer && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={true} seleccionar="chofer" contexto="new_edit_guiaRemision" rol="chofer" />
            </div>
          )}
          {/* numero identidad*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_NumeroDocumentoIdentidad_REMITENTE"
                type="number"
                placeholder="Número Identidad Chofer"
                disabled
                style={{ width: "100%" }}
                value={elChofer.numeroIdentidad}
                // onChange$={(e) => (elChofer.numeroIdentidad = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
          {/* Razon Social / Nombre */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input id="input_Nombre_CHOFER" type="text" placeholder="Nombre Chofer" disabled style={{ width: "100%" }} value={elChofer.razonSocialNombre} />
            </div>
          </div>
          {/* Licencia */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input id="input_Licencia_CHOFER" type="text" placeholder="Licencia de Chofer" style={{ width: "100%" }} value={elChofer.licencia} />
            </div>
          </div>
          <br />
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_RegistrarChofer_DOCUMENTO"
          type="button"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          // onClick$={() => registrarChofer()}
        />
      </div>
    </div>
  );
});
