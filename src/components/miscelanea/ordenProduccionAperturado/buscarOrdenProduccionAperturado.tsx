import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_NEW_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import ImgButton from '~/components/system/imgButton';
import TablaOrdenesProduccion from './tablaOrdenesProduccionAperturados';
import { parametrosGlobales } from '~/routes/login';
import { hoy, menosXdiasHoy } from '~/functions/comunes';
// import DespachoRequisiciones from "./despachoRequisiciones";
import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
// import DespachoRequisiciones from "../ordenServicioAperturado/despachoRequisiciones";
import DespachoRequisicionesOP from './despachoRequisicionesOP';
import ReingresoRequisicionesOP from './reingresoRequisicionesOP';
// import ReingresoRequisiciones from "./reingresoRequisiciones";

export const CTX_BUSCAR_ORDEN_PRODUCCION_APERTURADO = createContextId<any>('buscar_orden_produccion_aperturado_');

export default component$((props: { contexto: string }) => {
  //#region DEFINICIO CTX_BUSCAR_ORDEN_PRODUCCION
  const definicion_CTX_BUSCAR_ORDEN_PRODUCCION_APERTURADO = useStore({
    oO: [],
    // mostrarPanelDespachoRequisiciones: false,
  });
  useContextProvider(CTX_BUSCAR_ORDEN_PRODUCCION_APERTURADO, definicion_CTX_BUSCAR_ORDEN_PRODUCCION_APERTURADO);
  //#endregion DEFINICIO CTX_BUSCAR_ORDEN_PRODUCCION

  //#region CONTEXTO
  let ctx: any = [];
  switch (props.contexto) {
    case 'egreso_de_almacen':
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      break;
    case 'ingreso_a_almacen':
      ctx = useContext(CTX_NEW_IN_ALMACEN);
      break;
  }
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const buscarOrdenesProduccion = useSignal(0);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    fechaInicio: menosXdiasHoy(5), //primeroDelMes(), // '2023-01-01', //hoy(), //por.value,
    fechaFinal: hoy(), //cadena.value,
  });
  //#endregion INICIALIZACION

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 800px)',
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
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelBuscarOrdenProduccionAperturado = false;
          })}
        />
        {/* <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelBuscarOrdenProduccionAperturado = false;
          })}
        /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3>
          Buscar orden producción <strong style={{ color: '#aa032f' }}>aperturado</strong>
          {props.contexto === 'ingreso_a_almacen' ? ' (Reingreso)' : ''}
        </h3>
        {/* por Fechas */}
        <div
          id="porFechas"
          class="intervalo-fechas"
          // style={numeroOFecha.value === 'Entre fechas' ? { visibility: 'visible' } : { visibility: 'collapse' }}
        >
          <label class="fechas" style={{ margin: '2px 4px 0 4px' }}>
            Desde
          </label>
          <input
            type="date"
            id="in_fechaDesde_MICE_ORDEN_PRODUCCION"
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
            id="in_fechaHasta_MICE_ORDEN_PRODUCCION"
            value={parametrosBusqueda.fechaFinal}
            onInput$={(e) => {
              parametrosBusqueda.fechaFinal = (e.target as HTMLInputElement).value;
            }}
          />

          {/* <div class="intervalo-fechas__botonBuscar"> */}
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
                document.getElementById('fechaDesdeBusqueda')?.focus();
                return;
              }
              buscarOrdenesProduccion.value++;
            }}
          />
        </div>
        {/* TABLA Ordenes Produccion */}
        <div style={{ marginTop: '15px' }}>
          {buscarOrdenesProduccion.value > 0 ? (
            <TablaOrdenesProduccion
              contexto={props.contexto}
              buscarOrdenesProduccion={buscarOrdenesProduccion.value}
              modoSeleccion={true}
              parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
        </div>
        {ctx.mostrarPanelDespachoRequisiciones && (
          <div class="modal">
            <DespachoRequisicionesOP contexto={props.contexto} opSeleccionada={definicion_CTX_BUSCAR_ORDEN_PRODUCCION_APERTURADO.oO} />
          </div>
        )}
        {ctx.mostrarPanelReingresoRequisiciones && (
          <div class="modal">
            <ReingresoRequisicionesOP contexto={props.contexto} opSeleccionada={definicion_CTX_BUSCAR_ORDEN_PRODUCCION_APERTURADO.oO} />
          </div>
        )}
      </div>
    </div>
  );
});
