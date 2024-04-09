import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import { CTX_NEW_IN_ALMACEN } from './newInAlmacen';
import { parametrosGlobales } from '~/routes/login';
import { hoy } from '~/functions/comunes';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';

export const CTX_BUSCAR_VENTA_DESPACHADA_REINGRESO = createContextId<any>('buscar_venta_despachada_reingreso');

export default component$(() => {
  //#region definicion_CTX_BUSCAR_VENTA_DESPACHADA_REINGRESO
  const definicion_CTX_BUSCAR_VENTA_DESPACHADA_REINGRESO = useStore({
    vV: [],

    mostrarPanelVentaDespachadaReingreso: false,
  });
  useContextProvider(CTX_BUSCAR_VENTA_DESPACHADA_REINGRESO, definicion_CTX_BUSCAR_VENTA_DESPACHADA_REINGRESO);
  //#endregion definicion_CTX_BUSCAR_VENTA_REINGRESO

  //#region CONTEXTO
  const ctx_new_in_almacen = useContext(CTX_NEW_IN_ALMACEN);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const buscarVentaDespachadaReingreso = useSignal(0);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    idAlmacen: parametrosGlobales.idAlmacen,
    PorDestinatario_EntreFechas: 'Entre fechas', //'Por cliente',
    PorNombre_RUCDNI: 'Nombre / Razón social', //'Por cliente',
    fechaInicio: hoy(), // primeroDelMes(), // '2023-01-01', //hoy(), //por.value,
    fechaFinal: hoy(), //cadena.value,
    nombreRUCDNI: '',
  });
  //#endregion INICIALIZACION

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 700px)',
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
            ctx_new_in_almacen.mostrarPanelBuscarVentaDespachadaReingreso = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3>Buscar venta despachada (Reingreso)</h3>
        {/* SELECTOR :  por Cliente - por Fechas*/}
        <div class="form-control" style={{ marginBottom: '8px' }}>
          <div class="form-control form-agrupado">
            <select
              onChange$={(e) => {
                parametrosBusqueda.PorDestinatario_EntreFechas = (e.target as HTMLSelectElement).value;
                if (parametrosBusqueda.PorDestinatario_EntreFechas === 'Por destinatario') {
                  document.getElementById('in_fechaDesde_IN_NS_REINGRESO')?.focus();
                }
                if (parametrosBusqueda.PorDestinatario_EntreFechas === 'Entre fechas') {
                  document.getElementById('in_fechaDesde_IN_VENTA_REINGRESO')?.focus();
                }
              }}
            >
              <option value="Por destinatario" selected={parametrosBusqueda.PorDestinatario_EntreFechas === 'Por destinatario'}>
                Por destinatario
              </option>
              <option value="Entre fechas" selected={parametrosBusqueda.PorDestinatario_EntreFechas === 'Entre fechas'}>
                Entre fechas
              </option>
            </select>
          </div>
        </div>
        {/* por Destinatario */}
        <div
          id="porDestinatario"
          style={
            parametrosBusqueda.PorDestinatario_EntreFechas === 'Por destinatario'
              ? { visibility: 'visible' }
              : { visibility: 'collapse' }
          }
        >
          <div style={{ marginBottom: '8px' }}>
            <select
              id="se_buscarPor_DESTINATARIO"
              style={{ width: '100%' }}
              onChange$={(e) => {
                parametrosBusqueda.PorNombre_RUCDNI = (e.target as HTMLSelectElement).value;
                document.getElementById('in_NombreRUCDNI_IN_VENTA_REINGRESO')?.focus();
              }}
            >
              <option value={'DNI / RUC'} selected={parametrosBusqueda.PorNombre_RUCDNI === 'DNI / RUC'}>
                DNI / RUC
              </option>
              <option value={'Nombre / Razón social'} selected={parametrosBusqueda.PorNombre_RUCDNI === 'Nombre / Razón social'}>
                Nombre / Razón social
              </option>
            </select>
          </div>
          <div>
            <input
              type={parametrosBusqueda.PorNombre_RUCDNI === 'DNI / RUC' ? 'number' : 'text'}
              id="in_NombreRUCDNI_IN_VENTA_REINGRESO"
              value={parametrosBusqueda.nombreRUCDNI}
              style={{ width: '200px' }}
              onInput$={(e) => {
                parametrosBusqueda.nombreRUCDNI = (e.target as HTMLInputElement).value;
              }}
            />
            <input
              type="image"
              title="Buscar por número"
              alt="icono buscar"
              height={16}
              width={16}
              src={images.searchPLUS}
              style={{ marginLeft: '4px' }}
              onClick$={() => {
                if (parametrosBusqueda.nombreRUCDNI.trim() === '') {
                  alert('Ingrese el nombre / RUC DNI');
                  document.getElementById('in_NombreRUCDNI_IN_NS_REINGRESO')?.focus();
                  return;
                }
                buscarVentaDespachadaReingreso.value++;
              }}
            />
          </div>
        </div>
        {/* por Fechas */}
        <div
          id="porFechas"
          class="intervalo-fechas"
          style={
            parametrosBusqueda.PorDestinatario_EntreFechas === 'Entre fechas'
              ? { visibility: 'visible' }
              : { visibility: 'collapse' }
          }
        >
          <label class="fechas" style={{ margin: '2px 4px 0 4px' }}>
            Desde
          </label>
          <input
            type="date"
            id="in_fechaDesde_IN_VENTA_REINGRESO"
            value={parametrosBusqueda.fechaInicio}
            onInput$={(e) => {
              parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value;
            }}
          />
          <label class="fechas" style={{ margin: '2px 4px 0 4px' }}>
            Hasta
          </label>
          <input
            type="date"
            id="in_fechaHasta_IN_VENTA_REINGRESO"
            value={parametrosBusqueda.fechaFinal}
            onInput$={(e) => {
              parametrosBusqueda.fechaFinal = (e.target as HTMLInputElement).value;
            }}
          />
          <input
            type="image"
            title="Buscar por fechas"
            alt="icono buscar"
            height={16}
            width={16}
            src={images.searchPLUS}
            style={{ marginLeft: '4px' }}
            onClick$={() => {
              if (parametrosBusqueda.fechaInicio > parametrosBusqueda.fechaFinal) {
                alert('Verifique las fechas de busqueda');
                document.getElementById('in_fechaDesde_IN_VENTA_REINGRESO')?.focus();
                return;
              }
              buscarVentaDespachadaReingreso.value++;
            }}
          />
        </div>

        {/* TABLA Ventas despachadas A REINGRESAR */}
        {/* <div style={{ marginTop: '15px' }}>
          {buscarNotaDeSalidaReingreso.value > 0 ? (
            <TablaNotaDeSalidaReingreso
              // contexto={props.contexto}
              buscarNotasDeSalidaReingreso={buscarNotaDeSalidaReingreso.value}
              // modoSeleccion={true}
              parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
        </div>
        {definicion_CTX_BUSCAR_NOTA_SALIDA_REINGRESO.mostrarPanelNotaDeSalidaReingreso && (
          <div class="modal">
            <NotaDeSalidaReingreso nsSeleccionada={definicion_CTX_BUSCAR_NOTA_SALIDA_REINGRESO.nS} />
          </div>
        )} */}
        {/*    {ctx.mostrarPanelReingresoRequisiciones && (
          <div class="modal">
            <ReingresoRequisiciones
              contexto={props.contexto}
              osSeleccionada={definicion_CTX_BUSCAR_ORDEN_SERVICIO_APERTURADO.oO}
            />
          </div>
        )} */}
      </div>
    </div>
  );
});
