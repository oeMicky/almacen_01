import { $, component$, createContextId, useContext, useContextProvider, useStore, useTask$ } from '@builder.io/qwik'; //useSignal,
import { images } from '~/assets';
import ImgButton from '../../system/imgButton';
import TablaPersonasHalladas from './tablaPersonasHalladas';
import NewEditPersona from './newEditPersona';
import { CTX_NEW_EDIT_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
import { CTX_NEW_EDIT_ORDEN_SERVICIO } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_ADD_VENTA } from '~/components/venta/addVenta';
import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import { CTX_NEW_EDIT_COMPRA } from '~/components/compra/newEditCompra';
import { CTX_BUSCAR_TECNICO } from '../tecnico/buscarTecnico';
import { CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import { CTX_NEW_EDIT_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import { CTX_BUSCAR_CHOFER } from '../chofer/buscarChofer';
import VentasCliente from '../venta/ventasCliente';
import EditarPersona from './editarPersona';
import type { IPersonaEdit } from '~/interfaces/iPersona';
import VentasClienteVentasVarios from './ventasClienteVentasVarios';
import { CTX_NEW_EDIT_ORDEN_PRODUCCION } from '~/components/ordenProduccion/newEditOrdenProduccion';
import { CTX_BUSCAR_TRANSPORTISTA } from '../transportista/buscarTransportista';

export const CTX_BUSCAR_PERSONA = createContextId<any>('buscar_persona');

export default component$((props: { seleccionar?: string; soloPersonasNaturales: boolean; contexto: string; rol: string; motivo?: boolean }) => {
  //#region DEFINICION CTX_BUSCAR_PERSONA
  const definicion_CTX_BUSCAR_PERSONA = useStore({
    pP: [],
    misPersonas: [],
    grabo_Persona: false,
    buscarPor: 'DNI / RUC',
    conceptoABuscar: '',

    buscarPersona: 0,

    mostrarPanelNewEditPersona: false,

    mostrarPanelEditPersona: false,
    personaEDITADA: { _id: '', razonSocialNombre: '', direccion: '', email: '', telefono: '', cuentasCorrientes: [] },
  });
  useContextProvider(CTX_BUSCAR_PERSONA, definicion_CTX_BUSCAR_PERSONA);
  //#endregion DEFINICION CTX_BUSCAR_PERSONA

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'orden_produccion':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
      break;
    case 'orden_servicio':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      break;
    case 'venta':
      ctx = useContext(CTX_ADD_VENTA);
      break;
    case 'cotizacion':
      ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      break;
    case 'new_in_almacen':
      ctx = useContext(CTX_NEW_IN_ALMACEN);
      break;
    case 'new_out_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      break;
    case 'new_edit_guiaRemision':
      ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
      //console.log('sw ctx...°°°°°°°......CTX_NEW_EDIT_GUIA_REMISION');
      if (props.rol === 'transportista') {
        //console.log('sw context buscar_transportista...CTX_BUSCAR_TRANSPORTISTA');
        ctx = useContext(CTX_BUSCAR_TRANSPORTISTA);
      }
      if (props.rol === 'chofer') {
        //console.log('sw context buscar_chofer...CTX_BUSCAR_CHOFER');
        ctx = useContext(CTX_BUSCAR_CHOFER);
      }
      break;
    case 'new_edit_compra':
      ctx = useContext(CTX_NEW_EDIT_COMPRA);
      break;
    case 'buscar_tecnico':
      ctx = useContext(CTX_BUSCAR_TECNICO);
      break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  // const ini = useSignal(0);
  // const buscarPersona = useSignal(0);
  document.getElementById('in_conceptoABuscar_PERSONA')?.focus();
  // useTask$(({ track }) => {
  //   track(() => ini.value);
  //   //console.log('inicializando...');
  //   document.getElementById('in_conceptoABuscar_PERSONA')?.focus();
  // });
  //#endregion INICIALIZACION

  // const por = useSignal('DNI / RUC');
  // const cadena = useSignal('');

  // const parametrosBusqueda = useStore({
  //   idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //   idEmpresa: parametrosGlobales.idEmpresa,
  //   buscarPor: 'DNI / RUC', //por.value,
  //   cadenaABuscar: '', // cadena.value,
  // });

  //#region BUSCAR PERSONAS
  const localizarPersonas = $(() => {
    if (definicion_CTX_BUSCAR_PERSONA.conceptoABuscar === '') {
      alert('Ingrese un valor para su busqueda!!!');
      document.getElementById('in_conceptoABuscar_PERSONA')?.focus();
      return;
    }
    // buscarPersona.value++;
    definicion_CTX_BUSCAR_PERSONA.buscarPersona++;
  });
  //#endregion BUSCAR PERSONAS

  //#region REFRESCAR TABLA PERSONAS
  useTask$(({ track }) => {
    track(() => definicion_CTX_BUSCAR_PERSONA.grabo_Persona);

    if (definicion_CTX_BUSCAR_PERSONA.grabo_Persona) {
      // (definicion_CTX_BUSCAR_PERSONA.buscarPor = 'DNI / RUC'),
      //   (definicion_CTX_BUSCAR_PERSONA.cadenaABuscar = definicion_CTX_BUSCAR_PERSONA.conceptoABuscar),
      //console.log('BBPP: definicion_CTX_BUSCAR_PERSONA.personaEDITADA', definicion_CTX_BUSCAR_PERSONA.personaEDITADA);
      // buscarPersona.value++;
      if (definicion_CTX_BUSCAR_PERSONA.personaEDITADA._id !== '') {
        const KKK: IPersonaEdit[] = definicion_CTX_BUSCAR_PERSONA.misPersonas.filter(
          (pers: any) => pers._id === definicion_CTX_BUSCAR_PERSONA.personaEDITADA._id
        );
        KKK[0].razonSocialNombre = definicion_CTX_BUSCAR_PERSONA.personaEDITADA.razonSocialNombre;
        KKK[0].direccion = definicion_CTX_BUSCAR_PERSONA.personaEDITADA.direccion;
        KKK[0].email = definicion_CTX_BUSCAR_PERSONA.personaEDITADA.email;
        KKK[0].telefono = definicion_CTX_BUSCAR_PERSONA.personaEDITADA.telefono;
        KKK[0].cuentasCorrientes = definicion_CTX_BUSCAR_PERSONA.personaEDITADA.cuentasCorrientes;
      }
      definicion_CTX_BUSCAR_PERSONA.grabo_Persona = false;
    }
  });
  //#endregion REFRESCAR TABLA PERSONAS

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(320px, 100%, 600px)',
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
            //console.log('xxxxxxxxxxxxxx', props.contexto, props.rol);
            if (props.contexto === 'new_out_almacen') {
              if (props.rol === 'cliente') {
                ctx.mostrarPanelBuscarPersona_Venta = false;
              } else {
                ctx.mostrarPanelBuscarPersona = false;
              }
            } else if (props.contexto === 'new_edit_guiaRemision') {
              //console.log('new_edit_guiaRemision');
              if (props.rol === 'remitente') {
                ctx.mostrarPanelBuscarRemitente = false;
              }
              if (props.rol === 'destinatario') {
                ctx.mostrarPanelBuscarDestinatario = false;
              }
              if (props.rol === 'transportista') {
                //console.log('transportista');
                ctx.mostrarPanelBuscarTransportista = false;
              }
              if (props.rol === 'chofer') {
                ctx.mostrarPanelBuscarPersona = false;
              }
            } else {
              ctx.mostrarPanelBuscarPersona = false;
            }

            ctx.selecciono_Persona = false;
          })}
        />
        <ImgButton
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
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '12px' }}>Buscar {props.seleccionar}</h3>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '8px' }}>
          {/* Buscar por : DNI RUC */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="se_buscarPor_PERSONA"
                style={{ width: '100%' }}
                onChange$={(e) => {
                  definicion_CTX_BUSCAR_PERSONA.buscarPor = (e.target as HTMLSelectElement).value;
                  document.getElementById('in_conceptoABuscar_PERSONA')?.focus();
                  // document.getElementById('in_conceptoABuscar_PERSONA').select();
                }}
              >
                <option value={'DNI / RUC'} selected={definicion_CTX_BUSCAR_PERSONA.buscarPor === 'DNI / RUC'}>
                  DNI / RUC
                </option>
                <option value={'Nombre / Razón social'} selected={definicion_CTX_BUSCAR_PERSONA.buscarPor === 'Nombre / Razón social'}>
                  Nombre / Razón social
                </option>
              </select>
            </div>
          </div>
          {/* CONCEPTO A BUSCAR  */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_conceptoABuscar_PERSONA"
                style={{ width: '100%' }}
                type={definicion_CTX_BUSCAR_PERSONA.buscarPor === 'DNI / RUC' ? 'number' : 'text'}
                value={definicion_CTX_BUSCAR_PERSONA.conceptoABuscar}
                // onFocusout$={() => localizarPersonas()}
                onInput$={(e) => {
                  definicion_CTX_BUSCAR_PERSONA.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                }}
                // onChange$={(e) => {
                //   definicion_CTX_BUSCAR_PERSONA.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                //   // //console.log('onChange---', definicion_CTX_BUSCAR_PERSONA.conceptoABuscar);
                // }}
                onKeyDown$={(e) => {
                  // //console.log('🚐🚐🚐🚐🚌🚐🚐🚌🚌🚐🚐🚐🚐🚌🚐🚐first', e);

                  if (e.key === 'Escape') {
                    // //console.log('🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧first', e);
                    document.getElementById('se_buscarPor_PERSONA')?.focus();
                  }
                  if (e.key === 'Enter') {
                    // //console.log('⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽first', e);
                    document.getElementById('in_BuscarPersona')?.focus();
                  }
                }}
                // onKeyUp$={(e) => {
                //   //console.log('⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽first', e);
                // }}
                // onKeyPress$={(e) => {
                //   // alert('🚧🚧🚧🚧🚧');
                //   // if (e.key === 'Enter') {
                //   //   document.getElementById('in_BuscarPersona')?.focus();
                //   // }
                //   // if (e.key === 'Escape') {
                //   //   document.getElementById('se_buscarPor_PERSONA')?.focus();
                //   // }
                // }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <input
                id="in_BuscarPersona"
                type="image"
                src={images.searchPLUS}
                height={16}
                width={16}
                style={{ margin: '0px 4px' }}
                // onFocusin$={() => //console.log('🎁🎁🎁🎁🎁')}
                onClick$={() => localizarPersonas()}
              />
              <input
                id="in_AdicionarPersona"
                type="image"
                src={images.add}
                height={16}
                width={16}
                style={{ marginRight: '2px' }}
                // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                onClick$={() => {
                  definicion_CTX_BUSCAR_PERSONA.pP = [];
                  definicion_CTX_BUSCAR_PERSONA.mostrarPanelNewEditPersona = true;
                }}
              />
            </div>
          </div>
          <div class="form-control" style={props.motivo ? {} : { display: 'none' }}>
            <button
              onClick$={() => {
                ctx.mostrarPanelVentasClienteVentasVarias = true;
              }}
            >
              Cliente ventas varias
            </button>
          </div>
        </div>
        {/* NEW - PERSONA*/}
        {definicion_CTX_BUSCAR_PERSONA.mostrarPanelNewEditPersona && (
          <div class="modal">
            <NewEditPersona soloPersonaNatural={props.soloPersonasNaturales} personaSeleccio={definicion_CTX_BUSCAR_PERSONA.pP} contexto={props.contexto} />
          </div>
        )}
        {/* EDIT - PERSONA*/}
        {definicion_CTX_BUSCAR_PERSONA.mostrarPanelEditPersona && (
          <div class="modal">
            <EditarPersona soloPersonaNatural={props.soloPersonasNaturales} personaSeleccio={definicion_CTX_BUSCAR_PERSONA.pP} contexto={props.contexto} />
          </div>
        )}
        {/* TABLA DE PERSONAS HALLADAS*/}
        <div class="form-control">
          {definicion_CTX_BUSCAR_PERSONA.buscarPersona > 0 ? (
            <TablaPersonasHalladas
              buscarPersona={definicion_CTX_BUSCAR_PERSONA.buscarPersona}
              soloPersonasNaturales={props.soloPersonasNaturales}
              // parametrosBusqueda={parametrosBusqueda}
              contexto={props.contexto}
              rol={props.rol}
              personaEDITADA={definicion_CTX_BUSCAR_PERSONA.personaEDITADA}
            />
          ) : (
            ''
          )}
          {ctx.mostrarPanelVentasCliente && (
            <div class="modal">
              <VentasCliente
                // soloPersonaNatural={props.soloPersonasNaturales}
                // personaSeleccio={definicion_CTX_BUSCAR_PERSONA.pP}
                cliente={definicion_CTX_BUSCAR_PERSONA.pP}
                contexto={props.contexto}
              />
            </div>
          )}
          {ctx.mostrarPanelVentasClienteVentasVarias && (
            <div class="modal">
              <VentasClienteVentasVarios
                // cliente={definicion_CTX_BUSCAR_PERSONA.pP}
                contexto={props.contexto}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
