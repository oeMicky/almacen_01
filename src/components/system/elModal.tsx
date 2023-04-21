import { component$ } from '@builder.io/qwik';

// export default component$(() => {
//   return <div class="modal">papepipopu</div>;
export default component$((props: { componente: any }) => {
  return <div class="modal">{props.componente}</div>;
});
