import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { parametrosGlobales } from '~/routes/login';
import { grabarPrecio } from '~/apis/mercaderia.api';
import { CTX_BUSQUEDA_MERCADERIA_OUT } from './busquedaMercaderiaOUT';

export default component$((props: { mercaderiaSeleccionada: any }) => {
  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  const ctx_busqueda_mercaderia_out = useContext(CTX_BUSQUEDA_MERCADERIA_OUT);
  //#endregion CONTEXTOS

  //#region ON SUBMIT
  const onSubmit = $(async () => {
    if ((document.getElementById('inputPrecio') as HTMLInputElement)?.value.trim() === '') {
      alert('Ingrese el precio.');
      document.getElementById('inputPrecio')?.focus();
      return;
    }
    console.log('on......Submit');
    const enviarDatos = await grabarPrecio({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      idMercaderia: props.mercaderiaSeleccionada._id,
      usuario: parametrosGlobales.usuario,

      precio: (document.getElementById('inputPrecio') as HTMLInputElement)?.value.trim(),
      //document.getElementById('inputPrecio')?.value,
    });
    console.log('enviarDatos:', enviarDatos);
    ctx_busqueda_mercaderia_out.graboPrecio = true;
    ctx_docs_orden_servicio.mostrarPanelAsignarPrecio = false;
  });
  //#endregion ON SUBMIT

  return (
    <div style={{ width: 'auto', border: '1px solid red', padding: '2px' }} class="container-modal">
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_docs_orden_servicio.mostrarPanelAsignarPrecio = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('mercaderiaSeleccionada', props.mercaderiaSeleccionada);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* DATOS */}
        <div style={{ fontSize: 'small', fontWeight: 'lighter' }}>
          {/* Descripcion */}
          <div class="form-control">
            <strong>
              <i>{props.mercaderiaSeleccionada.descripcion}</i>
            </strong>
          </div>
          {/* Costo */}
          <div class="form-control">
            <label>Costo</label>
            <div class="form-control form-agrupado">
              <input id="inputCosto" style={{ width: '100%' }} type="text" disabled placeholder="Costo" />
            </div>
          </div>
          {/* Utilidad */}
          <div class="form-control">
            <label>Utilidad</label>
            <div class="form-control form-agrupado">
              <input id="inputUtilidad" style={{ width: '100%' }} type="text" disabled placeholder="Utilidad" />
            </div>
          </div>
          {/* Precio */}
          <div class="form-control">
            |<label>Precio</label>
            <div class="form-control form-agrupado">
              <input
                id="inputPrecio"
                style={{ width: '100%', textAlign: 'end', marginRight: '2px' }}
                type="text"
                placeholder="Adicionar Precio"
                value={props.mercaderiaSeleccionada.precio.$numberDecimal}
                // onInput$={()=>{}}
                //   onChange={(e) => setPrecio(e.target.value)}
              />
            </div>
          </div>
        </div>
        {/* GRABAR */}
        <input
          type="button"
          value="Grabar "
          class="btn-centro"
          onClick$={() => {
            onSubmit();
          }}
          //   onClick={(e) => onSubmit(e)}
        />
      </div>
    </div>
  );
});
