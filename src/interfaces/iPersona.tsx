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

export interface IPersonaEdit {
  _id: string;

  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
  nombre: string;
  paterno: string;
  materno: string;
  activo: boolean;
  direccion: string;
  email: string;
  telefono: string;
  cuentasCorrientes: any;
}

export interface IPersonaVenta {
  _id: string;
  // idGrupoEmpresarial: string;
  // idEmpresa: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
  nombre: string;
  paterno: string;
  materno: string;
  activo: boolean;
  direccion: string;
  email: string;
  telefono: string;
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

export interface IChofer {
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
  licencia: string;
}

export interface ITransportista {
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
  registroMTC: string;
}

export interface IFavorito {
  _id: string;
  idPersona: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
}
