import { Resource, component$, useContext, useResource$, useStyles$ } from '@builder.io/qwik';

import style from '../tabla/tabla.css?inline';
import { images } from '~/assets';
import { CTX_INDEX_PARAMETROS_MANUFACTURA } from '~/routes/(ordenesProduccion)/parametrosManufactura';
import type { IManufacturaUnitaria } from '~/interfaces/iParametrosManufactura';
import { parametrosGlobales } from '~/routes/login';

export default component$((props: { buscarManufacturasUnitarias: number }) => {
  //#region CONTEXTOS
  const ctx_index_parametros_manufactura = useContext(CTX_INDEX_PARAMETROS_MANUFACTURA);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  useStyles$(style);
  //   const clickPDF = useSignal(0);
  //   const cotizacionSeleccionada = useSignal<ICotizacion>();
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const lasManufacturasUnitarias = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarManufacturasUnitarias.valueOf());

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
      value={lasManufacturasUnitarias}
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
        const misManufacturasUnitarias: IManufacturaUnitaria[] = data;
        ctx_index_parametros_manufactura.mostrarSpinner = false;
        // props.buscarVentas = false;
        return (
          <>
            {misManufacturasUnitarias.length > 0 ? (
              <>
                <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Manufactura unitaria</th>
                      <th>Tiempo manufactura unitaria x hora</th>
                      <th>Total costos directos PEN</th>
                      <th>Costo manufactura unitaria</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misManufacturasUnitarias.map((manuUnit) => {
                      //, index
                      // const indexItem = index + 1;
                      return (
                        <tr key={manuUnit._id}>
                          <td data-label="Manufactura unitaria" class="comoCadena">
                            {manuUnit.manufacturaUnitaria}
                          </td>
                          <td data-label="Tiempo manufactura unitaria x hora" class="comoNumero">
                            {manuUnit.tiempoManufacturaUnitariaPorHora
                              ? parseFloat(manuUnit.tiempoManufacturaUnitariaPorHora.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : ''}
                          </td>
                          <td data-label="Total costos directos PEN" class="comoNumero">
                            {manuUnit.totalCostosDirectos
                              ? parseFloat(manuUnit.totalCostosDirectos.$numberDecimal).toLocaleString('en-PE', {
                                  // style: 'currency',
                                  currency: 'PEN',
                                  minimumFractionDigits: 2,
                                })
                              : ''}
                          </td>
                          <td data-label="Costo manufactura unitaria" class="comoNumero">
                            {/* {manuUnit.costoManufacturaUnitario
                              ? parseFloat(manuUnit.costoManufacturaUnitario.$numberDecimal).toLocaleString("en-PE", {
                                  // style: 'currency',
                                  currency: "PEN",
                                  minimumFractionDigits: 2,
                                })
                              : ""} */}
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
