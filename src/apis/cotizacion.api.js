const API = import.meta.env.VITE_URL + '/api/cotizacion';

export const inUpCotizacion = async (parametros) => {
  // //console.log('//////api////////////******************obtener a inUpCotizacion');
  // //console.log('parametros inUpCotizacion', parametros);
  const res = await fetch(API + '/inUpCotizacion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesActivasCotizaciones = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getSeriesActivasCotizaciones');
  // //console.log('parametros getSeriesActivasCotizaciones', parametros);
  const res = await fetch(API + '/obtenerSeriesActivasCotizaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const deServicioCotizacion = async (parametros) => {
  // //console.log('//////api////////////******************obtener a deServicioCotizacion');
  // //console.log('parametros deServicioCotizacion', parametros);
  const res = await fetch(API + '/deServicioCotizacion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const deRepuestosLubriCotizacion = async (parametros) => {
  // //console.log('//////api////////////******************obtener a deRepuestosLubriCotizacion');
  // //console.log('parametros deRepuestosLubriCotizacion', parametros);
  const res = await fetch(API + '/deRepuestosLubriCotizacion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
