import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { getIgvsCompra } from '~/apis/compra.api';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';
// import { getIgvVenta } from '~/apis/venta.api';
import { images } from '~/assets';
import NewInAlmacen from '~/components/inAlmacen/newInAlmacen';
import TablaInsAlmacen from '~/components/inAlmacen/tablaInsAlmacen';
import VerInAlmacen from '~/components/inAlmacen/verInAlmacen';
import ElButton from '~/components/system/elButton';
// import ElSelect from '~/components/system/elSelect';
// import ImgButton from '~/components/system/imgButton';
import Spinner from '~/components/system/spinner';
// import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';
import BorrarInAlmacen from './borrarInAlmacen';
import { cerosALaIzquierda, hoy } from '~/functions/comunes';
import { useNavigate } from '@builder.io/qwik-city';
import { getSerieNotaIngresoDeSucursal } from '~/apis/ingresosAAlmacen.api';

export const CTX_INDEX_IN_ALMACEN = createContextId<any>('index_in_almacen');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_IN_ALMACEN
  const definicion_CTX_INDEX_IN_ALMACEN = useStore({
    iNS: [],
    mostrarPanelNewInAlmacen: false,
    grabo_InAlmacen: false,
    mostrarPanelVerInAlmacen: false,
    itemIndex: 0,

    mostrarPanelDeleteINALMACEN: false,
    seleccionadoINALMACEN: { idINALMACEN: '', fecha: '', descripcion: '' },
    borrarIdInAlmacen: '',
    eliminarIngreso: '',

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_IN_ALMACEN, definicion_CTX_INDEX_IN_ALMACEN);
  //#endregion DEFINICION CTX_INDEX_IN_ALMACEN

  //#region INICIALIZACION
  const navegarA = useNavigate();
  const ini = useSignal(0);
  const buscarInAlmacen = useSignal(0);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
  const periodoAnterior = useStore({ idPeriodo: '', periodo: '' });
  // const igv = useSignal(0);
  const losIgvsCompra = useSignal([]);
  const igvCompraPorDefault = useStore({ idElIgv: '', elIgv: '' });
  const porFechasT_porPeriodoF = useSignal(false);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    fechaInicio: hoy(), // fechas.desde,
    fechaFinal: hoy(), //fechas.hasta,

    // idAlmacen: parametrosGlobales.idAlmacen,
    // // fechaInicio: primeroDelMes(), // '2023-01-01', // hoy(),
    // // fechaFinal: hoy(),
    // periodo: '',
    // idPeriodo: '',
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

  //#region ELIMINAR INGRESO DE MERCADERIA
  const eliminarIngreso = $(async (idIngreso: string) => {
    const res = await fetch(import.meta.env.VITE_URL + '/api/ingresosAAlmacen/deIngresoAAlmacen', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idSucursal: parametrosGlobales.idSucursal,
        idIngresoAAlmacen: idIngreso,
        IS: false,
      }),
    });
    const { status, data, message } = await res.json();
    console.log('status', status, 'data', data, 'message', message);
    if (status === 200) {
      buscarInAlmacen.value++;
    } else {
      alert(message);
    }
  });

  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_IN_ALMACEN.borrarIdInAlmacen);
    if (definicion_CTX_INDEX_IN_ALMACEN.borrarIdInAlmacen !== '') {
      console.log('status 🍜🍜🍜🍜🍜🍜🍜🍜');
      eliminarIngreso(definicion_CTX_INDEX_IN_ALMACEN.borrarIdInAlmacen);
      definicion_CTX_INDEX_IN_ALMACEN.borrarIdInAlmacen = '';
      buscarInAlmacen.value++;
    }
  });

  //#endregion ELIMINAR INGRESO DE MERCADERIA

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
            // class="btn-press"
            onClick={$(async () => {
              try {
                definicion_CTX_INDEX_IN_ALMACEN.mostrarSpinner = true;
                if (parametrosGlobales.idGrupoEmpresarial === '') {
                  // console.log('estaVACIA');
                  alert('Faltan datos... vuelva a logearse...');
                  navegarA('/login');
                  return;
                }
                //VERIFICAR SI EXISTE LA SERIE DE LA NOTA DE INGRESO
                if (parametrosGlobales.idSerieNotaIngreso === '') {
                  //buscar la serie (SI EXISTE)
                  let laSerie = await getSerieNotaIngresoDeSucursal({
                    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                    idEmpresa: parametrosGlobales.idEmpresa,
                    idSucursal: parametrosGlobales.idSucursal,
                  });
                  console.log('🚎🚎🚎🚎 laSerie NotaIngreso', laSerie);
                  laSerie = laSerie.data[0];
                  console.log('🚎🚎🚎🚎🚎🚎🚎🚎 laSerie NotaIngreso', laSerie);

                  if (typeof laSerie !== 'undefined' && laSerie.idSerieNotaIngreso !== '') {
                    parametrosGlobales.idSerieNotaIngreso = laSerie.idSerieNotaIngreso;
                    parametrosGlobales.serieNotaIngreso = laSerie.serie;
                  } else {
                    alert('No existe la serie de la Nota de Ingreso.');
                    return;
                  }
                }
                //validar PERIODO
                let anioAnterior = '';
                let mesAnterior = '';
                const anio = (document.getElementById('in_laFechaHoyInAlmacen') as HTMLInputElement).value.substring(0, 4);
                const mes = (document.getElementById('in_laFechaHoyInAlmacen') as HTMLInputElement).value.substring(5, 7);
                //console.log(anio);
                // //console.log('la fechitaaaa', anio + mes);
                const periodoActual = anio + mes;
                const PPP = losPeriodosCargados.value;
                if (parseInt(mes) === 1) {
                  anioAnterior = (parseInt(anio) - 1).toString();
                  mesAnterior = '12';
                } else {
                  anioAnterior = anio;
                  mesAnterior = cerosALaIzquierda(parseInt(mes) - 1, 2).toString();
                }
                const periodoANTE = anioAnterior + mesAnterior;
                //console.log(periodoANTE);
                // //console.log('mas', mas);
                // //console.log('PPP', PPP);
                const elPeriodo: any = PPP.find((ele: any) => ele.periodo === parseInt(periodoActual));
                //console.log('⚠ elPeriodo', elPeriodo);
                if (typeof elPeriodo === 'undefined') {
                  alert(`🔰 El período ${periodoActual} no ha sido hallado, verifique.`);
                  return;
                }
                periodo.idPeriodo = elPeriodo._id;
                periodo.periodo = elPeriodo.periodo;
                //************* */
                const elPeriodoAnterior: any = PPP.find((ele: any) => ele.periodo === parseInt(periodoANTE));
                periodoAnterior.idPeriodo = elPeriodoAnterior._id;
                periodoAnterior.periodo = elPeriodoAnterior.periodo;

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
              } catch (error) {
                console.log(error);
              } finally {
                definicion_CTX_INDEX_IN_ALMACEN.mostrarSpinner = false;
              }
            })}
          />
        </div>
        {/* BUSCAR INGRESOS A ALMACEN */}
        <div style={{ display: 'inherit' }}>
          <input
            id="in_laFechaHoyInAlmacen"
            type="date"
            max={hoy()}
            // min={menosXdiasHoy(2)}
            value={parametrosBusqueda.fechaInicio}
            style={{ marginLeft: '4px' }}
            onChange$={(e) => {
              if (parametrosGlobales.idGrupoEmpresarial === '') {
                // console.log('estaVACIA');
                alert('Faltan datos... vuelva a logearse..');
                navegarA('/login');
                return;
              }
              // console.log(parametrosGlobales.idGrupoEmpresarial, parametrosGlobales.idEmpresa, parametrosGlobales.idSucursal, parametrosGlobales.periodos);
              parametrosBusqueda.fechaInicio = (e.target as HTMLInputElement).value;
              parametrosBusqueda.fechaFinal = (e.target as HTMLInputElement).value;

              // definicion_CTX_INDEX_VENTA.buscarVentas++;
              buscarInAlmacen.value++;

              definicion_CTX_INDEX_IN_ALMACEN.mostrarSpinner = true;
            }}
          />
          {/*   <input id="in_laFechaHoyVenta" type="date" disabled value={'2024-04-09'} style={{ marginLeft: '4px' }} />*/}
          <input
            type="image"
            title="Buscar InAlmacen"
            alt="icon busqueda"
            src={images.searchPLUS}
            height={21.5}
            width={21.5}
            style={{ marginLeft: '4px' }}
            onClick$={() => {
              if (parametrosGlobales.idGrupoEmpresarial === '') {
                // console.log('estaVACIA');
                alert('Faltan datos... vuelva a logearse..');
                navegarA('/login');
                return;
              }
              // definicion_CTX_INDEX_VENTA.buscarVentas++;
              buscarInAlmacen.value++;

              definicion_CTX_INDEX_IN_ALMACEN.mostrarSpinner = true;
            }}
          />
          {/* <label>hola</label> */}
          {/* <ElSelect
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
          /> */}
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
            indexItem={definicion_CTX_INDEX_IN_ALMACEN.itemIndex} // contexto={CTX_COTIZACION}
            // ancho={'600px'}
            // parametrosGlobales={parametrosGlobales}
            // inicializacion={inicializacionCotizacion}
            // onCerrar={cerrarPanelCotizacion}
          />
        </div>
      )}
      {definicion_CTX_INDEX_IN_ALMACEN.mostrarPanelVerInAlmacen && (
        <div class="modal">
          {/* <VerInAlmacen indexItem={definicion_CTX_INDEX_IN_ALMACEN.itemIndex} /> */}
          {/* <VerInAlmacen contexto="index_in_almacen" indexItem={definicion_CTX_INDEX_IN_ALMACEN.itemIndex} /> */}
          <VerInAlmacen inSelecci={definicion_CTX_INDEX_IN_ALMACEN.iNS} contexto="index_in_almacen" indexItem={definicion_CTX_INDEX_IN_ALMACEN.itemIndex} />
        </div>
      )}
      {definicion_CTX_INDEX_IN_ALMACEN.mostrarPanelDeleteINALMACEN && (
        <div class="modal">
          {/* <VerInAlmacen indexItem={definicion_CTX_INDEX_IN_ALMACEN.itemIndex} /> */}
          {/* <VerInAlmacen contexto="index_in_almacen" indexItem={definicion_CTX_INDEX_IN_ALMACEN.itemIndex} /> */}
          <BorrarInAlmacen borrarINALMACEN={definicion_CTX_INDEX_IN_ALMACEN.seleccionadoINALMACEN} />
        </div>
      )}
      {/*  tabla INGRESOS DE MERCADERIA */}
      <div style={{ margin: '10px 0' }}>
        {buscarInAlmacen.value > 0 ? (
          <TablaInsAlmacen
            buscarInAlmacen={buscarInAlmacen.value}
            // porFechasT_porPeriodoF={porFechasT_porPeriodoF.value}
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
