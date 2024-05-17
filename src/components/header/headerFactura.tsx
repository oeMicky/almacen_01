import { component$, useStyles$ } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { images } from '~/assets';
import { parametrosGlobales } from '~/routes/login';
import style from '../header/headerAlmacen.css?inline';

export default component$(() => {
  useStyles$(style);
  const navegarA = useNavigate();
  return (
    <header
      style={parametrosGlobales.colorHeaderEmpresarial !== '' ? { background: parametrosGlobales.colorHeaderEmpresarial } : ''}
    >
      <div class="container-header">
        <div class="main-logo">
          <Link href="/">
            <img src={images.caoSLinealDark} alt="logo" width={150} />
          </Link>
        </div>
        <nav class="main-nav">
          <div class="toggle-menu">
            <label id="menu" for="toggle-menu-checkbox">
              <img src={images.menu} alt="menu principal" width={36} />
            </label>
          </div>
          <input type="checkbox" class="toggle-menu__checkbox" id="toggle-menu-checkbox" />
          <ul
            class="main-menu"
            style={
              parametrosGlobales.colorHeaderEmpresarial !== '' ? { background: parametrosGlobales.colorHeaderEmpresarial } : ''
            }
          >
            <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <input
                type="image"
                src={images.Fac}
                title="Facturación electronica"
                alt="Boton venta"
                width={30}
                height={30}
                onClick$={() => {
                  navegarA('/venta/');
                  // definicion_CTX_HEADER_ALMACEN.mostrarSpinner = true;
                }}
              />
              {/* <Link href="/venta/">
                <img src={images.Fac} style={{ width: '30px' }} />
              </Link> */}
            </li>
            <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <input
                type="image"
                src={images.Rp}
                title="Reporte ventas"
                alt="Boton reporte venta"
                width={30}
                height={30}
                onClick$={() => {
                  navegarA('/reporteVenta/');
                  // definicion_CTX_HEADER_ALMACEN.mostrarSpinner = true;
                }}
              />
              {/* <Link href="/reporteVenta/">
                <img src={images.Rp} style={{ width: '30px' }} />
              </Link> */}
            </li>
            <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/cotizacion/">
                <img src={images.Ctz} style={{ width: '30px' }} />
              </Link>
            </li>
            <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/seleccionarServicio/">
                <img src={images.multiWeb} style={{ width: '30px' }} />
              </Link>
            </li>

            <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
                sessionStorage.removeItem('usuario');
                sessionStorage.removeItem('SUCURSALES_ADJUNTAS');
                sessionStorage.removeItem('ID');
                sessionStorage.removeItem('idGrupoEmpresarial');
                sessionStorage.removeItem('grupoEmpresarial');
                sessionStorage.removeItem('idEmpresa');
                sessionStorage.removeItem('empresa');
                sessionStorage.removeItem('numeroIdentidad');
                sessionStorage.removeItem('idSucursal');
                sessionStorage.removeItem('sucursal');
                sessionStorage.removeItem('idAlmacen');
                sessionStorage.removeItem('almacenActivo');
                // sessionStorage.clear;
                parametrosGlobales.idGrupoEmpresarial = '';
                parametrosGlobales.nombreGrupoEmpresarial = '';
                navegarA('/login');
              }}
            >
              <img src={images.Logout} style={{ width: '32px' }} />
            </li>
          </ul>
        </nav>
      </div>
      {/* MOSTRAR SPINNER */}
      {/* {definicion_CTX_HEADER_ALMACEN.mostrarSpinner && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )} */}
    </header>
  );
});
