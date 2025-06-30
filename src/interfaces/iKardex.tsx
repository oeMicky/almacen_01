export interface IMovimientoKARDEX {
  _id: string;

  clave: string;
  tabla: string;

  IS: boolean;
  motivoIS: string;

  FISMA: string;
  fechaHoraMovimiento: string;

  ubigeo: string;

  cantidadIngresada: any;
  cantidadSacada: any;
  cantidadSaldo: any;
  costoUnitario: any;
  costoUnitarioMovil: any;
  costoIngreso: any;
  costoSalida: any;
  costoSaldo: any;

  cantidadOrigenEquivalencia: any;
  unidadEquivalencia: any;
}

export interface IUbigeoStock {
  _id: string;
  ubigeo: string;
  stock: any;
}
