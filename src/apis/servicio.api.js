const API = import.meta.env.VITE_URL + '/api/servicio';

export const inUpServicio = async (parametros) => {
  // console.log('//////api////////////******************inser/update en inUpServicio');
  // console.log('parametros inUpServicio', parametros);
  const res = await fetch(API + '/inUpServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getServiciosPorDescripcion = async (parametros) => {
  // console.log('//////api////////////******************get en getServiciosPorDescripcion');
  // console.log('parametros getServiciosPorDescripcion', parametros);
  const res = await fetch(API + '/getServiciosPorDescripcion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
