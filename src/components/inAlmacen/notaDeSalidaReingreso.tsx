import { $, Resource, component$, useContext, useResource$, useSignal } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_IN_ALMACEN, CTX_NEW_IN_ALMACEN } from './newInAlmacen';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_BUSCAR_NOTA_SALIDA_REINGRESO } from './buscarNotaDeSalidaReingreso';

export default component$((props: { nsSeleccionada: any }) => {
  //#region CONTEXTO
  const ctx_buscar_nota_salida_reingreso = useContext(CTX_BUSCAR_NOTA_SALIDA_REINGRESO);
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

    console.log('parametrosBusqueda losReingresos', props.nsSeleccionada._id);

    const res = await fetch(import.meta.env.VITE_URL + '/api/egresosDeAlmacen/getItemsMercaderias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(props.parametrosBusqueda),
      body: JSON.stringify({ idEgresoDeAlmacen: props.nsSeleccionada._id }),
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
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_buscar_nota_salida_reingreso.mostrarPanelNotaDeSalidaReingreso = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3>Reingreso de nota de salida</h3>
        {/* CLIENTE */}
        <div style={{ fontSize: '0.8rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', margin: '4px 0' }}>
            ID:<b>{` ${props.nsSeleccionada._id} `}</b>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', margin: '4px 0' }}>
            NOTA SALIDA:
            <b>{` ${props.nsSeleccionada.serie + ' - ' + cerosALaIzquierda(props.nsSeleccionada.numero, 8)} `}</b>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', margin: '4px 0' }}>
            Destinatario:<b>{` ${props.nsSeleccionada.razonSocialNombre}`}</b>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '96px 1fr', margin: '4px 0' }}>
            FISMA:<b>{` ${formatoDDMMYYYY_PEN(props.nsSeleccionada.FISMA)} `}</b>
          </div>
          <br />
        </div>
        {/* TABLA DE ITEMS - MERCADERIAS */}
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
            onResolved={(notasSalida) => {
              console.log('onResolved 🍓🍓🍓🍓', notasSalida);
              const { data } = notasSalida; //{ status, data, message }
              // const misDespachos: IOrdenServicio_DespachoRequisicion[] = data;
              misReingresos.value = data;
              return (
                <>
                  {misReingresos.value.length > 0 ? (
                    <>
                      <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                        <thead>
                          <tr>
                            <th>Ítem</th>
                            {/* <th>Kx</th> */}
                            <th>Código</th>
                            <th>Descripción Equi</th>
                            {/*  <th>Stock Equi</th>*/}
                            <th>Uni</th>
                            {/* <th>Cant.</th> */}
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
                                {/* <td data-label="Kx">{reingresoLocali.idKardex.substring(reingresoLocali.idKardex.length - 6)}</td> */}
                                <td data-label="Código">{reingresoLocali.codigo}</td>
                                <td data-label="Descripción Equi">{reingresoLocali.descripcionEquivalencia}</td>

                                <td data-label="Uni">{reingresoLocali.unidadEquivalencia}</td>

                                <td data-label="Cant Despachada">
                                  {reingresoLocali.cantidadSacadaEquivalencia.$numberDecimal
                                    ? reingresoLocali.cantidadSacadaEquivalencia.$numberDecimal
                                    : reingresoLocali.cantidadSacadaEquivalencia}
                                </td>
                                <td data-label="Cant Reingresada">
                                  {reingresoLocali.cantidadReingresada.$numberDecimal
                                    ? reingresoLocali.cantidadReingresada.$numberDecimal
                                    : reingresoLocali.cantidadReingresada}
                                </td>
                                <td data-label="Cant A Reingresar" style={{ textAlign: 'end' }}>
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
                      <i style={{ fontSize: '0.8rem' }}>No se encontraron registros</i>
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
        {/*  ----- REINGRESAR ----- */}
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
                reingresoLocali.cantidadSacadaEquivalencia.$numberDecimal
                  ? reingresoLocali.cantidadSacadaEquivalencia.$numberDecimal
                  : reingresoLocali.cantidadSacadaEquivalencia
              );

              const Reingresada = parseFloat(
                reingresoLocali.cantidadReingresada.$numberDecimal
                  ? reingresoLocali.cantidadReingresada.$numberDecimal
                  : reingresoLocali.cantidadReingresada
              );

              const aReingre = parseFloat(
                reingresoLocali.aReingresar.$numberDecimal
                  ? reingresoLocali.aReingresar.$numberDecimal
                  : reingresoLocali.aReingresar
              );

              console.log('despa <=> reingre + Reingresada', despa, aReingre, Reingresada);
              if (aReingre + Reingresada > despa) {
                alert(
                  `ATENCIÓN: Se intenta reingresar una cantidad mayor a la despachada. La cantidad despachada ( ${despa} ) es menor a la cantidad a reingresar ( ${aReingre} ) más la ya reingresada ( ${Reingresada} ), y se encuetra en la posición # ${i}`
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

            //ID DE LA NOTA DE SALIDA
            documento.idDocumento = props.nsSeleccionada._id;

            //DESTINATARIO
            documento.idRemitente = props.nsSeleccionada.idDestinatario;
            documento.codigoTipoDocumentoIdentidad = props.nsSeleccionada.codigoTipoDocumentoIdentidad;
            documento.tipoDocumentoIdentidad = props.nsSeleccionada.tipoDocumentoIdentidad;
            documento.numeroIdentidad = props.nsSeleccionada.numeroIdentidad;
            documento.razonSocialNombre = props.nsSeleccionada.razonSocialNombre;

            //TIPO DE DOCUMENTO -> NOTA DE SALIDA
            const numeroDocumentos = documento.documentosAdjuntos.length;
            //borra todos los elementos del array
            documento.documentosAdjuntos.splice(0, numeroDocumentos);
            //inserta el elemento / documento en el array
            documento.documentosAdjuntos.push({
              codigoTCP: props.nsSeleccionada.codigoTCP,
              descripcionTCP: props.nsSeleccionada.descripcionTCP,
              fecha: props.nsSeleccionada.fecha.substring(0, 10),
              idAuxiliar: props.nsSeleccionada.idAuxiliar,
              numero: props.nsSeleccionada.numero,
              serie: props.nsSeleccionada.serie,
            });

            // //INSERTAR MERCADERIA
            const numeroMercaderias = documento.itemsMercaderias.length;
            //borra todos los elementos del array
            documento.itemsMercaderias.splice(0, numeroMercaderias);
            //inserta los elementos / mercaderias en el array
            for (const reingresoLocali of misReingresos.value) {
              const aRein = reingresoLocali.aReingresar.$numberDecimal
                ? reingresoLocali.aReingresar.$numberDecimal
                : reingresoLocali.aReingresar;

              console.log('aRein', aRein);
              if (aRein > 0) {
                const Reingresada = reingresoLocali.cantidadReingresada.$numberDecimal
                  ? reingresoLocali.cantidadReingresada.$numberDecimal
                  : reingresoLocali.cantidadReingresada;
                console.log('Reingresada', Reingresada);

                // let IGVCalculado = 0;
                const IGVCalculado = 0;
                // if (reingresoLocali.igv === 0) {
                //   IGVCalculado = 0;
                // } else {
                //   IGVCalculado = 1 + reingresoLocali.igv / 100;
                // }
                // let costo = 0;
                // if (reingresoLocali.tipoEquivalencia) {
                //   costo = reingresoLocali.costoUnitarioPEN.$numberDecimal / reingresoLocali.factor;
                // } else {
                //   costo = reingresoLocali.costoUnitarioPEN.$numberDecimal * reingresoLocali.factor;
                // }
                console.log('pre push reingresoLocali', reingresoLocali);
                documento.itemsMercaderias.push({
                  idAuxiliar: reingresoLocali.idAuxiliar, //parseInt(elIdAuxiliar()),
                  idMercaderia: reingresoLocali.idMercaderia,
                  idEquivalencia: reingresoLocali.idEquivalencia,
                  idKardex: reingresoLocali.idKardex,
                  idItem: reingresoLocali.idItem,
                  item: 0,

                  IGV: IGVCalculado, //reingresoLocali.igv,

                  codigo: reingresoLocali.codigo ? reingresoLocali.codigo : '_',

                  descripcion: reingresoLocali.descripcion,
                  descripcionEquivalencia: reingresoLocali.descripcionEquivalencia,

                  cantidadIngresada: aRein * reingresoLocali.laEquivalencia.$numberDecimal,
                  cantidadIngresadaEquivalencia: aRein,

                  unidad: reingresoLocali.unidad,
                  unidadEquivalencia: reingresoLocali.unidadEquivalencia,
                  ////////////////////////////////////////////////////////////////////////////
                  costoUnitarioPEN: reingresoLocali.costoUnitarioPEN.$numberDecimal,
                  costoUnitarioEquivalenciaPEN: reingresoLocali.costoUnitarioEquivalenciaPEN.$numberDecimal,
                  //sub = k * c
                  subPEN: aRein * reingresoLocali.laEquivalencia.$numberDecimal * reingresoLocali.costoUnitarioPEN.$numberDecimal,
                  subEquivalenciaPEN: aRein * reingresoLocali.costoUnitarioEquivalenciaPEN.$numberDecimal,
                  //valor = c + IGV = c
                  valorUnitarioPEN: reingresoLocali.costoUnitarioPEN.$numberDecimal,
                  valorUnitarioEquivalenciaPEN: reingresoLocali.costoUnitarioEquivalenciaPEN.$numberDecimal,
                  //tot = k * valor
                  totPEN: aRein * reingresoLocali.laEquivalencia.$numberDecimal * reingresoLocali.costoUnitarioPEN.$numberDecimal,
                  totEquivalenciaPEN: aRein * reingresoLocali.costoUnitarioEquivalenciaPEN.$numberDecimal,

                  tipoEquivalencia: reingresoLocali.tipoEquivalencia,
                  factor: reingresoLocali.factor,
                  laEquivalencia: reingresoLocali.laEquivalencia.$numberDecimal,
                });
              }
            }

            documento.reingreso = true;

            // ctx.mostrarPanelReingresoRequisiciones = false;
            // ctx.mostrarPanelBuscarOrdenServicioAperturado = false;

            ctx_buscar_nota_salida_reingreso.mostrarPanelNotaDeSalidaReingreso = false;
            ctx.mostrarPanelBuscarNotaDeSalidaReingreso = false;
          }}
        />
      </div>
    </div>
  );
});
