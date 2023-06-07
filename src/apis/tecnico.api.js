const API = import.meta.env.VITE_URL + '/api/tecnico';

export const getTecnicosActivos = async (parametros) => {
  console.log('//////api////////////******************get en getTecnicosActivos');
  console.log('parametros getTecnicosActivos', parametros);
  const res = await fetch(API + '/getTecnicosActivos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
