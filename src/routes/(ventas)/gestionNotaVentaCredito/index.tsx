import { component$, createContextId, useContextProvider, useSignal, useStore } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { images } from '~/assets';
import CobrosNotaVentaCredito from '~/components/gestionNotaVentaCredito/cobrosNotaVentaCredito';
import EditClienteObservacionCredito from '~/components/gestionNotaVentaCredito/editClienteObservacionCredito';
import TablaGestionNotaVentaCredito from '~/components/gestionNotaVentaCredito/tablaGestionNotaVentaCredito';
// import AddNotaVenta from '~/components/notaVenta/addNotaVenta';
import VerNotaVenta from '~/components/notaVenta/verNotaVenta';
import { hoy, primeroDelMes } from '~/functions/comunes';
import { parametrosGlobales } from '~/routes/login';

export const CTX_INDEX_GESTION_NOTA_VENTA_CREDITO = createContextId<any>('index_gestion_nota_venta_credito');

export default component$(() => {
  //#region DEFINICION CTX_INDEX_GESTION_NOTA_VENTA_CREDITO
  const definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO = useStore({
    GNVC: [],
    buscarGestionNotasVentasCredito: 0,
    miscNtsVtsCred: [],

    mostrarPanelCobrosNVCredito: false,
    grabo_cobros: false,

    mostrarPanelNotaVenta: false,

    mostrarPanelVerNotaVenta: false,

    mostrarPanelEditarClienteObservacion: false,

    // mostrarPanelPrueba: false,
    // prueb: { idAuxiliar: 123, codigo: 'cod', descripcion: 'des' },

    // mostrarPanelNotaVenta: false,
    // grabo_NotaVenta: false,

    // mostrarPanelVenta: false,
    // grabo_Venta: false,
    // notaVentaENVIADA: { idNotaVenta: '', serieNotaVenta: '', numeroNotaVenta: 0, igv: 0, detalle: [], addPeriodo: [], addPeriodoAnterior: [] },

    mostrarSpinner: false,
    // mostrarSpinner: parametrosGlobales.mostrarSpinner, //false,
    // darDeBajaID: '',
    // darDeBajaRUC: '',
    // darDeBajaEMPRESA: '',
    // darDeBajaFECHA: '',
    // darDeBajaFECHA_DOCUMENTO: '',
    // darDeBajaTIPO: '',
    // darDeBajaSERIE: '',
    // darDeBajaNUMERO: '',
    // darDeBajaCLIENTE: '',
    // darDeBajaMOTIVO: '',
    // darDeBajaFacturaJSON: false,
    // darDeBajaFacturaXML: false,
    // siDarDeBajaID: '',
    // mostrarPanelDarDeBajaDocumentoVenta: false,
  });
  useContextProvider(CTX_INDEX_GESTION_NOTA_VENTA_CREDITO, definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO);
  //#endregion DEFINICION CTX_INDEX_NOTA_VENTA

  //#region INICIALIZAR
  const navegarA = useNavigate();
  // const mostrarSpinner = useSignal(false);
  const buscarPor = useSignal(true);
  const fechas = useStore({
    desde: primeroDelMes(),
    hasta: hoy(),
  });
  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idSucursal: parametrosGlobales.idSucursal,
    desde: fechas.desde,
    hasta: fechas.hasta,
    buscarPor: 'Cliente / Sobrenombre / Chapa', //por.value,
    cadenaABuscar: '', // 'geo', //'bien' 'acce 5', //cadena.value,
  });

  //#endregion INICIALIZAR

  return (
    <div class="container">
      {/*  IDENTIFICACION  style={{ border: '3px pink solid' }}*/}
      <div style={{ background: '#00778F' }}>
        <label style={{ color: 'white', fontWeight: 'bold', fontSize: '0.7rem', paddingLeft: '2px' }}>
          {` ${parametrosGlobales.RUC} - ${parametrosGlobales.RazonSocial} - Sucursal: ${parametrosGlobales.sucursal} - Usuario: ${parametrosGlobales.usuario}`}
        </label>
      </div>

      <h4 style={{ margin: '8px 0 8px 2px' }}>
        <u>Gestión Nota de Venta a Crédito</u>
      </h4>

      {/*  BOTONES   */}
      {/* <div style={{ marginBottom: '10px', paddingLeft: '3px' }}>   width: '464px',*/}
      <div>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <input
            id="Desde"
            type="radio"
            value="Desde"
            name="Contado"
            checked={buscarPor.value}
            // onChange$={(e) => {
            //   definicion_CTX_NOTA_VENTA.todoEnEfectivo = (e.target as HTMLInputElement).checked;
            //   definicion_CTX_NOTA_VENTA.unaParteEnEfectivo = !definicion_CTX_NOTA_VENTA.todoEnEfectivo;
            // }}
          />
          <label for="Desde">Desde</label>
          <input
            type="date"
            id="fechaDesdeBusqueda"
            value={fechas.desde}
            style={{ width: '151px', marginLeft: '6px' }}
            onInput$={(e) => {
              fechas.desde = (e.target as HTMLInputElement).value;
            }}
          />
          {/* class="fechas" style={{ width: '174px', display: 'flex', justifyContent: 'space-between', marginLeft: '10px' }}*/}
          <label for="Desde" style={{ marginLeft: '12px', marginRight: '6px' }}>
            Hasta
          </label>
          <input
            type="date"
            id="fechaHastaBusqueda"
            value={fechas.hasta}
            style={{ width: '151px' }}
            onInput$={(e) => {
              fechas.hasta = (e.target as HTMLInputElement).value;
            }}
          />
          <input
            title="Buscar notas venta"
            type="image"
            // tabIndex={2}
            alt="icon busqueda"
            src={images.searchPLUS}
            height={21.5}
            width={21.5}
            style={{ marginLeft: '6px' }}
            onClick$={() => {
              if (parametrosGlobales.idGrupoEmpresarial === '') {
                // console.log('estaVACIA');
                alert('Faltan datos... vuelva a logearse..');
                navegarA('/login');
                return;
              }
              buscarPor.value = true;
              // console.log('fechas', buscarPor.value);

              definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.buscarGestionNotasVentasCredito++;

              definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.mostrarSpinner = true;

              //   // definicion_CTX_INDEX_NOTA_VENTA.buscarNotasVentas++;

              //   // definicion_CTX_INDEX_NOTA_VENTA.mostrarSpinner = true;
            }}
          />
        </div>
        <div style={{ display: 'flex', marginBottom: '8px' }}>
          <input
            id="Por"
            type="radio"
            value="Por"
            name="Contado"
            checked={!buscarPor.value}
            // onChange$={(e) => {
            //   definicion_CTX_NOTA_VENTA.unaParteEnEfectivo = (e.target as HTMLInputElement).checked;
            //   definicion_CTX_NOTA_VENTA.todoEnEfectivo = !definicion_CTX_NOTA_VENTA.unaParteEnEfectivo;
            //   if (definicion_CTX_NOTA_VENTA.unaParteEnEfectivo) {
            //     (document.getElementById('inputMontoEnEfectivo') as HTMLInputElement).focus();
            //   }
            // }}
          />
          <label for="Por" style={{ marginRight: '6px' }}>
            Por
          </label>
          <select
            style={{ marginRight: '6px' }}
            disabled
            onChange$={() => {
              buscarPor.value = false;
              document.getElementById('inputBuscarPor')?.focus();

              // (buscarPor.value = (e.target as HTMLSelectElement).value)
            }}
          >
            <option value="Cliente / Sobrenombre / Chapa">Cliente / Sobrenombre / Chapa</option>
            <option value="Placa">Placa</option>
          </select>
          <input
            type="text"
            id="inputBuscarPor"
            value={parametrosBusqueda.cadenaABuscar}
            placeholder="Buscar por..."
            // style={{ marginLeft: '6px', top: '0px', width: '95px' }}
            onFocusin$={(e) => (e.target as HTMLInputElement).select()}
            onInput$={(e) => {
              parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
            }}
            onKeyPress$={(e) => {
              if (e.key === 'Enter') {
                // console.log('parametrosBusqueda.cadenaABuscar', parametrosBusqueda.cadenaABuscar);
                if (parametrosGlobales.idGrupoEmpresarial === '') {
                  // console.log('estaVACIA');
                  alert('Faltan datos... vuelva a logearse..');
                  navegarA('/login');
                  return;
                }
                buscarPor.value = false;
                if (parametrosBusqueda.cadenaABuscar.trim() === '') {
                  // console.log('estaVACIA');
                  alert('Ingrese el nombre del cliente / sobrenombre / chapa.');
                  document.getElementById('inputBuscarPor')?.focus();
                  return;
                }
                definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.buscarGestionNotasVentasCredito++;

                definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.mostrarSpinner = true;
              }
            }}
          />
          <input
            title="Buscar notas venta"
            type="image"
            // tabIndex={2}
            alt="icon busqueda"
            src={images.searchPLUS}
            height={21.5}
            width={21.5}
            style={{ marginLeft: '6px' }}
            onClick$={() => {
              if (parametrosGlobales.idGrupoEmpresarial === '') {
                // console.log('estaVACIA');
                alert('Faltan datos... vuelva a logearse..');
                navegarA('/login');
                return;
              }
              buscarPor.value = false;
              if (parametrosBusqueda.cadenaABuscar.trim() === '') {
                // console.log('estaVACIA');
                alert('Ingrese el nombre del cliente / sobrenombre / chapa.');
                document.getElementById('inputBuscarPor')?.focus();
                return;
              }
              definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.buscarGestionNotasVentasCredito++;

              definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.mostrarSpinner = true;
              // console.log('gdfg jgfhfg d hgfd', buscarPor.value);
              // definicion_CTX_INDEX_NOTA_VENTA.buscarNotasVentas++;

              // definicion_CTX_INDEX_NOTA_VENTA.mostrarSpinner = true;
            }}
          />
        </div>
      </div>
      {/* TABLA NOTA DE VENTAS */}
      <div id="ventassss" style={{ margin: '8px 0' }}>
        {definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.buscarGestionNotasVentasCredito > 0 ? (
          <TablaGestionNotaVentaCredito
            // buscarVentas={buscarVentas.value}
            parametrosBusqueda={parametrosBusqueda}
            buscarPorFechaConceptos={buscarPor.value}
            // periodosCargados={losPeriodosCargados.value}
            // facturacionElectronica={parametrosGlobales.facturacionElectronica}
          />
        ) : (
          ''
        )}
      </div>
      {/* COBROS NV CREDITO */}
      {definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.mostrarPanelCobrosNVCredito && (
        <div class="modal">
          <CobrosNotaVentaCredito
            notaVenta={definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.GNVC}
            // mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM}
            // elKardex={definicion_CTX_BUSCAR_MERCADERIA_IN.kK}
            // elIDKardex={''}
            // elUbigeoStock={[]}
            // esAlmacen={true}
            // enDolares={props.enDolares}
            // tipoCambio={props.tipoCambio}
            // contextoBase={'buscar_mercaderia_in'}
            // contextoInmediato={'buscar_mercaderia_in'}
            // contextoParaDocumento={props.contexto}
            // igv={props.igv}
            // motivo={props.motivo}
            // conIGV={props.conIGV}
            // porMontoUnitario={props.porMontoUnitario}
          />
        </div>
      )}
      {definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.mostrarPanelVerNotaVenta && (
        <div class="modal">
          <VerNotaVenta nvSelecci={definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.GNVC} contexto="index_gestion_nota_venta_credito" />
        </div>
      )}
      {definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.mostrarPanelEditarClienteObservacion && (
        <div class="modal">
          <EditClienteObservacionCredito nvSelec={definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.GNVC} />
        </div>
      )}

      {/* MOSTRAR SPINNER */}
      {/* {definicion_CTX_INDEX_NOTA_VENTA.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )} */}
    </div>
  );
});
