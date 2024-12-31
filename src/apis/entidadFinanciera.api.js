const API = import.meta.env.VITE_URL + '/api/entidadFinanciera';

export const cargarEntidadesFinancieras = async () => {
  // //console.log('//////api////////////******************obtener a getSeriesVentasActivasSegunTipo');
  // //console.log('parametros getSeriesVentasActivasSegunTipo', parametros);
  const res = await fetch(API + '/listarEntidadesFinancieras', {
    // method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(parametros),
  });
  return res.json();
};
