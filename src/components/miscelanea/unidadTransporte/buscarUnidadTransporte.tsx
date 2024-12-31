import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import ImgButton from '~/components/system/imgButton';
import BuscarVehiculo from '../vehiculo/buscarVehiculo';
import EditUnidadTransporte from './editUnidadTransporte';
import TablaUnidadesTransporte from './tablaUnidadesTransporte';
import { parametrosGlobales } from '~/routes/login';
import { inUpUnidadTransporte } from '~/apis/unidadTransporte.api';

export const CTX_BUSCAR_UNIDAD_TRANSPORTE = createContextId<any>('buscar_unidad_transporte');

export default component$((props: { contexto: string; tipo: string }) => {
  //#region DEFINICION CTX_BUSCAR_UNIDAD_TRASNPORTE
  const definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE = useStore({
    uT: [],
    grabo_unidad_transporte: false,
    buscarPor: 'Placa',
    conceptoABuscar: '',

    mostrarPanelBuscarVehiculo: false,
    idVehiculo: '',
    selecciono_Vehiculo: false,

    mostrarPanelEditUnidadTransporte: false,
    actualizo_UnidadTransporte: false,
  });
  useContextProvider(CTX_BUSCAR_UNIDAD_TRANSPORTE, definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE);
  //#endregion DEFINICION CTX_BUSCAR_UNIDAD_TRASNPORTE

  //#region CONTEXTO
  const ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const buscarUnidadTransporte = useSignal(0);
  //#endregion INICIALIZACION

  //#region BUSCAR UNIDAD_TRASNPORTE
  const localizarUnidadesTransporte = $(() => {
    if (definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.conceptoABuscar === '') {
      alert('Ingrese un valor para su busqueda!!!');
      document.getElementById('in_conceptoABuscar_CHOFER')?.focus();
      return;
    }
    buscarUnidadTransporte.value++;
  });
  //#endregion BUSCAR UNIDAD_TRASNPORTE

  //#region SELECCIONO VEHICULO -> INSERTAR UNIDAD TRANSPORTE
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.selecciono_Vehiculo);
    if (definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.selecciono_Vehiculo) {
      //insertando/actualizando -> ACTIVO: TRUE
      await inUpUnidadTransporte({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idVehiculo: definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.idVehiculo,
        activo: true,

        usuario: parametrosGlobales.usuario,
      });

      //console.log('la uniTransp creado/actualizado', uniTransp);
      //buscando al CHOFER
      definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.buscarPor = 'Placa';
      localizarUnidadesTransporte();
      //

      definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.selecciono_Vehiculo = false;
    }
  });
  //#endregion SELECCIONO VEHICULO -> INSERTAR UNIDAD TRANSPORTE

  //#region REFRESCAR TABLA
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.actualizo_UnidadTransporte);

    if (definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.actualizo_UnidadTransporte) {
      buscarUnidadTransporte.value++;
      definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.actualizo_UnidadTransporte = false;
    }
  });
  //#endregion REFRESCAR TABLA

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(330px, 86%, 640px)',
        // width: 'auto',
        padding: '2px',
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
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            if (props.tipo === 'principal') {
              ctx.mostrarPanelBuscarUnidadTransportePrincipal = false;
            } else {
              ctx.mostrarPanelBuscarUnidadTransporteSecundario = false;
            }

            ctx.selecciono_Conductor = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px' }}>Buscar unidad de transporte</h3>
        {/* ZONA DE BUSQUEDA */}
        <div>
          {/* Buscar por */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="se_buscarPor_CHOFER"
                style={{ width: '100%' }}
                onChange$={(e) => {
                  definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.buscarPor = (e.target as HTMLSelectElement).value;
                  document.getElementById('in_conceptoABuscar_CHOFER')?.focus();
                }}
              >
                <option value={'Placa'} selected={definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.buscarPor === 'Placa'}>
                  Placa
                </option>
                <option value={'Marca'} selected={definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.buscarPor === 'Marca'}>
                  Marca
                </option>
              </select>
            </div>
          </div>
          {/* CONCEPTO A BUSCAR  */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_conceptoABuscar_CHOFER"
                style={{ width: '100%' }}
                type="text"
                autoFocus
                value={definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.conceptoABuscar}
                onInput$={(e) => {
                  definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    if (definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.conceptoABuscar === '') {
                      //console.log('definicion_CTX_BUSCAR_PERSONA.conceptoABuscar...esta mal?', definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.conceptoABuscar);
                      alert('Ingrese un valor para su busqueda.{.{.');
                      document.getElementById('in_conceptoABuscar_CHOFER')?.focus();
                      return;
                    }
                    buscarUnidadTransporte.value++;
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('se_buscarPor_CHOFER')?.focus();
                  }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <input
                type="image"
                src={images.searchPLUS}
                title="Buscar chofer"
                alt="Icono de buscar chofer"
                height={16}
                width={16}
                style={{ margin: '0 4px' }}
                onClick$={() => {
                  localizarUnidadesTransporte();
                }}
              />
              <input
                type="image"
                src={images.add}
                alt="Icono de adicionar persona"
                height={16}
                width={16}
                title="Adicionar persona"
                onClick$={() => {
                  definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.uT = [];
                  definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.mostrarPanelBuscarVehiculo = true;
                }}
              />
            </div>
          </div>
        </div>
        {definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.mostrarPanelBuscarVehiculo && (
          <div class="modal">
            <BuscarVehiculo contexto="buscar_unidadTransporte" />
          </div>
        )}
        {definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.mostrarPanelEditUnidadTransporte && (
          <div class="modal">
            <EditUnidadTransporte uniTranspSeleccionado={definicion_CTX_BUSCAR_UNIDAD_TRANSPORTE.uT} />
          </div>
        )}
        {/* TABLA DE CHOFERES HALLADOS*/}
        <div class="form-control">
          {buscarUnidadTransporte.value > 0 ? (
            <TablaUnidadesTransporte buscarUnidadTransporte={buscarUnidadTransporte.value} contexto={props.contexto} tipo={props.tipo} />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});
