export interface IConfiguracion {
  paginaInicioDelSistema: string;
  paginaInicioDefault: string;
  idGrupoEmpresarial: string;
  nombreGrupoEmpresarial: string;
  //Empresa
  idEmpresa: string;
  RazonSocial: string;
  colorHeaderEmpresarial: string;
  Direccion: string;
  RUC: string;
  agenteRetencion: boolean;
  agentePercepcion: boolean;
  //Sucursal
  idSucursal: string;
  sucursal: string;
  sucursalDireccion: string;

  almacenActivo: boolean;
  idAlmacen: string;
  nombreAlmacen: string;
  //Usuario
  usuario: string;
  //
  ingreso: boolean;
  periodos: any;
  // mostrarSpinner: false,
  facturacionElectronica: boolean;
  facturacionElectronicaAutomatica: boolean;
  facturaJSON: boolean;
  facturaXML: boolean;
  contabilizarOperaciones: boolean;
  planesContables: any;
  asientoCompra: any;
  asientoVenta: any;
  codigoContableVentaServicio: string;
  descripcionContableVentaServicio: string;

  idLibroDiario: string;
  idEjercicio: string;
  ejercicio: number;
}
