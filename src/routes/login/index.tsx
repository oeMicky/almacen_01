import { $, component$, useSignal, useStore, useStyles$ } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city'; //action$, Form,
import { getSucursalesAdjuntasUsuario, getUsuarioPanel } from '~/apis/usuario.api';

import styles from './login.css?inline';
import { getActivoGEEMPSUCUR, getPeriodos } from '~/apis/grupoEmpresarial.api';
import Spinner from '~/components/system/spinner';
import { images } from '~/assets';

// import { FileReadOptions } from 'fs/promises';
// import fs from 'fs'
// import { SignedXml } from 'xml-crypto';
// import { readFileSync, writeFileSync } from 'fs';

// export const CTX_CONFIGURACION = createContextId<any>('__configuracion');

//--nombre: 'Grupo Empresarial nro 1';
export const parametrosGlobales = {
  // paginaInicioDelSistema: '/cotizacion',
  paginaInicioDelSistema: '/compra',
  // paginaInicioDelSistema: '/reporteVenta',
  // paginaInicioDelSistema: '/venta',
  // paginaInicioDelSistema: '/guiaRemision',
  // paginaInicioDelSistema: '/inAlmacen',
  // paginaInicioDelSistema: '/outAlmacen',
  // paginaInicioDelSistema: '/ordenServicio',
  // paginaInicioDelSistema: '/kardex',
  paginaInicioDefault: '/venta',
  //Grupo Empresarial
  idGrupoEmpresarial: '', //'60f097ca53621708ecc4e781',
  nombreGrupoEmpresarial: '', //'El Grupo Empresarial',
  //Empresa
  idPersona: '',
  idEmpresa: '', //'60f097ca53621708ecc4e782', //'60efd5c8e0eac5122cc56ddc',
  RazonSocial: '', //'CORPORACION ACME I',
  actualizarPrecioPublico: false,
  editarTipoCambioManual: false,
  tipoCambioManual: '',
  colorHeaderEmpresarial: '',
  ventaConDetraccion: false,
  cuentaBancariaDetraccion: '',
  osConRegistroDeVehiculo: false,
  Direccion: '', //'ARKANZAS NRO 354',
  RUC: '', //'99999999999',
  departamento: '',
  provincia: '',
  distrito: '',
  ubigeo: '',
  agenteRetencion: false,
  agentePercepcion: false,
  //PERFILES - ROLES
  supervisor: false,
  almaceneroAlto: false,
  almaceneroMedio: false,
  almaceneroBajo: false,
  vendedorAlto: false,
  vendedorMedio: false,
  vendedorBajo: false,
  //Sucursal
  sucursalesAdjuntas: [],
  idSucursal: '', //'651ad18424595a30fe7926d2',
  sucursal: '', //'Pardo',
  sucursalDireccion: '', //Av. Pardo 9999',
  // parameRUC: 'chamo', // '99999999999',
  //Almacén
  almacenActivo: false,
  idAlmacen: '', //'60f3e61a41a71c1148bc4e29', //la SUCURSAL otorgara su ID al ALMACÉN
  nombreAlmacen: '', // 'Praga',
  //Usuario
  usuario: '', // 'octubre',
  //
  ingreso: false,
  periodos: [],
  //
  idSerieNotaIngreso: '',
  serieNotaIngreso: '',
  //
  idSerieNotaSalida: '',
  serieNotaSalida: '',
  //
  idMotivosSalidaDelAlmacen_NV: '',
  idMotivosSalidaDelAlmacen_NS: '',
  // mostrarSpinner: false,
  facturacionElectronica: false,
  facturacionElectronicaAutomatica: false,
  facturaJSON: false,
  facturaXML: false,
  verificarObservacionVenta: false,
  guiaRemisionElectronica: false,
  guiaRemisionElectronicaAutomatica: false,
  guiaRemisionJSON: false,
  guiaRemisionXML: false,
  verificarObservacionGR: false,
  contabilizarOperaciones: false,
  planesContables: [],
  asientoCompra: [],
  asientoVenta: [],
  codigoContableVentaServicio: '',
  descripcionContableVentaServicio: '',
  // idLibroDiario: '6604c567242e40cf619c834f',
  idLibroDiario: '',
  idEjercicio: '',
  ejercicio: 0,
  //servicios
  facturaElectronica: false,
  verNotaVenta: false,
  verFactura: false,
  verReporteFacturacion: false,
  verCotizacion: false,
  verGestionNotaVentaCredito: false,
  /////////////
  guiaElectronica: false,
  SIRE: false,
  compras: false,
  ////////////
  inventario: false,
  verOtrosAlmacenes: false,
  verInAlmacen: false,
  verOutAlmacen: false,
  ////////////
  ordenesProduccion: false,
  ordenesServicio: false,
  seguimientoCosto: false,
  bancos: false,
  planilla: false,
  libroDiario: false,
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
  useStyles$(styles);

  //#region INICIALIZACION
  const navegarA = useNavigate();
  const passwordTF = useSignal(true);

  /**** EN PRODUCCION */
  /**** EN PRODUCCION */
  /**** EN PRODUCCION : Subir este archivo con email: '' , contrasena: '' */
  const definicion_CTX_LOGEO = useStore({
    mostrarSpinner: false,

    //-- BETA --
    // email: 'paolo@cao.com',
    // contrasena: '123',
    //-- BETA --
    // email: 'taty_vizconde@hotmail.com',
    // contrasena: '123456',
    //-- BETA --
    // email: 'mvizconde@cao.com',
    // contrasena: '12345678',

    //PRODUCCION
    email: '',
    contrasena: '',
  });
  //#endregion INICIALIZACION

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
  const analisisDeLogeo = $(async (logeado: string, usuario: string) => {
    // //console.log('analisisDeLogeo -> logeado', logeado);
    const sucursales = await getSucursalesAdjuntasUsuario({ idUsuario: logeado });
    // console.log('💎💎💎💎💎💎💎analisisDeLogeo -> sucursales', sucursales.data);

    parametrosGlobales.usuario = usuario;
    parametrosGlobales.sucursalesAdjuntas = sucursales.data;

    //CERO SUCURSAL
    if (sucursales.data.length === 0) {
      // //console.log('sucursales.data.length === 0');
      alert('No existe una sucursal adjunta.');
    }
    //UNA SUCURSAL
    if (sucursales.data.length === 1) {
      // //console.log('sucursales.data.length === 1');

      let activo = await getActivoGEEMPSUCUR({
        idGrupoEmpresarial: sucursales.data[0].idGrupoEmpresarial,
        idEmpresa: sucursales.data[0].idEmpresa,
        idSucursal: sucursales.data[0].idSucursal,
      });
      activo = activo.data;

      if (!activo[0].activoGE) {
        alert(`El grupo empresarial ${sucursales.data[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`);
        return;
      }
      if (!activo[0].activoEMP) {
        alert(`La empresa ${sucursales.data[0].empresa} esta inactiva. Pongase en contacto con el administrador.`);
        return;
      }
      if (!activo[0].activoSUCUR) {
        alert(`La sucursal ${sucursales.data[0].sucursal} esta inactiva. Pongase en contacto con el administrador.`);
        return;
      }
      console.log('🧧🧧🧧activo', activo);
      //console.log('**UNA SUCURSAL**');
      parametrosGlobales.idSucursal = sucursales.data[0].idSucursal;
      parametrosGlobales.sucursal = sucursales.data[0].sucursal;
      parametrosGlobales.sucursalDireccion = sucursales.data[0].sucursalDireccion;
      parametrosGlobales.idAlmacen = sucursales.data[0].idSucursal; //******* */
      parametrosGlobales.idGrupoEmpresarial = sucursales.data[0].idGrupoEmpresarial;
      parametrosGlobales.nombreGrupoEmpresarial = sucursales.data[0].grupoEmpresarial;
      parametrosGlobales.idEmpresa = sucursales.data[0].idEmpresa;
      parametrosGlobales.RazonSocial = sucursales.data[0].empresa;
      parametrosGlobales.idPersona = sucursales.data[0].idPersona;

      parametrosGlobales.RUC = sucursales.data[0].numeroIdentidad;
      parametrosGlobales.Direccion = sucursales.data[0].direccion;
      parametrosGlobales.departamento = sucursales.data[0].departamento;
      parametrosGlobales.provincia = sucursales.data[0].provincia;
      parametrosGlobales.distrito = sucursales.data[0].distrito;
      parametrosGlobales.ubigeo = sucursales.data[0].ubigeo;

      parametrosGlobales.actualizarPrecioPublico = sucursales.data[0].actualizarPrecioPublico;

      parametrosGlobales.editarTipoCambioManual = sucursales.data[0].editarTipoCambioManual;
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
      parametrosGlobales.facturaElectronica = sucursales.data[0].facturaElectronica;
      parametrosGlobales.verNotaVenta = sucursales.data[0].verNotaVenta;
      parametrosGlobales.verFactura = sucursales.data[0].verFactura;
      parametrosGlobales.verReporteFacturacion = sucursales.data[0].verReporteFacturacion;
      parametrosGlobales.verCotizacion = sucursales.data[0].verCotizacion;
      parametrosGlobales.verGestionNotaVentaCredito = sucursales.data[0].verGestionNotaVentaCredito;
      ///////////
      parametrosGlobales.guiaElectronica = sucursales.data[0].guiaElectronica;
      parametrosGlobales.SIRE = sucursales.data[0].SIRE;
      parametrosGlobales.compras = sucursales.data[0].compras;
      ////////////
      parametrosGlobales.inventario = sucursales.data[0].inventario; //******* */
      parametrosGlobales.verOtrosAlmacenes = sucursales.data[0].verOtrosAlmacenes; //******* */
      parametrosGlobales.verInAlmacen = sucursales.data[0].verInAlmacen;
      parametrosGlobales.verOutAlmacen = sucursales.data[0].verOutAlmacen;
      ///////////
      parametrosGlobales.ordenesProduccion = sucursales.data[0].ordenesProduccion;
      parametrosGlobales.ordenesServicio = sucursales.data[0].ordenesServicio;
      parametrosGlobales.seguimientoCosto = sucursales.data[0].seguimientoCosto;
      parametrosGlobales.bancos = sucursales.data[0].bancos;
      parametrosGlobales.planilla = sucursales.data[0].planilla;
      parametrosGlobales.libroDiario = sucursales.data[0].libroDiario;

      const losPeri = await getPeriodos({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        bandera: '',
      });
      parametrosGlobales.periodos = losPeri.data;
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
    }
    //MAS DE UNA SUCURSAL
    if (sucursales.data.length > 1) {
      // //console.log('sucursales.data.length > 1');
      navegarA('/listadoSucursales');
    }
    definicion_CTX_LOGEO.mostrarSpinner = false;
  });
  // const analisisDeLogeo = $(async (logeo: any) => {
  //   // localStorage.setItem('ID', logeo._id);
  //   //console.log('***-->logeo', logeo);
  //   if (typeof logeo.sucursalesAdjuntas === 'undefined' || logeo.sucursalesAdjuntas.length === 0) {
  //     navegarA('/ningunaEmpresa');
  //   } else {
  //     if (logeo.sucursalesAdjuntas.length === 1) {
  //       //UNA EMPRESA
  //       //console.log('UNA EMPRESA*');
  //       if (logeo.sucursalesAdjuntas[0].todasLasSucursales === true) {
  //         //console.log('logeo.sucursalesAdjuntas[0].todasLasSucursales === true');
  //         if (
  //           typeof logeo.sucursalesAdjuntas[0].sucursales === 'undefined' ||
  //           logeo.sucursalesAdjuntas[0].sucursales.length === 0
  //         ) {
  //           navegarA('/ningunaSucursal');
  //         } else {
  //           if (logeo.sucursalesAdjuntas[0].sucursales.length === 1) {
  //             //console.log('UNA EMPRESA --> UNA SUCURSAL');
  //             //UNA SUCURSAL
  //             let activo = await getActivoGEEMPSUCUR({
  //               idGrupoEmpresarial: logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
  //               idEmpresa: logeo.sucursalesAdjuntas[0].idEmpresa,
  //               idSucursal: logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal,
  //             });
  //             activo = activo.data;

  //             if (!activo[0].activoGE) {
  //               alert(
  //                 `El grupo empresarial ${logeo.sucursalesAdjuntas[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             if (!activo[0].activoEMP) {
  //               alert(
  //                 `La empresa ${logeo.sucursalesAdjuntas[0].empresa} esta inactiva. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             if (!activo[0].activoSUCUR) {
  //               alert(
  //                 `La sucursal ${logeo.sucursalesAdjuntas[0].sucursales[0].sucursal} esta inactiva. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             ///////////

  //             // localStorage.setItem('idGrupoEmpresarial', logeo.sucursalesAdjuntas[0].idGrupoEmpresarial);
  //             // localStorage.setItem('grupoEmpresarial', logeo.sucursalesAdjuntas[0].grupoEmpresarial);
  //             // localStorage.setItem('idEmpresa', logeo.sucursalesAdjuntas[0].idEmpresa);
  //             // localStorage.setItem('empresa', logeo.sucursalesAdjuntas[0].empresa);
  //             // localStorage.setItem('numeroIdentidad', logeo.sucursalesAdjuntas[0].numeroIdentidad);
  //             // localStorage.setItem('usuario', logeo.usuario);
  //             // localStorage.setItem('idSucursal', logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal);
  //             // localStorage.setItem('sucursal', logeo.sucursalesAdjuntas[0].sucursales[0].sucursal);
  //             // localStorage.setItem('almacenActivo', activo[0].almacenActivo);
  //             //console.log('**PAPASECA**');
  //             parametrosGlobales.idGrupoEmpresarial = logeo.sucursalesAdjuntas[0].idGrupoEmpresarial;
  //             parametrosGlobales.nombreGrupoEmpresarial = logeo.sucursalesAdjuntas[0].grupoEmpresarial;
  //             parametrosGlobales.idEmpresa = logeo.sucursalesAdjuntas[0].idEmpresa;
  //             parametrosGlobales.RazonSocial = logeo.sucursalesAdjuntas[0].empresa;
  //             parametrosGlobales.RUC = logeo.sucursalesAdjuntas[0].numeroIdentidad;
  //             parametrosGlobales.Direccion = logeo.sucursalesAdjuntas[0].direccion;
  //             parametrosGlobales.colorHeaderEmpresarial = activo[0].colorHeaderEmpresarial;
  //             parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
  //             parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
  //             parametrosGlobales.facturacionElectronica = activo[0].facturacionElectronica;
  //             parametrosGlobales.facturacionElectronicaAutomatica = activo[0].facturacionElectronicaAutomatica;
  //             parametrosGlobales.facturaJSON = activo[0].facturaJSON;
  //             parametrosGlobales.facturaXML = activo[0].facturaXML;
  //             parametrosGlobales.contabilizarOperaciones = activo[0].contabilizarOperaciones;
  //             parametrosGlobales.planesContables = activo[0].planesContables;
  //             parametrosGlobales.asientoCompra = activo[0].asientoCompra;
  //             parametrosGlobales.asientoVenta = activo[0].asientoVenta;
  //             parametrosGlobales.codigoContableVentaServicio = activo[0].codigoContableVentaServicio;
  //             parametrosGlobales.descripcionContableVentaServicio = activo[0].descripcionContableVentaServicio;
  //             parametrosGlobales.idLibroDiario = activo[0].idLibroDiario;
  //             parametrosGlobales.idEjercicio = activo[0].idEjercicio;
  //             parametrosGlobales.ejercicio = activo[0].ejercicio;
  //             parametrosGlobales.usuario = logeo.usuario;
  //             parametrosGlobales.idSucursal = logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal;
  //             parametrosGlobales.sucursal = logeo.sucursalesAdjuntas[0].sucursales[0].sucursal;
  //             parametrosGlobales.idAlmacen = logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal; //******* */
  //             parametrosGlobales.almacenActivo = activo[0].almacenActivo;
  //             const losPeri = await getPeriodos({
  //               idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //               idEmpresa: parametrosGlobales.idEmpresa,
  //               bandera: '',
  //             });
  //             parametrosGlobales.periodos = losPeri.data;
  //             // //console.log('json_', losPeri.data);
  //             // localStorage.setItem('periodos', losPeri.data);
  //             //PAGINA DE INICIO
  //             if (parametrosGlobales.almacenActivo) {
  //               navegarA(parametrosGlobales.paginaInicioDelSistema);
  //             } else {
  //               if (
  //                 parametrosGlobales.paginaInicioDelSistema === '/inAlmacen' ||
  //                 parametrosGlobales.paginaInicioDelSistema === '/outAlmacen' ||
  //                 parametrosGlobales.paginaInicioDelSistema === '/kardex'
  //               ) {
  //                 navegarA(parametrosGlobales.paginaInicioDefault);
  //               } else {
  //                 navegarA(parametrosGlobales.paginaInicioDelSistema);
  //               }
  //             }

  //             // Object.freeze(parametrosGlobales);
  //           } else {
  //             //console.log('UNA EMPRESA --> VARIAS SUCURSALES');
  //             //VARIAS SUCURSALES
  //             let activo = await getActivoGEEMP({
  //               idGrupoEmpresarial: logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
  //               idEmpresa: logeo.sucursalesAdjuntas[0].idEmpresa,
  //             });
  //             activo = activo.data;

  //             if (!activo[0].activoGE) {
  //               alert(
  //                 `El grupo empresarial ${logeo.sucursalesAdjuntas[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             if (!activo[0].activoEMP) {
  //               alert(
  //                 `La empresa ${logeo.sucursalesAdjuntas[0].empresa} esta inactiva. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             // localStorage.setItem('idGrupoEmpresarial', logeo.sucursalesAdjuntas[0].idGrupoEmpresarial);
  //             // localStorage.setItem('grupoEmpresarial', logeo.sucursalesAdjuntas[0].grupoEmpresarial);
  //             // localStorage.setItem('idEmpresa', logeo.sucursalesAdjuntas[0].idEmpresa);
  //             // localStorage.setItem('empresa', logeo.sucursalesAdjuntas[0].empresa);
  //             // localStorage.setItem('numeroIdentidad', logeo.sucursalesAdjuntas[0].numeroIdentidad);
  //             // localStorage.setItem('usuario', logeo.usuario);
  //             // localStorage.setItem('SUCURSALES', JSON.stringify(logeo.sucursalesAdjuntas[0].sucursales));
  //             //console.log('**MONDONGO**');
  //             parametrosGlobales.idGrupoEmpresarial = logeo.sucursalesAdjuntas[0].idGrupoEmpresarial;
  //             parametrosGlobales.nombreGrupoEmpresarial = logeo.sucursalesAdjuntas[0].grupoEmpresarial;
  //             parametrosGlobales.idEmpresa = logeo.sucursalesAdjuntas[0].idEmpresa;
  //             parametrosGlobales.RazonSocial = logeo.sucursalesAdjuntas[0].empresa;
  //             parametrosGlobales.RUC = logeo.sucursalesAdjuntas[0].numeroIdentidad;
  //             parametrosGlobales.Direccion = logeo.sucursalesAdjuntas[0].direccion;
  //             parametrosGlobales.colorHeaderEmpresarial = activo[0].colorHeaderEmpresarial;
  //             parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
  //             parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
  //             parametrosGlobales.facturacionElectronica = activo[0].facturacionElectronica;
  //             parametrosGlobales.facturacionElectronicaAutomatica = activo[0].facturacionElectronicaAutomatica;
  //             parametrosGlobales.facturaJSON = activo[0].facturaJSON;
  //             parametrosGlobales.facturaXML = activo[0].facturaXML;
  //             parametrosGlobales.contabilizarOperaciones = activo[0].contabilizarOperaciones;
  //             parametrosGlobales.planesContables = activo[0].planesContables;
  //             parametrosGlobales.asientoCompra = activo[0].asientoCompra;
  //             parametrosGlobales.asientoVenta = activo[0].asientoVenta;
  //             parametrosGlobales.codigoContableVentaServicio = activo[0].codigoContableVentaServicio;
  //             parametrosGlobales.descripcionContableVentaServicio = activo[0].descripcionContableVentaServicio;
  //             parametrosGlobales.idLibroDiario = activo[0].idLibroDiario;
  //             parametrosGlobales.idEjercicio = activo[0].idEjercicio;
  //             parametrosGlobales.ejercicio = activo[0].ejercicio;
  //             parametrosGlobales.usuario = logeo.usuario;
  //             //  parametrosGlobales.idSucursal = logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal;
  //             //  parametrosGlobales.sucursal = logeo.sucursalesAdjuntas[0].sucursales[0].sucursal;
  //             // Object.freeze(parametrosGlobales);
  //             navegarA('/listadoSucursales');
  //           }
  //         }
  //       } else {
  //         //console.log('logeo.sucursalesAdjuntas[0].todasLasSucursales === false');
  //         if (
  //           typeof logeo.sucursalesAdjuntas[0].sucursales === 'undefined' ||
  //           logeo.sucursalesAdjuntas[0].sucursales.length === 0
  //         ) {
  //           navegarA('/ningunaSucursal');
  //         } else {
  //           if (logeo.sucursalesAdjuntas[0].sucursales.length === 1) {
  //             //console.log('logeo.sucursalesAdjuntas[0].sucursales.length === 1 -->> va por: getActivoGEEMPSUCUR');
  //             //UNA SUCURSAL
  //             let activo = await getActivoGEEMPSUCUR({
  //               idGrupoEmpresarial: logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
  //               idEmpresa: logeo.sucursalesAdjuntas[0].idEmpresa,
  //               idSucursal: logeo.sucursalesAdjuntas[0].sucursales[0]._id,
  //             });
  //             activo = activo.data;

  //             if (!activo[0].activoGE) {
  //               alert(
  //                 `El grupo empresarial ${logeo.sucursalesAdjuntas[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             if (!activo[0].activoEMP) {
  //               alert(
  //                 `La empresa ${logeo.sucursalesAdjuntas[0].empresa} esta inactiva. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             if (!activo[0].activoSUCUR) {
  //               alert(
  //                 `La sucursal ${logeo.sucursalesAdjuntas[0].sucursales[0].sucursal} esta inactiva. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }

  //             // localStorage.setItem('idGrupoEmpresarial', logeo.sucursalesAdjuntas[0].idGrupoEmpresarial);
  //             // localStorage.setItem('grupoEmpresarial', logeo.sucursalesAdjuntas[0].grupoEmpresarial);
  //             // localStorage.setItem('idEmpresa', logeo.sucursalesAdjuntas[0].idEmpresa);
  //             // localStorage.setItem('empresa', logeo.sucursalesAdjuntas[0].empresa);
  //             // localStorage.setItem('numeroIdentidad', logeo.sucursalesAdjuntas[0].numeroIdentidad);
  //             // localStorage.setItem('usuario', logeo.usuario);

  //             // localStorage.setItem('idSucursal', logeo.sucursalesAdjuntas[0].sucursales[0].idSucursal);
  //             // localStorage.setItem('sucursal', logeo.sucursalesAdjuntas[0].sucursales[0].sucursal);
  //             // localStorage.setItem('almacenActivo', activo[0].almacenActivo);
  //             //console.log(
  //               '**AJI**',
  //               logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
  //               logeo.sucursalesAdjuntas[0].grupoEmpresarial
  //             );
  //             // parametrosGlobales={};

  //             parametrosGlobales.nombreGrupoEmpresarial = logeo.sucursalesAdjuntas[0].grupoEmpresarial;
  //             parametrosGlobales.idGrupoEmpresarial = logeo.sucursalesAdjuntas[0].idGrupoEmpresarial;

  //             parametrosGlobales.idEmpresa = logeo.sucursalesAdjuntas[0].idEmpresa;
  //             parametrosGlobales.RazonSocial = logeo.sucursalesAdjuntas[0].empresa;
  //             parametrosGlobales.RUC = logeo.sucursalesAdjuntas[0].numeroIdentidad;
  //             parametrosGlobales.Direccion = logeo.sucursalesAdjuntas[0].direccion;
  //             parametrosGlobales.colorHeaderEmpresarial = activo[0].colorHeaderEmpresarial;
  //             parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
  //             parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
  //             parametrosGlobales.facturacionElectronica = activo[0].facturacionElectronica;
  //             parametrosGlobales.facturacionElectronicaAutomatica = activo[0].facturacionElectronicaAutomatica;
  //             parametrosGlobales.facturaJSON = activo[0].facturaJSON;
  //             parametrosGlobales.facturaXML = activo[0].facturaXML;
  //             parametrosGlobales.contabilizarOperaciones = activo[0].contabilizarOperaciones;
  //             parametrosGlobales.planesContables = activo[0].planesContables;
  //             parametrosGlobales.asientoCompra = activo[0].asientoCompra;
  //             parametrosGlobales.asientoVenta = activo[0].asientoVenta;
  //             parametrosGlobales.codigoContableVentaServicio = activo[0].codigoContableVentaServicio;
  //             parametrosGlobales.descripcionContableVentaServicio = activo[0].descripcionContableVentaServicio;
  //             parametrosGlobales.idLibroDiario = activo[0].idLibroDiario;
  //             parametrosGlobales.idEjercicio = activo[0].idEjercicio;
  //             parametrosGlobales.ejercicio = activo[0].ejercicio;
  //             parametrosGlobales.usuario = logeo.usuario;
  //             parametrosGlobales.idSucursal = logeo.sucursalesAdjuntas[0].sucursales[0]._id;
  //             parametrosGlobales.sucursal = logeo.sucursalesAdjuntas[0].sucursales[0].sucursal;
  //             parametrosGlobales.idAlmacen = logeo.sucursalesAdjuntas[0].sucursales[0]._id; //******* */
  //             parametrosGlobales.almacenActivo = activo[0].almacenActivo;
  //             const losPeri = await getPeriodos({
  //               idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
  //               idEmpresa: parametrosGlobales.idEmpresa,
  //               bandera: '',
  //             });
  //             parametrosGlobales.periodos = losPeri.data;
  //             // //console.log('json_b', JSON.stringify(losPeri.data));
  //             // localStorage.setItem('periodos', JSON.stringify(losPeri.data));
  //             //PAGINA DE INICIO
  //             if (parametrosGlobales.almacenActivo) {
  //               navegarA(parametrosGlobales.paginaInicioDelSistema);
  //             } else {
  //               if (
  //                 parametrosGlobales.paginaInicioDelSistema === '/inAlmacen' ||
  //                 parametrosGlobales.paginaInicioDelSistema === '/outAlmacen' ||
  //                 parametrosGlobales.paginaInicioDelSistema === '/kardex'
  //               ) {
  //                 navegarA(parametrosGlobales.paginaInicioDefault);
  //               } else {
  //                 navegarA(parametrosGlobales.paginaInicioDelSistema);
  //               }
  //             }
  //             // Object.freeze(parametrosGlobales);
  //           } else {
  //             //console.log('logeo.sucursalesAdjuntas[0].sucursales.length !== 1');
  //             //VARIAS SUCURSALES
  //             let activo = await getActivoGEEMP({
  //               idGrupoEmpresarial: logeo.sucursalesAdjuntas[0].idGrupoEmpresarial,
  //               idEmpresa: logeo.sucursalesAdjuntas[0].idEmpresa,
  //             });
  //             activo = activo.data;

  //             if (!activo[0].activoGE) {
  //               alert(
  //                 `El grupo empresarial ${logeo.sucursalesAdjuntas[0].grupoEmpresarial} esta inactivo. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             if (!activo[0].activoEMP) {
  //               alert(
  //                 `La empresa ${logeo.sucursalesAdjuntas[0].empresa} esta inactiva. Pongase en contacto con el administrador.`
  //               );
  //               return;
  //             }
  //             // localStorage.setItem('idGrupoEmpresarial', logeo.sucursalesAdjuntas[0].idGrupoEmpresarial);
  //             // localStorage.setItem('grupoEmpresarial', logeo.sucursalesAdjuntas[0].grupoEmpresarial);
  //             // localStorage.setItem('idEmpresa', logeo.sucursalesAdjuntas[0].idEmpresa);
  //             // localStorage.setItem('empresa', logeo.sucursalesAdjuntas[0].empresa);
  //             // localStorage.setItem('numeroIdentidad', logeo.sucursalesAdjuntas[0].numeroIdentidad);
  //             // localStorage.setItem('usuario', logeo.usuario);
  //             //console.log('**CHILE**');
  //             parametrosGlobales.idGrupoEmpresarial = logeo.sucursalesAdjuntas[0].idGrupoEmpresarial;
  //             parametrosGlobales.nombreGrupoEmpresarial = logeo.sucursalesAdjuntas[0].grupoEmpresarial;
  //             parametrosGlobales.idEmpresa = logeo.sucursalesAdjuntas[0].idEmpresa;
  //             parametrosGlobales.RazonSocial = logeo.sucursalesAdjuntas[0].empresa;
  //             parametrosGlobales.RUC = logeo.sucursalesAdjuntas[0].numeroIdentidad;
  //             parametrosGlobales.Direccion = logeo.sucursalesAdjuntas[0].direccion;
  //             parametrosGlobales.colorHeaderEmpresarial = activo[0].colorHeaderEmpresarial;
  //             parametrosGlobales.agenteRetencion = activo[0].agenteRetencion;
  //             parametrosGlobales.agentePercepcion = activo[0].agentePercepcion;
  //             parametrosGlobales.facturacionElectronica = activo[0].facturacionElectronica;
  //             parametrosGlobales.facturacionElectronicaAutomatica = activo[0].facturacionElectronicaAutomatica;
  //             parametrosGlobales.facturaJSON = activo[0].facturaJSON;
  //             parametrosGlobales.facturaXML = activo[0].facturaXML;
  //             parametrosGlobales.contabilizarOperaciones = activo[0].contabilizarOperaciones;
  //             parametrosGlobales.planesContables = activo[0].planesContables;
  //             parametrosGlobales.asientoCompra = activo[0].asientoCompra;
  //             parametrosGlobales.asientoVenta = activo[0].asientoVenta;
  //             parametrosGlobales.codigoContableVentaServicio = activo[0].codigoContableVentaServicio;
  //             parametrosGlobales.descripcionContableVentaServicio = activo[0].descripcionContableVentaServicio;
  //             parametrosGlobales.idLibroDiario = activo[0].idLibroDiario;
  //             parametrosGlobales.idEjercicio = activo[0].idEjercicio;
  //             parametrosGlobales.ejercicio = activo[0].ejercicio;
  //             parametrosGlobales.usuario = logeo.usuario;
  //             // localStorage.setItem('SUCURSALES', JSON.stringify(logeo.sucursalesAdjuntas[0].sucursales));
  //             // Object.freeze(parametrosGlobales);
  //             navegarA('/listadoSucursales');
  //           }
  //         }
  //       }
  //     } else {
  //       //VARIAS EMPRESA
  //       //console.log('VARIAS EMPRESA');

  //       // localStorage.setItem('usuario', logeo.usuario);
  //       parametrosGlobales.usuario = logeo.usuario;
  //       parametrosGlobales.sucursalesAdjuntas = logeo.sucursalesAdjuntas;
  //       // localStorage.setItem('SUCURSALES_ADJUNTAS', JSON.stringify(logeo.sucursalesAdjuntas));
  //       navegarA('/listadoEmpresas');
  //     }
  //   }
  // });
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
    // parametrosGlobales.mostrarSpinner = true;
    // //console.log('pasooooooooooo!!!');
    let elLogeo = await getUsuarioPanel({
      usuario: definicion_CTX_LOGEO.email.trim(),
      clave: definicion_CTX_LOGEO.contrasena.trim(),
    });
    elLogeo = elLogeo.data;
    console.log('********--elLogeo--******', elLogeo);
    if (elLogeo.length === 1) {
      if (elLogeo[0].activo) {
        //PERFILES - ROLES
        parametrosGlobales.supervisor = elLogeo[0].supervisor;
        parametrosGlobales.almaceneroAlto = elLogeo[0].almaceneroAlto;
        parametrosGlobales.almaceneroMedio = elLogeo[0].almaceneroMedio;
        parametrosGlobales.almaceneroBajo = elLogeo[0].almaceneroBajo;
        parametrosGlobales.vendedorAlto = elLogeo[0].vendedorAlto;
        parametrosGlobales.vendedorMedio = elLogeo[0].vendedorMedio;
        parametrosGlobales.vendedorBajo = elLogeo[0].vendedorBajo;
        //
        analisisDeLogeo(elLogeo[0]._id, elLogeo[0].usuario);
      } else {
        definicion_CTX_LOGEO.mostrarSpinner = false;
        // parametrosGlobales.mostrarSpinner = false;
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
      // parametrosGlobales.mostrarSpinner = false;
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

  //#region FIRMAR XML
  // const firmarXML = $(() => {
  //   const xml = '<library>' + '<book>' + '<name>Harry Potter</name>' + '</book>' + '</library>';

  //   const sig = new SignedXml({ privateKey: readFileSync('certificado.p12') });
  //   sig.addReference({
  //     xpath: "//*[local-name(.)='book']",
  //     digestAlgorithm: 'http://www.w3.org/2000/09/xmldsig#sha1',
  //     transforms: ['http://www.w3.org/2001/10/xml-exc-c14n#'],
  //   });
  //   sig.canonicalizationAlgorithm = 'http://www.w3.org/2001/10/xml-exc-c14n#';
  //   sig.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
  //   sig.computeSignature(xml);
  //   //console.log('🎎🎎🎎🎎');
  //   writeFileSync('signed.xml', sig.getSignedXml());
  //   //console.log('🎎🎎🎎🎎🎎🎎🎎🎎');
  // });
  //#endregion FIRMAR XML
  return (
    <>
      <div class="container" style={{ background: '#eee' }}>
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
            <div>
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
                <div style={{ position: 'relative', left: '12px', display: 'flex' }}>
                  <input
                    id="inputClave_LOGIN"
                    name="clave"
                    type={passwordTF.value ? 'password' : 'text'}
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
                  <img
                    src={passwordTF.value ? images.eye : images.eyePassword}
                    height={12}
                    width={12}
                    style={{ cursor: 'pointer', position: 'relative', left: '-16px' }}
                    onClick$={() => {
                      passwordTF.value = !passwordTF.value;
                    }}
                  />
                </div>
              </div>
              <br />
            </div>

            {/* <button>Registrar</button> */}
            <input
              id="buttonLogearse_LOGIN"
              class="boton-formulario"
              type="button"
              value="Logearse"
              style={{ height: '40px' }}
              onClick$={() => {
                //
                enviar();
                // serverFuncion();
                // const usu = document.getElementById('inputUsuario')?.nodeValue;
                // alert(`fraude-- {usu}`);
              }}
            />
            {/* <input
              id="btn_Sign_LOGIN"
              class="boton-formulario"
              type="button"
              value="Sign"
              onClick$={() => {
                firmarXML();
              }}
            /> */}
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
