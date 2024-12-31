import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_EDIT_GUIA_REMISION } from './newEditGuiaRemision';
import NewEditDireccionGR from './newEditDireccionGR';
import Spinner from '../system/spinner';
// import { obtenerDireccionesGR } from "~/apis/guiaRemision.api";
// import { parametrosGlobales } from "~/routes/login";
import TablaDireccionesGR from './tablaDireccionesGR';
import { parametrosGlobales } from '~/routes/login';

export const CTX_BUSCAR_DIRECCION_GR = createContextId<any>('__buscar_direccion_GR');

export default component$((props: { sentido: string }) => {
  //#region definicion_CTX_BUSCAR_DIRECCION_GR
  const definicion_CTX_BUSCAR_DIRECCION_GR = useStore({
    dGR: [],
    misDireccionesGR: [],
    grabo_DireccionGR: false,
    buscarPor: 'dirección',
    conceptoABuscar: '',
    // solo_Direccion: false,

    mostrarPanelNewEditDireccionGR: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_BUSCAR_DIRECCION_GR, definicion_CTX_BUSCAR_DIRECCION_GR);
  //#endregion definicion_CTX_BUSCAR_DIRECCION_GR

  //#region CONTEXTOS
  const ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarDireccionesGR = useSignal(0);
  //#endregion INICIALIZACION

  //#region REFRESCAR grabo_DireccionGR
  useTask$(({ track }) => {
    track(() => definicion_CTX_BUSCAR_DIRECCION_GR.grabo_DireccionGR);
    //console.log("✨🧨🎇🎈🎈🎈", definicion_CTX_BUSCAR_DIRECCION_GR.grabo_DireccionGR);
    if (definicion_CTX_BUSCAR_DIRECCION_GR.grabo_DireccionGR) {
      buscarDireccionesGR.value++;
      // definicion_CTX_BUSCAR_DIRECCION_GR.mostrarSpinner = false;
      // definicion_CTX_BUSCAR_DIRECCION_GR.solo_Direccion = false;
      definicion_CTX_BUSCAR_DIRECCION_GR.grabo_DireccionGR = false;
    }
  });
  //#endregion REFRESCAR grabo_DireccionGR

  //#region BUSCAR DIRECCIONES GR
  const localizarDireccionesGR = $(async () => {
    if (definicion_CTX_BUSCAR_DIRECCION_GR.conceptoABuscar.trim() === '') {
      alert('Ingrese la dirección');
      document.getElementById('in_conceptoABuscar_DIRECCION_GR')?.focus();
      return;
    }
    definicion_CTX_BUSCAR_DIRECCION_GR.mostrarSpinner = true;

    buscarDireccionesGR.value++;

    // await obtenerDireccionesGR({
    //   idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    //   idEmpresa: parametrosGlobales.idEmpresa,
    //   cadenaABuscar: definicion_CTX_BUSCAR_DIRECCION_GR.conceptoABuscar,
    // });
  });
  //#endregion BUSCAR DIRECCIONES GR

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(330px, 86%, 600px)',
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
            if (props.sentido === 'partida') {
              ctx.mostrarPanelBuscarPuntoPartida = false;
            }
            if (props.sentido === 'llegada') {
              ctx.mostrarPanelBuscarPuntoLlegada = false;
            }
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log('definicion_CTX_BUSCAR_PERSONA', definicion_CTX_BUSCAR_PERSONA);
            // //console.log('parametrosBusqueda', parametrosBusqueda);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            //console.log('definicion_CTX_BUSCAR_PERSONA.conceptoABuscar', definicion_CTX_BUSCAR_PERSONA.conceptoABuscar);
            // //console.log('parametrosBusqueda.cadenaABuscar', parametrosBusqueda.cadenaABuscar);
          })}
        /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '12px' }}>Buscar dirección de {props.sentido}</h3>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '8px' }}>
          {/* CONCEPTO A BUSCAR  */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_conceptoABuscar_DIRECCION_GR"
                style={{ width: '100%' }}
                type={'text'}
                value={definicion_CTX_BUSCAR_DIRECCION_GR.conceptoABuscar}
                // onFocusout$={() => localizarPersonas()}
                onInput$={(e) => {
                  definicion_CTX_BUSCAR_DIRECCION_GR.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    localizarDireccionesGR();
                    document.getElementById('in_BuscarDireccionGR')?.focus();
                  }
                }}
                // onKeyDown$={(e) => {
                //   if (e.key === 'Escape') {
                //     document.getElementById('se_buscarPor_PERSONA')?.focus();
                //   }
                //   if (e.key === 'Enter') {
                //     document.getElementById('in_BuscarPersona')?.focus();
                //   }
                // }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <input
                id="in_BuscarDireccionGR"
                type="image"
                src={images.searchPLUS}
                title="Buscar dirección"
                alt="buscar"
                height={16}
                width={16}
                style={{ margin: '0px 4px' }}
                onClick$={() => localizarDireccionesGR()}
              />
              <input
                id="in_AdicionarDireccionGR"
                type="image"
                src={images.add}
                title="Adicionar dirección"
                alt="adicionar"
                height={16}
                width={16}
                style={{ marginRight: '2px' }}
                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                onClick$={() => {
                  definicion_CTX_BUSCAR_DIRECCION_GR.dGR = [];
                  definicion_CTX_BUSCAR_DIRECCION_GR.mostrarPanelNewEditDireccionGR = true;
                }}
              />
            </div>
          </div>
        </div>
        {/* NEW - PERSONA*/}
        {definicion_CTX_BUSCAR_DIRECCION_GR.mostrarPanelNewEditDireccionGR && (
          <div class="modal">
            <NewEditDireccionGR
              dGR={definicion_CTX_BUSCAR_DIRECCION_GR.dGR}
              // soloPersonaNatural={props.soloPersonasNaturales}
              // personaSeleccio={definicion_CTX_BUSCAR_PERSONA.pP}
              // contexto={props.contexto}
            />
          </div>
        )}
        {/* TABLA DE DIRECCIONES GR*/}
        <div class="form-control">
          {buscarDireccionesGR.value > 0 ? (
            <TablaDireccionesGR
              buscarDireccionesGR={buscarDireccionesGR.value}
              // buscarDireccion={definicion_CTX_BUSCAR_DIRECCION_GR.solo_Direccion}
              sentido={props.sentido}
              parametrosBusqueda={{
                idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                idEmpresa: parametrosGlobales.idEmpresa,
                cadenaABuscar: definicion_CTX_BUSCAR_DIRECCION_GR.conceptoABuscar,
              }}
            />
          ) : (
            ''
          )}
        </div>
        {/* MOSTRAR SPINNER */}
        {definicion_CTX_BUSCAR_DIRECCION_GR.mostrarSpinner && (
          <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
});
