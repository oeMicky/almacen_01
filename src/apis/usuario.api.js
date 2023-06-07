const API = import.meta.env.VITE_URL + '/api/usuario';
// const API = 'https://backendalmacen-production.up.railway.app/api/usuario';
// backendalmacen02 - production.up.railway.app;

export const getUsuario = async (parametros) => {
  console.log('//////api////////******************obtener a getUsuario');
  console.log('parametros getUsuario', parametros);
  const res = await fetch(API + '/obtenerUsuario', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
