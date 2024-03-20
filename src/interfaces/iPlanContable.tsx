export interface IPlanContable {
  _id: string;
  idGrupoEmpresarial: string;
  idEmpresa: string;
  idEjercicio: string;
  ejercicio: number;

  cuentasContables: any;
}

export interface ICuentaContable {
  _id: string;
  codigo: string;
  descripcion: string;
}
