import { component$ } from '@builder.io/qwik';

interface ISelect {
  id?: string;
  // elValor?: string;
  registros: any[];
  registroID: string;
  registroTEXT: string;
  disabled?: boolean;
  estilos?: any;
  onChange?: any;
  onKeyPress?: any;
  onFocus?: any;
  seleccione?: string;
  valorSeleccionado?: any; // --> puede sert striong o number  //
  textoAdicional?: string;
}

export default component$((props: ISelect) => {
  const ID = props.registroID;
  const TEXT = props.registroTEXT;
  const SELECCION = props.seleccione ? props.seleccione : '-- Seleccione una opción --';
  const TEXT_ADICIONAL = props.textoAdicional ? props.textoAdicional : '';
  return (
    <select
      // value={props.elValor ? props.elValor : ''}
      id={props.id}
      //  ref={elSelect} !== null
      disabled={props.disabled}
      style={props.estilos} //border: '1px red solid'
      // style={ {width: '100%' }}
      onChange$={props.onChange}
      onKeyPress$={props.onKeyPress}
      //   onFocus$={onFocus}  .toString()
    >
      <option value="">{SELECCION}</option>
      {props.registros.map((registro) => {
        return (
          <option
            key={registro[ID]}
            id={registro[ID]}
            value={registro[TEXT]}
            selected={props.valorSeleccionado === registro[TEXT]} //asegurar comparar String = String // number=number
          >
            {registro[TEXT] + TEXT_ADICIONAL}
          </option>
        );
      })}
    </select>
  );
});
