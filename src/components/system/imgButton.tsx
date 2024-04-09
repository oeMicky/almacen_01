import { component$ } from '@builder.io/qwik';

interface IImgButton {
  id?: string;
  src: string;
  alt: string;
  height: number;
  width: number;
  title: string;
  hidden?: boolean;
  onClick?: any;
  onFocusin?: any;
  onFocus?: any;
}

export default component$((props: IImgButton) => {
  // const clikeado = useSignal(false);
  // console.log('🎈🎈🎈🎈🎈🎈clikeado');
  return (
    <img
      id={props.id}
      src={props.src}
      alt={props.alt}
      height={props.height}
      width={props.width}
      title={props.title}
      hidden={props.hidden}
      style={{
        marginLeft: '4px',
        marginRight: '4px',
        marginTop: '1px',
        cursor: 'pointer',
        // borderRadius: '50%',
        // padding: '2px 2px',
        // filter: 'invert(1)',
        // border: ' 1px solid red',
      }}
      onClick$={props.onClick}
      onFocusin$={props.onFocusin}
      onFocus$={props.onFocus}
    />
    // <img
    //   style={{
    //     // conFondoOscuro
    //     //   ? {
    //     //       marginLeft: '4px',
    //     //       marginRight: '4px',
    //     //       marginTop: '1px',
    //     //       cursor: 'pointer',
    //     //       background: '#c9c9c9',
    //     //       borderRadius: '50%',
    //     //       padding: '2px 2px',
    //     //     }
    //     //   : {
    //     marginLeft: '4px',
    //     marginRight: '4px',
    //     marginTop: '1px',
    //     cursor: 'pointer',
    //     // borderRadius: '50%',
    //     padding: '2px 2px',
    //   }}
    //   id={props.id}
    //   src={props.src}
    //   alt={props.alt}
    //   height={props.height}
    //   width={props.width}
    //   title={props.title}
    //   onClick={props.onClick}
    //   hidden={props.hidden}
    //   //   onMouseEnter={() => {
    //   //     setConFondoOscuro(true);
    //   //   }}
    //   //   onMouseLeave={() => {
    //   //     setConFondoOscuro(false);
    //   //   }}
    // />

    // </img>
  );
});
