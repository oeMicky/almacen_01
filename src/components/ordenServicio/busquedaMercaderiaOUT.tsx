import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import TablaMercaderiasLocalizadasOUT from './tablaMercaderiasLocalizadasOUT';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { parametrosGlobales } from '~/routes/login';
import AsignarPrecio from './asignarPrecio';
import { IMercaderiaOUT_Seleccionada } from '~/interfaces/iMercaderia';
import MercaderiaSeleccionadaOUT from './mercaderiaSeleccionadaOUT';

export const CTX_MERCADERIA_OUT = createContextId<IMercaderiaOUT_Seleccionada>('mercade');
export const CTX_BUSQUEDA_MERCADERIA_OUT = createContextId<any>('app.busquedaMercaderiaOUT');

export default component$((props: { esAlmacen: boolean }) => {
  //#region DEFINICION CTX_MERCADERIA_OUT - Insert / Edit
  const defini_CTX_MERCADERIA_OUT = useStore<IMercaderiaOUT_Seleccionada>({
    mM: [],
    // _id: '',
    // codigo: '',
    // conFechaVencimientoLote: false,
    // descripcion: '',
    // equivalencias: [],
    // // costoUnitarioMovil: any;
    // idLineaTipo: '',
    // idUnidad: '',
    // kardex: '',
    // kardexs: [],

    // lineaTipo: '',
    // totalCantidadSaldo: 0,
    // unidad: '',

    // costo: 0,

    // precio: 0,
  });
  useContextProvider(CTX_MERCADERIA_OUT, defini_CTX_MERCADERIA_OUT);
  //#endregion DEFINICION CTX_MERCADERIA_OUT - Insert / Edit

  //#region DEFINICON CTX_BUSQUEDA_MERCADERIA_OUT
  const definicion_CTX_BUSQUEDA_MERCADERIA_OUT = useStore({
    graboPrecio: false,
  });
  useContextProvider(CTX_BUSQUEDA_MERCADERIA_OUT, definicion_CTX_BUSQUEDA_MERCADERIA_OUT);
  //#endregion DEFINICON CTX_BUSQUEDA_MERCADERIA_OUT

  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarMercaderiaOUT = useSignal(0);
  const por = useSignal('Descripción');
  // const cadena = useStore({ aBuscar: 'a' }); //
  const cadena = useSignal('a');
  //#endregion INICIALIZACION

  //#region PARAMETROS DE BUSQUEDA
  const parametrosBusqueda = {
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idAlmacen: parametrosGlobales.idAlmacen,
    por: por.value,
    cadenaABuscar: cadena.value,
  };
  //#endregion PARAMETROS DE BUSQUEDA

  //#region ASIGNAR PRECIO
  useTask$(({ track }) => {
    console.log('ingrso a region ASIGNAR PRECIO');
    track(() => definicion_CTX_BUSQUEDA_MERCADERIA_OUT.graboPrecio);

    if (definicion_CTX_BUSQUEDA_MERCADERIA_OUT.graboPrecio) {
      console.log('ingrso buscarMercaderiaOUT.value++');
      buscarMercaderiaOUT.value++;
      definicion_CTX_BUSQUEDA_MERCADERIA_OUT.graboPrecio = false;
    }
  });
  //#endregion ASIGNAR PRECIO

  return (
    <div style={{ width: 'auto', border: '1px solid red', padding: '2px' }} class="container-modal">
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_docs_orden_servicio.mostrarPanelBusquedaMercaderiaOUT = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('esAlmacen', props.esAlmacen);
          })}
        />
      </div>
      {/* TITULO */}
      <h4>Items - Mercaderías / OUT</h4>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div style={{ display: 'flex' }}>
            <label style={{ marginRight: '10px' }}>Buscar </label>
            <input
              id="codigoDescripcion"
              style={{ width: '157px' }}
              type="text"
              placeholder="Descripción"
              value={cadena.value}
              onInput$={(e) => {
                cadena.value = (e.target as HTMLInputElement).value;
              }}
              onFocusin$={(e) => {
                (e.target as HTMLInputElement).select();
              }}
            />
            <ImgButton
              src={images.searchPLUS}
              alt="Icono de buscar de mercadería"
              height={16}
              width={16}
              title="Buscar datos de mercadería"
              onClick={$(async () => {
                if (cadena.value === '') {
                  alert('Ingrese un valor para la busqueda');
                  document.getElementById('codigoDescripcion')?.focus();
                  return;
                }
                console.log('click en lupa: parameBusqueda ', parametrosBusqueda);

                buscarMercaderiaOUT.value++;
              })}
            />
          </div>
        </div>
        {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
        <div class="form-control">
          {buscarMercaderiaOUT.value > 0 ? (
            <TablaMercaderiasLocalizadasOUT
              esAlmacen={props.esAlmacen}
              buscarMercaderiaOUT={buscarMercaderiaOUT.value}
              parametrosBusqueda={parametrosBusqueda}
              //   registros={itemsMercaderiasLocalizados}
              //   selecItemMercaderia={botonSeleccionarItemMercaderiaOUT}
              //   asignarPrecioItemMercaderia={botonAsignarPrecioItemMercaderiaOUT}
              //
            />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen ítems localizados</i>
          )}
          {ctx_docs_orden_servicio.mostrarPanelMercaderiaSeleccionadaOUT && (
            <div class="modal">
              {/* <AddEquivalenciaASalida */}
              <MercaderiaSeleccionadaOUT
                mercaderiaSeleccionadaOUT={defini_CTX_MERCADERIA_OUT.mM}
                esAlmacen={false}
                // Salida
                // ancho={'400px'}
                // parametrosGlobales={parametrosGlobales}
                // esAlmacen={esAlmacen}
                // itemSeleccionado={itemSeleccionado}
                // addItemVenta={onAddItemVenta}
                // onCerrar={() => {
                //   setShowPanelAddEquivalenciaASalida(false);
                // }}
              />
            </div>
          )}
          {ctx_docs_orden_servicio.mostrarPanelAsignarPrecio && (
            <div class="modal">
              <AsignarPrecio
                mercaderiaSeleccionada={defini_CTX_MERCADERIA_OUT.mM}
                // ancho={'300px'}
                // parametrosGlobales={parametrosGlobales}
                // itemSeleccionado={itemSeleccionado}
                // onCerrar={() => {
                //   setShowPanelAsignarPrecio(false);
                // }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
