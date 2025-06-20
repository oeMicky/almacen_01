import { $, component$, createContextId, useContext, useContextProvider, useStore, useTask$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_INDEX_GESTION_NOTA_VENTA_CREDITO } from '~/routes/(ventas)/gestionNotaVentaCredito';
import { cerosALaIzquierda } from '~/functions/comunes';
import CobroNotaVentaCredito from './cobroNotaVentaCredito';

export const CTX_COBROS_NOTA_VENTA_CREDITO = createContextId<any>('cobros_nota_venta_credito');
export const CTX_NOTA_VENTA_CREDITO = createContextId<any>('nota_venta_credito');

export default component$((props: { notaVenta: any }) => {
  //#region DEFINICION CTX_COBROS_NOTA_VENTA_CREDITO
  const definicion_CTX_COBROS_NOTA_VENTA_CREDITO = useStore<any>({
    GNVC: props.notaVenta.cuotas,
    // buscarGestionNotasVentasCredito: 0,
    // miscNtsVtsCred: [],
    cobroSeleccionado: [],
    grabo_cobro: false,

    mostrarPanelCobroNVCredito: false,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_COBROS_NOTA_VENTA_CREDITO, definicion_CTX_COBROS_NOTA_VENTA_CREDITO);
  //#endregion DEFINICION CTX_COBROS_NOTA_VENTA_CREDITO

  //#region DEFINICION CTX_NOTA_VENTA_CREDITO
  const definicion_CTX_NOTA_VENTA_CREDITO = useStore<any>(
    {
      _id: props.notaVenta._id ? props.notaVenta._id : '',
      cuotas: props.notaVenta.cuotas ? props.notaVenta.cuotas : [],
    },
    { deep: true }
  );
  useContextProvider(CTX_NOTA_VENTA_CREDITO, definicion_CTX_NOTA_VENTA_CREDITO);
  //#endregion DEFINICION CTX_NOTA_VENTA_CREDITO

  //#region CONTEXTOS
  const ctx = useContext(CTX_INDEX_GESTION_NOTA_VENTA_CREDITO);
  //#endregion CONTEXTOS

  //#region INICIALIZANDO
  let suma_TOTAL_IMPORTE_PEN = 0;
  //#endregion INICIALIZANDO

  //#region EDITAR CUOTA
  useTask$(({ track }) => {
    track(() => definicion_CTX_COBROS_NOTA_VENTA_CREDITO.grabo_cobro);

    if (definicion_CTX_COBROS_NOTA_VENTA_CREDITO.grabo_cobro) {
      const aMODIFICAR: any = props.notaVenta.cuotas.filter(
        (cuota: any) => cuota.idAuxiliar === definicion_CTX_COBROS_NOTA_VENTA_CREDITO.cobroSeleccionado.idAuxiliar
      );
      aMODIFICAR[0].fechaCobro = definicion_CTX_COBROS_NOTA_VENTA_CREDITO.cobroSeleccionado.fechaCobro;
      aMODIFICAR[0].importeCobroPEN = definicion_CTX_COBROS_NOTA_VENTA_CREDITO.cobroSeleccionado.importeCobroPEN;

      definicion_CTX_COBROS_NOTA_VENTA_CREDITO.grabo_cobro = false;
      // ctx.mostrarPanelCobrosNVCredito = false;
      // ctx.mostrarPanelCobrosNVCredito = false;
    }
  });
  //#endregion EDITAR CUOTA

  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 420px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          title="Cerrar el formulario"
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          onClick={$(() => {
            ctx.mostrarPanelCobrosNVCredito = false;
          })}
          //   onKeyUp={$((e: any) => {
          //     if (e.key === 'Escape') {
          //       alert('Escape presionado: Cerrar el formulario');
          //     }
          //   })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Cobros N.Venta Crédito</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        <div class="linea_1_11" style={{ marginBottom: '8px' }}>
          <label>{props.notaVenta.serie + ' - ' + cerosALaIzquierda(props.notaVenta.numero, 8)}</label>
          <label>
            {props.notaVenta.moneda === 'PEN'
              ? parseFloat(props.notaVenta.totalPEN.$numberDecimal).toLocaleString('en-PE', {
                  // style: 'currency',
                  currency: 'PEN',
                  minimumFractionDigits: 2,
                }) + ' PEN'
              : parseFloat(props.notaVenta.totalUSD.$numberDecimal).toLocaleString('en-US', {
                  // style: 'currency',
                  currency: 'PEN',
                  minimumFractionDigits: 2,
                }) + ' USD'}
          </label>
        </div>
        <div class="linea_1_11">
          <label style={{ color: 'purple', fontWeight: 'bold' }}>Crédito</label>
          <label style={{ color: 'purple', fontWeight: 'bold' }}>
            {parseFloat(props.notaVenta.importeTotalCuotasCredito.$numberDecimal) === 0
              ? '-'
              : parseFloat(props.notaVenta.importeTotalCuotasCredito.$numberDecimal).toLocaleString('en-PE', {
                  // style: 'currency',
                  currency: 'PEN',
                  minimumFractionDigits: 2,
                }) + ' PEN'}
          </label>
        </div>

        <br />
        <button
          style={{ cursor: 'pointer', borderRadius: '4px', border: '1px solid black', height: '40px' }}
          class="btn"
          onClick$={() => {
            definicion_CTX_COBROS_NOTA_VENTA_CREDITO.cobroSeleccionado = [];
            definicion_CTX_COBROS_NOTA_VENTA_CREDITO.mostrarPanelCobroNVCredito = true;
          }}
        >
          ADD COBRO
        </button>
        <br />
        {/*  -- TABLA COUTAS -- */}
        {typeof definicion_CTX_NOTA_VENTA_CREDITO.cuotas != 'undefined' && definicion_CTX_NOTA_VENTA_CREDITO.cuotas.length > 0 ? (
          <>
            <table class="tabla-venta" style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Fecha</th>
                  <th>Cuota</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {definicion_CTX_NOTA_VENTA_CREDITO.cuotas.map((cuota: any, index: any) => {
                  const indexItem = index + 1;

                  let tot = 0;

                  tot = cuota.importeCobroPEN.$numberDecimal ? cuota.importeCobroPEN.$numberDecimal : cuota.importeCobroPEN;

                  suma_TOTAL_IMPORTE_PEN = suma_TOTAL_IMPORTE_PEN + Number(tot);

                  return (
                    <tr key={index}>
                      <td data-label="Item">{cerosALaIzquierda(indexItem, 3)}</td>
                      <td data-label="Fecha">
                        {cuota.fechaCobro.substring(8, 10) + '/' + cuota.fechaCobro.substring(5, 7) + '/' + cuota.fechaCobro.substring(0, 4)}

                        {/* {cuota.fechaCobro.substring(0, 2) + '/' + cuota.fechaCobro.substring(3, 5) + '/' + cuota.fechaCobro.substring(6, 10)} */}
                      </td>
                      <td data-label="Importe" class="comoNumeroLeft">
                        {parseFloat(cuota.importeCobroPEN.$numberDecimal ? cuota.importeCobroPEN.$numberDecimal : cuota.importeCobroPEN).toLocaleString(
                          'en-PE',
                          {
                            // style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          }
                        )}
                      </td>
                      <td data-label="Acciones" class="accionesLeft">
                        <input
                          type="image"
                          src={images.edit}
                          title="Editar cobro"
                          height={14}
                          width={14}
                          onClick$={() => {
                            definicion_CTX_COBROS_NOTA_VENTA_CREDITO.cobroSeleccionado = cuota;
                            definicion_CTX_COBROS_NOTA_VENTA_CREDITO.mostrarPanelCobroNVCredito = true;
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} class="comoNumero" style={{ color: '#2E1800' }}>
                    TOTALES PEN
                  </td>
                  <td class="comoNumero" style={{ color: '#2E1800' }}>
                    {/* {suma_TOTAL_IMPORTE_PEN} */}
                    {`${suma_TOTAL_IMPORTE_PEN.toLocaleString('en-PE', {
                      // style: 'currency',
                      currency: 'PEN',
                      minimumFractionDigits: 2,
                    })}`}
                  </td>
                  <td class="comoCadena" style={{ color: '#2E1800' }}></td>
                </tr>
              </tfoot>
            </table>
          </>
        ) : (
          <div>
            <i style={{ fontSize: '0.8rem', color: 'red' }}>No se encontraron registros</i>
          </div>
        )}
        <br />
        {/* REGISTRAR */}
        <input
          id="btn_Registrar_Cobros"
          type="button"
          value="Grabar COBROS"
          style={{ cursor: 'pointer', height: '40px' }}
          class="btn-centro"
          onClick$={() => {}}
        />
      </div>
      {/* COBROS NV CREDITO */}
      {definicion_CTX_COBROS_NOTA_VENTA_CREDITO.mostrarPanelCobroNVCredito && (
        <div class="modal">
          <CobroNotaVentaCredito
            cobroSeleccionado={definicion_CTX_COBROS_NOTA_VENTA_CREDITO.cobroSeleccionado}
            // notaVenta={definicion_CTX_INDEX_GESTION_NOTA_VENTA_CREDITO.GNVC}
            // mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM}
          />
        </div>
      )}
    </div>
  );
});
