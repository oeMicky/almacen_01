import { component$, Resource, useContext, useResource$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { cerosALaIzquierda } from '~/functions/comunes';
import type { IReporteNotaVentaCredito } from '~/interfaces/iVenta';
import { CTX_INDEX_GESTION_NOTA_VENTA_CREDITO } from '~/routes/(ventas)/gestionNotaVentaCredito';

export default component$((props: { parametrosBusqueda: any; buscarPorFechaConceptos: boolean }) => {
  //#region CONTEXTO
  const ctx_index_gestion_nota_venta_credito = useContext(CTX_INDEX_GESTION_NOTA_VENTA_CREDITO);
  //#endregion CONTEXTO

  //#region INICIALIZANDO
  let suma_TOTAL_IMPORTE_PEN = 0;
  let suma_TOTAL_EFECTIVO_PEN = 0;
  let suma_TOTAL_OTROMONTO_PEN = 0;
  let suma_TOTAL_CREDITO_PEN = 0;
  //#endregion INICIALIZANDO

  //#region BUSCANDO REGISTROS
  const lasNotasVentas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaNotasVentas ->->-> parameBusqueda', props.parametrosBusqueda);
    // track(() => props.buscarNotasVentas.valueOf());
    track(() => ctx_index_gestion_nota_venta_credito.buscarGestionNotasVentasCredito);

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    let res;
    if (props.buscarPorFechaConceptos) {
      res = await fetch(`${import.meta.env.VITE_URL}/api/notaVenta/obtenerNotaVentaCreditoEntreFechas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
    } else {
      res = await fetch(`${import.meta.env.VITE_URL}/api/notaVenta/obtenerNotaVentaCreditoClienteSobrenombreChapa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
    }

    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <>
      <Resource
        value={lasNotasVentas}
        onPending={() => {
          //console.log('onPending 🍉🍉🍉🍉');
          //
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          //console.log('onRejected 🍍🍍🍍🍍');
          // props.buscarNotasVentas = false;
          ctx_index_gestion_nota_venta_credito.mostrarSpinner = false;
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(notasVentas) => {
          console.log('onResolved 🍓🍓🍓🍓g', notasVentas);
          const { data } = notasVentas; //{ status, data, message }
          const misNotasVentas: IReporteNotaVentaCredito[] = data;
          //   ctx_index_nota_venta.miscNtsVts = misNotasVentas;
          ctx_index_gestion_nota_venta_credito.mostrarSpinner = false;
          // //console.log(misNotasVentas);
          // props.buscarNotasVentas = false;
          return (
            <>
              {misNotasVentas.length > 0 ? (
                <>
                  <table class="tabla-venta" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Cliente</th>
                        <th>Observación</th>
                        <th>Fecha</th>
                        <th>Ser-Nro</th>
                        <th>Importe</th>
                        <th>Mon</th>
                        {/* <th>Método pago</th> */}
                        <th>Efectivo</th>
                        <th>O. M. Pago</th>
                        <th>Monto O. M. Pago</th>
                        <th>Crédito</th>
                        <th>Crédito Cobrado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misNotasVentas.map((notaVenta: any, index: number) => {
                        const indexItem = index + 1;
                        let efec = 0;
                        let otro = 0;
                        let cred = 0;
                        let tot = 0;

                        // efec =
                        //   notaVenta.metodoPago === 'CONTADO'
                        //     ? notaVenta.todoEnEfectivo
                        //       ? notaVenta.totalPEN.$numberDecimal
                        //       : notaVenta.montoEnEfectivo.$numberDecimal
                        //     : 0;
                        //  notaVenta.totalPEN.$numberDecimal ? notaVenta.totalPEN.$numberDecimal : notaVenta.totalPEN;
                        efec = notaVenta.montoEnEfectivo.$numberDecimal;
                        otro = notaVenta.montoOtroMedioPago.$numberDecimal;
                        cred = notaVenta.importeTotalCuotasCredito.$numberDecimal;
                        tot = notaVenta.totalPEN.$numberDecimal ? notaVenta.totalPEN.$numberDecimal : notaVenta.totalPEN;

                        // const aMod: any = notaVenta.ganancias.find((element: any) => element.tipo === 'MERCADERIA');
                        // // //console.log('aMod', aMod);
                        // if (typeof aMod !== 'undefined') {
                        //   mer = aMod.gan.$numberDecimal ? aMod.gan.$numberDecimal : aMod.gan;
                        // }
                        // const aSod: any = notaVenta.ganancias.find((element: any) => element.tipo === 'SERVICIO');
                        // // //console.log('aSod', aSod);
                        // if (typeof aSod !== 'undefined') {
                        //   ser = aSod.gan.$numberDecimal ? aSod.gan.$numberDecimal : aSod.gan;
                        // }
                        suma_TOTAL_IMPORTE_PEN = suma_TOTAL_IMPORTE_PEN + Number(tot);
                        suma_TOTAL_EFECTIVO_PEN = suma_TOTAL_EFECTIVO_PEN + Number(efec);
                        suma_TOTAL_OTROMONTO_PEN = suma_TOTAL_OTROMONTO_PEN + Number(otro);
                        suma_TOTAL_CREDITO_PEN = suma_TOTAL_CREDITO_PEN + Number(cred);

                        return (
                          // <tr key={notaVenta._id} style={notaVenta.metodoPago === 'CRÉDITO' ? { color: 'purple', fontWeight: 'bold' } : {}}>
                          <tr key={notaVenta._id}>
                            <td data-label="Item">{cerosALaIzquierda(indexItem, 3)}</td>
                            <td data-label="Cliente">{notaVenta.clienteSobrenombreChapa ? notaVenta.clienteSobrenombreChapa : '-'}</td>
                            <td data-label="Observación">{notaVenta.observacion ? notaVenta.observacion : '-'}</td>
                            <td data-label="Fecha">
                              {/* {notaVenta.fechaLocal.substring(8, 10) + '/' + notaVenta.fechaLocal.substring(5, 7) + '/' + notaVenta.fechaLocal.substring(0, 4)} */}

                              {notaVenta.fechaLocal.substring(0, 2) + '/' + notaVenta.fechaLocal.substring(3, 5) + '/' + notaVenta.fechaLocal.substring(6, 10)}
                            </td>
                            <td data-label="Ser-Nro">
                              {notaVenta.serie + ' - ' + cerosALaIzquierda(notaVenta.numero, 8)}
                              {notaVenta.existeOtros ? <img src={images.puntoAzul} alt="Punto verde" width="12" height="12" /> : ''}
                            </td>
                            <td data-label="Importe" class="comoNumeroLeft">
                              {notaVenta.moneda === 'PEN'
                                ? parseFloat(notaVenta.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })
                                : parseFloat(notaVenta.totalUSD.$numberDecimal).toLocaleString('en-US', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td data-label="Mon">{notaVenta.moneda}</td>
                            {/* <td data-label="Metodo pago" style={notaVenta.metodoPago === 'CRÉDITO' ? { fontWeight: 'bold' } : {}}>
                              {notaVenta.metodoPago}
                            </td> */}
                            <td data-label="Efectivo" class="comoNumeroLeft">
                              {parseFloat(notaVenta.montoEnEfectivo.$numberDecimal) === 0
                                ? '-'
                                : parseFloat(notaVenta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                              {/* {notaVenta.metodoPago === 'CONTADO'
                                ? notaVenta.todoEnEfectivo
                                  ? parseFloat(notaVenta.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                  : parseFloat(notaVenta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                      // style: 'currency',
                                      currency: 'PEN',
                                      minimumFractionDigits: 2,
                                    })
                                : notaVenta.unaParteEnEfectivo
                                ? parseFloat(notaVenta.montoEnEfectivo.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })
                                : '-'} */}
                            </td>
                            <td data-label="O. M. Pago">
                              {notaVenta.otroMedioPago ? notaVenta.otroMedioPago : '-'}
                              {/* {notaVenta.metodoPago === 'CONTADO' ? (notaVenta.todoEnEfectivo ? '' : notaVenta.otroMedioPago) : ''} */}
                            </td>
                            <td data-label="Monto O. M. Pago" class="comoNumeroLeft">
                              {parseFloat(notaVenta.montoOtroMedioPago.$numberDecimal) === 0
                                ? '-'
                                : parseFloat(notaVenta.montoOtroMedioPago.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td data-label="Crédito" class="comoNumeroLeft">
                              {parseFloat(notaVenta.importeTotalCuotasCredito.$numberDecimal) === 0
                                ? '-'
                                : parseFloat(notaVenta.importeTotalCuotasCredito.$numberDecimal).toLocaleString('en-PE', {
                                    // style: 'currency',
                                    currency: 'PEN',
                                    minimumFractionDigits: 2,
                                  })}
                            </td>
                            <td data-label="Crédito Cobrado" class="accionesLeft">
                              {notaVenta.creditoCobrado ? 'SI' : '-'}
                              {/* {notaVenta.metodoPago === 'CONTADO' ? (notaVenta.todoEnEfectivo ? '' : notaVenta.otroMedioPago) : ''} */}
                            </td>
                            <td data-label="Acciones" class="accionesLeft">
                              <input
                                type="image"
                                src={images.moneyBag}
                                title="Registrar cobro"
                                height={14}
                                width={14}
                                style={{ marginRight: '6px' }}
                                onClick$={() => {
                                  ctx_index_gestion_nota_venta_credito.GNVC = notaVenta;
                                  ctx_index_gestion_nota_venta_credito.mostrarPanelCobrosNVCredito = true;
                                }}
                                // style={{ marginRight: '6px' }}
                                // onClick$={async () => {
                                //   ctx_index_gestion_nota_venta_credito.mostrarSpinner = true;
                                //   //   idNotaVentaSeleccionada.value = notaVenta._id;
                                //   //   clickPDF.value++;
                                //   ctx_index_gestion_nota_venta_credito.mostrarSpinner = false;
                                // }}
                              />
                              {/* <input
                                type="image"
                                src={images.print}
                                title="Imprimir"
                                height={14}
                                width={14}
                                style={{ marginRight: '6px' }}
                                onClick$={async () => {
                                  ctx_index_gestion_nota_venta_credito.mostrarSpinner = true;
                                  //   idNotaVentaSeleccionada.value = notaVenta._id;
                                  //   clickPDF.value++;
                                  ctx_index_gestion_nota_venta_credito.mostrarSpinner = false;
                                }}
                              /> */}
                              <input
                                type="image"
                                src={images.see}
                                title="Ver detalle"
                                height={14}
                                width={14}
                                style={{ marginRight: '6px' }}
                                onClick$={async () => {
                                  // ctx_index_nota_venta.mostrarSpinner = true;

                                  // ctx_index_nota_venta.buscarNotasVentas++;
                                  ctx_index_gestion_nota_venta_credito.GNVC = notaVenta;
                                  ctx_index_gestion_nota_venta_credito.mostrarPanelVerNotaVenta = true;
                                }}
                              />
                              <input
                                type="image"
                                src={images.edit}
                                title="Editar"
                                height={14}
                                width={14}
                                // style={{ marginRight: '6px' }}
                                onClick$={async () => {
                                  // ctx_index_nota_venta.mostrarSpinner = true;
                                  ctx_index_gestion_nota_venta_credito.GNVC = notaVenta;
                                  ctx_index_gestion_nota_venta_credito.mostrarPanelEditarClienteObservacion = true;
                                  // mostrarPanelEditarClienteObservacionCredito.value = true;
                                }}
                              />
                              {/* {typeof notaVenta.idVenta === 'undefined' || notaVenta.idVenta.trim() === '' ? (
                                <input
                                  type="image"
                                  src={images.arrowRight}
                                  title="Facturar..."
                                  height={14}
                                  width={14}
                                  style={{ marginRight: '4px' }}
                                    onClick$={async () => {
                                      if (parametrosGlobales.idGrupoEmpresarial === '') {
                                        // console.log('estaVACIA');
                                        alert('Faltan datos... vuelva a logearse..');
                                        navegarA('/login');
                                        return;
                                      }
                                      //INICIALIZANDO
                                      ctx_index_nota_venta.notaVentaENVIADA.idNotaVenta = '';
                                      ctx_index_nota_venta.notaVentaENVIADA.serieNotaVenta = '';
                                      ctx_index_nota_venta.notaVentaENVIADA.numeroNotaVenta = 0;
                                      ctx_index_nota_venta.notaVentaENVIADA.detalle = [];
                                      //validar PERIODO
                                      let anioAnterior = '';
                                      let mesAnterior = '';
                                      const anio = (document.getElementById('in_laFechaHoyVenta') as HTMLInputElement).value.substring(0, 4);
                                      const mes = (document.getElementById('in_laFechaHoyVenta') as HTMLInputElement).value.substring(5, 7);

                                      const periodoActual = anio + mes;
                                      const PPP = props.periodosCargados;
                                      if (parseInt(mes) === 1) {
                                        anioAnterior = (parseInt(anio) - 1).toString();
                                        mesAnterior = '12';
                                      } else {
                                        anioAnterior = anio;
                                        mesAnterior = cerosALaIzquierda(parseInt(mes) - 1, 2).toString();
                                      }
                                      const periodoANTE = anioAnterior + mesAnterior;

                                      const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(periodoActual));
                                      console.log('⚠⚠⚠⚠ elPeriodo', elPeriodo);
                                      if (typeof elPeriodo === 'undefined') {
                                        alert(`🔰 El período ${periodoActual} no ha sido hallado, verifique.`);
                                        return;
                                      }
                                      periodo.idPeriodo = elPeriodo._id;
                                      periodo.periodo = elPeriodo.periodo;
                                   
                                      const elPeriodoAnterior: any = PPP.find((ele: any) => ele.periodo === parseInt(periodoANTE));
                                      periodoAnterior.idPeriodo = elPeriodoAnterior._id;
                                      periodoAnterior.periodo = elPeriodoAnterior.periodo;

                                      if (periodo.idPeriodo === '') {
                                        alert('🔰 Seleccione el periodo.');
                                        document.getElementById('se_periodo')?.focus();
                                        // ini.value++;
                                        return;
                                      }
                                      ctx_index_nota_venta.mostrarSpinner = true;

                                      let elIgv = await getIgvVenta({
                                        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                                        idEmpresa: parametrosGlobales.idEmpresa,
                                      });
                                      elIgv = elIgv.data;
                                      //
                                      igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //

                                      ctx_index_nota_venta.notaVentaENVIADA.idNotaVenta = notaVenta._id;
                                      ctx_index_nota_venta.notaVentaENVIADA.serieNotaVenta = notaVenta.serie;
                                      ctx_index_nota_venta.notaVentaENVIADA.numeroNotaVenta = notaVenta.numero;
                                      ctx_index_nota_venta.notaVentaENVIADA.igv = igv.value;
                                      ctx_index_nota_venta.notaVentaENVIADA.detalle = notaVenta.itemsNotaVenta;
                                      ctx_index_nota_venta.notaVentaENVIADA.addPeriodo = periodo;
                                      ctx_index_nota_venta.notaVentaENVIADA.addPeriodoAnterior = periodoAnterior;

                                      console.log('ctx_index_nota_venta', ctx_index_nota_venta);

                                      ctx_index_nota_venta.mostrarPanelVenta = true;
                                    }}
                                />
                              ) : (
                                ''
                              )} */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={5} class="comoNumero" style={{ color: '#2E1800' }}>
                          TOTALES PEN
                        </td>
                        <td class="comoNumero" style={{ color: '#2E1800' }}>
                          {/* {suma_TOTAL_IMPORTE_PEN} */}
                          {`${suma_TOTAL_IMPORTE_PEN.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoCadena" style={{ color: '#2E1800' }}></td>
                        <td class="comoNumero" style={{ color: '#2E1800' }}>
                          {`${suma_TOTAL_EFECTIVO_PEN.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero"></td>
                        <td class="comoNumero" style={{ color: '#2E1800' }}>
                          {`${suma_TOTAL_OTROMONTO_PEN.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td class="comoNumero" style={{ color: '#2E1800' }}>
                          {`${suma_TOTAL_CREDITO_PEN.toLocaleString('en-PE', {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </td>
                        <td colSpan={2} class="comoNumero"></td>
                      </tr>
                    </tfoot>
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
    </>
  );
});
