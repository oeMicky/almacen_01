const API = import.meta.env.VITE_URL + '/api/persona';
// const API = 'https://backendalmacen-production.up.railway.app/api/persona';

export const inUpPersona = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en inUpPersona');
  // //console.log('parametros inUpPersona->', parametros);
  const res = await fetch(API + '/inUpPersona', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getPersonaPorId_RazonSocialNombre = async (parametros) => {
  // //console.log('//////api////////////****************** en getPersonaPorId_RazonSocialNombre');
  // //console.log('parametros getPersonaPorIdRazonSocialNombre', parametros);
  const res = await fetch(API + '/obtenerPersonaPorId_RazonSocialNombre', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getPersonaPorDniRuc = async (parametros) => {
  // //console.log('//////api////////////****************** en obtenerPersonasPorDniRuc');
  // //console.log('parametros obtenerPersonasPorDniRuc', parametros);
  const res = await fetch(API + '/obtenerPersonasPorDniRuc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const activarFavoritoAlmacen = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en activarFavoritoAlmacen');
  // //console.log('parametros activarFavoritoAlmacen->', parametros);
  const res = await fetch(API + '/activarFavoritoAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const desactivarFavoritoAlmacen = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en desactivarFavoritoAlmacen');
  // //console.log('parametros desactivarFavoritoAlmacen->', parametros);
  const res = await fetch(API + '/desactivarFavoritoAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
