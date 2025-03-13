import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_BUSCAR_MERCADERIA_IN } from '../mercaderiaIN/buscarMercaderiaIN';
import TablaMercaderiasInventarioExterno from './tablaMercaderiasInventarioExterno';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import { CTX_BUSCAR_MERCADERIA_OUT } from '../mercaderiaOUT/buscarMercaderiaOUT';

export const CTX_INVENTARIO_EXTERNO = createContextId<any>('ctx_inventario_externo__');

export default component$((props: { contexto: string; almacen: any; buscar: string }) => {
  //#region DEFINICON CTX_INVENTARIO_EXTERNO
  const definicion_CTX_INVENTARIO_EXTERNO = useStore({
    mostrarSpinner: false,
  });
  useContextProvider(CTX_INVENTARIO_EXTERNO, definicion_CTX_INVENTARIO_EXTERNO);
  //#endregion DEFINICON CTX_INVENTARIO_EXTERNO

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'buscar_mercaderia_in':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
      break;
    case 'index_inventario':
      ctx = useContext(CTX_INDEX_INVENTARIO);
      break;
    case 'buscar_mercaderia_out':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_OUT);
      break;
    // case 'new_edit_cotizacion':
    //   ctx = useContext(CTX_NEW_EDIT_COTIZACION);
    //   break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: props.almacen.idGrupoEmpresarial,
    idEmpresa: props.almacen.idEmpresa,
    idAlmacen: props.almacen.idAlmacen,
    buscarPor: 'Descripción', //por.value,
    cadenaABuscar: '', // 'acce 5', //cadena.value,
  });
  const laCadenaABuscar = useSignal(props.buscar);
  const ini = useSignal(0);

  const verAplicacion = useSignal(false);
  const verLineaMarca = useSignal(false);
  const verTODOS = useSignal(true);
  const buscarMercaderiasINVENTARIOEXTERNO = useSignal(0);

  useTask$(({ track }) => {
    track(() => ini.value);

    if (ini.value === 0) {
      if (laCadenaABuscar.value.trim() !== '') {
        //buscar
        parametrosBusqueda.cadenaABuscar = laCadenaABuscar.value.trim();
        buscarMercaderiasINVENTARIOEXTERNO.value++;
      }

      ini.value++;
    }
  });
  //#endregion INICIALIZACION

  //#region BUSCAR MERCADERIAS IN
  const localizarMercaderiasINVENTARIOEXTERNO = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪');
      document.getElementById('in_codigoDescripcion_BUSCAR_MERCADERIA_IN')?.focus();
      return;
    }

    buscarMercaderiasINVENTARIOEXTERNO.value++;
    // definicion_CTX_INVENTARIO_EXTERNO.mostrarSpinner = true;
  });
  //#endregion BUSCAR MERCADERIAS IN

  return (
    <div
      style={
        verLineaMarca.value || verAplicacion.value
          ? {
              width: 'clamp(320px, 100%, 1112px)',
              background: 'linear-gradient(to right,#f1bffc 0%,#cababa 100%)',
              border: '1px solid red',
              padding: '2px',
            }
          : {
              width: 'clamp(320px, 100%, 960px)',
              background: 'linear-gradient(to right,#f1bffc 0%,#cababa 100%)',
              border: '1px solid red',
              padding: '2px',
            }
      }
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {/* <ImgButton
          title="Ver el parametrosGlobales"
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            console.log(parametrosGlobales);
          })}
        /> */}
        <ImgButton
          title="Cerrar el formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            ctx.mostrarPanelInventarioExterno = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'red' }}>{props.almacen.sucursal}</h3>
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Buscar mercaderías</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          {/* Buscar por: input - lupa - mas - flecha up right */}
          <div class="form-control">
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
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    localizarMercaderiasINVENTARIOEXTERNO();
                  }
                }}
              />
              <input
                title="Buscar datos de mercadería"
                type="image"
                src={images.searchPLUS}
                alt="icono buscar"
                height={16}
                width={16}
                style={{ margin: '0 4px' }}
                onClick$={() => {
                  localizarMercaderiasINVENTARIOEXTERNO();
                }}
              />

              {/* {parametrosGlobales.verOtrosAlmacenes && (
                <input
                  title="Ver otros almacenes"
                  type="image"
                  src={images.arrowUpRight}
                  alt="icono ir a ..."
                  height={16}
                  width={16}
                  onClick$={async () => {
                    const losAlmacenes = await verOtrosAlmacenes({
                      usuario: parametrosGlobales.usuario,
                      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                      idSucursal: parametrosGlobales.idSucursal,
                    });
                    console.log('losAlmacenes.data', losAlmacenes.data.length, losAlmacenes.data);
                    if (losAlmacenes.data.length === 0) {
                      alert('No existe otros almacenes.');
                      return;
                    }
                    if (losAlmacenes.data.length === 1) {
                      //ir directo al panel de busqueda
                    } else {
                      //ir al panel de listado de almacenes disponibles
                    }
                  }}
                />
              )} */}
            </div>
          </div>
          {/* Buscar por: Aplicacion */}
          <div style={{ marginTop: '8px', display: 'flex' }}>
            {/* <div style={{ margin: '0 auto' }}> */}
            <div>
              <input
                id="in_Aplicacion_BUSCAR_MERCADERIA_IN"
                type="checkbox"
                placeholder="Buscar por aplicación"
                onChange$={(e) => {
                  if ((e.target as HTMLInputElement).checked) {
                    parametrosBusqueda.buscarPor = 'Aplicación';
                  } else {
                    parametrosBusqueda.buscarPor = 'Descripción';
                  }
                }}
              />
              <label for="in_Aplicacion_BUSCAR_MERCADERIA_IN" style={{ marginRight: '16px' }}>
                Aplicación
              </label>
            </div>
            <div>
              <input
                id="in_verAplicacion_BUSCAR_MERCADERIA_IN"
                type="checkbox"
                placeholder="Buscar por aplicación"
                checked={verAplicacion.value}
                onChange$={(e) => {
                  verAplicacion.value = (e.target as HTMLInputElement).checked;
                }}
              />
              <label for="in_verAplicacion_BUSCAR_MERCADERIA_IN" style={{ marginRight: '16px' }}>
                Ver Aplicacion
              </label>
            </div>
            <div>
              <input
                id="in_verLineaMarca_BUSCAR_MERCADERIA_IN"
                type="checkbox"
                placeholder="Buscar por aplicación"
                checked={verLineaMarca.value}
                onChange$={(e) => {
                  verLineaMarca.value = (e.target as HTMLInputElement).checked;
                }}
              />
              <label for="in_verLineaMarca_BUSCAR_MERCADERIA_IN" style={{ marginRight: '16px' }}>
                Ver Linea / Marca
              </label>
            </div>
            <div>
              <input
                id="in_verTODOS_BUSCAR_MERCADERIA_IN"
                type="checkbox"
                placeholder="Ver TODOS"
                checked={verTODOS.value}
                onChange$={(e) => {
                  verTODOS.value = (e.target as HTMLInputElement).checked;
                  document.getElementById('in_codigoDescripcion_BUSCAR_MERCADERIA_IN')?.focus();
                }}
              />
              <label for="in_verTODOS_BUSCAR_MERCADERIA_IN">Ver TODOS</label>
            </div>
          </div>
          {/* Leyenda */}
          <div style={{ marginTop: '8px', display: 'flex' }}>
            <label style={{ marginRight: '8px' }}>Leyenda:</label>
            <label style={{ background: '#272727', color: 'white', marginRight: '8px', padding: '0 4px', borderRadius: '4px' }}>Inactivo</label>
            <label style={{ background: '#ff5aff', padding: '0 4px', borderRadius: '4px' }}>No facturable</label>
          </div>
        </div>
        {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
        <div class="form-control">
          {buscarMercaderiasINVENTARIOEXTERNO.value > 0 ? (
            <TablaMercaderiasInventarioExterno
              buscarMercaderiasINVENTARIOEXTERNO={buscarMercaderiasINVENTARIOEXTERNO.value}
              parametrosBusqueda={parametrosBusqueda}
              //   contextoInmediato={'buscar_mercaderia_in'}
              //   esAlmacen={props.esAlmacen}
              //   enDolares={props.enDolares}
              //   tipoCambio={props.tipoCambio}
              //   verAplicacion={verAplicacion.value}
              //   verLineaMarca={verLineaMarca.value}
              verTODOS={verTODOS.value}
              //   motivo={props.motivo}
            />
          ) : (
            ''
          )}

          {/* MOSTRAR SPINNER */}
          {/* {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarSpinner && (
            <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
});
