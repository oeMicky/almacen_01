import { component$ } from '@builder.io/qwik';

interface ISelect {
  id?: string;
  elValor?: string;
  registros: any[];
  registroID: string;
  registroTEXT: string;
  desabilitado?: boolean;
  onChange?: any;
  onFocus?: any;
}

export default component$((props: ISelect) => {
  const ID = props.registroID;
  const TEXT = props.registroTEXT;
  return (
    <select
      //   value={props.elValor !== null ? props.elValor : ''}
      id={props.id}
      //  ref={elSelect}
      //   disabled={props.desabilitado}
      //   style={{ width: '100%' }}
      //   onChange$={(e) => onCambio(e)}
      //   onFocus$={onFocus}
    >
      <option value="">-- Seleccione una opción --</option>
      {props.registros.map((registro) => {
        return (
          <option key={registro[ID]} id={registro[ID]} value={registro[TEXT]}>
            {registro[TEXT]}
          </option>
        );
      })}
    </select>
  );
});
