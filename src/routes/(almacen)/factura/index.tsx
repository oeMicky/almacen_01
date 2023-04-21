import {
  $,
  component$,
  createContextId,
  useContext,
  useContextProvider,
  useResource$,
  useSignal,
  useStore,
  useTask$,
} from '@builder.io/qwik';
import ImgButton from '../../../components/system/imgButton';
import Button from '~/components/system/elButton';
import { images } from '~/assets';
import { hoy } from '~/functions/comunes';
import TablaVentas from '~/components/venta/tablaVentas';
import Modal from '~/components/system/elModal';
import AddVenta from '~/components/venta/addVenta';
import { getIgvVenta } from '~/apis/venta.api';
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
export const CTX_VENTA = createContextId<any>('venta');

export default component$(() => {
  console.log('🎟🎟🎟🎨🎨🎨');
  const parametrosGlobales = useStore({
    idGrupoEmpresarial: '60f097ca53621708ecc4e781',
    idEmpresa: '60f097ca53621708ecc4e782', //'60efd5c8e0eac5122cc56ddc',
    parameRUC: '99999999999',
    // parameRUC: 'chamo', // '99999999999',
    parameRazonSocial: 'ACME SAC',
    paraDireccion: 'ARKANZAS NRO 354',
    idAlmacen: '60f3e61a41a71c1148bc4e29', //'608321ef5d922737c40831b1',
    nombreAlmacen: 'Praga',
    usuario: 'arnold',
    ingreso: false,
  });
  const buscarVentas = useSignal(0);
  const igv = useSignal(0);
  //#region CONTEXTO VENTA
  const panelVenta = useStore({
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
  });
  useContextProvider(CTX_VENTA, panelVenta);
  //#endregion CONTEXTO VENTA

  const ventas = useStore([]);
  const fechas = useStore({
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
    <div
      style={{
        width: '1111px', //SIZES.anchoContenedor + 'px',
        height: 'inherit',
        color: '#858585', //COLORS.lightGray2,
        // background: '#a5a5a5',
        margin: '5px auto',
        display: 'inherit',
        justifyContent: 'inherit',
        alignItems: 'inherit',
      }}
    >
      {/*  TITULO  */}
      <h3>
        <u>Facturación</u>
      </h3>
      {/*  INTERVALOS DE FECHAS */}
      <div style={{ display: 'flex', margin: '10px 0' }}>
        <label style={{ marginRight: '10px' }}>
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

        <label style={{ marginRight: '5px' }}>
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
      {/*  BOTONES   className="btn"  onClick={mostrarPanelVenta}  */}
      <div style={{ marginBottom: '10px' }}>
        <Button
          name="ADD VENTA"
          title="Add una ventas"
          onClick={$(async () => {
            let elIgv = await getIgvVenta(parametrosGlobales);
            elIgv = elIgv.data;
            igv.value = elIgv[0].igv;
            panelVenta.mostrarPanelVenta = true;
          })}
        />
        {panelVenta.mostrarPanelVenta && (
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
