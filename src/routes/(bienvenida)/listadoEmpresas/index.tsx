import { component$, createContextId, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda } from '~/functions/comunes';
import styles from '../../../components/tabla/tabla.css?inline';
import ListadoSucursalesModal from '~/components/miscelanea/sucursal/listadoSucursalesModal';
import { useNavigate } from '@builder.io/qwik-city';
import { getActivoGEEMP, getActivoGEEMPSUCUR, getPeriodos } from '~/apis/grupoEmpresarial.api';
import { parametrosGlobales } from '~/routes/login';

export const CTX_LISTADO_EMPRESAS = createContextId<any>('listado_empresas');

export default component$(() => {
  useStyles$(styles);
  // const navegarA = useNavigate();

  //#region definicion_CTX_LISTADO_EMPRESAS
  const definicion_CTX_LISTADO_EMPRESAS = useStore({
    eE: [],
    mostrarPanelListadoSucursales: false,
  });
  useContextProvider(CTX_LISTADO_EMPRESAS, definicion_CTX_LISTADO_EMPRESAS);
  //#endregion definicion_CTX_LISTADO_EMPRESAS

  //#region INICIAIZACION
  const ini = useSignal(0);
  const lasEmpresas = useSignal<any>([]);
  const navegarA = useNavigate();

  useTask$(({ track }) => {
    track(() => ini.value);
    console.log('LISTADO EMPRESAS');
    // console.log('ingreso a INI', sessionStorage.getItem('SUCURSALES'));
    // lasEmpresas.value = JSON.parse(sessionStorage.SUCURSALES_ADJUNTAS);
    lasEmpresas.value = parametrosGlobales.sucursalesAdjuntas;
    console.log('first lasEmpresas.value ', lasEmpresas.value);
  });
  //#endregion INICIAIZACION

  return (
    <>
      <div class="container">
        <h2>BIENVENIDO AL SISTEMA</h2>
        <p>{sessionStorage.getItem('usuario')}</p>
        <p>Seleccione una empresa.</p>
        {/* <button onClick$={() => console.log('definicion_CTX_LISTADO_EMPRESAS', definicion_CTX_LISTADO_EMPRESAS)}>dsf</button> */}
        {definicion_CTX_LISTADO_EMPRESAS.mostrarPanelListadoSucursales && (
          <div class="modal">
            <ListadoSucursalesModal />
          </div>
        )}
        <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
          <thead>
            <tr>
              <th>Ítem</th>
              <th>Grupo empresarial</th>
              <th>Empresa</th>
              <th>Acciones EEE</th>
            </tr>
          </thead>
          <tbody>
            {lasEmpresas.value.map((empre: any, index: number) => {
              const indexItemVenta = index + 1;

              return (
                <tr key={indexItemVenta}>
                  <td data-label="Ítem" key={indexItemVenta}>{`${cerosALaIzquierda(indexItemVenta, 3)}`}</td>
                  <td data-label="Grupo empresarial">{empre.grupoEmpresarial}</td>
                  <td data-label="Empresa">{empre.empresa}</td>
                  <td data-label="Acciones" class="acciones">
                    <input
                      // id="in_BuscarDetraccion"
                      type="image"
                      src={images.check32}
                      title="Seleccionar empresa"
                      height={14}
                      width={14}
                      // style={{ padding: '2px' }}
                      // onFocusin$={() => console.log('☪☪☪☪☪☪')}
                      onClick$={async () => {
                        if (empre.sucursales.length === 1) {
                          console.log(
                            'UNA UNICA SUCURSAL empre.sucursales.length === 1',
                            empre.idGrupoEmpresarial,
                            empre.idEmpresa,
                            empre.sucursales[0]._id
                          );
                          //UNA UNICA SUCURSAL
                          let activo = await getActivoGEEMPSUCUR({
                            idGrupoEmpresarial: empre.idGrupoEmpresarial,
                            idEmpresa: empre.idEmpresa,
                            idSucursal: empre.sucursales[0]._id,
                          });
                          activo = activo.data;
                          console.log('activo', activo);
                          if (!activo[0].activoGE) {
                            alert(
                              `El grupo empresarial ${empre.grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
                            );
                            return;
                          }
                          if (!activo[0].activoEMP) {
                            alert(`La empresa ${empre.empresa} esta inactiva. Pongase en contacto con el administrador.`);
                            return;
                          }
                          if (!activo[0].activoSUCUR) {
                            alert(
                              `La sucursal ${empre.sucursales[0].sucursal} esta inactiva. Pongase en contacto con el administrador.`
                            );
                            return;
                          }
                          console.log('empre', empre);
                          // sessionStorage.setItem('idGrupoEmpresarial', empre.idGrupoEmpresarial);
                          // sessionStorage.setItem('grupoEmpresarial', empre.grupoEmpresarial);
                          // sessionStorage.setItem('idEmpresa', empre.idEmpresa);
                          // sessionStorage.setItem('empresa', empre.empresa);
                          // sessionStorage.setItem('numeroIdentidad', empre.numeroIdentidad);

                          // sessionStorage.setItem('idSucursal', empre.sucursales[0].idSucursal);
                          // sessionStorage.setItem('sucursal', empre.sucursales[0].sucursal);
                          // sessionStorage.setItem('almacenActivo', empre.sucursales[0].almacenActivo);
                          parametrosGlobales.idGrupoEmpresarial = empre.idGrupoEmpresarial;
                          parametrosGlobales.nombreGrupoEmpresarial = empre.grupoEmpresarial;
                          parametrosGlobales.idEmpresa = empre.idEmpresa;
                          parametrosGlobales.RazonSocial = empre.empresa;
                          parametrosGlobales.RUC = empre.numeroIdentidad;
                          parametrosGlobales.Direccion = empre.direccion;

                          parametrosGlobales.idSucursal = empre.sucursales[0].idSucursal;
                          parametrosGlobales.sucursal = empre.sucursales[0].sucursal;
                          parametrosGlobales.idAlmacen = empre.sucursales[0].idSucursal; //********* */
                          parametrosGlobales.almacenActivo = activo[0].almacenActivo;
                          parametrosGlobales.colorHeaderEmpresarial = activo[0].colorHeaderEmpresarial;
                          parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
                          parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
                          parametrosGlobales.facturacionElectronica = activo[0].facturacionElectronica;
                          parametrosGlobales.facturacionElectronicaAutomatica = activo[0].facturacionElectronicaAutomatica;
                          parametrosGlobales.facturaJSON = activo[0].facturaJSON;
                          parametrosGlobales.facturaXML = activo[0].facturaXML;
                          parametrosGlobales.contabilizarOperaciones = activo[0].contabilizarOperaciones;
                          parametrosGlobales.planesContables = activo[0].planesContables;
                          parametrosGlobales.asientoCompra = activo[0].asientoCompra;
                          parametrosGlobales.asientoVenta = activo[0].asientoVenta;
                          parametrosGlobales.codigoContableVentaServicio = activo[0].codigoContableVentaServicio;
                          parametrosGlobales.descripcionContableVentaServicio = activo[0].descripcionContableVentaServicio;
                          parametrosGlobales.idLibroDiario = activo[0].idLibroDiario;
                          parametrosGlobales.idEjercicio = activo[0].idEjercicio;
                          parametrosGlobales.ejercicio = activo[0].ejercicio;
                          const losPeri = await getPeriodos({
                            idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                            idEmpresa: parametrosGlobales.idEmpresa,
                            bandera: '',
                          });
                          parametrosGlobales.periodos = losPeri.data;
                          //PAGINA DE INICIO
                          if (parametrosGlobales.almacenActivo) {
                            navegarA(parametrosGlobales.paginaInicioDelSistema);
                          } else {
                            if (
                              parametrosGlobales.paginaInicioDelSistema === '/inAlmacen' ||
                              parametrosGlobales.paginaInicioDelSistema === '/outAlmacen' ||
                              parametrosGlobales.paginaInicioDelSistema === '/kardex'
                            ) {
                              navegarA(parametrosGlobales.paginaInicioDefault);
                            } else {
                              navegarA(parametrosGlobales.paginaInicioDelSistema);
                            }
                          }
                        } else {
                          console.log(
                            'VARIAS SUCURSALES',
                            empre.idGrupoEmpresarial,
                            empre.idEmpresa
                            // empre.sucursales[0].idSucursal
                          );
                          //VARIAS SUCURSALES
                          let activo = await getActivoGEEMP({
                            idGrupoEmpresarial: empre.idGrupoEmpresarial,
                            idEmpresa: empre.idEmpresa,
                          });
                          activo = activo.data;
                          console.log('activo', activo);
                          if (!activo[0].activoGE) {
                            alert(
                              `El grupo empresarial ${empre.grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
                            );
                            return;
                          }
                          if (!activo[0].activoEMP) {
                            alert(`La empresa ${empre.empresa} esta inactiva. Pongase en contacto con el administrador.`);
                            return;
                          }

                          definicion_CTX_LISTADO_EMPRESAS.eE = empre;
                          definicion_CTX_LISTADO_EMPRESAS.mostrarPanelListadoSucursales = true;
                        }
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          onClick$={() => {
            navegarA('/');
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
});
