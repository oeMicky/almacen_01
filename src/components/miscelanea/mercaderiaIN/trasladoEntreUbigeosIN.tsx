import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_LISTA_UBIGEOS_STOCKS_IN } from './listaUbigeosStocksIN';
import { upTrasladoInterno } from '~/apis/kardex.api';
// import { CTX_LISTA_UBIGEOS_STOCKS_IN } from './listaUbigeosStocksIN';

export default component$((props: { descripcion: string; idKardex: string; desde: any; listaOrigen: any }) => {
  //#region CONTEXTO
  //   const ctx_lista_ubigeos_stocks_in = useContext(CTX_LISTA_UBIGEOS_STOCKS_IN);
  const ctx_lista_ubigeos_stocks_in = useContext(CTX_LISTA_UBIGEOS_STOCKS_IN);
  //#endregion CONTEXTO

  //#region CONTEXTO
  //   const ctx_lista_ubigeos_stocks_in = useContext(CTX_LISTA_UBIGEOS_STOCKS_IN);
  const cantidad = useSignal(0);
  const listaUbigeos = useSignal(props.listaOrigen.filter((ubigeo: any) => ubigeo._id !== props.desde._id));

  const ubigeoDestino = useStore({
    id: '',
    hacia: '',
  });
  //#endregion CONTEXTO
  return (
    <div
      style={{
        width: 'clamp(300px, 100%,354px)',
        // width: 'auto',
        // border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('desde', props.desde);
            console.log('listaUbigeos', listaUbigeos.value);
            console.log('cantidad.value', cantidad.value);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_lista_ubigeos_stocks_in.mostrarPanelTrasladoEntreUbigeosIN = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'grey' }}>{props.descripcion}</h3>

      {/* FORMULARIO */}
      <div class="add-form">
        <div>
          <div class="linea_1_11">
            <div style={{ display: 'flex', gap: '8px' }}>
              <label>Desde</label>
              <input
                type="text"
                id="de"
                value={props.desde.ubigeo}
                readOnly
                style={{ width: 'clamp(128px, 100%,204px)', background: '#eee', fontWeight: 'bold' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <label>Hacia</label>
              <select
                id="se_UbigeoDestino"
                style={{ cursor: 'pointer', width: 'clamp(128px, 100%,204px)' }}
                onChange$={(e) => {
                  // document.getElementById('cantidad')?.focus();
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const elSelect = e.target as HTMLSelectElement;
                  const elOption = elSelect[idx];

                  ubigeoDestino.id = elOption.id;
                  ubigeoDestino.hacia = (e.target as HTMLSelectElement).value;
                  console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀', ubigeoDestino.id, ubigeoDestino.hacia);

                  document.getElementById('in_cantidad')?.focus();
                }}
                // onKeyPress$={(e) => {
                //   if (e.key === 'Enter') {
                //     document.getElementById('cantidad')?.focus();
                //   }
                // }}
              >
                <option value="">Seleccione...</option>
                {listaUbigeos.value.map((ubigeo: any) => {
                  return (
                    <option id={ubigeo._id} value={ubigeo.ubigeo}>
                      {ubigeo.ubigeo}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <br />
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <input
              id="in_cantidad"
              type="number"
              placeholder="Cantidad"
              min={0}
              max={props.desde.stock.$numberDecimal}
              value={cantidad.value}
              style={{ width: 'clamp(128px, 100%,204px)' }}
              onChange$={(e) => {
                cantidad.value = parseInt((e.target as HTMLInputElement).value);
                if (cantidad.value > props.desde.stock.$numberDecimal) {
                  cantidad.value = props.desde.stock.$numberDecimal;
                }
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  document.getElementById('btn_GrabarTrasladoInterno')?.focus();
                }
              }}
              onFocusin$={(e) => {
                (e.target as HTMLInputElement).select();
              }}
            />
          </div>

          <br />
        </div>

        <input
          id="btn_GrabarTrasladoInterno"
          type="button"
          // disabled
          value="Grabar TRASLADO INTERNO"
          class="btn-centro"
          // style={{ cursor: 'pointer', height: '40px', backgroundColor: 'grey' }}     style={{ width: 'clamp(128px, 100%,204px)' }}
          style={{ cursor: 'pointer', height: '40px' }}
          onClick$={async () => {
            if (ubigeoDestino.id === '') {
              alert('Seleccione el ubigeo destino');
              document.getElementById('se_UbigeoDestino')?.focus();
              return;
            }
            if (
              cantidad.value.toString().trim() === '' ||
              cantidad.value === null ||
              cantidad.value === undefined ||
              cantidad.value < 0 ||
              isNaN(cantidad.value)
            ) {
              alert('Ingrese la cantidad a trasladar');
              document.getElementById('in_cantidad')?.focus();
              return;
            }
            if (cantidad.value === 0) {
              alert('La cantidad a trasladar no puede ser cero (0)');
              document.getElementById('in_cantidad')?.focus();
              return;
            }
            console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀', cantidad.value, props.desde, ubigeoDestino);

            const actualizarKardex = await upTrasladoInterno({
              idKardex: props.idKardex,
              idDesde: props.desde._id,
              idHacia: ubigeoDestino.id,
              cantidad: cantidad.value,
            });

            console.log('✈✈✈✈✈✈✈✈✈', actualizarKardex);
            ctx_lista_ubigeos_stocks_in.grabo_UbigeoStock++;
            ctx_lista_ubigeos_stocks_in.mostrarPanelTrasladoEntreUbigeosIN = false;
            // alert('Grabar TRASLADO INTERNO: ' + cantidad.value);
            ////// AGRUPAR ITEMS NUEVOS Y Q NO TIENE KARDEX
            // let nroFilas = definicion_CTX_IN_ALMACEN.itemsMercaderias.length;

            // for (let index = 0; index < definicion_CTX_IN_ALMACEN.itemsMercaderias.length; index++) {
            //   const element = definicion_CTX_IN_ALMACEN.itemsMercaderias[index];
            //   if (typeof element.idKardex === 'undefined') {
            //     let iWHILE = index + 1;
            //     while (iWHILE < nroFilas) {
            //       const elementWHILE = definicion_CTX_IN_ALMACEN.itemsMercaderias[iWHILE];
            //       if (element.idMercaderia === elementWHILE.idMercaderia) {
            //         if (typeof elementWHILE.idKardex === 'undefined') {
            //           element.cantidadIngresada += elementWHILE.cantidadIngresada;

            //           definicion_CTX_IN_ALMACEN.itemsMercaderias.splice(iWHILE, 1);
            //           nroFilas--;
            //         }
            //       } else {
            //         iWHILE++;
            //       }
            //     }
            //   }
            // }
            ///////// REGISTRAR INGRESO
            // registrarIngreso();
          }}
        />
      </div>
    </div>
  );
});
