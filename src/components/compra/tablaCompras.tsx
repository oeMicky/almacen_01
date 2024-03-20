import { Resource, component$, useContext, useResource$, useStyles$, useTask$ } from '@builder.io/qwik';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import ImgButton from '../system/imgButton';
// import { images } from '~/assets';
// import type { ICompra } from '~/interfaces/iCompra';
import style from '../tabla/tabla.css?inline';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_COMPRA } from '~/routes/(almacen)/compra';

export default component$((props: { buscarCompras: number; parametrosBusqueda: any }) => {
  useStyles$(style);

  //#region CONTEXTO
  const ctx_index_compra = useContext(CTX_INDEX_COMPRA);
  //#region CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasCompras = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // ctx_index_compra.miscCs = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaCompras ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => props.buscarCompras.valueOf());

    // console.log('props.buscarCompras.valueOf', props.buscarCompras.valueOf());
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const res = await fetch(`${import.meta.env.VITE_URL}/api/compra/obtenerComprasPorPeriodo`, {
      // const res = await fetch(`${import.meta.env.VITE_URL}/api/compra/obtenerComprasPorFechas`, {
      // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
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

  //#region ACTUALZIAR TABLA COMPRAS
  useTask$(({ track }) => {
    track(() => ctx_index_compra.miscCs);
  });
  //#endregion ACTUALZIAR TABLA COMPRAS

  return (
    <>
      <Resource
        value={lasCompras}
        onPending={() => {
          console.log('onPending 🍉🍉🍉🍉');
          //
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          console.log('onRejected 🍍🍍🍍🍍');
          // props.buscarVentas = false;
          ctx_index_compra.mostrarSpinner = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(compras: any) => {
          console.log('onResolved 🍓🍓🍓🍓');
          const { data } = compras; //{ status, data, message }
          // const misCompras: ICompra[] = data;
          ctx_index_compra.miscCs = data;
          // props.buscarVentas = false;
          ctx_index_compra.mostrarSpinner = false;
          // console.log('misCompras', misCompras);
          return (
            <>
              {ctx_index_compra.miscCs.length > 0 ? (
                <>
                  <table class="tabla-compra" style={{ fontSize: '0.6em', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Nro. Doc</th>
                        <th>Proveedor</th>
                        <th>Fecha</th>
                        <th>Ser-Nro</th>
                        <th>Importe</th>
                        <th>Mon</th>
                        <th>Dt</th>
                        <th>Rt</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ctx_index_compra.miscCs.map((compra: any, index: number) => {
                        const indexItem = index + 1;
                        return (
                          <tr key={compra._id}>
                            <td data-label="Item" class="comoCadena">
                              {indexItem}
                            </td>
                            <td data-label="Nro. Doc" class="comoCadena">
                              {compra.tipoDocumentoIdentidad + ': ' + compra.numeroIdentidad}
                            </td>
                            <td data-label="Proveedor" class="comoCadena">
                              {compra.razonSocialNombre}
                            </td>
                            <td data-label="Fecha" class="comoCadena">
                              {formatoDDMMYYYY_PEN(compra.fecha)}
                            </td>
                            <td data-label="Ser-Nro" class="comoCadena">
                              {compra.serie + ' - ' + compra.numero}
                            </td>
                            <td
                              data-label="Importe"
                              class="comoNumero"
                              // style={'tipoCompra' in compra ? {} : { background:'#8A2BE2'  }}
                            >
                              {/* {compra.totalPEN.$numberDecimal} */}
                              {/* {typeof compra.totalPEN !== 'undefined'  style={compra.moneda === '' ? { background: 'red' } : ''}
                                ? compra.moneda === 'PEN'
                                  ? compra.totalPEN.$numberDecimal
                                  : compra.totalUSD.$numberDecimal
                                : ''} */}
                              {typeof compra.totalPEN !== 'undefined'
                                ? compra.moneda === 'PEN'
                                  ? parseFloat(compra.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                  : parseFloat(compra.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                : '_'}
                            </td>
                            <td data-label="Mon" class="acciones" style={'tipoCompra' in compra ? {} : { background: '#FFD700' }}>
                              {'moneda' in compra ? compra.moneda : '_'}
                            </td>
                            <td data-label="Dt" class="acciones">
                              {compra.detraccion ? 'Si' : '-'}
                            </td>
                            <td data-label="Rt" class="acciones">
                              {compra.retencion ? 'Si' : '-'}
                            </td>
                            <td data-label="Acciones" class="acciones">
                              <input
                                type="image"
                                src={images.edit}
                                title={`Editar documento`}
                                alt="icono de editar"
                                height={12}
                                width={12}
                                onClick$={() => {
                                  ctx_index_compra.cC = compra;
                                  // ctx_index_compra.inddd = index;
                                  ctx_index_compra.mostrarPanelCompra = true;
                                }}
                              />
                              <input
                                type="image"
                                src={images.mercaderia}
                                title={`Ver mercaderías`}
                                alt="icono de mercaderías"
                                hidden={compra.idIngresoAAlmacen ? false : true}
                                height={12}
                                width={12}
                                onClick$={() => {
                                  if (compra.idIngresoAAlmacen) {
                                    alert(compra.idIngresoAAlmacen);
                                  } else {
                                    alert('la compra no cuenta con el ingreso de la mercadería al almacén');
                                  }

                                  // ctx_index_compra.cC = compra;
                                  // ctx_index_compra.mostrarPanelCompra = true;
                                }}
                              />
                              {/* <input
                                type="image"
                                src={images.see}
                                title={`Ver mercaderías`}
                                alt="icono de mercaderías"
                                // hidden={compra.idIngresoAAlmacen ? false : true}
                                height={12}
                                width={12}
                                onClick$={() => {
                                  console.log('ctx_index_compra.miscCs:::', ctx_index_compra.miscCs);

                                  // ctx_index_compra.cC = compra;
                                  // ctx_index_compra.mostrarPanelCompra = true;
                                }}
                              /> */}
                              {/*  <ImgButton
                                src={images.xml}
                                alt="icono de xml"
                                height={12}
                                width={12}
                                title={`Ver xml ${value._id}`}
                                // onClick={$(() => {
                                //   ventaSeleccionada.value = value;
                                //   createAndDownloadFile(value.serie + '-' + value.numeroDocumento);
                                //   console.log('xml', ventaSeleccionada.value);
                                // })}
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
    </>
  );
});
