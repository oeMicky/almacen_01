const API = import.meta.env.VITE_URL + '/api/unidadTransporte';

export const inUpUnidadTransporte = async (parametros) => {
  //console.log('//////api////////////******************get en inUpUnidadTransporte');
  //console.log('parametros inUpUnidadTransporte', parametros);
  const res = await fetch(API + '/inUpUnidadTransporte', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
