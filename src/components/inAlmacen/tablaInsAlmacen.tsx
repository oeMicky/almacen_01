import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import style from '../tabla/tabla.css?inline';
import { CTX_INDEX_IN_ALMACEN } from '~/routes/(inventario)/inAlmacen';
// import ImgButton from '../system/imgButton';
// import { images } from '~/assets';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import type { IIngresoAAlmacen } from '~/interfaces/iInAlmacen';
import { images } from '~/assets';
import { parametrosGlobales } from '~/routes/login';
// import ImgButton from '../system/imgButton';
// import { images } from '~/assets';

export default component$((props: { buscarInAlmacen: number; porFechasT_porPeriodoF?: boolean; parametrosBusqueda: any }) => {
  useStyles$(style);

  //#region CONTEXTOS
  const ctx_index_in_almacen = useContext(CTX_INDEX_IN_ALMACEN);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losInsAlmacen = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarInAlmacen.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //

    // if (props.porFechasT_porPeriodoF) {
    //
    const res = await fetch(import.meta.env.VITE_URL + '/api/ingresosAAlmacen/obtenerIngresosAAlmacenEntreFechas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.parametrosBusqueda),
      signal: abortController.signal,
    });
    return res.json();
    // } else {
    //   //
    //   const res = await fetch(import.meta.env.VITE_URL + '/api/ingresosAAlmacen/buscarIngresosAAlmacenPorPeriodo', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(props.parametrosBusqueda),
    //     signal: abortController.signal,
    //   });
    //   return res.json();
    // }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={losInsAlmacen}
      onPending={() => {
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        ctx_index_in_almacen.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ordenesServicio) => {
        const { data } = ordenesServicio; //{ status, data, message }
        console.log('data', data);

        const misInsAlmacen: IIngresoAAlmacen[] = data;
        ctx_index_in_almacen.mostrarSpinner = false;
        return (
          <>
            {misInsAlmacen.length > 0 ? (
              <>
                <table id="tablaInsAlmacen" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      {/* <th>ID</th> */}
                      <th>Respon</th>
                      <th>FISMA</th>
                      <th>Motivo</th>
                      <th>Doc</th>
                      <th>Razón social</th>
                      <th>Obs</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misInsAlmacen.map((inAlmaLocali, index) => {
                      const { _id, usuarioCrea, FISMA, observacion, motivoIngresoAlmacen, tipoDocumentoIdentidad, numeroIdentidad, razonSocialNombre } =
                        inAlmaLocali;
                      // const { _id, usuarioCrea, FISMA } = inAlmaLocali;
                      const indexItem = index + 1; //, index
                      return (
                        <tr key={_id}>
                          <td data-label="Ítem">{cerosALaIzquierda(indexItem, 3)}</td>
                          {/* <td data-label="ID">{_id}</td> */}
                          <td data-label="Respon">{usuarioCrea.substring(0, 10)}</td>
                          <td data-label="FISMA">{FISMA ? formatoDDMMYYYY_PEN(FISMA) : '-'}</td>
                          <td data-label="Motivo">{motivoIngresoAlmacen ? motivoIngresoAlmacen : '-'}</td>
                          <td data-label="Doc">{numeroIdentidad ? tipoDocumentoIdentidad + ': ' + numeroIdentidad : '-'}</td>
                          <td data-label="Razón social">{razonSocialNombre ? razonSocialNombre : '-'}</td>
                          <td data-label="Obs">{observacion ? observacion : '-'}</td>
                          <td data-label="Acciones" class="accionesLeft">
                            <input
                              type="image"
                              src={images.see}
                              alt="icono de ver"
                              height={14}
                              width={14}
                              title="Ver ingreso a almacén"
                              onClick$={() => {
                                console.log('el INGRESO...', inAlmaLocali);

                                ctx_index_in_almacen.iNS = inAlmaLocali;
                                ctx_index_in_almacen.itemIndex = indexItem;
                                ctx_index_in_almacen.mostrarPanelVerInAlmacen = true;
                              }}
                            />
                            <input
                              type="image"
                              src={images.trash}
                              alt="icono de ver"
                              hidden={parametrosGlobales.almaceneroBajo || parametrosGlobales.almaceneroMedio}
                              height={14}
                              width={14}
                              style={{ marginLeft: '6px' }}
                              title="Ver ingreso a almacén"
                              onClick$={() => {
                                console.log('el ELIMINAR EL INGRESO...', _id, inAlmaLocali);

                                ctx_index_in_almacen.seleccionadoINALMACEN.idINALMACEN = _id;
                                ctx_index_in_almacen.seleccionadoINALMACEN.fecha = FISMA;
                                ctx_index_in_almacen.seleccionadoINALMACEN.descripcion = usuarioCrea.substring(0, 10);
                                // ctx_index_in_almacen.itemIndex = indexItem;
                                ctx_index_in_almacen.mostrarPanelDeleteINALMACEN = true;
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
