import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { getIgvsCompra } from '~/apis/compra.api';
import { getPeriodos } from '~/apis/grupoEmpresarial.api';
import { images } from '~/assets';
import NewEditCompra from '~/components/compra/newEditCompra';
import TablaCompras from '~/components/compra/tablaCompras';
import ElButton from '~/components/system/elButton';
import ElSelect from '~/components/system/elSelect';
import ImgButton from '~/components/system/imgButton';
import { hoy, ultimoDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_COMPRA = createContextId<any>('index_compra');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_COMPRA
  const definicion_CTX_INDEX_COMPRA = useStore({
    mostrarPanelCompra: false,
    grabo_Compra: false,
  });
  useContextProvider(CTX_INDEX_COMPRA, definicion_CTX_INDEX_COMPRA);
  //#endregion DEFINICION CTX_INDEX_COMPRA

  //#region INICIALIZACION
  const ini = useSignal(0);
  const buscarCompras = useSignal(0);
  // const losPeriodos = useStore({ idPeriodo: '', periodo: '' });
  // const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const losPeriodosCargados = useSignal([]);
  const periodo = useStore({ idPeriodo: '', periodo: '' });
  const losIgvsCompra = useSignal([]);
  const igvPorDefault = useStore({ idElIgv: '', elIgv: '' });

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    fechaInicio: hoy(),
    fechaFinal: ultimoDelMes(),
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
  const cargarLosPeriodos = $(async () => {
    const losPeri = await getPeriodos({
      idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: parametrosGlobales.idEmpresa,
      bandera: 'Compras',
    });
    console.log('losPeri', losPeri);
    losPeriodosCargados.value = losPeri.data;
    console.log(' losPeriodosCargados.value', losPeriodosCargados.value);
    // console.log('a cargar periodos');
  });

  useTask$(({ track }) => {
    track(() => ini.value);

    cargarLosPeriodos();
  });
  //#endregion OBTENER PERIODOS

  return (
    <div class="container">
      {/*  TITULO  */}
      {/* <h1 style={{ color: 'grey', fontWeight: 'light', fontSize: '0.7rem' }}>
        {`${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial}`}
      </h1> */}
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
        <u>Compras</u>
      </h3>
      {/*  INTERVALOS DE FECHAS  style={{ display: 'flex', margin: '10px 0' }}*/}
      {/*  style={{ marginRight: '1px', border: ' 1px solid blue' }}  style={{ marginRight: '10px', border: ' 1px solid red' }}*/}
      <div class="intervalo-fechas">
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
            })}
          />
        </div>
      </div>
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
              ini.value++;
              return;
            }
            // obteniendo IGVs de COMPRA
            let elIgv = await getIgvsCompra({
              idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
              idEmpresa: parametrosGlobales.idEmpresa,
            });
            elIgv = elIgv.data;
            console.log('elIgv', elIgv);
            losIgvsCompra.value = elIgv;
            const tre = elIgv.filter((docs: any) => docs.default === true);
            console.log('tre', tre);
            (igvPorDefault.idElIgv = tre[0]._id), (igvPorDefault.elIgv = tre[0].igv), console.log('igvPorDefault', igvPorDefault);
            // igv.value = elIgv[0].igv; //18; //elIgv[0].igv; //
            // console.log('igv.value::', igv.value);
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
            }
          })}
          onKeyPress={$((e: any) => {
            if (e.key === 'Enter') {
              (document.getElementById('in_Fecha_MICE') as HTMLSelectElement)?.focus();
            }
          })}
        />
        {/* <button
          onClick$={() => console.log('parametrosGlobales.periodos Compras - ini.value', parametrosGlobales.periodos, ini.value)}
        >
          los
        </button> */}
        {definicion_CTX_INDEX_COMPRA.mostrarPanelCompra && (
          <div class="modal">
            <NewEditCompra
              addPeriodo={periodo}
              compraSeleccionada={[]}
              losIgvsCompra={losIgvsCompra.value}
              igvPorDefault={igvPorDefault}
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
    </div>
  );
});
