import { Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import style from '../../tabla/tabla.css?inline';
import { CTX_BUSCAR_VEHICULO } from './buscarVehiculo';
import type { IVehiculo } from '~/interfaces/iVehiculo';
// import ImgButton from '~/components/system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_EDIT_ORDEN_SERVICIO, CTX_O_S } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_COTIZACION, CTX_NEW_EDIT_COTIZACION } from '~/components/cotizacion/newEditCotizacion';

export default component$((props: { buscarVehiculos: number; parametrosBusqueda: any; contexto: string }) => {
  useStylesScoped$(style);

  //#region CONTEXTOS
  let ctx: any = [];
  let documento: any = [];
  switch (props.contexto) {
    case 'orden servicio':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      documento = useContext(CTX_O_S);
      console.log('swicth.......useContext(CTX_NEW_EDIT_ORDEN_SERVICIO)');
      break;
    // case 'venta':
    //   ctx = useContext(CTX_DOCS_VENTA);
    //   console.log('swicth.......useContext(CTX_DOCS_VENTA)');
    //   break;
    case 'cotizacion':
      ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      documento = useContext(CTX_COTIZACION);
      console.log('swicth.......useContext(CTX_NEW_EDIT_COTIZACION)');
      break;
  }

  const ctx_buscar_vehiculo = useContext(CTX_BUSCAR_VEHICULO);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losVehiculos = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarVehiculos.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.parametrosBusqueda.buscarPor === 'Placa') {
      console.log('...................Placa');
      const res = await fetch(import.meta.env.VITE_URL + '/api/vehiculo/obtenerVehiculosPorPlaca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.buscarPor === 'Marca') {
      console.log('...................Marca');
      const res = await fetch(import.meta.env.VITE_URL + '/api/vehiculo/obtenerVehiculosPorMarca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.buscarPor === 'Modelo') {
      console.log('...................Modelo');
      const res = await fetch(import.meta.env.VITE_URL + '/api/vehiculo/obtenerVehiculosPorModelo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (props.parametrosBusqueda.buscarPor === 'VIN') {
      console.log('...................VIN');
      const res = await fetch(import.meta.env.VITE_URL + '/api/vehiculo/obtenerVehiculosPorVIN', {
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
      value={losVehiculos}
      onPending={() => {
        console.log('onPending 🍉🍉🍉🍉');
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log('onRejected 🍍🍍🍍🍍');
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(vehiculos) => {
        console.log('onResolved 🍓🍓🍓🍓');
        const { data } = vehiculos; //{ status, data, message }
        const misVehiculos: IVehiculo[] = data;
        return (
          <>
            {misVehiculos.length > 0 ? (
              <>
                <table style={{ fontSize: '0.7em', fontWeight: 'lighter ' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Placa</th>
                      <th>Marca</th>
                      <th>Modelo</th>
                      <th>VIN</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misVehiculos.map((vehiLocali, index) => {
                      const { _id, placa, idVehiculoMarca, vehiculoMarca, idVehiculoModelo, vehiculoModelo, vin } = vehiLocali;
                      const indexItem = index + 1;
                      return (
                        // <tr key={_id} style={{ border: '1px solid red' }}>
                        <tr key={_id}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Placa">{placa}</td>
                          <td data-label="Marca">{vehiculoMarca ? vehiculoMarca : '_'}</td>
                          <td data-label="Modelo">{vehiculoModelo ? vehiculoModelo : '_'}</td>
                          <td data-label="VIN">{vin ? vin : '_'}</td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar persona"
                              height={14}
                              width={14}
                              style={{ padding: '2px' }}
                              onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                documento.idVehiculo = _id;
                                documento.placa = placa;
                                documento.idVehiculoMarca = idVehiculoMarca;
                                documento.vehiculoMarca = vehiculoMarca;
                                documento.idVehiculoModelo = idVehiculoModelo;
                                documento.vehiculoModelo = vehiculoModelo;
                                documento.vin = vin;

                                ctx.mostrarPanelBuscarVehiculo = false;
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar vehículo"
                              height={14}
                              width={14}
                              style={{ padding: '2px' }}
                              onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                ctx_buscar_vehiculo.vV = vehiLocali;
                                console.log('desde tablVehiuclosHallados', ctx_buscar_vehiculo.vV);
                                ctx_buscar_vehiculo.mostrarPanelNewEditVehiculo = true;
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
                <i style={{ fontSize: '0.7rem' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
