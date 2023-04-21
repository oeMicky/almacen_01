import { $, component$, Resource, useContext, useResource$, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '../system/imgButton';
import { CTX_VENTA } from '~/routes/(almacen)/factura';
import { CTX_PERSONA } from '../venta/addVenta';
import { IPersona } from './seleccionarPersona';

// interface IPersona {
//   _id: string;
//   codigoTipoDocumentoIdentidad: string;
//   tipoDocumentoIdentidad: string;
//   numeroIdentidad: string;
//   razonSocialNombre: string;
// }

export default component$((props: { buscarPersona: number; parametrosBusqueda: any }) => {
  const ctx_PanelVenta = useContext(CTX_VENTA);
  const ctx_PersonaSeleccionada = useContext(CTX_PERSONA);

  const lasPersonas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarPersona.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // console.log('FETCH->: ', `http://localhost:4000/api/venta/obtenerVentasPorFechas`);
    // const res = await fetch(`http://localhost:4000/api/venta/obtenerVentasPorFechas`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(props.parametrosBusqueda),
    //   signal: abortController.signal,
    // });
    console.log('parametrosBusqueda', props.parametrosBusqueda);
    const res = await fetch('http://localhost:4000/api/persona/obtenerPersonasPorDniRuc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(props.parametrosBusqueda),
      signal: abortController.signal,
    });
    return res.json();
  });
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
        const { status, data, message } = personas;
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
                          <td>{indexItem}</td>
                          <td>{value.tipoDocumentoIdentidad}</td>
                          <td>{value.numeroIdentidad}</td>
                          <td>{value.razonSocialNombre}</td>
                          <td style={{ textAlign: 'center' }}>
                            <ImgButton
                              src={images.check}
                              alt="icono de selección"
                              height={12}
                              width={12}
                              title={`Ver persona ${value._id}`}
                              onClick={$(() => {
                                ctx_PersonaSeleccionada._id = value._id;
                                ctx_PersonaSeleccionada.codigoTipoDocumentoIdentidad = value.codigoTipoDocumentoIdentidad;
                                ctx_PersonaSeleccionada.tipoDocumentoIdentidad = value.tipoDocumentoIdentidad;
                                ctx_PersonaSeleccionada.numeroIdentidad = value.numeroIdentidad;
                                ctx_PersonaSeleccionada.razonSocialNombre = value.razonSocialNombre;
                                console.log(
                                  'ctx_PersonaSeleccionada.razonSocialNombre',
                                  ctx_PersonaSeleccionada.razonSocialNombre
                                );
                                ctx_PanelVenta.mostrarPanelSeleccionarPersona = false;
                                ctx_PanelVenta.selecciono_Persona = true;
                                // clickPDF.value = clickPDF.value + 1;
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
