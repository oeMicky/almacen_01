import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
// import style from '../../tabla.css?inline';
import style from '../../tabla/tabla.css?inline';
// import { CTX_SERVICIO_SELECCIONADO } from './seleccionarServicio';
// import { CTX_INDEX_VENTA } from '~/routes/(almacen)/venta';
// import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
// import { CTX_DOCS_COTIZACION } from '~/routes/(almacen)/cotizacion';
import { CTX_BUSCAR_SERVICIO } from './buscarServicio';
import { IServicio } from '~/interfaces/iServicio';

export default component$((props: { buscarServicios: number; parametrosBusqueda: any; contexto: any }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  // let ctx: any = [];
  // switch (props.contexto) {
  //   case 'orden servicio':
  //     ctx = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //     console.log('swicth.......useContext(CTX_DOCS_ORDEN_SERVICIO)');
  //     break;
  //   case 'venta':
  //     ctx = useContext(CTX_INDEX_VENTA);
  //     console.log('swicth.......useContext(CTX_INDEX_VENTA)');
  //     break;
  //   case 'cotizacion':
  //     ctx = useContext(CTX_DOCS_COTIZACION);
  //     console.log('swicth.......useContext(CTX_DOCS_COTIZACION)');
  //     break;
  // }
  const ctx_buscar_servicio = useContext(CTX_BUSCAR_SERVICIO);
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
                      <th>Acc</th>
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
                          <td data-label="Acciones" class="acciones">
                            {/* <div style={{ display: 'flex', textAlign: 'right' }}> */}
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar servicio"
                              height={14}
                              width={14}
                              style={{ padding: '2px' }}
                              onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                ctx_buscar_servicio.sS = serviLocali;
                                ctx_buscar_servicio.mostrarPanelServicioSeleccionado = true;
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar servicio"
                              height={14}
                              width={14}
                              style={{ padding: '2px' }}
                              onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                ctx_buscar_servicio.sS = serviLocali;
                                ctx_buscar_servicio.mostrarPanelNewEditServicio = true;
                              }}
                            />
                            {/* <ImgButton src={images.see} alt="icono de editar" height={12} width={12} title="Editar ver" /> */}
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
