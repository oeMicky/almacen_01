import { $, component$, createContextId, useContext, useContextProvider, useSignal, useStore, useTask$ } from '@builder.io/qwik';
import { getOrdenProduccion } from '~/apis/ordenProduccion.api';
import { images } from '~/assets';
import { CTX_NEW_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ImgButton from '~/components/system/imgButton';
// import NewEditMercaderiaIN from "../mercaderiaIN/newEditMercaderiaIN";
import { formatear_6Decimales, redondeo4Decimales } from '~/functions/comunes';
import NewEditMercaderiaIN from '../mercaderiaIN/newEditMercaderiaIN';
import Spinner from '~/components/system/spinner';
import TablaMercaderiasIN from '../mercaderiaIN/tablaMercaderiasIN';
import { parametrosGlobales } from '~/routes/login';
import MercaderiaINSeleccionada from '../mercaderiaIN/mercaderiaINSeleccionada';

export const CTX_REGISTRO_PRODUCTOS_TERMINADOS = createContextId<any>('__registro_productos_terminados');

export default component$((props: { opSeleccionada: any; motivo: string; igv: number }) => {
  //#region DEFINICION CTX_REGISTRO_PRODUCTOS_TERMINADOS
  const definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS = useStore({
    mM: [],
    kK: [],

    mostrarPanelNewEditMercaderiaIN: false,
    abuscar: '',
    grabo_mercaderiaIN: false,

    mostrarPanelKardexsIN: false,

    mostrarPanelMercaderiaINSeleccionada: false,
    // mostrarPanelAsignarPrecio: false,
    mostrarSpinner: false,
  });
  useContextProvider(CTX_REGISTRO_PRODUCTOS_TERMINADOS, definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS);
  //#endregion DEFINICION CTX_BUSCAR_MERCADERIA_IN

  //#region CONTEXTO
  const ctx = useContext(CTX_NEW_IN_ALMACEN);
  //#endregion CONTEXTO

  //#region INICIALIZACION
  const ini = useSignal(0);
  const laOP: any = useSignal([]);
  const suministrosDespachados = useSignal<any>([]);

  const buscarMercaderiasIN = useSignal(0);
  const verAplicacion = useSignal(false);
  const verLineaMarca = useSignal(true);
  const verTODOS = useSignal(true);

  const parametrosBusqueda = useStore({
    idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    idEmpresa: parametrosGlobales.idEmpresa,
    idAlmacen: parametrosGlobales.idAlmacen,
    buscarPor: 'Descripción', //por.value,
    cadenaABuscar: 'pol', // 'acce 5', //cadena.value,
  });

  const sumaTOTAL_manufacturas = useSignal(0);
  const sumaTOTAL_suministrosDespachados = useSignal(0);

  const CUP = useSignal(0);
  const PRECIO_VENTA_SUGERIDO = useSignal(0);

  const calcularSumatoriaManufacturas = $((OP: any) => {
    let plus = 0;
    OP.manufacturas.map((iTManufac: any) => {
      plus = plus + redondeo4Decimales(iTManufac.costoTotalPEN.$numberDecimal ? iTManufac.costoTotalPEN.$numberDecimal : iTManufac.costoTotalPEN);
    });
    return plus;
  });

  const calcularSumatoriaSuministrosDespachados = $((OP: any) => {
    let plus = 0;
    // let sD: any = [];
    for (const requi of OP.requisiciones) {
      if (requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal > 0) {
        suministrosDespachados.value.push({
          _id: requi._id,
          idAuxiliar: requi.idAuxiliar,
          idMercaderia: requi.idMercaderia,
          idEquivalencia: requi.idEquivalencia,
          idKardex: requi.idKardex,
          item: requi.item,
          codigo: requi.codigo,
          descripcionEquivalencia: requi.descripcionEquivalencia,
          cantidad: requi.cantidad,
          unidadEquivalencia: requi.unidadEquivalencia,
          // precioUnitarioPEN: requi.precioUnitarioPEN,
          // ventaPEN: requi.ventaPEN,
          tipoEquivalencia: requi.tipoEquivalencia,
          factor: requi.factor,
          laEquivalencia: requi.laEquivalencia,
          cantidadDespachada: requi.cantidadDespachada.$numberDecimal - requi.cantidadReingresada.$numberDecimal,
          costoUnitarioPEN: requi.costoUnitarioPEN,
          costoUnitarioEquivalenciaPEN: requi.costoUnitarioEquivalenciaPEN,
        });
      }
    }

    suministrosDespachados.value.map((iTSumiDespachado: any) => {
      plus =
        plus +
        (iTSumiDespachado.cantidadDespachada.$numberDecimal ? iTSumiDespachado.cantidadDespachada.$numberDecimal : iTSumiDespachado.cantidadDespachada) *
          (iTSumiDespachado.costoUnitarioEquivalenciaPEN.$numberDecimal
            ? iTSumiDespachado.costoUnitarioEquivalenciaPEN.$numberDecimal
            : iTSumiDespachado.costoUnitarioEquivalenciaPEN);
    });
    return plus;
  });

  useTask$(async ({ track }) => {
    track(() => ini.value);

    laOP.value = await getOrdenProduccion({ idOrdenProduccion: props.opSeleccionada._id });

    //console.log('laOP.value 1', laOP.value);
    laOP.value = laOP.value.data;
    //console.log('laOP.value 2', laOP.value);

    sumaTOTAL_manufacturas.value = await calcularSumatoriaManufacturas(laOP.value);
    sumaTOTAL_suministrosDespachados.value = await calcularSumatoriaSuministrosDespachados(laOP.value);

    CUP.value = laOP.value.divisor
      ? formatear_6Decimales(
          (sumaTOTAL_manufacturas.value + sumaTOTAL_suministrosDespachados.value) /
            (laOP.value.divisor.$numberDecimal ? laOP.value.divisor.$numberDecimal : laOP.value.divisor)
        )
      : 0;

    PRECIO_VENTA_SUGERIDO.value = laOP.value.divisor
      ? formatear_6Decimales(
          (100 *
            ((sumaTOTAL_manufacturas.value + sumaTOTAL_suministrosDespachados.value) /
              (laOP.value.divisor.$numberDecimal ? laOP.value.divisor.$numberDecimal : laOP.value.divisor))) /
            (100 - (laOP.value.porcentajeUtilidad.$numberDecimal ? laOP.value.porcentajeUtilidad.$numberDecimal : laOP.value.porcentajeUtilidad))
        )
      : 0;
  });
  //#endregion INICIALIZACION

  //#region BUSCAR MERCADERIAS IN
  const localizarMercaderiasIN = $(() => {
    if (parametrosBusqueda.cadenaABuscar === '') {
      alert('Ingrese un valor para su busqueda 🦪');
      document.getElementById('in_codigoDescripcion_BUSCAR_MERCADERIA_IN')?.focus();
      return;
    }

    buscarMercaderiasIN.value++;
    definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.mostrarSpinner = true;
  });
  //#endregion BUSCAR MERCADERIAS IN

  //#region REFRESCAR TABLA MERCADERIAS IN
  useTask$(({ track }) => {
    track(() => {
      definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.grabo_mercaderiaIN;
    });
    if (definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.grabo_mercaderiaIN) {
      parametrosBusqueda.cadenaABuscar = definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.abuscar;
      buscarMercaderiasIN.value++;
      definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.grabo_mercaderiaIN = false;
    }
  });
  //#endregion REFRESCAR TABLA MERCADERIAS IN

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(330px, 86%, 768px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelRegistroProductosTerminados = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3>
        Registro de productos <strong style={{ color: '#aa032f' }}>terminados</strong>
      </h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* razonSocialNombreCliente  -- requerimientosCliente*/}
        <div>
          <label style={{ color: '#444444' }}>{laOP.value.razonSocialNombreCliente}</label>
          <br style={{ marginBottom: '8px' }} />
          <label style={{ fontSize: '0.8rem', color: '#444444' }}>{laOP.value.requerimientosCliente}</label>
        </div>
        <br />
        {/* ID (LOTE) y FECHA PRODUCCION () */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '8px 0', gap: '4px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#444444' }}>LOTE</label>
            <input id="inputLote" style={{ fontSize: '0.8rem', width: '100%' }} type="text" placeholder="Lote" value={laOP.value._id} disabled />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#444444' }}>FECHA PRODUCCIÓN</label>
            <input
              id="inputFecha"
              style={{ fontSize: '0.8rem', width: '100%' }}
              type="date"
              placeholder="Fecha"
              value={laOP.value.fechaInicio ? laOP.value.fechaInicio.substring(0, 10) : ''}
              disabled
            />
          </div>
        </div>
        {/* CUP - PRECIO VENTA SIN IGV */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '8px 0', gap: '4px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#444444' }}>COSTO UNITARIO PRODUCCIÓN PEN</label>
            <input
              id="inputCOSTOUNITARIOPRODUCCIÓNPEN"
              style={{ fontSize: '0.8rem', width: '100%' }}
              type="text"
              placeholder="COSTO UNITARIO PRODUCCIÓN PEN"
              value={CUP.value}
              disabled
            />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#444444' }}>PRECIO VENTA SUGERIDO PEN</label>
            <input
              id="inputPRECIOVENTASUGERIDOPEN"
              style={{ fontSize: '0.8rem', width: '100%' }}
              type="text"
              placeholder="PRECIO VENTA SUGERIDO PEN"
              value={PRECIO_VENTA_SUGERIDO.value}
              disabled
            />
          </div>
        </div>
        <hr style={{ margin: '8px 0' }}></hr>
        <div style={{ marginBottom: '8px' }}>
          {/* Buscar por */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_codigoDescripcion_BUSCAR_MERCADERIA_IN"
                autoFocus
                style={{ width: '100%', marginRight: '4px' }}
                type="text"
                placeholder="Ingrese la mercadería a buscar"
                value={parametrosBusqueda.cadenaABuscar}
                onInput$={(e) => {
                  parametrosBusqueda.cadenaABuscar = (e.target as HTMLInputElement).value;
                }}
                // onFocusin$={(e) => {
                //   (e.target as HTMLInputElement).select();
                // }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    localizarMercaderiasIN();
                  }
                }}
              />
              <input
                type="image"
                src={images.searchPLUS}
                title="Buscar datos de mercadería"
                alt="icono buscar"
                height={16}
                width={16}
                style={{ marginRight: '2px' }}
                onClick$={() => {
                  localizarMercaderiasIN();
                }}
              />
              <input
                type="image"
                src={images.add}
                title="Registar nueva mercadería"
                alt="icono add"
                height={16}
                width={16}
                onClick$={() => {
                  // adicionarMercaderiasIN();
                  definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.mM = [];
                  definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.mostrarPanelNewEditMercaderiaIN = true;
                }}
              />
            </div>
          </div>
          {/* Buscar por: Aplicacion */}
          <div style={{ display: 'flex' }}>
            {/* <div style={{ margin: '0 auto' }}> */}
            <div>
              <input
                id="in_Aplicacion_BUSCAR_MERCADERIA_IN"
                type="checkbox"
                placeholder="Buscar por aplicación"
                // checked={props.motiSelec.activo}

                onChange$={(e) => {
                  if ((e.target as HTMLInputElement).checked) {
                    parametrosBusqueda.buscarPor = 'Aplicación';
                  } else {
                    parametrosBusqueda.buscarPor = 'Descripción';
                  }
                }}
              />
              <label for="in_Aplicacion_BUSCAR_MERCADERIA_IN" style={{ marginRight: '16px' }}>
                Aplicación
              </label>
            </div>
            <div>
              <input
                id="in_verAplicacion_BUSCAR_MERCADERIA_IN"
                type="checkbox"
                placeholder="Buscar por aplicación"
                checked={verAplicacion.value}
                onChange$={(e) => {
                  verAplicacion.value = (e.target as HTMLInputElement).checked;
                }}
              />
              <label for="in_verAplicacion_BUSCAR_MERCADERIA_IN" style={{ marginRight: '16px' }}>
                Ver Aplicacion
              </label>
            </div>
            <div>
              <input
                id="in_verLineaMarca_BUSCAR_MERCADERIA_IN"
                type="checkbox"
                placeholder="Buscar por aplicación"
                checked={verLineaMarca.value}
                onChange$={(e) => {
                  verLineaMarca.value = (e.target as HTMLInputElement).checked;
                }}
              />
              <label for="in_verLineaMarca_BUSCAR_MERCADERIA_IN">Ver Linea / Marca</label>
            </div>
          </div>
        </div>
        {/*  tabla LOCALIZADOS ITEMS MERCADERIAS  */}
        <div class="form-control">
          {buscarMercaderiasIN.value > 0 ? (
            <TablaMercaderiasIN
              buscarMercaderiasIN={buscarMercaderiasIN.value}
              parametrosBusqueda={parametrosBusqueda}
              contextoInmediato={'registro_productos_terminados'}
              esAlmacen={true} //{props.esAlmacen}
              verAplicacion={verAplicacion.value}
              verLineaMarca={verLineaMarca.value}
              verTODOS={verTODOS.value}
              motivo={props.motivo}
              //   buscarMercaderiaOUT={buscarMercaderiaOUT.value}
              //   parametrosBusqueda={parametrosBusqueda}
            />
          ) : (
            ''
          )}
          {definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.mostrarPanelMercaderiaINSeleccionada && (
            <div class="modal">
              {/* <MercaderiaINSelec />*/}
              <MercaderiaINSeleccionada
                mercaINSelecci={definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.mM}
                elKardex={definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.kK}
                esAlmacen={true}
                contextoInmediato={'registro_productos_terminados'}
                contextoParaDocumento={'new_in_almacen'}
                igv={props.igv}
                motivo={props.motivo}
                OP={props.opSeleccionada}
                CUP={CUP.value}
                PRECIO_VENTA_SUGERIDO={PRECIO_VENTA_SUGERIDO.value}
              />
            </div>
          )}
          {/* {definicion_CTX_BUSCAR_MERCADERIA_IN.mostrarPanelKardexsIN && (
            <div class="modal">
              <KardexsIN mercaINSelecci={definicion_CTX_BUSCAR_MERCADERIA_IN.mM} esAlmacen={props.esAlmacen} contexto={props.contexto} igv={props.igv} />
            </div>
          )} */}
          {/*  ADICIONAR MERCADERIA IN  */}
          {definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.mostrarPanelNewEditMercaderiaIN && (
            <div class="modal">
              <NewEditMercaderiaIN
                mercaSeleccio={definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.mM}
                contexto={'registro_productos_terminados'}
                conLote={true}
                conFechaProduccion={true}
              />
            </div>
          )}
          {/* MOSTRAR SPINNER */}
          {definicion_CTX_REGISTRO_PRODUCTOS_TERMINADOS.mostrarSpinner && (
            <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </div>
          )}
        </div>

        {/* {ctx.mostrarPanelDespachoRequisiciones && (
      <div class="modal">
        <DespachoRequisicionesOP contexto={props.contexto} opSeleccionada={definicion_CTX_BUSCAR_ORDEN_PRODUCCION_TERMINADO.oO} />
      </div>
    )}
    {ctx.mostrarPanelReingresoRequisiciones && (
      <div class="modal">
        <ReingresoRequisicionesOP contexto={props.contexto} opSeleccionada={definicion_CTX_BUSCAR_ORDEN_PRODUCCION_TERMINADO.oO} />
      </div>
    )} */}
      </div>
    </div>
  );
});
