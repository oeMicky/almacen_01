import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
// import { CTX_DOCS_VENTA } from '~/routes/(almacen)/venta';
import TablaServiciosHallados from './tablaServiciosHallados';
import ServicioSeleccionado from './servicioSeleccionado';
import NewEditServicio from './newEditServicio';
// import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
// import { CTX_DOCS_COTIZACION } from '~/routes/(almacen)/cotizacion';
import { parametrosGlobales } from '~/routes/login';
import { CTX_NEW_EDIT_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
import { CTX_ADD_VENTA } from '~/components/venta/addVenta';
import { CTX_NEW_EDIT_ORDEN_SERVICIO } from '~/components/ordenServicio/newEditOrdenServicio';

export const CTX_BUSCAR_SERVICIO = createContextId<any>('servicio__');

export default component$((props: { contexto: string; porcentaje: any }) => {
  //#region DEFINICION CTX_BUSCAR_SERVICIO - para eDITAR - para sELECCIONAR
  const definicion_CTX_BUSCAR_SERVICIO = useStore({
    sS: [],
    grabo_Servicio: false,
    mostrarPanelNewEditServicio: false,
    mostrarPanelServicioSeleccionado: false,
  });
  useContextProvider(CTX_BUSCAR_SERVICIO, definicion_CTX_BUSCAR_SERVICIO);
  //#endregion DEFINICION CTX_BUSCAR_SERVICIO - para eDITAR - para sELECCIONAR

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'orden servicio':
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      break;
    // case 'venta':
    //   ctx = useContext(CTX_DOCS_VENTA);
    //   break;
    case 'new_venta':
      ctx = useContext(CTX_ADD_VENTA);
      break;
    // case 'cotizacion':
    //   ctx = useContext(CTX_DOCS_COTIZACION);
    //   break;
    case 'new_edit_cotizacion':
      ctx = useContext(CTX_NEW_EDIT_COTIZACION);
      break;
  }
  //#endregion CONTEXTOS

  const buscarServicios = useSignal(0);
  // const cadena = useSignal('');

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    cadenaABuscar: '', //cadena.value,
  });

  //#region BUSCAR SERVICIOS
  const localizarServicios = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪');
      document.getElementById('in_BusquedaServicio_SERVICIO')?.focus();
      return;
    }
    buscarServicios.value++;
  });
  //#endregion BUSCAR SERVICIOS

  //#region REFRESCAR TABLA SERVICIOS
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_BUSCAR_SERVICIO.grabo_Servicio;
    });
    if (definicion_CTX_BUSCAR_SERVICIO.grabo_Servicio) {
      localizarServicios();
      definicion_CTX_BUSCAR_SERVICIO.grabo_Servicio = false;
    }
  });
  //#endregion REFRESCAR TABLA SERVICIOS

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 680px)',
        // width: 'auto',
        padding: '2px',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          // marginTop: '16px',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelBuscarServicio = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form" style={{}}>
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px', fontSize: '0.8rem' }}>Buscar servicio</h3>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '10px' }}>
          {/* Codigo Descripcion */}
          <div class="form-control">
            <label></label>
            <div class="form-control form-agrupado">
              <input
                id="in_BusquedaServicio_SERVICIO"
                autoFocus
                type="text"
                placeholder="Ingrese el servicio a buscar"
                style={{ width: '100%' }}
                value={parametrosBusqueda.cadenaABuscar}
                onChange$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                }}
                onKeyUp$={(e) => {
                  if (e.key === 'Enter') {
                    localizarServicios();
                    // if ((document.getElementById('inputBusquedaServicio_MICE') as HTMLInputElement).value.trim() !== '') {
                    //   if (parametrosBusqueda.cadenaABuscar === '') {
                    //     alert('Ingrese un valor para su busqueda(=)' + parametrosBusqueda.cadenaABuscar);
                    //     document.getElementById('inputBusquedaServicio_MICE')?.focus();
                    //     return;
                    //   }
                    //   buscarServicios.value++;
                    // } else {
                    //   alert('Ingrese un valor a buscar 🍅');
                    //   // break;
                    //   // return;
                    //   //document.getElementById('inputBusquedaServicio_MICE')?.focus();
                    // }
                  }
                  // if (e.key === 'Escape') {
                  //   document.getElementById('buscarPor')?.focus();
                  // }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <input
                type="image"
                title="Buscar servicio"
                alt="icon buscar"
                height={16}
                width={16}
                style={{ margin: '0 2px' }}
                src={images.searchPLUS}
                onClick$={() => localizarServicios()}
              />
              <input
                type="image"
                title="Adicionar servicio"
                alt="icon adicionar"
                height={16}
                width={16}
                src={images.add}
                onClick$={() => {
                  definicion_CTX_BUSCAR_SERVICIO.sS = [];
                  definicion_CTX_BUSCAR_SERVICIO.mostrarPanelNewEditServicio = true;
                }}
              />
            </div>
          </div>
        </div>
        {/* NEW - EDIT SERVICIO*/}
        {definicion_CTX_BUSCAR_SERVICIO.mostrarPanelNewEditServicio && (
          <div class="modal">
            <NewEditServicio serviSelecci={definicion_CTX_BUSCAR_SERVICIO.sS} contexto={props.contexto} />
          </div>
        )}
        {/* TABLA DE SERVICOS HALLADOS*/}
        <div class="form-control">
          {buscarServicios.value > 0 ? (
            <TablaServiciosHallados
              buscarServicios={buscarServicios.value}
              parametrosBusqueda={parametrosBusqueda}
              contexto={props.contexto}
            />
          ) : (
            ''
          )}
          {definicion_CTX_BUSCAR_SERVICIO.mostrarPanelServicioSeleccionado && (
            <div class="modal">
              <ServicioSeleccionado
                serviSelecci={definicion_CTX_BUSCAR_SERVICIO.sS}
                contexto={props.contexto}
                porcentaje={props.porcentaje}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
