import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_EDIT_ORDEN_PRODUCCION } from './newEditOrdenProduccion';
import { loadParametrosManufactura } from '~/apis/parametrosManufactura.api';
import { parametrosGlobales } from '~/routes/login';
import { CTX_ADD_MANUFACTURA } from './addManufactura';
import { redondeo6Decimales } from '~/functions/comunes';
// import TablaManufacturasUnitarias from "../parametrosManufactura/tablaManufacturasUnitarias";

export default component$(() => {
  //#region CONTEXTO
  const ctx = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
  const add = useContext(CTX_ADD_MANUFACTURA);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);
  const lasMS = useSignal([]);
  //#endregion INICIALIZACION

  //#region OBTENER DATOS DE LOS PARAMETROS DE MANUFACTURA
  useTask$(async ({ track }) => {
    track(() => ini.value);

    let parametros: any = await loadParametrosManufactura({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
    });
    parametros = parametros.data;
    console.log('para Manufaurta TTT', parametros);
    lasMS.value = parametros[0].manufacturasUnitarias;
    console.log('para Manufaurta lasMS.value', lasMS.value);
    // const cross = parametros.data;
    // console.log("para Manufactura", cross);
    // definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.idParametrosManufactura = cross[0]._id;
    // if (cross.length === 1) {
    //   console.log("para Manufaurta  parametros === 1", cross);
    //   definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.totalCostosDirectos = cross[0].totalCostosDirectos.$numberDecimal;
    //   definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.losCD = cross[0].costosDirectos;
    //   definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.lasMU = cross[0].manufacturasUnitarias;
    // } else {
    //   console.log("para Manufaurta  parametros === 0");
    //   definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.totalCostosDirectos = 0;
    //   definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.losCD = [];
    //   definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.lasMU = [];
    // }
  });
  //#endregion OBTENER DATOS DE LOS PARAMETROS DE MANUFACTURA

  return (
    <div
      style={{
        width: 'clamp(330px, 96%, 600px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
        background: '#eee',
      }}
      class="container-modal"
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
            ctx.mostrarPanelBuscarManufacturaStandarizada = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Seleccionar manufactura standarizada</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        {lasMS.value.length > 0 ? (
          <>
            <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
              <thead>
                <tr>
                  <th>Manufactura unitaria</th>
                  <th>Tiempo manufactura unitaria x hora</th>
                  <th>Total costos directos PEN</th>
                  <th>Costo manufactura unitaria PEN</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lasMS.value.map((manuUnit: any) => {
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
                      <td data-label="Costo manufactura unitaria PEN" class="comoNumero">
                        {manuUnit.totalCostosDirectos
                          ? (
                              parseFloat(manuUnit.tiempoManufacturaUnitariaPorHora.$numberDecimal) * parseFloat(manuUnit.totalCostosDirectos.$numberDecimal)
                            ).toLocaleString('en-PE', {
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
                          src={images.check32}
                          title="Seleccionar manufactura standarizada"
                          height={14}
                          width={14}
                          style={{ marginRight: '8px' }}
                          onClick$={() => {
                            add.descripcion = manuUnit.manufacturaUnitaria;
                            add.costoUnitarioPEN = redondeo6Decimales(
                              parseFloat(manuUnit.tiempoManufacturaUnitariaPorHora.$numberDecimal) * parseFloat(manuUnit.totalCostosDirectos.$numberDecimal)
                            );
                            add.costoTotalPEN = redondeo6Decimales(
                              parseFloat(add.cantidad.$numberDecimal ? add.cantidad.$numberDecimal : add.cantidad) *
                                parseFloat(manuUnit.tiempoManufacturaUnitariaPorHora.$numberDecimal) *
                                parseFloat(manuUnit.totalCostosDirectos.$numberDecimal)
                            );

                            ctx.mostrarPanelBuscarManufacturaStandarizada = false;
                          }}
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
            <i style={{ fontSize: '0.8rem' }}>No se encontraron manufacturas unitarias</i>
          </div>
        )}
        <br />
      </div>
    </div>
  );
});
