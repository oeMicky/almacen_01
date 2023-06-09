import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
// import style from '../../tabla.css?inline';
import style from '../../tabla/tabla.css?inline';
import { CTX_SERVICIO_SELECCIONADO } from './seleccionarServicio';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';

interface IServicio {
  _id: string;
  codigo: string;
  descripcion: string;

  precioPEN: any;
}

export default component$((props: { buscarServicios: number; parametrosBusqueda: any }) => {
  useStylesScoped$(style);
  //#region CONTEXTOS
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
  const ctx_servicio_seleccionado = useContext(CTX_SERVICIO_SELECCIONADO);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losServicios = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarServicios.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/servicio/getServiciosPorDescripcion', {
      // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
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
        console.log('onResolved 🍓🍓🍓🍓');
        const { data } = servicios; //{ status, data, message }
        const misServicios: IServicio[] = data;
        return (
          <>
            {misServicios.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      {/* <th>Ítem</th> */}
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Precio PEN</th>
                      <th>Ac</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* aqui "nace el nuevo" json  */}
                    {misServicios.map((serviLocali) => {
                      //, index
                      const { _id, codigo, descripcion, precioPEN } = serviLocali;
                      // const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          {/* <td data-label="Ítem" key={indexItem}>
                            {indexItem}
                          </td> */}
                          <td data-label="Código">{codigo ? codigo : '_'}</td>
                          <td data-label="Descripción">{descripcion}</td>
                          <td data-label="Precio PEN">
                            {serviLocali.precioPEN
                              ? parseFloat(precioPEN.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : ''}
                          </td>
                          <td data-label="Acciones" style={{ textAlign: 'right' }}>
                            {/* <div style={{ display: 'flex', textAlign: 'right' }}> */}
                            <ImgButton
                              src={images.check}
                              alt="icono de adicionar"
                              height={12}
                              width={12}
                              title="Seleccionar servicio"
                              onClick={$(() => {
                                console.log('serviLocali', serviLocali);
                                ctx_servicio_seleccionado.sS = serviLocali;
                                ctx_docs_venta.mostrarServicioSeleccionado = true;
                              })}
                              // onClick={() => {
                              //   servicioSeleccionado({
                              //     _id,
                              //     codigo,
                              //     descripcion,
                              //     cantidad: 1,
                              //     precio,
                              //   });
                              // }}
                            />
                            <ImgButton
                              src={images.edit}
                              alt="icono de editar"
                              height={12}
                              width={12}
                              title="Editar servicio"
                              // onClick={() => {
                              //   // asignarPrecio({ _id });
                              // }}
                            />
                            {/* </div> */}
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
