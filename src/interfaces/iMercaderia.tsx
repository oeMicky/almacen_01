export interface IMercaderiaOUT {
  _id: string;

  noFacturar: boolean;

  activo: boolean;
  codigo: string;
  conFechaVencimientoLote: boolean;
  descripcion: string;
  aplicacion: string;
  equivalencias: any;
  // costoUnitarioMovil: any;
  idLineaTipo: string;
  idMarca: string;
  idUnidad: string;
  kardex: any;
  KARDEXS: any;

  ubigeo: string;

  lineaTipo: string;
  codigoContableVenta: string;
  descripcionContableVenta: string;
  tipoContableVenta: boolean;

  marca: string;
  totalCantidadSaldo: any;
  promedioCostoUnitarioMovil: any;
  unidad: string;

  porcentajeUtilidad: any;

  costoPEN: any;

  precioUnitarioPEN: any;
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

  noFacturar: boolean;

  activo: boolean;
  codigo: string;
  descripcion: string;
  aplicacion: string;

  UNSPSC: string;

  // ubigeo: string;

  porcentajeUtilidadXDefecto: boolean;
  porcentajeUtilidad: any;

  conLote: boolean;
  conFechaProduccion: boolean;
  conFechaVencimiento: boolean;
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

  tipoImpuesto: any;
  tipoAfectacionDelImpuesto: string;
  porcentaje: any;

  stockMinimo: any;

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

  costoDeInicioPEN: any;
  precioUnitarioPEN: any;
}

export interface IMercaderiaIN_BUSCAR {
  _id: string;

  noFacturar: boolean;

  activo: boolean;
  codigo: string;
  descripcion: string;
  aplicacion: string;

  UNSPSC: string;

  ubigeo: string;

  porcentajeUtilidadXDefecto: boolean;
  porcentajeUtilidad: any;

  conLote: boolean;
  conFechaProduccion: boolean;
  conFechaVencimiento: boolean;
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

  tipoImpuesto: any;
  tipoAfectacionDelImpuesto: string;
  porcentaje: any;

  stockMinimo: any;

  kardex: any;
  KARDEXS: any;

  inafecto: boolean;
  exonerado: boolean;
  sujetoAPercepcion: boolean;
  percepcion: number;

  equivalencias: [IMercaEquivalenciaIN]; //any;

  totalCantidadSaldo: any;
  costoUnitarioPENMasIGV: any;
  promedioCostoUnitarioMovil: any;

  costoPEN: any;

  costoDeInicioPEN: any;
  precioUnitarioPEN: any;
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
