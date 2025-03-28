import { $, component$, createContextId, useContext, useContextProvider, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import MercaderiaINSeleccionada from './mercaderiaINSeleccionada';

export const CTX_KARDEXS_IN = createContextId<any>('kardexs_in__');

export default component$((props: { mercaINSelecci: any; esAlmacen: boolean; contexto: string; igv: number }) => {
  //#region DEFINICION CTX_KARDEXS_IN
  const definicion_CTX_KARDEXS_IN = useStore({
    mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS: false,
  });
  useContextProvider(CTX_KARDEXS_IN, definicion_CTX_KARDEXS_IN);
  //#endregion DEFINICION CTX_KARDEXS_IN

  //#reuseStoregion CONTEXTO
  const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const lasMercaderias = useStore(props.mercaINSelecci.KARDEXS);
  //#endregion INICIALIZACION

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 700px)',
        // width: 'auto',
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
            ctx_buscar_mercaderia_in.mostrarPanelKardexsIN = false;
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log('props.mercaINSelecci', props.mercaINSelecci);
          })}
        /> */}
      </div>
      {/* TITULO */}
      <h2 style={{ marginBottom: '8px', fontSize: '0.8rem' }}>Kardexs / IN</h2>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          {/* MERCADERIA */}
          <div style={{ fontSize: 'small' }}>
            <div style={{ margin: '4px 0' }}>Código:{` ${props.mercaINSelecci.codigo} `}</div>
            <div style={{ margin: '4px 0' }}>Descripción:{` ${props.mercaINSelecci.descripcion}`}</div>
            <div style={{ margin: '4px 0' }}>Linea/Tipo:{` ${props.mercaINSelecci.lineaTipo}`}</div>
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
                <th>Costo PEN</th>
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
                    <td data-label="Lote">{iTKardexsIN.lote}</td>
                    <td data-label="Fecha vencimiento">{formatoDDMMYYYY_PEN(iTKardexsIN.fechaVencimiento)}</td>
                    <td data-label="Costo PEN">
                      {typeof iTKardexsIN.costoUnitarioMovil !== 'undefined' && iTKardexsIN.costoUnitarioMovil !== null
                        ? iTKardexsIN.costoUnitarioMovil.$numberDecimal
                          ? iTKardexsIN.costoUnitarioMovil.$numberDecimal
                          : iTKardexsIN.costoUnitarioMovil
                        : '-'}
                    </td>
                    <td data-label="Stock" style={{ textAlign: 'end' }}>
                      {iTKardexsIN.cantidadSaldo.$numberDecimal ? iTKardexsIN.cantidadSaldo.$numberDecimal : iTKardexsIN.cantidadSaldo}
                    </td>
                    <td data-label="Uni">{props.mercaINSelecci.unidad}</td>

                    <td data-label="Acc" class="acciones">
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
                          ctx_buscar_mercaderia_in.mM = props.mercaINSelecci;
                          ctx_buscar_mercaderia_in.kK = props.mercaINSelecci.KARDEXS[index];
                          definicion_CTX_KARDEXS_IN.mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS = true;
                          //console.log('la mercade seleccionada IN --INDIRECTA', ctx_buscar_mercaderia_in.mM);
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
      {definicion_CTX_KARDEXS_IN.mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS && (
        <div class="modal">
          <MercaderiaINSeleccionada
            mercaINSelecci={ctx_buscar_mercaderia_in.mM}
            elKardex={ctx_buscar_mercaderia_in.kK}
            esAlmacen={props.esAlmacen}
            // esAlmacen={false}
            contextoInmediato={'kardexs_in'}
            contextoParaDocumento={props.contexto}
            igv={props.igv}
          />
        </div>
      )}
    </div>
  );
});
