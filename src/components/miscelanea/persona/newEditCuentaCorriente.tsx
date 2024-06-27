import { $, component$, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";
import { CTX_EDIT_PERSONA, CTX_PERSONA } from "./editarPersona";
import { cargarEntidadesFinancieras } from "~/apis/entidadFinanciera.api";
import { elIdAuxiliar } from "~/functions/comunes";

export default component$((props: { cuentaCorriSelec: any }) => {
  //#region CONTEXTO
  const ctx_editar_persona = useContext(CTX_EDIT_PERSONA);
  const ctx_persona = useContext(CTX_PERSONA);
  //#endregion CONTEXTO

  //#region INICIALIZAR
  const ini = useSignal(0);
  const lasEntidadesFinancieras = useSignal([]);

  useTask$(async ({ track }) => {
    track(() => ini.value);
    const enti = await cargarEntidadesFinancieras();

    lasEntidadesFinancieras.value = enti.data;

    console.log("lasEntidadesFinancieras.value :::: ", lasEntidadesFinancieras.value);
  });
  //#endregion INICIALIZAR

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 500px)",
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
            ctx_editar_persona.mostrarPanelNewEditCuentaCorriente = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Cuenta corriente</h3>
      {/* FORMULARIO */}
      {/* <Form
        action={accionGrabar}
        onSubmit$={() => {
          accionGrabar;
        }}
      > */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Banco */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              {/* {lasEntidadesFinancieras.value.map((enti: any) => {
                return console.log('enti', enti);
                // return <option value={enti.entidadFinanciera}>{enti.entidadFinanciera}</option>;
              })} */}
              <select
                id="se_banco_CUENTACORRIENTE"
                style={{ width: "100%" }}
                onChange$={(e) => {
                  console.log("🥓🥓🥓(e.target as HTMLSelectElement).value", (e.target as HTMLSelectElement).value);
                  props.cuentaCorriSelec.banco = (e.target as HTMLSelectElement).value;
                  // persona.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                  // document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                  // console.log(
                  //   'soloPersonaNatural, cTDI, tDI',
                  //   props.soloPersonaNatural,
                  //   persona.codigoTipoDocumentoIdentidad,
                  //   persona.tipoDocumentoIdentidad
                  // );
                }}
              >
                <option value="">-- Seleccione un entidad financiera --</option>
                {lasEntidadesFinancieras.value.map((enti: any) => {
                  // const indexItemVenta = index + 1;
                  return (
                    <option value={enti.entidadFinanciera} selected={props.cuentaCorriSelec.banco === enti.entidadFinanciera}>
                      {enti.entidadFinanciera}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {/* Moneda */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="se_moneda_CUENTACORRIENTE"
                style={{ width: "100%" }}
                onChange$={(e) => {
                  console.log("🥓🥓🥓(e.target as HTMLSelectElement).value", (e.target as HTMLSelectElement).value);
                  props.cuentaCorriSelec.moneda = (e.target as HTMLSelectElement).value;
                  // persona.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                  // document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                  // console.log(
                  //   'soloPersonaNatural, cTDI, tDI',
                  //   props.soloPersonaNatural,
                  //   persona.codigoTipoDocumentoIdentidad,
                  //   persona.tipoDocumentoIdentidad
                  // );
                }}
              >
                <option value={"PEN"} selected={props.cuentaCorriSelec.moneda === "PEN"}>
                  PEN
                </option>
                <option value={"USD"} selected={props.cuentaCorriSelec.moneda === "USD"}>
                  USD
                </option>
              </select>
            </div>
          </div>
          {/* //Cuenta Corriente */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_CuentaCorriente_CC"
                style={{ width: "100%" }}
                type="number"
                placeholder="Cuenta corriente"
                value={props.cuentaCorriSelec.cuentaCorriente}
                onChange$={(e) => {
                  props.cuentaCorriSelec.cuentaCorriente = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                // onKeyPress$={(e) => {
                //   if (e.key === 'Enter') {
                //     document.getElementById('in_apellidoPaterno_PERSONA')?.focus();
                //   }
                //   if (e.key === 'Escape') {
                //     document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                //   }
                // }}
                // onFocusin$={(e) => {
                //   // alert(`INGRESO... ${e}`);
                //   console.log('INGRESO-', e);
                //   buscarPersonaEnAPIExterna();
                // }}
              />
            </div>
          </div>
          {/* //Cuenta Corriente Interbancario*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_CuentaCorrienteInterbancario_CC"
                style={{ width: "100%" }}
                type="number"
                placeholder="CCI"
                value={props.cuentaCorriSelec.cci}
                onChange$={(e) => {
                  props.cuentaCorriSelec.cci = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                // onKeyPress$={(e) => {
                //   if (e.key === 'Enter') {
                //     document.getElementById('in_apellidoPaterno_PERSONA')?.focus();
                //   }
                //   if (e.key === 'Escape') {
                //     document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                //   }
                // }}
                // onFocusin$={(e) => {
                //   // alert(`INGRESO... ${e}`);
                //   console.log('INGRESO-', e);
                //   buscarPersonaEnAPIExterna();
                // }}
              />
            </div>
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_grabar_CUENTACORRIENTE"
          type="submit"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            if (props.cuentaCorriSelec.banco === "") {
              alert("Seleccione la entidad financiera");
              document.getElementById("se_banco_CUENTACORRIENTE")?.focus();
              return;
            }
            if (props.cuentaCorriSelec.moneda === "") {
              alert("Seleccione la moneda");
              document.getElementById("se_moneda_CUENTACORRIENTE")?.focus();
              return;
            }
            if (props.cuentaCorriSelec.cuentaCorriente === "") {
              alert("Ingrese la cuenta corriente");
              document.getElementById("in_CuentaCorriente_CC")?.focus();
              return;
            }
            // irARegistrarPersona();
            if (props.cuentaCorriSelec.idAuxiliar === "") {
              ctx_persona.cuentasCorrientes.push({
                idAuxiliar: elIdAuxiliar(),
                banco: props.cuentaCorriSelec.banco,
                moneda: props.cuentaCorriSelec.moneda,
                cuentaCorriente: props.cuentaCorriSelec.cuentaCorriente,
                cci: props.cuentaCorriSelec.cci,
              });
            }
            ctx_editar_persona.grabo_cuentaCorriente = true;
            ctx_editar_persona.mostrarPanelNewEditCuentaCorriente = false;
          }}
        />
      </div>
      {/* </Form> */}
      {/* MOSTRAR SPINNER */}
      {/* {mostrarSpinner.value && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )} */}
    </div>
  );
});
