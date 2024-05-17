import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import { CTX_NEW_EDIT_CUENTA_CONTABLE } from './newEditCuentaContable';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import TablaCuentaDestino from './tablaCuentaDestino';

export const CTX_BUSCAR_CUENTA_DESTINO = createContextId<any>('__buscar_cuenta_destino');

export default component$((props: { ejercicio: number; idPlanContable: string; tipoDefault?: boolean }) => {
  //#region BUSCAR CUENTA DESTINO
  const definicion_CTX_BUSCAR_CUENTA_DESTINO = useStore({
    cC: [],
    mostrarPanelNewEditCuentaDestino: false,
  });
  useContextProvider(CTX_BUSCAR_CUENTA_DESTINO, definicion_CTX_BUSCAR_CUENTA_DESTINO);
  //#endregion BUSCAR CUENTA DESTINO

  //#region INICIALIZACION
  const buscarCuentaDestino = useSignal(0);
  // const elemento = useSignal('');

  const parametrosBusqueda = useStore({
    idPlanContable: props.idPlanContable,
    buscarPor: 'POR CÓDIGO',
    cadenaABuscar: '',
  });
  //#endregion INICIALIZACION

  //#region CONTEXTO
  const ctx_new_edit_cuenta_contable = useContext(CTX_NEW_EDIT_CUENTA_CONTABLE);
  //#endregion CONTEXTO

  //#region BUSCAR CUENTA DESTINO
  const localizarCodigoDescripcion_CUENTADESTINO = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda!!!');
      document.getElementById('in_codigoDescripcion_CUENTADESTINO')?.focus();
      return;
    }
    buscarCuentaDestino.value++;
  });
  //#endregion BUSCAR CUENTA DESTINO

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 464px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
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
            ctx_new_edit_cuenta_contable.mostrarPanelBuscarCuentaDestino = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Buscar cuenta destino - Plan contable {props.ejercicio}</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <label style={{ marginRight: '10px' }}></label>
            <div class="form-control form-agrupado">
              <select
                id="se_buscarPor_CUENTADESTINO"
                disabled
                onChange$={() => {
                  document.getElementById('codigoDescripcion_CUENTA')?.focus();
                }}
              >
                <option value="POR CÓDIGO" selected={parametrosBusqueda.buscarPor === 'POR CÓDIGO'}>
                  POR CÓDIGO
                </option>
                <option value="POR DESCRIPCIÓN" selected={parametrosBusqueda.buscarPor === 'POR DESCRIPCIÓN'}>
                  POR DESCRIPCIÓN
                </option>
              </select>
              <input
                id="in_codigoDescripcion_CUENTADESTINO"
                style={{ width: '100%' }}
                type={parametrosBusqueda.buscarPor === 'POR CÓDIGO' ? 'number' : 'text'}
                placeholder="Ingrese la cuenta destino a buscar"
                value={parametrosBusqueda.cadenaABuscar}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('ima_BuscarCuentaDestino')?.focus();
                  }
                  if (e.key === 'Escape') {
                    // console.log('🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧first', e);
                    document.getElementById('se_buscarPor_CUENTADESTINO')?.focus();
                  }
                }}
                onInput$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value.trim();
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <input
                id="ima_BuscarCuentaDestino"
                type="image"
                src={images.searchPLUS}
                title="Buscar cuenta destino"
                height={12}
                width={12}
                style={{ margin: '2px' }}
                // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                onClick$={() => {
                  localizarCodigoDescripcion_CUENTADESTINO();
                }}
                onKeyPress$={(e) => {
                  // if (e.key === 'Enter') {
                  //   document.getElementById('ima_BuscarCuentaContable')?.focus();
                  // }
                  if (e.key === 'Escape') {
                    // console.log('🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧first', e);
                    document.getElementById('in_codigoDescripcion_CUENTADESTINO')?.focus();
                  }
                }}
              />
            </div>
          </div>
          <br></br>

          {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
          <div class="form-control">
            {buscarCuentaDestino.value > 0 ? (
              <TablaCuentaDestino
                buscarCuentaDestino={buscarCuentaDestino.value}
                parametrosBusqueda={parametrosBusqueda}
                tipoDefault={props.tipoDefault}
              />
            ) : (
              ''
            )}
            {/* {definicion_CTX_BUSCAR_CUENTA_DESTINO.mostrarPanelNewEditCuentaDestino && (
              <div class="modal">
                <NewEditCuentaContable CCSelecionada={definicion_CTX_BUSCAR_CUENTA_CONTABLE.cC} />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
});
