export interface IVehiculo {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  placa: string;
  idVehiculoMarca: string;
  vehiculoMarca: string;
  idVehiculoModelo: string;
  vehiculoModelo: string;
  vin: string;
}

export interface IMarcaVehicular {
  _id: string;
  vehiculoMarca: string;
}

export interface IModeloVehicular {
  idVehiculoMarca: string;
  vehiculoMarca: string;
  idVehiculoModelo: string;
  vehiculoModelo: string;
}

export interface IUnidadTransporte {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  placa: string;
  idVehiculoMarca: string;
  vehiculoMarca: string;
  idVehiculoModelo: string;
  vehiculoModelo: string;
  vin: string;

  tarjetaCirculacionCertificadoHabilitacion: string;
}
