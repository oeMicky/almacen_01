import { component$, createContextId, useContextProvider, useSignal, useStore, useStyles$, useTask$ } from '@builder.io/qwik';
import { images } from '~/assets';
// import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda } from '~/functions/comunes';
import styles from '../../../components/tabla/tabla.css?inline';
import ListadoSucursalesModal from '~/components/miscelanea/sucursal/listadoSucursalesModal';
import { useNavigate } from '@builder.io/qwik-city';
import { getActivoGEEMP, getActivoGEEMPSUCUR } from '~/apis/grupoEmpresarial.api';
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
    // console.log('ingreso a INI', sessionStorage.getItem('SUCURSALES'));
    lasEmpresas.value = JSON.parse(sessionStorage.SUCURSALES_ADJUNTAS);
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
        <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
          <thead>
            <tr>
              <th>Ítem</th>
              <th>Grupo empresarial</th>
              <th>Empresa</th>
              <th>Acciones</th>
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
                      style={{ padding: '2px' }}
                      onFocusin$={() => console.log('☪☪☪☪☪☪')}
                      onClick$={async () => {
                        if (empre.sucursales.length === 1) {
                          //UNA UNICA SUCURSAL
                          let activo = await getActivoGEEMPSUCUR({
                            idGrupoEmpresarial: empre.idGrupoEmpresarial,
                            idEmpresa: empre.idEmpresa,
                            idSucursal: empre.sucursales[0].idSucursal,
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
                          sessionStorage.setItem('idGrupoEmpresarial', empre.idGrupoEmpresarial);
                          sessionStorage.setItem('grupoEmpresarial', empre.grupoEmpresarial);
                          sessionStorage.setItem('idEmpresa', empre.idEmpresa);
                          sessionStorage.setItem('empresa', empre.empresa);
                          sessionStorage.setItem('numeroIdentidad', empre.numeroIdentidad);

                          sessionStorage.setItem('idSucursal', empre.sucursales[0].idSucursal);
                          sessionStorage.setItem('sucursal', empre.sucursales[0].sucursal);
                          sessionStorage.setItem('almacenActivo', empre.sucursales[0].almacenActivo);
                          parametrosGlobales.idGrupoEmpresarial = empre.idGrupoEmpresarial;
                          parametrosGlobales.nombreGrupoEmpresarial = empre.grupoEmpresarial;
                          parametrosGlobales.idEmpresa = empre.idEmpresa;
                          parametrosGlobales.RazonSocial = empre.empresa;
                          parametrosGlobales.RUC = empre.numeroIdentidad;
                          parametrosGlobales.Direccion = empre.direccion;

                          parametrosGlobales.idSucursal = empre.sucursales[0].idSucursal;
                          parametrosGlobales.sucursal = empre.sucursales[0].sucursal;
                          parametrosGlobales.almacenActivo = activo[0].almacenActivo;
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
