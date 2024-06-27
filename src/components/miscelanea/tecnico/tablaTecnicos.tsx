import { Resource, component$, useContext, useResource$, useStyles$ } from "@builder.io/qwik";
import style from "../../tabla/tabla.css?inline";
import { CTX_BUSCAR_TECNICO } from "./buscarTecnico";
import { parametrosGlobales } from "~/routes/login";
// import ImgButton from '~/components/system/imgButton';
import { images } from "~/assets";
import type { ITecnico } from "~/interfaces/iPersona";
import { CTX_NEW_EDIT_ORDEN_SERVICIO } from "~/components/ordenServicio/newEditOrdenServicio";
import { CTX_NEW_EDIT_ORDEN_PRODUCCION } from "~/components/ordenProduccion/newEditOrdenProduccion";

export default component$((props: { buscarTecnico: number; contexto: string }) => {
  useStyles$(style);

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case "orden_servicio":
      ctx = useContext(CTX_NEW_EDIT_ORDEN_SERVICIO);
      // documento = useContext(CTX_O_S);
      break;
    case "orden_produccion":
      ctx = useContext(CTX_NEW_EDIT_ORDEN_PRODUCCION);
      // documento = useContext(CTX_O_S);
      break;
  }
  const ctx_buscar_tecnico = useContext(CTX_BUSCAR_TECNICO);
  //#endregion CONTEXTOS

  //#region BUSCANDO REGISTROS
  const losTecnicos = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => props.buscarTecnico.valueOf());

    const abortController = new AbortController();
    cleanup(() => abortController.abort("cleanup"));

    console.log("buscarTecnico:::...", props.buscarTecnico);

    if (ctx_buscar_tecnico.buscarPor === "Nombre / Razón social") {
      console.log("Nombre:::...");
      const res = await fetch(import.meta.env.VITE_URL + "/api/tecnico/obtenerTecnicosPorNombre", {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_tecnico.buscarPor,
          cadenaABuscar: ctx_buscar_tecnico.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
    if (ctx_buscar_tecnico.buscarPor === "DNI / RUC") {
      console.log("DNI:::...");
      const res = await fetch(import.meta.env.VITE_URL + "/api/tecnico/obtenerTecnicosPorDni", {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/persona/obtenerPersonasPorDniRuc', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
          idEmpresa: parametrosGlobales.idEmpresa,
          buscarPor: ctx_buscar_tecnico.buscarPor,
          cadenaABuscar: ctx_buscar_tecnico.conceptoABuscar,
        }),
        signal: abortController.signal,
      });
      return res.json();
    }
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <Resource
      value={losTecnicos}
      onPending={() => {
        console.log("onPending 🍉🍉🍉🍉");
        return <div>Cargando...</div>;
      }}
      onRejected={() => {
        console.log("onRejected 🍍🍍🍍🍍");
        return <div>Fallo en la carga de datos</div>;
      }}
      onResolved={(personas) => {
        console.log("onResolved 🍓🍓🍓🍓");
        const { data } = personas; //{ status, data, message }
        const misPersonas: ITecnico[] = data;
        return (
          <>
            {misPersonas.length > 0 ? (
              <>
                <table style={{ fontSize: "0.8rem", fontWeight: "lighter" }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Tipo</th>
                      <th>Número</th>
                      <th>Razón social / Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misPersonas.map((persoLocali, index) => {
                      const { _id, tipoDocumentoIdentidad, numeroIdentidad, razonSocialNombre } = persoLocali;
                      const indexItem = index + 1;
                      return (
                        <tr key={_id}>
                          <td data-label="Ítem">{indexItem}</td>
                          <td data-label="Tipo">{tipoDocumentoIdentidad}</td>
                          <td data-label="Número">{numeroIdentidad}</td>
                          <td data-label="R.Soc/Nomb">{razonSocialNombre}</td>
                          <td data-label="Acciones" class="acciones">
                            <input
                              // id="in_BuscarDetraccion"
                              type="image"
                              src={images.check32}
                              title="Seleccionar técnico"
                              height={14}
                              width={14}
                              style={{ marginRight: "4px" }}
                              // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                              onClick$={() => {
                                ctx.selecciono_Tecnico = true;

                                ctx.mostrarPanelBuscarTecnico = false;
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
                                // console.log('ctx', ctx);
                                // console.log('selecion', persoLocali);
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
