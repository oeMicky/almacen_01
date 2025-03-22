import {
  component$,
  createContextId,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
  // useTask$,
} from '@builder.io/qwik';

// import TablaVentas from '~/components/venta/tablaVentas';
import { parametrosGlobales } from '../../login/index';

import { getIgvVenta, upDarDeBaja } from '~/apis/venta.api';
import { existeMotivoNV, getSerieNotaSalidaDeSucursal } from '~/apis/egresosDeAlmacen.api';

import Spinner from '~/components/system/spinner';
import { images } from '~/assets';
import { cerosALaIzquierda, hoy } from '~/functions/comunes';
import DarDeBajaDocumentoVenta from '~/components/venta/darDeBajaDocumentoVenta';
import { useNavigate } from '@builder.io/qwik-city';
import AddNotaVenta from '~/components/notaVenta/addNotaVenta';
import TablaNotasVentas from '~/components/notaVenta/tablaNotasVentas';
import AddVenta from '~/components/venta/addVenta';
import PanelPrueba from '~/components/notaVenta/panelPrueba';

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
export const CTX_INDEX_NOTA_VENTA = createContextId<any>('index_nota_venta');

export default component$(() => {
  // useStylesScoped$(style);
  //

  //#region DEFINICION CTX_INDEX_NOTA_VENTA
  const definicion_CTX_INDEX_NOTA_VENTA = useStore({
    NV: [],
    buscarNotasVentas: 0,
    miscNtsVts: [],

    mostrarPanelPrueba: false,
    prueb: { idAuxiliar: 123, codigo: 'cod', descripcion: 'des' },

    mostrarPanelNotaVenta: false,
    grabo_NotaVenta: false,

    mostrarPanelVenta: false,
    grabo_Venta: false,
    notaVentaENVIADA: { idNotaVenta: '', serieNotaVenta: '', numeroNotaVenta: 0, igv: 0, detalle: [], addPeriodo: [], addPeriodoAnterior: [] },

    mostrarSpinner: false,
    // mostrarSpinner: parametrosGlobales.mostrarSpinner, //false,
    darDeBajaID: '',
    darDeBajaRUC: '',
    darDeBajaEMPRESA: '',
    darDeBajaFECHA: '',
    darDeBajaFECHA_DOCUMENTO: '',
    darDeBajaTIPO: '',
    darDeBajaSERIE: '',
    darDeBajaNUMERO: '',
    darDeBajaCLIENTE: '',
    darDeBajaMOTIVO: '',
    darDeBajaFacturaJSON: false,
    darDeBajaFacturaXML: false,
    siDarDeBajaID: '',
    mostrarPanelDarDeBajaDocumentoVenta: false,
  });
  useContextProvider(CTX_INDEX_NOTA_VENTA, definicion_CTX_INDEX_NOTA_VENTA);
  //#endregion DEFINICION CTX_INDEX_NOTA_VENTA

  //#region CONTEXTO
  // const ctx_header_almacen = useContext(CTX_HEADER_ALMACEN);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const navegarA = useNavigate();
  const ini = useSignal(0);
  // const buscarVentas = useSignal(0);
  const igv = useSignal(0);
  // const xmlDoc = useSignal<any>();

  // const RRR = localStorage.getItem('periodos') ? localStorage.getItem('periodos') : [];
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  // const losPeriodosCargados = useSignal<any>(localStorage.getItem('periodos'));
  // const losPeriodosCargados = useSignal(JSON.parse(localStorage.getItem('periodos') || '[]'));
  // const losPeriodosCargados = useSignal<any>([]);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
  const periodoAnterior = useStore({ idPeriodo: '', periodo: '' });

  // const ventas = useStore([]);
  // const fechas = useStore({
  //   desde: '2023-01-01', //primeroDelMes(), //  '2023-01-01', // hoy(),
  //   // desde: hoy(),
  //   hasta: hoy(),
  // });
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    // idPeriodo: '',
    fechaInicio: hoy(), // fechas.desde,
    fechaFinal: hoy(), //fechas.hasta,
  });

  // useTask$(({ track }) => {
  //   track(() => ini.value);

  //   parametrosGlobales.mostrarSpinner = false;
  //   //console.log('ini venta parametrosGlobales.mostrarSpinner ', parametrosGlobales.mostrarSpinner);
  // });

  // useTask$(({ track }) => {
  //   const fI = track(() => fechas.desde);
  //   const fF = track(() => fechas.hasta);
  //   parametrosBusqueda.fechaInicio = fI;
  //   parametrosBusqueda.fechaFinal = fF;
  // });
  //#endregion INICIALIZACION

  //#region REFRESCAR REGISTROS
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_NOTA_VENTA.grabo_NotaVenta);
    // //console.log('0 definicion_CTX_INDEX_NOTA_VENTA.grabo_Venta', definicion_CTX_INDEX_NOTA_VENTA.grabo_Venta);
    // const BO = definicion_CTX_INDEX_NOTA_VENTA.grabo_Venta;
    if (definicion_CTX_INDEX_NOTA_VENTA.grabo_NotaVenta) {
      definicion_CTX_INDEX_NOTA_VENTA.buscarNotasVentas++;
      // //console.log('1 definicion_CTX_INDEX_NOTA_VENTA.grabo_Venta', definicion_CTX_INDEX_NOTA_VENTA.grabo_Venta);
      definicion_CTX_INDEX_NOTA_VENTA.mostrarSpinner = true;
      definicion_CTX_INDEX_NOTA_VENTA.grabo_NotaVenta = false;
      // //console.log('2 definicion_CTX_INDEX_NOTA_VENTA.grabo_Venta', definicion_CTX_INDEX_NOTA_VENTA.grabo_Venta);
    }
  });
  //#endregion REFRESCAR REGISTROS

  //#region CREAR Y DOWNLOAD TXT
  // const createAndDownloadFile = $((nameFile: string, texto: string) => {
  //   // const xmltext = '<sometag><someothertag></someothertag></sometag>';
  //   // const texto = 'hOLA A TODOS';

  //   const filename = nameFile; ///'file.xml';
  //   const pom = document.createElement('a');
  //   const bb = new Blob([texto], { type: 'text/plain' });

  //   pom.setAttribute('href', window.URL.createObjectURL(bb));
  //   // pom.setAttribute('download', filename);
  //   pom.setAttribute('download', filename + '.txt');

  //   pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  //   pom.draggable = true;
  //   pom.classList.add('dragout');

  //   pom.click();

  //   // var stupidExample = '<?xml version="1.0" encoding="utf-8"?><aTag>something</aTag>';
  //   // // document.open('data:Application/octet-stream,' + encodeURIComponent(stupidExample));
  //   // window.open('data:application/xml,' + encodeURIComponent(stupidExample), '_self');
  //   //console.log('first txt');
  // });
  //#endregion CREAR Y DOWNLOAD TXT

  //#region DAR DE BAJA
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_INDEX_NOTA_VENTA.siDarDeBajaID);

    if (definicion_CTX_INDEX_NOTA_VENTA.siDarDeBajaID !== '') {
      // console.log('🔽🔽⏬');
      const respuesta = await upDarDeBaja({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idVenta: definicion_CTX_INDEX_NOTA_VENTA.siDarDeBajaID,
        darDeBajaRUC: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaRUC,
        darDeBajaEMPRESA: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaEMPRESA,
        darDeBajaFECHA: hoy(),
        darDeBajaFECHA_DOCUMENTO: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaFECHA_DOCUMENTO,
        darDeBajaTIPO: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaTIPO,
        darDeBajaSERIE: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaSERIE,
        darDeBajaNUMERO: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaNUMERO,
        darDeBajaCLIENTE: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaCLIENTE,
        darDeBajaMOTIVO: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaMOTIVO,
        darDeBajaFacturaJSON: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaFacturaJSON,
        darDeBajaFacturaXML: definicion_CTX_INDEX_NOTA_VENTA.darDeBajaFacturaXML,
        usuario: parametrosGlobales.usuario,
      });
      console.log('respuesta', respuesta);
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaID = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaRUC = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaEMPRESA = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaFECHA = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaFECHA_DOCUMENTO = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaTIPO = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaSERIE = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaNUMERO = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaCLIENTE = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaMOTIVO = '';
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaFacturaJSON = false;
      definicion_CTX_INDEX_NOTA_VENTA.darDeBajaFacturaXML = false;
      definicion_CTX_INDEX_NOTA_VENTA.siDarDeBajaID = '';
    }
  });
  //#endregion DAR DE BAJA

  return (
    // <main>
    <div class="container" onComplete$={() => console.log('🚄🚄🚄🚄🚄')}>
      {/*  IDENTIFICACION  style={{ border: '3px pink solid' }}*/}
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
            {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
          </h1>                , border: '1px green solid'       */}
      <div style={{ background: '#00778F' }}>
        <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>

      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>Nota de Venta</u>
      </h4>

      {/*  BOTONES   */}
      {/* <div style={{ marginBottom: '10px', paddingLeft: '3px' }}> */}
      <div style={{ display: 'flex' }}>
        {/* <button
          id="in_panel"
          tabIndex={1}
          onClick$={() => {
            // navigator.mediaDevices
            //   .enumerateDevices()
            //   .then((devices) => {
            //     devices.forEach((device) => {
            //       console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
            //     });
            //   })
            //   .catch((err) => {
            //     console.error(`${err.name}: ${err.message}`);
            //   });
            ///////////////////////
            // document.getElementById('btn_Add_Nota_Venta')?.blur();
            definicion_CTX_INDEX_NOTA_VENTA.mostrarPanelPrueba = true;
            console.log('🐘🐘🐘🐘', document.getSelection());
            // document.getElementById('in_Pier')?.focus({ preventScroll: true });
            // document.getElementById('in_Pier')?.tabIndex('1');
            console.log('🐘🐘🐘🐘🐘🐘');
          }}
        >
          panel
        </button> */}
        <button
          title="Adiciona nota de venta"
          tabIndex={3}
          id="btn_Add_Nota_Venta"
          style={{ cursor: 'pointer' }}
          onClick$={async () => {
            if (parametrosGlobales.idGrupoEmpresarial === '') {
              // console.log('estaVACIA');
              alert('Faltan datos... vuelva a logearse..');
              navegarA('/login');
              return;
            }
            //ANALISIS MOTIVO SALIDA ALMACEN: NOTA DE VENTA
            if (typeof parametrosGlobales.idMotivosSalidaDelAlmacen_NV === 'undefined' || parametrosGlobales.idMotivosSalidaDelAlmacen_NV === '') {
              // console.log('000 parametrosGlobales.idMotivosSalidaDelAlmacen_NV', parametrosGlobales.idMotivosSalidaDelAlmacen_NV);
              let existe = await existeMotivoNV({
                idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                idEmpresa: parametrosGlobales.idEmpresa,
              });
              // console.log('................existe..0........', existe);
              existe = existe.data;
              // console.log('................existe..1........', existe);
              // console.log('................existe..2........', existe[0]);
              if (existe.length === 0) {
                alert('No existe el motivo de salida de nota de venta en el almacén, pongase en contacto con el administrador.');
                return;
              } else {
                parametrosGlobales.idMotivosSalidaDelAlmacen_NV = existe[0]._id;
                // console.log('111 parametrosGlobales.idMotivosSalidaDelAlmacen_NV', parametrosGlobales.idMotivosSalidaDelAlmacen_NV);
              }
            }
            //VERIFICAR SI EXISTE LA SERIE DE LA NOTA DE SALIDA DEL ALMACEN
            console.log(
              '🧧  parametrosGlobales.almacenActivo && parametrosGlobales.idSerieNotaSalida',
              parametrosGlobales.almacenActivo,
              parametrosGlobales.idSerieNotaSalida
            );
            if (parametrosGlobales.almacenActivo && parametrosGlobales.idSerieNotaSalida === '') {
              //buscar la serie (SI EXISTE)
              let laSerie = await getSerieNotaSalidaDeSucursal({
                idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                idEmpresa: parametrosGlobales.idEmpresa,
                idSucursal: parametrosGlobales.idSucursal,
              });
              console.log('🚕🚕🚕🚕 laSerie NotaSalida', laSerie);
              laSerie = laSerie.data[0];
              console.log('🚕🚕🚕🚕🚕🚕🚕🚕 laSerie NotaSalida', laSerie);

              if (typeof laSerie !== 'undefined' && laSerie.idSerieNotaSalida !== '') {
                parametrosGlobales.idSerieNotaSalida = laSerie.idSerieNotaSalida;
                parametrosGlobales.serieNotaSalida = laSerie.serie;
                console.log(
                  '🧧🧧  parametrosGlobales.idSerieNotaSalida, parametrosGlobales.serieNotaSalida',
                  parametrosGlobales.idSerieNotaSalida,
                  parametrosGlobales.serieNotaSalida
                );
              } else {
                alert('No existe la serie de la Nota de Salida.');
                return;
              }
            }
            // console.log('222 parametrosGlobales.idMotivosSalidaDelAlmacen_NV', parametrosGlobales.idMotivosSalidaDelAlmacen_NV);
            // const elHoy = new Date();
            // const elANIO = elHoy.getFullYear();
            //console.log(elANIO);
            //validar PERIODO
            let anioAnterior = '';
            let mesAnterior = '';
            const anio = (document.getElementById('in_laFechaHoyVenta') as HTMLInputElement).value.substring(0, 4);
            const mes = (document.getElementById('in_laFechaHoyVenta') as HTMLInputElement).value.substring(5, 7);
            //console.log(anio);
            // //console.log('la fechitaaaa', anio + mes);
            const periodoActual = anio + mes;
            const PPP = losPeriodosCargados.value;
            if (parseInt(mes) === 1) {
              anioAnterior = (parseInt(anio) - 1).toString();
              mesAnterior = '12';
            } else {
              anioAnterior = anio;
              mesAnterior = cerosALaIzquierda(parseInt(mes) - 1, 2).toString();
            }
            const periodoANTE = anioAnterior + mesAnterior;
            //console.log(periodoANTE);
            // //console.log('mas', mas);
            // //console.log('PPP', PPP);
            const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(periodoActual));
            //console.log('⚠ elPeriodo', elPeriodo);
            if (typeof elPeriodo === 'undefined') {
              alert(`🔰 El período ${periodoActual} no ha sido hallado, verifique.`);
              return;
            }
            periodo.idPeriodo = elPeriodo._id;
            periodo.periodo = elPeriodo.periodo;
            //************* */
            const elPeriodoAnterior: any = PPP.find((ele: any) => ele.periodo === parseInt(periodoANTE));
            periodoAnterior.idPeriodo = elPeriodoAnterior._id;
            periodoAnterior.periodo = elPeriodoAnterior.periodo;

            if (periodo.idPeriodo === '') {
              alert('🔰 Seleccione el periodo.');
              document.getElementById('se_periodo')?.focus();
              ini.value++;
              return;
            }
            definicion_CTX_INDEX_NOTA_VENTA.mostrarSpinner = true;

            let elIgv = await getIgvVenta({
              idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
              idEmpresa: parametrosGlobales.idEmpresa,
            });
            elIgv = elIgv.data;
            //
            igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //

            definicion_CTX_INDEX_NOTA_VENTA.NV = [];

            definicion_CTX_INDEX_NOTA_VENTA.mostrarPanelNotaVenta = true;
          }}
        >
          ADD NOTA VENTA
        </button>
        <input
          id="in_laFechaHoyVenta"
          type="date"
          tabIndex={4}
          max={hoy()}
          // min={menosXdiasHoy(2)}
          value={parametrosBusqueda.fechaInicio}
          style={{ marginLeft: '4px' }}
          onChange$={(e) => {
            if (parametrosGlobales.idGrupoEmpresarial === '') {
              // console.log('estaVACIA');
              alert('Faltan datos... vuelva a logearse..');
              navegarA('/login');
              return;
            }
            // console.log(parametrosGlobales.idGrupoEmpresarial, parametrosGlobales.idEmpresa, parametrosGlobales.idSucursal, parametrosGlobales.periodos);
            parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value;
            parametrosBusqueda.fechaFinal = (e.target as HTMLInputElement).value;

            definicion_CTX_INDEX_NOTA_VENTA.buscarNotasVentas++;

            definicion_CTX_INDEX_NOTA_VENTA.mostrarSpinner = true;
          }}
        />
        {/*   <input id="in_laFechaHoyVenta" type="date" disabled value={'2024-04-09'} style={{ marginLeft: '4px' }} />*/}
        <input
          title="Buscar notas venta"
          type="image"
          tabIndex={2}
          alt="icon busqueda"
          src={images.searchPLUS}
          height={21.5}
          width={21.5}
          style={{ marginLeft: '4px' }}
          onClick$={() => {
            if (parametrosGlobales.idGrupoEmpresarial === '') {
              // console.log('estaVACIA');
              alert('Faltan datos... vuelva a logearse..');
              navegarA('/login');
              return;
            }
            definicion_CTX_INDEX_NOTA_VENTA.buscarNotasVentas++;

            definicion_CTX_INDEX_NOTA_VENTA.mostrarSpinner = true;
          }}
        />
        {definicion_CTX_INDEX_NOTA_VENTA.mostrarPanelNotaVenta && (
          <div
            class="modal"
            // onKeyPress$={(e) => {
            //   if (e.key === 'Enter') {
            //     console.log('🚕🚕🚕🚕🚕🚕');
            //   }
            // }}
            onLoad$={() => {
              //   document.getElementById('in_Pier')?.focus();
              // console.log('🏠🏠🏠🏠🏠🏠🏠');
            }}
          >
            <AddNotaVenta addPeriodo={periodo} nvSelecci={definicion_CTX_INDEX_NOTA_VENTA.NV} igv={igv.value} addPeriodoAnterior={periodoAnterior} />
          </div>
        )}

        {/* PANEL PRUEBA  */}
        {definicion_CTX_INDEX_NOTA_VENTA.mostrarPanelPrueba && (
          <div
            id="exampleModal"
            aria-modal={true}
            // aria-hidden={false}
            tabIndex={1}
            class="modal"
            // onLoad$={() => console.log('🚍🚍🚍🚍🚍')}
            // onBlur$={() => console.log('🐘🐘')}
            // onLoad$={() => {
            //   console.log('🐘🐘🐘');
            //   document.getElementById('in_Pier')?.focus();
            // }}
          >
            <PanelPrueba paPrueba={definicion_CTX_INDEX_NOTA_VENTA.prueb} />
          </div>
        )}
      </div>
      {/* TABLA NOTA DE VENTAS */}
      <div id="ventassss" style={{ margin: '8px 0' }}>
        {definicion_CTX_INDEX_NOTA_VENTA.buscarNotasVentas > 0 ? (
          <TablaNotasVentas
            // buscarVentas={buscarVentas.value}
            parametrosBusqueda={parametrosBusqueda}
            periodosCargados={losPeriodosCargados.value}
            // facturacionElectronica={parametrosGlobales.facturacionElectronica}
          />
        ) : (
          ''
        )}
      </div>
      {/* DAR DE BAJA  */}
      {definicion_CTX_INDEX_NOTA_VENTA.mostrarPanelDarDeBajaDocumentoVenta && (
        <div class="modal">
          <DarDeBajaDocumentoVenta />
        </div>
      )}
      {/* VENTA  */}
      {definicion_CTX_INDEX_NOTA_VENTA.mostrarPanelVenta && (
        <div class="modal">
          <AddVenta
            addPeriodo={definicion_CTX_INDEX_NOTA_VENTA.notaVentaENVIADA.addPeriodo}
            igv={igv.value}
            addPeriodoAnterior={definicion_CTX_INDEX_NOTA_VENTA.notaVentaENVIADA.addPeriodoAnterior}
            contexto="nota_venta"
            notaDeVenta={definicion_CTX_INDEX_NOTA_VENTA.notaVentaENVIADA}
          />
        </div>
      )}
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_NOTA_VENTA.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
    // </main>
  );
});
