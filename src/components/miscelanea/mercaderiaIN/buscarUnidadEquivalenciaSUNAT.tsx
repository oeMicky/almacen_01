import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
// import TablaUnidadesSUNAT from './tablaUnidadesSUNAT';
import { CTX_NEW_EDIT_MERCADERIA_IN } from './newEditMercaderiaIN';
import TablaUnidadesEquivalenciaSUNAT from './tablaUnidadesEquivalenciaSUNAT';
// import { CTX_NEW_EDIT_EQUIVALENCIA_IN } from './newEditEquivalenciaIN';

export default component$((props: { idLineaTipo: string; lineaTipo: string }) => {
  //#region CONTEXTO
  const ctx_new_edit_mercaderia_in = useContext(CTX_NEW_EDIT_MERCADERIA_IN);
  // const ctx_new_edit_equivalencia_in = useContext(CTX_NEW_EDIT_EQUIVALENCIA_IN);
  //#endregion CONTEXTO

  //#region INICIALIZAR
  //   const cadenaABuscar = useSignal('');
  const buscarUnidadesEquivalenciaSUNAT = useSignal(0);
  const parametrosBusqueda = useStore({
    cadenaABuscar: '', // 'acce 5', //cadena.value,
  });
  //#endregion INICIALIZAR

  //#region BUSCAR
  const localizarUnidadEquivalenciaSUNAT = $(() => {
    if (parametrosBusqueda.cadenaABuscar.trim() === '') {
      alert('Debe ingresar la descripción de la unidad de medida a buscar');
      document.getElementById('in_codigoDescripcion_BUSCAR_UNIDAD_EQUIVALENCIA_SUNAT')?.focus();
      return;
    }
    //console.log('buscarndo');
    buscarUnidadesEquivalenciaSUNAT.value++;
  });
  //#endregion BUSCAR

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 420px)',
        // width: 'auto',
        border: '1px solid red',
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
            ctx_new_edit_mercaderia_in.mostrarPanelBuscarUnidadEquivalenciaSUNAT = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Buscar unidad equivalencia SUNAT - {props.lineaTipo}</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_codigoDescripcion_BUSCAR_UNIDAD_EQUIVALENCIA_SUNAT"
                style={{ width: '100%', marginRight: '4px' }}
                type="text"
                placeholder="Ingrese la unidad de medida a buscar"
                value={parametrosBusqueda.cadenaABuscar}
                onInput$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  //console.log('onKeyPress', parametrosBusqueda.cadenaABuscar);
                  if (e.key === 'Enter') {
                    //console.log('onKeyPress - ENTER');
                    localizarUnidadEquivalenciaSUNAT();
                  }
                }}
              />
              <input
                type="image"
                title="Buscar datos de unidad de medida"
                alt="icono buscar"
                height={16}
                width={16}
                style={{ marginRight: '2px' }}
                src={images.searchPLUS}
                onClick$={() => {
                  localizarUnidadEquivalenciaSUNAT();
                }}
              />
            </div>
          </div>
        </div>
        {/*  tabla LOCALIZADOS UNIDAD SUNAT */}
        <div class="form-control">
          {buscarUnidadesEquivalenciaSUNAT.value > 0 ? (
            <TablaUnidadesEquivalenciaSUNAT
              idLineaTipo={props.idLineaTipo}
              lineaTipo={props.lineaTipo}
              buscarUnidadesEquivalenciaSUNAT={buscarUnidadesEquivalenciaSUNAT.value}
              cadenaABuscar={parametrosBusqueda}
            />
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  );
});
