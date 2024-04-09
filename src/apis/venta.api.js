const API = import.meta.env.VITE_URL + '/api/venta';
// const API = 'https://backendalmacen-production.up.railway.app/api/venta';

export const getSeriesVentasActivasSegunTipo = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesVentasActivasSegunTipo');
  // console.log('parametros getSeriesVentasActivasSegunTipo', parametros);
  const res = await fetch(API + '/obtenerSeriesVentasActivasSegunTipo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesFacturaActivas = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesFactura');
  // console.log('parametros getSeriesFacturaActivas', parametros);
  const res = await fetch(API + '/obtenerSeriesFacturasActivas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesBoletaActivas = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesBoletaActivas');
  // console.log('parametros getSeriesBoletaActivas', parametros);
  const res = await fetch(API + '/obtenerSeriesBoletasActivas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesNotaCreditoActivas = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesNotaCreditoActivas');
  // console.log('parametros getSeriesNotaCreditoActivas', parametros);
  const res = await fetch(API + '/obtenerSeriesNotasCreditoActivas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesNotaDebitoActivas = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesNotaDebitoActivas');
  // console.log('parametros getSeriesNotaDebitoActivas', parametros);
  const res = await fetch(API + '/obtenerSeriesNotasDebitoActivas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getIgvVenta = async (parametros) => {
  // console.log('//////api////////////******************obtener a getIgvVenta');
  // console.log('parametros getIgvVenta', parametros);
  const res = await fetch(API + '/obtenerIgvVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inVenta = async (parametros) => {
  console.log('//////api////////////******************obtener a inVenta');
  console.log('parametros inVenta', parametros);
  const res = await fetch(API + '/inVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getVentasPorFechas = async (parametros) => {
  // console.log('//////api////////////******************obtener a getVentasPorFechas');
  // console.log('parametros getVentasPorFecha', parametros);
  const res = await fetch(API + '/obtenerVentasPorFechas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getAsientoVenta = async (parametros) => {
  // console.log('//////api////////////******************obtener a getIgvsCompra');
  // console.log('parametros getIgvsCompra', parametros);
  const res = await fetch(API + '/obtenerAsientoVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const sendJSONVenta = async (parametros) => {
  console.log('//////api////////////******************sendJSONVenta');
  console.log('parametros sendJSONVenta', parametros);
  const res = await fetch('http://demoint.thefactoryhka.com.pe/Clients/ServiceClients.svc/Enviar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
