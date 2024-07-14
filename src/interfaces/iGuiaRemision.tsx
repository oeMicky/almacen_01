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

  guiaRemisionElectronica: boolean;
  guiaRemisionElectronicaAutomatica: boolean;
  verificarObservacionGR: boolean;

  idSerieGuiaRemision: string;
  serie: string;
  numero: any; // number;

  idModalidadTraslado: string;
  modalidadTraslado: string;
  idMotivoTraslado: string;
  motivoTraslado: string;

  fechaEmision: string;
  fechaInicioTraslado: string;

  puntoPartida: string;
  ubigeoPartida: string;
  puntoLlegada: string;
  ubigeoLlegada: string;

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
  notificarDestinatario: boolean;

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
}
