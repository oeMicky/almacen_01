export interface IMovimientoKARDEX {
  _id: string;

  clave: string;
  tabla: string;

  IS: boolean;

  FISMA: string;
  fechaHoraMovimiento: string;

  cantidadIngresada: any;
  cantidadSacada: any;
  cantidadSaldo: any;
  costoUnitario: any;
  costoUnitarioMovil: any;
  costoIngreso: any;
  costoSalida: any;
  costoSaldo: any;

  cantidadOrigen: any;
  unidadEquivalencia: any;
}
