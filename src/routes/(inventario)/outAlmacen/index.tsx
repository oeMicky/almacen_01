import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';
import { getIgvVenta } from '~/apis/venta.api';
import { images } from '~/assets';
import NewOutAlmacen from '~/components/outAlmacen/newOutAlmacen';
import TablaOutsAlmacen from '~/components/outAlmacen/tablaOutsAlmacen';
import ElButton from '~/components/system/elButton';
import ElSelect from '~/components/system/elSelect';
import Spinner from '~/components/system/spinner';
// import ImgButton from '~/components/system/imgButton';
// import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_OUT_ALMACEN = createContextId<any>('index_out_almacen');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_OUT_ALMACEN
  const definicion_CTX_INDEX_OUT_ALMACEN = useStore({
    oNS: [],
    mostrarPanelNewOutAlmacen: false,
    grabo_OutAlmacen: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_OUT_ALMACEN, definicion_CTX_INDEX_OUT_ALMACEN);
  //#endregion DEFINICION CTX_INDEX_OUT_ALMACEN

  //#region INICIALIZACION
  const navegarA = useNavigate();
  const ini = useSignal(0);
  const buscarOUTAlmacen = useSignal(0);
  // const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
  const igv = useSignal(0);
  const porFechasT_porPeriodoF = useSignal(false);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idAlmacen: parametrosGlobales.idAlmacen,
    // fechaInicio: primeroDelMes(), // '2023-01-01', // hoy(),
    // fechaFinal: hoy(),
    periodo: '',
    idPeriodo: '',
  });
  //#endregion INICIALIZACION

  //#region OBTENER PERIODOS
  // const cargarLosPeriodos = $(async () => {
  //   const losPeri = await getPeriodos({
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     bandera: 'outAlmacen',
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

  //#region ACTUALIZAR TABLA OUT ALMACEN
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_OUT_ALMACEN.grabo_OutAlmacen);
    if (definicion_CTX_INDEX_OUT_ALMACEN.grabo_OutAlmacen) {
      porFechasT_porPeriodoF.value = false;
      buscarOUTAlmacen.value++;
      definicion_CTX_INDEX_OUT_ALMACEN.grabo_OutAlmacen = false;
    }
  });
  //#endregion ACTUALIZAR TABLA OUT ALMACEN

  return (
    <div class="container">
      {/*  IDENTIFICACION {parametrosGlobales.nombreAlmacen} */}
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
        {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
      </h1> */}
      <div style={{ background: '#00778F' }}>
        <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {/* {` ${sessionStorage.getItem('numeroIdentidad')} - ${sessionStorage
            .getItem('empresa')
            ?.toLocaleUpperCase()} - Sucursal: ${sessionStorage.getItem('sucursal')} - Usuario: ${sessionStorage.getItem(
            'usuario'
          )}`} */}
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>
      <h4 style={{ margin: '8px 0 0 2px' }}>
        <u>Almacén: </u>
      </h4>
      {/* EGRESOS DE MERCADERIAS */}
      <h4 style={{ margin: '4px 0 4px 0', display: 'flex' }}>
        <img
          src={images.almacenOut}
          width={'21'}
          height={'21'}
          style={{ marginRight: '2px ', left: 0 }}
          // onClick={() => //console.log('ingreso')}
        ></img>
        <label>Egresos de mercaderías</label>
      </h4>
      {/* DESDE - HASTA   */}
      {/* <div class="intervalo-fechas">
        <label class="fechas">
          Desde:
          <input
            id="in_fechaDesde"
            type="date"
            value={parametrosBusqueda.fechaInicio}
            onInput$={(e) => {
              parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value;
            }}
          />
        </label>
        <label class="fechas" style={{ marginLeft: '4px' }}>
          Hasta:
          <input
            id="in_fechaHasta"
            type="date"
            value={parametrosBusqueda.fechaFinal}
            onInput$={(e) => {
              parametrosBusqueda.fechaFinal = (e.target as HTMLInputElement).value;
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
              if (parametrosBusqueda.fechaInicio > parametrosBusqueda.fechaFinal) {
                alert('Verifique las fechas de busqueda');
                document.getElementById('in_fechaDesde')?.focus();
                return;
              }
              porFechasT_porPeriodoF.value = true;
              buscarOUTAlmacen.value++;
              // //console.log('buscarCotizaciones.value', buscarCotizaciones.value);
            })}
            // onClick={buscarCotizacionesEntreFechas}
          />
        </div>
      </div> */}
      {/* ADD EGRESO DE MERCADERIAS */}
      <div style={{ display: 'inline-flex' }}>
        <ElButton
          name="ADD EGRESO DE MERCADERÍAS"
          title="Add un nuevo egreso de mercaderías"
          style={{ cursor: 'pointer', marginLeft: '5px' }}
          onClick={$(async () => {
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
            let elIgv = await getIgvVenta(parametrosGlobales);
            elIgv = elIgv.data;
            // //console.log('elIgv', elIgv);
            igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //
            // //console.log('igv.value::', igv.value);
            // showAddCotizacion.value = true;
            definicion_CTX_INDEX_OUT_ALMACEN.oNS = [];
            definicion_CTX_INDEX_OUT_ALMACEN.mostrarPanelNewOutAlmacen = true;
          })}
        />
        <ElSelect
          id={'se_periodo_OUT_ALMACEN'}
          // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
          estilos={{ cursor: 'pointer', width: '203px', marginLeft: '4px' }}
          registros={losPeriodosCargados.value}
          registroID={'_id'}
          registroTEXT={'periodo'}
          seleccione={'-- Seleccione periodo --'}
          onChange={$(() => {
            // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
            const elSelec = document.getElementById('se_periodo_OUT_ALMACEN') as HTMLSelectElement;
            const elIdx = elSelec.selectedIndex;
            // //console.log('?', elIdx, elSelec[elIdx].id);
            periodo.idPeriodo = elSelec[elIdx].id;
            if (periodo.idPeriodo === '') {
              periodo.periodo = '';
            } else {
              periodo.periodo = elSelec.value;
              // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
              parametrosBusqueda.idPeriodo = periodo.idPeriodo;
              // //console.log('💨💨💨💨💨💨first', periodo);
              // //console.log('💨💨💨💨💨💨first', periodo.idPeriodo);
              buscarOUTAlmacen.value++;

              definicion_CTX_INDEX_OUT_ALMACEN.mostrarSpinner = true;
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
          title="Buscar egresos"
          alt="icono buscar"
          height={21.5}
          width={21.5}
          src={images.searchPLUS}
          style={{ marginLeft: '4px' }}
          onClick$={() => {
            if (periodo.idPeriodo === '') {
              alert('Seleccione un periodo');
              document.getElementById('se_periodo_OUT_ALMACEN')?.focus();
              return;
            }
            buscarOUTAlmacen.value++;
            definicion_CTX_INDEX_OUT_ALMACEN.mostrarSpinner = true;
          }}
        />
        {/* <button
          onClick$={() =>
            //console.log('parametrosGlobales.periodos outAlmacen - ini.value', parametrosGlobales.periodos, ini.value)
          }
        >
          los
        </button> */}
        {definicion_CTX_INDEX_OUT_ALMACEN.mostrarPanelNewOutAlmacen && (
          <div class="modal">
            <NewOutAlmacen addPeriodo={periodo} outSelecci={definicion_CTX_INDEX_OUT_ALMACEN.oNS} igv={igv.value} />
          </div>
        )}
      </div>
      {/*  tabla EGRESOS DE MERCADERIA */}
      <div style={{ margin: '10px 0' }}>
        {buscarOUTAlmacen.value > 0 ? (
          <TablaOutsAlmacen
            buscarOUTAlmacen={buscarOUTAlmacen.value}
            porFechasT_porPeriodoF={porFechasT_porPeriodoF.value}
            parametrosBusqueda={parametrosBusqueda}
          />
        ) : (
          ''
        )}
      </div>
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_OUT_ALMACEN.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
