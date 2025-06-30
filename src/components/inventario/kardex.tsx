import { $, component$, createContextId, Resource, useContext, useContextProvider, useResource$, useSignal, useStore, useStyles$ } from '@builder.io/qwik';
import ImgButton from '../system/imgButton'; // useResource$, useSignal,
import { images } from '~/assets';
import { CTX_KARDEXS } from './kardexs';
import { parametrosGlobales } from '~/routes/login';
import type { IMovimientoKARDEX } from '~/interfaces/iKardex';
import { formatear_4Decimales, formatear_6Decimales, formatoDDMMYYYY_PEN } from '~/functions/comunes';
import { CTX_INDEX_INVENTARIO } from '~/routes/(inventario)/inventario';
import styles from '../tabla/tabla.css?inline';
import { getIngresoAAlmacen } from '~/apis/ingresosAAlmacen.api';
import VerInAlmacen from '../inAlmacen/verInAlmacen';
import { CTX_BUSCAR_MERCADERIA_IN } from '../miscelanea/mercaderiaIN/buscarMercaderiaIN';
import { getEgresoDeAlmacen } from '~/apis/egresosDeAlmacen.api';
import VerOutAlmacen from '../outAlmacen/verOutAlmacen';
import { CTX_BUSCAR_MERCADERIA_OUT } from '../miscelanea/mercaderiaOUT/buscarMercaderiaOUT';
import { CTX_INVENTARIO_EXTERNO } from '../miscelanea/inventarioExterno/inventarioExterno';

export const CTX_KARDEX = createContextId<any>('ctx_kardex__');

