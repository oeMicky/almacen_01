import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
// import { CaoSLogo } from '../icons/cao-s';
import style from './headerAlmacen.css?inline';
import { images } from '~/assets';
import { parametrosGlobales } from '~/routes/login';
// import Spinner from '../system/spinner';

// export const CTX_HEADER_ALMACEN = createContextId<any>('__header_almacen');

export default component$(() => {
  useStylesScoped$(style);

  //#region HEADER ALMACEN
  // const definicion_CTX_HEADER_ALMACEN = useStore({
  //   mostrarSpinner: false,
  //   // mostrarSpinner: parametrosGlobales.mostrarSpinner, //false,
  // });
  // useContextProvider(CTX_HEADER_ALMACEN, definicion_CTX_HEADER_ALMACEN);
  //#endregion HEADER ALMACEN

  const navegarA = useNavigate();

  //#region DEFINICION CTX_APP_ALMACEN
  // const definicion_CTX_APP_ALMACEN = useStore({
  //   mostrarAddOrderServicio9: false,
  //   compania: 'EASY!!!',
  // });
  // useContextProvider(CTX_APP_ALMACEN, definicion_CTX_APP_ALMACEN);
  //#endregion DEFINICION CTX_APP_ALMACEN

  // useTask$(({ track }) => {
  //   track(() => definicion_CTX_HEADER_ALMACEN.mostrarSpinner);
  //   console.log('definicion_CTX_HEADER_ALMACEN.mostrarSpinner', definicion_CTX_HEADER_ALMACEN.mostrarSpinner);
  // });

  return (
    <header>
      <div class="container-header">
        <div class="main-logo">
          <Link href="/">
            {/* <CaoSLogo />   style={{ padding: '10px 20px', cursor: 'pointer', width: '150px' }}*/}
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
          {/* <li style={{ cursor: 'pointer', margin: '0px 5px', padding: '10px 10px', borderRadius: '5px' }}> */}
          <ul class="main-menu">
            <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <input
                type="image"
                title="Ir a ventas"
                alt="Boton venta"
                width={30}
                height={30}
                src={images.Fac}
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
                title="Ir a reporte ventas"
                alt="Boton reporte venta"
                width={30}
                height={30}
                src={images.Rp}
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
              <input
                type="image"
                title="Ir a compras"
                alt="Boton venta"
                width={30}
                height={30}
                src={images.Cp}
                onClick$={() => {
                  navegarA('/compra/');
                  // definicion_CTX_HEADER_ALMACEN.mostrarSpinner = true;
                }}
              />
              {/* <Link href="/compra/">
                <img src={images.Cp} style={{ width: '30px' }} />
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
              <Link href="/ordenServicio/">
                <img src={images.Os} style={{ width: '30px' }} />
              </Link>
            </li>
            {/* <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/guiaRemision/">
                <img src={images.Gr128} style={{ width: '30px' }} />
              </Link>
            </li> */}
            <li
              hidden={!parametrosGlobales.almacenActivo}
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/inAlmacen/">
                <img src={images.almacenIn} style={{ width: '30px' }} />
              </Link>
            </li>
            <li
              hidden={!parametrosGlobales.almacenActivo}
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/outAlmacen/">
                <img src={images.almacenOut} style={{ width: '30px' }} />
                {/* <img src={images.logout32} style={{ width: '30px' }} /> */}
              </Link>
            </li>
            <li
              hidden={!parametrosGlobales.almacenActivo}
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/kardex/">
                <img src={images.Kx} style={{ width: '30px' }} />
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
                sessionStorage.removeItem('almacenActivo');
                // sessionStorage.clear;
                navegarA('/');
              }}
            >
              <img src={images.Logout} style={{ width: '32px' }} />
            </li>
            {/* <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/parametros/">
                <img src={images.Pm} style={{ width: '30px' }} />
              </Link>
            </li> */}
            {/* <li
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/catalogo/">
                <img src={images.Cat} style={{ width: '30px' }} />
              </Link>
            </li> */}
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
