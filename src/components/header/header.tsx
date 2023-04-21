import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { QwikLogo } from '../icons/qwik';
import { CaoSLogo } from '../icons/cao-s';
import styles from './header.css?inline';

export default component$(() => {
  useStylesScoped$(styles);

  return (
    <header>
      <div class="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div class="logo">
          <a href="/" target="_blank" title="CAO-SYSTEMS">
            <CaoSLogo />
          </a>
        </div>
        <ul>
          <li>
            <a href="#inicio" target="_blank">
              Inicio
            </a>
          </li>
          <li>
            <a href="#portafolio" target="_blank">
              Portafolio
            </a>
          </li>
          <li>
            <a class="#asociados" href="#asociados" target="_blank">
              Asociados
            </a>
          </li>
          <li>
            {/* <Link style={{ color: 'white' }} href="/login/"> */}
            <Link class="linkHeaderPrincipal" href="../login/">
              Ingresar
            </Link>

            {/* <a target="_blank">
              <Link href="/login/">Ingresar</Link>
            </a> */}
          </li>
        </ul>
      </div>
    </header>
  );
});

{
  /* <header>
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
