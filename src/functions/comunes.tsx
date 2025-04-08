export const hoy = () => {
  const hoy = new Date();
  const al = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
  return al;
};

export const menosXdiasHoy = (xDias: number) => {
  const hoy = new Date();
  const montoXDias = 1000 * 60 * 60 * 24 * xDias;
  const elDia = new Date(hoy.getTime() - montoXDias);
  const al = elDia.getFullYear() + '-' + ('0' + (elDia.getMonth() + 1)).slice(-2) + '-' + ('0' + elDia.getDate()).slice(-2);
  return al;
};

export const masXdiasHoy = (xDias: number) => {
  const hoy = new Date();
  const montoXDias = 1000 * 60 * 60 * 24 * xDias;
  // console.log('hoy masXdiasHoy', hoy, montoXDias);

  const elDia = new Date(hoy.getTime() + montoXDias);
  // console.log('elDia', elDia);
  const al = elDia.getFullYear() + '-' + ('0' + (elDia.getMonth() + 1)).slice(-2) + '-' + ('0' + elDia.getDate()).slice(-2);
  // console.log('al', al);
  return al;
};

export const diaDeLaSemana = (fecha: string) => {
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const fechaDate = new Date(fecha);
  return dias[fechaDate.getDay()];
};

// export const numeroDiaDeLaFecha = (fecha: string) => {
//   console.log('🥓🥓🥓🥓🥓🥓🥓', fecha);
//   const laFecha = new Date(fecha);
//   console.log('🥓🥓🥓🥓🥓🥓🥓', laFecha);

//   // const dia = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
//   // const fechaDate = new Date(fecha);
//   return laFecha.getDate();
// };

export const primeroDelMes = () => {
  const hoy = new Date();
  const al = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-01';
  return al;
};

export const ultimoDelMes = () => {
  const hoy = new Date();
  const ultimo = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

  return ultimo.getFullYear() + '-' + ('0' + (ultimo.getMonth() + 1)).slice(-2) + '-' + ('0' + ultimo.getDate()).slice(-2);
};

export const ultimoDiaDelPeriodoX = (periodo: string) => {
  const anio = periodo.substring(0, 4);
  const mes = periodo.substring(4, 6);

  const ultimo = new Date(parseInt(anio), parseInt(mes), 0);
  return ultimo.getFullYear() + '-' + ('0' + (ultimo.getMonth() + 1)).slice(-2) + '-' + ('0' + ultimo.getDate()).slice(-2);
};

export const formatoDDMMYYYY_PEN = (fecha: any) => {
  //
  let fechaSalida = '';
  if (!isNaN(Date.parse(fecha))) {
    //
    fechaSalida = fecha.substr(8, 2) + '/' + fecha.substr(5, 2) + '/' + fecha.substr(0, 4);
    //
  }
  return fechaSalida;
};

export const formatoYYYY_MM_DD_PEN = (fecha: any) => {
  //
  let fechaSalida = '';
  if (!isNaN(Date.parse(fecha))) {
    //
    fechaSalida = fecha.substr(0, 4) + '-' + fecha.substr(5, 2) + '-' + fecha.substr(8, 2);
    //
  }
  return fechaSalida;
};

export const formatoHH_MM_SS_PEN = (fecha: any) => {
  //
  let fechaSalida = '';
  if (fecha === '') {
    fechaSalida = '00:00:00';
  } else {
    if (!isNaN(Date.parse(fecha))) {
      //
      fechaSalida = fecha.substr(11, 2) + ':' + fecha.substr(14, 2) + ':' + fecha.substr(17, 2);
      //
    }
  }
  return fechaSalida;
};

export const elIdAuxiliar = () => {
  return Math.floor(Math.random() * 9000000 + 1).toString();
};

export const redondeo_0_Decimales = (num: any) => {
  //
  const m = Number((Math.abs(num) * 1).toPrecision(15));
  return (Math.round(m) / 1) * Math.sign(num);
};
export const redondeo2Decimales = (num: any) => {
  //
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
};
export const redondeo3Decimales = (num: any) => {
  //
  const m = Number((Math.abs(num) * 1000).toPrecision(15));
  return (Math.round(m) / 1000) * Math.sign(num);
};
export const redondeo4Decimales = (num: any) => {
  //
  const m = Number((Math.abs(num) * 10000).toPrecision(15));
  return (Math.round(m) / 10000) * Math.sign(num);
};

