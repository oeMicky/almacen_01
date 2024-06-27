import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { images } from "~/assets";
import ImgButton from "~/components/system/imgButton";

import ElSelect from "~/components/system/elSelect";
import { elIdAuxiliar, formatoDDMMYYYY_PEN, redondeo6Decimales } from "~/functions/comunes";
import type { IMercaEquivalenciaOUT } from "~/interfaces/iMercaderia";
import { CTX_COTIZACION } from "~/components/cotizacion/newEditCotizacion";
import { CTX_F_B_NC_ND } from "~/components/venta/addVenta";
import { CTX_O_S } from "~/components/ordenServicio/newEditOrdenServicio";
import { CTX_OUT_ALMACEN } from "~/components/outAlmacen/newOutAlmacen";
import { CTX_BUSCAR_MERCADERIA_OUT } from "./buscarMercaderiaOUT";
import { CTX_KARDEXS_OUT } from "./kardexsOUT";
import { CTX_O_P } from "~/components/ordenProduccion/newEditOrdenProduccion";

export default component$(
  (props: {
    mercaOUTSelecci: any;
    elKardex: any;
    esAlmacen: boolean;
    esProduccion?: boolean;
    esOrdenServicio?: boolean;
    contexto: string;
    contextoParaDocumento: string;
    porcentaje: any;
  }) => {
    //#region CONTEXTOS
    let ctx: any = [];
    let documento: any = [];

    switch (props.contextoParaDocumento) {
      case "orden_servicio":
        console.log("contextoParaDocumento::: orden_servicio");
        documento = useContext(CTX_O_S).requisiciones;
        break;
      case "orden_produccion":
        console.log("contextoParaDocumento::: orden_produccion");
        documento = useContext(CTX_O_P).requisiciones;
        break;
      case "new_venta":
        console.log("contextoParaDocumento::: new_venta");
        documento = useContext(CTX_F_B_NC_ND).itemsVenta;
        // asiVen = useContext(CTX_F_B_NC_ND).asientoContable;
        break;
      case "new_edit_cotizacion":
        console.log("contextoParaDocumento::: new_edit_cotizacion");
        documento = useContext(CTX_COTIZACION).repuestosLubri;
        break;
      case "new_out_almacen":
        console.log("contextoParaDocumento::: new_out_almacen");
        documento = useContext(CTX_OUT_ALMACEN).itemsMercaderias;
        break;
    }

    switch (props.contexto) {
      case "buscar_mercaderia_out":
        console.log("contexto::: buscar_mercaderia_out");
        ctx = useContext(CTX_BUSCAR_MERCADERIA_OUT);
        break;
      case "kardexs_out":
        console.log("contexto::: kardexs_out");
        ctx = useContext(CTX_KARDEXS_OUT);
        break;
    }
    //#endregion CONTEXTOS

    //#region INICIALIZANDO
    const ini = useSignal(0);
    const cantidadSacada = useSignal(1);
    const precioEquivalencia = useSignal(0);

    const equivalencia = useStore<IMercaEquivalenciaOUT>({
      _id: "",
      idAuxiliar: 0,
      descripcionEquivalencia: "",
      laEquivalencia: 0,
      idUnidadEquivalencia: "",
      unidadEquivalencia: "",
      pesoKg: 0,
      factor: 0,
      tipoEquivalencia: false,
    });

    useTask$(({ track }) => {
      track(() => ini.value);

      if (ini.value === 0) {
        if (props.mercaOUTSelecci.equivalencias.length === 1) {
          console.log("first 1111111111111111111111");
          //  const lencias = props.mercaOUTSelecci.equivalencias;
          const laEqui = props.mercaOUTSelecci.equivalencias[0];
          console.log("laEqui", laEqui);
          equivalencia._id = laEqui._id;
          equivalencia.descripcionEquivalencia = laEqui.descripcionEquivalencia;
          equivalencia.laEquivalencia = laEqui.laEquivalencia;
          equivalencia.idUnidadEquivalencia = laEqui.idUnidadEquivalencia;
          equivalencia.unidadEquivalencia = laEqui.unidadEquivalencia;
          equivalencia.pesoKg = laEqui.pesoKg;
          equivalencia.factor = laEqui.factor;
          equivalencia.tipoEquivalencia = laEqui.tipoEquivalencia;
          if (typeof props.mercaOUTSelecci.precioPEN !== "undefined") {
            console.log(
              "laEquivalencia - factor - tipoEqui",
              parseFloat(laEqui.laEquivalencia.$numberDecimal),
              equivalencia.laEquivalencia,
              equivalencia.factor,
              equivalencia.tipoEquivalencia
            );
            precioEquivalencia.value =
              // parseFloat(props.mercaOUTSelecci.precioPEN.$numberDecimal) *
              parseFloat(props.mercaOUTSelecci.precioPEN.$numberDecimal ? props.mercaOUTSelecci.precioPEN.$numberDecimal : props.mercaOUTSelecci.precioPEN) *
              parseFloat(laEqui.laEquivalencia.$numberDecimal);
          }
          (document.getElementById("in_Cantidad_mercaderiaOUTSeleccionada") as HTMLInputElement)?.focus();
        }
      }
    });
    //#endregion INICIALIZACION

    return (
      <div
        style={{
          width: "clamp(330px, 86%, 800px)",
          // width: 'auto',
          border: "1px solid red",
          padding: "2px",
        }}
        class="container-modal"
      >
        {/* BOTONES DEL MARCO */}
        <div style={{ display: "flex", justifyContent: "end" }}>
          {/* <Button name="T/C" onClick={tipoCambio} /> */}
          <ImgButton
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el formulario"
            onClick={$(() => {
              if (props.contexto === "buscar_mercaderia_out") {
                ctx.mostrarPanelMercaderiaOUTSeleccionada = false;
              }
              if (props.contexto === "kardexs_out") {
                ctx.mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS = false;
              }
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="Cerrar el  props.mercaOUTSelecci"
            onClick={$(() => {
              console.log(" props.mercaOUTSelecci", props.mercaOUTSelecci);
              console.log("elKardex", props.elKardex);
            })}
          />
          {/*   <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="Cerrar el formulario"
            onClick={$(() => {
              console.log('equivalencia', equivalencia);
            })}
          />
         <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="precioEquivalencia.value"
            onClick={$(() => {
              console.log('precioEquivalencia.value', precioEquivalencia.value);
            })}
          /> */}
        </div>
        {/* FORMULARIO */}
        <div class="add-form">
          {/* MERCADERIA  fontWeight: 'lighter' */}
          <div style={{ fontSize: "small" }}>
            {/* <div>Kardex ID:{` ${props.elKardex._id}`}</div> */}
            <div>Código:{` ${props.mercaOUTSelecci.codigo}`}</div>
            <div>Descripción:{` ${props.mercaOUTSelecci.descripcion}`}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div>
                Lote: <strong>{props.elKardex.lote}</strong>
              </div>
              <div>
                Fecha vencimiento: <strong>{formatoDDMMYYYY_PEN(props.elKardex.fechaVencimiento)}</strong>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
              <div>
                Stock:
                <strong style={{ marginLeft: "2px", color: "green" }}>
                  {props.elKardex.cantidadSaldo !== null
                    ? ` ${
                        props.elKardex.cantidadSaldo.$numberDecimal
                          ? redondeo6Decimales(props.elKardex.cantidadSaldo.$numberDecimal)
                          : redondeo6Decimales(props.elKardex.cantidadSaldo)
                      }`
                    : ``}
                  {props.mercaOUTSelecci.unidad !== null ? ` ${props.mercaOUTSelecci.unidad}` : ``}
                </strong>
              </div>
              {props.esAlmacen || props.esProduccion ? (
                <div>
                  Costo Unit.(PEN):
                  <b style={{ marginLeft: "2px" }}>
                    {
                      //props.mercaderiaSeleccionadaOUT.costoUnitarioMovil !== null
                      typeof props.elKardex.costoUnitarioMovil !== "undefined"
                        ? props.elKardex.costoUnitarioMovil.$numberDecimal
                          ? props.elKardex.costoUnitarioMovil.$numberDecimal
                          : props.elKardex.costoUnitarioMovil
                        : ""
                    }
                  </b>
                </div>
              ) : (
                <div>
                  Precio (PEN):
                  <b style={{ marginLeft: "2px" }}>
                    {props.mercaOUTSelecci.precioPEN !== null
                      ? //typeof props.mercaOUTSelecci.precioPEN !== 'undefined'
                        props.mercaOUTSelecci.precioPEN.$numberDecimal
                        ? props.mercaOUTSelecci.precioPEN.$numberDecimal
                        : props.mercaOUTSelecci.precioPEN
                      : ""}
                  </b>
                </div>
              )}
            </div>
          </div>
          <hr style={{ margin: "5px 0 5px 0" }} color={"#aaa"}></hr>
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* EQUIVALENCIA */}
          <div style={{ fontSize: "small", margin: "10px 0", background: "yellow" }}>
            {/* descripcion EQUIVALENCIA */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="inputDescripcionEquivalencia"
                  style={{ width: "100%", background: "#ffff80" }}
                  type="text"
                  disabled={props.esAlmacen}
                  placeholder="Add descripción equivalencia"
                  value={equivalencia.descripcionEquivalencia}
                />
              </div>
            </div>
            {/* cantidad */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_Cantidad_mercaderiaOUTSeleccionada"
                  style={{ width: "100%", textAlign: "end", marginRight: "2px", background: "#ffff80" }}
                  type="number"
                  placeholder="Add cantidad"
                  value={cantidadSacada.value}
                  onChange$={(e) => {
                    cantidadSacada.value = parseFloat((e.target as HTMLInputElement).value);
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === "Enter") {
                      props.esAlmacen || props.esProduccion
                        ? (document.getElementById("btn_Grabar_mercaderiaOUTSeleccionada") as HTMLInputElement).focus()
                        : (document.getElementById("in_PrecioEquivalente_mercaderiaOUTSeleccionada") as HTMLInputElement).focus();
                    }
                  }}
                />
                <ElSelect
                  id={"selectUniEquivalencia_MICE"}
                  registros={props.mercaOUTSelecci.equivalencias}
                  valorSeleccionado={equivalencia.unidadEquivalencia}
                  registroID={"idUnidadEquivalencia"}
                  registroTEXT={"unidadEquivalencia"}
                  seleccione="-- Seleccione equivalencia --"
                  onChange={$(() => {
                    const elSelec = document.getElementById("selectUniEquivalencia_MICE") as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    console.log("ElSelect", elSelec, elIdx, elSelec[elIdx].id);
                    if (elSelec[elIdx].id === "") {
                      equivalencia._id = "";
                      equivalencia.idAuxiliar = 0;
                      equivalencia.descripcionEquivalencia = "";
                      equivalencia.laEquivalencia = 0;
                      equivalencia.idUnidadEquivalencia = "";
                      equivalencia.unidadEquivalencia = "";
                      equivalencia.pesoKg = 0;
                      equivalencia.factor = 0;
                      equivalencia.tipoEquivalencia = false;
                      precioEquivalencia.value = 0;
                    } else {
                      const lencias = props.mercaOUTSelecci.equivalencias;
                      const laEqui = lencias.find(({ idUnidadEquivalencia }: any) => idUnidadEquivalencia === elSelec[elIdx].id);
                      console.log("laEqui", laEqui);
                      console.log("props.mercaOUTSelecci", props.mercaOUTSelecci);
                      equivalencia._id = laEqui._id;
                      equivalencia.descripcionEquivalencia = laEqui.descripcionEquivalencia;
                      equivalencia.laEquivalencia = laEqui.laEquivalencia;
                      equivalencia.idUnidadEquivalencia = laEqui.idUnidadEquivalencia;
                      equivalencia.unidadEquivalencia = laEqui.unidadEquivalencia;
                      equivalencia.pesoKg = laEqui.pesoKg;
                      equivalencia.factor = laEqui.factor;
                      equivalencia.tipoEquivalencia = laEqui.tipoEquivalencia;
                      console.log(
                        "laEquivalencia - factor - tipoEqui",
                        parseFloat(laEqui.laEquivalencia.$numberDecimal),
                        equivalencia.laEquivalencia,
                        equivalencia.factor,
                        equivalencia.tipoEquivalencia
                      );
                      if (props.esAlmacen || props.esProduccion) {
                        //chequear COSTO
                        // const pCUM =
                        //   props.mercaOUTSelecci.promedioCostoUnitarioMovil.$numberDecimal *
                        //   parseFloat(laEqui.laEquivalencia.$numberDecimal);
                        const pCUM = props.elKardex.costoUnitarioMovil.$numberDecimal * equivalencia.laEquivalencia.$numberDecimal;
                        console.log("pCUM", pCUM);
                      } else {
                        //chequear PRECIO
                        if (typeof props.mercaOUTSelecci.precioPEN !== "undefined") {
                          precioEquivalencia.value =
                            // parseFloat(props.mercaOUTSelecci.precioPEN.$numberDecimal) *
                            parseFloat(
                              props.mercaOUTSelecci.precioPEN.$numberDecimal ? props.mercaOUTSelecci.precioPEN.$numberDecimal : props.mercaOUTSelecci.precioPEN
                            ) * parseFloat(laEqui.laEquivalencia.$numberDecimal);
                        }
                      }

                      (document.getElementById("in_Cantidad_mercaderiaOUTSeleccionada") as HTMLInputElement).focus();
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === "Enter") {
                      //  props.esAlmacen
                      //    ? (document.getElementById('btn_Grabar_mercaderiaOUTSeleccionada') as HTMLInputElement).focus()
                      //    : (document.getElementById('in_PrecioEquivalente_mercaderiaOUTSeleccionada') as HTMLInputElement).focus();
                    }
                  })}
                />
              </div>
            </div>
            {/* <hr style={{ margin: "5px 0 5px 0" }} color={"#aaa"}></hr> */}
            <br />
            {/* ------------------------------------------------------------------------------ marginBottom: '5px'*/}

            {equivalencia.laEquivalencia !== null ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", margin: "10px 0" }}>
                <div>
                  Stock equivalente:
                  <strong style={{ marginLeft: "2px", color: "green" }}>
                    {/* {equivalencia.tipoEquivalencia ? ():()} */}
                    {equivalencia.laEquivalencia.$numberDecimal === 0
                      ? ""
                      : equivalencia.idUnidadEquivalencia !== ""
                      ? redondeo6Decimales(props.elKardex.cantidadSaldo.$numberDecimal / equivalencia.laEquivalencia.$numberDecimal)
                      : ""}
                    {equivalencia.unidadEquivalencia !== null ? ` ${equivalencia.unidadEquivalencia}` : ``}
                  </strong>
                </div>
                {/* {props.mercaOUTSelecci.costoUnitarioMovil.$numberDecimal} */}
                {props.esAlmacen || props.esProduccion ? (
                  <div>
                    Costo equiv. (PEN):
                    <strong style={{ marginLeft: "2px", color: "green" }}>
                      {/* {equivalencia.tipoEquivalencia ? ():()} */}
                      {equivalencia.laEquivalencia.$numberDecimal === 0
                        ? ""
                        : equivalencia.idUnidadEquivalencia !== ""
                        ? redondeo6Decimales(props.elKardex.costoUnitarioMovil.$numberDecimal * equivalencia.laEquivalencia.$numberDecimal)
                        : ""}
                    </strong>
                  </div>
                ) : (
                  <div>
                    Precio equiv. (PEN):
                    <input
                      id="in_PrecioEquivalente_mercaderiaOUTSeleccionada"
                      type="number"
                      style={{ marginLeft: "2px", width: "80px", textAlign: "end", background: "#ffff80" }}
                      value={precioEquivalencia.value}
                      onChange$={(e) => {
                        precioEquivalencia.value = parseFloat((e.target as HTMLInputElement).value);
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === "Enter") {
                          (document.getElementById("btn_Grabar_mercaderiaOUTSeleccionada") as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              ""
            )}
          </div>
          {/* GRABAR */}
          <input
            id="btn_Grabar_mercaderiaOUTSeleccionada"
            type="button"
            value="Grabar"
            class="btn-centro"
            onClick$={() => {
              // const tipoImpuesto = ['IGV', 'ISC', 'IVAP', 'exoneradas', 'exportación', 'gratuitas', 'inafecta', 'otrosTributos'];
              // let tipoImpuesto = 'IGV';
              // props.mercaOUTSelecci.exonerado === true ? (tipoImpuesto = 'exoneradas') : '';
              // props.mercaOUTSelecci.inafecto === true ? (tipoImpuesto = 'inafecta') : '';
              if (equivalencia.idUnidadEquivalencia === "") {
                alert("Seleccionar una equivalencia");
                document.getElementById("selectUniEquivalencia_MICE")?.focus();
                return;
              }
              console.log(props.esAlmacen || props.esProduccion ? "💫💫💫💫💫" : "-----");
              const unicoAux = parseInt(elIdAuxiliar());
              if (props.contextoParaDocumento === "new_out_almacen") {
                documento.push({
                  idAuxiliar: unicoAux,
                  idMercaderia: props.mercaOUTSelecci._id,
                  idEquivalencia: equivalencia._id,
                  idKardex: props.elKardex._id,
                  item: 0,
                  tipo: "MERCADERIA",

                  codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : "_",

                  descripcion: props.mercaOUTSelecci.descripcion,
                  descripcionEquivalencia: equivalencia.descripcionEquivalencia,

                  cantidadSacada: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
                  cantidadSacadaEquivalencia: cantidadSacada.value,

                  unidad: props.mercaOUTSelecci.unidad,
                  unidadEquivalencia: equivalencia.unidadEquivalencia,

                  costoUnitarioPEN: parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
                  costoUnitarioEquivalenciaPEN:
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) * parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  subPEN: cantidadSacada.value * parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
                  subEquivalenciaPEN:
                    cantidadSacada.value *
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) *
                    parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  precioUSD: 0,
                  ventaUSD: 0,

                  tipoEquivalencia: equivalencia.tipoEquivalencia,
                  factor: equivalencia.factor,
                  laEquivalencia: equivalencia.laEquivalencia,

                  exonerado: props.mercaOUTSelecci.exonerado,
                  inafecto: props.mercaOUTSelecci.inafecto,
                  sujetoAPercepcion: props.mercaOUTSelecci.sujetoAPercepcion,
                  percepcion: props.mercaOUTSelecci.percepcion,
                });
              }
              if (
                props.contextoParaDocumento === "orden_servicio" ||
                props.contextoParaDocumento === "new_venta" ||
                props.contextoParaDocumento === "new_edit_cotizacion"
              ) {
                documento.push({
                  idAuxiliar: unicoAux,
                  idMercaderia: props.mercaOUTSelecci._id,
                  idEquivalencia: equivalencia._id,
                  idKardex: props.elKardex._id,
                  item: 0,
                  tipo: "MERCADERIA",

                  tipoImpuesto: props.mercaOUTSelecci.tipoImpuesto,
                  tipoAfectacionDelImpuesto: props.mercaOUTSelecci.tipoAfectacionDelImpuesto,
                  porcentaje: parseFloat(props.porcentaje),

                  codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : "_",

                  descripcion: props.mercaOUTSelecci.descripcion,
                  descripcionEquivalencia: equivalencia.descripcionEquivalencia,

                  cantidad: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
                  cantidadEquivalencia: cantidadSacada.value,

                  unidad: props.mercaOUTSelecci.unidad,
                  unidadEquivalencia: equivalencia.unidadEquivalencia,

                  costoUnitarioPEN: parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
                  costoUnitarioEquivalenciaPEN:
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) * parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  //precio = c + IGV
                  precioPEN: precioEquivalencia.value,
                  //venta = k * precio
                  ventaPEN: cantidadSacada.value * precioEquivalencia.value,

                  precioUSD: 0,
                  ventaUSD: 0,
                  tipoEquivalencia: equivalencia.tipoEquivalencia,
                  factor: equivalencia.factor,
                  laEquivalencia: equivalencia.laEquivalencia,

                  exonerado: props.mercaOUTSelecci.exonerado,
                  inafecto: props.mercaOUTSelecci.inafecto,
                  sujetoAPercepcion: props.mercaOUTSelecci.sujetoAPercepcion,
                  percepcion: props.mercaOUTSelecci.percepcion,

                  codigoContableVenta: props.mercaOUTSelecci.codigoContableVenta,
                  descripcionContableVenta: props.mercaOUTSelecci.descripcionContableVenta,
                  tipoContableVenta: props.mercaOUTSelecci.tipoContableVenta,
                });
              }
              if (props.contextoParaDocumento === "orden_produccion") {
                documento.push({
                  idAuxiliar: unicoAux,
                  idMercaderia: props.mercaOUTSelecci._id,
                  idEquivalencia: equivalencia._id,
                  idKardex: props.elKardex._id,
                  item: 0,
                  tipo: "MERCADERIA",

                  tipoImpuesto: props.mercaOUTSelecci.tipoImpuesto,
                  tipoAfectacionDelImpuesto: props.mercaOUTSelecci.tipoAfectacionDelImpuesto,
                  porcentaje: parseFloat(props.porcentaje),

                  codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : "_",

                  descripcion: props.mercaOUTSelecci.descripcion,
                  descripcionEquivalencia: equivalencia.descripcionEquivalencia,

                  cantidad: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
                  cantidadEquivalencia: cantidadSacada.value,

                  unidad: props.mercaOUTSelecci.unidad,
                  unidadEquivalencia: equivalencia.unidadEquivalencia,

                  costoUnitarioPEN: parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
                  costoUnitarioEquivalenciaPEN:
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) * parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  costoEquivalenciaPEN:
                    cantidadSacada.value *
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) *
                    parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  precioUSD: 0,
                  ventaUSD: 0,
                  tipoEquivalencia: equivalencia.tipoEquivalencia,
                  factor: equivalencia.factor,
                  laEquivalencia: equivalencia.laEquivalencia,

                  exonerado: props.mercaOUTSelecci.exonerado,
                  inafecto: props.mercaOUTSelecci.inafecto,
                  sujetoAPercepcion: props.mercaOUTSelecci.sujetoAPercepcion,
                  percepcion: props.mercaOUTSelecci.percepcion,

                  codigoContableVenta: props.mercaOUTSelecci.codigoContableVenta,
                  descripcionContableVenta: props.mercaOUTSelecci.descripcionContableVenta,
                  tipoContableVenta: props.mercaOUTSelecci.tipoContableVenta,
                });
              }
              // ctx.mostrarPanelMercaderiaOUTSeleccionada = false;
              if (props.contexto === "buscar_mercaderia_out") {
                ctx.mostrarPanelMercaderiaOUTSeleccionada = false;
              }
              if (props.contexto === "kardexs_out") {
                ctx.mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS = false;
              }
            }}
          />
        </div>
      </div>
    );
  }
);
