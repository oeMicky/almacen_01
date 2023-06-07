const API = import.meta.env.VITE_URL + '/api/vehiculo';

export const getMarcasVehiculares = async (parametros) => {
  console.log('//////api////////////******************get en getMarcasVehiculares');
  console.log('parametros getMarcasVehiculares', parametros);
  const res = await fetch(API + '/obtenerMarcasVehiculares', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getModelosVehiculares = async (parametros) => {
  console.log('//////api////////////******************get en getModelosVehiculares');
  console.log('parametros getModelosVehiculares', parametros);
  const res = await fetch(API + '/obtenerModelosVehiculares', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpVehiculo = async (parametros) => {
  console.log('//////api////////////******************get en inUpVehiculo');
  console.log('parametros inUpVehiculo', parametros);
  const res = await fetch(API + '/inUpVehiculo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
