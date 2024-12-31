import { component$, useStyles$ } from '@builder.io/qwik';
import style from '../../global.css?inline';

interface servicio2024 {
  cursorMano: boolean;
  imagen: string;
  imagenDisable: string;
  titulo: string;
  parrafo: string;
  onClick?: any;
}
//, border: 'rgb(3, 243, 255) 1px dashed'
export default component$((props: servicio2024) => {
  useStyles$(style);

  return (
    <>
      <div
        class="servicio2024"
        hidden={!props.cursorMano}
        style={
          props.cursorMano
            ? {
                margin: '16px 16px',
                padding: '40px',
                // background: 'rgb(244, 244, 244) ',
                borderRadius: '8px',
                cursor: 'pointer',
                // background: '#e7e7e7',
                // background: '#a7a7e7',
              }
            : {
                margin: '16px 16px',
                padding: '40px',
                // background: 'rgb(244, 244, 244) ',
                borderRadius: '8px',
              }
        }
        onClick$={props.cursorMano ? (typeof props.onClick !== 'undefined' ? props.onClick : '') : ''}
      >
        <img src={props.cursorMano ? props.imagen : props.imagenDisable} alt="servicio" height={40} width={40} />
        <h3 style={props.cursorMano ? {} : { color: '#b5b5b6' }}>{props.titulo}</h3>
        <p style={props.cursorMano ? { fontSize: 'small' } : { fontSize: 'small', color: '#b5b5b6' }}>{props.parrafo}</p>
      </div>
    </>
  );
});
