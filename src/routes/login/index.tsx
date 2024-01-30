// import * as dotenv from 'dotenv';

import { $, component$, useStore, useStylesScoped$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city'; //action$, Form,
import { getUsuario } from '~/apis/usuario.api';

import styles from './login.css?inline';
import { getActivoGEEMP, getActivoGEEMPSUCUR, getPeriodos } from '~/apis/grupoEmpresarial.api';
import Spinner from '~/components/system/spinner';

//--nombre: 'Grupo Empresarial nro 1';
export const parametrosGlobales = {
  // paginaInicioDelSistema: '/cotizacion',
  // paginaInicioDelSistema: '/compra',
  paginaInicioDelSistema: '/venta',
  // paginaInicioDelSistema: '/inAlmacen',
  // paginaInicioDelSistema: '/outAlmacen',
  // paginaInicioDelSistema: '/ordenServicio',
  // paginaInicioDelSistema: '/kardex',
  paginaInicioDefault: '/venta',
  //Grupo Empresarial
  idGrupoEmpresarial: '', //'60f097ca53621708ecc4e781',
  nombreGrupoEmpresarial: '', //'El Grupo Empresarial',
  //Empresa
  idEmpresa: '', //'60f097ca53621708ecc4e782', //'60efd5c8e0eac5122cc56ddc',
  RazonSocial: '', //'CORPORACION ACME I',
  Direccion: '', //'ARKANZAS NRO 354',
  RUC: '', //'99999999999',
  agenteRetencion: false,
  agentePercepcion: false,
  //Sucursal
  idSucursal: '', //'651ad18424595a30fe7926d2',
  sucursal: '', //'Pardo',
  sucursalDireccion: 'Av. Pardo 9999',
  // parameRUC: 'chamo', // '99999999999',
  //Almacén
  almacenActivo: false,
  idAlmacen: '60f3e61a41a71c1148bc4e29', //'608321ef5d922737c40831b1',
  nombreAlmacen: 'Praga',
  //Usuario
  usuario: '', // 'octubre',
  //
  ingreso: false,
  periodos: [],
};

//--nombre: 'GRUPO MERMA';
// export const parametrosGlobales = {
//   idGrupoEmpresarial: '648f0b58941e32c385068c31',
//   idEmpresa: '64bf3c0775be6cac5dde8be6',
//   RUC: '20602683321',
//   RazonSocial: 'MG SERVICE & TRADE E.I.R.L.',
//   Direccion: 'AV. PARDO 1308 (AL COSTADO DEL MERCADO) - CHIMBOTE',
//   idAlmacen: '64bf3d2d75be6cac5dde8be8',
//   nombreAlmacen: 'Pardo',
//   usuario: 'hong',
//   ingreso: false,
//   periodos: [],
// };

export default component$(() => {
  // dotenv.config();
  useStylesScoped$(styles);

  // const serverFuncion = server$((requestEvent: RequestEvent) => {
  //   return
  // });
  //
  //
  //

  const navegarA = useNavigate();

  const definicion_CTX_LOGEO = useStore({
    mostrarSpinner: false,
    // email: 'mvizconde@msn.com',
    // email: 'carlos@merma.com',
    // email: 'paolo@cao.com',
    // email: 'joseluis@cao.com',
    email: 'bugsbunny@cao.com',
    // email: 'taty@cao.com',
    // email: 'emilia@cao.com',
    // email: 'beka@cao.com',
    // email: 'debora@cao.com',
    contrasena: '123',
  });

  //#region ACTIVO GE EMP
  // const activo_GE_EMP = $(async (parametros: any) => {
  //   return await getActivoGEEMP(parametros);
  // });
  //#endregion ACTIVO GE EMP

  //#region OBTENER PERIODOS
  // const cargarLosPeriodos = $(async () => {
  //   const losPeri = await getPeriodos({
  //     idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //     idEmpresa: parametrosGlobales.idEmpresa,
  //     bandera: 'Ventas',
  //   });
  //
  //   losPeriodosCargados.value = losPeri.data;
  //
  //   //
  // });

  // useTask$(({ track }) => {
  //   track(() => ini.value);

  //   cargarLosPeriodos();
  // });
  //#endregion OBTENER PERIODOS

  //#region ANALISIS DEL LOGEO
  const analisisDeLogeo = $(async (logeo: any) => {
    localStorage.setItem('ID', logeo._id);
    if (typeof logeo.sucursalesAdjuntas === 'undefined' || logeo.sucursalesAdjuntas.length === 0) {
      navegarA('/ningunaEmpresa');
    } else {
      if (logeo.sucursalesAdjuntas.length === 1) {
        //UNA EMPRESA

        if (logeo.sucursalesAdjuntas[0].todasLasSucursales === true) {
          if (
            typeof logeo.sucursalesAdjuntas[0].sucursales === 'undefined' ||
            logeo.sucursalesAdjuntas[0].sucursales.length === 0
          ) {
            navegarA('/ningunaSucursal');
          } else {
            if (logeo.sucursalesAdjuntas[0].sucursales.length === 1) {
              //UNA SUCURSAL
              let activo = await getActivoGEEMPSUCUR({
                idGrupoEmpresarial: logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
                idEmpresa: logeo.sucursalesAdjuntas[0].idEmpresa,
                idSucursal: logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal,
              });
              activo = activo.data;

              if (!activo[0].activoGE) {
                alert(
                  `El grupo empresarial ${logeo.sucursalesAdjuntas[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
                );
                return;
              }
              if (!activo[0].activoEMP) {
                alert(
                  `La empresa ${logeo.sucursalesAdjuntas[0].empresa} esta inactiva. Pongase en contacto con el administrador.`
                );
                return;
              }
              if (!activo[0].activoSUCUR) {
                alert(
                  `La sucursal ${logeo.sucursalesAdjuntas[0].sucursales[0].sucursal} esta inactiva. Pongase en contacto con el administrador.`
                );
                return;
              }
              ///////////

              localStorage.setItem('idGrupoEmpresarial', logeo.sucursalesAdjuntas[0].idGrupoEmpresarial);
              localStorage.setItem('grupoEmpresarial', logeo.sucursalesAdjuntas[0].grupoEmpresarial);
              localStorage.setItem('idEmpresa', logeo.sucursalesAdjuntas[0].idEmpresa);
              localStorage.setItem('empresa', logeo.sucursalesAdjuntas[0].empresa);
              localStorage.setItem('numeroIdentidad', logeo.sucursalesAdjuntas[0].numeroIdentidad);
              localStorage.setItem('usuario', logeo.usuario);
              localStorage.setItem('idSucursal', logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal);
              localStorage.setItem('sucursal', logeo.sucursalesAdjuntas[0].sucursales[0].sucursal);
              localStorage.setItem('almacenActivo', activo[0].almacenActivo);
              parametrosGlobales.idGrupoEmpresarial = logeo.sucursalesAdjuntas[0].idGrupoEmpresarial;
              parametrosGlobales.nombreGrupoEmpresarial = logeo.sucursalesAdjuntas[0].grupoEmpresarial;
              parametrosGlobales.idEmpresa = logeo.sucursalesAdjuntas[0].idEmpresa;
              parametrosGlobales.RazonSocial = logeo.sucursalesAdjuntas[0].empresa;
              parametrosGlobales.RUC = logeo.sucursalesAdjuntas[0].numeroIdentidad;
              parametrosGlobales.Direccion = logeo.sucursalesAdjuntas[0].direccion;
              parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
              parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
              parametrosGlobales.usuario = logeo.usuario;
              parametrosGlobales.idSucursal = logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal;
              parametrosGlobales.sucursal = logeo.sucursalesAdjuntas[0].sucursales[0].sucursal;
              parametrosGlobales.almacenActivo = activo[0].almacenActivo;
              const losPeri = await getPeriodos({
                idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                idEmpresa: parametrosGlobales.idEmpresa,
                bandera: '',
              });
              parametrosGlobales.periodos = losPeri.data;
              //PAGINA DE INICIO
              if (parametrosGlobales.almacenActivo) {
                navegarA(parametrosGlobales.paginaInicioDelSistema);
              } else {
                if (
                  parametrosGlobales.paginaInicioDelSistema === '/inAlmacen' ||
                  parametrosGlobales.paginaInicioDelSistema === '/outAlmacen' ||
                  parametrosGlobales.paginaInicioDelSistema === '/kardex'
                ) {
                  navegarA(parametrosGlobales.paginaInicioDefault);
                } else {
                  navegarA(parametrosGlobales.paginaInicioDelSistema);
                }
              }
            } else {
              //VARIAS SUCURSALES
              let activo = await getActivoGEEMP({
                idGrupoEmpresarial: logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
                idEmpresa: logeo.sucursalesAdjuntas[0].idEmpresa,
              });
              activo = activo.data;

              if (!activo[0].activoGE) {
                alert(
                  `El grupo empresarial ${logeo.sucursalesAdjuntas[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
                );
                return;
              }
              if (!activo[0].activoEMP) {
                alert(
                  `La empresa ${logeo.sucursalesAdjuntas[0].empresa} esta inactiva. Pongase en contacto con el administrador.`
                );
                return;
              }
              localStorage.setItem('idGrupoEmpresarial', logeo.sucursalesAdjuntas[0].idGrupoEmpresarial);
              localStorage.setItem('grupoEmpresarial', logeo.sucursalesAdjuntas[0].grupoEmpresarial);
              localStorage.setItem('idEmpresa', logeo.sucursalesAdjuntas[0].idEmpresa);
              localStorage.setItem('empresa', logeo.sucursalesAdjuntas[0].empresa);
              localStorage.setItem('numeroIdentidad', logeo.sucursalesAdjuntas[0].numeroIdentidad);
              localStorage.setItem('usuario', logeo.usuario);
              localStorage.setItem('SUCURSALES', JSON.stringify(logeo.sucursalesAdjuntas[0].sucursales));
              parametrosGlobales.idGrupoEmpresarial = logeo.sucursalesAdjuntas[0].idGrupoEmpresarial;
              parametrosGlobales.nombreGrupoEmpresarial = logeo.sucursalesAdjuntas[0].grupoEmpresarial;
              parametrosGlobales.idEmpresa = logeo.sucursalesAdjuntas[0].idEmpresa;
              parametrosGlobales.RazonSocial = logeo.sucursalesAdjuntas[0].empresa;
              parametrosGlobales.RUC = logeo.sucursalesAdjuntas[0].numeroIdentidad;
              parametrosGlobales.Direccion = logeo.sucursalesAdjuntas[0].direccion;
              parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
              parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
              parametrosGlobales.usuario = logeo.usuario;
              //  parametrosGlobales.idSucursal = logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal;
              //  parametrosGlobales.sucursal = logeo.sucursalesAdjuntas[0].sucursales[0].sucursal;
              navegarA('/listadoSucursales');
            }
          }
        } else {
          if (
            typeof logeo.sucursalesAdjuntas[0].sucursales === 'undefined' ||
            logeo.sucursalesAdjuntas[0].sucursales.length === 0
          ) {
            navegarA('/ningunaSucursal');
          } else {
            if (logeo.sucursalesAdjuntas[0].sucursales.length === 1) {
              //UNA SUCURSAL
              let activo = await getActivoGEEMPSUCUR({
                idGrupoEmpresarial: logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
                idEmpresa: logeo.sucursalesAdjuntas[0].idEmpresa,
                idSucursal: logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal,
              });
              activo = activo.data;

              if (!activo[0].activoGE) {
                alert(
                  `El grupo empresarial ${logeo.sucursalesAdjuntas[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
                );
                return;
              }
              if (!activo[0].activoEMP) {
                alert(
                  `La empresa ${logeo.sucursalesAdjuntas[0].empresa} esta inactiva. Pongase en contacto con el administrador.`
                );
                return;
              }
              if (!activo[0].activoSUCUR) {
                alert(
                  `La sucursal ${logeo.sucursalesAdjuntas[0].sucursales[0].sucursal} esta inactiva. Pongase en contacto con el administrador.`
                );
                return;
              }

              localStorage.setItem('idGrupoEmpresarial', logeo.sucursalesAdjuntas[0].idGrupoEmpresarial);
              localStorage.setItem('grupoEmpresarial', logeo.sucursalesAdjuntas[0].grupoEmpresarial);
              localStorage.setItem('idEmpresa', logeo.sucursalesAdjuntas[0].idEmpresa);
              localStorage.setItem('empresa', logeo.sucursalesAdjuntas[0].empresa);
              localStorage.setItem('numeroIdentidad', logeo.sucursalesAdjuntas[0].numeroIdentidad);
              localStorage.setItem('usuario', logeo.usuario);

              localStorage.setItem('idSucursal', logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal);
              localStorage.setItem('sucursal', logeo.sucursalesAdjuntas[0].sucursales[0].sucursal);
              localStorage.setItem('almacenActivo', activo[0].almacenActivo);
              parametrosGlobales.idGrupoEmpresarial = logeo.sucursalesAdjuntas[0].idGrupoEmpresarial;
              parametrosGlobales.nombreGrupoEmpresarial = logeo.sucursalesAdjuntas[0].grupoEmpresarial;
              parametrosGlobales.idEmpresa = logeo.sucursalesAdjuntas[0].idEmpresa;
              parametrosGlobales.RazonSocial = logeo.sucursalesAdjuntas[0].empresa;
              parametrosGlobales.RUC = logeo.sucursalesAdjuntas[0].numeroIdentidad;
              parametrosGlobales.Direccion = logeo.sucursalesAdjuntas[0].direccion;
              parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
              parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
              parametrosGlobales.usuario = logeo.usuario;
              parametrosGlobales.idSucursal = logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal;
              parametrosGlobales.sucursal = logeo.sucursalesAdjuntas[0].sucursales[0].sucursal;
              parametrosGlobales.almacenActivo = activo[0].almacenActivo;
              const losPeri = await getPeriodos({
                idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                idEmpresa: parametrosGlobales.idEmpresa,
                bandera: '',
              });
              parametrosGlobales.periodos = losPeri.data;
              //PAGINA DE INICIO
              if (parametrosGlobales.almacenActivo) {
                navegarA(parametrosGlobales.paginaInicioDelSistema);
              } else {
                if (
                  parametrosGlobales.paginaInicioDelSistema === '/inAlmacen' ||
                  parametrosGlobales.paginaInicioDelSistema === '/outAlmacen' ||
                  parametrosGlobales.paginaInicioDelSistema === '/kardex'
                ) {
                  navegarA(parametrosGlobales.paginaInicioDefault);
                } else {
                  navegarA(parametrosGlobales.paginaInicioDelSistema);
                }
              }
            } else {
              //VARIAS SUCURSALES
              let activo = await getActivoGEEMP({
                idGrupoEmpresarial: logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
                idEmpresa: logeo.sucursalesAdjuntas[0].idEmpresa,
              });
              activo = activo.data;

              if (!activo[0].activoGE) {
                alert(
                  `El grupo empresarial ${logeo.sucursalesAdjuntas[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
                );
                return;
              }
              if (!activo[0].activoEMP) {
                alert(
                  `La empresa ${logeo.sucursalesAdjuntas[0].empresa} esta inactiva. Pongase en contacto con el administrador.`
                );
                return;
              }
              localStorage.setItem('idGrupoEmpresarial', logeo.sucursalesAdjuntas[0].idGrupoEmpresarial);
              localStorage.setItem('grupoEmpresarial', logeo.sucursalesAdjuntas[0].grupoEmpresarial);
              localStorage.setItem('idEmpresa', logeo.sucursalesAdjuntas[0].idEmpresa);
              localStorage.setItem('empresa', logeo.sucursalesAdjuntas[0].empresa);
              localStorage.setItem('numeroIdentidad', logeo.sucursalesAdjuntas[0].numeroIdentidad);
              localStorage.setItem('usuario', logeo.usuario);
              parametrosGlobales.idGrupoEmpresarial = logeo.sucursalesAdjuntas[0].idGrupoEmpresarial;
              parametrosGlobales.nombreGrupoEmpresarial = logeo.sucursalesAdjuntas[0].grupoEmpresarial;
              parametrosGlobales.idEmpresa = logeo.sucursalesAdjuntas[0].idEmpresa;
              parametrosGlobales.RazonSocial = logeo.sucursalesAdjuntas[0].empresa;
              parametrosGlobales.RUC = logeo.sucursalesAdjuntas[0].numeroIdentidad;
              parametrosGlobales.Direccion = logeo.sucursalesAdjuntas[0].direccion;
              parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
              parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
              parametrosGlobales.usuario = logeo.usuario;
              localStorage.setItem('SUCURSALES', JSON.stringify(logeo.sucursalesAdjuntas[0].sucursales));

              navegarA('/listadoSucursales');
            }
          }
        }
      } else {
        //VARIAS EMPRESA

        localStorage.setItem('usuario', logeo.usuario);
        parametrosGlobales.usuario = logeo.usuario;
        localStorage.setItem('SUCURSALES_ADJUNTAS', JSON.stringify(logeo.sucursalesAdjuntas));
        navegarA('/listadoEmpresas');
      }
    }
  });
  //#endregion ANALISIS DEL LOGEO

  //#region INGRESAR AL SISTEMA
  const enviar = $(async () => {
    if (definicion_CTX_LOGEO.email.trim() === '') {
      alert('Ingrese el email.');
      document.getElementById('in_email_INICIAR')?.focus();
      return;
    }
    if (definicion_CTX_LOGEO.contrasena.trim() === '') {
      alert('Ingrese la contraseña.');
      document.getElementById('in_contrasena_INICIAR')?.focus();
      return;
    }

    definicion_CTX_LOGEO.mostrarSpinner = true;
    let elLogeo = await getUsuario({
      usuario: definicion_CTX_LOGEO.email.trim(),
      clave: definicion_CTX_LOGEO.contrasena.trim(),
    });
    elLogeo = elLogeo.data;

    if (elLogeo.length === 1) {
      if (elLogeo[0].activo) {
        analisisDeLogeo(elLogeo[0]);
      } else {
        definicion_CTX_LOGEO.mostrarSpinner = false;
        alert('El usuario no se encuentra activo, pongase en contacto con el administrador.');
      }

      // sessionStorage.setItem('ID', elLogeo[0]._id);

      // sessionStorage.setItem('NOMBRE', PrimeraMayuscula(elLogeo[0].nombre) + ' ' + PrimeraMayuscula(elLogeo[0].apellido));
      // navegarA('/cotizacion');
      // navegarA('/prueba');
    } else {
      // sessionStorage.removeItem('ID');
      // sessionStorage.removeItem('NOMBRE');
      definicion_CTX_LOGEO.mostrarSpinner = false;
      alert('El correo o la contraseña estan erradas.');
    }

    // const registro = new Promise((resolve, reject) => {
    //   const registro = new Promise((resolve) => {
    //     resolve(getUsuario({ usuario: definicion_CTX_LOGEO.email.trim(), clave: definicion_CTX_LOGEO.contrasena.trim() }));
    //   });
    //   registro.then(async (res) => {
    //     const Kas: any = res;
    //     // oBTENIENDO periodos
    //     // const losPeri = await getPeriodos({
    //     //   idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
    //     //   idEmpresa: parametrosGlobales.idEmpresa,
    //     // });
    //     //
    //     // parametrosGlobales.periodos = losPeri.data;
    //     //

    //     // parametrosGlobales.periodosTOS = 'miguelito';
    //     //
    //
    //     if (Kas.data.length === 1) {
    //
    //       // navigate('/venta');
    //       // navigate('/ordenServicio');
    //       // navigate('/inAlmacen');
    //       //navigate('/outAlmacen');
    //       // navigate('/compra');
    //       navigate('/cotizacion');
    //     }
    //   });
    //   registro.catch((err) => {
    //
    //   });
  });
  //#endregion INGRESAR AL SISTEMA

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
                id="inputUsuario_LOGIN"
                autoFocus
                name="usuario"
                type="email"
                placeholder="Email"
                class="input-formulario"
                value={definicion_CTX_LOGEO.email}
                onChange$={(e) => (definicion_CTX_LOGEO.email = (e.target as HTMLInputElement).value)}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('inputClave_LOGIN') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
            <div class="linea-formulario">
              <label>Clave</label>
              <input
                id="inputClave_LOGIN"
                name="clave"
                type="password"
                placeholder="Clave"
                class="input-formulario"
                value={definicion_CTX_LOGEO.contrasena}
                onChange$={(e) => (definicion_CTX_LOGEO.contrasena = (e.target as HTMLInputElement).value)}
                onKeyPress$={(e) => {
                  if (e.key === 'Enter') {
                    (document.getElementById('buttonLogearse_LOGIN') as HTMLInputElement)?.focus();
                  }
                }}
              />
            </div>
            {/* <button>Registrar</button> */}
            <input
              id="buttonLogearse_LOGIN"
              class="boton-formulario"
              type="button"
              value="Logearse"
              onClick$={() => {
                //
                enviar();
                // serverFuncion();
                // const usu = document.getElementById('inputUsuario')?.nodeValue;
                // alert(`fraude-- {usu}`);
              }}
            />
          </form>
          {/* <div>
            <Link class="desea-suscribirse" href="#">
              Desea suscribirse?
            </Link>
          </div> */}
          {/* MOSTRAR SPINNER */}
          {definicion_CTX_LOGEO.mostrarSpinner && (
            <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </>
  );
});
