const API = import.meta.env.VITE_URL + '/api/ordenServicio';

export const inUpOrdenServicio = async (parametros) => {
  console.log('//////api////////////******************insert/update en inUpOrdenServicio');
  console.log('parametros inUpOrdenServicio', parametros);
  const res = await fetch(API + '/inUpOrdenServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const rebuscarCorrelativo = async (parametros) => {
  console.log('//////api////////////******************insert/update en rebuscarCorrelativo');
  console.log('parametros rebuscarCorrelativo', parametros);
  const res = await fetch(API + '/rebuscarCorrelativo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getOrdenesServicio = async (parametros) => {
  console.log('//////api////////////******************insert/update en getOrdenesServicio');
  console.log('parametros getOrdenesServicio', parametros);
  const res = await fetch(API + '/getOrdenesServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
