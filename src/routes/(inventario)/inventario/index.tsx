import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { verOtrosAlmacenes } from '~/apis/usuario.api';
import { images } from '~/assets';
import Kardex from '~/components/inventario/kardex';
import Kardexs from '~/components/inventario/kardexs';
import ListaOtrosAlmacenes from '~/components/inventario/listaOtrosAlmacenes';
import TablaMercaderiasKardex from '~/components/inventario/tablaMercaderiasKardex';
import VerListaUbigeos from '~/components/inventario/verListaUbigeos';
import VerUbigeoAntiguo from '~/components/inventario/verUbigeoAntiguo';
import InventarioExterno from '~/components/miscelanea/inventarioExterno/inventarioExterno';
import EditPrecioPublicoIN from '~/components/miscelanea/mercaderiaIN/editPrecioPublicoIN';
// import ListaUbigeosStocksIN from '~/components/miscelanea/mercaderiaIN/listaUbigeosStocksIN';
import NewEditMercaderiaIN from '~/components/miscelanea/mercaderiaIN/newEditMercaderiaIN';
// import NewEditUbigeo from '~/components/miscelanea/mercaderiaIN/newEditUbigeo';
import Spinner from '~/components/system/spinner';
import { cerosALaIzquierda, hoy, redondeo6Decimales } from '~/functions/comunes';
// import ImgButton from '~/components/system/imgButton';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_INVENTARIO = createContextId<any>('ctx_index_inventario__');

