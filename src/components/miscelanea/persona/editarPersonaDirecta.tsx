import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import Spinner from '~/components/system/spinner';
import { CTX_ADD_VENTA, CTX_CLIENTE_VENTA } from '~/components/venta/addVenta';
import type { IPersonaEdit } from '~/interfaces/iPersona';
import NewEditCuentaCorriente from './newEditCuentaCorriente';
import { inUpPersona } from '~/apis/persona.api';
import { parametrosGlobales } from '~/routes/login';

export const CTX_EDIT_PERSONA_DIRECTA = createContextId<any>('edit_persona_directa__');
export const CTX_PERSONA = createContextId<any>('persona__');

export default component$((props: { soloPersonaNatural: boolean; personaSeleccio: any; contexto: string }) => {
  //#region DEFINICION CTX_EDIT_PERSONA_DIRECTA
  const definicion_CTX_EDIT_PERSONA_DIRECTA = useStore({
    mostrarPanelNewEditCuentaCorriente: false,
    editar_idAuxiliarCuentaCorri: 0,
    cuentaCorrienteSeleccionado: { _id: '', idAuxiliar: '', banco: '', moneda: '', cuentaCorriente: '', cci: '' },
    grabo_cuentaCorriente: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_EDIT_PERSONA_DIRECTA, definicion_CTX_EDIT_PERSONA_DIRECTA);
  //#endregion DEFINICION CTX_EDIT_PERSONA_DIRECTA

  //#region DEFINICION PERSONA
  const definicion_CTX_PERSONA = useStore<IPersonaEdit>({
    _id: props.personaSeleccio._id ? props.personaSeleccio._id : '',
    codigoTipoDocumentoIdentidad: props.personaSeleccio.codigoTipoDocumentoIdentidad ? props.personaSeleccio.codigoTipoDocumentoIdentidad : '',
    tipoDocumentoIdentidad: props.personaSeleccio.tipoDocumentoIdentidad ? props.personaSeleccio.tipoDocumentoIdentidad : '',
    numeroIdentidad: props.personaSeleccio.numeroIdentidad ? props.personaSeleccio.numeroIdentidad : '',
    razonSocialNombre: props.personaSeleccio.razonSocialNombre ? props.personaSeleccio.razonSocialNombre : '',
    nombre: props.personaSeleccio.nombre ? props.personaSeleccio.nombre : '',
    paterno: props.personaSeleccio.paterno ? props.personaSeleccio.paterno : '',
    materno: props.personaSeleccio.materno ? props.personaSeleccio.materno : '',
    activo: props.personaSeleccio.activo ? props.personaSeleccio.activo : true,

    direccion: props.personaSeleccio.direccion ? props.personaSeleccio.direccion : '',
    email: props.personaSeleccio.email ? props.personaSeleccio.email : '',
    telefono: props.personaSeleccio.telefono ? props.personaSeleccio.telefono : '',
    cuentasCorrientes: props.personaSeleccio.cuentasCorrientes ? props.personaSeleccio.cuentasCorrientes : [],
  });
  useContextProvider(CTX_PERSONA, definicion_CTX_PERSONA);
  //#endregion DEFINICION PERSONA

  //#region CONTEXTOS
  let ctx: any;
  let ctx_rol: any;
  if (props.contexto === 'add_venta') {
    ctx = useContext(CTX_ADD_VENTA);
    ctx_rol = useContext(CTX_CLIENTE_VENTA);
  }
  //   const
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  //   const condicion = useSignal('');
  const mostrarSpinner = useSignal(false);

  //#endregion INICIALIZACION

  //#region ACTUALIZAR PERSONA
  const actualizarPersona = $(async () => {
    if (definicion_CTX_PERSONA.numeroIdentidad.trim() === '') {
      alert('Verifique el número de identidad');
      return;
    }
    if (definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad === '6') {
      if (definicion_CTX_PERSONA.razonSocialNombre.trim() === '') {
        alert('Verifique la razón social');
        document.getElementById('in_razonSocial_PERSONA')?.focus();
        return;
      }
    } else {
      if (definicion_CTX_PERSONA.nombre.trim() === '') {
        alert('Verifique el nombre');
        document.getElementById('in_nombre_PERSONA')?.focus();
        return;
      }
      if (definicion_CTX_PERSONA.paterno.trim() === '') {
        alert('Verifique el apellido paterno');
        document.getElementById('in_apellidoPaterno_PERSONA')?.focus();
        return;
      }
      if (definicion_CTX_PERSONA.materno.trim() === '') {
        alert('Verifique el apellido materno');
        document.getElementById('in_apellidoMaterno_PERSONA')?.focus();
        return;
      }
    }

    mostrarSpinner.value = true;
    const persoActuli = await inUpPersona({
      idPersona: definicion_CTX_PERSONA._id,
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      activo: definicion_CTX_PERSONA.activo,
      codigoTipoDocumentoIdentidad: definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: definicion_CTX_PERSONA.tipoDocumentoIdentidad,
      numeroIdentidad: definicion_CTX_PERSONA.numeroIdentidad,
      // direccion: definicion_CTX_PERSONA.direccion,
      razonSocialNombre: definicion_CTX_PERSONA.razonSocialNombre,
      nombre: definicion_CTX_PERSONA.nombre,
      paterno: definicion_CTX_PERSONA.paterno,
      materno: definicion_CTX_PERSONA.materno,

      direccion: definicion_CTX_PERSONA.direccion,
      email: definicion_CTX_PERSONA.email,
      telefono: definicion_CTX_PERSONA.telefono,
      cuentasCorrientes: definicion_CTX_PERSONA.cuentasCorrientes,

      usuario: parametrosGlobales.usuario,
    });
    //console.log('LAS PASO.............');
    if (persoActuli.status === 400) {
      alert('Falla al registrar la persona. ' + persoActuli.message);
      mostrarSpinner.value = false;
      return;
    }

    console.log('persoActuli', persoActuli);
    mostrarSpinner.value = false;

    ctx.grabo_PersonaDirecta = true;
    ctx_rol.razonSocialNombre = persoActuli.data.razonSocialNombre;
    ctx_rol.direccion = persoActuli.data.direccion;
    ctx.mostrarPanelEditPersonaDirecta = false;
  });
  //#endregion ACTUALIZAR PERSONA

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 500px)',
        // width: 'auto',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelEditPersonaDirecta = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          title="Ver persona"
          onClick={$(() => {
            console.log('definicion_CTX_PERSONA', definicion_CTX_PERSONA);
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
                  disabled
                  onChange$={(e) => {
                    //console.log('🥓🥓🥓(e.target as HTMLSelectElement).value', (e.target as HTMLSelectElement).value);
                    definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                    definicion_CTX_PERSONA.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                    document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                    //console.log(
                    //   'soloPersonaNatural, cTDI, tDI',
                    //   props.soloPersonaNatural,
                    //   definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad,
                    //   definicion_CTX_PERSONA.tipoDocumentoIdentidad
                    // );
                  }}
                >
                  <option value={'1'} selected={definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad === '1'}>
                    DNI
                  </option>
                  <option value={'4'} selected={definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad === '4'}>
                    C.EXT
                  </option>
                </select>
              ) : (
                <select
                  id="se_tipoDocumentoIdentidad_PERSONA"
                  style={{ width: '100%' }}
                  disabled
                  // value={persona.codigoTipoDocumentoIdentidad}
                  // value={'1'}
                  onChange$={(e) => {
                    //console.log('🥓🥓🥓(e.target as HTMLSelectElement).value', (e.target as HTMLSelectElement).value);
                    definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                    definicion_CTX_PERSONA.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                    document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                    //console.log(
                    //   'soloPersonaNatural, cTDI, tDI',
                    //   props.soloPersonaNatural,
                    //   definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad,
                    //   definicion_CTX_PERSONA.tipoDocumentoIdentidad
                    // );
                  }}
                >
                  <option value={'6'} selected={definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad === '6'}>
                    RUC
                  </option>
                  <option value={'1'} selected={definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad === '1'}>
                    DNI
                  </option>
                  <option value={'4'} selected={definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad === '4'}>
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
                style={{ width: '100%' }}
                disabled
                type="number"
                placeholder="Número identidad"
                value={definicion_CTX_PERSONA.numeroIdentidad}
                onChange$={(e) => {
                  //console.log('CHANGE...CHANGE...CHANGE...CHANGE...CHANGE...CHANGE...', definicion_CTX_PERSONA.numeroIdentidad);
                  definicion_CTX_PERSONA.numeroIdentidad = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  //console.log('CHANGE...CHANGE...CHANGE...CHANGE...CHANGE...CHANGE...', definicion_CTX_PERSONA.numeroIdentidad);
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
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              {/* <input
            id="in_BuscarPersona_NEPersona"
            type="image"
            src={images.searchPLUS}
            height={16}
            width={16}
            title="Buscar datos de persona"
            style={{ margin: '2px 2px' }}
            // onFocusin$={() => //console.log('🎁🎁🎁🎁🎁')}
            // onClick$={() => localizarPersonas()}
            onClick$={() => buscarPersonaEnAPIExterna()}
            // onClick={$(() => )}
          /> */}
            </div>
          </div>
          {definicion_CTX_PERSONA.codigoTipoDocumentoIdentidad === '6' ? (
            // Razón social
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_razonSocial_PERSONA"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social"
                  value={definicion_CTX_PERSONA.razonSocialNombre}
                  onChange$={(e) => {
                    definicion_CTX_PERSONA.razonSocialNombre = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                  onKeyPress$={(e: any) => {
                    if (e.key === 'Enter') {
                      document.getElementById('in_direccion_PERSONA')?.focus();
                    }
                  }}

                  //   onFocusin$={(e) => {

                  //     //console.log('INGRESO-', e);
                  //     buscarPersonaEnAPIExterna();
                  //   }}
                />
                {/* <strong style={{ color: condicion.value === 'HABIDO' ? 'green' : 'red', marginLeft: '5px' }}>
              {condicion.value}
            </strong> */}
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
                    value={definicion_CTX_PERSONA.nombre}
                    onChange$={(e) => {
                      definicion_CTX_PERSONA.nombre = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        document.getElementById('in_apellidoPaterno_PERSONA')?.focus();
                      }
                      if (e.key === 'Escape') {
                        document.getElementById('in_numeroIdentidad_PERSONA')?.focus();
                      }
                    }}
                    // onFocusin$={(e) => {
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
                    value={definicion_CTX_PERSONA.paterno}
                    onChange$={(e) => {
                      definicion_CTX_PERSONA.paterno = (e.target as HTMLInputElement).value.trim().toUpperCase();
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
                    value={definicion_CTX_PERSONA.materno}
                    onChange$={(e) => {
                      definicion_CTX_PERSONA.materno = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        //console.log('###############');
                        document.getElementById('in_direccion_PERSONA')?.focus();
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
          {/* //Dirección */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_direccion_PERSONA"
                style={{ width: '100%' }}
                type="text"
                placeholder="Dirección"
                value={definicion_CTX_PERSONA.direccion}
                onChange$={(e) => {
                  definicion_CTX_PERSONA.direccion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    //console.log('###############');
                    document.getElementById('in_email_PERSONA')?.focus();
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('in_apellidoMaterno_PERSONA')?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* //Email */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_email_PERSONA"
                style={{ width: '100%' }}
                type="email"
                placeholder="Email"
                value={definicion_CTX_PERSONA.email}
                onChange$={(e) => {
                  definicion_CTX_PERSONA.email = (e.target as HTMLInputElement).value.trim();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    //console.log('###############');
                    document.getElementById('btn_grabar_PERSONA')?.focus();
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('in_apellidoMaterno_PERSONA')?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* //Teléfono */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_telefono_PERSONA"
                style={{ width: '100%' }}
                type="text"
                placeholder="Teléfono"
                value={definicion_CTX_PERSONA.telefono}
                onChange$={(e) => {
                  definicion_CTX_PERSONA.telefono = (e.target as HTMLInputElement).value.trim();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    //console.log('###############');
                    document.getElementById('btn_grabar_PERSONA')?.focus();
                  }
                  if (e.key === 'Escape') {
                    document.getElementById('in_apellidoMaterno_PERSONA')?.focus();
                  }
                }}
              />
            </div>
          </div>

          {/* // Cuentas Corrientes */}
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                margin: '5px 0',
              }}
            >
              <div style={{ marginBottom: '5px' }}>
                <button
                  onClick$={() => {
                    definicion_CTX_EDIT_PERSONA_DIRECTA.cuentaCorrienteSeleccionado = {
                      _id: '',
                      idAuxiliar: '',
                      banco: '',
                      moneda: 'PEN',
                      cuentaCorriente: '',
                      cci: '',
                    };
                    definicion_CTX_EDIT_PERSONA_DIRECTA.mostrarPanelNewEditCuentaCorriente = true;
                  }}
                >
                  Adicionar cuenta corriente
                </button>
              </div>
              {/* TABLA CUENTAS CORRIENTES */}
              {typeof definicion_CTX_PERSONA.cuentasCorrientes !== 'undefined' ? (
                definicion_CTX_PERSONA.cuentasCorrientes.length > 0 ? (
                  <table id="ta_CuentasCorrientes" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                    <thead>
                      <tr>
                        <th>Banco</th>
                        <th>Cuenta Corriente</th>
                        <th>CCI</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {definicion_CTX_PERSONA.cuentasCorrientes.map((iTCuentaCorri: any) => {
                        // const indexItemServi = index + 1;

                        return (
                          <tr key={iTCuentaCorri.idAuxiliar}>
                            <td data-label="Banco">{iTCuentaCorri.banco}</td>
                            <td data-label="Cuenta Corriente">{iTCuentaCorri.cuentaCorriente}</td>
                            <td data-label="CCI">{iTCuentaCorri.cci}</td>
                            <td data-label="Acciones" class="acciones">
                              <input
                                type="image"
                                title="Editar cuenta corriente"
                                alt="icono de editar"
                                height={12}
                                width={12}
                                src={images.edit}
                                style={{ marginRight: '2px' }}
                                onClick$={() => {
                                  definicion_CTX_EDIT_PERSONA_DIRECTA.cuentaCorrienteSeleccionado = iTCuentaCorri;
                                  definicion_CTX_EDIT_PERSONA_DIRECTA.editar_idAuxiliarCuentaCorri = iTCuentaCorri.idAuxiliar;
                                  definicion_CTX_EDIT_PERSONA_DIRECTA.mostrarPanelNewEditCuentaCorriente = true;
                                }}
                              />
                              {/* <input
                            type="image"
                            title="Copiar cuenta corriente"
                            alt="icono de copiar"
                            height={12}
                            width={12}
                            src={images.copy}
                            onClick$={() => {
                              // let copyText = document.getElementById('ta_CuentasCorrientes');
                              // // Select the text field
                              // copyText.select();
                              // copyText.setSelectionRange(0, 99999); // For mobile devices
                              // navigator.clipboard.writeText(copyText);
                              let clipText: any;
                              navigator.clipboard.readText().then((clipText) => {
                                clipText += document.getElementById('ta_CuentasCorrientes')?.innerText;
                                // //console.log('first', clipText);
                                // document.querySelector('.ta_CuentasCorrientes').innerText += clipText;
                              });
                              //console.log(clipText);
                              // definicion_CTX_NEW_EDIT_EMPRESA.motivoIngresoSeleccionado = iTMotiIngreso;
                              // definicion_CTX_NEW_EDIT_EMPRESA.editar_idAuxiliarMotivoIngreso = iTMotiIngreso.idAuxiliar;
                              // definicion_CTX_NEW_EDIT_EMPRESA.mostrarPanelAdicionarMotivoIngresoAlmacen = true;
                            }}
                          /> */}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  <i style={{ fontSize: '0.8rem' }}>No existen cuentas corrientes</i>
                )
              ) : (
                <i style={{ fontSize: '0.8rem' }}>No existen cuentas corrientes</i>
              )}
              {definicion_CTX_EDIT_PERSONA_DIRECTA.mostrarPanelNewEditCuentaCorriente && (
                <div class="modal">
                  <NewEditCuentaCorriente cuentaCorriSelec={definicion_CTX_EDIT_PERSONA_DIRECTA.cuentaCorrienteSeleccionado} />
                </div>
              )}
            </div>
            {/* ----------------------------------------------------- */}
            {/* <hr style={{ margin: '5px 0' }}></hr> */}
            <br></br>
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_grabar_PERSONA"
          type="submit"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            actualizarPersona();
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
});
