import { $, component$, useContext } from '@builder.io/qwik';
import { images } from '~/assets';
// import { , hoy } from '~/functions/comunes';
import ImgButton from '../system/imgButton';
import { ICuotaCreditoVenta } from '~/interfaces/iVenta';
import { CTX_ADD_VENTA } from './addVenta';

export default component$((props: { ancho: number; esEdit: boolean; cuota: ICuotaCreditoVenta }) => {
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
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
    ctx_add_venta.mostrarPanelCuotasCredito = false;
    ctx_add_venta.grabo_CuotaCredito = true;
    // ctx_docs_venta.grabo_cuotas_numero++;
  });

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 800px)',
        //  width: props.ancho + 'px'
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO   */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar formulario"
          onClick={$(() => (ctx_add_venta.mostrarPanelCuotasCredito = false))}
        />
        <ImgButton
          src={images.see}
          alt="Icono de see"
          height={16}
          width={16}
          title="imprimir see"
          onClick={$(() => console.log('cuota.idAuxiliar', props.cuota.idAuxiliar))}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* fecha */}
        <div class="form-control">
          <label>Fecha</label>
          <div class="form-control form-agrupado">
            <input
              type="date"
              id="inputFechaCuota"
              style={{ width: '100%' }}
              value={props.cuota.fechaCuota}
              onChange$={(e) => {
                props.cuota.fechaCuota = (e.target as HTMLInputElement).value;
              }}
              // onChange={(e) => setFechaCuota(e.target.value)}
            />
          </div>
        </div>
        {/* importe */}
        <div class="form-control">
          <label>Importe</label>
          <div class="form-control form-agrupado">
            <input
              type="text"
              id="inputImporteCuota"
              style={{ width: '100%' }}
              placeholder="Add importe cuota"
              value={props.cuota.importeCuotaPEN}
              onChange$={(e) => {
                props.cuota.importeCuotaPEN = parseFloat((e.target as HTMLInputElement).value);
              }}
              // onChange={(e) => setImporteCuota(e.target.value)}
            />
          </div>
        </div>
        {/* summit   onClick={(e) => onSubmit(e)} */}
        <input
          type="button"
          value="Grabar "
          class="btn-centro"
          style={{ marginTop: '7px' }}
          onClick$={() => {
            onSubmit();
          }}
        />
      </div>
    </div>
  );
});
