import { component$ } from '@builder.io/qwik';

interface ISelect {
  id?: string;
  // elValor?: string;
  registros: any[];
  registroID: string;
  registroTEXT: string;
  desabilitado?: boolean;
  onChange?: any;
  onFocus?: any;
  seleccione?: string;
  valorSeleccionado?: string;
}

export default component$((props: ISelect) => {
  const ID = props.registroID;
  const TEXT = props.registroTEXT;
  const SELECCION = props.seleccione ? props.seleccione : '-- Seleccione una opción --';
  return (
    <select
      // value={props.elValor ? props.elValor : ''}
      id={props.id}
      //  ref={elSelect} !== null
      //   disabled={props.desabilitado}
      //   style={{ width: '100%' }}
      onChange$={props.onChange}
      //   onFocus$={onFocus}
    >
      <option value="">{SELECCION}</option>
      {props.registros.map((registro) => {
        return (
          <option
            key={registro[ID]}
            id={registro[ID]}
            value={registro[TEXT]}
            selected={props.valorSeleccionado === registro[TEXT]}
          >
            {registro[TEXT]}
          </option>
        );
      })}
    </select>
  );
});
