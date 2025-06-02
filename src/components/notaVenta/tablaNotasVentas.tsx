import { $, component$, Resource, useContext, useResource$, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import {
  cerosALaIzquierda,
  // hoy,
  redondeo2Decimales,
  // formatoDDMMYYYY_PEN,
  // formatoHH_MM_SS_PEN,
  // formatoYYYY_MM_DD_PEN,
  // redondeo2Decimales,
  // redondeo6Decimales,
} from '~/functions/comunes';
import { images } from '~/assets';
// import styles from '../../components/tabla.css?inline';
import style from '../tabla/tabla.css?inline';

import type { IReporteNotaVenta } from '~/interfaces/iVenta'; //IVenta
import { parametrosGlobales } from '~/routes/login';
import { getIgvVenta } from '~/apis/venta.api';
import { CTX_INDEX_NOTA_VENTA } from '~/routes/(ventas)/notaVenta';
import { useNavigate } from '@builder.io/qwik-city';
import { getNotaVenta } from '~/apis/notaVenta.api';
import pdfNotaVenta from '~/reports/pdfNotaVenta';
import pdfNotasVentaDelDia from '~/reports/pdfNotasVentaDelDia';

//ejecutarCreacionXML

// interface IEstructura {
//   _id: string;
//   especie: string;
//   numero: number;   buscarNotasVentas: number;
// }      facturacionElectronica: boolean

export default component$((props: { parametrosBusqueda: any; periodosCargados: any }) => {
  //   console.log('🎫🎫🎫🎫🎫🎫');
  useStyles$(style);

  //#region CONTEXTO
  const ctx_index_nota_venta = useContext(CTX_INDEX_NOTA_VENTA);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const navegarA = useNavigate();
  // const clickPDFDia = useSignal(0);
  const clickPDF = useSignal(0);
  const idNotaVentaSeleccionada = useSignal('');
  const igv = useSignal(0);

  const periodo = useStore({ idPeriodo: '', periodo: '' });
  const periodoAnterior = useStore({ idPeriodo: '', periodo: '' });

  let suma_TOTAL_EFECTIVO_PEN = 0;
  let suma_TOTAL_IMPORTE_PEN = 0;
  let suma_TOTAL_OTROMONTO_PEN = 0;
  let suma_TOTAL_CREDITO_PEN = 0;
  //#endregion INICIALIZACION

  //#region VER PDF DIA
  const verPDFDia = $((notasVenta: any) => {
    pdfNotasVentaDelDia(notasVenta);
    // }
  });

  // useTask$(async ({ track }) => {
  //   track(() => clickPDFDia.value);
  //   //OBTENIENDO LA VENTA
  //   if (clickPDFDia.value > 0) {
  //     // const notaVentaSeleccionada = await getNotaVenta({
  //     //   idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     //   idEmpresa: parametrosGlobales.idEmpresa,
  //     //   idNotaVenta: idNotaVentaSeleccionada.value,
  //     // });

  //     // if (notaVentaSeleccionada.data.length === 1) {
  //       await verPDFDia();
  //     // }
  //   }
  // });
  //#endregion VER PDF DIA

  //#region VER PDF
  const verPDF = $((notaVenta: any) => {
    pdfNotaVenta(notaVenta);
    // }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDF.value);
    //OBTENIENDO LA VENTA
    if (clickPDF.value > 0) {
      const notaVentaSeleccionada = await getNotaVenta({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idNotaVenta: idNotaVentaSeleccionada.value,
      });

      if (notaVentaSeleccionada.data.length === 1) {
        await verPDF(notaVentaSeleccionada.data[0]);
      }
    }
  });
  //#endregion VER PDF

  //#region BUSCANDO REGISTROS
  const lasNotasVentas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaNotasVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    // track(() => props.buscarNotasVentas.valueOf());
    track(() => ctx_index_nota_venta.buscarNotasVentas);

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const res = await fetch(`${import.meta.env.VITE_URL}/api/notaVenta/reporteNotasVentasPorFechas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.parametrosBusqueda),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

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

  //#region CREAR Y DOWNLOAD XML
  // const createAndDownloadFileXML = $((nameFile: string, xmlString: string) => {
  //   // const xmltext = '<sometag><someothertag></someothertag></sometag>';
  //   // const texto = 'hOLA A TODOS';

  //   const filename = nameFile; ///'file.xml';
  //   const pom = document.createElement('a');
  //   const bb = new Blob([xmlString], { type: 'text/xml' });

  //   pom.setAttribute('href', window.URL.createObjectURL(bb));
  //   // pom.setAttribute('download', filename);
  //   pom.setAttribute('download', filename + '.xml');

  //   pom.dataset.downloadurl = ['text/xml', pom.download, pom.href].join(':');
  //   pom.draggable = true;
  //   pom.classList.add('dragout');

  //   pom.click();

  // });
  //#endregion CREAR Y DOWNLOAD XML

  return (
    <>
      <Resource
        value={lasNotasVentas}
        onPending={() => {
          //console.log('onPending 🍉🍉🍉🍉');
          //
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          //console.log('onRejected 🍍🍍🍍🍍');
          // props.buscarNotasVentas = false;
          ctx_index_nota_venta.mostrarSpinner = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(notasVentas) => {
          console.log('onResolved 🍓🍓🍓🍓g', notasVentas);
          const { data } = notasVentas; //{ status, data, message }
          const misNotasVentas: IReporteNotaVenta[] = data;
          ctx_index_nota_venta.miscNtsVts = misNotasVentas;
          ctx_index_nota_venta.mostrarSpinner = false;
          // //console.log(misNotasVentas);
          // props.buscarNotasVentas = false;
          return (
            <>
              {misNotasVentas.length > 0 ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '6px' }}>
                    <input
                      title="Ver en pdf"
                      type="image"
                      src={images.print}
                      height={21.5}
                      width={21.5}
                      style={{ marginRight: '6px' }}
                      onClick$={async () => {
                        // alert('Generando PDF... espere por favor.');
                        // console.log('misNotasVentas', misNotasVentas);
                        verPDFDia(misNotasVentas);
                        // ctx_index_nota_venta.mostrarSpinner = true;

                        // ctx_index_nota_venta.buscarNotasVentas++;
                        // ctx_index_nota_venta.NV = notaVenta;
                        // ctx_index_nota_venta.mostrarPanelNotaVenta = true;
                        // ctx_index_nota_venta.mostrarPanelVerNotaVenta = true;
                      }}
                    />
                    <input
                      title="Descargar"
                      type="image"
                      src={images.download}
                      height={21.5}
                      width={21.5}
                      style={{ marginRight: '6px' }}
                      onClick$={async () => {
                        // alert('Datos KARDEX.');
                        // console.log(misNotasVentas.length);
                        ctx_index_nota_venta.mostrarSpinner = true;
                        //FECHA HORA LOCAL
                        // const elHoy = hoy();
                        const elHoy = misNotasVentas[0].fechaLocal; //hoy();
                        // console.log('elHoy', elHoy);

                        const fechaLocal = elHoy; // elHoy.substring(0, 2) + '/' + elHoy.substring(4, 6) + '/' + elHoy.substring(8, 12);
                        // const fechaLocal_2 = elHoy.substring(8, 10) + '-' + elHoy.substring(5, 7) + '-' + elHoy.substring(0, 4);

                        // const hhhhDate = new Date();
                        // const horaLocal =
                        //   cerosALaIzquierda(hhhhDate.getHours(), 2) +
                        //   ':' +
                        //   cerosALaIzquierda(hhhhDate.getMinutes(), 2) +
                        //   ':' +
                        //   cerosALaIzquierda(hhhhDate.getSeconds(), 2);
                        // const horaLocal_2 =
                        //   cerosALaIzquierda(hhhhDate.getHours(), 2) +
                        //   '-' +
                        //   cerosALaIzquierda(hhhhDate.getMinutes(), 2) +
                        //   '-' +
                        //   cerosALaIzquierda(hhhhDate.getSeconds(), 2);

                        let aExportar = '';
                        aExportar = 'NOTAS DE VENTA - ' + parametrosGlobales.sucursal + ': ' + fechaLocal + '|\n';
                        aExportar += '\n';
                        aExportar += 'ITEM|CLIENTE|OBSERVACION|SER-NUM|IMPORTE|MON|MET.PAGO|EFECTIVO|O.M.PAGO|MON.O.M.P.|CREDITO|\n';
                        misNotasVentas.map((com: any, index: number) => {
                          const {
                            clienteSobrenombreChapa,
                            observacion,
                            serie,
                            numero,
                            totalPEN,
                            moneda,
                            metodoPago,
                            montoEnEfectivo,
                            otroMedioPago,
                            montoOtroMedioPago,
                            importeTotalCuotasCredito,
                          } = com;
                          const elIndex = index + 1;
                          // const bI = typeof baseImponiblePEN === 'undefined' ? '' : baseImponiblePEN.$numberDecimal;
                          // const iGV = typeof igvPEN === 'undefined' ? '' : igvPEN.$numberDecimal;
                          // const adNO = typeof adquisicionesNoGravadasPEN === 'undefined' ? '' : adquisicionesNoGravadasPEN.$numberDecimal;
                          // const isc = typeof iscPEN === 'undefined' ? '' : iscPEN.$numberDecimal;
                          // const icbp = typeof icbpPEN === 'undefined' ? '' : icbpPEN.$numberDecimal;
                          // const otros = typeof otrosPEN === 'undefined' ? '' : otrosPEN.$numberDecimal;
                          // const total = typeof totalPEN === 'undefined' ? '' : totalPEN.$numberDecimal;
                          // const detra = typeof detraccion === 'undefined' ? '' : detraccion;
                          // const detraConsta = typeof detraccionConstancia === 'undefined' ? '' : detraccionConstancia;
                          // const detraM = typeof detraccionMontoPEN === 'undefined' ? '' : detraccionMontoPEN.$numberDecimal;
                          // const detraPorc = typeof detraccionPorcentaje === 'undefined' ? '' : detraccionPorcentaje.$numberDecimal;

                          aExportar =
                            aExportar +
                            elIndex +
                            '|' +
                            clienteSobrenombreChapa +
                            '|' +
                            observacion +
                            '|' +
                            serie +
                            '-' +
                            cerosALaIzquierda(numero, 8) +
                            '|' +
                            (typeof totalPEN !== 'undefined' && totalPEN !== null
                              ? totalPEN.$numberDecimal
                                ? redondeo2Decimales(totalPEN.$numberDecimal)
                                : redondeo2Decimales(totalPEN)
                              : '-') +
                            '|' +
                            moneda +
                            '|' +
                            metodoPago +
                            '|' +
                            (typeof montoEnEfectivo !== 'undefined' && montoEnEfectivo !== null
                              ? montoEnEfectivo.$numberDecimal
                                ? redondeo2Decimales(montoEnEfectivo.$numberDecimal)
                                : redondeo2Decimales(montoEnEfectivo)
                              : '-') +
                            '|' +
                            otroMedioPago +
                            '|' +
                            (typeof montoOtroMedioPago !== 'undefined' && montoOtroMedioPago !== null
                              ? montoOtroMedioPago.$numberDecimal
                                ? redondeo2Decimales(montoOtroMedioPago.$numberDecimal)
                                : redondeo2Decimales(montoOtroMedioPago)
                              : '-') +
                            '|' +
                            (typeof importeTotalCuotasCredito !== 'undefined' && importeTotalCuotasCredito !== null
                              ? importeTotalCuotasCredito.$numberDecimal
                                ? redondeo2Decimales(importeTotalCuotasCredito.$numberDecimal)
                                : redondeo2Decimales(importeTotalCuotasCredito)
                              : '-') +
                            '\n';
                        });
                        // console.log('aExportar', aExportar);

                        // // createAndDownloadFile('elPLE' + periodo.periodo, 'Hola a todos desde el PLE');
                        createAndDownloadFile('NotasVentasss_' + parametrosGlobales.sucursal + '_' + fechaLocal, aExportar);

                        ctx_index_nota_venta.mostrarSpinner = false;
                        alert('Archivo descargado.');
                      }}
                    />
                  </div>
                  <table class="tabla-venta" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Cliente</th>
                        <th>Observación</th>
                        <th>Fecha</th>
                        <th>Ser-Nro</th>
                        <th>Importe</th>
                        <th>Mon</th>
                        <th>Método pago</th>
                        <th>Efectivo</th>
                        <th>O. M. Pago</th>
                        <th>Monto O. M. Pago</th>
                        <th>Crédito</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misNotasVentas.map((notaVenta, index) => {
                        const indexItem = index + 1;
                        let efec = 0;
                        let otro = 0;
                        let cred = 0;
                        let tot = 0;

                        // console.log('notaVenta.montoEnEfectivo', notaVenta.montoEnEfectivo);

                        efec = notaVenta.montoEnEfectivo.$numberDecimal ? notaVenta.montoEnEfectivo.$numberDecimal : notaVenta.montoEnEfectivo;

                        otro = notaVenta.montoOtroMedioPago.$numberDecimal ? notaVenta.montoOtroMedioPago.$numberDecimal : notaVenta.montoOtroMedioPago;
                        cred = notaVenta.importeTotalCuotasCredito.$numberDecimal
                          ? notaVenta.importeTotalCuotasCredito.$numberDecimal
                          : notaVenta.importeTotalCuotasCredito;
                        tot = notaVenta.totalPEN.$numberDecimal ? notaVenta.totalPEN.$numberDecimal : notaVenta.totalPEN;

                        suma_TOTAL_EFECTIVO_PEN = suma_TOTAL_EFECTIVO_PEN + Number(efec);
                        suma_TOTAL_IMPORTE_PEN = suma_TOTAL_IMPORTE_PEN + Number(tot);
                        suma_TOTAL_OTROMONTO_PEN = suma_TOTAL_OTROMONTO_PEN + Number(otro);
                        suma_TOTAL_CREDITO_PEN = suma_TOTAL_CREDITO_PEN + Number(cred);

                        return (
                          <tr key={notaVenta._id} style={notaVenta.metodoPago === 'CRÉDITO' ? { color: 'purple', fontWeight: 'bold' } : {}}>
                            <td data-label="Item">{cerosALaIzquierda(indexItem, 3)}</td>
                            <td data-label="Cliente">{notaVenta.clienteSobrenombreChapa ? notaVenta.clienteSobrenombreChapa : '-'}</td>
                            <td data-label="Observación">{notaVenta.observacion ? notaVenta.observacion : '-'}</td>
                            <td data-label="Fecha">
                              {notaVenta.fechaLocal.substring(0, 2) + '/' + notaVenta.fechaLocal.substring(3, 5) + '/' + notaVenta.fechaLocal.substring(6, 10)}
                            </td>
                            <td data-label="Ser-Nro">
                              {notaVenta.serie + ' - ' + cerosALaIzquierda(notaVenta.numero, 8)}
                              {notaVenta.existeOtros ? <img src={images.puntoAzul} alt="Punto verde" width="12" height="12" /> : ''}
                            </td>
                            <td data-label="Importe" class="comoNumeroLeft">
                              {notaVenta.moneda === 'PEN'
                                ? parseFloat(notaVenta.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })
                                : parseFloat(notaVenta.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td data-label="Mon">{notaVenta.moneda}</td>
                            <td data-label="Metodo pago" style={notaVenta.metodoPago === 'CRÉDITO' ? { fontWeight: 'bold' } : {}}>
                              {notaVenta.metodoPago}
                            </td>
                            <td data-label="Efectivo" class="comoNumeroLeft">
                              {parseFloat(notaVenta.montoEnEfectivo.$numberDecimal) === 0
                                ? '-'
                                : parseFloat(notaVenta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                              {/* {notaVenta.metodoPago === 'CONTADO'
                                ? notaVenta.todoEnEfectivo
                                  ? parseFloat(notaVenta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                  : parseFloat(notaVenta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                : notaVenta.unaParteEnEfectivo
                                ? parseFloat(notaVenta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })
                                : '-'} */}
                            </td>
                            <td data-label="O. M. Pago">{notaVenta.otroMedioPago ? notaVenta.otroMedioPago : '-'}</td>
                            <td data-label="Monto O. M. Pago" class="comoNumeroLeft">
                              {parseFloat(notaVenta.montoOtroMedioPago.$numberDecimal) === 0
                                ? '-'
                                : parseFloat(notaVenta.montoOtroMedioPago.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td data-label="Crédito" class="comoNumeroLeft">
                              {parseFloat(notaVenta.importeTotalCuotasCredito.$numberDecimal) === 0
                                ? '-'
                                : parseFloat(notaVenta.importeTotalCuotasCredito.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td data-label="Acciones" class="accionesLeft">
                              <input
                                type="image"
                                src={images.print}
                                title="Imprimir"
                                height={14}
                                width={14}
                                style={{ marginRight: '6px' }}
                                onClick$={async () => {
                                  // ctx_index_nota_venta.NV = notaVenta;
                                  // ctx_index_nota_venta.mostrarPanelNotaVenta = true;
                                  ctx_index_nota_venta.mostrarSpinner = true;
                                  idNotaVentaSeleccionada.value = notaVenta._id;
                                  clickPDF.value++;
                                  ctx_index_nota_venta.mostrarSpinner = false;
                                }}
                              />
                              <input
                                type="image"
                                src={images.see}
                                title="Ver detalle"
                                height={14}
                                width={14}
                                style={{ marginRight: '6px' }}
                                onClick$={async () => {
                                  // ctx_index_nota_venta.mostrarSpinner = true;

                                  // ctx_index_nota_venta.buscarNotasVentas++;
                                  ctx_index_nota_venta.NV = notaVenta;
                                  // ctx_index_nota_venta.mostrarPanelNotaVenta = true;
                                  ctx_index_nota_venta.mostrarPanelVerNotaVenta = true;
                                }}
                              />
                              {notaVenta.metodoPago === 'CONTADO' ? (
                                <input
                                  type="image"
                                  src={images.crOK}
                                  title="Es crédito"
                                  height={14}
                                  width={14}
                                  style={{ marginRight: '6px' }}
                                  onClick$={() => {
                                    if (
                                      confirm(
                                        notaVenta.serie +
                                          '-' +
                                          cerosALaIzquierda(notaVenta.numero, 8) +
                                          '. Desea convertir esta nota de venta al CONTADO en CRÉDITO? -- ADVERTENCIA: esta operación NO es reversible.'
                                      )
                                    ) {
                                      // ctx_index_in_almacen.mostrarPanelNewInAlmacen = false;
                                      console.log('entro a cerrar el formulario');
                                    } else {
                                      console.log('NO entro a cerrar el formulario');
                                    }
                                  }}
                                />
                              ) : (
                                ''
                              )}

                              {typeof notaVenta.idVenta === 'undefined' || notaVenta.idVenta.trim() === '' ? (
                                <input
                                  type="image"
                                  src={images.arrowRight}
                                  title="Facturar..."
                                  height={14}
                                  width={14}
                                  // style={{ marginRight: '4px' }}
                                  onClick$={async () => {
                                    if (parametrosGlobales.idGrupoEmpresarial === '') {
                                      // console.log('estaVACIA');
                                      alert('Faltan datos... vuelva a logearse..');
                                      navegarA('/login');
                                      return;
                                    }
                                    //INICIALIZANDO
                                    ctx_index_nota_venta.notaVentaENVIADA.idNotaVenta = '';
                                    ctx_index_nota_venta.notaVentaENVIADA.serieNotaVenta = '';
                                    ctx_index_nota_venta.notaVentaENVIADA.numeroNotaVenta = 0;
                                    ctx_index_nota_venta.notaVentaENVIADA.detalle = [];
                                    //validar PERIODO
                                    let anioAnterior = '';
                                    let mesAnterior = '';
                                    const anio = (document.getElementById('in_laFechaHoyVenta') as HTMLInputElement).value.substring(0, 4);
                                    const mes = (document.getElementById('in_laFechaHoyVenta') as HTMLInputElement).value.substring(5, 7);

                                    const periodoActual = anio + mes;
                                    const PPP = props.periodosCargados;
                                    if (parseInt(mes) === 1) {
                                      anioAnterior = (parseInt(anio) - 1).toString();
                                      mesAnterior = '12';
                                    } else {
                                      anioAnterior = anio;
                                      mesAnterior = cerosALaIzquierda(parseInt(mes) - 1, 2).toString();
                                    }
                                    const periodoANTE = anioAnterior + mesAnterior;

                                    const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(periodoActual));
                                    console.log('⚠⚠⚠⚠ elPeriodo', elPeriodo);
                                    if (typeof elPeriodo === 'undefined') {
                                      alert(`🔰 El período ${periodoActual} no ha sido hallado, verifique.`);
                                      return;
                                    }
                                    periodo.idPeriodo = elPeriodo._id;
                                    periodo.periodo = elPeriodo.periodo;

                                    const elPeriodoAnterior: any = PPP.find((ele: any) => ele.periodo === parseInt(periodoANTE));
                                    periodoAnterior.idPeriodo = elPeriodoAnterior._id;
                                    periodoAnterior.periodo = elPeriodoAnterior.periodo;

                                    if (periodo.idPeriodo === '') {
                                      alert('🔰 Seleccione el periodo.');
                                      document.getElementById('se_periodo')?.focus();
                                      // ini.value++;
                                      return;
                                    }
                                    ctx_index_nota_venta.mostrarSpinner = true;

                                    let elIgv = await getIgvVenta({
                                      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                                      idEmpresa: parametrosGlobales.idEmpresa,
                                    });
                                    elIgv = elIgv.data;
                                    //
                                    igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //

                                    ctx_index_nota_venta.notaVentaENVIADA.idNotaVenta = notaVenta._id;
                                    ctx_index_nota_venta.notaVentaENVIADA.serieNotaVenta = notaVenta.serie;
                                    ctx_index_nota_venta.notaVentaENVIADA.numeroNotaVenta = notaVenta.numero;
                                    ctx_index_nota_venta.notaVentaENVIADA.igv = igv.value;
                                    ctx_index_nota_venta.notaVentaENVIADA.detalle = notaVenta.itemsNotaVenta;
                                    ctx_index_nota_venta.notaVentaENVIADA.addPeriodo = periodo;
                                    ctx_index_nota_venta.notaVentaENVIADA.addPeriodoAnterior = periodoAnterior;

                                    console.log('ctx_index_nota_venta', ctx_index_nota_venta);

                                    ctx_index_nota_venta.mostrarPanelVenta = true;
                                  }}
                                />
                              ) : (
                                ''
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5} class="comoNumero" style={{ color: '#2E1800' }}>
                          TOTALES PEN
                        </td>
                        <td class="comoNumero" style={{ color: '#2E1800' }}>
                          {`${suma_TOTAL_IMPORTE_PEN.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td colSpan={2} class="comoCadena" style={{ color: '#2E1800' }}></td>
                        <td class="comoNumero" style={{ color: '#2E1800' }}>
                          {`${suma_TOTAL_EFECTIVO_PEN.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero"></td>
                        <td class="comoNumero" style={{ color: '#2E1800' }}>
                          {`${suma_TOTAL_OTROMONTO_PEN.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero" style={{ color: '#2E1800' }}>
                          {`${suma_TOTAL_CREDITO_PEN.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero"></td>
                      </tr>
                    </tfoot>
                  </table>
                </>
              ) : (
                <div>
                  <i style={{ fontSize: '0.8rem' }}>No se encontraron registros</i>
                </div>
              )}
            </>
          );
        }}
      />
    </>
  );
});

{
  /* {notaVenta.fechaLocal.substring(8, 10) + '/' + notaVenta.fechaLocal.substring(5, 7) + '/' + notaVenta.fechaLocal.substring(0, 4)} */
}
// import ImgButton from '../system/imgButton';
// import pdfFactura98 from '~/reports/98/pdfFactura98.jsx';
// import pdfVentaMG from '~/reports/pdfVentaMG';
// import pdfVentaMG from '~/reports/MG/pdfVentaMG';
// import pdfFactura00 from '~/reports/pdfFactura00';

// const aMod: any = notaVenta.ganancias.find((element: any) => element.tipo === 'MERCADERIA');
// // //console.log('aMod', aMod);
// if (typeof aMod !== 'undefined') {
//   mer = aMod.gan.$numberDecimal ? aMod.gan.$numberDecimal : aMod.gan;
// }
// const aSod: any = notaVenta.ganancias.find((element: any) => element.tipo === 'SERVICIO');
// // //console.log('aSod', aSod);
// if (typeof aSod !== 'undefined') {
//   ser = aSod.gan.$numberDecimal ? aSod.gan.$numberDecimal : aSod.gan;
// }
// console.log('efec', efec, notaVenta.montoEnEfectivo.$numberDecimal, notaVenta.montoEnEfectivo);

// efec =
//   notaVenta.metodoPago === 'CONTADO'
//     ? notaVenta.todoEnEfectivo
//       ? notaVenta.totalPEN.$numberDecimal
//       : notaVenta.montoEnEfectivo.$numberDecimal
//     : 0;
//  notaVenta.totalPEN.$numberDecimal ? notaVenta.totalPEN.$numberDecimal : notaVenta.totalPEN;

// const ventaSeleccionada = useSignal<IVenta>();
// let suma_GAxM = 0;
// let suma_GAxS = 0;
