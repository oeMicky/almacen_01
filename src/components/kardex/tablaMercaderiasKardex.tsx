import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import type { IMercaderiaIN_BUSCAR } from '~/interfaces/iMercaderia';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import style from '../tabla/tabla.css?inline';
import { cerosALaIzquierda, formatear_2Decimales } from '~/functions/comunes';
import { verUbigeoAntiguo } from '~/apis/mercaderia.api';

export default component$(
  (props: { buscarMercaderiasKARDEX: number; parametrosBusqueda: any; esAlmacen: boolean; verTODOS: boolean; visualizarStocksCeros: boolean }) => {
    useStyles$(style);
    //#region CONTEXTOS
    const ctx_index_inventario = useContext(CTX_INDEX_INVENTARIO);
    //#endregion CONTEXTOS

    //#region BUSCANDO REGISTROS
    const lasMercaderiasKARDEX = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.buscarMercaderiasKARDEX.valueOf());

      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      //console.log('parametrosBusqueda', props.parametrosBusqueda);
      if (props.verTODOS) {
        const res = await fetch(import.meta.env.VITE_URL + '/api/mercaderia/buscarMercaderiasPorDescripcionTODOS', {
          // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(props.parametrosBusqueda),
          signal: abortController.signal,
        });
        return res.json();
      } else {
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
      }

      // const res = await fetch(import.meta.env.VITE_URL + '/api/mercaderia/buscarMercaderiasPorDescripcion', {
      //   // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(props.parametrosBusqueda),
      //   signal: abortController.signal,
      // });
      // return res.json();
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
          ctx_index_inventario.mostrarSpinner = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(mercaderias) => {
          // console.log('onResolved 🍓🍓🍓🍓', mercaderias);
          const { data } = mercaderias; //{ status, data, message }    , padding: '2px'
          const misMercaderiasKARDEX: IMercaderiaIN_BUSCAR[] = data;
          ctx_index_inventario.mostrarSpinner = false;
          ctx_index_inventario.kK = data;
          return (
            <>
              {misMercaderiasKARDEX.length > 0 ? (
                <>
                  <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                    <thead>
                      <tr>
                        <th>Ítem</th>
                        <th>idMercaderia</th>
                        <th>Descripción</th>
                        <th>Linea/Tipo</th>
                        <th>Marca</th>
                        {/* <th>Ubi</th> */}
                        <th>Stock</th>
                        <th>Uni</th>
                        {/* {props.esAlmacen ? <th>Costo PEN + IGV</th> : <th>Precio Uni PEN</th>} */}
                        <th>Costo PEN + IGV</th>
                        <th>Precio PEN</th>
                        {/* <th>Kx</th> */}
                        {/* <th>Obs</th> */}
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misMercaderiasKARDEX.map((mercaINLocali, index) => {
                        const elIndex = index + 1;
                        const {
                          _id,
                          descripcion,
                          lineaTipo,
                          marca,
                          // totalCantidadSaldo,
                          unidad,
                          costoUnitarioPENMasIGV,
                          precioUnitarioPEN,
                          stockMinimo,
                          // promedioCostoUnitarioMovil,
                          // observacion,
                          idKardex,
                          sumStocks,
                          // KARDEXS,
                          noFacturar,
                          activo,
                          ubigeo,
                        } = mercaINLocali;
                        let elSM = 0;
                        // let elTCS = 0;
                        let laSumStocks = 0;
                        if (typeof stockMinimo === 'undefined' || stockMinimo === null) {
                          elSM = 0;
                        } else {
                          elSM = stockMinimo.$numberDecimal ? parseFloat(stockMinimo.$numberDecimal) : stockMinimo;
                        }
                        // if (typeof totalCantidadSaldo === 'undefined' || totalCantidadSaldo === null) {
                        //   elTCS = 0;
                        // } else {
                        //   elTCS = totalCantidadSaldo.$numberDecimal ? parseFloat(totalCantidadSaldo.$numberDecimal) : totalCantidadSaldo;
                        // }
                        if (typeof sumStocks === 'undefined' || sumStocks === null) {
                          laSumStocks = 0;
                        } else {
                          laSumStocks = sumStocks.$numberDecimal ? parseFloat(sumStocks.$numberDecimal) : sumStocks;
                        }
                        // console.log(' 🍍🍍🍍🍍', elSM, laSumStocks);

                        return (
                          // <tr key={_id} style={!activo ? { background: 'black', color: 'white' } : noFacturar ? { background: '#ff5aff' } : {}}>
                          <tr
                            key={_id}
                            style={
                              !activo
                                ? { background: '#272727', color: 'white', display: props.visualizarStocksCeros ? '' : 'none' }
                                : noFacturar
                                ? { background: '#ff5aff', display: props.visualizarStocksCeros ? '' : 'none' }
                                : laSumStocks === 0
                                ? { color: 'red', display: props.visualizarStocksCeros ? '' : 'none' }
                                : {}
                            }
                            // hidden={props.visualizarStocksCeros}
                            hidden
                            // style={{ background: 'white', color: 'black' }}
                            // style={laSumStocks === 0 ? { background: 'white', color: 'red' } : {}}
                          >
                            <td data-label="Ítem">{cerosALaIzquierda(elIndex, 3)}</td>
                            <td data-label="idMercaderia">{_id}</td>
                            <td data-label="Descripción" style={{ fontWeight: 'bold' }}>
                              {elSM >= laSumStocks ? (
                                <img src={images.flagRed} alt="Bandera roja" width="12" height="12" />
                              ) : elSM + 5 >= laSumStocks ? (
                                <img src={images.flagAmber} alt="Bandera ambar" width="12" height="12" />
                              ) : (
                                ''
                              )}
                              {descripcion}
                            </td>
                            <td data-label="Linea/Tipo">{lineaTipo}</td>
                            <td data-label="Marca">{marca}</td>
                            {/* <td data-label="Ubigeo">{typeof ubigeo !== 'undefined' && ubigeo !== null && ubigeo !== '' ? ubigeo : '-'}</td> */}
                            <td data-label="Stock" class="comoNumeroLeft">
                              {/* <strong>{totalCantidadSaldo.$numberDecimal ? totalCantidadSaldo.$numberDecimal : totalCantidadSaldo}</strong> */}
                              {typeof idKardex !== 'undefined' ? (
                                <button
                                  style={{ color: 'purple', fontWeight: 'bold', cursor: 'pointer' }}
                                  onClick$={() => {
                                    ctx_index_inventario.descripcion = descripcion;
                                    ctx_index_inventario.elIdKardex = idKardex;
                                    ctx_index_inventario.mM = mercaINLocali;
                                    // ctx.kK = mercaINLocali.KARDEXS[0];
                                    // ctx.mostrarPanelMercaderiaINSeleccionada = true;
                                    ctx_index_inventario.mostrarPanelVerListaUbigeos = true;
                                    ctx_index_inventario.mostrarSpinner = true;
                                  }}
                                >
                                  {laSumStocks}
                                </button>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td data-label="Uni">{unidad}</td>
                            {/* {props.esAlmacen ? (
                            <td data-label="Costo Promd.Uni PEN" class="comoNumeroLeft">
                              {typeof promedioCostoUnitarioMovil !== 'undefined' && promedioCostoUnitarioMovil !== null
                                ? promedioCostoUnitarioMovil.$numberDecimal
                                  ? formatear_2Decimales(promedioCostoUnitarioMovil.$numberDecimal)
                                  : formatear_2Decimales(promedioCostoUnitarioMovil)
                                : '-'}
                            </td>
                          ) : ( */}
                            <td data-label="Costo PEN + IGV" class="comoNumeroLeft" style={{ fontWeight: 'bold' }}>
                              {typeof costoUnitarioPENMasIGV !== 'undefined' && costoUnitarioPENMasIGV !== null
                                ? costoUnitarioPENMasIGV.$numberDecimal
                                  ? formatear_2Decimales(costoUnitarioPENMasIGV.$numberDecimal)
                                  : formatear_2Decimales(costoUnitarioPENMasIGV)
                                : '-'}
                            </td>
                            <td data-label="Precio PEN" class="comoNumeroLeft" style={{ fontWeight: 'bold' }}>
                              {typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                                ? precioUnitarioPEN.$numberDecimal
                                  ? formatear_2Decimales(precioUnitarioPEN.$numberDecimal)
                                  : formatear_2Decimales(precioUnitarioPEN)
                                : '-'}
                            </td>
                            {/* )} */}
                            {/* <td data-label="Kx">{KARDEXS.length === 0 ? 'No' : 'Si'}</td> */}
                            {/* <td data-label="Obs">{observacion ? observacion : '-'}</td> */}
                            <td data-label="Acciones" class="accionesLeft">
                              <input
                                title="Ver kardex/s"
                                type="image"
                                src={images.see}
                                alt="icono de adicionar"
                                height={14}
                                width={14}
                                style={{ marginRight: '8px' }}
                                onClick$={() => {
                                  //console.log('mercaINLocali', mercaINLocali);
                                  if (mercaINLocali.idKardex === '' || mercaINLocali.idKardex === null || mercaINLocali.idKardex === undefined) {
                                    alert('El ítem seleccionado no presenta kardex.');
                                    return;
                                  }
                                  // if (mercaINLocali.KARDEXS.length === 0) {
                                  //   alert('No se localizan kardex/s');
                                  //   // ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  //   // ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
                                  //   // //console.log('la mercaSeleccionada IN - length', mercaINLocali.KARDEXS.length);
                                  // }
                                  if (typeof mercaINLocali.porcentajeUtilidad === 'undefined' || mercaINLocali.porcentajeUtilidad === null) {
                                    alert('No se ha definido el porcentaje de utilidad para esta mercadería. Editelo antes de ver el kardex.');
                                    return;
                                  }
                                  // if (mercaINLocali.KARDEXS.length === 1) {
                                  console.log('💥💥💥💥💥☮☮☮☮💥💥💥💥💥💥');
                                  ctx_index_inventario.mM = mercaINLocali;
                                  // ctx_index_inventario.kK = mercaINLocali.KARDEXS[0];
                                  ctx_index_inventario.elIdKardex = mercaINLocali.idKardex; //mercaINLocali.KARDEXS[0];
                                  ctx_index_inventario.mostrarPanelKARDEX = true;
                                  //console.log('la mercaSeleccionada ', ctx_index_inventario.mM);
                                  //console.log('la mercaSeleccionada KARDEX', ctx_index_inventario.kK);
                                  // }
                                  // if (mercaINLocali.KARDEXS.length > 1) {
                                  //   ctx_index_inventario.mM = mercaINLocali;
                                  //   ctx_index_inventario.mostrarPanelKARDEXS = true;
                                  //   //console.log('la mercaSeleccionada KARDEXS', ctx_index_inventario.mM);
                                  // }
                                }}
                              />
                              <input
                                title="Editar mercadería"
                                type="image"
                                src={images.edit}
                                // alt="icono de editar"
                                height={14}
                                width={14}
                                style={{ cursor: 'pointer', marginRight: '8px' }}
                                onClick$={() => {
                                  ctx_index_inventario.mM = mercaINLocali;
                                  ctx_index_inventario.mostrarPanelNewEditMercaderiaIN = true;
                                  //   ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  //   ctx_buscar_mercaderia_in.mostrarPanelNewEditMercaderiaIN = true;
                                  //console.log('la merca A Editar IN-->', ctx_index_inventario.mM);
                                }}
                              />
                              <input
                                title="Editar ubigeo"
                                type="image"
                                src={images.ubigeo}
                                height={14}
                                width={14}
                                style={{ marginRight: '8px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  // if (mercaINLocali.KARDEXS.length === 0) {
                                  //   alert('El ítem seleccionado no presenta kardex.');
                                  //   return;
                                  // }

                                  // if (mercaINLocali.KARDEXS.length === 1) {
                                  //   console.log('🍔🍟🍟🍟🍟 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);

                                  // ctx_index_inventario.elIdKardex = mercaINLocali.KARDEXS[0]._id;
                                  ctx_index_inventario.elUBIGEO = ubigeo;
                                  ctx_index_inventario.mostrarPanelVerUbigeoAntiguo = true;
                                  console.log('🍔🍔🍔🍔🍔 mercaINLocali.KARDEXS.length', ctx_index_inventario.elIdKardex, ctx_index_inventario.elUBIGEO);
                                  // }
                                  // if (mercaINLocali.KARDEXS.length > 1) {
                                  //   console.log('🥗🥗🥗🥗🥗 mercaOUTLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);
                                  //   ctx.mM = mercaINLocali;
                                  //   ctx.mostrarPanelKardexsIN = true;
                                  // }

                                  // ctx_buscar_mercaderia_out.mostrarSpinner = true;
                                  //console.log('la merca A Editar IN', ctx.mM);
                                }}
                              />

                              <input
                                title="Editar precio público"
                                type="image"
                                src={images.moneyBag}
                                height={14}
                                width={14}
                                style={{ marginRight: '8px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  if (typeof mercaINLocali.porcentajeUtilidad === 'undefined' || mercaINLocali.porcentajeUtilidad === null) {
                                    alert('No se ha definido el porcentaje de utilidad para esta mercadería. Editelo antes de ver el kardex.');
                                    return;
                                  }
                                  console.log('🍟🍟🍟🍟');

                                  ctx_index_inventario.idMercaderia = mercaINLocali._id;
                                  ctx_index_inventario.descripcion = mercaINLocali.descripcion;
                                  ctx_index_inventario.cuMASigv =
                                    typeof mercaINLocali.costoUnitarioPENMasIGV !== 'undefined' && mercaINLocali.costoUnitarioPENMasIGV !== null
                                      ? mercaINLocali.costoUnitarioPENMasIGV.$numberDecimal
                                        ? mercaINLocali.costoUnitarioPENMasIGV.$numberDecimal
                                        : mercaINLocali.costoUnitarioPENMasIGV
                                      : 0;
                                  // mercaINLocali.costoUnitarioPENMasIGV.$numberDecimal? mercaINLocali.costoUnitarioPENMasIGV.$numberDecimal;
                                  ctx_index_inventario.pUtilidad = mercaINLocali.porcentajeUtilidad.$numberDecimal;
                                  ctx_index_inventario.precioUnitarioPEN =
                                    typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                                      ? precioUnitarioPEN.$numberDecimal
                                        ? formatear_2Decimales(precioUnitarioPEN.$numberDecimal)
                                        : formatear_2Decimales(precioUnitarioPEN)
                                      : 0;
                                  ctx_index_inventario.mostrarPanelEditPrecioPublicoIN = true;
                                  console.log('🍔🍔🍔🍔🍔🍔');
                                  // ctx.mostrarSpinner = true;

                                  //console.log('la merca A Editar IN', ctx.mM);
                                }}
                              />
                              <input
                                title="Ver ubigeo antiguo"
                                type="image"
                                src={images.xo}
                                height={14}
                                width={14}
                                style={{ marginRight: '8px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={async () => {
                                  const resp = await verUbigeoAntiguo({ idMercaderia: mercaINLocali._id });
                                  // console.log('resp ubigeo', resp.data);
                                  alert('El ubigeo antiguo es: ' + resp.data[0].ubigeo);
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
  }
);
