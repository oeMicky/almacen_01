import { $, component$, useContext, useSignal, useStore } from "@builder.io/qwik";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";
import TablaUnidadesSUNAT from "./tablaUnidadesSUNAT";
import { CTX_NEW_EDIT_MERCADERIA_IN } from "./newEditMercaderiaIN";

export default component$((props: { idLineaTipo: string; lineaTipo: string }) => {
  //#region CONTEXTO
  const ctx_new_edit_mercaderia_in = useContext(CTX_NEW_EDIT_MERCADERIA_IN);
  //#endregion CONTEXTO

  //#region INICIALIZAR
  //   const cadenaABuscar = useSignal('');
  const buscarUnidadesSUNAT = useSignal(0);
  const parametrosBusqueda = useStore({
    cadenaABuscar: "", // 'acce 5', //cadena.value,
  });
  //#endregion INICIALIZAR

  //#region BUSCAR
  const localizarUnidadSUNAT = $(() => {
    if (parametrosBusqueda.cadenaABuscar.trim() === "") {
      alert("Debe ingresar la descripción de la unidad de medida a buscar");
      document.getElementById("in_codigoDescripcion_BUSCAR_UNIDAD_SUNAT")?.focus();
      return;
    }
    console.log("buscarndo");
    buscarUnidadesSUNAT.value++;
  });
  //#endregion BUSCAR

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 420px)",
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
            ctx_new_edit_mercaderia_in.mostrarPanelBuscarUnidadSUNAT = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: "10px", fontSize: "0.9rem" }}>Buscar unidad SUNAT - {props.lineaTipo}</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: "10px" }}>
          {/* Buscar por */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_codigoDescripcion_BUSCAR_UNIDAD_SUNAT"
                style={{ width: "100%", marginRight: "4px" }}
                type="text"
                placeholder="Ingrese la unidad de medida a buscar"
                value={parametrosBusqueda.cadenaABuscar}
                // onChange$={(e) => {
                //   cadenaABuscar.value = (e.target as HTMLInputElement).value;
                // }}
                onInput$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  console.log("onKeyPress", parametrosBusqueda.cadenaABuscar);
                  if (e.key === "Enter") {
                    console.log("onKeyPress - ENTER");
                    localizarUnidadSUNAT();
                  }
                }}
              />
              <input
                type="image"
                title="Buscar datos de unidad de medida"
                alt="icono buscar"
                height={16}
                width={16}
                style={{ marginRight: "2px" }}
                src={images.searchPLUS}
                onClick$={() => {
                  localizarUnidadSUNAT();
                }}
              />
            </div>
          </div>
        </div>
        {/*  tabla LOCALIZADOS UNIDAD SUNAT */}
        <div class="form-control">
          {buscarUnidadesSUNAT.value > 0 ? (
            <TablaUnidadesSUNAT
              idLineaTipo={props.idLineaTipo}
              lineaTipo={props.lineaTipo}
              buscarUnidadesSUNAT={buscarUnidadesSUNAT.value}
              cadenaABuscar={parametrosBusqueda}
              //   contexto={props.contexto}
              //   esAlmacen={props.esAlmacen}
            />
          ) : (
            ""
          )}
          {/* {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelMercaderiaINSeleccionada && (
            <div class="modal">
              <MercaderiaINSeleccionada
                mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM}
                elKardex={definicion_CTX_BUSCAR_MERCADERIA_IN.kK}
                esAlmacen={true}
                contexto={'buscar_mercaderia_in'}
                contextoParaDocumento={props.contexto}
                igv={props.igv}
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
});
