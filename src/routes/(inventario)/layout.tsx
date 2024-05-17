import { component$, Slot } from '@builder.io/qwik';
// import HeaderAlmacen from '~/components/header/headerAlmacen';
import Footer from '~/components/footer/footer';
// import HeaderFactura from '~/components/header/headerFactura';
import HeaderInventario from '~/components/header/headerInventario';
// import { images } from '~/assets';
// import { CaoSLogo } from '../../components/icons/cao-s';

export default component$(() => {
  // const fecha = new Date();
  // const anio = fecha.getFullYear() + 1;
  return (
    <div>
      <HeaderInventario />
      <Slot />
      <Footer />
    </div>
  );
});
