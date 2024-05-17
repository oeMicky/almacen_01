import { component$, useStylesScoped$ } from '@builder.io/qwik';
import style from './asociado.css?inline';

export interface AsociadoProps {
  imagen: string;
  ancho: string;
}

export default component$((props: AsociadoProps) => {
  useStylesScoped$(style);
  // export default component$((imagen: string, ancho: string) => {
  // style={{ border: 'rgb(255, 142, 43) 1px solid' }}
  return (
    <>
      <center>
        <img loading="lazy" class="imagen-asociado" src={props.imagen} width={props.ancho} />
        {/* <img src={imagen} width={ancho} /> */}
      </center>
    </>
  );
});
