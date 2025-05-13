import { $, component$, Resource, useContext, useResource$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_BUSCAR_MERCADERIA_OUT } from './buscarMercaderiaOUT';
import type { IUbigeoStock } from '~/interfaces/iKardex';
import MercaderiaOUTSeleccionada from './mercaderiaOUTSeleccionada';

export default component$(
  (props: {
    idKardex: string;
    descripcion: string;
    lote: string;
    fechaVencimiento: string;
    promedioCostoUnitarioMovil: any;
    esAlmacen: boolean;
    esProduccion: boolean;
    porcentaje: any;
    contextoParaDocumento: string;
  }) => {
    //#region CONTEXTO
    const ctx_buscar_mercaderia_out = useContext(CTX_BUSCAR_MERCADERIA_OUT);
    //#endregion CONTEXTO

    //#region INICIALIZACION

    let total = 0;

    //#endregion INICIALIZACION

    //#region BUSCANDO REGISTROS
    const losUbigeosStocks = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.idKardex.valueOf());
      // track(() => definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.grabo_UbigeoStock);

      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      // console.log('props.idKardex', props.idKardex);
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
              ctx_buscar_mercaderia_out.mostrarPanelUbigeosStocksOUT = false;
            })}
          />
        </div>
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'DarkSlateBlue' }}>{props.descripcion}</h3>
        {/* <button
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
              ctx_buscar_mercaderia_out.mostrarSpinner = false;
              // definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarSpinner = false;
              return <div style={{ color: 'red' }}>Fallo en la carga de datos</div>;
            }}
            onResolved={(ubigeosStocks) => {
              // console.log('onResolved 🍋🍋🍋🍋', ubigeosStocks);
              const { data } = ubigeosStocks; //{ status, data, message }
              const misUbigeosStocks: IUbigeoStock[] = data;
              ctx_buscar_mercaderia_out.mostrarSpinner = false;
              // definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarSpinner = false;
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
                            const { ubigeo, stock } = ubiLoca;
                            total = total + Number(stock.$numberDecimal);
                            return (
                              <tr>
                                <td data-label="Ubigeo">{ubigeo}</td>
                                <td data-label="Stock">{stock.$numberDecimal}</td>
                                <td data-label="Acciones" class="accionesLeft">
                                  <input
                                    // id="in_BuscarDetraccion"
                                    type="image"
                                    src={images.check32}
                                    title="Seleccionar"
                                    alt="icono buscar"
                                    height={12}
                                    width={12}
                                    //   style={{ padding: '2px',  }}
                                    //   onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                    onClick$={() => {
                                      if (parseFloat(stock.$numberDecimal) <= 0) {
                                        alert(ubigeo + ': Este ubigeo no puede ser seleccionado.');
                                        return;
                                      }
                                      // console.log('props.idKardex', props.idKardex);
                                      // console.log('ubiLoca', ubiLoca);
                                      // console.log('props.promedioCostoUnitarioMovil', props.promedioCostoUnitarioMovil);

                                      ctx_buscar_mercaderia_out.uS = ubiLoca;
                                      // // ctx_buscar_mercaderia_out.mostrarPanelMercaderiaINSeleccionada2 = true;
                                      ctx_buscar_mercaderia_out.mostrarPanelMercaderiaOUTSeleccionada = true;
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
                            <td colSpan={2} style={{ textAlign: 'left', fontWeight: 'bold' }}>
                              {total}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </>
                  ) : (
                    <div>
                      <i style={{ fontSize: '0.8rem', color: 'red' }}>No se encontraron stocks</i>
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
        {/* {definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.mostrarPanelNewEditUbigeosStocksIN && (
        <div class="modal">
          <NewEditUbigeo idKardex={props.idKardex} ubigeo={definicion_CTX_LISTA_UBIGEOS_STOCKS_IN.elUbigeo} contexto="lista_ubigeos_stocks_in" />
        </div>
      )} */}
        {ctx_buscar_mercaderia_out.mostrarPanelMercaderiaOUTSeleccionada && (
          <div class="modal">
            <MercaderiaOUTSeleccionada
              mercaOUTSelecci={ctx_buscar_mercaderia_out.mM}
              // elKardex={definicion_CTX_BUSCAR_MERCADERIA_OUT.kK}
              elIDKardex={props.idKardex}
              elUbigeoStock={ctx_buscar_mercaderia_out.uS}
              lote={props.lote}
              fechaVencimiento={props.fechaVencimiento}
              promedioCostoUnitarioMovil={props.promedioCostoUnitarioMovil}
              esAlmacen={props.esAlmacen}
              esProduccion={props.esProduccion}
              contexto={'buscar_mercaderia_out'}
              contextoParaDocumento={props.contextoParaDocumento}
              porcentaje={props.porcentaje}
            />
          </div>
        )}
      </div>
    );
  }
);
