import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import ImgButton from '~/components/system/imgButton';
import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '../../login/index';
import TablaCotizaciones from '~/components/cotizacion/tablaCotizaciones';
import ElButton from '~/components/system/elButton';
import NewEditCotizacion from '~/components/cotizacion/newEditCotizacion';
import { getIgvVenta } from '~/apis/venta.api';
import ElSelect from '~/components/system/elSelect';
import Spinner from '~/components/system/spinner';
// import { images } from '~/assets';
import { useNavigate } from '@builder.io/qwik-city';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';
// import TablaCotizaciones from '~/components/venta/tablaCotizaciones';

export const CTX_INDEX_COTIZACION = createContextId<any>('index_cotizacion__');

export default component$(() => {
  //#region CTX_INDEX_COTIZACION
  const definicion_CTX_INDEX_COTIZACION = useStore({
    cC: [],
    mostrarPanelNewEditCotizacion: false,
    grabo_Cotizacion: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_COTIZACION, definicion_CTX_INDEX_COTIZACION);
  //#endregion CTX_INDEX_COTIZACION

  //#region INICIALIZACION
  const ini = useSignal(0);
  const navegarA = useNavigate();

  const buscarCotizaciones = useSignal(0);

  const igv = useSignal(0);
  // const showAddCotizacion = useSignal(false);
  // //
  // const igvPorDefault = useStore({ idElIgv: '', elIgv: '' });
  //
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
  //*Fechas
  const fechas = useStore({
    desde: primeroDelMes(), //  '2023-01-01', // hoy(),
    hasta: hoy(),
  });
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    idPeriodo: '',
    fechaInicio: fechas.desde,
    fechaFinal: fechas.hasta,
  });
  // useTask$(({ track }) => {
  //   const fI = track(() => fechas.desde);
  //   const fF = track(() => fechas.hasta);
  //   parametrosBusqueda.fechaInicio = fI;
  //   parametrosBusqueda.fechaFinal = fF;
  // });
  //#endregion INICIALIZANDO

  //#region ACTUALIZAR TABLA COTIZACIONES
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_COTIZACION.mostrarPanelNewEditCotizacion);
    if (definicion_CTX_INDEX_COTIZACION.grabo_Cotizacion) {
      //actualizar TABLA ORDENES SERVICIO
      // //console.log('actualizar TABLA ORDENES SERVICIO', defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS);
      buscarCotizaciones.value++;
      definicion_CTX_INDEX_COTIZACION.mostrarSpinner = true;
      definicion_CTX_INDEX_COTIZACION.grabo_Cotizacion = false;
    }
  });
  //#endregion ACTUALIZAR TABLA COTIZACIONES

  //#region OBTENER PERIODOS
  // const cargarLosPeriodos = $(async () => {
  //   const losPeri = await getPeriodos({
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     bandera: 'Cotizaciones',
  //   });
  //   //console.log('losPeri', losPeri);
  //   losPeriodosCargados.value = losPeri.data;
  //   //console.log(' losPeriodosCargados.value', losPeriodosCargados.value);
  //   // //console.log('a cargar periodos');
  // });

  // useTask$(({ track }) => {
  //   track(() => ini.value);

  //   cargarLosPeriodos();
  // });
  //#endregion OBTENER PERIODOS

  return (
    <main>
      <div class="container">
        {/*  IDENTIFICACION  */}
        {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem', paddingLetf: '5px' }}>
          {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
        </h1> */}
        <div style={{ background: '#00778F' }}>
          <label style={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
            {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
          </label>
        </div>
        <h4 style={{ margin: '8px 0 4px 2px' }}>
          <u>
            Cotizaciones - <label style={{ color: 'red' }}>{parametrosGlobales.sucursal}</label>
          </u>
        </h4>
        {/*  INTERVALOS DE FECHAS */}
        {/* <div class="intervalo-fechas">
          <label class="fechas">
            Desde:{' '}
            <input
              id="fechaDesde"
              type="date"
              value={parametrosBusqueda.fechaInicio}
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
              value={parametrosBusqueda.fechaFinal}
              onInput$={(e) => {
                fechas.hasta = (e.target as HTMLInputElement).value;
              }}
            />
          </label>
          <div class="intervalo-fechas__botonBuscar">
            <ImgButton
              src={images.searchPLUS}
              alt="Icono de busqueda"
              height={16}
              width={16}
              title="Buscar ventas"
              onClick={$(() => {
                if (fechas.desde > fechas.hasta) {
                  alert('Verifique las fechas de busqueda');
                  document.getElementById('fechaDesde')?.focus();
                  return;
                }
                buscarCotizaciones.value++;
                //console.log('buscarCotizaciones.value', buscarCotizaciones.value);
              })}
            />
          </div>
        </div> */}
        {/* <button onClick$={() => //console.log('parametros', parametrosGlobales)}>ver param</button> */}
        {/*  BOTONES */}
        <div style={{ display: 'inline-flex', marginBottom: '8px', paddingLeft: '2px' }}>
          <ElButton
            name="ADD COTIZACION"
            title="Add una cotización"
            style={{ cursor: 'pointer' }}
            onClick={$(async () => {
              try {
                definicion_CTX_INDEX_COTIZACION.mostrarSpinner = true;
                //
                if (parametrosGlobales.idGrupoEmpresarial === '') {
                  // console.log('estaVACIA');
                  alert('Faltan datos... vuelva a logearse..');
                  navegarA('/login');
                  return;
                }
                //validar PERIODO
                if (periodo.idPeriodo === '') {
                  alert('Seleccione el periodo.');
                  document.getElementById('se_periodo')?.focus();
                  ini.value++;
                  return;
                }
                //
                let elIgv = await getIgvVenta({
                  idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                  idEmpresa: parametrosGlobales.idEmpresa,
                });
                elIgv = elIgv.data;
                //console.log('elIgv', elIgv);
                igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //
                //console.log('igv.value::', igv.value);

                definicion_CTX_INDEX_COTIZACION.cC = [];
                definicion_CTX_INDEX_COTIZACION.mostrarPanelNewEditCotizacion = true;
              } catch (error) {
                console.log('🚀 ~ onClick ~ error', error);
              } finally {
                definicion_CTX_INDEX_COTIZACION.mostrarSpinner = false;
              }
            })}
          />
          <ElSelect
            id={'se_periodo'}
            estilos={{ width: '168px', marginLeft: '4px' }}
            registros={losPeriodosCargados.value}
            registroID={'_id'}
            registroTEXT={'periodo'}
            seleccione={'-- Seleccione periodo --'}
            onChange={$(() => {
              // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
              const elSelec = document.getElementById('se_periodo') as HTMLSelectElement;
              const elIdx = elSelec.selectedIndex;
              // //console.log('?', elIdx, elSelec[elIdx].id);
              periodo.idPeriodo = elSelec[elIdx].id;
              if (periodo.idPeriodo === '') {
                periodo.periodo = '';
              } else {
                periodo.periodo = elSelec.value;

                parametrosBusqueda.idPeriodo = periodo.idPeriodo;
                // //console.log('💨💨💨💨💨💨first', periodo);
                // //console.log('💨💨💨💨💨💨first', periodo.idPeriodo);
                buscarCotizaciones.value++;

                definicion_CTX_INDEX_COTIZACION.mostrarSpinner = true;
              }
            })}
            onKeyPress={$((e: any) => {
              if (e.key === 'Enter') {
                (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
              }
            })}
          />
          <input
            type="image"
            title="Buscar cotizaciones"
            alt="icono buscar"
            height={21.5}
            width={21.5}
            style={{ marginLeft: '4px' }}
            src={images.searchPLUS}
            onClick$={() => {
              if (periodo.idPeriodo === '') {
                alert('Seleccione un periodo');
                document.getElementById('se_periodo')?.focus();
                return;
              }
              buscarCotizaciones.value++;
              definicion_CTX_INDEX_COTIZACION.mostrarSpinner = true;
            }}
          />
          {/* <button
            onClick$={() => {
              //console.log('button losPeriodosCargados.value', losPeriodosCargados.value);
            }}
          >
            losPeriodosCargados.value
          </button> */}

          {definicion_CTX_INDEX_COTIZACION.mostrarPanelNewEditCotizacion && (
            <div class="modal">
              <NewEditCotizacion addPeriodo={periodo} cotizacionSelecci={definicion_CTX_INDEX_COTIZACION.cC} igv={igv.value} />
            </div>
          )}
        </div>
        {/* TABLA COTIZACIONES */}
        <div style={{ margin: '8px 0' }}>
          {buscarCotizaciones.value > 0 ? (
            <TablaCotizaciones
              buscarCotizaciones={buscarCotizaciones.value}
              // verPDF={generarPDF}
              modoSeleccion={false}
              parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
          {/* MOSTRAR SPINNER */}
          {definicion_CTX_INDEX_COTIZACION.mostrarSpinner && (
            <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </main>
  );
});

{
  /* {cotizaciones.length ? (
            <TablaCotizaciones registros={cotizaciones} verPDF={generarPDF} onEdit={editarCotizacion} />
          ) : (
            <i style={{ fontSize: '0.7rem' }}>No existen cotizaciones</i>
          )} */
}
