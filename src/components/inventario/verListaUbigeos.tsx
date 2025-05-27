import { $, component$, createContextId, Resource, useContext, useContextProvider, useResource$, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import type { IUbigeoStock } from '~/interfaces/iKardex';
// import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import TrasladoEntreUbigeosIN from '../miscelanea/mercaderiaIN/trasladoEntreUbigeosIN';
import { CTX_INVENTARIO_EXTERNO } from '../miscelanea/inventarioExterno/inventarioExterno';
import NewEditUbigeo from '../miscelanea/mercaderiaIN/newEditUbigeo';
import Spinner from '../system/spinner';
// import MercaderiaINSeleccionada from './mercaderiaINSeleccionada';
// import NewEditUbigeo from './newEditUbigeo';
// import MercaderiaINSeleccionada2 from './mercaderiaINSeleccionada2';

export const CTX_VER_LISTA_UBIGEOS_STOCKS_IN = createContextId('lista_ubigeos_stocks_in');

export default component$((props: { descripcion: string; idKardex: string; contexto: string }) => {
  //#region DEFINICION CTX_VER_LISTA_UBIGEOS_STOCKS_IN
  const definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN = useStore<any>({
    mostrarPanelNewEditUbigeosStocksIN: false,
    elIDUbigeo: '',
    elUbigeo: '',

    mostrarPanelTrasladoEntreUbigeosIN: false,
    uS: [],
    listaUbigeos: [],

    grabo_UbigeoStock: 0,
    mostrarSpinner: true,
  });
  useContextProvider(CTX_VER_LISTA_UBIGEOS_STOCKS_IN, definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN);
  //#endregion DEFINICION CTX_VER_LISTA_UBIGEOS_STOCKS_IN

  //#region CONTEXTOS
  // const ctx_index_inventario = useContext(CTX_INDEX_INVENTARIO);
  let ctx: any = [];
  switch (props.contexto) {
    case 'index_inventario':
      ctx = useContext(CTX_INDEX_INVENTARIO);
      break;
    case 'inventario_externo':
      ctx = useContext(CTX_INVENTARIO_EXTERNO);
      break;
    // case 'cotizacion':
    //   ctx = useContext(CTX_DOCS_COTIZACION);
    //   break;
    // case 'new_edit_cotizacion':
    //   ctx = useContext(CTX_NEW_EDIT_COTIZACION);
    //   break;
  }
  //#endregion CONTEXTOS

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
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log(losUbigeosStocks);
          })}
        /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelVerListaUbigeos = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'grey' }}>
        <img src={images.puntoRosado} alt="Bandera roja" width="12" height="12" /> {props.descripcion}
      </h3>
      <button
        hidden={props.contexto === 'inventario_externo'}
        onClick$={() => {
          definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.elIDUbigeo = '';
          definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.elUbigeo = '';
          definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelNewEditUbigeosStocksIN = true;
        }}
      >
        ADICIONAR UBIGEO
      </button>
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
            ctx.mostrarSpinner = false;
            definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarSpinner = false;
            return <div style={{ color: 'red' }}>Fallo en la carga de datos</div>;
          }}
          onResolved={(ubigeosStocks) => {
            console.log('onResolved 🍋🍋🍋🍋', ubigeosStocks);
            const { data } = ubigeosStocks; //{ status, data, message }
            const misUbigeosStocks: IUbigeoStock[] = data;
            ctx.mostrarSpinner = false;
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
                          const { _id, ubigeo, stock } = ubiLoca;
                          total = total + Number(stock.$numberDecimal);
                          return (
                            <tr>
                              <td data-label="Ubigeo" style={{ fontWeight: 'bold' }}>
                                {ubigeo}
                              </td>
                              <td data-label="Stock" class="accionesLeft" style={{ color: 'purple', fontWeight: 'bold' }}>
                                {stock.$numberDecimal}
                              </td>
                              <td data-label="Acc" class="accionesLeft">
                                <input
                                  title="Editar ubigeo"
                                  type="image"
                                  src={images.edit}
                                  // alt="icono de editar"
                                  height={14}
                                  width={14}
                                  style={{ cursor: 'pointer', marginRight: '8px' }}
                                  onClick$={() => {
                                    if (ubigeo.toUpperCase().trim() === 'TRASLADO') {
                                      alert('El ubigeo TRASLADO no puede ser editado.');
                                      return;
                                    }
                                    definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.elIDUbigeo = _id;
                                    definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.elUbigeo = ubigeo;

                                    definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelNewEditUbigeosStocksIN = true;
                                  }}
                                />
                                <input
                                  // id="in_BuscarDetraccion"
                                  title="Traslado interno"
                                  type="image"
                                  src={images.traslado}
                                  alt="icono buscar"
                                  height={14}
                                  width={14}
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
                          <td colSpan={1} style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            Total:
                          </td>
                          <td colSpan={1} class="accionesLeft" style={{ fontWeight: 'bold' }}>
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
      {definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelNewEditUbigeosStocksIN && (
        <div class="modal">
          <NewEditUbigeo
            idKardex={props.idKardex}
            idUbigeoStock={definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.elIDUbigeo}
            ubigeo={definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.elUbigeo}
            contexto="ver_lista_ubigeos"
          />
        </div>
      )}
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
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_VER_LISTA_UBIGEOS_STOCKS_IN.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
