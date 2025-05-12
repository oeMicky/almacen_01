import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_NEW_OUT_ALMACEN } from './newOutAlmacen';

export default component$((props: { otrosAlmacenes: any }) => {
  //#region CONTEXTOS
  const ctx_new_out_almacen = useContext(CTX_NEW_OUT_ALMACEN);
  //#endregion CONTEXTOS
  return (
    <div
      style={{
        width: 'clamp(280px, 100%, 320px)',
        // width: 'auto',
        // border: '1px solid red',
        padding: '2px',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_new_out_almacen.mostrarPanelListaOtrosAlmacenesOUT = false;
          })}
        />
      </div>
      {/* TITULO */}
      <h3 style={{ marginBottom: '10px', fontSize: '0.9rem', color: 'grey' }}>Sucursales</h3>
      {/* FORMULARIO */}
      <div class="add-form">
        <table style={{ fontSize: '0.8rem', fontWeight: 'lighter ' }}>
          <thead>
            <tr>
              <th>Sucursal</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {props.otrosAlmacenes.map((almaLoca: any) => {
              const { idAlmacen, sucursal, idSerieNotaIngreso, serieNotaIngreso, idMotivoIngreso, motivoIngreso } = almaLoca;
              return (
                <tr key={idAlmacen}>
                  <td data-label="Sucursal">{sucursal}</td>
                  <td data-label="Acciones" class="accionesLeft">
                    <input
                      // id="in_BuscarDetraccion"
                      title="Seleccionar"
                      type="image"
                      src={images.check32}
                      alt="icono buscar"
                      height={12}
                      width={12}
                      style={{ marginRight: '6px' }}
                      //   onFocusin$={() => //console.log('☪☪☪☪☪☪')}
                      onClick$={() => {
                        if (typeof almaLoca.idSerieNotaIngreso === 'undefined' || almaLoca.idSerieNotaIngreso === '') {
                          alert('No existe la serie de ingreso para el almacén destino. Consulte con el administrador.');
                          return;
                        }
                        if (typeof almaLoca.idMotivoIngreso === 'undefined' || almaLoca.idMotivoIngreso === '') {
                          alert('No existe el motivo de ingreso para el almacén destino. Consulte con el administrador.');
                          return;
                        }

                        ctx_new_out_almacen.idSucursalDestino = idAlmacen;
                        ctx_new_out_almacen.sucursalDestino = sucursal;
                        ctx_new_out_almacen.idSerieNotaIngresoDestino = idSerieNotaIngreso;
                        ctx_new_out_almacen.serieNotaIngresoDestino = serieNotaIngreso;
                        ctx_new_out_almacen.idMotivoIngresoDestino = idMotivoIngreso;
                        ctx_new_out_almacen.motivoIngresoDestino = motivoIngreso;
                        ctx_new_out_almacen.mostrarPanelListaOtrosAlmacenesOUT = false;
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});
