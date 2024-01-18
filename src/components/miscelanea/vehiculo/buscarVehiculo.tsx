import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { parametrosGlobales } from '~/routes/login';
import NewEditVehiculo from './newEditVehiculo';
import TablaVehiculosHallados from './tablaVehiculosHallados';
import { CTX_NEW_EDIT_ORDEN_SERVICIO } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_NEW_EDIT_COTIZACION } from '~/components/cotizacion/newEditCotizacion';

export const CTX_BUSCAR_VEHICULO = createContextId<any>('vehiculo__');

export default component$((props: { contexto: string }) => {
  //#region DEFINICION CTX_BUSCAR_VEHICULO - para eDITAR - para sELECCIONAR
  const definicion_CTX_BUSCAR_VEHICULO = useStore({
    vV: [],
    // vehiculo_seleccionado: false,
    grabo_vehiculo: false,
    mostrarPanelNewEditVehiculo: false,
    mostrarPanelVehiculoSeleccionado: false,
  });
  useContextProvider(CTX_BUSCAR_VEHICULO, definicion_CTX_BUSCAR_VEHICULO);
  //#endregion DEFINICION CTX_BUSCAR_VEHICULO - para eDITAR - para sELECCIONAR

  //#region CONTEXTOS
  let ctx: any = [];
  // let documento: any = [];
  switch (props.contexto) {
    case 'orden servicio':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      // documento = useContext(CTX_O_S);
      break;
    // case 'venta':
    //   ctx = useContext(CTX_DOCS_VENTA);
    //   break;
    case 'cotizacion':
      ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      break;
  }
  //#endregion CONTEXTOS

  const buscarVehiculos = useSignal(0);
  // const por = useSignal('VIN');
  // const cadena = useSignal('');

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    buscarPor: 'Placa', //por.value,
    cadenaABuscar: '', //cadena.value,
  });

  //#region BUSCAR VEHICULOS
  const localizarVehiculos = $(() => {
    console.log('first***=>', parametrosBusqueda);
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪' + parametrosBusqueda.cadenaABuscar + '**');
      //document.getElementById('inputBusquedaServicio_MICE')?.focus();
      return;
    }
    buscarVehiculos.value++;
  });
  //#endregion BUSCAR VEHICULOS

  //#region REFRESCAR TABLA VEHICULOS
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_BUSCAR_VEHICULO.grabo_vehiculo;
    });
    if (definicion_CTX_BUSCAR_VEHICULO.grabo_vehiculo) {
      localizarVehiculos();
      definicion_CTX_BUSCAR_VEHICULO.grabo_vehiculo = false;
    }
  });
  //#endregion REFRESCAR TABLA VEHICULOS

  return (
    <div
      style={{
        width: 'clamp(386px, 86%, 700px)',
        // width: 'auto',
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
            ctx.mostrarPanelBuscarVehiculo = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('parametrosBusqueda', parametrosBusqueda);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px' }}>Buscar vehículo</h3>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <label>Buscar por</label>
            <div class="form-control form-agrupado">
              <select
                id="se_buscarPor_VEHICULO"
                style={{ width: '100%' }}
                // value={por.value}
                onChange$={(e) => {
                  // por.value = (e.target as HTMLSelectElement).value;
                  parametrosBusqueda.buscarPor = (e.target as HTMLSelectElement).value;
                  document.getElementById('in_BusquedaVehiculo_VEHICULO')?.focus();
                }}
              >
                <option value={'Placa'} selected={parametrosBusqueda.buscarPor === 'Placa'}>
                  Placa
                </option>
                <option value={'Marca'} selected={parametrosBusqueda.buscarPor === 'Marca'}>
                  Marca
                </option>
                <option value={'Modelo'} selected={parametrosBusqueda.buscarPor === 'Modelo'}>
                  Modelo
                </option>
                <option value={'VIN'} selected={parametrosBusqueda.buscarPor === 'VIN'}>
                  VIN
                </option>
              </select>
            </div>
          </div>
          {/* DNI RUC */}
          <div class="form-control">
            <label></label>
            <div class="form-control form-agrupado">
              <input
                id="in_BusquedaVehiculo_VEHICULO"
                style={{ width: '100%' }}
                autoFocus
                placeholder="Ingrese el valor a buscar"
                type="text"
                value={parametrosBusqueda.cadenaABuscar}
                onChange$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                }}
                onKeyUp$={(e) => {
                  if (e.key === 'Enter') {
                    localizarVehiculos();
                    // if ((document.getElementById('inputBusquedaVehiculo_MICE') as HTMLInputElement).value.trim() !== '') {
                    //   buscarVehiculos.value++;
                    // } else {
                    //   alert('Ingrese un valor a buscar');
                    //   document.getElementById('inputBusquedaVehiculo_MICE')?.focus();
                    // }
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('se_buscarPor_VEHICULO')?.focus();
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
                  localizarVehiculos();
                  //   if ((document.getElementById('inputBusqueda') as HTMLInputElement).value.trim() !== '') {
                  //     buscarVehiculos.value++;
                  //   } else {
                  //     alert('Ingrese un valor a buscar');
                  //     document.getElementById('inputBusqueda')?.focus();
                  //   }
                })}
              />
              <ImgButton
                src={images.add}
                alt="Icono de adicionar vehículo"
                height={16}
                width={16}
                title="Adicionar vehículo"
                onClick={$(() => {
                  definicion_CTX_BUSCAR_VEHICULO.vV = [];
                  definicion_CTX_BUSCAR_VEHICULO.mostrarPanelNewEditVehiculo = true;
                })}
              />
            </div>
          </div>
        </div>
        {definicion_CTX_BUSCAR_VEHICULO.mostrarPanelNewEditVehiculo && (
          <div class="modal">
            <NewEditVehiculo
              // soloPersonaNatural={props.soloPersonasNaturales}
              vehiculoSelecci={definicion_CTX_BUSCAR_VEHICULO.vV}
              contexto={props.contexto}
            />
          </div>
        )}
        {/* TABLA DE PERSONAS HALLADAS*/}
        <div class="form-control">
          {buscarVehiculos.value > 0 ? (
            <TablaVehiculosHallados
              buscarVehiculos={buscarVehiculos.value}
              parametrosBusqueda={parametrosBusqueda}
              contexto={props.contexto}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});
