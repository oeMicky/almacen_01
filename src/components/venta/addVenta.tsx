import {
  $,
  component$,
  createContextId,
  render,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useTask$,
} from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import {
  getSeriesFacturaActivas,
  getSeriesBoletaActivas,
  getSeriesNotaCreditoActivas,
  getSeriesNotaDebitoActivas,
  getIgvVenta,
} from '~/apis/venta.api';
import { cerosALaIzquierda, elIdAuxiliar, formatoDDMMYYYY_PEN, hoy, redondeo2Decimales } from '~/functions/comunes';
import SeleccionarPersona, { IPersona } from '../persona/seleccionarPersona';
import { CTX_VENTA } from '~/routes/(almacen)/factura';
import { getTipoCambio } from '~/apis/apisExternas.api';
import ElButton from '../system/elButton';
import TablaCuotasCreditoVenta from './tablaCuotasCreditoVenta';
import NewEditCuotaCreditoVenta from './newEditCuotaCreditoVenta';
import TablaCuotas2 from './tablaCuotas2';
import BusquedaMercaderiaOUT from '../outAlmacen/busquedaMercaderiaOUT';
import { Form, action$, globalAction$, routeAction$ } from '@builder.io/qwik-city';
import { inVenta } from '~/apis/venta.api';
import AdjuntarCotizacion from './adjuntarCotizacion';

// import { IVenta } from './tablaVentas';
// background: `${enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : ''}`,
//
export const CTX_PERSONA = createContextId<IPersona>('ventaPersona');
export const CTX_ADD_VENTA = createContextId<IVenta>('addVenta');

export interface IItemVenta {
  idAuxiliar: number;
  item: number;
  codigo: string;
  descripcionEquivalencia: string;
  cantidad: number;
  unidadEquivalencia: string;
  costo: number;
  precioPEN: number;
  ventaPEN: number;
  precioUSD: number;
  ventaUSD: number;
}

export interface ICuotaCreditoVenta {
  idAuxiliar: number;
  fechaCuota: string;
  importeCuotaPEN: number;
}

export interface IVenta {
  codigoDocumento: string;
  documentoVenta: string;
  serie: string;
  numeroDocumento: number;
  fecha: string;

  idCliente: string;
  codigoTipoDocumentoIdentidad: number;
  tipoDocumentoIdentidad: string;
  numeroIdentidad: string;
  razonSocialNombre: string;

  igv: number;
  enDolares: boolean;
  moneda: string;
  tipoCambio: number;

  vendedor: string;
  metodoPago: string;
  verCuotasCredito: boolean;
  cuotasCredito: any; // ICuotaCreditoVenta[];
  importeTotalCuotasCredito: number;

  cotizacion: number;
  ordenServicio: number;

  itemsVenta: any;

  montoSubTotalPEN: number;
  montoIGVPEN: number;
  montoTotalPEN: number;

  montoSubTotalUSD: number;
  montoIGVUSD: number;
  montoTotalUSD: number;
}

// export const addVenta = routeAction$(async () => {
//   if (serieDocumento.value) {
//     alert('Seleccione la serie.');
//     document.getElementById('selectSerieVenta')?.focus();
//   }
// });

