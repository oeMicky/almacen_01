import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_NEW_EDIT_MERCADERIA_IN } from './newEditMercaderiaIN';
import { inUpLineaTipoMercaderia } from '~/apis/lineaTipo.api';
import { parametrosGlobales } from '~/routes/login';

export default component$((props: { idLineaTipo: string; lineaTipo: string }) => {
  //#region LINEA TIPO
  const lineaTipo = useStore({
    id: props.idLineaTipo ? props.idLineaTipo : '',
    lineaTi: props.lineaTipo ? props.lineaTipo : '',
  });
  //#endregion LINEA TIPO

  //#region CONTEXTOS
  const ctx_new_edit_mercaderia_in = useContext(CTX_NEW_EDIT_MERCADERIA_IN);
  //#endregion CONTEXTOS

  //#region REGISTRAR LNEA TIPO
  const registrarLineaTipo = $(async () => {
    if (lineaTipo.lineaTi === '') {
      alert('Ingresar la linea / tipo');
      document.getElementById('in_loteTipoIN_MICE')?.focus();
      return;
    }

    const lT = await inUpLineaTipoMercaderia({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idLineaTipoMercaderia: lineaTipo.id,
      lineaTipoMercaderia: lineaTipo.lineaTi,
    });

    console.log('lT.data', lT.data);

    ctx_new_edit_mercaderia_in.grabo_lineaTipo = true;
    ctx_new_edit_mercaderia_in.mostrarPanelNewEditLineaTipoIN = false;
  });
  //#endregion REGISTRAR LNEA TIPO

  return (
    <div
      style={{
        width: 'clamp(min(386px, 86%, 700px)',
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
            ctx_new_edit_mercaderia_in.mostrarPanelNewEditLineaTipoIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de lote / tipo</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        {/* Lote / Tipo */}
        <div class="form-control" style={{ margin: '10px 0' }}>
          <label>Lote / Tipo</label>
          <div class="form-control form-agrupado">
            <input
              id="in_loteTipoIN_MICE"
              style={{ width: '100%', background: '#eee' }}
              autoFocus
              type="text"
              placeholder="Lote / Tipo"
              value={lineaTipo.lineaTi}
              onChange$={(e) => {
                lineaTipo.lineaTi = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              onKeyUp$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('bu_registrar_LineaTipo_MI_P')?.focus();
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
          id="bu_registrar_LineaTipo_MI_P"
          type="submit"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            registrarLineaTipo();
          }}
        />
      </div>
      {/* </Form> */}
    </div>
  );
});
