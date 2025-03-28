import { $, Resource, component$, useContext, useResource$, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_IN_ALMACEN, CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda, elIdAuxiliar } from '~/functions/comunes';

export default component$((props: { contexto: string; opSeleccionada: any }) => {
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
    // track(() => props.buscarOrdenesProduccion.valueOf());
    track(() => ini.value);
    //console.log('parametrosBusqueda losReingresos ini.value', ini.value);
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //console.log('parametrosBusqueda losReingresos', props.opSeleccionada._id);

    const res = await fetch(import.meta.env.VITE_URL + '/api/ordenProduccion/getReingresoRequisicionesOP', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(props.parametrosBusqueda),
      body: JSON.stringify({ idOp: props.opSeleccionada._id }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 1000px)',
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
            ctx.mostrarPanelReingresoRequisiciones = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3>Reingreso de requisiciones</h3>
        {/* CLIENTE */}
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', margin: '4px 0' }}>
            ID:<b>{` ${props.opSeleccionada._id} `}</b>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', margin: '4px 0' }}>
            OS:<b>{` ${props.opSeleccionada.serie + ' - ' + cerosALaIzquierda(props.opSeleccionada.numero, 8)} `}</b>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '90px 1fr', margin: '4px 0' }}>
            Cliente:
            <b>{props.opSeleccionada.clienteVentasVarias ? 'Cliente ventas varias' : ` ${props.opSeleccionada.razonSocialNombreCliente}`}</b>
          </div>

          <br />
        </div>
        {/* TABLA DE REQUISICIONES */}
        <div class="form-control">
          <Resource
            value={losReingresos}
            onPending={() => {
              //console.log('onPending 🍉🍉🍉🍉');
              return <div>Cargando...</div>;
            }}
            onRejected={() => {
              //console.log('onRejected 🍍🍍🍍🍍');
              return <div>Fallo en la carga de datos</div>;
            }}
            onResolved={(requisiciones) => {
              //console.log('onResolved 🍓🍓🍓🍓', requisiciones);
              const { data } = requisiciones; //{ status, data, message }
              // const misDespachos: IOrdenProduccion_DespachoRequisicion[] = data;
              misReingresos.value = data;
              return (
                <>
                  {misReingresos.value.length > 0 ? (
                    <>
                      <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                        <thead>
                          <tr>
                            <th>Ítem</th>
                            <th>Kx</th>
                            <th>Código</th>
                            <th>Descripción Equi</th>
                            <th>Uni</th>
                            <th>Cant Despachada</th>
                            <th>Cant Reingresada</th>
                            <th>Cant A Reingresar</th>
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

                                <td data-label="Uni">{reingresoLocali.unidadEquivalencia}</td>

                                <td data-label="Cant Despachada" class="comoNumero">
                                  {reingresoLocali.cantidadDespachada.$numberDecimal
                                    ? reingresoLocali.cantidadDespachada.$numberDecimal
                                    : reingresoLocali.cantidadDespachada}
                                </td>
                                <td data-label="Cant Reingresada" class="comoNumero">
                                  {reingresoLocali.cantidadReingresada.$numberDecimal
                                    ? reingresoLocali.cantidadReingresada.$numberDecimal
                                    : reingresoLocali.cantidadReingresada}
                                </td>
                                <td data-label="Cant A Reingresar" class="comoNumero">
                                  <input
                                    style={{ width: '60px', textAlign: 'end' }}
                                    value={reingresoLocali.aReingresar}
                                    onChange$={(e) => {
                                      const a_Reingresar = parseFloat((e.target as HTMLInputElement).value);
                                      //console.log('a_Reingresar', a_Reingresar);
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
        {/* REINGRESAR */}
        <input
          id="btn_reingresarRequisiciones_ORDEN_PRODUCCION_APERTURADO"
          type="button"
          value="Reingresar"
          class="btn-centro"
          onClick$={() => {
            //console.log('losReingresos', losReingresos);
            //console.log('mis misReingresos', misReingresos.value);

            //VERIFICAR montos a REINGRESAR
            let todoCorrecto = true;
            let algunoMasQueCero = false;
            //VERIFICAR montos a REINGRESAR -> TODOS LOS MONTOS SON CEROS
            for (const reingresoLocali of misReingresos.value) {
              const reingre = reingresoLocali.aReingresar.$numberDecimal ? reingresoLocali.aReingresar.$numberDecimal : reingresoLocali.aReingresar;

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

              const despachado = parseFloat(
                reingresoLocali.cantidadDespachada.$numberDecimal ? reingresoLocali.cantidadDespachada.$numberDecimal : reingresoLocali.cantidadDespachada
              );
              const reingresado = parseFloat(
                reingresoLocali.cantidadReingresada.$numberDecimal ? reingresoLocali.cantidadReingresada.$numberDecimal : reingresoLocali.cantidadReingresada
              );

              const aReingre = parseFloat(
                reingresoLocali.aReingresar.$numberDecimal ? reingresoLocali.aReingresar.$numberDecimal : reingresoLocali.aReingresar
              );

              // let stockEQUIVALENTE = 0;
              // if (reingresoLocali.tipoEquivalencia) {
              //   stockEQUIVALENTE =
              //     parseFloat(reingresoLocali.stock.$numberDecimal) * parseFloat(reingresoLocali.laEquivalencia.$numberDecimal);
              // } else {
              //   stockEQUIVALENTE =
              //     parseFloat(reingresoLocali.stock.$numberDecimal) / parseFloat(reingresoLocali.laEquivalencia.$numberDecimal);
              // }

              // //console.log('stockEQUIVALENTE - por despa', stockEQUIVALENTE, rein);
              // if (rein > stockEQUIVALENTE) {
              //   alert(
              //     `ATENCIÓN: Desea despachar mayor cantidad ( ${rein} ) que el stock equivalente ( ${stockEQUIVALENTE} ). Posición # ${i}`
              //   );
              //   todoCorrecto = false;
              //   break;
              // }

              //console.log('despachado - reingresado - aReingre', despachado, reingresado, aReingre);
              if (aReingre > despachado - reingresado) {
                alert(
                  `ATENCIÓN: La cantidad que puede ser reingresada ( D - R = ${
                    despachado - reingresado
                  } ) es menor a la cantidad a reingresar ( ${aReingre} ), y se encuentra en la posición # ${i}`
                );
                todoCorrecto = false;
                break;
              }
            }

            if (!todoCorrecto) {
              return;
            }
            //console.log('paso VERIFICACION de CANTIDADES A REINGRESAR');
            ////// copiar los datos al panel de EGRESO

            //ID DE LA ORDEN PRODUCCION
            documento.idDocumento = props.opSeleccionada._id;

            //DESTINATARIO
            documento.idRemitente = props.opSeleccionada.idCliente;
            documento.codigoTipoDocumentoIdentidad = props.opSeleccionada.codigoTipoDocumentoIdentidad;
            documento.tipoDocumentoIdentidad = props.opSeleccionada.tipoDocumentoIdentidad;
            documento.numeroIdentidad = props.opSeleccionada.numeroIdentidad;
            documento.razonSocialNombre = props.opSeleccionada.razonSocialNombreCliente;

            //TIPO DE DOCUMENTO -> ORDEN DE PRODUCCION
            const numeroDocumentos = documento.documentosAdjuntos.length;
            //borra todos los elementos del array
            documento.documentosAdjuntos.splice(0, numeroDocumentos);
            //inserta el elemento / documento en el array
            documento.documentosAdjuntos.push({
              codigoTCP: '00',
              descripcionTCP: 'Otros',
              fecha: props.opSeleccionada.fechaInicio,
              idAuxiliar: elIdAuxiliar(),
              numero: props.opSeleccionada.numero,
              serie: props.opSeleccionada.serie,
            });

            //INSERTAR MERCADERIA
            const numeroMercaderias = documento.itemsMercaderias.length;
            //borra todos los elementos del array
            documento.itemsMercaderias.splice(0, numeroMercaderias);
            //inserta los elementos / mercaderias en el array
            for (const reingresoLocali of misReingresos.value) {
              const rein = reingresoLocali.aReingresar.$numberDecimal ? reingresoLocali.aReingresar.$numberDecimal : reingresoLocali.aReingresar;

              //console.log('rein', rein);
              if (rein > 0) {
                let IGVCalculado = 0;
                //console.log('reingresoLocali.igv', reingresoLocali.igv, reingresoLocali.igv.$numberDecimal);
                const elIGV = reingresoLocali.igv.$numberDecimal ? reingresoLocali.igv.$numberDecimal : reingresoLocali.igv;
                if (elIGV === 0) {
                  IGVCalculado = 0;
                } else {
                  IGVCalculado = 1 + elIGV / 100;
                }
                let costo = 0;
                if (reingresoLocali.tipoEquivalencia) {
                  costo = reingresoLocali.costoUnitarioPEN.$numberDecimal / reingresoLocali.factor;
                } else {
                  costo = reingresoLocali.costoUnitarioPEN.$numberDecimal * reingresoLocali.factor;
                }
                //console.log('IGVCalculado -- costo', IGVCalculado, costo);
                documento.itemsMercaderias.push({
                  idAuxiliar: reingresoLocali.idAuxiliar, //parseInt(elIdAuxiliar()),
                  idMercaderia: reingresoLocali.idMercaderia,
                  idEquivalencia: reingresoLocali.idEquivalencia,
                  idKardex: reingresoLocali.idKardex,
                  idItem: reingresoLocali._id,
                  item: 0,

                  IGV: reingresoLocali.igv,

                  codigo: reingresoLocali.codigo ? reingresoLocali.codigo : '-',

                  descripcion: reingresoLocali.descripcion,
                  descripcionEquivalencia: reingresoLocali.descripcionEquivalencia,

                  cantidadIngresada: rein * reingresoLocali.laEquivalencia.$numberDecimal,
                  cantidadIngresadaEquivalencia: rein,

                  unidad: reingresoLocali.unidad,
                  unidadEquivalencia: reingresoLocali.unidadEquivalencia,
                  ////////////////////////////////////////////////////////////////////////////
                  costoUnitarioPEN: costo,
                  costoUnitarioEquivalenciaPEN: reingresoLocali.costoUnitarioPEN,
                  //sub = k * c
                  subPEN: rein * reingresoLocali.laEquivalencia.$numberDecimal * costo,
                  subEquivalenciaPEN: rein * reingresoLocali.costoUnitarioPEN.$numberDecimal,
                  //valor = c + IGV
                  valorUnitarioPEN: costo * IGVCalculado,
                  valorUnitarioEquivalenciaPEN: reingresoLocali.costoUnitarioPEN.$numberDecimal * IGVCalculado,
                  //tot = k * valor
                  totPEN: rein * reingresoLocali.laEquivalencia.$numberDecimal * costo * IGVCalculado,
                  totEquivalenciaPEN: rein * reingresoLocali.costoUnitarioPEN.$numberDecimal * IGVCalculado,

                  tipoEquivalencia: reingresoLocali.tipoEquivalencia,
                  factor: reingresoLocali.factor,
                  laEquivalencia: reingresoLocali.laEquivalencia.$numberDecimal,
                });
              }
            }

            documento.reingreso = true;

            ctx.mostrarPanelReingresoRequisiciones = false;
            ctx.mostrarPanelBuscarOrdenProduccionAperturado = false;
          }}
        />
      </div>
    </div>
  );
});
