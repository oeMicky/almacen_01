import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_VENTA } from '~/routes/(ventas)/venta';
import { cerosALaIzquierda } from '~/functions/comunes';

export default component$(() => {
  //#region CONTEXTO
  const ctx_index_venta = useContext(CTX_INDEX_VENTA);
  //#endregion CONTEXTO
  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 500px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
        background: '#eee',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {/* <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('ctx_index_venta.darDeBajaMOTIVO', ctx_index_venta.darDeBajaMOTIVO);
          })}
        /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_venta.mostrarPanelDarDeBajaDocumentoVenta = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <p style={{ margin: '0 8px' }}>
            <label>
              ¿Desea dar de baja al documento {ctx_index_venta.darDeBajaSERIE}-{cerosALaIzquierda(ctx_index_venta.darDeBajaNUMERO, 8)} de{' '}
              {ctx_index_venta.darDeBajaCLIENTE}?
            </label>
          </p>
          <br />
          <p style={{ fontSize: '0.8rem', margin: '8px 16px' }}>
            <label>Motivo:</label>
            <br />
            <input
              id="inputMotivoDarDeBaja"
              type="text"
              value={ctx_index_venta.darDeBajaMOTIVO}
              maxLength={100}
              style={{ width: '100%' }}
              onChange$={(e) => {
                ctx_index_venta.darDeBajaMOTIVO = (e.target as HTMLInputElement).value.toUpperCase();
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('btn_SI')?.focus();
                }
              }}
            ></input>
          </p>
          <br />
          <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-around', alignItems: 'center' }}>
            <button
              id="btn_SI"
              style={{ width: '60px' }}
              onClick$={() => {
                if (ctx_index_venta.darDeBajaMOTIVO.trim() === '') {
                  alert('Ingrese el motivo para dar de baja al documento.');
                  document.getElementById('inputMotivoDarDeBaja')?.focus();
                  return;
                }

                ctx_index_venta.siDarDeBajaID = ctx_index_venta.darDeBajaID;
                ctx_index_venta.mostrarPanelDarDeBajaDocumentoVenta = false;
              }}
            >
              SI
            </button>
            <button
              style={{ width: '60px' }}
              onClick$={() => {
                ctx_index_venta.mostrarPanelDarDeBajaDocumentoVenta = false;
              }}
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});
