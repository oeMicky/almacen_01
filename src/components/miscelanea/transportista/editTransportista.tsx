import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
// import { CTX_BUSCAR_TRANSPORTISTA } from '~/components/guiaRemision/buscarTransportista';
import ImgButton from '~/components/system/imgButton';
import { elIdAuxiliar } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';
import { CTX_BUSCAR_TRANSPORTISTA } from './buscarTransportista';
import { inUpTransportista } from '~/apis/transportista.api';

export default component$((props: { transportistaSeleccionado: any }) => {
  //#region CONTEXTOS
  const ctx = useContext(CTX_BUSCAR_TRANSPORTISTA);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const elTransportista = useStore({
    idTransportista: props.transportistaSeleccionado.idTransportista ? props.transportistaSeleccionado.idTransportista : '',
    idPersona: props.transportistaSeleccionado.idPersona ? props.transportistaSeleccionado.idPersona : '',
    idAuxiliar: props.transportistaSeleccionado.idAuxiliar ? props.transportistaSeleccionado.idAuxiliar : elIdAuxiliar(),

    activo: typeof props.transportistaSeleccionado.activo === 'undefined' ? true : props.transportistaSeleccionado.activo,

    codigoTipoDocumentoIdentidad: props.transportistaSeleccionado.codigoTipoDocumentoIdentidad
      ? props.transportistaSeleccionado.codigoTipoDocumentoIdentidad
      : '1',
    tipoDocumentoIdentidad: props.transportistaSeleccionado.tipoDocumentoIdentidad ? props.transportistaSeleccionado.tipoDocumentoIdentidad : 'DNI',
    numeroIdentidad: props.transportistaSeleccionado.numeroIdentidad ? props.transportistaSeleccionado.numeroIdentidad : '',
    razonSocialNombre: props.transportistaSeleccionado.razonSocialNombre ? props.transportistaSeleccionado.razonSocialNombre : '',
    registroMTC: props.transportistaSeleccionado.registroMTC ? props.transportistaSeleccionado.registroMTC : '',
  });
  //#endregion INICIALIZACION

  //#region UPDATE TRANSPORTISTA
  const actualizarTransportista = $(async () => {
    if (elTransportista.registroMTC.trim() === '') {
      alert('Debe ingresar la registro MTC');
      document.getElementById('input_registroMTC_Transportista')?.focus();
      return;
    }

    // const transportista =
    await inUpTransportista({
      idTransportista: elTransportista.idTransportista,
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idPersona: elTransportista.idPersona,
      activo: elTransportista.activo,
      registroMTC: elTransportista.registroMTC.trim(),

      usuario: parametrosGlobales.usuario,
    });

    ctx.actualizo_Transportista = true;
    ctx.mostrarPanelEditTransportista = false;
  });
  //#endregion UPDATE TRANSPORTISTA

  return (
    <div
      style={{
        width: 'clamp(386px, 86%, 600px)',
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
            ctx.mostrarPanelEditTransportista = false;
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de ver"
          title="Ver el formulario"
          height={18}
          width={18}
          onClick={$(() => {
            //console.log('props.transportistaSeleccionado', props.transportistaSeleccionado);
            //console.log('elTransportista', elTransportista);
          })}
        /> */}
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: '0.8rem' }}>Registro de Transportista</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* Activo */}
          <div>
            <div>
              <input
                id="in_activo_Transportista"
                // style={{ width: '100%' }}
                type="checkbox"
                placeholder="activo"
                checked={elTransportista.activo}
                // value="sujetoAPercepcion"
                name="activo"
                onChange$={(e) => {
                  elTransportista.activo = (e.target as HTMLInputElement).checked;
                }}
              />
              <label for="in_activo_Transportista">Activo</label>
            </div>
          </div>
          {/* tipo de documento identidad*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <select
                id="select_TipoDocumentoLiteral_Transportista"
                disabled
                // value={6}
                value={elTransportista.tipoDocumentoIdentidad}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];

                  elTransportista.codigoTipoDocumentoIdentidad = elOption.id;
                  elTransportista.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                }}
              >
                <option id="1" value="DNI" selected={elTransportista.tipoDocumentoIdentidad === 'DNI'}>
                  DNI
                </option>
                <option id="4" value="C.EXT" selected={elTransportista.tipoDocumentoIdentidad === 'C.EXT'}>
                  C.EXT
                </option>
                <option id="6" value="RUC" selected={elTransportista.tipoDocumentoIdentidad === 'RUC'}>
                  RUC
                </option>
              </select>
            </div>
          </div>

          {/* numero identidad*/}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_NumeroDocumentoIdentidad_REMITENTE"
                type="number"
                placeholder="Número Identidad Transportista"
                disabled
                style={{ width: '100%' }}
                value={elTransportista.numeroIdentidad}
                // onChange$={(e) => (elTransportista.numeroIdentidad = (e.target as HTMLInputElement).value)}
              />
            </div>
          </div>
          {/* Razon Social / Nombre */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_Nombre_Transportista"
                type="text"
                placeholder="Nombre Transportista"
                disabled
                style={{ width: '100%' }}
                value={elTransportista.razonSocialNombre}
              />
            </div>
          </div>
          {/* registroMTC */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="input_registroMTC_Transportista"
                type="text"
                placeholder="Registro MTC de Transportista"
                style={{ width: '100%' }}
                value={elTransportista.registroMTC}
                onChange$={(e) => {
                  elTransportista.registroMTC = (e.target as HTMLInputElement).value;
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('btn_RegistrarTransportista_DOCUMENTO')?.focus();
                  }
                }}
              />
            </div>
          </div>
          <br />
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_RegistrarTransportista_DOCUMENTO"
          type="button"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          onClick$={() => actualizarTransportista()}
        />
      </div>
    </div>
  );
});
