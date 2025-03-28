import { $, Resource, component$, useContext, useResource$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import style from '../tabla/tabla.css?inline';
import type { IOrdenServicio, IOrdenServicio_Terminado } from '~/interfaces/iOrdenServicio';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { cerosALaIzquierda, elIdAuxiliar, formatearMonedaPEN, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_ADD_VENTA, CTX_F_B_NC_ND } from './addVenta';
import { loadOrdenServicio, loadOrdenServicioRequisicion, loadOrdenServicioServicio } from '~/apis/ordenServicio.api';
import pdfOsMG_ConVehiculo from '~/reports/MG/pdfOsMG_ConVehiculo';
import { CTX_ADJUTAR_ORDEN_SERVICIO } from './adjuntarOrdenServicio';

export default component$((props: { buscarOrdenesServicio: number; modoSeleccion: boolean; parametrosBusqueda: any; mostrarSpinner: boolean }) => {
  useStyles$(style);

  //#region CONTEXTOS
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
  const ctx_f_b_nc_nd = useContext(CTX_F_B_NC_ND);
  const ctx = useContext(CTX_ADJUTAR_ORDEN_SERVICIO);
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

    // //console.log('FETCH->: ', `http://localhost:4000/api/cotizacion/obtenerCotizacionesEntreFechas`);
    //console.log('FETCH->: ', `${import.meta.env.VITE_URL}/api/ordenServicio/getOrdenesServicioTerminadasEntreFechas`);
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

  //#region VISUALIZAR ORDEN SERVICIO
  const verPDF_OrdenServicio = $((os: any) => {
    //console.log('a pdfOsMG', os); //venta !== null &&
    if (typeof os !== 'undefined') {
      //console.log('imprimiendo ... imprimiendo ... verPDF_INVENTARIO BETA ...', os);
      // pdfCotizacion98(cotizacion);
      pdfOsMG_ConVehiculo(os);
    }
  });

  useTask$(async ({ track }) => {
    track(() => clickPDF.value);

    // console.log('a osSeleccionada.value:', osSeleccionada.value);

    await verPDF_OrdenServicio(osSeleccionada.value);
  });
  //#endregion VISUALIZAR ORDEN SERVICIO

  return (
    <Resource
      value={lasOrdenesServicio}
      onPending={() => {
        //console.log('onPending 🍉🍉🍉🍉');
        //
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        //console.log('onRejected 🍍🍍🍍🍍');
        // props.buscarVentas = false;
        return <div>Fallo en la carga de datos</div>;
        ctx.mostrarSpinner = false;
      }}
      onResolved={(ordenesServicio) => {
        // console.log('onResolved 🍓🍓🍓🍓', ordenesServicio);
        const { data } = ordenesServicio; //{ status, data, message }
        const misOrdenesServicio: IOrdenServicio_Terminado[] = data;
        // props.buscarVentas = false;
        ctx.mostrarSpinner = false;
        return (
          <>
            {misOrdenesServicio.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>O.S.</th>
                      <th>Fecha</th>
                      <th>Nro. Doc</th>
                      <th>Cliente</th>
                      <th>Servicos PEN</th>
                      <th>Suministros PEN</th>
                      <th>Importe PEN</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misOrdenesServicio.map((OS) => {
                      //, index
                      // const indexItem = index + 1;
                      return (
                        <tr key={OS._id}>
                          <td data-label="O.S.">{OS.serie + ' - ' + cerosALaIzquierda(OS.numero, 8)}</td>
                          <td data-label="Fecha">{formatoDDMMYYYY_PEN(OS.fechaInicio)}</td>
                          <td data-label="Nro. Doc">{OS.tipoDocumentoIdentidad + ': ' + OS.numeroIdentidad}</td>
                          <td data-label="Cliente">{OS.clienteVentasVarias ? 'Cliente ventas varias' : OS.razonSocialNombreCliente}</td>
                          <td data-label="Servicos PEN" class="comoNumero">
                            {OS.ventaPEN_SERVICIOS.$numberDecimal > 0 ? (
                              <button
                                style={{ cursor: 'pointer' }}
                                onClick$={async () => {
                                  let elOS = await loadOrdenServicioServicio({ idOrdenServicio: OS._id });
                                  elOS = elOS.data[0];
                                  // console.log('seleccionar O.S.:', elOS);

                                  ctx_f_b_nc_nd.idOrdenServicio = elOS._id;
                                  ctx_f_b_nc_nd.serieOrdenServicio = elOS.serie;
                                  ctx_f_b_nc_nd.numeroOrdenServicio = elOS.numero;

                                  ctx_f_b_nc_nd.idCotizacion = '';
                                  ctx_f_b_nc_nd.serieCotizacion = '';
                                  ctx_f_b_nc_nd.numeroCotizacion = 0;

                                  ctx_f_b_nc_nd.observacion = elOS.serie + ' - ' + cerosALaIzquierda(elOS.numero, 8);

                                  ctx_f_b_nc_nd.clienteVentasVarias = elOS.clienteVentasVarias;
                                  ctx_f_b_nc_nd.idCliente = elOS.idCliente;

                                  ctx_f_b_nc_nd.codigoTipoDocumentoIdentidad = elOS.codigoTipoDocumentoIdentidad;
                                  ctx_f_b_nc_nd.tipoDocumentoIdentidad = elOS.tipoDocumentoIdentidad;
                                  ctx_f_b_nc_nd.numeroIdentidad = elOS.numeroIdentidad;
                                  ctx_f_b_nc_nd.razonSocialNombre = elOS.razonSocialNombreCliente;
                                  ctx_f_b_nc_nd.itemsVenta = [];
                                  ctx_f_b_nc_nd.soloServicios = true;
                                  ctx_f_b_nc_nd.soloSuministros = false;
                                  // console.log('👴👴');

                                  let nuevoITEM = 1;
                                  elOS.servicios.map((ser: any) => {
                                    // console.log('ser', ser);
                                    // console.log('👮‍♀️👮‍♀️👮‍♀️');
                                    ctx_f_b_nc_nd.itemsVenta.push({
                                      idAuxiliar: parseInt(elIdAuxiliar()),
                                      idMercaderia: null,
                                      idEquivalencia: null,
                                      idKardex: null,
                                      item: nuevoITEM,
                                      tipo: 'SERVICIO',

                                      // tipoImpuesto: 'IGV',
                                      tipoImpuesto: ser.tipoImpuesto,
                                      tipoAfectacionDelImpuesto: ser.tipoAfectacionDelImpuesto,
                                      porcentaje: parseFloat(ser.porcentaje.$numberDecimal),

                                      tipoPrecioVentaUnitario: ser.tipoPrecioVentaUnitario,

                                      codigo: ser.codigo ? ser.codigo : '-',

                                      descripcion: ser.descripcion, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',
                                      descripcionEquivalencia: ser.descripcionEquivalencia, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',

                                      cantidad: ser.cantidad.$numberDecimal,
                                      cantidadEquivalencia: ser.cantidadEquivalencia.$numberDecimal,

                                      unidad: ser.unidad ? ser.unidad : '-',
                                      unidadEquivalencia: ser.unidadEquivalencia ? ser.unidadEquivalencia : '-',

                                      costoUnitarioPEN: ser.costoUnitarioPEN.$numberDecimal,
                                      costoUnitarioEquivalenciaPEN: ser.costoUnitarioEquivalenciaPEN.$numberDecimal,

                                      precioUnitarioPEN: ser.precioUnitarioPEN.$numberDecimal,

                                      ventaPEN: ser.ventaPEN.$numberDecimal,

                                      precioUnitarioUSD: 0,
                                      ventaUSD: 0,

                                      tipoEquivalencia: null,
                                      factor: null,
                                      laEquivalencia: null,

                                      exonerado: null,
                                      inafecto: null,
                                      sujetoAPercepcion: null,
                                      percepcion: null,

                                      codigoContableVenta: ser.codigoContableVenta,
                                      descripcionContableVenta: ser.descripcionContableVenta,
                                    });
                                    // console.log('👶👶👶');
                                    nuevoITEM++;
                                  });
                                  // console.log('🧓🧓🧓');
                                  ctx_add_venta.desabilitarAlmacenServicios = true;
                                  ctx_add_venta.mostrarAdjuntarOS = false;
                                  // console.log('🧓🧓🧓🧓🧓🧓');
                                }}
                              >
                                {formatearMonedaPEN(OS.ventaPEN_SERVICIOS.$numberDecimal)}
                              </button>
                            ) : (
                              ''
                            )}
                          </td>
                          <td data-label="Suministros PEN" class="comoNumero">
                            {OS.ventaPEN_REQUISICIONES.$numberDecimal > 0 ? (
                              <button
                                style={{ cursor: 'pointer' }}
                                onClick$={async () => {
                                  let elOS = await loadOrdenServicioRequisicion({ idOrdenServicio: OS._id });
                                  elOS = elOS.data[0];
                                  //console.log('seleccionar O.S.:', OS);

                                  ctx_f_b_nc_nd.idOrdenServicio = elOS._id;
                                  ctx_f_b_nc_nd.serieOrdenServicio = elOS.serie;
                                  ctx_f_b_nc_nd.numeroOrdenServicio = elOS.numero;

                                  ctx_f_b_nc_nd.idCotizacion = '';
                                  ctx_f_b_nc_nd.serieCotizacion = '';
                                  ctx_f_b_nc_nd.numeroCotizacion = 0;

                                  ctx_f_b_nc_nd.observacion = elOS.serie + ' - ' + cerosALaIzquierda(elOS.numero, 8);

                                  ctx_f_b_nc_nd.clienteVentasVarias = elOS.clienteVentasVarias;
                                  ctx_f_b_nc_nd.idCliente = elOS.idCliente;

                                  ctx_f_b_nc_nd.codigoTipoDocumentoIdentidad = elOS.codigoTipoDocumentoIdentidad;
                                  ctx_f_b_nc_nd.tipoDocumentoIdentidad = elOS.tipoDocumentoIdentidad;
                                  ctx_f_b_nc_nd.numeroIdentidad = elOS.numeroIdentidad;
                                  ctx_f_b_nc_nd.razonSocialNombre = elOS.razonSocialNombreCliente;
                                  ctx_f_b_nc_nd.itemsVenta = [];
                                  ctx_f_b_nc_nd.soloServicios = false;
                                  ctx_f_b_nc_nd.soloSuministros = true;
                                  let nuevoITEM = 1;

                                  //console.log('PASO SERVICIOS!!!');
                                  // let cuantosDespachados = 0;
                                  for (const requi of elOS.requisiciones) {
                                    // console.log('el requi ANALIZADO:::', requi);
                                    if (requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal > 0) {
                                      ctx_f_b_nc_nd.itemsVenta.push({
                                        idAuxiliar: parseInt(elIdAuxiliar()),
                                        idMercaderia: requi.idMercaderia,
                                        idEquivalencia: requi.idEquivalencia,
                                        idKardex: requi.idKardex,
                                        item: nuevoITEM,
                                        tipo: 'MERCADERIA',

                                        tipoImpuesto: requi.tipoImpuesto,
                                        tipoAfectacionDelImpuesto: requi.tipoAfectacionDelImpuesto,
                                        porcentaje: parseFloat(requi.porcentaje.$numberDecimal),

                                        tipoPrecioVentaUnitario: requi.tipoPrecioVentaUnitario,

                                        codigo: requi.codigo ? requi.codigo : '-',

                                        descripcion: requi.descripcion,
                                        descripcionEquivalencia: requi.descripcionEquivalencia,

                                        cantidad: requi.cantidad.$numberDecimal,
                                        cantidadEquivalencia: requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal,

                                        unidad: requi.unidad,
                                        unidadEquivalencia: requi.unidadEquivalencia,

                                        costoUnitarioPEN: requi.costoUnitarioPEN.$numberDecimal,
                                        costoUnitarioEquivalenciaPEN: requi.costoUnitarioEquivalenciaPEN.$numberDecimal,

                                        precioUnitarioPEN: requi.precioUnitarioPEN.$numberDecimal,

                                        ventaPEN: requi.ventaPEN.$numberDecimal,

                                        precioUnitarioUSD: 0,
                                        ventaUSD: 0,

                                        tipoEquivalencia: requi.tipoEquivalencia,
                                        factor: requi.factor,
                                        laEquivalencia: requi.laEquivalencia.$numberDecimal,

                                        exonerado: requi.exonerado,
                                        inafecto: requi.inafecto,
                                        sujetoAPercepcion: requi.sujetoAPercepcion,
                                        percepcion: requi.percepcion,

                                        codigoContableVenta: requi.codigoContableVenta,
                                        descripcionContableVenta: requi.descripcionContableVenta,
                                      });
                                      nuevoITEM++;
                                    }
                                  }

                                  ctx_add_venta.desabilitarAlmacenServicios = true;
                                  ctx_add_venta.mostrarAdjuntarOS = false;
                                }}
                              >
                                {formatearMonedaPEN(OS.ventaPEN_REQUISICIONES.$numberDecimal)}
                              </button>
                            ) : (
                              ''
                            )}
                          </td>
                          <td data-label="Importe PEN" class="comoNumero">
                            <button
                              style={{ cursor: 'pointer' }}
                              onClick$={async () => {
                                let elOS = await loadOrdenServicio({ idOrdenServicio: OS._id });
                                elOS = elOS.data[0];
                                //console.log('seleccionar O.S.:', OS);

                                ctx_f_b_nc_nd.idOrdenServicio = elOS._id;
                                ctx_f_b_nc_nd.serieOrdenServicio = elOS.serie;
                                ctx_f_b_nc_nd.numeroOrdenServicio = elOS.numero;

                                ctx_f_b_nc_nd.idCotizacion = '';
                                ctx_f_b_nc_nd.serieCotizacion = '';
                                ctx_f_b_nc_nd.numeroCotizacion = 0;

                                ctx_f_b_nc_nd.observacion = elOS.serie + ' - ' + cerosALaIzquierda(elOS.numero, 8);

                                ctx_f_b_nc_nd.clienteVentasVarias = elOS.clienteVentasVarias;
                                ctx_f_b_nc_nd.idCliente = elOS.idCliente;

                                ctx_f_b_nc_nd.codigoTipoDocumentoIdentidad = elOS.codigoTipoDocumentoIdentidad;
                                ctx_f_b_nc_nd.tipoDocumentoIdentidad = elOS.tipoDocumentoIdentidad;
                                ctx_f_b_nc_nd.numeroIdentidad = elOS.numeroIdentidad;
                                ctx_f_b_nc_nd.razonSocialNombre = elOS.razonSocialNombreCliente;
                                ctx_f_b_nc_nd.itemsVenta = [];
                                ctx_f_b_nc_nd.soloServicios = true;
                                ctx_f_b_nc_nd.soloSuministros = true;
                                let nuevoITEM = 1;
                                elOS.servicios.map((ser: any) => {
                                  // console.log('ser', ser);
                                  ctx_f_b_nc_nd.itemsVenta.push({
                                    idAuxiliar: parseInt(elIdAuxiliar()),
                                    idMercaderia: null,
                                    idEquivalencia: null,
                                    idKardex: null,
                                    item: nuevoITEM,
                                    tipo: 'SERVICIO',

                                    // tipoImpuesto: 'IGV',
                                    tipoImpuesto: ser.tipoImpuesto,
                                    tipoAfectacionDelImpuesto: ser.tipoAfectacionDelImpuesto,
                                    porcentaje: parseFloat(ser.porcentaje.$numberDecimal),

                                    tipoPrecioVentaUnitario: ser.tipoPrecioVentaUnitario,

                                    codigo: ser.codigo ? ser.codigo : '-',

                                    descripcion: ser.descripcion, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',
                                    descripcionEquivalencia: ser.descripcionEquivalencia, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',

                                    cantidad: ser.cantidad.$numberDecimal,
                                    cantidadEquivalencia: ser.cantidadEquivalencia.$numberDecimal,

                                    unidad: ser.unidad ? ser.unidad : '-',
                                    unidadEquivalencia: ser.unidadEquivalencia ? ser.unidadEquivalencia : '-',

                                    costoUnitarioPEN: ser.costoUnitarioPEN.$numberDecimal,
                                    costoUnitarioEquivalenciaPEN: ser.costoUnitarioEquivalenciaPEN.$numberDecimal,

                                    precioUnitarioPEN: ser.precioUnitarioPEN.$numberDecimal,

                                    ventaPEN: ser.ventaPEN.$numberDecimal,

                                    precioUnitarioUSD: 0,
                                    ventaUSD: 0,

                                    codigoContableVenta: ser.codigoContableVenta,
                                    descripcionContableVenta: ser.descripcionContableVenta,
                                  });
                                  nuevoITEM++;
                                });
                                //console.log('PASO SERVICIOS!!!');
                                // let cuantosDespachados = 0;
                                for (const requi of elOS.requisiciones) {
                                  // console.log('el requi ANALIZADO:::', requi);
                                  if (requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal > 0) {
                                    ctx_f_b_nc_nd.itemsVenta.push({
                                      idAuxiliar: parseInt(elIdAuxiliar()),
                                      idMercaderia: requi.idMercaderia,
                                      idEquivalencia: requi.idEquivalencia,
                                      idKardex: requi.idKardex,
                                      item: nuevoITEM,
                                      tipo: 'MERCADERIA',

                                      tipoImpuesto: requi.tipoImpuesto,
                                      tipoAfectacionDelImpuesto: requi.tipoAfectacionDelImpuesto,
                                      porcentaje: parseFloat(requi.porcentaje.$numberDecimal),

                                      tipoPrecioVentaUnitario: requi.tipoPrecioVentaUnitario,

                                      codigo: requi.codigo ? requi.codigo : '-',

                                      descripcion: requi.descripcion,
                                      descripcionEquivalencia: requi.descripcionEquivalencia,

                                      cantidad: requi.cantidad.$numberDecimal,
                                      cantidadEquivalencia: requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal,

                                      unidad: requi.unidad,
                                      unidadEquivalencia: requi.unidadEquivalencia,

                                      costoUnitarioPEN: requi.costoUnitarioPEN.$numberDecimal,
                                      costoUnitarioEquivalenciaPEN: requi.costoUnitarioEquivalenciaPEN.$numberDecimal,

                                      precioUnitarioPEN: requi.precioUnitarioPEN.$numberDecimal,

                                      ventaPEN: requi.ventaPEN.$numberDecimal,

                                      precioUnitarioUSD: 0,
                                      ventaUSD: 0,

                                      tipoEquivalencia: requi.tipoEquivalencia,
                                      factor: requi.factor,
                                      laEquivalencia: requi.laEquivalencia.$numberDecimal,

                                      exonerado: requi.exonerado,
                                      inafecto: requi.inafecto,
                                      sujetoAPercepcion: requi.sujetoAPercepcion,
                                      percepcion: requi.percepcion,

                                      codigoContableVenta: requi.codigoContableVenta,
                                      descripcionContableVenta: requi.descripcionContableVenta,
                                    });
                                    nuevoITEM++;
                                  }
                                }

                                ctx_add_venta.desabilitarAlmacenServicios = true;
                                ctx_add_venta.mostrarAdjuntarOS = false;
                              }}
                            >
                              {formatearMonedaPEN(
                                parseFloat(
                                  OS.ventaPEN_SERVICIOS_paraTOTAL.$numberDecimal
                                    ? OS.ventaPEN_SERVICIOS_paraTOTAL.$numberDecimal
                                    : OS.ventaPEN_SERVICIOS_paraTOTAL
                                ) +
                                  parseFloat(
                                    OS.ventaPEN_REQUISICIONES_paraTOTAL.$numberDecimal
                                      ? OS.ventaPEN_REQUISICIONES_paraTOTAL.$numberDecimal
                                      : OS.ventaPEN_REQUISICIONES_paraTOTAL
                                  )
                              )}
                            </button>

                            {/* {value.montoTotalPEN
                              ? parseFloat(value.montoTotalPEN.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : ''} */}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            {/* {props.modoSeleccion ? (
                              <>
                                <input
                                  // id="in_BuscarDetraccion"
                                  type="image"
                                  src={images.check32}
                                  title="Seleccionar orden servicio terminada"
                                  height={14}
                                  width={14}
                                  style={{ marginRight: '6px' }}
                                  onClick$={async () => {
                                    let elOS = await loadOrdenServicio({ idOrdenServicio: OS._id });
                                    elOS = elOS.data[0];
                                    //console.log('seleccionar O.S.:', OS);

                                    ctx_f_b_nc_nd.idOrdenServicio = elOS._id;
                                    ctx_f_b_nc_nd.serieOrdenServicio = elOS.serie;
                                    ctx_f_b_nc_nd.numeroOrdenServicio = elOS.numero;

                                    ctx_f_b_nc_nd.idCotizacion = '';
                                    ctx_f_b_nc_nd.serieCotizacion = '';
                                    ctx_f_b_nc_nd.numeroCotizacion = 0;

                                    ctx_f_b_nc_nd.observacion = elOS.serie + ' - ' + cerosALaIzquierda(elOS.numero, 8);

                                    ctx_f_b_nc_nd.clienteVentasVarias = elOS.clienteVentasVarias;
                                    ctx_f_b_nc_nd.idCliente = elOS.idCliente;

                                    ctx_f_b_nc_nd.codigoTipoDocumentoIdentidad = elOS.codigoTipoDocumentoIdentidad;
                                    ctx_f_b_nc_nd.tipoDocumentoIdentidad = elOS.tipoDocumentoIdentidad;
                                    ctx_f_b_nc_nd.numeroIdentidad = elOS.numeroIdentidad;
                                    ctx_f_b_nc_nd.razonSocialNombre = elOS.razonSocialNombreCliente;
                                    ctx_f_b_nc_nd.itemsVenta = [];
                                    let nuevoITEM = 1;
                                    elOS.servicios.map((ser: any) => {
                                      console.log('ser', ser);
                                      ctx_f_b_nc_nd.itemsVenta.push({
                                        idAuxiliar: parseInt(elIdAuxiliar()),
                                        idMercaderia: null,
                                        idEquivalencia: null,
                                        idKardex: null,
                                        item: nuevoITEM,
                                        tipo: 'SERVICIO',

                                        // tipoImpuesto: 'IGV',
                                        tipoImpuesto: ser.tipoImpuesto,
                                        tipoAfectacionDelImpuesto: ser.tipoAfectacionDelImpuesto,
                                        porcentaje: parseFloat(ser.porcentaje.$numberDecimal),

                                        tipoPrecioVentaUnitario: ser.tipoPrecioVentaUnitario,

                                        codigo: ser.codigo ? ser.codigo :'-',

                                        descripcion: ser.descripcion, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',
                                        descripcionEquivalencia: ser.descripcionEquivalencia, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',

                                        cantidad: ser.cantidad.$numberDecimal,
                                        cantidadEquivalencia: ser.cantidadEquivalencia.$numberDecimal,

                                        unidad: ser.unidad ? ser.unidad : '-',
                                        unidadEquivalencia: ser.unidadEquivalencia ? ser.unidadEquivalencia : '-',

                                        costoUnitarioPEN: ser.costoUnitarioPEN.$numberDecimal,
                                        costoUnitarioEquivalenciaPEN: ser.costoUnitarioEquivalenciaPEN.$numberDecimal,

                                        precioUnitarioPEN: ser.precioUnitarioPEN.$numberDecimal,

                                        ventaPEN: ser.ventaPEN.$numberDecimal,

                                        precioUnitarioUSD: 0,
                                        ventaUSD: 0,

                                        codigoContableVenta: ser.codigoContableVenta,
                                        descripcionContableVenta: ser.descripcionContableVenta,
                                      });
                                      nuevoITEM++;
                                    });
                                    //console.log('PASO SERVICIOS!!!');
                                    // let cuantosDespachados = 0;
                                    for (const requi of elOS.requisiciones) {
                                      console.log('el requi ANALIZADO:::', requi);
                                      if (requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal > 0) {
                                        ctx_f_b_nc_nd.itemsVenta.push({
                                          idAuxiliar: parseInt(elIdAuxiliar()),
                                          idMercaderia: requi.idMercaderia,
                                          idEquivalencia: requi.idEquivalencia,
                                          idKardex: requi.idKardex,
                                          item: nuevoITEM,
                                          tipo: 'MERCADERIA',

                                          tipoImpuesto: requi.tipoImpuesto,
                                          tipoAfectacionDelImpuesto: requi.tipoAfectacionDelImpuesto,
                                          porcentaje: parseFloat(requi.porcentaje.$numberDecimal),

                                          tipoPrecioVentaUnitario: requi.tipoPrecioVentaUnitario,

                                          codigo: requi.codigo ? requi.codigo : '-',

                                          descripcion: requi.descripcion,
                                          descripcionEquivalencia: requi.descripcionEquivalencia,

                                          cantidad: requi.cantidad.$numberDecimal,
                                          cantidadEquivalencia: requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal,

                                          unidad: requi.unidad,
                                          unidadEquivalencia: requi.unidadEquivalencia,

                                          costoUnitarioPEN: requi.costoUnitarioPEN.$numberDecimal,
                                          costoUnitarioEquivalenciaPEN: requi.costoUnitarioEquivalenciaPEN.$numberDecimal,

                                          precioUnitarioPEN: requi.precioUnitarioPEN.$numberDecimal,

                                          ventaPEN: requi.ventaPEN.$numberDecimal,

                                          precioUnitarioUSD: 0,
                                          ventaUSD: 0,

                                          tipoEquivalencia: requi.tipoEquivalencia,
                                          factor: requi.factor,
                                          laEquivalencia: requi.laEquivalencia.$numberDecimal,

                                          exonerado: requi.exonerado,
                                          inafecto: requi.inafecto,
                                          sujetoAPercepcion: requi.sujetoAPercepcion,
                                          percepcion: requi.percepcion,

                                          codigoContableVenta: requi.codigoContableVenta,
                                          descripcionContableVenta: requi.descripcionContableVenta,
                                        });
                                        nuevoITEM++;
                                      }
                                    }

                                    ctx_add_venta.desabilitarAlmacenServicios = true;
                                    ctx_add_venta.mostrarAdjuntarOS = false;
                                  }}
                                />
                              </>
                            ) : (
                              <input type="image" src={images.edit} title="Editar venta" height={14} width={14} style={{ marginRight: '6px' }} />
                            )} */}
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.pdf}
                              title="Ver pdf"
                              height={14}
                              width={14}
                              onClick$={async () => {
                                // console.log('💨💨💨💨💦', OS._id);

                                let elOS = await loadOrdenServicio({ idOrdenServicio: OS._id });
                                elOS = elOS.data[0];
                                // console.log('💨💨💨💨', elOS);
                                osSeleccionada.value = elOS;

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
                <i style={{ fontSize: '0.8rem' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
