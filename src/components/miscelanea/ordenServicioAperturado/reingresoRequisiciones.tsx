import { $, Resource, component$, useContext, useResource$, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_IN_ALMACEN, CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda, elIdAuxiliar } from '~/functions/comunes';

export default component$((props: { contexto: string; osSeleccionada: any }) => {
  //#region CONTEXTO
  const ctx = useContext(CTX_NEW_IN_ALMACEN);
  const documento = useContext(CTX_IN_ALMACEN);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);

  const misReingresos = useSignal<any>();

  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const losReingresos = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // track(() => props.buscarOrdenesServicio.valueOf());
    track(() => ini.value);
    console.log('parametrosBusqueda losReingresos ini.value', ini.value);
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda losReingresos', props.osSeleccionada._id);

    const res = await fetch(import.meta.env.VITE_URL + '/api/ordenServicio/getReingresoRequisiciones', {
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
        width: 'clamp(338px, 86%, 800px)',
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
            ctx.mostrarPanelReingresoRequisiciones = false;
          })}
        />
        {/* <ImgButton
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
        /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3>Reingreso de requisiciones</h3>
        {/* CLIENTE */}
        <div style={{ fontSize: '0.8em' }}>
          <div style={{ margin: '5px 0' }}>ID:{` ${props.osSeleccionada._id} `}</div>
          <div style={{ margin: '5px 0' }}>
            OS:<b>{` ${props.osSeleccionada.serie + ' - ' + cerosALaIzquierda(props.osSeleccionada.numero, 8)} `}</b>
          </div>
          <div style={{ margin: '5px 0' }}>
            Cliente:<b>{` ${props.osSeleccionada.razonSocialNombreCliente}`}</b>
          </div>
          <div style={{ margin: '5px 0' }}>
            Placa:<b>{` ${props.osSeleccionada.placa} `}</b>
          </div>
          <div style={{ margin: '5px 0' }}>
            Kilometraje:<b>{` ${props.osSeleccionada.kilometraje}`}</b>
          </div>
        </div>
        {/* TABLA DE REQUISICIONES */}
        <div class="form-control">
          <Resource
            value={losReingresos}
            onPending={() => {
              console.log('onPending 🍉🍉🍉🍉');
              return <div>Cargando...</div>;
            }}
            onRejected={() => {
              console.log('onRejected 🍍🍍🍍🍍');
              return <div>Fallo en la carga de datos</div>;
            }}
            onResolved={(ordenesServicio) => {
              console.log('onResolved 🍓🍓🍓🍓', ordenesServicio);
              const { data } = ordenesServicio; //{ status, data, message }
              // const misDespachos: IOrdenServicio_DespachoRequisicion[] = data;
              misReingresos.value = data;
              return (
                <>
                  {misReingresos.value.length > 0 ? (
                    <>
                      <table style={{ fontSize: '0.8em', fontWeight: 'lighter ' }}>
                        <thead>
                          <tr>
                            <th>Ítem</th>
                            <th>Kx</th>
                            <th>Código</th>
                            <th>Descripción Equi</th>
                            {/*  <th>Stock Equi</th>*/}
                            <th>Uni</th>
                            {/* <th>Cant.</th> */}
                            <th>Cant.Despachada</th>
                            <th>Cant.A Reingresar</th>
                          </tr>
                        </thead>
                        <tbody>
                          {misReingresos.value.map((reingresoLocali: any, index: number) => {
                            const indexItem = index + 1; //, index
                            return (
                              <tr key={reingresoLocali._id}>
                                <td data-label="Ítem">{indexItem}</td>
                                <td data-label="Kx">{reingresoLocali.idKardex.substring(reingresoLocali.idKardex.length - 6)}</td>
                                <td data-label="Código">{reingresoLocali.codigo}</td>
                                <td data-label="Descripción Equi">{reingresoLocali.descripcionEquivalencia}</td>
                                {/*   <td data-label="Stock">
                                  {reingresoLocali.tipoEquivalencia
                                    ? reingresoLocali.stock.$numberDecimal
                                      ? reingresoLocali.stock.$numberDecimal * reingresoLocali.laEquivalencia.$numberDecimal
                                      : reingresoLocali.stock * reingresoLocali.laEquivalencia.$numberDecimal
                                    : reingresoLocali.stock.$numberDecimal
                                    ? reingresoLocali.stock.$numberDecimal / reingresoLocali.laEquivalencia.$numberDecimal
                                    : reingresoLocali.stock / reingresoLocali.laEquivalencia.$numberDecimal}
                                  </td>*/}
                                <td data-label="Uni">{reingresoLocali.unidadEquivalencia}</td>
                                {/* <td data-label="Cantidad">
                                  {reingresoLocali.cantidad.$numberDecimal
                                    ? reingresoLocali.cantidad.$numberDecimal
                                    : reingresoLocali.cantidad}
                                </td> */}
                                <td data-label="Cant.Despachada">
                                  {reingresoLocali.cantidadDespachada.$numberDecimal
                                    ? reingresoLocali.cantidadDespachada.$numberDecimal
                                    : reingresoLocali.cantidadDespachada}
                                </td>
                                <td data-label="Cant.A Reingresar" style={{ textAlign: 'end' }}>
                                  <input
                                    style={{ width: '60px', textAlign: 'end' }}
                                    value={reingresoLocali.aReingresar}
                                    onChange$={(e) => {
                                      const a_Reingresar = parseFloat((e.target as HTMLInputElement).value);
                                      console.log('a_Reingresar', a_Reingresar);
                                      reingresoLocali.aReingresar = a_Reingresar;
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
          id="btn_reingresarRequisiciones_ORDEN_SERVICIO_APERTURADO"
          type="button"
          value="Reingresar"
          class="btn-centro"
          onClick$={() => {
            console.log('losReingresos', losReingresos);
            console.log('mis misReingresos', misReingresos.value);

            //VERIFICAR montos a REINGRESAR
            let todoCorrecto = true;
            let algunoMasQueCero = false;
            //VERIFICAR montos a REINGRESAR -> TODOS LOS MONTOS SON CEROS
            for (const reingresoLocali of misReingresos.value) {
              const reingre = reingresoLocali.aReingresar.$numberDecimal
                ? reingresoLocali.aReingresar.$numberDecimal
                : reingresoLocali.aReingresar;

              if (reingre > 0) {
                algunoMasQueCero = true;
              }
            }

            if (!algunoMasQueCero) {
              alert('ATENCIÓN: todos los montos a reingresar no pueden ser cero (0)');
              return;
            }

            let i = 0;
            for (const reingresoLocali of misReingresos.value) {
              i++;

              const despa = parseFloat(
                reingresoLocali.cantidadDespachada.$numberDecimal
                  ? reingresoLocali.cantidadDespachada.$numberDecimal
                  : reingresoLocali.cantidadDespachada
              );

              const reingre = parseFloat(
                reingresoLocali.aReingresar.$numberDecimal
                  ? reingresoLocali.aReingresar.$numberDecimal
                  : reingresoLocali.aReingresar
              );

              // let stockEQUIVALENTE = 0;
              // if (reingresoLocali.tipoEquivalencia) {
              //   stockEQUIVALENTE =
              //     parseFloat(reingresoLocali.stock.$numberDecimal) * parseFloat(reingresoLocali.laEquivalencia.$numberDecimal);
              // } else {
              //   stockEQUIVALENTE =
              //     parseFloat(reingresoLocali.stock.$numberDecimal) / parseFloat(reingresoLocali.laEquivalencia.$numberDecimal);
              // }

              // console.log('stockEQUIVALENTE - por despa', stockEQUIVALENTE, rein);
              // if (rein > stockEQUIVALENTE) {
              //   alert(
              //     `ATENCIÓN: Desea despachar mayor cantidad ( ${rein} ) que el stock equivalente ( ${stockEQUIVALENTE} ). Posición # ${i}`
              //   );
              //   todoCorrecto = false;
              //   break;
              // }

              console.log('despa - reingre', despa, reingre);
              if (reingre > despa) {
                alert(
                  `ATENCIÓN: Se intenta reingresar una cantidad mayor a la despachada. La cantidad despachada ( ${despa} ) es menor a la cantidad a reingresar ( ${reingre} ), y se encuetra en la posición # ${i}`
                );
                todoCorrecto = false;
                break;
              }
            }

            if (!todoCorrecto) {
              return;
            }
            console.log('paso VERIFICACION de CANTIDADES A REINGRESAR');
            ////// copiar los datos al panel de EGRESO

            //ID DE LA ORDEN SERVICIO
            documento.idDocumento = props.osSeleccionada._id;

            //DESTINATARIO
            documento.idRemitente = props.osSeleccionada.idCliente;
            documento.codigoTipoDocumentoIdentidad = props.osSeleccionada.codigoTipoDocumentoIdentidad;
            documento.tipoDocumentoIdentidad = props.osSeleccionada.tipoDocumentoIdentidad;
            documento.numeroIdentidad = props.osSeleccionada.numeroIdentidad;
            documento.razonSocialNombre = props.osSeleccionada.razonSocialNombreCliente;

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
            for (const reingresoLocali of misReingresos.value) {
              const rein = reingresoLocali.aReingresar.$numberDecimal
                ? reingresoLocali.aReingresar.$numberDecimal
                : reingresoLocali.aReingresar;

              console.log('rein', rein);
              if (rein > 0) {
                let IGVCalculado = 0;
                if (reingresoLocali.igv === 0) {
                  IGVCalculado = 0;
                } else {
                  IGVCalculado = 1 + reingresoLocali.igv / 100;
                }
                let costo = 0;
                if (reingresoLocali.tipoEquivalencia) {
                  costo = reingresoLocali.costoUnitarioPEN.$numberDecimal / reingresoLocali.factor;
                } else {
                  costo = reingresoLocali.costoUnitarioPEN.$numberDecimal * reingresoLocali.factor;
                }
                documento.itemsMercaderias.push({
                  idAuxiliar: reingresoLocali.idAuxiliar, //parseInt(elIdAuxiliar()),
                  idMercaderia: reingresoLocali.idMercaderia,
                  idEquivalencia: reingresoLocali.idEquivalencia,
                  idKardex: reingresoLocali.idKardex,
                  idItem: reingresoLocali._id,
                  item: 0,

                  IGV: reingresoLocali.igv,

                  codigo: reingresoLocali.codigo ? reingresoLocali.codigo : '_',
                  descripcion: reingresoLocali.descripcion,
                  cantidadIngresada: rein * reingresoLocali.laEquivalencia.$numberDecimal,
                  unidad: reingresoLocali.unidad,

                  costoUnitarioPEN: costo,
                  subPEN: rein * reingresoLocali.laEquivalencia.$numberDecimal * costo,
                  valorUnitarioPEN: costo * IGVCalculado,
                  totPEN: rein * reingresoLocali.laEquivalencia.$numberDecimal * costo * IGVCalculado,

                  descripcionEquivalencia: reingresoLocali.descripcionEquivalencia,
                  cantidadIngresadaEquivalencia: rein,
                  unidadEquivalencia: reingresoLocali.unidadEquivalencia,
                  costoUnitarioPENEquivalencia: reingresoLocali.costoUnitarioPEN,
                  subPENEquivalencia: rein * reingresoLocali.costoUnitarioPEN.$numberDecimal,
                  valorUnitarioPENEquivalencia: reingresoLocali.costoUnitarioPEN.$numberDecimal * IGVCalculado,
                  totPENEquivalencia: rein * reingresoLocali.costoUnitarioPEN.$numberDecimal * IGVCalculado,

                  tipoEquivalencia: reingresoLocali.tipoEquivalencia,
                  factor: reingresoLocali.factor,
                  laEquivalencia: reingresoLocali.laEquivalencia.$numberDecimal,
                });
              }
            }

            documento.reingreso = true;

            ctx.mostrarPanelReingresoRequisiciones = false;
            ctx.mostrarPanelBuscarOrdenServicioAperturado = false;
          }}
        />
      </div>
    </div>
  );
});
