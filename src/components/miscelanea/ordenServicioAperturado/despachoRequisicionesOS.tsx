import { $, Resource, component$, useContext, useResource$, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
// import { CTX_BUSCAR_ORDEN_SERVICIO_APERTURADO } from './buscarOrdenServicioAperturado';
// import { IOrdenServicio_DespachoRequisicion } from '~/interfaces/iOrdenServicio';
import { CTX_NEW_OUT_ALMACEN, CTX_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import { cerosALaIzquierda, elIdAuxiliar, formatear_6Decimales } from '~/functions/comunes';

export default component$((props: { contexto: string; osSeleccionada: any }) => {
  //#region OS_SELECCINADA
  // const OS_SELECCINADA = useStore<IOrdenServicio_Requisicion>({
  //   _id: props.osSeleccionada._id,

  //   fechaInicio: props.osSeleccionada._id,
  //   correlativo: props.osSeleccionada._id,
  //   estado: props.osSeleccionada._id,
  //   tipo: props.osSeleccionada._id,

  //   idCliente: props.osSeleccionada._id,
  //   codigoTipoDocumentoIdentidad: props.osSeleccionada._id,
  //   tipoDocumentoIdentidad: props.osSeleccionada._id,
  //   numeroIdentidad: props.osSeleccionada._id,
  //   razonSocialNombreCliente: props.osSeleccionada._id,

  //   requisiciones: props.osSeleccionada._id,
  //   repuestosDespachados: props.osSeleccionada._id,
  // });
  //#endregion OS_SELECCINADA

  //#region CONTEXTO
  let ctx: any = [];
  let documento: any = [];
  // let documentoAdjunto: any = [];
  switch (props.contexto) {
    case 'egreso_de_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      documento = useContext(CTX_OUT_ALMACEN);
      // documentoAdjunto = useContext(CTX_OUT_ALMACEN);
      break;
    // case 'new_venta':
    //   ctx = useContext(CTX_ADD_VENTA);
    //   break;
  }
  // const ctx_buscar_orden_servicio_aperturado = useContext(CTX_BUSCAR_ORDEN_SERVICIO_APERTURADO);
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

    console.log('parametrosBusqueda losDespachos requisiones', props.osSeleccionada._id);

    const res = await fetch(import.meta.env.VITE_URL + '/api/ordenServicio/getDespachoRequisiciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(props.parametrosBusqueda),
      body: JSON.stringify({ idOs: props.osSeleccionada._id }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 1016px)',
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
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelDespachoRequisiciones = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('osSeleccionada', props.osSeleccionada);
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
        <h3>Despacho de requisiciones OS</h3>
        {/* CLIENTE */}
        <div>
          <div style={{ margin: '4px 0' }}>ID:{` ${props.osSeleccionada._id} `}</div>
          <div style={{ margin: '4px 0' }}>
            OS:<b>{` ${props.osSeleccionada.serie + ' - ' + cerosALaIzquierda(props.osSeleccionada.numero, 8)} `}</b>
          </div>
          <div style={{ margin: '4px 0' }}>
            Cliente:
            <b>{props.osSeleccionada.clienteVentasVarias ? ' Cliente ventas varias' : ` ${props.osSeleccionada.razonSocialNombreCliente}`}</b>
          </div>
          <div style={{ margin: '4px 0' }}>
            Placa:<b>{` ${props.osSeleccionada.placa} `}</b>
          </div>
          <div style={{ margin: '4px 0' }}>
            Kilometraje:<b>{` ${props.osSeleccionada.kilometraje}`}</b>
          </div>
          <br />
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
            onResolved={(ordenesServicio) => {
              console.log('onResolved ordenesServicio 🍓🍓🍓🍓', ordenesServicio);
              const { data } = ordenesServicio; //{ status, data, message }
              // const misDespachos: IOrdenServicio_DespachoRequisicion[] = data;
              misDespachos.value = data;
              return (
                <>
                  {misDespachos.value.length > 0 ? (
                    <>
                      <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                        <thead>
                          <tr>
                            <th>Ítem</th>
                            <th>Kx</th>
                            <th>Código</th>
                            <th>Descripción Equi</th>
                            <th>Stock Equi</th>
                            <th>Uni</th>
                            <th>Cant.</th>
                            <th>Cant Despachada</th>
                            <th>Cant Reingresada</th>
                            <th>Cant A Despachar</th>
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
                                <td data-label="Ítem" class="comoCadena">
                                  {indexItem}
                                </td>
                                <td data-label="Kx" class="comoCadena">
                                  {despachoLocali.idKardex.substring(despachoLocali.idKardex.length - 6)}
                                </td>
                                <td data-label="Código" class="comoCadena">
                                  {despachoLocali.codigo}
                                </td>
                                <td data-label="Descripción Equi" class="comoCadena">
                                  {despachoLocali.descripcionEquivalencia}
                                </td>
                                <td data-label="Stock Equi" class="comoNumero">
                                  {despachoLocali.tipoEquivalencia
                                    ? despachoLocali.stock.$numberDecimal
                                      ? formatear_6Decimales(despachoLocali.stock.$numberDecimal * despachoLocali.laEquivalencia.$numberDecimal)
                                      : formatear_6Decimales(despachoLocali.stock * despachoLocali.laEquivalencia.$numberDecimal)
                                    : despachoLocali.stock.$numberDecimal
                                    ? formatear_6Decimales(despachoLocali.stock.$numberDecimal / despachoLocali.laEquivalencia.$numberDecimal)
                                    : formatear_6Decimales(despachoLocali.stock / despachoLocali.laEquivalencia.$numberDecimal)}
                                </td>
                                <td data-label="Uni" class="comoCadena">
                                  {despachoLocali.unidadEquivalencia}
                                </td>
                                <td data-label="Cantidad" class="comoNumero">
                                  {despachoLocali.cantidadEquivalencia.$numberDecimal
                                    ? despachoLocali.cantidadEquivalencia.$numberDecimal
                                    : despachoLocali.cantidadEquivalencia}
                                </td>
                                <td data-label="Cant Despachada" class="comoNumero">
                                  {despachoLocali.cantidadDespachada.$numberDecimal
                                    ? despachoLocali.cantidadDespachada.$numberDecimal
                                    : despachoLocali.cantidadDespachada}
                                </td>
                                <td data-label="Cant Reingresada" class="comoNumero">
                                  {despachoLocali.cantidadReingresada.$numberDecimal
                                    ? despachoLocali.cantidadReingresada.$numberDecimal
                                    : despachoLocali.cantidadReingresada}
                                </td>
                                <td data-label="Cant A Despachar" class="comoNumero">
                                  <input
                                    style={{ width: '80px', textAlign: 'end' }}
                                    value={despachoLocali.aDespachar}
                                    onChange$={(e) => {
                                      const a_Despachar = parseFloat((e.target as HTMLInputElement).value);
                                      console.log('a_Despachar', a_Despachar);
                                      despachoLocali.aDespachar = a_Despachar;
                                    }}
                                    // onFocusin$={(e) => {
                                    //   (e.target as HTMLInputElement).select();
                                    // }}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <br />
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
            console.log('props.osSeleccionadas', props.osSeleccionada);

            //VERIFICAR montos a DESPACHAR
            let todoCorrecto = true;
            let algunoMasQueCero = false;
            //VERIFICAR montos a DESPACHAR -> TODOS LOS MONTOS SON CEROS
            for (const despachoLocali of misDespachos.value) {
              const despa = despachoLocali.aDespachar.$numberDecimal ? despachoLocali.aDespachar.$numberDecimal : despachoLocali.aDespachar;

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
                despachoLocali.cantidadEquivalencia.$numberDecimal ? despachoLocali.cantidadEquivalencia.$numberDecimal : despachoLocali.cantidadEquivalencia
              );

              const despachado = parseFloat(
                despachoLocali.cantidadDespachada.$numberDecimal ? despachoLocali.cantidadDespachada.$numberDecimal : despachoLocali.cantidadDespachada
              );
              const reing = parseFloat(
                despachoLocali.cantidadReingresada.$numberDecimal ? despachoLocali.cantidadReingresada.$numberDecimal : despachoLocali.cantidadReingresada
              );

              const aDespa = parseFloat(despachoLocali.aDespachar.$numberDecimal ? despachoLocali.aDespachar.$numberDecimal : despachoLocali.aDespachar);

              let stockEQUIVALENTE = 0;
              if (despachoLocali.tipoEquivalencia) {
                stockEQUIVALENTE = parseFloat(despachoLocali.stock.$numberDecimal) * parseFloat(despachoLocali.laEquivalencia.$numberDecimal);
              } else {
                stockEQUIVALENTE = parseFloat(despachoLocali.stock.$numberDecimal) / parseFloat(despachoLocali.laEquivalencia.$numberDecimal);
              }

              console.log('stockEQUIVALENTE - por despa', stockEQUIVALENTE, aDespa);
              if (aDespa > stockEQUIVALENTE) {
                alert(`ATENCIÓN: Desea despachar mayor cantidad ( ${aDespa} ) que el stock equivalente ( ${stockEQUIVALENTE} ). Posición # ${i}`);
                todoCorrecto = false;
                break;
              }

              console.log('canti - despachado - reing - por aDespa', canti, despachado, reing, aDespa);
              if (despachado - reing + aDespa > canti) {
                alert(
                  `ATENCIÓN: Se intenta despachar una cantidad mayor a la solicitada. La cantidad solicitada ( ${canti} ) es menor que la suma de lo ya despachado ( Despachado-Reingresada = ${
                    despachado - reing
                  } ) más lo que se desea despachar ahora ( ${aDespa} ), y se encuetra en la posición # ${i}`
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
            documento.idDocumento = props.osSeleccionada._id;

            if (!props.osSeleccionada.clienteVentasVarias) {
              //DESTINATARIO
              documento.idDestinatario = props.osSeleccionada.idCliente;
              documento.codigoTipoDocumentoIdentidad = props.osSeleccionada.codigoTipoDocumentoIdentidad;
              documento.tipoDocumentoIdentidad = props.osSeleccionada.tipoDocumentoIdentidad;
              documento.numeroIdentidad = props.osSeleccionada.numeroIdentidad;
              documento.razonSocialNombre = props.osSeleccionada.razonSocialNombreCliente;
            }

            //TIPO DE DOCUMENTO -> ORDEN DE SERVICIO
            const numeroDocumentos = documento.documentosAdjuntos.length;
            //borra todos los elementos del array
            documento.documentosAdjuntos.splice(0, numeroDocumentos);
            //inserta el elemento / documento en el array
            documento.documentosAdjuntos.push({
              codigoTCP: '00',
              descripcionTCP: 'Otros',
              fecha: props.osSeleccionada.fechaInicio,
              idAuxiliar: elIdAuxiliar(),
              numero: props.osSeleccionada.numero,
              serie: props.osSeleccionada.serie,
            });

            //INSERTAR MERCADERIA
            const numeroMercaderias = documento.itemsMercaderias.length;
            //borra todos los elementos del array
            documento.itemsMercaderias.splice(0, numeroMercaderias);
            //inserta los elementos / mercaderias en el array
            console.log('🚍🚍🚍🚍🚍numeroMercaderias', numeroMercaderias);
            for (const despachoLocali of misDespachos.value) {
              const despaEquiva = despachoLocali.aDespachar.$numberDecimal ? despachoLocali.aDespachar.$numberDecimal : despachoLocali.aDespachar;
              console.log('🚍🚍🚍🚍🚍despaEquiva', despaEquiva);
              console.log('despachoLocali', despachoLocali);
              if (despaEquiva > 0) {
                // let despa = 0;

                documento.itemsMercaderias.push({
                  idAuxiliar: parseInt(elIdAuxiliar()),
                  idMercaderia: despachoLocali.idMercaderia,
                  idEquivalencia: despachoLocali.idEquivalencia,
                  idKardex: despachoLocali.idKardex,
                  idItem: despachoLocali._id,
                  item: 0,

                  codigo: despachoLocali.codigo ? despachoLocali.codigo : '_',

                  descripcion: despachoLocali.descripcion,
                  descripcionEquivalencia: despachoLocali.descripcionEquivalencia,

                  cantidadSacada: despaEquiva * despachoLocali.laEquivalencia.$numberDecimal,
                  cantidadSacadaEquivalencia: despaEquiva,

                  unidad: despachoLocali.unidad,
                  unidadEquivalencia: despachoLocali.unidadEquivalencia,
                  /////////////////////////////////////////////////////////////////////
                  costoUnitarioPEN: despachoLocali.costoUnitarioMovil.$numberDecimal,
                  costoUnitarioEquivalenciaPEN: despachoLocali.costoUnitarioMovil.$numberDecimal * despachoLocali.laEquivalencia.$numberDecimal,
                  //sub = K * c
                  subPEN: despaEquiva * despachoLocali.costoUnitarioMovil.$numberDecimal,
                  subEquivalenciaPEN: despaEquiva * despachoLocali.costoUnitarioMovil.$numberDecimal * despachoLocali.laEquivalencia.$numberDecimal,

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

            // if (equivalencia.idUnidadEquivalencia === '') {
            //   alert('Seleccionar una equivalencia');
            //   document.getElementById('selectUniEquivalencia_MICE')?.focus();
            //   return;
            // }
            // documento.push({
            //   idAuxiliar: parseInt(elIdAuxiliar()),
            //   idKardex: props.elKardex._id,
            //   item: 0,
            //   codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : '_',
            //   descripcionEquivalencia: equivalencia.descripcionEquivalencia,
            //   cantidad: cantidad.value,
            //   unidadEquivalencia: equivalencia.unidadEquivalencia,
            //   costo: 0,
            //   precioPEN: precioEquivalente.value,
            //   ventaPEN: cantidad.value * precioEquivalente.value,
            //   precioUSD: 0,
            //   ventaUSD: 0,
            //   tipoEquivalencia: equivalencia.tipoEquivalencia,
            //   factor: equivalencia.factor,
            //   laEquivalencia: equivalencia.laEquivalencia,
            // });
            // if (props.contexto === 'buscar_mercaderia_out') {
            //   ctx.mostrarPanelMercaderiaOUTSeleccionada = false;
            // }
            // if (props.contexto === 'kardexs_out') {
            //   ctx.mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS = false;
            // }
          }}
        />
      </div>
    </div>
  );
});
