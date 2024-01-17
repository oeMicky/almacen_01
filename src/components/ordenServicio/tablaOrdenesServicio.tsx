import { $, Resource, component$, useContext, useResource$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
// import style from '../tabla.css?inline';
// import style from '../../components/tabla/tabla.css?inline';
import style from '../tabla/tabla.css?inline';
import { IOrdenServicio } from '~/interfaces/iOrdenServicio';
import ImgButton from '../system/imgButton';
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

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/ordenServicio/getOrdenesServicioEntreFechas', {
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
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ordenesServicio) => {
        console.log('onResolved 🍓🍓🍓🍓', ordenesServicio);
        const { data } = ordenesServicio; //{ status, data, message }
        const misOrdenesServicio: IOrdenServicio[] = data;
        return (
          <>
            {misOrdenesServicio.length > 0 ? (
              <>
                <table style={{ fontSize: '0.6em', fontWeight: 'lighter' }}>
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
                            {razonSocialNombreCliente}
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
                            {/* <ImgButton
                              src={images.check}
                              alt="icono de adicionar"
                              height={12}
                              width={12}
                              title="Seleccionar servicio"
                              onClick={$(() => {
                                // ctx_servicio_seleccionado._id = _id;
                                // ctx_servicio_seleccionado.codigo = codigo;
                                // ctx_servicio_seleccionado.descripcion = descripcion;
                                // ctx_servicio_seleccionado.precio = precio;
                                // ctx_docs_orden_servicio.mostrarPanelSeleccionarServicio0 = false;
                                // ctx_docs_orden_servicio.selecciono_Servicio0 = true;
                              })}
                            /> */}
                            <ImgButton
                              src={images.edit}
                              alt="icono de editar"
                              height={14}
                              width={14}
                              title="Editar servicio"
                              onClick={$(() => {
                                ctx_index_orden_servicio.oO = ordServiLocali;
                                ctx_index_orden_servicio.mostrarPanelNewEditOrdenServicio = true;
                              })}
                            />
                            <ImgButton
                              src={images.pdf}
                              alt="icono de pdf"
                              height={14}
                              width={14}
                              title={`Ver pdf ${ordServiLocali._id}`}
                              onClick={$(() => {
                                osSeleccionada.value = ordServiLocali;
                                clickPDF.value++;
                              })}
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
