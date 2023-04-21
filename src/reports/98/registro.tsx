import { component$, noSerialize } from '@builder.io/qwik';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

export default component$((props: { pdf: any }) => {
  const Make = noSerialize(pdfMake);

  return <></>;
});
