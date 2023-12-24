import { component$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';

export default component$(() => {
  const navegarA = useNavigate();
  return (
    <>
      <div class="container">
        <h2>BIENVENIDO AL SISTEMA</h2>
        <p>Usted no cuenta con acceso a ninguna empresa.</p>
        <p>Pongase en contacto con el administrador.</p>
        <button
          onClick$={() => {
            navegarA('/');
          }}
        >
          Logout
        </button>
      </div>
    </>
  );
});
