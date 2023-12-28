import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import style from '../../tabla/tabla.css?inline';
import { IOrdenServicio } from '~/interfaces/iOrdenServicio';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
import ImgButton from '~/components/system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import { CTX_BUSCAR_ORDEN_SERVICIO_APERTURADO } from './buscarOrdenServicioAperturado';

export default component$(
  (props: { contexto: string; buscarOrdenesServicio: number; parametrosBusqueda: any; modoSeleccion: boolean }) => {
    useStylesScoped$(style);

    //#region CONTEXTO
    let ctx: any = [];
    switch (props.contexto) {
      case 'egreso_de_almacen':
        ctx = useContext(CTX_NEW_OUT_ALMACEN);
        break;
      // case 'new_venta':
      //   ctx = useContext(CTX_ADD_VENTA);
      //   break;
    }

    const ctx_buscar_orden_servicio_aperturado = useContext(CTX_BUSCAR_ORDEN_SERVICIO_APERTURADO);
    //#endregion CONTEXTO

    //#region BUSCANDO REGISTROS
    const lasOrdenesServicio = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.buscarOrdenesServicio.valueOf());

      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      console.log('parametrosBusqueda', props.parametrosBusqueda);

      const res = await fetch(import.meta.env.VITE_URL + '/api/ordenServicio/getOrdenesServicioAperturadasEntreFechas', {
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
                  <table style={{ fontSize: '0.8em', fontWeight: 'lighter ' }}>
                    <thead>
                      <tr>
                        {/* <th>Ítem</th> */}
                        <th>OS</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misOrdenesServicio.map((ordServiLocali) => {
                        const { _id, fechaInicio, serie, numero, razonSocialNombreCliente, requisiciones, tipo } = ordServiLocali;
                        // const indexItem = index + 1; , index
                        return (
                          <tr key={_id}>
                            {/* <td data-label="Ítem">{indexItem}</td> */}
                            <td data-label="OS">{serie + ' - ' + numero}</td>
                            <td data-label="Fecha">{fechaInicio ? formatoDDMMYYYY_PEN(fechaInicio) : '_'}</td>
                            <td data-label="Estado">{razonSocialNombreCliente ? razonSocialNombreCliente : '_'}</td>
                            <td data-label="Tipo">{tipo ? tipo : '_'}</td>
                            {/* <td data-label="Precio">{precio.$numberDecimal ? precio.$numberDecimal : '_'}</td> */}
                            <td data-label="Acciones" style={{ textAlign: 'right' }}>
                              <ImgButton
                                src={images.check}
                                alt="icono de adicionar"
                                height={14}
                                width={14}
                                title="Seleccionar servicio"
                                onClick={$(() => {
                                  if (requisiciones.length === 0) {
                                    alert(`La orden de servicio # ${serie + ' - ' + numero} no presenta requisiciones.`);
                                    return;
                                  }
                                  ctx_buscar_orden_servicio_aperturado.oO = ordServiLocali;
                                  ctx.mostrarPanelDespachoRequisiciones = true;
                                  // alert(`La orden de servicio # ...paso`);
                                  // ctx_servicio_seleccionado._id = _id;
                                  // ctx_servicio_seleccionado.codigo = codigo;
                                  // ctx_servicio_seleccionado.descripcion = descripcion;
                                  // ctx_servicio_seleccionado.precio = precio;
                                  // ctx_docs_orden_servicio.mostrarPanelSeleccionarServicio0 = false;
                                  // ctx_docs_orden_servicio.selecciono_Servicio0 = true;
                                })}
                              />
                              <ImgButton
                                src={images.see}
                                alt="icono de editar"
                                height={14}
                                width={14}
                                title="Editar servicio"
                                onClick={$(() => {
                                  console.log('first', ordServiLocali);
                                })}
                              />
                              {/*   <ImgButton
                              src={images.pdf}
                              alt="icono de pdf"
                              height={14}
                              width={14}
                              title={`Ver pdf ${ordServiLocali._id}`}
                              onClick={$(() => {
                                osSeleccionada.value = ordServiLocali;
                                clickPDF.value++;
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
  }
);
