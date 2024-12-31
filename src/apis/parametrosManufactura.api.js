const API = import.meta.env.VITE_URL + '/api/parametrosManufactura';

export const loadParametrosManufactura = async (parametros) => {
  // //console.log("//////api////////////******************insert/update en getOrdenesProduccion");
  // //console.log("parametros getOrdenesProduccion", parametros);
  const res = await fetch(API + '/loadParametrosManufactura', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpManufacturaUnitaria = async (parametros) => {
  // //console.log("//////api////////////******************insert/update en inUpManufacturaUnitaria");
  // //console.log("parametros inUpManufacturaUnitaria", parametros);
  const res = await fetch(API + '/inUpManufacturaUnitaria', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpCostoDirecto = async (parametros) => {
  // //console.log("//////api////////////******************insert/update en inUpCostoDirecto");
  // //console.log("parametros inUpCostoDirecto", parametros);
  const res = await fetch(API + '/inUpCostoDirecto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
