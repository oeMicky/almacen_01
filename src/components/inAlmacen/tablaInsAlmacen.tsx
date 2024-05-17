import { Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import style from '../tabla/tabla.css?inline';
import { CTX_INDEX_IN_ALMACEN } from '~/routes/(inventario)/inAlmacen';
// import ImgButton from '../system/imgButton';
// import { images } from '~/assets';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
import type { IIngresoAAlmacen } from '~/interfaces/iInAlmacen';
import { images } from '~/assets';
// import ImgButton from '../system/imgButton';
// import { images } from '~/assets';

export default component$((props: { buscarInAlmacen: number; porFechasT_porPeriodoF: boolean; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  const ctx_index_in_almacen = useContext(CTX_INDEX_IN_ALMACEN);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losInsAlmacen = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarInAlmacen.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //

    if (props.porFechasT_porPeriodoF) {
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
    } else {
      //
      const res = await fetch(import.meta.env.VITE_URL + '/api/ingresosAAlmacen/buscarIngresosAAlmacenPorPeriodo', {
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
        const misInsAlmacen: IIngresoAAlmacen[] = data;
        ctx_index_in_almacen.mostrarSpinner = false;
        return (
          <>
            {misInsAlmacen.length > 0 ? (
              <>
                <table id="tablaInsAlmacen" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
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
                    {misInsAlmacen.map((inAlmaLocali) => {
                      const {
                        _id,
                        periodo,
                        FISMA,
                        motivoIngresoAlmacen,
                        tipoDocumentoIdentidad,
                        numeroIdentidad,
                        razonSocialNombre,
                      } = inAlmaLocali;
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
                            {motivoIngresoAlmacen ? motivoIngresoAlmacen : '_'}
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
                              height={14}
                              width={14}
                              title="Ver ingreso a almacén"
                              onClick$={() => {
                                ctx_index_in_almacen.iNS = inAlmaLocali;
                                ctx_index_in_almacen.mostrarPanelNewInAlmacen = true;
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
