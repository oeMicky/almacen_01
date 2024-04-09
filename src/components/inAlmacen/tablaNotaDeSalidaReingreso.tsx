import { Resource, component$, useContext, useResource$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import type { INotaSalidaReingreso } from '~/interfaces/iOutAlmacen';
import { CTX_BUSCAR_NOTA_SALIDA_REINGRESO } from './buscarNotaDeSalidaReingreso';

export default component$((props: { buscarNotasDeSalidaReingreso: number; parametrosBusqueda: any }) => {
  //#region CONTEXTO
  const ctx_buscar_nota_salida_reingreso = useContext(CTX_BUSCAR_NOTA_SALIDA_REINGRESO);
  //#endregion CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasNotasDeSalida = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarNotasDeSalidaReingreso.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.parametrosBusqueda.BuscarPor === 'Por destinatario') {
      if (props.parametrosBusqueda.PorNombre_RUCDNI === 'DNI / RUC') {
        const res = await fetch(
          import.meta.env.VITE_URL + '/api/egresosDeAlmacen/getNotasDeSalidaReingresoPorDestinatarioPorRUCDNI',
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
        const res = await fetch(import.meta.env.VITE_URL + '/api/egresosDeAlmacen/getNotasDeSalidaReingresoPorDestinatario', {
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
    if (props.parametrosBusqueda.BuscarPor === 'Entre fechas') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/egresosDeAlmacen/getNotasDeSalidaReingresoEntreFechas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.BuscarPor === 'Por número') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/egresosDeAlmacen/getNotasDeSalidaReingresoPorNumero', {
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
      value={lasNotasDeSalida}
      onPending={() => {
        console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(notasDeSalida) => {
        console.log('onResolved 🍓🍓🍓🍓', notasDeSalida);
        const { data } = notasDeSalida; //{ status, data, message }
        const misNotasDeSalida: INotaSalidaReingreso[] = data;
        return (
          <>
            {misNotasDeSalida.length > 0 ? (
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
                    {misNotasDeSalida.map((notaSaliLocali) => {
                      // const { _id,  razonSocialNombre,  documentosAdjuntos, itemsMercaderias } = notaSaliLocali;
                      const { _id, FISMA, razonSocialNombre, serie, numero } = notaSaliLocali;
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
                              title="Seleccionar nota de salida"
                              alt="incono buscar"
                              height={14}
                              width={14}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                ctx_buscar_nota_salida_reingreso.nS = notaSaliLocali;
                                ctx_buscar_nota_salida_reingreso.mostrarPanelNotaDeSalidaReingreso = true;
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
