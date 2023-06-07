// import * as dotenv from 'dotenv';

import { $, component$, createContextId, useContextProvider, useStore, useStylesScoped$ } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city'; //action$, Form,
import { getUsuario } from '~/apis/usuario.api';

import styles from './login.css?inline';

export const CTX_APP_ALMACEN = createContextId<any>('app.almacen');

export const parametrosGlobales = {
  idGrupoEmpresarial: '60f097ca53621708ecc4e781',
  idEmpresa: '60f097ca53621708ecc4e782', //'60efd5c8e0eac5122cc56ddc',
  parameRUC: '99999999999',
  // parameRUC: 'chamo', // '99999999999',
  parameRazonSocial: 'ACME SAC',
  paraDireccion: 'ARKANZAS NRO 354',
  idAlmacen: '60f3e61a41a71c1148bc4e29', //'608321ef5d922737c40831b1',
  nombreAlmacen: 'Praga',
  usuario: 'rey',
  ingreso: false,
};

export default component$(() => {
  //#region CONTEXTO
  const definicion_CTX_APP_ALMACEN = useStore({
    mostrarAddOrderServicio9: false,
  });
  useContextProvider(CTX_APP_ALMACEN, definicion_CTX_APP_ALMACEN);
  //#endregion CONTEXTO

  // dotenv.config();
  useStylesScoped$(styles);

  // const serverFuncion = server$((requestEvent: RequestEvent) => {
  //   return console.log(requestEvent.env.get('URL'));
  // });
  console.log('......................env', import.meta.url);
  console.log('......................env PUBLIC_URL', import.meta.env.PUBLIC_URL);
  // console.log('......................env URL:', requestEvent.env.get);

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
        // navigate('/factura');
        navigate('/ordenServicio');
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
              value="Logearse"
              onClick$={() => {
                // console.log('onClick');
                enviar();
                // serverFuncion();
                // const usu = document.getElementById('inputUsuario')?.nodeValue;
                // alert(`fraude-- {usu}`);
              }}
            />
          </form>
          <div>
            <Link class="desea-suscribirse" href="#">
              Desea suscribirse?
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
