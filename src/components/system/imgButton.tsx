import { component$, useSignal } from '@builder.io/qwik';

interface IImgButton {
  id?: string;
  src: string;
  alt: string;
  height: number;
  width: number;
  title: string;
  hidden?: boolean;
  onClick?: any;
  onKeyUp?: any;
  onFocusin?: any;
  onFocus?: any;
}

export default component$((props: IImgButton) => {
  // const clikeado = useSignal(false);
  // //console.log('🎈🎈🎈🎈🎈🎈clikeado');
  const enfocado = useSignal(false);
  return (
    <img
      id={props.id}
      src={props.src}
      alt={props.alt}
      height={props.height}
      width={props.width}
      title={props.title}
      hidden={props.hidden}
      style={
        enfocado.value
          ? {
              marginLeft: '4px',
              marginRight: '4px',
              marginTop: '1px',
              cursor: 'pointer',
              borderRadius: '4px',
              // borderRadius: '50%',
              // padding: '2px 2px',
              // filter: 'invert(1)',
              // border: ' 1px solid red',
              // backgroundColor: 'gold',
              backgroundColor: '#CCCCCC',
            }
          : {
              marginLeft: '4px',
              marginRight: '4px',
              marginTop: '1px',
              cursor: 'pointer',
              borderRadius: '4px',
              // borderRadius: '50%',
              // padding: '2px 2px',
              // filter: 'invert(1)',
              // border: ' 1px solid red',
              // backgroundColor: 'gold',
              // backgroundColor: '#CCCCCC',
            }
      }
      onClick$={props.onClick}
      onKeyUp$={props.onKeyUp}
      onMouseEnter$={() => (enfocado.value = true)}
      onMouseLeave$={() => (enfocado.value = false)}
      // onFocusin$={props.onFocusin}
      // onFocus$={() => alert('ojo')}
      // onFocusin$={() => (enfocado.value = true)}
      // onFocusout$$={() => (enfocado.value = false)}
      // window:onFocusin$={() => (enfocado.value = true)}
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
