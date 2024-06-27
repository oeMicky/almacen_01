export interface ICostoDirecto {
  _id: string;
  costoDirecto: string;
  costoPEN: any;
}

export interface IManufacturaUnitaria {
  _id: string;
  manufacturaUnitaria: string;
  tiempoManufacturaUnitariaPorHora: any;
  totalCostosDirectos: any;
  // costoManufacturaUnitario: any;
}
