import { $, Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import ImgButton from '../system/imgButton';
// import { images } from '~/assets';
import { ICompra } from '~/interfaces/iCompra';
import style from '../tabla/tabla.css?inline';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_COMPRA } from '~/routes/(almacen)/compra';

export default component$((props: { buscarCompras: number; parametrosBusqueda: any }) => {
  useStyles$(style);

  //#region CONTEXTO
  const ctx_index_compra = useContext(CTX_INDEX_COMPRA);
  //#region CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasCompras = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    console.log('tablaCompras ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => props.buscarCompras.valueOf());

    console.log('props.buscarCompras.valueOf', props.buscarCompras.valueOf());
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const res = await fetch(`${import.meta.env.VITE_URL}/api/compra/obtenerComprasPorFechas`, {
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
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(compras) => {
          console.log('onResolved 🍓🍓🍓🍓');
          const { data } = compras; //{ status, data, message }
          const misCompras: ICompra[] = data;
          // props.buscarVentas = false;
          console.log('misCompras', misCompras);
          return (
            <>
              {misCompras.length > 0 ? (
                <>
                  <table class="tabla-venta" style={{ fontSize: '0.6em', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Nro. Doc</th>
                        <th>Proveedor</th>
                        <th>Ser-Nro</th>
                        <th>Fecha</th>
                        <th>Mon</th>
                        <th>Importe</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misCompras.map((compra, index) => {
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
                            <td data-label="Ser-Nro" class="comoCadena">
                              {compra.serie + '-' + compra.numero}
                            </td>
                            <td data-label="Fecha" class="comoCadena">
                              {formatoDDMMYYYY_PEN(compra.fecha)}
                            </td>
                            <td data-label="Mon" class="acciones" style={'moneda' in compra ? {} : { background: '#8A2BE2' }}>
                              {'moneda' in compra ? compra.moneda : '_'}
                            </td>
                            <td data-label="Importe" class="comoNumero">
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
                            <td data-label="Acciones" class="acciones">
                              <ImgButton
                                src={images.edit}
                                alt="icono de editar"
                                height={14}
                                width={14}
                                title={`Editar documento`}
                                onClick={$(() => {
                                  ctx_index_compra.cC = compra;
                                  ctx_index_compra.mostrarPanelCompra = true;
                                })}
                              />
                              <ImgButton
                                src={images.mercaderia}
                                alt="icono de mercaderías"
                                height={14}
                                width={14}
                                title={`Ver mercaderías`}
                                onClick={$(() => {
                                  if (compra.idIngresoAAlmacen) {
                                    alert(compra.idIngresoAAlmacen);
                                  } else {
                                    alert('la compra no cuenta con el ingreso de la mercadería al almacén');
                                  }

                                  // ctx_index_compra.cC = compra;
                                  // ctx_index_compra.mostrarPanelCompra = true;
                                })}
                              />
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
