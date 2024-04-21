import { $, component$, Resource, useContext, useResource$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import {
  cerosALaIzquierda,
  formatoDDMMYYYY_PEN,
  // formatoHH_MM_SS_PEN,
  // formatoYYYY_MM_DD_PEN,
  // redondeo2Decimales,
  // redondeo6Decimales,
} from '~/functions/comunes';
import { images } from '~/assets';
// import styles from '../../components/tabla.css?inline';
import style from '../tabla/tabla.css?inline';
// import ImgButton from '../system/imgButton';
// import pdfFactura98 from '~/reports/98/pdfFactura98.jsx';
// import pdfVentaMG from '~/reports/pdfVentaMG';
import pdfVentaMG from '~/reports/MG/pdfVentaMG';
import type { IReporteVenta, IVenta } from '~/interfaces/iVenta';
import { CTX_INDEX_VENTA } from '~/routes/(almacen)/venta';
import { parametrosGlobales } from '~/routes/login';
import { descargaArchivoVenta } from '~/apis/venta.api';

// interface IEstructura {
//   _id: string;
//   especie: string;
//   numero: number;
// }

export default component$((props: { buscarVentas: number; parametrosBusqueda: any; facturacionElectronica: boolean }) => {
  // console.log('🎫🎫🎫🎫🎫🎫');
  useStylesScoped$(style);

  //#region CONTEXTO
  const ctx_index_venta = useContext(CTX_INDEX_VENTA);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const clickPDF = useSignal(0);
  const ventaSeleccionada = useSignal<IVenta>();
  // let suma_GAxM = 0;
  // let suma_GAxS = 0;
  let suma_TOTAL_IMPORTE_PEN = 0;
  let suma_TOTAL_EFECTIVO_PEN = 0;
  let suma_TOTAL_OTROMONTO_PEN = 0;
  //#endregion INICIALIZACION

  //#region VER PDF
  const verPDF = $((venta: any) => {
    // console.log('a pdfFactura98', venta.untrackedValue); //venta !== null &&
    if (typeof venta.untrackedValue !== 'undefined') {
      // console.log('imprimiendo ... imprimiendo ... imprimiendo ... imprimiendo ...', venta.untrackedValue);
      // pdfFactura98(venta.untrackedValue);
      pdfVentaMG(venta.untrackedValue);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDF.value);
    // console.log('a useTask useTask useTask useTask:', clickPDF.value);
    // console.log('a useTask useTask useTask useTask 2:', clickPDF.value + 1);
    await verPDF(ventaSeleccionada);
  });
  //#endregion VER PDF

  //#region BUSCANDO REGISTROS
  const lasVentas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    console.log('tablaVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => props.buscarVentas.valueOf());

    // console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorPeriodo`, {
    // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorFechas`, {
    // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
    const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/reporteVentasPorFechas`, {
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

  //#region CREAR Y DOWNLOAD TXT
  // const createAndDownloadFile = $((nameFile: string) => {
  //   // const xmltext = '<sometag><someothertag></someothertag></sometag>';
  //   const xmltext = 'hOLA A TODOS';

  //   const filename = nameFile; ///'file.xml';
  //   const pom = document.createElement('a');
  //   const bb = new Blob([xmltext], { type: 'text/plain' });

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
  //   // console.log('first xml');
  // });
  //#endregion CREAR Y DOWNLOAD TXT

  //#region CREAR Y DOWNLOAD JSON
  //   const createAndDownloadFileJSON = $((nameFile: string, archivo: any) => {
  //     //IGV, ISC, IVAP, exoneradas, exportación, gratuitas, inafecta, otrosTributos
  //     let sumaImpuestoIGV = 0;
  //     const sumaImpuestoISC = 0;
  //     const sumaImpuestoIVAP = 0;
  //     let sumaImpuestoEXONERADAS = 0;
  //     let sumaImpuestoEXPORTACION = 0;
  //     let sumaImpuestoGRATUITAS = 0;
  //     let sumaImpuestoINAFECTA = 0;
  //     let sumaImpuestoOTROSTRIBUTOS = 0;
  //     archivo.itemsVenta.map((it: any) => {
  //       // let porcIGV = 0;
  //       // let baseImp = 0;
  //       // porcIGV = archivo.igv.$numberDecimal;
  //       // baseImp = redondeo6Decimales(it.precioPEN.$numberDecimal / (1 + porcIGV / 100));
  //       // if (it.exonerado || it.inafecto) {
  //       //   baseImp = redondeo6Decimales(it.precioPEN.$numberDecimal);
  //       // }
  //       //
  //       if (it.tipoImpuesto === 'IGV') {
  //         sumaImpuestoIGV =
  //           sumaImpuestoIGV + redondeo6Decimales(it.ventaPEN.$numberDecimal / (1 + it.porcentaje.$numberDecimal / 100));
  //       }
  //       if (it.tipoImpuesto === 'ISC') {
  //         // sumaImpuestoISC = sumaImpuestoISC + baseImp;
  //       }
  //       if (it.tipoImpuesto === 'IVAP') {
  //         // sumaImpuestoIVAP = sumaImpuestoIVAP + baseImp;
  //       }
  //       if (it.tipoImpuesto === 'exoneradas') {
  //         sumaImpuestoEXONERADAS = sumaImpuestoEXONERADAS + it.ventaPEN.$numberDecimal;
  //       }
  //       if (it.tipoImpuesto === 'exportación') {
  //         sumaImpuestoEXPORTACION = sumaImpuestoEXPORTACION + it.ventaPEN.$numberDecimal;
  //       }
  //       if (it.tipoImpuesto === 'gratuitas') {
  //         sumaImpuestoGRATUITAS = sumaImpuestoGRATUITAS + it.ventaPEN.$numberDecimal;
  //       }
  //       if (it.tipoImpuesto === 'inafecta') {
  //         sumaImpuestoINAFECTA = sumaImpuestoINAFECTA + it.ventaPEN.$numberDecimal;
  //       }
  //       if (it.tipoImpuesto === 'otrosTributos') {
  //         sumaImpuestoOTROSTRIBUTOS = sumaImpuestoOTROSTRIBUTOS + it.ventaPEN.$numberDecimal;
  //       }
  //     });
  //     let ultimoCaracter = '';
  //     const a2 = sumaImpuestoIGV > 0 ? '"IGV": "' + redondeo2Decimales(sumaImpuestoIGV) + '",' : '';
  //     const b2 = sumaImpuestoISC > 0 ? '"ISC": "' + redondeo2Decimales(sumaImpuestoISC) + '",' : '';
  //     const c2 = sumaImpuestoIVAP > 0 ? '"IVAP": "' + redondeo2Decimales(sumaImpuestoIVAP) + '",' : '';
  //     const d2 = sumaImpuestoEXONERADAS > 0 ? '"exoneradas": "' + redondeo2Decimales(sumaImpuestoEXONERADAS) + '",' : '';
  //     const e2 = sumaImpuestoEXPORTACION > 0 ? '"exportación": "' + redondeo2Decimales(sumaImpuestoEXPORTACION) + '",' : '';
  //     const f2 = sumaImpuestoGRATUITAS > 0 ? '"gratuitas": "' + redondeo2Decimales(sumaImpuestoGRATUITAS) + '",' : '';
  //     const g2 = sumaImpuestoINAFECTA > 0 ? '"inafecta": "' + redondeo2Decimales(sumaImpuestoINAFECTA) + '",' : '';
  //     const h2 = sumaImpuestoOTROSTRIBUTOS > 0 ? '"otrosTributos": "' + redondeo2Decimales(sumaImpuestoOTROSTRIBUTOS) + '",' : '';
  //     let subtotalesIMPUESTOS = a2.trim() + b2.trim() + c2.trim() + d2.trim() + e2.trim() + f2.trim() + g2.trim() + h2.trim();
  //     ultimoCaracter = subtotalesIMPUESTOS.substring(subtotalesIMPUESTOS.length - 1, subtotalesIMPUESTOS.length);
  //     if (ultimoCaracter === ',') {
  //       subtotalesIMPUESTOS = subtotalesIMPUESTOS.substring(0, subtotalesIMPUESTOS.length - 1);
  //     }
  //     subtotalesIMPUESTOS = '\t\t\t\t' + subtotalesIMPUESTOS;

  //     // const xmltext = '<sometag><someothertag></someothertag></sometag>';
  //     // const jsonText = 'hOLA A TODOS';

  //     const a = archivo.igvPEN.$numberDecimal > 0 ? '"totalIGV": "' + redondeo2Decimales(archivo.igvPEN.$numberDecimal) + '",' : '';
  //     const b = archivo.iscPEN.$numberDecimal > 0 ? '"totalISC": "' + redondeo2Decimales(archivo.iscPEN.$numberDecimal) + '",' : '';
  //     // const c = archivo.exportPEN.$numberDecimal > 0 ? '"totalIVAP": "' + archivo.exportPEN.$numberDecimal + '",' : '';
  //     const d =
  //       archivo.otrosPEN.$numberDecimal > 0
  //         ? '"totalOtrostributos": "' + redondeo2Decimales(archivo.otrosPEN.$numberDecimal) + '",'
  //         : '';
  //     const totalesIMPUESTOS = a.trim() + b.trim() + d.trim(); //+ c.trim()
  //     // ultimoCaracter = totalesIMPUESTOS.substring(totalesIMPUESTOS.length - 1, totalesIMPUESTOS.length);
  //     // if (ultimoCaracter === ',') {
  //     //   totalesIMPUESTOS = totalesIMPUESTOS.substring(0, totalesIMPUESTOS.length - 1);
  //     // }
  //     // totalesIMPUESTOS = '\t\t\t' + totalesIMPUESTOS;
  //     //"email": "rmermamg@gmail.com; mvizconde@msn.com; jose_narvaez90@hotmail.com"

  //     const jsonText = `{
  // 	"documentoElectronico": {
  // 		"emisor": {
  // 			"ruc": "${archivo.ruc}",
  // 			"nombreComercial": "${archivo.empresa}",
  // 			"lugarExpedicion": "0000",
  // 			"domicilioFiscal": "${archivo.direccion}"
  // 		},
  // 		"receptor": {
  // 			"tipoDocumento": "${archivo.codigoTipoDocumentoIdentidad}",
  // 			"numDocumento": "${archivo.numeroIdentidad}",
  // 			"razonSocial": "${archivo.razonSocialNombre}",
  // 			"notificar": "${typeof archivo.notificar === 'undefined' ? 'NO' : archivo.notificar ? 'SI' : 'NO'}",
  //       "email": "${archivo.email}"
  // 		},
  // 		"facturaNegociable": {
  // 			"modoPago": "${archivo.metodoPago}",
  // 			"montoNetoPendiente": "0"
  // 		},
  // 		"fechaEmision": "${formatoYYYY_MM_DD_PEN(archivo.fecha)}",
  // 		"horaEmision": "${formatoHH_MM_SS_PEN(archivo.fecha)}",
  // 		"tipoDocumento": "${archivo.codigoTipoComprobantePago}",
  // 		"serie": "${archivo.serie}",
  // 		"correlativo": "${archivo.numero}",
  // 		"codigoTipoOperacion": "0101",
  // 		"producto": [
  //       \t\t${archivo.itemsVenta.map((it: any, index: number) => {
  //         let cadenaAddIMPUESTO = '';
  //         const porcentaje = it.porcentaje.$numberDecimal;
  //         let monto = 0;
  //         let baseImp = 0;
  //         if (it.tipoImpuesto === 'IGV') {
  //           baseImp = redondeo6Decimales(it.ventaPEN.$numberDecimal / (1 + porcentaje / 100));
  //           monto = it.ventaPEN.$numberDecimal - baseImp;
  //           cadenaAddIMPUESTO = `, \n				"IGV": {\n					"porcentaje": "${it.porcentaje.$numberDecimal}",\n					"tipo": "${
  //             it.tipoAfectacionDelImpuesto
  //           }",\n					"monto": "${redondeo2Decimales(monto)}",\n					"baseImponible": "${redondeo2Decimales(baseImp)}" \n				}`;
  //         }
  //         // if (it.tipoImpuesto === 'IVAP') {
  //         // }
  //         // if (it.tipoImpuesto === 'ISC') {
  //         // }
  //         //BOLSAS DE PLASTICO
  //         if (it.tipoImpuesto === 'otrosTributos') {
  //           baseImp = redondeo6Decimales(it.ventaPEN.$numberDecimal / (1 + porcentaje / 100));
  //           monto = it.ventaPEN.$numberDecimal - baseImp;
  //           cadenaAddIMPUESTO = `, \n				"otrosTributos": {\n					"porcentaje": "${it.porcentaje.$numberDecimal}",\n					"tipo": "${
  //             it.tipoAfectacionDelImpuesto
  //           }",\n					"monto": "${redondeo2Decimales(monto)}",\n					"baseImponible": "${redondeo2Decimales(baseImp)}" \n				}`;
  //         }

  //         return `{ "numeroOrden": "${index + 1}",
  // 				"unidadMedida": "${it.unidadEquivalencia}",
  // 				"descripcion": "${it.descripcionEquivalencia}",
  // 				"cantidad": "${it.cantidadEquivalencia.$numberDecimal}",
  // 				"precioVentaUnitarioItem": "${it.precioPEN.$numberDecimal}",
  // 				"valorUnitarioBI": "${redondeo6Decimales(it.precioPEN.$numberDecimal / (1 + porcentaje / 100))}",
  // 				"valorVentaItemQxBI": "${redondeo2Decimales(
  //           it.cantidadEquivalencia.$numberDecimal * redondeo6Decimales(it.precioPEN.$numberDecimal / (1 + porcentaje / 100))
  //         )}",
  // 				"montoTotalImpuestoItem": "${redondeo2Decimales(monto)}"${cadenaAddIMPUESTO}
  //         \t}`;
  //       })}
  // 		],
  // 		"totales": {
  // 			${totalesIMPUESTOS}
  // 			"subtotalValorVenta": "${redondeo2Decimales(archivo.baseImponiblePEN.$numberDecimal)}",
  // 			"montoTotalImpuestos": "${redondeo2Decimales(
  //         parseFloat(archivo.igvPEN.$numberDecimal) +
  //           parseFloat(archivo.iscPEN.$numberDecimal) +
  //           parseFloat(archivo.otrosPEN.$numberDecimal)
  //       )}",
  // 			"importeTotalVenta": "${archivo.totalPEN.$numberDecimal}",
  // 			"importeTotalPagar": "${archivo.totalPEN.$numberDecimal}",
  // 			"subtotal": {
  //      ${subtotalesIMPUESTOS}
  // 			}
  // 		},
  // 		"pago": {
  // 			"moneda": "${archivo.moneda}"
  // 		},
  // 		"idTransaccion": "${archivo.idTransaccion}"
  // 	},
  // 	"ruc": "20610517634",
  // 	"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImRlbW8yMDYxMDUxNzYzNCIsImVtYWlsIjoiSTIwNjEwNTE3NjM0X0lOVF8xIiwibmJmIjoxNzA4NzA1ODE0LCJleHAiOjE3MTQ3NTQyMzQsImlhdCI6MTcwODcwNTgxNH0.-tdxnuzL9wJfMxbwBO6fhzjqwJNMb2LKOio_iOkzjLQ"
  // }`;

  //     const filename = nameFile; ///'file.xml';
  //     const pom = document.createElement('a');
  //     const bb = new Blob([jsonText], { type: 'text/plain' });

  //     pom.setAttribute('href', window.URL.createObjectURL(bb));
  //     // pom.setAttribute('download', filename);
  //     pom.setAttribute('download', filename + '.json');

  //     pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  //     pom.draggable = true;
  //     pom.classList.add('dragout');

  //     pom.click();

  //     // var stupidExample = '<?xml version="1.0" encoding="utf-8"?><aTag>something</aTag>';
  //     // // document.open('data:Application/octet-stream,' + encodeURIComponent(stupidExample));
  //     // window.open('data:application/xml,' + encodeURIComponent(stupidExample), '_self');
  //     // console.log('first xml');
  //   });
  //#endregion CREAR Y DOWNLOAD JSON

  return (
    <>
      <Resource
        value={lasVentas}
        onPending={() => {
          console.log('onPending 🍉🍉🍉🍉');
          //
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          console.log('onRejected 🍍🍍🍍🍍');
          // props.buscarVentas = false;
          ctx_index_venta.mostrarSpinner = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(ventas) => {
          console.log('onResolved 🍓🍓🍓🍓', ventas);
          const { data } = ventas; //{ status, data, message }
          const misVentas: IReporteVenta[] = data;
          ctx_index_venta.miscVts = misVentas;
          ctx_index_venta.mostrarSpinner = false;
          // console.log(misVentas);
          // props.buscarVentas = false;
          return (
            <>
              {misVentas.length > 0 ? (
                <>
                  <table class="tabla-venta" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Nro. Doc</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Ser-Nro</th>
                        <th>Importe</th>
                        <th>Mon</th>
                        <th>Metodo pago</th>
                        <th>Efectivo</th>
                        <th>O. M. Pago</th>
                        <th>Monto O. M. Pago</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misVentas.map((venta, index) => {
                        const indexItem = index + 1;
                        let efec = 0;
                        let otro = 0;
                        let tot = 0;

                        efec =
                          venta.metodoPago === 'CONTADO'
                            ? venta.todoEnEfectivo
                              ? venta.totalPEN.$numberDecimal
                              : venta.montoEnEfectivo.$numberDecimal
                            : 0;
                        //  venta.totalPEN.$numberDecimal ? venta.totalPEN.$numberDecimal : venta.totalPEN;
                        otro = venta.montoOtroMedioPago.$numberDecimal;
                        tot = venta.totalPEN.$numberDecimal ? venta.totalPEN.$numberDecimal : venta.totalPEN;

                        // const aMod: any = venta.ganancias.find((element: any) => element.tipo === 'MERCADERIA');
                        // // console.log('aMod', aMod);
                        // if (typeof aMod !== 'undefined') {
                        //   mer = aMod.gan.$numberDecimal ? aMod.gan.$numberDecimal : aMod.gan;
                        // }
                        // const aSod: any = venta.ganancias.find((element: any) => element.tipo === 'SERVICIO');
                        // // console.log('aSod', aSod);
                        // if (typeof aSod !== 'undefined') {
                        //   ser = aSod.gan.$numberDecimal ? aSod.gan.$numberDecimal : aSod.gan;
                        // }
                        suma_TOTAL_IMPORTE_PEN = suma_TOTAL_IMPORTE_PEN + Number(tot);
                        suma_TOTAL_EFECTIVO_PEN = suma_TOTAL_EFECTIVO_PEN + Number(efec);
                        suma_TOTAL_OTROMONTO_PEN = suma_TOTAL_OTROMONTO_PEN + Number(otro);

                        return (
                          <tr key={venta._id}>
                            <td data-label="Item" class="comoCadena">
                              {indexItem}
                            </td>
                            <td data-label="Nro. Doc" class="comoCadena">
                              {venta.clienteVentasVarias ? '-' : venta.tipoDocumentoIdentidad + ': ' + venta.numeroIdentidad}
                            </td>
                            <td data-label="Cliente" class="comoCadena">
                              {venta.clienteVentasVarias ? 'Cliente ventas varias' : venta.razonSocialNombre}
                            </td>
                            <td data-label="Fecha" class="comoCadena">
                              {formatoDDMMYYYY_PEN(venta.fecha)}
                            </td>
                            <td data-label="Ser-Nro" class="comoCadena">
                              {venta.serie + ' - ' + cerosALaIzquierda(venta.numero, 8)}
                            </td>
                            <td data-label="Importe" class="comoNumero">
                              {venta.moneda === 'PEN'
                                ? parseFloat(venta.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })
                                : parseFloat(venta.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td data-label="Mon" class="acciones">
                              {venta.moneda}
                            </td>
                            <td data-label="Metodo pago" class="comoCadena">
                              {venta.metodoPago}
                            </td>
                            <td data-label="Efectivo" class="comoNumero">
                              {venta.metodoPago === 'CONTADO'
                                ? venta.todoEnEfectivo
                                  ? parseFloat(venta.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                  : parseFloat(venta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                : ''}
                            </td>
                            <td data-label="O. M. Pago" class="comoCadena">
                              {venta.metodoPago === 'CONTADO' ? (venta.todoEnEfectivo ? '' : venta.otroMedioPago) : ''}
                            </td>
                            <td data-label="Monto O. M. Pago" class="comoNumero">
                              {parseFloat(venta.montoOtroMedioPago.$numberDecimal).toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}
                            </td>
                            <td data-label="Acciones" class="acciones">
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.pdf}
                                title="Ver pdf"
                                height={14}
                                width={14}
                                style={{ marginRight: '4px' }}
                                // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                onClick$={async () => {
                                  // ventaSeleccionada.value = venta;
                                  // clickPDF.value++;
                                  const DescarArchi = await descargaArchivoVenta({
                                    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                                    idEmpresa: parametrosGlobales.idEmpresa,
                                    idVenta: venta._id,
                                    tipo: 'PDF',
                                  });
                                  console.log('DescarArchi', DescarArchi);
                                  console.log('DescarArchi.data.archivo', DescarArchi.data.archivo);

                                  const linkSource = `data:application/pdf;base64,${DescarArchi.data.archivo}`;
                                  const downloadLink = document.createElement('a');
                                  const fileName = 'abc.pdf';
                                  downloadLink.href = linkSource;
                                  downloadLink.download = fileName;
                                  downloadLink.click();
                                }}
                              />
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
                          {/* {suma_TOTAL_IMPORTE_PEN} */}
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
