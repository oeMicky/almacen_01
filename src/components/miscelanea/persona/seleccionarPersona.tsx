import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
// import { CTX_PERSONA } from '../venta/addVenta';
import ImgButton from '../../system/imgButton';
import TablaPersonasHalladas from './tablaPersonasHalladas';
import { CTX_COTIZACION } from '~/routes/(almacen)/cotizacion';

// interface ISeleccionarPersona {
//   ancho?: number;
//   seleccionar?: string;
//   parametrosGlobales: any;
//   soloPersonasNaturales: boolean;
//   contexto?: string;
// }

export default component$(
  (props: { ancho?: number; seleccionar?: string; parametrosGlobales: any; soloPersonasNaturales: boolean; contexto?: any }) => {
    // const ctx: any = '';
    // let ctx = useContext(props.contexto);
    // //#region CONTEXTO
    // // let ctx: any;
    // if (props.contexto === 'COTIZACION') {
    //   const ctx = useContext(CTX_COTIZACION);
    // }
    // if (props.contexto === 'VENTA') {
    //   const ctx = useContext(CTX_VENTA);
    // }
    //  else {
    //   if (props.contexto === 'VENTA') {
    //   ctx = useContext(CTX_VENTA);
    // }
    const ctx = props.contexto === 'COTIZACION' ? useContext(CTX_COTIZACION) : useContext(CTX_DOCS_VENTA);
    //  useContext(CTX_VENTA);
    // const ctx = () => {
    //   switch (props.contexto) {
    //     case 'VENTA':
    //       return useContext(CTX_VENTA);
    //     case 'COTIZACION':
    //       return useContext(CTX_COTIZACION);
    //   }
    // };
    //#endregion CONTEXTO

    // const ctx_PersonaSeleccionada = useContext(CTX_PERSONA);
    //   const personaSeleccionada = useSignal<IPersona>();
    // const personaSeleccionada = useStore<IPersona>({
    //   _id: '',
    //   codigoTipoDocumentoIdentidad: '',
    //   tipoDocumentoIdentidad: '',
    //   numeroIdentidad: '',
    //   razonSocialNombre: '',
    // });
    //   const valorABuscar = useSignal('');
    const buscarPersona = useSignal(0);
    const parametrosBusqueda = useStore({
      idGrupoEmpresarial: props.parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.parametrosGlobales.idEmpresa,
      buscarPor: 'RUC/DNI',
      cadenaABuscar: '',
    });

    const localizarPersonas = $(() => {
      if (parametrosBusqueda.cadenaABuscar === '') {
        alert('Ingrese un valor para su busqueda');
        document.getElementById('inputBusqueda')?.focus();
        return;
      }
      // alert(parametrosBusqueda.cadenaABuscar);
      buscarPersona.value++;
    });

    return (
      <div
        style={{
          // width: props.ancho + 'px',
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
              // ctx_PanelVenta.mostrarPanelSeleccionarPersona = false;
              // ctx_PanelVenta.selecciono_Persona = false;

              ctx.mostrarPanelSeleccionarPersona = false;
              ctx.selecciono_Persona = false;
            })}
            // onClick={() => {
            //   const soloCerrar = true;
            //   onCerrar({ soloCerrar });
            // }}
          />
        </div>
        {/* FORMULARIO */}
        <div class="add-form">
          {/* TITULO */}
          <h2 style={{ marginBottom: '10px' }}>Seleccionar {props.seleccionar}</h2>
          {/* ZONA DE BUSQUEDA */}
          <div style={{ marginBottom: '10px' }}>
            {/* Buscar por */}
            <div class="form-control">
              <label>Buscar por</label>
              <div class="form-control form-agrupado">
                <select id="buscarPor" value={'DNI / RUC'} style={{ width: '100%' }}>
                  <option value={'DNI / RUC'}>DNI / RUC</option>
                  <option value={'Nombre / Razón social'}>Nombre / Razón social</option>
                </select>
              </div>
            </div>
            {/* DNI RUC */}
            <div class="form-control">
              <label></label>
              <div class="form-control form-agrupado">
                <input
                  id="inputBusqueda"
                  style={{ width: '100%' }}
                  type="text"
                  value={parametrosBusqueda.cadenaABuscar}
                  onChange$={(e) => (parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value.trim())}
                  // onChange={(e) => setRucDniRSNombre(e.target.value)}
                />
                <ImgButton
                  src={images.searchPLUS}
                  alt="Icono de buscar persona"
                  height={16}
                  width={16}
                  title="Buscar persona"
                  onClick={localizarPersonas}
                  // onClick={localizarPersonas}
                />
                {/*  <ImgButton
                src={images.add}
                alt="Icono de adicionar persona"
                height={16}
                width={16}
                title="Adicionar persona"
                onClick={(e) => {
                  setVerPanelAgregarPersona(!verPanelAgregarPersona);
                }}
              /> */}
              </div>
            </div>
          </div>
          {/* TABLA DE PERSONAS HALLADAS*/}
          <div class="form-control">
            {buscarPersona.value > 0 ? (
              <TablaPersonasHalladas
                buscarPersona={buscarPersona.value}
                parametrosBusqueda={parametrosBusqueda}
                contexto={props.contexto}
                // personaSeleccionada={laPersonaSeleccionada}
                // contexto={$(() => {
                //   if (props.contexto === 'VENTA') {
                //     return CTX_VENTA;
                //   }
                //   if (props.contexto === 'COTIZACION') {
                //     return CTX_COTIZACION;
                //   }
                // })}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
);
