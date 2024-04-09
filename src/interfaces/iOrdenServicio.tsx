export interface IOrdenServicio {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idSucursal: string;
  idPeriodo: string;
  periodo: number;

  ruc: string;
  empresa: string;
  direccion: string;

  idSerieOrdenServicio: string;
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

  idVehiculo: string;
  placa: string;
  idVehiculoMarca: string;
  vehiculoMarca: string;
  idVehiculoModelo: string;
  vehiculoModelo: string;
  vin: string;
  kilometraje: number;

  requerimientosCliente: string;
  observacionesCliente: string;

  servicios: any;
  requisiciones: any;
  // repuestosDespachados: any;
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
  precioPEN: number;
  ventaPEN: number;
  precioUSD: number;
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
  precioPEN: number;
  ventaPEN: number;
  precioUSD: number;
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
  precioPEN: number;
  ventaPEN: number;
  precioUSD: number;
  ventaUSD: number;
}
