import {
  $,
  component$,
  createContextId,
  useContextProvider,
  // useResource$,
  useSignal,
  useStore,
  useStylesScoped$,
  useTask$,
  // useTask$,
} from '@builder.io/qwik';
// import ImgButton from '../../../components/system/imgButton';
import Button from '~/components/system/elButton';
// import { images } from '~/assets';
// import { hoy } from '~/functions/comunes';
import TablaVentas from '~/components/venta/tablaVentas';
// import Modal from '~/components/system/elModal';
import AddVenta from '~/components/venta/addVenta';
import { getIgvVenta } from '~/apis/venta.api';
import style from './index.css?inline';
import { parametrosGlobales } from '../../login/index';
import ElSelect from '~/components/system/elSelect';
import Spinner from '~/components/system/spinner';
import { images } from '~/assets';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';

// import { CTX_DOCS_ORDEN_SERVICIO } from '../ordenServicio';
// import Venta from '~/components/venta/venta';
// import { getVentasPorFechas } from '~/apis/venta.api';

// interface IVentas {
//   ventas: Venta[];
// }

// export async function getVentasPorFechas(parameBusqueda: any, controller?: AbortController): Promise<string[]> {
//
//   const resp = await fetch(`http://localhost:4000/api/venta/obtenerVentasPorFechas`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(parameBusqueda),
//     signal: controller?.signal,
//   });
//
//   const json = await resp.json();
//   return Array.isArray(json) ? json.map((repo: { name: string }) => repo.name) : Promise.reject(json);
// }
////////////***************/////////////////////***********************///////////////////
export const CTX_INDEX_VENTA = createContextId<any>('index_venta');

