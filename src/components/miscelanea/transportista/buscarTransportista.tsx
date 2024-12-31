import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import ImgButton from '~/components/system/imgButton';
import { parametrosGlobales } from '~/routes/login';
import EditTransportista from './editTransportista';
import BuscarPersona from '../persona/buscarPersona';
import TablaTransportistas from './tablaTransportistas';
import { inUpTransportista } from '~/apis/transportista.api';

export const CTX_BUSCAR_TRANSPORTISTA = createContextId<any>('buscar_transportista');

export default component$((props: { contexto: string }) => {
  //#region DEFINICION CTX_BUSCAR_TRANSPORTISTA
  const definicion_CTX_BUSCAR_TRANSPORTISTA = useStore({
    tR: [],
    // grabo_Tecnico: false,
    buscarPor: 'DNI / RUC',
    conceptoABuscar: '',

    mostrarPanelBuscarTransportista: false,
    idPersona: '',
    selecciono_Persona: false,

    mostrarPanelEditTransportista: false,
    actualizo_Transportista: false,
  });
  useContextProvider(CTX_BUSCAR_TRANSPORTISTA, definicion_CTX_BUSCAR_TRANSPORTISTA);
  //#endregion DEFINICION CTX_BUSCAR_TRANSPORTISTA

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'new_edit_guiaRemision':
      ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
      // documento = useContext(CTX_O_S);
      break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarTransportista = useSignal(0);
  //#endregion INICIALIZACION

  //#region BUSCAR TRANSPORTISTAS
  const localizarTransportistas = $(() => {
    if (definicion_CTX_BUSCAR_TRANSPORTISTA.conceptoABuscar === '') {
      alert('Ingrese un valor para su busqueda!!!');
      document.getElementById('in_conceptoABuscar_CHOFER')?.focus();
      return;
    }
    buscarTransportista.value++;
  });
  //#endregion BUSCAR TRANSPORTISTAS

  //#region SELECCIONO PERSONA -> INSERTAR TRANSPORTISTA
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_BUSCAR_TRANSPORTISTA.selecciono_Persona);

    if (definicion_CTX_BUSCAR_TRANSPORTISTA.selecciono_Persona) {
      //insertando/actualizando -> ACTIVO: TRUE
      //console.log('🌝🌝🌝🌝......grabando TRANSPORTISTA.....');
      await inUpTransportista({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idPersona: definicion_CTX_BUSCAR_TRANSPORTISTA.idPersona,
        activo: true,

        usuario: parametrosGlobales.usuario,
      });

      //console.log('el TRANSPORTISTA creado/actualizado', transportista);
      //buscando al TRANSPORTISTA
      definicion_CTX_BUSCAR_TRANSPORTISTA.buscarPor = 'DNI / RUC';
      localizarTransportistas();
      //

      definicion_CTX_BUSCAR_TRANSPORTISTA.selecciono_Persona = false;
    }
  });
  //#endregion SELECCIONO PERSONA -> INSERTAR TRANSPORTISTA

  //#region REFRESCAR TABLA
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_BUSCAR_TRANSPORTISTA.actualizo_Transportista);

    if (definicion_CTX_BUSCAR_TRANSPORTISTA.actualizo_Transportista) {
      buscarTransportista.value++;
      definicion_CTX_BUSCAR_TRANSPORTISTA.actualizo_Transportista = false;
    }
  });
  //#endregion REFRESCAR TABLA

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(330px, 86%, 700px)',
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
            ctx.mostrarPanelBuscarTransportista = false;
            ctx.selecciono_Transportista = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px' }}>Buscar Transportista</h3>
        {/* ZONA DE BUSQUEDA */}
        <div>
          {/* Buscar por */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="se_buscarPor_Transportista"
                style={{ width: '100%' }}
                onChange$={(e) => {
                  definicion_CTX_BUSCAR_TRANSPORTISTA.buscarPor = (e.target as HTMLSelectElement).value;
                  document.getElementById('in_conceptoABuscar_Transportista')?.focus();
                }}
              >
                <option value={'DNI / RUC'} selected={definicion_CTX_BUSCAR_TRANSPORTISTA.buscarPor === 'DNI / RUC'}>
                  DNI / RUC
                </option>
                <option value={'Nombre / Razón social'} selected={definicion_CTX_BUSCAR_TRANSPORTISTA.buscarPor === 'Nombre / Razón social'}>
                  Nombre / Razón social
                </option>
              </select>
            </div>
          </div>
          {/* CONCEPTO A BUSCAR  */}
          <div class="form-control">
            <div class="form-control form-agrupado" style={{ gap: '4px' }}>
              <input
                id="in_conceptoABuscar_Transportista"
                style={{ width: '100%' }}
                type={definicion_CTX_BUSCAR_TRANSPORTISTA.buscarPor === 'DNI / RUC' ? 'number' : 'text'}
                autoFocus
                value={definicion_CTX_BUSCAR_TRANSPORTISTA.conceptoABuscar}
                onInput$={(e) => {
                  definicion_CTX_BUSCAR_TRANSPORTISTA.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    if (definicion_CTX_BUSCAR_TRANSPORTISTA.conceptoABuscar === '') {
                      //console.log('definicion_CTX_BUSCAR_PERSONA.conceptoABuscar...esta mal?', definicion_CTX_BUSCAR_TRANSPORTISTA.conceptoABuscar);
                      alert('Ingrese un valor para su busqueda.{.{.');
                      document.getElementById('in_conceptoABuscar_Transportista')?.focus();
                      return;
                    }
                    buscarTransportista.value++;
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('se_buscarPor_Transportista')?.focus();
                  }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <input
                type="image"
                src={images.searchPLUS}
                title="Buscar Transportista"
                alt="Icono de buscar Transportista"
                height={16}
                width={16}
                // style={{ marginLeft: '4px' }}
                onClick$={() => {
                  localizarTransportistas();
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
                  definicion_CTX_BUSCAR_TRANSPORTISTA.tR = [];
                  definicion_CTX_BUSCAR_TRANSPORTISTA.mostrarPanelBuscarTransportista = true;
                }}
              />
            </div>
          </div>
        </div>
        {definicion_CTX_BUSCAR_TRANSPORTISTA.mostrarPanelBuscarTransportista && (
          <div class="modal">
            <BuscarPersona soloPersonasNaturales={false} seleccionar="persona" contexto="new_edit_guiaRemision" rol="transportista" />
          </div>
        )}
        {definicion_CTX_BUSCAR_TRANSPORTISTA.mostrarPanelEditTransportista && (
          <div class="modal">
            <EditTransportista transportistaSeleccionado={definicion_CTX_BUSCAR_TRANSPORTISTA.tR} />
          </div>
        )}
        {/* TABLA DE TansportistaES HALLADOS*/}
        <div class="form-control">
          {buscarTransportista.value > 0 ? <TablaTransportistas buscarTransportista={buscarTransportista.value} contexto={props.contexto} /> : ''}
        </div>
      </div>
    </div>
  );
});
