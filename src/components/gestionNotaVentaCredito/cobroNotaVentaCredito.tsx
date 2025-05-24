import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_COBROS_NOTA_VENTA_CREDITO, CTX_NOTA_VENTA_CREDITO } from './cobrosNotaVentaCredito';
import { elIdAuxiliar } from '~/functions/comunes';

export default component$((props: { cobroSeleccionado: any }) => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_COBROS_NOTA_VENTA_CREDITO);
  const documento = useContext(CTX_NOTA_VENTA_CREDITO).cuotas;
  //#endregion CONTEXTOS

  return (
    <div
      style={{
        width: 'clamp(220px, 100%, 280px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          title="Cerrar el formulario"
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            console.log('cerrar formulario', props.cobroSeleccionado);
          })}
        />
        <ImgButton
          title="Cerrar el formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            ctx.mostrarPanelCobroNVCredito = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Cobro N.Venta Crédito</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        <div class="linea_1_11" style={{ marginBottom: '8px' }}>
          <label class="label-form">Fecha:</label>
          <input
            id="fechaCobro"
            type="date"
            class="input-form"
            value={props.cobroSeleccionado.fechaCobro}
            style={{ width: '170px' }}
            onChange$={(e) => {
              props.cobroSeleccionado.fechaCobro = e.target.value;
              document.getElementById('cobro')?.focus();
              // document.getElementById('cobro')?.select();
            }}
          />
        </div>
        <div class="linea_1_11">
          <label class="label-form">Cobro:</label>
          <input
            id="cobro"
            type="number"
            class="input-form"
            value={props.cobroSeleccionado.importeCobroPEN}
            onChange$={(e) => {
              props.cobroSeleccionado.importeCobroPEN = e.target.value;
            }}
            onKeyPress$={(e) => {
              if (e.key === 'Enter') {
                document.getElementById('btn_Registrar_CobrosNVCredito')?.focus();
              }
            }}
          />
        </div>
        <br />
        {/* REGISTRAR */}
        <input
          id="btn_Registrar_CobrosNVCredito"
          type="button"
          value="Registrar COBRO"
          style={{ cursor: 'pointer', height: '40px' }}
          class="btn-centro"
          onClick$={() => {
            if (typeof props.cobroSeleccionado.fechaCobro === 'undefined' || props.cobroSeleccionado.fechaCobro === '') {
              alert('Ingrese la fecha del cobro');
              document.getElementById('fechaCobro')?.focus();
              return;
            }
            if (typeof props.cobroSeleccionado.importeCobroPEN === 'undefined' || props.cobroSeleccionado.importeCobroPEN === '') {
              alert('Ingrese el cobro');
              document.getElementById('cobro')?.focus();
              return;
            }

            documento.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              fechaCobro: props.cobroSeleccionado.fechaCobro,
              importeCobroPEN: props.cobroSeleccionado.importeCobroPEN,
            });

            ctx.mostrarPanelCobroNVCredito = false;
          }}
        />
      </div>
    </div>
  );
});
