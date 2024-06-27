import { $, component$, createContextId, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import { images } from "~/assets";
import Servicio2024 from "~/components/indexPrincipal/servicio2024";
import Spinner from "~/components/system/spinner";
import { parametrosGlobales } from "~/routes/login";
import CambioClave from "~/components/usuario/cambioClave";

export const CTX_SELECCIONAR_SERVICIO = createContextId<any>("__seleccionar_servicio");

export default component$(() => {
  //#region definicion_CTX_SELECCIONAR_SERVICIO
  const definicion_CTX_SELECCIONAR_SERVICIO = useStore({
    actualizo_Contrasena: false,
    mostrarPanelCambiarClave: false,
  });
  useContextProvider(CTX_SELECCIONAR_SERVICIO, definicion_CTX_SELECCIONAR_SERVICIO);
  //#endregion definicion_CTX_SELECCIONAR_SERVICIO

  //#region INICIALIZAR
  const navegarA = useNavigate();
  const mostrarSpinner = useSignal(false);
  //#endregion INICIALIZAR

  return (
    <div class="container">
      {/* <button
        onClick$={() => {
          console.log('parametros globales', parametrosGlobales);
        }}
      >
        paramtre
      </button> */}
      <h2 style={{ paddingLeft: "16px" }}>BIENVENIDO AL SISTEMA</h2>
      <b style={{ paddingLeft: "24px" }}>
        <img src={images.user} width={16} height={16} style={{ marginRight: "8px" }} />
        <label style={{ marginRight: "8px" }}>{parametrosGlobales.usuario}</label>
        <button
          onClick$={() => {
            if (parametrosGlobales.usuario !== "") {
              definicion_CTX_SELECCIONAR_SERVICIO.mostrarPanelCambiarClave = true;
            }
          }}
        >
          Cambiar clave
        </button>
      </b>
      {definicion_CTX_SELECCIONAR_SERVICIO.mostrarPanelCambiarClave && (
        <div class="modal">
          <CambioClave />
        </div>
      )}
      <p style={{ paddingLeft: "24px", fontSize: "0.8rem" }}>
        <img src={images.buildings} width={16} height={16} style={{ marginRight: "8px" }} />
        {parametrosGlobales.RazonSocial}
      </p>
      <p style={{ paddingLeft: "24px", fontSize: "0.8rem" }}>
        <img src={images.sucursal} width={16} height={16} style={{ marginRight: "8px" }} />
        {parametrosGlobales.sucursal}
      </p>
      {/* SERVICIOS <img src={images.facturas} width={16} height={16}></img> */}
      <section id="servicios" class="seccion-servicios">
        <h2 style={{ marginLeft: "16px" }}>SERVICIOS</h2>
        <div class="servicios">
          {/* <input type="button">
            <label>gsdf</label>
          </input> */}
          <Servicio2024
            imagen={images.facturasOscuro}
            imagenDisable={images.facturasDisable}
            titulo="Factura electrónica"
            parrafo="Una manera intuitiva y segura de facturar."
            cursorMano={parametrosGlobales.facturaElectronica}
            onClick={$(() => {
              mostrarSpinner.value = true;
              navegarA("/venta");
            })}
          />
          <Servicio2024
            imagen={images.guiasClaro}
            imagenDisable={images.guiasDisable}
            titulo="Guía electrónica"
            parrafo="Las guías electrónicas para asegurar el traslado de los bienes."
            cursorMano={parametrosGlobales.guiaElectronica}
            onClick={$(() => {
              mostrarSpinner.value = true;
              navegarA("/guiaRemision");
            })}
          />
          <Servicio2024
            imagen={images.SIRE_IIOscuro}
            imagenDisable={images.SIRE_IIDisable}
            titulo="SIRE"
            parrafo="Sistema integrado de registros electronicos."
            cursorMano={parametrosGlobales.SIRE}
            // onClick={$(() => {
            //   navegarA('/guiaRemision');
            // })}
          />
          <Servicio2024
            imagen={images.comprasClaro}
            imagenDisable={images.comprasDisable}
            titulo="Compras"
            parrafo="Un ambiente para gestionar tus compras."
            cursorMano={parametrosGlobales.compras}
            onClick={$(() => {
              mostrarSpinner.value = true;
              navegarA("/compra");
            })}
          />
          <Servicio2024
            imagen={images.inventarioOscuro}
            imagenDisable={images.inventarioDisable}
            titulo="Inventario"
            parrafo="Sofisticada herramienta para el control de inventarios."
            cursorMano={parametrosGlobales.inventario}
            onClick={$(() => {
              mostrarSpinner.value = true;
              navegarA("/inAlmacen");
            })}
          />
          <Servicio2024
            imagen={images.ordenesServicioClaro}
            imagenDisable={images.ordenesServicioDisable}
            titulo="Ordenes de producción"
            parrafo="Herramienta para el control para la producción."
            cursorMano={parametrosGlobales.ordenesProduccion}
            onClick={$(() => {
              mostrarSpinner.value = true;
              navegarA("/ordenProduccion");
            })}
          />
          <Servicio2024
            imagen={images.ordenesServicioClaro}
            imagenDisable={images.ordenesServicioDisable}
            titulo="Ordenes de servicio"
            parrafo="Herramienta para el control de los servicios."
            cursorMano={parametrosGlobales.ordenesServicio}
            onClick={$(() => {
              mostrarSpinner.value = true;
              navegarA("/ordenServicio");
            })}
          />
          <Servicio2024
            imagen={images.seguimientoCostoOscuro}
            imagenDisable={images.seguimientoCostoDisable}
            titulo="Seguimiento de costos"
            parrafo="Herramienta para el control y seguimiento de costos."
            cursorMano={parametrosGlobales.seguimientoCosto}
            // onClick={$(() => {
            //   mostrarSpinner.value = true;
            //   navegarA('/ordenServicio');
            // })}
          />
          <Servicio2024
            imagen={images.bancosClaro}
            imagenDisable={images.bancosDisable}
            titulo="Bancos"
            parrafo="Para llevar el control de tus ingresos y egresos."
            cursorMano={parametrosGlobales.bancos}
          />
          <Servicio2024
            imagen={images.planillaOscuro}
            imagenDisable={images.planillaDisable}
            titulo="Planilla"
            parrafo="Controlar tu planilla de tu personal."
            cursorMano={parametrosGlobales.planilla}
          />
          <Servicio2024
            imagen={images.libroDiarioClaro}
            imagenDisable={images.libroDiarioDisable}
            titulo="Libro diario"
            parrafo="Tus hechos economicos siempre se registraran."
            cursorMano={parametrosGlobales.libroDiario}
          />
        </div>
      </section>

      <br />
      <button
        style={{ padding: "20px 40px", borderRadius: "8px", marginLeft: "16px", marginBottom: "16px" }}
        onClick$={() => {
          navegarA("/");
        }}
      >
        Logout
      </button>
      {/* MOSTRAR SPINNER */}
      {mostrarSpinner.value && (
        <div class="modal" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Spinner />
        </div>
      )}
    </div>
  );
});
