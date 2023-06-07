export interface IMercaderiaOUT {
  _id: string;
  codigo: string;
  conFechaVencimientoLote: boolean;
  descripcion: string;
  equivalencias: any;
  // costoUnitarioMovil: any;
  idLineaTipo: string;
  idUnidad: string;
  kardex: any;
  kardexs: any;

  lineaTipo: string;
  totalCantidadSaldo: any;
  unidad: string;

  costo: any;

  precio: any;
}

export interface IMercaderiaOUT_Seleccionada {
  mM: any;
}

export interface IMercaEquivalenciaOUT {
  _id: string;
  idAuxiliar: number;
  descripcionEquivalencia: string;
  laEquivalencia: any;
  idUnidadEquivalencia: string;
  unidadEquivalencia: string;
  pesoKg: number;
  factor: number;
  tipoEquivalencia: boolean;
}
