import { component$ } from '@builder.io/qwik';
import { CaoSLogo } from '../icons/cao-s';

export default component$(() => {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  return (
    <footer class="footer-principal">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}>
        Powered by <CaoSLogo />
      </div>
      <div>© {anio}</div>
    </footer>
  );
});
