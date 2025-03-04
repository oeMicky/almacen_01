import { $, component$, useContext } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { getActivoGEEMPSUCUR } from '~/apis/grupoEmpresarial.api';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda } from '~/functions/comunes';
import { CTX_LISTADO_EMPRESAS } from '~/routes/(bienvenida)/listadoEmpresas';
import { parametrosGlobales } from '~/routes/login';

export default component$(() => {
  const navegarA = useNavigate();
  //#region CONTEXTO
  const ctx_listado_empresas = useContext(CTX_LISTADO_EMPRESAS);
  //#endregion CONTEXTO

  return (
    <div
      class="container-modal"
      style={{
        width: 'clamp(320px, 100%, 400px)',
        // width: 'auto',
        padding: '2px',
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_listado_empresas.mostrarPanelListadoSucursales = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <p>Seleccione una sucursal.</p>
      <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
        <thead>
          <tr>
            <th>Ítem</th>
            <th>Sucursal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ctx_listado_empresas.eE.sucursales.map((sucur: any, index: number) => {
            const indexItemVenta = index + 1;

            return (
              <tr key={indexItemVenta}>
                <td data-label="Ítem" key={indexItemVenta}>{`${cerosALaIzquierda(indexItemVenta, 3)}`}</td>
                <td data-label="Sucursal">{sucur.sucursal}</td>
                <td data-label="Acciones" class="acciones">
                  <input
                    // id="in_BuscarDetraccion"
                    type="image"
                    src={images.check32}
                    title="Seleccionar sucursal"
                    height={14}
                    width={14}
                    style={{ padding: '2px' }}
                    // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                    onClick$={async () => {
                      let activo = await getActivoGEEMPSUCUR({
                        idGrupoEmpresarial: ctx_listado_empresas.eE.idGrupoEmpresarial,
                        idEmpresa: ctx_listado_empresas.eE.idEmpresa,
                        idSucursal: sucur.idSucursal,
                      });
                      activo = activo.data;
                      //console.log('activo', activo);
                      if (!activo[0].activoGE) {
                        alert(`El grupo empresarial ${ctx_listado_empresas.eE.grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`);
                        return;
                      }
                      if (!activo[0].activoEMP) {
                        alert(`La empresa ${ctx_listado_empresas.eE.empresa} esta inactiva. Pongase en contacto con el administrador.`);
                        return;
                      }
                      if (!activo[0].activoSUCUR) {
                        alert(`La sucursal ${sucur.sucursal} esta inactiva. Pongase en contacto con el administrador.`);
                        return;
                      }
                      sessionStorage.setItem('idGrupoEmpresarial', ctx_listado_empresas.eE.idGrupoEmpresarial);
                      sessionStorage.setItem('grupoEmpresarial', ctx_listado_empresas.eE.grupoEmpresarial);
                      sessionStorage.setItem('idEmpresa', ctx_listado_empresas.eE.idEmpresa);
                      sessionStorage.setItem('empresa', ctx_listado_empresas.eE.empresa);
                      sessionStorage.setItem('numeroIdentidad', ctx_listado_empresas.eE.numeroIdentidad);

                      sessionStorage.setItem('idSucursal', sucur.idSucursal);
                      sessionStorage.setItem('sucursal', sucur.sucursal);
                      sessionStorage.setItem('almacenActivo', sucur.almacenActivo);
                      parametrosGlobales.idGrupoEmpresarial = ctx_listado_empresas.eE.idGrupoEmpresarial;
                      parametrosGlobales.nombreGrupoEmpresarial = ctx_listado_empresas.eE.grupoEmpresarial;
                      parametrosGlobales.idEmpresa = ctx_listado_empresas.eE.idEmpresa;
                      parametrosGlobales.RazonSocial = ctx_listado_empresas.eE.empresa;
                      parametrosGlobales.RUC = ctx_listado_empresas.eE.numeroIdentidad;
                      parametrosGlobales.Direccion = ctx_listado_empresas.eE.direccion;

                      parametrosGlobales.idSucursal = sucur.idSucursal;
                      parametrosGlobales.sucursal = sucur.sucursal;
                      parametrosGlobales.sucursalDireccion = sucur.sucursalDireccion;
                      parametrosGlobales.almacenActivo = sucur.almacenActivo;
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
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
