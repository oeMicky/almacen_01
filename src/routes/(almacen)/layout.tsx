import { component$, Slot } from '@builder.io/qwik';
import Header from '~/components/header/headerAlmacen';
import Footer from '~/components/footer/footer';
import { images } from '~/assets';
// import { CaoSLogo } from '../../components/icons/cao-s';

export default component$(() => {
  const fecha = new Date();
  const anio = fecha.getFullYear() + 1;
  return (
    <div>
      <Header />
      <Slot />
      <Footer />
    </div>
  );
});
