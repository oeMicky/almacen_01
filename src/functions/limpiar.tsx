import { parametrosGlobales } from '~/routes/login';

export const limpiarParametrosGlobales = () => {
  // console.log('GENESIS 0 formatear_6Decimales', num);

  parametrosGlobales.idGrupoEmpresarial = '';
  parametrosGlobales.nombreGrupoEmpresarial = '';
  parametrosGlobales.idSerieNotaIngreso = '';
  parametrosGlobales.serieNotaIngreso = '';
  parametrosGlobales.idSerieNotaSalida = '';
  parametrosGlobales.serieNotaSalida = '';

  // let m = Number((Math.abs(num) * 1000000).toPrecision(15));
  // m = (Math.round(m) / 1000000) * Math.sign(num);
  // // console.log('GENESIS 1 formatear_6Decimales', m);
  // return m;
  // return m.toLocaleString('en-PE', {
  //   // style: 'currency',
  //   currency: 'USD',
  //   minimumFractionDigits: 6,
  // });
};
