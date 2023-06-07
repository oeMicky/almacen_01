import { $, component$, useContext, useStore } from '@builder.io/qwik';
import { inUpServicio } from '~/apis/servicio.api';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { IServicio } from '~/interfaces/iServicio';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import { parametrosGlobales } from '~/routes/login';

export default component$((props: { serviSelecci: any }) => {
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);

  const servicio = useStore<IServicio>({
    _id: props.serviSelecci._id ? props.serviSelecci._id : '',
    activo: props.serviSelecci.activo ? props.serviSelecci.activo : true,
    codigo: props.serviSelecci.codigo ? props.serviSelecci.codigo : '',
    descripcion: props.serviSelecci.descripcion ? props.serviSelecci.descripcion : '',
    precioPEN: props.serviSelecci.precioPEN ? props.serviSelecci.precioPEN : 0,
  });

  const onSubmit = $(async () => {
    if (servicio.descripcion === '') {
      alert('Ingrese la descripción del servicio.');
      (document.getElementById('inputDescripcionServicio') as HTMLInputElement)?.focus();
      return;
    }
    if (servicio.precioPEN === '') {
      alert('Ingrese el preccio (PEN) del servicio.');
      (document.getElementById('inputPrecioServicio') as HTMLInputElement)?.focus();
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

    ctx_docs_venta.mostrarAddNewEditServicio = false;
  });

  return (
    <div style={{ width: 'auto', padding: '2px' }} class="container-modal">
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_docs_venta.mostrarAddNewEditServicio = false;
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
                id="inputCodigoServicio"
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
                id="inputDescripcionServicio"
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
                    (document.getElementById('inputPrecioServicio') as HTMLInputElement)?.focus();
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
                id="inputPrecioServicio"
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
                    (document.getElementById('buttonRegistrarServicio') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="buttonRegistrarServicio"
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
