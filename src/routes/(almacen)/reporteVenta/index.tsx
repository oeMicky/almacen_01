import { $, component$, createContextId, useContextProvider, useSignal, useStore } from '@builder.io/qwik';

import { images } from '~/assets';
// import { CTX_HEADER_ALMACEN } from '~/components/header/headerAlmacen';
import TablaReporteVenta from '~/components/reporteVenta/tablaReporteVenta';
import ElSelect from '~/components/system/elSelect';
import Spinner from '~/components/system/spinner';
import { hoy, menosXdiasHoy } from '~/functions/comunes';
// import pdfReporteVenta from '~/reports/MG/pdfReporteVenta';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_REPORTE_VENTA = createContextId<any>('__index_reporte_venta');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_REPORTE_VENTA
  const definicion_CTX_INDEX_REPORTE_VENTA = useStore({
    misRepoVts: [],

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_REPORTE_VENTA, definicion_CTX_INDEX_REPORTE_VENTA);
  //#endregion DEFINICION CTX_INDEX_REPORTE_VENTA

  //#region CONTEXTO
  // const ctx_header_almacen = useContext(CTX_HEADER_ALMACEN);
  //#endregion CONTEXTO

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    buscarPor: 'FECHAS',
    fechaInicio: menosXdiasHoy(5), //hoy(),
    fechaFinal: hoy(),
    idPeriodo: '',
  });

  //#region INICIALIZACION
  // const losPeriodosCargados = useSignal(JSON.parse(localStorage.getItem('periodos') || '[]'));
  // const ini = useSignal(0);
  const buscarReporteVentas = useSignal(0);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = { idPeriodo: '', periodo: '' };
  // const verReporte = useSignal(0);

  // useTask$(({ track }) => {
  //   track(() => ini.value);

  //   parametrosGlobales.mostrarSpinner = false;
  // });

  //  useBrowserVisibleTask$(()=>{

  //  })

  //#endregion INICIALIZACION

  return (
    <div class="container">
      {/*  IDENTIFICACION  style={{ border: '3px pink solid' }}*/}
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
          {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
        </h1>                , border: '1px green solid'       */}
      <div style={{ background: '#00778F' }}>
        <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {/* {` ${localStorage.getItem('numeroIdentidad')} - ${localStorage
              .getItem('empresa')
              ?.toLocaleUpperCase()} - Sucursal: ${localStorage.getItem('sucursal')} - Usuario: ${localStorage.getItem(
              'usuario'
            )}`} */}
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>Reporte de venta</u>
      </h4>
      {/*  INTERVALOS DE FECHAS  border: '1px pink solid' style={{ display: 'flex', margin: '10px 0' }}*/}
      {/*  BOTONES   */}
      <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>
        <label style={{ fontSize: '0.8rem' }}>Buscar por</label>
        <select
          id="se_BuscarPor"
          onChange$={(e) => {
            parametrosBusqueda.buscarPor = (e.target as HTMLSelectElement).value;
            document.getElementById('in_Dni_Nombre')?.focus();
          }}
          style={{ marginLeft: '4px' }}
        >
          <option value={'FECHAS'} selected={parametrosBusqueda.buscarPor === 'FECHAS'}>
            FECHAS
          </option>
          <option value={'PERIODO'} selected={parametrosBusqueda.buscarPor === 'PERIODO'}>
            PERIODO
          </option>
        </select>
      </div>
      <div>
        {parametrosBusqueda.buscarPor === 'FECHAS' && (
          <>
            <div class="intervalo-fechas">
              <label class="fechas">
                Desde
                <input
                  id="fechaDesde"
                  type="date"
                  value={parametrosBusqueda.fechaInicio}
                  style={{ marginLeft: '4px' }}
                  onChange$={(e) => {
                    parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value;
                  }}
                  // onInput$={(e) => {
                  //   fechas.desde = (e.target as HTMLInputElement).value;
                  // }}
                />
              </label>
              <label class="fechas" style={{ marginLeft: '4px' }}>
                Hasta
                <input
                  id="fechaHasta"
                  type="date"
                  value={parametrosBusqueda.fechaFinal}
                  style={{ marginLeft: '4px' }}
                  onChange$={(e) => {
                    parametrosBusqueda.fechaFinal = (e.target as HTMLInputElement).value;
                  }}
                  // onInput$={(e) => {
                  //   fechas.hasta = (e.target as HTMLInputElement).value;
                  // }}
                />
              </label>
              <input
                type="image"
                title="Buscar ventas"
                alt="icon busqueda"
                height={16}
                width={16}
                style={{ marginLeft: '2px' }}
                src={images.searchPLUS}
                onClick$={() => {
                  // console.log('libro azuñ', parametrosBusqueda.fechaInicio, parametrosBusqueda.fechaFinal);
                  if (parametrosBusqueda.fechaInicio > parametrosBusqueda.fechaFinal) {
                    alert('Verifique las fechas de busqueda');
                    document.getElementById('fechaDesde')?.focus();
                    return;
                  }

                  buscarReporteVentas.value++;

                  definicion_CTX_INDEX_REPORTE_VENTA.mostrarSpinner = true;
                }}
              />
              <div class="intervalo-fechas__botonBuscar">
                {/* <ImgButton
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

              buscarVentas.value++;
            })}
          /> */}
              </div>
            </div>
          </>
        )}
        {parametrosBusqueda.buscarPor === 'PERIODO' && (
          <>
            <ElSelect
              id="se_periodo_REPORTE_VENTA"
              // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
              estilos={{ width: '114px', marginLeft: '5px' }}
              registros={losPeriodosCargados.value}
              registroID={'_id'}
              registroTEXT={'periodo'}
              seleccione={'-- Selecc. periodo --'}
              onChange={$(() => {
                const elSelec = document.getElementById('se_periodo_REPORTE_VENTA') as HTMLSelectElement;
                const elIdx = elSelec.selectedIndex;

                periodo.idPeriodo = elSelec[elIdx].id;
                if (periodo.idPeriodo === '') {
                  periodo.periodo = '';
                } else {
                  periodo.periodo = elSelec.value;

                  parametrosBusqueda.idPeriodo = periodo.idPeriodo;
                  //
                  //
                  buscarReporteVentas.value++;

                  definicion_CTX_INDEX_REPORTE_VENTA.mostrarSpinner = true;
                }
              })}
              onKeyPress={$((e: any) => {
                if (e.key === 'Enter') {
                  (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
                }
              })}
            />
            <input
              // id="in_BuscarDetraccion"
              type="image"
              src={images.searchPLUS}
              title="Refrescar ventas"
              height={16}
              width={16}
              style={{ marginLeft: '2px' }}
              onClick$={() => {
                if (parametrosBusqueda.idPeriodo === '') {
                  alert('Debe seleccionar el periodo');
                  document.getElementById('se_periodo_REPORTE_VENTA')?.focus();
                  return;
                }
                buscarReporteVentas.value++;

                definicion_CTX_INDEX_REPORTE_VENTA.mostrarSpinner = true;
              }}
            />
          </>
        )}
        {/* <ElSelect
          id="se_periodo_REPORTE_VENTA"
          // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
          estilos={{ width: '114px', marginLeft: '5px' }}
          registros={losPeriodosCargados.value}
          registroID={'_id'}
          registroTEXT={'periodo'}
          seleccione={'-- Selecc. periodo --'}
          onChange={$(() => {
            const elSelec = document.getElementById('se_periodo_VENTA') as HTMLSelectElement;
            const elIdx = elSelec.selectedIndex;

            periodo.idPeriodo = elSelec[elIdx].id;
            if (periodo.idPeriodo === '') {
              periodo.periodo = '';
            } else {
              periodo.periodo = elSelec.value;
            
              parametrosBusqueda.idPeriodo = periodo.idPeriodo;
           
              buscarVentas.value++;

              definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
            }
          })}
          onKeyPress={$((e: any) => {
            if (e.key === 'Enter') {
              (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
            }
          })}
        /> */}
        {/* <input
          // id="in_BuscarDetraccion"
          type="image"
          src={images.searchPLUS}
          title="Refrescar ventas"
          height={16}
          width={16}
          style={{ marginLeft: '2px' }}
          // onFocusin$={() => console.log('☪☪☪☪☪☪')}
          // onClick$={() => {
          //   if (parametrosBusqueda.idPeriodo === '') {
          //     alert('Debe seleccionar el periodo');
          //     document.getElementById('se_periodo_VENTA')?.focus();
          //     return;
          //   }
          //   buscarVentas.value++;

          //   definicion_CTX_INDEX_VENTA.mostrarSpinner = true;
          // }}
        /> */}
      </div>
      {/* TABLA VENTAS */}
      <div id="ventassss" style={{ margin: '10px 0' }}>
        {buscarReporteVentas.value > 0 ? (
          <TablaReporteVenta buscarReporteVentas={buscarReporteVentas.value} parametrosBusqueda={parametrosBusqueda} />
        ) : (
          ''
        )}
      </div>
      {/* <br></br> */}
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_REPORTE_VENTA.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
