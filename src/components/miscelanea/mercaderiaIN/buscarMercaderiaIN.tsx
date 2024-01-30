import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ImgButton from '~/components/system/imgButton';
import { parametrosGlobales } from '~/routes/login';
import TablaMercaderiasIN from './tablaMercaderiasIN';
import MercaderiaINSeleccionada from './mercaderiaINSeleccionada';
import NewEditMercaderiaIN from './newEditMercaderiaIN';
import KardexsIN from './kardexsIN';

export const CTX_BUSCAR_MERCADERIA_IN = createContextId<any>('buscar_mercaderia_in');

export default component$((props: { contexto: string; esAlmacen: boolean; igv: number }) => {
  //#region DEFINICION CTX_BUSCAR_MERCADERIA_IN - para eDITAR - para sELECCIONAR
  const definicion_CTX_BUSCAR_MERCADERIA_IN = useStore({
    mM: [],
    kK: [],

    mostrarPanelNewEditMercaderiaIN: false,
    grabo_mercaderiaIN: false,

    mostrarPanelKardexsIN: false,

    mostrarPanelMercaderiaINSeleccionada: false,
    // mostrarPanelAsignarPrecio: false,
  });
  useContextProvider(CTX_BUSCAR_MERCADERIA_IN, definicion_CTX_BUSCAR_MERCADERIA_IN);
  //#endregion DEFINICION CTX_BUSCAR_MERCADERIA_IN - para eDITAR - para sELECCIONAR

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'new_in_almacen':
      ctx = useContext(CTX_NEW_IN_ALMACEN);
      break;
    // case 'new_venta':
    //   ctx = useContext(CTX_ADD_VENTA);
    //   break;
    // case 'cotizacion':
    //   ctx = useContext(CTX_DOCS_COTIZACION);
    //   break;
    // case 'new_edit_cotizacion':
    //   ctx = useContext(CTX_NEW_EDIT_COTIZACION);
    //   break;
  }
  //#endregion CONTEXTOS

  const buscarMercaderiasIN = useSignal(0);
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idAlmacen: parametrosGlobales.idAlmacen,
    buscarPor: 'Descripción', //por.value,
    cadenaABuscar: '', // 'acce 5', //cadena.value,
  });

  //#region BUSCAR MERCADERIAS IN
  const localizarMercaderiasIN = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪');
      document.getElementById('in_codigoDescripcion_BUSCAR_MERCADERIA_IN')?.focus();
      return;
    }
    buscarMercaderiasIN.value++;
  });
  //#endregion BUSCAR MERCADERIAS IN

  //#region REFRESCAR TABLA MERCADERIAS IN
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_mercaderiaIN;
    });
    if (definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_mercaderiaIN) {
      buscarMercaderiasIN.value++;
      definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_mercaderiaIN = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS IN

  //#region ADICIONAR MERCADERIA IN
  const adicionarMercaderiasIN = $(() => {
    definicion_CTX_BUSCAR_MERCADERIA_IN.mM = [];
    definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelNewEditMercaderiaIN = true;
  });
  //#endregion ADICIONAR MERCADERIA IN

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 800px)',
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
            ctx.mostrarPanelBuscarMercaderiaIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Buscar mercaderías / IN</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <label style={{ marginRight: '10px' }}></label>
            <div class="form-control form-agrupado">
              <input
                id="in_codigoDescripcion_BUSCAR_MERCADERIA_IN"
                autoFocus
                style={{ width: '100%' }}
                type="text"
                placeholder="Ingrese la mercadería a buscar"
                value={parametrosBusqueda.cadenaABuscar}
                onInput$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    localizarMercaderiasIN();
                  }
                }}
              />
              <ImgButton
                src={images.searchPLUS}
                alt="Icono de buscar de mercadería"
                height={16}
                width={16}
                title="Buscar datos de mercadería"
                onClick={$(() => {
                  localizarMercaderiasIN();
                })}
              />
              <ImgButton
                src={images.add}
                alt="Icono de add mercadería"
                height={16}
                width={16}
                title="Registar nueva mercadería"
                onClick={$(() => {
                  adicionarMercaderiasIN();
                })}
              />
            </div>
          </div>
        </div>
        {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
        <div class="form-control">
          {buscarMercaderiasIN.value > 0 ? (
            <TablaMercaderiasIN
              buscarMercaderiasIN={buscarMercaderiasIN.value}
              parametrosBusqueda={parametrosBusqueda}
              contexto={props.contexto}
              esAlmacen={props.esAlmacen}
              //   buscarMercaderiaOUT={buscarMercaderiaOUT.value}
              //   parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelMercaderiaINSeleccionada && (
            <div class="modal">
              <MercaderiaINSeleccionada
                mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM}
                elKardex={definicion_CTX_BUSCAR_MERCADERIA_IN.kK}
                esAlmacen={true}
                contexto={'buscar_mercaderia_in'}
                contextoParaDocumento={props.contexto}
                igv={props.igv}
              />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelKardexsIN && (
            <div class="modal">
              <KardexsIN
                mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM}
                esAlmacen={props.esAlmacen}
                contexto={props.contexto}
                igv={props.igv}
              />
            </div>
          )}
          {/*  ADICIONAR MERCADERIA IN  */}
          {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelNewEditMercaderiaIN && (
            <div class="modal">
              <NewEditMercaderiaIN mercaSeleccio={definicion_CTX_BUSCAR_MERCADERIA_IN.mM} contexto={props.contexto} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
