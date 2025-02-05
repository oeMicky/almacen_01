import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { images } from '~/assets';
import Kardex from '~/components/kardex/kardex';
import Kardexs from '~/components/kardex/kardexs';
import TablaMercaderiasKardex from '~/components/kardex/tablaMercaderiasKardex';
import NewEditMercaderiaIN from '~/components/miscelanea/mercaderiaIN/newEditMercaderiaIN';
// import ImgButton from '~/components/system/imgButton';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_KARDEX = createContextId<any>('ctx_index_kardex__');

export default component$(() => {
  //#region CTX_INDEX_KARDEX
  const definicion_CTX_INDEX_KARDEX = useStore({
    mM: [],
    kK: [],
    mostrarPanelKARDEXS: false,
    mostrarPanelKARDEX: false,
    // grabo_OS: false,
    mostrarPanelNewEditMercaderiaIN: false,
    grabo_mercaderiaIN: false,

    // mostrarPanelNewEditMercaderiaIN: false,
    mostrarPanelVerInAlmacen: false,
    mostrarPanelVerOutAlmacen: false,
  });
  useContextProvider(CTX_INDEX_KARDEX, definicion_CTX_INDEX_KARDEX);
  //#endregion CTX_INDEX_KARDEX

  //#region INICIALIZANDO
  const navegarA = useNavigate();
  const buscarMercaderiasKARDEX = useSignal(0);
  // const mercaderiaIN = useSignal(false);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idAlmacen: parametrosGlobales.idAlmacen,
    buscarPor: 'Descripción', //por.value,
    cadenaABuscar: '', //cadena.value,
  });
  //#endregion INICIALIZANDO

  //#region BUSCAR MERCADERIAS IN
  const localizarMercaderiasKARDEX = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪');
      //document.getElementById('inputBusquedaServicio_MICE')?.focus();
      return;
    }
    buscarMercaderiasKARDEX.value++;
  });
  //#endregion BUSCAR MERCADERIAS IN

  //#region REFRESCAR TABLA MERCADERIAS IN
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_INDEX_KARDEX.grabo_mercaderiaIN;
    });
    if (definicion_CTX_INDEX_KARDEX.grabo_mercaderiaIN) {
      buscarMercaderiasKARDEX.value++;
      definicion_CTX_INDEX_KARDEX.grabo_mercaderiaIN = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS IN

  return (
    <div class="container">
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
        {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}  '#00778F'
      </h1> */}
      <div style={{ background: '#00778F' }}>
        {/* <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}> */}
        <label style={{ color: '#00ffff', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {/* {` ${sessionStorage.getItem('numeroIdentidad')} - ${sessionStorage
            .getItem('empresa')
            ?.toLocaleUpperCase()} - Sucursal: ${sessionStorage.getItem('sucursal')} - Usuario: ${sessionStorage.getItem(
            'usuario'
          )}`} */}
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>Kardex</u>
      </h4>

      {/* BUSCAR POR */}
      <div style={{ display: 'flex', margin: '10px 0' }}>
        <label style={{ marginRight: '10px' }}>Buscar </label>
        <input
          id="in_CodigoDescripcion_KARDEX"
          // style={{ width: '157px', marginLeft: '4px', marginRight: '4px' }}
          style={{ width: 'clamp(157px, 90%, 375px)', marginLeft: '4px', marginRight: '4px' }}
          type="text"
          placeholder="Descripción"
          value={parametrosBusqueda.cadenaABuscar}
          onInput$={(e) => {
            parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
          }}
          onFocusin$={(e) => {
            (e.target as HTMLInputElement).select();
          }}
          onKeyPress$={(e) => {
            if (e.key === 'Enter') {
              localizarMercaderiasKARDEX();
            }
          }}
        />
        <input
          type="image"
          src={images.searchPLUS}
          alt="Icono de buscar de mercadería"
          height={21.5}
          width={21.5}
          title="Buscar datos de mercadería"
          onClick$={() => {
            if (parametrosGlobales.idGrupoEmpresarial === '') {
              // console.log('estaVACIA');
              alert('Faltan datos... vuelva a logearse..');
              navegarA('/login');
              return;
            }
            localizarMercaderiasKARDEX();
          }}
        />
        <button
          style={{ cursor: 'pointer', marginLeft: '4px' }}
          onClick$={() => {
            definicion_CTX_INDEX_KARDEX.mM = [];
            definicion_CTX_INDEX_KARDEX.mostrarPanelNewEditMercaderiaIN = true;
          }}
        >
          ADD MERCADERÍA
        </button>
        <br />
        <div style={{ margin: '0 5px' }}></div>
      </div>
      <div>
        <label style={{ marginRight: '4px' }}>Leyenda:</label>
        <label style={{ background: 'black', color: 'white', marginRight: '4px', padding: '0 4px', borderRadius: '4px' }}>Inactivo</label>
        <label style={{ background: '#ff5aff', padding: '0 4px', borderRadius: '4px' }}>No facturable</label>
      </div>
      {definicion_CTX_INDEX_KARDEX.mostrarPanelNewEditMercaderiaIN && (
        <div class="modal">
          <NewEditMercaderiaIN mercaSeleccio={definicion_CTX_INDEX_KARDEX.mM} contexto={'index_kardexs'} />
        </div>
      )}
      {/*  tabla  MERCADERIAS LOCALIZADOS */}
      <div class="form-control" style={{ margin: '10px 0' }}>
        {buscarMercaderiasKARDEX.value > 0 ? (
          <TablaMercaderiasKardex
            buscarMercaderiasKARDEX={buscarMercaderiasKARDEX.value}
            parametrosBusqueda={parametrosBusqueda}
            // contexto={props.contexto}
            esAlmacen={true}
            //   buscarMercaderiaOUT={buscarMercaderiaOUT.value}
            //   parametrosBusqueda={parametrosBusqueda}
          />
        ) : (
          ''
        )}
        {definicion_CTX_INDEX_KARDEX.mostrarPanelKARDEXS && (
          <div class="modal">
            <Kardexs
              mercaINSelecci={definicion_CTX_INDEX_KARDEX.mM}
              esAlmacen={true}
              // contexto={props.contexto}
              // igv={props.igv}
            />
          </div>
        )}
        {definicion_CTX_INDEX_KARDEX.mostrarPanelKARDEX && (
          <div class="modal">
            <Kardex
              mercaSelecci={definicion_CTX_INDEX_KARDEX.mM}
              kardex={definicion_CTX_INDEX_KARDEX.kK}
              // esAlmacen={props.esAlmacen}
              // esAlmacen={false}
              contexto={'index_kardexs'}
              // contextoParaDocumento={props.contexto}
              // igv={props.igv}
            />
          </div>
        )}
        {definicion_CTX_INDEX_KARDEX.mostrarPanelNewEditMercaderiaIN && (
          <div class="modal">
            <NewEditMercaderiaIN
              mercaSeleccio={definicion_CTX_INDEX_KARDEX.mM}
              contexto="index_kardexs"
              //esAlmacen={true}
              // contexto={props.contexto}
              // igv={props.igv}
            />
          </div>
        )}
      </div>
    </div>
  );
});
