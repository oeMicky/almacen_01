import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';

import ElSelect from '~/components/system/elSelect';
import { elIdAuxiliar, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import type { IMercaEquivalenciaOUT } from '~/interfaces/iMercaderia';
import { CTX_COTIZACION } from '~/components/cotizacion/newEditCotizacion';
import { CTX_F_B_NC_ND } from '~/components/venta/addVenta';
import { CTX_O_S } from '~/components/ordenServicio/newEditOrdenServicio';
import { CTX_OUT_ALMACEN } from '~/components/outAlmacen/newOutAlmacen';
import { CTX_BUSCAR_MERCADERIA_OUT } from './buscarMercaderiaOUT';
import { CTX_KARDEXS_OUT } from './kardexsOUT';

export default component$(
  (props: {
    mercaOUTSelecci: any;
    elKardex: any;
    esAlmacen: boolean;
    contexto: string;
    contextoParaDocumento: string;
    porcentaje: any;
  }) => {
    //#region CONTEXTOS
    let ctx: any = [];
    let documento: any = [];
    // let asiVen: any = [];

    switch (props.contextoParaDocumento) {
      case 'orden servicio':
        console.log('contextoParaDocumento::: orden servicio');
        documento = useContext(CTX_O_S).requisiciones;
        break;
      case 'new_venta':
        console.log('contextoParaDocumento::: new_venta');
        documento = useContext(CTX_F_B_NC_ND).itemsVenta;
        // asiVen = useContext(CTX_F_B_NC_ND).asientoContable;
        break;
      case 'new_edit_cotizacion':
        console.log('contextoParaDocumento::: new_edit_cotizacion');
        documento = useContext(CTX_COTIZACION).repuestosLubri;
        break;
      case 'new_out_almacen':
        console.log('contextoParaDocumento::: new_out_almacen');
        documento = useContext(CTX_OUT_ALMACEN).itemsMercaderias;
        break;
    }

    switch (props.contexto) {
      case 'buscar_mercaderia_out':
        console.log('contexto::: buscar_mercaderia_out');
        ctx = useContext(CTX_BUSCAR_MERCADERIA_OUT);
        break;
      case 'kardexs_out':
        console.log('contexto::: kardexs_out');
        ctx = useContext(CTX_KARDEXS_OUT);
        break;
    }
    //#endregion CONTEXTOS

    //#region INICIALIZANDO
    const cantidadSacada = useSignal(1);
    const precioEquivalente = useSignal(0);
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
    //#endregion INICIALIZACION

    return (
      <div
        style={{
          width: 'clamp(330px, 86%, 800px)',
          // width: 'auto',
          border: '1px solid red',
          padding: '2px',
        }}
        class="container-modal"
      >
        {/* BOTONES DEL MARCO */}
        <div style={{ display: 'flex', justifyContent: 'end' }}>
          {/* <Button name="T/C" onClick={tipoCambio} /> */}
          <ImgButton
            src={images.x}
            alt="Icono de cerrar"
            height={16}
            width={16}
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
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="Cerrar el  props.mercaOUTSelecci"
            onClick={$(() => {
              console.log(' props.mercaOUTSelecci', props.mercaOUTSelecci);
              console.log('elKardex', props.elKardex);
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="Cerrar el formulario"
            onClick={$(() => {
              console.log('equivalencia', equivalencia);
            })}
          />
          <ImgButton
            src={images.see}
            alt="Icono de cerrar"
            height={14}
            width={14}
            title="Cerrar el formulario"
            onClick={$(() => {
              console.log('precioEquivalente.value', precioEquivalente.value);
            })}
          />
        </div>
        {/* FORMULARIO */}
        <div class="add-form">
          {/* MERCADERIA  fontWeight: 'lighter' */}
          <div style={{ fontSize: 'small' }}>
            {/* <div>Kardex ID:{` ${props.elKardex._id}`}</div> */}
            <div>Código:{` ${props.mercaOUTSelecci.codigo}`}</div>
            <div>Descripción:{` ${props.mercaOUTSelecci.descripcion}`}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                Lote: <strong>{props.elKardex.lote}</strong>
              </div>
              <div>
                Fecha vencimiento: <strong>{formatoDDMMYYYY_PEN(props.elKardex.fechaVencimiento)}</strong>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
              <div>
                Stock:{' '}
                <strong style={{ color: 'green' }}>
                  {props.elKardex.cantidadSaldo !== null
                    ? ` ${
                        props.elKardex.cantidadSaldo.$numberDecimal
                          ? props.elKardex.cantidadSaldo.$numberDecimal
                          : props.elKardex.cantidadSaldo
                      }`
                    : ``}{' '}
                  {props.mercaOUTSelecci.unidad !== null ? ` ${props.mercaOUTSelecci.unidad}` : ``}
                </strong>
              </div>
              {props.esAlmacen ? (
                <div>
                  Costo Unit.(PEN):{' '}
                  <b>
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
                  Precio (PEN):{' '}
                  <b>
                    {props.mercaOUTSelecci.precioPEN !== null
                      ? //typeof props.mercaOUTSelecci.precioPEN !== 'undefined'
                        props.mercaOUTSelecci.precioPEN.$numberDecimal
                        ? props.mercaOUTSelecci.precioPEN.$numberDecimal
                        : props.mercaOUTSelecci.precioPEN
                      : ''}
                  </b>
                </div>
              )}
            </div>
          </div>
          <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr>
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------*/}
          {/* EQUIVALENCIA */}
          <div style={{ fontSize: 'small', margin: '10px 0', background: 'yellow' }}>
            {/* descripcion EQUIVALENCIA */}
            <div class="form-control">
              <label>Descripción</label>
              <div class="form-control form-agrupado">
                <input
                  id="inputDescripcionEquivalencia"
                  style={{ width: '100%', background: '#ffff80' }}
                  type="text"
                  disabled={props.esAlmacen}
                  placeholder="Add descripción equivalencia"
                  value={equivalencia.descripcionEquivalencia}
                />
              </div>
            </div>
            {/* cantidad */}
            <div class="form-control">
              <label>Cantidad</label>
              <div class="form-control form-agrupado">
                <input
                  id="in_Cantidad_mercaderiaOUTSeleccionada"
                  style={{ width: '100%', textAlign: 'end', marginRight: '2px', background: '#ffff80' }}
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
                      props.esAlmacen
                        ? (document.getElementById('btn_Grabar_mercaderiaOUTSeleccionada') as HTMLInputElement).focus()
                        : (document.getElementById('in_PrecioEquivalente_mercaderiaOUTSeleccionada') as HTMLInputElement).focus();
                    }
                  }}
                />
                <ElSelect
                  id={'selectUniEquivalencia_MICE'}
                  registros={props.mercaOUTSelecci.equivalencias}
                  registroID={'idUnidadEquivalencia'}
                  registroTEXT={'unidadEquivalencia'}
                  seleccione="-- Seleccione equivalencia --"
                  onChange={$(() => {
                    const elSelec = document.getElementById('selectUniEquivalencia_MICE') as HTMLSelectElement;
                    const elIdx = elSelec.selectedIndex;
                    console.log('ElSelect', elSelec, elIdx, elSelec[elIdx].id);
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
                      precioEquivalente.value = 0;
                    } else {
                      const lencias = props.mercaOUTSelecci.equivalencias;
                      const laEqui = lencias.find(({ idUnidadEquivalencia }: any) => idUnidadEquivalencia === elSelec[elIdx].id);
                      console.log('laEqui', laEqui);
                      equivalencia._id = laEqui._id;
                      equivalencia.descripcionEquivalencia = laEqui.descripcionEquivalencia;
                      equivalencia.laEquivalencia = laEqui.laEquivalencia;
                      equivalencia.idUnidadEquivalencia = laEqui.idUnidadEquivalencia;
                      equivalencia.unidadEquivalencia = laEqui.unidadEquivalencia;
                      equivalencia.pesoKg = laEqui.pesoKg;
                      equivalencia.factor = laEqui.factor;
                      equivalencia.tipoEquivalencia = laEqui.tipoEquivalencia;
                      if (typeof props.mercaOUTSelecci.precioPEN !== 'undefined') {
                        console.log(
                          'laEquivalencia - factor - tipoEqui',
                          parseFloat(laEqui.laEquivalencia.$numberDecimal),
                          equivalencia.laEquivalencia,
                          equivalencia.factor,
                          equivalencia.tipoEquivalencia
                        );
                        precioEquivalente.value =
                          // parseFloat(props.mercaOUTSelecci.precioPEN.$numberDecimal) *
                          parseFloat(
                            props.mercaOUTSelecci.precioPEN.$numberDecimal
                              ? props.mercaOUTSelecci.precioPEN.$numberDecimal
                              : props.mercaOUTSelecci.precioPEN
                          ) * parseFloat(laEqui.laEquivalencia.$numberDecimal);
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
            <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr>
            {/* ------------------------------------------------------------------------------ marginBottom: '5px'*/}

            {equivalencia.laEquivalencia !== null ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', margin: '10px 0' }}>
                <div>
                  Stock equivalente:{' '}
                  <strong style={{ color: 'green' }}>
                    {/* {equivalencia.tipoEquivalencia ? ():()} */}
                    {equivalencia.laEquivalencia.$numberDecimal === 0
                      ? ''
                      : equivalencia.idUnidadEquivalencia !== ''
                      ? props.elKardex.cantidadSaldo.$numberDecimal / equivalencia.laEquivalencia.$numberDecimal
                      : ''}
                    {equivalencia.unidadEquivalencia !== null ? ` ${equivalencia.unidadEquivalencia}` : ``}
                  </strong>
                </div>
                {/* {props.mercaOUTSelecci.costoUnitarioMovil.$numberDecimal} */}
                {props.esAlmacen ? (
                  <div>
                    Costo equiv. (PEN):{' '}
                    <strong style={{ color: 'green' }}>
                      {/* {equivalencia.tipoEquivalencia ? ():()} */}
                      {equivalencia.laEquivalencia.$numberDecimal === 0
                        ? ''
                        : equivalencia.idUnidadEquivalencia !== ''
                        ? props.elKardex.costoUnitarioMovil.$numberDecimal * equivalencia.laEquivalencia.$numberDecimal
                        : ''}
                    </strong>
                  </div>
                ) : (
                  <div>
                    Precio equiv. (PEN):{' '}
                    <input
                      id="in_PrecioEquivalente_mercaderiaOUTSeleccionada"
                      type="number"
                      style={{ width: '80px', textAlign: 'end', background: '#ffff80' }}
                      value={precioEquivalente.value}
                      onChange$={(e) => {
                        precioEquivalente.value = parseFloat((e.target as HTMLInputElement).value);
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
          {/* GRABAR */}
          <input
            id="btn_Grabar_mercaderiaOUTSeleccionada"
            type="button"
            value="Grabar"
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
              const unicoAux = parseInt(elIdAuxiliar());
              props.esAlmacen
                ? documento.push({
                    idAuxiliar: unicoAux,
                    idMercaderia: props.mercaOUTSelecci._id,
                    idEquivalencia: equivalencia._id,
                    idKardex: props.elKardex._id,
                    item: 0,
                    tipo: 'MERCADERIA',
                    codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : '_',
                    descripcionEquivalencia: equivalencia.descripcionEquivalencia,
                    cantidadSacada: cantidadSacada.value,
                    unidadEquivalencia: equivalencia.unidadEquivalencia,
                    costoUnitarioPEN:
                      props.elKardex.costoUnitarioMovil.$numberDecimal * equivalencia.laEquivalencia.$numberDecimal,
                    subTotalPEN:
                      cantidadSacada.value *
                      props.elKardex.costoUnitarioMovil.$numberDecimal *
                      equivalencia.laEquivalencia.$numberDecimal,
                    precioUSD: 0,
                    ventaUSD: 0,
                    tipoEquivalencia: equivalencia.tipoEquivalencia,
                    factor: equivalencia.factor,
                    laEquivalencia: equivalencia.laEquivalencia,

                    exonerado: props.mercaOUTSelecci.exonerado,
                    inafecto: props.mercaOUTSelecci.inafecto,
                    sujetoAPercepcion: props.mercaOUTSelecci.sujetoAPercepcion,
                    percepcion: props.mercaOUTSelecci.percepcion,
                  })
                : documento.push({
                    idAuxiliar: unicoAux,
                    idMercaderia: props.mercaOUTSelecci._id,
                    idEquivalencia: equivalencia._id,
                    idKardex: props.elKardex._id,
                    item: 0,
                    tipo: 'MERCADERIA',

                    tipoImpuesto: props.mercaOUTSelecci.tipoImpuesto,
                    tipoAfectacionDelImpuesto: props.mercaOUTSelecci.tipoAfectacionDelImpuesto,
                    porcentaje: props.porcentaje,

                    codigo: props.mercaOUTSelecci.codigo ? props.mercaOUTSelecci.codigo : '_',
                    descripcionEquivalencia: equivalencia.descripcionEquivalencia,
                    cantidad: cantidadSacada.value,
                    unidadEquivalencia: equivalencia.unidadEquivalencia,
                    costoUnitarioPEN:
                      // props.elKardex.costoUnitarioMovil.$numberDecimal * equivalencia.laEquivalencia.$numberDecimal,
                      // parseFloat(props.elKardex.costoUnitarioMovil) * parseFloat(equivalencia.laEquivalencia),
                      parseFloat(props.elKardex.costoUnitarioMovil.$numberDecimal) *
                      parseFloat(equivalencia.laEquivalencia.$numberDecimal),
                    precioPEN: precioEquivalente.value,
                    ventaPEN: cantidadSacada.value * precioEquivalente.value,
                    precioUSD: 0,
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
