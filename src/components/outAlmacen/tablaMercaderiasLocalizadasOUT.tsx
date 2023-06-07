import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
// import { CTX_ADD_VENTA } from '../venta/addVenta';
import { CTX_MERCA_SELECCIONADA } from './busquedaMercaderiaOUT';
import style from '../tabla.css?inline';

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
    useStylesScoped$(style);

    //#region CONTEXTOS
    const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
    // const ctx_Add_Venta = useContext(CTX_ADD_VENTA);
    const ctx_Merca_Seleccionada = useContext(CTX_MERCA_SELECCIONADA);
    //#endregion CONTEXTOS

    //#region BUSCANDO REGISTROS
    const lasMercaderias = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      console.log('tablaVentas ->->-> parameBusqueda', props.parametrosBusqueda);
      track(() => props.buscarMercaderias.valueOf());

      console.log('props.buscarMercaderias.valueOf', props.buscarMercaderias.valueOf());
      // if (props.buscarVentas.valueOf()) {
      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      // console.log('FETCH->: ', `http://localhost:4000/api/mercaderia/buscarMercaderiasPorDescripcion`);
      // const res = await fetch(`http://localhost:4000/api/mercaderia/buscarMercaderiasPorDescripcion`, {
      const res = await fetch(`${import.meta.env.VITE_URL}/api/mercaderia/buscarMercaderiasPorCodigo`, {
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
          const { data } = mercaderias; //{ status, data, message } status,, message
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
                      {misMercaderias.map((merca) => {
                        //, index
                        // const indexItem = index + 1;
                        return (
                          <tr key={merca._id}>
                            {/* <td id={_id}>{codigo}</td> */}
                            <td data-label="Descripción">{merca.descripcion}</td>
                            <td data-label="Linea/Tipo">{merca.lineaTipo ? merca.lineaTipo : '_'}</td>
                            {/* <td data-label="Linea/Tipo">{'_'}</td> */}
                            <td data-label="Stock" style={{ textAlign: 'end' }}>
                              {merca.totalCantidadSaldo.$numberDecimal
                                ? merca.totalCantidadSaldo.$numberDecimal
                                : merca.totalCantidadSaldo}
                            </td>
                            <td data-label="Uni">{merca.unidad ? merca.unidad : '_'}</td>
                            {props.esAlmacen ? (
                              <td data-label="Costo" style={{ textAlign: 'end' }}>
                                {merca.costoUnitarioMovil !== null
                                  ? merca.costoUnitarioMovil.$numberDecimal
                                    ? merca.costoUnitarioMovil.$numberDecimal
                                    : merca.costoUnitarioMovil
                                  : ''}
                              </td>
                            ) : (
                              <td data-label="Precio" style={{ textAlign: 'end' }}>
                                {merca.precio
                                  ? merca.precio !== null
                                    ? merca.precio.$numberDecimal
                                      ? merca.precio.$numberDecimal
                                      : merca.precio
                                    : ''
                                  : '_'}
                              </td>
                            )}

                            <td data-label="Acciones" style={{ textAlign: 'right' }}>
                              <ImgButton
                                src={images.check}
                                alt="icono de adicionar"
                                height={12}
                                width={12}
                                title="Adicionar item-mercadería"
                                onClick={$(() => {
                                  ctx_Merca_Seleccionada.mS = merca;
                                  ctx_docs_venta.mostrarSeleccionarEquivalenciaEnSalida = true;
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
