import { $, component$, useContext, useSignal, useStyles$, useTask$ } from "@builder.io/qwik";
import { images } from "~/assets";
import { CTX_IN_ALMACEN } from "~/components/inAlmacen/newInAlmacen";
import ImgButton from "~/components/system/imgButton";
import { CTX_BUSCAR_MERCADERIA_IN } from "./buscarMercaderiaIN";
import { elIdAuxiliar, formatear_6Decimales } from "~/functions/comunes";
import { CTX_KARDEXS_IN } from "./kardexsIN";
import styleFormulario from "../../../routes/login/login.css?inline";

export default component$(
  (props: { mercaINSelecci: any; elKardex: any; esAlmacen: boolean; contexto: string; contextoParaDocumento: string; igv: number; motivo?: string }) => {
    useStyles$(styleFormulario);

    //#region CONTEXTOS
    let documento: any = [];
    switch (props.contextoParaDocumento) {
      case "new_in_almacen":
        documento = useContext(CTX_IN_ALMACEN).itemsMercaderias;
        break;
    }

    // const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
    let ctx: any = [];
    switch (props.contexto) {
      case "buscar_mercaderia_in":
        ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
        break;
      case "kardexs_in":
        ctx = useContext(CTX_KARDEXS_IN);
        break;
    }
    //#endregion CONTEXTOS

    //#region INICIALIZANDO
    const ini = useSignal(0);
    const lote = useSignal("");
    const fechaVencimiento = useSignal("");
    const cantidad = useSignal(1);
    const costo = useSignal(0);
    const precio = useSignal(0);
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
        console.log("💫💫💫💫💫💫💫💫");
        if (props.motivo === "APERTURA DE INVENTARIO") {
          costo.value = props.mercaINSelecci.costoDeInicioPEN.$numberDecimal;
          if (elIGV.value === 0) {
            precio.value = costo.value;
          } else {
            precio.value = costo.value * IGVCalculado.value;
          }
        }
        costo.value;
        ini.value++;
      }
    });
    //#endregion INICIALIZACION

    //#region calcularCosto();
    const calcularCosto = $(() => {
      if (elIGV.value === 0) {
        costo.value = precio.value * 1;
      } else {
        costo.value = precio.value / IGVCalculado.value;
      }
    });
    //#endregion calcularCosto();

    //#region calcularPrecio();
    const calcularPrecio = $(() => {
      if (elIGV.value === 0) {
        precio.value = costo.value;
      } else {
        precio.value = costo.value * IGVCalculado.value;
      }
    });
    //#endregion calcularPrecio();

    return (
      <div
        style={{
          width: "clamp(330px, 86%, 540px)",
          // width: 'auto',
          border: "1px solid red",
          padding: "2px",
        }}
        class="container-modal"
      >
        {/* BOTONES DEL MARCO */}
        <div style={{ display: "flex", justifyContent: "end" }}>
          <ImgButton
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el formulario"
            onClick={$(() => {
              if (props.contexto === "buscar_mercaderia_in") {
                ctx.mostrarPanelMercaderiaINSeleccionada = false;
              }
              if (props.contexto === "kardexs_in") {
                ctx.mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS = false;
              }

              // ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = false;
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={16}
            width={16}
            title="Ver props.mercaINSelecci"
            onClick={$(() => console.log("props.mercaINSelecci", props.mercaINSelecci))}
          />
        </div>
        {/* FORMULARIO */}
        <div class="add-form">
          {/* MERCADERIA */}
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              Kardex00:
              <b>{typeof props.elKardex._id !== "undefined" ? " " + props.elKardex._id : ""}</b>
            </div>
            <div class="linea-formulario">
              <label>Códigooo</label>
              <div>{props.mercaINSelecci.codigo}</div>
              {/* <b>{` ${props.mercaINSelecci.codigo} `}</b> */}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              Código:<b>{` ${props.mercaINSelecci.codigo} `}</b>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              Descripción:<b>{` ${props.mercaINSelecci.descripcion}`}</b>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              Linea/Tipo:<b>{` ${props.mercaINSelecci.lineaTipo}`}</b>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              IGV:<u>{` ${elIGV.value} %`}</u>
            </div>
            {/* Stock: */}
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              Stock:
              <strong style={{ color: "green" }}>
                {typeof props.elKardex.cantidadSaldo !== "undefined" && props.elKardex.cantidadSaldo !== null
                  ? ` ${props.elKardex.cantidadSaldo.$numberDecimal ? props.elKardex.cantidadSaldo.$numberDecimal : props.elKardex.cantidadSaldo}`
                  : ``}
                {props.mercaINSelecci.unidad !== null ? ` ${props.mercaINSelecci.unidad}` : ``}
              </strong>
            </div>
            {props.mercaINSelecci.conFechaVencimientoLote ? (
              props.elKardex._id !== "" ? (
                <>
                  {/* Lote: */}
                  <div style={{ margin: "4px 0" }}>
                    Lote:
                    <input
                      id="in_Lote_MICE"
                      style={{ width: "120px", textAlign: "end" }}
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
                        if (e.key === "Enter") {
                          (document.getElementById("in_Fecha_Vencimiento_MICE") as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                  {/* Fecha Vencimiento: */}
                  <div style={{ margin: "4px 0" }}>
                    Fecha Vencimiento:
                    <input
                      id="in_Fecha_Vencimiento_MICE"
                      style={{ width: "120px", textAlign: "end" }}
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
                        if (e.key === "Enter") {
                          (document.getElementById("in_Cantidad_MICE") as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Lote: */}
                  <div style={{ margin: "4px 0" }}>
                    Lote:{" "}
                    <input
                      id="in_Lote_MICE"
                      style={{ width: "120px", textAlign: "end" }}
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
                        if (e.key === "Enter") {
                          (document.getElementById("in_Fecha_Vencimiento_MICE") as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                  {/* Fecha Vencimiento: */}
                  <div style={{ margin: "4px 0" }}>
                    Fecha Vencimiento:{" "}
                    <input
                      id="in_Fecha_Vencimiento_MICE"
                      style={{ width: "120px", textAlign: "end" }}
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
                        if (e.key === "Enter") {
                          (document.getElementById("in_Cantidad_MICE") as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                </>
              )
            ) : (
              ""
            )}
            {/* Cantidad: */}
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              Cantidad:
              <input
                id="in_Cantidad_MICE"
                style={{ width: "120px", textAlign: "end" }}
                type="number"
                autoFocus
                placeholder="Add cantidad"
                value={cantidad.value}
                onChange$={(e) => {
                  cantidad.value = parseFloat((e.target as HTMLInputElement).value);
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("in_CostoPEN_MICE") as HTMLInputElement).focus();
                  }
                }}
              />
            </div>
            {/* Costo (PEN): */}
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              Costo Uni (PEN):
              <input
                id="in_CostoPEN_MICE"
                style={{ width: "120px", textAlign: "end" }}
                type="number"
                placeholder="Add costo"
                value={formatear_6Decimales(costo.value)}
                onChange$={(e) => {
                  costo.value = parseFloat((e.target as HTMLInputElement).value);
                  calcularPrecio();
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("in_PrecioPEN_MICE") as HTMLInputElement).focus();
                  }
                }}
              />
            </div>
            {/* Precio (PEN): */}
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", margin: "4px 0" }}>
              Valor Uni (PEN):
              <input
                id="in_PrecioPEN_MICE"
                style={{ width: "120px", textAlign: "end" }}
                type="number"
                placeholder="Add precio"
                value={formatear_6Decimales(precio.value)}
                onChange$={(e) => {
                  precio.value = parseFloat((e.target as HTMLInputElement).value);

                  calcularCosto();
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("btn_Registrar_MercaderiaIN_MICE") as HTMLInputElement).focus();
                  }
                }}
              />
            </div>
          </div>
          {/* <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr> */}
          {/* GRABAR */}
          <input
            id="btn_Registrar_MercaderiaIN_MICE"
            type="button"
            value="Grabar "
            class="btn-centro"
            onClick$={() => {
              documento.push({
                idAuxiliar: parseInt(elIdAuxiliar()),
                idMercaderia: props.mercaINSelecci._id,
                idKardex: props.elKardex._id,
                item: 0,

                codigo: props.mercaINSelecci.codigo ? props.mercaINSelecci.codigo : "_",

                descripcion: props.mercaINSelecci.descripcion,

                IGV: elIGV.value,

                cantidadIngresada: cantidad.value,

                unidad: props.mercaINSelecci.unidad,

                costoUnitarioPEN: costo.value,

                subPEN: cantidad.value * costo.value,

                valorUnitarioPEN: precio.value,
                totPEN: cantidad.value * precio.value,
              });
              if (props.contexto === "buscar_mercaderia_in") {
                ctx.mostrarPanelMercaderiaINSeleccionada = false;
              }
              if (props.contexto === "kardexs_in") {
                ctx.mostrarPanelMercaderiaINSeleccionada_DesdeKARDEXS = false;
              }
            }}
          />
        </div>
      </div>
    );
  }
);
