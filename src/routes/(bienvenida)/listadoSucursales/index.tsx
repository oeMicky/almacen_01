import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { images } from '~/assets';
// import ImgButton from '~/components/system/imgButton';
import { cerosALaIzquierda } from '~/functions/comunes';
import styles from '../../../components/tabla/tabla.css?inline';
import { getActivoGEEMPSUCUR, getPeriodos } from '~/apis/grupoEmpresarial.api';
import { parametrosGlobales } from '~/routes/login';
import Spinner from '~/components/system/spinner';

export default component$(() => {
  useStyles$(styles);

  //#region INICIALIZAR
  const navegarA = useNavigate();
  const mostrarSpinner = useSignal(false);
  const lasSucursales = useSignal<any>(parametrosGlobales.sucursalesAdjuntas);
  //console.log('🌼🌼🌼🌼🌷🌼', lasSucursales);
  //#endregion INICIALIZAR

  // const definicion_CTX_LISTADO_SUCURSALES = useStore({
  //   mostrarSpinner: false,
  // });

  //#region INICIAIZACION
  // const ini = useSignal(0);
  // const lasSucursales = useSignal<any>([]);

  // useTask$(({ track }) => {
  //   track(() => ini.value);
  //   // //console.log('ingreso a INI', sessionStorage.getItem('SUCURSALES'));
  //   lasSucursales.value = JSON.parse(sessionStorage.SUCURSALES);
  //   //console.log('first lasSucursales.value ', lasSucursales.value);
  // });
  //#endregion INICIAIZACION
  return (
    <>
      <div class="container">
        <h2>BIENVENIDO AL SISTEMA</h2>
        <b>
          <img src={images.user} width={16} height={16} style={{ marginRight: '8px' }} />
          <label style={{ marginRight: '8px' }}>{parametrosGlobales.usuario}</label>
        </b>

        <p style={{ marginLeft: '16px' }}>Seleccione una sucursal.</p>

        <table style={{ fontSize: '0.8rem', fontWeight: 'lighter', padding: '0 16px' }}>
          <thead>
            <tr>
              <th>Ítem</th>
              {/* <th>Grupo Empresarial</th> */}
              <th>Empresa</th>
              <th>Sucursal</th>
              {/* <th>Acciones</th> */}
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
                  <td
                    data-label="Sucursal"
                    style={{ cursor: 'pointer', color: 'red', fontWeight: 'bold' }}
                    onClick$={async () => {
                      let activo = await getActivoGEEMPSUCUR({
                        idGrupoEmpresarial: sucur.idGrupoEmpresarial,
                        idEmpresa: sucur.idEmpresa,
                        idSucursal: sucur.idSucursal,
                      });
                      activo = activo.data;
                      // console.log('🎫🎫🎫activo', activo);
                      if (!activo[0].activoGE) {
                        alert(`El grupo empresarial ${sucur.grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`);
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
                      //console.log('**VARIAS SUCURSALES**');
                      parametrosGlobales.idSucursal = sucur.idSucursal;
                      parametrosGlobales.sucursal = sucur.sucursal;
                      parametrosGlobales.sucursalDireccion = sucur.sucursalDireccion;
                      parametrosGlobales.idAlmacen = sucur.idSucursal; //******* */
                      parametrosGlobales.idGrupoEmpresarial = sucur.idGrupoEmpresarial;
                      parametrosGlobales.nombreGrupoEmpresarial = sucur.grupoEmpresarial;
                      parametrosGlobales.idEmpresa = sucur.idEmpresa;
                      parametrosGlobales.RazonSocial = sucur.empresa;
                      parametrosGlobales.idPersona = sucur.idPersona;

                      parametrosGlobales.RUC = sucur.numeroIdentidad;
                      parametrosGlobales.Direccion = sucur.direccion;
                      parametrosGlobales.departamento = sucur.departamento;
                      parametrosGlobales.provincia = sucur.provincia;
                      parametrosGlobales.distrito = sucur.distrito;
                      parametrosGlobales.ubigeo = sucur.ubigeo;

                      parametrosGlobales.actualizarPrecioPublico = sucur.actualizarPrecioPublico;

                      parametrosGlobales.editarTipoCambioManual = sucur.editarTipoCambioManual;
                      parametrosGlobales.tipoCambioManual = activo[0].tipoCambioManual ? activo[0].tipoCambioManual.$numberDecimal : 0;

                      parametrosGlobales.colorHeaderEmpresarial = activo[0].colorHeaderEmpresarial;
                      parametrosGlobales.ventaConDetraccion = activo[0].ventaConDetraccion;
                      parametrosGlobales.cuentaBancariaDetraccion = activo[0].cuentaBancariaDetraccion;
                      parametrosGlobales.osConRegistroDeVehiculo = activo[0].osConRegistroDeVehiculo;
                      parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
                      parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
                      parametrosGlobales.facturacionElectronica = activo[0].facturacionElectronica;
                      parametrosGlobales.facturacionElectronicaAutomatica = activo[0].facturacionElectronicaAutomatica;
                      parametrosGlobales.facturaJSON = activo[0].facturaJSON;
                      parametrosGlobales.facturaXML = activo[0].facturaXML;
                      parametrosGlobales.verificarObservacionVenta = activo[0].verificarObservacionVenta;
                      parametrosGlobales.guiaRemisionElectronica = activo[0].guiaRemisionElectronica;
                      parametrosGlobales.guiaRemisionElectronicaAutomatica = activo[0].guiaRemisionElectronicaAutomatica;
                      parametrosGlobales.guiaRemisionJSON = activo[0].guiaRemisionJSON;
                      parametrosGlobales.guiaRemisionXML = activo[0].guiaRemisionXML;
                      parametrosGlobales.verificarObservacionGR = activo[0].verificarObservacionGR;
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
                      //SERVICIOS
                      parametrosGlobales.facturaElectronica = sucur.facturaElectronica;
                      parametrosGlobales.verNotaVenta = sucur.verNotaVenta;
                      parametrosGlobales.verFactura = sucur.verFactura;
                      parametrosGlobales.verReporteFacturacion = sucur.verReporteFacturacion;
                      parametrosGlobales.verCotizacion = sucur.verCotizacion;
                      parametrosGlobales.verGestionNotaVentaCredito = sucur.verGestionNotaVentaCredito;
                      ///////////
                      parametrosGlobales.guiaElectronica = sucur.guiaElectronica;
                      parametrosGlobales.SIRE = sucur.SIRE;
                      parametrosGlobales.compras = sucur.compras;
                      ///////////
                      parametrosGlobales.inventario = sucur.inventario; //******* */
                      parametrosGlobales.verOtrosAlmacenes = sucur.verOtrosAlmacenes; //******* */
                      parametrosGlobales.verInAlmacen = sucur.verInAlmacen;
                      parametrosGlobales.verOutAlmacen = sucur.verOutAlmacen;
                      ////////////
                      parametrosGlobales.ordenesProduccion = sucur.ordenesProduccion;
                      parametrosGlobales.ordenesServicio = sucur.ordenesServicio;
                      parametrosGlobales.bancos = sucur.bancos;
                      parametrosGlobales.planilla = sucur.planilla;
                      parametrosGlobales.libroDiario = sucur.libroDiario;

                      const losPeri = await getPeriodos({
                        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                        idEmpresa: parametrosGlobales.idEmpresa,
                        bandera: '',
                      });
                      parametrosGlobales.periodos = losPeri.data;
                      //
                      mostrarSpinner.value = true;
                      //PAGINA DE INICIO
                      navegarA('/seleccionarServicio');
                      // if (parametrosGlobales.almacenActivo) {
                      //   navegarA(parametrosGlobales.paginaInicioDelSistema);
                      // } else {
                      //   if (
                      //     parametrosGlobales.paginaInicioDelSistema === '/inAlmacen' ||
                      //     parametrosGlobales.paginaInicioDelSistema === '/outAlmacen' ||
                      //     parametrosGlobales.paginaInicioDelSistema === '/kardex'
                      //   ) {
                      //     navegarA(parametrosGlobales.paginaInicioDefault);
                      //   } else {
                      //     navegarA(parametrosGlobales.paginaInicioDelSistema);
                      //   }
                      // }
                    }}
                  >
                    {sucur.sucursal}
                  </td>
                  {/* <td data-label="Acciones" class="accionesLeft">
                    <input
                      // id="in_BuscarDetraccion"
                      type="image"
                      src={images.check32}
                      title="Seleccionar sucursal"
                      height={16}
                      width={16}
                      style={{ cursor: 'pointer' }}
                      // onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                      onClick$={async () => {
                        let activo = await getActivoGEEMPSUCUR({
                          idGrupoEmpresarial: sucur.idGrupoEmpresarial,
                          idEmpresa: sucur.idEmpresa,
                          idSucursal: sucur.idSucursal,
                        });
                        activo = activo.data;
                        // console.log('🎫🎫🎫activo', activo);
                        if (!activo[0].activoGE) {
                          alert(`El grupo empresarial ${sucur.grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`);
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
                        //console.log('**VARIAS SUCURSALES**');
                        parametrosGlobales.idSucursal = sucur.idSucursal;
                        parametrosGlobales.sucursal = sucur.sucursal;
                        parametrosGlobales.sucursalDireccion = sucur.sucursalDireccion;
                        parametrosGlobales.idAlmacen = sucur.idSucursal; 
                        parametrosGlobales.idGrupoEmpresarial = sucur.idGrupoEmpresarial;
                        parametrosGlobales.nombreGrupoEmpresarial = sucur.grupoEmpresarial;
                        parametrosGlobales.idEmpresa = sucur.idEmpresa;
                        parametrosGlobales.RazonSocial = sucur.empresa;
                        parametrosGlobales.idPersona = sucur.idPersona;

                        parametrosGlobales.RUC = sucur.numeroIdentidad;
                        parametrosGlobales.Direccion = sucur.direccion;
                        parametrosGlobales.departamento = sucur.departamento;
                        parametrosGlobales.provincia = sucur.provincia;
                        parametrosGlobales.distrito = sucur.distrito;
                        parametrosGlobales.ubigeo = sucur.ubigeo;

                        parametrosGlobales.actualizarPrecioPublico = sucur.actualizarPrecioPublico;

                        parametrosGlobales.editarTipoCambioManual = sucur.editarTipoCambioManual;
                        parametrosGlobales.tipoCambioManual = activo[0].tipoCambioManual ? activo[0].tipoCambioManual.$numberDecimal : 0;

                        parametrosGlobales.colorHeaderEmpresarial = activo[0].colorHeaderEmpresarial;
                        parametrosGlobales.ventaConDetraccion = activo[0].ventaConDetraccion;
                        parametrosGlobales.cuentaBancariaDetraccion = activo[0].cuentaBancariaDetraccion;
                        parametrosGlobales.osConRegistroDeVehiculo = activo[0].osConRegistroDeVehiculo;
                        parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
                        parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
                        parametrosGlobales.facturacionElectronica = activo[0].facturacionElectronica;
                        parametrosGlobales.facturacionElectronicaAutomatica = activo[0].facturacionElectronicaAutomatica;
                        parametrosGlobales.facturaJSON = activo[0].facturaJSON;
                        parametrosGlobales.facturaXML = activo[0].facturaXML;
                        parametrosGlobales.verificarObservacionVenta = activo[0].verificarObservacionVenta;
                        parametrosGlobales.guiaRemisionElectronica = activo[0].guiaRemisionElectronica;
                        parametrosGlobales.guiaRemisionElectronicaAutomatica = activo[0].guiaRemisionElectronicaAutomatica;
                        parametrosGlobales.guiaRemisionJSON = activo[0].guiaRemisionJSON;
                        parametrosGlobales.guiaRemisionXML = activo[0].guiaRemisionXML;
                        parametrosGlobales.verificarObservacionGR = activo[0].verificarObservacionGR;
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
                        //SERVICIOS
                        parametrosGlobales.facturaElectronica = sucur.facturaElectronica;
                        parametrosGlobales.verNotaVenta = sucur.verNotaVenta;
                        parametrosGlobales.verFactura = sucur.verFactura;
                        parametrosGlobales.verReporteFacturacion = sucur.verReporteFacturacion;
                        parametrosGlobales.verCotizacion = sucur.verCotizacion;
                        parametrosGlobales.verGestionNotaVentaCredito = sucur.verGestionNotaVentaCredito;
                        //////////
                        parametrosGlobales.guiaElectronica = sucur.guiaElectronica;
                        parametrosGlobales.SIRE = sucur.SIRE;
                        parametrosGlobales.compras = sucur.compras;
                        ///////////
                        parametrosGlobales.inventario = sucur.inventario; 
                        parametrosGlobales.verOtrosAlmacenes = sucur.verOtrosAlmacenes; 
                        parametrosGlobales.verInAlmacen = sucur.verInAlmacen;
                        parametrosGlobales.verOutAlmacen = sucur.verOutAlmacen;
                        ///////////
                        parametrosGlobales.ordenesProduccion = sucur.ordenesProduccion;
                        parametrosGlobales.ordenesServicio = sucur.ordenesServicio;
                        parametrosGlobales.bancos = sucur.bancos;
                        parametrosGlobales.planilla = sucur.planilla;
                        parametrosGlobales.libroDiario = sucur.libroDiario;

                        const losPeri = await getPeriodos({
                          idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
                          idEmpresa: parametrosGlobales.idEmpresa,
                          bandera: '',
                        });
                        parametrosGlobales.periodos = losPeri.data;
                        //
                        mostrarSpinner.value = true;
                        //PAGINA DE INICIO
                        navegarA('/seleccionarServicio');
                        // if (parametrosGlobales.almacenActivo) {
                        //   navegarA(parametrosGlobales.paginaInicioDelSistema);
                        // } else {
                        //   if (
                        //     parametrosGlobales.paginaInicioDelSistema === '/inAlmacen' ||
                        //     parametrosGlobales.paginaInicioDelSistema === '/outAlmacen' ||
                        //     parametrosGlobales.paginaInicioDelSistema === '/kardex'
                        //   ) {
                        //     navegarA(parametrosGlobales.paginaInicioDefault);
                        //   } else {
                        //     navegarA(parametrosGlobales.paginaInicioDelSistema);
                        //   }
                        // }
                      }}
                    />
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
        <br />
        <button
          class="boton-principal"
          style={{ cursor: 'pointer', marginLeft: '16px', padding: '0px 40px', borderRadius: '8px', height: '40px' }}
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
        {/* MOSTRAR SPINNER */}
        {mostrarSpinner.value && (
          <div class="modal" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Spinner />
          </div>
        )}
      </div>
    </>
  );
});
