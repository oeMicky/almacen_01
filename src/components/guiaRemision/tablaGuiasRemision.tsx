import { $, Resource, component$, useContext, useResource$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import style from '../tabla/tabla.css?inline';
import { CTX_INDEX_GUIA_REMISION } from '~/routes/(guiasRemision)/guiaRemision';
import { images } from '~/assets';
// import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes'; cerosALaIzquierda
import type { IGuiaRemision } from '~/interfaces/iGuiaRemision';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';
import { reenviarGuiaRemision } from '~/apis/guiaRemision.api';

export default component$((props: { buscarGuiasRemision: number; parametrosBusqueda: any }) => {
  useStyles$(style);

  //#region CONTEXTO
  const ctx_index_guia_remision = useContext(CTX_INDEX_GUIA_REMISION);
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
        ctx_index_guia_remision.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(guiasRemision) => {
        console.log('onResolved 🍓🍓🍓🍓', guiasRemision);
        const { data } = guiasRemision; //{ status, data, message }
        const misGuiasRemision: IGuiaRemision[] = data;
        // ctx_index_venta.miscVts = misGuiasRemision;
        ctx_index_guia_remision.mostrarSpinner = false;

        return (
          <>
            {misGuiasRemision.length > 0 ? (
              <>
                <table class="tabla-venta" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Ser-Nro</th>
                      <th>Fecha Emision</th>
                      <th>Fecha Ini Trasl</th>
                      <th>Remitente</th>
                      <th>Destinatario</th>
                      <th>Transportista</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misGuiasRemision.map((gr, index) => {
                      const indexItem = index + 1;
                      return (
                        <tr key={gr._id}>
                          <td data-label="Item" class="comoCadena">
                            {indexItem}
                          </td>
                          <td data-label="Ser-Nro" class="comoCadena">
                            {typeof gr.serie !== 'undefined' ? gr.serie + ' - ' : '' + '-'}
                            {typeof gr.numero !== 'undefined' ? cerosALaIzquierda(gr.numero, 8) : ''}
                          </td>
                          <td data-label="Fecha Emision" class="comoCadena">
                            {formatoDDMMYYYY_PEN(gr.fechaEmision)}
                          </td>
                          <td data-label="Fecha Ini Trasl" class="comoCadena">
                            {formatoDDMMYYYY_PEN(gr.fechaInicioTraslado)}
                          </td>
                          <td data-label="Remitente" class="comoCadena">
                            {gr.razonSocialNombreRemitente}
                          </td>
                          <td data-label="Destinatario" class="comoCadena">
                            {gr.razonSocialNombreDestinatario}
                          </td>
                          <td data-label="Transportista" class="comoCadena">
                            {gr.razonSocialNombreTransportista}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              type="image"
                              src={images.resendEmail}
                              title="Reenviar guía de remisión"
                              height={14}
                              width={14}
                              style={{ marginRight: '4px' }}
                              onClick$={async () => {
                                ctx_index_guia_remision.mostrarSpinner = true;
                                await reenviarGuiaRemision({
                                  idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                                  idEmpresa: parametrosGlobales.idEmpresa,
                                  idGuiaRemision: gr._id,
                                });
                                ctx_index_guia_remision.buscarGuiasRemision++;
                                // ctx_index_venta.mostrarSpinner = false;
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
                <i style={{ fontSize: '0.8rem' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
