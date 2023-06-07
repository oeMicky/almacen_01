export interface IOrdenServicio {
  _id: string;
  igv: number;
  fechaInicio: string;
  correlativo: number;
  estado: string;
  tipo: string;
  idTecnico: string;
  razonSocialNombreTecnico: string;

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
  repuestosDespachados: any;
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
