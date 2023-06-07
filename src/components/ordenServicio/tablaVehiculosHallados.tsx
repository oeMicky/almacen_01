import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import style from '../tabla.css?inline';
import { IVehiculo } from '~/interfaces/iVehiculo';
import { CTX_VEHICULO_SELECCIONADO } from './newEditOrdenServicio';

export default component$((props: { buscarVehiculo: number; parametrosBusqueda: any }) => {
  useStylesScoped$(style);
  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  const ctx_vehiculo_seleccionado = useContext(CTX_VEHICULO_SELECCIONADO);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losVehiculos = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarVehiculo.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    console.log('parametrosBusqueda', props.parametrosBusqueda);

    if (props.parametrosBusqueda.por === 'Placa') {
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
    if (props.parametrosBusqueda.por === 'Marca') {
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
    if (props.parametrosBusqueda.por === 'Modelo') {
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
    if (props.parametrosBusqueda.por === 'VIN') {
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
        console.log('onResolved 🍓🍓🍓🍓', vehiculos);
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
                          <td data-label="Acciones">
                            <ImgButton
                              src={images.check}
                              alt="icono de adicionar"
                              height={12}
                              width={12}
                              title="Seleccionar persona"
                              onClick={$(() => {
                                ctx_vehiculo_seleccionado._id = _id;
                                ctx_vehiculo_seleccionado.placa = placa;
                                ctx_vehiculo_seleccionado.idVehiculoMarca = idVehiculoMarca;
                                ctx_vehiculo_seleccionado.vehiculoMarca = vehiculoMarca;
                                ctx_vehiculo_seleccionado.idVehiculoModelo = idVehiculoModelo;
                                ctx_vehiculo_seleccionado.vehiculoModelo = vehiculoModelo;
                                ctx_vehiculo_seleccionado.vin = vin;

                                ctx_docs_orden_servicio.mostrarPanelSeleccionarVehiculo0 = false;
                                ctx_docs_orden_servicio.selecciono_Vehiculo0 = true;
                              })}
                            />
                            <ImgButton
                              src={images.edit}
                              alt="icono de editar"
                              height={12}
                              width={12}
                              title="Editar vehículo"
                              onClick={$(() => {
                                ctx_docs_orden_servicio.vehiculoSe = vehiLocali;
                                ctx_docs_orden_servicio.mostrarPanelAgregarPersona0 = true;
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
