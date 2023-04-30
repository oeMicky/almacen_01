// const API = 'http://localhost:4000/api/apisExternas';
const API = 'https://backendalmacen-production.up.railway.app/api/apisExternas';

export const getTipoCambio = async (parametros) => {
  console.log('//////api////////////******************ingreso a getTipoCambio');
  // const newLinea = {
  //   idGrupoEmpresarial: '60f097ca53621708ecc4e781',
  //   idEmpresa: '60efd5c8e0eac5122cc56ddc',
  // };
  console.log('parametros', parametros);
  console.log('first', API + '/TipoCambio/');
  const res = await fetch(API + '/TipoCambio/' + parametros);
  const elJSON = await res.json();
  return elJSON;
}; //

export const getRUC = async (parametros) => {
  console.log('//////api////////////******************ingreso a getRUC');
  console.log('parametros', parametros);
  console.log('first', API + '/RUC/');
  const res = await fetch(API + '/RUC/' + parametros);
  const elJSON = await res.json();
  return elJSON;
};

export const getDNI = async (parametros) => {
  console.log('//////api////////////******************ingreso a getDNI');
  console.log('parametros', parametros);
  console.log('first', API + '/DNI/');
  const res = await fetch(API + '/DNI/' + parametros);
  const elJSON = await res.json();
  return elJSON;
};
