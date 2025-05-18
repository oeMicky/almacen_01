import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ImgButton from '~/components/system/imgButton';
import { parametrosGlobales } from '~/routes/login';
import TablaMercaderiasIN from './tablaMercaderiasIN';
import MercaderiaINSeleccionada from './mercaderiaINSeleccionada';
import NewEditMercaderiaIN from './newEditMercaderiaIN';
import KardexsIN from './kardexsIN';
import Spinner from '~/components/system/spinner';
import { CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import Kardexs from '~/components/inventario/kardexs';
import Kardex from '~/components/inventario/kardex';
import EditPrecioPublicoIN from './editPrecioPublicoIN';
// import NewEditUbigeo from './newEditUbigeo';
import { verOtrosAlmacenes } from '~/apis/usuario.api';
import InventarioExterno from '../inventarioExterno/inventarioExterno';
import ListaUbigeosStocksIN from './listaUbigeosStocksIN';
import VerUbigeoAntiguo from '~/components/inventario/verUbigeoAntiguo';
import ListaOtrosAlmacenes from '~/components/inventario/listaOtrosAlmacenes';
// import TrasladoEntreUbigeosIN from './trasladoEntreUbigeosIN';
// import MercaderiaINSelec from "./mercaderiaINSelec";

export const CTX_BUSCAR_MERCADERIA_IN = createContextId<any>('buscar_mercaderia_in');

export default component$(
  (props: {
    contexto: string;
    esAlmacen: boolean;
    enDolares: boolean;
    tipoCambio: any;
    igv: number;
    motivo?: string;
    conIGV?: boolean;
    porMontoUnitario?: boolean;
  }) => {
    //#region DEFINICION CTX_BUSCAR_MERCADERIA_IN - para eDITAR - para sELECCIONAR
    const definicion_CTX_BUSCAR_MERCADERIA_IN = useStore({
      idMercaderia: '',
      descripcion: '',
      cuMASigv: 0,
      pUtilidad: 0,
      precioUnitarioPEN: 0,

      mM: [],
      kK: [],
      uS: [],

      mostrarPanelListaUbigeosStocksIN: false,
      nuevoUbigeo: false,
      // mostrarPanelTrasladoEntreUbigeosIN: false,

      mostrarPanelNewEditUbigeo: false,
      elIdKardex: '',
      elUBIGEO: '',
      ubigeoAntiguo: '',
      grabo_ubigeo: false,

      mostrarPanelVerUbigeoAntiguo: false,

      mostrarPanelNewEditMercaderiaIN: false,
      abuscar: '',
      grabo_mercaderiaIN: false,

      mostrarPanelKardexsIN: false,

      mostrarPanelKARDEX: false,
      mostrarPanelKARDEXS: false,

      //para MERCADERIA NUEVA
      mostrarPanelMercaderiaINSeleccionada: false,
      //para MERCADERIA CON KARDEX
      mostrarPanelMercaderiaINSeleccionada_2: false,

      mostrarPanelEditPrecioPublicoIN: false,
      grabo_precio_publico: false,

      mostrarPanelInventarioExterno: false,
      mostrarPanelListaOtrosAlmacenes: false,
      otrosAlmacenes: [],
      almacenExterno: [],

      mostrarSpinner: false,
    });
    useContextProvider(CTX_BUSCAR_MERCADERIA_IN, definicion_CTX_BUSCAR_MERCADERIA_IN);
    //#endregion DEFINICION CTX_BUSCAR_MERCADERIA_IN - para eDITAR - para sELECCIONAR

    //#region CONTEXTOS
    let ctx: any = [];
    switch (props.contexto) {
      case 'new_in_almacen':
        ctx = useContext(CTX_NEW_IN_ALMACEN);
        break;
      case 'new_edit_guiaRemision':
        ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
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
    const ini = useSignal(0);
    const verAplicacion = useSignal(false);
    const verLineaMarca = useSignal(false);
    const verTODOS = useSignal(true);
    const buscarMercaderiasIN = useSignal(0);
    const parametrosBusqueda = useStore({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idAlmacen: parametrosGlobales.idAlmacen,
      buscarPor: 'Descripción', //por.value,
      cadenaABuscar: '', // 'geo', //'bien' 'acce 5', //cadena.value,
    });

    useTask$(({ track }) => {
      track(() => ini.value);

      if (ini.value === 0) {
        // (document.getElementById('IN_IN_codigoDescripcion_MICE') as HTMLInputElement)?.select();

        setTimeout(() => {
          document.getElementById('in_codigoDescripcion_BUSCAR_MERCADERIA_IN')?.focus();
        }, 100);
        ini.value++;
      }
    });
    //#endregion INICIALIZACION

    //#region BUSCAR MERCADERIAS IN
    const localizarMercaderiasIN = $(() => {
      if (parametrosBusqueda.cadenaABuscar === '') {
        alert('Ingrese un valor para su busqueda 🦪');
        document.getElementById('in_codigoDescripcion_BUSCAR_MERCADERIA_IN')?.focus();
        return;
      }

      buscarMercaderiasIN.value++;
      definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarSpinner = true;
    });
    //#endregion BUSCAR MERCADERIAS IN

    //#region REFRESCAR TABLA MERCADERIAS IN: grabo_mercaderiaIN
    useTask$(({ track }) => {
      track(() => {
        definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_mercaderiaIN;
      });
      if (definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_mercaderiaIN) {
        parametrosBusqueda.cadenaABuscar = definicion_CTX_BUSCAR_MERCADERIA_IN.abuscar;
        buscarMercaderiasIN.value++;
        definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_mercaderiaIN = false;
      }
    });
    //#endregion REFRESCAR TABLA MERCADERIAS IN: grabo_mercaderiaIN

    //#region ADICIONAR MERCADERIA IN
    const adicionarMercaderiasIN = $(() => {
      definicion_CTX_BUSCAR_MERCADERIA_IN.mM = [];
      definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelNewEditMercaderiaIN = true;
    });
    //#endregion ADICIONAR MERCADERIA IN

    //#region REFRESCAR TABLA MERCADERIAS IN : grabo_ubigeo
    useTask$(({ track }) => {
      track(() => {
        definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_ubigeo;
      });
      if (definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_ubigeo) {
        // parametrosBusqueda.cadenaABuscar = definicion_CTX_BUSCAR_MERCADERIA_IN.abuscar;
        definicion_CTX_BUSCAR_MERCADERIA_IN.elIdKardex = '';
        definicion_CTX_BUSCAR_MERCADERIA_IN.elUBIGEO = '';

        buscarMercaderiasIN.value++;
        definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_ubigeo = false;
      }
    });
    //#endregion REFRESCAR TABLA MERCADERIAS IN : grabo_ubigeo

    //#region REFRESCAR TABLA MERCADERIAS IN : grabo_precio_publico
    useTask$(({ track }) => {
      track(() => {
        definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_precio_publico;
      });
      if (definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_precio_publico) {
        // parametrosBusqueda.cadenaABuscar = definicion_CTX_BUSCAR_MERCADERIA_IN.abuscar;
        definicion_CTX_BUSCAR_MERCADERIA_IN.idMercaderia = '';
        definicion_CTX_BUSCAR_MERCADERIA_IN.descripcion = '';
        definicion_CTX_BUSCAR_MERCADERIA_IN.cuMASigv = 0;
        definicion_CTX_BUSCAR_MERCADERIA_IN.pUtilidad = 0;

        buscarMercaderiasIN.value++;
        definicion_CTX_BUSCAR_MERCADERIA_IN.grabo_precio_publico = false;
      }
    });
    //#endregion REFRESCAR TABLA MERCADERIAS IN : grabo_precio_publico

    return (
      <div
        style={
          verLineaMarca.value || verAplicacion.value
            ? {
                width: 'clamp(320px, 100%, 1112px)',
                // width: 'auto',
                border: '1px solid red',
                padding: '2px',
              }
            : {
                width: 'clamp(320px, 100%, 960px)',
                // width: 'auto',
                border: '1px solid red',
                padding: '2px',
              }
        }
        class="container-modal"
        onKeyUp$={(e) => {
          if (e.key === 'Escape') {
            alert('Escape presionado: modal _BUSCAR_MERCADERIA_IN');
            ctx.mostrarPanelBuscarMercaderiaIN = false;
            ctx.mM = null;
          }
        }}
      >
        {/* BOTONES DEL MARCO */}
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <ImgButton
            title="Ver el parametrosGlobales"
            src={images.see}
            alt="Icono de cerrar"
            height={18}
            width={18}
            onClick={$(() => {
              console.log('_______: ', document.activeElement);
            })}
            onKeyUp={$((e: any) => {
              if (e.key === 'Escape') {
                alert('Escape presionado: Ver el parametrosGlobales');
              }
            })}
          />
          <ImgButton
            title="Ver el parametrosGlobales"
            src={images.see}
            alt="Icono de cerrar"
            height={18}
            width={18}
            onClick={$(() => {
              console.log(parametrosGlobales);
            })}
            onKeyUp={$((e: any) => {
              if (e.key === 'Escape') {
                alert('Escape presionado: Ver el parametrosGlobales');
              }
            })}
          />
          <ImgButton
            title="Cerrar el formulario"
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            onClick={$(() => {
              ctx.mostrarPanelBuscarMercaderiaIN = false;
            })}
            onKeyUp={$((e: any) => {
              if (e.key === 'Escape') {
                alert('Escape presionado: Cerrar el formulario');
              }
            })}
          />
        </div>
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'red' }}>{parametrosGlobales.sucursal}</h3>
        <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Buscar mercaderías / IN</h3>
        {/* FORMULARIO */}
        <div
          class="add-form"
          onKeyUp$={(e) => {
            if (e.key === 'Escape') {
              alert('Escape presionado: FORMULARIO');
            }
          }}
        >
          {/* ENCABEZADO */}
          <div style={{ marginBottom: '8px' }}>
            {/* Buscar por: input - lupa - mas - flecha up right */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_codigoDescripcion_BUSCAR_MERCADERIA_IN"
                  autoFocus
                  style={{ width: '100%', fontWeight: 'bold' }}
                  type="text"
                  placeholder="Ingrese la mercadería a buscar"
                  value={parametrosBusqueda.cadenaABuscar}
                  onInput$={(e) => {
                    parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                  }}
                  // onFocusin$={(e) => {
                  //   (e.target as HTMLInputElement).select();
                  // }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      localizarMercaderiasIN();
                    }
                  }}
                  onKeyUp$={(e) => {
                    if (e.key === 'Escape') {
                      alert('Escape presionado: in_codigoDescripcion_BUSCAR_MERCADERIA_IN');
                      ctx.mostrarPanelBuscarMercaderiaIN = false;
                      ctx.mM = null;
                    }
                  }}
                  // onFocusin$={(e) => {
                  //   (e.target as HTMLInputElement).select();
                  //   // alert('ojo: onFocusin');
                  //   console.log('_______onFocusin: ', document.activeElement);
                  // }}
                  onFocus$={() => {
                    console.log('onFocus: in_codigoDescripcion_BUSCAR_MERCADERIA_IN ', document.activeElement);
                  }}

                  // onFocusout$={() => {
                />
                <input
                  title="Buscar datos de mercadería"
                  type="image"
                  src={images.searchPLUS}
                  alt="icono buscar"
                  height={20}
                  width={16}
                  style={{ margin: '0 4px' }}
                  onClick$={() => {
                    localizarMercaderiasIN();
                  }}
                />
                {parametrosGlobales.verOtrosAlmacenes && (
                  <input
                    title="Ver otros almacenes"
                    type="image"
                    src={images.arrowUpRight}
                    alt="icono ir a ..."
                    height={20}
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
                        definicion_CTX_BUSCAR_MERCADERIA_IN.almacenExterno = losAlmacenes.data[0];
                        definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelInventarioExterno = true;
                      } else {
                        //ir al panel de listado de almacenes disponibles
                        definicion_CTX_BUSCAR_MERCADERIA_IN.otrosAlmacenes = losAlmacenes.data;
                        definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelListaOtrosAlmacenes = true;
                      }
                    }}
                  />
                )}
                <input
                  title="Registar nueva mercadería"
                  type="image"
                  src={images.add}
                  alt="icono add"
                  height={20}
                  width={16}
                  style={{ margin: '0 4px' }}
                  onClick$={() => {
                    adicionarMercaderiasIN();
                  }}
                />
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
                  // checked={props.motiSelec.activo}

                  onChange$={(e) => {
                    if ((e.target as HTMLInputElement).checked) {
                      parametrosBusqueda.buscarPor = 'Aplicación';
                    } else {
                      parametrosBusqueda.buscarPor = 'Descripción';
                    }
                    verAplicacion.value = (e.target as HTMLInputElement).checked;
                  }}
                  // value={parametrosBusqueda.cadenaABuscar}
                  // onInput$={(e) => {
                  //   parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                  // }}
                  // onFocusin$={(e) => {
                  //   (e.target as HTMLInputElement).select();
                  // }}
                  // onKeyPress$={(e) => {
                  //   if (e.key === 'Enter') {
                  //     localizarMercaderiasOUT();
                  //   }
                  // }}
                />
                <label for="in_Aplicacion_BUSCAR_MERCADERIA_IN" style={{ marginRight: '16px' }}>
                  Aplicación
                </label>
              </div>
              <div style={{ display: 'none' }}>
                <input
                  id="in_verAplicacion_BUSCAR_MERCADERIA_IN"
                  type="checkbox"
                  placeholder="Buscar por aplicación"
                  checked={verAplicacion.value}
                  onChange$={(e) => {
                    verAplicacion.value = (e.target as HTMLInputElement).checked;
                  }}
                  // value={parametrosBusqueda.cadenaABuscar}
                  // onInput$={(e) => {
                  //   parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                  // }}
                  // onFocusin$={(e) => {
                  //   (e.target as HTMLInputElement).select();
                  // }}
                  // onKeyPress$={(e) => {
                  //   if (e.key === 'Enter') {
                  //     localizarMercaderiasOUT();
                  //   }
                  // }}
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
                  // value={parametrosBusqueda.cadenaABuscar}
                  // onInput$={(e) => {
                  //   parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                  // }}
                  // onFocusin$={(e) => {
                  //   (e.target as HTMLInputElement).select();
                  // }}
                  // onKeyPress$={(e) => {
                  //   if (e.key === 'Enter') {
                  //     localizarMercaderiasOUT();
                  //   }
                  // }}
                />
                <label for="in_verLineaMarca_BUSCAR_MERCADERIA_IN" style={{ marginRight: '16px' }}>
                  Ver Linea
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
                  // value={parametrosBusqueda.cadenaABuscar}
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
            {buscarMercaderiasIN.value > 0 ? (
              <TablaMercaderiasIN
                buscarMercaderiasIN={buscarMercaderiasIN.value}
                parametrosBusqueda={parametrosBusqueda}
                // contexto={props.contexto}
                contextoInmediato={'buscar_mercaderia_in'}
                esAlmacen={props.esAlmacen}
                enDolares={props.enDolares}
                tipoCambio={props.tipoCambio}
                verAplicacion={verAplicacion.value}
                verLineaMarca={verLineaMarca.value}
                verTODOS={verTODOS.value}
                motivo={props.motivo}
                //   buscarMercaderiaOUT={buscarMercaderiaOUT.value}
                //   parametrosBusqueda={parametrosBusqueda}
              />
            ) : (
              ''
            )}
            {/* MERCADERIA NUEVA */}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelMercaderiaINSeleccionada && (
              <div class="modal">
                <MercaderiaINSeleccionada
                  mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM}
                  elKardex={definicion_CTX_BUSCAR_MERCADERIA_IN.kK}
                  elIDKardex={''}
                  elUbigeoStock={[]}
                  esAlmacen={true}
                  enDolares={props.enDolares}
                  tipoCambio={props.tipoCambio}
                  contextoBase={'buscar_mercaderia_in'}
                  contextoInmediato={'buscar_mercaderia_in'}
                  contextoParaDocumento={props.contexto}
                  igv={props.igv}
                  motivo={props.motivo}
                  conIGV={props.conIGV}
                  porMontoUnitario={props.porMontoUnitario}
                />
              </div>
            )}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelKardexsIN && (
              <div class="modal">
                <KardexsIN mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM} esAlmacen={props.esAlmacen} contexto={props.contexto} igv={props.igv} />
              </div>
            )}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelKARDEXS && (
              <div class="modal">
                <Kardexs
                  mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM}
                  esAlmacen={true}
                  // contexto={props.contexto}
                  // igv={props.igv}
                />
              </div>
            )}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelKARDEX && (
              <div class="modal">
                <Kardex
                  mercaSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM}
                  kardex={definicion_CTX_BUSCAR_MERCADERIA_IN.kK}
                  elIDKardex={definicion_CTX_BUSCAR_MERCADERIA_IN.elIdKardex}
                  // esAlmacen={props.esAlmacen}
                  // esAlmacen={false}
                  contexto={'buscar_mercaderia_IN'}
                  // contextoParaDocumento={props.contexto}
                  // igv={props.igv}
                />
              </div>
            )}
            {/* {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelNewEditUbigeo && (
              <div class="modal">
                <NewEditUbigeo
                  idKardex={definicion_CTX_BUSCAR_MERCADERIA_IN.elIdKardex}
                  ubigeo={definicion_CTX_BUSCAR_MERCADERIA_IN.elUBIGEO}
                  contexto="buscar_mercaderia_in"
                />
              </div>
            )} */}
            {/*  ADICIONAR MERCADERIA IN  idMercaderia */}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelNewEditMercaderiaIN && (
              <div class="modal">
                <NewEditMercaderiaIN mercaSeleccio={definicion_CTX_BUSCAR_MERCADERIA_IN.mM} contexto={props.contexto} />
              </div>
            )}
            {/*  UBIGEO ANTIGUO  */}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelVerUbigeoAntiguo && (
              <div class="modal">
                <VerUbigeoAntiguo ubigeo={definicion_CTX_BUSCAR_MERCADERIA_IN.ubigeoAntiguo} contexto="buscar_mercaderia_in" />
              </div>
            )}
            {/*  LISTA DE UBIGEOS  */}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelListaUbigeosStocksIN && (
              <div class="modal">
                <ListaUbigeosStocksIN
                  descripcion={definicion_CTX_BUSCAR_MERCADERIA_IN.descripcion}
                  idKardex={definicion_CTX_BUSCAR_MERCADERIA_IN.elIdKardex}
                  esAlmacen={true}
                  enDolares={props.enDolares}
                  tipoCambio={props.tipoCambio}
                  contextoInmediato={'buscar_mercaderia_in'}
                  contextoParaDocumento={props.contexto}
                  igv={props.igv}
                  motivo={props.motivo}
                  conIGV={props.conIGV}
                  porMontoUnitario={props.porMontoUnitario}

                  // idMercaderia={definicion_CTX_BUSCAR_MERCADERIA_IN.idMercaderia}
                  // descripcion={definicion_CTX_BUSCAR_MERCADERIA_IN.descripcion}
                  // cuMASigv={definicion_CTX_BUSCAR_MERCADERIA_IN.cuMASigv}
                  // pUtilidad={definicion_CTX_BUSCAR_MERCADERIA_IN.pUtilidad}
                  // contexto="buscar_mercaderia_in"
                  // precioUnitarioPEN={definicion_CTX_BUSCAR_MERCADERIA_IN.precioUnitarioPEN}
                />
              </div>
            )}
            {/*  TRASLADO ENTRE UBIGEOS  */}
            {/* {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelTrasladoEntreUbigeosIN && (
              <div class="modal">
                <TrasladoEntreUbigeosIN
                  descripcion={definicion_CTX_BUSCAR_MERCADERIA_IN.descripcion}
                  idKardex={definicion_CTX_BUSCAR_MERCADERIA_IN.elIdKardex}
                />
              </div>
            )} */}
            {/*  EDITAR PRECIO PUBLICO IN  */}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelEditPrecioPublicoIN && (
              <div class="modal">
                <EditPrecioPublicoIN
                  idMercaderia={definicion_CTX_BUSCAR_MERCADERIA_IN.idMercaderia}
                  descripcion={definicion_CTX_BUSCAR_MERCADERIA_IN.descripcion}
                  cuMASigv={definicion_CTX_BUSCAR_MERCADERIA_IN.cuMASigv}
                  pUtilidad={definicion_CTX_BUSCAR_MERCADERIA_IN.pUtilidad}
                  contexto="buscar_mercaderia_in"
                  precioUnitarioPEN={definicion_CTX_BUSCAR_MERCADERIA_IN.precioUnitarioPEN}
                />
              </div>
            )}

            {/*  INVENTARIO EXTERNO  */}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelInventarioExterno && (
              <div class="modal">
                <InventarioExterno
                  almacen={definicion_CTX_BUSCAR_MERCADERIA_IN.almacenExterno}
                  buscar={parametrosBusqueda.cadenaABuscar}
                  // idMercaderia={definicion_CTX_BUSCAR_MERCADERIA_IN.idMercaderia}
                  // descripcion={definicion_CTX_BUSCAR_MERCADERIA_IN.descripcion}
                  // cuMASigv={definicion_CTX_BUSCAR_MERCADERIA_IN.cuMASigv}
                  // pUtilidad={definicion_CTX_BUSCAR_MERCADERIA_IN.pUtilidad}
                  contexto="buscar_mercaderia_in"
                />
              </div>
            )}
            {/*  LISTA OTROS ALMACENES */}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelListaOtrosAlmacenes && (
              <div class="modal">
                <ListaOtrosAlmacenes otrosAlmacenes={definicion_CTX_BUSCAR_MERCADERIA_IN.otrosAlmacenes} contexto={'buscar_mercaderia_in'} />
              </div>
            )}
            {/* MOSTRAR SPINNER */}
            {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarSpinner && (
              <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);
