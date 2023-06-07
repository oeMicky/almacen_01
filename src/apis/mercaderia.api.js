const API = import.meta.env.VITE_URL + '/api/mercaderia';

export const grabarPrecio = async (parametros) => {
  console.log('//////api////////////******************update en grabarPrecio');
  console.log('parametros grabarPrecio', parametros);
  const res = await fetch(API + '/grabarPrecio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getBuscarMercaderiaPorDescripion = async (parametros) => {
  console.log('//////api////////////******************get en getBuscarMercaderiaPorDescripion');
  console.log('parametros getBuscarMercaderiaPorDescripion', parametros);
  const res = await fetch(API + '/buscarMercaderiasPorDescripcion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
