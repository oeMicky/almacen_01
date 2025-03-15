const API = import.meta.env.VITE_URL + '/api/mercaderia';

export const verUbigeoAntiguo = async (parametros) => {
  // //console.log('//////api////////////******************obtener a upPrecioPublicoPEN');
  // //console.log('parametros upPrecioPublicoPEN', parametros);
  const res = await fetch(API + '/verUbigeoAntiguo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const upCostoUnitarioPENMasIGV = async (parametros) => {
  // //console.log('//////api////////////******************obtener a upCostoUnitarioPENMasIGV');
  // //console.log('parametros upCostoUnitarioPENMasIGV', parametros);
  const res = await fetch(API + '/upCostoUnitarioPENMasIGV', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const upPrecioPublicoPEN = async (parametros) => {
  // //console.log('//////api////////////******************obtener a upPrecioPublicoPEN');
  // //console.log('parametros upPrecioPublicoPEN', parametros);
  const res = await fetch(API + '/upPrecioPublicoPEN', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

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

export const getBuscarMercaderiaPorDescripionTODOS = async (parametros) => {
  // //console.log('//////api////////////******************get en getBuscarMercaderiaPorDescripionTODOS');
  // //console.log('parametros getBuscarMercaderiaPorDescripionTODOS', parametros);
  const res = await fetch(API + '/buscarMercaderiasPorDescripcionTODOS', {
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

export const getBuscarMercaderiaPorAplicacionTODOS = async (parametros) => {
  // //console.log('//////api////////////******************get en getBuscarMercaderiaPorAplicacionTODOS');
  // //console.log('parametros getBuscarMercaderiaPorAplicacionTODOS', parametros);
  const res = await fetch(API + '/buscarMercaderiasPorAplicacionTODOS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
    // signal: parametros.signal,
  });
  return res.json();
};
