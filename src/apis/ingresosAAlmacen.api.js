const API = import.meta.env.VITE_URL + '/api/ingresosAAlmacen';

export const loadMotivosIngresoAAlmacen = async (parametros) => {
  // //console.log('//////api////////////****************** en loadMotivosIngresoAAlmacen');
  // //console.log('parametros loadMotivosIngresoAAlmacen', parametros);
  const res = await fetch(API + '/listarMotivosIngresoAAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inIngresoAAlmacen = async (parametros) => {
  console.log('//////api////////////****************** en inIngresoAAlmacen');
  console.log('parametros inIngresoAAlmacen', parametros);
  const res = await fetch(API + '/inIngresoAAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getIngresoAAlmacen = async (parametros) => {
  console.log('//////api////////////****************** en getIngresoAAlmacen');
  console.log('parametros getIngresoAAlmacen', parametros);
  const res = await fetch(API + '/obtenerIngresoAAlmacen', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSerieNotaIngresoDeSucursal = async (parametros) => {
  console.log('//////api////////////****************** en getSerieNotaIngresoDeSucursal');
  console.log('parametros getSerieNotaIngresoDeSucursal', parametros);
  const res = await fetch(API + '/obtenerSerieNotaIngresoDeSucursal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