export const redondeo6Decimales = (num: any) => {
  //
  const m = Number((Math.abs(num) * 1000000).toPrecision(15));
  return (Math.round(m) / 1000000) * Math.sign(num);
};

export const cerosALaIzquierda = (num: any, size: number) => {
  // console.log('cerosALaIzquierda', num, size);
  if (num === null || num === undefined) {
    return '-';
  }
  if (num === '') {
    return '-';
  }

  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
};

export const formatear_2Decimales = (num: any) => {
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  m = (Math.round(m) / 100) * Math.sign(num);
  return m;
  // return m.toLocaleString('en-PE', {
  //   // style: 'currency',
  //   currency: 'USD',
  //   minimumFractionDigits: 2,
  // });
};

export const formatear_4Decimales = (num: any) => {
  let m = Number((Math.abs(num) * 10000).toPrecision(15));
  m = (Math.round(m) / 10000) * Math.sign(num);
  return m;
  // return m.toLocaleString('en-PE', {
  //   // style: 'currency',
  //   currency: 'USD',
  //   minimumFractionDigits: 4,
  // });
};

export const formatear_6Decimales = (num: any) => {
  // console.log('GENESIS 0 formatear_6Decimales', num);

  let m = Number((Math.abs(num) * 1000000).toPrecision(15));
  m = (Math.round(m) / 1000000) * Math.sign(num);
  // console.log('GENESIS 1 formatear_6Decimales', m);
  return m;
  // return m.toLocaleString('en-PE', {
  //   // style: 'currency',
  //   currency: 'USD',
  //   minimumFractionDigits: 6,
  // });
};

