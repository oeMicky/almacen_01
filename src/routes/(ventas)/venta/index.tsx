import {
  component$,
  createContextId,
  useContextProvider,
  // $,
  // useResource$,
  useSignal,
  useStore,
  useTask$,
  // useTask$,
} from '@builder.io/qwik';
// import ImgButton from '../../../components/system/imgButton';
// import Button from '~/components/system/elButton';
// import { images } from '~/assets';
// import { hoy } from '~/functions/comunes';
import TablaVentas from '~/components/venta/tablaVentas';
// import Modal from '~/components/system/elModal';
import AddVenta from '~/components/venta/addVenta';
import { getIgvVenta, upDarDeBaja } from '~/apis/venta.api';
// import style from './index.css?inline';
import { parametrosGlobales } from '../../login/index';
// import ElSelect from '~/components/system/elSelect';  formatoDDMMYYYY_PEN
import Spinner from '~/components/system/spinner';
import { images } from '~/assets';
import { cerosALaIzquierda, hoy } from '~/functions/comunes';
import DarDeBajaDocumentoVenta from '~/components/venta/darDeBajaDocumentoVenta';
import { useNavigate } from '@builder.io/qwik-city';
// import { exit } from 'process';
// import pdfReporteVenta from '~/reports/MG/pdfReporteVenta';

