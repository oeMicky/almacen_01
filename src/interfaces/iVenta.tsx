export interface IVenta {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idSucursal: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  direccion: string;

  codigoTipoComprobantePago: string;
  tipoComprobantePago: string;
  idSerieVenta: string;
  serie: string;
  numero: number;

  fecha: string;

  clienteVentasVarias: boolean;
  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
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

  observacion: string;

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

  // montoSubTotalPEN: any;
  // montoIGVPEN: any;
  // montoTotalPEN: any;

  // montoSubTotalUSD: any;
  // montoIGVUSD: any;
  // montoTotalUSD: any;

  referenciaFecha: string;
  referenciaTipo: string;
  referenciaSerie: string;
  referenciaNumero: number;

  facturacionElectronica: boolean;
  facturacionElectronicaAutomatica: boolean;

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

  clienteVentasVarias: boolean;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;

  serie: string;
  numero: number;

  fecha: string;

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
