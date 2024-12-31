const API = import.meta.env.VITE_URL + '/api/tecnico';

export const getTecnicosActivos = async (parametros) => {
  // //console.log('//////api////////////******************get en getTecnicosActivos');
  // //console.log('parametros getTecnicosActivos', parametros);
  const res = await fetch(API + '/getTecnicosActivos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getTecnicosPorRazonNombre = async (parametros) => {
  // //console.log('//////api////////////******************get en getTecnicosPorRazonNombre');
  // //console.log('parametros getTecnicosPorRazonNombre', parametros);
  const res = await fetch(API + '/getTecnicosPorRazonNombre', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getTecnicosPorDniRuc = async (parametros) => {
  // //console.log('//////api////////////******************get en getTecnicosPorDniRuc');
  // //console.log('parametros getTecnicosPorDniRuc', parametros);
  const res = await fetch(API + '/getTecnicosPorDniRuc', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpTecnico = async (parametros) => {
  // //console.log('//////api////////////******************get en inUpTecnico');
  // //console.log('parametros inUpTecnico', parametros);
  const res = await fetch(API + '/inUpTecnico', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getTecnico = async (parametros) => {
  // //console.log('//////api////////////******************get en getTecnico');
  // //console.log('parametros getTecnico', parametros);
  const res = await fetch(API + '/getTecnico', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
