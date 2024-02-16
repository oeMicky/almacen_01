import { Resource, component$, useContext, useResource$, useSignal, useStylesScoped$ } from '@builder.io/qwik';
import style from '../tabla/tabla.css?inline';
import type { IOrdenServicio } from '~/interfaces/iOrdenServicio';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda, elIdAuxiliar, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_ADD_VENTA, CTX_F_B_NC_ND } from './addVenta';

export default component$((props: { buscarOrdenesServicio: number; modoSeleccion: boolean; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
  const ctx_f_b_nc_nd = useContext(CTX_F_B_NC_ND);
  //#endregion CONTEXTOS

  //#region  VARIABLES
  const clickPDF = useSignal(0);
  const osSeleccionada = useSignal<IOrdenServicio>();
  //#endregion  VARIABLES

  //#region TRAER ORDENES DE SERVICIO
  const lasOrdenesServicio = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarOrdenesServicio.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // console.log('FETCH->: ', `http://localhost:4000/api/cotizacion/obtenerCotizacionesEntreFechas`);
    console.log('FETCH->: ', `${import.meta.env.VITE_URL}/api/ordenServicio/getOrdenesServicioTerminadasEntreFechas`);
    const res = await fetch(`${import.meta.env.VITE_URL}/api/ordenServicio/getOrdenesServicioTerminadasEntreFechas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.parametrosBusqueda),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion TRAER ORDENES DE SERVICIO

  return (
    <Resource
      value={lasOrdenesServicio}
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
      onResolved={(cotizaciones) => {
        console.log('onResolved 🍓🍓🍓🍓');
        const { data } = cotizaciones; //{ status, data, message }
        const misOrdenesServicio: IOrdenServicio[] = data;
        // props.buscarVentas = false;
        return (
          <>
            {misOrdenesServicio.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Cotización</th>
                      <th>Fecha</th>
                      <th>Nro. Doc</th>
                      <th>Cliente</th>
                      <th>Importe PEN</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misOrdenesServicio.map((value) => {
                      //, index
                      // const indexItem = index + 1;
                      return (
                        <tr key={value._id}>
                          <td data-label="O.S.">{value.serie + ' - ' + cerosALaIzquierda(value.numero, 8)}</td>
                          <td data-label="Fecha">{formatoDDMMYYYY_PEN(value.fechaInicio)}</td>
                          <td data-label="Nro. Doc">{value.tipoDocumentoIdentidad + ': ' + value.numeroIdentidad}</td>
                          <td data-label="Cliente">{value.razonSocialNombreCliente}</td>
                          <td data-label="Importe PEN" class="comoNumero">
                            {/* {value.montoTotalPEN
                              ? parseFloat(value.montoTotalPEN.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : ''} */}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            {props.modoSeleccion ? (
                              <>
                                <input
                                  // id="in_BuscarDetraccion"
                                  type="image"
                                  src={images.check32}
                                  title="Seleccionar cotización"
                                  height={14}
                                  width={14}
                                  style={{ padding: '2px' }}
                                  onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                  onClick$={() => {
                                    console.log('seleccionar cotizacion', value);

                                    ctx_f_b_nc_nd.idOrdenServicio = value._id;
                                    ctx_f_b_nc_nd.serieOrdenServicio = value.serie;
                                    ctx_f_b_nc_nd.numeroOrdenServicio = value.numero;

                                    ctx_f_b_nc_nd.observacion = value.serie + ' - ' + cerosALaIzquierda(value.numero, 8);

                                    ctx_f_b_nc_nd.idCliente = value.idCliente;

                                    ctx_f_b_nc_nd.codigoTipoDocumentoIdentidad = value.codigoTipoDocumentoIdentidad;
                                    ctx_f_b_nc_nd.tipoDocumentoIdentidad = value.tipoDocumentoIdentidad;
                                    ctx_f_b_nc_nd.numeroIdentidad = value.numeroIdentidad;
                                    ctx_f_b_nc_nd.razonSocialNombre = value.razonSocialNombreCliente;
                                    ctx_f_b_nc_nd.itemsVenta = [];
                                    let nuevoITEM = 1;
                                    value.servicios.map((ser: any) => {
                                      console.log('ser', ser);
                                      ctx_f_b_nc_nd.itemsVenta.push({
                                        idAuxiliar: parseInt(elIdAuxiliar()),
                                        idKardex: null,
                                        item: nuevoITEM,
                                        tipo: 'SERVICIO',
                                        codigo: ser.codigo ? ser.codigo : '_',
                                        descripcionEquivalencia: ser.descripcionEquivalencia, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',
                                        cantidad: ser.cantidad.$numberDecimal,
                                        unidadEquivalencia: ser.unidadEquivalencia ? ser.unidadEquivalencia : '_',
                                        costoUnitarioPEN: 0,
                                        precioPEN: ser.precioPEN.$numberDecimal,
                                        ventaPEN: ser.cantidad.$numberDecimal * ser.precioPEN.$numberDecimal,
                                        precioUSD: 0,
                                        ventaUSD: 0,
                                        // idAuxiliar: parseInt(elIdAuxiliar()),
                                        // item: nuevoITEM,
                                        // tipo: 'SERVICIO',
                                        // codigo: ser.codigo,
                                        // descripcionEquivalencia: ser.descripcionEquivalencia,
                                        // cantidad: ser.cantidad.$numberDecimal,
                                        // unidadEquivalencia: 'UNI',
                                        // costoUnitarioPEN: 0,
                                        // precioPEN: ser.precioPEN.$numberDecimal,
                                        // ventaPEN: ser.cantidad.$numberDecimal * ser.precioPEN.$numberDecimal,
                                        // precioUSD: 0,
                                        // ventaUSD: 0,
                                      });
                                      nuevoITEM++;
                                    });

                                    // let cuantosDespachados = 0;
                                    for (const requi of value.requisiciones) {
                                      if (requi.cantidadDespachada.$numberDecimal > 0) {
                                        ctx_f_b_nc_nd.itemsVenta.push({
                                          idAuxiliar: parseInt(elIdAuxiliar()),
                                          idMercaderia: requi.idMercaderia,
                                          idEquivalencia: requi.idEquivalencia,
                                          idKardex: requi.idKardex,
                                          item: nuevoITEM,
                                          tipo: 'MERCADERIA',
                                          codigo: requi.codigo ? requi.codigo : '_',
                                          descripcionEquivalencia: requi.descripcionEquivalencia,
                                          cantidad: requi.cantidadDespachada.$numberDecimal,
                                          unidadEquivalencia: requi.unidadEquivalencia,
                                          costoUnitarioPEN: requi.costoUnitarioPEN.$numberDecimal,
                                          precioPEN: requi.precioPEN.$numberDecimal,
                                          ventaPEN: requi.ventaPEN.$numberDecimal,
                                          precioUSD: 0,
                                          ventaUSD: 0,

                                          tipoEquivalencia: requi.tipoEquivalencia,
                                          factor: requi.factor,
                                          laEquivalencia: requi.laEquivalencia.$numberDecimal,

                                          exonerado: requi.exonerado,
                                          inafecto: requi.inafecto,
                                          sujetoAPercepcion: requi.sujetoAPercepcion,
                                          percepcion: requi.percepcion,

                                          // _id: requi._id,
                                          // idAuxiliar: requi.idAuxiliar,
                                          // idMercaderia: requi.idMercaderia,
                                          // idEquivalencia: requi.idEquivalencia,
                                          // idKardex: requi.idKardex,
                                          // item: requi.item,
                                          // codigo: requi.codigo,
                                          // descripcionEquivalencia: requi.descripcionEquivalencia,
                                          // cantidad: requi.cantidad,
                                          // unidadEquivalencia: requi.unidadEquivalencia,
                                          // precioPEN: requi.precioPEN,
                                          // ventaPEN: requi.ventaPEN,
                                          // tipoEquivalencia: requi.tipoEquivalencia,
                                          // factor: requi.factor,
                                          // laEquivalencia: requi.laEquivalencia,
                                          // cantidadDespachada: requi.cantidadDespachada,
                                          // costoUnitarioPEN: requi.costoUnitarioPEN,
                                        });
                                        // cuantosDespachados++;
                                        nuevoITEM++;
                                      }
                                    }

                                    // value.repuestosLubri.map((rep: any) => {
                                    //   ctx_f_b_nc_nd.itemsVenta.push({
                                    //     idAuxiliar: parseInt(elIdAuxiliar()),
                                    //     item: 0,
                                    //     codigo: rep.codigo,
                                    //     descripcionEquivalencia: rep.descripcionEquivalencia,
                                    //     cantidad: rep.cantidad.$numberDecimal,
                                    //     unidadEquivalencia: rep.unidadEquivalencia,
                                    //     costo: 0,
                                    //     precioPEN: rep.precioPEN.$numberDecimal,
                                    //     ventaPEN: rep.cantidad.$numberDecimal * rep.precioPEN.$numberDecimal,
                                    //     precioUSD: 0,
                                    //     ventaUSD: 0,
                                    //   });
                                    // });
                                    ctx_add_venta.desabilitarAlmacenServicios = true;
                                    ctx_add_venta.mostrarAdjuntarOS = false;
                                    // ctx_add_venta.mostrarAdjuntarCotizacion = false;
                                  }}
                                />
                              </>
                            ) : (
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.edit}
                                title="Editar venta"
                                height={14}
                                width={14}
                                style={{ padding: '2px' }}
                                onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                // onClick$={() => {

                                // }}
                              />
                            )}
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.pdf}
                              title="Ver pdf"
                              height={14}
                              width={14}
                              style={{ padding: '2px' }}
                              onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                osSeleccionada.value = value;
                                clickPDF.value++;
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
                <i style={{ fontSize: '0.7rem' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
