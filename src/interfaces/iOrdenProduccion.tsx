export interface IOrdenProduccion {
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

  idSerieOrdenProduccion: string;
  serie: string;
  numero: number;

  igv: any;
  fechaInicio: string;
  // correlativo: number;
  estado: string;
  tipo: string;
  idTecnico: string;
  razonSocialNombreTecnico: string;

  clienteVentasVarias: boolean;
  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombreCliente: string;

  requerimientosCliente: string;
  observacionesCliente: string;

  manufacturas: any;
  requisiciones: any;
  // repuestosDespachados: any;

  divisor: any;

  porcentajeUtilidad: any;
  // precioVentaSugeridoSinIGV: any;
}

export interface IOrdenServicio_Requisicion {
  _id: string;

  fechaInicio: string;
  correlativo: number;
  estado: string;
  tipo: string;

  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombreCliente: string;

  requisiciones: any;
  repuestosDespachados: any;
}
export interface IOrdenServicio_DespachoRequisicion {
  _id: string;
  idAuxiliar: number;
  idKardex: string;

  codigo: string;
  descripcionEquivalencia: string;

  stock: any;
  cantidad: any;
  unidadEquivalencia: string;
  cantidadesDespachadas: any;
  cantidadADespachar: any;
  factor: number;
  tipoEquivalencia: boolean;
  laEquivalencia: any;
}

export interface IServicioSeleccionado {
  sS: any;
}

export interface IItemServicio {
  idAuxiliar: number;
  item: number;
  codigo: string;
  descripcionEquivalencia: string;
  cantidad: number;
  unidadEquivalencia: string;
  costo: number;
  precioUnitarioPEN: number;
  ventaPEN: number;
  precioUnitarioUSD: number;
  ventaUSD: number;
}

export interface IItemRequisicion {
  idAuxiliar: number;
  item: number;
  codigo: string;
  descripcionEquivalencia: string;
  cantidad: number;
  unidadEquivalencia: string;
  costo: number;
  precioUnitarioPEN: number;
  ventaPEN: number;
  precioUnitarioUSD: number;
  ventaUSD: number;
}

export interface IItemRepuestoDespachdo {
  idAuxiliar: number;
  item: number;
  codigo: string;
  descripcionEquivalencia: string;
  cantidad: number;
  unidadEquivalencia: string;
  costo: number;
  precioUnitarioPEN: number;
  ventaPEN: number;
  precioUnitarioUSD: number;
  ventaUSD: number;
}
