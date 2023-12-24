import { $, Resource, component$, useContext, useResource$, useStylesScoped$ } from '@builder.io/qwik';
import { images } from '~/assets';
import ImgButton from '~/components/system/imgButton';
import { IMercaderiaIN } from '~/interfaces/iMercaderia';
import style from '../../tabla/tabla.css?inline';
import { CTX_BUSCAR_MERCADERIA_IN } from './buscarMercaderiaIN';

export default component$(
  (props: { buscarMercaderiasIN: number; parametrosBusqueda: any; contexto: string; esAlmacen: boolean }) => {
    useStylesScoped$(style);

    //#region CONTEXTOS
    const ctx_buscar_mercaderia_in = useContext(CTX_BUSCAR_MERCADERIA_IN);
    //#endregion CONTEXTOS

    //#region BUSCANDO REGISTROS
    const lasMercaderiasIN = useResource$<{ status: number; data: any; message: string }>(async ({ track, cleanup }) => {
      track(() => props.buscarMercaderiasIN.valueOf());

      const abortController = new AbortController();
      cleanup(() => abortController.abort('cleanup'));

      console.log('parametrosBusqueda', props.parametrosBusqueda);

      const res = await fetch(import.meta.env.VITE_URL + '/api/mercaderia/buscarMercaderiasPorDescripcion', {
        // const res = await fetch('https://backendalmacen-production.up.railway.app/api/servicio/getServiciosPorDescripcion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(props.parametrosBusqueda),
        signal: abortController.signal,
      });
      return res.json();
    });
    //#endregion BUSCANDO REGISTROS

    return (
      <Resource
        value={lasMercaderiasIN}
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
          const misMercaderiasIN: IMercaderiaIN[] = data;
          return (
            <>
              {misMercaderiasIN.length > 0 ? (
                <>
                  <table style={{ fontSize: '0.7em', fontWeight: 'lighter ' }}>
                    <thead>
                      <tr>
                        <th>Descripción</th>
                        <th>Linea/Tipo</th>
                        <th>Marca</th>
                        <th>Stock</th>
                        <th>Uni</th>
                        {props.esAlmacen ? <th>Costo Promd. Uni PEN</th> : <th>Precio Uni PEN</th>}
                        <th>Kx</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {misMercaderiasIN.map((mercaINLocali) => {
                        const {
                          _id,
                          descripcion,
                          lineaTipo,
                          marca,
                          totalCantidadSaldo,
                          unidad,
                          precioPEN,
                          promedioCostoUnitarioMovil,
                          KARDEXS,
                        } = mercaINLocali;

                        return (
                          <tr
                            key={_id}
                            style={
                              (totalCantidadSaldo.$numberDecimal
                                ? parseFloat(totalCantidadSaldo.$numberDecimal)
                                : totalCantidadSaldo) === 0
                                ? { color: 'red' }
                                : { color: '' }
                            }
                          >
                            <td data-label="Descripción">{descripcion}</td>
                            <td data-label="Linea/Tipo">{lineaTipo}</td>
                            <td data-label="Marca">{marca}</td>
                            <td data-label="Stock">
                              {totalCantidadSaldo.$numberDecimal ? totalCantidadSaldo.$numberDecimal : totalCantidadSaldo}
                            </td>
                            <td data-label="Uni">{unidad}</td>
                            {props.esAlmacen ? (
                              <td data-label="Promd.Costo PEN">
                                {typeof promedioCostoUnitarioMovil !== 'undefined' && promedioCostoUnitarioMovil !== null
                                  ? promedioCostoUnitarioMovil.$numberDecimal
                                    ? promedioCostoUnitarioMovil.$numberDecimal
                                    : promedioCostoUnitarioMovil
                                  : '_'}
                              </td>
                            ) : (
                              <td data-label="Precio PEN">
                                {typeof precioPEN !== 'undefined' && precioPEN !== null
                                  ? precioPEN.$numberDecimal
                                    ? precioPEN.$numberDecimal
                                    : precioPEN
                                  : '_'}
                              </td>
                            )}
                            <td data-label="Kx" style={{ textAlign: 'center' }}>
                              {KARDEXS.length === 0 ? 'No' : 'Si'}
                            </td>
                            <td data-label="Acciones" style={{ textAlign: 'right' }}>
                              <ImgButton
                                src={images.check}
                                alt="icono de seleccionar"
                                height={12}
                                width={12}
                                title="Seleccionar mercadería"
                                onClick={$(() => {
                                  console.log('mercaINLocali', mercaINLocali);
                                  if (mercaINLocali.KARDEXS.length === 0) {
                                    ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                    ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
                                    console.log('la mercaSeleccionada IN - length', mercaINLocali.KARDEXS.length);
                                  }
                                  if (mercaINLocali.KARDEXS.length === 1) {
                                    ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                    ctx_buscar_mercaderia_in.kK = mercaINLocali.KARDEXS[0];
                                    ctx_buscar_mercaderia_in.mostrarPanelMercaderiaINSeleccionada = true;
                                    console.log('la mercaSeleccionada IN DIRECTA', ctx_buscar_mercaderia_in.mM);
                                  }
                                  if (mercaINLocali.KARDEXS.length > 1) {
                                    ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                    ctx_buscar_mercaderia_in.mostrarPanelKardexsIN = true;
                                    console.log('la mercaSeleccionada IN INDIRECTA', ctx_buscar_mercaderia_in.mM);
                                  }
                                })}
                              />
                              <ImgButton
                                src={images.edit}
                                alt="icono de editar"
                                height={14}
                                width={14}
                                title="Editar mercadería"
                                onClick={$(() => {
                                  ctx_buscar_mercaderia_in.mM = mercaINLocali;
                                  ctx_buscar_mercaderia_in.mostrarPanelNewEditMercaderiaIN = true;
                                  console.log('la merca A Editar IN', ctx_buscar_mercaderia_in.mM);
                                })}
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
    );
  }
);
