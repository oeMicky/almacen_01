export interface IOrdenServicio {
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

  idSerieOrdenServicio: string;
  serie: string;
  numero: number;

  igv: any;
  fechaInicio: string;
  fechaFinal: string;
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

  osConRegistroDeVehiculo: boolean;
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

  // soloServicios: boolean;
  // soloSuministros: boolean;
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

export interface IOrdenServicio_Terminado {
  _id: string;
  fechaInicio: string;
  serie: string;
  numero: number;

  clienteVentasVarias: boolean;
  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombreCliente: string;
  ventaPEN_SERVICIOS: any;
  ventaPEN_SERVICIOS_paraTOTAL: any;
  ventaPEN_REQUISICIONES: any;
  ventaPEN_REQUISICIONES_paraTOTAL: any;

  servicios: any;
  requisiciones: any;
}
