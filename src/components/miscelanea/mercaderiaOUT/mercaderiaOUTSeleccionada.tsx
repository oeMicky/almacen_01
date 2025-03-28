import { $, component$, useContext, useSignal, useStore, useTask$ } from '@builder.io/qwik';
// import { $, component$, useContext } from '@builder.io/qwik';
// import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';

import ElSelect from '~/components/system/elSelect';
import { elIdAuxiliar, formatoDDMMYYYY_PEN, redondeo6Decimales } from '~/functions/comunes';
import type { IMercaEquivalenciaOUT } from '~/interfaces/iMercaderia';
import { CTX_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
import { CTX_F_B_NC_ND } from '~/components/venta/addVenta';
import { CTX_O_S } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import { CTX_O_P } from '~/components/ordenProduccion/newEditOrdenProduccion';
import { CTX_NOTA_VENTA } from '~/components/notaVenta/addNotaVenta';

import { CTX_BUSCAR_MERCADERIA_OUT } from './buscarMercaderiaOUT';
import { CTX_KARDEXS_OUT } from './kardexsOUT';
import { parametrosGlobales } from '~/routes/login';
export default component$(
  (props: {
    mercaOUTSelecci: any;
    elKardex: any;
    esAlmacen: boolean;
    esProduccion?: boolean;
    esOrdenServicio?: boolean;
    contexto: string;
    contextoParaDocumento: string;
    porcentaje: any;
  }) => {
    //#region CONTEXTOS
    let ctx: any = [];
    let documento: any = [];

    switch (props.contextoParaDocumento) {
      case 'orden_servicio':
        //console.log('contextoParaDocumento::: orden_servicio');
        documento = useContext(CTX_O_S).requisiciones;
        break;
      case 'orden_produccion':
        //console.log('contextoParaDocumento::: orden_produccion');
        documento = useContext(CTX_O_P).requisiciones;
        break;
      case 'new_venta':
        //console.log('contextoParaDocumento::: new_venta');
        documento = useContext(CTX_F_B_NC_ND).itemsVenta;
        // asiVen = useContext(CTX_F_B_NC_ND).asientoContable;
        break;
      case 'nota_venta':
        //console.log('contextoParaDocumento::: new_venta');
        documento = useContext(CTX_NOTA_VENTA).itemsNotaVenta;
        // asiVen = useContext(CTX_F_B_NC_ND).asientoContable;
        break;
      case 'new_edit_cotizacion':
        //console.log('contextoParaDocumento::: new_edit_cotizacion');
        documento = useContext(CTX_COTIZACION).repuestosLubri;
        break;
      case 'new_out_almacen':
        //console.log('contextoParaDocumento::: new_out_almacen');
        documento = useContext(CTX_OUT_ALMACEN).itemsMercaderias;
        break;
    }

    switch (props.contexto) {
      case 'buscar_mercaderia_out':
        //console.log('contexto::: buscar_mercaderia_out');
        ctx = useContext(CTX_BUSCAR_MERCADERIA_OUT);
        break;
      case 'kardexs_out':
        //console.log('contexto::: kardexs_out');
        ctx = useContext(CTX_KARDEXS_OUT);
        break;
    }
    //#endregion CONTEXTOS

    //#region INICIALIZANDO
    const ini = useSignal(0);
    const cantidadSacada = useSignal(1);
    const precioEquivalencia = useSignal(0);

    const equivalencia = useStore<IMercaEquivalenciaOUT>({
      _id: '',
      idAuxiliar: 0,
      descripcionEquivalencia: '',
      laEquivalencia: 0,
      idUnidadEquivalencia: '',
      unidadEquivalencia: '',
      pesoKg: 0,
      factor: 0,
      tipoEquivalencia: false,
    });

    useTask$(({ track }) => {
      track(() => ini.value);

      if (ini.value === 0) {
        if (props.mercaOUTSelecci.equivalencias.length === 1) {
          //console.log('first 1111111111111111111111');
          //  const lencias = props.mercaOUTSelecci.equivalencias;
          const laEqui = props.mercaOUTSelecci.equivalencias[0];
          //console.log('laEqui', laEqui);
          equivalencia._id = laEqui._id;
          equivalencia.descripcionEquivalencia = laEqui.descripcionEquivalencia;
          equivalencia.laEquivalencia = laEqui.laEquivalencia;
          equivalencia.idUnidadEquivalencia = laEqui.idUnidadEquivalencia;
          equivalencia.unidadEquivalencia = laEqui.unidadEquivalencia;
          equivalencia.pesoKg = laEqui.pesoKg;
          equivalencia.factor = laEqui.factor;
          equivalencia.tipoEquivalencia = laEqui.tipoEquivalencia;
          if (typeof props.mercaOUTSelecci.precioUnitarioPEN !== 'undefined' && props.mercaOUTSelecci.precioUnitarioPEN !== null) {
            //console.log(
            //   'laEquivalencia - factor - tipoEqui',
            //   parseFloat(laEqui.laEquivalencia.$numberDecimal),
            //   equivalencia.laEquivalencia,
            //   equivalencia.factor,
            //   equivalencia.tipoEquivalencia
            // );
            precioEquivalencia.value =
              // parseFloat(props.mercaOUTSelecci.precioUnitarioPEN.$numberDecimal) *
              parseFloat(
                props.mercaOUTSelecci.precioUnitarioPEN.$numberDecimal
                  ? props.mercaOUTSelecci.precioUnitarioPEN.$numberDecimal
                  : props.mercaOUTSelecci.precioUnitarioPEN
              ) * parseFloat(laEqui.laEquivalencia.$numberDecimal);
          }
          (document.getElementById('in_Cantidad_mercaderiaOUTSeleccionada') as HTMLInputElement)?.focus();
        }
      }
    });
    //#endregion INICIALIZACION

    return (
      <div
        style={{
          width: 'clamp(320px, 100%, 512px)',
          // width: 'auto',
          border: '1px solid red',
          padding: '2px',
        }}
        class="container-modal"
      >
        {/* BOTONES DEL MARCO */}
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          {/* <Button name="T/C" onClick={tipoCambio} /> */}
          {/* <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="Cerrar el  props.mercaOUTSelecci"
            onClick={$(() => {
              console.log(' props.mercaOUTSelecci', props.mercaOUTSelecci);
              // //console.log('elKardex', props.elKardex);
            })}
          /> */}
          <ImgButton
            src={images.x}
            alt="Icono de cerrar"
            height={18}
            width={18}
            title="Cerrar el formulario"
            onClick={$(() => {
              if (props.contexto === 'buscar_mercaderia_out') {
                ctx.mostrarPanelMercaderiaOUTSeleccionada = false;
              }
              if (props.contexto === 'kardexs_out') {
                ctx.mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS = false;
              }
            })}
          />

          {/*   <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="Cerrar el formulario"
            onClick={$(() => {
              //console.log('equivalencia', equivalencia);
            })}
          />
         <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="precioEquivalencia.value"
            onClick={$(() => {
              //console.log('precioEquivalencia.value', precioEquivalencia.value);
            })}
          /> */}
        </div>
        {/* TITULO */}
        <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'red' }}>{parametrosGlobales.sucursal}</h3>
        {/* FORMULARIO */}
        <div class="add-form">
          {/* MERCADERIA  fontWeight: 'lighter' */}
          <div style={{ fontSize: 'small' }}>
            {/* <div>Kardex ID:{` ${props.elKardex._id}`}</div> */}
            <div>
              <label style={{ color: '#777' }}>Código:</label>
              <label style={{ color: '#555' }}> {` ${props.mercaOUTSelecci.codigo}`}</label>
            </div>
            <div style={{ margin: '4px 0' }}>
              <label style={{ color: '#777' }}>Descripción:</label>
              <label style={{ color: '#555' }}>{` ${props.mercaOUTSelecci.descripcion}`}</label>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '4px 0' }}>
              <div>
                <label style={{ color: '#777' }}>Lote:</label> <label style={{ color: '#555' }}>{props.elKardex.lote}</label>
              </div>
              <div>
                <label style={{ color: '#777' }}>Fecha vencimiento:</label>{' '}
                <label style={{ color: '#555' }}>{formatoDDMMYYYY_PEN(props.elKardex.fechaVencimiento)}</label>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                <label style={{ color: '#777' }}>Stock:</label>
                <strong style={{ marginLeft: '2px', color: 'green' }}>
                  {props.elKardex.cantidadSaldo !== null
                    ? ` ${
                        props.elKardex.cantidadSaldo.$numberDecimal
                          ? redondeo6Decimales(props.elKardex.cantidadSaldo.$numberDecimal)
                          : redondeo6Decimales(props.elKardex.cantidadSaldo)
                      }`
                    : ``}
                  {props.mercaOUTSelecci.unidad !== null ? ` ${props.mercaOUTSelecci.unidad}` : ``}
                </strong>
              </div>
              {props.esAlmacen || props.esProduccion ? (
                <div>
                  <label style={{ color: '#777' }}>Costo Unit.(PEN):</label>
                  <b style={{ marginLeft: '2px' }}>
                    {
                      //props.mercaderiaSeleccionadaOUT.costoUnitarioMovil !== null
                      typeof props.elKardex.costoUnitarioMovil !== 'undefined'
                        ? props.elKardex.costoUnitarioMovil.$numberDecimal
                          ? props.elKardex.costoUnitarioMovil.$numberDecimal
                          : props.elKardex.costoUnitarioMovil
                        : ''
                    }
                  </b>
                </div>
              ) : (
                <div>
                  <label style={{ color: '#777' }}>Precio (PEN): </label>
                  <label style={{ color: '#555' }}>
                    {props.mercaOUTSelecci.precioUnitarioPEN !== null
                      ? //typeof props.mercaOUTSelecci.precioUnitarioPEN !== 'undefined'
                        props.mercaOUTSelecci.precioUnitarioPEN.$numberDecimal
                        ? props.mercaOUTSelecci.precioUnitarioPEN.$numberDecimal
                        : props.mercaOUTSelecci.precioUnitarioPEN
                      : ''}
                  </label>
                </div>
              )}
            </div>
          </div>
          <br />
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* EQUIVALENCIA */}
          <div style={{ fontSize: 'small', margin: '10px 0', background: '#FFFF4C' }}>
            {/* descripcion EQUIVALENCIA */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="inputDescripcionEquivalencia"
                  style={{ width: '100%', background: '#FFFFCC' }}
                  type="text"
                  disabled={props.esAlmacen}
                  placeholder="Add descripción equivalencia"
                  value={equivalencia.descripcionEquivalencia}
                />
              </div>
            </div>
            {/* cantidad */}
            <div class="form-control">
              <div class="form-control form-agrupado">
                <input
                  id="in_Cantidad_mercaderiaOUTSeleccionada"
                  style={{ width: '100%', textAlign: 'end', marginRight: '2px', background: '#FFFFCC' }}
                  type="number"
                  placeholder="Add cantidad"
                  value={cantidadSacada.value}
                  onChange$={(e) => {
                    cantidadSacada.value = parseFloat((e.target as HTMLInputElement).value);
                  }}
                  onFocusin$={(e) => {
                    (e.target as HTMLInputElement).select();
                  }}
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      props.esAlmacen || props.esProduccion
                        ? (document.getElementById('btn_Grabar_mercaderiaOUTSeleccionada') as HTMLInputElement).focus()
                        : (document.getElementById('in_PrecioEquivalente_mercaderiaOUTSeleccionada') as HTMLInputElement).focus();
                    }
                  }}
                />
                <ElSelect
                  id={'selectUniEquivalencia_MICE'}
                  estilos={{ background: '#FFFFCC' }}
                  registros={props.mercaOUTSelecci.equivalencias}
                  valorSeleccionado={equivalencia.unidadEquivalencia}
                  registroID={'idUnidadEquivalencia'}
                  registroTEXT={'unidadEquivalencia'}
                  seleccione="-- Seleccione equivalencia --"
                  onChange={$(() => {
                    const elSelec = document.getElementById('selectUniEquivalencia_MICE') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    //console.log('ElSelect', elSelec, elIdx, elSelec[elIdx].id);
                    if (elSelec[elIdx].id === '') {
                      equivalencia._id = '';
                      equivalencia.idAuxiliar = 0;
                      equivalencia.descripcionEquivalencia = '';
                      equivalencia.laEquivalencia = 0;
                      equivalencia.idUnidadEquivalencia = '';
                      equivalencia.unidadEquivalencia = '';
                      equivalencia.pesoKg = 0;
                      equivalencia.factor = 0;
                      equivalencia.tipoEquivalencia = false;
                      precioEquivalencia.value = 0;
                    } else {
                      const lencias = props.mercaOUTSelecci.equivalencias;
                      const laEqui = lencias.find(({ idUnidadEquivalencia }: any) => idUnidadEquivalencia === elSelec[elIdx].id);
                      //console.log('laEqui', laEqui);
                      //console.log('props.mercaOUTSelecci', props.mercaOUTSelecci);
                      equivalencia._id = laEqui._id;
                      equivalencia.descripcionEquivalencia = laEqui.descripcionEquivalencia;
                      equivalencia.laEquivalencia = laEqui.laEquivalencia;
                      equivalencia.idUnidadEquivalencia = laEqui.idUnidadEquivalencia;
                      equivalencia.unidadEquivalencia = laEqui.unidadEquivalencia;
                      equivalencia.pesoKg = laEqui.pesoKg;
                      equivalencia.factor = laEqui.factor;
                      equivalencia.tipoEquivalencia = laEqui.tipoEquivalencia;
                      //console.log(
                      //   'laEquivalencia - factor - tipoEqui',
                      //   parseFloat(laEqui.laEquivalencia.$numberDecimal),
                      //   equivalencia.laEquivalencia,
                      //   equivalencia.factor,
                      //   equivalencia.tipoEquivalencia
                      // );
                      if (props.esAlmacen || props.esProduccion) {
                        //chequear COSTO
                        // const pCUM =
                        //   props.mercaOUTSelecci.promedioCostoUnitarioMovil.$numberDecimal *
                        //   parseFloat(laEqui.laEquivalencia.$numberDecimal);
                        // const pCUM = props.elKardex.costoUnitarioMovil.$numberDecimal * equivalencia.laEquivalencia.$numberDecimal;
                        //console.log('pCUM', pCUM);
                      } else {
                        //chequear PRECIO
                        if (typeof props.mercaOUTSelecci.precioUnitarioPEN !== 'undefined') {
                          precioEquivalencia.value =
                            // parseFloat(props.mercaOUTSelecci.precioUnitarioPEN.$numberDecimal) *
                            parseFloat(
                              props.mercaOUTSelecci.precioUnitarioPEN.$numberDecimal
                                ? props.mercaOUTSelecci.precioUnitarioPEN.$numberDecimal
                                : props.mercaOUTSelecci.precioUnitarioPEN
                            ) * parseFloat(laEqui.laEquivalencia.$numberDecimal);
                        }
                      }

                      (document.getElementById('in_Cantidad_mercaderiaOUTSeleccionada') as HTMLInputElement).focus();
                    }
                  })}
                  onKeyPress={$((e: any) => {
                    if (e.key === 'Enter') {
                      //  props.esAlmacen
                      //    ? (document.getElementById('btn_Grabar_mercaderiaOUTSeleccionada') as HTMLInputElement).focus()
                      //    : (document.getElementById('in_PrecioEquivalente_mercaderiaOUTSeleccionada') as HTMLInputElement).focus();
                    }
                  })}
                />
              </div>
            </div>

            {/* ------------------------------------------------------------------------------ marginBottom: '5px'*/}

            {equivalencia.laEquivalencia !== null ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '10px 0' }}>
                <div>
                  Stock equivalente:
                  <strong style={{ marginLeft: '2px', color: 'green' }}>
                    {equivalencia.laEquivalencia.$numberDecimal === 0
                      ? ''
                      : equivalencia.idUnidadEquivalencia !== ''
                      ? redondeo6Decimales(props.elKardex.cantidadSaldo.$numberDecimal / equivalencia.laEquivalencia.$numberDecimal)
                      : ''}
                    {equivalencia.unidadEquivalencia !== null ? ` ${equivalencia.unidadEquivalencia}` : ``}
                  </strong>
                </div>
                {props.esAlmacen || props.esProduccion ? (
                  <div>
                    Costo equiv. (PEN):
                    <strong style={{ marginLeft: '2px', color: 'green' }}>
                      {equivalencia.laEquivalencia.$numberDecimal === 0
                        ? ''
                        : equivalencia.idUnidadEquivalencia !== ''
                        ? redondeo6Decimales(props.elKardex.costoUnitarioMovil.$numberDecimal * equivalencia.laEquivalencia.$numberDecimal)
                        : ''}
                    </strong>
                  </div>
                ) : (
                  <div>
                    Precio equiv. (PEN):
                    <input
                      id="in_PrecioEquivalente_mercaderiaOUTSeleccionada"
                      type="number"
                      style={{ marginLeft: '2px', width: '80px', textAlign: 'end', background: '#FFFFCC' }}
                      value={precioEquivalencia.value}
                      onChange$={(e) => {
                        precioEquivalencia.value = parseFloat((e.target as HTMLInputElement).value);
                      }}
                      onFocusin$={(e) => {
                        (e.target as HTMLInputElement).select();
                      }}
                      onKeyPress$={(e) => {
                        if (e.key === 'Enter') {
                          (document.getElementById('btn_Grabar_mercaderiaOUTSeleccionada') as HTMLInputElement).focus();
                        }
                      }}
                    />
                  </div>
                )}
              </div>
            ) : (
              ''
            )}
          </div>
          <br />
          {/* GRABAR */}
          <input
            id="btn_Grabar_mercaderiaOUTSeleccionada"
            type="button"
            value="Adjuntar SALIDA"
            style={{ height: '40px' }}
            class="btn-centro"
            onClick$={() => {
              // const tipoImpuesto = ['IGV', 'ISC', 'IVAP', 'exoneradas', 'exportación', 'gratuitas', 'inafecta', 'otrosTributos'];
              // let tipoImpuesto = 'IGV';
              // props.mercaOUTSelecci.exonerado === true ? (tipoImpuesto = 'exoneradas') : '';
              // props.mercaOUTSelecci.inafecto === true ? (tipoImpuesto = 'inafecta') : '';
              if (equivalencia.idUnidadEquivalencia === '') {
                alert('Seleccionar una equivalencia');
                document.getElementById('selectUniEquivalencia_MICE')?.focus();
                return;
              }
              //console.log(props.esAlmacen || props.esProduccion ? '💫💫💫💫💫' : '-----');
              const unicoAux = parseInt(elIdAuxiliar());
              if (props.contextoParaDocumento === 'new_out_almacen') {
                documento.push({
                  idAuxiliar: unicoAux,
                  idMercaderia: props.mercaOUTSelecci._id,
                  idEquivalencia: equivalencia._id,
                  idKardex: props.elKardex._id,
                  item: 0,
                  tipo: 'MERCADERIA',

                  codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : '-',

                  descripcion: props.mercaOUTSelecci.descripcion,
                  descripcionEquivalencia: equivalencia.descripcionEquivalencia,

                  cantidadSacada: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
                  cantidadSacadaEquivalencia: cantidadSacada.value,

                  unidad: props.mercaOUTSelecci.unidad,
                  unidadEquivalencia: equivalencia.unidadEquivalencia,

                  costoUnitarioPEN: parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
                  costoUnitarioEquivalenciaPEN:
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) * parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  subPEN: cantidadSacada.value * parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
                  subEquivalenciaPEN:
                    cantidadSacada.value *
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) *
                    parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  precioUnitarioUSD: 0,
                  ventaUSD: 0,

                  tipoEquivalencia: equivalencia.tipoEquivalencia,
                  factor: equivalencia.factor,
                  laEquivalencia: equivalencia.laEquivalencia,

                  exonerado: props.mercaOUTSelecci.exonerado,
                  inafecto: props.mercaOUTSelecci.inafecto,
                  sujetoAPercepcion: props.mercaOUTSelecci.sujetoAPercepcion,
                  percepcion: props.mercaOUTSelecci.percepcion,
                });
              }
              let tPVU = '';
              if (
                props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '10' ||
                props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '11' ||
                props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '12' ||
                props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '13' ||
                props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '14' ||
                props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '15' ||
                props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '16' ||
                props.mercaOUTSelecci.tipoAfectacionDelImpuesto === '17'
              ) {
                tPVU = '01';
              } else {
                tPVU = '02';
              }
              console.log('👔👔👔👔👔👔👔', props.mercaOUTSelecci.tipoImpuesto[1], props.mercaOUTSelecci.tipoImpuesto);

              let elTImp;
              if (props.mercaOUTSelecci.tipoImpuesto.length > 1) {
                elTImp = props.mercaOUTSelecci.tipoImpuesto[1];
              } else {
                elTImp = props.mercaOUTSelecci.tipoImpuesto[0];
              }
              console.log('👔👔👔👔👔👔👔', elTImp);
              if (
                props.contextoParaDocumento === 'orden_servicio' ||
                props.contextoParaDocumento === 'new_venta' ||
                props.contextoParaDocumento === 'nota_venta' ||
                props.contextoParaDocumento === 'new_edit_cotizacion'
              ) {
                documento.push({
                  idAuxiliar: unicoAux,
                  idMercaderia: props.mercaOUTSelecci._id,
                  idEquivalencia: equivalencia._id,
                  idKardex: props.elKardex._id,
                  item: 0,
                  tipo: 'MERCADERIA',

                  noFacturar: props.mercaOUTSelecci.noFacturar,

                  tipoImpuesto: elTImp, // props.mercaOUTSelecci.tipoImpuesto[1],
                  tipoAfectacionDelImpuesto: props.mercaOUTSelecci.tipoAfectacionDelImpuesto,
                  porcentaje: parseFloat(props.porcentaje),

                  tipoPrecioVentaUnitario: tPVU,

                  codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : '-',

                  descripcion: props.mercaOUTSelecci.descripcion,
                  descripcionEquivalencia: equivalencia.descripcionEquivalencia,

                  cantidad: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
                  cantidadEquivalencia: cantidadSacada.value,

                  cantidadSacada: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
                  cantidadSacadaEquivalencia: cantidadSacada.value,

                  unidad: props.mercaOUTSelecci.unidad,
                  unidadEquivalencia: equivalencia.unidadEquivalencia,

                  costoUnitarioPEN: parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
                  costoUnitarioEquivalenciaPEN:
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) * parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  porcentajeUtilidad: props.mercaOUTSelecci.porcentajeUtilidad,

                  //precio = c + IGV
                  precioUnitarioPEN: precioEquivalencia.value,
                  //venta = k * precio
                  ventaPEN: cantidadSacada.value * precioEquivalencia.value,

                  precioUnitarioUSD: 0,
                  ventaUSD: 0,
                  tipoEquivalencia: equivalencia.tipoEquivalencia,
                  factor: equivalencia.factor,
                  laEquivalencia: equivalencia.laEquivalencia,

                  exonerado: props.mercaOUTSelecci.exonerado,
                  inafecto: props.mercaOUTSelecci.inafecto,
                  sujetoAPercepcion: props.mercaOUTSelecci.sujetoAPercepcion,
                  percepcion: props.mercaOUTSelecci.percepcion,

                  codigoContableVenta: props.mercaOUTSelecci.codigoContableVenta,
                  descripcionContableVenta: props.mercaOUTSelecci.descripcionContableVenta,
                  tipoContableVenta: props.mercaOUTSelecci.tipoContableVenta,
                });
                console.log(props.contextoParaDocumento);
              }
              if (props.contextoParaDocumento === 'orden_produccion') {
                documento.push({
                  idAuxiliar: unicoAux,
                  idMercaderia: props.mercaOUTSelecci._id,
                  idEquivalencia: equivalencia._id,
                  idKardex: props.elKardex._id,
                  item: 0,
                  tipo: 'MERCADERIA',

                  noFacturar: props.mercaOUTSelecci.noFacturar,

                  tipoImpuesto: elTImp, // props.mercaOUTSelecci.tipoImpuesto,
                  tipoAfectacionDelImpuesto: props.mercaOUTSelecci.tipoAfectacionDelImpuesto,
                  porcentaje: parseFloat(props.porcentaje),

                  tipoPrecioVentaUnitario: tPVU,

                  codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : '-',

                  descripcion: props.mercaOUTSelecci.descripcion,
                  descripcionEquivalencia: equivalencia.descripcionEquivalencia,

                  cantidad: cantidadSacada.value * parseFloat(equivalencia.laEquivalencia.$numberDecimal),
                  cantidadEquivalencia: cantidadSacada.value,

                  unidad: props.mercaOUTSelecci.unidad,
                  unidadEquivalencia: equivalencia.unidadEquivalencia,

                  costoUnitarioPEN: parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal),
                  costoUnitarioEquivalenciaPEN:
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) * parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  costoEquivalenciaPEN:
                    cantidadSacada.value *
                    parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) *
                    parseFloat(equivalencia.laEquivalencia.$numberDecimal),

                  porcentajeUtilidad: props.mercaOUTSelecci.porcentajeUtilidad,

                  precioUnitarioUSD: 0,
                  ventaUSD: 0,
                  tipoEquivalencia: equivalencia.tipoEquivalencia,
                  factor: equivalencia.factor,
                  laEquivalencia: equivalencia.laEquivalencia,

                  exonerado: props.mercaOUTSelecci.exonerado,
                  inafecto: props.mercaOUTSelecci.inafecto,
                  sujetoAPercepcion: props.mercaOUTSelecci.sujetoAPercepcion,
                  percepcion: props.mercaOUTSelecci.percepcion,

                  codigoContableVenta: props.mercaOUTSelecci.codigoContableVenta,
                  descripcionContableVenta: props.mercaOUTSelecci.descripcionContableVenta,
                  tipoContableVenta: props.mercaOUTSelecci.tipoContableVenta,
                });
              }
              // ctx.mostrarPanelMercaderiaOUTSeleccionada = false;
              if (props.contexto === 'buscar_mercaderia_out') {
                ctx.mostrarPanelMercaderiaOUTSeleccionada = false;
              }
              if (props.contexto === 'kardexs_out') {
                ctx.mostrarPanelMercaderiaOUTSeleccionada_DesdeKARDEXS = false;
              }
            }}
          />
        </div>
      </div>
    );
  }
);
