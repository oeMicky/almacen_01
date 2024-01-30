import { component$, useSignal, useStyles$, useTask$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { images } from '~/assets';
// import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda } from '~/functions/comunes';
import styles from '../../../components/tabla/tabla.css?inline';
import { getActivoGEEMPSUCUR } from '~/apis/grupoEmpresarial.api';
import { parametrosGlobales } from '~/routes/login';

export default component$(() => {
  useStyles$(styles);
  const navegarA = useNavigate();

  //#region INICIAIZACION
  const ini = useSignal(0);
  const lasSucursales = useSignal<any>([]);

  useTask$(({ track }) => {
    track(() => ini.value);
    // console.log('ingreso a INI', sessionStorage.getItem('SUCURSALES'));
    lasSucursales.value = JSON.parse(sessionStorage.SUCURSALES);
    console.log('first lasSucursales.value ', lasSucursales.value);
  });
  //#endregion INICIAIZACION
  return (
    <>
      <div class="container">
        <h2>BIENVENIDO AL SISTEMA</h2>
        <p>{sessionStorage.getItem('usuario')}</p>
        <p>Seleccione una sucursal.</p>
        <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
          <thead>
            <tr>
              <th>Ítem</th>
              <th>Sucursal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lasSucursales.value.map((sucur: any, index: number) => {
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
                      onFocusin$={() => console.log('☪☪☪☪☪☪')}
                      onClick$={async () => {
                        let activo = await getActivoGEEMPSUCUR({
                          idGrupoEmpresarial: sessionStorage.getItem('idGrupoEmpresarial'),
                          idEmpresa: sessionStorage.getItem('idEmpresa'),
                          idSucursal: sucur.idSucursal,
                        });
                        activo = activo.data;
                        console.log('activo', activo);
                        if (!activo[0].activoGE) {
                          alert(
                            `El grupo empresarial ${sessionStorage.getItem(
                              'grupoEmpresarial'
                            )} esta inactivo. Pongase en contacto con el administrador.`
                          );
                          return;
                        }
                        if (!activo[0].activoEMP) {
                          alert(
                            `La empresa ${sessionStorage.getItem(
                              'empresa'
                            )} esta inactiva. Pongase en contacto con el administrador.`
                          );
                          return;
                        }
                        if (!activo[0].activoSUCUR) {
                          alert(`La sucursal ${sucur.sucursal} esta inactiva. Pongase en contacto con el administrador.`);
                          return;
                        }
                        parametrosGlobales.idSucursal = sucur.idSucursal;
                        parametrosGlobales.sucursal = sucur.sucursal;
                        parametrosGlobales.almacenActivo = activo[0].almacenActivo;
                        sessionStorage.setItem('idSucursal', sucur.idSucursal);
                        sessionStorage.setItem('sucursal', sucur.sucursal);
                        sessionStorage.setItem('almacenActivo', activo[0].almacenActivo);
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
