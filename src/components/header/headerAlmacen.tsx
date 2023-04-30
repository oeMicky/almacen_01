import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
// import { CaoSLogo } from '../icons/cao-s';
import style from './headerAlmacen.css?inline';
import { images } from '~/assets';

export default component$(() => {
  useStylesScoped$(style);
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
              <Link href="/factura/">
                <img src={images.Fac} style={{ width: '30px' }} />
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
            <li
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
              class="main-menu__item"
              onClick$={() => {
                (document.getElementById('toggle-menu-checkbox') as HTMLInputElement).checked = false;
              }}
            >
              <Link href="/outAlmacen/">
                <img src={images.almacenOut} style={{ width: '30px' }} />
              </Link>
            </li>
            <li
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
              }}
            >
              <Link href="/catalogo/">
                <img src={images.Cat} style={{ width: '30px' }} />
              </Link>
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
          </ul>
        </nav>
      </div>
    </header>
  );
});
