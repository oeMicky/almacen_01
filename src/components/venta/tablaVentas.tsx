import { $, component$, Resource, useContext, useResource$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { images } from '~/assets';
// import styles from '../../components/tabla.css?inline';
import style from '../tabla/tabla.css?inline';
// import ImgButton from '../system/imgButton';
// import pdfFactura98 from '~/reports/98/pdfFactura98.jsx';
// import pdfVentaMG from '~/reports/pdfVentaMG';
import pdfVentaMG from '~/reports/MG/pdfVentaMG';
import type { IVenta } from '~/interfaces/iVenta';
import { CTX_INDEX_VENTA } from '~/routes/(almacen)/venta';

// interface IEstructura {
//   _id: string;
//   especie: string;
//   numero: number;
// }

export default component$((props: { buscarVentas: number; parametrosBusqueda: any }) => {
  // console.log('🎫🎫🎫🎫🎫🎫');
  useStylesScoped$(style);

  //#region CONTEXTO
  const ctx_index_venta = useContext(CTX_INDEX_VENTA);
  //#region CONTEXTO

  //#region INICIALIZACION
  const clickPDF = useSignal(0);
  const ventaSeleccionada = useSignal<IVenta>();

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
    // console.log('tablaVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => props.buscarVentas.valueOf());

    // console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorPeriodo`, {
      // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorFechas`, {
      // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
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

  //#region CREAR Y DOWNLOAD XML
  const createAndDownloadFile = $((nameFile: string) => {
    // const xmltext = '<sometag><someothertag></someothertag></sometag>';
    const xmltext = 'hOLA A TODOS';

    const filename = nameFile; ///'file.xml';
    const pom = document.createElement('a');
    const bb = new Blob([xmltext], { type: 'text/plain' });

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
    // console.log('first xml');
  });
  //#endregion CREAR Y DOWNLOAD XML

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
          const misVentas: IVenta[] = data;
          ctx_index_venta.miscVts = misVentas;
          ctx_index_venta.mostrarSpinner = false;
          // console.log(misVentas);
          // props.buscarVentas = false;
          return (
            <>
              {misVentas.length > 0 ? (
                <>
                  <table class="tabla-venta" style={{ fontSize: '0.6em', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Nro. Doc</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Ser-Nro</th>
                        <th>Importe</th>
                        <th>Mon</th>
                        <th>Pago</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misVentas.map((value, index) => {
                        const indexItem = index + 1;
                        return (
                          <tr key={value._id}>
                            <td data-label="Item" class="comoCadena">
                              {indexItem}
                            </td>
                            <td data-label="Nro. Doc" class="comoCadena">
                              {value.tipoDocumentoIdentidad + ': ' + value.numeroIdentidad}
                            </td>
                            <td data-label="Cliente" class="comoCadena">
                              {value.razonSocialNombre}
                            </td>
                            <td data-label="Fecha" class="comoCadena">
                              {formatoDDMMYYYY_PEN(value.fecha)}
                            </td>
                            <td data-label="Ser-Nro" class="comoCadena">
                              {value.serie + ' - ' + cerosALaIzquierda(value.numero, 8)}
                            </td>
                            <td data-label="Importe" class="comoNumero">
                              {value.moneda === 'PEN'
                                ? parseFloat(value.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })
                                : parseFloat(value.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td data-label="Mon" class="acciones">
                              {value.moneda}
                            </td>
                            <td data-label="Pago" class="comoCadena">
                              {value.metodoPago}
                            </td>
                            <td data-label="Acciones" class="acciones">
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.pdf}
                                title="Ver pdf"
                                height={12}
                                width={12}
                                style={{ margin: '2px' }}
                                // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  ventaSeleccionada.value = value;
                                  clickPDF.value++;
                                }}
                              />
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.os}
                                title="Ver OS"
                                hidden={!(typeof value.idOrdenServicio !== 'undefined' && value.idOrdenServicio !== '')}
                                height={12}
                                width={12}
                                style={{ margin: '2px' }}
                                // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                // onClick$={() => {
                                //   ventaSeleccionada.value = value;
                                //   clickPDF.value++;
                                // }}
                              />
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.xml}
                                title="Ver xml"
                                height={12}
                                width={12}
                                style={{ margin: '2px' }}
                                // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  ventaSeleccionada.value = value;
                                  createAndDownloadFile(value.serie + ' - ' + value.numero);
                                  console.log('xml', ventaSeleccionada.value);
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) : (
                <div>
                  <i style={{ fontSize: '0.7rem' }}>No se encontraron registros</i>
                </div>
              )}
            </>
          );
        }}
      />
    </>
  );
});
