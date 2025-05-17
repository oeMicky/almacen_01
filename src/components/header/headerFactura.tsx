import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import { images } from '~/assets';
import { parametrosGlobales } from '~/routes/login';
import style from '../header/headerAlmacen.css?inline';
import Spinner from '../system/spinner';
import { limpiarParametrosGlobales } from '~/functions/limpiar';
// import { existeMotivoNV } from '~/apis/egresosDeAlmacen.api';

export default component$(() => {
  useStyles$(style);
  const navegarA = useNavigate();
  const mostrarSpinner = useSignal(false);
  return (
    <header style={parametrosGlobales.colorHeaderEmpresarial !== '' ? { background: parametrosGlobales.colorHeaderEmpresarial } : ''}>
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
          <ul class="main-menu" style={parametrosGlobales.colorHeaderEmpresarial !== '' ? { background: parametrosGlobales.colorHeaderEmpresarial } : ''}>
            <li
              hidden={!parametrosGlobales.verNotaVenta}
              class="main-menu__item"
              title="Nota de venta"
              style={{ cursor: 'pointer' }}
              onClick$={() => {
                mostrarSpinner.value = true;
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
                navegarA('/notaVenta');
                mostrarSpinner.value = false;
              }}
            >
              {/* <input
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
              /> */}
              {/* <Link href="/notaVenta/"> */}
              <img src={images.Nv} style={{ width: '30px' }} />
              {/* </Link> */}
            </li>
            <li
              hidden={!parametrosGlobales.verFactura}
              class="main-menu__item"
              title="Facturación electrónica"
              style={{ cursor: 'pointer' }}
              onClick$={() => {
                mostrarSpinner.value = true;
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
                navegarA('/venta');
                mostrarSpinner.value = false;
              }}
            >
              {/* <input
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
              /> */}
              {/* <Link href="/venta/"> */}
              <img src={images.Fac} style={{ width: '30px' }} />
              {/* </Link> */}
            </li>
            <li
              hidden={!parametrosGlobales.verReporteFacturacion}
              class="main-menu__item"
              title="Reporte de venta"
              style={{ cursor: 'pointer' }}
              onClick$={() => {
                mostrarSpinner.value = true;
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
                navegarA('/reporteVenta');
                mostrarSpinner.value = false;
              }}
            >
              {/* <input
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
              /> */}
              {/* <Link href="/reporteVenta/"> */}
              <img src={images.Rp} style={{ width: '30px' }} />
              {/* </Link> */}
            </li>
            <li
              hidden={!parametrosGlobales.verCotizacion}
              class="main-menu__item"
              title="Cotización"
              style={{ cursor: 'pointer' }}
              onClick$={() => {
                mostrarSpinner.value = true;
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
                navegarA('/cotizacion');
                mostrarSpinner.value = false;
              }}
            >
              {/* <Link href="/cotizacion/"> */}
              <img src={images.Ctz} style={{ width: '30px' }} />
              {/* </Link> */}
            </li>
            <li
              class="main-menu__item"
              title="Seleccionar servicio"
              style={{ cursor: 'pointer' }}
              onClick$={() => {
                mostrarSpinner.value = true;
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
                navegarA('/seleccionarServicio');
                mostrarSpinner.value = false;
              }}
            >
              {/* <Link href="/seleccionarServicio/"> */}
              <img src={images.multiWeb} style={{ width: '30px' }} />
              {/* </Link> */}
            </li>
            <li
              class="main-menu__item"
              title="Salir del sistema"
              style={{ cursor: 'pointer' }}
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
                limpiarParametrosGlobales();
                // parametrosGlobales.idGrupoEmpresarial = '';
                // parametrosGlobales.nombreGrupoEmpresarial = '';
                navegarA('/login');
              }}
            >
              <img src={images.Logout} style={{ width: '32px' }} />
            </li>
          </ul>
        </nav>
      </div>
      {/* MOSTRAR SPINNER */}
      {mostrarSpinner.value && (
        <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner />
        </div>
      )}
    </header>
  );
});
