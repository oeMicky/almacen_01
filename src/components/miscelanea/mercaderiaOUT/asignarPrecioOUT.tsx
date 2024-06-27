import { $, component$, useContext, useSignal } from "@builder.io/qwik";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";
import { CTX_BUSCAR_MERCADERIA_OUT } from "./buscarMercaderiaOUT";
import { parametrosGlobales } from "~/routes/login";
import { grabarPrecio } from "~/apis/mercaderia.api";

export default component$((props: { mercaOUTSelecci: any }) => {
  //#region CONTEXTOS
  const ctx_buscar_mercaderia_out = useContext(CTX_BUSCAR_MERCADERIA_OUT);
  //#endregion CONTEXTOS

  const precio = useSignal<any>(props.mercaOUTSelecci.precioPEN ? props.mercaOUTSelecci.precioPEN.$numberDecimal : 0);

  //#region ON SUBMIT
  const grabarPrecio_MICE = $(async () => {
    if ((document.getElementById("inputPrecio_MICE") as HTMLInputElement)?.value.trim() === "") {
      alert("Ingrese el precio.");
      document.getElementById("inputPrecio_MICE")?.focus();
      return;
    }
    console.log("on......Submit");
    const enviarDatos = await grabarPrecio({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idMercaderia: props.mercaOUTSelecci._id,
      usuario: parametrosGlobales.usuario,

      precioPEN: precio.value,
      //   precio: parseFloat((document.getElementById('inputPrecio_MICE') as HTMLInputElement)?.value.trim()),
      //document.getElementById('inputPrecio')?.value,
    });
    console.log("enviarDatos:", enviarDatos);
    ctx_buscar_mercaderia_out.grabo_PrecioOUT = true;
    ctx_buscar_mercaderia_out.mostrarPanelAsignarPrecioOUT = false;
  });
  //#endregion ON SUBMIT

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 500px)",
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
            ctx_buscar_mercaderia_out.mostrarPanelAsignarPrecioOUT = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log("props.mercaOUTSelecci", props.mercaOUTSelecci);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* DATOS */}
        <div style={{ fontSize: "small", fontWeight: "lighter" }}>
          {/* Descripcion */}
          <div class="form-control">
            <strong>
              Descripción: <i>{props.mercaOUTSelecci.descripcion}</i>
            </strong>
          </div>
          {/* Linea / Tipo */}
          <div class="form-control">
            <strong>
              Linea/Tipo: <i>{props.mercaOUTSelecci.lineaTipo}</i>
            </strong>
          </div>
          {/* Unidad */}
          <div class="form-control">
            <strong>
              Unidad: <i>{props.mercaOUTSelecci.unidad}</i>
            </strong>
          </div>
          {/* Costo */}
          {/* <div class="form-control">
            <label>Costo</label>
            <div class="form-control form-agrupado">
              <input
                id="inputCosto_MICE"
                style={{ width: '100%', textAlign: 'right' }}
                type="number"
                disabled
                placeholder="Costo"
                value={props.mercaOUTSelecci.promedioCostoUnitarioMovil.$numberDecimal}
              />
            </div>
          </div> */}
          {/* Utilidad */}
          {/* <div class="form-control">
            <label>Utilidad</label>
            <div class="form-control form-agrupado">
              <input
                id="inputUtilidad_MICE"
                style={{ width: '100%', textAlign: 'right' }}
                type="number"
                disabled
                placeholder="Utilidad"
                value={precio.value - props.mercaOUTSelecci.promedioCostoUnitarioMovil.$numberDecimal}
              />
            </div>
          </div> */}
          {/* Precio */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="inputPrecio_MICE"
                autoFocus
                style={{ width: "100%", textAlign: "end", marginRight: "2px" }}
                type="number"
                placeholder="Adicionar Precio"
                value={precio.value}
                onChange$={(e) => {
                  precio.value = (e.target as HTMLInputElement).value;
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("buttonGrabarPrecio_MICE") as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
        </div>
        {/* GRABAR */}
        <input
          id="buttonGrabarPrecio_MICE"
          type="button"
          value="Grabar "
          class="btn-centro"
          onClick$={() => {
            grabarPrecio_MICE();
          }}
        />
      </div>
    </div>
  );
});
