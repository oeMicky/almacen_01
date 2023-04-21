import { $, component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';
// import catalogoImagenes from '~/assets/images/catalogoImagenes';
import Asociado from '~/components/indexPrincipal/asociado';
import Portafolio from '~/components/indexPrincipal/portafolio';
import { images } from '~/assets';
import Header from '~/components/header/header';
import Footer from '~/components/footer/footer';

export default component$(() => {
  const darClick = $(() => {
    alert('⚡️⚡️⚡️⚡️pipipipi ddddd gui tu 700');
  });

  return (
    <>
      <Header />
      <div class="container">
        {/* INICIO */}
        <section id="inicio" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '500px' }}>
          {/* frase */}
          <div
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 20px', color: '#00778F' }}
          >
            <label style={{ color: '#75ABB2', fontFamily: 'Roboto Condensed', fontSize: '2.4rem' }}>
              Somos
              <br />
              <strong style={{ color: '#00778F' }}>CAO</strong>
              <strong style={{ color: '#003F62' }}>-S</strong>{' '}
              <strong style={{ color: '#003F62', fontSize: '1.86rem' }}>Software Development</strong>
              <br />Y estamos para ayudarte
            </label>
          </div>
          <img
            src={images.caoSLogoGrandeWB}
            alt="Logo grande"
            style={{ width: '80%', justifySelf: 'center', alignSelf: 'center' }}
            onClick$={() => {
              darClick();
            }}
          />
        </section>
        {/* PORTAFOLIO */}
        <section id="portafolio" style={{ display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ marginLeft: '15px' }}>PORTAFOLIO</h2>
          <Portafolio
            imagen={images.reunionPersonalWB}
            // imagen={catalogoImagenes.reunionPersonalWB}
            titulo={`SISMEM`}
            subtitulo={`Sistema de gestión empresarial`}
            parrafo={
              'Plataforma de gestión de distintas áreas de una empresa, esta ordena y coordina los procesos que realizan las distintas áreas de la empresa.'
            }
          />
          <Portafolio
            imagen={images.revisandoPapelesWB}
            titulo={`e-SERVICIO`}
            subtitulo={`Gestión centro de servicio`}
            parrafo={`Sistema para la gestión de un centro de servicios al cliente, con el podra realizar ordenes de servicios,
              cotizaciones, llevar el control de sus kardexs.`}
          />
        </section>
        {/* ASOCIADOS */}
        <section id="asociados">
          <h2 style={{ marginLeft: '15px' }}>ASOCIADOS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', padding: '15px 15px' }}>
            {/* <Asociado></Asociado> */}
            <Asociado imagen={images.panafoodsBnWB} ancho={'350px'} />
            <Asociado imagen={images.igmBnWB} ancho={'200px'} />
            <Asociado imagen={images.mgBnWB} ancho={'200px'} />
            <Asociado imagen={images.sanMiguelBnWB} ancho={'200px'} />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Qwik site description',
    },
  ],
};

// return (
//   <div>
//     <h1>
//       Welcome to Qwik <span class="lightning">⚡️</span>
//     </h1>
//     <button
//       onClick$={() => {
//         darClick();
//         // alert('pantalla');
//       }}
//     >
//       dar click da
//     </button>
//     <ul>
//       <li>
//         Check out the <code>src/routes</code> directory to get started.
//       </li>
//       <li>
//         Add integrations with <code>npm run qwik add</code>.
//       </li>
//       <li>
//         More info about development in <code>README.md</code>
//       </li>
//     </ul>

//     <h2>Commands</h2>

//     <table class="commands">
//       <tbody>
//         <tr>
//           <td>
//             <code>npm run dev</code>
//           </td>
//           <td>Start the dev server and watch for changes.</td>
//         </tr>
//         <tr>
//           <td>
//             <code>npm run preview</code>
//           </td>
//           <td>Production build and start preview server.</td>
//         </tr>
//         <tr>
//           <td>
//             <code>npm run build</code>
//           </td>
//           <td>Production build.</td>
//         </tr>
//         <tr>
//           <td>
//             <code>npm run qwik add</code>
//           </td>
//           <td>Select an integration to add.</td>
//         </tr>
//       </tbody>
//     </table>

//     <h2>Add Integrations</h2>

//     <table class="commands">
//       <tbody>
//         <tr>
//           <td>
//             <code>npm run qwik add azure-swa</code>
//           </td>
//           <td>
//             <a href="https://learn.microsoft.com/azure/static-web-apps/overview" target="_blank">
//               Azure Static Web Apps
//             </a>
//           </td>
//         </tr>
//         <tr>
//           <td>
//             <code>npm run qwik add cloudflare-pages</code>
//           </td>
//           <td>
//             <a href="https://developers.cloudflare.com/pages" target="_blank">
//               Cloudflare Pages Server
//             </a>
//           </td>
//         </tr>
//         <tr>
//           <td>
//             <code>npm run qwik add express</code>
//           </td>
//           <td>
//             <a href="https://expressjs.com/" target="_blank">
//               Nodejs Express Server
//             </a>
//           </td>
//         </tr>
//         <tr>
//           <td>
//             <code>npm run qwik add netlify-edge</code>
//           </td>
//           <td>
//             <a href="https://docs.netlify.com/" target="_blank">
//               Netlify Edge Functions
//             </a>
//           </td>
//         </tr>
//         <tr>
//           <td>
//             <code>npm run qwik add vercel-edge</code>
//           </td>
//           <td>
//             <a href="https://vercel.com/docs/concepts/get-started" target="_blank">
//               Vercel Edge Functions
//             </a>
//           </td>
//         </tr>
//       </tbody>
//     </table>

//     <h2>Community</h2>

//     <ul>
//       <li>
//         <span>Questions or just want to say hi? </span>
//         <a href="https://qwik.builder.io/chat" target="_blank">
//           Chat on discord!
//         </a>
//       </li>
//       <li>
//         <span>Follow </span>
//         <a href="https://twitter.com/QwikDev" target="_blank">
//           @QwikDev
//         </a>
//         <span> on Twitter</span>
//       </li>
//       <li>
//         <span>Open issues and contribute on </span>
//         <a href="https://github.com/BuilderIO/qwik" target="_blank">
//           GitHub
//         </a>
//       </li>
//       <li>
//         <span>Watch </span>
//         <a href="https://qwik.builder.io/media/" target="_blank">
//           Presentations, Podcasts, Videos, etc.
//         </a>
//       </li>
//     </ul>
//     <Link class="mindblow" href="/flower/">
//       Blow my mind 🤯
//     </Link>
//     <Link class="todolist" href="/todolist/">
//       TODO demo 📝
//     </Link>
//   </div>
// );
