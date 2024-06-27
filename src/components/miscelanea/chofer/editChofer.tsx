import { $, component$, useContext, useStore } from "@builder.io/qwik";
import { images } from "~/assets";
import { elIdAuxiliar } from "~/functions/comunes";
import ImgButton from "~/components/system/imgButton";
// import { CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import { inUpChofer } from "~/apis/chofer.api";
import { parametrosGlobales } from "~/routes/login";
import { CTX_BUSCAR_CHOFER } from "./buscarChofer";

export default component$((props: { choferSeleccionado: any }) => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_BUSCAR_CHOFER);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const elChofer = useStore({
    idChofer: props.choferSeleccionado.idChofer ? props.choferSeleccionado.idChofer : "",
    idPersona: props.choferSeleccionado.idPersona ? props.choferSeleccionado.idPersona : "",
    idAuxiliar: props.choferSeleccionado.idAuxiliar ? props.choferSeleccionado.idAuxiliar : elIdAuxiliar(),

    activo: typeof props.choferSeleccionado.activo === "undefined" ? true : props.choferSeleccionado.activo,

    codigoTipoDocumentoIdentidad: props.choferSeleccionado.codigoTipoDocumentoIdentidad ? props.choferSeleccionado.codigoTipoDocumentoIdentidad : "1",
    tipoDocumentoIdentidad: props.choferSeleccionado.tipoDocumentoIdentidad ? props.choferSeleccionado.tipoDocumentoIdentidad : "DNI",
    numeroIdentidad: props.choferSeleccionado.numeroIdentidad ? props.choferSeleccionado.numeroIdentidad : "",
    razonSocialNombre: props.choferSeleccionado.razonSocialNombre ? props.choferSeleccionado.razonSocialNombre : "",
    licencia: props.choferSeleccionado.licencia ? props.choferSeleccionado.licencia : "",
  });
  //#endregion INICIALIZACION

  //#region UPDATE CHOFER
  const actualizarChofer = $(async () => {
    if (elChofer.licencia.trim() === "") {
      alert("Debe ingresar la licencia");
      document.getElementById("input_Licencia_CHOFER")?.focus();
      return;
    }

    // const chofer =
    await inUpChofer({
      idChofer: elChofer.idChofer,
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idPersona: elChofer.idPersona,
      activo: elChofer.activo,
      licencia: elChofer.licencia.trim(),

      usuario: parametrosGlobales.usuario,
    });

    ctx.actualizo_Chofer = true;
    ctx.mostrarPanelEditChofer = false;
  });
  //#endregion UPDATE CHOFER

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
            ctx.mostrarPanelEditChofer = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          title="Ver el formulario"
          height={18}
          width={18}
          onClick={$(() => {
            console.log("props.choferSeleccionado", props.choferSeleccionado);
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
                disabled
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
              {/* <input
                // id="in_BuscarDetraccion"
                type="image"
                src={images.searchPLUS}
                title="Buscar datos de identidad"
                height={16}
                width={16}
                // style={{ marginLeft: '2px', marginTop: '2px' }}
                style={{ margin: '2px' }}
                onClick$={() => (ctx.mostrarPanelBuscarPersonaChofer = true)}
              /> */}
            </div>
          </div>

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
              <input
                id="input_Licencia_CHOFER"
                type="text"
                placeholder="Licencia de Chofer"
                style={{ width: "100%" }}
                value={elChofer.licencia}
                onChange$={(e) => {
                  elChofer.licencia = (e.target as HTMLInputElement).value;
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    document.getElementById("btn_RegistrarChofer_DOCUMENTO")?.focus();
                  }
                }}
              />
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
          onClick$={() => actualizarChofer()}
        />
      </div>
    </div>
  );
});
