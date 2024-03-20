import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { inUpServicio } from '~/apis/servicio.api';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import type { IServicio } from '~/interfaces/iServicio';
// import { CTX_INDEX_COTIZACION } from '~/routes/(almacen)/cotizacion';
// import { CTX_INDEX_VENTA } from '~/routes/(almacen)/venta';
// import { CTX_INDEX_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
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
    tipoImpuesto: props.serviSelecci.tipoImpuesto ? props.serviSelecci.tipoImpuesto : 'IGV',
    tipoAfectacionDelImpuesto: props.serviSelecci.tipoAfectacionDelImpuesto ? props.serviSelecci.tipoAfectacionDelImpuesto : '10',

    codigoContableVenta: props.serviSelecci.codigoContableVenta
      ? props.serviSelecci.codigoContableVenta
      : parametrosGlobales.codigoContableVentaServicio || '',
    descripcionContableVenta: props.serviSelecci.descripcionContableVenta
      ? props.serviSelecci.descripcionContableVenta
      : parametrosGlobales.descripcionContableVentaServicio || '',
  });
  //#endregion DEFINICION SERVICIO

  //#region CONTEXTOS
  // const ctx: any = [];
  switch (props.contexto) {
    case 'orden servicio':
      // ctx = useContext(CTX_INDEX_ORDEN_SERVICIO);
      break;
    case 'venta':
      // ctx = useContext(CTX_INDEX_VENTA);
      break;
    case 'cotizacion':
      // ctx = useContext(CTX_INDEX_COTIZACION);
      break;
  }
  const ctx_buscar_servicio = useContext(CTX_BUSCAR_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const codDes = useSignal('');

  useTask$(({ track }) => {
    track(() => ini.value);

    if (parametrosGlobales.contabilizarOperaciones) {
      if (servicio.codigoContableVenta !== '' && servicio.descripcionContableVenta !== '') {
        codDes.value = servicio.codigoContableVenta + ' - ' + servicio.descripcionContableVenta;
      } else {
        codDes.value = '';
      }
    }
  });
  //#endregion INICIALIZACION

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
    if (servicio.tipoImpuesto === '') {
      alert('Seleccione el tipo de impuesto.');
      (document.getElementById('se_tipoImpuesto_SERVICIO') as HTMLSelectElement)?.focus();
      return;
    }
    if (servicio.tipoAfectacionDelImpuesto === '') {
      alert('Seleccione el tipo de afectación del impuesto.');
      (document.getElementById('se_tipoAfectacionDelImpuesto_SERVICIO') as HTMLSelectElement)?.focus();
      return;
    }
    if (parametrosGlobales.contabilizarOperaciones) {
      if (servicio.codigoContableVenta.trim() === '' || servicio.descripcionContableVenta.trim() === '') {
        alert('Ingrese la cuenta contable para la venta del servicio.');
        (document.getElementById('ima_BuscarCuentaContable_SERVICIO') as HTMLInputElement)?.focus();
        return;
      }
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
      unidad: 'NIU',

      tipoImpuesto: servicio.tipoImpuesto,
      tipoAfectacionDelImpuesto: servicio.tipoAfectacionDelImpuesto,

      codigoContableVenta: servicio.codigoContableVenta,
      descripcionContableVenta: servicio.descripcionContableVenta,

      usuario: parametrosGlobales.usuario,
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
        width: 'clamp386px, 86%, 700px)',
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
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log(
              'parametrosGlobales.codigoContableVentaServicio ',
              parametrosGlobales.codigoContableVentaServicio,
              parametrosGlobales.descripcionContableVentaServicio
            );
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('servicio.codigoContableVenta  ', servicio.codigoContableVenta, servicio.descripcionContableVenta);
          })}
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
                type="number"
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
          {/* para la VENTA */}
          <fieldset>
            {/* TIPO IMPUESTO */}
            <div class="form-control">
              <label>Tipo de impuesto</label>
              <div class="form-control ">
                <select
                  id="se_tipoImpuesto_SERVICIO"
                  style={{ width: '288px' }}
                  onChange$={(e) => {
                    servicio.tipoImpuesto = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value="IGV" selected={servicio.tipoImpuesto === 'IGV'}>
                    IGV
                  </option>
                  <option value="ISC" selected={servicio.tipoImpuesto === 'ISC'}>
                    ISC
                  </option>
                  <option value="IVAP" selected={servicio.tipoImpuesto === 'IVAP'}>
                    IVAP
                  </option>
                  <option value="exoneradas" selected={servicio.tipoImpuesto === 'exoneradas'}>
                    exoneradas
                  </option>
                  <option value="exportación" selected={servicio.tipoImpuesto === 'exportación'}>
                    exportación
                  </option>
                  <option value="gratuitas" selected={servicio.tipoImpuesto === 'gratuitas'}>
                    gratuitas
                  </option>
                  <option value="inafecta" selected={servicio.tipoImpuesto === 'inafecta'}>
                    inafecta
                  </option>
                  <option value="otrosTributos" selected={servicio.tipoImpuesto === 'otrosTributos'}>
                    otrosTributos
                  </option>
                </select>
              </div>
            </div>
            {/* TIPO DE AFECTACION DEL IMPUESTO */}
            <div class="form-control">
              <label>Inafecto</label>
              <div class="form-control ">
                <select
                  id="se_tipoAfectacionDelImpuesto_SERVICIO"
                  style={{ width: '288px' }}
                  onChange$={(e) => {
                    servicio.tipoAfectacionDelImpuesto = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value="10" selected={servicio.tipoAfectacionDelImpuesto === '10'}>
                    Gravado - Operación Onerosa
                  </option>
                  <option value="11" selected={servicio.tipoAfectacionDelImpuesto === '11'}>
                    Gravado - Retiro por premio
                  </option>
                  <option value="12" selected={servicio.tipoAfectacionDelImpuesto === '12'}>
                    Gravado - Retiro por donación
                  </option>
                  <option value="13" selected={servicio.tipoAfectacionDelImpuesto === '13'}>
                    Gravado - Retiro
                  </option>
                  <option value="14" selected={servicio.tipoAfectacionDelImpuesto === '14'}>
                    Gravado - Retiro por publicidad
                  </option>
                  <option value="15" selected={servicio.tipoAfectacionDelImpuesto === '15'}>
                    Gravado - Bonificaciones
                  </option>
                  <option value="16" selected={servicio.tipoAfectacionDelImpuesto === '16'}>
                    Gravado - Retiro por entrega a trabajadores
                  </option>
                  <option value="17" selected={servicio.tipoAfectacionDelImpuesto === '17'}>
                    Gravado - IVAP
                  </option>
                  <option value="20" selected={servicio.tipoAfectacionDelImpuesto === '20'}>
                    Exonerado - Operación Onerosa
                  </option>
                  <option value="21" selected={servicio.tipoAfectacionDelImpuesto === '21'}>
                    Exonerado - Transferencia gratuita
                  </option>
                  <option value="30" selected={servicio.tipoAfectacionDelImpuesto === '30'}>
                    Inafecto - Operación Onerosa
                  </option>
                  <option value="31" selected={servicio.tipoAfectacionDelImpuesto === '31'}>
                    Inafecto - Retiro por Bonificación
                  </option>
                  <option value="32" selected={servicio.tipoAfectacionDelImpuesto === '32'}>
                    Inafecto - Retiro
                  </option>
                  <option value="33" selected={servicio.tipoAfectacionDelImpuesto === '33'}>
                    Inafecto - Retiro por Muestras Médicas
                  </option>
                  <option value="34" selected={servicio.tipoAfectacionDelImpuesto === '34'}>
                    Inafecto - Retiro por Convenio Colectivo
                  </option>
                  <option value="35" selected={servicio.tipoAfectacionDelImpuesto === '35'}>
                    Inafecto - Retiro por premio
                  </option>
                  <option value="36" selected={servicio.tipoAfectacionDelImpuesto === '36'}>
                    Inafecto - Retiro por publicidad
                  </option>
                  <option value="37" selected={servicio.tipoAfectacionDelImpuesto === '37'}>
                    Inafecto - Transferencia gratuita
                  </option>
                  <option value="40" selected={servicio.tipoAfectacionDelImpuesto === '40'}>
                    Exportación de Bienes o Servicios
                  </option>
                </select>
              </div>
            </div>
          </fieldset>
          {/* para la CONTABILIDAD */}
          {parametrosGlobales.contabilizarOperaciones && (
            <div class="form-control">
              <label>Cuenta contable para venta</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_CodigoDescripcionVENTA_SERVICIO"
                  style={{ width: '100%' }}
                  disabled
                  type="text"
                  placeholder="Add codigo - descripción cuenta contable para venta"
                  value={codDes.value}
                  // onChange$={(e) => {
                  //   servicio.precioPEN = parseFloat((e.target as HTMLInputElement).value.trim());
                  // }}
                  // onChange={(e) => setPrecioPEN(e.target.value.trim())}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('btn_registrar_SERVICIO') as HTMLInputElement)?.focus();
                    }
                  }}
                />
                <input
                  id="ima_BuscarCuentaContable_SERVICIO"
                  type="image"
                  title="Buscar cuenta contable para venta"
                  alt="imagen de busqueda"
                  src={images.searchPLUS}
                  height={16}
                  width={16}
                  style={{ marginLeft: '2px' }}
                />
              </div>
            </div>
          )}
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
