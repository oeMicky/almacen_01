import { $, Resource, component$, useContext, useResource$, useSignal, useStylesScoped$, useTask$ } from '@builder.io/qwik';
import { cerosALaIzquierda, elIdAuxiliar, formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
//------- import pdfCotizacion98 from '~/reports/98/pdfCotizacion98';
// import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import { CTX_ADD_VENTA, CTX_F_B_NC_ND } from './addVenta';
// import style from '../../components/tabla.css?inline';
import style from '../tabla/tabla.css?inline';
import type { ICotizacion } from '~/interfaces/iCotizacion';
import pdfCotizacionMG from '~/reports/MG/pdfCotizacionMG';
// import { ICotizacion } from '~/routes/(almacen)/cotizacion';

// export interface ICotizacion {
//   _id: string;
//   idGrupoEmpresarial: string;
//   idEmpresa: string;

//   correlativo: number;
//   fecha: any;

//   idCliente: string;
//   codigoTipoDocumentoIdentidad: string;
//   tipoDocumentoIdentidad: string;
//   numeroIdentidad: string;
//   razonSocialNombreCliente: string;
//   // email: { type: String },
//   idVehiculo: string;
//   placa: string;
//   idVehiculoMarca: string;
//   vehiculoMarca: string;
//   idVehiculoModelo: string;
//   vehiculoModelo: string;
//   vin: string;

//   igv: number;

//   vendedor: string;

//   servicios: any;
//   repuestosLubri: any;

//   montoSubTotalPEN: any;
//   montoIGVPEN: any;
//   montoTotalPEN: any;
// }

export default component$((props: { buscarCotizaciones: number; modoSeleccion: boolean; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS Y VARIABLES
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
  const ctx_f_b_nc_nd = useContext(CTX_F_B_NC_ND);
  const clickPDF = useSignal(0);
  const cotizacionSeleccionada = useSignal<ICotizacion>();
  //#endregion CONTEXTOS Y VARIABLES

  //#region TRAER COTIZACIONES
  const lasCotizaciones = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarCotizaciones.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // console.log('FETCH->: ', `http://localhost:4000/api/cotizacion/obtenerCotizacionesEntreFechas`);
    console.log('FETCH->: ', `${import.meta.env.VITE_URL}/api/cotizacion/obtenerCotizacionesEntreFechas`);
    const res = await fetch(`${import.meta.env.VITE_URL}/api/cotizacion/obtenerCotizacionesEntreFechas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.parametrosBusqueda),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion TRAER COTIZACIONES

  //#region VISUZALIZAR PDF
  const verPDF = $((cotizacion: any) => {
    console.log('a pdfFactura98', cotizacion.untrackedValue); //venta !== null &&
    if (typeof cotizacion.untrackedValue !== 'undefined') {
      console.log('imprimiendo ... imprimiendo ... imprimiendo ... imprimiendo ...', cotizacion.untrackedValue);
      //-------- pdfCotizacion98(cotizacion.untrackedValue);
    }
  });
  useTask$(async ({ track }) => {
    track(() => clickPDF.value);
    console.log('a useTask useTask useTask useTask:', clickPDF.value);
    await verPDF(cotizacionSeleccionada);
  });
  //#endregion VISUZALIZAR PDF

  //#region SELECCINAR COTIZACION

  //#endregion SELECCINAR COTIZACION

  return (
    <Resource
      value={lasCotizaciones}
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
        console.log('onResolved 🍓🍓🍓🍓', cotizaciones);
        const { data } = cotizaciones; //{ status, data, message }
        const misCotizaciones: ICotizacion[] = data;
        // props.buscarVentas = false;
        return (
          <>
            {misCotizaciones.length > 0 ? (
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
                    {misCotizaciones.map((COT) => {
                      //, index
                      // const indexItem = index + 1;
                      return (
                        <tr key={COT._id}>
                          <td data-label="Cotización">{COT.serie + ' - ' + cerosALaIzquierda(COT.numero, 8)}</td>
                          <td data-label="Fecha">{formatoDDMMYYYY_PEN(COT.fecha)}</td>
                          <td data-label="Nro. Doc">{COT.tipoDocumentoIdentidad + ': ' + COT.numeroIdentidad}</td>
                          <td data-label="Cliente">{COT.razonSocialNombre}</td>
                          <td data-label="Importe PEN" class="comoNumero">
                            {COT.montoTotalPEN
                              ? parseFloat(COT.montoTotalPEN.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : ''}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            {props.modoSeleccion ? (
                              <>
                                <input
                                  // id="in_BuscarDetraccion"
                                  type="image"
                                  src={images.check32}
                                  title="Selecionar cotización"
                                  height={12}
                                  width={12}
                                  style={{ marginRight: '6px' }}
                                  onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                  onClick$={() => {
                                    console.log('seleccionar cotizacion', COT);
                                    ctx_f_b_nc_nd.idCotizacion = COT._id;
                                    ctx_f_b_nc_nd.serieCotizacion = COT.serie;
                                    ctx_f_b_nc_nd.numeroCotizacion = COT.numero;

                                    ctx_f_b_nc_nd.observacion = COT.serie + ' - ' + cerosALaIzquierda(COT.numero, 8);

                                    ctx_f_b_nc_nd.idCliente = COT.idCliente;

                                    ctx_f_b_nc_nd.codigoTipoDocumentoIdentidad = COT.codigoTipoDocumentoIdentidad;
                                    ctx_f_b_nc_nd.tipoDocumentoIdentidad = COT.tipoDocumentoIdentidad;
                                    ctx_f_b_nc_nd.numeroIdentidad = COT.numeroIdentidad;
                                    ctx_f_b_nc_nd.razonSocialNombre = COT.razonSocialNombre;
                                    ctx_f_b_nc_nd.itemsVenta = [];
                                    let newItem = 1;
                                    COT.servicios.map((ser: any) => {
                                      console.log('ser', ser);
                                      ctx_f_b_nc_nd.itemsVenta.push({
                                        idAuxiliar: parseInt(elIdAuxiliar()),
                                        idKardex: ser.idKardex,
                                        item: newItem,
                                        tipo: 'SERVICIO',

                                        // tipoImpuesto: 'IGV',
                                        tipoImpuesto: ser.tipoImpuesto,
                                        tipoAfectacionDelImpuesto: ser.tipoAfectacionDelImpuesto,
                                        porcentaje: parseFloat(ser.porcentaje.$numberDecimal),

                                        codigo: ser.codigo ? ser.codigo : '_',
                                        descripcionEquivalencia: ser.descripcionEquivalencia,
                                        cantidad: ser.cantidad.$numberDecimal,
                                        unidadEquivalencia: 'UNI',
                                        costoUnitarioPEN: 0,
                                        precioPEN: ser.precioPEN.$numberDecimal,
                                        ventaPEN: ser.cantidad.$numberDecimal * ser.precioPEN.$numberDecimal,
                                        precioUSD: 0,
                                        ventaUSD: 0,

                                        codigoContableVenta: ser.codigoContableVenta,
                                        descripcionContableVenta: ser.descripcionContableVenta,
                                      });
                                      newItem++;
                                    });
                                    COT.repuestosLubri.map((rep: any) => {
                                      ctx_f_b_nc_nd.itemsVenta.push({
                                        idAuxiliar: parseInt(elIdAuxiliar()),
                                        idMercaderia: rep.idMercaderia,
                                        idEquivalencia: rep.idEquivalencia,
                                        idKardex: rep.idKardex,
                                        item: newItem,
                                        tipo: 'MERCADERIA',

                                        // tipoImpuesto: 'IGV',
                                        tipoImpuesto: rep.tipoImpuesto,
                                        tipoAfectacionDelImpuesto: rep.tipoAfectacionDelImpuesto,
                                        porcentaje: parseFloat(rep.porcentaje.$numberDecimal),

                                        codigo: rep.codigo ? rep.codigo : '_',
                                        descripcionEquivalencia: rep.descripcionEquivalencia,
                                        cantidad: rep.cantidad.$numberDecimal,
                                        unidadEquivalencia: rep.unidadEquivalencia,
                                        costoUnitarioPEN: rep.costoUnitarioPEN.$numberDecimal,
                                        precioPEN: rep.precioPEN.$numberDecimal,
                                        ventaPEN: rep.cantidad.$numberDecimal * rep.precioPEN.$numberDecimal,
                                        precioUSD: 0,
                                        ventaUSD: 0,

                                        tipoEquivalencia: rep.tipoEquivalencia,
                                        factor: rep.factor,
                                        laEquivalencia: rep.laEquivalencia,

                                        exonerado: rep.exonerado,
                                        inafecto: rep.inafecto,
                                        sujetoAPercepcion: rep.sujetoAPercepcion,
                                        percepcion: rep.percepcion,

                                        codigoContableVenta: rep.codigoContableVenta,
                                        descripcionContableVenta: rep.descripcionContableVenta,
                                        // tipoContableVenta: props.mercaOUTSelecci.tipoContableVenta,
                                      });
                                      newItem++;
                                    });

                                    ctx_add_venta.mostrarAdjuntarCotizacion = false;
                                  }}
                                />
                              </>
                            ) : (
                              <input
                                // id="in_BuscarDetraccion"
                                type="image"
                                src={images.edit}
                                title="Editar venta"
                                height={12}
                                width={12}
                                style={{ marginRight: '6px' }}
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
                              height={12}
                              width={12}
                              // style={{ padding: '2px' }}
                              onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                pdfCotizacionMG(COT);
                                // cotizacionSeleccionada.value = value;
                                // clickPDF.value++;
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
