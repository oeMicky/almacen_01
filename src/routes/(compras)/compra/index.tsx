import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
// import { getIDLibroDiario } from '~/apis/libroDiario.api';
import { images } from '~/assets';
// import { getIgvsCompra } from '~/apis/compra.api';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';
// import { images } from '~/assets';
import NewEditCompra from '~/components/compra/newEditCompra';
import TablaCompras from '~/components/compra/tablaCompras';
// import { CTX_HEADER_ALMACEN } from '~/components/header/headerAlmacen';
import ElButton from '~/components/system/elButton';
import ElSelect from '~/components/system/elSelect';
// import ImgButton from '~/components/system/imgButton';
import Spinner from '~/components/system/spinner';
// import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_COMPRA = createContextId<any>('index_compra');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_COMPRA
  const definicion_CTX_INDEX_COMPRA = useStore({
    cC: [],
    miscCs: [],
    // inddd: 0,

    mostrarPanelCompra: false,
    grabo_Compra: false,
    // insert_Compra: false,
    // update_Compra: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_COMPRA, definicion_CTX_INDEX_COMPRA);
  //#endregion DEFINICION CTX_INDEX_COMPRA

  //#region CONTEXTO
  // const ctx_header_almacen = useContext(CTX_HEADER_ALMACEN);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const navegarA = useNavigate();
  const buscarCompras = useSignal(0);
  // const losPeriodos = useStore({ idPeriodo: '', periodo: '' });
  // const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const elEjercicio = useSignal(0);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
  // const elID_LD = useSignal('');
  const elAsientoCompra = Object.freeze(parametrosGlobales.asientoCompra);
  // const losIgvsCompra = useSignal([]);
  // const igvPorDefault = useStore({ idElIgv: '', elIgv: '' });

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idPeriodo: '',
    // fechaInicio: primeroDelMes(), //
    // fechaFinal: hoy(), // ultimoDelMes(),
  });

  //#endregion INICIALIZACION

  //#region ACTUALIZAR TABLA COMPRAS
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_COMPRA.grabo_Compra);
    // //console.log('GRABO COMPRA');
    if (definicion_CTX_INDEX_COMPRA.grabo_Compra) {
      //actualizar TABLA ORDENES SERVICIO
      // //console.log('actualizar TABLA ORDENES SERVICIO', defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS);
      buscarCompras.value++;
      definicion_CTX_INDEX_COMPRA.mostrarSpinner = true;
      //console.log('GRABO COMPRA in');
      definicion_CTX_INDEX_COMPRA.grabo_Compra = false;
    }
  });

  // useTask$(({ track }) => {
  //   track(() => definicion_CTX_INDEX_COMPRA.insert_Compra);
  //   //console.log('INSERT COMPRA');
  //   if (definicion_CTX_INDEX_COMPRA.insert_Compra) {
  //     //actualizar TABLA ORDENES SERVICIO
  //     // //console.log('actualizar TABLA ORDENES SERVICIO', defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS);
  //     // buscarCompras.value++;
  //     // definicion_CTX_INDEX_COMPRA.mostrarSpinner = true;
  //     //console.log('INSERT COMPRA in');
  //     definicion_CTX_INDEX_COMPRA.insert_Compra = false;
  //   }
  // });

  // useTask$(({ track }) => {
  //   track(() => definicion_CTX_INDEX_COMPRA.update_Compra);
  //   //console.log('UPDATE COMPRA');
  //   if (definicion_CTX_INDEX_COMPRA.update_Compra) {
  //     //actualizar TABLA ORDENES SERVICIO
  //     // //console.log('actualizar TABLA ORDENES SERVICIO', defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS);
  //     // buscarCompras.value++;
  //     definicion_CTX_INDEX_COMPRA.mostrarSpinner = true;
  //     //console.log('UPDATE COMPRA in');
  //     definicion_CTX_INDEX_COMPRA.update_Compra = false;
  //   }
  // });
  //#endregion ACTUALIZAR TABLA COMPRAS

  //#region OBTENER PERIODOS
  // const cargarLosPeriodos = $(async () => {
  //   const losPeri = await getPeriodos({
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     bandera: 'Compras',
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

  //#region CREAR Y DOWNLOAD TXT
  // const createAndDownloadFile = $((nameFile: string, texto: string) => {
  //   // const xmltext = '<sometag><someothertag></someothertag></sometag>';
  //   // const texto = 'hOLA A TODOS';

  //   const filename = nameFile; ///'file.xml';
  //   const pom = document.createElement('a');
  //   const bb = new Blob([texto], { type: 'text/plain' });

  //   pom.setAttribute('href', window.URL.createObjectURL(bb));
  //   // pom.setAttribute('download', filename);
  //   pom.setAttribute('download', filename + '.txt');

  //   pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
  //   pom.draggable = true;
  //   pom.classList.add('dragout');

  //   pom.click();

  //   // var stupidExample = '<?xml version="1.0" encoding="utf-8"?><aTag>something</aTag>';
  //   // // document.open('data:Application/octet-stream,' + encodeURIComponent(stupidExample));
  //   // window.open('data:application/xml,' + encodeURIComponent(stupidExample), '_self');
  //   //console.log('first txt');
  // });
  //#endregion CREAR Y DOWNLOAD TXT

  return (
    <div class="container">
      {/*  IDENTIFICACION  */}
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
      {/* <button onClick$={() => //console.log('param', parametrosGlobales)}>para</button> */}
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>Compras</u>
      </h4>

      {/*  BOTONES   className="btn"  onClick={mostrarPanelVenta}  border: ' 1px solid blue',*/}
      <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>
        <ElButton
          name="ADD COMPRA"
          title="Add compra"
          style={{ cursor: 'pointer' }}
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
              document.getElementById('se_periodo_COMPRA')?.focus();
              // ini.value++;
              return;
            }
            // if (parametrosGlobales.contabilizarOperaciones) {
            //   if (parametrosGlobales.idLibroDiario === '' || typeof parametrosGlobales.idLibroDiario === 'undefined') {
            //     const LD = await getIDLibroDiario({
            //       idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
            //       idEmpresa: parametrosGlobales.idEmpresa,
            //       ejercicio: parseInt(periodo.periodo.substring(0, 4)),
            //     });
            //     //console.log('LD.data', LD.data);
            //     if (LD.data.length === 1) {
            //       elID_LD.value = LD.data[0]._id;
            //     } else {
            //       elID_LD.value = '';
            //       alert('No se encuentra el libro diario del ejercicio' + periodo.periodo.substring(0, 4));
            //       return;
            //     }
            //   } else {
            //     elID_LD.value = parametrosGlobales.idLibroDiario;
            //     //console.log('elID_LD.value ', elID_LD.value);
            //   }
            // }

            definicion_CTX_INDEX_COMPRA.cC = [];
            definicion_CTX_INDEX_COMPRA.mostrarPanelCompra = true;
          })}
        />
        <ElSelect
          id={'se_periodo_COMPRA'}
          // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
          estilos={{ width: '114px', marginLeft: '5px' }}
          registros={losPeriodosCargados.value}
          registroID={'_id'}
          registroTEXT={'periodo'}
          seleccione={'-- Selecc. periodo --'}
          onChange={$(() => {
            // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
            const elSelec = document.getElementById('se_periodo_COMPRA') as HTMLSelectElement;
            const elIdx = elSelec.selectedIndex;
            // //console.log('?', elIdx, elSelec[elIdx].id);
            periodo.idPeriodo = elSelec[elIdx].id;
            if (periodo.idPeriodo === '') {
              periodo.periodo = '';
              elEjercicio.value = 0;
            } else {
              periodo.periodo = elSelec.value;
              elEjercicio.value = parseInt(elSelec.value.substring(0, 4));
              // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
              parametrosBusqueda.idPeriodo = periodo.idPeriodo;
              // //console.log('💨💨💨💨💨💨first', periodo);
              // //console.log('💨💨💨💨💨💨first', periodo.idPeriodo);
              buscarCompras.value++;

              definicion_CTX_INDEX_COMPRA.mostrarSpinner = true;
            }
          })}
          onKeyPress={$((e: any) => {
            if (e.key === 'Enter') {
              (document.getElementById('in_BuscarCompras_EnPeriodo') as HTMLSelectElement)?.focus();
            }
          })}
        />
        <input
          id="in_BuscarCompras_EnPeriodo"
          type="image"
          src={images.searchPLUS}
          title="Refrescar ventas"
          height={16}
          width={16}
          style={{ marginLeft: '2px' }}
          // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
          onClick$={() => {
            if (parametrosBusqueda.idPeriodo === '') {
              alert('Debe seleccionar el periodo');
              document.getElementById('se_periodo_COMPRA')?.focus();
              return;
            }

            buscarCompras.value++;
            definicion_CTX_INDEX_COMPRA.mostrarSpinner = true;
          }}
        />
        {/* <button type="button" onClick$={() => //console.log('miscCs', definicion_CTX_INDEX_COMPRA.miscCs)}>
          miscCs
        </button> */}
        {/* <input
          // id="in_BuscarDetraccion"
          type="button"
          // src={images.searchPLUS}
          value="pre PLE"
          title="PLE de compras"
          style={{ marginLeft: '16px' }}
          // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
          onClick$={() => {
            //validar PERIODO
            if (periodo.idPeriodo === '') {
              alert('Seleccione el periodo.');
              document.getElementById('se_periodo_COMPRA')?.focus();
              // ini.value++;
              return;
            }
            // //console.log('definicion_CTX_INDEX_COMPRA.miscCs', definicion_CTX_INDEX_COMPRA.miscCs);
            if (definicion_CTX_INDEX_COMPRA.miscCs.length === 0) {
              alert('El PLE del presente periodo no presenta datos para exportar.');
              document.getElementById('se_periodo_COMPRA')?.focus();
              // ini.value++;
              return;
            }
            let aExportar = '';
            definicion_CTX_INDEX_COMPRA.miscCs.map((com: any) => {
              const {
                codigoTipoDocumentoIdentidad,
                tipoDocumentoIdentidad,
                numeroIdentidad,
                razonSocialNombre,
                codigoTCP,
                descripcionTCP,
                fecha,
                serie,
                numero,
                baseImponiblePEN,
                igvPEN,
                adquisicionesNoGravadasPEN,
                iscPEN,
                icbpPEN,
                otrosPEN,
                totalPEN,
                detraccion,
                detraccionConstancia,
                detraccionFecha,
                detraccionMontoPEN,
                detraccionPorcentaje,
              } = com;

              const bI = typeof baseImponiblePEN === 'undefined' ? '' : baseImponiblePEN.$numberDecimal;
              const iGV = typeof igvPEN === 'undefined' ? '' : igvPEN.$numberDecimal;
              const adNO = typeof adquisicionesNoGravadasPEN === 'undefined' ? '' : adquisicionesNoGravadasPEN.$numberDecimal;
              const isc = typeof iscPEN === 'undefined' ? '' : iscPEN.$numberDecimal;
              const icbp = typeof icbpPEN === 'undefined' ? '' : icbpPEN.$numberDecimal;
              const otros = typeof otrosPEN === 'undefined' ? '' : otrosPEN.$numberDecimal;
              const total = typeof totalPEN === 'undefined' ? '' : totalPEN.$numberDecimal;
              const detra = typeof detraccion === 'undefined' ? '' : detraccion;
              const detraConsta = typeof detraccionConstancia === 'undefined' ? '' : detraccionConstancia;
              const detraM = typeof detraccionMontoPEN === 'undefined' ? '' : detraccionMontoPEN.$numberDecimal;
              const detraPorc = typeof detraccionPorcentaje === 'undefined' ? '' : detraccionPorcentaje.$numberDecimal;

              aExportar =
                aExportar +
                formatoDDMMYYYY_PEN(fecha) +
                '|' +
                codigoTCP +
                '|' +
                descripcionTCP +
                '|' +
                serie +
                '|' +
                numero +
                '|' +
                codigoTipoDocumentoIdentidad +
                '|' +
                tipoDocumentoIdentidad +
                '|' +
                numeroIdentidad +
                '|' +
                razonSocialNombre +
                '|' +
                bI +
                '|' +
                iGV +
                '|' +
                adNO +
                '|' +
                isc +
                '|' +
                icbp +
                '|' +
                otros +
                '|' +
                total +
                '|' +
                detra +
                '|' +
                detraConsta +
                '|' +
                formatoDDMMYYYY_PEN(detraccionFecha) +
                '|' +
                detraM +
                '|' +
                detraPorc +
                '|' +
                '\n';
            });
            // // createAndDownloadFile('elPLE' + periodo.periodo, 'Hola a todos desde el PLE');
            createAndDownloadFile('elPLE_COMPRA_' + periodo.periodo, aExportar);
          }}
        /> */}
        {/* <button onClick$={() => //console.log('parametrosGlobales', parametrosGlobales)}>paratere</button> */}
        {definicion_CTX_INDEX_COMPRA.mostrarPanelCompra && (
          <div class="modal">
            <NewEditCompra
              addPeriodo={periodo}
              compraSeleccionada={definicion_CTX_INDEX_COMPRA.cC}
              // compraSeleccionada={definicion_CTX_INDEX_COMPRA.miscCs[definicion_CTX_INDEX_COMPRA.inddd]}
              agenteRetencion={parametrosGlobales.agenteRetencion}
              ejercicio={elEjercicio.value}
              asientoC={elAsientoCompra}
              // idLD={elID_LD.value}
              // losIgvsCompra={losIgvsCompra.value}
              // igvPorDefault={igvPorDefault}
              //  ancho={600} parametrosGlobales={parametrosGlobales}
            />
          </div>
        )}
      </div>
      {/* TABLA COMPRAS */}
      <div id="ventassss" style={{ margin: '10px 0' }}>
        {buscarCompras.value > 0 ? <TablaCompras buscarCompras={buscarCompras.value} parametrosBusqueda={parametrosBusqueda} /> : ''}
      </div>
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_COMPRA.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});

{
  /*  INTERVALOS DE FECHAS  style={{ display: 'flex', margin: '10px 0' }}*/
}
{
  /*  style={{ marginRight: '1px', border: ' 1px solid blue' }}  style={{ marginRight: '10px', border: ' 1px solid red' }}*/
}
{
  /* <div class="intervalo-fechas">
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
            id="busquedaVentas"
            src={images.searchPLUS}
            alt="Icono de busqueda"
            height={16}
            width={16}
            title="Buscar ventas"
            onClick={$(async () => {
              if (parametrosBusqueda.fechaInicio > parametrosBusqueda.fechaFinal) {
                alert('Verifique las fechas de busqueda');
                document.getElementById('in_fechaDesde')?.focus();
                return;
              }
              //console.log('click en lupa: parametrosBusqueda ', parametrosBusqueda);

              buscarCompras.value++;

              definicion_CTX_INDEX_COMPRA.mostrarSpinner = true;
            })}
          />
        </div>
      </div> */
}
