import { $, component$, useContext, useSignal, useStore, useTask$ } from "@builder.io/qwik";
import { loadTiposComprobantePago } from "~/apis/sunat.api";
import { images } from "~/assets";
import { CTX_IN_ALMACEN, CTX_NEW_IN_ALMACEN } from "~/components/inAlmacen/newInAlmacen";
import { CTX_NEW_OUT_ALMACEN, CTX_OUT_ALMACEN } from "~/components/outAlmacen/newOutAlmacen";
import ElSelect from "~/components/system/elSelect";
import ImgButton from "~/components/system/imgButton";
import { elIdAuxiliar, hoy } from "~/functions/comunes";
import type { IDocumento } from "~/interfaces/iDocumento";

export default component$((props: { docSelecci: any; contexto: string }) => {
  //#region DEFINICION DOCUMENTO - NEW  /EDIT
  const documentoIN = useStore<IDocumento>({
    _id: props.docSelecci._id ? props.docSelecci._id : "",
    idAuxiliar: props.docSelecci.idAuxiliar ? props.docSelecci.idAuxiliar : "",
    // tipo: props.docSelecci.tipo ? props.docSelecci.tipo : '',
    codigoTCP: props.docSelecci.codigoTCP ? props.docSelecci.codigoTCP : "",
    descripcionTCP: props.docSelecci.descripcionTCP ? props.docSelecci.descripcionTCP : "",
    serie: props.docSelecci.serie ? props.docSelecci.serie : "",
    numero: props.docSelecci.numero ? props.docSelecci.numero : "", //0,
    fecha: props.docSelecci.fecha ? props.docSelecci.fecha : hoy(),
    lote: props.docSelecci.lote ? props.docSelecci.lote : "",
  });
  //#endregion DEFINICION DOCUMENTO

  //#region CONTEXTOS
  let ctx: any = [];
  let ctxDocumentosAdjuntos: any = [];
  switch (props.contexto) {
    case "new_in_almacen":
      ctxDocumentosAdjuntos = useContext(CTX_IN_ALMACEN).documentosAdjuntos;
      ctx = useContext(CTX_NEW_IN_ALMACEN);
      break;
    case "new_out_almacen":
      ctxDocumentosAdjuntos = useContext(CTX_OUT_ALMACEN).documentosAdjuntos;
      ctx = useContext(CTX_NEW_OUT_ALMACEN);
      break;
    // case 'venta':
    //   ctx = useContext(CTX_DOCS_VENTA);
    //   break;
    // case 'cotizacion':
    //   ctx = useContext(CTX_DOCS_COTIZACION);
    //   break;
  }
  //   const ctx_seleccionar_servicio = useContext(CTX_SELECCIONAR_SERVICIO);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  const LosTCPcargados = useSignal([]);
  //#endregion INICIALIZACION

  //#region CARGAR LOS TCP
  const cargarLosTCP = $(async () => {
    const losTCP = await loadTiposComprobantePago();
    console.log("losTCP", losTCP);
    LosTCPcargados.value = losTCP.data;
    console.log(" LosTCPcargados.value", LosTCPcargados.value);
  });

  useTask$(({ track }) => {
    track(() => ini.value);
    cargarLosTCP();
  });
  //#endregion CARGAR LOS TCP

  //#region REGISTRAR DOCUMENTO
  const registrarDocumentoIN = $(() => {
    if (documentoIN.codigoTCP === "") {
      alert("Seleccione el tipo de comprobante de pago.");
      document.getElementById("se_tcpIN_DOCUMENTO")?.focus();
      return;
    }
    if (documentoIN.fecha === "") {
      alert("Seleccione la fecha del documento.");
      document.getElementById("in_Fecha_DOCUMENTO")?.focus();
      return;
    }
    if (documentoIN.serie === "") {
      alert("Ingrese la serie del documento.");
      document.getElementById("in_Serie_DOCUMENTO")?.focus();
      return;
    }
    if (documentoIN.numero === 0 || documentoIN.numero.toString() === "") {
      alert("Ingrese el número del documento.");
      document.getElementById("in_Numero_DOCUMENTO")?.focus();
      return;
    }

    if (documentoIN.idAuxiliar === "") {
      ctxDocumentosAdjuntos.push({
        idAuxiliar: parseInt(elIdAuxiliar()),
        // tipo: props.docSelecci.tipo ? props.docSelecci.tipo : '',
        codigoTCP: documentoIN.codigoTCP,
        descripcionTCP: documentoIN.descripcionTCP,
        fecha: documentoIN.fecha,
        serie: documentoIN.serie,
        numero: documentoIN.numero,

        lote: documentoIN.lote,
      });

      ctx.mostrarPanelAdjuntarDocumento = false;
    } else {
      const aMod: any = ctxDocumentosAdjuntos.find((docs: any) => docs.idAuxiliar === documentoIN.idAuxiliar);
      console.log("aMod", aMod);

      aMod.codigoTCP = documentoIN.codigoTCP;
      aMod.descripcionTCP = documentoIN.descripcionTCP;
      aMod.fecha = documentoIN.fecha;
      aMod.serie = documentoIN.serie;
      aMod.numero = documentoIN.numero;
      aMod.lote = documentoIN.lote;

      ctx.mostrarPanelAdjuntarDocumento = false;

      // (aMod.descripcionEquivalencia = equivalenciaIN.descripcionEquivalencia),
      //   // laEquivalencia: props.equivaSelecci._id ? props.equivaSelecci._id : '',
      //   (aMod.idUnidadEquivalencia = equivalenciaIN.idUnidadEquivalencia),
      //   (aMod.unidadEquivalencia = equivalenciaIN.unidadEquivalencia),
      //   // pesoKg: props.equivaSelecci._id ? props.equivaSelecci._id : '',
      //   (aMod.factor = equivalenciaIN.factor),
      //   (aMod.tipoEquivalencia = equivalenciaIN.tipoEquivalencia);
    }
  });
  //#endregion REGISTRAR DOCUMENTO

  return (
    <div
      style={{
        width: "clamp(386px, 86%, 600px)",
        // width: 'auto',
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
            ctx.mostrarPanelAdjuntarDocumento = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ fontSize: "0.8rem" }}>Registro de documento</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div>
          {/* TCP */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <ElSelect
                id={"se_tcpIN_DOCUMENTO"}
                valorSeleccionado={documentoIN.descripcionTCP}
                registros={LosTCPcargados.value}
                registroID={"codigo"}
                registroTEXT={"descripcion"}
                seleccione={"-- Seleccione TCP --"}
                onChange={$(() => {
                  // console.log('🎢🎢🎢🎢🎢🎢🎢🎢🎢🎢');
                  const elSelec = document.getElementById("se_tcpIN_DOCUMENTO") as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  // console.log('?', elIdx, elSelec[elIdx].id);
                  documentoIN.codigoTCP = elSelec[elIdx].id;
                  if (documentoIN.codigoTCP === "") {
                    documentoIN.descripcionTCP = "";
                  } else {
                    documentoIN.descripcionTCP = elSelec.value;
                    // obtenerUnidades(definicion_CTX_MERCADERIA_IN.idLineaTipo);
                  }
                })}
                onKeyPress={$((e: any) => {
                  if (e.key === "Enter") {
                    (document.getElementById("in_Fecha_DOCUMENTO") as HTMLSelectElement)?.focus();
                  }
                })}
              />
            </div>
          </div>
          {/* Fecha */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_Fecha_DOCUMENTO"
                style={{ width: "100%" }}
                type="date"
                autoFocus
                placeholder="Add fecha"
                value={documentoIN.fecha}
                onInput$={(e) => {
                  documentoIN.fecha = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("in_Serie_DOCUMENTO") as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* Serie */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_Serie_DOCUMENTO"
                style={{ width: "100%" }}
                type="text"
                autoFocus
                placeholder="Add serie"
                value={documentoIN.serie}
                onInput$={(e) => {
                  documentoIN.serie = (e.target as HTMLInputElement).value.trim().toUpperCase();
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("in_Numero_DOCUMENTO") as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>
          {/* Número */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <input
                id="in_Numero_DOCUMENTO"
                style={{ width: "100%" }}
                type="number"
                placeholder="Add número"
                value={documentoIN.numero}
                onChange$={(e) => {
                  documentoIN.numero = parseFloat((e.target as HTMLInputElement).value.trim());
                }}
                onKeyPress$={(e) => {
                  if (e.key === "Enter") {
                    (document.getElementById("bu_RegistrarDocumentoIN_DOCUMENTO") as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div>

          {/* Lote */}
          {/* <div class="form-control">
            <label>Lote</label>
            <div class="form-control form-agrupado">
              <input
                id="inputLote_MICE"
                style={{ width: '100%' }}
                type="text"
                placeholder="Add lote"
                // value={servicio.precioPEN}
                // onChange$={(e) => {
                //   servicio.precioPEN = parseFloat((e.target as HTMLInputElement).value.trim());
                // }}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('buttonRegistrarServicio') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
          </div> */}
        </div>

        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          id="bu_RegistrarDocumentoIN_DOCUMENTO"
          type="button"
          value={"Registrar"} //REGISTRAR // SELECCIONAR // ACTUALIZAR
          // value={botonGrabar === '' ? 'Grabar' : `${botonGrabar}`}
          class="btn-centro"
          onClick$={() => registrarDocumentoIN()}
        />
      </div>
    </div>
  );
});
