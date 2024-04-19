const API = import.meta.env.VITE_URL + '/api/libroDiario';

export const getIDLibroDiario = async (parametros) => {
  // console.log('//////api////////////****************** en getIDLibroDiario');
  // console.log('parametros getIDLibroDiario', parametros);
  const res = await fetch(API + '/getIDLibroDiario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
