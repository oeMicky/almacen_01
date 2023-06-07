import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import style from '../tabla.css?inline';
import { IServicio } from '~/interfaces/iServicio';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_SERVICIO_SELECCIONADO } from './seleccionarServicio';
// import { CTX_SERVICIO_SELECCIONADO } from './newEditOrdenServicio';

export default component$((props: { buscarServicio: number; parametrosBusqueda: any }) => {
  useStylesScoped$(style);
  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  const ctx_servicio_seleccionado = useContext(CTX_SERVICIO_SELECCIONADO);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losServicios = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarServicio.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.parametrosBusqueda.por === 'Código') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/servicio/obtenerVehiculosPorPlaca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.por === 'Descripción') {
      const res = await fetch(import.meta.env.VITE_URL + '/api/servicio/getServiciosPorDescripcion', {
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
      value={losServicios}
      onPending={() => {
        console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(servicios) => {
        console.log('onResolved 🍓🍓🍓🍓', servicios);
        const { data } = servicios; //{ status, data, message }
        const misServicios: IServicio[] = data;
        return (
          <>
            {misServicios.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter ' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misServicios.map((serviLocali, index) => {
                      const { _id, activo, codigo, descripcion, precio } = serviLocali;
                      const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Código">{codigo ? codigo : '_'}</td>
                          <td data-label="Descripción">{descripcion ? descripcion : '_'}</td>
                          <td data-label="Precio">{precio.$numberDecimal ? precio.$numberDecimal : '_'}</td>
                          <td data-label="Acciones">
                            <ImgButton
                              src={images.check}
                              alt="icono de adicionar"
                              height={12}
                              width={12}
                              title="Seleccionar servicio"
                              onClick={$(() => {
                                ctx_servicio_seleccionado.sS = serviLocali;
                                ctx_docs_orden_servicio.mostrarServicioSeleccionado = true;
                                // ctx_servicio_seleccionado._id = _id;
                                // ctx_servicio_seleccionado.codigo = codigo;
                                // ctx_servicio_seleccionado.descripcion = descripcion;
                                // ctx_servicio_seleccionado.precio = precio;

                                // ctx_docs_orden_servicio.mostrarPanelSeleccionarServicio0 = false;
                                // ctx_docs_orden_servicio.selecciono_Servicio0 = true;
                              })}
                            />
                            <ImgButton
                              src={images.edit}
                              alt="icono de editar"
                              height={12}
                              width={12}
                              title="Editar servicio"
                              //   onClick={$(() => {
                              //     ctx_docs_orden_servicio.vehiculoSe = serviLocali;
                              //     ctx_docs_orden_servicio.mostrarPanelAgregarPersona0 = true;
                              //   })}
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
