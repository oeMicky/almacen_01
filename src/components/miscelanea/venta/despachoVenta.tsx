import { $, Resource, component$, useContext, useResource$, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_OUT_ALMACEN, CTX_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import ImgButton from '~/components/system/imgButton';
import { elIdAuxiliar, formatoDDMMYYYY_PEN } from '~/functions/comunes';

export default component$((props: { contexto: string; ventaSeleccionada: any }) => {
  //#region CONTEXTO
  let ctx: any = [];
  let documento: any = [];
  // let documentoAdjunto: any = [];
  switch (props.contexto) {
    case 'new_out_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      documento = useContext(CTX_OUT_ALMACEN);
      // documentoAdjunto = useContext(CTX_OUT_ALMACEN);
      break;
    // case 'new_venta':
    //   ctx = useContext(CTX_ADD_VENTA);
    //   break;
  }
  //   const ctx_buscar_orden_servicio_aperturado = useContext(CTX_BUSCAR_ORDEN_SERVICIO_APERTURADO);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);
  // const misDespachos=useStore([]);
  const misDespachos = useSignal<any>();
  // let misDespachos = useSignal<any>();
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const losDespachos = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // track(() => props.buscarOrdenesServicio.valueOf());
    track(() => ini.value);
    console.log('parametrosBusqueda losDespachos ini.value', ini.value);
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda losDespachos', props.ventaSeleccionada._id);

    const res = await fetch(import.meta.env.VITE_URL + '/api/venta/obtenerDespachoVenta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(props.parametrosBusqueda),
      body: JSON.stringify({ idVenta: props.ventaSeleccionada._id }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(min(10vw, 20rem), 700px, max(90vw, 55rem))',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelDespachoVenta = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('osSeleccionada', props.ventaSeleccionada);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('misDespachos', misDespachos.value);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3>Despacho de requisiciones</h3>
        {/* CLIENTE */}
        <div style={{ fontSize: '0.8em' }}>
          <div style={{ margin: '5px 0' }}>ID:{` ${props.ventaSeleccionada._id} `}</div>
          <div style={{ margin: '5px 0' }}>
            Serie-Nro:{` ${props.ventaSeleccionada.serie + '-' + props.ventaSeleccionada.numero} `}
          </div>
          <div style={{ margin: '5px 0' }}>Cliente:{` ${props.ventaSeleccionada.razonSocialNombre}`}</div>
          <div style={{ margin: '5px 0' }}>Fecha:{` ${formatoDDMMYYYY_PEN(props.ventaSeleccionada.fecha)} `}</div>
        </div>
        {/* TABLA DE REQUISICIONES */}
        <div class="form-control">
          <Resource
            value={losDespachos}
            onPending={() => {
              console.log('onPending 🍉🍉🍉🍉');
              return <div>Cargando...</div>;
            }}
            onRejected={() => {
              console.log('onRejected 🍍🍍🍍🍍');
              return <div>Fallo en la carga de datos</div>;
            }}
            onResolved={(itemsVenta) => {
              console.log('onResolved 🍓🍓🍓🍓', itemsVenta);
              const { data } = itemsVenta; //{ status, data, message }
              // const misDespachos: IOrdenServicio_DespachoRequisicion[] = data;
              misDespachos.value = data;
              return (
                <>
                  {misDespachos.value.length > 0 ? (
                    <>
                      <table style={{ fontSize: '0.8em', fontWeight: 'lighter ' }}>
                        <thead>
                          <tr>
                            <th>Ítem</th>
                            <th>Kx</th>
                            <th>Código</th>
                            <th>Descripción Equi</th>
                            <th>Stock Equi</th>
                            <th>Uni</th>
                            <th>Cant.</th>
                            <th>Cant.Despachada</th>
                            <th>Cant.A Despachar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {misDespachos.value.map((despachoLocali: any, index: number) => {
                            // let {
                            //   _id,
                            //   idAuxiliar,
                            //   idKardex,
                            //   codigo,
                            //   descripcionEquivalencia,
                            //   cantidad,
                            //   unidadEquivalencia,
                            //   cantidadesDespachadas,
                            //   tipoEquivalencia,
                            //   factor,
                            //   laEquivalencia,
                            //   stock,
                            //   cantidadADespachar,
                            //   aDespachar,
                            // } = despachoLocali;
                            // let { cantidadADespachar } = despachoLocali;
                            const indexItem = index + 1; //, index
                            return (
                              <tr key={despachoLocali._id}>
                                <td data-label="Ítem">{indexItem}</td>
                                <td data-label="Kx">{despachoLocali.idKardex.substring(despachoLocali.idKardex.length - 6)}</td>
                                <td data-label="Código">{despachoLocali.codigo}</td>
                                <td data-label="Descripción">{despachoLocali.descripcionEquivalencia}</td>
                                <td data-label="Stock">
                                  {despachoLocali.tipoEquivalencia
                                    ? despachoLocali.stock.$numberDecimal
                                      ? despachoLocali.stock.$numberDecimal * despachoLocali.laEquivalencia.$numberDecimal
                                      : despachoLocali.stock * despachoLocali.laEquivalencia.$numberDecimal
                                    : despachoLocali.stock.$numberDecimal
                                    ? despachoLocali.stock.$numberDecimal / despachoLocali.laEquivalencia.$numberDecimal
                                    : despachoLocali.stock / despachoLocali.laEquivalencia.$numberDecimal}
                                </td>
                                <td data-label="Uni">{despachoLocali.unidadEquivalencia}</td>
                                <td data-label="Cantidad">
                                  {despachoLocali.cantidad.$numberDecimal
                                    ? despachoLocali.cantidad.$numberDecimal
                                    : despachoLocali.cantidad}
                                </td>
                                <td data-label="Cant.Despachada">
                                  {despachoLocali.cantidadDespachada.$numberDecimal
                                    ? despachoLocali.cantidadDespachada.$numberDecimal
                                    : despachoLocali.cantidadDespachada}
                                </td>
                                <td data-label="Cant.A Despachar" style={{ textAlign: 'end' }}>
                                  <ImgButton
                                    src={images.see}
                                    alt="icono de editar"
                                    height={14}
                                    width={14}
                                    title="Editar servicio"
                                    onClick={$(() => {
                                      console.log('despachoLocali', despachoLocali);
                                    })}
                                  />
                                  <input
                                    style={{ width: '60px', textAlign: 'end' }}
                                    value={despachoLocali.aDespachar}
                                    onChange$={(e) => {
                                      const a_Despachar = parseFloat((e.target as HTMLInputElement).value);
                                      console.log('a_Despachar', a_Despachar);
                                      despachoLocali.aDespachar = a_Despachar;
                                    }}
                                    onFocusin$={(e) => {
                                      (e.target as HTMLInputElement).select();
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
        </div>
        {/* DESPACHAR */}
        <input
          id="btn_despacharRequisiciones_ORDEN_SERVICIO_APERTURADO"
          type="button"
          value="Despachar"
          class="btn-centro"
          onClick$={() => {
            console.log('losDespachos', losDespachos);
            console.log('mis despachos', misDespachos.value);

            //VERIFICAR montos a DESPACHAR
            let todoCorrecto = true;
            let algunoMasQueCero = false;
            //VERIFICAR montos a DESPACHAR -> TODOS LOS MONTOS SON CEROS
            for (const despachoLocali of misDespachos.value) {
              const despa = despachoLocali.aDespachar.$numberDecimal
                ? despachoLocali.aDespachar.$numberDecimal
                : despachoLocali.aDespachar;

              if (despa > 0) {
                algunoMasQueCero = true;
              }
            }

            if (!algunoMasQueCero) {
              alert('ATENCIÓN: todos los montos a despachar no pueden ser cero (0)');
              return;
            }

            let i = 0;
            for (const despachoLocali of misDespachos.value) {
              i++;
              const canti = parseFloat(
                despachoLocali.cantidad.$numberDecimal ? despachoLocali.cantidad.$numberDecimal : despachoLocali.cantidad
              );

              const adas = parseFloat(
                despachoLocali.cantidadDespachada.$numberDecimal
                  ? despachoLocali.cantidadDespachada.$numberDecimal
                  : despachoLocali.cantidadDespachada
              );

              const despa = parseFloat(
                despachoLocali.aDespachar.$numberDecimal ? despachoLocali.aDespachar.$numberDecimal : despachoLocali.aDespachar
              );

              console.log('canti - adas - por despa', canti, adas, despa);
              if (adas + despa > canti) {
                alert(
                  `ATENCIÓN: Se desea despachar mayor cantidad a la solicitada. La cantidad solicitada ( ${canti} ) es menor que la suma de lo ya despachado ( ${adas} ) más lo que se desea despachar ahora ( ${despa} ), y se encuetra en la posición ${i}`
                );
                todoCorrecto = false;
                break;
              }
            }

            if (!todoCorrecto) {
              return;
            }
            console.log('paso VERIFICACION de CANTIDADES A DESPACHAR');
            //** copiar los datos al panel de EGRESO */

            //ID DE LA ORDEN SERVICIO
            documento.idDocumento = props.ventaSeleccionada._id;

            //DESTINATARIO
            documento.idDestinatario = props.ventaSeleccionada.idCliente;
            documento.codigoTipoDocumentoIdentidad = props.ventaSeleccionada.codigoTipoDocumentoIdentidad;
            documento.tipoDocumentoIdentidad = props.ventaSeleccionada.tipoDocumentoIdentidad;
            documento.numeroIdentidad = props.ventaSeleccionada.numeroIdentidad;
            documento.razonSocialNombre = props.ventaSeleccionada.razonSocialNombreCliente;

            //TIPO DE DOCUMENTO -> ORDEN DE SERVICIO
            const numeroDocumentos = documento.documentosAdjuntos.length;
            //borra todos los elementos del array
            documento.documentosAdjuntos.splice(0, numeroDocumentos);
            //inserta el elemento / documento en el array
            documento.documentosAdjuntos.push({
              codigoTCP: '00',
              descripcionTCP: 'Otros',
              fecha: props.ventaSeleccionada.fecha,
              idAuxiliar: elIdAuxiliar(),
              numero: props.ventaSeleccionada.correlativo,
              serie: props.ventaSeleccionada.serie,
            });

            //INSERTAR MERCADERIA
            const numeroMercaderias = documento.itemsMercaderias.length;
            //borra todos los elementos del array
            documento.itemsMercaderias.splice(0, numeroMercaderias);
            //inserta los elementos / mercaderias en el array
            for (const despachoLocali of misDespachos.value) {
              const despa = despachoLocali.aDespachar.$numberDecimal
                ? despachoLocali.aDespachar.$numberDecimal
                : despachoLocali.aDespachar;

              if (despa > 0) {
                documento.itemsMercaderias.push({
                  idAuxiliar: parseInt(elIdAuxiliar()),
                  idMercaderia: despachoLocali.idMercaderia,
                  idEquivalencia: despachoLocali.idEquivalencia,
                  idKardex: despachoLocali.idKardex,
                  item: 0,
                  codigo: despachoLocali.codigo ? despachoLocali.codigo : '_',
                  descripcionEquivalencia: despachoLocali.descripcionEquivalencia,
                  cantidadSacada: despa,
                  unidadEquivalencia: despachoLocali.unidadEquivalencia,
                  // costoPEN: props.elKardex.costoUnitarioMovil.$numberDecimal * despachoLocali.laEquivalencia.$numberDecimal,
                  // subTotalPEN:
                  //   despa * props.elKardex.costoUnitarioMovil.$numberDecimal * despachoLocali.laEquivalencia.$numberDecimal,
                  costoUnitarioPEN: 66,
                  subTotalPEN: despa * 66,
                  precioUSD: 0,
                  ventaUSD: 0,
                  tipoEquivalencia: despachoLocali.tipoEquivalencia,
                  factor: despachoLocali.factor,
                  laEquivalencia: despachoLocali.laEquivalencia.$numberDecimal,
                });
              }
            }

            ctx.mostrarPanelDespachoRequisiciones = false;
            ctx.mostrarPanelBuscarOrdenServicioAperturado = false;
          }}
        />
      </div>
    </div>
  );
});
