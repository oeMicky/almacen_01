const API = import.meta.env.VITE_URL + '/api/venta';
// const API = 'https://backendalmacen-production.up.railway.app/api/venta';

export const upDarDeBaja = async (parametros) => {
  //console.log('//////api////////////****************** a inVenta');
  //console.log('parametros inVenta', parametros);
  const res = await fetch(API + '/upDarDeBaja', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getVenta = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getSeriesFactura');
  // //console.log('parametros getSeriesFacturaActivas', parametros);
  const res = await fetch(API + '/obtenerVenta', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getXml = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getSeriesFactura');
  // //console.log('parametros getSeriesFacturaActivas', parametros);
  const res = await fetch(API + '/obtenerXml', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSunatCDRXml = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getSeriesFactura');
  // //console.log('parametros getSeriesFacturaActivas', parametros);
  const res = await fetch(API + '/obtenerSunatCDRXml', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getMediosPagoSUNAT = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getVentasPorFechas');
  // //console.log('parametros getVentasPorFecha', parametros);
  const res = await fetch(API + '/obtenerMedioPagoSUNAT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getDetraccionesBienesServiciosSUNAT = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getVentasPorFechas');
  // //console.log('parametros getVentasPorFecha', parametros);
  const res = await fetch(API + '/obtenerDetraccionBienesServiciosSUNAT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const getSeriesVentasActivasSegunTipo = async (parametros) => {
  // //console.log('//////api////////////******************obtener a getSeriesVentasActivasSegunTipo');
  // //console.log('parametros getSeriesVentasActivasSegunTipo', parametros);
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
  // //console.log('//////api////////////******************obtener a getSeriesFactura');
  // //console.log('parametros getSeriesFacturaActivas', parametros);
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
  // //console.log('//////api////////////******************obtener a getSeriesBoletaActivas');
  // //console.log('parametros getSeriesBoletaActivas', parametros);
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
  // //console.log('//////api////////////******************obtener a getSeriesNotaCreditoActivas');
  // //console.log('parametros getSeriesNotaCreditoActivas', parametros);
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
  // //console.log('//////api////////////******************obtener a getSeriesNotaDebitoActivas');
  // //console.log('parametros getSeriesNotaDebitoActivas', parametros);
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
  // //console.log('//////api////////////******************obtener a getIgvVenta');
  // //console.log('parametros getIgvVenta', parametros);
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
  //console.log('//////api////////////****************** a inVenta');
  //console.log('parametros inVenta', parametros);
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
  // //console.log('//////api////////////******************obtener a getVentasPorFechas');
  // //console.log('parametros getVentasPorFecha', parametros);
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
  // //console.log('//////api////////////******************obtener a getIgvsCompra');
  // //console.log('parametros getIgvsCompra', parametros);
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
  //console.log('//////api////////////******************sendJSONVenta');
  //console.log('parametros sendJSONVenta', parametros);
  const res = await fetch(API + '/enviarJSONTheH', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
  // //console.log('//////api////////////******************sendJSONVenta');
  // //console.log('parametros sendJSONVenta', parametros);
  // const res = await fetch('http://demoint.thefactoryhka.com.pe/Clients/ServiceClients.svc/Enviar', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(parametros),
  // });
  // //console.log('res sendJSONVenta', res);
  // return res.json();
};

export const reenviarDocumentoVentaJSON = async (parametros) => {
  //console.log('//////api////////////******************reenviarDocumentoVentaJSON');
  //console.log('parametros reenviarDocumentoVentaJSON', parametros);
  const res = await fetch(API + '/reenviarDocumentoVentaJSON', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const reenviarDocumentoVentaXML = async (parametros) => {
  //console.log('//////api////////////******************reenviarDocumentoVentaXML');
  //console.log('parametros reenviarDocumentoVentaXML', parametros);
  const res = await fetch(API + '/reenviarDocumentoVentaXML', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};

export const descargaArchivoVenta = async (parametros) => {
  //console.log('//////api////////////******************descargaArchivoVenta');
  //console.log('parametros descargaArchivoVenta', parametros);
  const res = await fetch(API + '/descargaArchivoTheH', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
  // //console.log('//////api////////////******************sendJSONVenta');
  // //console.log('parametros sendJSONVenta', parametros);
  // const res = await fetch('http://demoint.thefactoryhka.com.pe/Clients/ServiceClients.svc/Enviar', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(parametros),
  // });
  // //console.log('res sendJSONVenta', res);
  // return res.json();
};

export const ejecutarCreacionXML = async (parametros) => {
  //console.log('//////api////////////******************ejecutarCreacionXML');
  //console.log('parametros ejecutarCreacionXML', parametros);
  const res = await fetch(API + '/ejecutarCreacionXML', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(parametros),
  });
  return res.json();
};
