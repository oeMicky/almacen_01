import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_NEW_EDIT_MERCADERIA_IN } from './newEditMercaderiaIN';
import { parametrosGlobales } from '~/routes/login';
import { inUpMarca } from '~/apis/lineaTipo.api';

export default component$((props: { idLineaTipo: string; idMarca: string; marca: string }) => {
  //#region DEFINICON UNIDAD
  const marca = useStore({
    id: props.idMarca ? props.idMarca : '',
    mar: props.marca ? props.marca : '',
  });
  //#endregion DEFINICON UNIDAD

  //#region CONTEXTOS
  const ctx_new_edit_mercaderia_in = useContext(CTX_NEW_EDIT_MERCADERIA_IN);
  //#endregion CONTEXTOS

  //#region GRABAR MARCA
  const grabarMarca = $(async () => {
    if (marca.mar === '') {
      alert('Ingrese la marca');
      document.getElementById('in_marca_MARCA_IN')?.focus();
      return;
    }

    const lt = await inUpMarca({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idLineaTipoMercaderia: props.idLineaTipo,
      idMarca: marca.id,
      marca: marca.mar,
    });

    console.log('lt - marca', lt);
    console.log('lt.data - marca', lt.data);

    ctx_new_edit_mercaderia_in.grabo_marca = true;
    ctx_new_edit_mercaderia_in.laLineaTipo = lt.data;
    ctx_new_edit_mercaderia_in.mostrarPanelNewEditMarcaIN = false;
  });
  //#endregion GRABAR MARCA
  return (
    <div
      style={{
        width: 'clamp(338px, 86%, 700px)',
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
            ctx_new_edit_mercaderia_in.mostrarPanelNewEditMarcaIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de marca</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        {/* Marca  */}
        <div class="form-control" style={{ margin: '10px 0' }}>
          <label>Marca</label>
          <div class="form-control form-agrupado">
            <input
              id="in_marca_MARCA_IN"
              style={{ width: '100%', background: '#eee' }}
              autoFocus
              type="text"
              placeholder="Marca"
              value={marca.mar}
              onChange$={(e) => {
                marca.mar = (e.target as HTMLInputElement).value.trim().toUpperCase();
              }}
              onKeyUp$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('btn_grabar_MARCA_IN')?.focus();
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
          id="btn_grabar_MARCA_IN"
          type="submit"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          class="btn-centro"
          onClick$={() => {
            grabarMarca();
          }}
        />
      </div>
      {/* </Form> */}
    </div>
  );
});
