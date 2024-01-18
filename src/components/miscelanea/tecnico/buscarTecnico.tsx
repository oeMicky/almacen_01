import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_EDIT_ORDEN_SERVICIO } from '~/components/ordenServicio/newEditOrdenServicio';
import ImgButton from '~/components/system/imgButton';
import TablaTecnicos from './tablaTecnicos';
import BuscarPersona from '../persona/buscarPersona';
import { inUpTecnico } from '~/apis/tecnico.api';
import { parametrosGlobales } from '~/routes/login';

export const CTX_BUSCAR_TECNICO = createContextId<any>('buscar_tecnico');

export default component$((props: { contexto: string }) => {
  //#region DEFINICION CTX_BUSCAR_TECNICO
  const definicion_CTX_BUSCAR_TECNICO = useStore({
    tT: [],
    grabo_Tecnico: false,
    buscarPor: 'DNI / RUC',
    conceptoABuscar: '',

    mostrarPanelBuscarPersona: false,
    idPersona: '',
    selecciono_Persona: false,
  });
  useContextProvider(CTX_BUSCAR_TECNICO, definicion_CTX_BUSCAR_TECNICO);
  //#endregion DEFINICION CTX_BUSCAR_TECNICO

  //#region CONTEXTO
  // const ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
  //#endregion CONTEXTO

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'orden_servicio':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      // documento = useContext(CTX_O_S);
      break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarTecnico = useSignal(0);
  //#endregion INICIALIZACION

  //#region BUSCAR TÉCNICOS
  const localizarTecnicos = $(() => {
    if (definicion_CTX_BUSCAR_TECNICO.conceptoABuscar === '') {
      alert('Ingrese un valor para su busqueda!!!');
      document.getElementById('in_conceptoABuscar_TECNICO')?.focus();
      return;
    }
    buscarTecnico.value++;
  });
  //#endregion BUSCAR TÉCNICOS

  //#region SELECCIONO PERSONA
  useTask$(async ({ track }) => {
    track(() => definicion_CTX_BUSCAR_TECNICO.selecciono_Persona);
    if (definicion_CTX_BUSCAR_TECNICO.selecciono_Persona) {
      //insertando/actualizando -> ACTIVO: TRUE
      const tecni = await inUpTecnico({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idPersona: definicion_CTX_BUSCAR_TECNICO.idPersona,
        activo: true,

        usuario: parametrosGlobales.usuario,
      });

      console.log('el tecnico creado/actualizado', tecni);
      //buscando al TECNICO
      definicion_CTX_BUSCAR_TECNICO.buscarPor = 'DNI / RUC';
      localizarTecnicos();
      //

      definicion_CTX_BUSCAR_TECNICO.selecciono_Persona = false;
    }
  });
  //#endregion SELECCIONO PERSONA

  return (
    <>
      <div
        style={{
          // width: props.ancho + 'px',
          width: 'clamp(338px, 86%, 700px)',
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
            height={16}
            width={16}
            title="Cerrar el formulario"
            onClick={$(() => {
              ctx.mostrarPanelBuscarTecnico = false;
              ctx.selecciono_Tecnico = false;
            })}
          />
        </div>
        {/* FORMULARIO */}
        <div class="add-form">
          {/* TITULO */}
          <h3 style={{ marginBottom: '10px' }}>Buscar técnico</h3>
          {/* ZONA DE BUSQUEDA */}
          <div>
            {/* Buscar por */}
            <div class="form-control">
              <label>Buscar por</label>
              <div class="form-control form-agrupado">
                <select
                  id="se_buscarPor_TECNICO"
                  style={{ width: '100%' }}
                  onChange$={(e) => {
                    definicion_CTX_BUSCAR_TECNICO.buscarPor = (e.target as HTMLSelectElement).value;
                    document.getElementById('in_conceptoABuscar_TECNICO')?.focus();
                  }}
                >
                  <option value={'DNI / RUC'} selected={definicion_CTX_BUSCAR_TECNICO.buscarPor === 'DNI / RUC'}>
                    DNI / RUC
                  </option>
                  <option
                    value={'Nombre / Razón social'}
                    selected={definicion_CTX_BUSCAR_TECNICO.buscarPor === 'Nombre / Razón social'}
                  >
                    Nombre / Razón social
                  </option>
                </select>
              </div>
            </div>
            {/* CONCEPTO A BUSCAR  */}
            <div class="form-control">
              <label></label>
              <div class="form-control form-agrupado">
                <input
                  id="in_conceptoABuscar_TECNICO"
                  style={{ width: '100%' }}
                  type="text"
                  autoFocus
                  value={definicion_CTX_BUSCAR_TECNICO.conceptoABuscar}
                  onInput$={(e) => {
                    definicion_CTX_BUSCAR_TECNICO.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      if (definicion_CTX_BUSCAR_TECNICO.conceptoABuscar === '') {
                        console.log(
                          'definicion_CTX_BUSCAR_PERSONA.conceptoABuscar...esta mal?',
                          definicion_CTX_BUSCAR_TECNICO.conceptoABuscar
                        );
                        alert('Ingrese un valor para su busqueda.{.{.');
                        document.getElementById('in_conceptoABuscar_TECNICO')?.focus();
                        return;
                      }
                      buscarTecnico.value++;
                    }
                    if (e.key === 'Escape') {
                      document.getElementById('se_buscarPor_TECNICO')?.focus();
                    }
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <ImgButton
                  src={images.searchPLUS}
                  alt="Icono de buscar técnico"
                  height={16}
                  width={16}
                  title="Buscar técnico"
                  onClick={$(() => {
                    localizarTecnicos();
                  })}
                />
                <ImgButton
                  src={images.add}
                  alt="Icono de adicionar persona"
                  height={16}
                  width={16}
                  title="Adicionar persona"
                  onClick={$(() => {
                    definicion_CTX_BUSCAR_TECNICO.tT = [];
                    definicion_CTX_BUSCAR_TECNICO.mostrarPanelBuscarPersona = true;
                  })}
                />
              </div>
            </div>
          </div>
          {definicion_CTX_BUSCAR_TECNICO.mostrarPanelBuscarPersona && (
            <div class="modal">
              <BuscarPersona soloPersonasNaturales={true} seleccionar="persona" contexto="buscar_tecnico" rol="persona" />
            </div>
          )}
          {/* TABLA DE TÉCNICOS HALLADOS*/}
          <div class="form-control">
            {buscarTecnico.value > 0 ? <TablaTecnicos buscarTecnico={buscarTecnico.value} contexto={props.contexto} /> : ''}
          </div>
        </div>
      </div>
    </>
  );
});
