import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import type { IMercaderiaIN } from '~/interfaces/iMercaderia';
import { CTX_INDEX_KARDEX } from '~/routes/(inventario)/kardex';
import style from '../tabla/tabla.css?inline';
import { formatear_2Decimales } from '~/functions/comunes';

export default component$((props: { buscarMercaderiasKARDEX: number; parametrosBusqueda: any; esAlmacen: boolean }) => {
  useStyles$(style);
  //#region CONTEXTOS
  const ctx_index_kardex = useContext(CTX_INDEX_KARDEX);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const lasMercaderiasKARDEX = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarMercaderiasKARDEX.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //console.log('parametrosBusqueda', props.parametrosBusqueda);

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
      value={lasMercaderiasKARDEX}
      onPending={() => {
        //console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        //console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(mercaderias) => {
        console.log('onResolved 🍓🍓🍓🍓', mercaderias);
        const { data } = mercaderias; //{ status, data, message }
        const misMercaderiasKARDEX: IMercaderiaIN[] = data;
        return (
          <>
            {misMercaderiasKARDEX.length > 0 ? (
              <>
                <table style={{ fontSize: '0.9rem', fontWeight: 'lighter ', padding: '2px' }}>
                  <thead>
                    <tr>
                      <th>Descripción</th>
                      <th>Linea/Tipo</th>
                      <th>Marca</th>
                      <th>Ubi</th>
                      <th>Stock</th>
                      <th>Uni</th>
                      {props.esAlmacen ? <th>Costo Promd.Uni PEN</th> : <th>Precio Uni PEN</th>}
                      <th>Kx</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misMercaderiasKARDEX.map((mercaINLocali) => {
                      const {
                        _id,
                        descripcion,
                        lineaTipo,
                        marca,
                        totalCantidadSaldo,
                        unidad,
                        precioUnitarioPEN,
                        promedioCostoUnitarioMovil,
                        KARDEXS,
                        noFacturar,
                        activo,
                        ubigeo,
                      } = mercaINLocali;

                      return (
                        <tr key={_id} style={!activo ? { background: 'black', color: 'white' } : noFacturar ? { background: '#ff5aff' } : {}}>
                          <td data-label="Descripción" class="comoCadena">
                            {descripcion}
                          </td>
                          <td data-label="Linea/Tipo" class="comoCadena">
                            {lineaTipo}
                          </td>
                          <td data-label="Marca" class="comoCadena">
                            {marca}
                          </td>
                          <td data-label="Ubigeo" class="comoNumero">
                            {typeof ubigeo !== 'undefined' && ubigeo !== '' ? ubigeo : '-'}
                          </td>
                          <td data-label="Stock" class="comoNumero">
                            <strong>{totalCantidadSaldo.$numberDecimal ? totalCantidadSaldo.$numberDecimal : totalCantidadSaldo}</strong>
                          </td>
                          <td data-label="Uni" class="comoCadena">
                            {unidad}
                          </td>
                          {props.esAlmacen ? (
                            <td data-label="Costo Promd.Uni PEN" class="comoNumero">
                              {typeof promedioCostoUnitarioMovil !== 'undefined' && promedioCostoUnitarioMovil !== null
                                ? promedioCostoUnitarioMovil.$numberDecimal
                                  ? formatear_2Decimales(promedioCostoUnitarioMovil.$numberDecimal)
                                  : formatear_2Decimales(promedioCostoUnitarioMovil)
                                : '-'}
                            </td>
                          ) : (
                            <td data-label="Precio PEN" class="comoNumero">
                              {typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                                ? precioUnitarioPEN.$numberDecimal
                                  ? precioUnitarioPEN.$numberDecimal
                                  : precioUnitarioPEN
                                : '-'}
                            </td>
                          )}
                          <td data-label="Kx" class="acciones">
                            {KARDEXS.length === 0 ? 'No' : 'Si'}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              type="image"
                              src={images.see}
                              alt="icono de adicionar"
                              height={14}
                              width={14}
                              title="Ver kardex/s"
                              style={{ marginRight: '8px' }}
                              onClick$={() => {
                                //console.log('mercaINLocali', mercaINLocali);
                                if (mercaINLocali.KARDEXS.length === 0) {
                                  alert('No se localizan kardex/s');
                                  // ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  // ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
                                  // //console.log('la mercaSeleccionada IN - length', mercaINLocali.KARDEXS.length);
                                }
                                if (typeof mercaINLocali.porcentajeUtilidad === 'undefined' || mercaINLocali.porcentajeUtilidad === null) {
                                  alert('No se ha definido el porcentaje de utilidad para esta mercadería. Editelo antes de ver el kardex.');
                                  return;
                                }
                                if (mercaINLocali.KARDEXS.length === 1) {
                                  console.log('💥💥💥💥💥☮☮☮☮💥💥💥💥💥💥');
                                  ctx_index_kardex.mM = mercaINLocali;
                                  ctx_index_kardex.kK = mercaINLocali.KARDEXS[0];
                                  ctx_index_kardex.mostrarPanelKARDEX = true;
                                  //console.log('la mercaSeleccionada ', ctx_index_kardex.mM);
                                  //console.log('la mercaSeleccionada KARDEX', ctx_index_kardex.kK);
                                }
                                if (mercaINLocali.KARDEXS.length > 1) {
                                  ctx_index_kardex.mM = mercaINLocali;
                                  ctx_index_kardex.mostrarPanelKARDEXS = true;
                                  //console.log('la mercaSeleccionada KARDEXS', ctx_index_kardex.mM);
                                }
                              }}
                            />
                            <input
                              type="image"
                              src={images.edit}
                              alt="icono de editar"
                              height={14}
                              width={14}
                              title="Editar mercadería"
                              onClick$={() => {
                                ctx_index_kardex.mM = mercaINLocali;
                                ctx_index_kardex.mostrarPanelNewEditMercaderiaIN = true;
                                //   ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                //   ctx_buscar_mercaderia_in.mostrarPanelNewEditMercaderiaIN = true;
                                //console.log('la merca A Editar IN-->', ctx_index_kardex.mM);
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
