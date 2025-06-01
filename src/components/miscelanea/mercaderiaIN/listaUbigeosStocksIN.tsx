import { $, component$, createContextId, Resource, useContext, useContextProvider, useResource$, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import type { IUbigeoStock } from '~/interfaces/iKardex';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import MercaderiaINSeleccionada from './mercaderiaINSeleccionada';
import NewEditUbigeo from './newEditUbigeo';
import TrasladoEntreUbigeosIN from './trasladoEntreUbigeosIN';
// import MercaderiaINSeleccionada2 from './mercaderiaINSeleccionada2';

export const CTX_LISTA_UBIGEOS_STOCKS_IN = createContextId<any>('lista_ubigeos_stocks_in');

export default component$(
  (props: {
    descripcion: string;
    idKardex: string;

    esAlmacen: boolean;
    enDolares?: boolean;
    tipoCambio?: any;
    contextoInmediato: string;
    contextoParaDocumento: string;
    igv: number;
    motivo?: string;
    conIGV?: boolean;
    porMontoUnitario?: boolean;

    // inOut:boolean;
    // seleccionar:boolean;
  }) => {
    //#region DEFINICION CTX_LISTA_UBIGEOS_STOCKS_IN
    const definicion_CTX_LISTA_UBIGEOS_STOCKS_IN = useStore<any>({
      mostrarPanelNewEditUbigeosStocksIN: false,
      elIDUbigeo: '',
      elUbigeo: '',

      grabo_UbigeoStock: 0,
      mostrarSpinner: true,

      mostrarPanelTrasladoEntreUbigeosIN: false,
      uS: [],
      listaUbigeos: [],
      // mostrarPanelTrasladoEntreUbigeosIN
      // mostrarPanelMercaderiaINSeleccionada: false,
      // uS: { ubigeo: '', stock: { $numberDecimal: 0 } },
      // mM: { idKardex: props.idKardex, idUbigeoStock: '' },
      // kK: props.idKardex,
    });
    useContextProvider(CTX_LISTA_UBIGEOS_STOCKS_IN, definicion_CTX_LISTA_UBIGEOS_STOCKS_IN);
    //#endregion DEFINICION CTX_LISTA_UBIGEOS_STOCKS_IN

    //#region CONTEXTO
    const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
    //#endregion CONTEXTO

    //#region INICIALIZACION

    let total = 0;

    //#endregion INICIALIZACION

    //#region BUSCANDO REGISTROS
    const losUbigeosStocks = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      // track(() => props.idKardex.valueOf());
      track(() => definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.grabo_UbigeoStock);

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

    // console.log('losUbigeosStocks', losUbigeosStocks);
    // console.log('losUbigeosStocks', losUbigeosStocks.value?.message);
    // console.log('losUbigeosStocks', losUbigeosStocks.value?.status);

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
              height={16}
              width={16}
              title="Cerrar el formulario"
              onClick={$(() => {
                console.log("losUbigeosStocks", losUbigeosStocks.value?.message);
                console.log("losUbigeosStocks", losUbigeosStocks.value?.data);
              })}
            /> */}
          <ImgButton
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el formulario"
            onClick={$(() => {
              ctx_buscar_mercaderia_in.mostrarPanelListaUbigeosStocksIN = false;
            })}
          />
        </div>
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'grey' }}>
          <img src={images.puntoVerde} alt="Bandera roja" width="12" height="12" />
          {props.descripcion}
        </h3>
        <button
          // hidden={!props.inOut}
          onClick$={() => {
            definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelNewEditUbigeosStocksIN = true;
            // ctx_buscar_mercaderia_in.mostrarPanelUbigeosStocksIN = false;
            // ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
            // ctx_buscar_mercaderia_in.uS = { ubigeo: '', stock: { $numberDecimal: 0 } };
            // ctx_buscar_mercaderia_in.mM = { idKardex: props.idKardex, idUbigeoStock: '' };
            // ctx_buscar_mercaderia_in.kK = props.idKardex;
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
              ctx_buscar_mercaderia_in.mostrarSpinner = false;
              definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarSpinner = false;
              return <div style={{ color: 'red' }}>Fallo en la carga de datos</div>;
            }}
            onResolved={(ubigeosStocks) => {
              console.log('onResolved 🍋🍋🍋🍋', ubigeosStocks);
              const { data } = ubigeosStocks; //{ status, data, message }
              const misUbigeosStocks: IUbigeoStock[] = data;
              ctx_buscar_mercaderia_in.mostrarSpinner = false;
              definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarSpinner = false;
              return (
                <>
                  {misUbigeosStocks.length > 0 ? (
                    <>
                      <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                        <thead>
                          <tr>
                            <th>Ubigeo</th>
                            <th>Stock</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {misUbigeosStocks.map((ubiLoca) => {
                            const { _id, ubigeo, stock } = ubiLoca;
                            total = total + Number(stock.$numberDecimal);
                            return (
                              <tr>
                                <td data-label="Ubigeo">{ubigeo}</td>
                                <td data-label="Stock" style={{ color: 'purple', fontWeight: 'bold' }}>
                                  {stock.$numberDecimal}
                                </td>
                                <td data-label="Acciones" class="accionesLeft">
                                  <input
                                    // id="in_BuscarDetraccion"
                                    // hidden={!props.seleccionar}
                                    title="Seleccionar"
                                    type="image"
                                    src={images.check32}
                                    alt="icono buscar"
                                    height={16}
                                    width={16}
                                    style={{ marginRight: '6px' }}
                                    //   onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                    onClick$={() => {
                                      ctx_buscar_mercaderia_in.uS = ubiLoca;
                                      ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada_2 = true;
                                    }}
                                  />
                                  <input
                                    title="Editar ubigeo"
                                    type="image"
                                    src={images.edit}
                                    // alt="icono de editar"
                                    height={16}
                                    width={16}
                                    style={{ cursor: 'pointer', marginRight: '6px' }}
                                    onClick$={() => {
                                      if (ubigeo.toUpperCase().trim() === 'TRASLADO') {
                                        alert('El ubigeo TRASLADO no puede ser editado.');
                                        return;
                                      }
                                      definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.elIDUbigeo = _id;
                                      definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.elUbigeo = ubigeo;

                                      definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelNewEditUbigeosStocksIN = true;
                                    }}
                                  />
                                  <input
                                    // id="in_BuscarDetraccion"
                                    title="Traslado interno"
                                    type="image"
                                    src={images.traslado}
                                    alt="icono buscar"
                                    height={16}
                                    width={16}
                                    //   style={{ padding: '2px',  }}
                                    //   onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                    onClick$={() => {
                                      // definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.uS = ubiLoca;
                                      console.log('ubiLoca', ubiLoca);
                                      definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.uS = ubiLoca;
                                      definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.listaUbigeos = misUbigeosStocks;

                                      definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelTrasladoEntreUbigeosIN = true;
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
                            <td colSpan={1} style={{ textAlign: 'left', fontWeight: 'bold' }}>
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
        {definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelNewEditUbigeosStocksIN && (
          <div class="modal">
            <NewEditUbigeo
              idKardex={props.idKardex}
              idUbigeoStock={definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.elIDUbigeo}
              ubigeo={definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.elUbigeo}
              contexto="lista_ubigeos_stocks_in"
            />
          </div>
        )}
        {/* MERCADERIA CON KARDEX */}
        {ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada_2 && (
          <div class="modal">
            {/* <MercaderiaINSelec /> */}
            <MercaderiaINSeleccionada
              mercaINSelecci={ctx_buscar_mercaderia_in.mM}
              elKardex={ctx_buscar_mercaderia_in.kK}
              elIDKardex={props.idKardex}
              elUbigeoStock={ctx_buscar_mercaderia_in.uS}
              esAlmacen={true}
              enDolares={props.enDolares}
              tipoCambio={props.tipoCambio}
              contextoBase={'buscar_mercaderia_in'}
              contextoInmediato={'ubigeos_stocks_in'}
              contextoParaDocumento={props.contextoParaDocumento}
              igv={props.igv}
              motivo={props.motivo}
              conIGV={props.conIGV}
              porMontoUnitario={props.porMontoUnitario}
            />
          </div>
        )}
        {/*  TRASLADO ENTRE UBIGEOS  */}
        {definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelTrasladoEntreUbigeosIN && (
          <div class="modal">
            <TrasladoEntreUbigeosIN
              descripcion={props.descripcion}
              idKardex={props.idKardex}
              desde={definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.uS}
              listaOrigen={definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.listaUbigeos}
            />
          </div>
        )}
      </div>
    );
  }
);
