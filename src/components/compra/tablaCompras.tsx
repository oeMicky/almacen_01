import { Resource, component$, useResource$, useStyles$ } from '@builder.io/qwik';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import ImgButton from '../system/imgButton';
// import { images } from '~/assets';
import { ICompra } from '~/interfaces/iCompra';
import style from '../tabla/tabla.css?inline';

export default component$((props: { buscarCompras: number; parametrosBusqueda: any }) => {
  useStyles$(style);

  //#region BUSCANDO REGISTROS
  const lasCompras = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    console.log('tablaVentas ->->-> parameBusqueda', props.parametrosBusqueda);
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
                  <table class="tabla-venta" style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
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
                      {misCompras.map((value, index) => {
                        const indexItem = index + 1;
                        return (
                          <tr key={value._id}>
                            <td data-label="Item">{indexItem}</td>
                            <td data-label="Nro. Doc">{value.tipoDocumentoIdentidad + ': ' + value.numeroIdentidad}</td>
                            <td data-label="Proveedor">{value.razonSocialNombre}</td>
                            <td data-label="Ser-Nro">{value.serie + '-' + value.numero}</td>
                            <td data-label="Fecha">{formatoDDMMYYYY_PEN(value.fecha)}</td>
                            <td data-label="Mon" style={{ textAlign: 'center' }}>
                              {value.moneda}
                            </td>
                            <td data-label="Importe" style={{ textAlign: 'end' }}>
                              {typeof value.totalPEN !== 'undefined'
                                ? value.moneda === 'PEN'
                                  ? parseFloat(value.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                  : parseFloat(value.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                : ''}
                            </td>
                            <td data-label="Acciones" style={{ textAlign: 'right' }}>
                              {/* <ImgButton
                                src={images.pdf}
                                alt="icono de pdf"
                                height={12}
                                width={12}
                                title={`Ver pdf ${value._id}`}
                                // onClick={$(() => {
                                //   ventaSeleccionada.value = value;
                                //   clickPDF.value = clickPDF.value + 1;
                                // })}
                              />
                              <ImgButton
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
