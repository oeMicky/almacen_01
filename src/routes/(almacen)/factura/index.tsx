import {
  $,
  component$,
  createContextId,
  // useContext,
  useContextProvider,
  // useResource$,
  useSignal,
  useStore,
  useStylesScoped$,
  useTask$,
} from '@builder.io/qwik';
import ImgButton from '../../../components/system/imgButton';
import Button from '~/components/system/elButton';
import { images } from '~/assets';
import { hoy } from '~/functions/comunes';
import TablaVentas from '~/components/venta/tablaVentas';
// import Modal from '~/components/system/elModal';
import AddVenta from '~/components/venta/addVenta';
import { getIgvVenta } from '~/apis/venta.api';
import style from './index.css?inline';
import { parametrosGlobales } from '../../login/index';
// import Venta from '~/components/venta/venta';
// import { getVentasPorFechas } from '~/apis/venta.api';

// interface IVentas {
//   ventas: Venta[];
// }

// export async function getVentasPorFechas(parameBusqueda: any, controller?: AbortController): Promise<string[]> {
//   console.log('FETCH', `http://localhost:4000/api/venta/obtenerVentasPorFechas`);
//   const resp = await fetch(`http://localhost:4000/api/venta/obtenerVentasPorFechas`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(parameBusqueda),
//     signal: controller?.signal,
//   });
//   console.log('FETCH resolved');
//   const json = await resp.json();
//   return Array.isArray(json) ? json.map((repo: { name: string }) => repo.name) : Promise.reject(json);
// }
////////////***************/////////////////////***********************///////////////////
export const CTX_DOCS_VENTA = createContextId<any>('venta');

