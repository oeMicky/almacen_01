const API = import.meta.env.VITE_URL + '/api/chofer';

export const inUpChofer = async (parametros) => {
  // console.log('//////api////////////******************get en inUpTecnico');
  // console.log('parametros inUpTecnico', parametros);
  const res = await fetch(API + '/inUpChofer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
