import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { inUpServicio } from '~/apis/servicio.api';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { IServicio } from '~/interfaces/iServicio';
import { CTX_INDEX_COTIZACION } from '~/routes/(almacen)/cotizacion';
import { CTX_INDEX_VENTA } from '~/routes/(almacen)/venta';
import { CTX_INDEX_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { parametrosGlobales } from '~/routes/login';
import { CTX_BUSCAR_SERVICIO } from './buscarServicio';
// import { CTX_SERVICIO } from './seleccionarServicio';

export default component$((props: { serviSelecci: any; contexto: any }) => {
  //#region DEFINICION SERVICIO - NEW  /EDIT
  const servicio = useStore<IServicio>({
    _id: props.serviSelecci._id ? props.serviSelecci._id : '',
    activo: props.serviSelecci.activo ? props.serviSelecci.activo : true,
    codigo: props.serviSelecci.codigo ? props.serviSelecci.codigo : '',
    descripcion: props.serviSelecci.descripcion ? props.serviSelecci.descripcion : '',
    precioPEN: props.serviSelecci.precioPEN ? props.serviSelecci.precioPEN : 0,
  });
  //#endregion DEFINICION SERVICIO

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'orden servicio':
      ctx = useContext(CTX_INDEX_ORDEN_SERVICIO);
      break;
    case 'venta':
      ctx = useContext(CTX_INDEX_VENTA);
      break;
    case 'cotizacion':
      ctx = useContext(CTX_INDEX_COTIZACION);
      break;
  }
  const ctx_buscar_servicio = useContext(CTX_BUSCAR_SERVICIO);
  //#endregion CONTEXTOS

  const onSubmit = $(async () => {
    if (servicio.descripcion === '') {
      alert('Ingrese la descripción del servicio.');
      (document.getElementById('in_descripcion_SERVICIO') as HTMLInputElement)?.focus();
      return;
    }
    if (servicio.precioPEN === '') {
      alert('Ingrese el preccio (PEN) del servicio.');
      (document.getElementById('in_precio_SERVICIO') as HTMLInputElement)?.focus();
      return;
    }

    console.log('servicio', servicio);

    const servicioGrabado = await inUpServicio({
      idServicio: servicio._id,

      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      activo: servicio.activo,

      codigo: servicio.codigo.toUpperCase(),
      descripcion: servicio.descripcion.toUpperCase(),
      precioPEN: servicio.precioPEN,
    });
    console.log('servicioGrabado', servicioGrabado);

    // ctx_docs_venta.mostrarAddNewEditServicio = false;
    ctx_buscar_servicio.grabo_Servicio = true;

    // ctx.mostrarPanelNewEditServicio = false;
    ctx_buscar_servicio.mostrarPanelNewEditServicio = false;
  });

  return (
    <div
      style={{
        width: 'clamp(min(10vw, 20rem), 700px, max(90vw, 55rem))',
        // width: 'auto',
        padding: '2px',
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
            ctx_buscar_servicio.mostrarPanelNewEditServicio = false;
          })}
          // onClick={(e) => {
          //   let soloCerrar = true;
          //   onCerrar({ soloCerrar });
          // }}
        />
      </div>
      {/* TITULO */}
      <h3>Registro de servicio</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* codigo */}
          <div class="form-control">
            <label>Código</label>
            <div class="form-control form-agrupado">
              <input
                id="in_codigo_SERVICIO"
                style={{ width: '100%' }}
                type="text"
                disabled
                placeholder="Código"
                value={servicio.codigo}
                // onChange={(e) => setCodigo(e.target.value.trim())}
              />
            </div>
          </div>
          {/* Descripcion */}
          <div class="form-control">
            <label>Descripción</label>
            <div class="form-control form-agrupado">
              <input
                id="in_descripcion_SERVICIO"
                style={{ width: '100%' }}
                type="text"
                autoFocus
                placeholder="Add descripción"
                value={servicio.descripcion}
                onInput$={(e) => {
                  servicio.descripcion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                // onChange$={(e) => {
                //   servicio.descripcion = (e.target as HTMLInputElement).value.trim().toUpperCase();
                // }}
                // onChange={(e) => setDescripcionEquivalencia(e.target.value.trim())}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('in_precio_SERVICIO') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* Precio */}
          <div class="form-control">
            <label>Precio</label>
            <div class="form-control form-agrupado">
              <input
                id="in_precio_SERVICIO"
                style={{ width: '100%' }}
                type="text"
                placeholder="Add precio (PEN)"
                value={servicio.precioPEN}
                onChange$={(e) => {
                  servicio.precioPEN = parseFloat((e.target as HTMLInputElement).value.trim());
                }}
                // onChange={(e) => setPrecioPEN(e.target.value.trim())}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('btn_registrar_SERVICIO') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="btn_registrar_SERVICIO"
          type="button"
          value={'Registrar'} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          onClick$={() => onSubmit()}
          //   onClick={(e) => onSubmit(e)}
        />
      </div>
    </div>
  );
});
