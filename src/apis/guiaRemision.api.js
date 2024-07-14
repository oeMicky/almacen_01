const API = import.meta.env.VITE_URL + '/api/guiaRemision';

export const obtenerUbigeoSUNAT = async (parametros) => {
  // console.log("//////api////////////******************get en obtenerUbigeoSUNAT");
  // console.log("parametros obtenerUbigeoSUNAT", parametros);
  const res = await fetch(API + '/obtenerUbigeoSUNAT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpDireccionGR = async (parametros) => {
  // console.log("//////api////////////******************get en inUpDireccionGR");
  // console.log("parametros inUpDireccionGR", parametros);
  const res = await fetch(API + '/inUpDireccionGR', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const obtenerDireccionGR = async (parametros) => {
  // console.log("//////api////////////******************get en obtenerDireccionGR");
  // console.log("parametros obtenerDireccionGR", parametros);
  const res = await fetch(API + '/obtenerDireccionGR', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const obtenerDireccionesGR = async (parametros) => {
  // console.log("//////api////////////******************get en obtenerDireccionesGR");
  // console.log("parametros obtenerDireccionesGR", parametros);
  const res = await fetch(API + '/obtenerDireccionesGR', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const obtenerUnidadesBienesGR = async (parametros) => {
  console.log('//////api////////////******************get en obtenerUnidadesBienesGR');
  console.log('parametros obtenerUnidadesBienesGR', parametros);
  const res = await fetch(API + '/obtenerUnidadesBienesGR', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUnidadBienGR = async (parametros) => {
  console.log('//////api////////////******************get en inUpDireccionGR');
  console.log('parametros inUpDireccionGR', parametros);
  const res = await fetch(API + '/inUnidadBienGR', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpGuiaRemision = async (parametros) => {
  console.log('//////api////////////******************get en inUpGuiaRemision');
  console.log('parametros inUpGuiaRemision', parametros);
  const res = await fetch(API + '/inUpGuiaRemision', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const reenviarGuiaRemision = async (parametros) => {
  // console.log('//////api////////////******************reenviarGuiaRemision');
  // console.log('parametros reenviarGuiaRemision', parametros);
  const res = await fetch(API + '/reenviarGuiaRemision', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesGuiasRemisionActivasEnSucursal = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesGuiasRemisionActivasEnSucursal');
  // console.log('parametros getSeriesGuiasRemisionActivasEnSucursal', parametros);
  const res = await fetch(API + '/obtenerSeriesGuiasRemisionActivasEnSucursal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
