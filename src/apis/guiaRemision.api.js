const API = import.meta.env.VITE_URL + "/api/guiaRemision";

export const obtenerUbigeoSUNAT = async (parametros) => {
  console.log("//////api////////////******************get en obtenerUbigeoSUNAT");
  console.log("parametros obtenerUbigeoSUNAT", parametros);
  const res = await fetch(API + "/obtenerUbigeoSUNAT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const inUpDireccionGR = async (parametros) => {
  console.log("//////api////////////******************get en inUpDireccionGR");
  console.log("parametros inUpDireccionGR", parametros);
  const res = await fetch(API + "/inUpDireccionGR", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const obtenerDireccionGR = async (parametros) => {
  console.log("//////api////////////******************get en obtenerDireccionGR");
  console.log("parametros obtenerDireccionGR", parametros);
  const res = await fetch(API + "/obtenerDireccionGR", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const obtenerDireccionesGR = async (parametros) => {
  console.log("//////api////////////******************get en obtenerDireccionesGR");
  console.log("parametros obtenerDireccionesGR", parametros);
  const res = await fetch(API + "/obtenerDireccionesGR", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
