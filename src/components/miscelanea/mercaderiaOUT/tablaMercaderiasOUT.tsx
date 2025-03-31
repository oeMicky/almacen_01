import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik'; //useSignal
import style from '../../tabla/tabla.css?inline';
import { CTX_BUSCAR_MERCADERIA_OUT } from './buscarMercaderiaOUT';
import type { IMercaderiaOUT_BUSCAR } from '~/interfaces/iMercaderia';
// import ImgButton from '~/components/system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda, elIdAuxiliar, formatear_2Decimales, formatear_6Decimales } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';
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
    documento: any;
    porcentaje: any;
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

    // const destello = useSignal(false);

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

    //   //   codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : '-',

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
          console.log('onResolved 🍓🍓🍓🍓', mercasOUT);
          const { data } = mercasOUT; //{ status, data, message }
          const misMercaderiasOUT: IMercaderiaOUT_BUSCAR[] = data;
          //console.log('misMercaderiasOUT', misMercaderiasOUT);
          return (
            <>
              {misMercaderiasOUT.length > 0 ? (
                <table
                  style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}
                  onKeyUp$={(e) => {
                    // console.log('🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚', e.key);
                    if (e.key === 'Escape') {
                      // ctx.mostrarPanelBuscarMercaderiaOUT = false;
                      alert('🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚');
                    }
                  }}
                >
                  {/* <table style={{ fontWeight: 'lighter ' }}> */}
                  {/* <table> */}
                  <thead>
                    <tr>
                      <th>Ítem</th>
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
                    {misMercaderiasOUT.map((mercaOUTLocali, index) => {
                      const elIndex = index + 1;
                      const {
                        _id,
                        descripcion,
                        aplicacion,
                        lineaTipo,
                        marca,
                        totalCantidadSaldo,
                        unidad,
                        precioUnitarioPEN,
                        costoUnitarioPENMasIGV,
                        // promedioCostoUnitarioMovil,
                        stockMinimo,
                        KARDEXS,
                        activo,
                        noFacturar,
                        ubigeo,
                      } = mercaOUTLocali;
                      // const indexItem = index + 1;   , costoUnitarioMovil, precio
                      let elSM = 0;
                      let elTCS = 0;
                      if (typeof stockMinimo === 'undefined' || stockMinimo === null) {
                        elSM = 0;
                      } else {
                        elSM = stockMinimo.$numberDecimal ? parseFloat(stockMinimo.$numberDecimal) : stockMinimo;
                      }
                      if (typeof totalCantidadSaldo === 'undefined' || totalCantidadSaldo === null) {
                        elTCS = 0;
                      } else {
                        elTCS = totalCantidadSaldo.$numberDecimal ? parseFloat(totalCantidadSaldo.$numberDecimal) : totalCantidadSaldo;
                      }
                      console.log(' 🍍🍍🍍🍍', elSM, elTCS);

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
                          <td data-label="Ítem">{cerosALaIzquierda(elIndex, 3)}</td>
                          <td
                            data-label="Descripción"
                            style={props.esAlmacen ? { fontWeight: 'bold' } : { cursor: 'pointer', fontWeight: 'bold' }}
                            onKeyUp$={(e) => {
                              // console.log('🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚', e.key);
                              if (e.key === 'Escape') {
                                // ctx.mostrarPanelBuscarMercaderiaOUT = false;
                                alert('🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚🚚');
                              }
                            }}
                            onClick$={(e) => {
                              try {
                                if (props.esAlmacen) {
                                  return;
                                }
                                const unicoAux = parseInt(elIdAuxiliar());
                                let tPVU = '';
                                if (
                                  mercaOUTLocali.tipoAfectacionDelImpuesto === '10' ||
                                  mercaOUTLocali.tipoAfectacionDelImpuesto === '11' ||
                                  mercaOUTLocali.tipoAfectacionDelImpuesto === '12' ||
                                  mercaOUTLocali.tipoAfectacionDelImpuesto === '13' ||
                                  mercaOUTLocali.tipoAfectacionDelImpuesto === '14' ||
                                  mercaOUTLocali.tipoAfectacionDelImpuesto === '15' ||
                                  mercaOUTLocali.tipoAfectacionDelImpuesto === '16' ||
                                  mercaOUTLocali.tipoAfectacionDelImpuesto === '17'
                                ) {
                                  tPVU = '01';
                                } else {
                                  tPVU = '02';
                                }
                                console.log('👔👔👔👔👔👔👔', mercaOUTLocali.tipoImpuesto[1], mercaOUTLocali.tipoImpuesto);

                                let elTImp;
                                if (mercaOUTLocali.tipoImpuesto.length > 1) {
                                  elTImp = mercaOUTLocali.tipoImpuesto[1];
                                } else {
                                  elTImp = mercaOUTLocali.tipoImpuesto[0];
                                }
                                console.log('👔👔👔👔👔👔👔', elTImp);
                                const laEqui = mercaOUTLocali.equivalencias[0];
                                let elKAR;
                                if (mercaOUTLocali.KARDEXS.length === 1) {
                                  elKAR = mercaOUTLocali.KARDEXS[0];
                                }
                                // if (mercaOUTLocali.KARDEXS.length > 1) {
                                //   ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                //   ctx_buscar_mercaderia_out.mostrarPanelKardexsOUT = true;
                                //   //console.log('la mercade seleccionada OUT -INDIRECTA', ctx_buscar_mercaderia_out.mM);
                                // }
                                let elCOS_elPRE;
                                if (props.esAlmacen || props.esProduccion) {
                                  elCOS_elPRE =
                                    typeof costoUnitarioPENMasIGV !== 'undefined' && costoUnitarioPENMasIGV !== null
                                      ? costoUnitarioPENMasIGV.$numberDecimal
                                        ? formatear_2Decimales(costoUnitarioPENMasIGV.$numberDecimal)
                                        : formatear_2Decimales(costoUnitarioPENMasIGV)
                                      : 0;
                                } else {
                                  elCOS_elPRE =
                                    typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                                      ? precioUnitarioPEN.$numberDecimal
                                        ? formatear_6Decimales(precioUnitarioPEN.$numberDecimal)
                                        : precioUnitarioPEN
                                      : 0;
                                }
                                props.documento.push({
                                  idAuxiliar: unicoAux,
                                  idMercaderia: mercaOUTLocali._id,
                                  idEquivalencia: laEqui._id,
                                  idKardex: elKAR._id,
                                  item: 0,
                                  tipo: 'MERCADERIA',

                                  noFacturar: mercaOUTLocali.noFacturar,

                                  tipoImpuesto: elTImp, // props.mercaOUTSelecci.tipoImpuesto[1],
                                  tipoAfectacionDelImpuesto: mercaOUTLocali.tipoAfectacionDelImpuesto,
                                  porcentaje: parseFloat(props.porcentaje),

                                  tipoPrecioVentaUnitario: tPVU,

                                  codigo: mercaOUTLocali.codigo ? mercaOUTLocali.codigo : '-',

                                  descripcion: mercaOUTLocali.descripcion,
                                  descripcionEquivalencia: laEqui.descripcionEquivalencia,

                                  cantidad: 1 * parseFloat(laEqui.laEquivalencia.$numberDecimal),
                                  cantidadEquivalencia: 1,

                                  cantidadSacada: 1 * parseFloat(laEqui.laEquivalencia.$numberDecimal),
                                  cantidadSacadaEquivalencia: 1,

                                  unidad: mercaOUTLocali.unidad,
                                  unidadEquivalencia: laEqui.unidadEquivalencia,

                                  costoUnitarioPEN: parseFloat(elKAR.costoUnitarioMovil.$numberDecimal),
                                  costoUnitarioEquivalenciaPEN:
                                    parseFloat(elKAR.costoUnitarioMovil.$numberDecimal) * parseFloat(laEqui.laEquivalencia.$numberDecimal),

                                  porcentajeUtilidad: mercaOUTLocali.porcentajeUtilidad,

                                  //precio = c + IGV
                                  precioUnitarioPEN: elCOS_elPRE, // precioEquivalencia.value,
                                  //venta = k * precio
                                  ventaPEN: 1 * elCOS_elPRE, //precioEquivalencia.value,

                                  precioUnitarioUSD: 0,
                                  ventaUSD: 0,
                                  tipoEquivalencia: laEqui.tipoEquivalencia,
                                  factor: laEqui.factor,
                                  laEquivalencia: laEqui.laEquivalencia,

                                  exonerado: mercaOUTLocali.exonerado,
                                  inafecto: mercaOUTLocali.inafecto,
                                  sujetoAPercepcion: mercaOUTLocali.sujetoAPercepcion,
                                  percepcion: mercaOUTLocali.percepcion,

                                  codigoContableVenta: mercaOUTLocali.codigoContableVenta,
                                  descripcionContableVenta: mercaOUTLocali.descripcionContableVenta,
                                  tipoContableVenta: mercaOUTLocali.tipoContableVenta,
                                });
                              } catch (error) {
                                console.error(error);
                              } finally {
                                // DESTELLO
                                if (!props.esAlmacen) {
                                  (e.target as HTMLTableElement).style.animation = '';
                                  (e.target as HTMLTableElement).offsetWidth;
                                  (e.target as HTMLTableElement).style.animation = 'example 0.3s linear 0s 1 alternate';
                                }
                              }
                            }}
                          >
                            {elSM >= elTCS ? (
                              <img src={images.flagRed} alt="Bandera roja" width="12" height="12" />
                            ) : elSM + 5 >= elTCS ? (
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
                          <td data-label="Marca" style={props.verLineaMarca ? '' : { display: 'none' }}>
                            {marca}
                          </td>
                          <td data-label="Ubigeo">{typeof ubigeo !== 'undefined' && ubigeo !== null && ubigeo !== '' ? ubigeo : '-'}</td>
                          <td
                            data-label="Stock"
                            class="comoNumeroLeft"
                            style={{ fontWeight: 'bold', color: 'purple' }}
                            // onClick$={(e) => {  , cursor: 'pointer'
                            //   (e.target as HTMLTableElement).style.animation = '';
                            //   (e.target as HTMLTableElement).offsetWidth;
                            //   (e.target as HTMLTableElement).style.animation = 'example 0.3s linear 0s 1 alternate';
                            // }}
                          >
                            {/* <strong style={{ color: 'purple' }}> */}
                            {totalCantidadSaldo.$numberDecimal
                              ? formatear_6Decimales(totalCantidadSaldo.$numberDecimal)
                              : formatear_6Decimales(totalCantidadSaldo)}
                            {/* </strong> */}
                          </td>
                          <td data-label="Uni">{unidad}</td>
                          {props.esAlmacen || props.esProduccion ? (
                            <td data-label="Costo PEN + IGV" class="comoNumeroLeft" style={{ fontWeight: 'bold' }}>
                              {typeof costoUnitarioPENMasIGV !== 'undefined' && costoUnitarioPENMasIGV !== null
                                ? costoUnitarioPENMasIGV.$numberDecimal
                                  ? formatear_2Decimales(costoUnitarioPENMasIGV.$numberDecimal)
                                  : formatear_2Decimales(costoUnitarioPENMasIGV)
                                : '-'}
                            </td>
                          ) : (
                            // <td data-label="Costo Promd.PEN" class="comoNumeroLeft">
                            //   {typeof promedioCostoUnitarioMovil !== 'undefined' && promedioCostoUnitarioMovil !== null
                            //     ? promedioCostoUnitarioMovil.$numberDecimal
                            //       ? formatear_6Decimales(promedioCostoUnitarioMovil.$numberDecimal)
                            //       : promedioCostoUnitarioMovil
                            //     : '-'}
                            // </td>
                            <td data-label="Precio PEN" class="comoNumeroLeft" style={{ fontWeight: 'bold' }}>
                              {typeof precioUnitarioPEN !== 'undefined' && precioUnitarioPEN !== null
                                ? precioUnitarioPEN.$numberDecimal
                                  ? formatear_6Decimales(precioUnitarioPEN.$numberDecimal)
                                  : precioUnitarioPEN
                                : '-'}
                            </td>
                          )}
                          {/* <td data-label="Precio">
                            {typeof precio !== 'undefined' ? (precio.$numberDecimal ? precio.$numberDecimal : precio) : '-'}
                          </td> */}
                          <td data-label="Kx" class="accionesLeft">
                            {KARDEXS.length === 0 ? 'No' : 'Si'}
                          </td>
                          <td data-label="Acciones" class="accionesLeft">
                            <input
                              title="Seleccionar mercadería"
                              type="image"
                              src={images.check32}
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
                            {/* {props.esAlmacen && ( */}
                            <input
                              title="Editar mercadería"
                              type="image"
                              src={images.edit}
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
                            {/* )} */}
                            <input
                              title="Editar ubigeo"
                              type="image"
                              src={images.ubigeo}
                              height={12}
                              width={12}
                              style={{ marginRight: '6px' }}
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
                            <input
                              title="Ver kardex/s"
                              src={images.see}
                              type="image"
                              height={12}
                              width={12}
                              style={{ marginRight: '6px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                console.log('☪☪☪☪☪☪');
                                if (mercaOUTLocali.KARDEXS.length === 0) {
                                  alert('No se localizan kardex/s');
                                  // ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  // ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
                                  // //console.log('la mercaSeleccionada IN - length', mercaINLocali.KARDEXS.length);
                                }
                                if (typeof mercaOUTLocali.porcentajeUtilidad === 'undefined' || mercaOUTLocali.porcentajeUtilidad === null) {
                                  alert('No se ha definido el porcentaje de utilidad para esta mercadería. Editelo antes de ver el kardex.');
                                  return;
                                }
                                if (mercaOUTLocali.KARDEXS.length === 1) {
                                  console.log('💥💥💥💥💥☮☮☮☮💥💥💥💥💥💥', mercaOUTLocali);
                                  ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  ctx_buscar_mercaderia_out.kK = mercaOUTLocali.KARDEXS[0];
                                  ctx_buscar_mercaderia_out.mostrarPanelKARDEX = true;

                                  //console.log('la mercaSeleccionada ', ctx_index_inventario.mM);
                                  //console.log('la mercaSeleccionada KARDEX', ctx_index_inventario.kK);
                                }
                                if (mercaOUTLocali.KARDEXS.length > 1) {
                                  ctx_buscar_mercaderia_out.mM = mercaOUTLocali;
                                  ctx_buscar_mercaderia_out.mostrarPanelKARDEXS = true;
                                  //console.log('la mercaSeleccionada KARDEXS', ctx_index_inventario.mM);
                                }
                              }}
                            />
                            {parametrosGlobales.actualizarPrecioPublico && (
                              <input
                                title="Editar precio público"
                                type="image"
                                src={images.moneyBag}
                                height={12}
                                width={12}
                                // style={{ marginRight: '2px' }}
                                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                                onClick$={() => {
                                  if (typeof mercaOUTLocali.porcentajeUtilidad === 'undefined' || mercaOUTLocali.porcentajeUtilidad === null) {
                                    alert('No se ha definido el porcentaje de utilidad para esta mercadería. Editelo antes de ver el kardex.');
                                    return;
                                  }
                                  ctx_buscar_mercaderia_out.idMercaderia = mercaOUTLocali._id;
                                  ctx_buscar_mercaderia_out.descripcion = mercaOUTLocali.descripcion;
                                  ctx_buscar_mercaderia_out.cuMASigv =
                                    typeof mercaOUTLocali.costoUnitarioPENMasIGV !== 'undefined' && mercaOUTLocali.costoUnitarioPENMasIGV !== null
                                      ? mercaOUTLocali.costoUnitarioPENMasIGV.$numberDecimal
                                        ? mercaOUTLocali.costoUnitarioPENMasIGV.$numberDecimal
                                        : mercaOUTLocali.costoUnitarioPENMasIGV
                                      : 0;
                                  ctx_buscar_mercaderia_out.pUtilidad = mercaOUTLocali.porcentajeUtilidad.$numberDecimal;
                                  ctx_buscar_mercaderia_out.mostrarPanelEditPrecioPublicoIN = true;
                                  // ctx.mostrarSpinner = true;

                                  //console.log('la merca A Editar IN', ctx.mM);
                                }}
                              />
                            )}
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
