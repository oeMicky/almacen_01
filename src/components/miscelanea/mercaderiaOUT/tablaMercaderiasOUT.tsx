import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import style from '../../tabla/tabla.css?inline';
import { CTX_BUSCAR_MERCADERIA_OUT } from './buscarMercaderiaOUT';
import type { IMercaderiaOUT } from '~/interfaces/iMercaderia';
// import ImgButton from '~/components/system/imgButton';
import { images } from '~/assets';
import { formatear_6Decimales } from '~/functions/comunes';
// import { CTX_O_S } from '~/components/ordenServicio/newEditOrdenServicio';
// import { CTX_O_P } from '~/components/ordenProduccion/newEditOrdenProduccion';
// import { CTX_F_B_NC_ND } from '~/components/venta/addVenta';
// import { CTX_NOTA_VENTA } from '~/components/notaVenta/addNotaVenta';
// import { CTX_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
// import { CTX_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
// import { CTX_KARDEXS_OUT } from './kardexsOUT';
// import { exit } from 'process';

export default component$(
  (props: {
    buscarMercaderiasOUT: number;
    parametrosBusqueda: any;
    // contexto: string;
    // contextoParaDocumento: string;
    addAutomatica: boolean;
    esAlmacen: boolean;
    esProduccion?: boolean;
    verAplicacion: boolean;
    verLineaMarca: boolean;
    verTODOS: boolean;
  }) => {
    useStyles$(style);

    //#region CONTEXTOS
    const ctx_buscar_mercaderia_out = useContext(CTX_BUSCAR_MERCADERIA_OUT);
    // let ctx: any = [];
    // let documento: any = [];

    // switch (props.contextoParaDocumento) {
    //   case 'orden_servicio':
    //     //console.log('contextoParaDocumento::: orden_servicio');
    //     documento = useContext(CTX_O_S).requisiciones;
    //     break;
    //   case 'orden_produccion':
    //     //console.log('contextoParaDocumento::: orden_produccion');
    //     documento = useContext(CTX_O_P).requisiciones;
    //     break;
    //   case 'new_venta':
    //     //console.log('contextoParaDocumento::: new_venta');
    //     documento = useContext(CTX_F_B_NC_ND).itemsVenta;
    //     // asiVen = useContext(CTX_F_B_NC_ND).asientoContable;
    //     break;
    //   case 'nota_venta':
    //     //console.log('contextoParaDocumento::: new_venta');
    //     documento = useContext(CTX_NOTA_VENTA).itemsNotaVenta;
    //     // asiVen = useContext(CTX_F_B_NC_ND).asientoContable;
    //     break;
    //   case 'new_edit_cotizacion':
    //     //console.log('contextoParaDocumento::: new_edit_cotizacion');
    //     documento = useContext(CTX_COTIZACION).repuestosLubri;
    //     break;
    //   case 'new_out_almacen':
    //     //console.log('contextoParaDocumento::: new_out_almacen');
    //     documento = useContext(CTX_OUT_ALMACEN).itemsMercaderias;
    //     break;
    // }

    // switch (props.contexto) {
    //   case 'buscar_mercaderia_out':
    //     //console.log('contexto::: buscar_mercaderia_out');
    //     ctx = useContext(CTX_BUSCAR_MERCADERIA_OUT);
    //     break;
    //   case 'kardexs_out':
    //     //console.log('contexto::: kardexs_out');
    //     ctx = useContext(CTX_KARDEXS_OUT);
    //     break;
    // }
    //#endregion CONTEXTOS

    //#region BUSCANDO REGISTROS
    const lasMercaderiasOUT = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.buscarMercaderiasOUT.valueOf());

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

    //#region REGISTRO AUTOMATICO
    // const registroAutomatico = $(async (mercaOUTLocali: IMercaderiaOUT) => {
    //   // console.log('registroAutomatico', mercaOUTLocali);
    //   alert('registroAutomatico');

    //   // let tPVU = '';
    //   // if (
    //   //   mercaOUTSelecci.tipoAfectacionDelImpuesto === '10' ||
    //   //   props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '11' ||
    //   //   props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '12' ||
    //   //   props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '13' ||
    //   //   props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '14' ||
    //   //   props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '15' ||
    //   //   props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '16' ||
    //   //   props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '17'
    //   // ) {
    //   //   tPVU = '01';
    //   // } else {
    //   //   tPVU = '02';
    //   // }
    //   // documento.push({
    //   //   idAuxiliar: unicoAux,
    //   //   idMercaderia: props.mercaOUTSelecci._id,
    //   //   idEquivalencia: equivalencia._id,
    //   //   idKardex: props.elKardex._id,
    //   //   item: 0,
    //   //   tipo: 'MERCADERIA',

    //   //   noFacturar: props.mercaOUTSelecci.noFacturar,

    //   //   tipoImpuesto: props.mercaOUTSelecci.tipoImpuesto,
    //   //   tipoAfectacionDelImpuesto: props.mercaOUTSelecci.tipoAfectacionDelImpuesto,
    //   //   porcentaje: parseFloat(props.porcentaje),

    //   //   tipoPrecioVentaUnitario: tPVU,

    //   //   codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : '_',

    //   //   descripcion: props.mercaOUTSelecci.descripcion,
    //   //   descripcionEquivalencia: equivalencia.descripcionEquivalencia,

    //   //   cantidad: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
    //   //   cantidadEquivalencia: cantidadSacada.value,

    //   //   cantidadSacada: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
    //   //   cantidadSacadaEquivalencia: cantidadSacada.value,

    //   //   unidad: props.mercaOUTSelecci.unidad,
    //   //   unidadEquivalencia: equivalencia.unidadEquivalencia,

    //   //   costoUnitarioPEN: parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
    //   //   costoUnitarioEquivalenciaPEN: parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) * parseFloat(equivalencia.laEquivalencia.$numberDecimal),

    //   //   porcentajeUtilidad: props.mercaOUTSelecci.porcentajeUtilidad,

    //   //   //precio = c + IGV
    //   //   precioUnitarioPEN: precioEquivalencia.value,
    //   //   //venta = k * precio
    //   //   ventaPEN: cantidadSacada.value * precioEquivalencia.value,

    //   //   precioUnitarioUSD: 0,
    //   //   ventaUSD: 0,
    //   //   tipoEquivalencia: equivalencia.tipoEquivalencia,
    //   //   factor: equivalencia.factor,
    //   //   laEquivalencia: equivalencia.laEquivalencia,

    //   //   exonerado: props.mercaOUTSelecci.exonerado,
    //   //   inafecto: props.mercaOUTSelecci.inafecto,
    //   //   sujetoAPercepcion: props.mercaOUTSelecci.sujetoAPercepcion,
    //   //   percepcion: props.mercaOUTSelecci.percepcion,

    //   //   codigoContableVenta: props.mercaOUTSelecci.codigoContableVenta,
    //   //   descripcionContableVenta: props.mercaOUTSelecci.descripcionContableVenta,
    //   //   tipoContableVenta: props.mercaOUTSelecci.tipoContableVenta,
    //   // });
    // });
    //#endregion REGISTRO AUTOMATICO

    return (
      <Resource
        value={lasMercaderiasOUT}
        onPending={() => {
          //console.log('onPending 🍉🍉🍉🍉');
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          //console.log('onRejected 🍍🍍🍍🍍');
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(mercasOUT) => {
          // console.log('onResolved 🍓🍓🍓🍓', mercasOUT);
          const { data } = mercasOUT; //{ status, data, message }
          const misMercaderiasOUT: IMercaderiaOUT[] = data;
          //console.log('misMercaderiasOUT', misMercaderiasOUT);
          return (
            <>
              {misMercaderiasOUT.length > 0 ? (
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                  {/* <table style={{ fontWeight: 'lighter ' }}> */}
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
                      {props.esAlmacen || props.esProduccion ? <th>Costo Promd.PEN</th> : <th>Precio PEN</th>}
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
                        aplicacion,
                        lineaTipo,
                        marca,
                        totalCantidadSaldo,
                        unidad,
                        precioUnitarioPEN,
                        promedioCostoUnitarioMovil,
                        KARDEXS,
                        activo,
                        noFacturar,
                        ubigeo,
                      } = mercaOUTLocali;
                      // const indexItem = index + 1;   , costoUnitarioMovil, precio
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
                          <td data-label="Ubigeo">{typeof ubigeo !== 'undefined' && ubigeo !== null && ubigeo !== '' ? ubigeo : '-'}</td>
                          <td data-label="Stock" class="comoNumeroLeft" style={{ color: 'purple' }}>
                            {totalCantidadSaldo.$numberDecimal
                              ? formatear_6Decimales(totalCantidadSaldo.$numberDecimal)
                              : formatear_6Decimales(totalCantidadSaldo)}
                          </td>
                          <td data-label="Uni">{unidad}</td>
                          {props.esAlmacen || props.esProduccion ? (
                            <td data-label="Costo Promd.PEN" class="comoNumeroLeft">
                              {typeof promedioCostoUnitarioMovil !== 'undefined' && promedioCostoUnitarioMovil !== null
                                ? promedioCostoUnitarioMovil.$numberDecimal
                                  ? formatear_6Decimales(promedioCostoUnitarioMovil.$numberDecimal)
                                  : promedioCostoUnitarioMovil
                                : '_'}
                            </td>
                          ) : (
                            <td data-label="Precio PEN" class="comoNumeroLeft">
                              {typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                                ? precioUnitarioPEN.$numberDecimal
                                  ? formatear_6Decimales(precioUnitarioPEN.$numberDecimal)
                                  : precioUnitarioPEN
                                : '_'}
                            </td>
                          )}
                          {/* <td data-label="Precio">
                            {typeof precio !== 'undefined' ? (precio.$numberDecimal ? precio.$numberDecimal : precio) : '_'}
                          </td> */}
                          <td data-label="Kx" class="accionesLeft">
                            {KARDEXS.length === 0 ? 'No' : 'Si'}
                          </td>
                          <td data-label="Acciones" class="accionesLeft">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar mercadería"
                              height={12}
                              width={12}
                              style={{ marginRight: '6px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                if (!activo) {
                                  alert('El producto esta inactivo, no es seleccionable, consulte con el administrador.');
                                  return;
                                }
                                if (typeof mercaOUTLocali.porcentajeUtilidad === 'undefined' || mercaOUTLocali.porcentajeUtilidad === null) {
                                  alert('No se ha definido el porcentaje de utilidad para esta mercadería. Editelo antes de ver el kardex.');
                                  return;
                                }
                                if (mercaOUTLocali.KARDEXS.length === 0) {
                                  alert('No existe kardex para el producto seleccionado.');
                                  return;
                                }
                                if (!props.esAlmacen) {
                                  //console.log('!props.esAlmacen', props.esAlmacen, precioUnitarioPEN);
                                  if (typeof precioUnitarioPEN === 'undefined' || precioUnitarioPEN === null) {
                                    mercaOUTLocali.precioUnitarioPEN = 0;
                                    //console.log('typeof precioUnitarioPEN !== undefined || precioUnitarioPEN !== null');
                                  }
                                }
                                // if (mercaOUTLocali.KARDEXS.length === 1 && mercaOUTLocali.equivalencias.length === 1) {
                                //   // ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                //   // ctx_buscar_mercaderia_out.kK = mercaOUTLocali.KARDEXS[0];
                                //   // ctx_buscar_mercaderia_out.mostrarPanelMercaderiaOUTSeleccionada = true;
                                //   //console.log('la mercade seleccionada OUT DIRECTA = 1K 1EQ ', ctx_buscar_mercaderia_out.mM);
                                // } && mercaOUTLocali.equivalencias.length > 1
                                if (mercaOUTLocali.KARDEXS.length === 1) {
                                  ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  ctx_buscar_mercaderia_out.kK = mercaOUTLocali.KARDEXS[0];
                                  ctx_buscar_mercaderia_out.mostrarPanelMercaderiaOUTSeleccionada = true;
                                  //console.log('la mercade seleccionada OUT DIRECTA', ctx_buscar_mercaderia_out.mM);
                                }
                                if (mercaOUTLocali.KARDEXS.length > 1) {
                                  ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  ctx_buscar_mercaderia_out.mostrarPanelKardexsOUT = true;
                                  //console.log('la mercade seleccionada OUT -INDIRECTA', ctx_buscar_mercaderia_out.mM);
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
                                style={{ marginRight: '6px' }}
                                // onFocusin$={() => //console.log("☪☪☪☪☪☪!!!")}
                                onClick$={() => {
                                  alert(aplicacion);
                                }}
                              />
                            )}
                            {/* <input
                                type="image"
                                src={images.moneyBag}
                                title="Asignar precio"
                                height={12}
                                width={12}
                                onFocusin$={() => //console.log("☪☪☪☪☪☪°°°")}
                                onClick$={() => {
                                  ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  ctx_buscar_mercaderia_out.mostrarPanelAsignarPrecioOUT = true;
                                  //console.log("mercaOUTLocali", mercaOUTLocali);
                                }}
                              /> */}
                            {props.esAlmacen && (
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.edit}
                                title="Editar mercadería"
                                height={12}
                                width={12}
                                style={{ marginRight: '6px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  console.log('mercaOUTLocali', mercaOUTLocali);
                                  ctx_buscar_mercaderia_out.mostrarPanelNewEditMercaderiaIN = true;
                                }}
                              />
                            )}
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.ubigeo}
                              title="Editar ubigeo"
                              height={12}
                              width={12}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                if (mercaOUTLocali.KARDEXS.length === 0) {
                                  alert('El ítem seleccionado no presenta kardex.');
                                  return;
                                }

                                if (mercaOUTLocali.KARDEXS.length === 1) {
                                  console.log('🍔🍟🍟🍟🍟 mercaOUTLocali.KARDEXS.length', mercaOUTLocali.KARDEXS.length);

                                  ctx_buscar_mercaderia_out.elIdKardex = mercaOUTLocali.KARDEXS[0]._id;
                                  ctx_buscar_mercaderia_out.elUBIGEO = ubigeo;
                                  ctx_buscar_mercaderia_out.mostrarPanelNewEditUbigeo = true;
                                  console.log(
                                    '🍔🍔🍔🍔🍔 mercaOUTLocali.KARDEXS.length',
                                    ctx_buscar_mercaderia_out.elIdKardex,
                                    ctx_buscar_mercaderia_out.elUBIGEO
                                  );
                                }
                                // if (mercaOUTLocali.KARDEXS.length > 1) {
                                //   console.log('🥗🥗🥗🥗🥗 mercaOUTLocali.KARDEXS.length', mercaOUTLocali.KARDEXS.length);
                                //   ctx.mM = mercaOUTLocali;
                                //   ctx.mostrarPanelKardexsIN = true;
                                // }

                                // ctx_buscar_mercaderia_out.mostrarSpinner = true;
                                //console.log('la merca A Editar IN', ctx.mM);
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