export default component$(() => {
  //#region CTX_INDEX_INVENTARIO
  const definicion_CTX_INDEX_INVENTARIO = useStore({
    mM: [],
    kK: [],
    mostrarPanelKARDEXS: false,
    mostrarPanelKARDEX: false,
    // grabo_OS: false,
    mostrarPanelNewEditMercaderiaIN: false,
    grabo_mercaderiaIN: false,

    mostrarPanelNewEditUbigeo: false,
    elIdKardex: '',
    elUBIGEO: '',
    grabo_ubigeo: false,

    mostrarPanelVerUbigeoAntiguo: false,

    mostrarPanelVerListaUbigeos: false,

    // mostrarPanelNewEditMercaderiaIN: false,
    mostrarPanelVerInAlmacen: false,
    mostrarPanelVerOutAlmacen: false,

    idMercaderia: '',
    descripcion: '',
    cuMASigv: 0,
    pUtilidad: 0,
    precioUnitarioPEN: 0,
    mostrarPanelEditPrecioPublicoIN: false,
    grabo_precio_publico: false,

    mostrarPanelInventarioExterno: false,
    mostrarPanelListaOtrosAlmacenes: false,
    almacenExterno: [],
    otrosAlmacenes: [],

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_INVENTARIO, definicion_CTX_INDEX_INVENTARIO);
  //#endregion CTX_INDEX_INVENTARIO

  //#region INICIALIZANDO
  const ini = useSignal(0);
  const navegarA = useNavigate();
  const buscarMercaderiasKARDEX = useSignal(0);
  const verTODOS = useSignal(true);
  const visualizarStocksCeros = useSignal(true);
  // const mercaderiaIN = useSignal(false);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idAlmacen: parametrosGlobales.idAlmacen,
    buscarPor: 'Descripción', //por.value,
    cadenaABuscar: '', // 'geo', // bien //cadena.value,   'mobil bal'
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

  //#region INI
  useTask$(({ track }) => {
    track(() => ini.value);
    if (ini.value === 0) {
      try {
        if (document !== undefined) {
          setTimeout(() => {
            document.getElementById('in_CodigoDescripcion_KARDEX')?.focus(); //m
          }, 100);
        }

        // ini.value++;
      } catch (error) {
        console.log('error: ', error);
      }
    }
  });
  //#endregion INI

  //#region REFRESCAR TABLA MERCADERIAS IN
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_INDEX_INVENTARIO.grabo_mercaderiaIN;
    });
    if (definicion_CTX_INDEX_INVENTARIO.grabo_mercaderiaIN) {
      buscarMercaderiasKARDEX.value++;
      definicion_CTX_INDEX_INVENTARIO.grabo_mercaderiaIN = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS IN

  //#region REFRESCAR TABLA MERCADERIAS IN : grabo_ubigeo
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_INDEX_INVENTARIO.grabo_ubigeo;
    });
    if (definicion_CTX_INDEX_INVENTARIO.grabo_ubigeo) {
      // parametrosBusqueda.cadenaABuscar = definicion_CTX_BUSCAR_MERCADERIA_IN.abuscar;
      definicion_CTX_INDEX_INVENTARIO.elIdKardex = '';
      definicion_CTX_INDEX_INVENTARIO.elUBIGEO = '';

      buscarMercaderiasKARDEX.value++;
      definicion_CTX_INDEX_INVENTARIO.grabo_ubigeo = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS IN : grabo_ubigeo

  //#region REFRESCAR TABLA MERCADERIAS IN : grabo_precio_publico
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_INDEX_INVENTARIO.grabo_precio_publico;
    });
    if (definicion_CTX_INDEX_INVENTARIO.grabo_precio_publico) {
      // parametrosBusqueda.cadenaABuscar = definicion_CTX_BUSCAR_MERCADERIA_IN.abuscar;
      definicion_CTX_INDEX_INVENTARIO.idMercaderia = '';
      definicion_CTX_INDEX_INVENTARIO.descripcion = '';
      definicion_CTX_INDEX_INVENTARIO.cuMASigv = 0;
      definicion_CTX_INDEX_INVENTARIO.pUtilidad = 0;

      buscarMercaderiasKARDEX.value++;
      definicion_CTX_INDEX_INVENTARIO.grabo_precio_publico = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS IN : grabo_precio_publico

  //#region CREAR Y DOWNLOAD CSV
  const createAndDownloadFile = $((nameFile: string, texto: string) => {
    // const xmltext = '<sometag><someothertag></someothertag></sometag>';
    // const texto = 'hOLA A TODOS';

    const filename = nameFile; ///'file.xml';
    const pom = document.createElement('a');
    const bb = new Blob([texto], { type: 'text/plain' });

    pom.setAttribute('href', window.URL.createObjectURL(bb));
    // pom.setAttribute('download', filename);
    // pom.setAttribute('download', filename + '.txt');
    pom.setAttribute('download', filename + '.csv');

    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');

    pom.click();

    // const stupidExample = '<?xml version="1.0" encoding="utf-8"?><aTag>something</aTag>';
    // // document.open('data:Application/octet-stream,' + encodeURIComponent(stupidExample));
    // window.open('data:application/xml,' + encodeURIComponent(stupidExample), '_self');
    // console.log('first txt');
  });
  //#endregion CREAR Y DOWNLOAD CSV

  return (
    <div class="container">
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
        {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}  '#00778F'
      </h1> */}
      <div style={{ background: '#00778F' }}>
        {/* <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}> */}
        {/* <label style={{ color: '#890263', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}> */}
        <label style={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {/* {` ${sessionStorage.getItem('numeroIdentidad')} - ${sessionStorage
            .getItem('empresa')
            ?.toLocaleUpperCase()} - Sucursal: ${sessionStorage.getItem('sucursal')} - Usuario: ${sessionStorage.getItem(
            'usuario'
          )}`} */}
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>
          Inventario - <label style={{ color: 'red' }}>{parametrosGlobales.sucursal}</label>
        </u>
      </h4>
      {/* <br /> */}
      {/* BUSCAR POR  --- INVENTARIOR EXTERNO --- AGREGAR MERCADERIA */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', marginTop: '8px' }}>
          <label>Buscar </label>
          <input
            id="in_CodigoDescripcion_KARDEX"
            autoFocus={true}
            // style={{ width: '157px', marginLeft: '4px', marginRight: '4px' }}
            style={{ width: 'clamp(157px, 90%, 375px)', margin: '0 4px' }}
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
            title="Buscar datos de mercadería"
            type="image"
            src={images.searchPLUS}
            alt="Icono de buscar de mercadería"
            height={21.5}
            width={21.5}
            style={{ marginRight: '4px' }}
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
          {parametrosGlobales.verOtrosAlmacenes && (
            <input
              title="Ver otros almacenes"
              type="image"
              src={images.arrowUpRight}
              alt="icono ir a ..."
              height={21.5}
              width={21.5}
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
                  definicion_CTX_INDEX_INVENTARIO.almacenExterno = losAlmacenes.data[0];
                  definicion_CTX_INDEX_INVENTARIO.mostrarPanelInventarioExterno = true;
                } else {
                  //ir al panel de listado de almacenes disponibles
                  definicion_CTX_INDEX_INVENTARIO.otrosAlmacenes = losAlmacenes.data;
                  definicion_CTX_INDEX_INVENTARIO.mostrarPanelListaOtrosAlmacenes = true;
                }
              }}
            />
          )}
        </div>
        <button
          style={parametrosGlobales.almaceneroBajo ? { display: 'none' } : { cursor: 'pointer', marginLeft: '4px', marginTop: '8px' }}
          onClick$={() => {
            definicion_CTX_INDEX_INVENTARIO.mM = [];
            definicion_CTX_INDEX_INVENTARIO.mostrarPanelNewEditMercaderiaIN = true;
          }}
        >
          ADD MERCADERÍA
        </button>
        {/* <button onClick$={() => console.log(parametrosGlobales)}>paramt</button> */}
      </div>
      <br />
      {/* LEYENDA */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* LEYENDA */}
        {/* <div style={{ display: 'flex' }}> */}
        <div class="linea_1_11">
          <div>
            <label style={{ marginRight: '4px', marginTop: '8px' }}>Leyenda:</label>
            {/* <label style={{ background: 'black', color: 'white', marginRight: '4px', padding: '0 4px', borderRadius: '4px', marginTop: '8px' }}>Inactivo</label> */}
            <label style={{ background: 'black', color: 'white', marginRight: '4px', padding: '0 4px', borderRadius: '4px' }}>Inactivo</label>
            {/* <label style={{ background: '#ff5aff', padding: '0 4px', borderRadius: '4px', marginRight: '4px', marginTop: '8px' }}>No facturable</label> */}
            <label style={{ background: '#ff5aff', padding: '0 4px', borderRadius: '4px', marginRight: '4px' }}>No facturable</label>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ marginRight: '8px' }}>
              <input
                id="in_verTODOS_KARDEX"
                type="checkbox"
                placeholder="Ver TODOS"
                checked={verTODOS.value}
                onChange$={(e) => {
                  verTODOS.value = (e.target as HTMLInputElement).checked;
                  // document.getElementById('in_codigoDescripcion_KARDEX')?.focus();
                }}
                // value={parametrosBusqueda.cadenaABuscar}
              />
              <label for="in_verTODOS_KARDEX">Ver TODOS</label>
            </div>
            <div>
              <input
                id="in_visualizarStocksCeros_KARDEX"
                type="checkbox"
                placeholder="Visualizar stocks ceros"
                checked={visualizarStocksCeros.value}
                onChange$={(e) => {
                  visualizarStocksCeros.value = (e.target as HTMLInputElement).checked;
                  // document.getElementById('in_codigoDescripcion_KARDEX')?.focus();
                }}
                // value={parametrosBusqueda.cadenaABuscar}
              />
              <label for="in_visualizarStocksCeros_KARDEX">Visualizar stocks ceros</label>
            </div>
          </div>
        </div>
        {/* ACCIONES */}
        <div>
          <input
            title="Descargar datos del inventario"
            type="image"
            src={images.download}
            height={21.5}
            width={21.5}
            style={parametrosGlobales.almaceneroBajo ? { display: 'none' } : { marginRight: '8px' }}
            // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
            onClick$={() => {
              if (definicion_CTX_INDEX_INVENTARIO.kK.length === 0) {
                alert('No hay datos para descargar.');
                return;
              } else {
                // alert('Datos KARDEX.');
                console.log(definicion_CTX_INDEX_INVENTARIO.kK);
                definicion_CTX_INDEX_INVENTARIO.mostrarSpinner = true;
                //FECHA HORA LOCAL
                const elHoy = hoy();
                const fechaLocal = elHoy.substring(8, 10) + '/' + elHoy.substring(5, 7) + '/' + elHoy.substring(0, 4);
                const fechaLocal_2 = elHoy.substring(8, 10) + '-' + elHoy.substring(5, 7) + '-' + elHoy.substring(0, 4);

                const hhhhDate = new Date();
                const horaLocal =
                  cerosALaIzquierda(hhhhDate.getHours(), 2) +
                  ':' +
                  cerosALaIzquierda(hhhhDate.getMinutes(), 2) +
                  ':' +
                  cerosALaIzquierda(hhhhDate.getSeconds(), 2);
                const horaLocal_2 =
                  cerosALaIzquierda(hhhhDate.getHours(), 2) +
                  '-' +
                  cerosALaIzquierda(hhhhDate.getMinutes(), 2) +
                  '-' +
                  cerosALaIzquierda(hhhhDate.getSeconds(), 2);

                let aExportar = '';
                aExportar = 'INVENTARIO AL ' + fechaLocal + ' ' + horaLocal + '|\n';
                aExportar += '\n';
                aExportar += 'ITEM|DESCRIPCIÓN|LINEA|MARCA|aSTOCK|STOCK|UNI|UBI-CANT|COSTO PEN|PRECIO PEN|\n';
                definicion_CTX_INDEX_INVENTARIO.kK.map((com: any, index: number) => {
                  const { descripcion, lineaTipo, marca, STOCK, unidad, costoUnitarioPENMasIGV, precioUnitarioPEN, UBIS_STOCKS } = com;
                  const elIndex = index + 1;

                  let elSTOCK = '';
                  let elUBI_CANT = '';
                  if (UBIS_STOCKS.length === 0) {
                    elSTOCK = '-';
                    elUBI_CANT = '-';
                  } else {
                    let sumSTOCK = 0;
                    const cuantos = UBIS_STOCKS.length;
                    UBIS_STOCKS.map((kardex: any, index: number) => {
                      sumSTOCK = sumSTOCK + (kardex.stock ? parseFloat(kardex.stock.$numberDecimal ? kardex.stock.$numberDecimal : kardex.stock) : 0);
                      if (cuantos - 1 === index) {
                        elUBI_CANT =
                          elUBI_CANT +
                          (kardex.ubigeo ? kardex.ubigeo + ' (' + (kardex.stock.$numberDecimal ? kardex.stock.$numberDecimal : kardex.stock) + ')' : '-');
                        // if (kardex.ubigeo) {
                        //   elUBI_CANT = kardex.ubigeo + ' (' + (kardex.stock.$numberDecimal ? kardex.stock.$numberDecimal : kardex.stock) + ')';
                        // } else {
                        //   elUBI_CANT = '-';
                        // }
                      } else {
                        elUBI_CANT =
                          elUBI_CANT +
                          (kardex.ubigeo ? kardex.ubigeo + ' (' + (kardex.stock.$numberDecimal ? kardex.stock.$numberDecimal : kardex.stock) + ') - ' : '-');
                      }

                      console.log('index', index, 'kardex.stock', kardex.stock, 'kardex.ubigeo', kardex.ubigeo);
                    });
                    elSTOCK = sumSTOCK.toString();
                  }
                  console.log('com........');

                  aExportar =
                    aExportar +
                    elIndex +
                    '|' +
                    descripcion +
                    '|' +
                    lineaTipo +
                    '|' +
                    marca +
                    '|' +
                    (typeof STOCK !== 'undefined' && STOCK !== null
                      ? STOCK.$numberDecimal
                        ? redondeo6Decimales(STOCK.$numberDecimal)
                        : redondeo6Decimales(STOCK)
                      : '-') +
                    '|' +
                    elSTOCK +
                    '|' +
                    // (typeof ubigeo !== 'undefined' && ubigeo !== null ? ubigeo.toString() : '-') +
                    // '|' +
                    // (typeof totalCantidadSaldo !== 'undefined' && totalCantidadSaldo !== null
                    //   ? totalCantidadSaldo.$numberDecimal
                    //     ? totalCantidadSaldo.$numberDecimal
                    //     : totalCantidadSaldo
                    //   : '-') +
                    unidad +
                    '|' +
                    elUBI_CANT +
                    '|' +
                    (typeof costoUnitarioPENMasIGV !== 'undefined' && costoUnitarioPENMasIGV !== null
                      ? costoUnitarioPENMasIGV.$numberDecimal
                        ? redondeo6Decimales(costoUnitarioPENMasIGV.$numberDecimal)
                        : redondeo6Decimales(costoUnitarioPENMasIGV)
                      : '-') +
                    '|' +
                    (typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                      ? precioUnitarioPEN.$numberDecimal
                        ? redondeo6Decimales(precioUnitarioPEN.$numberDecimal)
                        : redondeo6Decimales(precioUnitarioPEN)
                      : '-') +
                    '|' +
                    // typeof KARDEXS !==
                    // 'undefined' && KARDEXS !== null
                    // ? 'Si'
                    // : 'No' +
                    '\n';
                });
                console.log('aExportar', aExportar);

                // // createAndDownloadFile('elPLE' + periodo.periodo, 'Hola a todos desde el PLE');
                createAndDownloadFile('Inventario_' + fechaLocal_2 + '_' + horaLocal_2, aExportar);

                definicion_CTX_INDEX_INVENTARIO.mostrarSpinner = false;
                alert('Archivo descargado.');
              }

              // if (mercaINLocali.KARDEXS.length === 1) {
              //   console.log('🍔🍟🍟🍟🍟 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);

              //   ctx_index_inventario.elIdKardex = mercaINLocali.KARDEXS[0]._id;
              //   ctx_index_inventario.elUBIGEO = ubigeo;
              //   ctx_index_inventario.mostrarPanelNewEditUbigeo = true;
              //   console.log('🍔🍔🍔🍔🍔 mercaINLocali.KARDEXS.length', ctx_index_inventario.elIdKardex, ctx_index_inventario.elUBIGEO);
              // }
            }}
          />
        </div>
      </div>

      {definicion_CTX_INDEX_INVENTARIO.mostrarPanelNewEditMercaderiaIN && (
        <div class="modal">
          <NewEditMercaderiaIN mercaSeleccio={definicion_CTX_INDEX_INVENTARIO.mM} contexto={'index_inventario'} />
        </div>
      )}
      {/*  TABLA  --  MERCADERIAS LOCALIZADOS */}
      <div class="form-control" style={{ margin: '10px 0' }}>
        {buscarMercaderiasKARDEX.value > 0 ? (
          <TablaMercaderiasKardex
            buscarMercaderiasKARDEX={buscarMercaderiasKARDEX.value}
            parametrosBusqueda={parametrosBusqueda}
            // contexto={props.contexto}
            esAlmacen={true}
            verTODOS={verTODOS.value}
            visualizarStocksCeros={visualizarStocksCeros.value}
            //   buscarMercaderiaOUT={buscarMercaderiaOUT.value}
            //   parametrosBusqueda={parametrosBusqueda}
          />
        ) : (
          ''
        )}
        {definicion_CTX_INDEX_INVENTARIO.mostrarPanelKARDEXS && (
          <div class="modal">
            <Kardexs
              mercaINSelecci={definicion_CTX_INDEX_INVENTARIO.mM}
              esAlmacen={true}
              // contexto={props.contexto}
              // igv={props.igv}
            />
          </div>
        )}
        {definicion_CTX_INDEX_INVENTARIO.mostrarPanelKARDEX && (
          <div class="modal">
            <Kardex
              mercaSelecci={definicion_CTX_INDEX_INVENTARIO.mM}
              kardex={definicion_CTX_INDEX_INVENTARIO.kK}
              elIDKardex={definicion_CTX_INDEX_INVENTARIO.elIdKardex}
              // esAlmacen={props.esAlmacen}
              // esAlmacen={false}
              contexto="index_inventario"
              // contextoParaDocumento={props.contexto}
              // igv={props.igv}
            />
          </div>
        )}
        {definicion_CTX_INDEX_INVENTARIO.mostrarPanelVerUbigeoAntiguo && (
          <div class="modal">
            <VerUbigeoAntiguo ubigeo={definicion_CTX_INDEX_INVENTARIO.elUBIGEO} contexto="index_inventario" />
          </div>
        )}
        {/*  LISTA DE UBIGEOS  */}
        {definicion_CTX_INDEX_INVENTARIO.mostrarPanelVerListaUbigeos && (
          <div class="modal">
            <VerListaUbigeos
              descripcion={definicion_CTX_INDEX_INVENTARIO.descripcion}
              idKardex={definicion_CTX_INDEX_INVENTARIO.elIdKardex}
              contexto="index_inventario"
            />
          </div>
        )}
        {/*  EDITAR PRECIO PUBLICO IN  */}
        {definicion_CTX_INDEX_INVENTARIO.mostrarPanelEditPrecioPublicoIN && (
          <div class="modal">
            <EditPrecioPublicoIN
              idMercaderia={definicion_CTX_INDEX_INVENTARIO.idMercaderia}
              descripcion={definicion_CTX_INDEX_INVENTARIO.descripcion}
              cuMASigv={definicion_CTX_INDEX_INVENTARIO.cuMASigv}
              pUtilidad={definicion_CTX_INDEX_INVENTARIO.pUtilidad}
              contexto="index_kardex"
              precioUnitarioPEN={definicion_CTX_INDEX_INVENTARIO.precioUnitarioPEN}
            />
          </div>
        )}
        {/*  INVENTARIO EXTERNO  */}
        {definicion_CTX_INDEX_INVENTARIO.mostrarPanelInventarioExterno && (
          <div class="modal">
            <InventarioExterno
              almacen={definicion_CTX_INDEX_INVENTARIO.almacenExterno}
              buscar={parametrosBusqueda.cadenaABuscar}
              // idMercaderia={definicion_CTX_BUSCAR_MERCADERIA_IN.idMercaderia}
              // descripcion={definicion_CTX_BUSCAR_MERCADERIA_IN.descripcion}
              // cuMASigv={definicion_CTX_BUSCAR_MERCADERIA_IN.cuMASigv}
              // pUtilidad={definicion_CTX_BUSCAR_MERCADERIA_IN.pUtilidad}
              contexto="index_inventario"
            />
          </div>
        )}
        {/*  LISTA OTROS ALMACENES */}
        {definicion_CTX_INDEX_INVENTARIO.mostrarPanelListaOtrosAlmacenes && (
          <div class="modal">
            <ListaOtrosAlmacenes otrosAlmacenes={definicion_CTX_INDEX_INVENTARIO.otrosAlmacenes} contexto={'index_inventario'} />
          </div>
        )}
        {/* MOSTRAR SPINNER */}
        {definicion_CTX_INDEX_INVENTARIO.mostrarSpinner && (
          <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
});
