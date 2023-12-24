import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_NEW_EDIT_EQUIVALENCIA_IN } from './newEditEquivalenciaIN';
import { inUpUnidadEquivalencia } from '~/apis/lineaTipo.api';
import { parametrosGlobales } from '~/routes/login';

export default component$((props: { idLineaTipo: string; idUnidadEquivalencia: string; unidadEquivalencia: string }) => {
  //#region UNIDAD EQUIVALENCIA - NEW / EDIT
  const idUniEquiIN = useSignal(props.idUnidadEquivalencia);
  const uniEquiIN = useSignal(props.unidadEquivalencia);
  //#endregion UNIDAD EQUIVALENCIA - NEW / EDIT

  //#region CONTEXTOS
  const ctx_new_edit_equivalencia_in = useContext(CTX_NEW_EDIT_EQUIVALENCIA_IN);
  //#endregion CONTEXTOS

  //#region GRABAR UNIDAD EQUIVALENCIA
  const grabarUnidadEquivalencia = $(async () => {
    if (uniEquiIN.value === '') {
      alert('Ingrese la unidad equivalente');
      document.getElementById('in_unidadEquivalenciaIN_MICE')?.focus();
      return;
    }

    let laLinea = await inUpUnidadEquivalencia({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idLineaTipoMercaderia: props.idLineaTipo,
      idUnidadEquivalencia: idUniEquiIN.value,
      unidadEquivalencia: uniEquiIN.value,
    });

    console.log('graboooooo laLinea', laLinea);
    laLinea = laLinea.data;
    console.log('graboooooo laLinea.data', laLinea);

    ctx_new_edit_equivalencia_in.grabo_uniEq = true;
    ctx_new_edit_equivalencia_in.laLineaTipo = laLinea;
    ctx_new_edit_equivalencia_in.mostrarPanelNewEditUnidadEquivalenciaIN = false;
  });
  //#endregion GRABAR UNIDAD EQUIVALENCIA

  return (
    <div
      style={{
        width: 'clamp(min(10vw, 20rem), 700px, max(90vw, 55rem))',
        // width: 'auto',
        padding: '1px',
        background: '#c0c0c0',
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
          onClick={$(() => {
            ctx_new_edit_equivalencia_in.mostrarPanelNewEditUnidadEquivalenciaIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de unidad equivalencia</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        {/* Unidad de equivalencia */}
        <div class="form-control" style={{ margin: '10px 0' }}>
          <label>Unidad equivalencia</label>
          <div class="form-control form-agrupado">
            <input
              id="in_unidadEquivalenciaIN_MICE"
              style={{ width: '100%', background: '#eee' }}
              autoFocus
              type="text"
              placeholder="Unidad de equivalencia"
              value={uniEquiIN.value}
              onChange$={(e) => {
                uniEquiIN.value = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              onKeyUp$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('buttonGrabar_MI_P')?.focus();
                }
              }}
              onFocusin$={(e) => {
                (e.target as HTMLInputElement).select();
              }}
            />
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)} Sujeto a percepción*/}
        <input
          id="buttonGrabar_MI_P"
          type="submit"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            grabarUnidadEquivalencia();
          }}
        />
      </div>
      {/* </Form> */}
    </div>
  );
});
