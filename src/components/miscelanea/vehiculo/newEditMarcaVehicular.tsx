import { $, component$, useContext, useStore } from "@builder.io/qwik";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";
import { CTX_NEW_EDIT_VEHICULO } from "./newEditVehiculo";
import { inUpVehiculoMarca } from "~/apis/vehiculo.api";
import { parametrosGlobales } from "~/routes/login";
import type { IMarcaVehicular } from "~/interfaces/iVehiculo";

export default component$((props: { marcaVehicularSelecci: any }) => {
  //#region DEFINICION MARCA VEHICULAR - NEW  /EDIT
  const marcaVehicular = useStore<IMarcaVehicular>({
    _id: props.marcaVehicularSelecci._id ? props.marcaVehicularSelecci._id : "",
    vehiculoMarca: props.marcaVehicularSelecci.vehiculoMarca ? props.marcaVehicularSelecci.vehiculoMarca : "",
  });
  //#endregion DEFINICION MARCA VEHICULAR - NEW  /EDIT

  //#region CONTEXTOS
  const ctx_new_edit_vehiculo = useContext(CTX_NEW_EDIT_VEHICULO);
  //#endregion CONTEXTOS

  //#region SUBMIT
  const grabarMarcaVehicular = $(async () => {
    if (marcaVehicular.vehiculoMarca === "") {
      alert("Ingrese la marca.");
      document.getElementById("inputRegistrarMarca_MICE")?.focus();
      return;
    }
    let marvaVehi = await inUpVehiculoMarca({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idVehiculoMarca: marcaVehicular._id,
      vehiculoMarca: marcaVehicular.vehiculoMarca,
    });
    console.log("graboooooo marvaVehi", marvaVehi);
    marvaVehi = marvaVehi.data;
    console.log("graboooooo marvaVehi.data", marvaVehi);

    ctx_new_edit_vehiculo.grabo_marca = true;
    ctx_new_edit_vehiculo.mostrarPanelNewEditMarcaVehicular = false;
  });
  //#endregion SUBMIT

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 700px)",
        // width: 'auto',
        padding: "1px",
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
            ctx_new_edit_vehiculo.mostrarPanelNewEditMarcaVehicular = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de marca vehícular</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Marca */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="inputRegistrarMarca_MICE"
                autoFocus
                style={{ width: "100%" }}
                type="text"
                placeholder="Add marca vehícular"
                value={marcaVehicular.vehiculoMarca}
                onChange$={(e) => {
                  marcaVehicular.vehiculoMarca = (e.target as HTMLInputElement).value.toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("buttonGrabarMarcaVehicular") as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
        </div>
        <input
          id="buttonGrabarMarcaVehicular"
          type="button"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            grabarMarcaVehicular();
          }}
          // onClick={(e) => onSubmit(e)}
        />
      </div>
    </div>
  );
});
