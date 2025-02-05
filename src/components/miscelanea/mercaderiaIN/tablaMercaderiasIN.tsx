import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import ImgButton from '~/components/system/imgButton';
import type { IMercaderiaIN } from '~/interfaces/iMercaderia';
import style from '../../tabla/tabla.css?inline';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import { formatear_6Decimales } from '~/functions/comunes';
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
      if (props.parametrosBusqueda.buscarPor === 'Aplicación') {
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
    });
    //#endregion BUSCANDO REGISTROS

    return (
      <Resource
        value={lasMercaderiasIN}
        onPending={() => {
          //console.log('onPending 🍉🍉🍉🍉');
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          //console.log('onRejected 🍍🍍🍍🍍');
          ctx.mostrarSpinner = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(mercaderiasIN) => {
          console.log('onResolved 🍓🍓🍓🍓', mercaderiasIN);
          const { data } = mercaderiasIN; //{ status, data, message }
          const misMercaderiasIN: IMercaderiaIN[] = data;
          ctx.mostrarSpinner = false;
          return (
            <>
              {misMercaderiasIN.length > 0 ? (
                <>
                  <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                    {/* <table> */}
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th style={props.verAplicacion ? '' : { display: 'none' }}>Aplicación</th>
                        <th style={props.verLineaMarca ? '' : { display: 'none' }}>Linea/Tipo</th>
                        <th style={props.verLineaMarca ? '' : { display: 'none' }}>Marca</th>
                        <th>Ubi</th>
                        <th>Stock</th>
                        <th>Uni</th>
                        {props.esAlmacen ? (
                          props.motivo === 'APERTURA DE INVENTARIO' ? (
                            <th>Costo Inicio PEN</th>
                          ) : (
                            <th>Costo Promd PEN</th>
                          )
                        ) : (
                          <th>Precio Uni PEN</th>
                        )}
                        <th>Kx</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misMercaderiasIN.map((mercaINLocali) => {
                        const {
                          _id,
                          descripcion,
                          aplicacion,
                          lineaTipo,
                          marca,
                          totalCantidadSaldo,
                          unidad,
                          costoDeInicioPEN,
                          precioUnitarioPEN,
                          promedioCostoUnitarioMovil,
                          KARDEXS,
                          activo,
                          noFacturar,
                          ubigeo,
                        } = mercaINLocali;

                        return (
                          <tr
                            key={_id}
                            style={
                              !activo
                                ? { background: '#272727', color: 'white' }
                                : noFacturar
                                ? { background: '#ff5aff' }
                                : (totalCantidadSaldo.$numberDecimal ? parseFloat(totalCantidadSaldo.$numberDecimal) : totalCantidadSaldo) === 0
                                ? { color: 'red' }
                                : {}
                            }
                            // style={
                            //   (totalCantidadSaldo.$numberDecimal ? parseFloat(totalCantidadSaldo.$numberDecimal) : totalCantidadSaldo) === 0
                            //     ? { color: 'red' }
                            //     : { color: '' }
                            // }
                          >
                            <td data-label="Descripción">{descripcion}</td>
                            <td data-label="Aplicación" style={props.verAplicacion ? '' : { display: 'none' }}>
                              {aplicacion}
                            </td>
                            <td data-label="Linea/Tipo" style={props.verLineaMarca ? '' : { display: 'none' }}>
                              {lineaTipo}
                            </td>
                            <td data-label="Marca" style={props.verLineaMarca ? '' : { display: 'none' }}>
                              {marca}
                            </td>
                            <td data-label="Ubigeo">{typeof ubigeo !== 'undefined' && ubigeo !== '' ? ubigeo : '-'}</td>
                            <td data-label="Stock">{totalCantidadSaldo.$numberDecimal ? totalCantidadSaldo.$numberDecimal : totalCantidadSaldo}</td>
                            <td data-label="Uni">{unidad}</td>
                            {props.esAlmacen ? (
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
                            ) : (
                              <td data-label="Precio PEN" class="comoNumero">
                                {typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                                  ? precioUnitarioPEN.$numberDecimal
                                    ? formatear_6Decimales(precioUnitarioPEN.$numberDecimal)
                                    : precioUnitarioPEN
                                  : '-'}
                              </td>
                            )}
                            <td data-label="Kx" class="acciones">
                              {KARDEXS.length === 0 ? 'No' : 'Si'}
                            </td>
                            <td data-label="Acciones" class="acciones">
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.check32}
                                title="Seleccionar mercadería"
                                height={12}
                                width={12}
                                style={{ marginRight: '4px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  //console.log('mercaINLocali', mercaINLocali);
                                  if (typeof mercaINLocali.porcentajeUtilidad === 'undefined' || mercaINLocali.porcentajeUtilidad === null) {
                                    alert('No se ha definido el porcentaje de utilidad para esta mercadería. Adicionelo para realizar cualquier operación.');
                                    return;
                                  }

                                  if (mercaINLocali.KARDEXS.length === 0) {
                                    console.log('🍑🍑🍑 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);
                                    ctx.mM = mercaINLocali;
                                    ctx.kK = [];
                                    ctx.mostrarPanelMercaderiaINSeleccionada = true;
                                    //console.log('la mercaSeleccionada IN - length', mercaINLocali.KARDEXS.length);
                                  }

                                  if (mercaINLocali.KARDEXS.length === 1) {
                                    console.log('🍔🍟🍟🍟🍟 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);
                                    ctx.mM = mercaINLocali;
                                    ctx.kK = mercaINLocali.KARDEXS[0];
                                    ctx.mostrarPanelMercaderiaINSeleccionada = true;
                                    //console.log('la mercaSeleccionada IN DIRECTA', ctx.mM);
                                  }
                                  if (mercaINLocali.KARDEXS.length > 1) {
                                    console.log('🥗🥗🥗🥗🥗 mercaINLocali.KARDEXS.length', mercaINLocali.KARDEXS.length);
                                    ctx.mM = mercaINLocali;
                                    ctx.mostrarPanelKardexsIN = true;
                                    //console.log('la mercaSeleccionada IN INDIRECTA', ctx.mM);
                                  }
                                }}
                              />
                              {typeof aplicacion !== 'undefined' && (
                                <input
                                  // id="in_BuscarDetraccion"
                                  type="image"
                                  src={images.information}
                                  title={aplicacion}
                                  height={12}
                                  width={12}
                                  style={{ marginRight: '4px' }}
                                  // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                  onClick$={() => {
                                    alert(aplicacion);
                                  }}
                                />
                              )}
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.see}
                                title="Ver kardex/s"
                                height={12}
                                width={12}
                                style={{ marginRight: '4px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  console.log('☪☪☪☪☪☪');
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
                                    console.log('💥💥💥💥💥☮☮☮☮💥💥💥💥💥💥', mercaINLocali);
                                    ctx.mM = mercaINLocali;
                                    ctx.kK = mercaINLocali.KARDEXS[0];
                                    ctx.mostrarPanelKARDEX = true;

                                    //console.log('la mercaSeleccionada ', ctx_index_kardex.mM);
                                    //console.log('la mercaSeleccionada KARDEX', ctx_index_kardex.kK);
                                  }
                                  if (mercaINLocali.KARDEXS.length > 1) {
                                    ctx.mM = mercaINLocali;
                                    ctx.mostrarPanelKARDEXS = true;
                                    //console.log('la mercaSeleccionada KARDEXS', ctx_index_kardex.mM);
                                  }
                                }}
                              />
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.edit}
                                title="Editar mercadería"
                                height={12}
                                width={12}
                                // style={{ marginRight: '2px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  ctx.mM = mercaINLocali;
                                  ctx.mostrarPanelNewEditMercaderiaIN = true;
                                  ctx.mostrarSpinner = true;
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
