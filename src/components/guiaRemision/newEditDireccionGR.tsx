import {
  $,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  // useSignal,
  useStore,
} from "@builder.io/qwik";
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
import { CTX_BUSCAR_DIRECCION_GR } from "./buscarDireccionGR";
import SeleccionarUbigeoSUNAT from "./seleccionarUbigeoSUNAT";
import { parametrosGlobales } from "~/routes/login";
import Spinner from "../system/spinner";
import { inUpDireccionGR } from "~/apis/guiaRemision.api";
// import Spinner from "../system/spinner";

export const CTX_NEW_EDIT_DIRECCION_GR = createContextId<any>("__new_edit_direccion_gr");

export default component$((props: { dGR: any }) => {
  //#region definicion_CTX_NEW_EDIT_DIRECCION_GR
  const definicion_CTX_NEW_EDIT_DIRECCION_GR = useStore({
    mostrarPanelSeleccionarUbigeoSUNAT: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_NEW_EDIT_DIRECCION_GR, definicion_CTX_NEW_EDIT_DIRECCION_GR);
  //#endregion definicion_CTX_NEW_EDIT_DIRECCION_GR

  //#region definicion_CTX_DIRECCION_GR
  const definicion_CTX_DIRECCION_GR = useStore({
    _id: props.dGR._id ? props.dGR._id : "",
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,

    direccion: props.dGR.direccion ? props.dGR.direccion : "",

    idDepartamento: props.dGR.idDepartamento ? props.dGR.idDepartamento : "",
    departamento: props.dGR.departamento ? props.dGR.departamento : "",
    idProvincia: props.dGR.idProvincia ? props.dGR.idProvincia : "",
    provincia: props.dGR.provincia ? props.dGR.provincia : "",
    idDistrito: props.dGR.idDistrito ? props.dGR.idDistrito : "",
    distrito: props.dGR.distrito ? props.dGR.distrito : "",
    ubigeo: props.dGR.ubigeo ? props.dGR.ubigeo : "",
  });
  // useContextProvider(
  //   CTX_DIRECCION_GR,
  //   definicion_CTX_DIRECCION_GR
  // );
  //#endregion definicion_CTX_DIRECCION_GR

  //#region CONTEXTO
  const ctx_buscar_Direccion_GR = useContext(CTX_BUSCAR_DIRECCION_GR);
  //#endregion CONTEXTO

  //#region INICIALIZAR
  // const  = useSignal(false);
  // const mostrarSpinner = useSignal(false);
  //#endregion INICIALIZAR

  //#region GRABAR DIRECCION GR
  const grabarDireccionGR = $(async () => {
    if (definicion_CTX_DIRECCION_GR.direccion.trim() === "") {
      alert("Ingrese la dirección");
      document.getElementById("in_Direccion_GR")?.focus();
      return;
    }
    if (definicion_CTX_DIRECCION_GR.ubigeo.trim() === "") {
      alert("Seleccione el ubigeo");
      document.getElementById("in_UbigeoSUNAT_GR")?.focus();
      return;
    }

    ctx_buscar_Direccion_GR.mostrarSpinner = true;
    const direc = await inUpDireccionGR({
      idDireccionGR: definicion_CTX_DIRECCION_GR._id,

      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idSucursal: parametrosGlobales.idSucursal,

      direccion: definicion_CTX_DIRECCION_GR.direccion,

      idDepartamento: definicion_CTX_DIRECCION_GR.idDepartamento,
      departamento: definicion_CTX_DIRECCION_GR.departamento,
      idProvincia: definicion_CTX_DIRECCION_GR.idProvincia,
      provincia: definicion_CTX_DIRECCION_GR.provincia,
      idDistrito: definicion_CTX_DIRECCION_GR.idDistrito,
      distrito: definicion_CTX_DIRECCION_GR.distrito,
      ubigeo: definicion_CTX_DIRECCION_GR.ubigeo,

      usuario: parametrosGlobales.usuario,
    });

    console.log("direc.data.direccion", direc.data.direccion);
    // ctx_buscar_Direccion_GR.conceptoABuscar = direc.data.direccion;
    ctx_buscar_Direccion_GR.conceptoABuscar = definicion_CTX_DIRECCION_GR.direccion;
    // ctx_buscar_Direccion_GR.solo_Direccion = true;
    ctx_buscar_Direccion_GR.grabo_DireccionGR = true;

    ctx_buscar_Direccion_GR.mostrarPanelNewEditDireccionGR = false;
  });
  //#endregion GRABAR DIRECCION GR

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 390px)",
        // width: 'auto',
        padding: "2px",
        // background: '#c0c0c0',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: "flex", justifyContent: "end" }}>
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={18}
          width={18}
          title="Ceverrrar el formulario"
          onClick={$(() => {
            console.log("definicion_CTX_DIRECCION_GR", definicion_CTX_DIRECCION_GR);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_buscar_Direccion_GR.mostrarPanelNewEditDireccionGR = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de dirección G.R.</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        {/* Dirección  */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input
              id="in_Direccion_GR"
              style={{ width: "100%" }}
              autoFocus
              type="text"
              placeholder="Dirección de Partida / LLegada"
              value={definicion_CTX_DIRECCION_GR.direccion}
              onChange$={(e) => {
                definicion_CTX_DIRECCION_GR.direccion = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              onKeyUp$={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("btn_grabar_MARCA_IN")?.focus();
                }
              }}
              // onFocusin$={(e) => {
              //   (e.target as HTMLInputElement).select();
              // }}
            />
          </div>
        </div>
        {/* Ubigeo SUNAT */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input
              id="in_UbigeoSUNAT_GR"
              style={{ width: "100%" }}
              disabled
              type="text"
              placeholder="Ubigeo"
              value={definicion_CTX_DIRECCION_GR.ubigeo}
              // onChange$={(e) => {
              //   marca.mar = (e.target as HTMLInputElement).value.trim().toUpperCase();
              // }}
              onKeyUp$={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("btn_grabar_Direccion_GR")?.focus();
                }
              }}
              onFocusin$={(e) => {
                (e.target as HTMLInputElement).select();
              }}
            />
            <input
              id="in_SeleccionarUbigeoSUNAT"
              type="image"
              src={images.searchPLUS}
              title="Buscar ubigeo"
              alt="buscar"
              height={16}
              width={16}
              style={{ margin: "0px 4px" }}
              onClick$={() => {
                definicion_CTX_NEW_EDIT_DIRECCION_GR.mostrarSpinner = true;
                // mostrarSpinner.value = true;
                definicion_CTX_NEW_EDIT_DIRECCION_GR.mostrarPanelSeleccionarUbigeoSUNAT = true;
              }}
            />
          </div>
        </div>
        {definicion_CTX_NEW_EDIT_DIRECCION_GR.mostrarPanelSeleccionarUbigeoSUNAT && (
          <div class="modal">
            <SeleccionarUbigeoSUNAT elUbi={definicion_CTX_DIRECCION_GR} />
          </div>
        )}
        {/* GRABAR   onClick={(e) => onSubmit(e)} Sujeto a percepción*/}
        <input
          id="btn_grabar_Direccion_GR"
          type="submit"
          value="Registrar" //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            grabarDireccionGR();
          }}
        />
      </div>
      {/* </Form> */}
      {/* MOSTRAR SPINNER */}
      {/* {mostrarSpinner.value && ( */}
      {definicion_CTX_NEW_EDIT_DIRECCION_GR.mostrarSpinner && (
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
      )}
    </div>
  );
});
