import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { parametrosGlobales } from '~/routes/login';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import TablaServiciosHallados from './tablaServiciosHallados';
import ServicioSeleccionado from './servicioSeleccionado';
import { IServicioSeleccionado } from '~/interfaces/iOrdenServicio';

export const CTX_SERVICIO_SELECCIONADO = createContextId<IServicioSeleccionado>('serviSeleccionado');

export default component$(() => {
  //#region DEFINICION CTX_SERVICIO_SELECCIONADO
  const defini_CTX_SERVICIO_SELECCIONADO = useStore<IServicioSeleccionado>({
    sS: [],
  });
  useContextProvider(CTX_SERVICIO_SELECCIONADO, defini_CTX_SERVICIO_SELECCIONADO);
  //#endregion DEFINICION CTX_SERVICIO_SELECCIONADO

  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarServicio = useSignal(0);
  const por = useSignal('Descripción');
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
        // width: ancho,
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
            ctx_docs_orden_servicio.mostrarPanelSeleccionarServicio0 = false;
          })}
          //   onClick={() => {
          //     const soloCerrar = true;
          //     onCerrar({ soloCerrar });
          //   }}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('buscarServicio.value', buscarServicio.value);
          })}
          //   onClick={() => {
          //     const soloCerrar = true;
          //     onCerrar({ soloCerrar });
          //   }}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h2 style={{ marginBottom: '10px' }}>Seleccionar servicio</h2>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <label>Buscar por</label>
            <div class="form-control form-agrupado">
              <select
                id="buscarPor"
                disabled
                style={{ width: '100%' }}
                value={por.value}
                onChange$={(e) => {
                  por.value = (e.target as HTMLSelectElement).value;
                  document.getElementById('inputBusqueda')?.focus();
                }}
              >
                <option value={'Código'}>Código</option>
                <option value={'Descripción'}>Descripción</option>
              </select>
            </div>
          </div>
          {/* Codigo Descripcion */}
          <div class="form-control">
            <label></label>
            <div class="form-control form-agrupado">
              <input
                id="inputBusquedaServicio"
                style={{ width: '100%' }}
                type="text"
                value={cadena.value}
                onChange$={(e) => {
                  cadena.value = (e.target as HTMLInputElement).value;
                }}
                onKeyUp$={(e) => {
                  if (e.key === 'Enter') {
                    if ((document.getElementById('inputBusquedaServicio') as HTMLInputElement).value.trim() !== '') {
                      buscarServicio.value++;
                    } else {
                      alert('Ingrese un valor a buscar');
                      document.getElementById('inputBusquedaServicio')?.focus();
                    }
                  }
                  //   if (e.key === 'Escape') {
                  //     document.getElementById('buscarPor')?.focus();
                  //   }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <ImgButton
                src={images.searchPLUS}
                alt="Icono de buscar persona"
                height={16}
                width={16}
                title="Buscar persona"
                // onClick={localizarServicios}
                onClick={$(() => {
                  if ((document.getElementById('inputBusquedaServicio') as HTMLInputElement).value.trim() !== '') {
                    console.log('buscarServicio.value++', buscarServicio.value, parametrosBusqueda);
                    buscarServicio.value++;
                  } else {
                    alert('Ingrese un valor a buscar');
                    document.getElementById('inputBusquedaServicio')?.focus();
                  }
                })}
              />
              <ImgButton
                src={images.add}
                alt="Icono de adicionar servicio"
                height={16}
                width={16}
                title="Adicionar servicio"
                // onClick={addServicio}
              />
            </div>
          </div>
        </div>
        {/* {showPanelAgregarServicio && (
          <Modal
            componente={
              <NewEditServicio
                ancho={'470px'}
                inicializacion={inicializacionServicio}
                parametrosGlobales={parametrosGlobales}
                onCerrar={cerrarPanelNewEditServicio}
              />
            }
          />
        )} */}
        {/* TABLA DE SERVICOS HALLADOS*/}
        <div class="form-control">
          {buscarServicio.value > 0 ? (
            <TablaServiciosHallados buscarServicio={buscarServicio.value} parametrosBusqueda={parametrosBusqueda} />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen servicios localizados</i>
          )}
          {ctx_docs_orden_servicio.mostrarServicioSeleccionado && (
            <div class="modal">
              <ServicioSeleccionado
                // ancho={400}
                servicioSeleccionado={defini_CTX_SERVICIO_SELECCIONADO.sS}
                // esAlmacen={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
