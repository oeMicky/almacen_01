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

  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;

  igv: number;
  enDolares: boolean;
  moneda: string;
  tipoCambio: number;

  // idOrdenServicio: string;
  // serieOrdenServicio: string;
  // numeroOrdenServicio: number;

  vendedor: string;
  metodoPago: string;
  verCuotasCredito: boolean;
  cuotasCredito: any;
  // cuotasCredito: [ICuotaCreditoVenta];
  importeTotalCuotasCredito: number;

  cotizacion: number;
  ordenServicio: number;

  itemsVenta: any;

  montoSubTotalPEN: number;
  montoIGVPEN: number;
  montoTotalPEN: any;

  montoSubTotalUSD: number;
  montoIGVUSD: number;
  montoTotalUSD: any;
}

export interface ICuotaCreditoVenta {
  idAuxiliar: number;
  fechaCuota: string;
  importeCuotaPEN: number;
}
