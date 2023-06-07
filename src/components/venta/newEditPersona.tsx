import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { inUpPersona } from '~/apis/persona.api';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import { parametrosGlobales } from '~/routes/login';
import { IPersona } from '~/interfaces/iPersona';

export const registrarPersona = $(async (parametrosGlobales: any, persona: any) => {
  console.log('persona....', persona);
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
  console.log('registro GRABADO:', registro);
  console.log('registro GRABADO-statu:', registro.status);
  return registro;
});

export default component$((props: { soloPersonaNatural: boolean; personaSeleccio: any }) => {
  //#region CONTEXTOS
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
  //#endregion CONTEXTOS

  //#region DEFINICION PERSONA
  const persona = useStore<IPersona>({
    _id: props.personaSeleccio._id ? props.personaSeleccio._id : '',
    codigoTipoDocumentoIdentidad: props.personaSeleccio.codigoTipoDocumentoIdentidad
      ? props.personaSeleccio.codigoTipoDocumentoIdentidad
      : '',
    tipoDocumentoIdentidad: props.personaSeleccio.tipoDocumentoIdentidad ? props.personaSeleccio.tipoDocumentoIdentidad : '',
    numeroIdentidad: props.personaSeleccio.numeroIdentidad ? props.personaSeleccio.numeroIdentidad : '',
    razonSocialNombre: props.personaSeleccio.razonSocialNombre ? props.personaSeleccio.razonSocialNombre : '',
    nombre: props.personaSeleccio.nombre ? props.personaSeleccio.nombre : '',
    paterno: props.personaSeleccio.paterno ? props.personaSeleccio.paterno : '',
    materno: props.personaSeleccio.materno ? props.personaSeleccio.materno : '',
    activo: props.personaSeleccio.activo ? props.personaSeleccio.activo : true,
  });
  //#endregion DEFINICION PERSONA

  //#region INICIALIZACION
  const condicion = useSignal('');

  //* ini
  useTask$(({ track }) => {
    track(() => {
      props.soloPersonaNatural;
    });
    // console.log('llego al track*******%&$%***', props.soloPersonaNatural);
    if (persona._id === '') {
      //INSERTANDO
      console.log('//INSERTANDO//INSERTANDO//INSERTANDO//INSERTANDO');
      if (props.soloPersonaNatural) {
        console.log('//dni//INSERTANDO//INSERTANDO//INSERTANDO//INSERTANDO');
        persona.codigoTipoDocumentoIdentidad = '1';
        persona.tipoDocumentoIdentidad = 'DNI';
      } else {
        console.log('//ruc//INSERTANDO//INSERTANDO//INSERTANDO//INSERTANDO');
        persona.codigoTipoDocumentoIdentidad = '6';
        persona.tipoDocumentoIdentidad = 'RUC';
      }
    }
    // else {
    //   //EDITANDO
    //   console.log('//EDITANDO//EDITANDO//EDITANDO//EDITANDO');
    //   persona.codigoTipoDocumentoIdentidad = props.personaSeleccio.codigoTipoDocumentoIdentidad;
    //   persona.tipoDocumentoIdentidad = props.personaSeleccio.tipoDocumentoIdentidad;
    // }
  });
  //#endregion INICIALIZACION

  //#region SUBMIT
  const grabando = $(async () => {
    ctx_docs_venta.graboPersona = false;
    if (persona.numeroIdentidad.trim() === '') {
      alert('Ingrese el número de identidad (RUC, DNI, etc.)');
      document.getElementById('numeroIdentidad')?.focus();
      return;
    }
    if (persona.codigoTipoDocumentoIdentidad === '6') {
      if (persona.razonSocialNombre.trim() === '') {
        alert('Ingrese la razón social');
        document.getElementById('razonSocial')?.focus();
        return;
      }
      persona.nombre = '';
      persona.paterno = '';
      persona.materno = '';
    } else {
      if (persona.nombre.trim() === '') {
        alert('Ingrese el nombre');
        document.getElementById('nombre')?.focus();
        return;
      }
      if (persona.paterno.trim() === '') {
        alert('Ingrese el apellido paterno');
        document.getElementById('apellidoPaterno')?.focus();
        return;
      }
      if (persona.materno.trim() === '') {
        alert('Ingrese el apellido materno');
        document.getElementById('apellidoMaterno')?.focus();
        return;
      }
      persona.razonSocialNombre = '';
    }
    console.log('useAccionGrabarPersona...', persona);
    let resultPersona;
    if (persona.codigoTipoDocumentoIdentidad === '6') {
      resultPersona = await registrarPersona(parametrosGlobales, {
        idPersona: persona._id,
        codigoTipoDocumento: persona.codigoTipoDocumentoIdentidad,
        tipoDocumento: persona.tipoDocumentoIdentidad,
        numeroIdentidad: persona.numeroIdentidad,

        razonSocial: persona.razonSocialNombre,
        activo: persona.activo,
      });
    } else {
      resultPersona = await registrarPersona(parametrosGlobales, {
        idPersona: persona._id,
        codigoTipoDocumento: persona.codigoTipoDocumentoIdentidad,
        tipoDocumento: persona.tipoDocumentoIdentidad,
        numeroIdentidad: persona.numeroIdentidad,

        nombre: persona.nombre,
        apellidoPaterno: persona.paterno,
        apellidoMaterno: persona.materno,
        activo: persona.activo,
      });
    }
    ctx_docs_venta.graboPersona = true;
    ctx_docs_venta.mostrarPanelAgregarPersona0 = false;
  });

  //#endregion SUBMIT

  return (
    <div
      style={{
        width: 'auto',
        padding: '1px',
        // border: '3px dashed yellow',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          // onClick={(e) => {
          //   onCerrar({ soloCerrar });
          // }}
          onClick={$(() => {
            // ctx_PanelVenta.mostrarPanelVenta = false;
            ctx_docs_venta.mostrarPanelAgregarPersona0 = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de persona"
          height={16}
          width={16}
          title="Ver persona"
          onClick={$(() => {
            console.log('persona', persona);
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
            <label>Tipo documento</label>
            <div class="form-control form-agrupado">
              {props.soloPersonaNatural ? (
                <select
                  id="tipoDocumentoIdentidad"
                  style={{ width: '100%' }}
                  // value={persona.codigoTipoDocumentoIdentidad}
                  onChange$={(e) => {
                    console.log('🥓🥓🥓(e.target as HTMLSelectElement).value', (e.target as HTMLSelectElement).value);
                    persona.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                    persona.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                    document.getElementById('numeroIdentidad')?.focus();
                    console.log(
                      'soloPersonaNatural, cTDI, tDI',
                      props.soloPersonaNatural,
                      persona.codigoTipoDocumentoIdentidad,
                      persona.tipoDocumentoIdentidad
                    );
                  }}
                >
                  <option value={'1'} selected={persona.codigoTipoDocumentoIdentidad === '1'}>
                    DNI
                  </option>
                  <option value={'4'} selected={persona.codigoTipoDocumentoIdentidad === '4'}>
                    C.EXT
                  </option>
                </select>
              ) : (
                <select
                  id="tipoDocumentoIdentidad"
                  style={{ width: '100%' }}
                  // value={persona.codigoTipoDocumentoIdentidad}
                  // value={'1'}
                  onChange$={(e) => {
                    console.log('🥓🥓🥓(e.target as HTMLSelectElement).value', (e.target as HTMLSelectElement).value);
                    persona.codigoTipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                    persona.tipoDocumentoIdentidad = e.target.options[e.target.selectedIndex].text;
                    document.getElementById('numeroIdentidad')?.focus();
                    console.log(
                      'soloPersonaNatural, cTDI, tDI',
                      props.soloPersonaNatural,
                      persona.codigoTipoDocumentoIdentidad,
                      persona.tipoDocumentoIdentidad
                    );
                  }}
                >
                  <option value={'6'} selected={persona.codigoTipoDocumentoIdentidad === '6'}>
                    RUC
                  </option>
                  <option value={'1'} selected={persona.codigoTipoDocumentoIdentidad === '1'}>
                    DNI
                  </option>
                  <option value={'4'} selected={persona.codigoTipoDocumentoIdentidad === '4'}>
                    C.EXT
                  </option>
                </select>
              )}
            </div>
          </div>
          {/* numero Identidad */}
          <div class="form-control">
            <label>Número identidad</label>
            <div class="form-control form-agrupado">
              <input
                id="numeroIdentidad"
                style={{ width: '100%' }}
                type="text"
                placeholder="Número identidad"
                value={persona.numeroIdentidad}
                onChange$={(e) => {
                  persona.numeroIdentidad = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                //   onChange={(e) => setNumeroIdentidad(e.target.value.trim())}
              />
              <ImgButton
                src={images.searchPLUS}
                alt="Icono de buscar de mercadería"
                height={16}
                width={16}
                title="Buscar datos de mercadería"
                //   onClick={buscarLaIdentidadAPIEXterna}
              />
            </div>
          </div>
          {persona.codigoTipoDocumentoIdentidad === '6' ? (
            // Razón social
            <div class="form-control">
              <label>Razón social</label>
              <div class="form-control form-agrupado">
                <input
                  id="razonSocial"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social"
                  value={persona.razonSocialNombre}
                  onChange$={(e) => {
                    persona.razonSocialNombre = (e.target as HTMLInputElement).value.trim().toUpperCase();
                  }}
                />
                <label style={{ color: condicion.value === 'HABIDO' ? 'green' : 'red', marginLeft: '5px' }}>
                  {condicion.value}
                </label>
              </div>
            </div>
          ) : (
            <>
              {/* //Nombre */}
              <div class="form-control">
                <label>Nombre</label>
                <div class="form-control form-agrupado">
                  <input
                    id="nombre"
                    style={{ width: '100%' }}
                    type="text"
                    placeholder="Nombre"
                    value={persona.nombre}
                    onChange$={(e) => {
                      persona.nombre = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                  />
                </div>
              </div>
              {/* //Ap Paterno */}
              <div class="form-control">
                <label>Apellido paterno</label>
                <div class="form-control form-agrupado">
                  <input
                    id="apellidoPaterno"
                    style={{ width: '100%' }}
                    type="text"
                    placeholder="Apellido paterno"
                    value={persona.paterno}
                    onChange$={(e) => {
                      persona.paterno = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                  />
                </div>
              </div>
              {/* //Ap Materno */}
              <div class="form-control">
                <label>Apellido materno</label>
                <div class="form-control form-agrupado">
                  <input
                    id="apellidoMaterno"
                    style={{ width: '100%' }}
                    type="text"
                    placeholder="Apellido materno"
                    value={persona.materno}
                    onChange$={(e) => {
                      persona.materno = (e.target as HTMLInputElement).value.trim().toUpperCase();
                    }}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          type="submit"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            grabando();
          }}
        />
      </div>
      {/* </Form> */}
    </div>
  );
});
