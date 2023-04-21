import { component$, useStylesScoped$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { CaoSLogo } from '../icons/cao-s';
import style from './headerAlmacen.css?inline';
import { images } from '~/assets';

export default component$(() => {
  useStylesScoped$(style);
  return (
    <header class="header-almacen">
      <div class="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div class="logo" style={{ display: 'flex' }}>
          {/* <a href="/" target="_blank" title="CAO-SYSTEMS">
            {/* <CaoSLogo />   style={{ display: 'inline-block', padding: '10px 10px' }}
            {images.caoSLinealDark}
          </a> 
          border: '1px solid red',
          border: '1px solid black',
          border: '1px solid yellow',
          style={{ border: '2px solid yellow' }}
          border: '1px solid red', 
          */}
          <Link href="/">
            {/* <CaoSLogo /> */}
            <img src={images.caoSLinealDark} style={{ padding: '10px 20px', cursor: 'pointer', width: '150px' }} />
          </Link>
        </div>
        <ul>
          <li style={{ cursor: 'pointer', margin: '0px 5px', padding: '10px 10px', borderRadius: '5px' }}>
            <Link href="/factura/">
              <img src={images.Fac} style={{ width: '30px' }} />
            </Link>
          </li>
          <li style={{ cursor: 'pointer', margin: '0px 5px', padding: '10px 10px', borderRadius: '5px' }}>
            <Link href="/ordenServicio/">
              <img src={images.Os} style={{ width: '30px' }} />
            </Link>
          </li>
          <li style={{ cursor: 'pointer', margin: '0px 5px', padding: '10px 10px', borderRadius: '5px' }}>
            <Link href="/inAlmacen/">
              <img src={images.almacenIn} style={{ width: '30px' }} />
            </Link>
          </li>
          <li style={{ cursor: 'pointer', margin: '0px 5px', padding: '10px 10px', borderRadius: '5px' }}>
            <Link href="/outAlmacen/">
              <img src={images.almacenOut} style={{ width: '30px' }} />
            </Link>
          </li>
          <li style={{ cursor: 'pointer', margin: '0px 5px', padding: '10px 10px', borderRadius: '5px' }}>
            <Link href="/kardex/">
              <img src={images.Kx} style={{ width: '30px' }} />
            </Link>
          </li>
          <li style={{ cursor: 'pointer', margin: '0px 5px', padding: '10px 10px', borderRadius: '5px' }}>
            <Link href="/catalogo/">
              <img src={images.Cat} style={{ width: '30px' }} />
            </Link>
          </li>
          <li style={{ cursor: 'pointer', margin: '0px 5px', padding: '10px 10px', borderRadius: '5px' }}>
            <Link href="/cotizacion/">
              <img src={images.Ctz} style={{ width: '30px' }} />
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
});
