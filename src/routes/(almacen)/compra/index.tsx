import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
// import { getIgvsCompra } from '~/apis/compra.api';
// import { getPeriodos } from '~/apis/grupoEmpresarial.api';
// import { images } from '~/assets';
import NewEditCompra from '~/components/compra/newEditCompra';
import TablaCompras from '~/components/compra/tablaCompras';
import ElButton from '~/components/system/elButton';
import ElSelect from '~/components/system/elSelect';
// import ImgButton from '~/components/system/imgButton';
import Spinner from '~/components/system/spinner';
import { formatoDDMMYYYY_PEN } from '~/functions/comunes';
// import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_COMPRA = createContextId<any>('index_compra');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_COMPRA
  const definicion_CTX_INDEX_COMPRA = useStore({
    cC: [],
    miscCs: [],

    mostrarPanelCompra: false,
    grabo_Compra: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_COMPRA, definicion_CTX_INDEX_COMPRA);
  //#endregion DEFINICION CTX_INDEX_COMPRA

  //#region INICIALIZACION
  // const ini = useSignal(0);
  const buscarCompras = useSignal(0);
  // const losPeriodos = useStore({ idPeriodo: '', periodo: '' });
  // const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
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
    if (definicion_CTX_INDEX_COMPRA.grabo_Compra) {
      //actualizar TABLA ORDENES SERVICIO
      // console.log('actualizar TABLA ORDENES SERVICIO', defini_CTX_DOCS_ORDEN_SERVICIO.actualizoOS);
      buscarCompras.value++;
      definicion_CTX_INDEX_COMPRA.grabo_Compra = false;
    }
  });
  //#endregion ACTUALIZAR TABLA COMPRAS

  //#region OBTENER PERIODOS
  // const cargarLosPeriodos = $(async () => {
  //   const losPeri = await getPeriodos({
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     bandera: 'Compras',
  //   });
  //   console.log('losPeri', losPeri);
  //   losPeriodosCargados.value = losPeri.data;
  //   console.log(' losPeriodosCargados.value', losPeriodosCargados.value);
  //   // console.log('a cargar periodos');
  // });

  // useTask$(({ track }) => {
  //   track(() => ini.value);

  //   cargarLosPeriodos();
  // });
  //#endregion OBTENER PERIODOS

  //#region CREAR Y DOWNLOAD TXT
  const createAndDownloadFile = $((nameFile: string, texto: string) => {
    // const xmltext = '<sometag><someothertag></someothertag></sometag>';
    // const texto = 'hOLA A TODOS';

    const filename = nameFile; ///'file.xml';
    const pom = document.createElement('a');
    const bb = new Blob([texto], { type: 'text/plain' });

    pom.setAttribute('href', window.URL.createObjectURL(bb));
    // pom.setAttribute('download', filename);
    pom.setAttribute('download', filename + '.txt');

    pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
    pom.draggable = true;
    pom.classList.add('dragout');

    pom.click();

    // var stupidExample = '<?xml version="1.0" encoding="utf-8"?><aTag>something</aTag>';
    // // document.open('data:Application/octet-stream,' + encodeURIComponent(stupidExample));
    // window.open('data:application/xml,' + encodeURIComponent(stupidExample), '_self');
    console.log('first txt');
  });
  //#endregion CREAR Y DOWNLOAD TXT

  return (
    <div class="container">
      {/*  IDENTIFICACION  */}
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
        {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
      </h1> */}
      <div style={{ background: '#00778F' }}>
        <label style={{ color: '#ccc', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {` ${sessionStorage.getItem('numeroIdentidad')} - ${sessionStorage
            .getItem('empresa')
            ?.toLocaleUpperCase()} - Sucursal: ${sessionStorage.getItem('sucursal')} - Usuario: ${sessionStorage.getItem(
            'usuario'
          )}`}
        </label>
      </div>
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>Compras</u>
      </h4>

      {/*  INTERVALOS DE FECHAS  style={{ display: 'flex', margin: '10px 0' }}*/}
      {/*  style={{ marginRight: '1px', border: ' 1px solid blue' }}  style={{ marginRight: '10px', border: ' 1px solid red' }}*/}
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
              console.log('click en lupa: parametrosBusqueda ', parametrosBusqueda);

              buscarCompras.value++;

              definicion_CTX_INDEX_COMPRA.mostrarSpinner = true;
            })}
          />
        </div>
      </div> */}
      {/*  BOTONES   className="btn"  onClick={mostrarPanelVenta}  border: ' 1px solid blue',*/}
      <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>
        <ElButton
          name="ADD COMPRA"
          title="Add compra"
          onClick={$(async () => {
            //validar PERIODO
            if (periodo.idPeriodo === '') {
              alert('Seleccione el periodo.');
              document.getElementById('se_periodo')?.focus();
              // ini.value++;
              return;
            }

            definicion_CTX_INDEX_COMPRA.cC = [];
            definicion_CTX_INDEX_COMPRA.mostrarPanelCompra = true;
          })}
        />
        <ElSelect
          id={'se_periodo'}
          // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
          estilos={{ width: '168px', marginLeft: '5px' }}
          registros={losPeriodosCargados.value}
          registroID={'_id'}
          registroTEXT={'periodo'}
          seleccione={'-- Seleccione periodo --'}
          onChange={$(() => {
            console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
            const elSelec = document.getElementById('se_periodo') as HTMLSelectElement;
            const elIdx = elSelec.selectedIndex;
            console.log('?', elIdx, elSelec[elIdx].id);
            periodo.idPeriodo = elSelec[elIdx].id;
            if (periodo.idPeriodo === '') {
              periodo.periodo = '';
            } else {
              periodo.periodo = elSelec.value;
              // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
              parametrosBusqueda.idPeriodo = periodo.idPeriodo;
              // console.log('💨💨💨💨💨💨first', periodo);
              // console.log('💨💨💨💨💨💨first', periodo.idPeriodo);
              buscarCompras.value++;

              definicion_CTX_INDEX_COMPRA.mostrarSpinner = true;
            }
          })}
          onKeyPress={$((e: any) => {
            if (e.key === 'Enter') {
              (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
            }
          })}
        />
        <ElButton
          name="PLE"
          title="Descargar PLE"
          estilos={{ marginLeft: '4px' }}
          onClick={$(async () => {
            //validar PERIODO
            if (periodo.idPeriodo === '') {
              alert('Seleccione el periodo.');
              document.getElementById('se_periodo')?.focus();
              // ini.value++;
              return;
            }
            // console.log('definicion_CTX_INDEX_COMPRA.miscCs', definicion_CTX_INDEX_COMPRA.miscCs);
            if (definicion_CTX_INDEX_COMPRA.miscCs.length === 0) {
              alert('El PLE del presente periodo no presenta datos para exportar.');
              document.getElementById('se_periodo')?.focus();
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
            createAndDownloadFile('elPLE' + periodo.periodo, aExportar);
          })}
        />
        {/* <button onClick$={() => console.log('parametrosGlobales', parametrosGlobales)}>paratere</button> */}
        {definicion_CTX_INDEX_COMPRA.mostrarPanelCompra && (
          <div class="modal">
            <NewEditCompra
              addPeriodo={periodo}
              compraSeleccionada={definicion_CTX_INDEX_COMPRA.cC}
              agenteRetencion={parametrosGlobales.agenteRetencion}
              // losIgvsCompra={losIgvsCompra.value}
              // igvPorDefault={igvPorDefault}
              //  ancho={600} parametrosGlobales={parametrosGlobales}
            />
          </div>
        )}
      </div>
      {/* TABLA VENTAS */}
      <div id="ventassss" style={{ margin: '10px 0' }}>
        {buscarCompras.value > 0 ? (
          <TablaCompras buscarCompras={buscarCompras.value} parametrosBusqueda={parametrosBusqueda} />
        ) : (
          ''
        )}
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
