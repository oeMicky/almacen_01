export const hoy = () => {
  const hoy = new Date();
  const al = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-' + ('0' + hoy.getDate()).slice(-2);
  return al;
};
export const primeroDelMes = () => {
  const hoy = new Date();
  const al = hoy.getFullYear() + '-' + ('0' + (hoy.getMonth() + 1)).slice(-2) + '-01';
  return al;
};

export const formatoDDMMYYYY_PEN = (fecha: any) => {
  let fechaSalida = '';
  if (!isNaN(Date.parse(fecha))) {
    fechaSalida = fecha.substr(8, 2) + '/' + fecha.substr(5, 2) + '/' + fecha.substr(0, 4);
  }
  return fechaSalida;
};

export const redondeo_0_Decimales = (num: any) => {
  // console.log('el numero Decimal', num);
  const m = Number((Math.abs(num) * 1).toPrecision(15));
  return (Math.round(m) / 1) * Math.sign(num);
};
export const redondeo2Decimales = (num: any) => {
  // console.log('el numero Decimal', num);
  const m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
};
export const redondeo3Decimales = (num: any) => {
  // console.log('el numero Decimal', num);
  const m = Number((Math.abs(num) * 1000).toPrecision(15));
  return (Math.round(m) / 1000) * Math.sign(num);
};
export const redondeo4Decimales = (num: any) => {
  // console.log('el numero Decimal', num);
  const m = Number((Math.abs(num) * 10000).toPrecision(15));
  return (Math.round(m) / 10000) * Math.sign(num);
};

export const cerosALaIzquierda = (num: any, size: number) => {
  num = num.toString();
  while (num.length < size) num = '0' + num;
  return num;
};

export const formatear_4Decimales = (num: any) => {
  let m = Number((Math.abs(num) * 10000).toPrecision(15));
  m = (Math.round(m) / 10000) * Math.sign(num);
  return m.toLocaleString('en-PE', {
    // style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
  });
};

