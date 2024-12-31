import { component$, useStyles$ } from '@builder.io/qwik';
// import { Link } from '@builder.io/qwik-city';
// import { QwikLogo } from '../icons/qwik';
import { CaoSLogo } from '../icons/cao-s';
import styles from './header.css?inline';
import { images } from '~/assets';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  useStyles$(styles);
  const navegarA = useNavigate();
  return (
    <header>
      <div class="container-header">
        <div class="main_logo">
          <a href="/" target="_blank" title="CAO-SYSTEMS">
            <CaoSLogo />
          </a>
        </div>
        <nav class="main-nav">
          <div class="toggle-menu">
            <label id="menu" for="toggle-menu-checkbox">
              <img src={images.menu} alt="menu principal" width={36} />
            </label>
          </div>
          <input type="checkbox" class="toggle-menu__checkbox" id="toggle-menu-checkbox" />
          <ul class="main-menu">
            <li class="main-menu__item">
              <a class="main-menu__link" href="#inicio" target="_blank">
                Inicios
              </a>
            </li>
            <li class="main-menu__item">
              <a class="main-menu__link" href="#portafolio" target="_blank">
                Portafolio
              </a>
            </li>
            <li
              class="main-menu__item"
              style={{ cursor: 'pointer' }}
              // onClick$={() => {
              //   navegarA('#asociados');
              // }}
            >
              <a class="main-menu__link" href="#asociados" target="_blank">
                Asociados
              </a>
            </li>
            <li
              class="main-menu__item"
              style={{ cursor: 'pointer', color: 'white' }}
              onClick$={() => {
                navegarA('/login');
              }}
            >
              {/* <Link style={{ color: '#eee', textDecoration: 'none' }} href="../login/"> */}
              Ingresar
              {/* </Link> */}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
});

{
  /* <header> class="main-menu__el_link"
      <div class="logo">
        <a href="https://qwik.builder.io/" target="_blank" title="qwik">
          <QwikLogo />
        </a>
      </div>
      <ul>
        <li>
          <a href="https://qwik.builder.io/docs/components/overview/" target="_blank">
            Docs
          </a>
        </li>
        <li>
          <a href="https://qwik.builder.io/examples/introduction/hello-world/" target="_blank">
            Examples
          </a>
        </li>
        <li>
          <a href="https://qwik.builder.io/tutorial/welcome/overview/" target="_blank">
            Tutorials
          </a>
        </li>
      </ul>
    </header> */
}
