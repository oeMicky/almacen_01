import { component$, useStylesScoped$ } from '@builder.io/qwik';
import style from './portafolio.css?inline';

export interface PortafolioProps {
  imagen: string;
  titulo: string;
  subtitulo: string;
  parrafo: string;
}

export default component$((props: PortafolioProps) => {
  // const { imagen, titulo, subtitulo, parrafo }=props;
  useStylesScoped$(style);
  return (
    <>
      <div
        class="portafolio"
        // style={{
        //   maxWidth: '800px',
        //   display: 'grid',
        //   gridTemplateColumns: '2fr 1fr',
        //   border: '1px solid #999999',
        //   borderRadius: '10px',
        //   margin: '20px 0',
        //   alignSelf: 'center',
        //   color: '#7e7e7e',
        // }}
      >
        <div class="reseña-portafolio">
          {props.titulo}
          <br style={{ marginBottom: '20px' }} />
          {props.subtitulo}
          <br style={{ marginBottom: '20px' }} />
          <p style={{ fontSize: '0.8rem' }}>{props.parrafo}</p>
        </div>
        <img src={props.imagen} class="imagen-portafolio" />
      </div>
    </>
  );
});
