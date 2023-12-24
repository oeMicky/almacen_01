const API = import.meta.env.VITE_URL + '/api/sunat';

export const loadTiposComprobantePago = async (parametros) => {
  console.log('//////api////////////****************** en loadTiposComprobantePago');
  console.log('parametros loadTiposComprobantePago', parametros);
  const res = await fetch(API + '/listarTiposComprobantePago', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
