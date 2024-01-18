import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import { CTX_PERSONA } from '../venta/addVenta';
import ImgButton from '../../system/imgButton';
import TablaPersonasHalladas from './tablaPersonasHalladas';
// import { CTX_DOCS_VENTA } from '~/routes/(almacen)/venta';
// import { CTX_DOCS_COTIZACION } from '~/routes/(almacen)/cotizacion';
// import { parametrosGlobales } from '~/routes/login';
import NewEditPersona from './newEditPersona';
import { CTX_NEW_EDIT_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
import { CTX_NEW_EDIT_ORDEN_SERVICIO } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_ADD_VENTA } from '~/components/venta/addVenta';
import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import { CTX_NEW_EDIT_COMPRA } from '~/components/compra/newEditCompra';
import { CTX_BUSCAR_TECNICO } from '../tecnico/buscarTecnico';
import { CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import VentasCliente from '../venta/ventasCliente';

export const CTX_BUSCAR_PERSONA = createContextId<any>('buscar_persona');

export default component$((props: { seleccionar?: string; soloPersonasNaturales: boolean; contexto?: any; rol: string }) => {
  //#region DEFINICION CTX_BUSCAR_PERSONA - para eDITAR
  const definicion_CTX_BUSCAR_PERSONA = useStore({
    pP: [],
    grabo_Persona: false,
    buscarPor: 'DNI / RUC',
    conceptoABuscar: '',

    mostrarPanelNewEditPersona: false,
  });
  useContextProvider(CTX_BUSCAR_PERSONA, definicion_CTX_BUSCAR_PERSONA);
  //#endregion DEFINICION CTX_BUSCAR_PERSONA

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'orden servicio':
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
  const buscarPersona = useSignal(0);

  // useTask$(({ track }) => {
  //   track(() => ini.value);
  //   console.log('inicializando...');
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
    buscarPersona.value++;
  });
  //#endregion BUSCAR PERSONAS

  //#region REFRESCAR TABLA PERSONAS
  useTask$(({ track }) => {
    track(() => definicion_CTX_BUSCAR_PERSONA.grabo_Persona);
    if (definicion_CTX_BUSCAR_PERSONA.grabo_Persona) {
      // (definicion_CTX_BUSCAR_PERSONA.buscarPor = 'DNI / RUC'),
      //   (definicion_CTX_BUSCAR_PERSONA.cadenaABuscar = definicion_CTX_BUSCAR_PERSONA.conceptoABuscar),
      buscarPersona.value++;
      definicion_CTX_BUSCAR_PERSONA.grabo_Persona = false;
    }
  });
  //#endregion REFRESCAR TABLA PERSONAS

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(386px, 86%, 700px)',
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
            if (props.contexto === 'new_out_almacen') {
              if (props.rol === 'cliente') {
                ctx.mostrarPanelBuscarPersona_Venta = false;
              } else {
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
            console.log('definicion_CTX_BUSCAR_PERSONA', definicion_CTX_BUSCAR_PERSONA);
            // console.log('parametrosBusqueda', parametrosBusqueda);
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('definicion_CTX_BUSCAR_PERSONA.conceptoABuscar', definicion_CTX_BUSCAR_PERSONA.conceptoABuscar);
            // console.log('parametrosBusqueda.cadenaABuscar', parametrosBusqueda.cadenaABuscar);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px' }}>Buscar {props.seleccionar}</h3>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por : DNI RUC */}
          <div class="form-control">
            <label>Buscar por</label>
            <div class="form-control form-agrupado">
              <select
                id="se_buscarPor_PERSONA"
                style={{ width: '100%' }}
                onChange$={(e) => {
                  definicion_CTX_BUSCAR_PERSONA.buscarPor = (e.target as HTMLSelectElement).value;
                  document.getElementById('in_conceptoABuscar_PERSONA')?.focus();
                }}
              >
                <option value={'DNI / RUC'} selected={definicion_CTX_BUSCAR_PERSONA.buscarPor === 'DNI / RUC'}>
                  DNI / RUC
                </option>
                <option
                  value={'Nombre / Razón social'}
                  selected={definicion_CTX_BUSCAR_PERSONA.buscarPor === 'Nombre / Razón social'}
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
                id="in_conceptoABuscar_PERSONA"
                style={{ width: '100%' }}
                autoFocus
                type="text"
                // value={parametrosBusqueda.cadenaABuscar}
                // onChange$={(e) => (parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value.trim())}
                value={definicion_CTX_BUSCAR_PERSONA.conceptoABuscar}
                onInput$={(e) => {
                  definicion_CTX_BUSCAR_PERSONA.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                }}
                // onChange$={(e) => {
                //   definicion_CTX_BUSCAR_PERSONA.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                //   console.log('onChange', definicion_CTX_BUSCAR_PERSONA.conceptoABuscar);
                // }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    if (definicion_CTX_BUSCAR_PERSONA.conceptoABuscar === '') {
                      console.log(
                        'definicion_CTX_BUSCAR_PERSONA.conceptoABuscar...esta mal?',
                        definicion_CTX_BUSCAR_PERSONA.conceptoABuscar
                      );
                      alert('Ingrese un valor para su busqueda.{.{.');
                      document.getElementById('in_conceptoABuscar_PERSONA')?.focus();
                      return;
                    }
                    buscarPersona.value++;
                    // if ((document.getElementById('in_conceptoABuscar_MICE') as HTMLInputElement).value.trim() !== '') {
                    //   if (definicion_CTX_BUSCAR_PERSONA.conceptoABuscar === '') {
                    //     alert('Ingrese un valor para su busqueda(=)' + definicion_CTX_BUSCAR_PERSONA.conceptoABuscar);
                    //     document.getElementById('in_conceptoABuscar_MICE')?.focus();
                    //     return;
                    //   }
                    //   buscarPersona.value++;
                    // } else {
                    //   alert('Ingrese un valor a buscar');
                    //   document.getElementById('in_conceptoABuscar_MICE')?.focus();
                    // }
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('se_buscarPor_PERSONA')?.focus();
                  }
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
                // onClick={localizarPersonas}
                onClick={$(() => {
                  localizarPersonas();
                })}
              />
              <ImgButton
                src={images.add}
                alt="Icono de adicionar persona"
                height={16}
                width={16}
                title="Adicionar persona"
                onClick={$(() => {
                  definicion_CTX_BUSCAR_PERSONA.pP = [];
                  definicion_CTX_BUSCAR_PERSONA.mostrarPanelNewEditPersona = true;
                })}
              />
            </div>
          </div>
        </div>
        {/* NEW - EDIT PERSONA*/}
        {definicion_CTX_BUSCAR_PERSONA.mostrarPanelNewEditPersona && (
          <div class="modal">
            <NewEditPersona
              soloPersonaNatural={props.soloPersonasNaturales}
              personaSeleccio={definicion_CTX_BUSCAR_PERSONA.pP}
              contexto={props.contexto}
            />
          </div>
        )}
        {/* TABLA DE PERSONAS HALLADAS*/}
        <div class="form-control">
          {buscarPersona.value > 0 ? (
            <TablaPersonasHalladas
              buscarPersona={buscarPersona.value}
              soloPersonasNaturales={props.soloPersonasNaturales}
              // parametrosBusqueda={parametrosBusqueda}
              contexto={props.contexto}
              rol={props.rol}
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
        </div>
      </div>
    </div>
  );
});
