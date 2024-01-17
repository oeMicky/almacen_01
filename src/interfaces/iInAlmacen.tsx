export interface IIngresoAAlmacen {
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

  idMotivoIngresoAlmacen: string;
  motivoIngresoAlmacen: string;
  idDocumento: string;

  // serie: string;
  // numero: number;
  FISMA: string;
  reingreso: boolean;

  idElIgv: string;
  elIgv: number;

  idRemitente: string;
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
