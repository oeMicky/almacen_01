import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
// import style from '../tabla.css?inline';
// import style from '../../components/tabla/tabla.css?inline';
import style from '../tabla/tabla.css?inline';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
// import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { IMercaderiaOUT } from '~/interfaces/iMercaderia';
import { CTX_MERCADERIA_OUT } from './busquedaMercaderiaOUT';

export default component$((props: { esAlmacen: boolean; buscarMercaderiaOUT: number; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  const ctx_mercaderia_out = useContext(CTX_MERCADERIA_OUT);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const lasMercaderiasOUT = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarMercaderiaOUT.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.parametrosBusqueda.por === 'Código') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/servicio/obtenerVehiculosPorPlaca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.por === 'Descripción') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/mercaderia/buscarMercaderiasPorDescripcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={lasMercaderiasOUT}
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
        const misMercaderiasOUT: IMercaderiaOUT[] = data;
        return (
          <>
            {misMercaderiasOUT.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter ' }}>
                  <thead>
                    <tr>
                      {/* <th>Ítem</th> */}
                      <th>Descripción</th>
                      <th>Linea/Tipo</th>
                      <th>Stock</th>
                      <th>Uni</th>
                      {props.esAlmacen ? <th>Costo</th> : <th>Precio</th>}
                      {/* <th>Precio</th> */}
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misMercaderiasOUT.map((mercaOUTLocali) => {
                      //, index
                      const { _id, descripcion, lineaTipo, totalCantidadSaldo, unidad, precio, costo } = mercaOUTLocali;
                      // const indexItem = index + 1;   , costoUnitarioMovil, precio
                      return (
                        <tr key={_id}>
                          {/* <td data-label="Ítem">{indexItem}</td> */}
                          <td data-label="Descripción">{descripcion}</td>
                          <td data-label="Linea/Tipo">{lineaTipo}</td>
                          <td data-label="Stock">
                            {totalCantidadSaldo.$numberDecimal ? totalCantidadSaldo.$numberDecimal : totalCantidadSaldo}
                          </td>
                          <td data-label="Uni">{unidad}</td>
                          {props.esAlmacen ? (
                            <td data-label="Costo">
                              {typeof costo !== 'undefined' ? (costo.$numberDecimal ? costo.$numberDecimal : costo) : '_'}
                            </td>
                          ) : (
                            <td data-label="Precio">
                              {typeof precio !== 'undefined' ? (precio.$numberDecimal ? precio.$numberDecimal : precio) : '_'}
                            </td>
                          )}
                          {/* <td data-label="Precio">
                            {typeof precio !== 'undefined' ? (precio.$numberDecimal ? precio.$numberDecimal : precio) : '_'}
                          </td> */}
                          <td data-label="Acciones" style={{ textAlign: 'right' }}>
                            <ImgButton
                              src={images.check}
                              alt="icono de adicionar"
                              height={12}
                              width={12}
                              title="Adicionar item-mercadería"
                              onClick={$(() => {
                                try {
                                  console.log('mercaOUTLocali', mercaOUTLocali);
                                  ctx_mercaderia_out.mM = mercaOUTLocali;
                                  ctx_docs_orden_servicio.mostrarPanelMercaderiaSeleccionadaOUT = true;
                                } catch (error) {
                                  console.log('error', error);
                                }
                              })}
                              // onClick={() => {
                              //   seleccionar({
                              //     _id,
                              //     codigo,
                              //     costoUnitarioMovil,
                              //     descripcion,
                              //     totalCantidadSaldo,
                              //     idLineaTipo,
                              //     lineaTipo,
                              //     kardex,
                              //     idUnidad,
                              //     unidad,
                              //     conFechaVencimientoLote,
                              //     cantidad,
                              //     precio,
                              //     equivalencias,
                              //   });
                              // }}
                            />
                            <ImgButton
                              src={images.moneyBag}
                              alt="icono de asignar precio"
                              height={12}
                              width={12}
                              title="Asignar precio"
                              onClick={$(() => {
                                ctx_mercaderia_out.mM = mercaOUTLocali;
                                ctx_docs_orden_servicio.mostrarPanelAsignarPrecio = true;
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
