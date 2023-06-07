import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import TablaServiciosHallados from './tablaServiciosHallados';
import ServicioSeleccionado from './servicioSeleccionado';
import NewEditServicio from './newEditServicio';

export const CTX_SERVICIO_SELECCIONADO = createContextId<IServicioSeleccionado>('serviSeleccionado');

export interface IServicioSeleccionado {
  sS: any;
}

export default component$((props: { parametrosGlobales: any }) => {
  //#region DEFINICION CTX_SERVICIO_SELECCIONADO
  const defini_CTX_SERVICIO_SELECCIONADO = useStore<IServicioSeleccionado>({
    sS: [],
  });
  useContextProvider(CTX_SERVICIO_SELECCIONADO, defini_CTX_SERVICIO_SELECCIONADO);
  //#endregion DEFINICION CTX_SERVICIO_SELECCIONADO

  //#region CONTEXTOS
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const buscarServicios = useSignal(0);
  // const cadena = useSignal('');
  const cadena = useStore({ aBuscar: '' });
  //#endregion INICIALIZACION

  //#region PARAMETROS DE BUSQUEDA
  const parametrosBusqueda = {
    idGrupoEmpresarial: props.parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: props.parametrosGlobales.idEmpresa,
    cadenaABuscar: cadena.aBuscar,
  };
  //#endregion PARAMETROS DE BUSQUEDA

  return (
    <div
      style={{
        width: 'auto',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
          // border: '1px solid red',
          marginTop: '16px', //por seguridad 16px mas abajo
        }}
      >
        {/* <Button name="T/C" onClick={tipoCambio} /> */}
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_docs_venta.mostrarAdicionarServicio = false;
          })}
          //   onClick={() => {
          //     const soloCerrar = true;
          //     onCerrar({ soloCerrar });
          //   }}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('para****busquueda', parametrosBusqueda);
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form" style={{}}>
        {/* TITULO */}
        <h2 style={{ marginBottom: '10px', fontSize: '0.8rem' }}>Seleccionar servicio</h2>
        {/* ZONA DE BUSQUEDA */}
        <div style={{ marginBottom: '10px' }}>
          {/* Buscar por */}
          {/* <div class="form-control">
            <label>Buscar por</label>
            <div class="form-control form-agrupado">
              <select
                id="buscarPor"
                defaultValue={'Descripcion'}
                disabled
                style={{ width: '100%' }}
                onChange={() => {
                  document.getElementById('inputBusquedaServicio').focus();
                }}
              >
                <option value={'Codigo'}>Código</option>
                <option value={'Descripcion'}>Descripción</option>
              </select>
            </div>
          </div> */}
          {/* Codigo Descripcion */}
          <div class="form-control">
            <label></label>
            <div class="form-control form-agrupado">
              <input
                id="inputBusquedaServicio"
                autoFocus
                type="text"
                placeholder="Ingrese el servicio a buscar"
                style={{ width: '100%' }}
                value={parametrosBusqueda.cadenaABuscar}
                // onChange$={(e) => {
                //   cadena.aBuscar = (e.target as HTMLInputElement).value;
                // }}
                onInput$={(e) => {
                  console.log('(e.target as HTMLInputElement).value', (e.target as HTMLInputElement).value);
                  cadena.aBuscar = (e.target as HTMLInputElement).value;
                  console.log(' cadena.aBuscar', cadena.aBuscar);
                }}
                onKeyUp$={(e) => {
                  if (e.key === 'Enter') {
                    if ((document.getElementById('inputBusquedaServicio') as HTMLInputElement).value.trim() !== '') {
                      // console.log('first');
                      buscarServicios.value++;
                      // (document.getElementById('inputBusquedaServicio') as HTMLImageElement)?.focus();
                    } else {
                      alert('Ingrese un valor a buscar');
                      document.getElementById('inputBusquedaServicio')?.focus();
                    }
                  }
                  //   if (e.key === 'Escape') {
                  //     document.getElementById('buscarPor')?.focus();
                  //   }
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                // onChange={(e) => setCodigoDescripcion(e.target.value.toUpperCase())}
              />
              <ImgButton
                src={images.searchPLUS}
                alt="Icono de buscar persona"
                height={16}
                width={16}
                title="Buscar persona"
                // onClick={localizarServicios}
                onClick={$(async () => {
                  if (cadena.aBuscar === '') {
                    alert('Ingrese un valor para la busqueda');
                    document.getElementById('inputBusquedaServicio')?.focus();
                    return;
                  }
                  console.log('click en lupa: parameBusqueda ', parametrosBusqueda);

                  buscarServicios.value++;
                })}
              />
              <ImgButton
                src={images.add}
                alt="Icono de adicionar servicio"
                height={16}
                width={16}
                title="Adicionar servicio"
                onClick={$(async () => {
                  ctx_docs_venta.mostrarAddNewEditServicio = true;
                })}
                // onClick={addServicio}
              />
            </div>
          </div>
        </div>
        {ctx_docs_venta.mostrarAddNewEditServicio && (
          <div class="modal">
            <NewEditServicio
              serviSelecci={defini_CTX_SERVICIO_SELECCIONADO.sS}
              // ancho={'470px'}
              // inicializacion={inicializacionServicio}
              // parametrosGlobales={parametrosGlobales}
              // onCerrar={cerrarPanelNewEditServicio}
            />
          </div>
        )}
        {/* TABLA DE SERVICOS HALLADAS*/}
        <div class="form-control">
          {buscarServicios.value > 0 ? (
            <TablaServiciosHallados
              buscarServicios={buscarServicios.value}
              parametrosBusqueda={parametrosBusqueda}
              // seleccionado={itemSeleccionado.value}
              // parametrosGlobales={parametrosGlobales}
              // registros={serviciosLocalizados}
              // servicioSeleccionado={onAddServicioAOrdenServicio}
            />
          ) : (
            ''
          )}
          {ctx_docs_venta.mostrarServicioSeleccionado && (
            <div class="modal">
              <ServicioSeleccionado
                ancho={400}
                itemSeleccionado={defini_CTX_SERVICIO_SELECCIONADO.sS}
                esAlmacen={false}
                // item2={props.item1}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
