import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { images } from '~/assets';
// import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda } from '~/functions/comunes';
import styles from '../../../components/tabla/tabla.css?inline';
import { getActivoGEEMPSUCUR, getPeriodos } from '~/apis/grupoEmpresarial.api';
import { parametrosGlobales } from '~/routes/login';

export default component$(() => {
  useStyles$(styles);
  const navegarA = useNavigate();

  //#region INICIAIZACION
  // const ini = useSignal(0);
  // const lasSucursales = useSignal<any>([]);
  const lasSucursales = useSignal<any>(parametrosGlobales.sucursalesAdjuntas);

  // useTask$(({ track }) => {
  //   track(() => ini.value);
  //   // console.log('ingreso a INI', sessionStorage.getItem('SUCURSALES'));
  //   lasSucursales.value = JSON.parse(sessionStorage.SUCURSALES);
  //   console.log('first lasSucursales.value ', lasSucursales.value);
  // });
  //#endregion INICIAIZACION
  return (
    <>
      <div class="container">
        <h2>BIENVENIDO AL SISTEMA</h2>
        <b>{parametrosGlobales.usuario}</b>
        <p>Seleccione una sucursal.</p>

        <table style={{ fontSize: '0.8rem', fontWeight: 'lighter' }}>
          <thead>
            <tr>
              <th>Ítem</th>
              {/* <th>Grupo Empresarial</th> */}
              <th>Empresa</th>
              <th>Sucursal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lasSucursales.value.map((sucur: any, index: number) => {
              const indexItemVenta = index + 1;

              return (
                <tr key={indexItemVenta}>
                  <td data-label="Ítem" key={indexItemVenta}>{`${cerosALaIzquierda(indexItemVenta, 3)}`}</td>
                  {/* <td data-label="Grupo Empresarial">{sucur.grupoEmpresarial}</td> */}
                  <td data-label="Empresa">{sucur.empresa}</td>
                  <td data-label="Sucursal">{sucur.sucursal}</td>
                  <td data-label="Acciones" class="acciones">
                    <input
                      // id="in_BuscarDetraccion"
                      type="image"
                      src={images.check32}
                      title="Seleccionar sucursal"
                      height={14}
                      width={14}
                      // style={{ padding: '2px' }}
                      onFocusin$={() => console.log('☪☪☪☪☪☪')}
                      onClick$={async () => {
                        let activo = await getActivoGEEMPSUCUR({
                          idGrupoEmpresarial: sucur.idGrupoEmpresarial,
                          idEmpresa: sucur.idEmpresa,
                          idSucursal: sucur.idSucursal,
                        });
                        activo = activo.data;
                        console.log('activo', activo);
                        if (!activo[0].activoGE) {
                          alert(
                            `El grupo empresarial ${sucur.grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
                          );
                          return;
                        }
                        if (!activo[0].activoEMP) {
                          alert(`La empresa ${sucur.empresa} esta inactiva. Pongase en contacto con el administrador.`);
                          return;
                        }
                        if (!activo[0].activoSUCUR) {
                          alert(`La sucursal ${sucur.sucursal} esta inactiva. Pongase en contacto con el administrador.`);
                          return;
                        }
                        console.log('**VARIAS SUCURSALES**');
                        parametrosGlobales.idSucursal = sucur.idSucursal;
                        parametrosGlobales.sucursal = sucur.sucursal;
                        parametrosGlobales.idAlmacen = sucur.idSucursal; //******* */
                        parametrosGlobales.idGrupoEmpresarial = sucur.idGrupoEmpresarial;
                        parametrosGlobales.nombreGrupoEmpresarial = sucur.grupoEmpresarial;
                        parametrosGlobales.idEmpresa = sucur.idEmpresa;
                        parametrosGlobales.RazonSocial = sucur.empresa;

                        parametrosGlobales.RUC = sucur.numeroIdentidad;
                        parametrosGlobales.Direccion = sucur.direccion;

                        parametrosGlobales.colorHeaderEmpresarial = activo[0].colorHeaderEmpresarial;
                        parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
                        parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
                        parametrosGlobales.facturacionElectronica = activo[0].facturacionElectronica;
                        parametrosGlobales.facturacionElectronicaAutomatica = activo[0].facturacionElectronicaAutomatica;
                        parametrosGlobales.facturaJSON = activo[0].facturaJSON;
                        parametrosGlobales.facturaXML = activo[0].facturaXML;
                        parametrosGlobales.contabilizarOperaciones = activo[0].contabilizarOperaciones;
                        parametrosGlobales.planesContables = activo[0].planesContables;
                        parametrosGlobales.asientoCompra = activo[0].asientoCompra;
                        parametrosGlobales.asientoVenta = activo[0].asientoVenta;
                        parametrosGlobales.codigoContableVentaServicio = activo[0].codigoContableVentaServicio;
                        parametrosGlobales.descripcionContableVentaServicio = activo[0].descripcionContableVentaServicio;
                        parametrosGlobales.idLibroDiario = activo[0].idLibroDiario;
                        parametrosGlobales.idEjercicio = activo[0].idEjercicio;
                        parametrosGlobales.ejercicio = activo[0].ejercicio;
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
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <button
          onClick$={() => {
            navegarA('/');
          }}
        >
          Logout
        </button>
        {/* <button
          onClick$={() => {
            console.log('ppp', parametrosGlobales);
          }}
        >
          ppppppppp
        </button> */}
      </div>
    </>
  );
});
