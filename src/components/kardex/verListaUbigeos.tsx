import { $, component$, createContextId, Resource, useContext, useContextProvider, useResource$, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import type { IUbigeoStock } from '~/interfaces/iKardex';
// import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import TrasladoEntreUbigeosIN from '../miscelanea/mercaderiaIN/trasladoEntreUbigeosIN';
// import MercaderiaINSeleccionada from './mercaderiaINSeleccionada';
// import NewEditUbigeo from './newEditUbigeo';
// import MercaderiaINSeleccionada2 from './mercaderiaINSeleccionada2';

export const CTX_VER_LISTA_UBIGEOS_STOCKS_IN = createContextId('lista_ubigeos_stocks_in');

export default component$((props: { descripcion: string; idKardex: string }) => {
  //#region DEFINICION CTX_VER_LISTA_UBIGEOS_STOCKS_IN
  const definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN = useStore<any>({
    mostrarPanelNewEditUbigeosStocksIN: false,
    elUbigeo: '',

    mostrarPanelTrasladoEntreUbigeosIN: false,
    uS: [],
    listaUbigeos: [],

    grabo_UbigeoStock: 0,
    mostrarSpinner: true,
  });
  useContextProvider(CTX_VER_LISTA_UBIGEOS_STOCKS_IN, definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN);
  //#endregion DEFINICION CTX_VER_LISTA_UBIGEOS_STOCKS_IN

  //#region CONTEXTO
  const ctx_index_inventario = useContext(CTX_INDEX_INVENTARIO);
  //#endregion CONTEXTO

  //#region INICIALIZACION

  let total = 0;

  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const losUbigeosStocks = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // track(() => props.idKardex.valueOf());
    track(() => definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.grabo_UbigeoStock);

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('props.idKardex', props.idKardex);
    //console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/kardex/obtenerUbigeosStocks', {
      // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idKardex: props.idKardex }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <div
      style={{
        width: 'clamp(280px, 100%, 320px)',
        // width: 'auto',
        // border: '1px solid red',
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
            ctx_index_inventario.mostrarPanelVerListaUbigeos = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'grey' }}>{props.descripcion}</h3>
      {/* <button
        onClick$={() => {
          definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelNewEditUbigeosStocksIN = true;
        }}
      >
        ADICIONAR UBIGEO
      </button> */}
      {/* FORMULARIO */}
      <div class="add-form">
        <Resource
          value={losUbigeosStocks}
          onPending={() => {
            //console.log('onPending 🍉🍉🍉🍉');
            return <div>Cargando...</div>;
          }}
          onRejected={() => {
            //console.log('onRejected 🍍🍍🍍🍍');
            ctx_index_inventario.mostrarSpinner = false;
            definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarSpinner = false;
            return <div style={{ color: 'red' }}>Fallo en la carga de datos</div>;
          }}
          onResolved={(ubigeosStocks) => {
            console.log('onResolved 🍋🍋🍋🍋', ubigeosStocks);
            const { data } = ubigeosStocks; //{ status, data, message }
            const misUbigeosStocks: IUbigeoStock[] = data;
            ctx_index_inventario.mostrarSpinner = false;
            definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarSpinner = false;
            return (
              <>
                {misUbigeosStocks.length > 0 ? (
                  <>
                    <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                      <thead>
                        <tr>
                          <th>Ubigeo</th>
                          <th>Stock</th>
                          <th>Acc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {misUbigeosStocks.map((ubiLoca) => {
                          const { ubigeo, stock } = ubiLoca;
                          total = total + Number(stock.$numberDecimal);
                          return (
                            <tr>
                              <td data-label="Ubigeo">{ubigeo}</td>
                              <td data-label="Stock" class="comoNumeroLeft">
                                {stock.$numberDecimal}
                              </td>
                              <td data-label="Acc" class="accionesLeft">
                                <input
                                  // id="in_BuscarDetraccion"
                                  type="image"
                                  src={images.traslado}
                                  title="Traslado interno"
                                  alt="icono buscar"
                                  height={12}
                                  width={12}
                                  //   style={{ padding: '2px',  }}
                                  //   onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                  onClick$={() => {
                                    definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.uS = ubiLoca;
                                    definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.listaUbigeos = misUbigeosStocks;

                                    definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelTrasladoEntreUbigeosIN = true;
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan={1} style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            Total:
                          </td>
                          <td colSpan={1} class="comoNumero" style={{ fontWeight: 'bold' }}>
                            {total}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </>
                ) : (
                  <div>
                    <i style={{ fontSize: '0.8rem', color: 'red' }}>No se encontraron registros</i>
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      {definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelTrasladoEntreUbigeosIN && (
        <div class="modal">
          <TrasladoEntreUbigeosIN
            descripcion={props.descripcion}
            idKardex={props.idKardex}
            desde={definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.uS}
            listaOrigen={definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.listaUbigeos}
          />
        </div>
      )}
    </div>
  );
});
