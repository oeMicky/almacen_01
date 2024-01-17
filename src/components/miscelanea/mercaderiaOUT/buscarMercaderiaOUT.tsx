import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_EDIT_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
import ImgButton from '~/components/system/imgButton';
import { parametrosGlobales } from '~/routes/login';
import TablaMercaderiasOUT from './tablaMercaderiasOUT';
import MercaderiaOUTSeleccionada from './mercaderiaOUTSeleccionada';
import AsignarPrecioOUT from './asignarPrecioOUT';
import { CTX_ADD_VENTA } from '~/components/venta/addVenta';
import { CTX_NEW_EDIT_ORDEN_SERVICIO } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import KardexsOUT from './kardexsOUT';

export const CTX_BUSCAR_MERCADERIA_OUT = createContextId<any>('buscar_mercaderia_out__');

export default component$((props: { contexto: string; esAlmacen: boolean }) => {
  //#region DEFINICION CTX_BUSCAR_MERCADERIA_OUT - para eDITAR - para BUSCAR
  const definicion_CTX_BUSCAR_MERCADERIA_OUT = useStore({
    mM: [],
    kK: [],

    mostrarPanelKardexsOUT: false,

    mostrarPanelMercaderiaOUTSeleccionada: false,
    mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS: false,

    mostrarPanelAsignarPrecioOUT: false,
    grabo_PrecioOUT: false,
  });
  useContextProvider(CTX_BUSCAR_MERCADERIA_OUT, definicion_CTX_BUSCAR_MERCADERIA_OUT);
  //#endregion DEFINICION CTX_BUSCAR_MERCADERIA_OUT - para eDITAR - para BUSCAR

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'orden servicio':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      break;
    case 'new_venta':
      ctx = useContext(CTX_ADD_VENTA);
      break;
    // case 'cotizacion':
    //   ctx = useContext(CTX_DOCS_COTIZACION);
    //   break;
    case 'new_edit_cotizacion':
      ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      break;
    case 'new_out_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      break;
  }
  //#endregion CONTEXTOS

  const buscarMercaderiasOUT = useSignal(0);
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idAlmacen: parametrosGlobales.idAlmacen,
    buscarPor: 'Descripción', //por.value,
    cadenaABuscar: '', // 'acce 5', //cadena.value,
  });

  //#region BUSCAR MERCADERIAS OUT
  const localizarMercaderiasOUT = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪');
      //document.getElementById('inputBusquedaServicio_MICE')?.focus();
      return;
    }
    buscarMercaderiasOUT.value++;
  });
  //#endregion BUSCAR MERCADERIAS OUT

  //#region REFRESCAR TABLA MERCADERIAS OUT
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_PrecioOUT;
    });
    if (definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_PrecioOUT) {
      localizarMercaderiasOUT();
      definicion_CTX_BUSCAR_MERCADERIA_OUT.grabo_PrecioOUT = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS OUT

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(min(10vw, 20rem), 800px, max(90vw, 55rem))',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
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
            ctx.mostrarPanelBuscarMercaderiaOUT = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Buscar mercaderías / OUT</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <label style={{ marginRight: '10px' }}></label>
            <div class="form-control form-agrupado">
              <input
                id="codigoDescripcion_MICE"
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
                    localizarMercaderiasOUT();
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
                  localizarMercaderiasOUT();
                })}
              />
            </div>
          </div>
        </div>
        {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
        <div class="form-control">
          {buscarMercaderiasOUT.value > 0 ? (
            <TablaMercaderiasOUT
              buscarMercaderiasOUT={buscarMercaderiasOUT.value}
              parametrosBusqueda={parametrosBusqueda}
              contexto={props.contexto}
              esAlmacen={props.esAlmacen}
              //   buscarMercaderiaOUT={buscarMercaderiaOUT.value}
              //   parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelMercaderiaOUTSeleccionada && (
            <div class="modal">
              <MercaderiaOUTSeleccionada
                mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM}
                elKardex={definicion_CTX_BUSCAR_MERCADERIA_OUT.kK}
                esAlmacen={props.esAlmacen}
                // esAlmacen={false}
                contexto={'buscar_mercaderia_out'}
                contextoParaDocumento={props.contexto}
              />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelAsignarPrecioOUT && (
            <div class="modal">
              <AsignarPrecioOUT mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM} />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelKardexsOUT && (
            <div class="modal">
              <KardexsOUT
                mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM}
                esAlmacen={props.esAlmacen}
                contexto={props.contexto}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