export const formatearMonedaPEN = (num: any) => {
  //
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  m = (Math.round(m) / 100) * Math.sign(num);
  return m.toLocaleString('en-PE', {
    // style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  });
};
export const formatear6_MonedaPEN = (num: any) => {
  //
  let m = Number((Math.abs(num) * 1000000).toPrecision(15));
  m = (Math.round(m) / 1000000) * Math.sign(num);
  return m.toLocaleString('en-PE', {
    // style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 6,
  });
};
export const formatearMonedaUSD = (num: any) => {
  //
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  m = (Math.round(m) / 100) * Math.sign(num);
  return m.toLocaleString('en-PE', {
    // style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};
export const formatearNumeroINT = (num: number) => {
  return new Intl.NumberFormat('es-PE').format(num);
};

export const literal = (importe: any, moneda: string) => {
  //console.log('literal........', importe, moneda);
  if (importe < 0 || importe > 999999999) {
    return '';
  }
  if (importe === 0) {
    return moneda === 'PEN' ? 'CERO y 00/100 SOLES' : 'CERO y 00/100 DOLARES AMERICANOS';
  } else {
    //console.log('🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻🐱‍💻');
    //
    let LITERAL_DEL_ENTERO = '';
    let LITERAL_DEL_DECIMAL = '';
    let LITERAL_DE_LA_MONEDA = '';
    //descomponiendo el importe en su ENTERO y su DECIMAL
    const ENTERO = Math.trunc(Math.abs(importe));

    const DECIMAL = redondeo_0_Decimales(100 * (Math.abs(importe) - ENTERO));

    //importe en CADENA
    const CADENA = ENTERO.toString();
    //longitud de la CADENA
    const LONGITUD_DEL_ENTERO = CADENA.length;
    //console.log('🐧🐧🐧🐧LONGITUD de ENTERO', LONGITUD_DEL_ENTERO);
    //descomponiendo para componer el ENTERO
    let CIEN_DECENAS = '';
    let cd_15_14_13_12_11 = '';
    let composicion654 = '';
    for (let INDICE = LONGITUD_DEL_ENTERO; 0 < INDICE; INDICE--) {
      let DIGITO = '';
      if (INDICE === 9 || INDICE === 6 || INDICE === 3) {
        //hallando el DIGITO
        DIGITO = CADENA.substring(LONGITUD_DEL_ENTERO - INDICE, LONGITUD_DEL_ENTERO - INDICE + 1);
        //
        CIEN_DECENAS = CADENA.substring(LONGITUD_DEL_ENTERO - INDICE, LONGITUD_DEL_ENTERO - INDICE + 3);
      }
      if (INDICE === 8 || INDICE === 5 || INDICE === 2) {
        //hallando el DIGITO
        DIGITO = CADENA.substring(LONGITUD_DEL_ENTERO - INDICE, LONGITUD_DEL_ENTERO - INDICE + 1);
        //
        CIEN_DECENAS = CADENA.substring(LONGITUD_DEL_ENTERO - INDICE, LONGITUD_DEL_ENTERO - INDICE + 2);
        if (CIEN_DECENAS === '15' || CIEN_DECENAS === '14' || CIEN_DECENAS === '13' || CIEN_DECENAS === '12' || CIEN_DECENAS === '11') {
          cd_15_14_13_12_11 = CIEN_DECENAS;
        } else {
          cd_15_14_13_12_11 = '';
        }
      }
      if (INDICE === 7 || INDICE === 4 || INDICE === 1) {
        //hallando el DIGITO
        DIGITO = CADENA.substring(LONGITUD_DEL_ENTERO - INDICE, LONGITUD_DEL_ENTERO - INDICE + 1);
        //
        CIEN_DECENAS = cd_15_14_13_12_11 !== '' ? cd_15_14_13_12_11 : '';
      }
      if (INDICE === 6 || INDICE === 5 || INDICE === 4) {
        composicion654 = composicion654 + DIGITO;
      }
      //
      if (composicion654 === '000' && INDICE === 4) {
        LITERAL_DEL_ENTERO;
      } else {
        LITERAL_DEL_ENTERO = LITERAL_DEL_ENTERO + componiendoLiteral_ENTERO(LONGITUD_DEL_ENTERO, INDICE, DIGITO, CIEN_DECENAS);
      }
    }
    // componiendo el DECIMAL

    LITERAL_DEL_DECIMAL = cerosALaIzquierda(DECIMAL, 2) + '/100';
    //componiendo la MONEDA
    LITERAL_DE_LA_MONEDA = moneda === 'PEN' ? 'SOLES' : 'DOLARES AMERICANOS';
    return LITERAL_DEL_ENTERO.trim() + ' Y ' + LITERAL_DEL_DECIMAL + ' ' + LITERAL_DE_LA_MONEDA;
  }
};

const componiendoLiteral_ENTERO = (longitud_d_entero: number, indice: number, digito: string, cien_decenas: string) => {
  // //console.log('componiendoLiteral_ENTERO', indice, digito, cien_decenas);
  //console.log({ longitud_d_entero: longitud_d_entero, indice: indice, digito: digito, cien_decenas: cien_decenas });
  let valor = '';

  if (indice === 9 || indice === 8 || indice === 7) {
    if (indice === 7) {
      if (longitud_d_entero === indice && indice === 7 && digito === '1') {
        valor = componer_centenas_decenas_unidades(longitud_d_entero, indice, digito, cien_decenas) + 'MILLÓN ';
      } else {
        valor = componer_centenas_decenas_unidades(longitud_d_entero, indice, digito, cien_decenas) + 'MILLONES ';
      }
    } else {
      valor = componer_centenas_decenas_unidades(longitud_d_entero, indice, digito, cien_decenas);
    }
    return valor;
  } else if (indice === 6 || indice === 5 || indice === 4) {
    valor =
      indice === 4
        ? componer_centenas_decenas_unidades(longitud_d_entero, indice, digito, cien_decenas) + 'MIL '
        : componer_centenas_decenas_unidades(longitud_d_entero, indice, digito, cien_decenas);
    return valor;
  } else {
    return componer_centenas_decenas_unidades(longitud_d_entero, indice, digito, cien_decenas);
  }
};

const componer_centenas_decenas_unidades = (longitud_d_entero: number, indice: number, digito: string, cien_decenas: string) => {
  // //console.log('componer_centenas_decenas_unidades', indice, digito, cien_decenas);
  //console.log({ longitud_d_entero: longitud_d_entero, indice: indice, digito: digito, cien_decenas: cien_decenas });
  let valor = '';
  let esCERO = '';
  if (indice === 9 || indice === 6 || indice === 3) {
    valor =
      digito === '9'
        ? 'NOVECIENTOS '
        : digito === '8'
        ? 'OCHOCIENTOS '
        : digito === '7'
        ? 'SETECIENTOS '
        : digito === '6'
        ? 'SEISCIENTOS '
        : digito === '5'
        ? 'QUINIENTOS '
        : digito === '4'
        ? 'CUATROCIENTOS '
        : digito === '3'
        ? 'TRECIENTOS '
        : digito === '2'
        ? 'DOCIENTOS '
        : '';
    if (digito === '1') {
      if (cien_decenas === '100') {
        valor = 'CIEN ';
      } else {
        valor = 'CIENTO ';
      }
    }
  }
  if (indice === 8 || indice === 5 || indice === 2) {
    valor =
      digito === '9'
        ? 'NOVENTA '
        : digito === '8'
        ? 'OCHENTA '
        : digito === '7'
        ? 'SETENTA '
        : digito === '6'
        ? 'SESENTA '
        : digito === '5'
        ? 'CINCUENTA '
        : digito === '4'
        ? 'CUARENTA '
        : digito === '3'
        ? 'TREINTA '
        : digito === '2'
        ? 'VEINTE '
        : '';
    if (digito === '1') {
      if (cien_decenas === '11' || cien_decenas === '12' || cien_decenas === '13' || cien_decenas === '14' || cien_decenas === '15') {
        valor =
          cien_decenas === '15'
            ? 'QUINCE '
            : cien_decenas === '14'
            ? 'CATORCE '
            : cien_decenas === '13'
            ? 'TRECE '
            : cien_decenas === '12'
            ? 'DOCE '
            : cien_decenas === '11'
            ? 'ONCE '
            : '';
      } else {
        valor = digito === '1' ? 'DIEZ ' : '';
        //el digito siguiente es CERO???
        esCERO = cien_decenas.substring(1);
        if (esCERO.trim() !== '' && esCERO.trim() !== '0') {
          valor = valor + 'Y ';
        }
      }
    } else {
      if (digito !== '0') {
        //el digito siguiente es CERO???
        esCERO = cien_decenas.substring(1);
        if (esCERO.trim() !== '' && esCERO.trim() !== '0') {
          valor = valor + 'Y ';
        }
      }
    }
  }
  if (indice === 7 || indice === 4 || indice === 1) {
    if (cien_decenas === '11' || cien_decenas === '12' || cien_decenas === '13' || cien_decenas === '14' || cien_decenas === '15') {
      //console.log('nada');
    } else {
      valor =
        digito === '9'
          ? 'NUEVE '
          : digito === '8'
          ? 'OCHO '
          : digito === '7'
          ? 'SIETE '
          : digito === '6'
          ? 'SEIS '
          : digito === '5'
          ? 'CINCO '
          : digito === '4'
          ? 'CUATRO '
          : digito === '3'
          ? 'TRES '
          : digito === '2'
          ? 'DOS '
          : digito === '1'
          ? 'UNO '
          : '';
      if (longitud_d_entero === indice && indice === 4 && digito === '1') {
        valor = '';
      }
      if (longitud_d_entero === indice && indice === 7 && digito === '1') {
        valor = '';
        valor = 'UN ';
      }
      // //console.log('...cien_decenas', cien_decenas);
      //el digito siguiente es CERO???
      esCERO = cien_decenas.substring(1);
      // //console.log('...esCERO', esCERO);
      if (esCERO.trim() !== '' && esCERO.trim() !== '0') {
        // //console.log('...esCER...');
        valor = valor + 'Y ';
      }
    }
  }
  return valor;
};
