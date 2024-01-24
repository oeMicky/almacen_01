const API = import.meta.env.VITE_URL + '/api/grupoEmpresarial';

export const getPeriodos = async (parametros) => {
  console.log('//////api////////////******************obtener a getPeriodos');
  console.log('parametros getPeriodos', parametros);
  const res = await fetch(API + '/obtenerPeriodos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getActivoGEEMP = async (parametros) => {
  console.log('//////api////////////******************obtener a getActivoGEEMP');
  console.log('parametros getActivoGEEMP', parametros);
  const res = await fetch(API + '/obtenerActivoGEEMP', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getActivoGEEMPSUCUR = async (parametros) => {
  console.log('//////api////////////******************obtener a getActivoGEEMPSUCUR');
  console.log('parametros getActivoGEEMPSUCUR', parametros);
  const res = await fetch(API + '/obtenerActivoGEEMPSUCUR', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpDetraccion = async (parametros) => {
  console.log('//////api////////////******************obtener a inUpDetraccion');
  console.log('parametros inUpDetraccion', parametros);
  const res = await fetch(API + '/inUpDetraccion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
