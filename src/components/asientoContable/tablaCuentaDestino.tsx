import { Resource, component$, useContext, useResource$ } from '@builder.io/qwik';
import { images } from '~/assets';
import type { ICuentaContable } from '~/interfaces/iPlanContable';
// import { CTX_COMPRA, CTX_NEW_EDIT_COMPRA } from '../compra/newEditCompra';
import { elIdAuxiliar } from '~/functions/comunes';
// import { CTX_BUSCAR_CUENTA_CONTABLE } from './buscarCuentaContable';
import { CTX_CUENTA_CONTABLE, CTX_NEW_EDIT_CUENTA_CONTABLE } from './newEditCuentaContable';
// import { parametrosGlobales } from '~/routes/login';

export default component$(
  (props: { buscarCuentaDestino: number; parametrosBusqueda: any; tipoDefault?: boolean; verificarAsientoDestino?: boolean }) => {
    //#region CONTEXTO
    const ctx_cuenta_contable_asientoDestino = useContext(CTX_CUENTA_CONTABLE).asientoDestino;
    const ctx_new_edit_cuenta_contable = useContext(CTX_NEW_EDIT_CUENTA_CONTABLE);
    // const ctx_buscar_cuenta_contable = useContext(CTX_BUSCAR_CUENTA_CONTABLE);
    // const ctx_compra_asiento_contable = useContext(CTX_COMPRA).asientoContable;
    // const ctx_new_edit_compra = useContext(CTX_NEW_EDIT_COMPRA);
    //#endregion CONTEXTO

    //#region BUSCANDO REGISTROS
    const lasCuentasDestino = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.buscarCuentaDestino.valueOf());

      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      if (props.parametrosBusqueda.buscarPor === 'POR CÓDIGO') {
        const res = await fetch(import.meta.env.VITE_URL + '/api/planContable/buscarXPorCodigo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idPlanContable: props.parametrosBusqueda.idPlanContable,
            cadenaABuscar: props.parametrosBusqueda.cadenaABuscar,
          }),
          signal: abortController.signal,
        });
        return res.json();
      }
      if (props.parametrosBusqueda.buscarPor === 'POR DESCRIPCIÓN') {
        const res = await fetch(import.meta.env.VITE_URL + '/api/planContable/buscarXPorDescripcion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idPlanContable: props.parametrosBusqueda.idPlanContable,
            cadenaABuscar: props.parametrosBusqueda.cadenaABuscar,
          }),
          signal: abortController.signal,
        });
        return res.json();
      }
    });
    //#endregion BUSCANDO REGISTROS
    return (
      <Resource
        value={lasCuentasDestino}
        onPending={() => {
          // console.log('onPending 🍉🍉🍉🍉');
          return <div>Cargando...</div>;
        }}
        onRejected={() => {
          // console.log('onRejected 🍍🍍🍍🍍');
          return <div>Fallo en la carga de datos</div>;
        }}
        onResolved={(cuentasContables) => {
          // console.log('onResolved 🍓🍓🍓🍓', personas);
          const { data } = cuentasContables; //{ status, data, message }
          const misCuentasContables: ICuentaContable[] = data;
          return (
            <>
              {misCuentasContables.length > 0 ? (
                <>
                  <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        {/* <th>Ítem</th> */}
                        <th>Código</th>
                        <th>Descripción</th>
                        {/* <th>Destino</th> */}
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misCuentasContables.map((cuentaContable) => {
                        const { _id, codigo, descripcion } = cuentaContable;
                        // const indexItem = index + 1;
                        return (
                          <tr key={_id}>
                            {/* <td data-label="Ítem">{indexItem}</td> */}
                            <td data-label="Código">{codigo}</td>
                            <td data-label="Descripción">{descripcion}</td>
                            {/* <td data-label="Destino">
                              {typeof asientoDestino !== 'undefined' ? (asientoDestino.length > 0 ? images.list : '') : ''}
                            </td> */}
                            <td data-label="Acciones" class="accionesLeft">
                              <input
                                type="image"
                                src={images.check32}
                                title="Seleccionar cuenta contable"
                                height={14}
                                width={14}
                                style={{ marginRight: '4px' }}
                                onClick$={() => {
                                  // if (props.verificarAsientoDestino) {
                                  // }
                                  ctx_cuenta_contable_asientoDestino.push({
                                    idAuxiliar: parseInt(elIdAuxiliar()),
                                    item: 0,
                                    codigo: codigo,
                                    descripcion: descripcion,
                                    tipo: props.tipoDefault,
                                    porcentaje: 0,
                                  });
                                  ctx_new_edit_cuenta_contable.mostrarPanelBuscarCuentaDestino = false;
                                }}
                              />
                              <input
                                type="image"
                                src={images.edit}
                                title="Editar cuenta contable"
                                height={14}
                                width={14}
                                // onClick$={() => {
                                //   ctx_buscar_cuenta_contable.cC = cuentaContable;
                                //   ctx_buscar_cuenta_contable.mostrarPanelNewEditCuentaContable = true;
                                // }}
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
  }
);
