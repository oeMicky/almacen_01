import { $, component$, Resource, useResource$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { images } from '~/assets';
import styles from '../../components/tabla.css?inline';
import ImgButton from '../system/imgButton';
//------- import pdfFactura98 from '~/reports/98/pdfFactura98.jsx';

// interface IEstructura {
//   _id: string;
//   especie: string;
//   numero: number;
// }

export interface IVenta {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;

  ruc: string;
  empresa: string;
  direccion: string;

  codigoDocumento: string;
  documentoVenta: string;
  serie: string;
  numeroDocumento: string;
  fecha: any;

  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
  email: string;

  igv: any;
  moneda: string;
  tipoCambio: any;

  vendedor: string;
  metodoPago: string;
  cuotasPago: any;
  importeTotalCuotasCredito: any;

  itemsVenta: any;

  montoSubTotalPEN: any;
  montoIGVPEN: any;
  montoTotalPEN: any;

  montoSubTotalUSD: any;
  montoIGVUSD: any;
  montoTotalUSD: any;

  fechaReferencia: Date;
  tipoReferencia: string;
  serieReferencia: string;
  numeroReferencia: string;

  usuarioCrea: string;
  usuarioModifica: string;
}

export default component$((props: { buscarVentas: number; parameBusqueda: { idGrupoEmpresarial: string } }) => {
  console.log('🎫🎫🎫🎫🎫🎫');
  const clickPDF = useSignal(0);
  const ventaSeleccionada = useSignal<IVenta>();

  useStylesScoped$(styles);
  // const clikeado = useSignal(false);

  const verPDF = $((venta: any) => {
    console.log('a pdfFactura98', venta.untrackedValue); //venta !== null &&
    if (typeof venta.untrackedValue !== 'undefined') {
      console.log('imprimiendo ... imprimiendo ... imprimiendo ... imprimiendo ...', venta.untrackedValue);
      //------------- pdfFactura98(venta.untrackedValue);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDF.value);
    console.log('a useTask useTask useTask useTask:', clickPDF.value);
    // console.log('a useTask useTask useTask useTask 2:', clickPDF.value + 1);
    await verPDF(ventaSeleccionada);
  });

  const lasVentas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    console.log('tablaVentas ->->-> parameBusqueda', props.parameBusqueda);
    track(() => props.buscarVentas.valueOf());

    console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('FETCH->: ', `http://localhost:4000/api/venta/obtenerVentasPorFechas`);
    const res = await fetch(`http://localhost:4000/api/venta/obtenerVentasPorFechas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.parameBusqueda),
      signal: abortController.signal,
    });
    return res.json();
  });

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
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(ventas) => {
          console.log('onResolved 🍓🍓🍓🍓');
          const { data } = ventas; //{ status, data, message }
          const misVentas: IVenta[] = data;
          // props.buscarVentas = false;
          return (
            <>
              {misVentas.length > 0 ? (
                <>
                  {/* <button
                    onClick$={() => {
                      console.log('ventaSeleccionada', ventaSeleccionada.value);
                    }}
                  >
                    desde tabla al falso
                  </button> */}
                  <table style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Fecha</th>
                        <th>Nro. Doc</th>
                        <th>Cliente</th>
                        <th>Serie</th>
                        <th>Nro</th>
                        <th>Moneda</th>
                        <th>Importe</th>
                        <th>Pago</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misVentas.map((value, index) => {
                        const indexItem = index + 1;
                        return (
                          <tr key={value._id}>
                            <td>{indexItem}</td>
                            <td>{formatoDDMMYYYY_PEN(value.fecha)}</td>
                            <td>{value.tipoDocumentoIdentidad + ': ' + value.numeroIdentidad}</td>
                            <td>{value.razonSocialNombre}</td>
                            <td>{value.serie}</td>
                            <td>{value.numeroDocumento}</td>
                            <td style={{ textAlign: 'center' }}>{value.moneda}</td>
                            <td style={{ textAlign: 'end' }}>
                              {value.moneda === 'PEN'
                                ? parseFloat(value.montoTotalPEN.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })
                                : parseFloat(value.montoTotalUSD.$numberDecimal).toLocaleString('en-US', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td>{value.metodoPago}</td>
                            <td style={{ textAlign: 'center' }}>
                              {/* <ImgButton src={images.edit} alt="icono de editar" height={12} width={12} title="Editar venta" /> */}
                              <ImgButton
                                src={images.pdf}
                                alt="icono de pdf"
                                height={12}
                                width={12}
                                title={`Ver pdf ${value._id}`}
                                // onClick={verPDF(value)}
                                // onClick={clikeado.value ? verPDF(value) : ''}
                                onClick={$(() => {
                                  ventaSeleccionada.value = value;
                                  clickPDF.value = clickPDF.value + 1;
                                })}
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
                  <i style={{ fontSize: '0.7rem' }}>No se encontraron registros</i>
                  {/* <button
                    onClick$={() => {
                      props.buscarVentas = false;
                    }}
                  >
                    al falso
                  </button> */}
                </div>
              )}
            </>
          );
        }}
      />
    </>
  );

  // const lasVentas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
  //   track(() => props.buscarVentas.valueOf());
  //   const abortController = new AbortController();
  //   cleanup(() => abortController.abort('cleanup'));
  //   console.log('FETCH->: ', `http://localhost:4000/api/venta/ventas`);
  //   const res = await fetch(`http://localhost:4000/api/venta/ventas`, {
  //     signal: abortController.signal,
  //   });
  //   return res.json();
  // });

  // return (
  //   <>
  //     {/* {props.buscarVentas && ( */}
  //     <Resource
  //       value={lasVentas}
  //       onPending={() => <div>Cargando...</div>}
  //       onRejected={() => <div>Fallo en la carga de datos</div>}
  //       onResolved={(ventas) => {
  //         const { status, data, message } = ventas;
  //         const misVentas: IEstructura[] = data;
  //         // return <div id="especies">{props.buscarVentas.valueOf() && <>a {misVentas[0].especie} domingos</>}</div>;
  //         return (
  //           <div id="especies">
  //             {props.buscarVentas.valueOf() && (
  //               <>
  //                 a{' '}
  //                 {misVentas.map((value, index) => {
  //                   return (
  //                     <>
  //                       <div>{index + 1}</div>
  //                       <div>{value._id}</div>
  //                       <div>{value.especie}</div>
  //                       <div>{value.numero}</div>
  //                     </>
  //                   );
  //                 })}{' '}
  //                 domingos
  //               </>
  //             )}
  //           </div>
  //         );
  //       }}
  //     />
  //     {/* )} */}
  //   </>
  // );
});

// <table style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
//   <thead>
//     <tr>
//       <th>Item</th>
//       <th>Cliente</th>
//     </tr>
//   </thead>
//   <tbody>
//     <tr>
//       <td>11</td>
//       <td>aa</td>
//     </tr>
// {ventas.map((ven: any, index: number) => {
//       const { razonSocialNombre } = ven;
//       const indexItem = index + 1;
//       return (
//         <tr key={indexItem}>
//           <td key={indexItem}>{indexItem}</td>
//           <td>{razonSocialNombre}</td>
//         </tr>
//       );
//     })}
//   {/* </tbody>
// </table> */}
