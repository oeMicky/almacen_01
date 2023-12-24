export interface ICompra {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  direccion: string;

  codigoTCP: string;
  descripcionTCP: string;
  serie: string;
  numero: number;
  fecha: string;
  conFechaVencimiento: boolean;
  fechaVencimiento: string;
  anioDUAoDSI: number;

  idProveedor: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
  email: string;

  idElIgv: string;
  elIgv: string;

  enDolares: boolean;
  moneda: string;
  tipoCambio: any;

  tipoCompra: string;

  baseImponiblePEN: any;
  igvPEN: any;
  adquisicionesNoGravadasPEN: any;
  iscPEN: any;
  icbpPEN: any;
  otrosPEN: any;
  totalPEN: any;

  totalUSD: any;

  fechaReferencia: Date;
  tipoReferencia: string;
  serieReferencia: string;
  numeroReferencia: number;

  usuarioCrea: string;
  usuarioModifica: string;
}
