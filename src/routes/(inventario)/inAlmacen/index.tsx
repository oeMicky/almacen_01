import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { getIgvsCompra } from '~/apis/compra.api';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';
// import { getIgvVenta } from '~/apis/venta.api';
import { images } from '~/assets';
import NewInAlmacen from '~/components/inAlmacen/newInAlmacen';
import TablaInsAlmacen from '~/components/inAlmacen/tablaInsAlmacen';
import ElButton from '~/components/system/elButton';
import ElSelect from '~/components/system/elSelect';
// import ImgButton from '~/components/system/imgButton';
import Spinner from '~/components/system/spinner';
// import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_IN_ALMACEN = createContextId<any>('index_in_almacen');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_IN_ALMACEN
  const definicion_CTX_INDEX_IN_ALMACEN = useStore({
    iNS: [],
    mostrarPanelNewInAlmacen: false,
    grabo_InAlmacen: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_IN_ALMACEN, definicion_CTX_INDEX_IN_ALMACEN);
  //#endregion DEFINICION CTX_INDEX_IN_ALMACEN

  //#region INICIALIZACION
  const ini = useSignal(0);
  const buscarInAlmacen = useSignal(0);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  // const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
  // const igv = useSignal(0);
  const losIgvsCompra = useSignal([]);
  const igvCompraPorDefault = useStore({ idElIgv: '', elIgv: '' });
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
  //     bandera: 'inAlmacen',
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

  //#region ACTUALIZAR TABLA IN ALMACEN
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_IN_ALMACEN.grabo_InAlmacen);
    if (definicion_CTX_INDEX_IN_ALMACEN.grabo_InAlmacen) {
      porFechasT_porPeriodoF.value = false;
      buscarInAlmacen.value++;
      definicion_CTX_INDEX_IN_ALMACEN.grabo_InAlmacen = false;
    }
  });
  //#endregion ACTUALIZAR TABLA IN ALMACEN

  return (
    <div class="container">
      {/*  IDENTIFICACION {parametrosGlobales.nombreAlmacen} */}
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
        {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
      </h1> */}
      <div style={{ background: '#00778F' }}>
        <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.8rem', paddingLeft: '2px' }}>
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
      {/* SUB - TITULO: INGRESOS DE MERCADERIAS   border: '1px solid #ff0000',   border: '1px solid blue'*/}
      <h4 style={{ margin: '4px 0 4px 0', display: 'flex' }}>
        <img
          src={images.almacenIn}
          width={'21'}
          height={'21'}
          // style={{ marginRight: '4px ', left: 0, position: 'absolute' }}
          style={{ marginRight: '2px ', left: 0 }}
          // onClick={() => //console.log('ingreso')}
        />
        <label>Ingresos de mercaderías</label>
        {/* <label style={{ left: '24px', position: 'relative' }}>Ingresos de mercaderías</label> */}
      </h4>
      {/* DESDE - HASTA   */}
      {/* <div class="intervalo-fechas">
        <label class="fechas">
          Desde:{' '}
          <input
            id="in_fechaDesde"
            type="date"
            value={parametrosBusqueda.fechaInicio}
            onInput$={(e) => {
              parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value;
            }}
          />
        </label>
        <label class="fechas">
          Hasta:{' '}
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
              if (parametrosBusqueda.fechaInicio.trim() === '') {
                alert('Verifique la fecha inicial');
                document.getElementById('in_fechaDesde')?.focus();
                return;
              }
              if (parametrosBusqueda.fechaFinal.trim() === '') {
                alert('Verifique la fecha final');
                document.getElementById('in_fechaHasta')?.focus();
                return;
              }
              if (parametrosBusqueda.fechaInicio > parametrosBusqueda.fechaFinal) {
                alert('Verifique las fechas de busqueda');
                document.getElementById('in_fechaDesde')?.focus();
                return;
              }
              porFechasT_porPeriodoF.value = true;
              buscarInAlmacen.value++;
              // //console.log('buscarCotizaciones.value', buscarCotizaciones.value);
            })}
            // onClick={buscarCotizacionesEntreFechas}
          />
        </div>
      </div> */}
      {/* ADD INGRESO DE MERCADERIAS style={{ display: "flex" }}*/}
      <div class="intervalo-fechas">
        <div>
          <ElButton
            name="ADD INGRESO DE MERCADERÍAS"
            title="Add un nuevo ingreso de mercaderías"
            style={{ cursor: 'pointer', marginLeft: '4px' }}
            onClick={$(async () => {
              //validar PERIODO
              if (periodo.idPeriodo === '') {
                alert('Seleccione el periodo.');
                document.getElementById('se_periodo')?.focus();
                ini.value++;
                return;
              }
              // obteniendo IGVs de COMPRA
              let elIgv = await getIgvsCompra({
                idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                idEmpresa: parametrosGlobales.idEmpresa,
              });
              elIgv = elIgv.data;
              //console.log("elIgv", elIgv);
              losIgvsCompra.value = elIgv;
              const tre = elIgv.filter((docs: any) => docs.default === true);
              // //console.log('tre', tre);
              igvCompraPorDefault.idElIgv = tre[0]._id;
              igvCompraPorDefault.elIgv = tre[0].igv;
              // //console.log('igvCompraPorDefault', igvCompraPorDefault);
              //
              // let elIgv = await getIgvVenta(parametrosGlobales);
              // elIgv = elIgv.data;
              // //console.log('elIgv', elIgv);
              // igv.value = elIgv[0].igv;
              // //console.log('igv.value::', igv.value);

              definicion_CTX_INDEX_IN_ALMACEN.iNS = [];
              definicion_CTX_INDEX_IN_ALMACEN.mostrarPanelNewInAlmacen = true;
            })}
          />
        </div>
        <div style={{ display: 'inherit' }}>
          {/* <label>hola</label> */}
          <ElSelect
            id={'se_periodo_IN_ALMACEN'}
            // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
            estilos={{ cursor: 'pointer', width: '168px', marginLeft: '4px' }}
            registros={losPeriodosCargados.value}
            registroID={'_id'}
            registroTEXT={'periodo'}
            seleccione={'-- Seleccione periodo --'}
            onChange={$(() => {
              // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
              const elSelec = document.getElementById('se_periodo_IN_ALMACEN') as HTMLSelectElement;
              const elIdx = elSelec.selectedIndex;
              // //console.log('?', elIdx, elSelec[elIdx].id);
              periodo.idPeriodo = elSelec[elIdx].id;
              if (periodo.idPeriodo === '') {
                periodo.periodo = '';
                parametrosBusqueda.periodo = '';
              } else {
                periodo.periodo = elSelec.value;
                parametrosBusqueda.periodo = elSelec.value;
                // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                parametrosBusqueda.idPeriodo = periodo.idPeriodo;
                // //console.log('💨💨💨💨💨💨first', periodo);
                // //console.log('💨💨💨💨💨💨first', periodo.idPeriodo);
                buscarInAlmacen.value++;

                definicion_CTX_INDEX_IN_ALMACEN.mostrarSpinner = true;
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
            title="Buscar ingresos"
            alt="icono buscar"
            height={21.5}
            width={21.5}
            src={images.searchPLUS}
            // style={{ marginTop: '2px', marginLeft: '2px' }}
            style={{ marginLeft: '4px' }}
            onClick$={() => {
              if (parametrosBusqueda.idPeriodo === '') {
                alert('Debe seleccionar el periodo');
                document.getElementById('se_periodo_IN_ALMACEN')?.focus();
                return;
              }
              buscarInAlmacen.value++;

              definicion_CTX_INDEX_IN_ALMACEN.mostrarSpinner = true;
            }}
          />
        </div>
      </div>
      {/* style={{ display: "flex", flexDirection: "column" }} */}
      {/* <div>
        <label>hola 1</label>
        <label>hola 2</label>
      </div> */}
      {definicion_CTX_INDEX_IN_ALMACEN.mostrarPanelNewInAlmacen && (
        <div class="modal">
          <NewInAlmacen
            addPeriodo={periodo}
            inSelecci={definicion_CTX_INDEX_IN_ALMACEN.iNS}
            losIgvsCompra={losIgvsCompra.value}
            igvCompraPorDefault={igvCompraPorDefault}
            // contexto={CTX_COTIZACION}
            // ancho={'600px'}
            // parametrosGlobales={parametrosGlobales}
            // inicializacion={inicializacionCotizacion}
            // onCerrar={cerrarPanelCotizacion}
          />
        </div>
      )}
      {/*  tabla INGRESOS DE MERCADERIA */}
      <div style={{ margin: '10px 0' }}>
        {buscarInAlmacen.value > 0 ? (
          <TablaInsAlmacen
            buscarInAlmacen={buscarInAlmacen.value}
            porFechasT_porPeriodoF={porFechasT_porPeriodoF.value}
            parametrosBusqueda={parametrosBusqueda}
          />
        ) : (
          ''
        )}
      </div>
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_IN_ALMACEN.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
