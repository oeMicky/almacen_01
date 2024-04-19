import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
// import { parametrosGlobales } from '~/routes/login';
import { CTX_NEW_EDIT_COMPRA } from '../compra/newEditCompra';
import TablaCuentaContable from './tablaCuentaContable';

export default component$((props: { ejercicio: number; idPlanContable: string; tipoDefault?: boolean }) => {
  //#region INICIALIZACION
  const buscarCuentaContable = useSignal(0);
  // const elemento = useSignal('');

  const parametrosBusqueda = useStore({
    idPlanContable: props.idPlanContable,
    buscarPor: 'POR CÓDIGO',
    cadenaABuscar: '',
  });
  //#endregion INICIALIZACION

  //#region CONTEXTO
  const ctx_new_edit_compra = useContext(CTX_NEW_EDIT_COMPRA);
  //#endregion CONTEXTO

  //#region BUSCAR CUENTA CONTABLES
  const localizarCodigoDescripcion_CUENTACONTABLE = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda!!!');
      document.getElementById('in_codigoDescripcion_CUENTACONTABLE')?.focus();
      return;
    }
    buscarCuentaContable.value++;
  });
  //#endregion BUSCAR CUENTA CONTABLES

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 496px)',
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
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_new_edit_compra.mostrarPanelBuscarCuentaContable = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Buscar cuenta contable - Plan contable {props.ejercicio}</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <label style={{ marginRight: '10px' }}></label>
            <div class="form-control form-agrupado">
              <select
                id="se_buscarPor_CUENTACONTABLE"
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
                id="in_codigoDescripcion_CUENTACONTABLE"
                style={{ width: '100%' }}
                type={parametrosBusqueda.buscarPor === 'POR CÓDIGO' ? 'number' : 'text'}
                placeholder="Ingrese la cuenta contable a buscar"
                value={parametrosBusqueda.cadenaABuscar}
                // onChange$={(e) => {
                //   parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                // }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('ima_BuscarCuentaContable')?.focus();
                  }
                  if (e.key === 'Escape') {
                    // console.log('🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧first', e);
                    document.getElementById('se_buscarPor_CUENTACONTABLE')?.focus();
                  }
                }}
                onInput$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value.trim();
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                // onKeyPress$={(e) => {
                //   if (e.key === 'Enter') {
                //     localizarMercaderiasOUT();
                //   }
                // }}
              />
              <input
                id="ima_BuscarCuentaContable"
                type="image"
                src={images.searchPLUS}
                title="Buscar cuenta contable"
                height={12}
                width={12}
                style={{ margin: '2px' }}
                // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                onClick$={() => {
                  localizarCodigoDescripcion_CUENTACONTABLE();
                }}
                onKeyPress$={(e) => {
                  // if (e.key === 'Enter') {
                  //   document.getElementById('ima_BuscarCuentaContable')?.focus();
                  // }
                  if (e.key === 'Escape') {
                    // console.log('🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧first', e);
                    document.getElementById('in_codigoDescripcion_CUENTACONTABLE')?.focus();
                  }
                }}
              />
              {/* <input
                id="ima_AdicionarCuentaContable"
                type="image"
                src={images.add}
                title="Adicionar cuenta contable"
                height={12}
                width={12}
                style={{ margin: '2px' }}
                // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                // onClick$={() => {
                //   localizarMercaderiasOUT();
                // }}
              /> */}
            </div>
          </div>
          <br></br>
          {/* ADICIONAR CUENTA CONTABLE */}
          {/* <div class="form-control">
            <div class="form-control form-agrupado">
             
            </div>
          </div>
        </div>
        <br></br> */}
          {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
          <div class="form-control">
            {buscarCuentaContable.value > 0 ? (
              <TablaCuentaContable
                buscarCuentaContable={buscarCuentaContable.value}
                parametrosBusqueda={parametrosBusqueda}
                tipoDefault={props.tipoDefault}
                // contexto={props.contexto}
                // esAlmacen={props.esAlmacen}
              />
            ) : (
              ''
            )}
            {/* {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelMercaderiaOUTSeleccionada && (
            <div class="modal">
              <MercaderiaOUTSeleccionada
                mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM}
                elKardex={definicion_CTX_BUSCAR_MERCADERIA_OUT.kK}
                esAlmacen={props.esAlmacen}
                // esAlmacen={false}
                contexto={'buscar_mercaderia_out'}
                contextoParaDocumento={props.contexto}
              />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelAsignarPrecioOUT && (
            <div class="modal">
              <AsignarPrecioOUT mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM} />
            </div>
          )}
          {definicion_CTX_BUSCAR_MERCADERIA_OUT.mostrarPanelKardexsOUT && (
            <div class="modal">
              <KardexsOUT
                mercaOUTSelecci={definicion_CTX_BUSCAR_MERCADERIA_OUT.mM}
                esAlmacen={props.esAlmacen}
                contexto={props.contexto}
              />
            </div>
          )} */}
          </div>
        </div>
      </div>
    </div>
  );
});
