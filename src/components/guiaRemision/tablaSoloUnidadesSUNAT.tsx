import { Resource, component$, useContext, useResource$ } from '@builder.io/qwik';
import { images } from '~/assets';
import type { IUnidadSUNAT } from '~/interfaces/iUnidadSUNAT';
import { CTX_NEW_EDIT_REGISTRO_BIEN_GR } from './newEditRegistroBienGR';
import { inUnidadBienGR } from '~/apis/guiaRemision.api';
import { parametrosGlobales } from '~/routes/login';

export default component$((props: { buscarSoloUnidadesSUNAT: number; cadenaABuscar: any }) => {
  //#region CONTEXTO
  const ctx_new_edit_registro_bien_gr = useContext(CTX_NEW_EDIT_REGISTRO_BIEN_GR);
  //#endregion CONTEXTO

  //#region BUSCANDO REGISTROS
  const lasUnidadesSUNAT = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarSoloUnidadesSUNAT.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //console.log('cadenaABuscar...', props.cadenaABuscar);

    const res = await fetch(import.meta.env.VITE_URL + '/api/mercaderia/buscarUnidadesSUNATPorDescripcionSUNAT', {
      // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.cadenaABuscar),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={lasUnidadesSUNAT}
      onPending={() => {
        //console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        //console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(unidadesSUNAT) => {
        //console.log('onResolved 🍓🍓🍓🍓');
        const { data } = unidadesSUNAT; //{ status, data, message }
        const misUnidadesSUNAT: IUnidadSUNAT[] = data;
        return (
          <>
            {misUnidadesSUNAT.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
                  <thead>
                    <tr>
                      <th>Código</th>
                      <th>Descripción SUNAT</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misUnidadesSUNAT.map((unidLoca) => {
                      const { codigo, descripcionSUNAT } = unidLoca;

                      return (
                        <tr>
                          <td data-label="Código">{codigo}</td>
                          <td data-label="Descripción SUNAT">{descripcionSUNAT}</td>
                          <td data-label="Acciones" class="accionesLeft">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar unidad SUNAT"
                              alt="icono buscar"
                              height={12}
                              width={12}
                              onClick$={async () => {
                                // let laUNI =
                                await inUnidadBienGR({
                                  idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                                  idEmpresa: parametrosGlobales.idEmpresa,
                                  unidad: codigo,
                                  descripcion: descripcionSUNAT,
                                  usuario: parametrosGlobales.usuario,
                                });
                                // laUNI = laUNI.data;
                                //   ctx_new_edit_mercaderia_in.laUNInewedit = laUNI[0].unidades;
                                //   ctx_new_edit_mercaderia_in.idLT = props.idLineaTipo;
                                //
                                //   ctx_new_edit_mercaderia_in.mostrarPanelBuscarUnidadSUNAT = false;

                                ctx_new_edit_registro_bien_gr.grabo_unidadSUNAT = true;
                                ctx_new_edit_registro_bien_gr.mostrarPanelBuscarSoloUnidadSUNAT = false;
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
