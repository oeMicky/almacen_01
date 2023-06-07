import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import { IPersona } from '~/interfaces/iPersona';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
// import style from '../tabla.css?inline';
import style from '../tabla/tabla.css?inline';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import { CTX_CLIENTE_SELECCIONADO } from './addVenta';

export default component$((props: { buscarPersona: number; parametrosBusqueda: any }) => {
  useStylesScoped$(style);
  //#region CONTEXTOS
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
  const ctx_cliente_seleccionado = useContext(CTX_CLIENTE_SELECCIONADO);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const lasPersonas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarPersona.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.parametrosBusqueda.por === 'Nombre / Razón social') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/persona/obtenerPersonasPorRazonNombre', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.por === 'DNI / RUC') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/persona/obtenerPersonasPorDniRuc', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
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
      value={lasPersonas}
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
        const misPersonas: IPersona[] = data;
        return (
          <>
            {misPersonas.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter ' }}>
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
                      const { _id, codigoTipoDocumentoIdentidad, tipoDocumentoIdentidad, numeroIdentidad, razonSocialNombre } =
                        persoLocali;
                      const indexItem = index + 1;
                      return (
                        // <tr key={_id} style={{ border: '1px solid red' }}>
                        <tr key={_id}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Tipo">{tipoDocumentoIdentidad}</td>
                          <td data-label="Número">{numeroIdentidad}</td>
                          <td data-label="R.Soc/Nomb">{razonSocialNombre}</td>
                          <td data-label="Acciones">
                            <ImgButton
                              src={images.check}
                              alt="icono de adicionar"
                              height={12}
                              width={12}
                              title="Seleccionar persona"
                              onClick={$(() => {
                                ctx_cliente_seleccionado._id = _id;
                                ctx_cliente_seleccionado.codigoTipoDocumentoIdentidad = codigoTipoDocumentoIdentidad;
                                ctx_cliente_seleccionado.tipoDocumentoIdentidad = tipoDocumentoIdentidad;
                                ctx_cliente_seleccionado.numeroIdentidad = numeroIdentidad;
                                ctx_cliente_seleccionado.razonSocialNombre = razonSocialNombre;

                                ctx_docs_venta.mostrarPanelSeleccionarPersona = false;
                                ctx_docs_venta.selecciono_Persona = true;
                              })}
                              //   onClick={() => {
                              //     personaSeleccionada({
                              //       _id,
                              //       codigoTipoDocumentoIdentidad,
                              //       tipoDocumentoIdentidad,
                              //       numeroIdentidad,
                              //       razonSocialNombre,
                              //     });
                              //   }}
                            />
                            <ImgButton
                              src={images.edit}
                              alt="icono de editar"
                              height={12}
                              width={12}
                              title="Editar persona"
                              onClick={$(() => {
                                ctx_docs_venta.personaSe = persoLocali;
                                ctx_docs_venta.mostrarPanelAgregarPersona0 = true;
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
                <i style={{ fontSize: '0.7rem' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
