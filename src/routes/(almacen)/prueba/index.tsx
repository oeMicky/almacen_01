import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { getPeriodos } from '~/apis/grupoEmpresarial.api';
import { images } from '~/assets';
import ElButton from '~/components/system/elButton';
// import ElSelect from '~/components/system/elSelect';
import ImgButton from '~/components/system/imgButton';

export const CTX_PRUEBA = createContextId<any>('index_prueba__');

export default component$(() => {
  //#region CTX_PRUEBA
  const definicion_CTX_PRUEBA = useStore({
    cC: [],
    mostrarPanelNewEditCotizacion: false,
    grabo_Cotizacion: false,
  });
  useContextProvider(CTX_PRUEBA, definicion_CTX_PRUEBA);
  //#endregion CTX_PRUEBA

  //#region INICIALIZACION
  const ini = useSignal(0);

  // const cargarPeriodos = $(async (parametros: any) => {
  //   const losPeri = await getPeriodos(parametros);

  //   console.log('losPeri', losPeri);
  // });

  // useTask$(({ track }) => {
  //   track(() => ini.value);

  //   console.log('first');
  //   cargarPeriodos({ idGrupoEmpresarial: '60f097ca53621708ecc4e781', idEmpresa: '60f097ca53621708ecc4e782', bandera: 'prueba' });
  // });
  //#endregion INICIALIZACION
  return (
    <main>
      <div class="container">
        {/*  TITULO  */}
        {/* {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`} */}
        <div style={{ background: '#00778F' }}>
          <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem' }}>
            {` ${sessionStorage.getItem('numeroIdentidad')} - ${sessionStorage
              .getItem('empresa')
              ?.toLocaleUpperCase()} - Sucursal: ${sessionStorage.getItem('sucursal')} - Usuario: ${sessionStorage.getItem(
              'usuario'
            )}`}
          </label>
        </div>

        <h3>
          <u>Cotizaciones - Prueba</u>
        </h3>
        {/*  INTERVALOS DE FECHAS */}
        <div class="intervalo-fechas">
          <label class="fechas">
            Desde:{' '}
            <input
              id="fechaDesde"
              type="date"
              //   value={parametrosBusqueda.fechaInicio}
              //   onInput$={(e) => {
              //     fechas.desde = (e.target as HTMLInputElement).value;
              //   }}
            />
          </label>
          <label class="fechas">
            Hasta:{' '}
            <input
              id="fechaHasta"
              type="date"
              //   value={parametrosBusqueda.fechaFinal}
              //   onInput$={(e) => {
              //     fechas.hasta = (e.target as HTMLInputElement).value;
              //   }}
            />
          </label>
          <div class="intervalo-fechas__botonBuscar">
            <ImgButton
              src={images.searchPLUS}
              alt="Icono de busqueda"
              height={16}
              width={16}
              title="Buscar ventas"
              //   onClick={$(() => {
              //     if (fechas.desde > fechas.hasta) {
              //       alert('Verifique las fechas de busqueda');
              //       document.getElementById('fechaDesde')?.focus();
              //       return;
              //     }
              //     buscarCotizaciones.value++;
              //     console.log('buscarCotizaciones.value', buscarCotizaciones.value);
              //   })}
            />
          </div>
        </div>

        {/*  BOTONES */}
        <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>
          <ElButton
            name="ADD COTIZACION"
            title="Add una cotización"
            // onClick={$(async () => {
            //   if (periodo.idPeriodo === '') {
            //     alert('Seleccione el periodo.');
            //     document.getElementById('se_periodo')?.focus();
            //     ini.value++;
            //     return;
            //   }
            //   //
            //   let elIgv = await getIgvVenta(parametrosGlobales);
            //   elIgv = elIgv.data;
            //   console.log('elIgv', elIgv);
            //   igv.value = elIgv[0].igv;
            //   console.log('igv.value::', igv.value);
            //   definicion_CTX_INDEX_COTIZACION.cC = [];
            //   definicion_CTX_INDEX_COTIZACION.mostrarPanelNewEditCotizacion = true;
            // })}
          />
          {/* <ElSelect
            id={'se_periodo'}
            estilos={{ width: '168px', marginLeft: '5px' }}
            // registros={losPeriodosCargados.value}
            registroID={'_id'}
            registroTEXT={'periodo'}
            seleccione={'-- Seleccione periodo --'}
            // onChange={$(() => {
            //   console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
            //   const elSelec = document.getElementById('se_periodo') as HTMLSelectElement;
            //   const elIdx = elSelec.selectedIndex;
            //   console.log('?', elIdx, elSelec[elIdx].id);
            //   periodo.idPeriodo = elSelec[elIdx].id;
            //   if (periodo.idPeriodo === '') {
            //     periodo.periodo = '';
            //   } else {
            //     periodo.periodo = elSelec.value;
            //   }
            // })}
            onKeyPress={$((e: any) => {
              if (e.key === 'Enter') {
                (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
              }
            })}
          /> */}
          {/* <button
            onClick$={() => {
              console.log('button losPeriodosCargados.value', losPeriodosCargados.value);
            }}
          >
            losPeriodosCargados.value
          </button> */}

          {/* {definicion_CTX_PRUEBA.mostrarPanelNewEditCotizacion && (
            <div class="modal"> */}
          {/* <NewEditCotizacion addPeriodo={periodo} cotizacionSelecci={definicion_CTX_INDEX_COTIZACION.cC} igv={igv.value} /> */}
          {/* <NewEditCotizacion addPeriodo={202312} cotizacionSelecci={definicion_CTX_PRUEBA.cC} igv={18} />
            </div>
          )}*/}
        </div>
        {/* TABLA COTIZACIONES */}
        {/* <div style={{ margin: '10px 0' }}>
          {buscarCotizaciones.value > 0 ? (
            <TablaCotizaciones
              buscarCotizaciones={buscarCotizaciones.value}
              modoSeleccion={false}
              parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
        </div> */}
      </div>
    </main>
  );
});
