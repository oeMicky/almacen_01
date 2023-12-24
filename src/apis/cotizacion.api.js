const API = import.meta.env.VITE_URL + '/api/cotizacion';

export const inUpCotizacion = async (parametros) => {
  console.log('//////api////////////******************obtener a inUpCotizacion');
  console.log('parametros inUpCotizacion', parametros);
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
  console.log('//////api////////////******************obtener a getSeriesActivasCotizaciones');
  console.log('parametros getSeriesActivasCotizaciones', parametros);
  const res = await fetch(API + '/obtenerSeriesActivasCotizaciones', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

// export const getIgvsCompra = async (parametros) => {
//   console.log('//////api////////////******************obtener a getIgvsCompra');
//   console.log('parametros getIgvsCompra', parametros);
//   const res = await fetch(API + '/obtenerIgvsCompra', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(parametros),
//   });
//   return res.json();
// };
