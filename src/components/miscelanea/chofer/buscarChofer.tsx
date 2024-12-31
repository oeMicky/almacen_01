import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import TablaChoferes from './tablaChoferes';
import BuscarPersona from '../persona/buscarPersona';
import { parametrosGlobales } from '~/routes/login';
import { CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import { inUpChofer } from '~/apis/chofer.api';
import EditChofer from './editChofer';

export const CTX_BUSCAR_CHOFER = createContextId<any>('buscar_chofer');

export default component$((props: { contexto: string }) => {
  //#region DEFINICION CTX_BUSCAR_CHOFER
  const definicion_CTX_BUSCAR_CHOFER = useStore({
    cH: [],
    // grabo_Tecnico: false,
    buscarPor: 'DNI / RUC',
    conceptoABuscar: '',

    mostrarPanelBuscarPersona: false,
    idPersona: '',
    selecciono_Persona: false,

    mostrarPanelEditChofer: false,
    actualizo_Chofer: false,
  });
  useContextProvider(CTX_BUSCAR_CHOFER, definicion_CTX_BUSCAR_CHOFER);
  //#endregion DEFINICION CTX_BUSCAR_CHOFER

  //#region CONTEXTO
  // const ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
  //#endregion CONTEXTO

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
  const buscarChofer = useSignal(0);
  //#endregion INICIALIZACION

  //#region BUSCAR CHOFERES
  const localizarChoferes = $(() => {
    if (definicion_CTX_BUSCAR_CHOFER.conceptoABuscar === '') {
      alert('Ingrese un valor para su busqueda!!!');
      document.getElementById('in_conceptoABuscar_CHOFER')?.focus();
      return;
    }
    buscarChofer.value++;
  });
  //#endregion BUSCAR CHOFERES

  //#region SELECCIONO PERSONA -> INSERTAR CHOFER
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_BUSCAR_CHOFER.selecciono_Persona);
    if (definicion_CTX_BUSCAR_CHOFER.selecciono_Persona) {
      //insertando/actualizando -> ACTIVO: TRUE
      await inUpChofer({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idPersona: definicion_CTX_BUSCAR_CHOFER.idPersona,
        activo: true,

        usuario: parametrosGlobales.usuario,
      });

      //console.log('el chofer creado/actualizado', chofer);
      //buscando al CHOFER
      definicion_CTX_BUSCAR_CHOFER.buscarPor = 'DNI / RUC';
      localizarChoferes();
      //

      definicion_CTX_BUSCAR_CHOFER.selecciono_Persona = false;
    }
  });
  //#endregion SELECCIONO PERSONA -> INSERTAR CHOFER

  //#region REFRESCAR TABLA
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_BUSCAR_CHOFER.actualizo_Chofer);

    if (definicion_CTX_BUSCAR_CHOFER.actualizo_Chofer) {
      buscarChofer.value++;
      definicion_CTX_BUSCAR_CHOFER.actualizo_Chofer = false;
    }
  });
  //#endregion REFRESCAR TABLA

  return (
    <>
      <div
        style={{
          // width: props.ancho + 'px',
          width: 'clamp(330px, 86%, 680px)',
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
              ctx.mostrarPanelBuscarConductor = false;
              ctx.selecciono_Chofer = false;
            })}
          />
        </div>
        {/* FORMULARIO */}
        <div class="add-form">
          {/* TITULO */}
          <h3 style={{ marginBottom: '10px' }}>Buscar conductor</h3>
          {/* ZONA DE BUSQUEDA */}
          <div>
            {/* Buscar por */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <select
                  id="se_buscarPor_CHOFER"
                  style={{ width: '100%' }}
                  onChange$={(e) => {
                    definicion_CTX_BUSCAR_CHOFER.buscarPor = (e.target as HTMLSelectElement).value;
                    document.getElementById('in_conceptoABuscar_CHOFER')?.focus();
                  }}
                >
                  <option value={'DNI / RUC'} selected={definicion_CTX_BUSCAR_CHOFER.buscarPor === 'DNI / RUC'}>
                    DNI / RUC
                  </option>
                  <option value={'Nombre / Razón social'} selected={definicion_CTX_BUSCAR_CHOFER.buscarPor === 'Nombre / Razón social'}>
                    Nombre / Razón social
                  </option>
                </select>
              </div>
            </div>
            {/* CONCEPTO A BUSCAR  */}
            <div class="form-control">
              <div class="form-control form-agrupado" style={{ gap: '4px' }}>
                <input
                  id="in_conceptoABuscar_CHOFER"
                  style={{ width: '100%' }}
                  type={definicion_CTX_BUSCAR_CHOFER.buscarPor === 'DNI / RUC' ? 'number' : 'text'}
                  autoFocus
                  value={definicion_CTX_BUSCAR_CHOFER.conceptoABuscar}
                  onInput$={(e) => {
                    definicion_CTX_BUSCAR_CHOFER.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      if (definicion_CTX_BUSCAR_CHOFER.conceptoABuscar === '') {
                        //console.log('definicion_CTX_BUSCAR_PERSONA.conceptoABuscar...esta mal?', definicion_CTX_BUSCAR_CHOFER.conceptoABuscar);
                        alert('Ingrese un valor para su busqueda.{.{.');
                        document.getElementById('in_conceptoABuscar_CHOFER')?.focus();
                        return;
                      }
                      buscarChofer.value++;
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
                  // style={{ marginLeft: '4px' }}
                  onClick$={() => {
                    localizarChoferes();
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
                    definicion_CTX_BUSCAR_CHOFER.cH = [];
                    definicion_CTX_BUSCAR_CHOFER.mostrarPanelBuscarPersona = true;
                  }}
                />
              </div>
            </div>
          </div>
          {definicion_CTX_BUSCAR_CHOFER.mostrarPanelBuscarPersona && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={true} seleccionar="persona" contexto="new_edit_guiaRemision" rol="chofer" />
            </div>
          )}
          {definicion_CTX_BUSCAR_CHOFER.mostrarPanelEditChofer && (
            <div class="modal">
              <EditChofer choferSeleccionado={definicion_CTX_BUSCAR_CHOFER.cH} />
            </div>
          )}
          {/* TABLA DE CHOFERES HALLADOS*/}
          <div class="form-control">{buscarChofer.value > 0 ? <TablaChoferes buscarChofer={buscarChofer.value} contexto={props.contexto} /> : ''}</div>
        </div>
      </div>
    </>
  );
});
