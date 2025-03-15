import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import ImgButton from '../../system/imgButton';
import { images } from '~/assets';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import { upCostoUnitarioPENMasIGV, upPrecioPublicoPEN } from '~/apis/mercaderia.api';
import { parametrosGlobales } from '~/routes/login';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
// import { parametrosGlobales } from '~/routes/login';

export default component$((props: { idMercaderia: any; descripcion: string; cuMASigv: any; pUtilidad: any; contexto: string }) => {
  //#region CONTEXTO
  // const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
  //#endregion CONTEXTO
  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'buscar_mercaderia_in':
      ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
      break;
    case 'index_kardex':
      ctx = useContext(CTX_INDEX_INVENTARIO);
      break;
    // case 'cotizacion':
    //   ctx = useContext(CTX_DOCS_COTIZACION);
    //   break;
    // case 'new_edit_cotizacion':
    //   ctx = useContext(CTX_NEW_EDIT_COTIZACION);
    //   break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZACION DE VARIABLES
  const conPrecioPublico = useSignal(true);
  const costoUnitarioMasIGV = useSignal(props.cuMASigv);
  const precioPublicoCalculado = useSignal(props.cuMASigv * (1 + props.pUtilidad / 100));
  const precioPublico = useSignal(0);
  const fechaActual = new Date();
  //#endregion INICIALIZACION DE VARIABLES

  //#region GRABAR PRECIO PUBLICO
  const grabarPrecioPublico = $(async () => {
    if (costoUnitarioMasIGV.value.toString().trim() === '' || costoUnitarioMasIGV.value === 0) {
      alert('Ingrese el Costo Unitario PEN + IGV');
      document.getElementById('in_Costo_Unitario')?.focus();
      return;
    }
    if (precioPublico.value.toString().trim() === '' || precioPublico.value === 0) {
      alert('Ingrese el Precio Público PEN');
      document.getElementById('in_Precio_Publico')?.focus();
      return;
    }
    console.log('grabarPrecioPublico', props.idMercaderia);
    console.log('fechaActual', fechaActual);
    console.log('costoUnitarioMasIGV', costoUnitarioMasIGV.value);
    console.log('precioPublicoCalculado', precioPublicoCalculado.value);
    console.log('precioPublico', precioPublico.value);
    try {
      const precioP = await upPrecioPublicoPEN({
        idMercaderia: props.idMercaderia,
        fechaPrecioUnitario: fechaActual,
        costoUnitarioPENMasIGV: costoUnitarioMasIGV.value,
        precioUnitarioCalculadoPEN: precioPublicoCalculado.value,
        precioUnitarioPEN: precioPublico.value,

        usuario: parametrosGlobales.usuario,
      });

      console.log('precioP', precioP);
      ctx.grabo_precio_publico = true;
      ctx.mostrarPanelEditPrecioPublicoIN = false;
    } catch (error) {
      console.log('grabarPrecioPublico error:', error);
      ctx.mostrarPanelEditPrecioPublicoIN = false;
    }
  });
  //#endregion GRABAR PRECIO PUBLICO

  //#region GRABAR COSTO UNITARIO MAS IGV
  const grabarSoloCostoUnitarioMasIGV = $(async () => {
    //|| costoUnitarioMasIGV.value === 0
    if (costoUnitarioMasIGV.value.toString().trim() === '') {
      alert('Ingrese el Costo Unitario PEN + IGV');
      document.getElementById('in_Costo_Unitario')?.focus();
      return;
    }

    console.log('grabarSoloCostoUnitarioMasIGV', props.idMercaderia);
    console.log('fechaActual', fechaActual);
    console.log('costoUnitarioMasIGV', costoUnitarioMasIGV.value);
    // console.log('precioPublicoCalculado', precioPublicoCalculado.value);
    // console.log('precioPublico', precioPublico.value);
    try {
      const costoP = await upCostoUnitarioPENMasIGV({
        idMercaderia: props.idMercaderia,
        fechaPrecioUnitario: fechaActual,
        costoUnitarioPENMasIGV: costoUnitarioMasIGV.value,

        usuario: parametrosGlobales.usuario,
      });

      console.log('costoP', costoP);
      ctx.grabo_precio_publico = true;
      ctx.mostrarPanelEditPrecioPublicoIN = false;
    } catch (error) {
      console.log('grabarSoloCostoUnitarioMasIGV error:', error);
      ctx.mostrarPanelEditPrecioPublicoIN = false;
    }
  });
  //#endregion GRABAR COSTO UNITARIO MAS IGV

  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 380px)',
        // width: 'auto',
        // border: '1px solid red',
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
            ctx.mostrarPanelEditPrecioPublicoIN = false;
          })}
        />
        {/* <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="Cerrar el formulario"
            onClick={$(() => {
              //console.log("itemVenta", props.borrarCuentaContable);
            })}
          /> */}
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'grey' }}>{props.descripcion}</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        <div>
          <div class="linea-formulario" style={{ marginBottom: '8px' }}>
            <label>Porcentaje Utilidad</label>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <label>{props.pUtilidad} %</label>
            </div>
          </div>
          <div class="linea-formulario" style={{ marginBottom: '8px' }}>
            <label>Costo Unitario PEN + IGV </label>
            <input
              id="in_Costo_Unitario"
              type="number"
              autoFocus={true}
              placeholder="Costo Unitario PEN + IGV"
              // class="input-formulario-usuario"
              value={costoUnitarioMasIGV.value}
              onFocus$={(e) => (e.target as HTMLInputElement).select()}
              onChange$={(e) => {
                costoUnitarioMasIGV.value = Number((e.target as HTMLInputElement).value);
                precioPublicoCalculado.value = Number((e.target as HTMLInputElement).value) * (1 + props.pUtilidad / 100);
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('in_Precio_Publico') as HTMLInputElement)?.focus();
                }
              }}
            />
          </div>
          <div class="linea-formulario" style={{ marginBottom: '8px' }}>
            <label>Precio Público Calculado PEN</label>
            {/* <input
              id="in_Precio_Publico_Calculado"
              type="number"
              disabled
              placeholder="Precio Público Calculado PEN"
              // class="input-formulario-usuario"
              value={precioPublicoCalculado.value}
              // onChange$={(e) => (definicion_CTX_CAMBIO_CLAVE.claveAnterior = (e.target as HTMLInputElement).value)}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  (document.getElementById('in_Precio_Publico') as HTMLInputElement)?.focus();
                }
              }}
            /> */}
            <label>{precioPublicoCalculado.value}</label>
          </div>
          <div style={{ borderRadius: '6px', padding: '6px 0', background: '#c5c6c7' }}>
            <div style={{ marginBottom: '8px' }}>
              <input
                id="chk_Con_Precio_Publico"
                type="checkbox"
                placeholder="Con Precio Público"
                style={{ cursor: 'pointer', margin: '2px' }}
                checked={conPrecioPublico.value}
                onChange$={(e) => {
                  conPrecioPublico.value = (e.target as HTMLInputElement).checked;
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('in_Precio_Publico')?.focus();
                  }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />

              <label for="chk_Con_Precio_Publico" style={{ cursor: 'pointer', marginLeft: '2px' }}>
                Con Precio Público
              </label>
            </div>
            <div class="linea-formulario" style={{ marginBottom: '8px' }}>
              <label>Precio Público PEN</label>
              <input
                id="in_Precio_Publico"
                type="number"
                placeholder="Precio Público"
                // class="input-formulario-usuario"
                style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'red' }}
                value={precioPublico.value}
                onChange$={(e) => (precioPublico.value = Number((e.target as HTMLInputElement).value))}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('in_btn_Grabar_USUARIO') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>

          <br />
        </div>

        {/* <button>Registrar</button> */}
        <input
          id="in_btn_Grabar_USUARIO"
          class="boton-formulario"
          style={{ height: '40px' }}
          type="button"
          value="Grabar"
          onClick$={() => {
            if (conPrecioPublico.value) {
              grabarPrecioPublico();
            } else {
              grabarSoloCostoUnitarioMasIGV();
            }
          }}
        />
      </div>
    </div>
  );
});
