import { component$ } from '@builder.io/qwik';

export default component$((props: { elId: string; tipoImpuesto: any; onChange: any; onKeyPress: any }) => {
  return (
    <select
      title="Tipo de impuesto"
      id={props.elId}
      style={{ cursor: 'pointer' }}
      onChange$={props.onChange}
      onKeyPress$={props.onKeyPress}
      // onChange$={(e) => {
      //   props.tipoImpuesto = (e.target as HTMLSelectElement).value;
      // }}
    >
      {/* <option value="1000 IGV VAT" selected={props.tipoImpuesto === '1000 IGV VAT'}>
        IGV
      </option>
      <option value="1016 IVAP VAT" selected={props.tipoImpuesto === '1016 IVAP VAT'}>
        IVAP
      </option>
      <option value="2000 ISC EXC" selected={props.tipoImpuesto === '2000 ISC EXC'}>
        ISC
      </option>
      <option value="7152 ICBPER OTH" selected={props.tipoImpuesto === '7152 ICBPER OTH'}>
        ICBPER
      </option>
      <option value="9995 EXP FRE" selected={props.tipoImpuesto === '9995 EXP FRE'}>
        exportación
      </option>
      <option value="9996 GRA FRE" selected={props.tipoImpuesto === '9996 GRA FRE'}>
        gratuitas
      </option>
      <option value="9997 EXO VAT" selected={props.tipoImpuesto === '9997 EXO VAT'}>
        exoneradas
      </option>
      <option value="9998 INA FRE" selected={props.tipoImpuesto === '9998 INA FRE'}>
        inafecta
      </option>
      <option value="9999 OTROS OTH" selected={props.tipoImpuesto === '9999 OTROS OTH'}>
        otrosTributos
      </option> */}
      <option value="1000 IGV VAT" selected={props.tipoImpuesto[1] === 'IGV'}>
        IGV
      </option>
      <option value="1016 IVAP VAT" selected={props.tipoImpuesto[1] === 'IVAP'}>
        IVAP
      </option>
      <option value="2000 ISC EXC" selected={props.tipoImpuesto[1] === 'ISC'}>
        ISC
      </option>
      <option value="7152 ICBPER OTH" selected={props.tipoImpuesto[1] === 'ICBPER'}>
        ICBPER
      </option>
      <option value="9995 EXP FRE" selected={props.tipoImpuesto[1] === 'EXP'}>
        exportación
      </option>
      <option value="9996 GRA FRE" selected={props.tipoImpuesto[1] === 'GRA'}>
        gratuitas
      </option>
      <option value="9997 EXO VAT" selected={props.tipoImpuesto[1] === 'EXO'}>
        exoneradas
      </option>
      <option value="9998 INA FRE" selected={props.tipoImpuesto[1] === 'INA'}>
        inafecta
      </option>
      <option value="9999 OTROS OTH" selected={props.tipoImpuesto[1] === 'OTROS'}>
        otrosTributos
      </option>
    </select>
  );
});
