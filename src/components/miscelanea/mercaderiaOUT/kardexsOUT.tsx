import { $, component$, createContextId, useContext, useContextProvider, useStore, useStylesScoped$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_BUSCAR_MERCADERIA_OUT } from './buscarMercaderiaOUT';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import MercaderiaOUTSeleccionada from './mercaderiaOUTSeleccionada';
import style from '../../tabla/tabla.css?inline';

export const CTX_KARDEXS_OUT = createContextId<any>('kardexs_out__');

export default component$((props: { mercaOUTSelecci: any; esAlmacen: boolean; contexto: string }) => {
  useStylesScoped$(style);

  //#region DEFINICION CTX_KARDEXS_OUT
  const definicion_CTX_KARDEXS_OUT = useStore({
    mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS: false,
  });
  useContextProvider(CTX_KARDEXS_OUT, definicion_CTX_KARDEXS_OUT);
  //#endregion DEFINICION CTX_KARDEXS_OUT

  //#region CONTEXTO
  const ctx_buscar_mercaderia_out = useContext(CTX_BUSCAR_MERCADERIA_OUT);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const losKardexs = useStore(props.mercaOUTSelecci.KARDEXS);
  //#endregion INICIALIZACION

  return (
    <div
      style={{
        width: 'clamp(346px, 86%, 800px)',
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
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_buscar_mercaderia_out.mostrarPanelKardexsOUT = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('props.mercaOUTSelecci', props.mercaOUTSelecci);
            // console.log('first',props.)
          })}
        />
      </div>
      {/* TITULO */}
      <h2 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Kardexs / OUT</h2>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          {/* MERCADERIA */}
          <div style={{ fontSize: '0.8em' }}>
            <div style={{ margin: '5px 0' }}>Código:{` ${props.mercaOUTSelecci.codigo} `}</div>
            <div style={{ margin: '5px 0' }}>Descripción:{` ${props.mercaOUTSelecci.descripcion}`}</div>
            <div style={{ margin: '5px 0' }}>Linea/Tipo:{` ${props.mercaOUTSelecci.lineaTipo}`}</div>
          </div>
        </div>
        {/*  tabla KARDEXS  */}
        {losKardexs.length > 0 ? (
          <table style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
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
              {losKardexs.map((iTKardexsOUT: any, index: any) => {
                const indexKardexsOUT = index + 1;

                return (
                  <tr key={iTKardexsOUT._id}>
                    <td data-label="Ítem" key={iTKardexsOUT._id}>{`${cerosALaIzquierda(indexKardexsOUT, 3)}`}</td>
                    <td data-label="Kx">{iTKardexsOUT._id.substring(iTKardexsOUT._id.length - 6)}</td>
                    <td data-label="Lote">{iTKardexsOUT.lote}</td>
                    <td data-label="Fecha vencimiento">
                      {iTKardexsOUT.fechaVencimiento ? formatoDDMMYYYY_PEN(iTKardexsOUT.fechaVencimiento) : '_'}
                    </td>
                    <td data-label="Costo PEN">
                      {typeof iTKardexsOUT.costoUnitarioMovil !== 'undefined' && iTKardexsOUT.costoUnitarioMovil !== null
                        ? iTKardexsOUT.costoUnitarioMovil.$numberDecimal
                          ? iTKardexsOUT.costoUnitarioMovil.$numberDecimal
                          : iTKardexsOUT.costoUnitarioMovil
                        : '_'}
                    </td>
                    <td data-label="Stock" style={{ textAlign: 'end' }}>
                      {iTKardexsOUT.cantidadSaldo.$numberDecimal
                        ? iTKardexsOUT.cantidadSaldo.$numberDecimal
                        : iTKardexsOUT.cantidadSaldo}
                    </td>
                    <td data-label="Uni">{props.mercaOUTSelecci.unidad}</td>

                    <td data-label="Acc" style={{ textAlign: 'right' }}>
                      <ImgButton
                        src={images.check}
                        alt="icono de eliminar"
                        height={14}
                        width={14}
                        title="Eliminar ítem"
                        onClick={$(() => {
                          ctx_buscar_mercaderia_out.mM = props.mercaOUTSelecci;
                          ctx_buscar_mercaderia_out.kK = props.mercaOUTSelecci.KARDEXS[index];
                          definicion_CTX_KARDEXS_OUT.mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS = true;
                          console.log('la mercade seleccionada OUT --INDIRECTA', ctx_buscar_mercaderia_out.mM);

                          // borrarItemMerca.idAuxiliar = iTMercaIN.idAuxiliar;
                          // borrarItemMerca.item = indexItemServi;
                          // borrarItemMerca.codigo = iTMercaIN.codigo;
                          // borrarItemMerca.descripcion = iTMercaIN.descripcion;
                          // definicion_CTX_NEW_OUT_ALMACEN.mostrarPanelDeleteItemMercaderiaOUT = true;
                        })}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <i style={{ fontSize: '0.7rem' }}>No existen kardexs</i>
        )}
      </div>
      {definicion_CTX_KARDEXS_OUT.mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS && (
        <div class="modal">
          <MercaderiaOUTSeleccionada
            mercaOUTSelecci={ctx_buscar_mercaderia_out.mM}
            elKardex={ctx_buscar_mercaderia_out.kK}
            esAlmacen={props.esAlmacen}
            // esAlmacen={false}
            contexto={'kardexs_out'}
            contextoParaDocumento={props.contexto}
          />
        </div>
      )}
    </div>
  );
});
