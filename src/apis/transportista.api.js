const API = import.meta.env.VITE_URL + '/api/transportista';

export const inUpTransportista = async (parametros) => {
  //console.log('//////api////////////******************get en inUpTransportista');
  //console.log('parametros inUpTransportista', parametros);
  const res = await fetch(API + '/inUpTransportista', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
