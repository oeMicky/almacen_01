import { component$ } from '@builder.io/qwik';

export interface AsociadoProps {
  imagen: string;
  ancho: string;
}

export default component$((props: AsociadoProps) => {
  // export default component$((imagen: string, ancho: string) => {
  return (
    <>
      <center>
        <img src={props.imagen} width={props.ancho} style={{ margin: '20px' }} />
        {/* <img src={imagen} width={ancho} /> */}
      </center>
    </>
  );
});
