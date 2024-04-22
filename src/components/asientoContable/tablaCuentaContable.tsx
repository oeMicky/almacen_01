import { Resource, component$, useContext, useResource$ } from '@builder.io/qwik';
import { images } from '~/assets';
import type { ICuentaContable } from '~/interfaces/iPlanContable';
import { CTX_COMPRA, CTX_NEW_EDIT_COMPRA } from '../compra/newEditCompra';
import { elIdAuxiliar } from '~/functions/comunes';
// import { parametrosGlobales } from '~/routes/login';

export default component$((props: { buscarCuentaContable: number; parametrosBusqueda: any; tipoDefault?: boolean }) => {
  //#region CONTEXTO
  const ctx_compra_asiento = useContext(CTX_COMPRA).asientoContable;
  const ctx_new_edit_compra = useContext(CTX_NEW_EDIT_COMPRA);
  //#endregion CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasCuentasContables = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarCuentaContable.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // console.log('ctx_buscar_persona:::...', ctx_buscar_persona);

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
                      <th>Ítem</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misCuentasContables.map((cuentaContable, index) => {
                      const { _id, codigo, descripcion } = cuentaContable;
                      const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Código">{codigo}</td>
                          <td data-label="Descripción">{descripcion}</td>
                          <td data-label="Acciones" class="accionesLeft">
                            <input
                              type="image"
                              src={images.check32}
                              title="Seleccionar cuenta contable"
                              height={14}
                              width={14}
                              style={{ margin: '4px' }}
                              onClick$={() => {
                                ctx_compra_asiento.unshift({
                                  idAuxiliar: parseInt(elIdAuxiliar()),
                                  item: 0,
                                  codigo: codigo,
                                  descripcion: descripcion,
                                  tipo: props.tipoDefault,
                                  importe: 0,
                                });
                                ctx_new_edit_compra.mostrarPanelBuscarCuentaContable = false;

                                // if (props.contexto === 'new_out_almacen' && props.rol === 'cliente') {
                                //   ctx_buscar_persona.pP = persoLocali;
                                //   ctx.mostrarPanelVentasCliente = true;
                                // } else {
                                //   ctx_rol._id = _id;
                                //   ctx_rol.codigoTipoDocumentoIdentidad = codigoTipoDocumentoIdentidad;
                                //   ctx_rol.tipoDocumentoIdentidad = tipoDocumentoIdentidad;
                                //   ctx_rol.numeroIdentidad = numeroIdentidad;
                                //   ctx_rol.razonSocialNombre = razonSocialNombre;

                                //   ctx.mostrarPanelBuscarPersona = false;
                                //   ctx.idPersona = _id;
                                //   ctx.conceptoABuscar = numeroIdentidad;
                                //   ctx.rol_Persona = props.rol;
                                //   ctx.selecciono_Persona = true;
                                // }
                              }}
                            />
                            {/* <input
                              type="image"
                              src={images.edit}
                              title="Editar persona"
                              height={14}
                              width={14}
                              // style={{ margin: '2px' }}
                              // onClick$={() => {
                              //   ctx_buscar_persona.pP = persoLocali;
                              //   ctx_buscar_persona.mostrarPanelNewEditPersona = true;

                              //   console.log('ctx', ctx);
                              //   console.log('selecion', persoLocali);
                              // }}
                            /> */}
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
