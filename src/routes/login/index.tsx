import { $, component$, useStore, useStylesScoped$ } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city'; //action$, Form,
import { getUsuario } from '~/apis/usuario.api';

import styles from './login.css?inline';

export default component$(() => {
  useStylesScoped$(styles);

  const navigate = useNavigate();

  const login = useStore({
    usu: '',
    pas: '',
  });
  // const usuario = useStore({
  //   _id: '',
  //   usuario: '',
  //   clave: '',
  //   flag: '',
  // });

  const enviar = $(() => {
    console.log('onClick - enviar');
    // const usu = document.getElementById('inputUsuario')?.nodeValue;
    // alert(`000bay0 pre compa pol ${login.usu} ... ${login.pas}`);
    // getUsuario;
    // const registro = getUsuario([{ usuario: login.usu, clave: login.pas }]);
    // console.log('registro', registro);
    // console.log('registro length', registro.then.name);
    // const usuario = registro.this.state.first;

    // const registro = new Promise((resolve, reject) => {
    const registro = new Promise((resolve) => {
      resolve(getUsuario([{ usuario: login.usu, clave: login.pas }]));
    });
    registro.then((res) => {
      const Kas: any = res;
      // Kas = res;
      console.log('el res', Kas.data);
      if (Kas.data.length === 1) {
        console.log('Ingreso al sistema.');
        navigate('/factura');
      }
    });
    registro.catch((err) => {
      console.log('el err', err);
    });
  });

  return (
    <>
      <div class="container">
        <div
          style={{
            // border: '1px solid red',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* <Form action={login}>            
          </Form> */}
          <form style={{ width: '300px' }}>
            <div class="linea-formulario">
              <label>Usuario</label>
              <input
                id="inputUsuario"
                name="usuario"
                type="email"
                placeholder="Email"
                class="input-formulario"
                value="mvizconde@msn.co"
                onInput$={(e) => {
                  login.usu = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
            <div class="linea-formulario">
              <label>Clave</label>
              <input
                id="inputClave"
                name="clave"
                type="password"
                placeholder="Clave"
                class="input-formulario"
                value="12"
                onInput$={(e) => {
                  login.pas = (e.target as HTMLInputElement).value;
                }}
              />
            </div>
            {/* <button>Registrar</button> */}
            <input
              class="boton-formulario"
              type="button"
              value="Registrar"
              onClick$={() => {
                // console.log('onClick');
                enviar();
                // const usu = document.getElementById('inputUsuario')?.nodeValue;
                // alert(`fraude-- {usu}`);
              }}
            />
          </form>
          <div>
            <Link class="desea-suscribirse" href="#">
              Desea suscribirses?
            </Link>
          </div>
        </div>
      </div>
    </>
  );
});

{
  /* */
}
