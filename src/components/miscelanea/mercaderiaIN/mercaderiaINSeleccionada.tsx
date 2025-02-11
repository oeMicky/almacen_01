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
    const costo = useSignal(typeof props.CUP !== 'undefined' ? props.CUP : 0);
    // const precio = useSignal(typeof props.CUP !== "undefined" ? props.CUP : 0);
    const costoMasIGV = useSignal(0);
    const elIGV = useSignal(0);
    const IGVCalculado = useSignal(0);

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
          costo.value = props.mercaINSelecci.costoDeInicioPEN.$numberDecimal;
          if (elIGV.value === 0) {
            costoMasIGV.value = costo.value;
          } else {
            costoMasIGV.value = costo.value * IGVCalculado.value;
          }
        }
        if (props.motivo === 'ORDEN DE PRODUCCIÓN TERMINADA') {
          costoMasIGV.value = costo.value * IGVCalculado.value;
        }
        costo.value;
        ini.value++;
      }
    });
    //#endregion INICIALIZACION

    //#region calcularCosto();
    const calcularCosto = $(() => {
      if (elIGV.value === 0) {
        costo.value = costoMasIGV.value * 1;
      } else {
        costo.value = costoMasIGV.value / IGVCalculado.value;
      }
    });
    //#endregion calcularCosto();

    //#region calcularPrecio();
    const calcularPrecio = $(() => {
      if (elIGV.value === 0) {
        costoMasIGV.value = costo.value;
      } else {
        costoMasIGV.value = costo.value * IGVCalculado.value;
      }
    });
    //#endregion calcularPrecio();

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
          {/* <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el ver"
            onClick={$(() => {
              //console.log([props.enDolares, props.tipoCambio]);
            })}
          /> */}
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
            <div class="linea-formulario12">
              <label>IGV</label>
              <u>{elIGV.value} %</u>
            </div>
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
                }}
                onFocus$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    // (document.getElementById("in_CostoPEN_MICE") as HTMLInputElement).focus();
                    //console.log('ingreso a ENTER 0> in_CostoPEN_M_IN_SELECCIONADA');
                    (document.getElementById('in_CostoPEN_M_IN_SELECCIONADA') as HTMLInputElement).focus();
                  }
                }}
              />
            </div>
            {/* Costo UNITARIO (PEN): */}
            <div class="linea-formulario12">
              <label>Costo UNITARIO</label>
              <div style={{ display: 'flex', width: 'auto' }}>
                <input
                  id="in_CostoPEN_M_IN_SELECCIONADA"
                  style={{ width: '100%' }}
                  type="number"
                  placeholder="Add costo"
                  value={formatear_6Decimales(costo.value)}
                  // disabled={typeof props.OP !== "undefined"}
                  readOnly={typeof props.OP !== 'undefined'}
                  onChange$={(e) => {
                    costo.value = parseFloat((e.target as HTMLInputElement).value);
                    calcularPrecio();
                  }}
                  // onFocusin$={(e) => {
                  //   (e.target as HTMLInputElement).select();
                  // }}
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
                  value={formatear_6Decimales(costoMasIGV.value)}
                  // disabled={typeof props.OP !== "undefined"}
                  readOnly={typeof props.OP !== 'undefined'}
                  onChange$={(e) => {
                    costoMasIGV.value = parseFloat((e.target as HTMLInputElement).value);

                    calcularCosto();
                  }}
                  // onFocusin$={(e) => {
                  //   (e.target as HTMLInputElement).select();
                  // }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      (document.getElementById('btn_Registrar_MercaderiaIN_MICE') as HTMLInputElement).focus();
                    }
                  }}
                />
                <label style={{ marginLeft: '4px' }}>{props.enDolares === true ? 'USD' : 'PEN'}</label>
              </div>
            </div>
            <br />
          </div>
          {/* <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr> */}
          {/* GRABAR */}
          <input
            id="btn_Registrar_MercaderiaIN_MICE"
            type="button"
            value="Grabar "
            style={{ cursor: 'pointer', height: '40px' }}
            class="btn-centro"
            onClick$={() => {
              if (typeof props.mercaINSelecci.conLote !== 'undefined' && props.mercaINSelecci.conLote) {
                if (lote.value.trim() === '') {
                  alert('Ingrese el lote');
                  document.getElementById('in_Lote_MICE')?.focus;
                  return;
                }
              }
              if (typeof props.mercaINSelecci.conFechaProduccion !== 'undefined' && props.mercaINSelecci.conFechaProduccion) {
                if (fechaProduccion.value.trim() === '') {
                  alert('Ingrese la fecha producción');
                  document.getElementById('in_Fecha_Produccion_MICE')?.focus;
                  return;
                }
              }
              if (typeof props.mercaINSelecci.conFechaVencimiento !== 'undefined' && props.mercaINSelecci.conFechaVencimiento) {
                if (fechaVencimiento.value.trim() === '') {
                  alert('Ingrese la fecha vencimiento');
                  document.getElementById('in_Fecha_Vencimiento_MICE')?.focus;
                  return;
                }
              }
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
                documentoItems.push({
                  idAuxiliar: parseInt(elIdAuxiliar()),
                  idMercaderia: props.mercaINSelecci._id,
                  idKardex: props.elKardex._id,
                  item: 0,

                  codigo: props.mercaINSelecci.codigo ? props.mercaINSelecci.codigo : '_',

                  descripcion: props.mercaINSelecci.descripcion,
                  // descripcionEquivalencia: props.mercaINSelecci.descripcion,

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

                  costoUnitarioPEN: costo.value * props.tipoCambio,

                  subPEN: cantidad.value * costo.value * props.tipoCambio,

                  valorUnitarioPEN: costoMasIGV.value * props.tipoCambio,
                  totPEN: cantidad.value * costoMasIGV.value * props.tipoCambio,
                  //********  USD  *******/
                  costoUnitarioUSD: costo.value,

                  subUSD: cantidad.value * costo.value,

                  valorUnitarioUSD: costoMasIGV.value,
                  totUSD: cantidad.value * costoMasIGV.value,
                  //********************************* */
                  porcentajeUtilidad: props.mercaINSelecci.porcentajeUtilidad,
                });
              } else {
                documentoItems.push({
                  idAuxiliar: parseInt(elIdAuxiliar()),
                  idMercaderia: props.mercaINSelecci._id,
                  idKardex: props.elKardex._id,
                  item: 0,

                  codigo: props.mercaINSelecci.codigo ? props.mercaINSelecci.codigo : '_',

                  descripcion: props.mercaINSelecci.descripcion,
                  // descripcionEquivalencia: props.mercaINSelecci.descripcion,

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

                  costoUnitarioPEN: costo.value,

                  subPEN: cantidad.value * costo.value,

                  valorUnitarioPEN: costoMasIGV.value,
                  totPEN: cantidad.value * costoMasIGV.value,
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
            }}
          />
        </div>
      </div>
    );
  }
);
