import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';
import { images } from '~/assets';
import NewOutAlmacen from '~/components/outAlmacen/newOutAlmacen';
import TablaOutsAlmacen from '~/components/outAlmacen/tablaOutsAlmacen';
import ElButton from '~/components/system/elButton';
// import ElSelect from '~/components/system/elSelect';
import Spinner from '~/components/system/spinner';
// import ImgButton from '~/components/system/imgButton';
// import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';

import { getIgvVenta } from '~/apis/venta.api';
import { existeMotivoNS, getSerieNotaSalidaDeSucursal } from '~/apis/egresosDeAlmacen.api';
import { cerosALaIzquierda, hoy } from '~/functions/comunes';
import VerOutAlmacen from '~/components/outAlmacen/verOutAlmacen';

export const CTX_INDEX_OUT_ALMACEN = createContextId<any>('index_out_almacen');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_OUT_ALMACEN
  const definicion_CTX_INDEX_OUT_ALMACEN = useStore({
    oNS: [],
    mostrarPanelNewOutAlmacen: false,
    grabo_OutAlmacen: false,
    mostrarPanelVerOutAlmacen: false,
    itemIndex: 0,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_OUT_ALMACEN, definicion_CTX_INDEX_OUT_ALMACEN);
  //#endregion DEFINICION CTX_INDEX_OUT_ALMACEN

  //#region INICIALIZACION
  const navegarA = useNavigate();
  const ini = useSignal(0);
  const buscarOUTAlmacen = useSignal(0);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
  const periodoAnterior = useStore({ idPeriodo: '', periodo: '' });

  const igv = useSignal(0);
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
        {/* <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}> */}
        <label style={{ color: '#890263', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {/* <label style={{ color: '#FF6DC9', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}> */}
          {/* <label style={{ color: '#FF3AA3', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}> */}
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
          />   background: '#222', color: 'white', borderRadius: '5px'
        </div>
      </div> */}
      {/* ADD EGRESO DE MERCADERIAS */}
      <div style={{ display: 'inline-flex' }}>
        <ElButton
          name="ADD SALIDA DE MERCADERÍAS"
          title="Add un nueva salida de mercaderías"
          class={'btn-out'}
          style={{ cursor: 'pointer', marginLeft: '5px' }}
          onClick={$(async () => {
            try {
              definicion_CTX_INDEX_OUT_ALMACEN.mostrarSpinner = true;
              if (parametrosGlobales.idGrupoEmpresarial === '') {
                // console.log('estaVACIA');
                alert('Faltan datos... vuelva a logearse..');
                navegarA('/login');
                return;
              }
              //VERIFICAR SI EXISTE LA SERIE DE LA NOTA DE SALIDA
              if (parametrosGlobales.idSerieNotaSalida === '') {
                //buscar la serie (SI EXISTE)
                let laSerie = await getSerieNotaSalidaDeSucursal({
                  idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                  idEmpresa: parametrosGlobales.idEmpresa,
                  idSucursal: parametrosGlobales.idSucursal,
                });
                // console.log('🚕🚕🚕🚕 laSerie NotaSalida', laSerie);
                laSerie = laSerie.data[0];
                // console.log('🚕🚕🚕🚕🚕🚕🚕🚕 laSerie NotaSalida', laSerie);

                if (typeof laSerie !== 'undefined' && laSerie.idSerieNotaSalida !== '') {
                  parametrosGlobales.idSerieNotaSalida = laSerie.idSerieNotaSalida;
                  parametrosGlobales.serieNotaSalida = laSerie.serie;
                } else {
                  alert('No existe la serie de la Nota de Salida.');
                  return;
                }
              }
              //ANALISIS MOTIVO SALIDA ALMACEN: NOTA DE SALIDA
              if (typeof parametrosGlobales.idMotivosSalidaDelAlmacen_NS === 'undefined' || parametrosGlobales.idMotivosSalidaDelAlmacen_NS === '') {
                // console.log('00000 parametrosGlobales.idMotivosSalidaDelAlmacen_NS', parametrosGlobales.idMotivosSalidaDelAlmacen_NS);
                let existe = await existeMotivoNS({
                  idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                  idEmpresa: parametrosGlobales.idEmpresa,
                });
                // console.log('................existe..0........', existe);
                existe = existe.data;
                // console.log('................existe..1........', existe);
                // console.log('................existe..2........', existe[0]);
                if (existe.length === 0) {
                  alert('No existe el motivo de salida de nota de venta en el almacén, pongase en contacto con el administrador.');
                  return;
                } else {
                  parametrosGlobales.idMotivosSalidaDelAlmacen_NS = existe[0]._id;
                  // console.log('111 parametrosGlobales.idMotivosSalidaDelAlmacen_NV', parametrosGlobales.idMotivosSalidaDelAlmacen_NV);
                }
              }
              //validar PERIODO
              let anioAnterior = '';
              let mesAnterior = '';
              const anio = (document.getElementById('in_laFechaHoyOutAlmacen') as HTMLInputElement).value.substring(0, 4);
              const mes = (document.getElementById('in_laFechaHoyOutAlmacen') as HTMLInputElement).value.substring(5, 7);
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
              //
              let elIgv = await getIgvVenta(parametrosGlobales);
              elIgv = elIgv.data;
              // //console.log('elIgv', elIgv);
              igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //
              // //console.log('igv.value::', igv.value);
              // showAddCotizacion.value = true;
              definicion_CTX_INDEX_OUT_ALMACEN.oNS = [];
              definicion_CTX_INDEX_OUT_ALMACEN.mostrarPanelNewOutAlmacen = true;
            } catch (error) {
              console.log('🚀 ~ file: index.tsx ~ line 169 ~ onClick ~ error', error);
            } finally {
              definicion_CTX_INDEX_OUT_ALMACEN.mostrarSpinner = false;
            }
          })}
        />
        {/* BUSCAR EGRESOS DE ALMACEN */}
        <input
          id="in_laFechaHoyOutAlmacen"
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
            buscarOUTAlmacen.value++;

            definicion_CTX_INDEX_OUT_ALMACEN.mostrarSpinner = true;
          }}
        />
        {/*   <input id="in_laFechaHoyVenta" type="date" disabled value={'2024-04-09'} style={{ marginLeft: '4px' }} />*/}
        <input
          type="image"
          title="Buscar OutAlmacen"
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
            buscarOUTAlmacen.value++;

            definicion_CTX_INDEX_OUT_ALMACEN.mostrarSpinner = true;
          }}
        />
        {/* <ElSelect
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
        /> */}
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
        {definicion_CTX_INDEX_OUT_ALMACEN.mostrarPanelVerOutAlmacen && (
          <div class="modal">
            <VerOutAlmacen
              outSelecci={definicion_CTX_INDEX_OUT_ALMACEN.oNS}
              contexto="index_out_almacen"
              indexItem={definicion_CTX_INDEX_OUT_ALMACEN.itemIndex}
            />
          </div>
        )}
      </div>
      {/*  tabla EGRESOS DE MERCADERIA */}
      <div style={{ margin: '10px 0' }}>
        {buscarOUTAlmacen.value > 0 ? (
          <TablaOutsAlmacen
            buscarOUTAlmacen={buscarOUTAlmacen.value}
            // porFechasT_porPeriodoF={porFechasT_porPeriodoF.value}
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