export default component$((props: { mercaSelecci: any; kardex: any; elIDKardex: string; contexto: string }) => {
  useStyles$(styles);

  //#region DEFINICION CTX_KARDEX
  const definicion_CTX_KARDEX = useStore({
    iNS: [],
    codigoMercaderia: '',
    mostrarPanelVerInAlmacen: false,
    mostrarPanelVerOutAlmacen: false,
    // grabo_InAlmacen: false,
    // itemIndex: 0,

    mostrarSpinner: false,
  });
  useContextProvider(CTX_KARDEX, definicion_CTX_KARDEX);
  //#endregion DEFINICION CTX_KARDEX

  //#region CONTEXTOS
  let ctx: any = [];
  switch (props.contexto) {
    case 'index_inventario':
      //console.log('contexto::a: index_kardexs');
      ctx = useContext(CTX_INDEX_INVENTARIO);
      break;
    case 'kardexs':
      //console.log('contexto::a: kardexs');
      ctx = useContext(CTX_KARDEXS);
      break;
    case 'buscar_mercaderia_IN':
      //console.log('contexto::a: kardexs');
      ctx = useContext(CTX_BUSCAR_MERCADERIA_IN);
      break;
    case 'buscar_mercaderia_out':
      //console.log('contexto::a: kardexs');
      ctx = useContext(CTX_BUSCAR_MERCADERIA_OUT);
      break;
    case 'inventario_externo':
      //console.log('contexto::a: kardexs');
      ctx = useContext(CTX_INVENTARIO_EXTERNO);
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

    // //console.log('parametrosBusqueda', props.parametrosBusqueda);

    const res = await fetch(import.meta.env.VITE_URL + '/api/kardex/obtener100Movimientos', {
      // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idGrupoEmpresarial: parametrosGlobales.idGrupoEmpresarial,
        idEmpresa: parametrosGlobales.idEmpresa,
        idKardex: props.elIDKardex, // props.kardex._id,
      }),
      signal: abortController.signal,
    });
    return res.json();
  });
  //#endregion BUSCANDO REGISTROS

  return (
    <div
      style={{
        width: 'clamp(320px, 100%, 1112px)',
        // width: 'auto',
        border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.see}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            console.log('props.contexto', props.contexto);
            //console.log('props.kardex', props.kardex);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx.mostrarPanelKARDEX = false;
          })}
        />
      </div>
      {definicion_CTX_KARDEX.mostrarPanelVerInAlmacen && (
        <div class="modal">
          {/* <VerInAlmacen indexItem={1} /> */}
          <VerInAlmacen inSelecci={definicion_CTX_KARDEX.iNS} contexto="kardex" indexItem={1} codigoMercaderia={definicion_CTX_KARDEX.codigoMercaderia} />
        </div>
      )}
      {definicion_CTX_KARDEX.mostrarPanelVerOutAlmacen && (
        <div class="modal">
          {/* <VerInAlmacen indexItem={1} /> */}
          <VerOutAlmacen outSelecci={definicion_CTX_KARDEX.iNS} contexto="kardex" indexItem={1} codigoMercaderia={definicion_CTX_KARDEX.codigoMercaderia} />
        </div>
      )}
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'red' }}>{parametrosGlobales.sucursal}</h3>
      <h2 style={{ display: 'grid', gridTemplateColumns: '84px 1fr', marginBottom: '4px', fontSize: '1rem' }}>
        Kardex: <strong>{props.kardex._id}</strong>
      </h2>
      {/* FORMULARIO */}
      <div class="add-form">
        {/* ENCABEZADO */}
        <div style={{ marginBottom: '8px' }}>
          {/* MERCADERIA */}
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', margin: '4px 0', color: '#61605c' }}>
              Código:<strong>{` ${props.mercaSelecci.codigo} `}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', margin: '4px 0', color: '#61605c' }}>
              Descripción:<strong> {` ${props.mercaSelecci.descripcion}`}</strong>
            </div>
            <div class={'linea_1_1111'}>
              <div style={{ color: '#61605c' }}>
                Linea/Tipo:<strong> {` ${props.mercaSelecci.lineaTipo}`}</strong>
              </div>
              <div style={{ color: '#61605c' }}>
                Marca:<strong>{` ${props.mercaSelecci.marca}`}</strong>
              </div>
              <div style={{ color: '#61605c' }}>
                Unidad:<strong> {` ${props.mercaSelecci.unidad}`}</strong>
              </div>

              <div style={{ color: '#61605c' }}>
                % Utilidad:<strong> {` ${props.mercaSelecci.porcentajeUtilidad.$numberDecimal + ' %'}`}</strong>
              </div>
            </div>
            {/* <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', margin: '4px 0', color: '#61605c' }}>
              Linea/Tipo:<strong> {` ${props.mercaSelecci.lineaTipo}`}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', margin: '4px 0', color: '#61605c' }}>
              Marca:<strong>{` ${props.mercaSelecci.marca}`}</strong>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', margin: '4px 0', color: '#61605c' }}>
              Unidad:<strong> {` ${props.mercaSelecci.unidad}`}</strong>
            </div>
             <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', margin: '4px 0', color: '#61605c' }}>
              Ubigeo:<strong> {` ${props.mercaSelecci.ubigeo}`}</strong>
            </div> 
            <div style={{ display: 'grid', gridTemplateColumns: '84px 1fr', margin: '4px 0', color: '#61605c' }}>
              % Utilidad:<strong> {` ${props.mercaSelecci.porcentajeUtilidad.$numberDecimal + ' %'}`}</strong>
            </div> */}
          </div>
        </div>
        {/*  tabla KARDEXS  */}
        <Resource
          value={losMovimientos}
          onPending={() => {
            //console.log('onPending 🍉🍉🍉🍉');
            return <div>Cargando...</div>;
          }}
          onRejected={() => {
            //console.log('onRejected 🍍🍍🍍🍍');
            return <div>Fallo en la carga de datos</div>;
          }}
          onResolved={(kardexs) => {
            //console.log('onResolved 🍓🍓🍓🍓', kardexs);
            const { data } = kardexs; //{ status, data, message }
            console.log('data 🍓🍓🍓🍓🎇🎇🎇', data);

            const misMovimientos: IMovimientoKARDEX[] = data;
            return (
              <>
                {misMovimientos.length > 0 ? (
                  <>
                    {/* <table style={{ fontSize: '0.8em', fontWeight: 'lighter ' }}> */}
                    <table style={{ fontSize: '0.9em', fontWeight: 'lighter ' }}>
                      <thead>
                        <tr>
                          <th>FISMA</th>
                          <th>Motivo</th>
                          <th>UBI</th>
                          <th>Cnt.Entrada</th>
                          <th>Cnt.Salida</th>
                          <th>Cnt.Saldo</th>
                          <th>Uni</th>
                          <th>Cts.Unita.PEN</th>
                          <th>Cts.Uni.Movil PEN</th>
                          <th>Costo Entrada PEN</th>
                          <th>Costo Salida PEN</th>
                          <th>Costo Saldo PEN</th>
                          <th>Acc</th>
                        </tr>
                      </thead>
                      <tbody>
                        {misMovimientos.map((movimiento) => {
                          const {
                            _id,
                            clave,
                            tabla,
                            IS,
                            motivoIS,
                            FISMA,

                            ubigeo,
                            // fechaHoraMovimiento,

                            cantidadIngresada,
                            cantidadSacada,
                            cantidadSaldo,
                            costoUnitario,
                            costoUnitarioMovil,
                            costoIngreso,
                            costoSalida,
                            costoSaldo,
                            cantidadOrigenEquivalencia,
                            unidadEquivalencia,
                          } = movimiento;

                          return (
                            <tr key={_id} style={IS ? { fontSize: '0.8em', color: 'blue' } : { fontSize: '0.8em', color: 'red' }}>
                              <td data-label="FISMA">{formatoDDMMYYYY_PEN(FISMA)}</td>
                              <td data-label="Motivo">{motivoIS ? motivoIS.substring(0, 9) : '-'}</td>
                              <td data-label="UBI">{ubigeo ? ubigeo : '-'}</td>
                              <td
                                data-label="Cnt.Entrada"
                                title={IS ? (cantidadOrigenEquivalencia ? cantidadOrigenEquivalencia.$numberDecimal + ' ' + unidadEquivalencia : '') : ''}
                                class="comoNumeroLeft"
                              >
                                {cantidadIngresada.$numberDecimal
                                  ? formatear_4Decimales(cantidadIngresada.$numberDecimal)
                                  : formatear_4Decimales(cantidadIngresada)}
                              </td>
                              <td
                                data-label="Cnt.Salida"
                                title={IS ? '' : cantidadOrigenEquivalencia ? cantidadOrigenEquivalencia.$numberDecimal + ' ' + unidadEquivalencia : ''}
                                class="comoNumeroLeft"
                              >
                                {cantidadSacada.$numberDecimal ? formatear_4Decimales(cantidadSacada.$numberDecimal) : formatear_4Decimales(cantidadSacada)}
                              </td>
                              <td data-label="Cnt.Saldo" class="comoNumeroLeft">
                                {cantidadSaldo.$numberDecimal ? formatear_4Decimales(cantidadSaldo.$numberDecimal) : formatear_4Decimales(cantidadSaldo)}
                              </td>
                              <td data-label="Uni">{props.mercaSelecci.unidad}</td>
                              <td data-label="Cts.Unita." class="comoNumeroLeft">
                                {costoUnitario.$numberDecimal ? costoUnitario.$numberDecimal : costoUnitario}
                              </td>
                              <td data-label="Cts.Unita.Movil" class="comoNumeroLeft">
                                {costoUnitarioMovil.$numberDecimal ? costoUnitarioMovil.$numberDecimal : costoUnitarioMovil}
                              </td>
                              <td data-label="Costo Entrada" class="comoNumeroLeft">
                                {costoIngreso.$numberDecimal ? formatear_6Decimales(costoIngreso.$numberDecimal) : formatear_6Decimales(costoIngreso)}
                              </td>
                              <td data-label="Costo Salida" class="comoNumeroLeft">
                                {costoSalida.$numberDecimal ? formatear_6Decimales(costoSalida.$numberDecimal) : formatear_6Decimales(costoSalida)}
                              </td>
                              <td data-label="Costo Saldo" class="comoNumeroLeft">
                                {costoSaldo.$numberDecimal ? formatear_6Decimales(costoSaldo.$numberDecimal) : formatear_6Decimales(costoSaldo)}
                              </td>

                              <td data-label="Acc" class="accionesLeft">
                                <input
                                  type="image"
                                  src={images.see}
                                  // disabled
                                  alt="icono de ver"
                                  height={12}
                                  width={12}
                                  title="Ver movimiento"
                                  onClick$={async () => {
                                    console.log('tabla, clave ', tabla, clave);
                                    if (tabla === 'registroingresosaalmacenes') {
                                      //
                                      const elIN = await getIngresoAAlmacen({ idIngresoAAlmacen: clave });
                                      console.log('elIN.data[0]', elIN.data[0]);
                                      console.log('props.mercaSelecci.codigo', props.mercaSelecci.codigo);
                                      console.log('💥💥💥💥💥💨💨💨💨💥💥💥💥💥💥');
                                      definicion_CTX_KARDEX.iNS = elIN.data[0];
                                      definicion_CTX_KARDEX.codigoMercaderia = props.mercaSelecci.codigo;
                                      definicion_CTX_KARDEX.mostrarPanelVerInAlmacen = true;
                                    }
                                    if (tabla === 'registrosalidasdealmacenes') {
                                      //
                                      const elOUT = await getEgresoDeAlmacen({ idEgresoDeAlmacen: clave });
                                      console.log('elOUT.data[0]', elOUT.data[0]);
                                      console.log('props.mercaSelecci.codigo', props.mercaSelecci.codigo);
                                      console.log('💨💨💨💨💥💥💥💥💥💨💨💨💨💨');
                                      definicion_CTX_KARDEX.iNS = elOUT.data[0];
                                      definicion_CTX_KARDEX.codigoMercaderia = props.mercaSelecci.codigo;
                                      definicion_CTX_KARDEX.mostrarPanelVerOutAlmacen = true;
                                    }
                                  }}
                                />
                              </td>
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
