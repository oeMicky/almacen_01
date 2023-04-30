import { component$ } from '@builder.io/qwik';
import { CaoSLogo } from '../icons/cao-s';

export default component$(() => {
  const fecha = new Date();
  const anio = fecha.getFullYear();
  return (
    // style={{ display: 'flex', alignItems: 'center', marginBottom: '7px' }}
    <footer class="footer-principal">
      <div class="linea-uno">
        <label>Powered by</label> <CaoSLogo />
      </div>
      <div class="linea-dos">© {anio}</div>
    </footer>
  );
});
