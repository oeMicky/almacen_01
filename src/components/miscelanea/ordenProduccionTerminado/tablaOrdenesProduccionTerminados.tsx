import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import style from '../../tabla/tabla.css?inline';
import type { IOrdenProduccion } from '~/interfaces/iOrdenProduccion';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import ImgButton from '~/components/system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import { CTX_BUSCAR_ORDEN_PRODUCCION_TERMINADO } from './buscarOrdenProduccionTerminado';
import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';

export default component$((props: { contexto: string; buscarOrdenesProduccion: number; parametrosBusqueda: any; modoSeleccion: boolean }) => {
  useStyles$(style);

  //#region CONTEXTO
  let ctx: any = [];
  switch (props.contexto) {
    case 'egreso_de_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      break;
    case 'ingreso_a_almacen':
      ctx = useContext(CTX_NEW_IN_ALMACEN);
      break;
  }

  const ctx_buscar_orden_produccion_terminado = useContext(CTX_BUSCAR_ORDEN_PRODUCCION_TERMINADO);
  //#endregion CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasOrdenesProduccion = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarOrdenesProduccion.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //console.log("parametrosBusqueda", props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/ordenProduccion/getOrdenesProduccionTerminadasEntreFechas', {
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

  return (
    <Resource
      value={lasOrdenesProduccion}
      onPending={() => {
        //console.log("onPending 🍉🍉🍉🍉");
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        //console.log("onRejected 🍍🍍🍍🍍");
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ordenesProduccion) => {
        //console.log("onResolved 🍓🍓🍓🍓", ordenesProduccion);
        const { data } = ordenesProduccion; //{ status, data, message }
        const misOrdenesProduccion: IOrdenProduccion[] = data;
        return (
          <>
            {misOrdenesProduccion.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                  <thead>
                    <tr>
                      {/* <th>Ítem</th> */}
                      <th>OP</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Tipo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misOrdenesProduccion.map((ordProducLocali) => {
                      const {
                        _id,
                        fechaInicio,
                        serie,
                        numero,
                        razonSocialNombreCliente,
                        // requisiciones,
                        tipo,
                        clienteVentasVarias,
                      } = ordProducLocali;
                      // const indexItem = index + 1; , index
                      return (
                        <tr key={_id}>
                          {/* <td data-label="Ítem">{indexItem}</td> */}
                          <td data-label="OP" class="comoCadena">
                            {serie + ' - ' + cerosALaIzquierda(numero, 8)}
                          </td>
                          <td data-label="Fecha" class="comoCadena">
                            {fechaInicio ? formatoDDMMYYYY_PEN(fechaInicio) : '_'}
                          </td>
                          <td data-label="Cliente" class="comoCadena">
                            {clienteVentasVarias ? 'Cliente ventas varias' : razonSocialNombreCliente}
                          </td>
                          <td data-label="Tipo" class="comoCadena">
                            {tipo ? tipo : '_'}
                          </td>
                          {/* <td data-label="Precio">{precio.$numberDecimal ? precio.$numberDecimal : '_'}</td> */}
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar producción"
                              height={14}
                              width={14}
                              // style={{ padding: '2px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                // //console.log('first', requisiciones);
                                // if (requisiciones.length === 0) {
                                //   alert(
                                //     `La orden de produccion # ${
                                //       serie + ' - ' + cerosALaIzquierda(numero, 8)
                                //     } no presenta requisiciones.`
                                //   );
                                //   return;
                                // }
                                // //console.log("second");
                                ctx_buscar_orden_produccion_terminado.oO = ordProducLocali;
                                if (props.contexto === 'egreso_de_almacen') {
                                  ctx.mostrarPanelDespachoRequisiciones = true;
                                }
                                if (props.contexto === 'ingreso_a_almacen') {
                                  ctx.mostrarPanelRegistroProductosTerminados = true;
                                }
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
