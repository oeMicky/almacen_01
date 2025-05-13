import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import { inUpUbigeo2 } from '~/apis/kardex.api';
import { parametrosGlobales } from '~/routes/login';
import { CTX_BUSCAR_MERCADERIA_OUT } from '../mercaderiaOUT/buscarMercaderiaOUT';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import { CTX_LISTA_UBIGEOS_STOCKS_IN } from './listaUbigeosStocksIN';
import { CTX_VER_LISTA_UBIGEOS_STOCKS_IN } from '~/components/kardex/verListaUbigeos';

export default component$((props: { idKardex: any; ubigeo: string; contexto: string }) => {
  //#region CONTEXTOS
  // const ctx_buscar_mercaderia_in = useContext();
  //#endregion CONTEXTOS
  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'buscar_mercaderia_in':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
      break;
    case 'lista_ubigeos_stocks_in':
      ctx = useContext(CTX_LISTA_UBIGEOS_STOCKS_IN);
      break;
    case 'ver_lista_ubigeos':
      ctx = useContext(CTX_VER_LISTA_UBIGEOS_STOCKS_IN);
      break;
    case 'buscar_mercaderia_out':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_OUT);
      break;
    case 'index_kardexs':
      ctx = useContext(CTX_INDEX_INVENTARIO);
      break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZAR
  const ini = useSignal(0);
  const UBI = useSignal(props.ubigeo);

  useTask$(({ track }) => {
    track(() => ini.value);
    console.log('🤍 entro a useTask INI');
    // obtenerLineasTipos();
    // obtenerPorcentajesUtilidad();
    setTimeout(() => {
      // document.getElementById('image_BuscarCliente')?.focus();
      document.getElementById('in_ubigeoIN_MICE')?.focus();
    }, 100);
    ctx.mostrarSpinner = false;
  });
  //#endregion INICIALIZAR

  //#region GRABAR UBIGEO
  const grabarUbigeo = $(async () => {
    if (typeof UBI.value === 'undefined' || UBI.value === null || UBI.value.trim() === '') {
      alert('Ingrese el ubigeo');
      document.getElementById('in_ubigeoIN_MICE')?.focus();
      return;
    }
    if (UBI.value.trim().toLocaleUpperCase() === 'TRASLADO') {
      alert('No puede usar la palabra clave TRASLADO como ubigeo.');
      document.getElementById('in_ubigeoIN_MICE')?.focus();
      return;
    }
    ctx.mostrarSpinner = true;
    // const lt =
    await inUpUbigeo2({
      idKardex: props.idKardex,
      ubigeo: UBI.value as string,

      usuario: parametrosGlobales.usuario,
    });
    // ctx.mostrarSpinner = false;

    ctx.grabo_UbigeoStock++;
    // ctx_buscar_mercaderia_in.laLineaTipo = lt.data;
    ctx.mostrarPanelNewEditUbigeosStocksIN = false;
  });
  //#endregion GRABAR UBIGEO
  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 390px)',
        // width: 'auto',
        padding: '2px',
        // background: '#c0c0c0',
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
            ctx.mostrarPanelNewEditUbigeosStocksIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de ubigeo 8</h3>
      {/* FORMULARIO */}

      <div class="add-form">
        {/* Ubigeo  */}
        {/* <div class="form-control">
          <div class="form-control form-agrupado"> */}
        <div>
          <div>
            <input
              id="in_ubigeoIN_MICE"
              style={{ width: '100%' }}
              autoFocus
              type="text"
              placeholder="Ubigeo"
              value={UBI.value}
              onChange$={(e) => {
                console.log('ANTES UBI.value ', UBI.value);
                UBI.value = (e.target as HTMLInputElement).value.trim().toUpperCase();
                console.log('DESPUES UBI.value ', UBI.value);
              }}
              onKeyUp$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('buttonGrabar_Ubigeo_IN')?.focus();
                }
              }}
              // onFocusin$={(e) => {
              //   (e.target as HTMLInputElement).select();
              // }}
            />
          </div>
          <br />
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)} Sujeto a percepción*/}
        <input
          id="buttonGrabar_Ubigeo_IN"
          type="submit"
          value="Grabar" //REGISTRAR // SELECCIONAR // ACTUALIZAR
          style={{ cursor: 'pointer', height: '40px' }}
          class="btn-centro"
          onClick$={() => {
            grabarUbigeo();
          }}
        />
      </div>
      {/* </Form> */}
    </div>
  );
});
