import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import { , hoy } from '~/functions/comunes';
import ImgButton from '../system/imgButton';
import type { ICuotaCreditoVenta } from '~/interfaces/iVenta';
import { CTX_ADD_VENTA } from './addVenta';
import { CTX_ADD_NOTA_VENTA } from '../notaVenta/addNotaVenta';
//
export default component$((props: { contexto: string; esEdit: boolean; cuota: ICuotaCreditoVenta; fechaOrigen?: string }) => {
  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'add_nota_venta':
      ctx = useContext(CTX_ADD_NOTA_VENTA);
      break;
    case 'add_venta':
      ctx = useContext(CTX_ADD_VENTA);
      break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);

  useTask$(({ track }) => {
    track(() => ini.value);
    if (ini.value === 0) {
      setTimeout(() => {
        document.getElementById('inputFechaCuota')?.focus();
      }, 200);
    }
  });
  //#endregion INICIALIZACION
  // const ctx_add_venta = useContext(CTX_ADD_VENTA);

  // const cuota = useStore<ICuotaCreditoVenta>({
  //   idAuxiliar: 0,
  //   fechaCuota: hoy(),
  //   importeCuotaPEN: 0,
  // });

  // useTask$(() => {
  //   if (!props.esEdit) {
  //     props.cuota.idAuxiliar = parseInt(elIdAuxiliar());
  //   }
  // });

  const onSubmit = $(() => {
    if (props.cuota.importeCuotaPEN === 0) {
      alert(`el monto es 0, revise. ${props.cuota.idAuxiliar}`);
      return;
    }
    ctx.mostrarPanelCuotasCredito = false;
    ctx.grabo_CuotaCredito = true;
    // ctx_docs_venta.grabo_cuotas_numero++;
  });

  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 330px)',
        padding: '2px',
        background: '#eee',
        //  width: props.ancho + 'px'
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO   */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.see}
          alt="Icono de see"
          height={16}
          width={16}
          title="imprimir see"
          onClick={$(() => console.log('cuota.idAuxiliar', props.cuota))}
        />
        <ImgButton
          title="Cerrar formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => (ctx.mostrarPanelCuotasCredito = false))}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>Cuota</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* fecha */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input
              type="date"
              id="inputFechaCuota"
              style={{ width: '100%' }}
              value={props.cuota.fechaCuota}
              onChange$={(e) => {
                props.cuota.fechaCuota = (e.target as HTMLInputElement).value;
              }}
              onKeyUp$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('inputImporteCuota') as HTMLInputElement).focus();
                }
              }}
            />
          </div>
        </div>
        {/* importe */}
        <div class="form-control">
          <div class="form-control form-agrupado">
            <input
              type="number"
              id="inputImporteCuota"
              style={{ width: '100%' }}
              placeholder="Add importe cuota"
              value={props.cuota.importeCuotaPEN}
              onChange$={(e) => {
                props.cuota.importeCuotaPEN = parseFloat((e.target as HTMLInputElement).value);
              }}
              onKeyUp$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('btnGrabarCuota') as HTMLInputElement).focus();
                }
              }}
              // onChange={(e) => setImporteCuota(e.target.value)}
            />
          </div>
        </div>
        {/* summit   onClick={(e) => onSubmit(e)} */}
        <input
          id="btnGrabarCuota"
          type="button"
          value="Grabar "
          class="btn-centro"
          style={{ marginTop: '8px', cursor: 'pointer', height: '40px' }}
          onClick$={() => {
            onSubmit();
          }}
          // onKeyDown$={() => {
          //   console.log('onkeydown');
          // }}
          // onKeyPress$={() => {
          //   console.log('onkeypress');
          // }}
          onKeyUp$={(e) => {
            // console.log('onkeyup', e);
            if (e.key === 'ArrowUp') {
              (document.getElementById('inputImporteCuota') as HTMLInputElement).focus();
            }
          }}
        />
      </div>
    </div>
  );
});
