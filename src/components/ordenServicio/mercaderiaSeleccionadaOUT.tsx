import { $, component$, useContext, useSignal, useStore } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import ElSelect from '../system/elSelect';
import { CTX_DOCS_ORDEN_SERVICIO } from '~/routes/(almacen)/ordenServicio';
import { CTX_O_S } from './newEditOrdenServicio';
import { elIdAuxiliar } from '~/functions/comunes';
import { IMercaEquivalenciaOUT } from '~/interfaces/iMercaderia';

export default component$((props: { mercaderiaSeleccionadaOUT: any; esAlmacen: boolean }) => {
  //#region CONTEXTOS
  const ctx_docs_orden_servicio = useContext(CTX_DOCS_ORDEN_SERVICIO);
  const ctx_o_s = useContext(CTX_O_S);
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const cantidad = useSignal(1);
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
    <div style={{ width: 'auto', border: '1px solid red', padding: '2px' }} class="container-modal">
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
            ctx_docs_orden_servicio.mostrarPanelMercaderiaSeleccionadaOUT = false;
          })}
          // onClick={onCerrar}
        />
        <ImgButton
          src={images.print}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('mercaderiaSeleccionadaOUT', props.mercaderiaSeleccionadaOUT);
          })}
          // itemSeleccionado
          // onClick={() => {
          //   console.log(itemSeleccionado.kardex[0]._id);
          // }}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('mercaderiaSeleccionadaOUT equivalencias', props.mercaderiaSeleccionadaOUT.equivalencias);
          })}
          // itemSeleccionado
          // onClick={() => {
          //   console.log(itemSeleccionado.kardex[0]._id);
          // }}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* MERCADERIA */}
        <div style={{ fontSize: 'small', fontWeight: 'lighter' }}>
          <div>Código:{` ${props.mercaderiaSeleccionadaOUT.codigo}`}</div>
          <div>Descripción:{` ${props.mercaderiaSeleccionadaOUT.descripcion}`}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              Stock:
              <strong style={{ color: 'green' }}>
                {props.mercaderiaSeleccionadaOUT.totalCantidadSaldo !== null
                  ? ` ${
                      props.mercaderiaSeleccionadaOUT.totalCantidadSaldo.$numberDecimal
                        ? props.mercaderiaSeleccionadaOUT.totalCantidadSaldo.$numberDecimal
                        : props.mercaderiaSeleccionadaOUT.totalCantidadSaldo
                    }`
                  : ``}{' '}
                {props.mercaderiaSeleccionadaOUT.unidad !== null ? ` ${props.mercaderiaSeleccionadaOUT.unidad}` : ``}
              </strong>
            </div>
            {props.esAlmacen ? (
              <div>
                Costo (PEN):
                <b>
                  {
                    //props.mercaderiaSeleccionadaOUT.costoUnitarioMovil !== null
                    typeof props.mercaderiaSeleccionadaOUT.costoUnitarioMovil !== 'undefined'
                      ? props.mercaderiaSeleccionadaOUT.costoUnitarioMovil.$numberDecimal
                        ? props.mercaderiaSeleccionadaOUT.costoUnitarioMovil.$numberDecimal
                        : props.mercaderiaSeleccionadaOUT.costoUnitarioMovil
                      : ''
                  }
                </b>
              </div>
            ) : (
              <div>
                Precio (PEN):
                <b>
                  {
                    //props.mercaderiaSeleccionadaOUT.precio !== null
                    typeof props.mercaderiaSeleccionadaOUT.precio !== 'undefined'
                      ? props.mercaderiaSeleccionadaOUT.precio.$numberDecimal
                        ? props.mercaderiaSeleccionadaOUT.precio.$numberDecimal
                        : props.mercaderiaSeleccionadaOUT.precio
                      : ''
                  }
                </b>
              </div>
            )}
          </div>
        </div>
        <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr>
        {/* ------------------------------------------------------------------------------ */}
        {/* EQUIVALENCIA */}
        <div style={{ fontSize: 'small', fontWeight: 'lighter' }}>
          {/* descripcion EQUIVALENCIA */}
          <div class="form-control">
            <label>Descripción</label>
            <div class="form-control form-agrupado">
              <input
                id="inputDescripcionEquivalencia"
                style={{ width: '100%' }}
                type="text"
                disabled={props.esAlmacen}
                placeholder="Add descripción equivalencia"
                value={equivalencia.descripcionEquivalencia}
                // value={descripcionEquivalente}
                // onChange={(e) => setDescripcionEquivalente(e.currentTarget.value)}
              />
            </div>
          </div>
          {/* cantidad */}
          <div class="form-control">
            <label>Cantidad</label>
            <div class="form-control form-agrupado">
              <input
                id="inputCantidad"
                style={{ width: '100%', textAlign: 'end', marginRight: '2px' }}
                type="text"
                placeholder="Add cantidad"
                value={cantidad.value}
                // onChange={(e) => setCantidad(e.target.value)}
              />
              <ElSelect
                id={'selectUniEquivalencia'}
                // elValor={props.mercaderiaSeleccionadaOUT.equivalencias.unidadEquivalencia}
                registros={props.mercaderiaSeleccionadaOUT.equivalencias}
                registroID={'idUnidadEquivalencia'}
                registroTEXT={'unidadEquivalencia'}
                // registroDESCRIPCIONEQUIVALENCIA={'descripcionEquivalencia'}
                // onChange={changeUnidadEquivalencia}
                onChange={$(() => {
                  const elSelec = document.getElementById('selectUniEquivalencia') as HTMLSelectElement;
                  const elIdx = elSelec.selectedIndex;
                  console.log('ElSelect', elSelec, elIdx, elSelec[elIdx].id);
                  // equivalencia._id = elSelec[elIdx].id;
                  //?._id = elSelec[elIdx].id;
                  // definicion_CTX_O_S.idTecnico = elSelec[elIdx].id;
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
                    // definicion_CTX_O_S.razonSocialNombreTecnico = '';
                  } else {
                    const lencias = props.mercaderiaSeleccionadaOUT.equivalencias;
                    const laEqui = lencias.find(({ idUnidadEquivalencia }: any) => idUnidadEquivalencia === elSelec[elIdx].id);
                    console.log('laEqui', laEqui);
                    equivalencia._id = laEqui._id;
                    // equivalencia.idAuxiliar = 0;
                    equivalencia.descripcionEquivalencia = laEqui.descripcionEquivalencia;
                    equivalencia.laEquivalencia = laEqui.laEquivalencia;
                    equivalencia.idUnidadEquivalencia = laEqui.idUnidadEquivalencia;
                    equivalencia.unidadEquivalencia = laEqui.unidadEquivalencia;
                    equivalencia.pesoKg = laEqui.pesoKg;
                    equivalencia.factor = laEqui.factor;
                    equivalencia.tipoEquivalencia = laEqui.tipoEquivalencia;
                    // definicion_CTX_O_S.razonSocialNombreTecnico = elSelec.value;
                    if (typeof props.mercaderiaSeleccionadaOUT.precio !== 'undefined') {
                      precioEquivalente.value =
                        props.mercaderiaSeleccionadaOUT.precio.$numberDecimal * laEqui.laEquivalencia.$numberDecimal;
                    }
                  }
                })}
              />
            </div>
          </div>
          <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr>
          {/* ------------------------------------------------------------------------------ */}
          {/* la equivalencia */}
          {equivalencia.laEquivalencia !== null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '5px' }}>
              <div>
                Stock equivalente:
                <strong style={{ color: 'green' }}>
                  {equivalencia.idUnidadEquivalencia !== ''
                    ? //props.mercaderiaSeleccionadaOUT.totalCantidadSaldo !== null
                      // typeof props.mercaderiaSeleccionadaOUT.totalCantidadSaldo !== 'undefined'
                      ` ${
                        props.mercaderiaSeleccionadaOUT.totalCantidadSaldo.$numberDecimal
                          ? props.mercaderiaSeleccionadaOUT.totalCantidadSaldo.$numberDecimal *
                            equivalencia.laEquivalencia.$numberDecimal
                          : props.mercaderiaSeleccionadaOUT.totalCantidadSaldo * equivalencia.laEquivalencia.$numberDecimal
                      }`
                    : ``}
                  {equivalencia.unidadEquivalencia !== null ? ` ${equivalencia.unidadEquivalencia}` : ``}
                </strong>
              </div>
              {props.esAlmacen ? (
                <div>Costo equiv. (PEN): {props.mercaderiaSeleccionadaOUT.costoUnitarioMovil.$numberDecimal}</div>
              ) : (
                <div>
                  Precio equiv. (PEN):{' '}
                  <input
                    id="inputPrecioEquivalente"
                    style={{ width: '80px', textAlign: 'end' }}
                    value={precioEquivalente.value}
                    // onChange={(e) => setPrecioEquivalente(e.target.value)}
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
          type="button"
          value="Grabar "
          class="btn-centro"
          // onClick={(e) => onSubmit(e)}
          onClick$={() => {
            if (equivalencia.idUnidadEquivalencia !== '') {
              alert('Seleccionar la equivalencia');
              document.getElementById('selectUniEquivalencia')?.focus();
              return;
            }
            ctx_o_s.requisiciones.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              item: 0,
              codigo: props.mercaderiaSeleccionadaOUT.codigo ? props.mercaderiaSeleccionadaOUT.codigo : '_',
              descripcionEquivalencia: equivalencia.descripcionEquivalencia, //props.servicioSeleccionado.descripcion, //
              cantidad: cantidad.value,
              unidadEquivalencia: equivalencia.unidadEquivalencia,
              costo: 0,
              precioPEN: precioEquivalente.value,
              ventaPEN: cantidad.value * precioEquivalente.value,
              precioUSD: 0,
              ventaUSD: 0,
            });
            ctx_docs_orden_servicio.mostrarPanelMercaderiaSeleccionadaOUT = false;
            // console.log('🚕🚕🚕🚕 ctx_o_s', ctx_o_s.servicios);
          }}
        />
      </div>
    </div>
  );
});
