const API = import.meta.env.VITE_URL + '/api/notaVenta';

export const upNotaVentaCreditoCliObs = async (parametros) => {
  // console.log('//////api////////////******************obtener a upNotaVentaCreditoCliObs');
  // console.log('parametros upNotaVentaCreditoCliObs', parametros);
  const res = await fetch(API + '/upNotaVentaCreditoCliObs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inNotaVenta = async (parametros) => {
  // console.log('//////api////////////******************obtener a inUpNotaVenta');
  // console.log('parametros inUpNotaVenta', parametros);
  const res = await fetch(API + '/inNotaVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getNotaVenta = async (parametros) => {
  // console.log('//////api////////////******************obtener a getNotaVenta');
  // console.log('parametros getNotaVenta', parametros);
  const res = await fetch(API + '/obtenerNotaVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesActivasNotasVentas = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getSeriesActivasNotasVentas');
  // //console.log('parametros getSeriesActivasNotasVentas', parametros);
  const res = await fetch(API + '/obtenerSeriesActivasNotasVentas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const deServicioNotaVenta = async (parametros) => {
  // //console.log('//////api////////////******************obtener a deServicioNotaVenta');
  // //console.log('parametros deServicioNotaVenta', parametros);
  const res = await fetch(API + '/deServicioNotaVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const deRepuestosLubriNotaVenta = async (parametros) => {
  // //console.log('//////api////////////******************obtener a deRepuestosLubriNotaVenta');
  // //console.log('parametros deRepuestosLubriNotaVenta', parametros);
  const res = await fetch(API + '/deRepuestosLubriNotaVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
