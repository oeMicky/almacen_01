import { $, component$, useContext } from '@builder.io/qwik';
import ImgButton from '../system/imgButton';
import { images } from '~/assets';
import { CTX_ADD_VENTA } from './addVenta';
import SelectTipoImpuesto from '../system/selectTipoImpuesto';
import SelectTipoAfectacionDelImpuesto from '../system/selectTipoAfectacionDelImpuesto';

export default component$((props: { editarImpuesto_ItemVenta: any }) => {
  //#region CONTEXTOS
  const ctx_add_venta = useContext(CTX_ADD_VENTA);
  //#endregion CONTEXTOS

  return (
    <div
      style={{
        width: 'clamp(330px, 86%, 336px)',
        // width: 'auto',
        // border: '1px solid red',
        padding: '2px',
        background: '#eee',
      }}
      class="container-modal"
    >
      {/* BOTONES DEL MARCO */}
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        {/* <Button name="T/C" onClick={tipoCambio} /> */}
        <ImgButton
          src={images.see}
          alt="Icono de ver"
          height={18}
          width={18}
          title="ver el formulario"
          onClick={$(() => {
            //console.log('props.editarImpuesto_ItemVenta', props.editarImpuesto_ItemVenta);
          })}
        />
        <ImgButton
          src={images.x}
          alt="Icono de cerrar"
          height={18}
          width={18}
          title="Cerrar el formulario"
          onClick={$(() => {
            ctx_add_venta.mostrarPanelEditarImpuesto = false;
          })}
        />
      </div>
      {/* FORMULARIO */}
      <div class="add-form">
        <div>
          {/* Descripcion  */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <strong>{props.editarImpuesto_ItemVenta.descripcion}</strong>
            </div>
          </div>
          {/* TIPO IMPUESTO */}
          <div class="form-control">
            <div class="form-control form-agrupado">
              <SelectTipoImpuesto
                elId="se_tipoImpuesto_MERCADERIA_IN"
                tipoImpuesto={props.editarImpuesto_ItemVenta.tipoImpuesto}
                onChange={$((e: any) => {
                  props.editarImpuesto_ItemVenta.tipoImpuesto = (e.target as HTMLSelectElement).value;
                })}
                onKeyPress={$((e: any) => {
                  if (e.key === 'Enter') {
                    document.getElementById('se_tipoAfectacionDelImpuesto_MERCADERIA_IN')?.focus();
                  }
                })}
              />
              {/* <select
                id="se_tipoImpuesto_MERCADERIA_IN"
                // style={{ width: '288px' }}
                onChange$={(e) => {
                  props.editarImpuesto_ItemVenta.tipoImpuesto = (e.target as HTMLSelectElement).value;
                }}
              >
                <option value="['1000', 'IGV', 'VAT']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['1000', 'IGV', 'VAT']"}>
                  IGV
                </option>
                <option value="['1016', 'IVAP', 'VAT']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['1016', 'IVAP', 'VAT']"}>
                  IVAP
                </option>
                <option value="['2000', 'ISC', 'EXC']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['2000', 'ISC', 'EXC']"}>
                  ISC
                </option>
                <option value="['7152', 'ICBPER', 'OTH']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['7152', 'ICBPER', 'OTH']"}>
                  ICBPER
                </option>
                <option value="['9995', 'EXP', 'FRE']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['9995', 'EXP', 'FRE']"}>
                  exportación
                </option>
                <option value="['9996', 'GRA', 'FRE']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['9996', 'GRA', 'FRE']"}>
                  gratuitas
                </option>
                <option value="['9997', 'EXO', 'VAT']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['9997', 'EXO', 'VAT']"}>
                  exoneradas
                </option>
                <option value="['9998', 'INA', 'FRE']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['9998', 'INA', 'FRE']"}>
                  inafecta
                </option>
                <option value="['9999', 'OTROS', 'OTH']" selected={props.editarImpuesto_ItemVenta.tipoImpuesto === "['9999', 'OTROS', 'OTH']"}>
                  otrosTributos
                </option>
              </select> */}
            </div>
          </div>
          {/* TIPO DE AFECTACION DEL IMPUESTO */}
          <div class="form-control">
            <div class="form-control  form-agrupado ">
              <SelectTipoAfectacionDelImpuesto
                elId="se_tipoAfectacionDelImpuesto_MERCADERIA_IN"
                tipoAfectacionDelImpuesto={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto}
                onChange={$((e: any) => {
                  props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto = (e.target as HTMLSelectElement).value;
                })}
                onKeyPress={$((e: any) => {
                  if (e.key === 'Enter') {
                    document.getElementById('btn_GrabarImpuesto_VENTA')?.focus();
                  }
                })}
              />
              {/* <select
                id="se_tipoAfectacionDelImpuesto_MERCADERIA_IN"
                // style={{ width: '288px' }}
                onChange$={(e) => {
                  props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto = (e.target as HTMLSelectElement).value;
                }}
              >
                <option value="10" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '10'}>
                  Gravado - Operación Onerosa
                </option>
                <option value="11" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '11'}>
                  Gravado - Retiro por premio
                </option>
                <option value="12" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '12'}>
                  Gravado - Retiro por donación
                </option>
                <option value="13" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '13'}>
                  Gravado - Retiro
                </option>
                <option value="14" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '14'}>
                  Gravado - Retiro por publicidad
                </option>
                <option value="15" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '15'}>
                  Gravado - Bonificaciones
                </option>
                <option value="16" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '16'}>
                  Gravado - Retiro por entrega a trabajadores
                </option>
                <option value="17" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '17'}>
                  Gravado - IVAP
                </option>
                <option value="20" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '20'}>
                  Exonerado - Operación Onerosa
                </option>
                <option value="21" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '21'}>
                  Exonerado - Transferencia gratuita
                </option>
                <option value="30" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '30'}>
                  Inafecto - Operación Onerosa
                </option>
                <option value="31" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '31'}>
                  Inafecto - Retiro por Bonificación
                </option>
                <option value="32" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '32'}>
                  Inafecto - Retiro
                </option>
                <option value="33" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '33'}>
                  Inafecto - Retiro por Muestras Médicas
                </option>
                <option value="34" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '34'}>
                  Inafecto - Retiro por Convenio Colectivo
                </option>
                <option value="35" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '35'}>
                  Inafecto - Retiro por premio
                </option>
                <option value="36" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '36'}>
                  Inafecto - Retiro por publicidad
                </option>
                <option value="37" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '37'}>
                  Inafecto - Transferencia gratuita
                </option>
                <option value="40" selected={props.editarImpuesto_ItemVenta.tipoAfectacionDelImpuesto === '40'}>
                  Exportación de Bienes o Servicios
                </option>
              </select> */}
            </div>
          </div>
          <br />
        </div>

        {/* <hr style={{ margin: '5px 0 5px 0' }} color={'#aaa'}></hr> */}

        {/* GRABAR */}
        <input
          id="btn_GrabarImpuesto_VENTA"
          type="button"
          value="Grabar"
          class="btn-centro"
          onClick$={() => {
            ctx_add_venta.grabo_EditarImpuesto = true;
            ctx_add_venta.mostrarPanelEditarImpuesto = false;
          }}
        />
      </div>
    </div>
  );
});
