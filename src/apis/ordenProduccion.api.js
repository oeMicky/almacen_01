const API = import.meta.env.VITE_URL + "/api/ordenProduccion";

export const loadTiposOrdenProduccion = async (parametros) => {
  // console.log('//////api////////////******************insert/update en getOrdenesProduccion');
  // console.log('parametros getOrdenesProduccion', parametros);
  const res = await fetch(API + "/listarTiposOrdenProduccion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesActivasOrdenesProduccion = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesActivasOrdenesProduccion');
  // console.log('parametros getSeriesActivasOrdenesProduccion', parametros);
  const res = await fetch(API + "/obtenerSeriesActivasOrdenesProduccion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const borrarManufacturaOP = async (parametros) => {
  // console.log('//////api////////////******************delete en borrarManufacturaOP');
  // console.log('parametros borrarManufacturaOP', parametros);
  const res = await fetch(API + "/borrarManufacturaOP", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const borrarRequisicionOP = async (parametros) => {
  // console.log('//////api////////////******************delete en borrarRequisicionOP');
  // console.log('parametros borrarRequisicionOP', parametros);
  const res = await fetch(API + "/borrarRequisicionOP", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpOrdenProduccion = async (parametros) => {
  console.log("//////api////////////******************insert/update en inUpOrdenProduccion");
  console.log("parametros inUpOrdenProduccion", parametros);
  const res = await fetch(API + "/inUpOrdenProduccion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getOrdenProduccion = async (parametros) => {
  // console.log('//////api////////////******************obtener a getSeriesActivasOrdenesProduccion');
  // console.log('parametros getSeriesActivasOrdenesProduccion', parametros);
  const res = await fetch(API + "/getOrdenProduccion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
