import { $, component$, useContext, useSignal, useStore } from "@builder.io/qwik";
// import { CTX_ADD_VENTA } from './addVenta';
import ImgButton from "../system/imgButton";
import { images } from "~/assets";
// import { CTX_SELECCIONAR_SERVICI } from "~/routes/(bienvenida)/listadoSucursales";
import { parametrosGlobales } from "~/routes/login";
import { upCambioClaveUsuario } from "~/apis/usuario.api";
import { CTX_SELECCIONAR_SERVICIO } from "~/routes/(bienvenida)/seleccionarServicio";
// import { CTX_NEW_EDIT_COMPRA } from './newEditCompra';

export default component$(() => {
  //#region definicion_CTX_CAMBIO_CLAVE
  const definicion_CTX_CAMBIO_CLAVE = useStore({
    claveAnterior: "",
    claveNuevaA: "",
    claveNuevaB: "",
  });
  //#endregion definicion_CTX_CAMBIO_CLAVE

  //#region CONTEXTO
  const ctx_seleccionar_servicio = useContext(CTX_SELECCIONAR_SERVICIO);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const passwordClaveAnteriorTF = useSignal(true);
  const passwordClaveNuevaTF = useSignal(true);
  const passwordRepetirClaveNuevaTF = useSignal(true);
  //#endregion INICIALIZACION

  //#region GRABAR
  const grabarCambioClave = $(async () => {
    if (definicion_CTX_CAMBIO_CLAVE.claveAnterior.trim() === "") {
      alert("Ingrese la clave anterior");
      document.getElementById("in_ClaveAnterior_USUARIO")?.focus();
      return;
    }
    if (definicion_CTX_CAMBIO_CLAVE.claveNuevaA.trim() === "") {
      alert("Ingrese la clave nueva");
      document.getElementById("in_NuevaA_USUARIO")?.focus();
      return;
    }
    if (definicion_CTX_CAMBIO_CLAVE.claveNuevaA.length < 8) {
      alert("La clave nueva debe tener 8 o más caracteres.");
      document.getElementById("in_NuevaA_USUARIO")?.focus();
      return;
    }
    if (definicion_CTX_CAMBIO_CLAVE.claveNuevaB.trim() === "") {
      alert("Repetir la clave nueva");
      document.getElementById("in_NuevaB_USUARIO")?.focus();
      return;
    }

    if (definicion_CTX_CAMBIO_CLAVE.claveAnterior.trim() === definicion_CTX_CAMBIO_CLAVE.claveNuevaA.trim()) {
      alert("La nueva clave no puede ser identica a la anterior clave, corriga.");
      document.getElementById("in_NuevaA_USUARIO")?.focus();
      return;
    }
    if (definicion_CTX_CAMBIO_CLAVE.claveNuevaA.trim() !== definicion_CTX_CAMBIO_CLAVE.claveNuevaB.trim()) {
      alert("Las nuevas claves no coinciden, corriga.");
      document.getElementById("in_NuevaA_USUARIO")?.focus();
      return;
    }

    let contra = await upCambioClaveUsuario({
      usuario: parametrosGlobales.usuario,
      clave: definicion_CTX_CAMBIO_CLAVE.claveAnterior,
      claveNueva: definicion_CTX_CAMBIO_CLAVE.claveNuevaA,
    });
    console.log("contra", contra);
    contra = contra.data;
    console.log("🥽🥽🥽🥽🥽🥽", contra, contra[0]);
    //
    // if (typeof contra.ok !== "undefined") {
    //   console.log("🧨🧨🧨🧨🧨🧨");
    if (contra.ok === -1) {
      alert("La contraseña ingresada no es la correcta, verifique.");
      document.getElementById("in_ClaveAnterior_USUARIO")?.focus;
      return;
      // }
    } else {
      console.log("🎇🎇🎇🎇🎇🎇");
      ctx_seleccionar_servicio.actualizo_Contrasena = true;
      ctx_seleccionar_servicio.mostrarPanelCambiarClave = false;
    }
  });
  //#endregion GRABAR

  return (
    <div
      style={{
        width: "clamp(330px, 86%, 360px)",
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
            ctx_seleccionar_servicio.mostrarPanelCambiarClave = false;
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log("itemVenta", props.borrarCuentaContable);
          })}
        /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <div class="linea-formulario">
          <label>Usuario</label>
          <input
            id="in_Usuario_USUARIO"
            autoFocus
            name="usuario"
            type="email"
            disabled
            placeholder="Email"
            class="input-formulario-usuario"
            value={parametrosGlobales.usuario}
            // onChange$={(e) => (definicion_CTX_CAMBIO_CLAVE.claveAnterior = (e.target as HTMLInputElement).value)}
            onKeyPress$={(e) => {
              if (e.key === "Enter") {
                (document.getElementById("in_ClaveAnterior_USUARIO") as HTMLInputElement)?.focus();
              }
            }}
          />
        </div>
        <div class="linea-formulario">
          <label>Clave anterior</label>
          <div style={{ position: "relative", left: "12px" }}>
            <input
              id="in_ClaveAnterior_USUARIO"
              autoFocus
              name="usuario"
              type={passwordClaveAnteriorTF.value ? "password" : "text"}
              placeholder="Clave anterior"
              class="input-formulario-usuario"
              value={definicion_CTX_CAMBIO_CLAVE.claveAnterior}
              onChange$={(e) => (definicion_CTX_CAMBIO_CLAVE.claveAnterior = (e.target as HTMLInputElement).value)}
              onKeyPress$={(e) => {
                if (e.key === "Enter") {
                  (document.getElementById("in_NuevaA_USUARIO") as HTMLInputElement)?.focus();
                }
              }}
            />
            <img
              src={passwordClaveAnteriorTF.value ? images.eye : images.eyePassword}
              height={12}
              width={12}
              style={{ cursor: "pointer", position: "relative", left: "-16px" }}
              onClick$={() => {
                passwordClaveAnteriorTF.value = !passwordClaveAnteriorTF.value;
              }}
            />
          </div>
        </div>
        <div class="linea-formulario">
          <label>Clave nueva</label>
          <div style={{ position: "relative", left: "12px" }}>
            <input
              id="in_NuevaA_USUARIO"
              name="clave"
              type={passwordClaveNuevaTF.value ? "password" : "text"}
              placeholder="Clave nueva"
              class="input-formulario-usuario"
              value={definicion_CTX_CAMBIO_CLAVE.claveNuevaA}
              onChange$={(e) => (definicion_CTX_CAMBIO_CLAVE.claveNuevaA = (e.target as HTMLInputElement).value)}
              onKeyPress$={(e) => {
                if (e.key === "Enter") {
                  (document.getElementById("in_NuevaB_USUARIO") as HTMLInputElement)?.focus();
                }
              }}
            />
            <img
              src={passwordClaveNuevaTF.value ? images.eye : images.eyePassword}
              height={12}
              width={12}
              style={{ cursor: "pointer", position: "relative", left: "-16px" }}
              onClick$={() => {
                passwordClaveNuevaTF.value = !passwordClaveNuevaTF.value;
              }}
            />
          </div>
        </div>
        <div class="linea-formulario">
          <label>Repetir clave</label>
          <div style={{ position: "relative", left: "12px" }}>
            <input
              id="in_NuevaB_USUARIO"
              name="clave"
              type={passwordRepetirClaveNuevaTF.value ? "password" : "text"}
              placeholder="Repetir clave nueva"
              class="input-formulario-usuario"
              value={definicion_CTX_CAMBIO_CLAVE.claveNuevaB}
              onChange$={(e) => (definicion_CTX_CAMBIO_CLAVE.claveNuevaB = (e.target as HTMLInputElement).value)}
              onKeyPress$={(e) => {
                if (e.key === "Enter") {
                  (document.getElementById("in_btn_Grabar_USUARIO") as HTMLInputElement)?.focus();
                }
              }}
            />
            <img
              src={passwordRepetirClaveNuevaTF.value ? images.eye : images.eyePassword}
              height={12}
              width={12}
              style={{ cursor: "pointer", position: "relative", left: "-16px" }}
              onClick$={() => {
                passwordRepetirClaveNuevaTF.value = !passwordRepetirClaveNuevaTF.value;
              }}
            />
          </div>
        </div>
        {/* <button>Registrar</button> */}
        <input
          id="in_btn_Grabar_USUARIO"
          class="boton-formulario"
          type="button"
          value="Grabar"
          onClick$={() => {
            grabarCambioClave();
          }}
        />
      </div>
    </div>
  );
});
