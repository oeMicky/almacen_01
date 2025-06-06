export interface IEgresoDeAlmacen {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idSucursal: string;
  idAlmacen: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  direccion: string;

  idMotivoEgresoAlmacen: string;
  motivoEgresoAlmacen: string;
  idDocumento: string;

  idSucursalDestino: string;
  sucursalDestino: string;
  idSerieNotaIngresoDestino: string;
  serieNotaIngresoDestino: string;
  idMotivoIngresoDestino: string;
  motivoIngresoDestino: string;

  idSerieNotaSalida: string;
  serie: string;

  observacion: string;

  // numero: number;
  FISMA: string;
  igv: any;

  idDestinatario: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;

  // periodoContable: number;

  // igv: number;

  // montoSubTotalPEN: number;
  // montoIGVPEN: number;
  // montoTotalPEN: number;

  documentosAdjuntos: any;
  itemsMercaderias: any;

  usuarioCrea: string;
  creado: string;
}

export interface IMercaderiaOUT_Seleccionada {
  mM: any;
}

export interface IMercaEquivalenciaOUT {
  _id: string;
  idAuxiliar: number;
  descripcionEquivalencia: string;
  laEquivalencia: any;
  idUnidadEquivalencia: string;
  unidadEquivalencia: string;
  pesoKg: number;
  factor: number;
  tipoEquivalencia: boolean;
}

export interface INotaSalidaReingreso {
  _id: string;
  // idGrupoEmpresarial: string;
  // idEmpresa: string;
  // idSucursal: string;
  // idAlmacen: string;
  // idPeriodo: string;
  // periodo: number;

  FISMA: string;
  razonSocialNombre: string;

  serie: string;
  numero: string;
}
