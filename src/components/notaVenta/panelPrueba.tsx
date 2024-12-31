import { $, component$, useContext, useOnWindow, useSignal, useTask$ } from '@builder.io/qwik';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_NOTA_VENTA } from '~/routes/(ventas)/notaVenta';

function useAnalytics() {
  useOnWindow(
    'popstate',
    $((event) => {
      console.log('navigation happened 🚕🚕🚕', event);
      // report to analytics
    })
  );
}

export default component$((props: { paPrueba: any }) => {
  //#region CONTEXTO
  const ctx_index_nota_venta = useContext(CTX_INDEX_NOTA_VENTA);
  //#endregion CONTEXTO

  const ini = useSignal(0);
  // const contadorCaracter = useSignal(0);
  // const interval = useSignal<any>();
  // const iniBusqueda = useSignal(0);
  const codeBarra = useSignal('');
  // const codeBarra_II = useSignal('');
  // const reading = useSignal(false);
  const losCODEs = ['7702025120192', '7751731006306', '7750151008358', '7752748012045'];

  // document.getElementById('in_Pier')?.focus({ preventScroll: true });

  // const hert =
  // useOn(()=>{})
  // useOnDocument(
  //   'scroll',
  //   $((event) => console.log('body scrolled', event))
  // );
  useAnalytics();
  // useOn(()=>console.log(''))
  // useOnWindow(
  //   'focus',
  //   $((event) => {
  //     console.log('navigation happened', event);
  //     // report to analytics
  //   })
  // );
  // hert
  useTask$(({ track }) => {
    track(() => ini.value);
    document.querySelector('#exampleModal')?.addEventListener('shown', function () {
      console.log('🚑🚑🚑🚑🚑');
      // document.querySelector('#id_texto').focus();
      document.getElementById('in_Pier')?.focus();
    });

    if (ini.value === 0) {
      // document.querySelector('#exampleModal')?.aria
      document.querySelector('#exampleModal')?.addEventListener('shown', function () {
        console.log('🚑🚑🚑🚑🚑');
        // document.querySelector('#id_texto').focus();
        document.getElementById('in_Pier')?.focus();
      });
      // console.log('🚚🚚🚚🚚🚚🚚🚚', document.getElementsByName('pier'));
      // console.log('🚚🚚🚚🚚🚚🚚🚚', document.activeElement);
      // // document.activeElement?.remove();
      // // document.activeElement?.querySelector('#in_Pier');

      // console.log('🚚🚚🚚🚚🚚🚚🚚', document.getElementById('in_Pier')?.tabIndex);

      // // document.querySelectorAll("[tabindex='5']")[0].getAttribute('in_Pier');
      // // document.querySelector('in_Pier').foc
      // // const gfd = document.getElementById('in_Pier');
      // // gfd.style.backgroundColor = 'yellow';
      // // document.getElementById('modal_panelPrueba')?.focus();
      // // document.querySelector()
      // // document.querySelector('#in _Pier')?.addEventListener('focus', () => console.log('entro in_Pier'));
      // document.querySelector('#in _Pier');
      // // document.
      // console.log('🚚🚚🚚🚚', document.activeElement);
      // document.getElementById('in_Pier')?.addEventListener('focus', () =>     console.log('🌎🌎⛪⛪🌎🌎⛪⛪'));
      // document.getElementById('in_Pier')?.tabIndex;
      // document.getElementsByName('pier').values.
      ini.value++;
    }
  });
  //   document.getElementById('in_Pier')?.tabIndex
  //   const mytexarea = document.getElementById('in_Pier');
  //   window.onload = function () {
  //     mytexarea?.focus();
  //   };
  //   document.onload = function () {
  //     console.log('🚚🚚🚚🚚🚚🚚🚚');
  //     // document.getElementById('in_Pier')?.focus();
  //     // document.getElementById('in_Pier')?.scrollIntoView();
  //   };
  //   window.onload = function () {
  //     console.log('🚚🚚🚚🚚🚚🚚🚚');
  //     // document.getElementById('in_Pier')?.focus();
  //     // document.getElementById('in_Pier')?.scrollIntoView();
  //   };

  // const handleFocus = $((event: any) => {
  //   console.log('Input field is focused', event);
  // });

  return (
    // <body onLoad$={() => console.log('🌎🌎⛪⛪🌎🌎⛪⛪')}>
    <div
      id="modal_panelPrueba"
      style={{
        width: 'clamp(330px, 86%, 500px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
        background: '#eee',
      }}
      class="container-modal"
      onLoad$={() => console.log('🚍🚍🚍🚍🚍')}
      onFocus$={() => console.log('🚍🚍🚍🚍🚍 ffff')}
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <input
          id="cerrar_PanelPrueba"
          type="image"
          title="Cerrar el formulario"
          alt="icon cerrar"
          autoFocus
          tabIndex={1}
          src={images.x}
          height={18}
          width={18}
          // style={{ marginLeft: '2px' }}
          onClick$={() => {
            ctx_index_nota_venta.mostrarPanelPrueba = false;
          }}
        />
        {/* <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_index_nota_venta.mostrarPanelPrueba = false;
          })}
        /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          <label>¿Desea eliminar el ítem?</label>
          <br />
          <p style={{ fontSize: '0.8rem', margin: '8px 16px' }}>
            <strong>{props.paPrueba.codigo}</strong>
            <br />
            <strong>{props.paPrueba.descripcion}</strong>
            <br />
          </p>
          <div style={{ display: 'flex', marginTop: '8px', justifyContent: 'space-around', alignItems: 'center' }}>
            <input
              id="in_Pier"
              name="pier"
              type="text"
              // tabIndex={6}
              value={codeBarra.value}
              onChange$={(e) => {
                codeBarra.value = (e.target as HTMLInputElement).value.trim();
                console.log('ESTOY onChange onChange ', codeBarra.value);
                if (codeBarra.value.trim() !== '') {
                  const tre = losCODEs.find((ele) => ele === codeBarra.value);
                  // console.log('🍳🍳🍳🍳  ' + codeBarra.value, typeof tre === 'undefined' ? '🚨🚨🚨🚨🚨🚨🚨🚨' : '✅✅✅✅✅✅✅');
                  if (typeof tre === 'undefined') {
                    console.log('🚨🚨🚨🚨🚨🚨🚨🚨');
                    document.getElementById('modal_panelPrueba')?.style.setProperty('background-color', 'red');
                    // document.getElementById('modal_panelPrueba')?.style({'backgroundColor':'red'})
                    (e.target as HTMLInputElement).select();
                  } else {
                    console.log('✅✅✅✅✅✅✅✅');
                    document.getElementById('modal_panelPrueba')?.style.setProperty('background-color', 'white');
                    codeBarra.value = '';
                  }
                }
              }}
              // onFocus$={(e) => handleFocus(e)}
              // autoFocus
              // tabIndex={10}
              // onLoad$={() => {
              //   document.getElementById('in_Pier')?.focus({ preventScroll: false });
              //   document.getElementById('in_Pier')?.scrollIntoView();
              // }}
              // onFocusin$={() => console.log('ESTOY DENTROOOOOOOOOOOOOO 🚠🚟🚲🛴🚖🚔🚖')}
              // <onInput$={(e) => {
              //   // parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
              //   console.log('🚑🚑🚑🚑', e);
              // }}>
              // onKeyPress$={(e) => {
              //   // : any;
              //   // contadorCaracter.value++;
              //   // let timerId: any = setTimeout(() => console.log('no pasa nada'), 1000);
              //   // console.log('ESTOY ', e, codeBarra.value, contadorCaracter.value);
              //   if (e.key !== 'Enter') {
              //     // codeBarra.value += e.key;
              //     if (codeBarra.value.trim() !== '') {
              //       const tre = losCODEs.find((ele) => ele === codeBarra.value);
              //       console.log('🍳🍳🍳🍳  ' + codeBarra.value, typeof tre === 'undefined' ? '🚨🚨🚨🚨🚨🚨🚨🚨' : '✅✅✅✅✅✅✅');
              //     } else {
              //       console.log('💦💦💦💦💦💦  ');
              //     }
              //     codeBarra_II.value += e.key;
              //   } else {
              //     codeBarra_II.value += e.key;
              //     // clearInterval(timerId);
              //     console.log('..........', codeBarra.value, codeBarra_II.value);
              //     //buscar
              //     const tre = losCODEs.find((ele) => ele === codeBarra.value);
              //     console.log('🍳🍳🍳🍳  ' + codeBarra.value, typeof tre === 'undefined' ? '🚨🚨🚨🚨🚨🚨🚨🚨' : '✅✅✅✅✅✅✅');
              //     // timerId = 0;
              //   }
              //   // if (e.key === 'Enter') {
              //   //   const tre = losCODEs.find((ele) => ele === codeBarra.value);
              //   //   console.log('🍳🍳🍳🍳  ' + codeBarra.value, typeof tre === 'undefined' ? '🚨🚨🚨🚨🚨🚨🚨🚨' : '✅✅✅✅✅✅✅');
              //   //   codeBarra.value = '';
              //   // } else {
              //   //   codeBarra.value += e.key;
              //   // }
              // }}

              // onKeyDown$={(e) => {
              //   console.log('🚙🚙🚙🚙🚙🚙', e);
              //   // if (interval.value) clearInterval(interval.value);
              //   // if (e.key === 'Enter') {
              //   //   if (codeBarra.value) {
              //   //     //buscar codigo
              //   //     const tre = losCODEs.find((ele) => ele === codeBarra.value);
              //   //     console.log('🍳🍳🍳🍳  ' + codeBarra.value, typeof tre === 'undefined' ? '🚨🚨🚨🚨🚨🚨🚨🚨' : '✅✅✅✅✅✅✅');
              //   //   }
              //   //   codeBarra.value = '';
              //   //   return;
              //   // }
              //   // if (e.key != 'Shift') {
              //   //   codeBarra.value += e.key;
              //   // }
              //   // interval.value = setInterval(() => (codeBarra.value = ''), 20);
              // }}

              // onKeyPress$={(e) => {
              //   //usually scanners throw an 'Enter' key at the end of read
              //   if (e.keyCode === 13) {
              //     console.log('🚙🚙🚙🚙🚙🚙', e.keyCode);
              //     if (codeBarra.value.length > 10 && reading.value) {
              //       const tre = losCODEs.find((ele) => ele === codeBarra.value);
              //       console.log('🍳🍳🍳🍳  ' + codeBarra.value, typeof tre === 'undefined' ? '🚨🚨🚨🚨🚨🚨🚨🚨' : '✅✅✅✅✅✅✅');
              //       /// code ready to use
              //       codeBarra.value = '';
              //     } else {
              //       const tre = losCODEs.find((ele) => ele === codeBarra.value);
              //       console.log('🍳 ' + codeBarra.value, typeof tre === 'undefined' ? '🚨🚨🚨🚨🚨🚨🚨🚨' : '✅✅✅✅✅✅✅');
              //     }
              //   } else {
              //     console.log('🚙🚙🚙🚙', e.keyCode);
              //     codeBarra.value += e.key; //while this is not an 'enter' it stores the every key
              //   }

              //   //run a timeout of 200ms at the first read and clear everything
              //   if (!reading.value) {
              //     console.log('🚕🚕🚕', reading.value);
              //     reading.value = true;
              //     console.log('🚕🚕', reading.value);
              //     setTimeout(() => {
              //       codeBarra.value = '';
              //       reading.value = false;
              //       console.log('🚋🚋');
              //     }, 200); //200 works fine for me but you can adjust it

              //     console.log('🚕', reading.value);
              //   }
              // }}
            />
            <button
              id="in_SI"
              style={{ width: '60px' }}
              onClick$={() => {
                // document.getElementById('in_Pier')?.focus();
                // ctx_index_nota_venta.borrar_idAuxilarNotaVenta = props.paPrueba.idAuxiliar;
                // ctx_index_nota_venta.mostrarPanelPrueba = false;
                // 0;
              }}
              // onFocusin$={() => console.log('ESTOY DENTROOOOOOOOOOOOOO 🚠🚟🚟🚟🚟')}
            >
              SI
            </button>
            <button
              id="in_NO"
              // tabIndex={1}
              style={{ width: '60px' }}
              onClick$={() => {
                // console.log('codeBarra.value', codeBarra.value);
                // console.log('codeBarra_II.value', codeBarra_II.value);
                // console.log(document.getElementById('cerrar_PanelPrueba')?.tabIndex);
                // console.log(document.getElementById('in_Pier')?.tabIndex);
                // console.log(document.getElementById('in_SI')?.tabIndex);
                // console.log(document.getElementById('in_NO')?.tabIndex);
                // console.log(document.onfocus);
                // console.log('ESTOY FUERAAAAAAAAAAAAAA 🚠🚠🚠🚠🚠');
                ctx_index_nota_venta.mostrarPanelPrueba = false;
              }}
            >
              NO
            </button>
          </div>
        </div>
      </div>
    </div>
    // </body>
  );
});
