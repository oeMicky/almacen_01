import { $, component$, useContext } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_SELECCIONAR_SERVICIO } from '.';
import { parametrosGlobales } from '~/routes/login';
import { upTipoCambioManual } from '~/apis/grupoEmpresarial.api';

export default component$(() => {
  //#region CONTEXTO
  const ctx_seleccionar_servicio = useContext(CTX_SELECCIONAR_SERVICIO);
  //#endregion CONTEXTO

  //#region GRABAR
  const grabarTipoCambioManual = $(async () => {
    if (parametrosGlobales.tipoCambioManual.trim() === '') {
      alert('Ingrese el tipo de cambio manual');
      document.getElementById('in_TipoCambioManual_USUARIO')?.focus();
      return;
    }
    let contra = await upTipoCambioManual({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      tipoCambioManual: parametrosGlobales.tipoCambioManual,
      usuario: parametrosGlobales.usuario,
    });
    console.log('contra', contra);
    contra = contra.data;
    console.log('🥽🥽🥽🥽🥽🥽', contra, contra[0]);
    //
    // if (typeof contra.ok !== "undefined") {
    //   //console.log("🧨🧨🧨🧨🧨🧨");
    // if (contra.ok === -1) {
    //   alert('La contraseña ingresada no es la correcta, verifique.');
    //   document.getElementById('in_TipoCambioManual_USUARIO')?.focus;
    //   return;
    //   // }
    // } else {
    //console.log("🎇🎇🎇🎇🎇🎇");
    ctx_seleccionar_servicio.actualizo_TipoCambioManual = true;
    ctx_seleccionar_servicio.mostrarPanelCambiarTipoCambioManual = false;
    // }
  });
  //#endregion GRABAR

  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 360px)',
        // width: 'auto',
        //   border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
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
              //console.log("itemVenta", props.borrarCuentaContable);
            })}
          /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <div>
          <br />
          <div class="linea-formulario">
            <label>Tipo Cambio Manual</label>
            <input
              id="in_TipoCambioManual_USUARIO"
              autoFocus
              name="TipoCambioManual"
              type="number"
              placeholder="TipoCambioManual"
              class="input-formulario-usuario"
              style={{ width: '210px' }}
              value={parametrosGlobales.tipoCambioManual}
              onFocus$={(e) => (e.target as HTMLInputElement).select()}
              onChange$={(e) => (parametrosGlobales.tipoCambioManual = (e.target as HTMLInputElement).value)}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('in_btn_Grabar_USUARIO') as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
          <br />
        </div>

        {/* <button>Registrar</button> */}
        <input
          id="in_btn_Grabar_USUARIO"
          class="boton-formulario"
          style={{ height: '32px' }}
          type="button"
          value="Grabar"
          onClick$={() => {
            grabarTipoCambioManual();
          }}
        />
      </div>
    </div>
  );
});
