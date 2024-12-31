const API = import.meta.env.VITE_URL + '/api/lineaTipoMercaderia';
// const API = 'https://backendalmacen-production.up.railway.app/api/persona';

export const inUpLineaTipoMercaderia = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en inUpLineaTipoMercaderia');
  // //console.log('parametros inUpLineaTipoMercaderia->', parametros);
  const res = await fetch(API + '/inUpLineaTipoMercaderia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpMarca = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en inUpMarca');
  // //console.log('parametros inUpMarca->', parametros);
  const res = await fetch(API + '/inUpMarca', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpUnidad = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en inUpUnidad');
  // //console.log('parametros inUpUnidad->', parametros);
  const res = await fetch(API + '/inUpUnidad', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpUnidadEquivalencia = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en inUpUnidadEquivalencia');
  // //console.log('parametros inUpUnidadEquivalencia->', parametros);
  const res = await fetch(API + '/inUpUnidadEquivalencia', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getLineasTipos = async (parametros) => {
  // //console.log('//////api////////////****************** en getLineasTipos');
  // //console.log('parametros getLineasTipos', parametros);
  const res = await fetch(API + '/listarLineasTipos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getLineaTipo = async (parametros) => {
  // //console.log('//////api////////////****************** en getLineaTipo');
  // //console.log('parametros getLineaTipo', parametros);
  const res = await fetch(API + '/getLineaTipo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpUnidadDeSUNAT = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en inUpUnidad');
  // //console.log('parametros inUpUnidad->', parametros);
  const res = await fetch(API + '/inUpUnidadDeSUNAT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpUnidadEquivalenciaDeSUNAT = async (parametros) => {
  // //console.log('//////api////////////******************inser/update en inUpUnidad');
  // //console.log('parametros inUpUnidad->', parametros);
  const res = await fetch(API + '/inUpUnidadEquivalenciaDeSUNAT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
