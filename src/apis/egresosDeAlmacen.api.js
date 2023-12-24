const API = import.meta.env.VITE_URL + '/api/egresosDeAlmacen';

export const loadMotivosEgresoDeAlmacen = async (parametros) => {
  console.log('//////api////////////****************** en loadMotivosEgresoDeAlmacen');
  console.log('parametros loadMotivosEgresoDeAlmacen', parametros);
  const res = await fetch(API + '/listarMotivosEgresoDeAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inEgresoDeAlmacen = async (parametros) => {
  console.log('//////api////////////****************** en inEgresoDeAlmacen');
  console.log('parametros inEgresoDeAlmacen', parametros);
  const res = await fetch(API + '/inEgresoDeAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
