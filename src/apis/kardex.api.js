const API = import.meta.env.VITE_URL + '/api/kardex';

export const upTrasladoInterno = async (parametros) => {
  console.log('//////api////////////******************obtener a upTrasladoInterno');
  console.log('parametros upTrasladoInterno', parametros);
  const res = await fetch(API + '/upTrasladoInterno', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpUbigeo2 = async (parametros) => {
  //console.log('//////api////////////******************obtener a inUpUbigeo2');
  //console.log('parametros inUpUbigeo2', parametros);
  const res = await fetch(API + '/inUpUbigeo2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

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