export default component$((props: { ancho: number; parametrosGlobales: any; igv: number }) => {
  const ctx_PanelVenta = useContext(CTX_VENTA);
  const modificaciones_en_venta = useSignal(0);
  const tipoDocumento = useSignal('01'); //FACTURA
  const idSerieDocumento = useSignal('');
  const serieDocumento = useSignal('');
  const botonGrabar = useSignal('');
  const dataSerie = useSignal([]);
  const cuotaCredito_esEdit = useSignal(false);

  //let indexItemVenta = 0; // useSignal(0);
  // const grabo_cuotas_numero = useSignal(0);
  let sumaCuotas = 0;
  let sumaTOTAL = 0;
  let subTOTAL = 0;
  let igvTOTAL = 0;
  let sumaItems = 0;
  // const iT = useStore<ICuotaCreditoVenta>({
  //   idAuxiliar: -1,
  //   fechaCuota: hoy(),
  //   importeCuotaPEN: -1,
  // });
  // const eT = useStore<IItemVenta>;
  // const item: IItemVenta[] = [];
  const item = useStore<IItemVenta>({
    idAuxiliar: 0, //parseInt(elIdAuxiliar()),
    item: 0,
    codigo: '',
    descripcionEquivalencia: '',
    cantidad: 0,
    unidadEquivalencia: '',
    costo: 0,
    precioPEN: 0,
    ventaPEN: 0,
    precioUSD: 0,
    ventaUSD: 0,
  });
  const item2: IItemVenta[] = [];

  const cuota = useStore<ICuotaCreditoVenta>({
    idAuxiliar: 0,
    fechaCuota: hoy(),
    importeCuotaPEN: 99,
  });

  //#region CONTEXTO PERSONA
  const laPersonaSeleccionada = useStore<IPersona>({
    _id: '',
    codigoTipoDocumentoIdentidad: 0,
    tipoDocumentoIdentidad: '',
    numeroIdentidad: '',
    razonSocialNombre: '',
  });
  useContextProvider(CTX_PERSONA, laPersonaSeleccionada);
  //#endregion CONTEXTO PERSONA
  //#region CONTEXTO ADD VENTA
  //Inicizaliación VENTA
  const venta = useStore<IVenta>(
    {
      codigoDocumento: '',
      documentoVenta: '',
      serie: '',
      numeroDocumento: 0,
      fecha: hoy(),

      idCliente: '',
      codigoTipoDocumentoIdentidad: 6,
      tipoDocumentoIdentidad: 'RUC',
      numeroIdentidad: '',
      razonSocialNombre: '',

      igv: 0,
      enDolares: false,
      moneda: 'PEN',
      tipoCambio: 0,

      vendedor: '',
      metodoPago: 'CONTADO',
      verCuotasCredito: false,
      cuotasCredito: [],
      importeTotalCuotasCredito: 0,

      cotizacion: 0,
      ordenServicio: 0,

      itemsVenta: [],

      montoSubTotalPEN: 0,
      montoIGVPEN: 0,
      montoTotalPEN: 0,

      montoSubTotalUSD: 0,
      montoIGVUSD: 0,
      montoTotalUSD: 0,
    },
    { deep: true }
  );
  useContextProvider(CTX_ADD_VENTA, venta);
  //#endregion CONTEXTO ADD VENTA

  //ESTO OCURRE ANTES DE RENDERIZAR
  useTask$(async ({ track }) => {
    track(() => tipoDocumento.value);
    // alert(`tretre a useTask ${documento.value}`);
    let laSerie;
    const parametros = {
      idGrupoEmpresarial: props.parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.parametrosGlobales.idEmpresa,
      documento: tipoDocumento,
    };

    switch (tipoDocumento.value) {
      case '01': //FACTURA
        serieDocumento.value = '';
        // alert(`tretre a useTask FACTURA`);
        laSerie = await getSeriesFacturaActivas(parametros);
        // console.log('laSerie', laSerie);
        dataSerie.value = laSerie.data;
        console.log('dataSerie.value', dataSerie.value);
        venta.codigoDocumento = '01';
        venta.documentoVenta = 'FACTURA';
        botonGrabar.value = 'Grabar FACTURA';
        // setSeries(laSerie.data);
        // setCodigoDocumento('01');
        // setDocumentoVenta('FACTURA');
        // setBotonGrabar('Grabar FACTURA');

        break;
      case '03': //BOLETA
        serieDocumento.value = '';
        // alert(`tretre a useTask BOLETA`);
        laSerie = await getSeriesBoletaActivas(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;
        console.log('dataSerie.value', dataSerie.value);
        venta.codigoDocumento = '03';
        venta.documentoVenta = 'BOLETA';
        botonGrabar.value = 'Grabar BOLETA';
        // setBotonGrabar('Grabar BOLETA');

        break;
      case '07': //NOTA DE CRÉDITO
        serieDocumento.value = '';
        // alert(`tretre a useTask NOTA DE CRÉDITO`);
        laSerie = await getSeriesNotaCreditoActivas(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;
        console.log('dataSerie.value', dataSerie.value);
        venta.codigoDocumento = '07';
        venta.documentoVenta = 'NOTA DE CRÉDITO';
        botonGrabar.value = 'Grabar NOTA DE CRÉDITO';
        // setBotonGrabar('Grabar NOTA DE CRÉDITO');

        break;
      case '08': //NOTA DE DÉBITO
        serieDocumento.value = '';
        // alert(`tretre a useTask NOTA DE DÉBITO`);
        laSerie = await getSeriesNotaDebitoActivas(parametros);
        // setSeries(laSerie.data);
        dataSerie.value = laSerie.data;
        console.log('dataSerie.value', dataSerie.value);
        venta.codigoDocumento = '08';
        venta.documentoVenta = 'NOTA DE DÉBITO';
        botonGrabar.value = 'Grabar NOTA DE DÉBITO';
        // setBotonGrabar('Grabar NOTA DE DÉBITO');

        break;

      default:
        console.log(`Sorry, we are out of ${tipoDocumento}.`);
        break;
    }
    //
    // let elIgv = await getIgvVenta(props.parametrosGlobales);
    // elIgv = elIgv.data;
    // // console.log('elIgv', elIgv[0].igv);
    // venta.igv = elIgv[0].igv;
    venta.igv = props.igv;
  });

  //TAREAS DIVERSAS
  //#region GENERALES
  useTask$(async ({ track }) => {
    track(() => serieDocumento.value);
    // const tre: HTMLSelectElement = document.getElementById('selectSerieVenta');
    // const elID = tre.current[2].value;
    if (serieDocumento.value === '') {
      // if (serieDocumento.value === '--Seleccione una opción--') {
      console.log('--Seleccione una opción--');
      // setIdTipoDocumento('');
      venta.serie = '';
      venta.numeroDocumento = 0;
      console.log('venta.serie', venta.serie, venta.numeroDocumento);
    } else {
      // console.log('elID', elID);
      // console.log('elValor', elValor);
      // console.log('elValor', elValor.substring(0, 3));

      venta.serie = serieDocumento.value;
      console.log('venta.serie...:', idSerieDocumento.value, venta.serie, dataSerie.value);
      const corr = dataSerie.value.filter((ser: any) => ser._id === idSerieDocumento.value);
      const elCorre: { _id: string; codigo: string; serie: string; correlativo: number } = corr[0];
      console.log('corr.correlativo', elCorre.correlativo);
      venta.numeroDocumento = elCorre.correlativo + 1;
    }
  });
  //#endregion GENERALES
  //#region CLIENTE
  useTask$(({ track }) => {
    track(() => ctx_PanelVenta.selecciono_Persona);
    if (ctx_PanelVenta.selecciono_Persona) {
      // alert('evalua a la persona');
      venta.idCliente = laPersonaSeleccionada._id;
      venta.codigoTipoDocumentoIdentidad = laPersonaSeleccionada.codigoTipoDocumentoIdentidad;
      venta.tipoDocumentoIdentidad = laPersonaSeleccionada.tipoDocumentoIdentidad;
      venta.numeroIdentidad = laPersonaSeleccionada.numeroIdentidad;
      venta.razonSocialNombre = laPersonaSeleccionada.razonSocialNombre;
      ctx_PanelVenta.selecciono_Persona = false;
    }
  });
  //#endregion CLIENTE
  //#region GENERALES DE FACTURA : Documento
  const buscarSeriesVenta = $(async () => {
    // const documento = (e.target as HTMLSelectElement).value;
    alert('La alerta buscarSeriesVenta: ' + tipoDocumento.value);
  });
  //#endregion
  //#region TIPO CAMBIO
  const obtenerTipoCambio = $(async (e: HTMLInputElement) => {
    const checkTC = e.checked;
    if (checkTC) {
      venta.enDolares = true;
      console.log('ingreso al tipo de cambio');
      let elTipoCambio = await getTipoCambio(venta.fecha);
      elTipoCambio = elTipoCambio.data;
      console.log('elTipoCambio', elTipoCambio.venta);
      venta.moneda = elTipoCambio.moneda;
      venta.tipoCambio = elTipoCambio.venta;
      // let itemsVVVVVV = await tablaItemsVentaADolares(elTipoCambio.venta);
      // console.log('itemsVVVVVV', itemsVVVVVV);
    } else {
      console.log('ingreso al NNNNOOOOOO enDOLARES');
      venta.enDolares = false;
      venta.moneda = 'PEN';
      venta.tipoCambio = 0;
      // itemsVenta.map((itemV, index) => {
      //   let { cantidad, precioPEN } = itemV;
      //   itemV['ventaPEN'] = redondeo2Decimales(itemV['precioPEN'] * cantidad);
      //   setItemsVenta([...itemsVenta.slice(0, index), itemV, ...itemsVenta.slice(index + 1, itemsVenta.length)]);
      // });
    }
  });
  //#endregion TIPO CAMBIO
  //#region CUOTA CREDITO
  // const lasCuotas{}

  useTask$(({ track }) => {
    track(() => ctx_PanelVenta.mostrarPanelCuotasCredito);
    if (ctx_PanelVenta.grabo_CuotaCredito) {
      // alert(`${cuota.importeCuotaPEN}`);
      console.log('🤑 🤩 insertar cuota', cuota);
      const elTarget = JSON.parse(JSON.stringify(cuota));
      console.log('🤩🤩🤩 insertar cuota elTarget', elTarget);
      const iT = elTarget;
      console.log('🤩🤩🤩 iT', iT);
      venta.cuotasCredito.push(iT);
    }
  });

  //#endregion CUOTA CREDITO

  //#region ITEMS VENTA
  const fijarMontos = $((e: any) => {
    console.log(' eee', e);

    console.log('eeeeeeeeeeeeeeeeee', e);
    if (venta.enDolares) {
      venta.montoSubTotalUSD = e.subTOTAL;
      venta.montoIGVUSD = e.igvTOTAL;
      venta.montoTotalUSD = e.sumaTOTAL;

      const tt = redondeo2Decimales(e.sumaTOTAL * venta.tipoCambio);
      const sub = redondeo2Decimales((tt * 100) / (100 + venta.igv));
      const i = redondeo2Decimales(tt - sub);

      venta.montoSubTotalPEN = sub;
      venta.montoIGVPEN = i;
      venta.montoTotalPEN = tt;
    } else {
      venta.montoSubTotalPEN = e.subTOTAL;
      venta.montoIGVPEN = e.igvTOTAL;
      venta.montoTotalPEN = e.sumaTOTAL;
      console.log('first', venta.montoSubTotalPEN, venta.montoIGVPEN, venta.montoTotalPEN);
      venta.montoSubTotalUSD = 0;
      venta.montoIGVUSD = 0;
      venta.montoTotalUSD = 0;
    }
  });
  // useTask$(({ track }) => {
  //   track(() => ctx_PanelVenta.grabo_ItemsVenta);
  //   if (ctx_PanelVenta.grabo_ItemsVenta) {
  //     console.log('🤑🤑🤑🤑🤑 🤩 insertar item', item);
  //     const elTarget = JSON.parse(JSON.stringify(item));
  //     console.log('🤩🤩🤩🤩🤩 insertar cuota elTarget', elTarget);
  //     // venta.itemsVenta = [...venta.itemsVenta, elTarget];
  //     ctx_PanelVenta.grabo_ItemsVenta = false;
  //     //   console.log('🤩🤩venta.itemsVenta🤑🤑', venta.itemsVenta);
  //   }
  // });
  // const insertarItem = $(async () => {
  //   return console.log('insertando.............');
  // });
  // useTask$(({ track }) => {
  //   track(() => indexItemVenta.value);
  //   console.log('👉👉💂‍♂️indexItemVenta.value');
  // });
  // useTask$(({ track }) => {
  //   track(() => venta.itemsVenta);
  //   console.log('💂‍♂️💂‍♂️💂‍♂️  venta.itemsVenta ');
  // });
  // useTask$(({ track }) => {
  //   track(() => venta);
  //   console.log('💂‍♂️🤑💂‍♂️🤑💂‍♂️  venta ');
  // });
  // useTask$(({ track }) => {
  //   track(() => venta.itemsVenta.length);
  //   console.log('💂‍♂️🤩💂‍♂️🤩💂‍♂️🤩  venta.itemsVenta.length ', venta.itemsVenta.length);
  // });
  //#endregion ITEMS VENTA

  //#region SUBMIT
  // const addVenta = action$(() => {
  //   console.log('first::::::_______::::::______');
  // });
  // const action = addVenta();

  const grabando = $(async () => {
    console.log('first::::::_______::::::______T');
    if (serieDocumento.value === '') {
      alert('Seleccione la serie.');
      document.getElementById('selectSerieVenta')?.focus();
      return;
    }
    if (venta.numeroIdentidad === '') {
      alert('Seleccione el número de identidad.');
      document.getElementById('inputNumeroDocumentoIdentidad')?.focus();
      return;
    }
    if (venta.razonSocialNombre === '') {
      alert('Seleccione la razón social / nombre.');
      document.getElementById('inputNombreCliente')?.focus();
      return;
    }
    if (venta.verCuotasCredito && venta.cuotasCredito.length === 0) {
      alert('Ingrese las cuotas de crédito.');
      document.getElementById('addCuota')?.focus();
      return;
    }
    if (venta.itemsVenta.length === 0) {
      alert('Ingrese los ítems para la venta.');
      document.getElementById('btnVerAlmacen')?.focus();
      return;
    }
    console.log('paso_______::::::______T', venta);
    const aGrabar = await inVenta({
      idGrupoEmpresarial: props.parametrosGlobales.idGrupoEmpresarial,
      idEmpresa: props.parametrosGlobales.idEmpresa,

      ruc: props.parametrosGlobales.parameRUC,
      empresa: props.parametrosGlobales.parameRazonSocial,
      direccion: props.parametrosGlobales.paraDireccion,

      codigoDocumento: venta.codigoDocumento,
      documentoVenta: venta.documentoVenta,
      serie: venta.serie,
      numeroDocumento: venta.numeroDocumento,
      fecha: venta.fecha,

      idCliente: venta.idCliente,
      codigoTipoDocumentoIdentidad: venta.codigoTipoDocumentoIdentidad,
      tipoDocumentoIdentidad: venta.tipoDocumentoIdentidad,
      numeroIdentidad: venta.numeroIdentidad,
      razonSocialNombre: venta.razonSocialNombre,
      // email: venta.email,

      igv: venta.igv,
      moneda: venta.moneda,
      tipoCambio: venta.tipoCambio,

      vendedor: venta.vendedor,
      metodoPago: venta.metodoPago,
      cuotasPago: venta.cuotasCredito,
      importeTotalCuotasCredito: venta.importeTotalCuotasCredito,

      cotizacion: venta.cotizacion,
      ordenServicio: venta.ordenServicio,

      itemsVenta: venta.itemsVenta,

      montoSubTotalPEN: venta.montoSubTotalPEN,
      montoIGVPEN: venta.montoIGVPEN,
      montoTotalPEN: venta.montoTotalPEN,

      montoSubTotalUSD: venta.montoSubTotalUSD,
      montoIGVUSD: venta.montoIGVUSD,
      montoTotalUSD: venta.montoTotalUSD,

      // fechaReferencia: venta.fechaReferencia,
      // tipoReferencia: venta.tipoReferencia,
      // serieReferencia: venta.serieReferencia,
      // numeroReferencia: venta.numeroReferencia,

      usuario: props.parametrosGlobales.usuario,
    });
  });
  //#endregion SUBMIT

  return (
    <div
      class="container-modal"
      style={{
        width: props.ancho + 'px',
        background: `${venta.enDolares ? 'linear-gradient(to right, #aaffaa 0%, #aaaaaa 100%)' : ''}`,
      }}
    >
      {/* BOTONES DEL MARCO */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'end',
        }}
      >
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_PanelVenta.mostrarPanelVenta = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={16}
          width={16}
          title="ver"
          onClick={$(() => {
            console.log('serieDocumento.value', serieDocumento.value);
          })}
        />
      </div>
      {/* FORMULARIO */}
      {/* <Form action={action}> */}
      <div class="add-form">
        {/* GENERALES */}
        <div>
          {/* GENERALES DE FACTURA */}
          <div>
            {/* Documento onChange={buscarSeriesVenta}  */}
            <div class="form-control">
              <label>Documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectDocumentoVenta"
                  style={{ width: '100%' }}
                  onChange$={(e) => {
                    tipoDocumento.value = (e.target as HTMLSelectElement).value;

                    // alert('La alerta onChange$: ' + documento.value);
                    // buscarSeriesVenta;
                  }}
                >
                  <option value={'01'}>FACTURA</option>
                  <option value={'03'}>BOLETA</option>
                  <option value={'07'}>NOTA DE CRÉDITO</option>
                  <option value={'08'}>NOTA DE DÉBITO</option>
                </select>
              </div>
            </div>
            {/* Serie  key={ser._id} id={ser._id} value={ser.serie}*/}
            <div class="form-control">
              <label>Serie</label>
              <div class="form-control form-agrupado">
                <select
                  value={serieDocumento.value}
                  id="selectSerieVenta"
                  style={{ width: '100%' }}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const rere = e.target as HTMLSelectElement;
                    const elOption = rere[idx];
                    console.log('elOption', elOption.id);
                    //
                    // console.log('idx', idx.item.arguments(id));
                    // const csd = (e.target as HTMLSelectElement).current[idx];
                    idSerieDocumento.value = elOption.id;
                    serieDocumento.value = (e.target as HTMLSelectElement).value;
                  }}
                >
                  <option value="">-- Seleccione una opción --</option>
                  {dataSerie.value.map((ser: any) => {
                    return (
                      <option id={ser._id} value={ser.serie}>
                        {ser.serie}
                      </option>
                    );
                  })}
                </select>
                {/* <Select
                  id={'selectSerieVenta'}
                  elValor={serie}
                  registros={series}
                  registroID={'_id'}
                  registroTEXT={'serie'}
                  // onChange={changeSerieVenta}
                /> */}
              </div>
            </div>
            {/* Numero de documento     value={numeroDocumento}*/}
            <div class="form-control">
              <label>Número</label>
              <div class="form-control form-agrupado">
                <input id="inputNumeroDocumento" style={{ width: '100%' }} type="text" disabled value={venta.numeroDocumento} />
              </div>
            </div>
            {/* fecha    onChange={(e) => setFecha(e.currentTarget.value)}*/}
            <div class="form-control form-control-check">
              <label>Fecha</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputFecha"
                  type="date"
                  disabled
                  value={venta.fecha}
                  onChange$={(e) => {
                    venta.fecha = (e.target as HTMLInputElement).value;
                  }}
                />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* GENERALES DEL CLIENTE */}
          <div>
            {/* tipo de documento identidad*/}
            <div class="form-control">
              <label>Tipo documento</label>
              <div class="form-control form-agrupado">
                <select
                  id="selectTipoDocumentoLiteral"
                  // value={6}
                  value={venta.tipoDocumentoIdentidad}
                  // onChange={cambioTipoDocumento}
                  onChange$={(e) => {
                    const idx = (e.target as HTMLSelectElement).selectedIndex;
                    const rere = e.target as HTMLSelectElement;
                    const elOption = rere[idx];
                    console.log('elOption', elOption.id);
                    //
                    // console.log('idx', idx.item.arguments(id));
                    // const csd = (e.target as HTMLSelectElement).current[idx];
                    venta.codigoTipoDocumentoIdentidad = parseInt(elOption.id);
                    venta.tipoDocumentoIdentidad = (e.target as HTMLSelectElement).value;
                  }}
                  style={{ width: '100%' }}
                >
                  <option id="1" value="DNI">
                    DNI
                  </option>
                  <option id="6" value="RUC">
                    RUC
                  </option>
                  <option id="4" value="C.EXT">
                    C.EXT
                  </option>
                </select>
              </div>
            </div>
            {/* numero identidad*/}
            <div class="form-control">
              <label>Número identidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumeroDocumentoIdentidad"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Add número"
                  value={venta.numeroIdentidad}
                  onChange$={(e) => (venta.numeroIdentidad = (e.target as HTMLInputElement).value)}
                  // onChange={(e) => setNumeroIdentidad(e.target.value)}
                />
                <ImgButton
                  src={images.searchPLUS}
                  alt="Icono de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                  // onClick={buscarCliente}
                  onClick={$(() => {
                    ctx_PanelVenta.mostrarPanelSeleccionarPersona = true;
                  })}
                />
              </div>
            </div>
            {ctx_PanelVenta.mostrarPanelSeleccionarPersona && (
              <div class="modal">
                <SeleccionarPersona
                  ancho={520}
                  seleccionar={'cliente'}
                  parametrosGlobales={props.parametrosGlobales}
                  soloPersonasNaturales={false}
                />
              </div>
            )}
            {/* Razon Social / Nombre */}
            <div class="form-control">
              <label>Razón social / Nombre</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNombreCliente"
                  style={{ width: '100%' }}
                  type="text"
                  placeholder="Razón social / Nombre"
                  value={venta.razonSocialNombre}
                  // onChange={(e) => setRazonSocialNombre(e.target.value)}
                />
              </div>
            </div>
            {/* E mail */}
            {/* <div class="form-control">
              <label>Email</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputNumero"
                  style={{ width: '100%' }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <ImgButton
                  src={icons.searchPLUS.default}
                  alt="Icono de buscar identidad"
                  height={16}
                  width={16}
                  title="Buscar datos de identidad"
                />
              </div>
            </div> */}
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* IGV - TC */}
          <div>
            {/* IGV */}
            <div class="form-control">
              <label>IGV (%)</label>
              <div class="form-control form-agrupado">
                <input type={'text'} id={'inputIGV'} style={{ width: '100%' }} disabled value={venta.igv} />
              </div>
            </div>
            {/* Tipo Cambio    htmlFor={'checkboxTipoCambio'}*/}
            <div class="form-control">
              <div>
                <input
                  type={'checkbox'}
                  id={'checkboxTipoCambio'}
                  // onClick$={(e) => {
                  //   venta.enDolares = (e.target as HTMLInputElement).checked;
                  // }}
                  onClick$={(e) => {
                    obtenerTipoCambio(e.target as HTMLInputElement);
                  }}
                />{' '}
                <label
                  style={{ textAlign: 'start' }}
                  // onClick$={
                  //   (document.getElementById('checkboxTipoCambio')?.checked = !document.getElementById('checkboxTipoCambio'))
                  // }
                >
                  Tipo Cambio (USD)
                </label>
              </div>
              <div class="form-control form-agrupado">
                <input id="inputTipoCambio" style={{ width: '100%' }} type="text" value={venta.tipoCambio} disabled />
              </div>
            </div>
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* VENDEDOR - METODO DE PAGO */}
          <div>
            {/* Vendedor */}
            {/* <div class="form-control">
              <label>Vendedor</label>
              <div class="form-control form-agrupado">
                <input id="inputVendedor" style={{ width: '100%' }} type="text" disabled />
              </div>
            </div> */}
            {/* Método Pago */}
            <div class="form-control">
              <label>Método de pago</label>
              <div class="form-control form-agrupado" style={{ display: 'flex' }}>
                <select
                  id="metodoPago"
                  value={venta.metodoPago}
                  // onChange={changeMetodoPago}
                  onChange$={() => {
                    venta.verCuotasCredito = !venta.verCuotasCredito;
                    console.log('venta.metodoPago', venta.metodoPago);
                  }}
                  style={venta.verCuotasCredito ? { width: '79%' } : { width: '100%' }}
                >
                  <option value={'CONTADO'}>CONTADO</option>
                  <option value={'CRÉDITO'}>CRÉDITO</option>
                </select>
                {venta.verCuotasCredito && (
                  <button
                    id="addCuota"
                    class="btn"
                    title="Adicionar cuota"
                    onClick$={() => {
                      (cuota.idAuxiliar = parseInt(elIdAuxiliar())),
                        (cuota.fechaCuota = hoy()),
                        (cuota.importeCuotaPEN = 0),
                        (cuotaCredito_esEdit.value = false);
                      ctx_PanelVenta.mostrarPanelCuotasCredito = true;
                      ctx_PanelVenta.grabo_CuotaCredito = false;
                    }}
                    // onClick$={() => (ctx_PanelVenta.mostrarPanelCuotasCredito = true)}
                  >
                    Add cuota
                  </button>
                )}
              </div>
            </div>
            {ctx_PanelVenta.mostrarPanelCuotasCredito && (
              <div class="modal">
                <NewEditCuotaCreditoVenta
                  ancho={280}
                  esEdit={cuotaCredito_esEdit.value}
                  cuota={cuota}
                  // inicializarCuotaCredito={inicializarCuota}
                  // onAddEdit={inUpCuotaCredito}
                  // onCerrar={() => {
                  //   setShowCuotaCredito(false);
                  // }}
                />
              </div>
            )}
            {/* TABLA DE CUOTAS DE PAGO venta.verCuotasCredito &&   ctx_PanelVenta.grabo_cuotas_numero &&*/}
            {
              <div class="form-control">
                {venta.cuotasCredito.length > 0 ? (
                  <table style={{ fontSize: '0.7em', fontWeight: 'lighter', margin: '5px 0' }}>
                    <thead>
                      <tr>
                        <th>Nro. Cuota</th>
                        <th>Fecha</th>
                        <th>Importe</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {venta.cuotasCredito.map((value: any, index: any) => {
                        //   const { idAuxiliar, fechaCuota, importeCuotaPEN } = cuota;
                        const indexItem = index + 1;
                        // sumaCuotas.value = sumaCuotas.value + redondeo2Decimales(cuota.importeCuotaPEN);
                        sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);

                        //   importeTotal(sumaCuotas);
                        // Cuota{}
                        return (
                          <tr key={value.idAuxiliar}>
                            <td key={value.idAuxiliar}>{`${cerosALaIzquierda(indexItem, 3)}`}</td>
                            <td>{formatoDDMMYYYY_PEN(value.fechaCuota)}</td>
                            <td style={{ textAlign: 'end' }}>
                              {/* {cuota.importeCuotaPEN} */}
                              {`${value.importeCuotaPEN.toLocaleString('en-PE', {
                                // style: 'currency',
                                currency: 'PEN',
                                minimumFractionDigits: 2,
                              })}`}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <ImgButton
                                src={images.edit}
                                alt="icono de editar"
                                height={12}
                                width={12}
                                title="Editar ítem"
                                //   onClick={() => {
                                //     mostrarEdit({
                                //       idAuxiliar,
                                //       fechaCuota,
                                //       importeCuotaPEN,
                                //     });
                                //   }}
                              />
                              <ImgButton
                                src={images.trash}
                                alt="icono de eliminar"
                                height={12}
                                width={12}
                                title="Eliminar ítem"
                                //   onClick={() => {
                                //     onDel(idAuxiliar);
                                //   }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <th colSpan={2} style={{ textAlign: 'end' }}>
                          Suma Cuotas
                        </th>
                        <th colSpan={1} style={{ textAlign: 'end' }}>
                          {`${sumaCuotas.toLocaleString('en-PE', {
                            style: 'currency',
                            currency: 'PEN',
                            minimumFractionDigits: 2,
                          })}`}
                        </th>
                        <th></th>
                      </tr>
                    </tfoot>
                  </table>
                ) : venta.verCuotasCredito ? (
                  <i style={{ fontSize: '0.7rem' }}>No existen cuotas de crédito</i>
                ) : (
                  ''
                )}
              </div>
            }
            {/*   {showPanelDeleteCuotaCredito && (
              <Modal
                componente={
                  <DeleteCuotaCredito
                    elIdAuxiliarCuota={borrarIdAuxiliarCuotaCredito}
                    ancho={'500px'}
                    onCerrar={cerrarPanelDeleteCuota}
                  />
                }
              />
            )} */}
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* BOTONES */}
          <div>
            <button id="btnVerAlmacen" onClick$={() => (ctx_PanelVenta.mostrarVerAlmacen = true)}>
              Ver almacén
            </button>
            {ctx_PanelVenta.mostrarVerAlmacen && (
              <div class="modal">
                <BusquedaMercaderiaOUT ancho={740} parametrosGlobales={props.parametrosGlobales} item1={item} />
              </div>
            )}
            <button id="btnAdjuntarCotizacion" onClick$={() => (ctx_PanelVenta.mostrarAdjuntarCotizacion = true)}>
              Adjuntar cotización
            </button>
            {ctx_PanelVenta.mostrarAdjuntarCotizacion && (
              <div class="modal">
                <AdjuntarCotizacion ancho={700} parametrosGlobales={props.parametrosGlobales} />
              </div>
            )}
            <hr style={{ margin: '5px 0' }}></hr>
          </div>
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/* ----------------------------------------------------- */}
          {/*  tabla ITEMS - VENTA */}
          {
            <div class="form-control">
              {venta.itemsVenta.length > 0 ? (
                <table style={{ fontSize: '0.7rem', fontWeight: 'lighter' }}>
                  <thead>
                    <tr>
                      <th>Ítem</th>
                      <th>Código</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Uni</th>
                      <th>Precio</th>
                      <th>Venta </th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {venta.itemsVenta.map((iTVen: any, index: any) => {
                      const indexItemVenta = index + 1;
                      if (venta.enDolares) {
                        sumaTOTAL =
                          sumaTOTAL +
                          redondeo2Decimales(iTVen.ventaUSD.$numberDecimal ? iTVen.ventaUSD.$numberDecimal : iTVen.ventaUSD);
                        subTOTAL = redondeo2Decimales((sumaTOTAL * 100) / (100 + venta.igv));
                        igvTOTAL = redondeo2Decimales(sumaTOTAL - subTOTAL);
                      } else {
                        sumaTOTAL =
                          sumaTOTAL +
                          redondeo2Decimales(iTVen.ventaPEN.$numberDecimal ? iTVen.ventaPEN.$numberDecimal : iTVen.ventaPEN);
                        subTOTAL = redondeo2Decimales((sumaTOTAL * 100) / (100 + venta.igv));
                        igvTOTAL = redondeo2Decimales(sumaTOTAL - subTOTAL);
                      }

                      if (index + 1 === venta.itemsVenta.length) {
                        console.log(subTOTAL);
                        console.log(igvTOTAL);
                        console.log(sumaTOTAL);
                        fijarMontos({ subTOTAL, igvTOTAL, sumaTOTAL });
                      }
                      // sumaItems = sumaItems + index;
                      return (
                        <tr key={iTVen.idAuxiliar}>
                          <td key={iTVen.idAuxiliar}>{`${cerosALaIzquierda(indexItemVenta, 3)}`}</td>
                          <td>{iTVen.codigo}</td>
                          <td>{iTVen.descripcionEquivalencia}</td>
                          <td style={{ textAlign: 'end' }}>
                            <input
                              style={{ width: '60px', textAlign: 'end' }}
                              value={iTVen.cantidad.$numberDecimal ? iTVen.cantidad.$numberDecimal : iTVen.cantidad}
                              onChange$={(e) => {
                                // const iv = itemsVentaK[index];
                                iTVen.cantidad = parseFloat((e.target as HTMLInputElement).value);
                                if (venta.enDolares) {
                                  iTVen.ventaUSD = iTVen.cantidad * iTVen.precioUSD;
                                  iTVen.ventaPEN = iTVen.cantidad * iTVen.precioPEN;
                                } else {
                                  iTVen.ventaPEN =
                                    (iTVen.cantidad ? iTVen.cantidad : iTVen.cantidad.$numberDecimal) *
                                    (iTVen.precioPEN ? iTVen.precioPEN : iTVen.precioPEN.$numberDecimal);
                                }
                              }}
                              // onChange={(e) => {
                              //   const iv = itemsVentaK[index];
                              //   iv['cantidad'] = Number.parseFloat(e.target.value);
                              //   if (venta.enDolares) {
                              //     console.log('TablaItemsVenta enDolares cantidad');
                              //     iv['ventaUSD'] = iv['cantidad'] * iv['precioUSD'];
                              //     iv['ventaPEN'] = iv['cantidad'] * iv['precioPEN'];
                              //   } else {
                              //     console.log('TablaItemsVenta enPEN cantidad');
                              //     iv['ventaPEN'] = iv['cantidad'] * iv['precioPEN'];
                              //   }
                              //   setItemsVentaK([
                              //     ...itemsVentaK.slice(0, index),
                              //     iv,
                              //     ...itemsVentaK.slice(index + 1, itemsVentaK.length),
                              //   ]);
                              // }}
                            />
                          </td>
                          <td>{iTVen.unidadEquivalencia}</td>
                          <td style={{ textAlign: 'end' }}>
                            <input
                              style={{ width: '60px', textAlign: 'end' }}
                              value={
                                venta.enDolares
                                  ? iTVen.precioUSD.$numberDecimal
                                    ? iTVen.precioUSD.$numberDecimal
                                    : iTVen.precioUSD
                                  : iTVen.precioPEN.$numberDecimal
                                  ? iTVen.precioPEN.$numberDecimal
                                  : iTVen.precioPEN
                              }
                              onChange$={(e) => {
                                // const iv = itemsVentaK[index];
                                const precio = parseFloat((e.target as HTMLInputElement).value);
                                console.log('el precio modificado', precio);
                                if (venta.enDolares) {
                                  iTVen.precioUSD = precio;
                                  iTVen.ventaUSD = iTVen.cantidad * iTVen.precioUSD;
                                  iTVen.ventaPEN = iTVen.cantidad * iTVen.precioPEN;
                                } else {
                                  iTVen.precioPEN = precio;
                                  console.log('el precio modificado, cant', iTVen.precioPEN, iTVen.cantidad);
                                  iTVen.ventaPEN =
                                    (iTVen.cantidad ? iTVen.cantidad : iTVen.cantidad.$numberDecimal) *
                                    (iTVen.precioPEN ? iTVen.precioPEN : iTVen.precioPEN.$numberDecimal);
                                }
                              }}
                              // onChange={(e) => {
                              //   const iv = itemsVentaK[index];

                              //   if (venta.enDolares) {
                              //     console.log('TablaItemsVenta enDolares precioPEN');
                              //     iv['precioUSD'] = e.target.value;
                              //     iv['ventaUSD'] = iv['cantidad'] * iv['precioUSD'];
                              //     iv['ventaPEN'] = iv['cantidad'] * iv['precioPEN'];
                              //   } else {
                              //     console.log('TablaItemsVenta PEN precioPEN');
                              //     iv['precioPEN'] = e.target.value;
                              //     iv['ventaPEN'] = iv['cantidad'] * iv['precioPEN'];
                              //   }
                              //   setItemsVentaK([
                              //     ...itemsVentaK.slice(0, index),
                              //     iv,
                              //     ...itemsVentaK.slice(index + 1, itemsVentaK.length),
                              //   ]);
                              // }}
                            />
                          </td>
                          <td style={{ textAlign: 'end' }}>
                            {/* {iTVen.ventaPEN ? iTVen.ventaPEN : iTVen.ventaPEN.$numberDecimal} */}
                            {venta.enDolares
                              ? iTVen.ventaUSD
                                ? redondeo2Decimales(iTVen.ventaUSD)
                                : redondeo2Decimales(iTVen.ventaUSD.$numberDecimal)
                              : iTVen.ventaPEN
                              ? redondeo2Decimales(iTVen.ventaPEN)
                              : redondeo2Decimales(iTVen.ventaPEN.$numberDecimal)}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <ImgButton
                              src={images.trash}
                              alt="icono de eliminar"
                              height={12}
                              width={12}
                              title="Eliminar ítem"
                              // onClick={() => {
                              //   onBorrar({ indexItem, idAuxiliarItemVenta });
                              // }}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={6} style={{ textAlign: 'end' }}>
                        Sub total
                      </th>
                      <th colSpan={1} style={{ textAlign: 'end' }}>
                        {`${subTOTAL.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan={6} style={{ textAlign: 'end' }}>
                        IGV
                      </th>
                      <th colSpan={1} style={{ textAlign: 'end' }}>
                        {`${igvTOTAL.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </th>
                    </tr>
                    <tr>
                      <th colSpan={6} style={{ textAlign: 'end' }}>
                        Total
                      </th>
                      <th colSpan={1} style={{ textAlign: 'end' }}>
                        {`${sumaTOTAL.toLocaleString('en-PE', {
                          style: 'currency',
                          currency: 'PEN',
                          minimumFractionDigits: 2,
                        })}`}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              ) : (
                <i style={{ fontSize: '0.7rem' }}>No existen ítems para la venta</i>
              )}
            </div>
          }
        </div>
        {/* GRABAR   onClick={(e) => onSubmit(e)}*/}
        <input
          type="submit"
          value={botonGrabar.value === '' ? 'Grabar' : `${botonGrabar.value}`}
          class="btn-centro"
          onClick$={() => grabando()}
          // onClick={(e) => onSubmit(e)}
        />
        {/* <button type="submit" class="btn-centro" onClick$={() => addVenta()}>
          La Grabar
        </button>{' '} */}
      </div>
      {/* </Form> */}
    </div>
  );
});

// export const TablaCuotasCreditoVenta = component$((props: { registros: any }) => {
//   return (
//     <table style={{ fontSize: '0.7em', fontWeight: 'lighter', margin: '5px 0' }}>
//       <thead>
//         <tr>
//           <th>Nro. Cuota</th>
//           <th>Fecha</th>
//           <th>Importe</th>
//           <th>Acciones</th>
//         </tr>
//       </thead>
//       <tbody>
//         {props.registros.map((value: any, index: any) => {
//           //   const { idAuxiliar, fechaCuota, importeCuotaPEN } = cuota;
//           const indexItem = index + 1;
//           // sumaCuotas.value = sumaCuotas.value + redondeo2Decimales(cuota.importeCuotaPEN);
//           // sumaCuotas = sumaCuotas + redondeo2Decimales(value.importeCuotaPEN);

//           //   importeTotal(sumaCuotas);
//           // Cuota{}
//           return (
//             <tr key={value.idAuxiliar}>
//               <td key={value.idAuxiliar}>{`${cerosALaIzquierda(indexItem, 3)}`}</td>
//               <td>{formatoDDMMYYYY_PEN(value.fechaCuota)}</td>
//               <td style={{ textAlign: 'end' }}>
//                 {/* {cuota.importeCuotaPEN} */}
//                 {`${value.importeCuotaPEN.toLocaleString('en-PE', {
//                   // style: 'currency',
//                   currency: 'PEN',
//                   minimumFractionDigits: 2,
//                 })}`}
//               </td>
//               <td style={{ textAlign: 'center' }}>
//                 <ImgButton
//                   src={images.edit}
//                   alt="icono de editar"
//                   height={12}
//                   width={12}
//                   title="Editar ítem"
//                   //   onClick={() => {
//                   //     mostrarEdit({
//                   //       idAuxiliar,
//                   //       fechaCuota,
//                   //       importeCuotaPEN,
//                   //     });
//                   //   }}
//                 />
//                 <ImgButton
//                   src={images.trash}
//                   alt="icono de eliminar"
//                   height={12}
//                   width={12}
//                   title="Eliminar ítem"
//                   //   onClick={() => {
//                   //     onDel(idAuxiliar);
//                   //   }}
//                 />
//               </td>
//             </tr>
//           );
//         })}
//       </tbody>
//       <tfoot>
//         <tr>
//           <th colSpan={2} style={{ textAlign: 'end' }}>
//             Suma Cuotas
//           </th>
//           <th colSpan={1} style={{ textAlign: 'end' }}>
//             {/* {`${sumaCuotas.toLocaleString('en-PE', {
//               style: 'currency',
//               currency: 'PEN',
//               minimumFractionDigits: 2,
//             })}`} */}
//           </th>
//           <th>
//             <button
//               onClick$={() => {
//                 console.log('props.registros', props.registros);
//                 // console.log('ctx_add_venta_tabla.cuotasCredito', venta.cuotasCredito);
//               }}
//             >
//               ver ctx
//             </button>
//           </th>
//         </tr>
//       </tfoot>
//     </table>
//   );
// });
