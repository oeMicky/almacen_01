import { component$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
// import { Link } from '@builder.io/qwik-city';
// import catalogoImagenes from '~/assets/images/catalogoImagenes';
import Asociado from '~/components/indexPrincipal/asociado';
// import Portafolio from '~/components/indexPrincipal/portafolio';
import { images } from '~/assets';
import Header from '~/components/header/header';
import Footer from '~/components/footer/footer';
import Portafolio2024 from '~/components/indexPrincipal/portafolio2024';
// @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

// export const CTX_0 = createContextId<any>('app.del_0');

export default component$(() => {
  return (
    <>
      <Header />
      <main>
        <div class="container">
          {/* INICIO  style={{ color: '#75ABB2', fontFamily: 'Roboto Condensed', fontSize: '2.4rem',fontSize: '1.86rem' }}*/}
          <section id="inicio" class="seccion-inicio">
            <div class="frase-principal">
              <label>
                Somos
                <br />
                <strong style={{ color: '#00778F' }}>CAO</strong>
                <strong style={{ color: '#003F62' }}>-S</strong>{' '}
                <strong class="frase-principal-letraPeque" style={{ color: '#003F62' }}>
                  Software Development
                </strong>
                <br />Y estamos para ayudarte
              </label>
            </div>
            <img loading="lazy" src={images.caoSLogoGrandeWB} alt="Logo grande" class="imagen-principal" />
          </section>
          {/* PORTAFOLIO */}
          <section id="servicios" class="seccion-servicios">
            <h2 style={{ marginLeft: '15px' }}>SERVICIOS</h2>
            <div class="servicios">
              <Portafolio2024 imagen={images.facturasOscuro} titulo="Factura electrónica" parrafo="Una manera intuitiva y segura de facturar." />
              <Portafolio2024 imagen={images.guiasClaro} titulo="Guía electrónica" parrafo="Las guías electrónicas para asegurar el traslado de los bienes." />
              <Portafolio2024 imagen={images.SIRE_IIOscuro} titulo="SIRE" parrafo="Sistema integrado de registros electronicos." />
              <Portafolio2024 imagen={images.comprasClaro} titulo="Compras" parrafo="Un ambiente para gestionar tus compras." />
              <Portafolio2024 imagen={images.inventarioOscuro} titulo="Inventario" parrafo="Sofisticada herramienta para el control de inventarios." />
              <Portafolio2024
                imagen={images.ordenesServicioClaro}
                titulo="Ordenes de servicio o de producción"
                parrafo="Herramienta para el control de los servicios o de producción."
              />
              <Portafolio2024
                imagen={images.seguimientoCostoOscuro}
                titulo="Seguimiento de costos"
                parrafo="Herramienta para el control y seguimiento de costos."
              />
              <Portafolio2024 imagen={images.bancosClaro} titulo="Bancos" parrafo="Para llevar el control de tus ingresos y egresos." />
              <Portafolio2024 imagen={images.planillaOscuro} titulo="Planilla" parrafo="Controlar tu planilla de tu personal." />
              <Portafolio2024 imagen={images.libroDiarioClaro} titulo="Libro diario" parrafo="Tus hechos economicos siempre se registraran." />
            </div>

            {/* <Portafolio
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
            /> */}
          </section>
          {/* ASOCIADOS */}
          <section id="asociados" class="seccion-asociados">
            <h2 style={{ marginLeft: '16px' }}>ASOCIADOS</h2>
            <div class="asociados">
              <Asociado imagen={images.panafoodsBnWB} ancho={240} />
              <Asociado imagen={images.igmBnWB} ancho={160} />
              <Asociado imagen={images.mgBnWB} ancho={160} />
              <Asociado imagen={images.sanMiguelBnWB} ancho={180} />
              {/* <Asociado imagen={images.panafoodsBnWB} ancho={'350px'} />
              <Asociado imagen={images.igmBnWB} ancho={'200px'} />
              <Asociado imagen={images.mgBnWB} ancho={'200px'} />
              <Asociado imagen={images.sanMiguelBnWB} ancho={'200px'} /> */}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Cao Systems',
  meta: [
    {
      name: 'Cao Systems',
      content: 'Welcome to Cao Systems!!!',
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
