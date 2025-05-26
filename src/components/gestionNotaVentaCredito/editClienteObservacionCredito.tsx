import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_GESTION_NOTA_VENTA_CREDITO } from '~/routes/(ventas)/gestionNotaVentaCredito';
import { upNotaVentaCreditoCliObs } from '~/apis/notaVenta.api';
import { parametrosGlobales } from '~/routes/login';
// import { CTX_INDEX_GESTION_NOTA_VENTA_CREDITO } from '~/routes/(ventas)/gestionNotaVentaCredito';
// import { parametrosGlobales } from '~/routes/login';

export default component$((props: { nvSelec: any }) => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_INDEX_GESTION_NOTA_VENTA_CREDITO);

  //#endregion CONTEXTOS

  return (
    <div
      class="container-modal"
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(320px, 100%, 400px)',
        // width: 'auto',
        // background: `${definicion_CTX_NOTA_VENTA.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : '#eee'}`,
        border: '3px solid purple',
        padding: '0',
      }}
    >
      {/* BOTONES DEL MARCO    */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          // border: '1px solid blue',
          // background: 'linear-gradient(to bottom, #901090 0%, #eee 100%)',
          width: 'auto',
        }}
      >
        <ImgButton
          title="Cerrar el formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => (ctx.mostrarPanelEditarClienteObservacion = false))}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.9rem', marginLeft: '2px' }}>Nota de venta crédito</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* GENERALES style={{ fontSize: '0.6rem' }} */}
        <div>
          <input
            id="in_Cliente_Sobrenombre_Chapa"
            type="text"
            // tabIndex={1}
            // autoFocus={true}
            style={{ width: '100%', background: 'yellow', marginBottom: '8px' }}
            placeholder="Cliente / Sobrenombre / Chapa"
            value={props.nvSelec.clienteSobrenombreChapa}
            onChange$={($event) => {
              props.nvSelec.clienteSobrenombreChapa = $event.target.value;
            }}
          />
          <input
            id="in_Placa"
            type="text"
            // tabIndex={1}
            // autoFocus={true}
            value={props.nvSelec.placa}
            style={{ width: '100%', background: 'yellow', marginBottom: '8px' }}
            placeholder="Placa"
          />
          <input
            id="in_Kilometraje"
            type="text"
            // tabIndex={1}
            // autoFocus={true}
            value={props.nvSelec.kilometraje}
            style={{ width: '100%', background: 'yellow', marginBottom: '8px' }}
            placeholder="Kilometraje"
          />
          <textarea
            id="in_Observacion"
            // type="text"
            rows={2}
            // tabIndex={1}
            // autoFocus={true}
            style={{ width: '100%', background: 'yellow', marginBottom: '8px' }}
            placeholder="Observación"
            value={props.nvSelec.observacion}
            onChange$={($event) => {
              props.nvSelec.observacion = $event.target.value;
            }}
          />
        </div>
        <br />
        {/* ----------------------------------------------------- */}
        {/* GRABAR */}

        <input
          id="btnGrabarNotaVenta"
          type="button"
          // type="submit"
          value={'Grabar NOTA DE VENTA '}
          class="btn-centro"
          style={{ height: '40px' }}
          onClick$={async () => {
            if (props.nvSelec.clienteSobrenombreChapa === '') {
              alert('Ingrese el cliente');
              document.getElementById('in_Cliente_Sobrenombre_Chapa')?.focus();
              return;
            }

            await upNotaVentaCreditoCliObs({
              idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
              idEmpresa: parametrosGlobales.idEmpresa,
              idNotaVenta: props.nvSelec._id,
              clienteSobrenombreChapa: props.nvSelec.clienteSobrenombreChapa,
              placa: props.nvSelec.placa,
              kilometraje: props.nvSelec.kilometraje,
              observacion: props.nvSelec.observacion,
            }).then((res) => {
              if (res.error) {
                alert(res.error);
                return;
              }
              alert('Nota de venta grabada correctamente');
            });
            ctx.mostrarPanelEditarClienteObservacion = false;
          }}
          // onClick$={$(() => {
          //   ctx.mostrarPanelEditarClienteObservacion = false;
          //   // grabandoNotaVentaCObs();
          // })}
        />
      </div>
    </div>
  );
});
