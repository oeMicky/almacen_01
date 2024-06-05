import { Resource, component$, useContext, useResource$, useStyles$ } from "@builder.io/qwik";
import style from "../../tabla/tabla.css?inline";
import { parametrosGlobales } from "~/routes/login";
// import ImgButton from '~/components/system/imgButton';
import { images } from "~/assets";
import type { IChofer } from "~/interfaces/iPersona";
import { CTX_GUIA_REMISION, CTX_NEW_EDIT_GUIA_REMISION } from "~/components/guiaRemision/newEditGuiaRemision";
import { CTX_BUSCAR_CHOFER } from "./buscarChofer";
// import { elIdAuxiliar } from '~/functions/comunes';

export default component$((props: { buscarChofer: number; contexto: string }) => {
  useStyles$(style);

  //#region CONTEXTOS
  let ctx: any = [];
  let documento: any = [];
  switch (props.contexto) {
    case "new_edit_guiaRemision":
      ctx = useContext(CTX_NEW_EDIT_GUIA_REMISION);
      documento = useContext(CTX_GUIA_REMISION).choferes;
      break;
  }
  const ctx_buscar_chofer = useContext(CTX_BUSCAR_CHOFER);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losChoferes = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarChofer.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort("cleanup"));

    console.log("buscarChofer:::...", props.buscarChofer);

    if (ctx_buscar_chofer.buscarPor === "Nombre / Razón social") {
      console.log("Nombre:::...");
      const res = await fetch(import.meta.env.VITE_URL + "/api/chofer/obtenerChoferesPorNombre", {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_chofer.buscarPor,
          cadenaABuscar: ctx_buscar_chofer.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (ctx_buscar_chofer.buscarPor === "DNI / RUC") {
      console.log("DNI:::...");
      const res = await fetch(import.meta.env.VITE_URL + "/api/chofer/obtenerChoferesPorDni", {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_chofer.buscarPor,
          cadenaABuscar: ctx_buscar_chofer.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={losChoferes}
      onPending={() => {
        console.log("onPending 🍉🍉🍉🍉");
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log("onRejected 🍍🍍🍍🍍");
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(choferes) => {
        console.log("onResolved 🍓🍓🍓🍓", choferes);
        const { data } = choferes; //{ status, data, message }
        const misChoferes: IChofer[] = data;
        return (
          <>
            {misChoferes.length > 0 ? (
              <>
                <table style={{ fontSize: "0.8rem", fontWeight: "lighter" }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Tipo</th>
                      <th>Número</th>
                      <th>Razón social / Nombre</th>
                      <th>Licencia</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misChoferes.map((persoLocali, index) => {
                      const { _id, codigoTipoDocumentoIdentidad, tipoDocumentoIdentidad, numeroIdentidad, razonSocialNombre, licencia } = persoLocali;
                      const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Tipo">{tipoDocumentoIdentidad}</td>
                          <td data-label="Número">{numeroIdentidad}</td>
                          <td data-label="R.Soc/Nomb">{razonSocialNombre}</td>
                          <td data-label="Licencia">{licencia}</td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar chofer"
                              height={14}
                              width={14}
                              style={{ marginRight: "4px" }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                if (typeof licencia === "undefined" || licencia.trim() === "") {
                                  alert("No presenta la licencia.");
                                  return;
                                }

                                documento.push({
                                  // idAuxiliar: elIdAuxiliar(),
                                  codigoTipoDocumentoIdentidad: codigoTipoDocumentoIdentidad,
                                  tipoDocumentoIdentidad: tipoDocumentoIdentidad,
                                  numeroIdentidad: numeroIdentidad,
                                  razonSocialNombre: razonSocialNombre,
                                  licencia: licencia,
                                  tipo: true,
                                });
                                ctx.selecciono_Chofer = true;
                                ctx.mostrarPanelBuscarChofer = false;
                              }}
                            />
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.edit}
                              title="Editar persona"
                              height={14}
                              width={14}
                              // style={{ padding: '2px' }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                // ctx_buscar_persona.pP = persoLocali;
                                // ctx_buscar_persona.mostrarPanelNewEditPersona = true;
                                console.log("ctx", ctx);
                                console.log("selecion", persoLocali);
                                ctx_buscar_chofer.cH = persoLocali;
                                ctx_buscar_chofer.mostrarPanelEditChofer = true;
                              }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <div>
                <i style={{ fontSize: "0.8rem" }}>No se encontraron registros</i>
              </div>
            )}
          </>
        );
      }}
    />
  );
});
