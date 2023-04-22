import { component$, Slot } from '@builder.io/qwik';
import { loader$ } from '@builder.io/qwik-city';

// import Header from '../components/header/header';
// import { CaoSLogo } from '../components/icons/cao-s';

export const useServerTimeLoader = loader$(() => {
  return {
    date: new Date().toISOString(),
  };
});

export default component$(() => {
  // const serverTime = useServerTimeLoader();

  return (
    <Slot />
    //   <>
    // <main>
    //   <Header />

    // <section></section>
    // </main>
    //   <footer class="footer-principal">
    //     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}>
    //       Powered by <CaoSLogo />
    //     </div>
    //     <div>© {anio}</div>
    //   </footer>
    //   <footer>
    //     <a href="https://www.builder.io/" target="_blank">
    //       Made with ♡ by Builder.io
    //       <div>{serverTime.value.date}</div>
    //     </a>
    //   </footer>
    //  </>*/}
  );
});
