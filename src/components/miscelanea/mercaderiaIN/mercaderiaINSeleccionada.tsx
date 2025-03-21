import { $, component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
import { CTX_IN_ALMACEN } from '~/components/inAlmacen/newInAlmacen';
import ImgButton from '~/components/system/imgButton';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';
import { CTX_KARDEXS_IN } from './kardexsIN';
// import styleFormulario12 from "../../../routes/login/login.css?inline";
// import styleFormulario12 from "../../routes/login/login.css?inline";
// import styleFormulario12 from "../../../css/formulario.css?inline";
import { elIdAuxiliar, formatear_6Decimales } from '~/functions/comunes';
import { CTX_REGISTRO_PRODUCTOS_TERMINADOS } from '../ordenProduccionTerminado/registroProductosTerminados';
import { CTX_GUIA_REMISION } from '~/components/guiaRemision/newEditGuiaRemision';
import { upPrecioPublicoPEN } from '~/apis/mercaderia.api';
import { parametrosGlobales } from '~/routes/login';
import { upUbigeo } from '~/apis/kardex.api';

export default component$(
  (props: {
    mercaINSelecci: any;
    elKardex: any;
    esAlmacen: boolean;
    enDolares?: boolean;
    tipoCambio?: any;
    contextoInmediato: string;
    contextoParaDocumento: string;
    igv: number;
    motivo?: string;
    OP?: any;
    CUP?: any;
    PRECIO_VENTA_SUGERIDO?: any;
    conIGV?: boolean;
    porMontoUnitario?: boolean;
  }) => {
    // useStyles$(styleFormulario12);

    //#region CONTEXTOS
    let documento: any = [];
    let documentoItems: any = [];
    switch (props.contextoParaDocumento) {
      case 'new_in_almacen':
        documento = useContext(CTX_IN_ALMACEN);
        documentoItems = useContext(CTX_IN_ALMACEN).itemsMercaderias;
        break;
      case 'new_edit_guiaRemision':
        documento = useContext(CTX_GUIA_REMISION);
        documentoItems = useContext(CTX_GUIA_REMISION).itemsGuiaRemision;
        break;
    }

    // const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
    let ctx: any = [];
    switch (props.contextoInmediato) {
      case 'buscar_mercaderia_in':
        ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
        break;
      case 'kardexs_in':
        ctx = useContext(CTX_KARDEXS_IN);
        break;
      case 'registro_productos_terminados':
        ctx = useContext(CTX_REGISTRO_PRODUCTOS_TERMINADOS);
        break;
    }
    //#endregion CONTEXTOS

    //#region INICIALIZANDO
    const ini = useSignal(0);
    // const lote = useSignal("");
    const lote = useSignal(typeof props.OP !== 'undefined' ? props.OP._id : '');
    const fechaProduccion = useSignal(typeof props.OP !== 'undefined' ? props.OP.fechaInicio.substring(0, 10) : '');
    const fechaVencimiento = useSignal('');
    const cantidad = useSignal(1);
    const costoPEN = useSignal(
      typeof props.mercaINSelecci.promedioCostoUnitarioMovil !== 'undefined' && props.mercaINSelecci.promedioCostoUnitarioMovil !== null
        ? props.mercaINSelecci.promedioCostoUnitarioMovil.$numberDecimal
          ? props.mercaINSelecci.promedioCostoUnitarioMovil.$numberDecimal
          : props.mercaINSelecci.promedioCostoUnitarioMovil
        : 0
    );
    const ubigeo = useSignal(props.mercaINSelecci.ubigeo);
    // const costo = useSignal(typeof props.CUP !== 'undefined' ? props.CUP : 0);
    // const precio = useSignal(typeof props.CUP !== "undefined" ? props.CUP : 0);
    const costoPENMasIGV = useSignal(0);
    const elIGV = useSignal(0);
    const IGVCalculado = useSignal(0);
    const subPEN = useSignal(0);
    const totPEN = useSignal(0);

    const costoUSD = useSignal(0);
    const costoUSDMasIGV = useSignal(0);
    const subUSD = useSignal(0);
    const totUSD = useSignal(0);

    const precioPublicoCalculado = useSignal(0);

    const actualizarPrecioPublicoPEN = useSignal(false);

    useTask$(({ track }) => {
      track(() => ini.value);

      if (props.mercaINSelecci.inafecto || props.mercaINSelecci.exonerado) {
        // props.igv = 0;
        elIGV.value = 0;
        IGVCalculado.value = 0;
      } else {
        elIGV.value = props.igv;
        IGVCalculado.value = 1 + props.igv / 100;
      }

      if (ini.value === 0) {
        //console.log('💫💫💫💫💫💫💫💫');
        if (props.motivo === 'APERTURA DE INVENTARIO') {
          costoPEN.value = props.mercaINSelecci.costoDeInicioPEN.$numberDecimal;
          if (elIGV.value === 0) {
            costoPENMasIGV.value = costoPEN.value;
          } else {
            costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
          }
        }
        if (props.motivo === 'ORDEN DE PRODUCCIÓN TERMINADA') {
          costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
        }
        costoPEN.value;
        // NO ES POR MONTO UNITARIO
        if (!props.porMontoUnitario) {
          costoPEN.value = 0;
          costoPENMasIGV.value = 0;
          costoUSD.value = 0;
          costoUSDMasIGV.value = 0;
        } else {
          if (elIGV.value === 0) {
            costoPENMasIGV.value = costoPEN.value;
          } else {
            costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
            console.log('⛵⛵⛵⛵⛵', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
          }
          if (props.enDolares) {
            console.log('™©⚪⚪⚪⚪⚪', props.tipoCambio);
            if (props.tipoCambio === 0) {
              costoUSD.value = 0;
              costoUSDMasIGV.value = 0;
            } else {
              costoUSD.value = costoPEN.value / props.tipoCambio;
              costoUSDMasIGV.value = costoPENMasIGV.value / props.tipoCambio;
            }
            subUSD.value = cantidad.value * costoUSD.value;
            totUSD.value = cantidad.value * costoUSDMasIGV.value;

            subPEN.value = cantidad.value * costoPEN.value;
            totPEN.value = cantidad.value * costoPENMasIGV.value;
          } else {
            // costoPEN.value = props.CUP;
            // if (elIGV.value === 0) {
            //   costoPENMasIGV.value = costoPEN.value;
            // } else {
            //   costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
            // }
            subPEN.value = cantidad.value * costoPEN.value;
            totPEN.value = cantidad.value * costoPENMasIGV.value;
          }
        }
        ini.value++;
      }
    });
    //#endregion INICIALIZACION

    //#region calcularCosto();
    // const calcularCosto = $(() => {
    //   if (elIGV.value === 0) {
    //     costoPEN.value = costoPENMasIGV.value * 1;
    //   } else {
    //     costoPEN.value = costoPENMasIGV.value / IGVCalculado.value;
    //     console.log('🪐🪐🪐🪐🪐', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
    //   }
    // });
    //#endregion calcularCosto();

    //#region costoIncluidoIGV();
    const costoIncluidoIGV = $(() => {
      if (elIGV.value === 0) {
        costoPENMasIGV.value = costoPEN.value;
      } else {
        costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
        console.log('⛵⛵⛵⛵⛵', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
        if (actualizarPrecioPublicoPEN.value) {
          const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
            ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
            : props.mercaINSelecci.porcentajeUtilidad;
          console.log('💥💥💥💥💥💥', costoPENMasIGV.value, ppUU);
          precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
        }
      }
    });
    //#endregion costoIncluidoIGV();

    //#region calcularCostoPEN();
    const calcularCostoPEN = $(() => {
      if (cantidad.value !== 0) {
        costoPEN.value = subPEN.value / cantidad.value;
        costoPENMasIGV.value = totPEN.value / cantidad.value;
      } else {
        costoPEN.value = 0;
        costoPENMasIGV.value = 0;
      }
      console.log('🚍🚍🚍🚍🚍🚍', cantidad.value, costoPEN.value, subPEN.value, totPEN.value);
      if (actualizarPrecioPublicoPEN.value) {
        console.log('💥💥💥💥💥💥', costoPENMasIGV.value, props.mercaINSelecci.porcentajeUtilidad);
        //precioPublicoCalculado.value = Number((e.target as HTMLInputElement).value) * (1 + props.pUtilidad / 100);
        const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
          ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
          : props.mercaINSelecci.porcentajeUtilidad;
        console.log('💥💥💥💥💥💥', ppUU);
        precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
        console.log('💥💥💥💥💥💥', precioPublicoCalculado.value);
      }
      // if (elIGV.value === 0) {
      //   costoPEN.value = costoPENMasIGV.value * 1;
      // } else {
      //   costoPEN.value = costoPENMasIGV.value / IGVCalculado.value;
      //   console.log('🪐🪐🪐🪐🪐', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
      // }
    });
    //#endregion calcularCostoPEN();

    //#region calcularCostoUSD();
    const calcularCostoUSD = $(() => {
      if (cantidad.value !== 0) {
        costoUSD.value = subUSD.value / cantidad.value;
        costoUSDMasIGV.value = totUSD.value / cantidad.value;

        costoPEN.value = subPEN.value / cantidad.value;
        costoPENMasIGV.value = totPEN.value / cantidad.value;
      } else {
        costoUSD.value = 0;
        costoUSDMasIGV.value = 0;

        costoPEN.value = 0;
        costoPENMasIGV.value = 0;
      }
      console.log('🚍🚍🚍🚍🚍🚍', cantidad.value, costoPEN.value, subPEN.value, totPEN.value);
      if (actualizarPrecioPublicoPEN.value) {
        console.log('💥💥💥💥💥💥', costoPENMasIGV.value, props.mercaINSelecci.porcentajeUtilidad);
        //precioPublicoCalculado.value = Number((e.target as HTMLInputElement).value) * (1 + props.pUtilidad / 100);
        const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
          ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
          : props.mercaINSelecci.porcentajeUtilidad;
        console.log('💥💥💥💥💥💥', ppUU);
        precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
        console.log('💥💥💥💥💥💥', precioPublicoCalculado.value);
      }
      // if (elIGV.value === 0) {
      //   costoPEN.value = costoPENMasIGV.value * 1;
      // } else {
      //   costoPEN.value = costoPENMasIGV.value / IGVCalculado.value;
      //   console.log('🪐🪐🪐🪐🪐', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
      // }
    });
    //#endregion calcularCostoUSD();

    //#region calcularCostoUSDMasIGV();
    // const calcularCostoUSDMasIGV = $(() => {
    //   if (cantidad.value !== 0) {
    //     costoUSD.value = subUSD.value / cantidad.value;
    //     costoUSDMasIGV.value = totUSD.value / cantidad.value;

    //     costoPEN.value = subPEN.value / cantidad.value;
    //     costoPENMasIGV.value = totPEN.value / cantidad.value;
    //   } else {
    //     costoUSD.value = 0;
    //     costoUSDMasIGV.value = 0;

    //     costoPEN.value = 0;
    //     costoPENMasIGV.value = 0;
    //   }
    //   console.log('🚍🚍🚍🚍🚍🚍', cantidad.value, costoPEN.value, subPEN.value, totPEN.value);
    //   // if (elIGV.value === 0) {
    //   //   costoPEN.value = costoPENMasIGV.value * 1;
    //   // } else {
    //   //   costoPEN.value = costoPENMasIGV.value / IGVCalculado.value;
    //   //   console.log('🪐🪐🪐🪐🪐', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
    //   // }
    // });
    //#endregion calcularCostoUSDMasIGV();

    // style={{ width: "245px" }}
    // style={{ width: "clamp(200px, 245px, 245px)" }}
    // style={{ width: "clamp(200px, 86%, 246px)" }}

    return (
      <div
        style={{
          width: 'clamp(320px, 100%, 416px)',
          // width: 'auto',
          background: `${props.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #dddddd 100%)' : '#eeeeee'}`,
          border: '1px solid red',
          padding: '2px',
        }}
        class="container-modal"
      >
        {/* BOTONES DEL MARCO */}
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el ver"
            onClick={$(() => {
              console.log('costoPEN.value', costoPEN.value);
              console.log('costoPENMasIGV.value', costoPENMasIGV.value);
              console.log(' costoUSD.value', costoUSD.value);
              console.log('costoUSDMasIGV.value', costoUSDMasIGV.value);
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el ver"
            onClick={$(() => {
              console.log('props.mercaINSelecci', props.mercaINSelecci);
            })}
          />
          <ImgButton
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el formulario"
            onClick={$(() => {
              if (props.contextoInmediato === 'buscar_mercaderia_in' || props.contextoInmediato === 'registro_productos_terminados') {
                ctx.mostrarPanelMercaderiaINSeleccionada = false;
              }
              if (props.contextoInmediato === 'kardexs_in') {
                ctx.mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS = false;
              }

              // ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = false;
            })}
          />
        </div>
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'red' }}>{parametrosGlobales.sucursal}</h3>
        {/* FORMULARIO12 */}
        <div class="add-form">
          {/* MERCADERIA */}
          <div>
            <div class="linea-formulario12">
              <label>Kardex</label>
              {typeof props.elKardex._id !== 'undefined' ? ' ' + props.elKardex._id : ''}
            </div>
            <div class="linea-formulario12">
              <label>Código</label>
              {props.mercaINSelecci.codigo}
            </div>
            <div class="linea-formulario12">
              <label>Descripción</label>
              <b>{props.mercaINSelecci.descripcion}</b>
            </div>
            <div class="linea-formulario12">
              <label>Linea/Tipo</label>
              <b>{props.mercaINSelecci.lineaTipo}</b>
            </div>
            {/* IGV */}
            <div class="linea-formulario12">
              <label>IGV</label>
              <u>{elIGV.value} %</u>
            </div>
            {/* Stock */}
            <div class="linea-formulario12">
              <label>Stock</label>
              <strong style={{ color: 'green' }}>
                {typeof props.elKardex.cantidadSaldo !== 'undefined' && props.elKardex.cantidadSaldo !== null
                  ? ` ${props.elKardex.cantidadSaldo.$numberDecimal ? props.elKardex.cantidadSaldo.$numberDecimal : props.elKardex.cantidadSaldo}`
                  : ``}
                {props.mercaINSelecci.unidad !== null ? ` ${props.mercaINSelecci.unidad}` : ``}
              </strong>
            </div>
            {/* conLote */}
            {props.mercaINSelecci.conLote ? (
              props.elKardex._id !== '' ? (
                <>
                  {/* Lote: */}
                  <div class="linea-formulario12">
                    <label>Lote</label>
                    <input
                      id="in_Lote_MICE"
                      // style={{ textAlign: "end" }}
                      type="text"
                      disabled
                      placeholder="Add lote"
                      value={lote.value}
                      onChange$={(e) => {
                        lote.value = (e.target as HTMLInputElement).value;
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          (document.getElementById('in_Fecha_Vencimiento_MICE') as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Lote: */}
                  <div class="linea-formulario12">
                    <label>Lote</label>
                    <input
                      id="in_Lote_MICE"
                      // style={{ textAlign: "end" }}
                      type="text"
                      placeholder="Add lote"
                      value={lote.value}
                      onChange$={(e) => {
                        lote.value = (e.target as HTMLInputElement).value;
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          (document.getElementById('in_Fecha_Vencimiento_MICE') as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                </>
              )
            ) : (
              ''
            )}
            {/* conFechaProduccion */}
            {props.mercaINSelecci.conFechaProduccion ? (
              props.elKardex._id !== '' ? (
                <>
                  {/* Fecha Produccion */}
                  <div class="linea-formulario12">
                    <label>Fecha Producción</label>
                    <input
                      id="in_Fecha_Produccion_MICE"
                      // style={{ width: "120px", textAlign: "end" }}
                      type="date"
                      disabled
                      placeholder="Add fecha producción"
                      value={fechaProduccion.value}
                      onChange$={(e) => {
                        fechaProduccion.value = (e.target as HTMLInputElement).value;
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          (document.getElementById('in_Cantidad_MICE') as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Fecha Produccion*/}
                  <div class="linea-formulario12">
                    <label>Fecha Producción</label>
                    <input
                      id="in_Fecha_Produccion_MICE"
                      // style={{ width: "120px", textAlign: "end" }}
                      type="date"
                      placeholder="Add fecha producción"
                      value={fechaProduccion.value}
                      onChange$={(e) => {
                        fechaProduccion.value = (e.target as HTMLInputElement).value;
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          (document.getElementById('in_Cantidad_MICE') as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                </>
              )
            ) : (
              ''
            )}
            {/* conFechaVencimiento */}
            {props.mercaINSelecci.conFechaVencimiento ? (
              props.elKardex._id !== '' ? (
                <>
                  {/* Fecha Vencimiento: */}
                  <div class="linea-formulario12">
                    <label>Fecha Vencimiento</label>
                    <input
                      id="in_Fecha_Vencimiento_MICE"
                      // style={{ width: "120px", textAlign: "end" }}
                      type="date"
                      disabled
                      placeholder="Add fecha vencimiento"
                      value={fechaVencimiento.value}
                      onChange$={(e) => {
                        fechaVencimiento.value = (e.target as HTMLInputElement).value;
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          (document.getElementById('in_Cantidad_MICE') as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Fecha Vencimiento: */}
                  <div class="linea-formulario12">
                    <label>Fecha Vencimiento</label>
                    <input
                      id="in_Fecha_Vencimiento_MICE"
                      // style={{ width: "120px", textAlign: "end" }}
                      type="date"
                      placeholder="Add fecha vencimiento"
                      value={fechaVencimiento.value}
                      onChange$={(e) => {
                        fechaVencimiento.value = (e.target as HTMLInputElement).value;
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          (document.getElementById('in_Cantidad_MICE') as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                </>
              )
            ) : (
              ''
            )}
            {/* Cantidad: */}
            <div class="linea-formulario12">
              <label>Cantidad</label>
              <input
                id="in_Cantidad_MICE"
                // style={{ textAlign: "end" }}
                type="number"
                // autoFocus
                placeholder="Add cantidad"
                value={cantidad.value}
                onChange$={(e) => {
                  cantidad.value = parseFloat((e.target as HTMLInputElement).value);

                  // precio.value = cantidad.value * costo.value;
                  if (props.porMontoUnitario) {
                    if (props.enDolares) {
                      if (cantidad.value !== 0) {
                        subUSD.value = cantidad.value * costoUSD.value;
                        totUSD.value = cantidad.value * costoUSDMasIGV.value;
                        subPEN.value = cantidad.value * costoPEN.value;
                        totPEN.value = cantidad.value * costoPENMasIGV.value;
                      } else {
                        subUSD.value = 0;
                        totUSD.value = 0;
                        subPEN.value = 0;
                        totPEN.value = 0;
                      }
                    } else {
                      if (cantidad.value !== 0) {
                        subPEN.value = cantidad.value * costoPEN.value;
                        totPEN.value = cantidad.value * costoPENMasIGV.value;
                      } else {
                        subPEN.value = 0;
                        totPEN.value = 0;
                      }
                    }
                  } else {
                    if (props.enDolares) {
                      calcularCostoUSD();
                      // if (props.conIGV) {
                      //   calcularCostoUSDMasIGV();
                      // } else {

                      // }
                    } else {
                      calcularCostoPEN();
                      // if (props.conIGV) {
                      //   calcularCostoPENMasIGV();
                      // } else {

                      // }
                    }
                  }
                }}
                onFocus$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    // (document.getElementById("in_CostoPEN_MICE") as HTMLInputElement).focus();
                    //console.log('ingreso a ENTER 0> in_CostoPEN_M_IN_SELECCIONADA');
                    if (props.porMontoUnitario) {
                      (document.getElementById('in_CostoPEN_M_IN_SELECCIONADA') as HTMLInputElement).focus();
                    } else {
                      if (props.conIGV) {
                        (document.getElementById('in_TOT_M_IN_SELECCIONADA') as HTMLInputElement).focus();
                      } else {
                        (document.getElementById('in_SUB_M_IN_SELECCIONADA') as HTMLInputElement).focus();
                      }
                    }
                  }
                }}
              />
            </div>
            {/* POR MONTO UNITARIO */}
            <div hidden={!props.porMontoUnitario}>
              {/* Costo UNITARIO (PEN): */}
              <div class="linea-formulario12">
                <label>Costo UNITARIO</label>
                <div style={{ display: 'flex', width: 'auto' }}>
                  <input
                    id="in_CostoPEN_M_IN_SELECCIONADA"
                    style={{ width: '100%' }}
                    type="number"
                    placeholder="Add costo"
                    value={props.enDolares ? formatear_6Decimales(costoUSD.value) : formatear_6Decimales(costoPEN.value)}
                    // disabled={typeof props.OP !== "undefined"}
                    readOnly={typeof props.OP !== 'undefined'}
                    onChange$={(e) => {
                      if (props.enDolares) {
                        costoUSD.value = parseFloat((e.target as HTMLInputElement).value);
                        costoPEN.value = costoUSD.value * props.tipoCambio;

                        if (elIGV.value === 0) {
                          costoUSDMasIGV.value = costoUSD.value;
                          costoPENMasIGV.value = costoPEN.value;
                        } else {
                          costoUSDMasIGV.value = costoUSD.value * IGVCalculado.value;
                          costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
                        }
                        console.log('⛵⛵⛵⛵⛵', costoUSD.value, IGVCalculado.value, costoUSDMasIGV.value, costoPEN.value, costoPENMasIGV.value);

                        subUSD.value = costoUSD.value * cantidad.value;
                        totUSD.value = costoUSDMasIGV.value * cantidad.value;

                        subPEN.value = costoPEN.value * cantidad.value;
                        totPEN.value = costoPENMasIGV.value * cantidad.value;
                      } else {
                        costoPEN.value = parseFloat((e.target as HTMLInputElement).value);
                        // costoIncluidoIGV();
                        if (elIGV.value === 0) {
                          costoPENMasIGV.value = costoPEN.value;
                        } else {
                          costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
                        }
                        console.log('⛵⛵⛵⛵⛵', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);

                        subPEN.value = costoPEN.value * cantidad.value;
                        totPEN.value = costoPENMasIGV.value * cantidad.value;
                      }

                      if (actualizarPrecioPublicoPEN.value) {
                        const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                          ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                          : props.mercaINSelecci.porcentajeUtilidad;
                        console.log('💥💥💥💥💥💥', costoPENMasIGV.value, ppUU);
                        precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
                      }
                    }}
                    onFocusin$={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        //console.log('ingreso a ENTER => in_ValorUniPEN_M_IN_SELECCIONADA');
                        (document.getElementById('in_ValorUniPEN_M_IN_SELECCIONADA') as HTMLInputElement).focus();
                      }
                    }}
                  />
                  <label style={{ marginLeft: '4px' }}>{props.enDolares === true ? 'USD' : 'PEN'}</label>
                </div>
              </div>
              {/* Costo UNITARIO + IGV (PEN): */}
              <div class="linea-formulario12">
                <label>Costo UNITARIO + IGV</label>
                <div style={{ display: 'flex', width: '100%' }}>
                  <input
                    id="in_ValorUniPEN_M_IN_SELECCIONADA"
                    style={{ width: '100%' }}
                    type="number"
                    placeholder="Add Valor Uni"
                    value={props.enDolares ? formatear_6Decimales(costoUSDMasIGV.value) : formatear_6Decimales(costoPENMasIGV.value)}
                    // disabled={typeof props.OP !== "undefined"}
                    readOnly={typeof props.OP !== 'undefined'}
                    onChange$={(e) => {
                      if (props.enDolares) {
                        costoUSDMasIGV.value = parseFloat((e.target as HTMLInputElement).value);
                        costoPENMasIGV.value = costoUSDMasIGV.value * props.tipoCambio;

                        if (elIGV.value === 0) {
                          costoUSD.value = costoUSDMasIGV.value;
                          costoPEN.value = costoPENMasIGV.value;
                        } else {
                          costoUSD.value = costoUSDMasIGV.value / IGVCalculado.value;
                          costoPEN.value = costoPENMasIGV.value / IGVCalculado.value;

                          // costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
                        }
                        console.log('⛵⛵⛵⛵⛵', costoUSD.value, IGVCalculado.value, costoUSDMasIGV.value);

                        subUSD.value = costoUSD.value * cantidad.value;
                        totUSD.value = costoUSDMasIGV.value * cantidad.value;

                        subPEN.value = costoPEN.value * cantidad.value;
                        totPEN.value = costoPENMasIGV.value * cantidad.value;
                      } else {
                        costoPENMasIGV.value = parseFloat((e.target as HTMLInputElement).value);

                        if (elIGV.value === 0) {
                          costoPEN.value = costoPENMasIGV.value;
                        } else {
                          costoPEN.value = costoPENMasIGV.value / IGVCalculado.value;

                          // costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
                        }
                        console.log('⛵⛵⛵⛵⛵', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
                      }

                      // calcularCosto();
                      if (actualizarPrecioPublicoPEN.value) {
                        console.log('💥💥💥💥💥💥', costoPENMasIGV.value, props.mercaINSelecci.porcentajeUtilidad);
                        //precioPublicoCalculado.value = Number((e.target as HTMLInputElement).value) * (1 + props.pUtilidad / 100);
                        const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                          ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                          : props.mercaINSelecci.porcentajeUtilidad;
                        console.log('💥💥💥💥💥💥', ppUU);
                        precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
                        console.log('💥💥💥💥💥💥', precioPublicoCalculado.value);
                      }
                    }}
                    onFocusin$={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        (document.getElementById('in_ubigeo_MERCADERIA_IN_MICE_SELEC') as HTMLInputElement).focus();
                      }
                    }}
                  />
                  <label style={{ marginLeft: '4px' }}>{props.enDolares === true ? 'USD' : 'PEN'}</label>
                </div>
              </div>
            </div>
            {/* NO ES: POR MONTO UNITARIO */}
            <div hidden={props.porMontoUnitario || props.conIGV}>
              {/* Costo UNITARIO (PEN): */}
              <div class="linea-formulario12">
                <label>Costo UNITARIO</label>
                <div style={{ display: 'flex', width: 'auto' }}>
                  <input
                    id="in_CostoPEN_M_IN_SELECCIONADA"
                    disabled
                    style={{ width: '100%', background: '#ddd' }}
                    type="number"
                    placeholder="Add costo"
                    value={props.enDolares ? formatear_6Decimales(costoUSD.value) : formatear_6Decimales(costoPEN.value)}
                    // disabled={typeof props.OP !== "undefined"}
                    readOnly={typeof props.OP !== 'undefined'}
                    // onChange$={(e) => {
                    //   costoPEN.value = parseFloat((e.target as HTMLInputElement).value);
                    //   costoIncluidoIGV();
                    // }}
                    onFocusin$={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        //console.log('ingreso a ENTER => in_ValorUniPEN_M_IN_SELECCIONADA');
                        (document.getElementById('in_ValorUniPEN_M_IN_SELECCIONADA') as HTMLInputElement).focus();
                      }
                    }}
                  />
                  <label style={{ marginLeft: '4px' }}>{props.enDolares ? 'USD' : 'PEN'}</label>
                </div>
              </div>
              {/* SUB */}
              <div class="linea-formulario12">
                <label>Sub</label>
                <div style={{ display: 'flex', width: '100%' }}>
                  <input
                    id="in_SUB_M_IN_SELECCIONADA"
                    style={{ width: '100%' }}
                    type="number"
                    placeholder="Add Valor Uni"
                    value={props.enDolares ? formatear_6Decimales(subUSD.value) : formatear_6Decimales(subPEN.value)}
                    // disabled={typeof props.OP !== "undefined"}
                    readOnly={typeof props.OP !== 'undefined'}
                    onChange$={(e) => {
                      if (props.enDolares) {
                        subUSD.value = parseFloat((e.target as HTMLInputElement).value);
                        subPEN.value = subUSD.value * props.tipoCambio;
                        if (cantidad.value !== 0) {
                          costoUSD.value = subUSD.value / cantidad.value;
                          costoPEN.value = subPEN.value / cantidad.value;
                        } else {
                          costoUSD.value = 0;
                          costoPEN.value = 0;
                        }
                        //
                        if (elIGV.value === 0) {
                          totUSD.value = subUSD.value;
                          totPEN.value = subPEN.value;
                        } else {
                          totUSD.value = subUSD.value * IGVCalculado.value;
                          totPEN.value = subPEN.value * IGVCalculado.value;

                          // costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
                          console.log('⛵⛵⛵⛵⛵', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
                        }
                        if (cantidad.value !== 0) {
                          costoUSDMasIGV.value = totUSD.value / cantidad.value;
                          costoPENMasIGV.value = totPEN.value / cantidad.value;
                        } else {
                          costoUSDMasIGV.value = 0;
                          costoPENMasIGV.value = 0;
                        }
                      } else {
                        subPEN.value = parseFloat((e.target as HTMLInputElement).value);
                        if (cantidad.value !== 0) {
                          costoPEN.value = subPEN.value / cantidad.value;
                        } else {
                          costoPEN.value = 0;
                        }
                        //
                        if (elIGV.value === 0) {
                          totPEN.value = subPEN.value;
                        } else {
                          totPEN.value = subPEN.value * IGVCalculado.value;
                        }
                        if (cantidad.value !== 0) {
                          costoPENMasIGV.value = totPEN.value / cantidad.value;
                        } else {
                          costoPENMasIGV.value = 0;
                        }
                      }

                      if (actualizarPrecioPublicoPEN.value) {
                        const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                          ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                          : props.mercaINSelecci.porcentajeUtilidad;
                        console.log('💥💥💥💥💥💥', costoPENMasIGV.value, ppUU);
                        precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
                      }

                      // calcularCosto();
                      // if (actualizarPrecioPublicoPEN.value) {
                      //   console.log('💥💥💥💥💥💥', costoPENMasIGV.value, props.mercaINSelecci.porcentajeUtilidad);
                      //   //precioPublicoCalculado.value = Number((e.target as HTMLInputElement).value) * (1 + props.pUtilidad / 100);
                      //   const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                      //     ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                      //     : props.mercaINSelecci.porcentajeUtilidad;
                      //   console.log('💥💥💥💥💥💥', ppUU);
                      //   precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
                      //   console.log('💥💥💥💥💥💥', precioPublicoCalculado.value);
                      // }
                    }}
                    onFocusin$={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        (document.getElementById('in_ubigeo_MERCADERIA_IN_MICE_SELEC') as HTMLInputElement).focus();
                      }
                    }}
                  />
                  <label style={{ marginLeft: '4px' }}>{props.enDolares ? 'USD' : 'PEN'}</label>
                </div>
              </div>
            </div>
            {/* NO ES: POR MONTO UNITARIO MAS IGV */}
            <div hidden={props.porMontoUnitario || !props.conIGV}>
              {/* Valor UNITARIO (PEN): */}
              <div class="linea-formulario12">
                <label>Valor UNITARIO</label>
                <div style={{ display: 'flex', width: 'auto' }}>
                  <input
                    id="in_CostoPEN_M_IN_SELECCIONADA"
                    disabled
                    style={{ width: '100%', background: '#ddd' }}
                    type="number"
                    placeholder="Add costo"
                    value={props.enDolares ? formatear_6Decimales(costoUSDMasIGV.value) : formatear_6Decimales(costoPENMasIGV.value)}
                    // disabled={typeof props.OP !== "undefined"}
                    readOnly={typeof props.OP !== 'undefined'}
                    onChange$={(e) => {
                      costoPEN.value = parseFloat((e.target as HTMLInputElement).value);
                      costoIncluidoIGV();
                    }}
                    onFocusin$={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        //console.log('ingreso a ENTER => in_ValorUniPEN_M_IN_SELECCIONADA');
                        (document.getElementById('in_ValorUniPEN_M_IN_SELECCIONADA') as HTMLInputElement).focus();
                      }
                    }}
                  />
                  <label style={{ marginLeft: '4px' }}>{props.enDolares ? 'USD' : 'PEN'}</label>
                </div>
              </div>
              {/* TOT */}
              <div class="linea-formulario12">
                <label>Tot</label>
                <div style={{ display: 'flex', width: '100%' }}>
                  <input
                    id="in_TOT_M_IN_SELECCIONADA"
                    style={{ width: '100%' }}
                    type="number"
                    placeholder="Add Valor Uni"
                    value={props.enDolares ? formatear_6Decimales(totUSD.value) : formatear_6Decimales(totPEN.value)}
                    // disabled={typeof props.OP !== "undefined"}
                    readOnly={typeof props.OP !== 'undefined'}
                    onChange$={(e) => {
                      if (props.enDolares) {
                        totUSD.value = parseFloat((e.target as HTMLInputElement).value);
                        totPEN.value = totUSD.value * props.tipoCambio;
                        console.log('ingreso a dolares', totUSD.value, totPEN.value);

                        if (cantidad.value !== 0) {
                          costoUSDMasIGV.value = totUSD.value / cantidad.value;
                          costoPENMasIGV.value = totPEN.value / cantidad.value;
                        } else {
                          costoUSDMasIGV.value = 0;
                          costoPENMasIGV.value = 0;
                        }
                        console.log('ingreso a dolares costoUSDMasIGV', costoUSDMasIGV.value, costoPENMasIGV.value);
                        if (elIGV.value === 0) {
                          subUSD.value = totUSD.value;
                          subPEN.value = totPEN.value;
                        } else {
                          subUSD.value = totUSD.value / IGVCalculado.value;
                          subPEN.value = totPEN.value / IGVCalculado.value;

                          // costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
                          console.log('⛵⛵⛵⛵⛵', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
                        }
                        if (cantidad.value !== 0) {
                          costoUSD.value = subUSD.value / cantidad.value;
                          costoPEN.value = subPEN.value / cantidad.value;
                        } else {
                          costoUSD.value = 0;
                          costoPEN.value = 0;
                        }
                      } else {
                        totPEN.value = parseFloat((e.target as HTMLInputElement).value);
                        if (cantidad.value !== 0) {
                          costoPENMasIGV.value = totPEN.value / cantidad.value;
                        } else {
                          costoPENMasIGV.value = 0;
                        }
                        console.log('ingreso a soles costoPENMasIGV', costoPENMasIGV.value);
                        if (elIGV.value === 0) {
                          subPEN.value = totPEN.value;
                        } else {
                          subPEN.value = totPEN.value / IGVCalculado.value;

                          // costoPENMasIGV.value = costoPEN.value * IGVCalculado.value;
                          console.log('⛵⛵⛵⛵⛵', costoPEN.value, IGVCalculado.value, costoPENMasIGV.value);
                        }
                        if (cantidad.value !== 0) {
                          costoPEN.value = subPEN.value / cantidad.value;
                        } else {
                          costoPEN.value = 0;
                        }
                      }
                      // costoPENMasIGV.value = parseFloat((e.target as HTMLInputElement).value);

                      // calcularCosto();
                      if (actualizarPrecioPublicoPEN.value) {
                        console.log('💥💥💥💥💥💥', costoPENMasIGV.value, props.mercaINSelecci.porcentajeUtilidad);
                        //precioPublicoCalculado.value = Number((e.target as HTMLInputElement).value) * (1 + props.pUtilidad / 100);
                        const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                          ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                          : props.mercaINSelecci.porcentajeUtilidad;
                        console.log('💥💥💥💥💥💥', ppUU);
                        precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
                        console.log('💥💥💥💥💥💥', precioPublicoCalculado.value);
                      }
                    }}
                    onFocusin$={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        (document.getElementById('in_ubigeo_MERCADERIA_IN_MICE_SELEC') as HTMLInputElement).focus();
                      }
                    }}
                  />
                  <label style={{ marginLeft: '4px' }}>{props.enDolares === true ? 'USD' : 'PEN'}</label>
                </div>
              </div>
            </div>
            <br />
          </div>
          <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr>
          {/* Ubigeo */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_ubigeo_MERCADERIA_IN_MICE_SELEC"
                style={{ width: '100%' }}
                type="text"
                placeholder="Ubigeo"
                title="Ubigeo Ej: 1A83 (1:Piso, A:Sección, 8:Columna, 3:Fila)"
                value={ubigeo.value}
                onChange$={(e) => {
                  ubigeo.value = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('btn_Registrar_MercaderiaIN_MICE')?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* Ejm Ubigeo */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <label style={{ color: '#666666' }}>Ejm: 1A83 (1:Piso, A:Sección, 8:Columna, 3:Fila)</label>
            </div>
          </div>
          <hr hidden={!parametrosGlobales.actualizarPrecioPublico} style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr>
          {/* PRECIO PUBLICO PEN */}
          <div hidden={!parametrosGlobales.actualizarPrecioPublico}>
            <div style={{ marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={actualizarPrecioPublicoPEN.value}
                id="chbx_Actualizar_PrecioPublicoPEN"
                onClick$={(e) => {
                  console.log('click en chbx_conIGV_IN_ALMACEN');
                  actualizarPrecioPublicoPEN.value = (e.target as HTMLInputElement).checked;
                  if (actualizarPrecioPublicoPEN.value) {
                    console.log('💥💥💥💥💥💥', costoPENMasIGV.value, props.mercaINSelecci.porcentajeUtilidad);
                    //precioPublicoCalculado.value = Number((e.target as HTMLInputElement).value) * (1 + props.pUtilidad / 100);
                    const ppUU = props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                      ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                      : props.mercaINSelecci.porcentajeUtilidad;
                    console.log('💥💥💥💥💥💥', ppUU);
                    precioPublicoCalculado.value = costoPENMasIGV.value * (1 + ppUU / 100);
                    console.log('💥💥💥💥💥💥', precioPublicoCalculado.value);
                  }
                }}
              />
              <label for="chbx_Actualizar_PrecioPublicoPEN" style={{ marginRight: '12px' }}>
                ACTUALIZAR PRECIO PÚBLICO PEN
              </label>
            </div>
            <div hidden={!actualizarPrecioPublicoPEN.value}>
              <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 12px 0' }}>
                <em>Esta operación no es reversible. ¿Desea continuar?</em>
              </div>
              <div class="linea-formulario" style={{ marginBottom: '8px' }}>
                <label>Porcentaje Utilidad</label>
                <div style={{ display: 'flex' }}>
                  <input
                    id="in_Porcentaje_Utilidad"
                    type="number"
                    disabled
                    placeholder="Porcentaje Utilidad"
                    // class="input-formulario-usuario"
                    style={{ marginRight: '4px' }}
                    value={
                      props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                        ? props.mercaINSelecci.porcentajeUtilidad.$numberDecimal
                        : props.mercaINSelecci.porcentajeUtilidad
                    }
                    onKeyPress$={(e) => {
                      if (e.key === 'Enter') {
                        (document.getElementById('in_Costo_Unitario') as HTMLInputElement)?.focus();
                      }
                    }}
                  />
                  <label>%</label>
                </div>
              </div>
              <div class="linea-formulario" style={{ marginBottom: '8px' }}>
                <label>Precio Público Calculado PEN</label>
                <input
                  id="in_Precio_Publico_Calculado"
                  type="number"
                  disabled
                  placeholder="Precio Público Calculado PEN"
                  value={precioPublicoCalculado.value}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('in_Precio_Publico') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
              <div class="linea-formulario" style={{ marginBottom: '8px' }}>
                <label>Precio Público PEN</label>
                <input
                  id="in_Precio_Publico"
                  type="number"
                  placeholder="Precio Público"
                  style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: 'red' }}
                  value={
                    typeof props.mercaINSelecci.precioUnitarioPEN !== 'undefined' && props.mercaINSelecci.precioUnitarioPEN !== null
                      ? props.mercaINSelecci.precioUnitarioPEN.$numberDecimal
                        ? props.mercaINSelecci.precioUnitarioPEN.$numberDecimal
                        : props.mercaINSelecci.precioUnitarioPEN
                      : ''
                  }
                  onChange$={(e) => (props.mercaINSelecci.precioUnitarioPEN = Number((e.target as HTMLInputElement).value))}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('btn_Registrar_MercaderiaIN_MICE') as HTMLInputElement)?.focus();
                    }
                  }}
                />
              </div>
            </div>

            <br />
          </div>

          {/* GRABAR */}
          <input
            id="btn_Registrar_MercaderiaIN_MICE"
            type="button"
            value="Adjuntar INGRESO"
            style={{ cursor: 'pointer', height: '40px' }}
            class="btn-centro"
            onClick$={async () => {
              if (typeof props.mercaINSelecci.conLote !== 'undefined' && props.mercaINSelecci.conLote) {
                if (lote.value.trim() === '') {
                  alert('Ingrese el lote');
                  document.getElementById('in_Lote_MICE')?.focus();
                  return;
                }
              }
              if (typeof props.mercaINSelecci.conFechaProduccion !== 'undefined' && props.mercaINSelecci.conFechaProduccion) {
                if (fechaProduccion.value.trim() === '') {
                  alert('Ingrese la fecha producción');
                  document.getElementById('in_Fecha_Produccion_MICE')?.focus();
                  return;
                }
              }
              if (typeof props.mercaINSelecci.conFechaVencimiento !== 'undefined' && props.mercaINSelecci.conFechaVencimiento) {
                if (fechaVencimiento.value.trim() === '') {
                  alert('Ingrese la fecha vencimiento');
                  document.getElementById('in_Fecha_Vencimiento_MICE')?.focus();
                  return;
                }
              }
              if (typeof ubigeo.value === 'undefined' || ubigeo.value === null || ubigeo.value === '') {
                alert('Ingrese el ubigeo');
                (document.getElementById('in_ubigeo_MERCADERIA_IN_MICE_SELEC') as HTMLInputElement).focus();
                // document.getElementById('in_ubigeo_MERCADERIA_IN_MICE_SELEC')?.focus();
                return;
              }
              // console.log('........................', ubigeo.value);

              if (actualizarPrecioPublicoPEN.value) {
                if (
                  typeof props.mercaINSelecci.precioUnitarioPEN === 'undefined' ||
                  props.mercaINSelecci.precioUnitarioPEN === null ||
                  props.mercaINSelecci.precioUnitarioPEN.toString() === ''
                ) {
                  alert('Ingrese el precio público');
                  document.getElementById('in_Precio_Publico')?.focus();
                  return;
                }
              }

              //* REGISTRAR
              //* REGISTRAR
              //* REGISTRAR
              if (props.contextoInmediato === 'registro_productos_terminados') {
                documento.produccion = true;

                if (documento.documentosAdjuntos.length === 0) {
                  documento.idRemitente = props.OP.idCliente;
                  documento.codigoTipoDocumentoIdentidad = props.OP.codigoTipoDocumentoIdentidad;
                  documento.tipoDocumentoIdentidad = props.OP.tipoDocumentoIdentidad;
                  documento.numeroIdentidad = props.OP.numeroIdentidad;
                  documento.razonSocialNombre = props.OP.razonSocialNombreCliente;

                  documento.idDocumento = lote.value; // OP._id

                  documento.documentosAdjuntos.push({
                    idAuxiliar: parseInt(elIdAuxiliar()),
                    // tipo: props.docSelecci.tipo ? props.docSelecci.tipo : '',
                    codigoTCP: '0', // documentoIN.codigoTCP,
                    descripcionTCP: 'Otros', //documentoIN.descripcionTCP,
                    fecha: fechaProduccion.value, // OP.fechaInicio
                    serie: props.OP.serie,
                    numero: props.OP.numero,

                    // lote: documentoIN.lote,
                  });
                }
              }

              // documentoItems.push({ idAuxiliar: 6265, codigo: 'ds687', descripcionEquivalencia: 'anteojos', cantidad: 555, unidadEquivalencia: 'VIV' });
              if (props.enDolares) {
                console.log('🍘🍘🍘🍘🍘🍘', cantidad.value * costoUSD.value, costoUSD.value, costoUSDMasIGV.value, costoPEN.value, costoPENMasIGV.value);
                documentoItems.push({
                  idAuxiliar: parseInt(elIdAuxiliar()),
                  idMercaderia: props.mercaINSelecci._id,
                  idKardex: props.elKardex._id,
                  item: 0,

                  codigo: props.mercaINSelecci.codigo ? props.mercaINSelecci.codigo : '-',

                  descripcion: props.mercaINSelecci.descripcion,
                  // descripcionEquivalencia: props.mercaINSelecci.descripcion,
                  ubigeo: ubigeo.value.toUpperCase(),

                  lote: lote.value,
                  fechaProduccion: fechaProduccion.value,
                  fechaVencimiento: fechaVencimiento.value,
                  precioVentaSugerido: props.PRECIO_VENTA_SUGERIDO,

                  IGV: elIGV.value,

                  cantidadIngresada: cantidad.value,
                  // cantidad: cantidad.value,

                  unidad: props.mercaINSelecci.unidad,
                  // unidadEquivalencia: props.mercaINSelecci.unidad,
                  //********  PEN  *******/

                  costoUnitarioPEN: costoPEN.value, // * props.tipoCambio,

                  subPEN: subPEN.value, // cantidad.value * costoPEN.value * props.tipoCambio,

                  valorUnitarioPEN: costoPENMasIGV.value, // * props.tipoCambio,
                  totPEN: totPEN.value, // cantidad.value * costoPENMasIGV.value * props.tipoCambio,
                  //********  USD  *******/
                  costoUnitarioUSD: costoUSD.value,

                  subUSD: subUSD.value, //cantidad.value * costoUSD.value,

                  valorUnitarioUSD: costoUSDMasIGV.value,
                  totUSD: totUSD.value, // cantidad.value * costoUSDMasIGV.value,
                  //********************************* */
                  porcentajeUtilidad: props.mercaINSelecci.porcentajeUtilidad,
                });
                console.log('🍘🍘🍘🍘🍘🍘');
              } else {
                console.log('🍙🍙🍙🍙🍙🍙', cantidad.value * costoPEN.value, costoPEN.value, costoPENMasIGV.value);

                documentoItems.push({
                  idAuxiliar: parseInt(elIdAuxiliar()),
                  idMercaderia: props.mercaINSelecci._id,
                  idKardex: props.elKardex._id,
                  item: 0,

                  codigo: props.mercaINSelecci.codigo ? props.mercaINSelecci.codigo : '-',

                  descripcion: props.mercaINSelecci.descripcion,
                  // descripcionEquivalencia: props.mercaINSelecci.descripcion,
                  ubigeo: ubigeo.value.toUpperCase(),

                  lote: lote.value,
                  fechaProduccion: fechaProduccion.value,
                  fechaVencimiento: fechaVencimiento.value,
                  precioVentaSugerido: props.PRECIO_VENTA_SUGERIDO,

                  IGV: elIGV.value,

                  cantidadIngresada: cantidad.value,
                  // cantidad: cantidad.value,

                  unidad: props.mercaINSelecci.unidad,
                  // unidadEquivalencia: props.mercaINSelecci.unidad,
                  //********  PEN  *******/

                  costoUnitarioPEN: costoPEN.value,

                  subPEN: subPEN.value, //cantidad.value * costoPEN.value,

                  valorUnitarioPEN: costoPENMasIGV.value,
                  totPEN: totPEN.value, // cantidad.value * costoPENMasIGV.value,
                  //********  USD  *******/
                  costoUnitarioUSD: 0,

                  subUSD: 0,

                  valorUnitarioUSD: 0,
                  totUSD: 0,
                  //********************************* */
                  porcentajeUtilidad: props.mercaINSelecci.porcentajeUtilidad,
                });
              }

              if (props.contextoInmediato === 'buscar_mercaderia_in' || props.contextoInmediato === 'registro_productos_terminados') {
                ctx.mostrarPanelMercaderiaINSeleccionada = false;
              }
              if (props.contextoInmediato === 'kardexs_in') {
                ctx.mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS = false;
              }
              // ACTUALIZAR UBIGEO
              // console.log('props.elKardex._id', props.elKardex._id);

              if (ubigeo.value !== null && ubigeo.value !== '' && typeof props.elKardex._id !== 'undefined') {
                const ubi = await upUbigeo({
                  idKardex: props.elKardex._id,
                  ubigeo: ubigeo.value.toUpperCase(),

                  usuario: parametrosGlobales.usuario,
                });

                console.log('ubi.......', ubi);
              }

              // ACTUALIZAR PRECIO PUBLICO PEN
              if (actualizarPrecioPublicoPEN.value) {
                const precioP = await upPrecioPublicoPEN({
                  idMercaderia: props.mercaINSelecci._id,
                  fechaPrecioUnitario: new Date(),
                  costoUnitarioPENMasIGV: formatear_6Decimales(costoPENMasIGV.value), ///costo
                  precioUnitarioCalculadoPEN: precioPublicoCalculado.value,
                  precioUnitarioPEN: props.mercaINSelecci.precioUnitarioPEN,

                  usuario: parametrosGlobales.usuario,
                });

                console.log('precioP', precioP);
              }
            }}
          />
        </div>
      </div>
    );
  }
);
