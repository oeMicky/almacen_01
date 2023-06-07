import { $, component$, useContext, useStore } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_DOCS_VENTA } from '~/routes/(almacen)/factura';
import { CTX_F_B_NC_ND, IItemVenta } from '../venta/addVenta';
import { elIdAuxiliar } from '~/functions/comunes';

interface IEquivalencia {
  _id: string;
  idAuxiliar: number;
  descripcionEquivalencia: string;
  laEquivalencia: any;
  idUnidadEquivalencia: string;
  unidadEquivalencia: string;
  pesoKg: number;
}
interface IInEquivalencia {
  descripcionEquivalencia: string;
  cantidad: number;
  unidadEquivalencia: string;
  laEquivalencia: any;
  precioEquivalente: any;
}

export default component$((props: { ancho: number; itemSeleccionado: any; esAlmacen: boolean; item2: IItemVenta }) => {
  const ctx_docs_venta = useContext(CTX_DOCS_VENTA);
  const ctx_f_b_nc_nd = useContext(CTX_F_B_NC_ND);

  // const descripEqui = useSignal('');
  // const cantid = useSignal(1);

  // let ter: IItemVenta;

  const parametrosInEquivalencia = useStore<IInEquivalencia>({
    descripcionEquivalencia: '',
    cantidad: 1,
    unidadEquivalencia: '',
    laEquivalencia: 0,
    precioEquivalente: 0,
  });
  // const dataUniEqui = useSignal([]);
  console.log('props.itemSeleccionado props.itemSeleccionado props.itemSeleccionado', props.itemSeleccionado);
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
            ctx_docs_venta.mostrarSeleccionarEquivalenciaEnSalida = false;
          })}
        />
        {/* <ImgButton
          src={images.print}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          itemSeleccionado
          onClick={() => {
            console.log(itemSeleccionado.kardex[0]._id);
          }}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          itemSeleccionado
          onClick={() => {
            console.log(itemSeleccionado);
          }}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          itemSeleccionado
          onClick={() => {
            console.log(datosExtraidos);
          }}
        /> */}
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* MERCADERIA */}
        <div style={{ fontSize: '0.7rem' }}>
          <div>Código:{` ${props.itemSeleccionado.codigo}`}</div>
          <div>Descripción:{` ${props.itemSeleccionado.descripcion}`}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div>
              Stock:
              <strong style={{ color: 'green' }}>
                {props.itemSeleccionado.totalCantidadSaldo != null
                  ? ` ${
                      props.itemSeleccionado.totalCantidadSaldo.$numberDecimal
                        ? props.itemSeleccionado.totalCantidadSaldo.$numberDecimal
                        : props.itemSeleccionado.totalCantidadSaldo
                    }`
                  : ``}{' '}
                {props.itemSeleccionado.unidad != null ? ` ${props.itemSeleccionado.unidad}` : ``}
              </strong>
            </div>
            {props.esAlmacen ? (
              <div>
                Costo (PEN):{' '}
                <b>
                  {props.itemSeleccionado.costoUnitarioMovil != null
                    ? props.itemSeleccionado.costoUnitarioMovil.$numberDecimal
                      ? props.itemSeleccionado.costoUnitarioMovil.$numberDecimal
                      : props.itemSeleccionado.costoUnitarioMovil
                    : ''}
                </b>
              </div>
            ) : (
              <div>
                Precio (PEN):{' '}
                <b>
                  {props.itemSeleccionado.precio != null
                    ? props.itemSeleccionado.precio.$numberDecimal
                      ? props.itemSeleccionado.precio.$numberDecimal
                      : props.itemSeleccionado.precio
                    : ''}
                </b>
              </div>
            )}
          </div>
        </div>
        <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr>
        {/* ------------------------------------------------------------------------------ */}
        {/* EQUIVALENCIA */}
        <div style={{ fontSize: '0.7rem' }}>
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
                value={parametrosInEquivalencia.descripcionEquivalencia}
                // onChange={(e) => setDescripcionEquivalente(e.currentTarget.value)}
                onInput$={(e) => {
                  parametrosInEquivalencia.descripcionEquivalencia = (e.target as HTMLInputElement).value;
                }}
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
                value={parametrosInEquivalencia.cantidad}
                // onChange={(e) => setCantidad(e.target.value)}
                onInput$={(e) => {
                  parametrosInEquivalencia.cantidad = parseFloat((e.target as HTMLInputElement).value);
                }}
                onFocusin$={(e) => {
                  (e.target as HTMLInputElement).select();
                }}
                // onKeyDown$={(e) => {
                //   // const tecla = e.key ? e.key : e.which;
                //   const tecla = (e.target as HTMLInputElement).onkeydown;
                //   console.log(tecla);
                // }}
                onKeyUp$={(e) => {
                  // console.log(e);
                  if (e.key === 'Enter') {
                    document.getElementById('inputPrecioEquivalente')?.focus();
                  }
                }}
              />
              <select
                // value={parametrosInEquivalencia.unidadEquivalencia}
                id="selectUniEquivalencia"
                style={{ width: '100%' }}
                onChange$={(e) => {
                  const idx = (e.target as HTMLSelectElement).selectedIndex;
                  const rere = e.target as HTMLSelectElement;
                  const elOption = rere[idx];
                  console.log('elOption', elOption);
                  console.log('elOption id', elOption.id);

                  // idSerieDocumento.value = elOption.id;
                  // parametrosInEquivalencia.descripcionEquivalente = (e.target as HTMLSelectElement).attributes;
                  //
                  const lasEquivalencias: Array<IEquivalencia> = props.itemSeleccionado.equivalencias;
                  console.log('lasEquivalencias', lasEquivalencias);
                  const encontrado = lasEquivalencias.find(({ idUnidadEquivalencia }) => idUnidadEquivalencia === elOption.id);
                  console.log('encontrado', encontrado);
                  parametrosInEquivalencia.descripcionEquivalencia = encontrado?.descripcionEquivalencia
                    ? encontrado?.descripcionEquivalencia
                    : '';
                  parametrosInEquivalencia.laEquivalencia = encontrado?.laEquivalencia ? encontrado?.laEquivalencia : null;
                  console.log(
                    'parametrosInEquivalencia.laEquivalencia:::',
                    parseFloat(parametrosInEquivalencia.laEquivalencia.$numberDecimal) * 35
                  );
                  // props.itemSeleccionado.equivalencias.unidadEquivalencia = (e.target as HTMLSelectElement).value;
                  parametrosInEquivalencia.unidadEquivalencia = (e.target as HTMLSelectElement).value;
                  // document.getElementById('inputCantidad')?.focus();
                  const inpa = document.getElementById('inputCantidad');
                  inpa?.focus();
                  // inpa?.select();
                }}
              >
                <option value="">-- Seleccione una opción --</option>
                {props.itemSeleccionado.equivalencias.map((equi: any) => {
                  return (
                    <option
                      id={equi.idUnidadEquivalencia}
                      value={equi.unidadEquivalencia}
                      selected={parametrosInEquivalencia.unidadEquivalencia === equi.unidadEquivalencia}
                    >
                      {equi.unidadEquivalencia}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr>
          {/* ------------------------------------------------------------------------------ */}
          {/* la equivalencia */}
          {parametrosInEquivalencia.laEquivalencia !== null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginBottom: '5px', fontSize: '0.7rem' }}>
              <div>
                Stock equivalente:
                <strong style={{ color: 'green' }}>
                  {parametrosInEquivalencia.unidadEquivalencia !== ''
                    ? //  props.itemSeleccionado.totalCantidadSaldo !== 'undefined'
                      ` ${
                        props.itemSeleccionado.totalCantidadSaldo.$numberDecimal
                          ? props.itemSeleccionado.totalCantidadSaldo.$numberDecimal *
                            parametrosInEquivalencia.laEquivalencia.$numberDecimal
                          : props.itemSeleccionado.totalCantidadSaldo * parametrosInEquivalencia.laEquivalencia.$numberDecimal
                      }`
                    : ``}{' '}
                  {parametrosInEquivalencia.unidadEquivalencia !== '' ? ` ${parametrosInEquivalencia.unidadEquivalencia}` : ``}
                </strong>
              </div>
              {props.esAlmacen ? (
                <div>Costo equiv. (PEN): {props.itemSeleccionado.costoUnitarioMovil.$numberDecimal}</div>
              ) : (
                <div>
                  Precio equiv. (PEN):{' '}
                  <input
                    id="inputPrecioEquivalente"
                    style={{ width: '80px', textAlign: 'end' }}
                    value={parametrosInEquivalencia.precioEquivalente}
                    // onChange={(e) => setPrecioEquivalente(e.target.value)}
                    onInput$={(e) => {
                      parametrosInEquivalencia.precioEquivalente = parseFloat((e.target as HTMLInputElement).value);
                    }}
                    onFocusin$={(e) => {
                      (e.target as HTMLInputElement).select();
                    }}
                    onKeyUp$={(e) => {
                      // console.log(e);
                      if (e.key === 'Enter') {
                        document.getElementById('btnGrabarEquivalencia')?.focus();
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
        {/* GRABAR  onClick={(e) => onSubmit(e)}*/}
        <input
          id="btnGrabarEquivalencia"
          type="button"
          value="Grabar "
          class="btn-centro"
          onClick$={() => {
            ctx_f_b_nc_nd.itemsVenta.push({
              idAuxiliar: parseInt(elIdAuxiliar()),
              item: 0,
              codigo: props.itemSeleccionado.codigo,
              descripcionEquivalencia: parametrosInEquivalencia.descripcionEquivalencia, // 'V_ZZZZZZZZZZZZZZZ 10 UNIDADES',
              cantidad: parametrosInEquivalencia.cantidad,
              unidadEquivalencia: parametrosInEquivalencia.unidadEquivalencia,
              costo: 0,
              precioPEN: parametrosInEquivalencia.precioEquivalente,
              ventaPEN: parametrosInEquivalencia.cantidad * parametrosInEquivalencia.precioEquivalente,
              precioUSD: 0,
              ventaUSD: 0,
            });
            console.log('🚕🚕🚕🚕 ctx_Add_Venta', ctx_f_b_nc_nd.itemsVenta);
          }}
        />
      </div>
    </div>
  );
});
