import { component$ } from '@builder.io/qwik';

interface Portafolio2024 {
  imagen: string;
  titulo: string;
  parrafo: string;
}
//, border: 'rgb(3, 243, 255) 1px dashed'
export default component$((props: Portafolio2024) => {
  return (
    <>
      <div style={{ margin: '16px 16px', padding: '40px', background: 'rgb(244, 244, 244) ', borderRadius: '8px' }}>
        <img loading="lazy" src={props.imagen} alt="portafolio" height={40} width={40} />
        <h3>{props.titulo}</h3>
        <p style={{ fontSize: 'small' }}>{props.parrafo}</p>
      </div>
    </>
  );
});
