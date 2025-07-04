import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { inUpPersona } from '~/apis/persona.api';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import type { IPersona } from '~/interfaces/iPersona';
import { parametrosGlobales } from '~/routes/login';
import { CTX_BUSCAR_PERSONA } from './buscarPersona';
import { getDNI, getRUC } from '~/apis/apisExternas.api';
import Spinner from '~/components/system/spinner';
//
//parametrosGlobales:any
export const registrarPersona = $(async (persona: any) => {
  //console.log('persona....', persona);
  const registro = await inUpPersona({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,

    idPersona: persona.idPersona,
    codigoTipoDocumentoIdentidad: persona.codigoTipoDocumento,
    tipoDocumentoIdentidad: persona.tipoDocumento,
    numeroIdentidad: persona.numeroIdentidad,

    razonSocialNombre: persona.razonSocial,

    nombre: persona.nombre,
    paterno: persona.apellidoPaterno,
    materno: persona.apellidoMaterno,

    activo: persona.activo,

    usuario: parametrosGlobales.usuario,
  });
  //console.log('registro GRABADO:', registro);
  //console.log('registro GRABADO-statu:', registro.status);
  return registro;
});

export default component$(
  (props: { soloPersonaNatural: boolean; personaSeleccio: any; contexto: string; contextoInmediato?: string; valorABuscarAUTOMATICAMENTE: string }) => {
    //#region DEFINICION PERSONA - NEW  /EDIT
    const persona = useStore<IPersona>({
      _id: props.personaSeleccio._id ? props.personaSeleccio._id : '',
      codigoTipoDocumentoIdentidad: props.personaSeleccio.codigoTipoDocumentoIdentidad ? props.personaSeleccio.codigoTipoDocumentoIdentidad : '',
      tipoDocumentoIdentidad: props.personaSeleccio.tipoDocumentoIdentidad ? props.personaSeleccio.tipoDocumentoIdentidad : '',
      numeroIdentidad: props.personaSeleccio.numeroIdentidad ? props.personaSeleccio.numeroIdentidad : '',
      razonSocialNombre: props.personaSeleccio.razonSocialNombre ? props.personaSeleccio.razonSocialNombre : '',
      nombre: props.personaSeleccio.nombre ? props.personaSeleccio.nombre : '',
      paterno: props.personaSeleccio.paterno ? props.personaSeleccio.paterno : '',
      materno: props.personaSeleccio.materno ? props.personaSeleccio.materno : '',
      activo: props.personaSeleccio.activo ? props.personaSeleccio.activo : true,
    });
    //#endregion DEFINICION PERSONA

    //#region CONTEXTOS
    const ctx_buscar_persona = useContext(CTX_BUSCAR_PERSONA);
    //#endregion CONTEXTOS

    //#region INICIALIZACION
    const ini = useSignal(0);
    const condicion = useSignal('');
    const mostrarSpinner = useSignal(false);

    useTask$(({ track }) => {
      track(() => {
        props.soloPersonaNatural;
      });
      if (persona._id === '') {
        //INSERTANDO
        //console.log('//INSERTANDO//INSERTANDO//INSERTANDO//INSERTANDO');
        if (props.soloPersonaNatural) {
          //console.log('//dni//INSERTANDO//INSERTANDO//INSERTANDO//INSERTANDO');
          persona.codigoTipoDocumentoIdentidad = '1';
          persona.tipoDocumentoIdentidad = 'DNI';
        } else {
          //console.log('//ruc//INSERTANDO//INSERTANDO//INSERTANDO//INSERTANDO');
          persona.codigoTipoDocumentoIdentidad = '6';
          persona.tipoDocumentoIdentidad = 'RUC';
        }
      }
      // else {
      //   //EDITANDO
      //   //console.log('//EDITANDO//EDITANDO//EDITANDO//EDITANDO');
      //   persona.codigoTipoDocumentoIdentidad = props.personaSeleccio.codigoTipoDocumentoIdentidad;
      //   persona.tipoDocumentoIdentidad = props.personaSeleccio.tipoDocumentoIdentidad;
      // }
    });

    //#region BUSCAR_PERSONA_EN_API_EXTERNA
    const buscarPersonaEnAPIExterna = $(async () => {
      if (persona.numeroIdentidad === '') {
        alert('Ingrese el número de identidad.');
        persona.razonSocialNombre = '';
        condicion.value = '';
        document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
        return;
      }
      condicion.value = '';
      mostrarSpinner.value = true;
      // POR RUC
      if (persona.codigoTipoDocumentoIdentidad === '6') {
        console.log('💮💮💮💮💮');
        const laIdentidad = await getRUC(persona.numeroIdentidad);
        //console.log('laIdentidad - RUC:', laIdentidad);
        const laData = laIdentidad.data;
        persona.razonSocialNombre = laData.nombre;
        condicion.value = laData.condicion;
      } else {
        console.log('🉑🉑🉑');
        // POR DNI
        if (persona.codigoTipoDocumentoIdentidad === '1') {
          console.log('🉑🉑🉑🉑🉑🉑');
          const laIdentidad = await getDNI(persona.numeroIdentidad);
          //console.log('laIdentidad - DNI:', laIdentidad);
          const laData = laIdentidad.data;
          persona.nombre = laData.nombres;
          persona.paterno = laData.apellidoPaterno;
          persona.materno = laData.apellidoMaterno;
          // condicion.value = laData.condicion;
        }
      }
      mostrarSpinner.value = false;
    });
    //#endregion BUSCAR_PERSONA_EN_API_EXTERNA

    useTask$(({ track }) => {
      track(() => ini.value);
      if (ini.value === 0) {
        //console.log('props.valorABuscarAUTOMATICAMENTE', props.valorABuscarAUTOMATICAMENTE);
        if (
          props.valorABuscarAUTOMATICAMENTE.length === 11
          // &&
          // (props.valorABuscarAUTOMATICAMENTE.substring(0, 2) === '20' || props.valorABuscarAUTOMATICAMENTE.substring(0, 2) === '10')
        ) {
          // document.getElementById('in_BuscarPersona')?.focus();

          // console.log('.............buscando por RUC', definicion_CTX_BUSCAR_PERSONA.conceptoABuscar);
          // definicion_CTX_BUSCAR_PERSONA.mostrarSpinner = true;
          persona.numeroIdentidad = props.valorABuscarAUTOMATICAMENTE;
          buscarPersonaEnAPIExterna();
          // definicion_CTX_BUSCAR_PERSONA.mostrarSpinner = false;
        }
        if (props.valorABuscarAUTOMATICAMENTE.length === 8) {
          persona.numeroIdentidad = props.valorABuscarAUTOMATICAMENTE;
          buscarPersonaEnAPIExterna();
        }
      }
    });

    //#endregion INICIALIZACION

    //#region IR_A_REGISTRAR_PERSONA
    const irARegistrarPersona = $(async () => {
      // ctx.graboPersona = false;
      if (persona.numeroIdentidad.trim() === '') {
        alert('Ingrese el número de identidad (RUC, DNI, etc.)');
        document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
        return;
      }
      if (persona.codigoTipoDocumentoIdentidad === '6') {
        if (persona.razonSocialNombre.trim() === '') {
          alert('Ingrese la razón social');
          document.getElementById('in_razonSocial_PERSONA')?.focus();
          return;
        }
        persona.nombre = '';
        persona.paterno = '';
        persona.materno = '';
      } else {
        if (persona.nombre.trim() === '') {
          alert('Ingrese el nombre');
          document.getElementById('in_nombre_PERSONA')?.focus();
          return;
        }
        if (persona.paterno.trim() === '') {
          alert('Ingrese el apellido paterno');
          document.getElementById('in_apellidoPaterno_PERSONA')?.focus();
          return;
        }
        if (persona.materno.trim() === '') {
          alert('Ingrese el apellido materno');
          document.getElementById('in_apellidoMaterno_PERSONA')?.focus();
          return;
        }
        persona.razonSocialNombre = '';
      }
      //console.log('persona...', persona);
      // let resultPersona;
      if (persona.codigoTipoDocumentoIdentidad === '6') {
        // resultPersona =
        //console.log('//RUC');
        //RUC
        try {
          ctx_buscar_persona.mostrarSpinner = true;
          await registrarPersona({
            idPersona: persona._id,
            codigoTipoDocumento: persona.codigoTipoDocumentoIdentidad,
            tipoDocumento: persona.tipoDocumentoIdentidad,
            numeroIdentidad: persona.numeroIdentidad,

            razonSocial: persona.razonSocialNombre,
            activo: persona.activo,
          });
        } catch (error) {
          ctx_buscar_persona.mostrarSpinner = false;
          console.log('Error al registrar persona:', error);
          alert('Error al registrar persona. Intente nuevamente.');
        }
      } else {
        // resultPersona =
        //console.log('//DNI');
        //DNI
        try {
          await registrarPersona({
            idPersona: persona._id,
            codigoTipoDocumento: persona.codigoTipoDocumentoIdentidad,
            tipoDocumento: persona.tipoDocumentoIdentidad,
            numeroIdentidad: persona.numeroIdentidad,

            nombre: persona.nombre,
            apellidoPaterno: persona.paterno,
            apellidoMaterno: persona.materno,
            activo: persona.activo,

            razonSocial: persona.nombre + ' ' + persona.paterno + ' ' + persona.materno,
          });
        } catch (error) {
          ctx_buscar_persona.mostrarSpinner = false;
          console.log('Error al registrar persona:', error);
          alert('Error al registrar persona. Intente nuevamente.');
        }
      }

      // ctx.graboPersona = true;
      ctx_buscar_persona.grabo_Persona = true;
      ctx_buscar_persona.conceptoABuscar = persona.numeroIdentidad;
      ctx_buscar_persona.mostrarPanelNewEditPersona = false;
    });

    //#endregion IR_A_REGISTRAR_PERSONA

    return (
      <div
        style={{
          width: 'clamp(320px, 100%, 500px)',
          // width: 'auto',
          padding: '2px',
        }}
        class="container-modal"
      >
        {/* BOTONES DEL MARCO */}
        <div style={{ display: 'flex', justifyContent: 'end', backgroundColor: 'pink' }}>
          <ImgButton
            title="Ver persona"
            src={images.see}
            alt="Icono de persona"
            height={16}
            width={16}
            onClick={$(() => {
              console.log('persona', props.valorABuscarAUTOMATICAMENTE);
            })}
          />
          {/* <ImgButton
          title="Ver persona"
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          onClick={$(() => {
            //console.log('persona', persona);
          })}
        /> */}
          <ImgButton
            title="Cerrar el formulario"
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            onClick={$(() => {
              ctx_buscar_persona.mostrarPanelNewEditPersona = false;
            })}
          />
        </div>
        {/* TITULO */}
        <h3>Registro de persona</h3>
        {/* FORMULARIO */}
        {/* <Form
        action={accionGrabar}
        onSubmit$={() => {
          accionGrabar;
        }}
      > */}
        <div class="add-form">
          {/* ENCABEZADO */}
          <div>
            {/* Tipo documento de identidad */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                {props.soloPersonaNatural ? (
                  <select
                    id="se_tipoDocumentoIdentidad_PERSONA"
                    style={{ width: '100%' }}
                    onChange$={(e) => {
                      //console.log('🥓🥓🥓(e.target as HTMLSelectElement).value', (e.target as HTMLSelectElement).value);
                      persona.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                      persona.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                      document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                      //console.log(
                      //   'soloPersonaNatural, cTDI, tDI',
                      //   props.soloPersonaNatural,
                      //   persona.codigoTipoDocumentoIdentidad,
                      //   persona.tipoDocumentoIdentidad
                      // );
                    }}
                  >
                    <option value="1" selected={persona.codigoTipoDocumentoIdentidad === '1'}>
                      DNI
                    </option>
                    <option value="4" selected={persona.codigoTipoDocumentoIdentidad === '4'}>
                      C.EXT
                    </option>
                  </select>
                ) : (
                  <select
                    id="se_tipoDocumentoIdentidad_PERSONA"
                    style={{ width: '100%' }}
                    // value={persona.codigoTipoDocumentoIdentidad}
                    // value={'1'}
                    onChange$={(e) => {
                      //console.log('🥓🥓🥓(e.target as HTMLSelectElement).value', (e.target as HTMLSelectElement).value);
                      persona.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                      persona.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                      document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                      //console.log(
                      //   'soloPersonaNatural, cTDI, tDI',
                      //   props.soloPersonaNatural,
                      //   persona.codigoTipoDocumentoIdentidad,
                      //   persona.tipoDocumentoIdentidad
                      // );
                    }}
                  >
                    <option value="6" selected={persona.codigoTipoDocumentoIdentidad === '6'}>
                      RUC
                    </option>
                    <option value="1" selected={persona.codigoTipoDocumentoIdentidad === '1'}>
                      DNI
                    </option>
                    <option value="4" selected={persona.codigoTipoDocumentoIdentidad === '4'}>
                      C.EXT
                    </option>
                  </select>
                )}
              </div>
            </div>
            {/* numero Identidad */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_numeroIdentidad_PERSONA"
                  style={{ width: '100%', fontWeight: 'bold' }}
                  autoFocus
                  type="number"
                  placeholder="Número identidad"
                  value={persona.numeroIdentidad}
                  onChange$={(e) => {
                    //console.log('CHANGE...CHANGE...CHANGE...CHANGE...CHANGE...CHANGE...', persona.numeroIdentidad);
                    persona.numeroIdentidad = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    //console.log('CHANGE...CHANGE...CHANGE...CHANGE...CHANGE...CHANGE...', persona.numeroIdentidad);
                  }}
                  //   onChange={(e) => setNumeroIdentidad(e.target.value.trim())}
                  onKeyPress$={(e: any) => {
                    // alert(`onKeyPress... ${event}`);
                    // //console.log('onKeyPress-1-1-1-1-1-1', event.key);
                    if (e.key === 'Enter') {
                      // //console.log('55555555', persona.numeroIdentidad);
                      // buscarPersonaEnAPIExterna();
                      if ((document.getElementById('se_tipoDocumentoIdentidad_PERSONA') as HTMLSelectElement).value === '6') {
                        // //console.log('6666666');
                        document.getElementById('in_razonSocial_PERSONA')?.focus();
                      } else {
                        //   alert('Ingrese un valor a buscar');
                        document.getElementById('in_nombre_PERSONA')?.focus();
                      }
                    }
                  }}
                  // onKeyUp$={(e) => {
                  //   // alert(`onKeyUp... ${e}`);
                  //   // //console.log('onKeyUp-3333', e.key);
                  //   // if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Next' || e.key === 'Done' || e.key === 'Go') {
                  //   //   alert('KeyUp - Enter - Tab - Next');
                  //   //   //console.log('4444444', persona.numeroIdentidad);
                  //   //   // //console.log('das', (document.getElementById('tipoDocumentoIdentidad') as HTMLSelectElement).value);
                  //   //   if ((document.getElementById('se_tipoDocumentoIdentidad_PERSONA') as HTMLSelectElement).value === '6') {
                  //   //     //console.log('6666666');
                  //   //     buscarPersonaEnAPIExterna();
                  //   //     document.getElementById('in_razonSocial_PERSONA')?.focus();
                  //   //   } else {
                  //   //     //   alert('Ingrese un valor a buscar');
                  //   //     document.getElementById('in_nombre_PERSONA')?.focus();
                  //   //   }
                  //   // }
                  //   // if (e.key === 'Escape') {
                  //   //   document.getElementById('se_tipoDocumentoIdentidad_PERSONA')?.focus();
                  //   // }
                  // }}
                  // onKeyDown$={(e) => {
                  //   alert(`onKeyDown... ${e}`);
                  //   //console.log('onKeyDown000000000000', e.key);
                  // }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                />
                <input
                  id="in_BuscarPersona_NEPersona"
                  type="image"
                  src={images.searchPLUS}
                  height={16}
                  width={16}
                  title="Buscar datos de persona"
                  style={{ margin: '0 4px' }}
                  // onFocusin$={() => //console.log('🎁🎁🎁🎁🎁')}
                  // onClick$={() => localizarPersonas()}
                  onClick$={() => buscarPersonaEnAPIExterna()}
                  // onClick={$(() => )}
                />
              </div>
            </div>
            {persona.codigoTipoDocumentoIdentidad === '6' ? (
              // Razón social
              <div class="form-control">
                <div class="form-control form-agrupado">
                  <input
                    id="in_razonSocial_PERSONA"
                    style={{ width: '100%' }}
                    type="text"
                    placeholder="Razón social"
                    value={persona.razonSocialNombre}
                    onChange$={(e) => {
                      persona.razonSocialNombre = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                    onKeyPress$={(e: any) => {
                      // alert(`onKeyPress... ${event}`);
                      // //console.log('onKeyPress-1-1-1-1-1-1', event.key);
                      if (e.key === 'Enter') {
                        // //console.log('55555555', persona.numeroIdentidad);
                        // buscarPersonaEnAPIExterna();
                        // if ((document.getElementById('se_tipoDocumentoIdentidad_PERSONA') as HTMLSelectElement).value === '6') {
                        // //console.log('6666666');
                        document.getElementById('btn_grabar_PERSONA')?.focus();
                      }
                    }}
                    // onKeyUp$={(e) => {
                    //   if (e.key === 'Enter') {
                    //     //console.log('$$$$$$$$$$$$$$$$$$$$$$');
                    //     document.getElementById('btn_grabar_PERSONA')?.focus();
                    //   }
                    //   if (e.key === 'Escape') {
                    //     document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                    //   }
                    // }}

                    // onFocusin$={() => {
                    //   // alert(`INGRESO... ${e}`);
                    //   //console.log('INGRESO-', e);
                    //   buscarPersonaEnAPIExterna();
                    // }}
                  />
                  <strong style={{ color: condicion.value === 'HABIDO' ? 'green' : 'red', marginLeft: '5px' }}>{condicion.value}</strong>
                </div>
              </div>
            ) : (
              <>
                {/* //Nombre */}
                <div class="form-control">
                  <div class="form-control form-agrupado">
                    <input
                      id="in_nombre_PERSONA"
                      style={{ width: '100%' }}
                      type="text"
                      placeholder="Nombres"
                      value={persona.nombre}
                      onChange$={(e) => {
                        persona.nombre = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          document.getElementById('in_apellidoPaterno_PERSONA')?.focus();
                        }
                        if (e.key === 'Escape') {
                          document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                        }
                      }}

                      // onFocusin$={() => {
                      //   // alert(`INGRESO... ${e}`);
                      //   //console.log('INGRESO-', e);
                      //   buscarPersonaEnAPIExterna();
                      // }}
                    />
                  </div>
                </div>
                {/* //Ap Paterno */}
                <div class="form-control">
                  <div class="form-control form-agrupado">
                    <input
                      id="in_apellidoPaterno_PERSONA"
                      style={{ width: '100%' }}
                      type="text"
                      placeholder="Apellido paterno"
                      value={persona.paterno}
                      onChange$={(e) => {
                        persona.paterno = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          document.getElementById('in_apellidoMaterno_PERSONA')?.focus();
                        }
                        if (e.key === 'Escape') {
                          document.getElementById('in_nombre_PERSONA')?.focus();
                        }
                      }}
                    />
                  </div>
                </div>
                {/* //Ap Materno */}
                <div class="form-control">
                  <div class="form-control form-agrupado">
                    <input
                      id="in_apellidoMaterno_PERSONA"
                      style={{ width: '100%' }}
                      type="text"
                      placeholder="Apellido materno"
                      value={persona.materno}
                      onChange$={(e) => {
                        persona.materno = (e.target as HTMLInputElement).value.trim().toUpperCase();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          //console.log('###############');
                          document.getElementById('btn_grabar_PERSONA')?.focus();
                        }
                        if (e.key === 'Escape') {
                          document.getElementById('in_apellidoPaterno_PERSONA')?.focus();
                        }
                      }}
                    />
                  </div>
                </div>
              </>
            )}
            <br />
          </div>

          {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
          <input
            id="btn_grabar_PERSONA"
            type="submit"
            value="Registrar" //REGISTRAR // SELECCIONAR // ACTUALIZAR
            style={{ height: '40px', cursor: 'pointer' }}
            class="btn-centro"
            onClick$={() => {
              irARegistrarPersona();
            }}
          />
        </div>
        {/* </Form> */}
        {/* MOSTRAR SPINNER */}
        {mostrarSpinner.value && (
          <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner />
          </div>
        )}
      </div>
    );
  }
);
