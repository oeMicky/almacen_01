export interface ICotizacion {
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

  fecha: string;

  idSerieCotizacion: string;
  serie: string;
  numero: number;

  //correlativo: number;

  idCliente: string;
  codigoTipoDocumentoIdentidad: string;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;
  email: string;

  idVehiculo: string;
  placa: string;
  idVehiculoMarca: string;
  vehiculoMarca: string;
  idVehiculoModelo: string;
  vehiculoModelo: string;
  vin: string;

  //   requerimientosCliente: string;
  //   observacionesCliente: string;
  // idElIgv: string;
  // elIgv: string;
  igv: any;

  servicios: any;
  repuestosLubri: any;
  //   requisiciones: any;
  //   repuestosDespachados: any;

  // montoSubTotalPEN: any;
  // montoIGVPEN: any;
  montoTotalPEN: any;
}
