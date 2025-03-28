import { $, Resource, component$, useContext, useResource$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
// import style from '../tabla.css?inline';
// import style from '../../components/tabla/tabla.css?inline';
import style from '../tabla/tabla.css?inline';
import type { IOrdenServicio } from '~/interfaces/iOrdenServicio';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_INDEX_ORDEN_SERVICIO } from '~/routes/(ordenesServicio)/ordenServicio';
import pdfOsMG from '~/reports/MG/pdfOsMG';
import pdfOsMG_ConVehiculo from '~/reports/MG/pdfOsMG_ConVehiculo';
import pdfInventarioVehicularAlfa from '~/reports/pdfInventarioVehicularAlfa';
import pdfOs_InventarioVehicularBeta from '~/reports/pdfInventarioVehicularBeta';

export default component$((props: { buscarOrdenesServicio: number; parametrosBusqueda: any }) => {
  useStyles$(style);

  //#region CONTEXTOS
  const ctx_index_orden_servicio = useContext(CTX_INDEX_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const clickPDF = useSignal(0);
  const clickPDFInventario = useSignal(0);
  const clickPDFInventario2 = useSignal(0);
  const osSeleccionada = useSignal<IOrdenServicio>();
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const lasOrdenesServicio = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarOrdenesServicio.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // //console.log('parametrosBusqueda', props.parametrosBusqueda);

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

  //#region VISUZALIZAR PDF OS
  const verPDF_OS_Vehiculo = $((os: any) => {
    //console.log('a pdfOsMG', os); //venta !== null &&
    if (typeof os !== 'undefined') {
      //console.log('imprimiendo ... imprimiendo ... verPDF_OS_Vehiculo ...', os);
      // pdfCotizacion98(cotizacion);
      pdfOsMG_ConVehiculo(os);
    }
  });

  const verPDF_OS = $((os: any) => {
    //console.log('a pdfOsMG', os); //venta !== null &&
    if (typeof os !== 'undefined') {
      //console.log('imprimiendo ... imprimiendo ... verPDF_OS ...', os);
      // pdfCotizacion98(cotizacion);
      pdfOsMG(os);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDF.value);
    //console.log('a osSeleccionada.value:', osSeleccionada.value);
    if (osSeleccionada.value?.osConRegistroDeVehiculo) {
      await verPDF_OS_Vehiculo(osSeleccionada.value);
    } else {
      await verPDF_OS(osSeleccionada.value);
    }
  });
  //#endregion VISUZALIZAR PDF OS

  //#region VISUALIZAR PDF INV VEHICULAR
  const verPDF_InventarioVehicular = $((os: any) => {
    //console.log('a pdfOsMG', os); //venta !== null &&
    if (typeof os !== 'undefined') {
      //console.log('imprimiendo ... imprimiendo ... verPDF_INVENTARIO ALFA ...', os);
      // pdfCotizacion98(cotizacion);
      pdfInventarioVehicularAlfa(os);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDFInventario.value);

    //console.log('a osSeleccionada.value:', osSeleccionada.value);

    await verPDF_InventarioVehicular(osSeleccionada.value);
  });
  //#endregion VISUALIZAR PDF INV VEHICULAR

  //#region VISUALIZAR PDF INV VEHICULAR 2
  const verPDF_InventarioVehicular2 = $((os: any) => {
    //console.log('a pdfOsMG', os); //venta !== null &&
    if (typeof os !== 'undefined') {
      //console.log('imprimiendo ... imprimiendo ... verPDF_INVENTARIO BETA ...', os);
      // pdfCotizacion98(cotizacion);
      pdfOs_InventarioVehicularBeta(os);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDFInventario2.value);

    //console.log('a osSeleccionada.value:', osSeleccionada.value);

    await verPDF_InventarioVehicular2(osSeleccionada.value);
  });
  //#endregion VISUALIZAR PDF INV VEHICULAR 2

  return (
    <Resource
      value={lasOrdenesServicio}
      onPending={() => {
        //console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        //console.log('onRejected 🍍🍍🍍🍍');
        ctx_index_orden_servicio.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ordenesServicio) => {
        //console.log('onResolved 🍓🍓🍓🍓');
        const { data } = ordenesServicio; //{ status, data, message }
        const misOrdenesServicio: IOrdenServicio[] = data;
        ctx_index_orden_servicio.mostrarSpinner = false;
        return (
          <>
            {misOrdenesServicio.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter', padding: '4px' }}>
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
                            {fechaInicio ? formatoDDMMYYYY_PEN(fechaInicio) : '-'}
                          </td>
                          <td data-label="Cliente" class="comoCadena">
                            {ordServiLocali.clienteVentasVarias ? 'Cliente ventas varias' : razonSocialNombreCliente}
                          </td>
                          <td data-label="Placa" class="comoCadena">
                            {placa}
                          </td>
                          <td data-label="Estado" class="comoCadena" style={estado === 'APERTURADO' ? { color: '#9103aa' } : {}}>
                            {estado ? estado : '-'}
                          </td>
                          <td data-label="Tipo" class="comoCadena">
                            {tipo ? tipo : '-'}
                          </td>
                          {/* <td data-label="Precio">{precio.$numberDecimal ? precio.$numberDecimal : '-'}</td> */}
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
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                ctx_index_orden_servicio.oO = ordServiLocali;
                                ctx_index_orden_servicio.mostrarPanelNewEditOrdenServicio = true;
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.Inv}
                              title="Imprimir inventario vehicular"
                              height={14}
                              width={14}
                              style={{ marginRight: '8px' }}
                              onClick$={() => {
                                osSeleccionada.value = ordServiLocali;
                                clickPDFInventario.value++;
                              }}
                            />
                            {/* <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.Inv}
                              title="Imprimir inventario vehicular 2"
                              height={14}
                              width={14}
                              style={{ marginRight: '8px' }}
                              onClick$={() => {
                                osSeleccionada.value = ordServiLocali;
                                clickPDFInventario2.value++;
                              }}
                            /> */}
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.pdf}
                              title="Ver pdf "
                              height={14}
                              width={14}
                              // style={{ padding: '2px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
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
