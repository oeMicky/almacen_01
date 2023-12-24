export interface IPersona {
  _id: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
  nombre: string;
  paterno: string;
  materno: string;
  activo: boolean;
}

export interface ITecnico {
  _id: string;
  idPersona: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
  nombre: string;
  paterno: string;
  materno: string;
  activo: boolean;
}
