import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import style from '../../tabla/tabla.css?inline';
import { CTX_BUSCAR_TECNICO } from './buscarTecnico';
import { parametrosGlobales } from '~/routes/login';
import ImgButton from '~/components/system/imgButton';
import { images } from '~/assets';
import { ITecnico } from '~/interfaces/iPersona';
// import { CTX_NEW_EDIT_ORDEN_SERVICIO } from '~/components/ordenServicio/newEditOrdenServicio';

export default component$((props: { buscarTecnico: number; contexto: string }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  // let ctx: any = [];
  switch (props.contexto) {
    case 'orden_servicio':
      // ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      // documento = useContext(CTX_O_S);
      break;
  }
  const ctx_buscar_tecnico = useContext(CTX_BUSCAR_TECNICO);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losTecnicos = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarTecnico.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('buscarTecnico:::...', props.buscarTecnico);

    if (ctx_buscar_tecnico.buscarPor === 'Nombre / Razón social') {
      console.log('Nombre:::...');
      const res = await fetch(import.meta.env.VITE_URL + '/api/tecnico/obtenerTecnicosPorNombre', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_tecnico.buscarPor,
          cadenaABuscar: ctx_buscar_tecnico.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (ctx_buscar_tecnico.buscarPor === 'DNI / RUC') {
      console.log('DNI:::...');
      const res = await fetch(import.meta.env.VITE_URL + '/api/tecnico/obtenerTecnicosPorDni', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_tecnico.buscarPor,
          cadenaABuscar: ctx_buscar_tecnico.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={losTecnicos}
      onPending={() => {
        console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(personas) => {
        console.log('onResolved 🍓🍓🍓🍓', personas);
        const { data } = personas; //{ status, data, message }
        const misPersonas: ITecnico[] = data;
        return (
          <>
            {misPersonas.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Tipo</th>
                      <th>Número</th>
                      <th>Razón social / Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misPersonas.map((persoLocali, index) => {
                      const { _id, tipoDocumentoIdentidad, numeroIdentidad, razonSocialNombre } = persoLocali;
                      const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Tipo">{tipoDocumentoIdentidad}</td>
                          <td data-label="Número">{numeroIdentidad}</td>
                          <td data-label="R.Soc/Nomb">{razonSocialNombre}</td>
                          <td data-label="Acciones" style={{ textAlign: 'right' }}>
                            <ImgButton
                              src={images.check}
                              alt="icono de selección"
                              height={12}
                              width={12}
                              title={`Seleccionar técnico`}
                              onClick={$(() => {
                                // ctx.selecciono_Tecnico = true;
                                // ctx.mostrarPanelBuscarTecnico = false;
                                // ctx_rol._id = _id;
                                // ctx_rol.codigoTipoDocumentoIdentidad = codigoTipoDocumentoIdentidad;
                                // ctx_rol.tipoDocumentoIdentidad = tipoDocumentoIdentidad;
                                // ctx_rol.numeroIdentidad = numeroIdentidad;
                                // ctx_rol.razonSocialNombre = razonSocialNombre;
                                // ctx.mostrarPanelBuscarPersona = false;
                                // ctx.rol_Persona = props.rol;
                                // ctx.selecciono_Persona = true;
                              })}
                            />
                            <ImgButton
                              src={images.edit}
                              alt="icono de editar"
                              height={12}
                              width={12}
                              title="Editar persona"
                              onClick={$(() => {
                                // ctx_buscar_persona.pP = persoLocali;
                                // ctx_buscar_persona.mostrarPanelNewEditPersona = true;
                                // console.log('ctx', ctx);
                                // console.log('selecion', persoLocali);
                              })}
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
                <i style={{ fontSize: '0.7rem' }}>No se encotraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
