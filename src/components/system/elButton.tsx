import { component$ } from '@builder.io/qwik';

interface IElBottun {
  id?: string;
  name: string;
  hint?: string;
  style?: any;
  disabled?: boolean;
  title: string;
  onClick?: any;
  onFocus?: any;
  class?: any;
  // estilos?: any;
}

// const mostarHint = $((ht: string) => {
//   //   const tH = props.hint;
// });

export default component$((props: IElBottun) => {
  // const stateVisi = useSignal<string>('hidden');
  // const stateOpaci = useSignal<string>('0');

  //   const mostarHint = () => {
  //     if (props.hint) {
  //       return (
  //         <span
  //           style={{
  //             // visibility: stateVisi,
  //             // opacity: stateOpaci,
  //             width: '130px',
  //             background: '#555',
  //             color: '#fff',
  //             borderRadius: '6px',
  //             padding: '5px 0',
  //             position: 'absolute',
  //             zIndex: '1',
  //             top: '165%',
  //             left: '50%',
  //             marginLeft: '-60px',
  //             transition: 'opacity 0.3s',
  //           }}
  //         ></span>
  //       );
  //     } else {
  //     }
  //   };
  return (
    <button
      id={props.id}
      class={props.class}
      style={props.style}
      disabled={props.disabled}
      title={props.title || ''}
      onClick$={props.onClick}
      onMouseEnter$={() => {}}
      onMouseLeave$={() => {}}
    >
      {props.name}
      {/* {mostarHint()} */}
    </button>
  );
});
