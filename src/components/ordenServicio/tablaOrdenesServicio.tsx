import { $, Resource, component$, useContext, useResource$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
// import style from '../tabla.css?inline';
// import style from '../../components/tabla/tabla.css?inline';
import style from '../tabla/tabla.css?inline';
import type { IOrdenServicio } from '~/interfaces/iOrdenServicio';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_INDEX_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import pdfOsMG from '~/reports/MG/pdfOsMG';

export default component$((props: { buscarOrdenesServicio: number; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  const ctx_index_orden_servicio = useContext(CTX_INDEX_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const clickPDF = useSignal(0);
  const osSeleccionada = useSignal<IOrdenServicio>();
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const lasOrdenesServicio = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarOrdenesServicio.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/ordenServicio/getOrdenesServicioPorPeriodo', {
      // const res = await fetch(import.meta.env.VITE_URL + '/api/ordenServicio/getOrdenesServicioEntreFechas', {
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

  //#region VISUZALIZAR PDF
  const verPDF = $((os: any) => {
    console.log('a pdfOsMG', os); //venta !== null &&
    if (typeof os !== 'undefined') {
      console.log('imprimiendo ... imprimiendo ... imprimiendo ...', os);
      // pdfCotizacion98(cotizacion);
      pdfOsMG(os);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDF.value);
    console.log('a osSeleccionada.value:', osSeleccionada.value);
    await verPDF(osSeleccionada.value);
  });
  //#endregion VISUZALIZAR PDF

  return (
    <Resource
      value={lasOrdenesServicio}
      onPending={() => {
        console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log('onRejected 🍍🍍🍍🍍');
        ctx_index_orden_servicio.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ordenesServicio) => {
        console.log('onResolved 🍓🍓🍓🍓');
        const { data } = ordenesServicio; //{ status, data, message }
        const misOrdenesServicio: IOrdenServicio[] = data;
        ctx_index_orden_servicio.mostrarSpinner = false;
        return (
          <>
            {misOrdenesServicio.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      {/* <th>Ítem</th> */}
                      <th>OS</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Placa</th>
                      <th>Estado</th>
                      <th>Tipo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misOrdenesServicio.map((ordServiLocali) => {
                      const { _id, fechaInicio, razonSocialNombreCliente, serie, numero, placa, estado, tipo } = ordServiLocali;
                      // const indexItem = index + 1; , index
                      return (
                        <tr key={_id}>
                          {/* <td data-label="Ítem">{indexItem}</td> */}
                          <td data-label="OS" class="comoCadena">
                            {serie + ' - ' + cerosALaIzquierda(numero, 8)}
                          </td>
                          <td data-label="Fecha" class="comoCadena">
                            {fechaInicio ? formatoDDMMYYYY_PEN(fechaInicio) : '_'}
                          </td>
                          <td data-label="Cliente" class="comoCadena">
                            {ordServiLocali.clienteVentasVarias ? 'Cliente ventas varias' : razonSocialNombreCliente}
                          </td>
                          <td data-label="Placa" class="comoCadena">
                            {placa}
                          </td>
                          <td data-label="Estado" class="comoCadena">
                            {estado ? estado : '_'}
                          </td>
                          <td data-label="Tipo" class="comoCadena">
                            {tipo ? tipo : '_'}
                          </td>
                          {/* <td data-label="Precio">{precio.$numberDecimal ? precio.$numberDecimal : '_'}</td> */}
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar servicio"
                              disabled={estado === 'FACTURADO'}
                              height={14}
                              width={14}
                              style={{ marginRight: '8px' }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                ctx_index_orden_servicio.oO = ordServiLocali;
                                ctx_index_orden_servicio.mostrarPanelNewEditOrdenServicio = true;
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.pdf}
                              title="Ver pdf "
                              height={14}
                              width={14}
                              // style={{ padding: '2px' }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                osSeleccionada.value = ordServiLocali;
                                clickPDF.value++;
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
