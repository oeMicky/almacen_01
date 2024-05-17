const API = import.meta.env.VITE_URL + '/api/planContable';

export const inUpCuentaContable = async (parametros: any) => {
  console.log('//////api////////////******************obtener a inUpCuentaContable');
  console.log('parametros inUpCuentaContable', parametros);
  const res = await fetch(API + '/inUpCuentaContable', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
