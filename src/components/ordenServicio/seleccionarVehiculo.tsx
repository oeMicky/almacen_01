import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { parametrosGlobales } from '~/routes/login';
import TablaVehiculosHallados from './tablaVehiculosHallados';
import NewEditVehiculo from './newEditVehiculo';

export default component$(() => {
  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarVehiculo = useSignal(0);
  const por = useSignal('Placa');
  const cadena = useSignal('');
  //#endregion INICIALIZACION

  //#region PARAMETROS DE BUSQUEDA
  const parametrosBusqueda = {
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    por: por.value,
    cadenaABuscar: cadena.value,
  };
  //#endregion PARAMETROS DE BUSQUEDA

  return (
    <div
      style={{
        width: 'auto',
        padding: '1px',
        // border: '3px dashed yellow',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_docs_orden_servicio.mostrarPanelSeleccionarVehiculo0 = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h2 style={{ marginBottom: '10px' }}>Seleccionar vehículo</h2>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <label>Buscar por</label>
            <div class="form-control form-agrupado">
              <select
                id="buscarPor"
                style={{ width: '100%' }}
                value={por.value}
                onChange$={(e) => {
                  por.value = (e.target as HTMLSelectElement).value;
                  document.getElementById('inputBusqueda')?.focus();
                }}
              >
                <option value={'Placa'}>Placa</option>
                <option value={'Marca'}>Marca</option>
                <option value={'Modelo'}>Modelo</option>
                <option value={'VIN'}>VIN</option>
              </select>
            </div>
          </div>
          {/* DNI RUC */}
          <div class="form-control">
            <label></label>
            <div class="form-control form-agrupado">
              <input
                id="inputBusqueda"
                style={{ width: '100%' }}
                type="text"
                value={cadena.value}
                onChange$={(e) => {
                  cadena.value = (e.target as HTMLInputElement).value;
                }}
                onKeyUp$={(e) => {
                  if (e.key === 'Enter') {
                    if ((document.getElementById('inputBusqueda') as HTMLInputElement).value.trim() !== '') {
                      buscarVehiculo.value++;
                    } else {
                      alert('Ingrese un valor a buscar');
                      document.getElementById('inputBusqueda')?.focus();
                    }
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('buscarPor')?.focus();
                  }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <ImgButton
                id="btnBuscarVehiculo0"
                src={images.searchPLUS}
                alt="Icono de buscar vehículo"
                height={16}
                width={16}
                title="Buscar vehículo"
                onClick={$(() => {
                  if ((document.getElementById('inputBusqueda') as HTMLInputElement).value.trim() !== '') {
                    buscarVehiculo.value++;
                  } else {
                    alert('Ingrese un valor a buscar');
                    document.getElementById('inputBusqueda')?.focus();
                  }
                })}
              />
              <ImgButton
                src={images.add}
                alt="Icono de adicionar vehículo"
                height={16}
                width={16}
                title="Adicionar vehículo"
                onClick={$(() => {
                  // alert('Ingrese un valor a buscar');
                  ctx_docs_orden_servicio.vehiculoSe = [];
                  ctx_docs_orden_servicio.mostrarPanelNewEditVehiculo0 = true;
                })}
              />
            </div>
          </div>
        </div>
        {ctx_docs_orden_servicio.mostrarPanelNewEditVehiculo0 && (
          <div class="modal">
            <NewEditVehiculo
              // soloPersonaNatural={props.soloPersonasNaturales}
              vehiculoSeleccio={ctx_docs_orden_servicio.vehiculoSe}
            />
          </div>
        )}
        {/* TABLA DE PERSONAS HALLADAS*/}
        <div class="form-control">
          {buscarVehiculo.value > 0 ? (
            <TablaVehiculosHallados buscarVehiculo={buscarVehiculo.value} parametrosBusqueda={parametrosBusqueda} />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});
