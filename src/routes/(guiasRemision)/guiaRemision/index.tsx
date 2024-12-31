import { $, component$, createContextId, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { images } from '~/assets';
import NewEditGuiaRemision from '~/components/guiaRemision/newEditGuiaRemision';
import TablaGuiasRemision from '~/components/guiaRemision/tablaGuiasRemision';
import ElButton from '~/components/system/elButton';
import ElSelect from '~/components/system/elSelect';
import Spinner from '~/components/system/spinner';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_GUIA_REMISION = createContextId<any>('__guia_remision');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_GUIA_REMISION
  const definicion_CTX_INDEX_GUIA_REMISION = useStore({
    buscarGuiasRemision: 0,
    gG: [],

    mostrarPanelGuiaRemision: false,
    grabo_GuiaRemision: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_INDEX_GUIA_REMISION, definicion_CTX_INDEX_GUIA_REMISION);
  //#endregion DEFINICION CTX_INDEX_GUIA_REMISION

  //#region INICIALIZACION
  const navegarA = useNavigate();
  // const ini = useSignal(0);
  // const buscarGuiasRemision = useSignal(0);

  const losPeriodosCargados = useSignal(parametrosGlobales.periodos);
  const periodo = useStore({ idPeriodo: '', periodo: '' });

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idPeriodo: '',
  });
  //#endregion INICIALIZACION

  //#region GRABO GUIA REMISION
  useTask$(({ track }) => {
    track(() => definicion_CTX_INDEX_GUIA_REMISION.grabo_GuiaRemision);

    if (definicion_CTX_INDEX_GUIA_REMISION.grabo_GuiaRemision) {
      definicion_CTX_INDEX_GUIA_REMISION.buscarGuiasRemision++;
      definicion_CTX_INDEX_GUIA_REMISION.grabo_GuiaRemision = false;
    }
  });
  //#endregion GRABO GUIA REMISION

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
      <h4 style={{ margin: '8px 0 4px 2px' }}>
        <u>Guía de Remisión</u>
      </h4>
      {/*  BOTONES   */}
      <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>
        <ElButton
          name="ADD G.R."
          title="Add Guía remisión"
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
              document.getElementById('se_periodo_GR')?.focus();
              // ini.value++;
              return;
            }

            definicion_CTX_INDEX_GUIA_REMISION.gG = [];
            definicion_CTX_INDEX_GUIA_REMISION.mostrarPanelGuiaRemision = true;
          })}
        />
        <ElSelect
          id="se_periodo_GR"
          // valorSeleccionado={definicion_CTX_COMPRA.documentoCompra}
          estilos={{ width: '114px', marginLeft: '5px' }}
          registros={losPeriodosCargados.value}
          registroID={'_id'}
          registroTEXT={'periodo'}
          seleccione={'-- Selecc. periodo --'}
          onChange={$(() => {
            // //console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
            const elSelec = document.getElementById('se_periodo_GR') as HTMLSelectElement;
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
              definicion_CTX_INDEX_GUIA_REMISION.buscarGuiasRemision++;

              definicion_CTX_INDEX_GUIA_REMISION.mostrarSpinner = true;
            }
          })}
          onKeyPress={$((e: any) => {
            if (e.key === 'Enter') {
              (document.getElementById('in_BuscarGR_EnPeriodo') as HTMLSelectElement)?.focus();
            }
          })}
        />
        <input
          id="in_BuscarGR_EnPeriodo"
          type="image"
          src={images.searchPLUS}
          title="Refrescar guias de remisión"
          height={16}
          width={16}
          style={{ marginLeft: '2px', marginTop: '2px' }}
          // style={{ margin: '2px' }}

          onClick$={() => {
            if (parametrosBusqueda.idPeriodo === '') {
              alert('Debe seleccionar el periodo');
              document.getElementById('se_periodo_GR')?.focus();
              return;
            }

            definicion_CTX_INDEX_GUIA_REMISION.buscarGuiasRemision++;
            definicion_CTX_INDEX_GUIA_REMISION.mostrarSpinner = true;
          }}
        />

        {/* <button onClick$={() => //console.log('parametrosGlobales', parametrosGlobales)}>paratere</button> */}
        {definicion_CTX_INDEX_GUIA_REMISION.mostrarPanelGuiaRemision && (
          <div class="modal">
            <NewEditGuiaRemision
              addPeriodo={periodo}
              guiaRemisionSeleccionada={definicion_CTX_INDEX_GUIA_REMISION.gG}
              //   agenteRetencion={parametrosGlobales.agenteRetencion}
            />
          </div>
        )}
      </div>
      {/* TABLA VENTAS */}
      <div id="ventassss" style={{ margin: '10px 0' }}>
        {definicion_CTX_INDEX_GUIA_REMISION.buscarGuiasRemision > 0 ? (
          <TablaGuiasRemision buscarGuiasRemision={definicion_CTX_INDEX_GUIA_REMISION.buscarGuiasRemision} parametrosBusqueda={parametrosBusqueda} />
        ) : (
          ''
        )}
      </div>
      {/* MOSTRAR SPINNER */}
      {definicion_CTX_INDEX_GUIA_REMISION.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
