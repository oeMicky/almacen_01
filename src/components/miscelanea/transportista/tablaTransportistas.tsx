import { component$, Resource, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
import style from '../../tabla/tabla.css?inline';
import { images } from '~/assets';
import type { ITransportista } from '~/interfaces/iPersona';
import { CTX_GUIA_REMISION, CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
// import { CTX_BUSCAR_TRANSPORTISTA } from '~/components/guiaRemision/buscarTransportista';
import { parametrosGlobales } from '~/routes/login';
import { elIdAuxiliar } from '~/functions/comunes';
import { CTX_BUSCAR_TRANSPORTISTA } from './buscarTransportista';

export default component$((props: { buscarTransportista: number; contexto: string }) => {
  useStyles$(style);

  //#region CONTEXTOS
  let ctx: any = [];
  let documento: any = [];
  switch (props.contexto) {
    case 'new_edit_guiaRemision':
      ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
      documento = useContext(CTX_GUIA_REMISION).transportistas;
      break;
  }
  const ctx_buscar_transportista = useContext(CTX_BUSCAR_TRANSPORTISTA);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losTransportistas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarTransportista.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    //console.log('buscarTransportista:::...', props.buscarTransportista);

    if (ctx_buscar_transportista.buscarPor === 'Nombre / Razón social') {
      //console.log('Nombre:::...');
      const res = await fetch(import.meta.env.VITE_URL + '/api/transportista/obtenerTransportistasPorNombre', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_transportista.buscarPor,
          cadenaABuscar: ctx_buscar_transportista.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (ctx_buscar_transportista.buscarPor === 'DNI / RUC') {
      //console.log('DNI:::...');
      const res = await fetch(import.meta.env.VITE_URL + '/api/transportista/obtenerTransportistasPorDni', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_transportista.buscarPor,
          cadenaABuscar: ctx_buscar_transportista.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={losTransportistas}
      onPending={() => {
        //console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        //console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(transportistas) => {
        //console.log('onResolved 🍓🍓🍓🍓', transportistas);
        const { data } = transportistas; //{ status, data, message }
        const misTransportistas: ITransportista[] = data;
        return (
          <>
            {misTransportistas.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Tipo</th>
                      <th>Número</th>
                      <th>Razón social / Nombre</th>
                      <th>MTC</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misTransportistas.map((transporLocali, index) => {
                      const { _id, codigoTipoDocumentoIdentidad, tipoDocumentoIdentidad, numeroIdentidad, razonSocialNombre, registroMTC } = transporLocali;
                      const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Tipo">{tipoDocumentoIdentidad}</td>
                          <td data-label="Número">{numeroIdentidad}</td>
                          <td data-label="R.Soc/Nomb">{razonSocialNombre}</td>
                          <td data-label="MTC">{registroMTC}</td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar transportista"
                              height={14}
                              width={14}
                              style={{ marginRight: '4px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                // if (registroMTC === null) {
                                //   //console.log('registroMTC', registroMTC);
                                //   alert('No presenta el registro MTC.');
                                // }

                                if (typeof registroMTC === 'undefined' || registroMTC === null || registroMTC === '') {
                                  alert('No presenta el registro MTC.');
                                  return;
                                }

                                documento.push({
                                  idAuxiliar: elIdAuxiliar(),
                                  codigoTipoDocumentoIdentidad: codigoTipoDocumentoIdentidad,
                                  tipoDocumentoIdentidad: tipoDocumentoIdentidad,
                                  numeroIdentidad: numeroIdentidad,
                                  razonSocialNombre: razonSocialNombre,
                                  registroMTC: registroMTC,
                                  tipo: true,
                                });
                                ctx.selecciono_Transportista = true;
                                ctx.mostrarPanelBuscarTransportista = false;
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar persona"
                              height={14}
                              width={14}
                              // style={{ padding: '2px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                // ctx_buscar_persona.pP = persoLocali;
                                // ctx_buscar_persona.mostrarPanelNewEditPersona = true;
                                //console.log('ctx', ctx);
                                //console.log('selecion', transporLocali);
                                ctx_buscar_transportista.tR = transporLocali;
                                ctx_buscar_transportista.mostrarPanelEditTransportista = true;
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
