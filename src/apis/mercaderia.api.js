const API = import.meta.env.VITE_URL + '/api/mercaderia';

export const inUpMercaderia = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en inUpMercaderia');
  // //console.log('parametros inUpMercaderia->', parametros);
  const res = await fetch(API + '/inUpMercaderia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const grabarPrecio = async (parametros) => {
  // //console.log('//////api////////////******************update en grabarPrecio');
  // //console.log('parametros grabarPrecio', parametros);
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
  // //console.log('//////api////////////******************get en getBuscarMercaderiaPorDescripion');
  // //console.log('parametros getBuscarMercaderiaPorDescripion', parametros);
  const res = await fetch(API + '/buscarMercaderiasPorDescripcion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getBuscarMercaderiaPorAplicacion = async (parametros) => {
  // //console.log('//////api////////////******************get en getBuscarMercaderiaPorAplicacion');
  // //console.log('parametros getBuscarMercaderiaPorAplicacion', parametros);
  const res = await fetch(API + '/buscarMercaderiasPorAplicacion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
    // signal: parametros.signal,
  });
  return res.json();
};
