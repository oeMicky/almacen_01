import { Resource, component$, useContext, useResource$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_BUSCAR_VENTA_DESPACHADA_REINGRESO } from './buscarVentaDespachadaReingreso';
import type { INotaSalidaReingreso } from '~/interfaces/iOutAlmacen';

export default component$((props: { buscarVentaDespachadaReingreso: number; parametrosBusqueda: any }) => {
  //#region CONTEXTO
  const ctx_buscar_venta_despachada_reingreso = useContext(CTX_BUSCAR_VENTA_DESPACHADA_REINGRESO);
  //#endregion CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasVentasDespachadas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarVentaDespachadaReingreso.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.parametrosBusqueda.PorDestinatario_EntreFechas === 'Entre fechas') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/egresosDeAlmacen/getVentaDespachadaReingresoEntreFechas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.PorDestinatario_EntreFechas === 'Por destinatario') {
      if (props.parametrosBusqueda.PorNombre_RUCDNI === 'DNI / RUC') {
        const res = await fetch(
          import.meta.env.VITE_URL + '/api/egresosDeAlmacen/getVentaDespachadaReingresoPorDestinatarioPorRUCDNI',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(props.parametrosBusqueda),
            signal: abortController.signal,
          }
        );
        return res.json();
      }
      if (props.parametrosBusqueda.PorNombre_RUCDNI === 'Nombre / Razón social') {
        const res = await fetch(import.meta.env.VITE_URL + '/api/egresosDeAlmacen/getVentaDespachadaReingresoPorDestinatario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(props.parametrosBusqueda),
          signal: abortController.signal,
        });
        return res.json();
      }
    }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={lasVentasDespachadas}
      onPending={() => {
        console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ventasDespachadas) => {
        console.log('onResolved 🍓🍓🍓🍓', ventasDespachadas);
        const { data } = ventasDespachadas; //{ status, data, message }
        const misVentasDespachadas: INotaSalidaReingreso[] = data;
        return (
          <>
            {misVentasDespachadas.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8em', fontWeight: 'lighter ' }}>
                  <thead>
                    <tr>
                      <th>Nota de salida</th>
                      <th>Fecha salida</th>
                      <th>Destinatario</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misVentasDespachadas.map((venDespaLocali) => {
                      // const { _id,  razonSocialNombre,  documentosAdjuntos, itemsMercaderias } = notaSaliLocali;
                      const { _id, FISMA, razonSocialNombre, serie, numero } = venDespaLocali;
                      return (
                        <tr key={_id}>
                          <td data-label="Nota de salida" class="comoCadena">
                            {serie + ' - ' + cerosALaIzquierda(numero, 8)}
                          </td>
                          <td data-label="Fecha salida" class="comoCadena">
                            {formatoDDMMYYYY_PEN(FISMA)}
                          </td>
                          <td data-label="Destinatario" class="comoCadena">
                            {razonSocialNombre}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              type="image"
                              src={images.check32}
                              title="Seleccionar venta despachada"
                              alt="incono buscar"
                              height={14}
                              width={14}
                              onClick$={() => {
                                ctx_buscar_venta_despachada_reingreso.vV = venDespaLocali;
                                ctx_buscar_venta_despachada_reingreso.mostrarPanelVentaDespachadaReingreso = true;
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
  );
});