export default component$(() => {
  useStylesScoped$(style);
  console.log('🎟🎟🎟🎨🎨🎨');

  const buscarVentas = useSignal(0);
  const igv = useSignal(0);

  //#region DEFINICION CTX_DOCS_VENTA
  const definicion_CTX_DOCS_VENTA = useStore({
    mostrarPanelVenta: false,
    grabo: false,

    mostrarPanelSeleccionarPersona: false,
    selecciono_Persona: false,

    mostrarPanelCuotasCredito: false,
    grabo_CuotaCredito: false,
    grabo_cuotas_numero: 0,
    mostrarVerAlmacen: false,
    mostrarSeleccionarEquivalenciaEnSalida: false,
    grabo_ItemsVenta: false,
    grabo_items_venta_numero: 0,
    mostrarAdjuntarCotizacion: false,

    mostrarAddNewEditServicio: false,
    mostrarAdicionarServicio: false,
    mostrarServicioSeleccionado: false,
  });
  useContextProvider(CTX_DOCS_VENTA, definicion_CTX_DOCS_VENTA);
  //#endregion DEFINICION CTX_VENTA

  // const ventas = useStore([]);
  const fechas = useStore({
    // desde: '2023-01-01', // hoy(),
    desde: hoy(),
    hasta: hoy(),
  });
  const parameBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    fechaInicio: fechas.desde,
    fechaFinal: fechas.hasta,
  });
  useTask$(({ track }) => {
    const fI = track(() => fechas.desde);
    const fF = track(() => fechas.hasta);
    parameBusqueda.fechaInicio = fI;
    parameBusqueda.fechaFinal = fF;
  });

  //TAREA: Buscar ventas
  // useTask$(({ track }) => {
  //   track(() => buscarVentas.value);
  //   console.log('ir buscarVentas ... ir buscarVentas ... ir buscarVentas ... ir buscarVentas ...');
  //   if (buscarVentas.value > 0) {
  //     console.log('buscando Ventas ... buscando Ventas ... buscando Ventas ... buscando Ventas ...');
  //   }
  // });

  //TAREA: mostrar panel ADD VENTA
  // useTask$(({ track }) => {
  //   track(() => mostarPanelVentas.value);
  //   console.log('mostrar panel VENTA ... mostrar panel VENTA ... mostrar panel VENTA ...', mostarPanelVentas.value);
  // });

  // const lasVentas = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
  //   console.log('index-> tablaVentas ->->-> parameBusqueda', parameBusqueda);
  //   // track(() => props.buscarVentas.valueOf());

  //   // console.log('props.buscarVentas.valueOf', props.buscarVentas.valueOf());
  //   // if (props.buscarVentas.valueOf()) {
  //   const abortController = new AbortController();
  //   cleanup(() => abortController.abort('cleanup'));

  //   console.log('FETCH->: ', `http://localhost:4000/api/venta/obtenerVentasPorFechas`);
  //   const res = await fetch(`http://localhost:4000/api/venta/obtenerVentasPorFechas`, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(parameBusqueda),
  //     signal: abortController.signal,
  //   });
  //   return res.json();
  // });

  return (
    <main>
      <div
        class="container"
        // style={{
        //   //width: '1111px', //SIZES.anchoContenedor + 'px',
        //   height: 'inherit',
        //   color: '#858585', //COLORS.lightGray2,
        //   // background: '#a5a5a5',
        //   margin: '5px auto',
        //   display: 'inherit',
        //   justifyContent: 'inherit',
        //   alignItems: 'inherit',
        // }}
      >
        {/*  TITULO  */}
        <h3>
          <u>Facturación</u>
        </h3>
        {/*  INTERVALOS DE FECHAS  style={{ display: 'flex', margin: '10px 0' }}*/}
        {/*  style={{ marginRight: '1px', border: ' 1px solid blue' }}  style={{ marginRight: '10px', border: ' 1px solid red' }}*/}
        <div class="intervalo-fechas">
          <label class="fechas">
            Desde:{' '}
            <input
              id="fechaDesde"
              type="date"
              value={parameBusqueda.fechaInicio}
              onInput$={(e) => {
                fechas.desde = (e.target as HTMLInputElement).value;
              }}
            />
          </label>
          <label class="fechas">
            Hasta:{' '}
            <input
              id="fechaHasta"
              type="date"
              value={parameBusqueda.fechaFinal}
              onInput$={(e) => {
                fechas.hasta = (e.target as HTMLInputElement).value;
              }}
            />
          </label>
          <div class="intervalo-fechas__botonBuscar">
            <ImgButton
              id="busquedaVentas"
              src={images.searchPLUS}
              alt="Icono de busqueda"
              height={16}
              width={16}
              title="Buscar ventas"
              onClick={$(async () => {
                if (fechas.desde > fechas.hasta) {
                  alert('Verifique las fechas de busqueda');
                  document.getElementById('fechaDesde')?.focus();
                  return;
                }
                console.log('click en lupa: parameBusqueda ', parameBusqueda);

                buscarVentas.value++;
              })}
            />
          </div>
        </div>
        {/*  BOTONES   className="btn"  onClick={mostrarPanelVenta}  border: ' 1px solid blue',*/}
        <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>
          <Button
            name="ADD VENTA"
            title="Add una ventas"
            onClick={$(async () => {
              let elIgv = await getIgvVenta(parametrosGlobales);
              elIgv = elIgv.data;
              console.log('elIgv', elIgv);
              igv.value = 18; //elIgv[0].igv; //
              console.log('igv.value::', igv.value);
              definicion_CTX_DOCS_VENTA.mostrarPanelVenta = true;
            })}
          />
          {definicion_CTX_DOCS_VENTA.mostrarPanelVenta && (
            <div class="modal">
              <AddVenta ancho={600} parametrosGlobales={parametrosGlobales} igv={igv.value} />
            </div>
          )}
        </div>
        {/* TABLA VENTAS */}
        <div id="ventassss" style={{ margin: '10px 0' }}>
          {buscarVentas.value > 0 ? <TablaVentas buscarVentas={buscarVentas.value} parameBusqueda={parameBusqueda} /> : ''}
        </div>
      </div>
    </main>
  );
});

// export const AddVenta = component$(() => {
//   const panelVenta = useContext(CTX);
//   return (
//     <>
//       <div>el modal su contexto: {!panelVenta.mostrarPanelVentas ? 'A' : 'B'}</div>
//     </>
//   );
// });
