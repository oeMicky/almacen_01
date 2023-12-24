export interface IMercaderiaOUT {
  _id: string;
  codigo: string;
  conFechaVencimientoLote: boolean;
  descripcion: string;
  equivalencias: any;
  // costoUnitarioMovil: any;
  idLineaTipo: string;
  idMarca: string;
  idUnidad: string;
  kardex: any;
  KARDEXS: any;

  lineaTipo: string;
  marca: string;
  totalCantidadSaldo: any;
  promedioCostoUnitarioMovil: any;
  unidad: string;

  costoPEN: any;

  precioPEN: any;
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

export interface IMercaderiaIN {
  _id: string;

  activo: boolean;
  codigo: string;
  descripcion: string;

  UNSPSC: string;
  conFechaVencimientoLote: boolean;
  //IMPORTANTE
  idKardex: string;
  lote: string;
  fechaVencimiento: string;

  // costoUnitarioMovil: any;
  idLineaTipo: string;
  lineaTipo: string;
  idMarca: string;
  marca: string;
  idUnidad: string;
  unidad: string;

  kardex: any;
  KARDEXS: any;

  inafecto: boolean;
  exonerado: boolean;
  sujetoAPercepcion: boolean;
  percepcion: number;

  equivalencias: [IMercaEquivalenciaIN]; //any;

  totalCantidadSaldo: any;
  promedioCostoUnitarioMovil: any;

  costoPEN: any;

  precioPEN: any;
}

export interface IMercaEquivalenciaIN {
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