// import { CTX_HEADER_ALMACEN } from '~/components/header/headerAlmacen';
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
  // useStylesScoped$(style);
  //

  //#region DEFINICION CTX_INDEX_VENTA
  const definicion_CTX_INDEX_VENTA = useStore({
    buscarVentas: 0,
    miscVts: [],

    mostrarPanelVenta: false,
    grabo_Venta: false,

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
  useContextProvider(CTX_INDEX_VENTA, definicion_CTX_INDEX_VENTA);
  //#endregion DEFINICION CTX_INDEX_VENTA

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
    // //console.log('0 definicion_CTX_INDEX_VENTA.grabo_Venta', definicion_CTX_INDEX_VENTA.grabo_Venta);
    // const BO = definicion_CTX_INDEX_VENTA.grabo_Venta;
    if (definicion_CTX_INDEX_VENTA.grabo_Venta) {
      definicion_CTX_INDEX_VENTA.buscarVentas++;
      // //console.log('1 definicion_CTX_INDEX_VENTA.grabo_Venta', definicion_CTX_INDEX_VENTA.grabo_Venta);
      definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
      definicion_CTX_INDEX_VENTA.grabo_Venta = false;
      // //console.log('2 definicion_CTX_INDEX_VENTA.grabo_Venta', definicion_CTX_INDEX_VENTA.grabo_Venta);
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
    track(() => definicion_CTX_INDEX_VENTA.siDarDeBajaID);

    if (definicion_CTX_INDEX_VENTA.siDarDeBajaID !== '') {
      // console.log('🔽🔽⏬');
      const respuesta = await upDarDeBaja({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idVenta: definicion_CTX_INDEX_VENTA.siDarDeBajaID,
        darDeBajaRUC: definicion_CTX_INDEX_VENTA.darDeBajaRUC,
        darDeBajaEMPRESA: definicion_CTX_INDEX_VENTA.darDeBajaEMPRESA,
        darDeBajaFECHA: hoy(),
        darDeBajaFECHA_DOCUMENTO: definicion_CTX_INDEX_VENTA.darDeBajaFECHA_DOCUMENTO,
        darDeBajaTIPO: definicion_CTX_INDEX_VENTA.darDeBajaTIPO,
        darDeBajaSERIE: definicion_CTX_INDEX_VENTA.darDeBajaSERIE,
        darDeBajaNUMERO: definicion_CTX_INDEX_VENTA.darDeBajaNUMERO,
        darDeBajaCLIENTE: definicion_CTX_INDEX_VENTA.darDeBajaCLIENTE,
        darDeBajaMOTIVO: definicion_CTX_INDEX_VENTA.darDeBajaMOTIVO,
        darDeBajaFacturaJSON: definicion_CTX_INDEX_VENTA.darDeBajaFacturaJSON,
        darDeBajaFacturaXML: definicion_CTX_INDEX_VENTA.darDeBajaFacturaXML,
        usuario: parametrosGlobales.usuario,
      });
      console.log('respuesta', respuesta);
      definicion_CTX_INDEX_VENTA.darDeBajaID = '';
      definicion_CTX_INDEX_VENTA.darDeBajaRUC = '';
      definicion_CTX_INDEX_VENTA.darDeBajaEMPRESA = '';
      definicion_CTX_INDEX_VENTA.darDeBajaFECHA = '';
      definicion_CTX_INDEX_VENTA.darDeBajaFECHA_DOCUMENTO = '';
      definicion_CTX_INDEX_VENTA.darDeBajaTIPO = '';
      definicion_CTX_INDEX_VENTA.darDeBajaSERIE = '';
      definicion_CTX_INDEX_VENTA.darDeBajaNUMERO = '';
      definicion_CTX_INDEX_VENTA.darDeBajaCLIENTE = '';
      definicion_CTX_INDEX_VENTA.darDeBajaMOTIVO = '';
      definicion_CTX_INDEX_VENTA.darDeBajaFacturaJSON = false;
      definicion_CTX_INDEX_VENTA.darDeBajaFacturaXML = false;
      definicion_CTX_INDEX_VENTA.siDarDeBajaID = '';
    }
  });
  //#endregion DAR DE BAJA

  return (
    // <main>
    <div class="container">
      {/*  IDENTIFICACION  style={{ border: '3px pink solid' }}*/}
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
          {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
        </h1>                , border: '1px green solid'       */}
      <div style={{ background: '#00778F' }}>
        <label style={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {/* {` ${localStorage.getItem('numeroIdentidad')} - ${localStorage
              .getItem('empresa')
              ?.toLocaleUpperCase()} - Sucursal: ${localStorage.getItem('sucursal')} - Usuario: ${localStorage.getItem(
              'usuario'
            )}`} */}
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>
      {/* <button
        onClick$={() => {
          //console.log('PARAMETROS GLOABLES', parametrosGlobales);
        }}
      >
        parametros
      </button> */}
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>
          Facturación - <label style={{ color: 'red' }}>{parametrosGlobales.sucursal}</label>
        </u>
      </h4>
      {/*  INTERVALOS DE FECHAS  border: '1px pink solid' style={{ display: 'flex', margin: '10px 0' }}*/}
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
      {/*  BOTONES   */}
      {/* <div style={{ marginBottom: '10px', paddingLeft: '3px' }}> */}
      <div style={{ display: 'flex' }}>
        <button
          title="Adiciona venta"
          style={{ cursor: 'pointer' }}
          onClick$={async () => {
            if (parametrosGlobales.idGrupoEmpresarial === '') {
              // console.log('estaVACIA');
              alert('Faltan datos... vuelva a logearse..');
              navegarA('/login');
              return;
            }
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
            definicion_CTX_INDEX_VENTA.mostrarSpinner = true;

            let elIgv = await getIgvVenta({
              idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
              idEmpresa: parametrosGlobales.idEmpresa,
            });
            elIgv = elIgv.data;
            //
            igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //

            definicion_CTX_INDEX_VENTA.mostrarPanelVenta = true;
          }}
        >
          ADD VENTA
        </button>
        {/* <Button
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
            definicion_CTX_INDEX_VENTA.mostrarSpinner = true;

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
        /> */}
        <input
          id="in_laFechaHoyVenta"
          type="date"
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

            definicion_CTX_INDEX_VENTA.buscarVentas++;

            definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
          }}
        />
        {/*   <input id="in_laFechaHoyVenta" type="date" disabled value={'2024-04-09'} style={{ marginLeft: '4px' }} />*/}
        <input
          type="image"
          title="Buscar ventas"
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
            definicion_CTX_INDEX_VENTA.buscarVentas++;

            definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
          }}
        />
        {/* <button
          onClick$={$(async () => {
            await ejcutarCreacionXML({ idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial, idEmpresa: parametrosGlobales.idEmpresa, });
          })}
        >
          XMLVenta
        </button> */}
        {/* <button onClick$={() => alert(Date())}>hora actual</button>
        <button
          onClick$={() => {
            const d = new Date();
            alert(cerosALaIzquierda(d.getHours(), 2) + ':' + cerosALaIzquierda(d.getMinutes(), 2) + ':' + cerosALaIzquierda(d.getSeconds(), 2));
          }}
        >
          hora
        </button>
        <button onClick$={() => alert(Date())}>minuto</button>
        <button onClick$={() => alert(Date())}>segundo</button> */}
        {/* <button onClick$={() => alert(definicion_CTX_INDEX_VENTA.buscarVentas)}>buscarVentas</button> */}
        {/* <ElSelect
          id="se_periodo_VENTA"
          estilos={{ width: '114px', marginLeft: '5px' }}
          registros={losPeriodosCargados.value}
          registroID={'_id'}
          registroTEXT={'periodo'}
          seleccione={'-- Selecc. periodo --'}
          onChange={$(() => {
            const elSelec = document.getElementById('se_periodo_VENTA') as HTMLSelectElement;
            const elIdx = elSelec.selectedIndex;

            periodo.idPeriodo = elSelec[elIdx].id;
            if (periodo.idPeriodo === '') {
              periodo.periodo = '';
            } else {
              periodo.periodo = elSelec.value;

              parametrosBusqueda.idPeriodo = periodo.idPeriodo;

              buscarVentas.value++;

              definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
            }
          })}
          onKeyPress={$((e: any) => {
            if (e.key === 'Enter') {
              (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
            }
          })}
        /> */}
        {/*   <input
          type="image"
          src={images.searchPLUS}
          title="Refrescar ventas"
          height={16}
          width={16}
          style={{ marginLeft: '2px' }}
          onClick$={() => {
            if (parametrosBusqueda.idPeriodo === '') {
              alert('Debe seleccionar el periodo');
              document.getElementById('se_periodo_VENTA')?.focus();
              return;
            }
            buscarVentas.value++;

            definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
          }}
        />*/}
        {/* <input
          type="button"
          value="pre PLE"
          title="PLE de ventas"
          style={{ marginLeft: '16px' }}
          onClick$={() => {
            // if (parametrosBusqueda.idPeriodo === '') {
            //   alert('Debe seleccionar el periodo');
            //   document.getElementById('se_periodo_VENTA')?.focus();
            //   return;
            // }
            if (definicion_CTX_INDEX_VENTA.miscVts.length === 0) {
              alert('El PLE del presente periodo no presenta datos para exportar.');
              document.getElementById('se_periodo_VENTA')?.focus();

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
        /> */}
        {definicion_CTX_INDEX_VENTA.mostrarPanelVenta && (
          <div class="modal">
            <AddVenta addPeriodo={periodo} igv={igv.value} addPeriodoAnterior={periodoAnterior} contexto="venta" notaDeVenta={[]} />
          </div>
        )}
        {/* <input
          type="image"
          src={images.pdf}
          title="Ver reporte"
          alt="icono pdf"
          height={16}
          width={16}
          style={{ marginLeft: '12px' }}
          onClick$={() => {
            //console.log('ver reporte');
            // verReporte.value++;
            if (definicion_CTX_INDEX_VENTA.miscVts.length === 0) {
              alert('No existen datos para el reporte');
            } else {
              // alert('SIIIIIII existen datos para el reporte');
              // //console.log(definicion_CTX_INDEX_VENTA.miscVts);
              pdfReporteVenta(definicion_CTX_INDEX_VENTA.miscVts);
            }
          }}
        /> */}
      </div>
      {/* TABLA VENTAS */}
      <div id="ventassss" style={{ margin: '8px 0' }}>
        {definicion_CTX_INDEX_VENTA.buscarVentas > 0 ? (
          <TablaVentas
            // buscarVentas={buscarVentas.value}
            parametrosBusqueda={parametrosBusqueda}
            facturacionElectronica={parametrosGlobales.facturacionElectronica}
          />
        ) : (
          ''
        )}
      </div>
      {/* DAR DE BAJA  */}
      {definicion_CTX_INDEX_VENTA.mostrarPanelDarDeBajaDocumentoVenta && (
        <div class="modal">
          <DarDeBajaDocumentoVenta />
        </div>
      )}
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_VENTA.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
    // </main>
  );
});
