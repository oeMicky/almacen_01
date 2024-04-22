import { Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
import style from '../tabla/tabla.css?inline';
import { CTX_INDEX_OUT_ALMACEN } from '~/routes/(almacen)/outAlmacen';
import type { IEgresoDeAlmacen } from '~/interfaces/iOutAlmacen';
import { images } from '~/assets';

export default component$((props: { buscarOUTAlmacen: number; porFechasT_porPeriodoF: boolean; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  const ctx_index_out_almacen = useContext(CTX_INDEX_OUT_ALMACEN);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losOutsAlmacen = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarOUTAlmacen.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.porFechasT_porPeriodoF) {
      // console.log('por Fechas OUT');
      const res = await fetch(import.meta.env.VITE_URL + '/api/egresosDeAlmacen/obtenerEgresosDeAlmacenEntreFechas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    } else {
      // console.log('por Periodo OUT');
      const res = await fetch(import.meta.env.VITE_URL + '/api/egresosDeAlmacen/buscarEgresosDeAlmacenPorPeriodo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={losOutsAlmacen}
      onPending={() => {
        console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log('onRejected 🍍🍍🍍🍍');
        ctx_index_out_almacen.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(egresosAlmacen) => {
        console.log('onResolved 🍓🍓🍓🍓');
        const { data } = egresosAlmacen; //{ status, data, message }
        const misOutsAlmacen: IEgresoDeAlmacen[] = data;
        ctx_index_out_almacen.mostrarSpinner = false;
        return (
          <>
            {misOutsAlmacen.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      {/* <th>Ítem</th> */}
                      <th>Periodo</th>
                      <th>FISMA</th>
                      <th>Motivo</th>
                      <th>Doc</th>
                      <th>Razón social</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misOutsAlmacen.map((outAlmaLocali) => {
                      const {
                        _id,
                        periodo,
                        FISMA,
                        motivoEgresoAlmacen,
                        numeroIdentidad,
                        tipoDocumentoIdentidad,
                        razonSocialNombre,
                      } = outAlmaLocali;
                      // const indexItem = index + 1; , index
                      return (
                        <tr key={_id}>
                          {/* <td data-label="Ítem">{indexItem}</td> */}
                          <td data-label="Periodo" class="comoCadena">
                            {periodo}
                          </td>
                          <td data-label="FISMA" class="comoCadena">
                            {FISMA ? formatoDDMMYYYY_PEN(FISMA) : '_'}
                          </td>
                          <td data-label="Motivo" class="comoCadena">
                            {motivoEgresoAlmacen ? motivoEgresoAlmacen : '_'}
                          </td>
                          <td data-label="Doc" class="comoCadena">
                            {numeroIdentidad ? tipoDocumentoIdentidad + ': ' + numeroIdentidad : '_'}
                          </td>
                          <td data-label="Razón social" class="comoCadena">
                            {razonSocialNombre ? razonSocialNombre : '_'}
                          </td>
                          {/* <td data-label="Precio">{precio.$numberDecimal ? precio.$numberDecimal : '_'}</td> */}
                          <td data-label="Acciones" class="acciones">
                            <input
                              type="image"
                              src={images.see}
                              alt="icono de ver"
                              height={12}
                              width={12}
                              title="Ver egreso"
                              onClick$={() => {
                                ctx_index_out_almacen.oNS = outAlmaLocali;
                                ctx_index_out_almacen.mostrarPanelNewOutAlmacen = true;
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
