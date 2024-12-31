export interface IGuiaRemision {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idSucursal: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  sucursal: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;

  guiaRemisionElectronica: boolean;
  guiaRemisionElectronicaAutomatica: boolean;
  guiaRemisionJSON: boolean;
  guiaRemisionXML: boolean;
  verificarObservacionGR: boolean;

  codigoTipoComprobantePago: string;
  tipoComprobantePago: string;
  idSerieGuiaRemision: string;
  serie: string;
  numero: number; // any;

  fechaEmision: string;
  fechaEmisionFechaLocal: string;
  fechaEmisionHoraLocal: string;
  fHree: any;
  fechaInicioTraslado: string;

  puntoPartida: string;
  ubigeoPartida: string;
  codEstablecimientoPartida: string;
  RUCAsociadoPtoPartida: string;
  puntoLlegada: string;
  ubigeoLlegada: string;
  codEstablecimientoLlegada: string;
  RUCAsociadoPtoLlegada: string;

  idModalidadTraslado: string;
  modalidadTraslado: string;
  idMotivoTraslado: string;
  motivoTraslado: string;

  // notificar: boolean;

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
  direccionDestinatario: string;
  emailDestinatario: string;

  notificar: boolean;

  transportistas: any;
  conductores: any;

  idVehiculoPrincipal: string;
  emisorAutorizacionEspecial: string;
  numeroAutorizacionEspecial: string;
  numeroPlaca: string;
  tarjetaCirculacionOCertificadoHabilitacion: string;

  vehiculosSecundarios: any;

  // idTransportista: string;
  // codigoTipoDocumentoIdentidadTransportista: string;
  // tipoDocumentoIdentidadTransportista: string;
  // numeroIdentidadTransportista: string;
  // razonSocialNombreTransportista: string;
  // registroMTC: string;

  numeroBultosPallets: string;
  pesoBrutoTotal: any;

  // choferes: any;
  // unidadesTransporte: any;

  observacion: string;

  itemsGuiaRemision: any;
}

export interface IDireccionGR {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idSucursal: string;

  direccion: string;

  idDepartamento: string;
  departamento: string;
  idProvincia: string;
  provincia: string;
  idDistrito: string;
  distrito: string;
  ubigeo: string;

  codEstablecimiento: string;
}

export interface IReporteGuiaRemision {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idSucursal: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  sucursal: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;

  guiaRemisionElectronica: boolean;
  guiaRemisionElectronicaAutomatica: boolean;
  guiaRemisionJSON: boolean;
  guiaRemisionXML: boolean;
  verificarObservacionGR: boolean;

  codigoTipoComprobantePago: string;
  tipoComprobantePago: string;
  idSerieGuiaRemision: string;
  serie: string;
  numero: number; // any;

  fechaEmision: string;
  fechaEmisionFechaLocal: string;
  fechaEmisionHoraLocal: string;
  fHree: any;
  fechaInicioTraslado: string;

  puntoPartida: string;
  ubigeoPartida: string;
  codEstablecimientoPartida: string;
  RUCAsociadoPtoPartida: string;
  puntoLlegada: string;
  ubigeoLlegada: string;
  codEstablecimientoLlegada: string;
  RUCAsociadoPtoLlegada: string;

  idModalidadTraslado: string;
  modalidadTraslado: string;
  idMotivoTraslado: string;
  motivoTraslado: string;

  // notificar: boolean;

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
  direccionDestinatario: string;
  emailDestinatario: string;

  notificar: boolean;

  transportistas: any;
  conductores: any;

  idVehiculoPrincipal: string;
  emisorAutorizacionEspecial: string;
  numeroAutorizacionEspecial: string;
  numeroPlaca: string;
  tarjetaCirculacionOCertificadoHabilitacion: string;

  vehiculosSecundarios: any;

  // idTransportista: string;
  // codigoTipoDocumentoIdentidadTransportista: string;
  // tipoDocumentoIdentidadTransportista: string;
  // numeroIdentidadTransportista: string;
  // razonSocialNombreTransportista: string;
  // registroMTC: string;

  numeroBultosPallets: string;
  pesoBrutoTotal: any;

  // choferes: any;
  // unidadesTransporte: any;

  observacion: string;

  itemsGuiaRemision: any;

  proveedor_estatus: boolean;
  proveedor_mensaje: string;

  sunat_estatus: boolean;
}
