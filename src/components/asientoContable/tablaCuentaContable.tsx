import { Resource, component$, useContext, useResource$ } from '@builder.io/qwik';
import { images } from '~/assets';
import type { ICuentaContable } from '~/interfaces/iPlanContable';
import { CTX_COMPRA, CTX_NEW_EDIT_COMPRA } from '../compra/newEditCompra';
import { elIdAuxiliar } from '~/functions/comunes';
import { CTX_BUSCAR_CUENTA_CONTABLE } from './buscarCuentaContable';
// import { parametrosGlobales } from '~/routes/login';

export default component$((props: { buscarCuentaContable: number; parametrosBusqueda: any; tipoDefault?: boolean; verificarAsientoDestino?: boolean }) => {
  //#region CONTEXTO
  const ctx_buscar_cuenta_contable = useContext(CTX_BUSCAR_CUENTA_CONTABLE);
  const ctx_compra_asiento_contable = useContext(CTX_COMPRA).asientoContable;
  const ctx_new_edit_compra = useContext(CTX_NEW_EDIT_COMPRA);
  //#endregion CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasCuentasContables = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarCuentaContable.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // //console.log('ctx_buscar_persona:::...', ctx_buscar_persona);

    if (props.parametrosBusqueda.buscarPor === 'POR CÓDIGO') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/planContable/buscarXPorCodigo', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
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
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
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
      value={lasCuentasContables}
      onPending={() => {
        // //console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        // //console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(cuentasContables) => {
        //console.log('onResolved 🍓🍓🍓🍓', cuentasContables);
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
                      <th>Destino</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misCuentasContables.map((cuentaContable) => {
                      const { _id, codigo, descripcion, asientoDestino } = cuentaContable;
                      // const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          {/* <td data-label="Ítem">{indexItem}</td> */}
                          <td data-label="Código">{codigo}</td>
                          <td data-label="Descripción">{descripcion}</td>
                          <td data-label="Destino" class="acciones">
                            {typeof asientoDestino !== 'undefined' ? (
                              asientoDestino.length > 0 ? (
                                <input
                                  type="image"
                                  src={images.list}
                                  title="listar asiento destino"
                                  height={14}
                                  width={14}
                                  // onClick$={() => {
                                  //   ctx_buscar_cuenta_contable.cC = cuentaContable;
                                  //   ctx_buscar_cuenta_contable.mostrarPanelNewEditCuentaContable = true;
                                  // }}
                                />
                              ) : (
                                ''
                              )
                            ) : (
                              ''
                            )}
                          </td>
                          <td data-label="Acciones" class="accionesLeft">
                            <input
                              type="image"
                              src={images.check32}
                              title="Seleccionar cuenta contable"
                              height={14}
                              width={14}
                              style={{ marginRight: '4px' }}
                              onClick$={() => {
                                if (props.verificarAsientoDestino) {
                                  if (typeof asientoDestino === 'undefined' || asientoDestino.length === 0) {
                                    alert(`La cuenta contable ( ${codigo} - ${descripcion} ) no presenta asiento destino.`);
                                    return;
                                  }
                                }
                                ctx_compra_asiento_contable.unshift({
                                  idAuxiliar: parseInt(elIdAuxiliar()),
                                  item: 0,
                                  codigo: codigo,
                                  descripcion: descripcion,
                                  tipo: props.tipoDefault,
                                  asientoDestino: asientoDestino,
                                  importe: 0,
                                });
                                ctx_new_edit_compra.mostrarPanelBuscarCuentaContable = false;
                              }}
                            />
                            <input
                              type="image"
                              src={images.edit}
                              title="Editar cuenta contable"
                              height={14}
                              width={14}
                              // style={{ margin: '2px' }}
                              onClick$={() => {
                                ctx_buscar_cuenta_contable.cC = cuentaContable;
                                ctx_buscar_cuenta_contable.mostrarPanelNewEditCuentaContable = true;
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
