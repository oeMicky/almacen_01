import { $, component$, Resource, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import ImgButton from '../../system/imgButton';
// // import { CTX_VENTA } from '~/routes/(almacen)/factura';
// import { CTX_PERSONA } from '../../venta/addVenta';
import { IPersona } from './seleccionarPersona';
import style from '../../../components/tabla.css?inline';
import { CTX_COTIZACION } from '~/routes/(almacen)/cotizacion';
import ImgButton from '../system/imgButton';
import { CTX_PERSONA } from '../venta/addVenta';
// import style from '../../../components/tabla.css?inline';

// interface IPersona {
//   _id: string;
//   codigoTipoDocumentoIdentidad: string;
//   tipoDocumentoIdentidad: string;
//   numeroIdentidad: string;
//   razonSocialNombre: string;
// }

export default component$((props: { buscarPersona: number; parametrosBusqueda: any; contexto?: any }) => {
  useStylesScoped$(style);
  console.log('cntrexto', props.contexto);
  // const ctx = props.contexto === 'COTIZACION' ? useContext(CTX_COTIZACION) : useContext(CTX_VENTA);

  //#region CONTEXTOS
  // const ctx_PanelVenta = useContext(CTX_VENTA);
  const ctx_PanelVenta = useContext(CTX_COTIZACION);
  const ctx_PersonaSeleccionada = useContext(CTX_PERSONA);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const lasPersonas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarPersona.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

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
        console.log('onResolved 🍓🍓🍓🍓');
        const { data } = personas; //{ status, data, message }
        const misPersonas: IPersona[] = data;
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
                    {misPersonas.map((value, index) => {
                      const indexItem = index + 1;
                      return (
                        <tr key={value._id}>
                          <td data-label="Item">{indexItem}</td>
                          <td data-label="Tipo">{value.tipoDocumentoIdentidad}</td>
                          <td data-label="Número">{value.numeroIdentidad}</td>
                          <td data-label="R.Soc/Nomb">{value.razonSocialNombre}</td>
                          <td data-label="Acciones" style={{ textAlign: 'center' }}>
                            <ImgButton
                              src={images.check}
                              alt="icono de selección"
                              height={12}
                              width={12}
                              title={`Ver persona ${value._id}`}
                              onClick={$(() => {
                                // ctx_PersonaSeleccionada._id = value._id;
                                // ctx_PersonaSeleccionada.codigoTipoDocumentoIdentidad = value.codigoTipoDocumentoIdentidad;
                                // ctx_PersonaSeleccionada.tipoDocumentoIdentidad = value.tipoDocumentoIdentidad;
                                // ctx_PersonaSeleccionada.numeroIdentidad = value.numeroIdentidad;
                                // ctx_PersonaSeleccionada.razonSocialNombre = value.razonSocialNombre;
                                // console.log(
                                //   'ctx_PersonaSeleccionada.razonSocialNombre',
                                //   ctx_PersonaSeleccionada.razonSocialNombre
                                // );
                                ctx_PanelVenta.mostrarPanelSeleccionarPersona = false;
                                ctx_PanelVenta.selecciono_Persona = true;
                                // ctx.mostrarPanelSeleccionarPersona = false;
                                // ctx.selecciono_Persona = true;
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
