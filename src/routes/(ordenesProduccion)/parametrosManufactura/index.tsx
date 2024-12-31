import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { loadParametrosManufactura } from '~/apis/parametrosManufactura.api';
import { images } from '~/assets';
import NewEditCostoDirecto from '~/components/parametrosManufactura/newEditCostoDirecto';
import NewEditManufacturaUnitaria from '~/components/parametrosManufactura/newEditManufacturaUnitaria';
// import TablaCostosDirectos from "~/components/parametrosManufactura/tablaCostosDirectos";
// import TablaManufacturasUnitarias from "~/components/parametrosManufactura/tablaManufacturasUnitarias";
import ElButton from '~/components/system/elButton';

import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_PARAMETROS_MANUFACTURA = createContextId<any>('__index_parametros_manufactura');

export default component$(() => {
  //#region CTX_INDEX_PARAMETROS_MANUFACTURA
  const definicion_CTX_INDEX_PARAMETROS_MANUFACTURA = useStore<any>({
    idParametrosManufactura: '',
    totalCostosDirectos: 0,

    losCD: [],
    cD: [],
    mostrarPanelNewEditCostoDirecto: false,
    grabo_CostoDirecto: false,

    lasMU: [],
    mU: [],
    mostrarPanelNewEditManufacturaUnitaria: false,
    grabo_ManufacturaUnitaria: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_PARAMETROS_MANUFACTURA, definicion_CTX_INDEX_PARAMETROS_MANUFACTURA);
  //#endregion CTX_INDEX_PARAMETROS_MANUFACTURA

  //#region INICIALIZACION
  const ini = useSignal(0);
  // const buscarCostosDirectos = useSignal(0);
  // const buscarManufacturasUnitarias = useSignal(0);
  //   const igv = useSignal(0);

  //   const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  //   const periodo = useStore({ idPeriodo: "", periodo: "" });

  //   const parametrosBusqueda = useStore({
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     idSucursal: parametrosGlobales.idSucursal,
  //     idPeriodo: "",
  //   });

  //#endregion INICIALIZACION

  //#region CALCULAR SUMATORIA DE COSTOS DIRECTOS
  const calcularSumatoriaCostosDirectos = $(() => {
    let summm = 0;
    definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.losCD.map((costo: any) => {
      //console.log("costo", costo);
      //console.log("costo.costoPEN", costo.costoPEN);
      summm = summm + parseFloat(costo.costoPEN.$numberDecimal);
    });
    //console.log("summm", summm);
    definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.totalCostosDirectos = summm;
  });
  //#endregion CALCULAR SUMATORIA DE COSTOS DIRECTOS

  //#region OBTENER DATOS DE LOS PARAMETROS DE MANUFACTURA
  useTask$(async ({ track }) => {
    track(() => ini.value);

    if (parametrosGlobales.idGrupoEmpresarial.trim() !== '' && parametrosGlobales.idEmpresa.trim() !== '') {
      const parametros: any = await loadParametrosManufactura({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
      });
      //console.log("para Manufaurta TTT", parametros);
      const cross: any = parametros.data;
      //console.log("para Manufaurta", cross);
      definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.idParametrosManufactura = cross[0]._id.toString();

      if (cross.length === 1) {
        //console.log("para Manufaurta  parametros === 1", cross);
        definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.totalCostosDirectos = cross[0].totalCostosDirectos.$numberDecimal;
        definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.losCD = cross[0].costosDirectos;
        definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.lasMU = cross[0].manufacturasUnitarias;

        calcularSumatoriaCostosDirectos();
      } else {
        //console.log("para Manufaurta  parametros === 0");
        definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.totalCostosDirectos = 0;
        definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.losCD = [];
        definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.lasMU = [];
      }
    }
  });
  //#endregion OBTENER DATOS DE LOS PARAMETROS DE MANUFACTURA

  //#region ACTUALIZAR DESDE COSTOS DIRECTOS
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.grabo_CostoDirecto);

    if (definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.grabo_CostoDirecto) {
      ini.value++;
      definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.grabo_CostoDirecto = false;
    }
  });
  //#endregion ACTUALIZAR DESDE COSTOS DIRECTOS

  //#region ACTUALIZAR DESDE MANUFACTURAS UNITARIAS
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.grabo_ManufacturaUnitaria);

    if (definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.grabo_ManufacturaUnitaria) {
      ini.value++;
      definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.grabo_ManufacturaUnitaria = false;
    }
  });
  //#endregion ACTUALIZAR DESDE MANUFACTURAS UNITARIAS

  return (
    <div class="container">
      {/*  IDENTIFICACION  */}

      <div style={{ background: '#00778F' }}>
        <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.8rem', paddingLeft: '2px' }}>
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>Parametros de manufactura</u>
      </h4>
      <h4 style={{ fontSize: '0.8rem', margin: '8px 0 4px 2px' }}>
        <u>Costos directos</u>
        {/* <button onClick$={() => //console.log("deficnicon", definicion_CTX_INDEX_PARAMETROS_MANUFACTURA)}>definicon</button> */}
      </h4>
      <p style={{ fontSize: '0.7rem' }}>Costo de mano de obra, costo de energia, etc. No se incluyen los costos de suministros.</p>
      <p style={{ fontSize: '0.7rem' }}>Total Costos Directos: {definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.totalCostosDirectos}</p>
      {/*  BOTON: COSTO DIRECTO */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <ElButton
          // class="btn"
          name="ADD COSTO DIRECTO"
          // onClick={mostrarPanelOrdenServicio}
          title="Add costo directo"
          onClick={$(() => {
            definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.cD = [];
            definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mostrarPanelNewEditCostoDirecto = true;
          })}
        />
        {/* <button
          onClick$={() => {
            //console.log("definicion_CTX_INDEX_PARAMETROS_MANUFACTURA", definicion_CTX_INDEX_PARAMETROS_MANUFACTURA);
          }}
        >
          para
        </button> */}
      </div>
      {definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mostrarPanelNewEditCostoDirecto && (
        <div class="modal">
          <NewEditCostoDirecto
            cosDirecSelecci={definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.cD}
            idParametrosManufactura={definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.idParametrosManufactura}
          />
        </div>
      )}
      {/* TABLA COSTOS DIRECTOS */}
      {/* <div style={{ margin: "8px 0" }}>{buscarCostosDirectos.value > 0 ? 
        <TablaCostosDirectos buscarCostosDirectos={buscarCostosDirectos.value} /> : ""}</div> */}
      {definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.losCD.length > 0 ? (
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
              {definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.losCD.map((costDir: any) => {
                //, index
                // const indexItem = index + 1;
                return (
                  <tr key={costDir._id}>
                    <td data-label="Costo directo" class="comoCadena">
                      {costDir.costoDirecto}
                    </td>
                    <td data-label="Costo PEN" class="comoNumero">
                      {costDir.costoPEN
                        ? parseFloat(costDir.costoPEN.$numberDecimal).toLocaleString('en-PE', {
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
                        title="Editar costo directo"
                        height={14}
                        width={14}
                        style={{ marginRight: '8px' }}
                        // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                        onClick$={() => {
                          //console.log("costo directo", costDir);
                          definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.cD = costDir;
                          definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mostrarPanelNewEditCostoDirecto = true;
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
          <i style={{ fontSize: '0.8rem' }}>No se encontraron costos directos</i>
        </div>
      )}
      <br />
      <h4 style={{ fontSize: '0.8rem', margin: '8px 0 4px 2px' }}>
        <u>Manufacturas unitarias</u>
      </h4>
      <p style={{ fontSize: '0.7rem' }}>Registrar las manufacturas unitarias que luego seran cargadas en las ordenes de producción.</p>
      {/*  BOTON: MANUFACTURA UNITARIA */}
      <div style={{ marginBottom: '8px', paddingLeft: '4px' }}>
        <ElButton
          // class="btn"
          name="ADD MANUFACTURA UNITARIA STANDARIZADA"
          // disabled={}
          // onClick={mostrarPanelOrdenServicio}
          title="Add manufactura unitaria standarizada"
          onClick={$(() => {
            definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mU = [];
            definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mostrarPanelNewEditManufacturaUnitaria = true;
          })}
        />
      </div>
      {definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mostrarPanelNewEditManufacturaUnitaria && (
        <div class="modal">
          <NewEditManufacturaUnitaria
            manuUnitaSelecci={definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mU}
            idParametrosManufactura={definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.idParametrosManufactura}
            totalCostosDirectos={definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.totalCostosDirectos}
          />
        </div>
      )}
      {/* TABLA MANUFACTURAS UNITARIAS */}
      {/* <div style={{ margin: "8px 0" }}>
        {buscarManufacturasUnitarias.value > 0 ? <TablaManufacturasUnitarias buscarManufacturasUnitarias={buscarManufacturasUnitarias.value} /> : ""}
      </div> */}
      {definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.lasMU.length > 0 ? (
        <>
          <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
            <thead>
              <tr>
                <th>Manufactura unitaria standarizada</th>
                <th>Tiempo manufactura unitaria x hora</th>
                <th>Total costos directos PEN</th>
                <th>Costo manufactura unitaria PEN</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.lasMU.map((manuUnit: any) => {
                //, index
                // const indexItem = index + 1;
                return (
                  <tr key={manuUnit._id}>
                    <td data-label="Manufactura unitaria standarizada" class="comoCadena">
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
                        src={images.edit}
                        title="Editar venta"
                        height={14}
                        width={14}
                        style={{ marginRight: '8px' }}
                        // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                        onClick$={() => {
                          //console.log("ManufacturaUnitaria stadarizada", manuUnit);
                          definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mU = manuUnit;
                          definicion_CTX_INDEX_PARAMETROS_MANUFACTURA.mostrarPanelNewEditManufacturaUnitaria = true;
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
      {/* MOSTRAR SPINNER */}
      {/* {definicion_CTX_INDEX_ORDEN_PRODUCCION.mostrarSpinner && (
        <div class="modal" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      )} */}
    </div>
  );
});
