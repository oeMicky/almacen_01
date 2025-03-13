const API = import.meta.env.VITE_URL + '/api/usuario';
// const API = 'https://backendalmacen-production.up.railway.app/api/usuario';
// backendalmacen02 - production.up.railway.app;

export const verOtrosAlmacenes = async (parametros) => {
  // //console.log('//////api////////******************obtener a getUsuario');
  // //console.log('parametros getUsuario', parametros);
  const res = await fetch(API + '/verOtrosAlmacenes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getUsuarioPanel = async (parametros) => {
  // //console.log('//////api////////******************obtener a getUsuario');
  // //console.log('parametros getUsuario', parametros);
  const res = await fetch(API + '/obtenerUsuarioPanel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSucursalesAdjuntasUsuario = async (parametros) => {
  // //console.log('//////api////////******************obtener a getUsuario');
  // //console.log('parametros getUsuario', parametros);
  const res = await fetch(API + '/obtenerSucursalesAdjuntasUsuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const upCambioClaveUsuario = async (parametros) => {
  // //console.log('//////api////////******************obtener a getUsuario');
  // //console.log('parametros getUsuario', parametros);
  const res = await fetch(API + '/cambioClaveUsuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
