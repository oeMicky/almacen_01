import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_IN_ALMACEN } from './newInAlmacen';
import { parametrosGlobales } from '~/routes/login';
import { hoy, menosXdiasHoy } from '~/functions/comunes';
import TablaNotaDeSalidaReingreso from './tablaNotaDeSalidaReingreso';
import NotaDeSalidaReingreso from './notaDeSalidaReingreso';

export const CTX_BUSCAR_NOTA_SALIDA_REINGRESO = createContextId<any>('_buscar_nota_salida_reingreso');

export default component$(() => {
  //#region definicion_CTX_BUSCAR_NOTA_SALIDA_REINGRESO
  const definicion_CTX_BUSCAR_NOTA_SALIDA_REINGRESO = useStore({
    nS: [],

    mostrarPanelNotaDeSalidaReingreso: false,
  });
  useContextProvider(CTX_BUSCAR_NOTA_SALIDA_REINGRESO, definicion_CTX_BUSCAR_NOTA_SALIDA_REINGRESO);
  //#endregion definicion_CTX_BUSCAR_NOTA_SALIDA_REINGRESO

  //#region CONTEXTO
  const ctx_new_in_almacen = useContext(CTX_NEW_IN_ALMACEN);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const buscarNotaDeSalidaReingreso = useSignal(0);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    idAlmacen: parametrosGlobales.idAlmacen,
    BuscarPor: 'Por destinatario',
    PorNombre_RUCDNI: 'Nombre / Razón social',
    fechaInicio: menosXdiasHoy(5), //hoy(), // primeroDelMes(), // '2023-01-01', //hoy(), //por.value,
    fechaFinal: hoy(), //cadena.value,
    cadenaABuscar: '',
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
            ctx_new_in_almacen.mostrarPanelBuscarNotaDeSalidaReingreso = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <h3>Buscar nota de salida (Reingreso)</h3>
        {/* SELECTOR :  por Fechas - por Número */}
        <div class="form-control" style={{ marginBottom: '8px' }}>
          <div class="form-control form-agrupado">
            <select
              onChange$={(e) => {
                parametrosBusqueda.BuscarPor = (e.target as HTMLSelectElement).value;
                if (parametrosBusqueda.BuscarPor === 'Entre fechas') {
                  document.getElementById('in_fechaDesde_IN_NS_REINGRESO')?.focus();
                }
                if (parametrosBusqueda.BuscarPor === 'Por número') {
                  document.getElementById('in_numero_IN_NS_REINGRESO')?.focus();
                }
              }}
            >
              <option value="Por destinatario" selected={parametrosBusqueda.BuscarPor === 'Por destinatario'}>
                Por destinatario
              </option>
              <option value="Entre fechas" selected={parametrosBusqueda.BuscarPor === 'Entre fechas'}>
                Entre fechas
              </option>
              <option value="Por número" selected={parametrosBusqueda.BuscarPor === 'Por número'}>
                Por número
              </option>
            </select>
          </div>
        </div>
        {/* por Destinatario */}
        <div
          id="porDestinatario"
          style={parametrosBusqueda.BuscarPor === 'Por destinatario' ? { visibility: 'visible' } : { visibility: 'collapse' }}
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
          <div class="form-control form-agrupado">
            <input
              type={parametrosBusqueda.PorNombre_RUCDNI === 'DNI / RUC' ? 'number' : 'text'}
              id="in_NombreRUCDNI_IN_NS_REINGRESO"
              value={parametrosBusqueda.cadenaABuscar}
              style={{ width: '100%' }}
              onInput$={(e) => {
                parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
              }}
              onKeyPress$={(e) => {
                if (e.key === 'Enter') {
                  console.log('e', (e.target as HTMLInputElement).value);
                  // (document.getElementById('btn_Buscar_Nombre_RUCDNI_NOTA_SALIDA_REINGRESO') as HTMLInputElement)?.focus();
                  if ((e.target as HTMLInputElement).value !== '') {
                    buscarNotaDeSalidaReingreso.value++;
                  }
                }
              }}
            />
            <input
              id="btn_Buscar_Nombre_RUCDNI_NOTA_SALIDA_REINGRESO"
              type="image"
              src={images.searchPLUS}
              title="Buscar por número"
              alt="icono buscar"
              height={16}
              width={16}
              style={{ margin: '2px 4px' }}
              onClick$={() => {
                if (parametrosBusqueda.cadenaABuscar.trim() === '') {
                  alert('Ingrese el nombre / RUC DNI');
                  document.getElementById('in_NombreRUCDNI_IN_NS_REINGRESO')?.focus();
                  return;
                }
                buscarNotaDeSalidaReingreso.value++;
              }}
            />
          </div>
        </div>
        {/* por Entre Fechas */}
        <div
          id="porFechas"
          class="intervalo-fechas"
          style={parametrosBusqueda.BuscarPor === 'Entre fechas' ? { visibility: 'visible' } : { visibility: 'collapse' }}
        >
          <label class="fechas" style={{ margin: '2px 4px 0 4px' }}>
            Desde
          </label>
          <input
            type="date"
            id="in_fechaDesde_IN_NS_REINGRESO"
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
            id="in_fechaHasta_IN_NS_REINGRESO"
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
                document.getElementById('in_fechaDesde_IN_NS_REINGRESO')?.focus();
                return;
              }
              buscarNotaDeSalidaReingreso.value++;
            }}
          />
        </div>
        {/* por Número */}
        <div
          id="porNumero"
          style={parametrosBusqueda.BuscarPor === 'Por número' ? { visibility: 'visible' } : { visibility: 'collapse' }}
        >
          <input
            type="number"
            id="in_numero_IN_NS_REINGRESO"
            value={parametrosBusqueda.cadenaABuscar}
            onInput$={(e) => {
              parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
            }}
            onKeyPress$={(e) => {
              if (e.key === 'Enter') {
                console.log('e', (e.target as HTMLInputElement).value);
                // (document.getElementById('btn_Numero_NOTA_SALIDA_REINGRESO') as HTMLInputElement)?.focus();
                if ((e.target as HTMLInputElement).value !== '') {
                  buscarNotaDeSalidaReingreso.value++;
                }
              }
            }}
          />
          <input
            id="btn_Numero_NOTA_SALIDA_REINGRESO"
            type="image"
            title="Buscar por número"
            alt="icono buscar"
            height={16}
            width={16}
            src={images.searchPLUS}
            style={{ marginLeft: '4px' }}
            onClick$={() => {
              if (parametrosBusqueda.cadenaABuscar.trim() === '') {
                alert('Ingrese un número');
                document.getElementById('in_numero_IN_NS_REINGRESO')?.focus();
                return;
              }
              buscarNotaDeSalidaReingreso.value++;
            }}
          />
        </div>
        {/* TABLA Notas de Salida A REINGRESAR */}
        <div style={{ marginTop: '16px' }}>
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
        )}
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