export const formatearMonedaPEN = (num: any) => {
  // console.log('el numero Decimal', num);
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  m = (Math.round(m) / 100) * Math.sign(num);
  return m.toLocaleString('en-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
  });
};
export const formatearMonedaUSD = (num: any) => {
  // console.log('el numero Decimal', num);
  let m = Number((Math.abs(num) * 100).toPrecision(15));
  m = (Math.round(m) / 100) * Math.sign(num);
  return m.toLocaleString('en-PE', {
    // style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};

export const literal = (importe: any, moneda: string) => {
  console.log('importe->', importe);
  if (importe < 0 || importe >= 1000000) {
    console.log('interbalo fuera de cero');
    return '';
  }
  if (importe === '0') {
    console.log('entro a cero');
    return moneda === 'PEN' ? 'CERO y 00/100 SOLES' : 'CERO y 00/100 DOLARES AMERICANOS';
  } else {
    // console.log('NO cero');
    let LITERAL_DEL_ENTERO = '';
    let LITERAL_DEL_DECIMAL = '';
    let LITERAL_DE_LA_MONEDA = '';
    //descomponiendo el importe en su ENTERO y su DECIMAL
    const ENTERO = Math.trunc(Math.abs(importe));
    console.log('ENTERO', ENTERO);
    const DECIMAL = redondeo_0_Decimales(100 * (Math.abs(importe) - ENTERO));
    console.log('DECIMAL', DECIMAL);
    //importe en CADENA
    const CADENA = ENTERO.toString();
    //longitud de la CADENA
    const LONGITUD = CADENA.length;
    //descomponiendo para componer el ENTERO
    let CIEN_DECENAS = '';
    let cd_15_14_13_12_11 = '';
    for (let INDICE = LONGITUD; 0 < INDICE; INDICE--) {
      let DIGITO = '';
      if (INDICE === 6 || INDICE === 3) {
        //hallando el DIGITO
        DIGITO = CADENA.substring(LONGITUD - INDICE, LONGITUD - INDICE + 1);
        //
        CIEN_DECENAS = CADENA.substring(LONGITUD - INDICE, LONGITUD - INDICE + 3);
      }
      if (INDICE === 5 || INDICE === 2) {
        //hallando el DIGITO
        DIGITO = CADENA.substring(LONGITUD - INDICE, LONGITUD - INDICE + 1);
        //
        CIEN_DECENAS = CADENA.substring(LONGITUD - INDICE, LONGITUD - INDICE + 2);
        if (
          CIEN_DECENAS === '15' ||
          CIEN_DECENAS === '14' ||
          CIEN_DECENAS === '13' ||
          CIEN_DECENAS === '12' ||
          CIEN_DECENAS === '11'
        ) {
          cd_15_14_13_12_11 = CIEN_DECENAS;
        } else {
          cd_15_14_13_12_11 = '';
        }
      }
      if (INDICE === 4 || INDICE === 1) {
        //hallando el DIGITO
        DIGITO = CADENA.substring(LONGITUD - INDICE, LONGITUD - INDICE + 1);
        //
        CIEN_DECENAS = cd_15_14_13_12_11 !== '' ? cd_15_14_13_12_11 : '';
      }
      console.log('INDICE, DIGITO, CIEN_DECENAS', INDICE, DIGITO, CIEN_DECENAS);
      //
      LITERAL_DEL_ENTERO = LITERAL_DEL_ENTERO + componiendoLiteral_ENTERO(INDICE, DIGITO, CIEN_DECENAS);
    }
    // componiendo el DECIMAL
    console.log('DECIMAL', DECIMAL);
    LITERAL_DEL_DECIMAL = cerosALaIzquierda(DECIMAL, 2) + '/100';
    //componiendo la MONEDA
    LITERAL_DE_LA_MONEDA = moneda === 'PEN' ? 'SOLES' : 'DOLARES AMERICANOS';
    return LITERAL_DEL_ENTERO.trim() + ' Y ' + LITERAL_DEL_DECIMAL + ' ' + LITERAL_DE_LA_MONEDA;
  }
};

const componiendoLiteral_ENTERO = (indice: number, digito: string, cien_decenas: string) => {
  let valor = '';
  if (indice === 6 || indice === 5 || indice === 4) {
    valor =
      indice === 4
        ? componer_centenas_decenas_unidades(indice, digito, cien_decenas) + 'MIL '
        : componer_centenas_decenas_unidades(indice, digito, cien_decenas);
    return valor;
  } else {
    return componer_centenas_decenas_unidades(indice, digito, cien_decenas);
  }
};

const componer_centenas_decenas_unidades = (indice: number, digito: string, cien_decenas: string) => {
  let valor = '';
  let esCERO = '';
  if (indice === 6 || indice === 3) {
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
  if (indice === 5 || indice === 2) {
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
      if (
        cien_decenas === '11' ||
        cien_decenas === '12' ||
        cien_decenas === '13' ||
        cien_decenas === '14' ||
        cien_decenas === '15'
      ) {
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
        console.log('entro a 5 - ', digito);
        valor = digito === '1' ? 'DIEZ ' : '';
        //el digito siguiente es CERO???
        esCERO = cien_decenas.substring(1);
        if (esCERO !== '0') {
          valor = valor + 'Y ';
        }
      }
    } else {
      if (digito !== '0') {
        //el digito siguiente es CERO???
        esCERO = cien_decenas.substring(1);
        if (esCERO !== '0') {
          valor = valor + 'Y ';
        }
      }
    }
  }
  if (indice === 4 || indice === 1) {
    if (
      cien_decenas === '11' ||
      cien_decenas === '12' ||
      cien_decenas === '13' ||
      cien_decenas === '14' ||
      cien_decenas === '15'
    ) {
      console.log('+--nada--+');
    } else {
      console.log('entro a 5 - ', digito);
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
      //el digito siguiente es CERO???
      esCERO = cien_decenas.substring(1);
      if (esCERO !== '0') {
        valor = valor + 'Y ';
      }
    }
  }
  return valor;
};

export const elIdAuxiliar = () => {
  return Math.floor(Math.random() * 9000000 + 1).toString();
};
