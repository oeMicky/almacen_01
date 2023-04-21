import { $, Resource, component$, useContext, useResource$, useSignal, useTask$ } from '@builder.io/qwik';
import { elIdAuxiliar, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import pdfCotizacion98 from '~/reports/98/pdfCotizacion98';
import { CTX_VENTA } from '~/routes/(almacen)/factura';
import { CTX_ADD_VENTA } from './addVenta';

export interface ICotizacion {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;

  correlativo: number;
  fecha: any;

  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombreCliente: string;
  // email: { type: String },
  idVehiculo: string;
  placa: string;
  idVehiculoMarca: string;
  vehiculoMarca: string;
  idVehiculoModelo: string;
  vehiculoModelo: string;
  vin: string;

  igv: number;

  vendedor: string;

  servicios: any;
  repuestosLu: any;

  montoSubTotalPEN: any;
  montoIGVPEN: any;
  montoTotalPEN: any;
}

export default component$((props: { buscarCotizaciones: number; modoSeleccion: boolean; parametrosBusqueda: any }) => {
  //#region CONTEXTOS Y VARIABLES
  const ctx_PanelVenta = useContext(CTX_VENTA);
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
  const clickPDF = useSignal(0);
  const cotizacionSeleccionada = useSignal<ICotizacion>();
  //#endregion CONTEXTOS Y VARIABLES

  //#region TRAER COTIZACIONES
  const lasCotizaciones = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarCotizaciones.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // console.log('FETCH->: ', `http://localhost:4000/api/cotizacion/obtenerCotizacionesEntreFechas`);
    const res = await fetch(`http://localhost:4000/api/cotizacion/obtenerCotizacionesEntreFechas`, {
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
      pdfCotizacion98(cotizacion.untrackedValue);
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
        console.log('onResolved 🍓🍓🍓🍓');
        const { status, data, message } = cotizaciones;
        const misCotizaciones: ICotizacion[] = data;
        // props.buscarVentas = false;
        return (
          <>
            {misCotizaciones.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Cotización</th>
                      <th>Fecha</th>
                      <th>Nro. Doc</th>
                      <th>Cliente</th>
                      <th>Importe PEN</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misCotizaciones.map((value, index) => {
                      const indexItem = index + 1;
                      return (
                        <tr key={value._id}>
                          <td key={value._id}>{indexItem}</td>
                          <td>{value.correlativo}</td>
                          <td>{formatoDDMMYYYY_PEN(value.fecha)}</td>
                          <td>{value.tipoDocumentoIdentidad + ': ' + value.numeroIdentidad}</td>
                          <td>{value.razonSocialNombreCliente}</td>
                          <td style={{ textAlign: 'end' }}>
                            {value.montoTotalPEN
                              ? parseFloat(value.montoTotalPEN.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : ''}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {props.modoSeleccion ? (
                              <>
                                <ImgButton
                                  src={images.check}
                                  alt="icono seleccionar cotización"
                                  height={12}
                                  width={12}
                                  title="Selecionar cotización"
                                  onClick={$(() => {
                                    console.log('seleccionar cotiacion', value);
                                    ctx_add_venta.cotizacion = value.correlativo;
                                    ctx_add_venta.idCliente = value.idCliente;
                                    ctx_add_venta.codigoTipoDocumentoIdentidad = parseInt(value.codigoTipoDocumentoIdentidad);
                                    ctx_add_venta.tipoDocumentoIdentidad = value.tipoDocumentoIdentidad;
                                    ctx_add_venta.numeroIdentidad = value.numeroIdentidad;
                                    ctx_add_venta.razonSocialNombre = value.razonSocialNombreCliente;
                                    value.servicios.map((ser: any) => {
                                      console.log('ser', ser);
                                      ctx_add_venta.itemsVenta.push({
                                        idAuxiliar: parseInt(elIdAuxiliar()),
                                        item: 0,
                                        codigo: ser.codigo,
                                        descripcionEquivalencia: ser.descripcionEquivalencia,
                                        cantidad: ser.cantidad.$numberDecimal,
                                        unidadEquivalencia: 'UNI',
                                        costo: 0,
                                        precioPEN: ser.precioPEN.$numberDecimal,
                                        ventaPEN: ser.cantidad.$numberDecimal * ser.precioPEN.$numberDecimal,
                                        precioUSD: 0,
                                        ventaUSD: 0,
                                      });
                                    });
                                    value.repuestosLu.map((rep: any) => {
                                      ctx_add_venta.itemsVenta.push({
                                        idAuxiliar: parseInt(elIdAuxiliar()),
                                        item: 0,
                                        codigo: rep.codigo,
                                        descripcionEquivalencia: rep.descripcionEquivalencia,
                                        cantidad: rep.cantidad.$numberDecimal,
                                        unidadEquivalencia: rep.unidadEquivalencia,
                                        costo: 0,
                                        precioPEN: rep.precioPEN.$numberDecimal,
                                        ventaPEN: rep.cantidad.$numberDecimal * rep.precioPEN.$numberDecimal,
                                        precioUSD: 0,
                                        ventaUSD: 0,
                                      });
                                    });

                                    ctx_PanelVenta.mostrarAdjuntarCotizacion = false;
                                  })}
                                  // onClick={() => seleccionarCotizacion(coti)}
                                />
                              </>
                            ) : (
                              <ImgButton
                                src={images.edit}
                                alt="icono de editar"
                                height={12}
                                width={12}
                                title="Editar venta"
                                // onClick={() => {
                                //   onEdit(coti);
                                // }}
                              />
                            )}
                            <ImgButton
                              src={images.pdf}
                              alt="icono ver pdf"
                              height={12}
                              width={12}
                              title="Ver pdf"
                              onClick={$(() => {
                                cotizacionSeleccionada.value = value;
                                clickPDF.value++;
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
              </div>
            )}
          </>
        );
      }}
    />
  );
});
