import { $, Resource, component$, useContext, useResource$, useSignal, useStyles$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_KARDEXS } from './kardexs';
import { parametrosGlobales } from '~/routes/login';
import { IMovimientoKARDEX } from '~/interfaces/iKardex';
import { formatear_4Decimales, formatear_6Decimales, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_INDEX_KARDEX } from '~/routes/(almacen)/kardex';
import styles from '../tabla/tabla.css?inline';

export default component$((props: { mercaSelecci: any; kardex: any; contexto: string }) => {
  useStyles$(styles);
  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'index_kardexs':
      console.log('contexto::a: index_kardexs');
      ctx = useContext(CTX_INDEX_KARDEX);
      break;
    case 'kardexs':
      console.log('contexto::a: kardexs');
      ctx = useContext(CTX_KARDEXS);
      break;
  }
  //#endregion CONTEXTOS

  //#region INICIALIZACION
  const ini = useSignal(0);
  //#endregion INICIALIZACION

  //#region BUSCANDO REGISTROS
  const losMovimientos = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
    track(() => ini.value);

    const abortController = new AbortController();
    cleanup(() => abortController.abort('cleanup'));

    // console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/kardex/obtener100Movimientos', {
      // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idKardex: props.kardex._id,
      }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <div
      style={{
        width: 'clamp(386px, 86%, 900px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelKARDEX = false;
          })}
        />
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={16}
          width={16}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('props.mercaSelecci', props.mercaSelecci);
            console.log('props.kardex', props.kardex);
          })}
        />
      </div>
      {/* TITULO */}
      <h2 style={{ marginBottom: '10px', fontSize: '0.9rem' }}>Kardex</h2>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '10px' }}>
          {/* MERCADERIA */}
          <div style={{ fontSize: '0.8em' }}>
            <div style={{ margin: '5px 0' }}>Código:{` ${props.mercaSelecci.codigo} `}</div>
            <div style={{ margin: '5px 0' }}>Descripción:{` ${props.mercaSelecci.descripcion}`}</div>
            <div style={{ margin: '5px 0' }}>Linea/Tipo:{` ${props.mercaSelecci.lineaTipo}`}</div>
            <div style={{ margin: '5px 0' }}>Marca:{` ${props.mercaSelecci.marca}`}</div>
            <div style={{ margin: '5px 0' }}>Unidad:{` ${props.mercaSelecci.unidad}`}</div>
          </div>
        </div>
        {/*  tabla KARDEXS  */}
        <Resource
          value={losMovimientos}
          onPending={() => {
            console.log('onPending 🍉🍉🍉🍉');
            return <div>Cargando...</div>;
          }}
          onRejected={() => {
            console.log('onRejected 🍍🍍🍍🍍');
            return <div>Fallo en la carga de datos</div>;
          }}
          onResolved={(ordenesServicio) => {
            console.log('onResolved 🍓🍓🍓🍓', ordenesServicio);
            const { data } = ordenesServicio; //{ status, data, message }
            const misMovimientos: IMovimientoKARDEX[] = data;
            return (
              <>
                {misMovimientos.length > 0 ? (
                  <>
                    <table style={{ fontSize: '0.7em', fontWeight: 'lighter ' }}>
                      <thead>
                        <tr>
                          <th>FISMA</th>
                          <th>Cnt.Entrada</th>
                          <th>Cnt.Salida</th>
                          <th>Cnt.Saldo</th>
                          <th>Uni</th>
                          <th>Cts.Unita.PEN</th>
                          <th>Cts.Uni.Movil PEN</th>
                          <th>Costo Entrada PEN</th>
                          <th>Costo Salida PEN</th>
                          <th>Costo Saldo PEN</th>
                          {/* <th>Acciones</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {misMovimientos.map((movimiento) => {
                          const {
                            _id,
                            // clave,
                            // tabla,
                            IS,
                            FISMA,
                            // fechaHoraMovimiento,

                            cantidadIngresada,
                            cantidadSacada,
                            cantidadSaldo,
                            costoUnitario,
                            costoUnitarioMovil,
                            costoIngreso,
                            costoSalida,
                            costoSaldo,
                            cantidadOrigen,
                            unidadEquivalencia,
                          } = movimiento;

                          return (
                            <tr key={_id} style={IS ? { color: 'blue' } : { color: 'red' }}>
                              <td data-label="FISMA" class="comoCadena">
                                {formatoDDMMYYYY_PEN(FISMA)}
                              </td>
                              <td
                                data-label="Cnt.Entrada"
                                title={IS ? (cantidadOrigen ? cantidadOrigen.$numberDecimal + ' ' + unidadEquivalencia : '') : ''}
                                class="comoNumero"
                              >
                                {cantidadIngresada.$numberDecimal
                                  ? formatear_4Decimales(cantidadIngresada.$numberDecimal)
                                  : formatear_4Decimales(cantidadIngresada)}
                              </td>
                              <td
                                data-label="Cnt.Salida"
                                title={IS ? '' : cantidadOrigen ? cantidadOrigen.$numberDecimal + ' ' + unidadEquivalencia : ''}
                                class="comoNumero"
                              >
                                {cantidadSacada.$numberDecimal
                                  ? formatear_4Decimales(cantidadSacada.$numberDecimal)
                                  : formatear_4Decimales(cantidadSacada)}
                              </td>
                              <td data-label="Cnt.Saldo" style={{ textAlign: 'right' }}>
                                {cantidadSaldo.$numberDecimal
                                  ? formatear_4Decimales(cantidadSaldo.$numberDecimal)
                                  : formatear_4Decimales(cantidadSaldo)}
                              </td>
                              <td data-label="Uni" class="acciones">
                                {props.mercaSelecci.unidad}
                              </td>
                              <td data-label="Cts.Unita." class="comoNumero">
                                {costoUnitario.$numberDecimal ? costoUnitario.$numberDecimal : costoUnitario}
                              </td>
                              <td data-label="Cts.Unita.Movil" class="comoNumero">
                                {costoUnitarioMovil.$numberDecimal ? costoUnitarioMovil.$numberDecimal : costoUnitarioMovil}
                              </td>
                              <td data-label="Costo Entrada" class="comoNumero">
                                {costoIngreso.$numberDecimal
                                  ? formatear_6Decimales(costoIngreso.$numberDecimal)
                                  : formatear_6Decimales(costoIngreso)}
                              </td>
                              <td data-label="Costo Salida" class="comoNumero">
                                {costoSalida.$numberDecimal
                                  ? formatear_6Decimales(costoSalida.$numberDecimal)
                                  : formatear_6Decimales(costoSalida)}
                              </td>
                              <td data-label="Costo Saldo" class="comoNumero">
                                {costoSaldo.$numberDecimal
                                  ? formatear_6Decimales(costoSaldo.$numberDecimal)
                                  : formatear_6Decimales(costoSaldo)}
                              </td>

                              {/* <td data-label="Acciones" style={{ textAlign: 'right' }}>
                                <ImgButton
                                  src={images.check}
                                  alt="icono de adicionar"
                                  height={12}
                                  width={12}
                                  title="Seleccionar mercadería"
                                  // onClick={$(() => {
                                  //   console.log('mercaINLocali', mercaINLocali);
                                  //   if (mercaINLocali.KARDEXS.length === 0) {
                                  //     ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  //     ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
                                  //     console.log('la mercaSeleccionada IN - length', mercaINLocali.KARDEXS.length);
                                  //   }
                                  //   if (mercaINLocali.KARDEXS.length === 1) {
                                  //     ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  //     ctx_buscar_mercaderia_in.kK = mercaINLocali.KARDEXS[0];
                                  //     ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
                                  //     console.log('la mercaSeleccionada IN DIRECTA', ctx_buscar_mercaderia_in.mM);
                                  //   }
                                  //   if (mercaINLocali.KARDEXS.length > 1) {
                                  //     ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  //     ctx_buscar_mercaderia_in.mostrarPanelKardexsIN = true;
                                  //     console.log('la mercaSeleccionada IN INDIRECTA', ctx_buscar_mercaderia_in.mM);
                                  //   }
                                  // })}
                                />
                                <ImgButton
                                  src={images.edit}
                                  alt="icono de editar"
                                  height={14}
                                  width={14}
                                  title="Editar mercadería"
                                  // onClick={$(() => {
                                  //   ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  //   ctx_buscar_mercaderia_in.mostrarPanelNewEditMercaderiaIN = true;
                                  //   console.log('la merca A Editar IN', ctx_buscar_mercaderia_in.mM);
                                  // })}
                                />
                              </td> */}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <div>
                    <i style={{ fontSize: '0.7rem' }}>No se encontraron registros</i>
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
    </div>
  );
});
