const API = import.meta.env.VITE_URL + '/api/egresosDeAlmacen';

export const loadMotivosEgresoDeAlmacen = async (parametros) => {
  // //console.log('//////api////////////****************** en loadMotivosEgresoDeAlmacen');
  // //console.log('parametros loadMotivosEgresoDeAlmacen', parametros);
  const res = await fetch(API + '/listarMotivosEgresoDeAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inEgresoDeAlmacen = async (parametros) => {
  // //console.log('//////api////////////****************** en inEgresoDeAlmacen');
  // //console.log('parametros inEgresoDeAlmacen', parametros);
  const res = await fetch(API + '/inEgresoDeAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const existeMotivoNV = async (parametros) => {
  // //console.log('//////api////////////****************** en existeMotivoNV');
  // //console.log('parametros existeMotivoNV', parametros);
  const res = await fetch(API + '/existeElMotivoNotaVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const existeMotivoNS = async (parametros) => {
  // //console.log('//////api////////////****************** en existeMotivoNV');
  // //console.log('parametros existeMotivoNV', parametros);
  const res = await fetch(API + '/existeElMotivoNotaSalida', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesDeNotaSalidaDeLaSucursal = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesDeNotaSalidaDeLaSucursal');
  // console.log('parametros getSeriesDeNotaSalidaDeLaSucursal', parametros);
  const res = await fetch(API + '/listarSeriesDeNotaSalidaDeLaSucursal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getEgresoDeAlmacen = async (parametros) => {
  console.log('//////api////////////****************** en getEgresoDeAlmacen');
  console.log('parametros getEgresoDeAlmacen', parametros);
  const res = await fetch(API + '/obtenerEgresoDeAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSerieNotaSalidaDeSucursal = async (parametros) => {
  // console.log('//////api////////////****************** en getSerieNotaSalidaDeSucursal');
  // console.log('parametros getSerieNotaSalidaDeSucursal', parametros);
  const res = await fetch(API + '/obtenerSerieNotaSalidaDeSucursal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
