import { $, Resource, component$, useContext, useResource$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import style from '../tabla/tabla.css?inline';
import { CTX_INDEX_GUIA_REMISION } from '~/routes/(almacen)/guiaRemision';
import { images } from '~/assets';
// import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import type { IGuiaRemision } from '~/interfaces/iGuiaRemision';

export default component$((props: { buscarGuiasRemision: number; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTO
  const ctx_index_venta = useContext(CTX_INDEX_GUIA_REMISION);
  //#region CONTEXTO

  //#region INICIALIZACION
  const clickPDF = useSignal(0);
  const guiaSeleccionada = useSignal<IGuiaRemision>();

  //#endregion INICIALIZACION

  //#region VER PDF
  const verPDF = $((venta: any) => {
    if (typeof venta.untrackedValue !== 'undefined') {
      // pdfVentaMG(venta.untrackedValue);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDF.value);
    // console.log('a useTask useTask useTask useTask:', clickPDF.value);
    // console.log('a useTask useTask useTask useTask 2:', clickPDF.value + 1);
    await verPDF(guiaSeleccionada);
  });
  //#endregion VER PDF

  //#region BUSCANDO REGISTROS
  const lasGuiasRemision = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => props.buscarGuiasRemision.valueOf());

    // console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const res = await fetch(`${import.meta.env.VITE_URL}/api/guiaRemision/obtenerGuiasRemisionPorPeriodo`, {
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
  // });
  //#endregion CREAR Y DOWNLOAD XML

  return (
    <Resource
      value={lasGuiasRemision}
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
      onResolved={(guiasRemision) => {
        console.log('onResolved 🍓🍓🍓🍓');
        const { data } = guiasRemision; //{ status, data, message }
        const misGuiasRemision: IGuiaRemision[] = data;
        // ctx_index_venta.miscVts = misGuiasRemision;
        ctx_index_venta.mostrarSpinner = false;

        return (
          <>
            {misGuiasRemision.length > 0 ? (
              <>
                <table class="tabla-venta" style={{ fontSize: '0.6em', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Nro. Doc</th>
                      <th>Destinatario</th>
                      <th>Ser-Nro</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misGuiasRemision.map((value, index) => {
                      const indexItem = index + 1;
                      return (
                        <tr key={value._id}>
                          <td data-label="Item" class="comoCadena">
                            {indexItem}
                          </td>
                          <td data-label="Nro. Doc" class="comoCadena">
                            {/* {value.tipoDocumentoIdentidad + ': ' + value.numeroIdentidad} */}
                          </td>
                          <td data-label="Destinatario" class="comoCadena">
                            {/* {value.razonSocialNombre} */}
                          </td>
                          <td data-label="Ser-Nro" class="comoCadena">
                            {/* {value.serie + '-' + cerosALaIzquierda(value.numero, 8)} */}
                          </td>
                          <td data-label="Fecha" class="comoCadena">
                            {/* {formatoDDMMYYYY_PEN(value.fecha)} */}
                          </td>
                          <td data-label="Importe" class="comoNumero">
                            {/* {value.moneda === 'PEN'
                              ? parseFloat(value.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : parseFloat(value.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })} */}
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
                              // onClick$={() => {
                              //   guiaSeleccionada.value = value;
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
                              // onClick$={() => {
                              //   guiaSeleccionada.value = value;
                              //   createAndDownloadFile(value.serie + '-' + value.numero);
                              //   console.log('xml', guiaSeleccionada.value);
                              // }}
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
  );
});
