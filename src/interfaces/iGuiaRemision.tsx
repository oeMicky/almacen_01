export interface IGuiaRemision {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idSucursal: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  direccion: string;

  idModalidadTraslado: string;
  modalidadTraslado: string;
  idMotivoTraslado: string;
  motivoTraslado: string;

  codigoTipoComprobantePago: string;
  tipoComprobantePago: string;
  idSerieVenta: string;
  serie: string;
  numero: number;

  fecha: string;

  idRemitente: string;
  codigoTipoDocumentoIdentidadRemitente: string;
  tipoDocumentoIdentidadRemitente: string;
  numeroIdentidadRemitente: string;
  razonSocialNombreRemitente: string;

  idDestinatario: string;
  codigoTipoDocumentoIdentidadDestinatario: string;
  tipoDocumentoIdentidadDestinatario: string;
  numeroIdentidadDestinatario: string;
  razonSocialNombreDestinatario: string;

  idTransportista: string;
  codigoTipoDocumentoIdentidadTransportista: string;
  tipoDocumentoIdentidadTransportista: string;
  numeroIdentidadTransportista: string;
  razonSocialNombreTransportista: string;

  numeroBultosPallets: string;
  pesoBrutoTotal: string;

  choferes: any;
  unidadesTransporte: any;

  observacion: string;

  //   igv: number;
  //   enDolares: boolean;
  //   moneda: string;
  //   tipoCambio: number;

  //   vendedor: string;
  //   metodoPago: string;

  //   todoEnEfectivo: boolean;
  //   unaParteEnEfectivo: boolean;
  //   montoEnEfectivo: any;
  //   otroMedioPago: string;
  //   montoOtroMedioPago: any;

  //   verCuotasCredito: boolean;
  //   cuotasCredito: any;
  //   // cuotasCredito: [ICuotaCreditoVenta];
  //   importeTotalCuotasCredito: number;

  //   cotizacion: number;

  //   // ordenServicio: number;
  //   idOrdenServicio: string;
  //   serieOrdenServicio: string;
  //   numeroOrdenServicio: number;

  //   observacion: string;

  //   itemsVenta: any;

  //   baseImponiblePEN: any;
  //   igvPEN: any;
  //   exoneradoPEN: any;
  //   inafectoPEN: any;
  //   iscPEN: any;
  //   icbpPEN: any;
  //   otrosPEN: any;
  //   totalPEN: any;

  //   baseImponibleUSD: any;
  //   igvUSD: any;
  //   exoneradoUSD: any;
  //   inafectoUSD: any;
  //   iscUSD: any;
  //   icbpUSD: any;
  //   otrosUSD: any;
  //   totalUSD: any;

  //   // montoSubTotalPEN: any;
  //   // montoIGVPEN: any;
  //   // montoTotalPEN: any;

  //   // montoSubTotalUSD: any;
  //   // montoIGVUSD: any;
  //   // montoTotalUSD: any;

  //   referenciaFecha: string;
  //   referenciaTipo: string;
  //   referenciaSerie: string;
  //   referenciaNumero: number;
}
