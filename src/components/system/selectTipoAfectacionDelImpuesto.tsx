import { component$ } from '@builder.io/qwik';

export default component$((props: { elId: string; tipoAfectacionDelImpuesto: string; onChange: any; onKeyPress: any }) => {
  return (
    <select
      title="Tipo de afectación del impuesto (10, 11, ..., 40)"
      id={props.elId}
      style={{ cursor: 'pointer' }}
      onChange$={props.onChange}
      onKeyPress$={props.onKeyPress}
      // onChange$={(e) => {
      //   props.tipoAfectacionDelImpuesto = (e.target as HTMLSelectElement).value;
      // }}
    >
      <option value="10" selected={props.tipoAfectacionDelImpuesto === '10'}>
        Gravado - Operación Onerosa
      </option>
      <option value="11" selected={props.tipoAfectacionDelImpuesto === '11'}>
        Gravado - Retiro por premio
      </option>
      <option value="12" selected={props.tipoAfectacionDelImpuesto === '12'}>
        Gravado - Retiro por donación
      </option>
      <option value="13" selected={props.tipoAfectacionDelImpuesto === '13'}>
        Gravado - Retiro
      </option>
      <option value="14" selected={props.tipoAfectacionDelImpuesto === '14'}>
        Gravado - Retiro por publicidad
      </option>
      <option value="15" selected={props.tipoAfectacionDelImpuesto === '15'}>
        Gravado - Bonificaciones
      </option>
      <option value="16" selected={props.tipoAfectacionDelImpuesto === '16'}>
        Gravado - Retiro por entrega a trabajadores
      </option>
      <option value="17" selected={props.tipoAfectacionDelImpuesto === '17'}>
        Gravado - IVAP
      </option>
      <option value="20" selected={props.tipoAfectacionDelImpuesto === '20'}>
        Exonerado - Operación Onerosa
      </option>
      <option value="21" selected={props.tipoAfectacionDelImpuesto === '21'}>
        Exonerado - Transferencia gratuita
      </option>
      <option value="30" selected={props.tipoAfectacionDelImpuesto === '30'}>
        Inafecto - Operación Onerosa
      </option>
      <option value="31" selected={props.tipoAfectacionDelImpuesto === '31'}>
        Inafecto - Retiro por Bonificación
      </option>
      <option value="32" selected={props.tipoAfectacionDelImpuesto === '32'}>
        Inafecto - Retiro
      </option>
      <option value="33" selected={props.tipoAfectacionDelImpuesto === '33'}>
        Inafecto - Retiro por Muestras Médicas
      </option>
      <option value="34" selected={props.tipoAfectacionDelImpuesto === '34'}>
        Inafecto - Retiro por Convenio Colectivo
      </option>
      <option value="35" selected={props.tipoAfectacionDelImpuesto === '35'}>
        Inafecto - Retiro por premio
      </option>
      <option value="36" selected={props.tipoAfectacionDelImpuesto === '36'}>
        Inafecto - Retiro por publicidad
      </option>
      <option value="37" selected={props.tipoAfectacionDelImpuesto === '37'}>
        Inafecto - Transferencia gratuita
      </option>
      <option value="40" selected={props.tipoAfectacionDelImpuesto === '40'}>
        Exportación de Bienes o Servicios
      </option>
    </select>
  );
});
