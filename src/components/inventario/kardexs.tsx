import { $, component$, createContextId, useContext, useContextProvider, useStore } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda, formatear_2Decimales, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import Kardex from './kardex';

export const CTX_KARDEXS = createContextId<any>('ctx_kardexs__');

export default component$((props: { mercaINSelecci: any; esAlmacen: boolean }) => {
  //#region DEFINICION CTX_KARDEXS
  const definicion_CTX_KARDEXS = useStore({
    mostrarPanelKARDEX: false,
  });
  useContextProvider(CTX_KARDEXS, definicion_CTX_KARDEXS);
  //#endregion DEFINICION CTX_KARDEXS

  //#reuseStoregion CONTEXTO
  const ctx_index_inventario = useContext(CTX_INDEX_INVENTARIO);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const lasMercaderias = useStore(props.mercaINSelecci.KARDEXS);
  //#endregion INICIALIZACION

  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 800px)',
        //  width: 'auto',
        border: '1px solid red',
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
            ctx_index_inventario.mostrarPanelKARDEXS = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log('props.mercaINSelecci', props.mercaINSelecci);
          })}
        />
      </div>
      {/* TITULO */}
      <h2 style={{ marginBottom: '8px', fontSize: '1rem' }}>Kardexs</h2>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          {/* MERCADERIA */}
          <div style={{ fontSize: '0.8rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', margin: '4px 0' }}>
              <label>Código</label>
              <label>{props.mercaINSelecci.codigo}</label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', margin: '4px 0' }}>
              <label>Descripción:</label>
              <label>{props.mercaINSelecci.descripcion}</label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', margin: '4px 0' }}>
              <label>Linea/Tipo:</label>
              <label>{props.mercaINSelecci.lineaTipo}</label>
            </div>
          </div>
        </div>
        {/*  tabla KARDEXS  */}
        {lasMercaderias.length > 0 ? (
          <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
            <thead>
              <tr>
                <th>Ítem</th>
                <th>Kx</th>
                <th>Lote</th>
                <th>Fecha vencimiento</th>
                <th>Costo Uni. PEN</th>
                <th>Stock</th>
                <th>Uni</th>
                <th>Acc</th>
              </tr>
            </thead>
            <tbody>
              {lasMercaderias.map((iTKardexsIN: any, index: any) => {
                const indexKardexsOUT = index + 1;

                return (
                  <tr key={iTKardexsIN._id}>
                    <td data-label="Ítem" key={iTKardexsIN._id}>{`${cerosALaIzquierda(indexKardexsOUT, 3)}`}</td>
                    <td data-label="Kx">{iTKardexsIN._id.substring(iTKardexsIN._id.length - 6)}</td>
                    <td data-label="Lote">{iTKardexsIN.lote ? iTKardexsIN.lote : '-'}</td>
                    <td data-label="Fecha vencimiento">{iTKardexsIN.fechaVencimiento ? formatoDDMMYYYY_PEN(iTKardexsIN.fechaVencimiento) : '-'}</td>
                    <td data-label="Costo Uni. PEN">
                      {typeof iTKardexsIN.costoUnitarioMovil !== 'undefined' && iTKardexsIN.costoUnitarioMovil !== null
                        ? iTKardexsIN.costoUnitarioMovil.$numberDecimal
                          ? formatear_2Decimales(iTKardexsIN.costoUnitarioMovil.$numberDecimal)
                          : formatear_2Decimales(iTKardexsIN.costoUnitarioMovil)
                        : '-'}
                    </td>
                    <td data-label="Stock" style={{ color: 'purple' }}>
                      <strong> {iTKardexsIN.cantidadSaldo.$numberDecimal ? iTKardexsIN.cantidadSaldo.$numberDecimal : iTKardexsIN.cantidadSaldo}</strong>
                    </td>
                    <td data-label="Uni">{props.mercaINSelecci.unidad}</td>

                    <td data-label="Acc" class="accionesLeft">
                      <input
                        // id="in_BuscarDetraccion"
                        type="image"
                        src={images.check32}
                        title="Seleccionar ítem"
                        height={14}
                        width={14}
                        style={{ padding: '2px' }}
                        // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                        onClick$={() => {
                          ctx_index_inventario.mM = props.mercaINSelecci;
                          ctx_index_inventario.kK = props.mercaINSelecci.KARDEXS[index];
                          // definicion_CTX_KARDEXS_IN.mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS = true;
                          //console.log('la mercade seleccionada ', ctx_index_inventario.mM);
                          //console.log('la mercade seleccionada -  KARDEX', ctx_index_inventario.kK);

                          definicion_CTX_KARDEXS.mostrarPanelKARDEX = true;
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <i style={{ fontSize: '0.8rem' }}>No existen kardexs</i>
        )}
      </div>
      {definicion_CTX_KARDEXS.mostrarPanelKARDEX && (
        <div class="modal">
          <Kardex
            mercaSelecci={ctx_index_inventario.mM}
            kardex={ctx_index_inventario.kK}
            elIDKardex=""
            // esAlmacen={props.esAlmacen}
            // esAlmacen={false}
            contexto={'kardexs'}
            // contextoParaDocumento={props.contexto}
            // igv={props.igv}
          />
        </div>
      )}
    </div>
  );
});
