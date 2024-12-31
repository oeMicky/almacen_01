import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';
// import { cerosALaIzquierda, formatoDDMMYYYY_PEN } from "~/functions/comunes";
// import style from '../tabla.css?inline';
import style from '../tabla/tabla.css?inline';
// import ImgButton from '../system/imgButton';
import { images } from '~/assets';
// import { ICotizacion } from '~/routes/(almacen)/cotizacion';
// import pdfCotizacion98 from '~/reports/98/pdfCotizacion98';
// import type { ICotizacion } from "~/interfaces/iCotizacion";
// import pdfCotizacionMG from "~/reports/MG/pdfCotizacionMG";
import { CTX_INDEX_PARAMETROS_MANUFACTURA } from '~/routes/(ordenesProduccion)/parametrosManufactura';
import type { ICostoDirecto } from '~/interfaces/iParametrosManufactura';
import { parametrosGlobales } from '~/routes/login';

export default component$((props: { buscarCostosDirectos: number }) => {
  //#region CONTEXTOS
  const ctx_index_parametros_manufactura = useContext(CTX_INDEX_PARAMETROS_MANUFACTURA);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  useStyles$(style);
  //   const clickPDF = useSignal(0);
  //   const cotizacionSeleccionada = useSignal<ICotizacion>();
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const losCostosDirectos = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarCostosDirectos.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // //console.log("parametrosBusqueda", props.parametrosBusqueda);
    const res = await fetch(`${import.meta.env.VITE_URL}/api/parametrosManufactura/obtenerCostosDirectos`, {
      // const res = await fetch(`${import.meta.env.VITE_URL}/api/cotizacion/obtenerCotizacionesEntreFechas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial, idEmpresa: parametrosGlobales.idEmpresa }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  //#region VISUZALIZAR PDF
  //   const verPDF = $((cotizacion: any) => {
  //     // //console.log('a pdfCotizacionMG', cotizacion); //venta !== null &&
  //     if (typeof cotizacion !== "undefined") {
  //       //console.log("imprimiendo ... imprimiendo ... imprimiendo ...", cotizacion);
  //       // pdfCotizacion98(cotizacion);
  //       pdfCotizacionMG(cotizacion);
  //     }
  //   });

  //   useTask$(async ({ track }) => {
  //     track(() => clickPDF.value);
  //     // //console.log('a cotizacionSeleccionada.value:', cotizacionSeleccionada.value);
  //     if (typeof cotizacionSeleccionada.value !== "undefined") {
  //       await verPDF(cotizacionSeleccionada.value);
  //     }
  //   });
  //#endregion VISUZALIZAR PDF

  return (
    <Resource
      value={losCostosDirectos}
      onPending={() => {
        //console.log("onPending 🍉🍉🍉🍉");
        //
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        //console.log("onRejected 🍍🍍🍍🍍");
        // props.buscarVentas = false;
        ctx_index_parametros_manufactura.mostrarSpinner = false;
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(costosDirecctos) => {
        //console.log("onResolved 🍓🍓🍓🍓", costosDirecctos);
        const { data } = costosDirecctos; //{ status, data, message }
        const misCostosDirectos: ICostoDirecto[] = data;
        ctx_index_parametros_manufactura.mostrarSpinner = false;
        // props.buscarVentas = false;
        return (
          <>
            {misCostosDirectos.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Costo directo</th>
                      <th>Costo PEN</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misCostosDirectos.map((value) => {
                      //, index
                      // const indexItem = index + 1;
                      return (
                        <tr key={value._id}>
                          <td data-label="Costo directo" class="comoCadena">
                            {value.costoDirecto}
                          </td>
                          <td data-label="Costo PEN" class="comoNumero">
                            {value.costoPEN
                              ? parseFloat(value.costoPEN.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : ''}
                          </td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar venta"
                              height={14}
                              width={14}
                              style={{ marginRight: '8px' }}
                              // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                              // onClick$={() => {
                              //   //console.log("cotizacion", value);
                              //   ctx_index_cotizacion.cC = value;
                              //   ctx_index_cotizacion.mostrarPanelNewEditCotizacion = true;
                              // }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <div>
                <i style={{ fontSize: '0.8rem' }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
