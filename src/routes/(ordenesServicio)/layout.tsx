import { component$, Slot } from '@builder.io/qwik';
// import HeaderAlmacen from '~/components/header/headerAlmacen';
import Footer from '~/components/footer/footer';
// import HeaderFactura from '~/components/header/headerFactura';
// import HeaderCompras from '~/components/header/headerCompras';
import HeaderOrdenesServicio from '~/components/header/headerOrdenesServicio';
// import { images } from '~/assets';
// import { CaoSLogo } from '../../components/icons/cao-s';

export default component$(() => {
  // const fecha = new Date();
  // const anio = fecha.getFullYear() + 1;
  return (
    <div>
      <HeaderOrdenesServicio />
      <Slot />
      <Footer />
    </div>
  );
});