export default component$(() => {
  useStylesScoped$(style);
  //

  //#region DEFINICION CTX_INDEX_VENTA
  const definicion_CTX_INDEX_VENTA = useStore({
    miscVts: [],

    mostrarPanelVenta: false,
    grabo_Venta: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_VENTA, definicion_CTX_INDEX_VENTA);
  //#endregion DEFINICION CTX_INDEX_VENTA

  //#region CONTEXTOS
  // const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const buscarVentas = useSignal(0);
  const igv = useSignal(0);
  // const xmlDoc = useSignal<any>();

  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });

  // const ventas = useStore([]);
  // const fechas = useStore({
  //   desde: '2023-01-01', //primeroDelMes(), //  '2023-01-01', // hoy(),
  //   // desde: hoy(),
  //   hasta: hoy(),
  // });
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idPeriodo: '',
    // fechaInicio: fechas.desde,
    // fechaFinal: fechas.hasta,
  });

  // useTask$(({ track }) => {
  //   const fI = track(() => fechas.desde);
  //   const fF = track(() => fechas.hasta);
  //   parametrosBusqueda.fechaInicio = fI;
  //   parametrosBusqueda.fechaFinal = fF;
  // });
  //#endregion INICIALIZACION

  // const createAndOpenFile = $(() => {
  //   let xmltext = '<sometag><someothertag></someothertag></sometag>';

  //   let filename = 'file.xml';
  //   let pom = document.createElement('a');
  //   let bb = new Blob([xmltext], { type: 'text/plain' });

  //   pom.setAttribute('href', window.URL.createObjectURL(bb));
  //   pom.setAttribute('download', filename);

  //   pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  //   pom.draggable = true;
  //   pom.classList.add('dragout');

  //   pom.click();

  //
  // });

  //TAREA: Buscar ventas
  // useTask$(({ track }) => {
  //   track(() => buscarVentas.value);
  //
  //   if (buscarVentas.value > 0) {
  //
  //   }
  // });

  //#region OBTENER PERIODOS
  // const cargarLosPeriodos = $(async () => {
  //   const losPeri = await getPeriodos({
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     bandera: 'Ventas',
  //   });
  //
  //   losPeriodosCargados.value = losPeri.data;
  //
  //   //
  // });

  // useTask$(({ track }) => {
  //   track(() => ini.value);

  //   cargarLosPeriodos();
  // });
  //#endregion OBTENER PERIODOS

  //#region REFRESCAR REGISTROS
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_VENTA.grabo_Venta);
    if (definicion_CTX_INDEX_VENTA.grabo_Venta) {
      buscarVentas.value++;

      definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
      definicion_CTX_INDEX_VENTA.grabo_Venta = false;
    }
  });
  //#endregion REFRESCAR REGISTROS

  //#region CREAR Y DOWNLOAD TXT
  const createAndDownloadFile = $((nameFile: string, texto: string) => {
    // const xmltext = '<sometag><someothertag></someothertag></sometag>';
    // const texto = 'hOLA A TODOS';

    const filename = nameFile; ///'file.xml';
    const pom = document.createElement('a');
    const bb = new Blob([texto], { type: 'text/plain' });

    pom.setAttribute('href', window.URL.createObjectURL(bb));
    // pom.setAttribute('download', filename);
    pom.setAttribute('download', filename + '.txt');

    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');

    pom.click();

    // var stupidExample = '<?xml version="1.0" encoding="utf-8"?><aTag>something</aTag>';
    // // document.open('data:Application/octet-stream,' + encodeURIComponent(stupidExample));
    // window.open('data:application/xml,' + encodeURIComponent(stupidExample), '_self');
    console.log('first txt');
  });
  //#endregion CREAR Y DOWNLOAD TXT

  return (
    <main>
      <div class="container">
        {/*  IDENTIFICACION  */}
        {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
          {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
        </h1> */}
        <div style={{ background: '#00778F' }}>
          <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
            {` ${localStorage.getItem('numeroIdentidad')} - ${localStorage
              .getItem('empresa')
              ?.toLocaleUpperCase()} - Sucursal: ${localStorage.getItem('sucursal')} - Usuario: ${localStorage.getItem(
              'usuario'
            )}`}
          </label>
        </div>
        <h4 style={{ margin: '8px 0 4px 2px' }}>
          <u>Facturación</u>
        </h4>
        {/*  INTERVALOS DE FECHAS  style={{ display: 'flex', margin: '10px 0' }}*/}
        {/*  style={{ marginRight: '1px', border: ' 1px solid blue' }}  style={{ marginRight: '10px', border: ' 1px solid red' }}*/}
        {/* <div class="intervalo-fechas">
          <label class="fechas">
            Desde:{' '}
            <input
              id="fechaDesde"
              type="date"
              value={parametrosBusqueda.fechaInicio}
              onInput$={(e) => {
                fechas.desde = (e.target as HTMLInputElement).value;
              }}
            />
          </label>
          <label class="fechas">
            Hasta:{' '}
            <input
              id="fechaHasta"
              type="date"
              value={parametrosBusqueda.fechaFinal}
              onInput$={(e) => {
                fechas.hasta = (e.target as HTMLInputElement).value;
              }}
            />
          </label>
          <div class="intervalo-fechas__botonBuscar">
            <ImgButton
              id="busquedaVentas"
              src={images.searchPLUS}
              alt="Icono de busqueda"
              height={16}
              width={16}
              title="Buscar ventas"
              onClick={$(async () => {
                if (fechas.desde > fechas.hasta) {
                  alert('Verifique las fechas de busqueda');
                  document.getElementById('fechaDesde')?.focus();
                  return;
                }
                

                buscarVentas.value++;
              })}
            />
          </div>
        </div> */}
        {/*  BOTONES   className="btn"  onClick={mostrarPanelVenta}  border: ' 1px solid blue',*/}
        <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>
          {/* <button
            onClick$={() => {
              
            }}
          >
            compañia
          </button> */}
          <Button
            name="ADD VENTA"
            title="Add venta"
            onClick={$(async () => {
              //validar PERIODO
              if (periodo.idPeriodo === '') {
                alert('Seleccione el periodo.');
                document.getElementById('se_periodo')?.focus();
                ini.value++;
                return;
              }
              //
              // let elIgv = await getIgvVenta(parametrosGlobales);
              let elIgv = await getIgvVenta({
                idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                idEmpresa: parametrosGlobales.idEmpresa,
              });
              elIgv = elIgv.data;
              //
              igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //
              //
              definicion_CTX_INDEX_VENTA.mostrarPanelVenta = true;
            })}
          />
          <ElSelect
            id={'se_periodo_VENTA'}
            // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
            estilos={{ width: '168px', marginLeft: '5px' }}
            registros={losPeriodosCargados.value}
            registroID={'_id'}
            registroTEXT={'periodo'}
            seleccione={'-- Seleccione periodo --'}
            onChange={$(() => {
              const elSelec = document.getElementById('se_periodo_VENTA') as HTMLSelectElement;
              const elIdx = elSelec.selectedIndex;

              periodo.idPeriodo = elSelec[elIdx].id;
              if (periodo.idPeriodo === '') {
                periodo.periodo = '';
              } else {
                periodo.periodo = elSelec.value;
                // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                parametrosBusqueda.idPeriodo = periodo.idPeriodo;
                //
                //
                buscarVentas.value++;

                definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
              }
            })}
            onKeyPress={$((e: any) => {
              if (e.key === 'Enter') {
                (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
              }
            })}
          />
          <input
            // id="in_BuscarDetraccion"
            type="image"
            src={images.searchPLUS}
            title="Refrescar ventas"
            height={16}
            width={16}
            style={{ marginLeft: '2px' }}
            // onFocusin$={() => console.log('☪☪☪☪☪☪')}
            onClick$={() => {
              if (parametrosBusqueda.idPeriodo === '') {
                alert('Debe seleccionar el periodo');
                document.getElementById('se_periodo_VENTA')?.focus();
                return;
              }
              buscarVentas.value++;

              definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
            }}
          />
          <input
            // id="in_BuscarDetraccion"
            type="button"
            // src={images.searchPLUS}
            value="PLE"
            title="PLE de ventas"
            // height={16}
            // width={16}
            style={{ marginLeft: '18px' }}
            // onFocusin$={() => console.log('☪☪☪☪☪☪')}
            onClick$={() => {
              if (parametrosBusqueda.idPeriodo === '') {
                alert('Debe seleccionar el periodo');
                document.getElementById('se_periodo_VENTA')?.focus();
                return;
              }
              if (definicion_CTX_INDEX_VENTA.miscVts.length === 0) {
                alert('El PLE del presente periodo no presenta datos para exportar.');
                document.getElementById('se_periodo_VENTA')?.focus();
                // ini.value++;
                return;
              }
              let aExportar = '';
              definicion_CTX_INDEX_VENTA.miscVts.map((com: any) => {
                const {
                  codigoTipoDocumentoIdentidad,
                  tipoDocumentoIdentidad,
                  numeroIdentidad,
                  razonSocialNombre,
                  codigoTipoComprobantePago,
                  tipoComprobantePago,
                  fecha,
                  serie,
                  numero,

                  baseImponiblePEN,
                  exoneradoPEN,
                  inafectoPEN,
                  iscPEN,
                  icbpPEN,
                  otrosPEN,
                  igvPEN,
                  totalPEN,

                  referenciaFecha,
                  referenciaTipo,
                  referenciaSerie,
                  referenciaNumero,
                } = com;

                const bI = typeof baseImponiblePEN === 'undefined' ? '' : baseImponiblePEN.$numberDecimal;
                const iGV = typeof igvPEN === 'undefined' ? '' : igvPEN.$numberDecimal;
                const exo = typeof exoneradoPEN === 'undefined' ? '' : exoneradoPEN.$numberDecimal;
                const ina = typeof inafectoPEN === 'undefined' ? '' : inafectoPEN.$numberDecimal;
                const isc = typeof iscPEN === 'undefined' ? '' : iscPEN.$numberDecimal;
                const icbp = typeof icbpPEN === 'undefined' ? '' : icbpPEN.$numberDecimal;
                const otros = typeof otrosPEN === 'undefined' ? '' : otrosPEN.$numberDecimal;
                const total = typeof totalPEN === 'undefined' ? '' : totalPEN.$numberDecimal;
                const refeFe = typeof referenciaFecha === 'undefined' ? '' : referenciaFecha;
                const refeTipo = typeof referenciaTipo === 'undefined' ? '' : referenciaTipo;
                const refeSerie = typeof referenciaSerie === 'undefined' ? '' : referenciaSerie;
                const refeNumero = typeof referenciaNumero === 'undefined' ? '' : referenciaNumero;

                aExportar =
                  aExportar +
                  formatoDDMMYYYY_PEN(fecha) +
                  '|' +
                  codigoTipoComprobantePago +
                  '|' +
                  tipoComprobantePago +
                  '|' +
                  serie +
                  '|' +
                  numero +
                  '|' +
                  codigoTipoDocumentoIdentidad +
                  '|' +
                  tipoDocumentoIdentidad +
                  '|' +
                  numeroIdentidad +
                  '|' +
                  razonSocialNombre +
                  '|' +
                  bI +
                  '|' +
                  iGV +
                  '|' +
                  exo +
                  '|' +
                  ina +
                  '|' +
                  isc +
                  '|' +
                  icbp +
                  '|' +
                  otros +
                  '|' +
                  total +
                  '|' +
                  formatoDDMMYYYY_PEN(refeFe) +
                  '|' +
                  refeTipo +
                  '|' +
                  refeSerie +
                  '|' +
                  refeNumero +
                  '|' +
                  '\n';
              });
              // // createAndDownloadFile('elPLE' + periodo.periodo, 'Hola a todos desde el PLE');
              createAndDownloadFile('elPLE_VENTA_' + periodo.periodo, aExportar);
            }}
          />
          {/* <textarea id="source" value={'holas'}></textarea> */}
          {/* <button
            type="button"
            id="save"
            title="Save as text file"
            onClick$={() => {
              // when clicked the button
              const content = (document.getElementById('source') as HTMLTextAreaElement).value;

              // a [save as] dialog will be shown
              window.open('data:application/txt,' + encodeURIComponent(content));
              // window.open('data:application/txt,' + encodeURIComponent(content), '_self');
              // window.open('data:application/xml,' + content, '_self');
            }}
          >
            Save
          </button> */}

          {/* <button
            title="xml 2"
            onClick$={() => {
              var xmlString = '<root><estrecho>Miguel</estrecho></root>';
              var parser = new DOMParser();
              // xmlDoc.value = parser.parseFromString(xmlString, 'text/xml');
              xmlDoc.value = parser.parseFromString(xmlString, 'application/xml');
            }}
          >
            xml 22
          </button> */}

          {/* <button onClick$={() => createAndOpenFile()}>ver xml 22</button> */}

          {/* <a href="#" onClick$={() => createAndOpenFile()} download="file.xml">
            Download
          </a> */}

          {definicion_CTX_INDEX_VENTA.mostrarPanelVenta && (
            <div class="modal">
              <AddVenta ancho={600} addPeriodo={periodo} igv={igv.value} />
            </div>
          )}
        </div>
        {/* TABLA VENTAS */}
        <div id="ventassss" style={{ margin: '10px 0' }}>
          {buscarVentas.value > 0 ? (
            <TablaVentas buscarVentas={buscarVentas.value} parametrosBusqueda={parametrosBusqueda} />
          ) : (
            ''
          )}
        </div>
        {/* MOSTRAR SPINNER */}
        {definicion_CTX_INDEX_VENTA.mostrarSpinner && (
          <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner />
          </div>
        )}
      </div>
    </main>
  );
});

// export const AddVenta = component$(() => {
//   const panelVenta = useContext(CTX);
//   return (
//     <>
//       <div>el modal su contexto: {!panelVenta.mostrarPanelVentas ? 'A' : 'B'}</div>
//     </>
//   );
// });
