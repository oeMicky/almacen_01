const API = import.meta.env.VITE_URL + '/api/kardex';

export const upUbigeo = async (parametros) => {
  // //console.log('//////api////////////******************obtener a upUbigeo');
  // //console.log('parametros upUbigeo', parametros);
  const res = await fetch(API + '/upUbigeo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
