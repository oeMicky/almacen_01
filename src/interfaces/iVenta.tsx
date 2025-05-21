export interface IVenta {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idSucursal: string;
  sucursal: string;
  sucursalDireccion: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;

  facturacionElectronica: boolean;
  facturacionElectronicaAutomatica: boolean;
  facturaJSON: boolean;
  facturaXML: boolean;
  verificarObservacionVenta: boolean;

  codigoTipoOperacion: string;
  tipoOperacion: string;

  codigoTipoComprobantePago: string;
  tipoComprobantePago: string;
  idSerieVenta: string;
  serie: string;
  numero: number;

  idNotaVenta: string;
  serieNotaVenta: string;
  numeroNotaVenta: number;

  fecha: string;
  hora: string;

  clienteVentasVarias: boolean;
  estrellasCliente: number;
  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
  direccionCliente: string;
  email: string;
  telefono: string;
  actualizarEmailCliente: boolean;

  igv: any;
  enDolares: boolean;
  moneda: string;
  tipoCambio: number;

  vendedor: string;
  metodoPago: string;

  todoEnEfectivo: boolean;
  unaParteEnEfectivo: boolean;
  montoEnEfectivo: any;
  otroMedioPago: string;
  montoOtroMedioPago: any;

  verCuotasCredito: boolean;
  cuotasCredito: any;
  // cuotasCredito: [ICuotaCreditoVenta];
  importeTotalCuotasCredito: number;

  idCotizacion: string;
  serieCotizacion: string;
  numeroCotizacion: number;

  idOrdenServicio: string;
  serieOrdenServicio: string;
  numeroOrdenServicio: number;
  soloServicios: boolean;
  soloSuministros: boolean;

  observacion: string;

  impresionTipoFacturaBoleta: boolean;
  itemsVenta: any;

  baseImponiblePEN: any;
  igvPEN: any;
  exoneradoPEN: any;
  inafectoPEN: any;
  iscPEN: any;
  exportPEN: any;
  otrosPEN: any;
  totalPEN: any;

  baseImponibleUSD: any;
  igvUSD: any;
  exoneradoUSD: any;
  inafectoUSD: any;
  iscUSD: any;
  exportUSD: any;
  otrosUSD: any;
  totalUSD: any;

  lite: string;

  // montoSubTotalPEN: any;
  // montoIGVPEN: any;
  // montoTotalPEN: any;

  // montoSubTotalUSD: any;
  // montoIGVUSD: any;
  // montoTotalUSD: any;

  referenciaCodigo: string; //Codigo del motivo
  referenciaDescripcion: string; //Descripción del motivo
  referenciaFecha: string;
  referenciaTipo: string;
  referenciaSerie: string;
  referenciaNumero: number;

  json: string;

  contabilizarOperaciones: boolean;
  asientoContable: any;
  totalDebePEN: any;
  totalHaberPEN: any;
  totalDebeUSD: any;
  totalHaberUSD: any;

  ganancias: any;

  ventaConDetraccion: boolean;
  detraccion: boolean;
  detraccionCodigo: string;
  detraccionDescripcion: string;
  detraccionMedioPagoCodigo: string;
  detraccionMedioPagoDescripcion: string;
  detraccionMontoPEN: any;
  detraccionNumCuentaBancoNacion: string;
  detraccionPorcentaje: any;
  detraccionConstancia: string;
  detraccionFecha: string;
}

export interface ICuotaCreditoVenta {
  idAuxiliar: number;
  fechaCuota: string;
  importeCuotaPEN: number;
}

export interface IReporteVenta {
  _id: string;
  ruc: string;

  clienteVentasVarias: boolean;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;

  facturaJSON: boolean;
  facturaXML: boolean;

  codigoTipoComprobantePago: string;
  serie: string;
  numero: number;

  fecha: string;
  fechaLocal: string;

  todoEnEfectivo: boolean;
  unaParteEnEfectivo: boolean;
  montoEnEfectivo: any;
  otroMedioPago: string;
  montoOtroMedioPago: any;

  totalPEN: any;

  totalUSD: any;

  vendedor: string;
  metodoPago: string;

  enDolares: boolean;
  moneda: string;
  tipoCambio: number;

  ganancias: any;

  estado: string;
  proveedor_estatus: boolean;
  sunat_estatus: boolean;
  sunat_estatusAnulacion: boolean;
  // xml: string;
  // sunat_CDR_Xml: string;
}

export interface IVentaCLienteVentasVarias {
  _id: string;

  clienteVentasVarias: boolean;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;

  serie: string;
  numero: number;

  fecha: string;

  idOrdenServicio: string;
  serieOrdenServicio: string;
  numeroOrdenServicio: number;

  itemsVenta: any;

  todoEnEfectivo: boolean;
  unaParteEnEfectivo: boolean;
  montoEnEfectivo: any;
  otroMedioPago: string;
  montoOtroMedioPago: any;

  totalPEN: any;

  totalUSD: any;

  vendedor: string;
  metodoPago: string;

  enDolares: boolean;
  moneda: string;
  tipoCambio: number;

  ganancias: any;
}

