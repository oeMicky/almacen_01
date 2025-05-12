import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import ImgButton from '~/components/system/imgButton';
import type { IMercaderiaIN_BUSCAR } from '~/interfaces/iMercaderia';
import style from '../../tabla/tabla.css?inline';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import { cerosALaIzquierda, formatear_2Decimales, formatear_6Decimales } from '~/functions/comunes';
import { CTX_REGISTRO_PRODUCTOS_TERMINADOS } from '../ordenProduccionTerminado/registroProductosTerminados';

export default component$(
  (props: {
    buscarMercaderiasIN: number;
    parametrosBusqueda: any;
    contextoInmediato: string;
    esAlmacen: boolean;
    enDolares?: boolean;
    tipoCambio?: any;
    verAplicacion: boolean;
    verLineaMarca: boolean;
    verTODOS: boolean;
    motivo?: string;
  }) => {
    useStyles$(style);

    //#region CONTEXTOS
    let ctx: any = [];
    switch (props.contextoInmediato) {
      // case 'new_in_almacen':
      //   ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
      //   break;
      case 'buscar_mercaderia_in':
        ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
        break;
      case 'registro_productos_terminados':
        ctx = useContext(CTX_REGISTRO_PRODUCTOS_TERMINADOS);
        break;
      // case 'new_edit_guiaRemision':
      //   ctx = useContext(CTX_DOCS_COTIZACION);
      //   break;
      // case 'new_edit_cotizacion':
      //   ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      //   break;
    }
    // const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
    //#endregion CONTEXTOS

    //#region BUSCANDO REGISTROS
    const lasMercaderiasIN = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.buscarMercaderiasIN.valueOf());

      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      //console.log('parametrosBusqueda', props.parametrosBusqueda);

      if (props.parametrosBusqueda.buscarPor === 'Descripción') {
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
      }
      if (props.parametrosBusqueda.buscarPor === 'Aplicación') {
        if (props.verTODOS) {
          const res = await fetch(import.meta.env.VITE_URL + '/api/mercaderia/buscarMercaderiasPorAplicacionTODOS', {
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
          const res = await fetch(import.meta.env.VITE_URL + '/api/mercaderia/buscarMercaderiasPorAplicacion', {
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
      }
    });
    //#endregion BUSCANDO REGISTROS

    return (
      <Resource
        value={lasMercaderiasIN}
        onPending={() => {
          //console.log('onPending 🍉🍉🍉🍉');
          return <div style={{ color: 'green' }}>Cargando...</div>;
        }}
        onRejected={() => {
          //console.log('onRejected 🍍🍍🍍🍍');
          ctx.mostrarSpinner = false;
          return <div style={{ color: 'red' }}>Fallo en la carga de datos</div>;
        }}
        onResolved={(mercaderiasIN) => {
          console.log('onResolved 🍓🍓🍓🍓', mercaderiasIN);
          const { data } = mercaderiasIN; //{ status, data, message }
          const misMercaderiasIN: IMercaderiaIN_BUSCAR[] = data;
          ctx.mostrarSpinner = false;
          return (
            <>
              {misMercaderiasIN.length > 0 ? (
                <>
                  <table
                    id="ttt_MERCADERIAS_IN"
                    style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}
                    onKeyUp$={(e) => {
                      if (e.key === 'Escape') {
                        alert('Escape presionado:table');
                        // ctx.mostrarPanelMercaderiaINSeleccionada = false;
                        // ctx.mM = null;
                      }
                    }}
                    onFocus$={() => {
                      console.log('onFocus: ttt_MERCADERIAS_IN ', document.activeElement);
                    }}
                  >
                    {/* <table> */}
                    <thead>
                      <tr>
                        <th>Ítem</th>
                        <th>Descripción</th>
                        <th style={props.verAplicacion ? '' : { display: 'none' }}>Aplicación</th>
                        <th style={props.verLineaMarca ? '' : { display: 'none' }}>Linea/Tipo</th>
                        <th>Marca</th>
                        {/* <th>Ubi</th> */}

                        <th>Stock</th>
                        <th>Uni</th>
                        <th>Costo PEN + IGV</th>
                        {/* {props.esAlmacen ? (
                          props.motivo === 'APERTURA DE INVENTARIO' ? (
                            <th>Costo Inicio PEN</th>
                          ) : (
                            <th>Costo Promd PEN</th>
                          )
                        ) : ( */}
                        <th>Precio Uni PEN</th>
                        {/* )} */}
                        {/* <th>Kx</th> */}
                        <th style={props.verLineaMarca ? '' : { display: 'none' }}>Uti</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misMercaderiasIN.map((mercaINLocali, index) => {
                        const elIndex = index + 1;
                        const {
                          _id,
                          descripcion,
                          aplicacion,
                          lineaTipo,
                          marca,
                          // totalCantidadSaldo,
                          unidad,
                          stockMinimo,
                          costoUnitarioPENMasIGV,
                          // // costoDeInicioPEN,
                          precioUnitarioPEN,
                          // // promedioCostoUnitarioMovil,
                          porcentajeUtilidad,
                          // KARDEXS,
                          activo,
                          noFacturar,
                          ubigeo,
                          idKardex,
                          sumStocks,
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
                        console.log(' 🍍🍍🍍🍍', elSM, laSumStocks);

                        return (
                          <tr
                            key={_id}
                            style={
                              !activo
                                ? { background: '#272727', color: 'white' }
                                : noFacturar
                                ? { background: '#ff5aff' }
                                : laSumStocks === 0
                                ? { color: 'red' }
                                : {}
                            }
                          >
                            <td data-label="Ítem">{cerosALaIzquierda(elIndex, 3)}</td>
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
                            <td data-label="Aplicación" style={props.verAplicacion ? '' : { display: 'none' }}>
                              {aplicacion}
                            </td>
                            <td data-label="Linea/Tipo" style={props.verLineaMarca ? '' : { display: 'none' }}>
                              {lineaTipo}
                            </td>

                            <td data-label="Marca">{marca}</td>
                            {/* <td data-label="Ubigeo">{typeof ubigeo !== 'undefined' && ubigeo !== '' && ubigeo !== null ? ubigeo : '-'}</td> */}

                            <td data-label="Stock" class="comoNumeroLeft">
                              {typeof idKardex !== 'undefined' ? (
                                <button
                                  style={{ color: 'purple', fontWeight: 'bold', cursor: 'pointer' }}
                                  onClick$={() => {
                                    ctx.descripcion = descripcion;
                                    ctx.elIdKardex = idKardex;
                                    ctx.mM = mercaINLocali;
                                    // ctx.kK = mercaINLocali.KARDEXS[0];
                                    // ctx.mostrarPanelMercaderiaINSeleccionada = true;
                                    ctx.mostrarPanelListaUbigeosStocksIN = true;
                                    ctx.mostrarSpinner = true;
                                  }}
                                >
                                  {laSumStocks}
                                </button>
                              ) : (
                                ''
                              )}
                            </td>
                            <td data-label="Uni">{unidad}</td>
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
                                  ? formatear_6Decimales(precioUnitarioPEN.$numberDecimal)
                                  : precioUnitarioPEN
                                : '-'}
                            </td>
                            <td data-label="Uti" style={props.verLineaMarca ? '' : { display: 'none' }}>
                              {typeof porcentajeUtilidad !== 'undefined' && porcentajeUtilidad !== null
                                ? porcentajeUtilidad.$numberDecimal
                                  ? porcentajeUtilidad.$numberDecimal
                                  : porcentajeUtilidad
                                : ''}
                            </td>
                            <td data-label="Acciones" class="accionesLeft">
                              {typeof idKardex === 'undefined' ? (
                                <input
                                  title="Seleccionar mercadería"
                                  src={images.check32}
                                  type="image"
                                  height={12}
                                  width={12}
                                  style={{ marginRight: '6px' }}
                                  // onFocusin$={() => //console.log('☪☪☪☪☪☪')} class="acciones"
                                  onClick$={() => {
                                    //console.log('mercaINLocali', mercaINLocali);
                                    if (typeof mercaINLocali.porcentajeUtilidad === 'undefined' || mercaINLocali.porcentajeUtilidad === null) {
                                      alert('No se ha definido el porcentaje de utilidad para esta mercadería. Adicionelo para realizar cualquier operación.');
                                      return;
                                    }

                                    // if (mercaINLocali.KARDEXS.length === 0) {
                                    //   console.log('🍑🍑🍑 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);
                                    //   ctx.mM = mercaINLocali;
                                    //   ctx.kK = [];
                                    //   ctx.mostrarPanelMercaderiaINSeleccionada = true;
                                    //   //console.log('la mercaSeleccionada IN - length', mercaINLocali.KARDEXS.length);
                                    // }

                                    // if (mercaINLocali.KARDEXS.length === 1) {
                                    // console.log('🍔🍟🍟🍟🍟 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);
                                    ctx.mM = mercaINLocali;
                                    // ctx.kK = mercaINLocali.KARDEXS[0];
                                    ctx.mostrarPanelMercaderiaINSeleccionada = true;
                                    //console.log('la mercaSeleccionada IN DIRECTA', ctx.mM);
                                    // }
                                    // if (mercaINLocali.KARDEXS.length > 1) {
                                    //   console.log('🥗🥗🥗🥗🥗 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);
                                    //   ctx.mM = mercaINLocali;
                                    //   ctx.mostrarPanelKardexsIN = true;
                                    //   //console.log('la mercaSeleccionada IN INDIRECTA', ctx.mM);
                                    // }
                                  }}
                                  onKeyUp$={(e) => {
                                    if (e.key === 'Escape') {
                                      alert('Escape presionado: Seleccionar mercadería');
                                      // ctx.mostrarPanelMercaderiaINSeleccionada = false;
                                      // ctx.mM = null;
                                    }
                                  }}
                                />
                              ) : (
                                ''
                              )}

                              {typeof aplicacion !== 'undefined' && (
                                <input
                                  // id="in_BuscarDetraccion"
                                  type="image"
                                  src={images.information}
                                  title={aplicacion}
                                  height={12}
                                  width={12}
                                  style={{ marginRight: '6px' }}
                                  // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                  onClick$={() => {
                                    alert(aplicacion);
                                  }}
                                />
                              )}
                              <input
                                title="Ver kardex/s"
                                src={images.see}
                                type="image"
                                height={12}
                                width={12}
                                style={{ marginRight: '6px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  console.log('☪☪☪☪☪☪', mercaINLocali.idKardex);
                                  // if (mercaINLocali.KARDEXS.length === 0) {
                                  if (mercaINLocali.idKardex === '' || mercaINLocali.idKardex === null || mercaINLocali.idKardex === undefined) {
                                    alert('El ítem seleccionado no presenta kardex.');
                                    return;
                                  }
                                  // alert('No se localizan kardex/s');
                                  // ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  // ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
                                  // //console.log('la mercaSeleccionada IN - length', mercaINLocali.KARDEXS.length);
                                  // }
                                  if (typeof mercaINLocali.porcentajeUtilidad === 'undefined' || mercaINLocali.porcentajeUtilidad === null) {
                                    alert('No se ha definido el porcentaje de utilidad para esta mercadería. Editelo antes de ver el kardex.');
                                    return;
                                  }
                                  console.log('💥💥💥💥💥☮☮☮☮');
                                  // if (mercaINLocali.KARDEXS.length === 1) {
                                  //   console.log('💥💥💥💥💥☮☮☮☮💥💥💥💥💥💥', mercaINLocali);
                                  ctx.mM = mercaINLocali;
                                  // ctx.kK = mercaINLocali.KARDEXS[0];
                                  ctx.elIdKardex = mercaINLocali.idKardex;
                                  ctx.mostrarPanelKARDEX = true;

                                  //console.log('la mercaSeleccionada ', ctx_index_inventario.mM);
                                  //console.log('la mercaSeleccionada KARDEX', ctx_index_inventario.kK);
                                  // }
                                  // console.log('☮☮☮☮💥💥💥💥💥');
                                  // if (mercaINLocali.KARDEXS.length > 1) {
                                  //   ctx.mM = mercaINLocali;
                                  //   ctx.mostrarPanelKARDEXS = true;
                                  //   //console.log('la mercaSeleccionada KARDEXS', ctx_index_inventario.mM);
                                  // }
                                  // console.log('💥💥💥💥💥');
                                }}
                              />
                              <input
                                title="Editar mercadería"
                                type="image"
                                src={images.edit}
                                height={12}
                                width={12}
                                style={{ marginRight: '6px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  ctx.mM = mercaINLocali;
                                  ctx.mostrarPanelNewEditMercaderiaIN = true;
                                  ctx.mostrarSpinner = true;
                                  //console.log('la merca A Editar IN', ctx.mM);
                                }}
                              />
                              <input
                                title="Editar ubigeo"
                                type="image"
                                src={images.ubigeo}
                                height={12}
                                width={12}
                                style={{ marginRight: '6px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  // if (mercaINLocali.KARDEXS.length === 0) {
                                  //   alert('El ítem seleccionado no presenta kardex.');
                                  //   return;
                                  // }

                                  // if (mercaINLocali.KARDEXS.length === 1) {
                                  //   console.log('🍔🍟🍟🍟🍟 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);

                                  // ctx.elIdKardex = mercaINLocali.KARDEXS[0]._id;
                                  ctx.ubigeoAntiguo = ubigeo;
                                  ctx.mostrarPanelVerUbigeoAntiguo = true;
                                  //console.log('la mercaSeleccionada IN DIRECTA', ctx.mM);
                                  // }
                                  // if (mercaINLocali.KARDEXS.length > 1) {
                                  //   console.log('🥗🥗🥗🥗🥗 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);
                                  //   ctx.mM = mercaINLocali;
                                  //   ctx.mostrarPanelKardexsIN = true;
                                  //   //console.log('la mercaSeleccionada IN INDIRECTA', ctx.mM);
                                  // }

                                  // ctx.mostrarSpinner = true;
                                  //console.log('la merca A Editar IN', ctx.mM);
                                }}
                              />
                              <input
                                title="Editar precio público"
                                type="image"
                                src={images.moneyBag}
                                height={12}
                                width={12}
                                // style={{ marginRight: '2px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  if (typeof mercaINLocali.porcentajeUtilidad === 'undefined' || mercaINLocali.porcentajeUtilidad === null) {
                                    alert('No se ha definido el porcentaje de utilidad para esta mercadería. Editelo antes de ver el kardex.');
                                    return;
                                  }
                                  ctx.idMercaderia = mercaINLocali._id;
                                  ctx.descripcion = mercaINLocali.descripcion;
                                  ctx.cuMASigv =
                                    typeof mercaINLocali.costoUnitarioPENMasIGV !== 'undefined' && mercaINLocali.costoUnitarioPENMasIGV !== null
                                      ? mercaINLocali.costoUnitarioPENMasIGV.$numberDecimal
                                        ? mercaINLocali.costoUnitarioPENMasIGV.$numberDecimal
                                        : mercaINLocali.costoUnitarioPENMasIGV
                                      : 0;
                                  ctx.pUtilidad = mercaINLocali.porcentajeUtilidad.$numberDecimal;
                                  ctx.precioUnitarioPEN =
                                    typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                                      ? precioUnitarioPEN.$numberDecimal
                                        ? formatear_6Decimales(precioUnitarioPEN.$numberDecimal)
                                        : precioUnitarioPEN
                                      : 0;
                                  ctx.mostrarPanelEditPrecioPublicoIN = true;
                                  // ctx.mostrarSpinner = true;

                                  //console.log('la merca A Editar IN', ctx.mM);
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
                  <i style={{ fontSize: '0.8rem', color: 'red' }}>No se encontraron registros</i>
                </div>
              )}
            </>
          );
        }}
      />
    );
  }
);

// style={
//   (totalCantidadSaldo.$numberDecimal ? parseFloat(totalCantidadSaldo.$numberDecimal) : totalCantidadSaldo) === 0
//     ? { color: 'red' }
//     : { color: '' }
// }

{
  /* {totalCantidadSaldo.$numberDecimal ? totalCantidadSaldo.$numberDecimal : totalCantidadSaldo} */
}

{
  /* {props.esAlmacen ? (
                              props.motivo === 'APERTURA DE INVENTARIO' ? (
                                <td data-label="Costo Inicio PEN" class="comoNumero">
                                  {typeof costoDeInicioPEN !== 'undefined' && costoDeInicioPEN !== null
                                    ? costoDeInicioPEN.$numberDecimal
                                      ? formatear_6Decimales(costoDeInicioPEN.$numberDecimal)
                                      : costoDeInicioPEN
                                    : '-'}
                                </td>
                              ) : (
                                <td data-label="Costo Promd PEN" class="comoNumero">
                                  {typeof promedioCostoUnitarioMovil !== 'undefined' && promedioCostoUnitarioMovil !== null
                                    ? promedioCostoUnitarioMovil.$numberDecimal
                                      ? formatear_6Decimales(promedioCostoUnitarioMovil.$numberDecimal)
                                      : promedioCostoUnitarioMovil
                                    : '-'}
                                </td>
                              )
                            ) : ( */
}
