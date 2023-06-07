import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import TablaMercaderiasLocalizadasOUT from './tablaMercaderiasLocalizadasOUT';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import SeleccionarEquivalenciaEnSalida from './seleccionarEquivalenciaEnSalida';
import { IItemVenta } from '../venta/addVenta'; //CTX_ADD_VENTA,
import { elIdAuxiliar } from '~/functions/comunes';

export const CTX_MERCA_SELECCIONADA = createContextId<IMercaSeleccionada>('mercaSeleccionada');

export interface IMercaSeleccionada {
  mS: any;
  // idAuxiliuar: number;
  // codigo: string;
  // descripcionEquivalencia: string;
  // unidadEquivalencia: string;

  // _id: string;
  // descripcion: string;
  // lineaTipo: string;

  // totalCantidadSaldo: any;
  // costoUnitarioMovil: any;
  // precio: any;
  // unidad: string;
}

export default component$((props: { ancho: number; parametrosGlobales: any; item1: IItemVenta }) => {
  //#region DEFINICON CTX_MERCA_SELECCIONADA
  const mercaSelec = useStore<IMercaSeleccionada>({
    mS: [],
    // idAuxiliuar: 0,
    // codigo: '',
    // descripcionEquivalencia: '',
    // unidadEquivalencia: '',

    // _id: '',
    // descripcion: '',
    // lineaTipo: '',

    // totalCantidadSaldo: 0,
    // costoUnitarioMovil: 0,
    // precio: 0,
    // unidad: '',
  });
  useContextProvider(CTX_MERCA_SELECCIONADA, mercaSelec);
  //#endregion DEFINICON CTX_MERCA_SELECCIONADA

  //#region CONTEXTOS
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
  // const ctx_Add_Venta = useContext(CTX_ADD_VENTA);
  // const ctx_Merca_Seleccionada = useContext(CTX_MERCA_SELECCIONADA);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarMercaderias = useSignal(0);
  const itemSeleccionado = useSignal([]);
  const cadena = useStore({ aBuscar: 'a' });
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: props.parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: props.parametrosGlobales.idEmpresa,
    idAlmacen: props.parametrosGlobales.idAlmacen,
    cadenaABuscar: cadena.aBuscar,
  });
  useTask$(({ track }) => {
    const cad = track(() => cadena.aBuscar);
    parametrosBusqueda.cadenaABuscar = cad;
    console.log('parametrosBusqueda.cadenaABuscar', parametrosBusqueda.cadenaABuscar);
    document.getElementById('codigoDescripcion')?.focus();
  });
  //#endregion INICIALIZACION

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
            ctx_docs_venta.mostrarVerAlmacen = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver clg"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('mercaSelec', mercaSelec);
            console.log('mercaSelec.mS', mercaSelec.mS);
          })}
        />
      </div>
      {/* TITULO */}
      <h4>Items - Mercaderías / OUT</h4>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px', fontSize: 'small', fontWeight: 'lighter' }}>
          {/* Buscar por */}
          <div style={{ display: 'flex' }}>
            <label style={{ marginRight: '10px' }}>Buscar </label>
            <input
              id="codigoDescripcion"
              style={{ width: '157px' }}
              type="text"
              placeholder="Descripción"
              value={parametrosBusqueda.cadenaABuscar}
              onInput$={(e) => {
                cadena.aBuscar = (e.target as HTMLInputElement).value;
              }}
            />
            <ImgButton
              src={images.searchPLUS}
              alt="Icono de buscar de mercadería"
              height={16}
              width={16}
              title="Buscar datos de mercadería"
              onClick={$(async () => {
                if (cadena.aBuscar === '') {
                  alert('Ingrese un valor para la busqueda');
                  document.getElementById('codigoDescripcion')?.focus();
                  return;
                }
                console.log('click en lupa: parameBusqueda ', parametrosBusqueda);

                buscarMercaderias.value++;
              })}
            />
            <button
              onClick$={() => {
                // venta.itemsVenta.push(elTarget);
                props.item1.idAuxiliar = parseInt(elIdAuxiliar());
                props.item1.descripcionEquivalencia = 'ale ale ale';
                props.item1.unidadEquivalencia = 'uniale';
                props.item1.codigo = 'ale ';
                ctx_docs_venta.grabo_ItemsVenta = true;
                // console.log('🛴🛴🛴🛴 venta.itemsVenta', venta.itemsVenta);
              }}
            >
              Add items
            </button>
          </div>
        </div>
        {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
        <div class="form-control">
          {buscarMercaderias.value > 0 ? (
            <TablaMercaderiasLocalizadasOUT
              buscarMercaderias={buscarMercaderias.value}
              parametrosBusqueda={parametrosBusqueda}
              esAlmacen={false}
              seleccionado={itemSeleccionado.value}
            />
          ) : (
            ''
          )}
          {/* {itemsMercaderiasLocalizados.length > 0 ? (
            <TablaItemsMercaderiasLocalizadosOUT
              registros={itemsMercaderiasLocalizados}
              selecItemMercaderia={botonSeleccionarItemMercaderiaOUT}
              asignarPrecioItemMercaderia={botonAsignarPrecioItemMercaderiaOUT}
              esAlmacen={esAlmacen}
            />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen ítems localizados</i>
          )} */}
          {ctx_docs_venta.mostrarSeleccionarEquivalenciaEnSalida && (
            <div class="modal">
              <SeleccionarEquivalenciaEnSalida
                ancho={400}
                itemSeleccionado={mercaSelec.mS}
                esAlmacen={false}
                item2={props.item1}
              />
            </div>
          )}
          {/* {showPanelAddEquivalenciaASalida && (
            <Modal
              componente={
                <AddEquivalenciaASalida
                  Salida
                  ancho={'400px'}
                  parametrosGlobales={parametrosGlobales}
                  esAlmacen={esAlmacen}
                  itemSeleccionado={itemSeleccionado}
                  addItemVenta={onAddItemVenta}
                  onCerrar={() => {
                    setShowPanelAddEquivalenciaASalida(false);
                  }}
                />
              }
            />
          )}
          {showPanelAsignarPrecio && (
            <Modal
              componente={
                <AsignarPrecio
                  ancho={'300px'}
                  parametrosGlobales={parametrosGlobales}
                  itemSeleccionado={itemSeleccionado}
                  onCerrar={() => {
                    setShowPanelAsignarPrecio(false);
                  }}
                />
              }
            ></Modal>
          )} */}
        </div>
      </div>
    </div>
  );
});
