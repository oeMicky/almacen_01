import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
// import style from '../tabla.css?inline';
// import style from '../../components/tabla/tabla.css?inline';
import style from '../tabla/tabla.css?inline';
import { IOrdenServicio } from '~/interfaces/iOrdenServicio';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';

export default component$((props: { buscarOrdenesServicio: number; parametrosBusqueda: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const lasOrdenesServicio = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarOrdenesServicio.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/ordenServicio/getOrdenesServicio', {
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
      value={lasOrdenesServicio}
      onPending={() => {
        console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(ordenesServicio) => {
        console.log('onResolved 🍓🍓🍓🍓', ordenesServicio);
        const { data } = ordenesServicio; //{ status, data, message }
        const misOrdenesServicio: IOrdenServicio[] = data;
        return (
          <>
            {misOrdenesServicio.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter ' }}>
                  <thead>
                    <tr>
                      {/* <th>Ítem</th> */}
                      <th>OS</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Tipo</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misOrdenesServicio.map((ordServiLocali) => {
                      const { _id, fechaInicio, correlativo, estado, tipo } = ordServiLocali;
                      // const indexItem = index + 1; , index
                      return (
                        <tr key={_id}>
                          {/* <td data-label="Ítem">{indexItem}</td> */}
                          <td data-label="OS">{correlativo ? correlativo : '_'}</td>
                          <td data-label="Fecha">{fechaInicio ? formatoDDMMYYYY_PEN(fechaInicio) : '_'}</td>
                          <td data-label="Estado">{estado ? estado : '_'}</td>
                          <td data-label="Tipo">{tipo ? tipo : '_'}</td>
                          {/* <td data-label="Precio">{precio.$numberDecimal ? precio.$numberDecimal : '_'}</td> */}
                          <td data-label="Acciones" style={{ textAlign: 'center' }}>
                            {/* <ImgButton
                              src={images.check}
                              alt="icono de adicionar"
                              height={12}
                              width={12}
                              title="Seleccionar servicio"
                              onClick={$(() => {
                                // ctx_servicio_seleccionado._id = _id;
                                // ctx_servicio_seleccionado.codigo = codigo;
                                // ctx_servicio_seleccionado.descripcion = descripcion;
                                // ctx_servicio_seleccionado.precio = precio;
                                // ctx_docs_orden_servicio.mostrarPanelSeleccionarServicio0 = false;
                                // ctx_docs_orden_servicio.selecciono_Servicio0 = true;
                              })}
                            /> */}
                            <ImgButton
                              src={images.edit}
                              alt="icono de editar"
                              height={12}
                              width={12}
                              title="Editar servicio"
                              onClick={$(() => {
                                ctx_docs_orden_servicio.ordSerSe = ordServiLocali;
                                ctx_docs_orden_servicio.mostrarAddOrderServicio0 = true;
                              })}
                            />
                            {/* <ImgButton
                              src={images.pdf}
                              alt="icono de pdf"
                              height={12}
                              width={12}
                              title={`Ver pdf ${value._id}`}
                              onClick={$(() => {
                                ventaSeleccionada.value = value;
                                clickPDF.value = clickPDF.value + 1;
                              })}
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
                <i style={{ fontSize: '0.7rem' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
