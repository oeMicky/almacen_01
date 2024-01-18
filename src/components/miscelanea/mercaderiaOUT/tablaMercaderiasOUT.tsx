import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import style from '../../tabla/tabla.css?inline';
import { CTX_BUSCAR_MERCADERIA_OUT } from './buscarMercaderiaOUT';
import { IMercaderiaOUT } from '~/interfaces/iMercaderia';
import ImgButton from '~/components/system/imgButton';
import { images } from '~/assets';
// import { exit } from 'process';

export default component$(
  (props: { buscarMercaderiasOUT: number; parametrosBusqueda: any; contexto: string; esAlmacen: boolean }) => {
    useStylesScoped$(style);

    //#region CONTEXTOS
    const ctx_buscar_mercaderia_out = useContext(CTX_BUSCAR_MERCADERIA_OUT);
    //#endregion CONTEXTOS

    //#region BUSCANDO REGISTROS
    const lasMercaderiasOUT = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.buscarMercaderiasOUT.valueOf());

      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      console.log('parametrosBusqueda', props.parametrosBusqueda);

      const res = await fetch(import.meta.env.VITE_URL + '/api/mercaderia/buscarMercaderiasPorDescripcion', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
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
                        <th>Descripción</th>
                        <th>Linea/Tipo</th>
                        <th>Marca</th>
                        <th>Stock</th>
                        <th>Uni</th>
                        {props.esAlmacen ? <th>Costo Promd.PEN</th> : <th>Precio PEN</th>}
                        {/* <th>Precio</th> */}
                        <th>Kx</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misMercaderiasOUT.map((mercaOUTLocali) => {
                        //, index
                        const {
                          _id,
                          descripcion,
                          lineaTipo,
                          marca,
                          totalCantidadSaldo,
                          unidad,
                          precioPEN,
                          promedioCostoUnitarioMovil,
                          KARDEXS,
                        } = mercaOUTLocali;
                        // const indexItem = index + 1;   , costoUnitarioMovil, precio
                        return (
                          <tr
                            key={_id}
                            style={
                              (totalCantidadSaldo.$numberDecimal
                                ? parseFloat(totalCantidadSaldo.$numberDecimal)
                                : totalCantidadSaldo) === 0
                                ? { color: 'red' }
                                : { color: '' }
                            }
                          >
                            <td data-label="Descripción" class="comoCadena">
                              {descripcion}
                            </td>
                            <td data-label="Linea/Tipo" class="comoCadena">
                              {lineaTipo}
                            </td>
                            <td data-label="Marca" class="comoCadena">
                              {marca}
                            </td>
                            <td data-label="Stock" class="comoNumero">
                              {totalCantidadSaldo.$numberDecimal ? totalCantidadSaldo.$numberDecimal : totalCantidadSaldo}
                            </td>
                            <td data-label="Uni" class="acciones">
                              {unidad}
                            </td>
                            {props.esAlmacen ? (
                              <td data-label="Promd.Costo PEN" style={{ textAlign: 'end' }}>
                                {typeof promedioCostoUnitarioMovil !== 'undefined' && promedioCostoUnitarioMovil !== null
                                  ? promedioCostoUnitarioMovil.$numberDecimal
                                    ? promedioCostoUnitarioMovil.$numberDecimal
                                    : promedioCostoUnitarioMovil
                                  : '_'}
                              </td>
                            ) : (
                              <td data-label="Precio PEN" style={{ textAlign: 'end' }}>
                                {typeof precioPEN !== 'undefined' && precioPEN !== null
                                  ? precioPEN.$numberDecimal
                                    ? precioPEN.$numberDecimal
                                    : precioPEN
                                  : '_'}
                              </td>
                            )}
                            {/* <td data-label="Precio">
                            {typeof precio !== 'undefined' ? (precio.$numberDecimal ? precio.$numberDecimal : precio) : '_'}
                          </td> */}
                            <td data-label="Kx" class="acciones">
                              {KARDEXS.length === 0 ? 'No' : 'Si'}
                            </td>
                            <td data-label="Acciones" class="acciones">
                              <ImgButton
                                src={images.check}
                                alt="icono de adicionar"
                                height={12}
                                width={12}
                                title="Seleccionar mercadería"
                                onClick={$(() => {
                                  if (mercaOUTLocali.KARDEXS.length === 0) {
                                    alert('No existe kardex para el producto seleccionado.');
                                    return;
                                  }
                                  if (!props.esAlmacen) {
                                    console.log('!props.esAlmacen', props.esAlmacen, precioPEN);
                                    if (typeof precioPEN === 'undefined' || precioPEN === null) {
                                      mercaOUTLocali.precioPEN = 0;
                                      console.log('typeof precioPEN !== undefined || precioPEN !== null');
                                    }
                                  }
                                  if (mercaOUTLocali.KARDEXS.length === 1) {
                                    ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                    ctx_buscar_mercaderia_out.kK = mercaOUTLocali.KARDEXS[0];
                                    ctx_buscar_mercaderia_out.mostrarPanelMercaderiaOUTSeleccionada = true;
                                    console.log('la mercade seleccionada OUT DIRECTA', ctx_buscar_mercaderia_out.mM);
                                  }
                                  if (mercaOUTLocali.KARDEXS.length > 1) {
                                    ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                    ctx_buscar_mercaderia_out.mostrarPanelKardexsOUT = true;
                                    console.log('la mercade seleccionada OUT -INDIRECTA', ctx_buscar_mercaderia_out.mM);
                                  }
                                })}
                              />
                              <ImgButton
                                src={images.moneyBag}
                                alt="icono de asignar precio"
                                height={12}
                                width={12}
                                title="Asignar precio"
                                onClick={$(() => {
                                  ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  ctx_buscar_mercaderia_out.mostrarPanelAsignarPrecioOUT = true;
                                  // console.log('para precio++++++', ctx_seleccionar_mercaderia_out.mM);
                                  //   ctx_mercaderia_out.mM = mercaOUTLocali;
                                  //   ctx_docs_orden_servicio.mostrarPanelAsignarPrecio = true;
                                })}
                              />
                              {/* <ImgButton
                                src={images.see}
                                alt="icono de asignar precio"
                                height={12}
                                width={12}
                                title="Asignar precio"
                                onClick={$(() => {
                                  console.log('totalCantidadSaldo.$numberDecimal', totalCantidadSaldo.$numberDecimal);
                                })}
                              />
                              <ImgButton
                                src={images.see}
                                alt="icono de asignar precio"
                                height={12}
                                width={12}
                                title="Asignar precio"
                                onClick={$(() => {
                                  console.log('totalCantidadSaldo', totalCantidadSaldo);
                                })}
                              /> */}
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
