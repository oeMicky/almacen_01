import { $, Resource, component$, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import style from '../tabla/tabla.css?inline';
// import { CTX_INDEX_IN_ALMACEN } from '~/routes/(almacen)/inAlmacen';
// import ImgButton from '../system/imgButton';
// import { images } from '~/assets';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { IIngresoAAlmacen } from '~/interfaces/iInAlmacen';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';

export default component$((props: { buscarInAlmacen: number; porFechasT_porPeriodoF: boolean; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  // const ctx_index_in_almacen = useContext(CTX_INDEX_IN_ALMACEN);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losInsAlmacen = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarInAlmacen.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.porFechasT_porPeriodoF) {
      console.log('por Fechas IN');
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
      console.log('por Periodo IN');
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
        const misInsAlmacen: IIngresoAAlmacen[] = data;
        return (
          <>
            {misInsAlmacen.length > 0 ? (
              <>
                <table id="tablaInsAlmacen" style={{ fontSize: '0.6em', fontWeight: 'lighter' }}>
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
                          <td
                            data-label="Acciones"
                            class="acciones"
                            // id="alCentro"
                            // style={window.screen.width > 750 ? { textAlign: 'center' } : { textAlign: 'right' }}
                            // style={window.screen.availWidth > 1500 ? { background: 'red' } : { background: 'blue' }}
                            // style={
                            //   window.matchMedia('(max-width: 700px)').matches
                            //     ? { background: 'red', borderRadius: '16px' }
                            //     : { background: 'pink', borderRadius: '6px' }
                            // }
                            // style={{ textAlign: 'right' }}
                          >
                            <ImgButton
                              src={images.see}
                              alt="icono de ver"
                              height={14}
                              width={14}
                              title="Ver ingreso a almacén"
                              // onClick={$(() => {
                              //   ctx_index_in_almacen.ordSerSe = inAlmaLocali;
                              //   ctx_index_in_almacen.mostrarAddOrderServicio0 = true;
                              // })}
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
