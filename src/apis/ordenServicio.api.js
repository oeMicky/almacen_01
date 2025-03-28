const API = import.meta.env.VITE_URL + '/api/ordenServicio';

export const loadTiposOrdenServicio = async (parametros) => {
  // //console.log('//////api////////////******************insert/update en getOrdenesServicio');
  // //console.log('parametros getOrdenesServicio', parametros);
  const res = await fetch(API + '/listarTiposOrdenServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const loadOrdenServicio = async (parametros) => {
  // console.log('//////api////////////******************insert/update en getOrdenServicio');
  // console.log('parametros getOrdenServicio', parametros);
  const res = await fetch(API + '/getOrdenServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
export const loadOrdenServicioServicio = async (parametros) => {
  // console.log('//////api////////////******************insert/update en getOrdenServicioServicio');
  // console.log('parametros getOrdenServicioServicio', parametros);
  const res = await fetch(API + '/getOrdenServicioServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
export const loadOrdenServicioRequisicion = async (parametros) => {
  // console.log('//////api////////////******************insert/update en getOrdenServicioRequisicion');
  // console.log('parametros getOrdenServicioRequisicion', parametros);
  const res = await fetch(API + '/getOrdenServicioRequisicion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpOrdenServicio = async (parametros) => {
  //console.log("//////api////////////******************insert/update en inUpOrdenServicio");
  //console.log("parametros inUpOrdenServicio", parametros);
  const res = await fetch(API + '/inUpOrdenServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const borrarServicioOS = async (parametros) => {
  // //console.log('//////api////////////******************delete en borrarServicioOS');
  // //console.log('parametros borrarServicioOS', parametros);
  const res = await fetch(API + '/borrarServicioOS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const borrarRequisicionOS = async (parametros) => {
  // //console.log('//////api////////////******************delete en borrarRequisicionOS');
  // //console.log('parametros borrarRequisicionOS', parametros);
  const res = await fetch(API + '/borrarRequisicionOS', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const rebuscarCorrelativo = async (parametros) => {
  // //console.log('//////api////////////******************insert/update en rebuscarCorrelativo');
  // //console.log('parametros rebuscarCorrelativo', parametros);
  const res = await fetch(API + '/rebuscarCorrelativo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getOrdenesServicio = async (parametros) => {
  // //console.log('//////api////////////******************insert/update en getOrdenesServicio');
  // //console.log('parametros getOrdenesServicio', parametros);
  const res = await fetch(API + '/getOrdenesServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesActivasOrdenesServicio = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getSeriesActivasOrdenesServicio');
  // //console.log('parametros getSeriesActivasOrdenesServicio', parametros);
  const res = await fetch(API + '/obtenerSeriesActivasOrdenesServicio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
