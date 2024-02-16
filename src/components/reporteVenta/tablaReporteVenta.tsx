import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import { cerosALaIzquierda, formatearMonedaPEN, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import type { IReporteVenta } from '~/interfaces/iVenta';
import { CTX_INDEX_REPORTE_VENTA } from '~/routes/(almacen)/reporteVenta';
import style from '../tabla/tabla.css?inline';

export default component$((props: { buscarReporteVentas: number; parametrosBusqueda: any }) => {
  useStyles$(style);
  //#region CONTEXTO
  const ctx_index_reporteventa = useContext(CTX_INDEX_REPORTE_VENTA);
  //#region CONTEXTO

  //#region INICIALIZAR
  let suma_GAxM = 0;
  let suma_GAxS = 0;
  let suma_TOTAL = 0;
  //#endregion INICIALIZAR

  //#region BUSCANDO REGISTROS
  const lasVentas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaReporteVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => props.buscarReporteVentas.valueOf());

    // console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
    if (props.parametrosBusqueda.buscarPor === 'FECHAS') {
      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));
      // console.log('first FECHASSSSSSSSSSSSSSSSSSSSSSS');
      const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/reporteVentasPorFechas`, {
        // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorFechas`, {
        // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.buscarPor === 'PERIODO') {
      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));
      // console.log('first PERIODOSSSSSSSSSSSSSSSSSSSSSSS');
      const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/reporteVentasPorPeriodo`, {
        // const res = await fetch(`${import.meta.env.VITE_URL}/api/venta/obtenerVentasPorFechas`, {
        // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
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
    <>
      <Resource
        value={lasVentas}
        onPending={() => {
          console.log('onPending 🍉🍉🍉🍉');
          //
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          console.log('onRejected 🍍🍍🍍🍍');
          // props.buscarVentas = false;
          ctx_index_reporteventa.mostrarSpinner = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(ventas) => {
          console.log('onResolved 🍓🍓🍓🍓');
          const { data } = ventas; //{ status, data, message }
          const misVentas: IReporteVenta[] = data;
          ctx_index_reporteventa.misRepoVts = misVentas;
          ctx_index_reporteventa.mostrarSpinner = false;

          return (
            <>
              {misVentas.length > 0 ? (
                <>
                  <table class="tabla-venta" style={{ fontSize: '0.6em', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Nro. Doc</th>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Ser-Nro</th>
                        <th>GAxM</th>
                        <th>GAxS</th>
                        <th>Importe</th>
                        {/* <th>Mon</th> */}
                        {/* <th>Pago</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {misVentas.map((value, index) => {
                        const indexItem = index + 1;
                        let mer = 0;
                        let ser = 0;
                        let tot = 0;
                        tot = value.totalPEN.$numberDecimal ? value.totalPEN.$numberDecimal : value.totalPEN;

                        const aMod: any = value.ganancias.find((element: any) => element.tipo === 'MERCADERIA');
                        // console.log('aMod', aMod);
                        if (typeof aMod !== 'undefined') {
                          mer = aMod.gan.$numberDecimal ? aMod.gan.$numberDecimal : aMod.gan;
                        }
                        const aSod: any = value.ganancias.find((element: any) => element.tipo === 'SERVICIO');
                        // console.log('aSod', aSod);
                        if (typeof aSod !== 'undefined') {
                          ser = aSod.gan.$numberDecimal ? aSod.gan.$numberDecimal : aSod.gan;
                        }
                        suma_GAxM = suma_GAxM + Number(mer);
                        suma_GAxS = suma_GAxS + Number(ser);
                        suma_TOTAL = suma_TOTAL + Number(tot);
                        return (
                          <tr key={value._id}>
                            <td data-label="Item" class="comoCadena">
                              {indexItem}
                            </td>
                            <td data-label="Nro. Doc" class="comoCadena">
                              {value.tipoDocumentoIdentidad + ': ' + value.numeroIdentidad}
                            </td>
                            <td data-label="Cliente" class="comoCadena">
                              {value.razonSocialNombre}
                            </td>
                            <td data-label="Fecha" class="comoCadena">
                              {formatoDDMMYYYY_PEN(value.fecha)}
                            </td>
                            <td data-label="Ser-Nro" class="comoCadena">
                              {value.serie + ' - ' + cerosALaIzquierda(value.numero, 8)}
                            </td>
                            <td data-label="GAxM" class="comoNumero">
                              {formatearMonedaPEN(mer)}
                              {/* {formatear_2Decimales(mer)} */}
                              {/* {`${mer.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`} */}
                            </td>
                            <td data-label="GAxS" class="comoNumero">
                              {formatearMonedaPEN(ser)}
                              {/* {`${ser.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`} */}
                            </td>
                            <td data-label="Importe" class="comoNumero">
                              {/* {formatearMonedaPEN(value.totalPEN.$numberDecimal)} */}
                              {`${parseFloat(value.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`}
                            </td>
                            {/* <td data-label="Importe" class="comoNumero">
                              {value.moneda === 'PEN'
                                ? parseFloat(value.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })
                                : parseFloat(value.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td> */}
                            {/* <td data-label="Mon" class="acciones">
                              {value.moneda}
                            </td> */}
                            {/* <td data-label="Pago" class="comoCadena">
                              {value.metodoPago}
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5} class="comoNumero">
                          TOTALES
                        </td>
                        <td class="comoNumero">
                          {`${suma_GAxM.toLocaleString('en-PE', {
                            style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero">
                          {`${suma_GAxS.toLocaleString('en-PE', {
                            style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero">
                          {`${suma_TOTAL.toLocaleString('en-PE', {
                            style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                      </tr>
                    </tfoot>
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