export interface INotaVenta {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idAlmacen: string;
  idSucursal: string;
  sucursal: string;
  sucursalDireccion: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;

  // facturacionElectronica: boolean;
  // facturacionElectronicaAutomatica: boolean;
  // facturaJSON: boolean;
  // facturaXML: boolean;
  verificarObservacionVenta: boolean;

  // codigoTipoOperacion: string;
  // tipoOperacion: string;
  idSerieNotaSalida: string;
  serieNotaSalida: string;
  // codigoTipoComprobantePago: string;
  // tipoComprobantePago: string;
  idSerieNotaVenta: string;
  serie: string;
  numero: number;

  fecha: string;
  hora: string;

  clienteVentasVarias: boolean;
  estrellasCliente: number;
  // idCliente: string;
  // codigoTipoDocumentoIdentidad: string;
  // tipoDocumentoIdentidad: string;
  // numeroIdentidad: string;
  // razonSocialNombre: string;
  // direccionCliente: string;
  // email: string;
  // telefono: string;
  // actualizarEmailCliente: boolean;

  igv: any;
  enDolares: boolean;
  moneda: string;
  tipoCambio: number;

  vendedor: string;
  metodoPago: string;

  todoEnEfectivo: boolean;
  unaParteEnEfectivo: boolean;
  montoEnEfectivo: any;
  otroMedioPago: string;
  montoOtroMedioPago: any;

  verCuotasCredito: boolean;
  cuotasCredito: any;
  // cuotasCredito: [ICuotaCreditoVenta];
  importeTotalCuotasCredito: any;

  idCotizacion: string;
  serieCotizacion: string;
  numeroCotizacion: number;

  idOrdenServicio: string;
  serieOrdenServicio: string;
  numeroOrdenServicio: number;

  observacion: string;

  idMotivoEgresoAlmacen: string;
  // impresionTipoFacturaBoleta: boolean;
  itemsNotaVenta: any;

  baseImponiblePEN: any;
  igvPEN: any;
  exoneradoPEN: any;
  inafectoPEN: any;
  iscPEN: any;
  exportPEN: any;
  otrosPEN: any;
  totalPEN: any;

  baseImponibleUSD: any;
  igvUSD: any;
  exoneradoUSD: any;
  inafectoUSD: any;
  iscUSD: any;
  exportUSD: any;
  otrosUSD: any;
  totalUSD: any;

  lite: string;

  efectivoIngresado: any;
  vuelto: any;

  clienteSobrenombreChapa: string;
  placa: string;
  kilometraje: string;
  checkACuenta: boolean;
  aCuenta: string;

  // montoSubTotalPEN: any;
  // montoIGVPEN: any;
  // montoTotalPEN: any;

  // montoSubTotalUSD: any;
  // montoIGVUSD: any;
  // montoTotalUSD: any;

  // referenciaCodigo: string; //Codigo del motivo
  // referenciaDescripcion: string; //Descripción del motivo
  // referenciaFecha: string;
  // referenciaTipo: string;
  // referenciaSerie: string;
  // referenciaNumero: number;

  // json: string;

  contabilizarOperaciones: boolean;
  asientoContable: any;
  totalDebePEN: any;
  totalHaberPEN: any;
  totalDebeUSD: any;
  totalHaberUSD: any;

  ganancias: any;

  // ventaConDetraccion: boolean;
  // detraccion: boolean;
  // detraccionCodigo: string;
  // detraccionDescripcion: string;
  // detraccionMedioPagoCodigo: string;
  // detraccionMedioPagoDescripcion: string;
  // detraccionMontoPEN: any;
  // detraccionNumCuentaBancoNacion: string;
  // detraccionPorcentaje: any;
  // detraccionConstancia: string;
  // detraccionFecha: string;
}

export interface IReporteNotaVenta {
  _id: string;
  ruc: string;

  // clienteVentasVarias: boolean;
  // codigoTipoDocumentoIdentidad: string;
  // tipoDocumentoIdentidad: string;
  // numeroIdentidad: string;
  // razonSocialNombre: string;

  observacion: string;

  facturaJSON: boolean;
  facturaXML: boolean;

  codigoTipoComprobantePago: string;
  serie: string;
  numero: number;

  clienteSobrenombreChapa: string;
  importeTotalCuotasCredito: any;

  fecha: string;
  fechaLocal: string;

  todoEnEfectivo: boolean;
  unaParteEnEfectivo: boolean;
  montoEnEfectivo: any;
  otroMedioPago: string;
  montoOtroMedioPago: any;

  igv: any;

  existeOtros: boolean;

  itemsNotaVenta: any;

  totalPEN: any;

  totalUSD: any;

  vendedor: string;
  metodoPago: string;

  enDolares: boolean;
  moneda: string;
  tipoCambio: number;

  ganancias: any;

  estado: string;
  proveedor_estatus: boolean;
  sunat_estatus: boolean;
  sunat_estatusAnulacion: boolean;
  // xml: string;
  // sunat_CDR_Xml: string;
  idVenta: string;
  serieVenta: string;
  numeroVenta: number;
}
