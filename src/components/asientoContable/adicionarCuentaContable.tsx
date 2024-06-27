import { component$, useSignal } from "@builder.io/qwik";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";

export default component$(() => {
  //#region INICIALIZACION
  const elemento = useSignal("");
  //#endregion INICIALIZACION

  return (
    <div
      style={{
        width: "clamp(386px, 86%, 600px)",
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
          //   onClick={$(() => {
          //     ctx.mostrarPanelAdjuntarDocumento = false;
          //   })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: "0.8rem" }}>Registro de documento</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TCP */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <select
              id="se_ElementoContable"
              style={{ width: "70%" }}
              onChange$={() => {
                // elemento.value = (e.target as HTMLSelectElement).value;
                const elSelec = document.getElementById("se_ElementoContable") as HTMLSelectElement;
                // const elIdx = elSelec.selectedIndex;

                elemento.value = elSelec.value;
                // console.log('elemento.value ', elemento.value);
                // if (definicion_CTX_COMPRA.codigoTCP === '') {
                //   definicion_CTX_COMPRA.descripcionTCP = '';
                // } else {
                //   definicion_CTX_COMPRA.descripcionTCP = elSelec.value;
                // }
              }}
            >
              <option value="0">--Seleccione un elemento--</option>
              <option value="1">1 - ACTIVO DISPONIBLE Y EXIGIBLE</option>
              <option value="2">2 - ACTIVO REALIZABLE</option>
              <option value="3">3 - ACTIVO INMOVILIZADO</option>
              <option value="4">4 - PASIVO</option>
              <option value="5">5 - PATRIMONIO NETO</option>
              <option value="6">6 - GASTOS POR NATURALEZA</option>
              <option value="7">7 - INGRESOS</option>
              <option value="8">8 - SALDOS INTERMEDIARIOS DE GESTIÓN Y DETERMINACIÓN DE LOS RESULTADOS DEL EJERCICIO</option>
              <option value="9">9 - CONTABILIDAD ANALÍTICA DE EXPLOTACIÓN</option>
            </select>
            <button
              style={{ width: "30%" }}
              onClick$={() => {
                if (elemento.value === "0" || elemento.value === "") {
                  alert("Debe seleccionar un elemento");
                  document.getElementById("se_ElementoContable")?.focus();
                  return;
                }
              }}
            >
              ADICIONAR CTA
            </button>
          </div>
        </div>

        {/* Número */}
        {/* <div class="form-control">
            <label>Número</label>
            <div class="form-control form-agrupado">
              <input
                id="in_Numero_DOCUMENTO"
                style={{ width: '100%' }}
                type="number"
                placeholder="Add número"
                value={documentoIN.numero}
                onChange$={(e) => {
                  documentoIN.numero = parseFloat((e.target as HTMLInputElement).value.trim());
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('bu_RegistrarDocumentoIN_DOCUMENTO') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div> */}
      </div>
    </div>
  );
});
