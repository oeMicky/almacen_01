import { $, Resource, component$, useContext, useResource$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_VENTA } from '~/routes/(almacen)/factura';
import { CTX_ADD_VENTA } from '../venta/addVenta';
import { CTX_MERCA_SELECCIONADA } from './busquedaMercaderiaOUT';

export interface IMercaderia {
  _id: string;
  descripcion: string;
  lineaTipo: string;

  totalCantidadSaldo: any;
  costoUnitarioMovil: any;
  precio: any;
  unidad: string;
}

export default component$(
  (props: { buscarMercaderias: number; parametrosBusqueda: any; esAlmacen: boolean; seleccionado: any }) => {
    const ctx_PanelVenta = useContext(CTX_VENTA);
    const ctx_Add_Venta = useContext(CTX_ADD_VENTA);
    const ctx_Merca_Seleccionada = useContext(CTX_MERCA_SELECCIONADA);

    const lasMercaderias = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      console.log('tablaVentas ->->-> parameBusqueda', props.parametrosBusqueda);
      track(() => props.buscarMercaderias.valueOf());

      console.log('props.buscarMercaderias.valueOf', props.buscarMercaderias.valueOf());
      // if (props.buscarVentas.valueOf()) {
      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      console.log('FETCH->: ', `http://localhost:4000/api/mercaderia/buscarMercaderiasPorDescripcion`);
      const res = await fetch(`http://localhost:4000/api/mercaderia/buscarMercaderiasPorDescripcion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    });

    return (
      <Resource
        value={lasMercaderias}
        onPending={() => {
          console.log('onPending 🍉🍉🍉🍉');
          //
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          console.log('onRejected 🍍🍍🍍🍍');
          // props.buscarVentas = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(mercaderias) => {
          console.log('onResolved 🍓🍓🍓🍓');
          const { status, data, message } = mercaderias;
          const misMercaderias: IMercaderia[] = data;
          // props.buscarVentas = false;
          return (
            <>
              {misMercaderias.length > 0 ? (
                <>
                  <table style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Linea/Tipo</th>
                        <th>Stock</th>
                        <th>Uni</th>
                        {props.esAlmacen ? <th>Costo</th> : <th>Precio</th>}
                        <th>Ac</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misMercaderias.map((merca, index) => {
                        // const indexItem = index + 1;
                        return (
                          <tr key={merca._id}>
                            {/* <td id={_id}>{codigo}</td> */}
                            <td>{merca.descripcion}</td>
                            <td>{merca.lineaTipo}</td>
                            <td style={{ textAlign: 'end' }}>
                              {merca.totalCantidadSaldo.$numberDecimal
                                ? merca.totalCantidadSaldo.$numberDecimal
                                : merca.totalCantidadSaldo}
                            </td>
                            <td>{merca.unidad}</td>
                            {props.esAlmacen ? (
                              <td style={{ textAlign: 'end' }}>
                                {merca.costoUnitarioMovil != null
                                  ? merca.costoUnitarioMovil.$numberDecimal
                                    ? merca.costoUnitarioMovil.$numberDecimal
                                    : merca.costoUnitarioMovil
                                  : ''}
                              </td>
                            ) : (
                              <td style={{ textAlign: 'end' }}>
                                {merca.precio != null
                                  ? merca.precio.$numberDecimal
                                    ? merca.precio.$numberDecimal
                                    : merca.precio
                                  : ''}
                              </td>
                            )}

                            <td style={{ textAlign: 'center' }}>
                              <ImgButton
                                src={images.check}
                                alt="icono de adicionar"
                                height={12}
                                width={12}
                                title="Adicionar item-mercadería"
                                onClick={$(() => {
                                  ctx_Merca_Seleccionada.mS = merca;
                                  ctx_PanelVenta.mostrarSeleccionarEquivalenciaEnSalida = true;
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
                                // onClick={() => {
                                //   asignarPrecio({ _id });
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
  }
);
