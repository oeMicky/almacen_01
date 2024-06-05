import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
import { CTX_NEW_EDIT_DIRECCION_GR } from "./newEditDireccionGR";
import { obtenerUbigeoSUNAT } from "~/apis/guiaRemision.api";
// import Spinner from "../system/spinner";
import ElSelect from "../system/elSelect";
// import { CLIENT_RENEG_LIMIT } from 'tls';

export default component$((props: { elUbi: any }) => {
  //#region definicion_CTX_SELECCIONAR_UBIGEO_SUNAT
  const definicion_CTX_SELECCIONAR_UBIGEO_SUNAT = useStore({
    idDepartamento: props.elUbi.idDepartamento ? props.elUbi.idDepartamento : "",
    departamento: props.elUbi.departamento ? props.elUbi.departamento : "",
    idProvincia: props.elUbi.idProvincia ? props.elUbi.idProvincia : "",
    provincia: props.elUbi.provincia ? props.elUbi.provincia : "",
    idDistrito: props.elUbi.idDistrito ? props.elUbi.idDistrito : "",
    distrito: props.elUbi.distrito ? props.elUbi.distrito : "",
    ubigeo: props.elUbi.ubigeo ? props.elUbi.ubigeo : "",
  });
  //#endregion definicion_CTX_SELECCIONAR_UBIGEO_SUNAT

  //#region CONTEXTO
  const ctx_new_edit_direccion_gr = useContext(CTX_NEW_EDIT_DIRECCION_GR);
  //#endregion CONTEXTO

  //#region INICIALIZANDO
  const ini = useSignal(0);
  // const mostrarSpinner = useSignal(false);

  const losDepartamentos = useSignal([]);
  const lasProvincias = useSignal([]);
  const losDistritos = useSignal([]);
  //#endregion INICIALIZANDO

  //#region OBTENER UBIGEO SUNAT
  useTask$(async ({ track }) => {
    track(() => ini.value);

    // mostrarSpinner.value = true;

    const Dep = await obtenerUbigeoSUNAT();
    console.log("UBIGEOS", Dep.data);
    losDepartamentos.value = Dep.data;
    //ordenar
    losDepartamentos.value = losDepartamentos.value.sort((a: any, b: any) => {
      const marA = a.departamento.toUpperCase(); // ignore upper and lowercase
      const marB = b.departamento.toUpperCase(); // ignore upper and lowercase
      if (marA < marB) {
        return -1;
      }
      if (marA > marB) {
        return 1;
      }
      // names must be equal
      return 0;
    });

    // mostrarSpinner.value = false;
    ctx_new_edit_direccion_gr.mostrarSpinner = false;
  });
  //#endregion OBTENER UBIGEO SUNAT

  //#region OBTENER PROVINCIAS
  const obtenerProvincias = $((idDepa: string) => {
    console.log("idDepa", idDepa);
    const ppp: any = losDepartamentos.value.filter((depas: any) => depas._id === idDepa);
    console.log("ppp", ppp);
    lasProvincias.value = ppp[0].provincias;
    //ordenar
    lasProvincias.value = lasProvincias.value.sort((a: any, b: any) => {
      const marA = a.provincia.toUpperCase(); // ignore upper and lowercase
      const marB = b.provincia.toUpperCase(); // ignore upper and lowercase
      if (marA < marB) {
        return -1;
      }
      if (marA > marB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    console.log("lasProvincias.value", lasProvincias.value);
  });
  //#endregion OBTENER PROVINCIAS

  //#region OBTENER DISTRITOS
  const obtenerDistritos = $((idProv: string) => {
    console.log("idProv", idProv);
    const ddd: any = lasProvincias.value.filter((provs: any) => provs._id === idProv);
    console.log("ddd", ddd);
    losDistritos.value = ddd[0].distritos;
    //ordenar
    losDistritos.value = losDistritos.value.sort((a: any, b: any) => {
      const marA = a.distrito.toUpperCase(); // ignore upper and lowercase
      const marB = b.distrito.toUpperCase(); // ignore upper and lowercase
      if (marA < marB) {
        return -1;
      }
      if (marA > marB) {
        return 1;
      }
      // names must be equal
      return 0;
    });
    console.log("losDistritos.value", losDistritos.value);
  });
  //#endregion OBTENER DISTRITOS

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 340px)",
        // width: 'auto',
        padding: "2px",
        // background: '#c0c0c0',
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
            ctx_new_edit_direccion_gr.mostrarPanelSeleccionarUbigeoSUNAT = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Seleccionar ubigeo</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        {/* Departamento */}
        <div class="form-control">
          <label>Departamento</label>
          <div class="form-control form-agrupado">
            <ElSelect
              id={"se_Departamento_UBIGEO_SUNAT"}
              valorSeleccionado={definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.departamento}
              registros={losDepartamentos.value}
              registroID={"_id"}
              registroTEXT={"departamento"}
              seleccione={"-- Seleccione departamento --"}
              onChange={$(() => {
                const elSelec = document.getElementById("se_Departamento_UBIGEO_SUNAT") as HTMLSelectElement;
                const elIdx = elSelec.selectedIndex;
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDepartamento = elSelec[elIdx].id;
                if (definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDepartamento === "") {
                  definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.departamento = "";
                } else {
                  definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.departamento = elSelec.value;
                  obtenerProvincias(definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDepartamento);
                }
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idProvincia = "";
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.provincia = "";
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDistrito = "";
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.distrito = "";
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.ubigeo = "";
              })}
              onKeyPress={$((e: any) => {
                if (e.key === "Enter") {
                  (document.getElementById("se_Provincia_MERCADERIA_IN") as HTMLSelectElement)?.focus();
                }
              })}
            />
          </div>
        </div>
        {/* Provincia */}
        <div class="form-control">
          <label>Provincia</label>
          <div class="form-control form-agrupado">
            <ElSelect
              id={"se_Provincia_UBIGEO_SUNAT"}
              valorSeleccionado={definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.provincia}
              registros={lasProvincias.value}
              registroID={"_id"}
              registroTEXT={"provincia"}
              seleccione={"-- Seleccione provincia --"}
              onChange={$(() => {
                const elSelec = document.getElementById("se_Provincia_UBIGEO_SUNAT") as HTMLSelectElement;
                const elIdx = elSelec.selectedIndex;
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idProvincia = elSelec[elIdx].id;
                if (definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idProvincia === "") {
                  definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.provincia = "";
                } else {
                  definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.provincia = elSelec.value;
                  obtenerDistritos(definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idProvincia);
                }
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDistrito = "";
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.distrito = "";
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.ubigeo = "";
              })}
              onKeyPress={$((e: any) => {
                if (e.key === "Enter") {
                  (document.getElementById("se_Distrito_UBIGEO_SUNAT") as HTMLSelectElement)?.focus();
                }
              })}
            />
          </div>
        </div>
        {/* Distrito */}
        <div class="form-control">
          <label>Distrito</label>
          <div class="form-control form-agrupado">
            <ElSelect
              id={"se_Distrito_UBIGEO_SUNAT"}
              valorSeleccionado={definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.distrito}
              registros={losDistritos.value}
              registroID={"_id"}
              registroTEXT={"distrito"}
              seleccione={"-- Seleccione distrito --"}
              onChange={$(() => {
                const elSelec = document.getElementById("se_Distrito_UBIGEO_SUNAT") as HTMLSelectElement;
                const elIdx = elSelec.selectedIndex;
                definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDistrito = elSelec[elIdx].id;
                if (definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDistrito === "") {
                  definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.distrito = "";
                  definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.ubigeo = "";
                } else {
                  definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.distrito = elSelec.value;
                  // obtenerUbigeo()
                  console.log("definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDistrito", definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDistrito);
                  const sele: any = losDistritos.value.find((kkk: any) => kkk._id === definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDistrito);
                  console.log("sele", sele);
                  definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.ubigeo = sele.ubigeo;
                }
              })}
              onKeyPress={$((e: any) => {
                if (e.key === "Enter") {
                  (document.getElementById("se_unidad_UBIGEO_SUNAT") as HTMLSelectElement)?.focus();
                }
              })}
            />
          </div>
        </div>
        {/* Ubigeo SUNAT */}
        <div class="form-control">
          <label>Ubigeo SUNAT</label>
          <div class="form-control form-agrupado">
            <input
              id="in_UbigeoSUNAT_GR"
              style={{ width: "100%" }}
              disabled
              type="text"
              placeholder="Ubigeo"
              value={definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.ubigeo}
              // onChange$={(e) => {
              //   marca.mar = (e.target as HTMLInputElement).value.trim().toUpperCase();
              // }}
              onKeyUp$={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("btn_seleccionatUbigeoSUNAT")?.focus();
                }
              }}
              onFocusin$={(e) => {
                (e.target as HTMLInputElement).select();
              }}
            />
          </div>
        </div>
        <br />
        {/* GRABAR   onClick={(e) => onSubmit(e)} Sujeto a percepción*/}
        <input
          id="btn_seleccionatUbigeoSUNAT"
          type="submit"
          value="Seleccionar" //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            if (definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.departamento.trim() === "") {
              alert("Seleccione el departamento");
              document.getElementById("se_Departamento_UBIGEO_SUNAT")?.focus();
              return;
            }
            if (definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.provincia.trim() === "") {
              alert("Seleccione la provincia");
              document.getElementById("se_Provincia_UBIGEO_SUNAT")?.focus();
              return;
            }
            if (definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.distrito.trim() === "") {
              alert("Seleccione el distrito");
              document.getElementById("se_Distrito_UBIGEO_SUNAT")?.focus();
              return;
            }
            props.elUbi.idDepartamento = definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDepartamento;
            props.elUbi.departamento = definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.departamento;
            props.elUbi.idProvincia = definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idProvincia;
            props.elUbi.provincia = definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.provincia;
            props.elUbi.idDistrito = definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.idDistrito;
            props.elUbi.distrito = definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.distrito;
            props.elUbi.ubigeo = definicion_CTX_SELECCIONAR_UBIGEO_SUNAT.ubigeo;
            ctx_new_edit_direccion_gr.mostrarPanelSeleccionarUbigeoSUNAT = false;
            // seleccionarUbigeoSUNAT();
          }}
        />
      </div>
      {/* </Form> */}
      {/* MOSTRAR SPINNER */}
      {/* {mostrarSpinner.value && (
        <div
          class="modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner />
        </div>
      )} */}
    </div>
  );
});
