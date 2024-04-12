import {
  $,
  Resource,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useResource$,
  useSignal,
  useStore,
  useTask$,
} from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import NewEditDetraccionPorcentaje from './newEditDetraccionPorcentaje';
import { CTX_COMPRA, CTX_NEW_EDIT_COMPRA } from './newEditCompra';
import { parametrosGlobales } from '~/routes/login';
import type { IDetraccion } from '~/interfaces/iDetraccion';

export const CTX_BUSCAR_DETRACCION_PORCENTAJE = createContextId<any>('buscar_detraccion_porcentaj');

export default component$(() => {
  //#region definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE
  const definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE = useStore<any>({
    pP: [],

    conceptoABuscar: '',
    mostrarPanelNewEditDetraccionPorcentaje: false,

    grabo_Detraccion: false,
  });
  useContextProvider(CTX_BUSCAR_DETRACCION_PORCENTAJE, definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE);
  //#endregion definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE

  //#region CONTEXTO
  const ctx_new_edit_compra = useContext(CTX_NEW_EDIT_COMPRA);
  const ctx_compra = useContext(CTX_COMPRA);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const lasDetracciones = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    // console.log('tablaCompras ->->-> parameBusqueda', props.parametrosBusqueda);
    track(() => ini.value);

    console.log('ini.value', ini.value);
    // if (props.buscarVentas.valueOf()) {
    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    const res = await fetch(`${import.meta.env.VITE_URL}/api/grupoEmpresarial/listarDetracciones`, {
      // const res = await fetch(`${import.meta.env.VITE_URL}/api/compra/obtenerComprasPorFechas`, {
      // const res = await fetch(`https://backendalmacen-production.up.railway.app/api/venta/obtenerVentasPorFechas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
      }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  //#region REFRESCAR REGISTROS
  useTask$(({ track }) => {
    track(() => definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.grabo_Detraccion);

    if (definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.grabo_Detraccion) {
      ini.value++;

      definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.grabo_Detraccion = false;
    }
  });
  //#endregion REFRESCAR REGISTROS

  return (
    <div
      style={{
        // width: props.ancho + 'px',
        width: 'clamp(330px, 86%,450px)',
        // width: 'auto',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_new_edit_compra.mostrarPanelBuscarDetraccionPorcentaje = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px' }}>Buscar concepto de detracción</h3>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '10px' }}>
          {/* CONCEPTO A BUSCAR  */}
          <div class="form-control">
            <label></label>
            <div class="form-control form-agrupado">
              <input
                id="in_conceptoABuscar_DETRACCION"
                style={{ width: '100%' }}
                type={'text'}
                value={definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.conceptoABuscar}
                // onFocusout$={() => localizarPersonas()}
                onChange$={(e) => {
                  definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.conceptoABuscar = (e.target as HTMLInputElement).value.trim();
                  console.log('onChange', definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.conceptoABuscar);
                }}
                // onKeyDown$={(e) => {
                //   // alert('🚧🚧🚧🚧🚧');
                //   console.log('🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧🚧first', e);
                //   // if (e.key===) {

                //   // }
                // }}
                // onKeyUp$={(e) => {
                //   // alert('');
                //   console.log('⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽⛽first', e);
                // }}
                onKeyPress$={(e) => {
                  // alert('🚧🚧🚧🚧🚧');
                  console.log('🚐🚐🚐🚐🚌🚐🚐🚌🚌🚐🚐🚐🚐🚌🚐🚐first', e);
                  if (e.key === 'Enter') {
                    console.log('🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎🌎');
                    document.getElementById('in_BuscarPersona')?.focus();
                  }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
              />
              <input
                id="in_BuscarDetraccion"
                type="image"
                src={images.searchPLUS}
                height={16}
                width={16}
                style={{ padding: '2px' }}
                onFocusin$={() => console.log('☪☪☪☪☪☪')}
                // onClick$={() => localizarPersonas()}
              />
              <input
                id="in_AdicionarDetraccionPorcentaje"
                type="image"
                src={images.add}
                height={16}
                width={16}
                style={{ padding: '2px' }}
                onFocusin$={() => console.log('☪☪☪☪☪☪')}
                onClick$={() => {
                  definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.pP = [];
                  definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.mostrarPanelNewEditDetraccionPorcentaje = true;
                }}
              />
            </div>
          </div>
        </div>
        {/* NEW - EDIT DETRACCION*/}
        {definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.mostrarPanelNewEditDetraccionPorcentaje && (
          <div class="modal">
            <NewEditDetraccionPorcentaje
              //   soloPersonaNatural={props.soloPersonasNaturales}
              detraPorcSelec={definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.pP}
              //   contexto={props.contexto}
            />
          </div>
        )}
        {/* TABLA DE DETRACCIONES HALLADAS*/}
        <div class="form-control">
          <Resource
            value={lasDetracciones}
            onPending={() => {
              console.log('onPending 🍉🍉🍉🍉');
              //
              return <div>Cargando...</div>;
            }}
            onRejected={() => {
              console.log('onRejected 🍍🍍🍍🍍');

              // ctx_index_compra.mostrarSpinner = false;
              return <div>Fallo en la carga de datos</div>;
            }}
            onResolved={(detracciones: any) => {
              console.log('onResolved 🍓🍓🍓🍓');
              const { data } = detracciones; //{ status, data, message }
              const misDetracciones: IDetraccion[] = data;
              // ctx_index_compra.miscCs = misDetracciones;

              // ctx_index_compra.mostrarSpinner = false;
              console.log('misDetracciones', misDetracciones);
              return (
                <>
                  {misDetracciones.length > 0 ? (
                    <>
                      <table class="tabla-venta" style={{ fontSize: '0.8em', fontWeight: 'lighter' }}>
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Descripción</th>
                            <th>Porcentaje(%)</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {misDetracciones.map((detraccion, index) => {
                            const indexItem = index + 1;
                            return (
                              <tr key={detraccion._id}>
                                <td data-label="Item" class="comoCadena">
                                  {indexItem}
                                </td>
                                <td data-label="Descripción" class="comoCadena">
                                  {detraccion.descripcion}
                                </td>
                                <td data-label="Porcentaje(%)" class="acciones">
                                  {detraccion.porcentaje.$numberDecimal}
                                </td>

                                <td data-label="Acciones" class="acciones">
                                  <input
                                    // id="in_BuscarDetraccion"
                                    type="image"
                                    src={images.check32}
                                    height={14}
                                    width={14}
                                    style={{ marginRight: '8px' }}
                                    onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                    onClick$={() => {
                                      ctx_compra.detraccionPorcentaje = detraccion.porcentaje;
                                      ctx_compra.detraccionMontoPEN =
                                        (ctx_compra.totalPEN * detraccion.porcentaje.$numberDecimal) / 100;

                                      ctx_new_edit_compra.mostrarPanelBuscarDetraccionPorcentaje = false;
                                    }}
                                  />
                                  <input
                                    // id="in_BuscarDetraccion"
                                    type="image"
                                    src={images.edit}
                                    height={14}
                                    width={14}
                                    // style={{ padding: '2px' }}
                                    onFocusin$={() => console.log('☪☪☪☪☪☪')}
                                    onClick$={() => {
                                      definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.pP = detraccion;

                                      definicion_CTX_BUSCAR_DETRACCION_PORCENTAJE.mostrarPanelNewEditDetraccionPorcentaje = true;
                                    }}
                                  />
                                  {/* <ImgButton
                                    src={images.edit}
                                    alt="icono de editar"
                                    height={14}
                                    width={14}
                                    title={`Editar documento`}
                                    onClick={$(() => {
                                      ctx_index_compra.cC = compra;
                                      ctx_index_compra.mostrarPanelCompra = true;
                                    })}
                                  />
                                  <ImgButton
                                    src={images.mercaderia}
                                    alt="icono de mercaderías"
                                    hidden={compra.idIngresoAAlmacen ? false : true}
                                    height={14}
                                    width={14}
                                    title={`Ver mercaderías`}
                                    onClick={$(() => {
                                      if (compra.idIngresoAAlmacen) {
                                        alert(compra.idIngresoAAlmacen);
                                      } else {
                                        alert('la compra no cuenta con el ingreso de la mercadería al almacén');
                                      }

                                      // ctx_index_compra.cC = compra;
                                      // ctx_index_compra.mostrarPanelCompra = true;
                                    })}
                                  /> */}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <div>
                      <i style={{ fontSize: '0.7rem' }}>No se encontraron registros</i>
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
      </div>
    </div>
  );
});
