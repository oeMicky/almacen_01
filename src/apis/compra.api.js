const API = import.meta.env.VITE_URL + '/api/compra';

export const getIgvsCompra = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getIgvsCompra');
  // //console.log('parametros getIgvsCompra', parametros);
  const res = await fetch(API + '/obtenerIgvsCompra', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpCompra = async (parametros) => {
  // //console.log('//////api////////////******************obtener a inUpCompra');
  // //console.log('parametros inUpCompra', parametros);
  const res = await fetch(API + '/inUpCompra', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const borrarLetraXCompra = async (parametros) => {
  // //console.log('//////api////////////******************obtener a inUpCompra');
  // //console.log('parametros inUpCompra', parametros);
  const res = await fetch(API + '/borrarLetraXCompra', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getAsientoCompra = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getIgvsCompra');
  // //console.log('parametros getIgvsCompra', parametros);
  const res = await fetch(API + '/obtenerAsientoCompra', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
